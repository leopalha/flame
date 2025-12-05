const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/database');

class Order extends Model {
  // Calcular total do pedido
  calculateTotal() {
    return parseFloat(this.subtotal) + parseFloat(this.serviceFee) + parseFloat(this.taxes || 0);
  }

  // Verificar se pedido está atrasado (mais de 30 min)
  isDelayed() {
    if (this.status === 'delivered' || this.status === 'cancelled') return false;
    const now = new Date();
    const orderTime = new Date(this.createdAt);
    const diffMinutes = (now - orderTime) / (1000 * 60);
    return diffMinutes > 30;
  }

  // Calcular tempo de preparo
  getPreparationTime() {
    if (this.startedAt && this.finishedAt) {
      return Math.round((new Date(this.finishedAt) - new Date(this.startedAt)) / 60000); // em minutos
    }
    return null;
  }

  // Verificar se pode ser cancelado
  canBeCancelled() {
    return ['pending', 'confirmed'].includes(this.status);
  }

  // Obter próximo status válido
  getNextValidStatus() {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'on_way',
      on_way: 'delivered'
    };
    return statusFlow[this.status];
  }
}

Order.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tableId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tables', 
      key: 'id'
    }
  },
  status: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [[
        'pending',      // Pedido criado, aguardando pagamento
        'confirmed',    // Pagamento aprovado
        'preparing',    // Em preparo na cozinha
        'ready',        // Pronto para entrega
        'on_way',       // Atendente retirou da cozinha
        'delivered',    // Entregue na mesa
        'cancelled'     // Cancelado
      ]]
    }
  },
  paymentStatus: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'processing', 'completed', 'failed', 'refunded']]
    }
  },
  paymentMethod: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    allowNull: true,
    validate: {
      isIn: [['credit_card', 'debit_card', 'pix', 'apple_pay', 'cash']]
    }
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true // ID do pagamento no Stripe
  },
  subtotal: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  serviceFee: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    defaultValue: 0
  },
  taxes: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimatedTime: {
    type: DataTypes.INTEGER, // em minutos
    allowNull: true,
    defaultValue: 20
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true // quando iniciou o preparo
  },
  finishedAt: {
    type: DataTypes.DATE,
    allowNull: true // quando ficou pronto
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true // quando foi entregue
  },
  preparationTime: {
    type: DataTypes.INTEGER, // tempo real de preparo em minutos
    allowNull: true
  },
  attendantId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  kitchenUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users', 
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['tableId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['paymentStatus']
    },
    {
      fields: ['orderNumber'],
      unique: true
    },
    {
      fields: ['createdAt']
    }
  ],
  hooks: {
    beforeCreate: (order) => {
      // Calcular taxa de serviço (10%)
      const serviceFeePercentage = parseFloat(process.env.SERVICE_FEE_PERCENTAGE) || 10;
      order.serviceFee = (parseFloat(order.subtotal) * serviceFeePercentage / 100).toFixed(2);

      // Calcular total
      order.total = (parseFloat(order.subtotal) + parseFloat(order.serviceFee) + parseFloat(order.taxes || 0)).toFixed(2);
    },
    beforeUpdate: async (order) => {
      // Atualizar timestamps baseado no status
      if (order.changed('status')) {
        const now = new Date();

        switch (order.status) {
          case 'preparing':
            if (!order.startedAt) order.startedAt = now;
            break;
          case 'ready':
            if (!order.finishedAt) {
              order.finishedAt = now;
              // Calcular tempo de preparo
              if (order.startedAt) {
                order.preparationTime = Math.round((now - new Date(order.startedAt)) / 60000);
              }
            }
            break;
          case 'delivered':
            if (!order.deliveredAt) order.deliveredAt = now;
            order.isDelivered = true;
            break;
        }
      }
    },
    afterCreate: async (order) => {
      // Atualizar métricas CRM do usuário quando pedido é criado
      try {
        const User = require('./User');
        const user = await User.findByPk(order.userId);
        if (user) {
          user.totalOrders += 1;
          user.lastOrderDate = new Date();
          user.lastVisit = new Date();
          await user.save();
        }
      } catch (error) {
        console.error('Erro ao atualizar métricas CRM após criar pedido:', error);
      }
    },
    afterUpdate: async (order) => {
      // Atualizar totalSpent e adicionar cashback quando pedido é entregue/pago
      if (order.changed('status') && order.status === 'delivered' && order.paymentStatus === 'completed') {
        try {
          const User = require('./User');
          const user = await User.findByPk(order.userId);
          if (user) {
            const orderTotal = parseFloat(order.total);
            user.totalSpent = parseFloat(user.totalSpent) + orderTotal;

            // Adicionar cashback baseado no tier (% do valor)
            const tierBenefits = user.getTierBenefits();
            const cashbackEarned = (orderTotal * tierBenefits.cashbackRate / 100);
            await user.addCashback(
              cashbackEarned,
              order.id,
              `Cashback de ${tierBenefits.cashbackRate}% do pedido #${order.orderNumber}`
            );

            await user.save();
          }
        } catch (error) {
          console.error('Erro ao atualizar totalSpent e cashback:', error);
        }
      }
    }
  }
});

module.exports = Order;
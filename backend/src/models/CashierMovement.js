const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class CashierMovement extends Model {
  // Retorna descrição formatada da movimentação
  getDescription() {
    const amount = `R$ ${Math.abs(parseFloat(this.amount)).toFixed(2)}`;

    switch (this.type) {
      case 'sale':
        return `Venda em dinheiro - Pedido #${this.orderNumber || 'N/A'}`;
      case 'deposit':
        return `Suprimento: ${this.description || 'Entrada de dinheiro'}`;
      case 'withdrawal':
        return `Sangria: ${this.description || 'Retirada de dinheiro'}`;
      case 'opening':
        return `Abertura de caixa com ${amount}`;
      case 'closing':
        return `Fechamento de caixa - Total: ${amount}`;
      default:
        return this.description || `Movimentação de ${amount}`;
    }
  }

  // Retorna tipo formatado
  getTypeLabel() {
    const typeMap = {
      sale: 'Venda',
      deposit: 'Suprimento',
      withdrawal: 'Sangria',
      opening: 'Abertura',
      closing: 'Fechamento'
    };
    return typeMap[this.type] || this.type;
  }

  // Retorna se é entrada ou saída
  isIncome() {
    return ['sale', 'deposit', 'opening'].includes(this.type);
  }

  // Formata para exibição
  toSummary() {
    return {
      id: this.id,
      type: this.type,
      typeLabel: this.getTypeLabel(),
      description: this.getDescription(),
      amount: parseFloat(this.amount),
      isIncome: this.isIncome(),
      createdBy: this.createdByName,
      createdAt: this.createdAt,
      orderId: this.orderId,
      orderNumber: this.orderNumber
    };
  }
}

CashierMovement.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cashierId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'cashiers',
      key: 'id'
    },
    comment: 'ID do caixa ao qual pertence'
  },
  type: {
    type: DataTypes.ENUM('sale', 'deposit', 'withdrawal', 'opening', 'closing'),
    allowNull: false,
    comment: 'Tipo de movimentação'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Valor da movimentação (R$) - positivo para entrada, negativo para saída'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descrição da movimentação'
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    },
    comment: 'ID do pedido relacionado (para vendas)'
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Número do pedido (desnormalizado)'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'ID do usuário que criou a movimentação'
  },
  createdByName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nome do usuário (desnormalizado)'
  },
  metadata: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('metadata');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('metadata', value ? JSON.stringify(value) : null);
    },
    comment: 'Dados adicionais em JSON'
  }
}, {
  sequelize,
  modelName: 'CashierMovement',
  tableName: 'cashier_movements',
  timestamps: true,
  updatedAt: false, // Movimentações não devem ser alteradas
  indexes: [
    {
      fields: ['cashierId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['orderId']
    },
    {
      fields: ['createdBy']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['cashierId', 'type'],
      name: 'idx_movement_cashier_type'
    },
    {
      fields: ['cashierId', 'createdAt'],
      name: 'idx_movement_cashier_date'
    }
  ]
});

module.exports = CashierMovement;

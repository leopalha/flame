const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class CashbackHistory extends Model {
  // Formatar descrição da transação
  getDescription() {
    const amountStr = `R$ ${Math.abs(parseFloat(this.amount)).toFixed(2)}`;

    if (this.type === 'earned') {
      return `Ganhou ${amountStr} de cashback`;
    } else if (this.type === 'redeemed') {
      return `Usou ${amountStr} de cashback`;
    } else if (this.type === 'expired') {
      return `${amountStr} expirou`;
    } else if (this.type === 'bonus') {
      return `Bônus de ${amountStr}`;
    } else if (this.type === 'adjustment') {
      return `Ajuste: ${this.amount > 0 ? '+' : ''}${amountStr}`;
    }
    return this.description || 'Transação de cashback';
  }
}

CashbackHistory.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Positivo para ganho, negativo para uso'
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isIn: [['earned', 'redeemed', 'expired', 'bonus', 'adjustment']]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  balanceBefore: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Saldo antes da transação em R$'
  },
  balanceAfter: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Saldo após a transação em R$'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data de expiração do cashback (se aplicável)'
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
  modelName: 'CashbackHistory',
  tableName: 'cashback_history',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['orderId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

module.exports = CashbackHistory;

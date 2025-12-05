const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class PointsHistory extends Model {
  // Formatar descrição da transação
  getDescription() {
    if (this.type === 'earned') {
      return `Ganhou ${this.points} pontos`;
    } else if (this.type === 'redeemed') {
      return `Resgatou ${this.points} pontos`;
    } else if (this.type === 'expired') {
      return `${this.points} pontos expiraram`;
    } else if (this.type === 'bonus') {
      return `Bônus de ${this.points} pontos`;
    } else if (this.type === 'adjustment') {
      return `Ajuste: ${this.points > 0 ? '+' : ''}${this.points} pontos`;
    }
    return this.description || 'Transação de pontos';
  }
}

PointsHistory.init({
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
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Positivo para ganho, negativo para resgate'
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
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Saldo antes da transação'
  },
  balanceAfter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Saldo após a transação'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data de expiração dos pontos (se aplicável)'
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
  modelName: 'PointsHistory',
  tableName: 'points_history',
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

module.exports = PointsHistory;

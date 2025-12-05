const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class PushSubscription extends Model {
  // Método para verificar se a subscription está ativa
  isActive() {
    return this.active && !this.failedAttempts || this.failedAttempts < 3;
  }

  // Marcar como falha
  async markFailed() {
    this.failedAttempts = (this.failedAttempts || 0) + 1;
    this.lastError = new Date();

    // Desativar após 3 falhas
    if (this.failedAttempts >= 3) {
      this.active = false;
    }

    await this.save();
  }

  // Resetar contagem de falhas (após sucesso)
  async markSuccess() {
    this.failedAttempts = 0;
    this.lastError = null;
    this.lastUsed = new Date();
    await this.save();
  }
}

PushSubscription.init({
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
  // Web Push subscription object
  endpoint: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  // Keys for encryption
  p256dh: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  auth: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Device info
  deviceType: {
    type: DataTypes.TEXT,
    defaultValue: 'web',
    validate: {
      isIn: [['web', 'android', 'ios', 'desktop']]
    }
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Status tracking
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  failedAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastError: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastUsed: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Notification preferences
  preferences: {
    type: DataTypes.TEXT,
    defaultValue: '{}',
    get() {
      const rawValue = this.getDataValue('preferences');
      return rawValue ? JSON.parse(rawValue) : {
        orderUpdates: true,
        promotions: true,
        reservations: true,
        marketing: false
      };
    },
    set(value) {
      this.setDataValue('preferences', JSON.stringify(value));
    }
  }
}, {
  sequelize,
  modelName: 'PushSubscription',
  tableName: 'push_subscriptions',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['endpoint'],
      unique: true
    },
    {
      fields: ['active']
    }
  ]
});

module.exports = PushSubscription;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('reactivation', 'promotion', 'loyalty', 'announcement'),
    defaultValue: 'promotion'
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'completed'),
    defaultValue: 'draft'
  },
  targetType: {
    type: DataTypes.ENUM('all', 'inactive', 'tier', 'custom'),
    defaultValue: 'all'
  },
  targetFilters: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  content: {
    type: DataTypes.JSON,
    defaultValue: {
      subject: '',
      body: '',
      sms: ''
    }
  },
  incentive: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  channels: {
    type: DataTypes.JSON,
    defaultValue: ['email']
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  stats: {
    type: DataTypes.JSON,
    defaultValue: {
      totalTargets: 0,
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0
    }
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'campaigns',
  timestamps: true
});

module.exports = Campaign;

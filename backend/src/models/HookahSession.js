const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HookahSession = sequelize.define('HookahSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  mesaId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tables',
      key: 'id',
    },
    comment: 'Mesa onde a sessão está ativa',
  },
  flavorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'hookah_flavors',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Quantidade de narguilés nesta sessão',
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Quando a sessão iniciou',
  },
  endedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Quando a sessão finalizou',
  },
  pausedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Quando foi pausada (se aplicável)',
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'ended'),
    defaultValue: 'active',
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    comment: 'Duração em minutos',
  },
  scheduledEndTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Horário previsto de término (startedAt + duration)',
  },
  coalChanges: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array de timestamps das trocas de carvão',
  },
  totalPausedTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Tempo total pausada (em minutos)',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Preço final calculado',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'hookah_sessions',
  timestamps: true,
  indexes: [
    {
      fields: ['mesaId'],
    },
    {
      fields: ['flavorId'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['startedAt'],
    },
    {
      fields: ['endedAt'],
    },
    {
      fields: ['mesaId', 'status'],
      name: 'idx_hookah_sessions_mesa_status',
    },
  ],
});

// Instance Methods
HookahSession.prototype.getElapsedTime = function() {
  const now = new Date();
  const diff = now - this.startedAt;
  return Math.floor(diff / 60000); // em minutos
};

HookahSession.prototype.getRemainingTime = function() {
  const elapsed = this.getElapsedTime();
  const accountedDuration = this.duration - this.totalPausedTime;
  return Math.max(0, accountedDuration - elapsed);
};

HookahSession.prototype.isOvertime = function() {
  return this.getRemainingTime() <= 0;
};

HookahSession.prototype.registerCoalChange = function() {
  if (!this.coalChanges) {
    this.coalChanges = [];
  }
  this.coalChanges.push(new Date().toISOString());
  return this.save();
};

HookahSession.prototype.getCoalChangeCount = function() {
  return this.coalChanges ? this.coalChanges.length : 0;
};

HookahSession.prototype.pause = function() {
  if (this.status !== 'active') {
    throw new Error('Sessão não está ativa');
  }
  this.status = 'paused';
  this.pausedAt = new Date();
  return this.save();
};

HookahSession.prototype.resume = function() {
  if (this.status !== 'paused') {
    throw new Error('Sessão não está pausada');
  }
  if (this.pausedAt) {
    const pauseDuration = Math.floor((new Date() - this.pausedAt) / 60000);
    this.totalPausedTime += pauseDuration;
  }
  this.status = 'active';
  this.pausedAt = null;
  return this.save();
};

HookahSession.prototype.end = function() {
  this.status = 'ended';
  this.endedAt = new Date();
  return this.save();
};

HookahSession.prototype.getTotalDuration = function() {
  if (!this.endedAt) {
    return this.getElapsedTime();
  }
  return Math.floor((this.endedAt - this.startedAt) / 60000);
};

HookahSession.prototype.calculatePrice = function(basePrice) {
  const totalMinutes = this.getTotalDuration();
  const baseDuration = this.duration;

  if (totalMinutes <= baseDuration) {
    return parseFloat((basePrice * this.quantity).toFixed(2));
  }

  const overtime = totalMinutes - baseDuration;
  const overtimeBlocks = Math.ceil(overtime / 15);
  const overtimeCost = overtimeBlocks * (basePrice * 0.25);
  return parseFloat(((basePrice + overtimeCost) * this.quantity).toFixed(2));
};

// Static Methods
HookahSession.getActiveSessions = function() {
  return this.findAll({
    where: { status: 'active' },
    include: [
      { model: sequelize.models.Table, attributes: ['id', 'number'] },
      { model: sequelize.models.HookahFlavor, attributes: ['id', 'name', 'category'] },
    ],
    order: [['startedAt', 'ASC']],
  });
};

HookahSession.getSessionsByMesa = function(mesaId) {
  return this.findAll({
    where: { mesaId },
    order: [['startedAt', 'DESC']],
    limit: 10,
  });
};

HookahSession.getSessionsByDate = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return this.findAll({
    where: {
      startedAt: {
        [sequelize.Sequelize.Op.between]: [startOfDay, endOfDay],
      },
    },
    order: [['startedAt', 'DESC']],
  });
};

HookahSession.getRevenueReport = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.findAll({
    where: {
      status: 'ended',
      endedAt: {
        [sequelize.Sequelize.Op.gte]: startDate,
      },
    },
    attributes: [
      [sequelize.Sequelize.fn('COUNT', sequelize.Sequelize.col('id')), 'totalSessions'],
      [sequelize.Sequelize.fn('SUM', sequelize.Sequelize.col('price')), 'totalRevenue'],
      [
        sequelize.Sequelize.fn(
          'AVG',
          sequelize.Sequelize.literal('CAST(price AS DECIMAL)')
        ),
        'averagePrice',
      ],
    ],
    raw: true,
  });
};

module.exports = HookahSession;

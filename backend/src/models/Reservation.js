const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // Para clientes não logados
    references: {
      model: 'users',
      key: 'id',
    },
  },
  confirmationCode: {
    type: DataTypes.STRING(12),
    unique: true,
    allowNull: false,
    comment: 'Código único para confirmação',
  },
  guestName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  guestEmail: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  guestPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  reservationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Data da reserva',
  },
  partySize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 50,
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'no_show', 'completed'),
    defaultValue: 'pending',
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Pedidos especiais (sem glúten, cadeira alta, etc)',
  },
  guestNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas do cliente',
  },
  tableId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'tables',
      key: 'id',
    },
    comment: 'Mesa atribuída (se confirmada)',
  },
  confirmedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Quando foi confirmada',
  },
  arrivedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Quando chegou',
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cancelReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reminderSentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Quando o lembrete foi enviado (2h antes)',
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
  tableName: 'reservations',
  timestamps: true,
  indexes: [
    {
      fields: ['reservationDate'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['guestEmail'],
    },
    {
      fields: ['confirmationCode'],
      unique: true,
    },
    {
      fields: ['userId', 'reservationDate'],
      name: 'idx_reservations_user_date',
    },
  ],
});

// Instance Methods
Reservation.prototype.isConfirmed = function() {
  return this.status === 'confirmed';
};

Reservation.prototype.isPast = function() {
  const now = new Date();
  return this.reservationDate < now;
};

Reservation.prototype.isUpcoming = function() {
  const now = new Date();
  return this.reservationDate > now && this.isConfirmed();
};

Reservation.prototype.getTimeUntilReservation = function() {
  const now = new Date();
  const diff = this.reservationDate - now;
  return Math.floor(diff / 60000); // em minutos
};

Reservation.prototype.shouldSendReminder = function() {
  // Enviar lembrete 2h antes
  const minutesUntil = this.getTimeUntilReservation();
  return minutesUntil <= 120 && minutesUntil > 0 && !this.reminderSentAt;
};

Reservation.prototype.confirm = function(tableId = null) {
  if (this.status !== 'pending') {
    throw new Error('Apenas reservas pendentes podem ser confirmadas');
  }
  this.status = 'confirmed';
  this.confirmedAt = new Date();
  if (tableId) {
    this.tableId = tableId;
  }
  return this.save();
};

Reservation.prototype.cancel = function(reason = '') {
  if (this.status === 'cancelled' || this.status === 'completed') {
    throw new Error('Esta reserva não pode ser cancelada');
  }
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelReason = reason;
  return this.save();
};

Reservation.prototype.markArrived = function() {
  if (this.status !== 'confirmed') {
    throw new Error('Apenas reservas confirmadas podem marcar chegada');
  }
  this.arrivedAt = new Date();
  return this.save();
};

Reservation.prototype.markNoShow = function() {
  this.status = 'no_show';
  return this.save();
};

Reservation.prototype.complete = function() {
  this.status = 'completed';
  return this.save();
};

Reservation.prototype.markReminderSent = function() {
  this.reminderSentAt = new Date();
  return this.save();
};

// Static Methods
Reservation.getByConfirmationCode = function(code) {
  return this.findOne({
    where: { confirmationCode: code },
    include: [
      {
        model: sequelize.models.User,
        attributes: ['id', 'name', 'email'],
      },
      {
        model: sequelize.models.Table,
        attributes: ['id', 'number'],
      },
    ],
  });
};

Reservation.getUpcomingReservations = function(days = 1) {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);
  endDate.setHours(23, 59, 59, 999);

  return this.findAll({
    where: {
      status: 'confirmed',
      reservationDate: {
        [sequelize.Sequelize.Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: sequelize.models.User,
        attributes: ['id', 'name', 'email'],
      },
    ],
    order: [['reservationDate', 'ASC']],
  });
};

Reservation.getAvailableSlots = function(date, durationMinutes = 30, totalTables = 8) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  // Horários de funcionamento: 13:00 até 22:00, a cada 30min
  const slots = [];
  for (let hour = 13; hour < 22; hour++) {
    for (let min = 0; min < 60; min += durationMinutes) {
      slots.push(
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, min, 0)
      );
    }
  }

  return slots.map((slot) => ({
    time: `${slot.getHours().toString().padStart(2, '0')}:${slot.getMinutes().toString().padStart(2, '0')}`,
    available: true, // Lógica de ocupação será implementada depois
    availableTables: totalTables,
    totalTables: totalTables
  }));
};

Reservation.getByUserEmail = function(email) {
  return this.findAll({
    where: { guestEmail: email },
    order: [['reservationDate', 'DESC']],
  });
};

Reservation.getPendingConfirmations = function() {
  return this.findAll({
    where: { status: 'pending' },
    order: [['createdAt', 'ASC']],
  });
};

Reservation.getReservationsNeedingReminder = function() {
  const now = new Date();
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  return this.findAll({
    where: {
      status: 'confirmed',
      reminderSentAt: null,
      reservationDate: {
        [sequelize.Sequelize.Op.between]: [now, twoHoursFromNow],
      },
    },
  });
};

Reservation.getNoShowReservations = function() {
  const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000);

  return this.findAll({
    where: {
      status: 'confirmed',
      arrivedAt: null,
      reservationDate: {
        [sequelize.Sequelize.Op.lte]: fifteenMinutesAgo,
      },
    },
  });
};

Reservation.getReservationsByDateRange = function(startDate, endDate) {
  return this.findAll({
    where: {
      reservationDate: {
        [sequelize.Sequelize.Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: sequelize.models.User,
        attributes: ['id', 'name', 'email'],
      },
    ],
    order: [['reservationDate', 'ASC']],
  });
};

module.exports = Reservation;

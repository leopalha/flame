const crypto = require('crypto');
const { Reservation, User, Table } = require('../models');
const { Op } = require('sequelize');
const smsService = require('./sms.service');
const whatsappService = require('./whatsapp.service');

class ReservationService {
  /**
   * Gerar código de confirmação único
   * @returns {string} Código de 12 caracteres
   */
  static generateConfirmationCode() {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
  }

  /**
   * Criar nova reserva
   * @param {Object} data - { guestName, guestEmail, guestPhone, reservationDate, partySize, specialRequests, guestNotes, userId }
   * @returns {Object} Reserva criada
   */
  static async createReservation(data) {
    try {
      const {
        guestName,
        guestEmail,
        guestPhone,
        reservationDate,
        partySize,
        specialRequests = '',
        guestNotes = '',
        userId = null,
      } = data;

      // Validações
      if (!guestName || !guestEmail || !guestPhone || !reservationDate || !partySize) {
        throw new Error('Dados obrigatórios faltando');
      }

      if (partySize < 1 || partySize > 50) {
        throw new Error('Tamanho do grupo inválido (1-50)');
      }

      const resDate = new Date(reservationDate);
      if (resDate < new Date()) {
        throw new Error('Data da reserva não pode ser no passado');
      }

      // Criar reserva
      const confirmationCode = this.generateConfirmationCode();
      const reservation = await Reservation.create({
        guestName,
        guestEmail,
        guestPhone,
        reservationDate: resDate,
        partySize,
        specialRequests,
        guestNotes,
        userId,
        confirmationCode,
        status: 'pending',
      });

      // Preparar dados para notificações
      const notificationData = {
        guestName,
        guestEmail,
        guestPhone,
        confirmationCode,
        reservationDate: resDate,
        partySize,
        specialRequests,
        guestNotes,
      };

      // Enviar SMS de confirmação para o cliente (async, não bloqueia)
      smsService.sendReservationConfirmation(guestPhone, notificationData)
        .then(result => {
          if (result.success) {
            console.log(`✅ SMS de reserva enviado para ${guestPhone}`);
          } else {
            console.error(`❌ Falha ao enviar SMS de reserva: ${result.error}`);
          }
        })
        .catch(err => console.error('Erro SMS reserva:', err));

      // Enviar WhatsApp para FLAME (async, não bloqueia)
      whatsappService.notifyNewReservation(notificationData)
        .then(result => {
          if (result.success) {
            console.log(`✅ WhatsApp de reserva enviado para FLAME`);
          } else {
            console.error(`❌ Falha ao enviar WhatsApp: ${result.error}`);
          }
        })
        .catch(err => console.error('Erro WhatsApp reserva:', err));

      return this.enrichReservation(reservation);
    } catch (error) {
      throw new Error(`Erro ao criar reserva: ${error.message}`);
    }
  }

  /**
   * Obter reserva por ID
   * @param {UUID} reservationId - ID da reserva
   * @returns {Object} Reserva com detalhes
   */
  static async getReservation(reservationId) {
    try {
      const reservation = await Reservation.findByPk(reservationId, {
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Table,
            attributes: ['id', 'number'],
          },
        ],
      });

      if (!reservation) {
        throw new Error('Reserva não encontrada');
      }

      return this.enrichReservation(reservation);
    } catch (error) {
      throw new Error(`Erro ao obter reserva: ${error.message}`);
    }
  }

  /**
   * Listar reservas do cliente
   * @param {UUID} userId - ID do usuário
   * @returns {Array} Lista de reservas
   */
  static async getReservationsByUser(userId) {
    try {
      const reservations = await Reservation.findAll({
        where: { userId },
        include: [
          {
            model: Table,
            attributes: ['id', 'number'],
          },
        ],
        order: [['reservationDate', 'DESC']],
      });

      return reservations.map((r) => this.enrichReservation(r));
    } catch (error) {
      throw new Error(`Erro ao listar reservas do usuário: ${error.message}`);
    }
  }

  /**
   * Listar todas as reservas (admin)
   * @param {Object} filters - { status, startDate, endDate, limit, offset }
   * @returns {Object} { data, total, page }
   */
  static async getAllReservations(filters = {}) {
    try {
      const {
        status = null,
        startDate = null,
        endDate = null,
        limit = 20,
        offset = 0,
      } = filters;

      const where = {};

      if (status) {
        where.status = status;
      }

      if (startDate && endDate) {
        where.reservationDate = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      }

      const { count, rows } = await Reservation.findAndCountAll({
        where,
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Table,
            attributes: ['id', 'number'],
          },
        ],
        order: [['reservationDate', 'ASC']],
        limit,
        offset,
      });

      return {
        data: rows.map((r) => this.enrichReservation(r)),
        total: count,
        page: Math.floor(offset / limit) + 1,
      };
    } catch (error) {
      throw new Error(`Erro ao listar reservas: ${error.message}`);
    }
  }

  /**
   * Confirmar reserva
   * @param {UUID} reservationId - ID da reserva
   * @param {UUID} tableId - ID da mesa (opcional)
   * @returns {Object} Reserva atualizada
   */
  static async confirmReservation(reservationId, tableId = null) {
    try {
      const reservation = await Reservation.findByPk(reservationId);

      if (!reservation) {
        throw new Error('Reserva não encontrada');
      }

      if (reservation.status !== 'pending') {
        throw new Error('Apenas reservas pendentes podem ser confirmadas');
      }

      if (tableId) {
        const table = await Table.findByPk(tableId);
        if (!table) {
          throw new Error('Mesa não encontrada');
        }
      }

      await reservation.confirm(tableId);

      return this.enrichReservation(reservation);
    } catch (error) {
      throw new Error(`Erro ao confirmar reserva: ${error.message}`);
    }
  }

  /**
   * Cancelar reserva
   * @param {UUID} reservationId - ID da reserva
   * @param {string} reason - Motivo do cancelamento
   * @returns {Object} Reserva atualizada
   */
  static async cancelReservation(reservationId, reason = '') {
    try {
      const reservation = await Reservation.findByPk(reservationId);

      if (!reservation) {
        throw new Error('Reserva não encontrada');
      }

      // Guardar dados antes de cancelar para notificação
      const cancellationData = {
        guestName: reservation.guestName,
        confirmationCode: reservation.confirmationCode,
        reservationDate: reservation.reservationDate,
      };

      await reservation.cancel(reason);

      // Notificar FLAME via WhatsApp sobre cancelamento (async)
      whatsappService.notifyCancellation(cancellationData, reason)
        .then(result => {
          if (result.success) {
            console.log(`✅ WhatsApp de cancelamento enviado para FLAME`);
          }
        })
        .catch(err => console.error('Erro WhatsApp cancelamento:', err));

      return this.enrichReservation(reservation);
    } catch (error) {
      throw new Error(`Erro ao cancelar reserva: ${error.message}`);
    }
  }

  /**
   * Atualizar reserva
   * @param {UUID} reservationId - ID da reserva
   * @param {Object} data - Dados a atualizar
   * @returns {Object} Reserva atualizada
   */
  static async updateReservation(reservationId, data) {
    try {
      const reservation = await Reservation.findByPk(reservationId);

      if (!reservation) {
        throw new Error('Reserva não encontrada');
      }

      // Apenas permitir atualizar se pendente
      if (reservation.status !== 'pending') {
        throw new Error('Apenas reservas pendentes podem ser editadas');
      }

      const updatable = ['guestName', 'guestEmail', 'guestPhone', 'reservationDate', 'partySize', 'specialRequests', 'guestNotes'];

      for (const key of updatable) {
        if (key in data) {
          reservation[key] = data[key];
        }
      }

      await reservation.save();

      return this.enrichReservation(reservation);
    } catch (error) {
      throw new Error(`Erro ao atualizar reserva: ${error.message}`);
    }
  }

  /**
   * Obter slots disponíveis para uma data
   * @param {string} date - Data (YYYY-MM-DD)
   * @returns {Array} Slots disponíveis
   */
  static async getAvailableSlots(date) {
    try {
      const dateObj = new Date(date);
      const slots = Reservation.getAvailableSlots(dateObj);

      // TODO: Implementar lógica de ocupação real
      // Por enquanto retorna todos os slots como disponíveis

      return slots;
    } catch (error) {
      throw new Error(`Erro ao obter slots: ${error.message}`);
    }
  }

  /**
   * Marcar chegada do cliente
   * @param {UUID} reservationId - ID da reserva
   * @returns {Object} Reserva atualizada
   */
  static async markArrived(reservationId) {
    try {
      const reservation = await Reservation.findByPk(reservationId);

      if (!reservation) {
        throw new Error('Reserva não encontrada');
      }

      if (reservation.status !== 'confirmed') {
        throw new Error('Apenas reservas confirmadas podem marcar chegada');
      }

      await reservation.markArrived();

      return this.enrichReservation(reservation);
    } catch (error) {
      throw new Error(`Erro ao marcar chegada: ${error.message}`);
    }
  }

  /**
   * Enviar lembrete via SMS e WhatsApp
   * @param {UUID} reservationId - ID da reserva
   * @returns {Object} Resultado do envio
   */
  static async sendReminder(reservationId) {
    try {
      const reservation = await Reservation.findByPk(reservationId);

      if (!reservation) {
        throw new Error('Reserva não encontrada');
      }

      if (!reservation.shouldSendReminder()) {
        throw new Error('Não é hora de enviar lembrete');
      }

      // Preparar dados para lembrete
      const reminderData = {
        guestName: reservation.guestName,
        guestPhone: reservation.guestPhone,
        confirmationCode: reservation.confirmationCode,
        reservationDate: reservation.reservationDate,
        partySize: reservation.partySize,
      };

      // Enviar lembrete via WhatsApp
      const whatsappResult = await whatsappService.sendReminder(reminderData);

      // Marca como enviado
      await reservation.markReminderSent();

      console.log(`✉️ Lembrete enviado para ${reservation.guestPhone}`);

      return {
        success: true,
        message: 'Lembrete enviado',
        whatsapp: whatsappResult,
        reservation: this.enrichReservation(reservation),
      };
    } catch (error) {
      throw new Error(`Erro ao enviar lembrete: ${error.message}`);
    }
  }

  /**
   * Obter reservas que precisam de lembrete
   * @returns {Array} Reservas que devem receber lembrete
   */
  static async getReservationsNeedingReminder() {
    try {
      const reservations = await Reservation.getReservationsNeedingReminder();

      return reservations.map((r) => this.enrichReservation(r));
    } catch (error) {
      throw new Error(`Erro ao obter reservas para lembrete: ${error.message}`);
    }
  }

  /**
   * Marcar no-show automático
   * @returns {number} Quantidade de no-shows marcados
   */
  static async markNoShows() {
    try {
      const noShowReservations = await Reservation.getNoShowReservations();

      let count = 0;
      for (const reservation of noShowReservations) {
        await reservation.markNoShow();
        count++;
      }

      console.log(`❌ ${count} reservas marcadas como no-show`);

      return count;
    } catch (error) {
      throw new Error(`Erro ao marcar no-shows: ${error.message}`);
    }
  }

  /**
   * Obter estatísticas de reservas
   * @param {number} days - Número de dias (default: 30)
   * @returns {Object} Estatísticas
   */
  static async getReservationStats(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const reservations = await Reservation.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
          },
        },
      });

      const total = reservations.length;
      const confirmed = reservations.filter((r) => r.status === 'confirmed').length;
      const cancelled = reservations.filter((r) => r.status === 'cancelled').length;
      const noShow = reservations.filter((r) => r.status === 'no_show').length;
      const completed = reservations.filter((r) => r.status === 'completed').length;

      const totalPeople = reservations.reduce((sum, r) => sum + r.partySize, 0);
      const avgPartySize = total > 0 ? Math.round(totalPeople / total) : 0;

      return {
        period: `${days} dias`,
        total,
        confirmed,
        cancelled,
        noShow,
        completed,
        totalPeople,
        avgPartySize,
        confirmationRate: total > 0 ? ((confirmed / total) * 100).toFixed(1) : 0,
      };
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }

  /**
   * Enriquecer reserva com dados calculados
   * @param {Object} reservation - Reserva
   * @returns {Object} Reserva enriquecida
   */
  static enrichReservation(reservation) {
    return {
      id: reservation.id,
      confirmationCode: reservation.confirmationCode,
      guestName: reservation.guestName,
      guestEmail: reservation.guestEmail,
      guestPhone: reservation.guestPhone,
      partySize: reservation.partySize,
      reservationDate: reservation.reservationDate,
      status: reservation.status,
      specialRequests: reservation.specialRequests,
      guestNotes: reservation.guestNotes,
      userId: reservation.userId,
      user: reservation.User
        ? {
            id: reservation.User.id,
            name: reservation.User.name,
            email: reservation.User.email,
          }
        : null,
      table: reservation.Table
        ? {
            id: reservation.Table.id,
            number: reservation.Table.number,
          }
        : null,
      confirmedAt: reservation.confirmedAt,
      arrivedAt: reservation.arrivedAt,
      cancelledAt: reservation.cancelledAt,
      cancelReason: reservation.cancelReason,
      reminderSentAt: reservation.reminderSentAt,
      isConfirmed: reservation.isConfirmed?.(),
      isPast: reservation.isPast?.(),
      isUpcoming: reservation.isUpcoming?.(),
      timeUntilReservation: reservation.getTimeUntilReservation?.(),
      shouldSendReminder: reservation.shouldSendReminder?.(),
      createdAt: reservation.createdAt,
    };
  }
}

module.exports = ReservationService;

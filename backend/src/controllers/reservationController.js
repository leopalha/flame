const reservationService = require('../services/reservationService');
const socketService = require('../services/socket.service');

class ReservationController {
  /**
   * POST /api/reservations
   * Criar nova reserva
   */
  static async createReservation(req, res) {
    try {
      const {
        guestName,
        guestEmail,
        guestPhone,
        reservationDate,
        partySize,
        specialRequests = '',
        guestNotes = '',
      } = req.body;

      if (!guestName || !guestEmail || !guestPhone || !reservationDate || !partySize) {
        return res.status(400).json({
          success: false,
          error: 'Dados obrigatórios faltando',
        });
      }

      const reservation = await reservationService.createReservation({
        guestName,
        guestEmail,
        guestPhone,
        reservationDate,
        partySize,
        specialRequests,
        guestNotes,
        userId: req.user?.id || null,
      });

      // Notificar admin via Socket.IO
      socketService.notifyNewReservation(reservation);

      return res.status(201).json({
        success: true,
        data: reservation,
        message: 'Reserva criada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/reservations/:id
   * Obter detalhes de uma reserva
   */
  static async getReservation(req, res) {
    try {
      const { id } = req.params;

      const reservation = await reservationService.getReservation(id);

      return res.json({
        success: true,
        data: reservation,
      });
    } catch (error) {
      console.error('Erro ao obter reserva:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/reservations
   * Listar reservas do cliente
   */
  static async getMyReservations(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const reservations = await reservationService.getReservationsByUser(req.user.id);

      return res.json({
        success: true,
        data: reservations,
        count: reservations.length,
      });
    } catch (error) {
      console.error('Erro ao listar reservas:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/reservations
   * Listar todas as reservas (admin)
   */
  static async getAllReservations(req, res) {
    try {
      const { status, startDate, endDate, limit = 20, offset = 0 } = req.query;

      const result = await reservationService.getAllReservations({
        status,
        startDate,
        endDate,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return res.json({
        success: true,
        data: result.data,
        total: result.total,
        page: result.page,
      });
    } catch (error) {
      console.error('Erro ao listar reservas:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/reservations/:id
   * Atualizar reserva
   */
  static async updateReservation(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const reservation = await reservationService.updateReservation(id, data);

      return res.json({
        success: true,
        data: reservation,
        message: 'Reserva atualizada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/reservations/:id/confirm
   * Confirmar reserva
   */
  static async confirmReservation(req, res) {
    try {
      const { id } = req.params;
      const { tableId } = req.body;

      const reservation = await reservationService.confirmReservation(id, tableId);

      return res.json({
        success: true,
        data: reservation,
        message: 'Reserva confirmada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/reservations/:id/cancel
   * Cancelar reserva
   */
  static async cancelReservation(req, res) {
    try {
      const { id } = req.params;
      const { reason = '' } = req.body;

      const reservation = await reservationService.cancelReservation(id, reason);

      return res.json({
        success: true,
        data: reservation,
        message: 'Reserva cancelada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/reservations/availability
   * Obter slots disponíveis
   */
  static async getAvailableSlots(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          error: 'Data é obrigatória',
        });
      }

      const slots = await reservationService.getAvailableSlots(date);

      return res.json({
        success: true,
        data: slots,
        date,
        count: slots.length,
      });
    } catch (error) {
      console.error('Erro ao obter slots:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/reservations/:id/arrived
   * Marcar chegada
   */
  static async markArrived(req, res) {
    try {
      const { id } = req.params;

      const reservation = await reservationService.markArrived(id);

      return res.json({
        success: true,
        data: reservation,
        message: 'Chegada registrada',
      });
    } catch (error) {
      console.error('Erro ao marcar chegada:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * POST /api/reservations/:id/send-reminder
   * Enviar lembrete
   */
  static async sendReminder(req, res) {
    try {
      const { id } = req.params;

      const result = await reservationService.sendReminder(id);

      return res.json({
        success: true,
        data: result.reservation,
        message: result.message,
      });
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/reservations/stats
   * Obter estatísticas
   */
  static async getReservationStats(req, res) {
    try {
      const { days = 30 } = req.query;

      const stats = await reservationService.getReservationStats(parseInt(days));

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/reservations/by-code/:code
   * Obter reserva por código de confirmação
   */
  static async getByConfirmationCode(req, res) {
    try {
      const { code } = req.params;

      const reservation = await require('../models').Reservation.getByConfirmationCode(code);

      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Reserva não encontrada',
        });
      }

      return res.json({
        success: true,
        data: reservationService.enrichReservation(reservation),
      });
    } catch (error) {
      console.error('Erro ao obter reserva por código:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = ReservationController;

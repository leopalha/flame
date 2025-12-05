const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { requireCompleteProfile } = require('../middlewares/profileComplete.middleware');

/**
 * Rotas Públicas (Cliente)
 */

// POST /api/reservations - Criar nova reserva (requer perfil completo se autenticado)
router.post('/',
  authenticate,
  requireCompleteProfile,
  reservationController.createReservation
);

// GET /api/reservations/availability - Obter slots disponíveis
router.get('/availability', reservationController.getAvailableSlots);

// GET /api/reservations/by-code/:code - Obter por código de confirmação
router.get('/by-code/:code', reservationController.getByConfirmationCode);

/**
 * Rotas Protegidas (Cliente Logado)
 */

// GET /api/reservations - Listar minhas reservas
router.get(
  '/',
  authenticate,
  reservationController.getMyReservations
);

// GET /api/reservations/:id - Detalhes de uma reserva
router.get(
  '/:id',
  authenticate,
  reservationController.getReservation
);

// PUT /api/reservations/:id - Atualizar minha reserva
router.put(
  '/:id',
  authenticate,
  reservationController.updateReservation
);

// PUT /api/reservations/:id/cancel - Cancelar minha reserva
router.put(
  '/:id/cancel',
  authenticate,
  reservationController.cancelReservation
);

/**
 * Rotas Admin
 */

// GET /api/admin/reservations - Listar todas as reservas
router.get(
  '/admin/all',
  authenticate,
  requireRole(['admin']),
  reservationController.getAllReservations
);

// PUT /api/admin/reservations/:id/confirm - Confirmar reserva
router.put(
  '/admin/:id/confirm',
  authenticate,
  requireRole(['admin']),
  reservationController.confirmReservation
);

// PUT /api/admin/reservations/:id/arrived - Marcar chegada
router.put(
  '/admin/:id/arrived',
  authenticate,
  requireRole(['admin']),
  reservationController.markArrived
);

// POST /api/admin/reservations/:id/send-reminder - Enviar lembrete
router.post(
  '/admin/:id/send-reminder',
  authenticate,
  requireRole(['admin']),
  reservationController.sendReminder
);

// GET /api/admin/reservations/stats - Estatísticas
router.get(
  '/admin/stats',
  authenticate,
  requireRole(['admin']),
  reservationController.getReservationStats
);

module.exports = router;

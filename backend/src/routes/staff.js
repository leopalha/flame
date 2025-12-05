const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/staffController');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');
const { requireStaff, requireKitchen, requireAttendant } = require('../middlewares/role.middleware');

// Todas as rotas de staff requerem autenticação
router.use(authenticate);

// GET /api/staff/dashboard - Dashboard por role do usuário
router.get('/dashboard', StaffController.getDashboard);

// GET /api/staff/orders - Listar pedidos com filtros
router.get('/orders', StaffController.getOrders);

// GET /api/staff/orders/:id/details - Detalhes de um pedido
router.get('/orders/:id/details', StaffController.getOrderDetails);

// PUT /api/staff/orders/:id/status - Atualizar status (requer staff)
router.put('/orders/:id/status', requireStaff, StaffController.updateOrderStatus);

// GET /api/staff/alerts - Alertas de estoque e atrasos
router.get('/alerts', StaffController.getAlerts);

// POST /api/staff/start-timer - Iniciar timer para pedido
router.post('/start-timer', requireStaff, StaffController.startTimer);

// POST /api/staff/call-customer - Chamar cliente via SMS/Push
router.post('/call-customer', requireAttendant, StaffController.callCustomer);

module.exports = router;

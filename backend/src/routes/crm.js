const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crm.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');

// Todas as rotas de CRM requerem autenticação e role admin
router.use(authenticate);
router.use(requireAdmin);

/**
 * GET /api/crm/dashboard
 * Dashboard com estatísticas gerais
 */
router.get('/dashboard', crmController.getDashboard);

/**
 * GET /api/crm/customers
 * Listar clientes com filtros e paginação
 * Query params: page, limit, search, tier, sortBy, sortOrder
 */
router.get('/customers', crmController.listCustomers);

/**
 * GET /api/crm/customers/:id
 * Detalhes completos de um cliente
 */
router.get('/customers/:id', crmController.getCustomer);

/**
 * GET /api/crm/customers/:id/cashback-history
 * Histórico de cashback de um cliente
 * Query params: page, limit
 */
router.get('/customers/:id/cashback-history', crmController.getCashbackHistory);

/**
 * POST /api/crm/customers/:id/cashback
 * Adicionar cashback manualmente
 * Body: { amount: number, description?: string }
 */
router.post('/customers/:id/cashback', crmController.addCashback);

/**
 * GET /api/crm/inactive
 * Listar clientes inativos
 * Query params: days (default: 30)
 */
router.get('/inactive', crmController.getInactiveCustomers);

/**
 * GET /api/crm/near-upgrade
 * Clientes próximos de subir de tier
 * Query params: threshold (default: 100)
 */
router.get('/near-upgrade', crmController.getNearUpgrade);

/**
 * PUT /api/crm/customers/:id/tier
 * Ajustar tier manualmente (recalcula baseado em totalSpent)
 */
router.put('/customers/:id/tier', crmController.adjustTier);

module.exports = router;

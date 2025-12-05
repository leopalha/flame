const express = require('express');
const router = express.Router();
const cashierController = require('../controllers/cashier.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// Todas as rotas requerem autenticação e role de staff ou admin
router.use(authenticate);
router.use(requireRole(['staff', 'admin']));

/**
 * @route   POST /api/cashier/open
 * @desc    Abre um novo caixa
 * @access  Staff, Admin
 * @body    { openingAmount: number, notes?: string }
 */
router.post('/open', cashierController.openCashier);

/**
 * @route   GET /api/cashier/current
 * @desc    Busca o caixa atualmente aberto
 * @access  Staff, Admin
 */
router.get('/current', cashierController.getCurrentCashier);

/**
 * @route   POST /api/cashier/deposit
 * @desc    Registra um suprimento (entrada de dinheiro)
 * @access  Staff, Admin
 * @body    { cashierId: uuid, amount: number, description?: string }
 */
router.post('/deposit', cashierController.registerDeposit);

/**
 * @route   POST /api/cashier/withdrawal
 * @desc    Registra uma sangria (retirada de dinheiro)
 * @access  Staff, Admin
 * @body    { cashierId: uuid, amount: number, description?: string }
 */
router.post('/withdrawal', cashierController.registerWithdrawal);

/**
 * @route   POST /api/cashier/close
 * @desc    Fecha o caixa
 * @access  Staff, Admin
 * @body    { cashierId: uuid, closingAmount: number, notes?: string }
 */
router.post('/close', cashierController.closeCashier);

/**
 * @route   GET /api/cashier/history
 * @desc    Busca histórico de caixas
 * @access  Staff, Admin
 * @query   { page?: number, limit?: number, status?: string, startDate?: string, endDate?: string }
 */
router.get('/history', cashierController.getCashierHistory);

/**
 * @route   GET /api/cashier/stats
 * @desc    Busca estatísticas de caixas
 * @access  Staff, Admin
 * @query   { days?: number }
 */
router.get('/stats', cashierController.getCashierStats);

/**
 * @route   GET /api/cashier/:id
 * @desc    Busca detalhes de um caixa específico
 * @access  Staff, Admin
 */
router.get('/:id', cashierController.getCashierDetails);

module.exports = router;

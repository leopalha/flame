const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const splitPaymentController = require('../controllers/splitPaymentController');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireCompleteProfile } = require('../middlewares/profileComplete.middleware');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

// Validações
const createOrderValidation = [
  body('tableId').optional({ nullable: true }).isUUID().withMessage('ID da mesa inválido'), // tableId é opcional para pedidos de balcão
  body('items').isArray({ min: 1 }).withMessage('Pelo menos um item é obrigatório'),
  body('items.*.productId').isUUID().withMessage('ID do produto é obrigatório'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que zero'),
  body('items.*.notes').optional({ nullable: true }).isString(),
  body('paymentMethod').optional({ nullable: true }).isIn([
    'cash', 'card', 'pix', 'credit', 'debit', 'credit_card', 'debit_card', 'pay_later', 'apple_pay', 'card_at_table', 'split'
  ]).withMessage('Método de pagamento inválido'),
  body('notes').optional({ nullable: true }).isString()
];

const updateOrderStatusValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('status').isIn(['pending', 'pending_payment', 'confirmed', 'preparing', 'ready', 'on_way', 'delivered', 'cancelled'])
    .withMessage('Status inválido')
];

// Sprint 58: Adicionado paymentMethod que é obrigatório no frontend do atendente
const confirmAttendantPaymentValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('paymentMethod').isIn(['cash', 'credit', 'debit', 'pix', 'credit_card', 'debit_card'])
    .withMessage('Método de pagamento inválido'),
  body('amountReceived').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Valor recebido inválido'),
  body('change').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Troco inválido')
];


const rateOrderValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Avaliação deve ser entre 1 e 5'),
  body('review').optional().isString()
];

const confirmPaymentValidation = [
  body('orderId').isUUID().withMessage('ID do pedido é obrigatório'),
  body('paymentId').notEmpty().withMessage('ID do pagamento é obrigatório')
];

// ============================================
// IMPORTANTE: Rotas específicas DEVEM vir ANTES de rotas com parâmetros (:id)
// ============================================

// Rotas específicas (sem parâmetros dinâmicos) - DEVEM VIR PRIMEIRO
router.get('/my-orders',
  authenticate,
  orderController.getUserOrders
);

router.get('/dashboard/metrics',
  authenticate,
  orderController.getDashboardMetrics
);

// Listar pedidos aguardando pagamento (para painel do atendente)
router.get('/pending-payments',
  authenticate,
  orderController.getPendingPayments
);

router.get('/',
  authenticate,
  orderController.getAllOrders
);

// Criar pedido
router.post('/',
  authenticate,
  requireCompleteProfile, // Requer perfil completo para fazer pedidos
  createOrderValidation,
  handleValidationErrors,
  orderController.createOrder
);

// ============================================
// Rotas com parâmetros (:id) - DEVEM VIR DEPOIS
// ============================================

router.get('/:id',
  authenticate,
  param('id').isUUID().withMessage('ID inválido'),
  handleValidationErrors,
  orderController.getOrderById
);

router.patch('/:id/cancel',
  authenticate,
  param('id').isUUID().withMessage('ID inválido'),
  handleValidationErrors,
  orderController.cancelOrder
);

router.post('/:id/rate',
  authenticate,
  rateOrderValidation,
  handleValidationErrors,
  orderController.rateOrder
);

// Confirmar pagamento recebido pelo atendente (cash, card_at_table, split)
router.post('/:id/confirm-payment',
  authenticate,
  confirmAttendantPaymentValidation,
  handleValidationErrors,
  orderController.confirmAttendantPayment
);

router.patch('/:id/status',
  authenticate,
  updateOrderStatusValidation,
  handleValidationErrors,
  orderController.updateOrderStatus
);

// Webhook para confirmação de pagamento
// SEGURANÇA: Requer autenticação de admin/sistema ou Stripe webhook signature
router.post('/payment/confirm',
  authenticate, // Agora requer autenticação
  confirmPaymentValidation,
  handleValidationErrors,
  orderController.confirmPayment
);

// ============================================
// SPRINT 60: Split Payment Routes (Divisão de Conta)
// ============================================

const createSplitValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('splitType').isIn(['equal', 'custom']).withMessage('Tipo de divisão inválido'),
  body('participants').optional().isInt({ min: 2 }).withMessage('Mínimo 2 participantes'),
  body('splits').optional().isArray({ min: 2 }).withMessage('Mínimo 2 divisões')
];

const paySplitValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('splitId').isUUID().withMessage('ID da divisão inválido'),
  body('paymentMethod').isIn(['cash', 'credit', 'debit', 'pix', 'card_at_table'])
    .withMessage('Método de pagamento inválido')
];

const assignSplitValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('splitId').isUUID().withMessage('ID da divisão inválido'),
  body('userId').isUUID().withMessage('ID do usuário inválido')
];

// POST /:id/split - Criar divisão
router.post(
  '/:id/split',
  authenticate,
  createSplitValidation,
  handleValidationErrors,
  splitPaymentController.createSplit
);

// GET /:id/split - Ver status
router.get(
  '/:id/split',
  authenticate,
  splitPaymentController.getSplitStatus
);

// POST /:id/split/pay - Pagar parte
router.post(
  '/:id/split/pay',
  authenticate,
  paySplitValidation,
  handleValidationErrors,
  splitPaymentController.paySplit
);

// POST /:id/split/assign - Atribuir a usuário
router.post(
  '/:id/split/assign',
  authenticate,
  assignSplitValidation,
  handleValidationErrors,
  splitPaymentController.assignSplit
);

// DELETE /:id/split - Cancelar divisão
router.delete(
  '/:id/split',
  authenticate,
  splitPaymentController.cancelSplit
);

module.exports = router;
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
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
    'cash', 'card', 'pix', 'credit_card', 'debit_card', 'pay_later', 'apple_pay', 'card_at_table', 'split'
  ]).withMessage('Método de pagamento inválido'),
  body('notes').optional({ nullable: true }).isString()
];

const updateOrderStatusValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('status').isIn(['pending', 'pending_payment', 'confirmed', 'preparing', 'ready', 'on_way', 'delivered', 'cancelled'])
    .withMessage('Status inválido')
];

const confirmAttendantPaymentValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('amountReceived').optional().isFloat({ min: 0 }).withMessage('Valor recebido inválido'),
  body('change').optional().isFloat({ min: 0 }).withMessage('Troco inválido')
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
  // Debug: logar o body antes da validação
  (req, res, next) => {
    console.log('🔍 [DEBUG ORDER] Body recebido:', JSON.stringify(req.body, null, 2));
    console.log('🔍 [DEBUG ORDER] Headers:', JSON.stringify({
      contentType: req.headers['content-type'],
      authorization: req.headers.authorization ? 'Bearer ***' : 'MISSING'
    }));
    next();
  },
  createOrderValidation,
  // Debug: logar erros de validação antes de retornar
  (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ [VALIDATION ERROR] Erros:', JSON.stringify(errors.array(), null, 2));
    }
    next();
  },
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

module.exports = router;
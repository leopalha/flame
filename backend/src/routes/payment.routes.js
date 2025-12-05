/**
 * Payment Routes - FLAME Lounge Bar
 * Rotas para gerenciamento de pagamentos via Stripe
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

// =========================================
// Rotas Públicas
// =========================================

/**
 * GET /api/payments/config
 * Obter configuração pública do Stripe (publishable key)
 */
router.get('/config', paymentController.getConfig);

/**
 * POST /api/payments/webhook
 * Webhook do Stripe - NÃO requer autenticação
 * IMPORTANTE: Body deve ser raw para validar assinatura
 */
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// =========================================
// Rotas Autenticadas (Clientes)
// =========================================

/**
 * POST /api/payments/create-intent
 * Criar Payment Intent para pagamento com cartão
 */
router.post('/create-intent',
  authenticate,
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que zero'),
    body('orderId').optional().isUUID().withMessage('ID do pedido inválido'),
    body('orderNumber').optional().isString()
  ],
  handleValidationErrors,
  paymentController.createPaymentIntent
);

/**
 * POST /api/payments/create-pix
 * Criar Payment Intent para pagamento via PIX
 */
router.post('/create-pix',
  authenticate,
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que zero'),
    body('orderId').optional().isUUID().withMessage('ID do pedido inválido'),
    body('orderNumber').optional().isString()
  ],
  handleValidationErrors,
  paymentController.createPixPayment
);

/**
 * POST /api/payments/confirm
 * Confirmar um pagamento
 */
router.post('/confirm',
  authenticate,
  [
    body('paymentIntentId').notEmpty().withMessage('ID do pagamento é obrigatório'),
    body('paymentMethodId').optional().isString()
  ],
  handleValidationErrors,
  paymentController.confirmPayment
);

/**
 * GET /api/payments/:paymentIntentId/status
 * Obter status de um pagamento
 */
router.get('/:paymentIntentId/status',
  authenticate,
  [
    param('paymentIntentId').notEmpty().withMessage('ID do pagamento é obrigatório')
  ],
  handleValidationErrors,
  paymentController.getPaymentStatus
);

/**
 * GET /api/payments/methods
 * Listar métodos de pagamento salvos do cliente
 */
router.get('/methods',
  authenticate,
  paymentController.listPaymentMethods
);

/**
 * POST /api/payments/calculate-fees
 * Calcular taxas de pagamento (informativo)
 */
router.post('/calculate-fees',
  authenticate,
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que zero'),
    body('method').optional().isIn(['card', 'pix']).withMessage('Método inválido')
  ],
  handleValidationErrors,
  paymentController.calculateFees
);

// =========================================
// Rotas Admin
// =========================================

/**
 * POST /api/payments/:paymentIntentId/cancel
 * Cancelar um pagamento (Admin/Manager)
 */
router.post('/:paymentIntentId/cancel',
  authenticate,
  requireRole(['admin', 'manager', 'cashier']),
  [
    param('paymentIntentId').notEmpty().withMessage('ID do pagamento é obrigatório'),
    body('reason').optional().isIn([
      'requested_by_customer',
      'duplicate',
      'fraudulent',
      'abandoned'
    ]).withMessage('Motivo inválido')
  ],
  handleValidationErrors,
  paymentController.cancelPayment
);

/**
 * POST /api/payments/:paymentIntentId/refund
 * Criar reembolso (Admin/Manager)
 */
router.post('/:paymentIntentId/refund',
  authenticate,
  requireRole(['admin', 'manager']),
  [
    param('paymentIntentId').notEmpty().withMessage('ID do pagamento é obrigatório'),
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Valor do reembolso inválido'),
    body('reason').optional().isIn([
      'requested_by_customer',
      'duplicate',
      'fraudulent'
    ]).withMessage('Motivo inválido')
  ],
  handleValidationErrors,
  paymentController.createRefund
);

module.exports = router;

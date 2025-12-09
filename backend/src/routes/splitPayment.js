const express = require('express');
const router = express.Router();
const splitPaymentController = require('../controllers/splitPaymentController');
const { authenticate } = require('../middlewares/auth.middleware');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

// Validações
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

// POST /orders/:id/split - Criar divisão
router.post(
  '/:id/split',
  authenticate,
  createSplitValidation,
  handleValidationErrors,
  splitPaymentController.createSplit
);

// GET /orders/:id/split - Ver status
router.get(
  '/:id/split',
  authenticate,
  splitPaymentController.getSplitStatus
);

// POST /orders/:id/split/pay - Pagar parte
router.post(
  '/:id/split/pay',
  authenticate,
  paySplitValidation,
  handleValidationErrors,
  splitPaymentController.paySplit
);

// POST /orders/:id/split/assign - Atribuir a usuário
router.post(
  '/:id/split/assign',
  authenticate,
  assignSplitValidation,
  handleValidationErrors,
  splitPaymentController.assignSplit
);

// DELETE /orders/:id/split - Cancelar divisão
router.delete(
  '/:id/split',
  authenticate,
  splitPaymentController.cancelSplit
);

module.exports = router;

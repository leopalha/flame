const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/auth.middleware');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

// Validações
const createOrderValidation = [
  body('tableId').isUUID().withMessage('ID da mesa é obrigatório'),
  body('items').isArray({ min: 1 }).withMessage('Pelo menos um item é obrigatório'),
  body('items.*.productId').isUUID().withMessage('ID do produto é obrigatório'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que zero'),
  body('items.*.notes').optional().isString(),
  body('paymentMethod').optional().isIn(['cash', 'card', 'pix']).withMessage('Método de pagamento inválido'),
  body('notes').optional().isString()
];

const updateOrderStatusValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'on_way', 'delivered', 'cancelled'])
    .withMessage('Status inválido')
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

// Rotas para clientes
router.post('/',
  authenticate,
  createOrderValidation,
  handleValidationErrors,
  orderController.createOrder
);

router.get('/my-orders', 
  authenticate,
  orderController.getUserOrders
);

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

// Rotas para funcionários
router.get('/', 
  authenticate,
  orderController.getAllOrders
);

router.patch('/:id/status',
  authenticate,
  updateOrderStatusValidation,
  handleValidationErrors,
  orderController.updateOrderStatus
);

router.get('/dashboard/metrics',
  authenticate,
  orderController.getDashboardMetrics
);

// Webhook para confirmação de pagamento
router.post('/payment/confirm',
  confirmPaymentValidation,
  handleValidationErrors,
  orderController.confirmPayment
);

module.exports = router;
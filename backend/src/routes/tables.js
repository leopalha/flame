const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { authenticate } = require('../middlewares/auth.middleware');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

// Validações
const createTableValidation = [
  body('number').isInt({ min: 1 }).withMessage('Número da mesa deve ser maior que zero'),
  body('name').optional().isString(),
  body('capacity').isInt({ min: 1 }).withMessage('Capacidade deve ser maior que zero'),
  body('area').optional().isString(),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
  body('x').optional().isNumeric(),
  body('y').optional().isNumeric()
];

const updateTableValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('number').optional().isInt({ min: 1 }).withMessage('Número da mesa deve ser maior que zero'),
  body('name').optional().isString(),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacidade deve ser maior que zero'),
  body('area').optional().isString(),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
  body('x').optional().isNumeric(),
  body('y').optional().isNumeric()
];

const updateTableStatusValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('status').isIn(['available', 'occupied', 'reserved', 'cleaning', 'unavailable'])
    .withMessage('Status inválido')
];

const reserveTableValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('customerName').notEmpty().withMessage('Nome do cliente é obrigatório'),
  body('customerPhone').notEmpty().withMessage('Telefone do cliente é obrigatório'),
  body('reservationTime').optional().isISO8601().withMessage('Data/hora de reserva inválida'),
  body('notes').optional().isString()
];

// Rotas públicas
router.get('/number/:number', 
  param('number').isInt({ min: 1 }).withMessage('Número da mesa inválido'),
  handleValidationErrors,
  tableController.getTableByNumber
);

// Rotas protegidas
router.get('/', 
  authenticate,
  tableController.getAllTables
);

router.get('/stats', 
  authenticate,
  tableController.getTablesStats
);

router.get('/areas', 
  authenticate,
  tableController.getAreas
);

router.get('/:id', 
  authenticate,
  param('id').isUUID().withMessage('ID inválido'),
  handleValidationErrors,
  tableController.getTableById
);

router.post('/', 
  authenticate,
  createTableValidation,
  handleValidationErrors,
  tableController.createTable
);

router.put('/:id', 
  authenticate,
  updateTableValidation,
  handleValidationErrors,
  tableController.updateTable
);

router.delete('/:id', 
  authenticate,
  param('id').isUUID().withMessage('ID inválido'),
  handleValidationErrors,
  tableController.deleteTable
);

router.patch('/:id/toggle-status', 
  authenticate,
  param('id').isUUID().withMessage('ID inválido'),
  handleValidationErrors,
  tableController.toggleTableStatus
);

router.patch('/:id/status', 
  authenticate,
  updateTableStatusValidation,
  handleValidationErrors,
  tableController.updateTableStatus
);

router.post('/:id/reserve', 
  authenticate,
  reserveTableValidation,
  handleValidationErrors,
  tableController.reserveTable
);

router.delete('/:id/reservation', 
  authenticate,
  param('id').isUUID().withMessage('ID inválido'),
  handleValidationErrors,
  tableController.cancelReservation
);

router.post('/:id/qrcode', 
  authenticate,
  param('id').isUUID().withMessage('ID inválido'),
  handleValidationErrors,
  tableController.generateQRCode
);

module.exports = router;
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/auth.middleware');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

// Middleware para verificar se é admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};

// Validações
const createEmployeeValidation = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('celular').notEmpty().withMessage('Celular é obrigatório'),
  body('role').isIn(['attendant', 'kitchen', 'manager', 'admin']).withMessage('Role inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

const updateUserValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('nome').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('celular').optional().notEmpty().withMessage('Celular não pode estar vazio'),
  body('role').optional().isIn(['customer', 'attendant', 'kitchen', 'manager', 'admin']).withMessage('Role inválido'),
  body('password').optional().isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('isActive').optional().isBoolean()
];

// Dashboard principal
router.get('/dashboard', 
  authenticate,
  adminAuth,
  adminController.getDashboard
);

// Relatórios de vendas
router.get('/reports/sales', 
  authenticate,
  adminAuth,
  query('startDate').optional().isISO8601().withMessage('Data de início inválida'),
  query('endDate').optional().isISO8601().withMessage('Data de fim inválida'),
  query('groupBy').optional().isIn(['hour', 'day', 'week', 'month']).withMessage('Agrupamento inválido'),
  handleValidationErrors,
  adminController.getSalesReport
);

// Gerenciamento de usuários
router.get('/users', 
  authenticate,
  adminAuth,
  adminController.getUsers
);

router.post('/employees', 
  authenticate,
  adminAuth,
  createEmployeeValidation,
  handleValidationErrors,
  adminController.createEmployee
);

router.put('/users/:id', 
  authenticate,
  adminAuth,
  updateUserValidation,
  handleValidationErrors,
  adminController.updateUser
);

router.patch('/users/:id/toggle-status', 
  authenticate,
  adminAuth,
  param('id').isUUID().withMessage('ID inválido'),
  handleValidationErrors,
  adminController.toggleUserStatus
);

// Configurações do sistema
router.get('/settings', 
  authenticate,
  adminAuth,
  adminController.getSystemSettings
);

// Logs do sistema
router.get('/logs', 
  authenticate,
  adminAuth,
  adminController.getSystemLogs
);

// Backup
router.post('/backup', 
  authenticate,
  adminAuth,
  adminController.createBackup
);

// Estatísticas avançadas
router.get('/stats/advanced', 
  authenticate,
  adminAuth,
  query('period').optional().isInt({ min: 1 }).withMessage('Período inválido'),
  handleValidationErrors,
  adminController.getAdvancedStats
);

module.exports = router;
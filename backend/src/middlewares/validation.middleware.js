const { body, param, query, validationResult } = require('express-validator');

// Middleware para capturar erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Log detalhado para debug
    console.log('❌ [VALIDATION] Erros de validação:', {
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      errors: errors.array()
    });

    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }

  next();
};

// Validações para usuário
const validateUserRegistration = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[A-Za-zÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),

  body('cpf')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    .withMessage('CPF deve estar no formato 000.000.000-00')
    .custom((value) => {
      // Validação básica de CPF
      const cpf = value.replace(/\D/g, '');
      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        throw new Error('CPF inválido');
      }
      return true;
    }),

  body('email')
    .isEmail()
    .withMessage('Email deve ter formato válido')
    .normalizeEmail(),

  body('celular')
    .custom((value) => {
      // Aceitar formato internacional: +CodigoPais seguido de 7-14 dígitos
      // Exemplos: +5521999999999, +14155551234, +351912345678
      const intlFormat = /^\+\d{1,4}\d{7,14}$/;

      if (!intlFormat.test(value)) {
        throw new Error('Celular deve estar no formato internacional: +5521999999999');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),

  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido'),

  body('identifier')
    .optional()
    .notEmpty()
    .withMessage('Email ou celular é obrigatório'),

  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),

  handleValidationErrors
];

const validateSMSCode = [
  body('celular')
    .custom((value) => {
      // Aceitar formato internacional: +CodigoPais seguido de 7-14 dígitos
      const intlFormat = /^\+\d{1,4}\d{7,14}$/;

      if (!intlFormat.test(value)) {
        throw new Error('Celular deve estar no formato internacional: +5521999999999');
      }
      return true;
    }),

  body('code')
    .matches(/^\d{6}$/)
    .withMessage('Código deve ter 6 dígitos'),

  handleValidationErrors
];

// Validações para produtos
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome do produto deve ter entre 2 e 100 caracteres'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Descrição deve ter no máximo 500 caracteres'),
    
  body('price')
    .isNumeric({ min: 0.01 })
    .withMessage('Preço deve ser um número positivo'),
    
  body('category')
    .isIn([
      'bebidas_alcoolicas',
      'bebidas_nao_alcoolicas', 
      'drinks_autorais',
      'petiscos',
      'pratos_principais',
      'sobremesas',
      'porcoes',
      'combos'
    ])
    .withMessage('Categoria inválida'),
    
  body('preparationTime')
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage('Tempo de preparo deve estar entre 1 e 120 minutos'),
    
  handleValidationErrors
];

// Validações para pedidos
const validateOrder = [
  body('tableId')
    .isUUID(4)
    .withMessage('ID da mesa deve ser um UUID válido'),
    
  body('items')
    .isArray({ min: 1 })
    .withMessage('Pedido deve conter pelo menos um item'),
    
  body('items.*.productId')
    .isUUID(4)
    .withMessage('ID do produto deve ser um UUID válido'),
    
  body('items.*.quantity')
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantidade deve estar entre 1 e 50'),
    
  body('paymentMethod')
    .optional()
    .isIn(['credit_card', 'debit_card', 'pix', 'apple_pay', 'cash', 'pay_later', 'card', 'card_at_table', 'split'])
    .withMessage('Método de pagamento inválido'),
    
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Observações devem ter no máximo 500 caracteres'),
    
  handleValidationErrors
];

// Validações para atualização de status do pedido
const validateOrderStatus = [
  body('status')
    .isIn(['pending', 'pending_payment', 'confirmed', 'preparing', 'ready', 'on_way', 'delivered', 'cancelled'])
    .withMessage('Status inválido'),

  handleValidationErrors
];

// Validações para mesas
const validateTable = [
  body('number')
    .isInt({ min: 1, max: 999 })
    .withMessage('Número da mesa deve estar entre 1 e 999'),
    
  body('capacity')
    .isInt({ min: 1, max: 20 })
    .withMessage('Capacidade deve estar entre 1 e 20 pessoas'),
    
  body('location')
    .optional()
    .isIn(['interno', 'externo', 'balcao', 'vip', 'reservado'])
    .withMessage('Localização inválida'),
    
  handleValidationErrors
];

// Validações para avaliação
const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Avaliação deve estar entre 1 e 5'),
    
  body('review')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comentário deve ter no máximo 1000 caracteres'),
    
  handleValidationErrors
];

// Validações para parâmetros de URL
const validateUUID = (paramName) => [
  param(paramName)
    .isUUID(4)
    .withMessage(`${paramName} deve ser um UUID válido`),
    
  handleValidationErrors
];

// Validações para query parameters
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número positivo'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve estar entre 1 e 100'),
    
  handleValidationErrors
];

// Validar filtros de produto
const validateProductFilters = [
  query('category')
    .optional()
    .isIn([
      'bebidas_alcoolicas',
      'bebidas_nao_alcoolicas', 
      'drinks_autorais',
      'petiscos',
      'pratos_principais',
      'sobremesas',
      'porcoes',
      'combos'
    ])
    .withMessage('Categoria inválida'),
    
  query('dietary')
    .optional()
    .isIn(['vegetariano', 'vegano', 'sem_lactose', 'sem_gluten'])
    .withMessage('Filtro dietary inválido'),
    
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Busca deve ter entre 2 e 50 caracteres'),
    
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateSMSCode,
  validateProduct,
  validateOrder,
  validateOrderStatus,
  validateTable,
  validateRating,
  validateUUID,
  validatePagination,
  validateProductFilters
};
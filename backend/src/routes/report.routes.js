const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// Todas as rotas de relatórios exigem autenticação e role staff/admin
router.use(authenticate);
router.use(requireRole(['staff', 'admin']));

/**
 * @route   GET /api/reports/dashboard
 * @desc    Dashboard consolidado com resumo de todos os relatórios
 * @access  Staff/Admin
 * @query   days - Número de dias para análise (default: 30)
 */
router.get('/dashboard', reportController.getDashboard);

/**
 * @route   GET /api/reports/sales
 * @desc    Relatório de vendas com agrupamento por período
 * @access  Staff/Admin
 * @query   startDate - Data inicial (YYYY-MM-DD)
 * @query   endDate - Data final (YYYY-MM-DD)
 * @query   groupBy - Agrupamento: hour, day, week, month (default: day)
 */
router.get('/sales', reportController.getSalesReport);

/**
 * @route   GET /api/reports/products
 * @desc    Ranking de produtos mais vendidos
 * @access  Staff/Admin
 * @query   startDate - Data inicial (YYYY-MM-DD)
 * @query   endDate - Data final (YYYY-MM-DD)
 * @query   limit - Quantidade de produtos no ranking (default: 20)
 */
router.get('/products', reportController.getProductsReport);

/**
 * @route   GET /api/reports/categories
 * @desc    Vendas agregadas por categoria de produto
 * @access  Staff/Admin
 * @query   startDate - Data inicial (YYYY-MM-DD)
 * @query   endDate - Data final (YYYY-MM-DD)
 */
router.get('/categories', reportController.getCategoriesReport);

/**
 * @route   GET /api/reports/hourly
 * @desc    Análise de vendas por hora do dia
 * @access  Staff/Admin
 * @query   startDate - Data inicial (YYYY-MM-DD)
 * @query   endDate - Data final (YYYY-MM-DD)
 */
router.get('/hourly', reportController.getHourlyReport);

/**
 * @route   GET /api/reports/dre
 * @desc    DRE Simplificado (Demonstração de Resultado)
 * @access  Staff/Admin
 * @query   startDate - Data inicial (YYYY-MM-DD)
 * @query   endDate - Data final (YYYY-MM-DD)
 */
router.get('/dre', reportController.getDREReport);

module.exports = router;

const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventoryController');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');

// Todas as rotas de inventário requerem autenticação e permissão de admin
router.use(authenticate);
router.use(requireAdmin);

// GET /api/inventory/dashboard - Resumo para admin
router.get('/dashboard', InventoryController.getDashboard);

// GET /api/inventory/movements - Histórico paginado
router.get('/movements', InventoryController.getMovements);

// GET /api/inventory/products/:productId/movements - Movimentos de um produto
router.get('/products/:productId/movements', InventoryController.getProductMovements);

// GET /api/inventory/alerts - Produtos com estoque baixo
router.get('/alerts', InventoryController.getAlerts);

// GET /api/inventory/report - Relatório completo
router.get('/report', InventoryController.getReport);

// POST /api/inventory/adjust - Ajuste manual
router.post('/adjust', InventoryController.adjustStock);

// GET /api/inventory/forecast - Previsão de falta
router.get('/forecast', InventoryController.getForecast);

// GET /api/inventory/consumption - Análise de consumo
router.get('/consumption', InventoryController.getConsumption);

module.exports = router;

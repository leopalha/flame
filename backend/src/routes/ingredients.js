/**
 * Ingredients Routes - FLAME Lounge Bar
 * Rotas para gerenciamento de insumos e ficha técnica
 *
 * IMPORTANTE: Rotas específicas DEVEM vir ANTES de rotas com parâmetros (:id)
 */

const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

// Middleware: todas as rotas requerem autenticação
router.use(authenticate);

// ============================================
// ROTAS ESPECÍFICAS - DEVEM VIR PRIMEIRO
// ============================================

// ============== CATEGORIAS ==============

// Listar categorias (admin, gerente, cozinha, bar)
router.get('/categories',
  requireRole(['admin', 'gerente', 'cozinha', 'bar']),
  ingredientController.getCategories
);

// ============== ESTOQUE GERAL ==============

// Listar insumos com estoque baixo (admin, gerente, cozinha, bar)
router.get('/low-stock',
  requireRole(['admin', 'gerente', 'cozinha', 'bar']),
  ingredientController.getLowStock
);

// ============== FICHA TÉCNICA (RECIPE) ==============
// IMPORTANTE: Estas rotas devem vir ANTES de /:id

// Listar ficha técnica de um produto
router.get('/recipe/product/:productId',
  requireRole(['admin', 'gerente', 'cozinha', 'bar']),
  ingredientController.getProductRecipe
);

// Verificar disponibilidade de estoque para produzir produto
router.get('/recipe/product/:productId/availability',
  requireRole(['admin', 'gerente', 'cozinha', 'bar']),
  ingredientController.checkAvailability
);

// Adicionar item à ficha técnica (apenas admin, gerente)
router.post('/recipe/product/:productId/items',
  requireRole(['admin', 'gerente']),
  ingredientController.addRecipeItem
);

// Atualizar item da ficha técnica (apenas admin, gerente)
router.put('/recipe/items/:itemId',
  requireRole(['admin', 'gerente']),
  ingredientController.updateRecipeItem
);

// Remover item da ficha técnica (apenas admin, gerente)
router.delete('/recipe/items/:itemId',
  requireRole(['admin', 'gerente']),
  ingredientController.removeRecipeItem
);

// ============== RELATÓRIOS ==============
// IMPORTANTE: Estas rotas devem vir ANTES de /:id

// Relatório de CMV (admin, gerente)
router.get('/reports/cmv',
  requireRole(['admin', 'gerente']),
  ingredientController.getCMVReport
);

// ============================================
// ROTAS BASE DE INSUMOS
// ============================================

// Listar todos os insumos (admin, gerente, cozinha, bar)
router.get('/',
  requireRole(['admin', 'gerente', 'cozinha', 'bar']),
  ingredientController.getAllIngredients
);

// Criar insumo (apenas admin, gerente)
router.post('/',
  requireRole(['admin', 'gerente']),
  ingredientController.createIngredient
);

// ============================================
// ROTAS COM PARÂMETRO :id - DEVEM VIR POR ÚLTIMO
// ============================================

// Buscar insumo por ID (admin, gerente, cozinha, bar)
router.get('/:id',
  requireRole(['admin', 'gerente', 'cozinha', 'bar']),
  ingredientController.getIngredientById
);

// Atualizar insumo (apenas admin, gerente)
router.put('/:id',
  requireRole(['admin', 'gerente']),
  ingredientController.updateIngredient
);

// Desativar insumo (apenas admin, gerente)
router.patch('/:id/deactivate',
  requireRole(['admin', 'gerente']),
  ingredientController.deactivateIngredient
);

// ============== ESTOQUE POR INSUMO ==============

// Histórico de movimentações (admin, gerente, cozinha, bar)
router.get('/:id/movements',
  requireRole(['admin', 'gerente', 'cozinha', 'bar']),
  ingredientController.getMovements
);

// Adicionar estoque - entrada (admin, gerente)
router.post('/:id/stock/add',
  requireRole(['admin', 'gerente']),
  ingredientController.addStock
);

// Ajustar estoque - inventário (admin, gerente)
router.post('/:id/stock/adjust',
  requireRole(['admin', 'gerente']),
  ingredientController.adjustStock
);

// Registrar perda (admin, gerente, cozinha, bar)
router.post('/:id/stock/loss',
  requireRole(['admin', 'gerente', 'cozinha', 'bar']),
  ingredientController.registerLoss
);

module.exports = router;

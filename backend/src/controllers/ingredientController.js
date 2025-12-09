/**
 * Ingredient Controller - FLAME Lounge Bar
 * Gerencia endpoints de insumos e ficha técnica
 */

const { Ingredient, RecipeItem, IngredientMovement, Product } = require('../models');
const ingredientService = require('../services/ingredient.service');
const { Op } = require('sequelize');

class IngredientController {
  // ============== INSUMOS ==============

  /**
   * Listar todos os insumos
   */
  async getAllIngredients(req, res) {
    try {
      const { category, active, lowStock, search, page = 1, limit = 50 } = req.query;

      const where = {};

      if (category) where.category = category;
      if (active !== undefined) where.isActive = active === 'true';
      if (search) {
        where.name = { [Op.like]: `%${search}%` };
      }

      let ingredients = await Ingredient.findAll({
        where,
        order: [['name', 'ASC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      // Filtrar por estoque baixo se solicitado
      if (lowStock === 'true') {
        ingredients = ingredients.filter(i => i.isLowStock());
      }

      const total = await Ingredient.count({ where });

      res.json({
        success: true,
        data: {
          ingredients,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('[INGREDIENT] Erro ao listar:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Buscar insumo por ID
   */
  async getIngredientById(req, res) {
    try {
      const ingredient = await Ingredient.findByPk(req.params.id, {
        include: [{
          model: IngredientMovement,
          as: 'movements',
          limit: 20,
          order: [['createdAt', 'DESC']]
        }]
      });

      if (!ingredient) {
        return res.status(404).json({ success: false, message: 'Insumo não encontrado' });
      }

      res.json({ success: true, data: { ingredient } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Criar novo insumo
   */
  async createIngredient(req, res) {
    try {
      const ingredient = await Ingredient.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Insumo criado com sucesso',
        data: { ingredient }
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Atualizar insumo
   */
  async updateIngredient(req, res) {
    try {
      const ingredient = await Ingredient.findByPk(req.params.id);

      if (!ingredient) {
        return res.status(404).json({ success: false, message: 'Insumo não encontrado' });
      }

      await ingredient.update(req.body);

      res.json({
        success: true,
        message: 'Insumo atualizado',
        data: { ingredient }
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Desativar insumo
   */
  async deactivateIngredient(req, res) {
    try {
      const ingredient = await Ingredient.findByPk(req.params.id);

      if (!ingredient) {
        return res.status(404).json({ success: false, message: 'Insumo não encontrado' });
      }

      await ingredient.update({ isActive: false });

      res.json({ success: true, message: 'Insumo desativado' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ============== ESTOQUE ==============

  /**
   * Adicionar estoque (entrada)
   */
  async addStock(req, res) {
    try {
      const { quantity, unitCost, description, invoiceNumber, expirationDate, batchNumber } = req.body;

      const result = await ingredientService.addStock(
        req.params.id,
        quantity,
        unitCost,
        req.user.id,
        { description, invoiceNumber, expirationDate, batchNumber }
      );

      if (!result.success) {
        return res.status(400).json({ success: false, message: result.error });
      }

      res.json({
        success: true,
        message: 'Estoque adicionado',
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Ajustar estoque (inventário)
   */
  async adjustStock(req, res) {
    try {
      const { newQuantity, reason, description } = req.body;

      // Validação de quantidade negativa
      if (newQuantity === undefined || newQuantity === null || isNaN(parseFloat(newQuantity))) {
        return res.status(400).json({
          success: false,
          message: 'Nova quantidade é obrigatória e deve ser um número'
        });
      }

      if (parseFloat(newQuantity) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantidade não pode ser negativa'
        });
      }

      const result = await ingredientService.adjustStock(
        req.params.id,
        newQuantity,
        reason,
        req.user.id,
        description
      );

      if (!result.success) {
        return res.status(400).json({ success: false, message: result.error });
      }

      res.json({
        success: true,
        message: 'Estoque ajustado',
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Registrar perda
   */
  async registerLoss(req, res) {
    try {
      const { quantity, reason, description } = req.body;

      const result = await ingredientService.registerLoss(
        req.params.id,
        quantity,
        reason,
        req.user.id,
        description
      );

      if (!result.success) {
        return res.status(400).json({ success: false, message: result.error });
      }

      res.json({
        success: true,
        message: 'Perda registrada',
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Listar insumos com estoque baixo
   */
  async getLowStock(req, res) {
    try {
      const ingredients = await ingredientService.getLowStockIngredients();

      res.json({
        success: true,
        data: {
          ingredients,
          count: ingredients.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Histórico de movimentações
   */
  async getMovements(req, res) {
    try {
      const { type, reason, startDate, endDate, page = 1, limit = 50 } = req.query;

      const where = { ingredientId: req.params.id };

      if (type) where.type = type;
      if (reason) where.reason = reason;
      if (startDate && endDate) {
        where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      const movements = await IngredientMovement.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      res.json({
        success: true,
        data: { movements }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ============== FICHA TÉCNICA ==============

  /**
   * Listar ficha técnica de um produto
   */
  async getProductRecipe(req, res) {
    try {
      const recipe = await RecipeItem.findAll({
        where: { productId: req.params.productId },
        include: [{
          model: Ingredient,
          as: 'ingredient',
          attributes: ['id', 'name', 'unit', 'currentStock', 'costPerUnit']
        }]
      });

      // Calcular custo total
      const cost = await ingredientService.calculateProductCost(req.params.productId);

      res.json({
        success: true,
        data: {
          recipe,
          totalCost: cost,
          itemCount: recipe.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Adicionar item à ficha técnica
   */
  async addRecipeItem(req, res) {
    try {
      const { ingredientId, quantity, unit, isOptional, notes, preparationNotes } = req.body;

      // Verificar se já existe
      const existing = await RecipeItem.findOne({
        where: {
          productId: req.params.productId,
          ingredientId
        }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Este insumo já está na ficha técnica'
        });
      }

      const item = await RecipeItem.create({
        productId: req.params.productId,
        ingredientId,
        quantity,
        unit,
        isOptional,
        notes,
        preparationNotes
      });

      res.status(201).json({
        success: true,
        message: 'Item adicionado à ficha técnica',
        data: { item }
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Atualizar item da ficha técnica
   */
  async updateRecipeItem(req, res) {
    try {
      const item = await RecipeItem.findByPk(req.params.itemId);

      if (!item) {
        return res.status(404).json({ success: false, message: 'Item não encontrado' });
      }

      await item.update(req.body);

      res.json({
        success: true,
        message: 'Item atualizado',
        data: { item }
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Remover item da ficha técnica
   */
  async removeRecipeItem(req, res) {
    try {
      const item = await RecipeItem.findByPk(req.params.itemId);

      if (!item) {
        return res.status(404).json({ success: false, message: 'Item não encontrado' });
      }

      await item.destroy();

      res.json({ success: true, message: 'Item removido da ficha técnica' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Verificar disponibilidade de estoque para um produto
   */
  async checkAvailability(req, res) {
    try {
      const { quantity = 1 } = req.query;

      const result = await ingredientService.checkStockAvailability(
        req.params.productId,
        parseInt(quantity)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ============== RELATÓRIOS ==============

  /**
   * Relatório de CMV
   */
  async getCMVReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Informe startDate e endDate'
        });
      }

      const report = await ingredientService.getCMVReport(
        new Date(startDate),
        new Date(endDate)
      );

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Categorias de insumos
   */
  async getCategories(req, res) {
    try {
      const categories = await Ingredient.findAll({
        attributes: ['category'],
        group: ['category'],
        where: { isActive: true }
      });

      res.json({
        success: true,
        data: {
          categories: categories.map(c => c.category)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new IngredientController();

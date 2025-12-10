const { Product, sequelize } = require('../models');
const { Op } = require('sequelize');
const InventoryService = require('../services/inventoryService');

class ProductController {
  // Listar todos os produtos (com filtros)
  async getAllProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        search,
        dietary,
        minPrice,
        maxPrice,
        isActive = true,
        sortBy = 'position',
        sortOrder = 'ASC'
      } = req.query;

      // Construir filtros
      const where = {};

      // Se isActive for 'all', não filtra por status (admin vê todos)
      // Caso contrário, filtra normalmente
      if (isActive !== 'all') {
        where.isActive = isActive === 'true' || isActive === true;
      }

      if (category) {
        where.category = category;
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { ingredients: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (dietary) {
        where.dietary = { [Op.contains]: [dietary] };
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
      }

      // Paginação
      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Buscar produtos
      const { count, rows: products } = await Product.findAndCountAll({
        where,
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: offset
      });

      // Calcular metadata de paginação
      const totalPages = Math.ceil(count / parseInt(limit));
      const hasNextPage = parseInt(page) < totalPages;
      const hasPreviousPage = parseInt(page) > 1;

      res.status(200).json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalProducts: count,
            productsPerPage: parseInt(limit),
            hasNextPage,
            hasPreviousPage
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar produto por ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findOne({
        where: { 
          id,
          isActive: true
        }
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: { product }
      });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Criar produto (Admin apenas)
  async createProduct(req, res) {
    try {
      const {
        name,
        description,
        price,
        category,
        subcategory,
        image,
        ingredients,
        allergens = [],
        dietary = [],
        preparationTime = 15,
        calories,
        isPromotional = false,
        discountPercentage,
        hasStock = false,
        stock,
        minStock = 5,
        tags = [],
        isSignature = false,
        alcoholicContent,
        volume,
        spiceLevel
      } = req.body;

      const product = await Product.create({
        name,
        description,
        price,
        category,
        subcategory,
        image,
        ingredients,
        allergens,
        dietary,
        preparationTime,
        calories,
        isPromotional,
        discountPercentage,
        hasStock,
        stock,
        minStock,
        tags,
        isSignature,
        alcoholicContent,
        volume,
        spiceLevel,
        position: await Product.count() + 1 // Auto-increment position
      });

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: { product }
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar produto (Admin apenas)
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      await product.update(updates);

      res.status(200).json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: { product }
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Desativar produto (não deletar)
  async deactivateProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      await product.update({ isActive: false });

      res.status(200).json({
        success: true,
        message: 'Produto desativado com sucesso',
        data: { product }
      });
    } catch (error) {
      console.error('Erro ao desativar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Reativar produto
  async activateProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      await product.update({ isActive: true });

      res.status(200).json({
        success: true,
        message: 'Produto reativado com sucesso',
        data: { product }
      });
    } catch (error) {
      console.error('Erro ao reativar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Listar categorias disponíveis
  async getCategories(req, res) {
    try {
      const categories = await Product.findAll({
        attributes: ['category'],
        where: { isActive: true },
        group: ['category'],
        raw: true
      });

      const categoryList = categories.map(cat => cat.category);

      res.status(200).json({
        success: true,
        data: { categories: categoryList }
      });
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Produtos em destaque
  async getFeaturedProducts(req, res) {
    try {
      const { limit = 6 } = req.query;

      const products = await Product.findAll({
        where: { 
          isActive: true,
          [Op.or]: [
            { isSignature: true },
            { isPromotional: true }
          ]
        },
        order: [['position', 'ASC']],
        limit: parseInt(limit)
      });

      res.status(200).json({
        success: true,
        data: { products }
      });
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar estoque
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { stock, reason, notes } = req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      if (!product.hasStock) {
        return res.status(400).json({
          success: false,
          message: 'Este produto não controla estoque'
        });
      }

      const newStock = parseInt(stock);
      const previousStock = product.stock || 0;

      await product.update({ stock: newStock });

      // Registrar movimento de ajuste
      try {
        await InventoryService.recordMovement(
          id,
          'ajuste',
          newStock, // Para ajuste, quantity é o novo valor absoluto
          reason || 'ajuste_inventario',
          notes || `Ajuste manual de ${previousStock} para ${newStock}`,
          req.user?.id // ID do usuário autenticado (se disponível)
        );
      } catch (inventoryError) {
        console.error('Erro ao registrar movimento de estoque:', inventoryError);
        // Não falha a atualização se houver erro no registro
      }

      res.status(200).json({
        success: true,
        message: 'Estoque atualizado com sucesso',
        data: {
          product: {
            id: product.id,
            name: product.name,
            stock: product.stock,
            minStock: product.minStock
          }
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Produtos com estoque baixo
  async getLowStockProducts(req, res) {
    try {
      const products = await Product.findAll({
        where: {
          isActive: true,
          hasStock: true,
          [Op.and]: [
            { stock: { [Op.lte]: sequelize.col('minStock') } }
          ]
        },
        order: [['stock', 'ASC']]
      });

      res.status(200).json({
        success: true,
        data: { products }
      });
    } catch (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Alias para compatibilidade com rotas
  getProducts = this.getAllProducts;
}

module.exports = new ProductController();
const { Order, OrderItem, Product, Table, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const smsService = require('../services/sms.service');
const pushService = require('../services/push.service');

class StaffController {
  /**
   * GET /api/staff/dashboard
   * Dashboard com resumo baseado no role do usuário
   */
  static async getDashboard(req, res) {
    try {
      const { role } = req.user;

      // Filtrar pedidos por categoria baseado no role
      const filterOrdersByCategory = (orders) => {
        if (role === 'bar' || role === 'barman') {
          // Bar: apenas pedidos com bebidas ou narguilé
          return orders.filter(order => {
            return order.items && order.items.some(item => {
              const category = item.productCategory?.toLowerCase() || '';
              return category.includes('bebida') || category.includes('drink') ||
                     category.includes('nargui') || category.includes('hookah');
            });
          });
        } else if (role === 'cozinha') {
          // Cozinha: apenas pedidos com comida (NÃO bebidas/narguilé)
          return orders.filter(order => {
            return order.items && order.items.some(item => {
              const category = item.productCategory?.toLowerCase() || '';
              return !category.includes('bebida') && !category.includes('drink') &&
                     !category.includes('nargui') && !category.includes('hookah');
            });
          });
        }
        // Admin e atendente veem TODOS os pedidos
        return orders;
      };

      // Buscar pedidos pendentes e em preparação
      let pendingOrders = await Order.findAll({
        where: {
          status: { [Op.in]: ['pending', 'confirmed'] }
        },
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        order: [['createdAt', 'ASC']],
        limit: 50
      });

      let preparingOrders = await Order.findAll({
        where: { status: 'preparing' },
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        order: [['createdAt', 'ASC']],
        limit: 50
      });

      let readyOrders = await Order.findAll({
        where: { status: 'ready' },
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        order: [['createdAt', 'ASC']],
        limit: 50
      });

      // Aplicar filtro de categoria
      pendingOrders = filterOrdersByCategory(pendingOrders);
      preparingOrders = filterOrdersByCategory(preparingOrders);
      readyOrders = filterOrdersByCategory(readyOrders);

      // Calcular estatísticas
      const totalOrders = await Order.count();
      const completedToday = await Order.count({
        where: {
          status: 'delivered',
          createdAt: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      });

      // Calcular pedidos atrasados (>15 min)
      const delayedOrders = pendingOrders.filter(order => {
        const createdTime = new Date(order.createdAt);
        const now = new Date();
        const diffMinutes = (now - createdTime) / (1000 * 60);
        return diffMinutes > 15;
      });

      res.json({
        success: true,
        data: {
          userRole: role,
          stats: {
            total: totalOrders,
            completedToday,
            delayed: delayedOrders.length,
            pending: pendingOrders.length,
            preparing: preparingOrders.length,
            ready: readyOrders.length
          },
          orders: {
            pending: pendingOrders,
            preparing: preparingOrders,
            ready: readyOrders
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/staff/orders
   * Buscar pedidos com filtros
   */
  static async getOrders(req, res) {
    try {
      const { status = 'pending,preparing', limit = 50, offset = 0 } = req.query;

      const statuses = status.split(',').map(s => s.trim());

      const { rows, count } = await Order.findAndCountAll({
        where: {
          status: { [Op.in]: statuses }
        },
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['name', 'category']
              }
            ]
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        order: [['createdAt', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          orders: rows,
          pagination: {
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/staff/orders/:id/details
   * Detalhes completos de um pedido
   */
  static async getOrderDetails(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          },
          {
            model: Table,
            as: 'table'
          },
          {
            model: User,
            as: 'customer',
            attributes: ['nome', 'celular']
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      res.json({
        success: true,
        data: { order }
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /api/staff/orders/:id/status
   * Atualizar status do pedido
   */
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      // Validar status permitido
      const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status inválido'
        });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      // Atualizar status
      await order.update({
        status,
        notes: notes || order.notes
      });

      res.json({
        success: true,
        message: 'Status atualizado com sucesso',
        data: { order }
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/staff/alerts
   * Alertas: estoque baixo, pedidos atrasados
   */
  static async getAlerts(req, res) {
    try {
      // Pedidos atrasados (>15 min sem alteração)
      const delayedOrders = await Order.findAll({
        where: {
          status: { [Op.in]: ['pending', 'confirmed', 'preparing'] },
          createdAt: {
            [Op.lte]: new Date(Date.now() - 15 * 60 * 1000)
          }
        },
        include: [
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        limit: 20
      });

      // Produtos com estoque baixo
      const lowStockProducts = await Product.findAll({
        where: {
          hasStock: true,
          stock: {
            [Op.lte]: sequelize.col('minStock')
          }
        },
        limit: 20
      });

      res.json({
        success: true,
        data: {
          alerts: {
            delayed: delayedOrders.length,
            lowStock: lowStockProducts.length
          },
          delayedOrders,
          lowStockProducts
        }
      });
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/staff/start-timer
   * Iniciar timer para um pedido (apenas para logging, timer é no frontend)
   */
  static async startTimer(req, res) {
    try {
      const { orderId } = req.body;

      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      // Registrar quando começou o preparo (se não estiver já)
      if (order.status === 'pending' || order.status === 'confirmed') {
        await order.update({
          status: 'preparing',
          startedAt: new Date()
        });
      }

      res.json({
        success: true,
        message: 'Timer iniciado',
        data: {
          order,
          startedAt: order.startedAt || new Date()
        }
      });
    } catch (error) {
      console.error('Erro ao iniciar timer:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/staff/call-customer
   * Chamar cliente via SMS/Push
   */
  static async callCustomer(req, res) {
    try {
      const { orderId, tableNumber } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: 'orderId é obrigatório'
        });
      }

      // Buscar pedido com cliente
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nome', 'celular']
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      const mesa = tableNumber || order.table?.number || 'sua mesa';
      const results = {
        sms: false,
        push: false
      };

      // Enviar SMS se tiver celular
      if (order.user?.celular) {
        const smsResult = await smsService.sendCallCustomer(
          order.user.celular,
          mesa
        );
        results.sms = smsResult.success;
      }

      // Enviar Push notification
      if (order.user?.id) {
        try {
          await pushService.sendToUser(order.user.id, {
            title: 'FLAME - Solicitação de Presença',
            body: `Por favor, dirija-se à mesa ${mesa}. Nosso atendente está aguardando.`,
            icon: '/icons/icon-192x192.png',
            tag: 'call-customer',
            data: {
              type: 'call_customer',
              orderId: order.id,
              tableNumber: mesa
            }
          });
          results.push = true;
        } catch (pushError) {
          console.error('Erro ao enviar push:', pushError);
        }
      }

      res.json({
        success: true,
        message: 'Cliente notificado',
        data: {
          orderId: order.id,
          tableNumber: mesa,
          notifications: results
        }
      });
    } catch (error) {
      console.error('Erro ao chamar cliente:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = StaffController;

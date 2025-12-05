const { Order, OrderItem, User, Product, Table } = require('../models');
const paymentService = require('../services/payment.service');
const smsService = require('../services/sms.service');
const socketService = require('../services/socket.service');
const pushService = require('../services/push.service');
const InventoryService = require('../services/inventoryService');
const { Op } = require('sequelize');

class OrderController {
  // Criar novo pedido
  async createOrder(req, res) {
    try {
      const { tableId, items, notes, paymentMethod } = req.body;
      const userId = req.user.id;

      // Validar valor mínimo
      const minimumOrderValue = parseFloat(process.env.MINIMUM_ORDER_VALUE) || 15.00;
      
      // Calcular subtotal
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        
        if (!product || !product.isActive) {
          return res.status(404).json({
            success: false,
            message: `Produto ${item.productId} não encontrado ou inativo`
          });
        }

        // Verificar estoque se necessário
        if (product.hasStock && product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`
          });
        }

        const itemPrice = parseFloat(product.getPriceWithDiscount());
        const itemSubtotal = itemPrice * item.quantity;
        subtotal += itemSubtotal;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: itemPrice,
          subtotal: itemSubtotal,
          notes: item.notes || null,
          productName: product.name,
          productDescription: product.description,
          productImage: product.image,
          productCategory: product.category
        });
      }

      // Validar valor mínimo
      if (subtotal < minimumOrderValue) {
        return res.status(400).json({
          success: false,
          message: `Valor mínimo do pedido é R$ ${minimumOrderValue.toFixed(2)}. Atual: R$ ${subtotal.toFixed(2)}`
        });
      }

      // Verificar se mesa existe
      const table = await Table.findByPk(tableId);
      if (!table || !table.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Mesa não encontrada ou inativa'
        });
      }

      // Criar pedido
      const order = await Order.create({
        userId,
        tableId,
        subtotal: subtotal.toFixed(2),
        notes,
        paymentMethod,
        estimatedTime: Math.max(...orderItems.map(item => {
          // Buscar tempo de preparo do produto
          return items.find(i => i.productId === item.productId)?.preparationTime || 15;
        }))
      });

      // Criar itens do pedido
      for (const item of orderItems) {
        await OrderItem.create({
          ...item,
          orderId: order.id
        });

        // Atualizar estoque e registrar movimento
        const product = await Product.findByPk(item.productId);
        if (product && product.hasStock) {
          await Product.decrement('stock', {
            by: item.quantity,
            where: { id: item.productId }
          });

          // Registrar movimento de inventário
          try {
            await InventoryService.recordMovement(
              item.productId,
              'saida',
              item.quantity,
              'venda',
              `Pedido #${order.orderNumber}`,
              userId,
              order.id
            );
          } catch (inventoryError) {
            console.error('Erro ao registrar movimento de estoque:', inventoryError);
            // Não falha o pedido se houver erro no registro
          }
        }
      }

      // Buscar pedido completo com relacionamentos
      const completeOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'nome', 'celular']
          },
          {
            model: Table,
            as: 'table',
            attributes: ['id', 'number', 'name']
          }
        ]
      });

      // Criar pagamento se não for dinheiro
      if (paymentMethod && paymentMethod !== 'cash') {
        const paymentResult = await paymentService.createPaymentIntent(
          parseFloat(order.total),
          'brl',
          {
            orderId: order.id,
            orderNumber: order.orderNumber,
            userId,
            tableId
          }
        );

        if (paymentResult.success) {
          await order.update({
            paymentId: paymentResult.paymentIntentId,
            paymentStatus: 'processing'
          });
        } else {
          // Se falhou criar pagamento, cancelar pedido
          await order.update({ status: 'cancelled' });
          
          return res.status(500).json({
            success: false,
            message: 'Erro ao processar pagamento',
            error: paymentResult.error
          });
        }
      }

      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: { 
          order: completeOrder,
          paymentClientSecret: paymentMethod !== 'cash' ? paymentResult.clientSecret : null
        }
      });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar pedidos do usuário
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const where = { userId };
      if (status) {
        where.status = status;
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows: orders } = await Order.findAndCountAll({
        where,
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
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      const totalPages = Math.ceil(count / parseInt(limit));

      res.status(200).json({
        success: true,
        data: {
          orders,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalOrders: count,
            ordersPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar pedido por ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const order = await Order.findOne({
        where: { 
          id,
          userId // Só pode ver próprios pedidos
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
          },
          {
            model: User,
            as: 'attendant',
            attributes: ['nome']
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: { order }
      });
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Confirmar pagamento (webhook ou manual)
  async confirmPayment(req, res) {
    try {
      const { orderId, paymentId } = req.body;

      const order = await Order.findByPk(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      // Atualizar status do pedido
      await order.update({
        status: 'confirmed',
        paymentStatus: 'completed',
        paymentId
      });

      // Buscar pedido completo
      const completeOrder = await Order.findByPk(orderId, {
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: User,
            as: 'customer'
          },
          {
            model: Table,
            as: 'table'
          }
        ]
      });

      // Notificar cozinha e atendentes via WebSocket
      socketService.notifyNewOrder(completeOrder);

      // Notificar cozinha via Push
      try {
        await pushService.notifyNewOrder(completeOrder);
      } catch (pushError) {
        console.error('Erro ao enviar push para cozinha:', pushError);
      }

      // Enviar SMS de confirmação
      await smsService.sendOrderConfirmation(
        completeOrder.customer.celular,
        completeOrder.orderNumber,
        completeOrder.estimatedTime
      );

      res.status(200).json({
        success: true,
        message: 'Pagamento confirmado',
        data: { order: completeOrder }
      });
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Cancelar pedido
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const order = await Order.findOne({
        where: { 
          id,
          userId
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      if (!order.canBeCancelled()) {
        return res.status(400).json({
          success: false,
          message: 'Pedido não pode ser cancelado no status atual'
        });
      }

      // Cancelar pagamento se houver
      if (order.paymentId) {
        const cancelResult = await paymentService.cancelPayment(order.paymentId);
        if (!cancelResult.success) {
          console.error('Erro ao cancelar pagamento:', cancelResult.error);
        }
      }

      // Restaurar estoque
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
        include: [{ model: Product, as: 'product' }]
      });

      for (const item of orderItems) {
        if (item.product && item.product.hasStock) {
          await Product.increment('stock', {
            by: item.quantity,
            where: { id: item.productId }
          });

          // Registrar movimento de devolução
          try {
            await InventoryService.recordMovement(
              item.productId,
              'devolucao',
              item.quantity,
              'devolucao',
              `Devolução - Pedido #${order.orderNumber} cancelado`,
              userId,
              order.id
            );
          } catch (inventoryError) {
            console.error('Erro ao registrar movimento de devolução:', inventoryError);
            // Não falha o cancelamento se houver erro no registro
          }
        }
      }

      // Atualizar status
      await order.update({ 
        status: 'cancelled',
        paymentStatus: 'cancelled'
      });

      res.status(200).json({
        success: true,
        message: 'Pedido cancelado com sucesso',
        data: { order }
      });
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Avaliar pedido
  async rateOrder(req, res) {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;
      const userId = req.user.id;

      const order = await Order.findOne({
        where: { 
          id,
          userId,
          status: 'delivered'
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado ou não foi entregue'
        });
      }

      await order.update({ rating, review });

      // Atualizar estatísticas do usuário
      await User.increment('totalOrders', {
        by: 1,
        where: { id: userId }
      });

      await User.increment('totalSpent', {
        by: parseFloat(order.total),
        where: { id: userId }
      });

      res.status(200).json({
        success: true,
        message: 'Avaliação registrada com sucesso',
        data: { order }
      });
    } catch (error) {
      console.error('Erro ao avaliar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // MÉTODOS PARA FUNCIONÁRIOS

  // Listar todos os pedidos (para funcionários)
  async getAllOrders(req, res) {
    try {
      const { status, date, page = 1, limit = 20 } = req.query;
      
      const where = {};
      
      if (status) {
        where.status = status;
      }

      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        
        where.createdAt = {
          [Op.between]: [startDate, endDate]
        };
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows: orders } = await Order.findAndCountAll({
        where,
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: User,
            as: 'customer',
            attributes: ['nome', 'celular']
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      res.status(200).json({
        success: true,
        data: { 
          orders,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalOrders: count
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar status do pedido (funcionários)
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: 'customer'
          },
          {
            model: Table,
            as: 'table'
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      // Atualizar campos específicos baseado no status
      const updateData = { status };

      if (status === 'preparing') {
        updateData.kitchenUserId = userId;
      } else if (status === 'on_way') {
        updateData.attendantId = userId;
      }

      await order.update(updateData);

      // Notificar mudança via WebSocket
      socketService.notifyOrderStatusChange(order.id, status, {
        orderNumber: order.orderNumber,
        tableNumber: order.table.number,
        customerName: order.customer.nome
      });

      // Notificações quando status muda
      if (status === 'ready') {
        // Enviar SMS quando pedido estiver pronto
        await smsService.sendOrderReady(
          order.customer.celular,
          order.orderNumber
        );

        // Enviar Push Notification para cliente
        try {
          await pushService.notifyOrderReady(order);
        } catch (pushError) {
          console.error('Erro ao enviar push para cliente:', pushError);
        }
      } else if (['preparing', 'delivered', 'cancelled'].includes(status)) {
        // Notificar cliente sobre mudança de status
        try {
          await pushService.notifyOrderStatus(order, status);
        } catch (pushError) {
          console.error('Erro ao enviar push de status:', pushError);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Status atualizado com sucesso',
        data: { order }
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Dashboard de métricas (admin)
  async getDashboardMetrics(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Pedidos de hoje
      const todaysOrders = await Order.findAll({
        where: {
          createdAt: {
            [Op.between]: [today, tomorrow]
          }
        }
      });

      // Métricas
      const totalOrdersToday = todaysOrders.length;
      const totalRevenueToday = todaysOrders
        .filter(order => order.paymentStatus === 'completed')
        .reduce((sum, order) => sum + parseFloat(order.total), 0);

      const averageTicket = totalOrdersToday > 0 ? totalRevenueToday / totalOrdersToday : 0;

      const ordersByStatus = await Order.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where: {
          createdAt: {
            [Op.between]: [today, tomorrow]
          }
        },
        group: ['status'],
        raw: true
      });

      // Tempo médio de preparo
      const completedOrders = todaysOrders.filter(order => order.preparationTime);
      const avgPreparationTime = completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => sum + order.preparationTime, 0) / completedOrders.length
        : 0;

      res.status(200).json({
        success: true,
        data: {
          totalOrdersToday,
          totalRevenueToday: totalRevenueToday.toFixed(2),
          averageTicket: averageTicket.toFixed(2),
          avgPreparationTime: Math.round(avgPreparationTime),
          ordersByStatus
        }
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new OrderController();
/**
 * Sprint 56: Rotas de Chat staff-cliente
 */
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { Message, User, Order } = require('../models');

// GET /chat/:orderId - Buscar mensagens de um pedido
router.get('/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Verificar se usuario tem acesso ao pedido
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido nao encontrado'
      });
    }

    // Apenas dono do pedido ou staff podem ver mensagens
    const isOwner = order.userId === userId;
    const isStaff = ['admin', 'atendente', 'cozinha', 'bar', 'barman', 'caixa'].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Buscar mensagens
    const messages = await Message.findAll({
      where: { orderId },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'nome', 'role']
      }],
      order: [['createdAt', 'ASC']]
    });

    // Marcar mensagens como lidas
    await Message.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          orderId,
          senderId: { [require('sequelize').Op.ne]: userId },
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.map(m => ({
          id: m.id,
          orderId: m.orderId,
          senderId: m.senderId,
          senderName: m.sender?.nome,
          senderType: m.senderType,
          senderRole: m.sender?.role,
          content: m.content,
          messageType: m.messageType,
          isRead: m.isRead,
          createdAt: m.createdAt
        })),
        orderNumber: order.orderNumber
      }
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar mensagens'
    });
  }
});

// GET /chat - Listar pedidos com chats ativos (para staff)
router.get('/', authenticate, async (req, res) => {
  try {
    const isStaff = ['admin', 'atendente', 'cozinha', 'bar', 'barman', 'caixa'].includes(req.user.role);

    if (!isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Acesso apenas para staff'
      });
    }

    // Buscar pedidos com mensagens nao lidas
    const unreadChats = await Message.findAll({
      where: {
        senderType: 'cliente',
        isRead: false
      },
      include: [{
        model: Order,
        as: 'order',
        include: [{
          model: User,
          as: 'customer',
          attributes: ['id', 'nome']
        }]
      }],
      attributes: ['orderId'],
      group: ['orderId', 'order.id', 'order.customer.id'],
      raw: false
    });

    // Formatar resposta
    const chats = [];
    const processedOrders = new Set();

    for (const msg of unreadChats) {
      if (!processedOrders.has(msg.orderId)) {
        processedOrders.add(msg.orderId);

        // Contar mensagens nao lidas
        const unreadCount = await Message.count({
          where: {
            orderId: msg.orderId,
            senderType: 'cliente',
            isRead: false
          }
        });

        // Ultima mensagem
        const lastMessage = await Message.findOne({
          where: { orderId: msg.orderId },
          order: [['createdAt', 'DESC']]
        });

        chats.push({
          orderId: msg.orderId,
          orderNumber: msg.order?.orderNumber,
          customerName: msg.order?.customer?.nome,
          unreadCount,
          lastMessage: lastMessage?.content?.substring(0, 50),
          lastMessageAt: lastMessage?.createdAt
        });
      }
    }

    res.json({
      success: true,
      data: { chats }
    });
  } catch (error) {
    console.error('Erro ao listar chats:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar chats'
    });
  }
});

module.exports = router;

/**
 * Sprint 56: Model para mensagens de chat staff-cliente
 * Vinculado a pedidos para contexto
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Message extends Model {}

Message.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Referencia ao pedido (contexto do chat)
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  // Quem enviou
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // Tipo do remetente
  senderType: {
    type: DataTypes.ENUM('cliente', 'staff', 'sistema'),
    allowNull: false,
    defaultValue: 'cliente'
  },
  // Conteudo da mensagem
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Tipo de mensagem
  messageType: {
    type: DataTypes.ENUM('text', 'status_update', 'system', 'image'),
    allowNull: false,
    defaultValue: 'text'
  },
  // Lida pelo destinatario
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Quando foi lida
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Metadata adicional (para updates de status, etc)
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'messages',
  indexes: [
    { fields: ['orderId'] },
    { fields: ['senderId'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Message;

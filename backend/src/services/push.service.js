/**
 * Serviço de Push Notifications
 * Usa web-push para enviar notificações via Web Push API
 */

const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');
const { Op } = require('sequelize');

// Configurar VAPID keys (devem estar no .env em produção)
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BLN9wBxXqhQWAzKNb0a_9h_wz7S3WdxVQlQ3Y8H_qJIuC7yZqJmKJ8xz9rT4Q_M2vK1xP3Y6_N8R_L0yZ5d9D0U';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'nJqz_CExMSr_dY6P8bK2rF7N4X9vL1hT3W5yZ0mQ8aS';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:contato@flame.com.br';

// Configurar web-push
webpush.setVapidDetails(
  VAPID_SUBJECT,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

class PushService {
  /**
   * Retorna a chave pública VAPID para o cliente
   */
  getVapidPublicKey() {
    return VAPID_PUBLIC_KEY;
  }

  /**
   * Registra uma nova subscription
   */
  async subscribe(userId, subscription, deviceInfo = {}) {
    try {
      // Verificar se já existe essa subscription
      let existing = await PushSubscription.findOne({
        where: { endpoint: subscription.endpoint }
      });

      if (existing) {
        // Atualizar subscription existente
        existing.userId = userId;
        existing.p256dh = subscription.keys.p256dh;
        existing.auth = subscription.keys.auth;
        existing.active = true;
        existing.failedAttempts = 0;
        existing.deviceType = deviceInfo.deviceType || 'web';
        existing.userAgent = deviceInfo.userAgent || null;
        await existing.save();
        return existing;
      }

      // Criar nova subscription
      const newSubscription = await PushSubscription.create({
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        deviceType: deviceInfo.deviceType || 'web',
        userAgent: deviceInfo.userAgent || null,
        active: true
      });

      return newSubscription;
    } catch (error) {
      console.error('Erro ao registrar subscription:', error);
      throw error;
    }
  }

  /**
   * Remove uma subscription
   */
  async unsubscribe(endpoint) {
    try {
      const subscription = await PushSubscription.findOne({
        where: { endpoint }
      });

      if (subscription) {
        subscription.active = false;
        await subscription.save();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao remover subscription:', error);
      throw error;
    }
  }

  /**
   * Envia notificação para um usuário específico
   */
  async sendToUser(userId, notification) {
    try {
      const subscriptions = await PushSubscription.findAll({
        where: {
          userId,
          active: true
        }
      });

      if (subscriptions.length === 0) {
        return { sent: 0, failed: 0 };
      }

      const results = await Promise.allSettled(
        subscriptions.map(sub => this.sendNotification(sub, notification))
      );

      const sent = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { sent, failed };
    } catch (error) {
      console.error('Erro ao enviar notificação para usuário:', error);
      throw error;
    }
  }

  /**
   * Envia notificação para todos os usuários de um tipo (staff, admin, etc)
   */
  async sendToRole(role, notification) {
    try {
      const User = require('../models/User');

      const users = await User.findAll({
        where: {
          role,
          isActive: true
        },
        attributes: ['id']
      });

      const userIds = users.map(u => u.id);

      const subscriptions = await PushSubscription.findAll({
        where: {
          userId: { [Op.in]: userIds },
          active: true
        }
      });

      if (subscriptions.length === 0) {
        return { sent: 0, failed: 0 };
      }

      const results = await Promise.allSettled(
        subscriptions.map(sub => this.sendNotification(sub, notification))
      );

      const sent = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { sent, failed };
    } catch (error) {
      console.error('Erro ao enviar notificação para role:', error);
      throw error;
    }
  }

  /**
   * Envia notificação para uma subscription específica
   */
  async sendNotification(subscription, notification) {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    };

    const payload = JSON.stringify({
      title: notification.title || 'FLAME',
      body: notification.body || '',
      icon: notification.icon || '/icons/icon-192x192.png',
      badge: notification.badge || '/icons/badge-72x72.png',
      image: notification.image || null,
      tag: notification.tag || 'default',
      data: notification.data || {},
      actions: notification.actions || [],
      requireInteraction: notification.requireInteraction || false,
      renotify: notification.renotify || false,
      silent: notification.silent || false,
      vibrate: notification.vibrate || [100, 50, 100]
    });

    try {
      await webpush.sendNotification(pushSubscription, payload);
      await subscription.markSuccess();
      return true;
    } catch (error) {
      console.error('Erro ao enviar push:', error);
      await subscription.markFailed();

      // Se subscription expirou, desativar
      if (error.statusCode === 410) {
        subscription.active = false;
        await subscription.save();
      }

      throw error;
    }
  }

  /**
   * Notificação de novo pedido (para cozinha/bar)
   */
  async notifyNewOrder(order) {
    const notification = {
      title: 'Novo Pedido',
      body: `Pedido #${order.orderNumber} recebido - Mesa ${order.table?.number || 'N/A'}`,
      icon: '/icons/icon-192x192.png',
      tag: `order-${order.id}`,
      data: {
        type: 'new_order',
        orderId: order.id,
        orderNumber: order.orderNumber,
        url: '/staff/cozinha'
      },
      actions: [
        { action: 'view', title: 'Ver Pedido' },
        { action: 'accept', title: 'Aceitar' }
      ],
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200]
    };

    // Enviar para cozinha
    await this.sendToRole('cozinha', notification);
  }

  /**
   * Notificação de pedido pronto (para cliente)
   */
  async notifyOrderReady(order) {
    if (!order.userId) return;

    const notification = {
      title: 'Seu Pedido Está Pronto!',
      body: `Pedido #${order.orderNumber} está pronto para retirada`,
      icon: '/icons/icon-192x192.png',
      tag: `order-ready-${order.id}`,
      data: {
        type: 'order_ready',
        orderId: order.id,
        orderNumber: order.orderNumber,
        url: '/meus-pedidos'
      },
      actions: [
        { action: 'view', title: 'Ver Detalhes' }
      ],
      requireInteraction: true,
      vibrate: [100, 50, 100, 50, 100, 50, 200]
    };

    await this.sendToUser(order.userId, notification);
  }

  /**
   * Notificação de atualização de status
   */
  async notifyOrderStatus(order, newStatus) {
    if (!order.userId) return;

    const statusMessages = {
      preparing: 'Seu pedido está sendo preparado',
      ready: 'Seu pedido está pronto!',
      delivered: 'Seu pedido foi entregue',
      cancelled: 'Seu pedido foi cancelado'
    };

    const notification = {
      title: `Pedido #${order.orderNumber}`,
      body: statusMessages[newStatus] || `Status: ${newStatus}`,
      icon: '/icons/icon-192x192.png',
      tag: `order-status-${order.id}`,
      data: {
        type: 'order_status',
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: newStatus,
        url: '/meus-pedidos'
      }
    };

    if (newStatus === 'ready') {
      notification.requireInteraction = true;
      notification.vibrate = [100, 50, 100, 50, 100, 50, 200];
    }

    await this.sendToUser(order.userId, notification);
  }

  /**
   * Notificação de lembrete de reserva
   */
  async notifyReservationReminder(reservation, hoursUntil) {
    if (!reservation.userId) return;

    const notification = {
      title: 'Lembrete de Reserva',
      body: `Sua reserva é em ${hoursUntil}h - ${reservation.date} às ${reservation.time}`,
      icon: '/icons/icon-192x192.png',
      tag: `reservation-reminder-${reservation.id}`,
      data: {
        type: 'reservation_reminder',
        reservationId: reservation.id,
        url: '/minhas-reservas'
      },
      actions: [
        { action: 'view', title: 'Ver Reserva' },
        { action: 'cancel', title: 'Cancelar' }
      ]
    };

    await this.sendToUser(reservation.userId, notification);
  }

  /**
   * Notificação promocional
   */
  async notifyPromotion(userIds, promo) {
    const notification = {
      title: promo.title || 'Promoção FLAME',
      body: promo.body || promo.description,
      icon: promo.icon || '/icons/icon-192x192.png',
      image: promo.image || null,
      tag: `promo-${promo.id || Date.now()}`,
      data: {
        type: 'promotion',
        promoId: promo.id,
        url: promo.url || '/cardapio'
      }
    };

    let totalSent = 0;
    let totalFailed = 0;

    for (const userId of userIds) {
      const result = await this.sendToUser(userId, notification);
      totalSent += result.sent;
      totalFailed += result.failed;
    }

    return { sent: totalSent, failed: totalFailed };
  }

  /**
   * Atualizar preferências de notificação
   */
  async updatePreferences(userId, endpoint, preferences) {
    const subscription = await PushSubscription.findOne({
      where: { userId, endpoint }
    });

    if (!subscription) {
      throw new Error('Subscription não encontrada');
    }

    subscription.preferences = {
      ...subscription.preferences,
      ...preferences
    };

    await subscription.save();
    return subscription.preferences;
  }

  /**
   * Listar subscriptions de um usuário
   */
  async getUserSubscriptions(userId) {
    return PushSubscription.findAll({
      where: { userId, active: true },
      attributes: ['id', 'deviceType', 'lastUsed', 'preferences', 'createdAt']
    });
  }

  /**
   * Limpar subscriptions antigas/inativas
   */
  async cleanup() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleted = await PushSubscription.destroy({
      where: {
        [Op.or]: [
          { active: false, updatedAt: { [Op.lt]: thirtyDaysAgo } },
          { failedAttempts: { [Op.gte]: 3 }, updatedAt: { [Op.lt]: thirtyDaysAgo } }
        ]
      }
    });

    return deleted;
  }
}

module.exports = new PushService();

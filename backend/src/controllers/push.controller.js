/**
 * Controller para Push Notifications
 */

const pushService = require('../services/push.service');

const pushController = {
  /**
   * GET /api/push/vapid-key
   * Retorna a chave pública VAPID para o cliente
   */
  getVapidKey: async (req, res) => {
    try {
      const publicKey = pushService.getVapidPublicKey();
      res.json({
        success: true,
        publicKey
      });
    } catch (error) {
      console.error('Erro ao obter VAPID key:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao obter chave VAPID'
      });
    }
  },

  /**
   * POST /api/push/subscribe
   * Registra uma nova subscription de push
   */
  subscribe: async (req, res) => {
    try {
      const { subscription, deviceInfo } = req.body;
      const userId = req.user.id;

      if (!subscription || !subscription.endpoint || !subscription.keys) {
        return res.status(400).json({
          success: false,
          message: 'Subscription inválida'
        });
      }

      const result = await pushService.subscribe(userId, subscription, deviceInfo);

      res.json({
        success: true,
        message: 'Subscription registrada com sucesso',
        subscriptionId: result.id
      });
    } catch (error) {
      console.error('Erro ao registrar subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao registrar subscription'
      });
    }
  },

  /**
   * POST /api/push/unsubscribe
   * Remove uma subscription
   */
  unsubscribe: async (req, res) => {
    try {
      const { endpoint } = req.body;

      if (!endpoint) {
        return res.status(400).json({
          success: false,
          message: 'Endpoint é obrigatório'
        });
      }

      const result = await pushService.unsubscribe(endpoint);

      res.json({
        success: true,
        message: result ? 'Subscription removida' : 'Subscription não encontrada'
      });
    } catch (error) {
      console.error('Erro ao remover subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao remover subscription'
      });
    }
  },

  /**
   * GET /api/push/subscriptions
   * Lista subscriptions do usuário logado
   */
  getSubscriptions: async (req, res) => {
    try {
      const userId = req.user.id;
      const subscriptions = await pushService.getUserSubscriptions(userId);

      res.json({
        success: true,
        subscriptions
      });
    } catch (error) {
      console.error('Erro ao listar subscriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar subscriptions'
      });
    }
  },

  /**
   * PUT /api/push/preferences
   * Atualiza preferências de notificação
   */
  updatePreferences: async (req, res) => {
    try {
      const { endpoint, preferences } = req.body;
      const userId = req.user.id;

      if (!endpoint || !preferences) {
        return res.status(400).json({
          success: false,
          message: 'Endpoint e preferências são obrigatórios'
        });
      }

      const updated = await pushService.updatePreferences(userId, endpoint, preferences);

      res.json({
        success: true,
        message: 'Preferências atualizadas',
        preferences: updated
      });
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar preferências'
      });
    }
  },

  /**
   * POST /api/push/test
   * Envia notificação de teste para o usuário logado
   */
  sendTest: async (req, res) => {
    try {
      const userId = req.user.id;

      const notification = {
        title: 'Teste de Notificação',
        body: 'Esta é uma notificação de teste do FLAME!',
        icon: '/icons/icon-192x192.png',
        tag: 'test-notification',
        data: {
          type: 'test',
          timestamp: Date.now()
        }
      };

      const result = await pushService.sendToUser(userId, notification);

      res.json({
        success: true,
        message: `Notificação enviada para ${result.sent} dispositivo(s)`,
        ...result
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao enviar notificação de teste'
      });
    }
  },

  /**
   * POST /api/push/send (Admin only)
   * Envia notificação para usuário específico ou role
   */
  send: async (req, res) => {
    try {
      const { userId, role, notification } = req.body;

      if (!notification || !notification.title || !notification.body) {
        return res.status(400).json({
          success: false,
          message: 'Notificação precisa de título e corpo'
        });
      }

      let result;

      if (userId) {
        result = await pushService.sendToUser(userId, notification);
      } else if (role) {
        result = await pushService.sendToRole(role, notification);
      } else {
        return res.status(400).json({
          success: false,
          message: 'userId ou role é obrigatório'
        });
      }

      res.json({
        success: true,
        message: `Notificação enviada`,
        ...result
      });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao enviar notificação'
      });
    }
  },

  /**
   * POST /api/push/broadcast (Admin only)
   * Envia notificação para todos os usuários ativos
   */
  broadcast: async (req, res) => {
    try {
      const { notification } = req.body;

      if (!notification || !notification.title || !notification.body) {
        return res.status(400).json({
          success: false,
          message: 'Notificação precisa de título e corpo'
        });
      }

      const User = require('../models/User');
      const users = await User.findAll({
        where: { isActive: true },
        attributes: ['id']
      });

      let totalSent = 0;
      let totalFailed = 0;

      for (const user of users) {
        try {
          const result = await pushService.sendToUser(user.id, notification);
          totalSent += result.sent;
          totalFailed += result.failed;
        } catch (e) {
          // Continua para próximo usuário
        }
      }

      res.json({
        success: true,
        message: `Notificação enviada para ${totalSent} dispositivo(s)`,
        sent: totalSent,
        failed: totalFailed,
        totalUsers: users.length
      });
    } catch (error) {
      console.error('Erro ao enviar broadcast:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao enviar broadcast'
      });
    }
  },

  /**
   * DELETE /api/push/cleanup (Admin only)
   * Limpa subscriptions antigas/inativas
   */
  cleanup: async (req, res) => {
    try {
      const deleted = await pushService.cleanup();

      res.json({
        success: true,
        message: `${deleted} subscription(s) removida(s)`,
        deleted
      });
    } catch (error) {
      console.error('Erro ao limpar subscriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao limpar subscriptions'
      });
    }
  }
};

module.exports = pushController;

/**
 * Rotas de Push Notifications
 * Sprint 28 - Push Notifications em Produção
 */

const express = require('express');
const router = express.Router();
const pushController = require('../controllers/push.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Rotas públicas
router.get('/vapid-key', pushController.getVapidKey);

// Rotas autenticadas (qualquer usuário logado)
router.post('/subscribe', authenticate, pushController.subscribe);
router.post('/unsubscribe', authenticate, pushController.unsubscribe);
router.get('/subscriptions', authenticate, pushController.getSubscriptions);
router.put('/preferences', authenticate, pushController.updatePreferences);
router.post('/test', authenticate, pushController.sendTest);

// Rotas admin only (Sprint 28 - autorização adicionada)
router.post('/send', authenticate, authorize(['admin', 'gerente']), pushController.send);
router.post('/broadcast', authenticate, authorize(['admin']), pushController.broadcast);
router.delete('/cleanup', authenticate, authorize(['admin']), pushController.cleanup);

module.exports = router;

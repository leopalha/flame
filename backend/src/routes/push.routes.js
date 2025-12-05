/**
 * Rotas de Push Notifications
 */

const express = require('express');
const router = express.Router();
const pushController = require('../controllers/push.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Rotas públicas
router.get('/vapid-key', pushController.getVapidKey);

// Rotas autenticadas (qualquer usuário logado)
router.post('/subscribe', authenticate, pushController.subscribe);
router.post('/unsubscribe', authenticate, pushController.unsubscribe);
router.get('/subscriptions', authenticate, pushController.getSubscriptions);
router.put('/preferences', authenticate, pushController.updatePreferences);
router.post('/test', authenticate, pushController.sendTest);

// Rotas admin only (TODO: adicionar middleware de autorização)
router.post('/send', authenticate, pushController.send);
router.post('/broadcast', authenticate, pushController.broadcast);
router.delete('/cleanup', authenticate, pushController.cleanup);

module.exports = router;

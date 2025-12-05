const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaign.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Todas as rotas requerem autenticação e role admin
router.use(authenticate);
router.use(authorize(['admin']));

// Estatísticas de campanhas
router.get('/stats', campaignController.getStats);

// Criar campanha rápida de reativação
router.post('/quick-reactivation', campaignController.createQuickReactivation);

// CRUD básico
router.post('/', campaignController.create);
router.get('/', campaignController.list);
router.get('/:id', campaignController.getById);
router.put('/:id', campaignController.update);
router.delete('/:id', campaignController.delete);

// Ações de campanha
router.get('/:id/audience', campaignController.getAudience);
router.post('/:id/simulate', campaignController.simulate);
router.post('/:id/execute', campaignController.execute);
router.post('/:id/pause', campaignController.pause);
router.post('/:id/complete', campaignController.complete);

module.exports = router;

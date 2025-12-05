const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const productRoutes = require('./products');
const orderRoutes = require('./orders');
const tableRoutes = require('./tables');
const adminRoutes = require('./admin');
const inventoryRoutes = require('./inventory');
const staffRoutes = require('./staff');
const hookahRoutes = require('./hookah');
const reservationRoutes = require('./reservations');
const crmRoutes = require('./crm');
const campaignRoutes = require('./campaign.routes');
const seedRoutes = require('./seed-route');
const migrateRoutes = require('./migrate');

// Rota de health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Red Light funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de produtos
router.use('/products', productRoutes);

// Rotas de pedidos
router.use('/orders', orderRoutes);

// Rotas de mesas
router.use('/tables', tableRoutes);

// Rotas administrativas
router.use('/admin', adminRoutes);

// Rotas de inventário
router.use('/inventory', inventoryRoutes);

// Rotas de staff
router.use('/staff', staffRoutes);

// Rotas de narguilé
router.use('/hookah', hookahRoutes);

// Rotas de reservas
router.use('/reservations', reservationRoutes);

// Rotas de CRM
router.use('/crm', crmRoutes);

// Rotas de Campanhas de Marketing
router.use('/campaigns', campaignRoutes);

// Rotas de Seed (temporário)
router.use('/', seedRoutes);

// Rotas de migração (temporário - remover em produção)
router.use('/migrate', migrateRoutes);

// Rota não encontrada
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

module.exports = router;
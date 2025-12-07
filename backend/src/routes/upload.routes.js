/**
 * Rotas de Upload
 * Sprint 30 - Upload de Imagens para Produtos
 */

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { upload, handleMulterError } = require('../middlewares/upload.middleware');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

// Todas as rotas requerem autenticação de admin/gerente
const authMiddleware = [authenticate, requireRole(['admin', 'gerente'])];

// Upload de imagem para produto específico
router.post(
  '/product/:productId',
  authMiddleware,
  upload.single('image'),
  handleMulterError,
  uploadController.uploadProductImage
);

// Upload genérico de imagem (para novos produtos)
router.post(
  '/image',
  authMiddleware,
  upload.single('image'),
  handleMulterError,
  uploadController.uploadImage
);

// Deletar imagem
router.delete(
  '/image/:filename',
  authMiddleware,
  uploadController.deleteImage
);

module.exports = router;

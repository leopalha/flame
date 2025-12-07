/**
 * Upload Controller
 * Sprint 30 - Upload de Imagens para Produtos
 */

const { Product } = require('../models');
const { deleteOldFile } = require('../middlewares/upload.middleware');

class UploadController {
  /**
   * Upload de imagem para produto
   * POST /api/upload/product/:productId
   */
  async uploadProductImage(req, res) {
    try {
      const { productId } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum arquivo enviado'
        });
      }

      // Construir URL da imagem
      const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
      const imageUrl = `${baseUrl}/uploads/products/${req.file.filename}`;

      // Se productId fornecido, atualizar produto
      if (productId && productId !== 'new') {
        const product = await Product.findByPk(productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: 'Produto não encontrado'
          });
        }

        // Deletar imagem antiga se existir e for local
        if (product.image && product.image.includes('/uploads/products/')) {
          deleteOldFile(product.image);
        }

        // Atualizar produto com nova imagem
        await product.update({ image: imageUrl });

        return res.status(200).json({
          success: true,
          message: 'Imagem do produto atualizada com sucesso',
          data: {
            imageUrl,
            product: {
              id: product.id,
              name: product.name,
              image: imageUrl
            }
          }
        });
      }

      // Upload sem produto (para criar depois)
      return res.status(200).json({
        success: true,
        message: 'Imagem enviada com sucesso',
        data: {
          imageUrl,
          filename: req.file.filename
        }
      });
    } catch (error) {
      console.error('Erro no upload de imagem:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Upload genérico de imagem
   * POST /api/upload/image
   */
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum arquivo enviado'
        });
      }

      const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
      const imageUrl = `${baseUrl}/uploads/products/${req.file.filename}`;

      return res.status(200).json({
        success: true,
        message: 'Imagem enviada com sucesso',
        data: {
          imageUrl,
          filename: req.file.filename
        }
      });
    } catch (error) {
      console.error('Erro no upload de imagem:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Deletar imagem
   * DELETE /api/upload/image/:filename
   */
  async deleteImage(req, res) {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Nome do arquivo não fornecido'
        });
      }

      const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
      deleteOldFile(`${baseUrl}/uploads/products/${filename}`);

      return res.status(200).json({
        success: true,
        message: 'Imagem deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new UploadController();

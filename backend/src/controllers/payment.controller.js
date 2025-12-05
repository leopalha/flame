/**
 * Payment Controller - FLAME Lounge Bar
 * Gerencia endpoints de pagamento via Stripe
 */

const paymentService = require('../services/payment.service');
const { Order } = require('../models');

class PaymentController {
  /**
   * Criar Payment Intent para cartão
   * POST /api/payments/create-intent
   */
  async createPaymentIntent(req, res) {
    try {
      const { amount, orderId, orderNumber } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor inválido'
        });
      }

      const result = await paymentService.createPaymentIntent(amount, 'brl', {
        orderId: orderId || '',
        orderNumber: orderNumber || '',
        userId: req.user?.id || '',
        source: 'flame_app'
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao criar pagamento',
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        data: {
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId,
          status: result.status
        }
      });
    } catch (error) {
      console.error('Erro ao criar Payment Intent:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Criar Payment Intent para PIX
   * POST /api/payments/create-pix
   */
  async createPixPayment(req, res) {
    try {
      const { amount, orderId, orderNumber } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor inválido'
        });
      }

      const result = await paymentService.createPixPayment(amount, {
        orderId: orderId || '',
        orderNumber: orderNumber || '',
        userId: req.user?.id || '',
        source: 'flame_app'
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao criar pagamento PIX',
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        data: {
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId,
          status: result.status
        }
      });
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Confirmar pagamento
   * POST /api/payments/confirm
   */
  async confirmPayment(req, res) {
    try {
      const { paymentIntentId, paymentMethodId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: 'ID do pagamento é obrigatório'
        });
      }

      const result = await paymentService.confirmPayment(paymentIntentId, paymentMethodId);

      res.status(200).json({
        success: result.success,
        data: {
          status: result.status,
          paymentIntentId: result.paymentIntentId
        }
      });
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Obter status de um pagamento
   * GET /api/payments/:paymentIntentId/status
   */
  async getPaymentStatus(req, res) {
    try {
      const { paymentIntentId } = req.params;

      const result = await paymentService.getPaymentStatus(paymentIntentId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: 'Pagamento não encontrado',
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Erro ao obter status do pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Cancelar pagamento
   * POST /api/payments/:paymentIntentId/cancel
   */
  async cancelPayment(req, res) {
    try {
      const { paymentIntentId } = req.params;
      const { reason } = req.body;

      const result = await paymentService.cancelPayment(paymentIntentId, reason);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao cancelar pagamento',
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Pagamento cancelado',
        data: result
      });
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Criar reembolso
   * POST /api/payments/:paymentIntentId/refund
   */
  async createRefund(req, res) {
    try {
      const { paymentIntentId } = req.params;
      const { amount, reason } = req.body;

      const result = await paymentService.createRefund(paymentIntentId, amount, reason);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao criar reembolso',
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Reembolso criado com sucesso',
        data: result
      });
    } catch (error) {
      console.error('Erro ao criar reembolso:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Webhook do Stripe
   * POST /api/payments/webhook
   */
  async handleWebhook(req, res) {
    try {
      const signature = req.headers['stripe-signature'];

      if (!signature) {
        return res.status(400).json({
          success: false,
          message: 'Assinatura do webhook ausente'
        });
      }

      // O body deve ser raw para validar assinatura
      const rawBody = req.rawBody || req.body;

      const result = await paymentService.handleWebhook(rawBody, signature);

      if (!result.success) {
        console.error('Erro ao processar webhook:', result.error);
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      // Se foi um pagamento bem-sucedido, atualizar pedido
      if (result.action === 'payment_confirmed' && result.orderNumber) {
        await this.updateOrderPaymentStatus(result.orderNumber, 'paid');
      } else if (result.action === 'payment_failed' && result.orderNumber) {
        await this.updateOrderPaymentStatus(result.orderNumber, 'payment_failed');
      } else if (result.action === 'payment_cancelled' && result.orderNumber) {
        await this.updateOrderPaymentStatus(result.orderNumber, 'cancelled');
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Calcular taxas de pagamento
   * POST /api/payments/calculate-fees
   */
  async calculateFees(req, res) {
    try {
      const { amount, method = 'card' } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor inválido'
        });
      }

      const fees = paymentService.calculateStripeFees(amount, method);

      res.status(200).json({
        success: true,
        data: {
          originalAmount: amount,
          method,
          ...fees
        }
      });
    } catch (error) {
      console.error('Erro ao calcular taxas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Listar métodos de pagamento salvos do cliente
   * GET /api/payments/methods
   */
  async listPaymentMethods(req, res) {
    try {
      const user = req.user;

      if (!user.stripeCustomerId) {
        return res.status(200).json({
          success: true,
          data: {
            paymentMethods: []
          }
        });
      }

      const result = await paymentService.listCustomerPaymentMethods(user.stripeCustomerId);

      res.status(200).json({
        success: result.success,
        data: {
          paymentMethods: result.paymentMethods || []
        }
      });
    } catch (error) {
      console.error('Erro ao listar métodos de pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obter chave pública do Stripe (para o frontend)
   * GET /api/payments/config
   */
  async getConfig(req, res) {
    try {
      res.status(200).json({
        success: true,
        data: {
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
          currency: 'brl',
          country: 'BR',
          supportedMethods: ['card', 'pix']
        }
      });
    } catch (error) {
      console.error('Erro ao obter config:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Helper: Atualizar status de pagamento do pedido
   */
  async updateOrderPaymentStatus(orderNumber, paymentStatus) {
    try {
      const order = await Order.findOne({
        where: { orderNumber }
      });

      if (order) {
        await order.update({
          paymentStatus,
          ...(paymentStatus === 'paid' && { status: 'confirmed' })
        });
        console.log(`Pedido ${orderNumber} atualizado: paymentStatus=${paymentStatus}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  }
}

module.exports = new PaymentController();

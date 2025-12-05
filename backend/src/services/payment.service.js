const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  constructor() {
    this.stripe = stripe;
  }

  // Criar Payment Intent para cartão de crédito/débito
  async createPaymentIntent(amount, currency = 'brl', metadata = {}) {
    try {
      // Stripe trabalha com centavos
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency,
        payment_method_types: ['card'],
        metadata: {
          ...metadata,
          source: 'flame_app'
        },
        description: `Pedido FLAME - #${metadata.orderNumber || 'N/A'}`
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Erro ao criar Payment Intent:', error);
      return {
        success: false,
        error: error.message,
        type: error.type
      };
    }
  }

  // Criar Payment Intent para PIX
  async createPixPayment(amount, metadata = {}) {
    try {
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'brl',
        payment_method_types: ['pix'],
        metadata: {
          ...metadata,
          source: 'flame_app',
          payment_method: 'pix'
        },
        description: `Pedido FLAME PIX - #${metadata.orderNumber || 'N/A'}`
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      return {
        success: false,
        error: error.message,
        type: error.type
      };
    }
  }

  // Confirmar pagamento
  async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });

      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
        charges: paymentIntent.charges
      };
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      return {
        success: false,
        error: error.message,
        decline_code: error.decline_code
      };
    }
  }

  // Recuperar status de um pagamento
  async getPaymentStatus(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        success: true,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Converter de centavos
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method,
        created: new Date(paymentIntent.created * 1000),
        metadata: paymentIntent.metadata
      };
    } catch (error) {
      console.error('Erro ao recuperar pagamento:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cancelar um pagamento
  async cancelPayment(paymentIntentId, reason = 'requested_by_customer') {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId, {
        cancellation_reason: reason
      });

      return {
        success: true,
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Criar reembolso
  async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason: reason
      };

      // Se amount for especificado, faz reembolso parcial
      if (amount) {
        refundData.amount = Math.round(amount * 100); // Converter para centavos
      }

      const refund = await this.stripe.refunds.create(refundData);

      return {
        success: true,
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100, // Converter de centavos
        created: new Date(refund.created * 1000)
      };
    } catch (error) {
      console.error('Erro ao criar reembolso:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Listar métodos de pagamento salvos de um cliente
  async listCustomerPaymentMethods(customerId) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });

      return {
        success: true,
        paymentMethods: paymentMethods.data.map(pm => ({
          id: pm.id,
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year
        }))
      };
    } catch (error) {
      console.error('Erro ao listar métodos de pagamento:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Criar cliente no Stripe
  async createCustomer(email, name, phone) {
    try {
      const customer = await this.stripe.customers.create({
        email: email,
        name: name,
        phone: phone,
        metadata: {
          source: 'red_light_app'
        }
      });

      return {
        success: true,
        customerId: customer.id,
        customer: customer
      };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Processar webhook do Stripe
  async handleWebhook(rawBody, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      console.log('Webhook recebido:', event.type);

      switch (event.type) {
        case 'payment_intent.succeeded':
          return this.handlePaymentSucceeded(event.data.object);
        
        case 'payment_intent.payment_failed':
          return this.handlePaymentFailed(event.data.object);
        
        case 'payment_intent.canceled':
          return this.handlePaymentCanceled(event.data.object);
        
        default:
          console.log(`Evento não tratado: ${event.type}`);
          return { success: true, handled: false };
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Tratar pagamento bem-sucedido
  async handlePaymentSucceeded(paymentIntent) {
    try {
      console.log('Pagamento bem-sucedido:', paymentIntent.id);
      
      // Aqui você pode atualizar o status do pedido no banco de dados
      const orderNumber = paymentIntent.metadata.orderNumber;
      
      if (orderNumber) {
        // TODO: Atualizar status do pedido para 'confirmed'
        console.log(`Pedido ${orderNumber} confirmado via pagamento ${paymentIntent.id}`);
      }

      return {
        success: true,
        action: 'payment_confirmed',
        paymentIntentId: paymentIntent.id,
        orderNumber: orderNumber
      };
    } catch (error) {
      console.error('Erro ao tratar pagamento bem-sucedido:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Tratar pagamento falhado
  async handlePaymentFailed(paymentIntent) {
    try {
      console.log('Pagamento falhado:', paymentIntent.id);
      
      const orderNumber = paymentIntent.metadata.orderNumber;
      
      if (orderNumber) {
        // TODO: Atualizar status do pedido para 'payment_failed'
        console.log(`Pagamento do pedido ${orderNumber} falhado: ${paymentIntent.id}`);
      }

      return {
        success: true,
        action: 'payment_failed',
        paymentIntentId: paymentIntent.id,
        orderNumber: orderNumber
      };
    } catch (error) {
      console.error('Erro ao tratar pagamento falhado:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Tratar pagamento cancelado
  async handlePaymentCanceled(paymentIntent) {
    try {
      console.log('Pagamento cancelado:', paymentIntent.id);
      
      const orderNumber = paymentIntent.metadata.orderNumber;
      
      if (orderNumber) {
        // TODO: Atualizar status do pedido para 'cancelled'
        console.log(`Pedido ${orderNumber} cancelado: ${paymentIntent.id}`);
      }

      return {
        success: true,
        action: 'payment_cancelled',
        paymentIntentId: paymentIntent.id,
        orderNumber: orderNumber
      };
    } catch (error) {
      console.error('Erro ao tratar pagamento cancelado:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calcular taxas do Stripe (aproximado)
  calculateStripeFees(amount, method = 'card') {
    // Taxas aproximadas do Stripe no Brasil
    const rates = {
      card: 0.039, // 3.9% + R$ 0.39
      pix: 0.035   // 3.5% + R$ 0.39
    };

    const percentageFee = amount * (rates[method] || rates.card);
    const fixedFee = 0.39;
    
    return {
      percentageFee: Math.round(percentageFee * 100) / 100,
      fixedFee: fixedFee,
      totalFee: Math.round((percentageFee + fixedFee) * 100) / 100,
      netAmount: Math.round((amount - percentageFee - fixedFee) * 100) / 100
    };
  }
}

// Instância singleton
const paymentService = new PaymentService();

module.exports = paymentService;
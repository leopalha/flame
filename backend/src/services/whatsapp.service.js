const twilio = require('twilio');

/**
 * Serviço de WhatsApp para FLAME
 * Usa Twilio WhatsApp API para enviar mensagens
 *
 * Para produção, é necessário:
 * 1. Ter uma conta Twilio com WhatsApp habilitado
 * 2. Configurar TWILIO_WHATSAPP_NUMBER no .env
 * 3. Aprovar templates de mensagem no Twilio
 */
class WhatsAppService {
  constructor() {
    // Número do WhatsApp da FLAME para receber notificações
    // Temporariamente usando número de teste do Leonardo
    this.flameWhatsApp = process.env.FLAME_WHATSAPP_NUMBER || '+5521995354010';

    // Inicializar Twilio se configurado
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      // WhatsApp do Twilio (sandbox ou número aprovado)
      this.twilioWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
      this.enabled = true;
    } else {
      console.warn('⚠️  WhatsApp não configurado - notificações desabilitadas (modo desenvolvimento)');
      this.enabled = false;
    }
  }

  /**
   * Formatar número para WhatsApp
   * @param {string} phoneNumber - Número de telefone
   * @returns {string} Número formatado para WhatsApp
   */
  formatWhatsAppNumber(phoneNumber) {
    // Remove todos os caracteres não numéricos exceto +
    let clean = phoneNumber.replace(/[^\d+]/g, '');

    // Se não começa com +, assume Brasil
    if (!clean.startsWith('+')) {
      if (clean.startsWith('55')) {
        clean = '+' + clean;
      } else {
        clean = '+55' + clean;
      }
    }

    return `whatsapp:${clean}`;
  }

  /**
   * Enviar notificação de nova reserva para FLAME
   * @param {Object} reservationData - Dados da reserva
   * @returns {Object} Resultado do envio
   */
  async notifyNewReservation(reservationData) {
    try {
      const {
        guestName,
        guestPhone,
        guestEmail,
        confirmationCode,
        reservationDate,
        partySize,
        specialRequests,
        guestNotes
      } = reservationData;

      // Formatar data
      const dateObj = new Date(reservationDate);
      const formattedDate = dateObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Montar mensagem
      let message = `🔥 *NOVA RESERVA - FLAME*\n\n`;
      message += `📋 *Código:* ${confirmationCode}\n`;
      message += `👤 *Cliente:* ${guestName}\n`;
      message += `📱 *Telefone:* ${guestPhone}\n`;
      message += `📧 *Email:* ${guestEmail}\n`;
      message += `📅 *Data:* ${formattedDate}\n`;
      message += `⏰ *Horário:* ${formattedTime}\n`;
      message += `👥 *Pessoas:* ${partySize}\n`;

      if (specialRequests) {
        message += `\n📝 *Ocasião/Pedido:* ${specialRequests}\n`;
      }

      if (guestNotes) {
        message += `💬 *Observações:* ${guestNotes}\n`;
      }

      message += `\n✅ Reserva aguardando confirmação`;

      // Em modo desenvolvimento, apenas logar
      if (!this.enabled) {
        console.log(`📲 [DEV MODE] WhatsApp para FLAME (${this.flameWhatsApp}):`);
        console.log(message);
        console.log('---');
        return {
          success: true,
          sid: 'dev-mode-whatsapp-' + Date.now(),
          message: 'WhatsApp simulado em modo desenvolvimento'
        };
      }

      // Enviar via Twilio WhatsApp
      const result = await this.client.messages.create({
        body: message,
        from: this.twilioWhatsApp,
        to: this.formatWhatsAppNumber(this.flameWhatsApp)
      });

      console.log(`WhatsApp de reserva enviado para FLAME: ${result.sid}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);

      // Não falhar a reserva por causa do WhatsApp
      return {
        success: false,
        error: error.message,
        code: error.code || 'WHATSAPP_ERROR'
      };
    }
  }

  /**
   * Enviar notificação de cancelamento de reserva
   * @param {Object} reservationData - Dados da reserva
   * @param {string} reason - Motivo do cancelamento
   * @returns {Object} Resultado do envio
   */
  async notifyCancellation(reservationData, reason = '') {
    try {
      const { guestName, confirmationCode, reservationDate } = reservationData;

      // Formatar data
      const dateObj = new Date(reservationDate);
      const formattedDate = dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
      const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      let message = `❌ *RESERVA CANCELADA - FLAME*\n\n`;
      message += `📋 *Código:* ${confirmationCode}\n`;
      message += `👤 *Cliente:* ${guestName}\n`;
      message += `📅 *Data:* ${formattedDate} às ${formattedTime}\n`;

      if (reason) {
        message += `\n📝 *Motivo:* ${reason}`;
      }

      if (!this.enabled) {
        console.log(`📲 [DEV MODE] WhatsApp cancelamento para FLAME:`);
        console.log(message);
        return {
          success: true,
          sid: 'dev-mode-whatsapp-' + Date.now(),
          message: 'WhatsApp simulado em modo desenvolvimento'
        };
      }

      const result = await this.client.messages.create({
        body: message,
        from: this.twilioWhatsApp,
        to: this.formatWhatsAppNumber(this.flameWhatsApp)
      });

      return {
        success: true,
        messageSid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Erro ao enviar WhatsApp de cancelamento:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enviar lembrete de reserva
   * @param {Object} reservationData - Dados da reserva
   * @returns {Object} Resultado do envio
   */
  async sendReminder(reservationData) {
    try {
      const { guestName, guestPhone, confirmationCode, reservationDate, partySize } = reservationData;

      const dateObj = new Date(reservationDate);
      const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      let message = `🔥 *FLAME Lounge Bar*\n\n`;
      message += `Olá ${guestName}!\n\n`;
      message += `Lembrando da sua reserva para *hoje* às *${formattedTime}*.\n`;
      message += `👥 ${partySize} pessoa${partySize > 1 ? 's' : ''}\n`;
      message += `📋 Código: ${confirmationCode}\n\n`;
      message += `📍 R. Voluntários da Pátria, 446 - Botafogo\n\n`;
      message += `Esperamos você! 🔥`;

      if (!this.enabled) {
        console.log(`📲 [DEV MODE] WhatsApp lembrete para ${guestPhone}:`);
        console.log(message);
        return {
          success: true,
          sid: 'dev-mode-whatsapp-' + Date.now(),
          message: 'WhatsApp simulado em modo desenvolvimento'
        };
      }

      const result = await this.client.messages.create({
        body: message,
        from: this.twilioWhatsApp,
        to: this.formatWhatsAppNumber(guestPhone)
      });

      return {
        success: true,
        messageSid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Erro ao enviar lembrete WhatsApp:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Gerar link do WhatsApp (fallback quando API não está disponível)
   * @param {Object} reservationData - Dados da reserva
   * @returns {string} URL do WhatsApp
   */
  generateWhatsAppLink(reservationData) {
    const {
      guestName,
      confirmationCode,
      reservationDate,
      partySize,
      specialRequests
    } = reservationData;

    const dateObj = new Date(reservationDate);
    const formattedDate = dateObj.toLocaleDateString('pt-BR');
    const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    let text = `🔥 NOVA RESERVA FLAME\n\n`;
    text += `Código: ${confirmationCode}\n`;
    text += `Cliente: ${guestName}\n`;
    text += `Data: ${formattedDate}\n`;
    text += `Horário: ${formattedTime}\n`;
    text += `Pessoas: ${partySize}\n`;

    if (specialRequests) {
      text += `Ocasião: ${specialRequests}\n`;
    }

    // Remover o + do número
    const phoneNumber = this.flameWhatsApp.replace(/\D/g, '');

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  }
}

// Instância singleton
const whatsappService = new WhatsAppService();

module.exports = whatsappService;

const twilio = require('twilio');

class SMSService {
  constructor() {
    // Apenas inicializar Twilio se as credenciais estiverem configuradas
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
      this.enabled = true;
    } else {
      console.warn('⚠️  Twilio não configurado - SMS desabilitado (modo desenvolvimento)');
      this.enabled = false;
    }
  }

  // Gerar código SMS de 6 dígitos
  generateSMSCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Enviar código de verificação via SMS
  async sendVerificationCode(phoneNumber, code) {
    try {
      // Em modo desenvolvimento sem Twilio, apenas logar o código
      if (!this.enabled) {
        console.log(`📱 [DEV MODE] SMS para ${phoneNumber}: Código de verificação: ${code}`);
        return {
          success: true,
          sid: 'dev-mode-' + Date.now(),
          message: 'SMS simulado em modo desenvolvimento'
        };
      }

      // Formatar número para padrão internacional (+5521999999999)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      console.log(`📱 ENVIANDO SMS:`, {
        to: formattedPhone,
        code: code,
        from: this.fromNumber
      });

      const message = `FLAME: Seu código de verificação é: ${code}. Válido por 5 minutos. Não compartilhe este código.`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`✅ SMS enviado com sucesso:`, {
        sid: result.sid,
        to: formattedPhone,
        status: result.status
      });
      
      return {
        success: true,
        messageSid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      
      return {
        success: false,
        error: error.message,
        code: error.code || 'SMS_ERROR'
      };
    }
  }

  // Enviar SMS de boas-vindas
  async sendWelcomeMessage(phoneNumber, userName) {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const message = `Olá ${userName}! Bem-vindo ao FLAME! 🟠 Sua conta foi criada com sucesso. Aproveite nossa experiência única!`;
      
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      return {
        success: true,
        messageSid: result.sid
      };
    } catch (error) {
      console.error('Erro ao enviar SMS de boas-vindas:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar notificação de pedido confirmado
  async sendOrderConfirmation(phoneNumber, orderNumber, estimatedTime) {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const message = `FLAME: Pedido #${orderNumber} confirmado! ✅ Tempo estimado: ${estimatedTime} min. Acompanhe em tempo real na plataforma.`;
      
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      return {
        success: true,
        messageSid: result.sid
      };
    } catch (error) {
      console.error('Erro ao enviar SMS de confirmação:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar notificação de pedido pronto
  async sendOrderReady(phoneNumber, orderNumber) {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const message = `FLAME: Seu pedido #${orderNumber} está pronto! 🍸 Nosso atendente já está levando para sua mesa.`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      return {
        success: true,
        messageSid: result.sid
      };
    } catch (error) {
      console.error('Erro ao enviar SMS pedido pronto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar código de recuperação de senha
  async sendPasswordResetCode(phoneNumber, code) {
    try {
      // Em modo desenvolvimento sem Twilio, apenas logar o código
      if (!this.enabled) {
        console.log(`📱 [DEV MODE] SMS para ${phoneNumber}: Código de recuperação: ${code}`);
        return {
          success: true,
          sid: 'dev-mode-' + Date.now(),
          message: 'SMS simulado em modo desenvolvimento'
        };
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const message = `FLAME: Seu código para recuperar a senha é: ${code}. Válido por 15 minutos. Não compartilhe este código.`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`SMS de reset enviado com sucesso: ${result.sid}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Erro ao enviar SMS de recuperação:', error);

      return {
        success: false,
        error: error.message,
        code: error.code || 'SMS_ERROR'
      };
    }
  }

  // Chamar cliente (atendente solicita presença)
  async sendCallCustomer(phoneNumber, tableNumber, message = null) {
    try {
      if (!this.enabled) {
        console.log(`📱 [DEV MODE] SMS para ${phoneNumber}: Chamando cliente na mesa ${tableNumber}`);
        return {
          success: true,
          sid: 'dev-mode-' + Date.now(),
          message: 'SMS simulado em modo desenvolvimento'
        };
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const customMessage = message || `FLAME: Solicitamos sua presença na mesa ${tableNumber}. Nosso atendente está aguardando.`;

      const result = await this.client.messages.create({
        body: customMessage,
        from: this.fromNumber,
        to: formattedPhone
      });

      return {
        success: true,
        messageSid: result.sid
      };
    } catch (error) {
      console.error('Erro ao enviar SMS para chamar cliente:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Formatar número de telefone para padrão internacional
  formatPhoneNumber(phoneNumber) {
    // Se já começa com +, usar como está (formato internacional)
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }

    // Remove todos os caracteres não numéricos
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // Se já tem código do país (começando com 55 e tem 13 dígitos), retorna com +
    if (cleanPhone.startsWith('55') && cleanPhone.length === 13) {
      return `+${cleanPhone}`;
    }

    // Formato brasileiro sem código do país - adiciona +55
    if (cleanPhone.length === 11) {
      return `+55${cleanPhone}`;
    }

    // Formato antigo com 10 dígitos - adiciona 9 no início e +55 (celular antigo)
    if (cleanPhone.length === 10) {
      return `+55${cleanPhone.substring(0, 2)}9${cleanPhone.substring(2)}`;
    }

    throw new Error('Formato de telefone inválido');
  }

  // Validar se número está no formato correto
  isValidPhoneNumber(phoneNumber) {
    try {
      this.formatPhoneNumber(phoneNumber);
      return true;
    } catch {
      return false;
    }
  }

  // Verificar status de uma mensagem enviada
  async getMessageStatus(messageSid) {
    try {
      const message = await this.client.messages(messageSid).fetch();
      
      return {
        success: true,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage
      };
    } catch (error) {
      console.error('Erro ao verificar status SMS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar confirmação de reserva
  async sendReservationConfirmation(phoneNumber, reservationData) {
    try {
      const { guestName, confirmationCode, reservationDate, partySize, specialRequests } = reservationData;

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

      // Em modo desenvolvimento sem Twilio, apenas logar
      if (!this.enabled) {
        console.log(`📱 [DEV MODE] SMS de reserva para ${phoneNumber}:`);
        console.log(`   Código: ${confirmationCode}`);
        console.log(`   Data: ${formattedDate} às ${formattedTime}`);
        console.log(`   Pessoas: ${partySize}`);
        return {
          success: true,
          sid: 'dev-mode-' + Date.now(),
          message: 'SMS simulado em modo desenvolvimento'
        };
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      let message = `🔥 FLAME Lounge Bar\n\n`;
      message += `Olá ${guestName}!\n`;
      message += `Sua reserva foi confirmada!\n\n`;
      message += `📋 Código: ${confirmationCode}\n`;
      message += `📅 ${formattedDate}\n`;
      message += `⏰ ${formattedTime}\n`;
      message += `👥 ${partySize} pessoa${partySize > 1 ? 's' : ''}\n`;
      if (specialRequests) {
        message += `📝 ${specialRequests}\n`;
      }
      message += `\n📍 Rua Arnaldo Quintela, 19 - Botafogo\n`;
      message += `\nAté breve!`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`SMS de reserva enviado: ${result.sid}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Erro ao enviar SMS de reserva:', error);
      return {
        success: false,
        error: error.message,
        code: error.code || 'SMS_ERROR'
      };
    }
  }

  // Enviar lembrete de reserva para o cliente
  async sendReservationReminder(phoneNumber, reservationData) {
    try {
      const { guestName, confirmationCode, reservationDate, partySize } = reservationData;

      // Formatar data
      const dateObj = new Date(reservationDate);
      const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Em modo desenvolvimento sem Twilio, apenas logar
      if (!this.enabled) {
        console.log(`📱 [DEV MODE] SMS Lembrete para ${phoneNumber}:`);
        console.log(`   Reserva às ${formattedTime} hoje!`);
        return {
          success: true,
          sid: 'dev-mode-' + Date.now(),
          message: 'SMS simulado em modo desenvolvimento'
        };
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      let message = `🔥 FLAME - Lembrete!\n\n`;
      message += `Olá ${guestName}!\n`;
      message += `Sua reserva é HOJE às ${formattedTime}.\n`;
      message += `👥 ${partySize} pessoa${partySize > 1 ? 's' : ''}\n`;
      message += `📋 Código: ${confirmationCode}\n\n`;
      message += `📍 Rua Arnaldo Quintela, 19 - Botafogo\n`;
      message += `Estamos te esperando!`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`✅ SMS lembrete enviado: ${result.sid}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Erro ao enviar SMS lembrete:', error);
      return {
        success: false,
        error: error.message,
        code: error.code || 'SMS_ERROR'
      };
    }
  }

  // Enviar notificação de cancelamento para o admin
  async sendCancellationNotification(phoneNumber, reservationData, reason = '') {
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

      // Em modo desenvolvimento sem Twilio, apenas logar
      if (!this.enabled) {
        console.log(`📱 [DEV MODE] SMS Cancelamento para admin:`);
        console.log(`   Reserva ${confirmationCode} cancelada`);
        console.log(`   Cliente: ${guestName}`);
        return {
          success: true,
          sid: 'dev-mode-' + Date.now(),
          message: 'SMS simulado em modo desenvolvimento'
        };
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      let message = `❌ RESERVA CANCELADA\n\n`;
      message += `👤 ${guestName}\n`;
      message += `📋 Código: ${confirmationCode}\n`;
      message += `📅 ${formattedDate} às ${formattedTime}`;
      if (reason) {
        message += `\n📝 Motivo: ${reason}`;
      }

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`✅ SMS cancelamento enviado: ${result.sid}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Erro ao enviar SMS cancelamento:', error);
      return {
        success: false,
        error: error.message,
        code: error.code || 'SMS_ERROR'
      };
    }
  }

  // Enviar notificação de nova reserva para o admin
  async sendAdminReservationNotification(phoneNumber, reservationData) {
    try {
      const { guestName, guestPhone, confirmationCode, reservationDate, partySize, specialRequests } = reservationData;

      // Formatar data
      const dateObj = new Date(reservationDate);
      const formattedDate = dateObj.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
      });
      const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Em modo desenvolvimento sem Twilio, apenas logar
      if (!this.enabled) {
        console.log(`📱 [DEV MODE] SMS ADMIN - Nova reserva:`);
        console.log(`   Cliente: ${guestName}`);
        console.log(`   Tel: ${guestPhone}`);
        console.log(`   Código: ${confirmationCode}`);
        console.log(`   Data: ${formattedDate} às ${formattedTime}`);
        console.log(`   Pessoas: ${partySize}`);
        return {
          success: true,
          sid: 'dev-mode-' + Date.now(),
          message: 'SMS simulado em modo desenvolvimento'
        };
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      let message = `🔥 NOVA RESERVA FLAME\n\n`;
      message += `👤 ${guestName}\n`;
      message += `📞 ${guestPhone}\n`;
      message += `📋 Código: ${confirmationCode}\n`;
      message += `📅 ${formattedDate} às ${formattedTime}\n`;
      message += `👥 ${partySize} pessoa${partySize > 1 ? 's' : ''}`;
      if (specialRequests) {
        message += `\n📝 ${specialRequests}`;
      }

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`✅ SMS admin reserva enviado: ${result.sid}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Erro ao enviar SMS admin reserva:', error);
      return {
        success: false,
        error: error.message,
        code: error.code || 'SMS_ERROR'
      };
    }
  }

  // Listar últimas mensagens enviadas
  async getRecentMessages(limit = 20) {
    try {
      const messages = await this.client.messages.list({
        limit: limit,
        from: this.fromNumber
      });
      
      return {
        success: true,
        messages: messages.map(msg => ({
          sid: msg.sid,
          to: msg.to,
          body: msg.body,
          status: msg.status,
          dateCreated: msg.dateCreated
        }))
      };
    } catch (error) {
      console.error('Erro ao listar mensagens:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instância singleton
const smsService = new SMSService();

module.exports = smsService;
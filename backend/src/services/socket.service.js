const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, Message, Order } = require('../models');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
    this.connectedSockets = new Map(); // socketId -> userId
  }

  // Inicializar Socket.IO server
  init(server) {
    // CORS para Socket.IO - mesmas origens que o Express
    const allowedOrigins = [
      'http://localhost:3000',
      'https://flameloungebar.vercel.app',
      'https://flame-lounge-bar.vercel.app',
      'https://flame-lounge.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    this.io = new Server(server, {
      cors: {
        origin: function(origin, callback) {
          // Permite requests sem origin (mobile apps, etc)
          if (!origin) return callback(null, true);

          // Permite qualquer subdominio do Vercel para o projeto flame
          if (origin.includes('leopalhas-projects.vercel.app') ||
              origin.includes('flameloungebar.vercel.app') ||
              origin.includes('flame-lounge.vercel.app') ||
              allowedOrigins.includes(origin)) {
            return callback(null, true);
          }

          console.log('[SOCKET] Origem bloqueada por CORS:', origin);
          callback(new Error('Not allowed by CORS'));
        },
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupMiddlewares();
    this.setupEventHandlers();
    
    console.log('✅ Socket.IO server inicializado');
    return this.io;
  }

  // Configurar middlewares do Socket.IO
  setupMiddlewares() {
    // Middleware de autenticação
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Token não fornecido'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);

        if (!user || !user.isActive) {
          return next(new Error('Usuário inválido'));
        }

        socket.userId = user.id;
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Token inválido'));
      }
    });
  }

  // Configurar event handlers
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Usuário conectado: ${socket.user.nome} (${socket.userId})`);

      // Registrar conexão
      this.connectedUsers.set(socket.userId, socket.id);
      this.connectedSockets.set(socket.id, socket.userId);

      // Juntar usuário a rooms baseado na role
      this.joinUserToRooms(socket);

      // Event handlers específicos
      this.setupUserEvents(socket);
      this.setupOrderEvents(socket);
      this.setupKitchenEvents(socket);
      this.setupAttendantEvents(socket);
      this.setupHookahEvents(socket);
      this.setupReservationEvents(socket);
      this.setupChatEvents(socket); // Sprint 56: Chat staff-cliente

      // Cleanup na desconexão
      socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.user.nome} (${socket.userId})`);
        this.connectedUsers.delete(socket.userId);
        this.connectedSockets.delete(socket.id);
      });
    });
  }

  // Juntar usuário às rooms apropriadas
  joinUserToRooms(socket) {
    // Todos os usuários autenticados
    socket.join('authenticated');

    const joinedRooms = ['authenticated'];

    // Rooms específicas por role
    if (socket.user.role === 'admin') {
      socket.join('admins');
      socket.join('kitchen');
      socket.join('attendants');
      socket.join('bar');
      socket.join('reservations');
      joinedRooms.push('admins', 'kitchen', 'attendants', 'bar', 'reservations');
    } else if (socket.user.role === 'cozinha') {
      socket.join('kitchen');
      joinedRooms.push('kitchen');
    } else if (socket.user.role === 'atendente') {
      socket.join('attendants');
      joinedRooms.push('attendants');
    } else if (socket.user.role === 'bar' || socket.user.role === 'barman') {
      socket.join('bar');
      joinedRooms.push('bar');
    }

    // Room do próprio usuário
    socket.join(`user_${socket.userId}`);
    joinedRooms.push(`user_${socket.userId}`);

    console.log(`🔗 [SOCKET] ${socket.user.nome} (role: ${socket.user.role}) entrou nas salas: ${joinedRooms.join(', ')}`);
  }

  // Eventos gerais do usuário
  setupUserEvents(socket) {
    socket.on('join_table', (tableId) => {
      socket.join(`table_${tableId}`);
      console.log(`Usuário ${socket.user.nome} entrou na mesa ${tableId}`);
    });

    socket.on('leave_table', (tableId) => {
      socket.leave(`table_${tableId}`);
      console.log(`Usuário ${socket.user.nome} saiu da mesa ${tableId}`);
    });

    socket.on('user_typing', (data) => {
      socket.to(`table_${data.tableId}`).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.nome,
        isTyping: data.isTyping
      });
    });
  }

  // Eventos relacionados a pedidos
  setupOrderEvents(socket) {
    socket.on('track_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`Usuário ${socket.user.nome} acompanhando pedido ${orderId}`);
    });

    socket.on('stop_tracking_order', (orderId) => {
      socket.leave(`order_${orderId}`);
    });
  }

  // Eventos da cozinha
  setupKitchenEvents(socket) {
    if (!['cozinha', 'admin'].includes(socket.user.role)) return;

    socket.on('start_preparing_order', (orderId) => {
      this.emitToRoom('attendants', 'order_status_changed', {
        orderId,
        status: 'preparing',
        timestamp: new Date(),
        kitchenUser: socket.user.nome
      });
    });

    socket.on('finish_preparing_order', (orderId) => {
      this.emitToRoom('attendants', 'order_ready_notification', {
        orderId,
        timestamp: new Date(),
        kitchenUser: socket.user.nome
      });
    });
  }

  // Eventos do atendente
  setupAttendantEvents(socket) {
    if (!['atendente', 'admin'].includes(socket.user.role)) return;

    socket.on('pickup_order', (orderId) => {
      this.emitToRoom('kitchen', 'order_picked_up', {
        orderId,
        attendant: socket.user.nome,
        timestamp: new Date()
      });
    });

    socket.on('deliver_order', (orderId) => {
      this.emitToRoom('admins', 'order_delivered', {
        orderId,
        attendant: socket.user.nome,
        timestamp: new Date()
      });
    });
  }

  // Notificar novo pedido para cozinha/bar e atendentes
  notifyNewOrder(orderData) {
    // Categorizar itens por tipo (comida, bebida, narguilé)
    const foodItems = [];
    const drinkItems = [];
    const hookahItems = [];

    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach(item => {
        // Buscar categoria do produto (suporta ambos os formatos por compatibilidade)
        const category = (item.product?.category || item.productCategory || '').toLowerCase();

        if (category.includes('bebida') || category.includes('drink')) {
          drinkItems.push(item);
        } else if (category.includes('nargui') || category.includes('hookah')) {
          hookahItems.push(item);
        } else {
          // Comida e outros vão para cozinha
          foodItems.push(item);
        }
      });
    }

    // Enviar para COZINHA se tiver comida
    if (foodItems.length > 0) {
      console.log(`📡 [SOCKET] Enviando order_created para kitchen com ${foodItems.length} itens`);
      this.emitToRoom('kitchen', 'order_created', {
        orderId: orderData.id,
        orderNumber: orderData.orderNumber,
        tableNumber: orderData.table?.number,
        items: foodItems,
        customerName: orderData.customer?.nome,
        estimatedTime: orderData.estimatedTime,
        timestamp: new Date(),
        type: 'food'
      });
    }

    // Enviar para BAR se tiver bebidas ou narguilé
    if (drinkItems.length > 0 || hookahItems.length > 0) {
      console.log(`📡 [SOCKET] Enviando order_created para bar com ${drinkItems.length + hookahItems.length} itens`);
      this.emitToRoom('bar', 'order_created', {
        orderId: orderData.id,
        orderNumber: orderData.orderNumber,
        tableNumber: orderData.table?.number,
        items: [...drinkItems, ...hookahItems],
        customerName: orderData.customer?.nome,
        estimatedTime: orderData.estimatedTime,
        timestamp: new Date(),
        type: 'drinks'
      });
    }

    // Notificar atendentes sobre QUALQUER pedido
    console.log(`📡 [SOCKET] Enviando order_created para attendants`);
    this.emitToRoom('attendants', 'order_created', {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      tableNumber: orderData.table?.number,
      customerName: orderData.customer?.nome,
      total: orderData.total,
      timestamp: new Date()
    });

    // Notificar ADMINS sobre QUALQUER pedido (para dashboard em tempo real)
    console.log(`📡 [SOCKET] Enviando order_created para admins`);
    this.emitToRoom('admins', 'order_created', {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      tableNumber: orderData.table?.number,
      customerName: orderData.customer?.nome,
      total: orderData.total,
      itemsCount: orderData.items?.length || 0,
      paymentMethod: orderData.paymentMethod,
      timestamp: new Date()
    });
  }

  // Notificar atendentes sobre solicitação de pagamento na mesa
  // Este evento é emitido quando cliente escolhe pagar com atendente (cash, card_at_table, split)
  notifyPaymentRequest(orderData) {
    const paymentLabels = {
      cash: 'Dinheiro',
      pay_later: 'Pagar Depois',
      card_at_table: 'Cartão na Mesa',
      split: 'Dividir Conta'
    };

    const eventData = {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      tableNumber: orderData.table?.number || 'Balcão',
      customerName: orderData.customer?.nome,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      paymentLabel: paymentLabels[orderData.paymentMethod] || orderData.paymentMethod,
      items: orderData.items?.map(item => ({
        name: item.productName || item.product?.name,
        quantity: item.quantity,
        subtotal: item.subtotal
      })),
      timestamp: new Date(),
      priority: 'high'
    };

    console.log(`💳 [SOCKET] Notificando atendentes sobre pagamento pendente na mesa ${eventData.tableNumber}`);

    // Notificar ATENDENTES com alta prioridade
    this.emitToRoom('attendants', 'payment_request', eventData);

    // Também notificar CAIXA (para acompanhamento)
    this.emitToRoom('caixa', 'payment_request', eventData);

    // Notificar ADMINS
    this.emitToRoom('admins', 'payment_request', eventData);

    // Notificar cliente que está acompanhando
    if (orderData.userId) {
      this.notifyUser(orderData.userId, 'order_awaiting_payment', {
        orderId: orderData.id,
        orderNumber: orderData.orderNumber,
        message: 'O atendente está vindo receber seu pagamento',
        paymentMethod: eventData.paymentLabel,
        total: orderData.total,
        timestamp: new Date()
      });
    }
  }

  // Notificar que pagamento foi confirmado pelo atendente
  notifyPaymentConfirmed(orderData, attendantName) {
    const eventData = {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      tableNumber: orderData.table?.number || 'Balcão',
      customerName: orderData.customer?.nome,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      confirmedBy: attendantName,
      timestamp: new Date()
    };

    console.log(`✅ [SOCKET] Pagamento confirmado para pedido #${orderData.orderNumber}`);

    // Notificar COZINHA e BAR que agora podem começar a preparar
    this.notifyNewOrder(orderData);

    // Notificar cliente
    if (orderData.userId) {
      this.notifyUser(orderData.userId, 'payment_confirmed', {
        orderId: orderData.id,
        orderNumber: orderData.orderNumber,
        message: 'Pagamento confirmado! Seu pedido está sendo preparado.',
        timestamp: new Date()
      });
    }

    // Também emitir para room do pedido
    this.emitToRoom(`order_${orderData.id}`, 'payment_confirmed', eventData);
  }

  // Notificar mudança de status do pedido
  notifyOrderStatusChange(orderId, status, additionalData = {}) {
    const eventData = {
      orderId,
      status,
      timestamp: new Date(),
      ...additionalData
    };

    // Notificar cliente que está acompanhando o pedido
    this.emitToRoom(`order_${orderId}`, 'order_status_updated', eventData);

    // IMPORTANTE: Notificar diretamente o dono do pedido via sua sala pessoal
    // Isso garante que mesmo se o cliente nao estiver na sala do pedido, ele receba a notificacao
    if (additionalData.userId) {
      console.log(`📡 [SOCKET] Notificando usuario ${additionalData.userId} sobre status ${status}`);
      this.emitToRoom(`user_${additionalData.userId}`, 'order_status_updated', eventData);

      // Se pedido ficou pronto, enviar evento especial
      if (status === 'ready') {
        this.emitToRoom(`user_${additionalData.userId}`, 'order_ready', {
          orderId,
          orderNumber: additionalData.orderNumber,
          message: 'Seu pedido está pronto!',
          timestamp: new Date()
        });
      }
    }

    // SEMPRE notificar admins sobre QUALQUER mudança de status
    console.log(`📡 [SOCKET] Notificando admins sobre status ${status} do pedido ${orderId}`);
    this.emitToRoom('admins', 'order_status_changed', eventData);

    // Notificar funcionários específicos baseado no status
    if (status === 'confirmed' || status === 'preparing') {
      // Atendente sabe que pedido está sendo preparado
      this.emitToRoom('attendants', 'order_status_changed', eventData);
    } else if (status === 'ready') {
      // ALERTA URGENTE para atendente - pedido pronto para buscar!
      console.log(`🔔 [SOCKET] ALERTA: Pedido ${orderId} PRONTO para buscar!`);
      this.emitToRoom('attendants', 'order_ready_alert', {
        ...eventData,
        priority: 'high',
        message: `Pedido #${additionalData.orderNumber || orderId} PRONTO para entrega!`
      });
    } else if (status === 'on_way') {
      // Cozinha/Bar sabe que pedido foi retirado
      this.emitToRoom('kitchen', 'order_picked_up', eventData);
      this.emitToRoom('bar', 'order_picked_up', eventData);
    } else if (status === 'delivered') {
      // Confirmar entrega
      this.emitToRoom('admins', 'order_delivered', eventData);
    } else if (status === 'cancelled') {
      // Notificar todos sobre cancelamento
      this.emitToRoom('kitchen', 'order_cancelled', eventData);
      this.emitToRoom('bar', 'order_cancelled', eventData);
      this.emitToRoom('attendants', 'order_cancelled', eventData);
    }
  }

  // Notificar pedido atrasado
  notifyDelayedOrder(orderData) {
    this.emitToRoom('admins', 'order_delayed', {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      tableNumber: orderData.table?.number,
      delayMinutes: orderData.delayMinutes,
      timestamp: new Date()
    });
  }

  // Enviar notificação para usuário específico
  notifyUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      return true;
    }
    return false;
  }

  // Enviar notificação para room específica
  emitToRoom(room, event, data) {
    this.io.to(room).emit(event, data);
  }

  // Broadcast para todos os usuários conectados
  broadcast(event, data) {
    this.io.emit(event, data);
  }

  // Obter usuários conectados
  getConnectedUsers() {
    return Array.from(this.connectedUsers.entries()).map(([userId, socketId]) => ({
      userId,
      socketId
    }));
  }

  // Obter contagem de usuários por role
  async getConnectionStats() {
    const sockets = await this.io.fetchSockets();
    
    const stats = {
      total: sockets.length,
      roles: {
        cliente: 0,
        atendente: 0,
        cozinha: 0,
        admin: 0
      }
    };

    sockets.forEach(socket => {
      if (socket.user && socket.user.role) {
        stats.roles[socket.user.role] = (stats.roles[socket.user.role] || 0) + 1;
      }
    });

    return stats;
  }

  // Desconectar usuário específico
  disconnectUser(userId) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.disconnect();
        return true;
      }
    }
    return false;
  }

  // Enviar mensagem de manutenção para todos
  sendMaintenanceMessage(message) {
    this.broadcast('maintenance_message', {
      message,
      timestamp: new Date()
    });
  }

  // =============================
  // EVENTOS DE NARGUILÉ
  // =============================

  setupHookahEvents(socket) {
    // Join hookah session room
    socket.on('join_hookah_session', (sessionId) => {
      socket.join(`hookah_${sessionId}`);
      console.log(`Usuário ${socket.user.nome} acompanhando sessão de narguilé ${sessionId}`);
    });

    socket.on('leave_hookah_session', (sessionId) => {
      socket.leave(`hookah_${sessionId}`);
    });

    // Bar staff events
    if (['bar', 'barman', 'admin'].includes(socket.user.role)) {
      socket.on('hookah_coal_changed', (data) => {
        this.emitToRoom(`hookah_${data.sessionId}`, 'hookah:coal_changed', {
          sessionId: data.sessionId,
          coalChangeCount: data.coalChangeCount,
          timestamp: new Date(),
          staffName: socket.user.nome
        });
      });

      socket.on('hookah_session_paused', (data) => {
        this.emitToRoom(`hookah_${data.sessionId}`, 'hookah:paused', {
          sessionId: data.sessionId,
          timestamp: new Date(),
          staffName: socket.user.nome
        });
      });

      socket.on('hookah_session_resumed', (data) => {
        this.emitToRoom(`hookah_${data.sessionId}`, 'hookah:resumed', {
          sessionId: data.sessionId,
          timestamp: new Date(),
          staffName: socket.user.nome
        });
      });
    }
  }

  // Notificar nova sessão de narguilé
  // NOTA: Atendente é responsável pelo narguilé, não o Bar
  notifyNewHookahSession(sessionData) {
    // Notificar atendentes (principal responsável)
    this.emitToRoom('attendants', 'hookah:session_started', {
      sessionId: sessionData.id,
      tableNumber: sessionData.mesa?.number,
      flavorName: sessionData.flavor?.name,
      duration: sessionData.duration,
      quantity: sessionData.quantity,
      timestamp: new Date()
    });

    // Também notificar bar (para preparar o carvão inicial)
    this.emitToRoom('bar', 'hookah:session_started', {
      sessionId: sessionData.id,
      tableNumber: sessionData.mesa?.number,
      flavorName: sessionData.flavor?.name,
      duration: sessionData.duration,
      quantity: sessionData.quantity,
      timestamp: new Date()
    });

    // Notificar mesa
    if (sessionData.mesa?.id) {
      this.emitToRoom(`table_${sessionData.mesa.id}`, 'hookah:session_started', {
        sessionId: sessionData.id,
        flavorName: sessionData.flavor?.name,
        duration: sessionData.duration,
        estimatedEnd: new Date(Date.now() + sessionData.duration * 60000),
        timestamp: new Date()
      });
    }
  }

  // Alerta de carvão (15 min antes do fim)
  // NOTA: Atendente é principal responsável
  notifyCoalChangeAlert(sessionData) {
    // Notificar atendentes (principal responsável)
    this.emitToRoom('attendants', 'hookah:coal_change_alert', {
      sessionId: sessionData.id,
      tableNumber: sessionData.mesa?.number,
      flavorName: sessionData.flavor?.name,
      remainingMinutes: sessionData.remainingMinutes,
      timestamp: new Date(),
      priority: 'high'
    });

    // Também notificar bar (backup)
    this.emitToRoom('bar', 'hookah:coal_change_alert', {
      sessionId: sessionData.id,
      tableNumber: sessionData.mesa?.number,
      flavorName: sessionData.flavor?.name,
      remainingMinutes: sessionData.remainingMinutes,
      timestamp: new Date(),
      priority: 'high'
    });

    // Notificar mesa
    if (sessionData.mesa?.id) {
      this.emitToRoom(`table_${sessionData.mesa.id}`, 'hookah:coal_alert', {
        message: 'Seu narguilé precisa de carvão novo em breve',
        remainingMinutes: sessionData.remainingMinutes,
        timestamp: new Date()
      });
    }
  }

  // Notificar overtime
  notifyHookahOvertime(sessionData) {
    this.emitToRoom('bar', 'hookah:overtime_warning', {
      sessionId: sessionData.id,
      tableNumber: sessionData.mesa?.number,
      flavorName: sessionData.flavor?.name,
      overtimeMinutes: sessionData.overtimeMinutes,
      additionalCharge: sessionData.additionalCharge,
      timestamp: new Date()
    });

    // Notificar mesa
    if (sessionData.mesa?.id) {
      this.emitToRoom(`table_${sessionData.mesa.id}`, 'hookah:overtime', {
        message: 'Seu narguilé está em tempo extra',
        overtimeMinutes: sessionData.overtimeMinutes,
        additionalCharge: sessionData.additionalCharge,
        timestamp: new Date()
      });
    }
  }

  // Notificar fim de sessão
  notifyHookahSessionEnded(sessionData) {
    this.emitToRoom('bar', 'hookah:session_ended', {
      sessionId: sessionData.id,
      tableNumber: sessionData.mesa?.number,
      flavorName: sessionData.flavor?.name,
      totalDuration: sessionData.totalDuration,
      finalPrice: sessionData.price,
      timestamp: new Date()
    });

    // Notificar mesa
    if (sessionData.mesa?.id) {
      this.emitToRoom(`table_${sessionData.mesa.id}`, 'hookah:session_ended', {
        sessionId: sessionData.id,
        totalDuration: sessionData.totalDuration,
        finalPrice: sessionData.price,
        timestamp: new Date()
      });
    }
  }

  // Sync timer em tempo real
  syncHookahTimer(sessionId, timerData) {
    this.emitToRoom(`hookah_${sessionId}`, 'hookah:timer_sync', {
      sessionId,
      elapsed: timerData.elapsed,
      remaining: timerData.remaining,
      status: timerData.status,
      timestamp: new Date()
    });
  }

  // =============================
  // EVENTOS DE RESERVAS
  // =============================

  setupReservationEvents(socket) {
    // Join reservation room
    socket.on('join_reservation', (reservationId) => {
      socket.join(`reservation_${reservationId}`);
      console.log(`Usuário ${socket.user.nome} acompanhando reserva ${reservationId}`);
    });

    socket.on('leave_reservation', (reservationId) => {
      socket.leave(`reservation_${reservationId}`);
    });

    // Admin events
    if (socket.user.role === 'admin') {
      socket.on('reservation_confirmed', (data) => {
        this.emitToRoom(`reservation_${data.reservationId}`, 'reservation:confirmed', {
          reservationId: data.reservationId,
          confirmedBy: socket.user.nome,
          tableNumber: data.tableNumber,
          timestamp: new Date()
        });
      });

      socket.on('reservation_reminder_sent', (data) => {
        this.emitToRoom('admins', 'reservation:reminder_sent', {
          reservationId: data.reservationId,
          timestamp: new Date()
        });
      });
    }
  }

  // Notificar nova reserva
  notifyNewReservation(reservationData) {
    this.emitToRoom('admins', 'reservation:new', {
      reservationId: reservationData.id,
      confirmationCode: reservationData.confirmationCode,
      customerName: reservationData.name,
      date: reservationData.reservationDate,
      time: reservationData.reservationTime,
      guests: reservationData.guests,
      phone: reservationData.phone,
      occasion: reservationData.occasion,
      timestamp: new Date()
    });

    // Notificar room de reservations
    this.emitToRoom('reservations', 'reservation:new', {
      reservationId: reservationData.id,
      date: reservationData.reservationDate,
      time: reservationData.reservationTime,
      guests: reservationData.guests,
      timestamp: new Date()
    });
  }

  // Notificar reserva confirmada
  notifyReservationConfirmed(reservationData) {
    // Notificar cliente (se conectado)
    if (reservationData.userId) {
      this.notifyUser(reservationData.userId, 'reservation:confirmed', {
        reservationId: reservationData.id,
        confirmationCode: reservationData.confirmationCode,
        tableNumber: reservationData.table?.number,
        date: reservationData.reservationDate,
        time: reservationData.reservationTime,
        timestamp: new Date()
      });
    }

    // Notificar room da reserva
    this.emitToRoom(`reservation_${reservationData.id}`, 'reservation:confirmed', {
      reservationId: reservationData.id,
      status: 'confirmed',
      tableNumber: reservationData.table?.number,
      timestamp: new Date()
    });
  }

  // Notificar lembrete devido (2h antes)
  notifyReservationReminderDue(reservationData) {
    this.emitToRoom('admins', 'reservation:reminder_due', {
      reservationId: reservationData.id,
      confirmationCode: reservationData.confirmationCode,
      customerName: reservationData.name,
      phone: reservationData.phone,
      time: reservationData.reservationTime,
      guests: reservationData.guests,
      minutesUntil: reservationData.minutesUntil,
      timestamp: new Date()
    });
  }

  // Notificar no-show detectado
  notifyReservationNoShow(reservationData) {
    this.emitToRoom('admins', 'reservation:no_show', {
      reservationId: reservationData.id,
      confirmationCode: reservationData.confirmationCode,
      customerName: reservationData.name,
      phone: reservationData.phone,
      date: reservationData.reservationDate,
      time: reservationData.reservationTime,
      guests: reservationData.guests,
      timestamp: new Date(),
      priority: 'medium'
    });
  }

  // Notificar cancelamento
  notifyReservationCancelled(reservationData) {
    this.emitToRoom('admins', 'reservation:cancelled', {
      reservationId: reservationData.id,
      confirmationCode: reservationData.confirmationCode,
      customerName: reservationData.name,
      date: reservationData.reservationDate,
      time: reservationData.reservationTime,
      reason: reservationData.cancellationReason,
      timestamp: new Date()
    });

    // Notificar room da reserva
    this.emitToRoom(`reservation_${reservationData.id}`, 'reservation:cancelled', {
      reservationId: reservationData.id,
      status: 'cancelled',
      timestamp: new Date()
    });
  }

  // Notificar chegada do cliente
  notifyReservationArrived(reservationData) {
    this.emitToRoom('admins', 'reservation:arrived', {
      reservationId: reservationData.id,
      confirmationCode: reservationData.confirmationCode,
      customerName: reservationData.name,
      tableNumber: reservationData.table?.number,
      timestamp: new Date()
    });
  }

  // =============================
  // SPRINT 56: EVENTOS DE CHAT
  // =============================

  setupChatEvents(socket) {
    // Entrar na sala do chat do pedido
    socket.on('chat:join', (orderId) => {
      socket.join(`chat_${orderId}`);
      console.log(`[CHAT] ${socket.user.nome} entrou no chat do pedido ${orderId}`);
    });

    socket.on('chat:leave', (orderId) => {
      socket.leave(`chat_${orderId}`);
    });

    // Enviar mensagem
    socket.on('chat:send', async (data) => {
      try {
        const { orderId, content, messageType = 'text' } = data;

        if (!orderId || !content) {
          socket.emit('chat:error', { message: 'Dados invalidos' });
          return;
        }

        // Determinar tipo do remetente
        const senderType = ['admin', 'atendente', 'cozinha', 'bar', 'barman', 'caixa'].includes(socket.user.role)
          ? 'staff'
          : 'cliente';

        // Criar mensagem no banco
        const message = await Message.create({
          orderId,
          senderId: socket.userId,
          senderType,
          content,
          messageType
        });

        // Buscar dados do remetente
        const messageData = {
          id: message.id,
          orderId,
          senderId: socket.userId,
          senderName: socket.user.nome,
          senderType,
          content,
          messageType,
          createdAt: message.createdAt
        };

        // Enviar para todos na sala do chat
        this.io.to(`chat_${orderId}`).emit('chat:message', messageData);

        // Se for cliente enviando, notificar staff
        if (senderType === 'cliente') {
          const order = await Order.findByPk(orderId, {
            include: [{ model: User, as: 'customer', attributes: ['nome'] }]
          });

          this.emitToRoom('attendants', 'chat:new_message', {
            orderId,
            orderNumber: order?.orderNumber,
            customerName: order?.customer?.nome || socket.user.nome,
            preview: content.substring(0, 50),
            timestamp: new Date()
          });
        }

        // Se for staff enviando, notificar cliente
        if (senderType === 'staff') {
          const order = await Order.findByPk(orderId);
          if (order?.userId) {
            this.notifyUser(order.userId, 'chat:new_message', {
              orderId,
              orderNumber: order.orderNumber,
              staffName: socket.user.nome,
              preview: content.substring(0, 50),
              timestamp: new Date()
            });
          }
        }

        console.log(`[CHAT] Mensagem enviada: ${socket.user.nome} -> pedido ${orderId}`);
      } catch (error) {
        console.error('[CHAT] Erro ao enviar mensagem:', error);
        socket.emit('chat:error', { message: 'Erro ao enviar mensagem' });
      }
    });

    // Marcar mensagens como lidas
    socket.on('chat:read', async (data) => {
      try {
        const { orderId } = data;

        // Marcar mensagens nao lidas como lidas
        await Message.update(
          { isRead: true, readAt: new Date() },
          {
            where: {
              orderId,
              senderId: { [Op.ne]: socket.userId },
              isRead: false
            }
          }
        );

        // Notificar que mensagens foram lidas
        this.io.to(`chat_${orderId}`).emit('chat:read', {
          orderId,
          readBy: socket.userId,
          readByName: socket.user.nome,
          readAt: new Date()
        });
      } catch (error) {
        console.error('[CHAT] Erro ao marcar como lido:', error);
      }
    });

    // Usuario digitando
    socket.on('chat:typing', (data) => {
      const { orderId, isTyping } = data;
      socket.to(`chat_${orderId}`).emit('chat:typing', {
        userId: socket.userId,
        userName: socket.user.nome,
        isTyping
      });
    });
  }

  // Notificar cliente sobre nova mensagem do staff
  notifyChatMessage(orderId, messageData) {
    this.io.to(`chat_${orderId}`).emit('chat:message', messageData);
  }

  // Notificar staff sobre mensagem nao lida
  notifyUnreadChat(orderId, customerName, messagePreview) {
    this.emitToRoom('attendants', 'chat:unread', {
      orderId,
      customerName,
      preview: messagePreview,
      timestamp: new Date()
    });
  }
}

// Instância singleton
const socketService = new SocketService();

module.exports = socketService;
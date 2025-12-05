const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
    this.connectedSockets = new Map(); // socketId -> userId
  }

  // Inicializar Socket.IO server
  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
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

    // Rooms específicas por role
    if (socket.user.role === 'admin') {
      socket.join('admins');
      socket.join('kitchen');
      socket.join('attendants');
      socket.join('bar');
      socket.join('reservations');
    } else if (socket.user.role === 'cozinha') {
      socket.join('kitchen');
    } else if (socket.user.role === 'atendente') {
      socket.join('attendants');
    } else if (socket.user.role === 'bar' || socket.user.role === 'barman') {
      socket.join('bar');
    }

    // Room do próprio usuário
    socket.join(`user_${socket.userId}`);
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
        const category = item.productCategory?.toLowerCase() || '';

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
      this.emitToRoom('kitchen', 'new_order', {
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
      this.emitToRoom('bar', 'new_order', {
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
    this.emitToRoom('attendants', 'new_order_notification', {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      tableNumber: orderData.table?.number,
      customerName: orderData.customer?.nome,
      total: orderData.total,
      timestamp: new Date()
    });
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

    // Notificar funcionários baseado no status
    if (status === 'preparing') {
      this.emitToRoom('attendants', 'order_status_changed', eventData);
    } else if (status === 'ready') {
      this.emitToRoom('attendants', 'order_ready_notification', eventData);
    } else if (status === 'on_way') {
      this.emitToRoom('kitchen', 'order_picked_up', eventData);
    } else if (status === 'delivered') {
      this.emitToRoom('admins', 'order_delivered', eventData);
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
  notifyNewHookahSession(sessionData) {
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
  notifyCoalChangeAlert(sessionData) {
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
}

// Instância singleton
const socketService = new SocketService();

module.exports = socketService;
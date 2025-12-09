import { io } from 'socket.io-client';

// Configuração da conexão Socket.IO
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // Conectar ao servidor Socket.IO
  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket.IO já conectado');
      return this.socket;
    }

    console.log('Conectando ao Socket.IO:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Event handlers
    this.socket.on('connect', () => {
      console.log('✅ Socket.IO conectado:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO desconectado:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão Socket.IO:', error.message);
    });

    this.socket.on('error', (error) => {
      console.error('Erro Socket.IO:', error);
    });

    return this.socket;
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      console.log('Socket.IO desconectado');
    }
  }

  // Entrar em uma sala (room)
  joinRoom(room) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', room);
      console.log(`Entrou na sala: ${room}`);
    }
  }

  // Sair de uma sala
  leaveRoom(room) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', room);
      console.log(`Saiu da sala: ${room}`);
    }
  }

  // Emitir evento
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
      console.log(`Emitido evento: ${event}`, data);
    } else {
      console.warn('Socket.IO não conectado. Evento não enviado:', event);
    }
  }

  // Adicionar listener para evento
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);

      // Guardar referência para possível remoção
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);

      console.log(`Listener adicionado para: ${event}`);
    }
  }

  // Remover listener específico
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);

      // Remover da lista de listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }

      console.log(`Listener removido de: ${event}`);
    }
  }

  // Remover todos os listeners de um evento
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
      console.log(`Todos os listeners removidos de: ${event}`);
    }
  }

  // =======================
  // EVENTOS ESPECÍFICOS
  // =======================

  // PEDIDOS
  onOrderCreated(callback) {
    this.on('order_created', callback);
  }

  onOrderUpdated(callback) {
    this.on('order_updated', callback);
  }

  onOrderStatusChanged(callback) {
    this.on('order_status_changed', callback);
  }

  onOrderReady(callback) {
    this.on('order_ready', callback);
  }

  onOrderDelivered(callback) {
    this.on('order_delivered', callback);
  }

  // Atualizar status do pedido
  updateOrderStatus(orderId, status) {
    this.emit('update_order_status', { orderId, status });
  }

  // Marcar item como pronto
  markItemReady(orderId, itemId) {
    this.emit('mark_item_ready', { orderId, itemId });
  }

  // Marcar pedido como entregue
  markOrderDelivered(orderId) {
    this.emit('mark_order_delivered', { orderId });
  }

  // NOTIFICAÇÕES
  onNotification(callback) {
    this.on('notification', callback);
  }

  // Enviar notificação
  sendNotification(notification) {
    this.emit('send_notification', notification);
  }

  // SALAS ESPECÍFICAS
  joinOrderRoom(orderId) {
    this.joinRoom(`order_${orderId}`);
  }

  leaveOrderRoom(orderId) {
    this.leaveRoom(`order_${orderId}`);
  }

  joinKitchenRoom() {
    this.joinRoom('kitchen');
  }

  leaveKitchenRoom() {
    this.leaveRoom('kitchen');
  }

  joinWaiterRoom() {
    // Entrar em ambas as salas para garantir compatibilidade
    this.joinRoom('waiter');
    this.joinRoom('attendants');
  }

  leaveWaiterRoom() {
    this.leaveRoom('waiter');
    this.leaveRoom('attendants');
  }

  joinAdminRoom() {
    this.joinRoom('admin');
  }

  leaveAdminRoom() {
    this.leaveRoom('admin');
  }

  // =======================
  // NARGUILÉ (HOOKAH)
  // =======================

  // Join hookah session room
  joinHookahSession(sessionId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_hookah_session', sessionId);
      console.log(`Acompanhando sessão de narguilé: ${sessionId}`);
    }
  }

  leaveHookahSession(sessionId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_hookah_session', sessionId);
      console.log(`Parou de acompanhar sessão: ${sessionId}`);
    }
  }

  // Join bar room
  joinBarRoom() {
    this.joinRoom('bar');
  }

  leaveBarRoom() {
    this.leaveRoom('bar');
  }

  // Eventos de narguilé
  onHookahSessionStarted(callback) {
    this.on('hookah:session_started', callback);
  }

  onHookahCoalChangeAlert(callback) {
    this.on('hookah:coal_change_alert', callback);
  }

  onHookahCoalChanged(callback) {
    this.on('hookah:coal_changed', callback);
  }

  onHookahSessionPaused(callback) {
    this.on('hookah:paused', callback);
  }

  onHookahSessionResumed(callback) {
    this.on('hookah:resumed', callback);
  }

  onHookahSessionEnded(callback) {
    this.on('hookah:session_ended', callback);
  }

  onHookahOvertimeWarning(callback) {
    this.on('hookah:overtime_warning', callback);
  }

  onHookahCoalAlert(callback) {
    this.on('hookah:coal_alert', callback);
  }

  onHookahOvertime(callback) {
    this.on('hookah:overtime', callback);
  }

  onHookahTimerSync(callback) {
    this.on('hookah:timer_sync', callback);
  }

  // Emitir eventos de narguilé (bar staff)
  emitHookahCoalChanged(sessionId, coalChangeCount) {
    this.emit('hookah_coal_changed', { sessionId, coalChangeCount });
  }

  emitHookahSessionPaused(sessionId) {
    this.emit('hookah_session_paused', { sessionId });
  }

  emitHookahSessionResumed(sessionId) {
    this.emit('hookah_session_resumed', { sessionId });
  }

  // =======================
  // RESERVAS
  // =======================

  // Join reservation room
  joinReservation(reservationId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_reservation', reservationId);
      console.log(`Acompanhando reserva: ${reservationId}`);
    }
  }

  leaveReservation(reservationId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_reservation', reservationId);
      console.log(`Parou de acompanhar reserva: ${reservationId}`);
    }
  }

  // Join reservations room (admin)
  joinReservationsRoom() {
    this.joinRoom('reservations');
  }

  leaveReservationsRoom() {
    this.leaveRoom('reservations');
  }

  // Eventos de reserva
  onReservationNew(callback) {
    this.on('reservation:new', callback);
  }

  onReservationConfirmed(callback) {
    this.on('reservation:confirmed', callback);
  }

  onReservationCancelled(callback) {
    this.on('reservation:cancelled', callback);
  }

  onReservationReminderDue(callback) {
    this.on('reservation:reminder_due', callback);
  }

  onReservationNoShow(callback) {
    this.on('reservation:no_show', callback);
  }

  onReservationArrived(callback) {
    this.on('reservation:arrived', callback);
  }

  onReservationReminderSent(callback) {
    this.on('reservation:reminder_sent', callback);
  }

  // Emitir eventos de reserva (admin)
  emitReservationConfirmed(reservationId, tableNumber) {
    this.emit('reservation_confirmed', { reservationId, tableNumber });
  }

  emitReservationReminderSent(reservationId) {
    this.emit('reservation_reminder_sent', { reservationId });
  }

  // Verificar se está conectado
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id || null
    };
  }

  // =======================
  // CHAT STAFF-CLIENTE (Sprint 56)
  // =======================

  // Entrar na sala de chat de um pedido
  joinChatRoom(orderId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('chat:join', orderId);
      console.log(`Entrou no chat do pedido: ${orderId}`);
    }
  }

  // Sair da sala de chat
  leaveChatRoom(orderId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('chat:leave', orderId);
      console.log(`Saiu do chat do pedido: ${orderId}`);
    }
  }

  // Enviar mensagem no chat
  sendChatMessage(orderId, content, messageType = 'text') {
    if (this.socket && this.isConnected) {
      this.socket.emit('chat:send', { orderId, content, messageType });
      console.log(`Mensagem enviada no chat ${orderId}:`, content);
    }
  }

  // Marcar mensagens como lidas
  markChatAsRead(orderId, messageIds) {
    if (this.socket && this.isConnected) {
      this.socket.emit('chat:read', { orderId, messageIds });
    }
  }

  // Emitir indicador de digitação
  emitTyping(orderId, isTyping) {
    if (this.socket && this.isConnected) {
      this.socket.emit('chat:typing', { orderId, isTyping });
    }
  }

  // Listeners de chat
  onChatMessage(callback) {
    this.on('chat:message', callback);
  }

  onChatRead(callback) {
    this.on('chat:read', callback);
  }

  onChatTyping(callback) {
    this.on('chat:typing', callback);
  }

  onChatNewMessage(callback) {
    this.on('chat:new_message', callback);
  }

  // Remover listeners de chat
  offChatMessage(callback) {
    this.off('chat:message', callback);
  }

  offChatRead(callback) {
    this.off('chat:read', callback);
  }

  offChatTyping(callback) {
    this.off('chat:typing', callback);
  }

  offChatNewMessage(callback) {
    this.off('chat:new_message', callback);
  }
}

// Singleton instance
const socketService = new SocketService();

export default socketService;

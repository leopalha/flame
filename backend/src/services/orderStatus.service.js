/**
 * Order Status Machine Service
 * Controla as transições de status e permissões
 *
 * FLUXO CORRETO (pagamento antecipado):
 * 1. Cliente faz pedido + paga → pending (paymentStatus: processing)
 * 2. Pagamento confirmado → confirmed (paymentStatus: completed)
 * 3. Cozinha/Bar aceita e prepara → preparing
 * 4. Cozinha/Bar finaliza → ready
 * 5. Atendente busca → on_way
 * 6. Atendente entrega → delivered
 * 7. Cliente avalia (opcional)
 */

// Transições de status permitidas
const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'preparing', 'cancelled'],           // confirmed após pagamento online
  pending_payment: ['confirmed', 'cancelled'],                // Aguardando atendente confirmar pagamento
  confirmed: ['preparing', 'cancelled'],                      // Cozinha/Bar aceita
  preparing: ['ready', 'cancelled'],                          // Cozinha/Bar finaliza
  ready: ['on_way', 'cancelled'],                             // Atendente busca
  on_way: ['delivered'],                                      // Atendente entrega
  delivered: [],                                              // Estado final (pode avaliar)
  cancelled: []                                               // Estado final
};

// Quem pode fazer cada transição
const STATUS_PERMISSIONS = {
  // Cozinha/Bar podem: aceitar pedido e marcar como pronto
  'pending→confirmed': ['cozinha', 'bar', 'admin', 'gerente'],
  'pending→preparing': ['cozinha', 'bar', 'admin', 'gerente'],  // Se pagamento online aprovado
  'confirmed→preparing': ['cozinha', 'bar', 'admin', 'gerente'],
  'preparing→ready': ['cozinha', 'bar', 'admin', 'gerente'],

  // Atendente pode: confirmar pagamento na mesa, buscar e entregar pedido
  'pending_payment→confirmed': ['atendente', 'caixa', 'admin', 'gerente'],  // Atendente confirma pagamento
  'ready→on_way': ['atendente', 'admin', 'gerente'],
  'on_way→delivered': ['atendente', 'admin', 'gerente'],

  // Cancelamento: cliente só se pending, staff pode em qualquer momento (exceto delivered)
  'pending→cancelled': ['cliente', 'cozinha', 'bar', 'atendente', 'admin', 'gerente'],
  'pending_payment→cancelled': ['cliente', 'atendente', 'admin', 'gerente'],  // Cliente pode cancelar enquanto espera atendente
  'confirmed→cancelled': ['cozinha', 'bar', 'admin', 'gerente'],
  'preparing→cancelled': ['cozinha', 'bar', 'admin', 'gerente'],
  'ready→cancelled': ['admin', 'gerente']  // Só admin cancela pedido pronto
};

// Descrições de status em português
const STATUS_LABELS = {
  pending: 'Aguardando Pagamento',
  pending_payment: 'Aguardando Atendente',
  confirmed: 'Confirmado',
  preparing: 'Em Preparo',
  ready: 'Pronto',
  on_way: 'Saiu para Entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado'
};

class OrderStatusService {
  /**
   * Verifica se a transição de status é válida
   * @param {string} currentStatus - Status atual
   * @param {string} newStatus - Novo status desejado
   * @returns {boolean}
   */
  isValidTransition(currentStatus, newStatus) {
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Verifica se o usuário tem permissão para fazer a transição
   * @param {string} currentStatus - Status atual
   * @param {string} newStatus - Novo status desejado
   * @param {string} userRole - Role do usuário
   * @returns {boolean}
   */
  hasPermission(currentStatus, newStatus, userRole) {
    const transitionKey = `${currentStatus}→${newStatus}`;
    const allowedRoles = STATUS_PERMISSIONS[transitionKey] || [];
    return allowedRoles.includes(userRole);
  }

  /**
   * Valida a transição completa (válida + permissão)
   * @param {string} currentStatus
   * @param {string} newStatus
   * @param {string} userRole
   * @returns {{ valid: boolean, error?: string }}
   */
  validateTransition(currentStatus, newStatus, userRole) {
    // Verificar se transição é válida
    if (!this.isValidTransition(currentStatus, newStatus)) {
      return {
        valid: false,
        error: `Não é possível mudar de "${STATUS_LABELS[currentStatus]}" para "${STATUS_LABELS[newStatus]}"`
      };
    }

    // Verificar permissão
    if (!this.hasPermission(currentStatus, newStatus, userRole)) {
      return {
        valid: false,
        error: `Você não tem permissão para esta ação. Função "${userRole}" não pode mudar para "${STATUS_LABELS[newStatus]}"`
      };
    }

    return { valid: true };
  }

  /**
   * Retorna os próximos status válidos para o usuário
   * @param {string} currentStatus
   * @param {string} userRole
   * @returns {string[]}
   */
  getNextValidStatuses(currentStatus, userRole) {
    const possibleTransitions = STATUS_TRANSITIONS[currentStatus] || [];

    return possibleTransitions.filter(nextStatus => {
      return this.hasPermission(currentStatus, nextStatus, userRole);
    });
  }

  /**
   * Retorna os campos de timestamp a atualizar baseado no status
   * @param {string} newStatus
   * @param {string} userId - ID do usuário que fez a ação
   * @returns {Object}
   */
  getTimestampFields(newStatus, userId) {
    const now = new Date();
    const fields = {};

    switch (newStatus) {
      case 'confirmed':
        fields.confirmedAt = now;
        break;
      case 'preparing':
        fields.startedAt = now;
        fields.kitchenUserId = userId;
        break;
      case 'ready':
        fields.finishedAt = now;
        break;
      case 'on_way':
        fields.pickedUpAt = now;
        fields.attendantId = userId;
        break;
      case 'delivered':
        fields.deliveredAt = now;
        fields.isDelivered = true;
        break;
      case 'cancelled':
        fields.cancelledAt = now;
        fields.cancelledBy = userId;
        break;
    }

    return fields;
  }

  /**
   * Retorna as notificações a enviar baseado na transição
   * @param {string} newStatus
   * @returns {{ rooms: string[], event: string, priority: string }}
   */
  getNotificationConfig(newStatus) {
    const configs = {
      confirmed: {
        rooms: ['kitchen', 'bar', 'attendants', 'admins'],
        event: 'order_confirmed',
        priority: 'normal'
      },
      preparing: {
        rooms: ['attendants', 'admins'],
        event: 'order_preparing',
        priority: 'normal'
      },
      ready: {
        rooms: ['attendants', 'admins'],
        event: 'order_ready_alert',
        priority: 'high',
        sendSms: true,
        sendPush: true
      },
      on_way: {
        rooms: ['kitchen', 'bar', 'admins'],
        event: 'order_picked_up',
        priority: 'normal'
      },
      delivered: {
        rooms: ['admins'],
        event: 'order_delivered',
        priority: 'low'
      },
      cancelled: {
        rooms: ['kitchen', 'bar', 'attendants', 'admins'],
        event: 'order_cancelled',
        priority: 'high'
      }
    };

    return configs[newStatus] || { rooms: [], event: 'order_status_changed', priority: 'normal' };
  }

  /**
   * Retorna label do status em português
   * @param {string} status
   * @returns {string}
   */
  getStatusLabel(status) {
    return STATUS_LABELS[status] || status;
  }

  /**
   * Retorna todos os status disponíveis
   * @returns {Object}
   */
  getAllStatuses() {
    return STATUS_LABELS;
  }

  /**
   * Calcula tempo em cada etapa
   * @param {Object} order - Objeto do pedido com timestamps
   * @returns {Object}
   */
  calculateTimeline(order) {
    const timeline = {
      created: order.createdAt,
      confirmed: order.confirmedAt,
      preparingStarted: order.startedAt,
      ready: order.finishedAt,
      pickedUp: order.pickedUpAt,
      delivered: order.deliveredAt
    };

    // Calcular durações
    const durations = {};

    if (timeline.confirmed && timeline.created) {
      durations.waitingTime = Math.round((new Date(timeline.confirmed) - new Date(timeline.created)) / 60000);
    }

    if (timeline.ready && timeline.preparingStarted) {
      durations.preparationTime = Math.round((new Date(timeline.ready) - new Date(timeline.preparingStarted)) / 60000);
    }

    if (timeline.pickedUp && timeline.ready) {
      durations.waitingForPickup = Math.round((new Date(timeline.pickedUp) - new Date(timeline.ready)) / 60000);
    }

    if (timeline.delivered && timeline.created) {
      durations.totalTime = Math.round((new Date(timeline.delivered) - new Date(timeline.created)) / 60000);
    }

    return { timeline, durations };
  }
}

module.exports = new OrderStatusService();

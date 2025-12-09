import { create } from 'zustand';
import api from '../services/api';

const useStaffStore = create((set, get) => ({
  // Estado
  orders: {
    pending: [],
    preparing: [],
    ready: [],
    on_way: []
  },
  alerts: {
    delayed: [],
    lowStock: []
  },
  currentUser: null,
  stats: {
    total: 0,
    completedToday: 0,
    delayed: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    on_way: 0
  },
  timers: {}, // orderId -> {startedAt, elapsedSeconds}
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 50
  },

  // Ações: Buscar dashboard
  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/staff/dashboard");
      if (response.data.success) {
        const { stats, orders, userRole } = response.data.data;
        set({
          stats,
          orders,
          currentUser: { role: userRole },
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Buscar pedidos com filtros
  fetchOrders: async (status = 'pending,preparing', page = 1, limit = 50) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/staff/orders", {
        params: {
          status,
          limit,
          offset: (page - 1) * limit
        }
      });
      if (response.data.success) {
        const { orders, pagination } = response.data.data;

        // Organizar por status
        const organized = {
          pending: orders.filter(o => o.status === 'pending'),
          preparing: orders.filter(o => o.status === 'preparing'),
          ready: orders.filter(o => o.status === 'ready'),
          on_way: orders.filter(o => o.status === 'on_way')
        };

        set({
          orders: organized,
          pagination,
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Buscar detalhes de um pedido
  fetchOrderDetails: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/staff/orders/${orderId}/details`);
      if (response.data.success) {
        set({ loading: false });
        return response.data.data.order;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Atualizar status do pedido
  updateOrderStatus: async (orderId, status, notes = '') => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/staff/orders/${orderId}/status`, {
        status,
        notes
      });
      if (response.data.success) {
        // Recarregar dashboard após atualizar
        get().fetchDashboard();
        set({ loading: false });
        return response.data.data.order;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Ações: Buscar alertas
  fetchAlerts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/staff/alerts");
      if (response.data.success) {
        set({
          alerts: response.data.data.alerts,
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Iniciar timer
  startTimer: async (orderId) => {
    try {
      const response = await api.post("/staff/start-timer", {
        orderId
      });
      if (response.data.success) {
        const startedAt = new Date(response.data.data.startedAt);
        set(state => ({
          timers: {
            ...state.timers,
            [orderId]: {
              startedAt,
              elapsedSeconds: 0
            }
          }
        }));
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message
      });
      throw error;
    }
  },

  // Ações: Atualizar timer local a cada segundo
  tickTimer: (orderId) => {
    set(state => {
      if (!state.timers[orderId]) return state;

      return {
        timers: {
          ...state.timers,
          [orderId]: {
            ...state.timers[orderId],
            elapsedSeconds: state.timers[orderId].elapsedSeconds + 1
          }
        }
      };
    });
  },

  // Ações: Parar timer
  stopTimer: (orderId) => {
    set(state => {
      const newTimers = { ...state.timers };
      delete newTimers[orderId];
      return { timers: newTimers };
    });
  },

  // Ações: Obter tempo decorrido formatado
  getElapsedTime: (orderId) => {
    const state = get();
    if (!state.timers[orderId]) return '00:00';

    const seconds = state.timers[orderId].elapsedSeconds;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  // Ações: Verificar se pedido está atrasado
  isOrderDelayed: (orderId, thresholdMinutes = 15) => {
    const state = get();
    if (!state.timers[orderId]) return false;

    const minutes = state.timers[orderId].elapsedSeconds / 60;
    return minutes > thresholdMinutes;
  },

  // Ações: Limpar erro
  clearError: () => {
    set({ error: null });
  },

  // Ações: Reset do estado
  reset: () => {
    set({
      orders: { pending: [], preparing: [], ready: [], on_way: [] },
      alerts: { delayed: [], lowStock: [] },
      currentUser: null,
      stats: { total: 0, completedToday: 0, delayed: 0, pending: 0, preparing: 0, ready: 0 },
      timers: {},
      loading: false,
      error: null,
      pagination: { currentPage: 1, totalPages: 1, total: 0, limit: 50 }
    });
  }
}));

export default useStaffStore;

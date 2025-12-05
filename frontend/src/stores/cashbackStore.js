import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

const useCashbackStore = create((set, get) => ({
  // State
  balance: 0,
  tier: 'bronze',
  tierBenefits: null,
  nextTierInfo: null,
  history: [],
  historyPagination: null,
  loading: false,
  error: null,

  // Actions
  fetchBalance: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/cashback`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { balance, tier, tierBenefits, nextTierInfo } = response.data.data;

      set({
        balance: parseFloat(balance) || 0,
        tier: tier || 'bronze',
        tierBenefits,
        nextTierInfo,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar cashback:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar cashback',
        loading: false
      });
    }
  },

  fetchHistory: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/cashback/history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit }
      });

      const { history, pagination } = response.data.data;

      set({
        history: history || [],
        historyPagination: pagination,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar histórico',
        loading: false
      });
    }
  },

  // Calculate how much cashback can be used in checkout (max 50% of total)
  calculateMaxCashbackUsable: (orderTotal) => {
    const { balance } = get();
    const maxAllowed = orderTotal * 0.5; // 50% do total
    return Math.min(balance, maxAllowed);
  },

  // Apply cashback to an order
  applyCashback: async (orderId, amount) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/orders/${orderId}/use-cashback`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update balance after using cashback
      get().fetchBalance();

      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error('Erro ao usar cashback:', error);
      set({
        error: error.response?.data?.message || 'Erro ao aplicar cashback',
        loading: false
      });
      throw error;
    }
  },

  // Reset error
  clearError: () => set({ error: null }),

  // Reset all state
  reset: () => set({
    balance: 0,
    tier: 'bronze',
    tierBenefits: null,
    nextTierInfo: null,
    history: [],
    historyPagination: null,
    loading: false,
    error: null
  })
}));

export default useCashbackStore;

import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

const useCashierStore = create((set, get) => ({
  // State
  currentCashier: null,
  cashierHistory: [],
  cashierDetails: null,
  cashierStats: null,
  historyPagination: null,
  loading: false,
  error: null,

  // Actions

  /**
   * Abre um novo caixa
   */
  openCashier: async (openingAmount, notes) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/cashier/open`,
        { openingAmount: parseFloat(openingAmount), notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({
        currentCashier: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao abrir caixa';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Busca o caixa atualmente aberto
   */
  fetchCurrentCashier: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cashier/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        currentCashier: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      // Se não houver caixa aberto, não é erro
      if (error.response?.status === 404) {
        set({ currentCashier: null, loading: false });
        return null;
      }

      const errorMsg = error.response?.data?.message || 'Erro ao buscar caixa';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Registra um suprimento
   */
  registerDeposit: async (cashierId, amount, description) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/cashier/deposit`,
        {
          cashierId,
          amount: parseFloat(amount),
          description
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza o caixa atual
      await get().fetchCurrentCashier();

      set({ loading: false });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao registrar suprimento';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Registra uma sangria
   */
  registerWithdrawal: async (cashierId, amount, description) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/cashier/withdrawal`,
        {
          cashierId,
          amount: parseFloat(amount),
          description
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza o caixa atual
      await get().fetchCurrentCashier();

      set({ loading: false });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao registrar sangria';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Fecha o caixa
   */
  closeCashier: async (cashierId, closingAmount, notes) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/cashier/close`,
        {
          cashierId,
          closingAmount: parseFloat(closingAmount),
          notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({
        currentCashier: null,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao fechar caixa';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Busca histórico de caixas
   */
  fetchCashierHistory: async (page = 1, limit = 20, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await axios.get(`${API_URL}/cashier/history?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        cashierHistory: response.data.data,
        historyPagination: response.data.pagination,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao buscar histórico';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Busca detalhes de um caixa específico
   */
  fetchCashierDetails: async (cashierId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cashier/${cashierId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        cashierDetails: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao buscar detalhes do caixa';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Busca estatísticas de caixas
   */
  fetchCashierStats: async (days = 30) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cashier/stats?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        cashierStats: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao buscar estatísticas';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Limpa os detalhes do caixa selecionado
   */
  clearCashierDetails: () => {
    set({ cashierDetails: null });
  },

  /**
   * Limpa o erro
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Reset completo do estado
   */
  reset: () => {
    set({
      currentCashier: null,
      cashierHistory: [],
      cashierDetails: null,
      cashierStats: null,
      historyPagination: null,
      loading: false,
      error: null
    });
  }
}));

export default useCashierStore;

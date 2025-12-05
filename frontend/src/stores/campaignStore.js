import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

const useCampaignStore = create((set, get) => ({
  // State
  campaigns: [],
  selectedCampaign: null,
  stats: null,
  audiencePreview: [],
  simulationStats: null,
  pagination: null,
  loading: false,
  error: null,

  // Filters
  filters: {
    page: 1,
    limit: 20,
    status: null,
    type: null
  },

  // Actions
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  // Fetch campaigns list
  fetchCampaigns: async () => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });

      set({
        campaigns: response.data.data,
        pagination: response.data.pagination,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar campanhas',
        loading: false
      });
    }
  },

  // Fetch campaign stats
  fetchStats: async () => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/campaigns/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        stats: response.data.data,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar estatísticas',
        loading: false
      });
    }
  },

  // Fetch single campaign
  fetchCampaign: async (id) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        selectedCampaign: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar campanha:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar campanha',
        loading: false
      });
      throw error;
    }
  },

  // Create campaign
  createCampaign: async (data) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/campaigns`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add to list
      set((state) => ({
        campaigns: [response.data.data, ...state.campaigns],
        loading: false
      }));

      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      set({
        error: error.response?.data?.message || 'Erro ao criar campanha',
        loading: false
      });
      throw error;
    }
  },

  // Update campaign
  updateCampaign: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/campaigns/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update in list
      set((state) => ({
        campaigns: state.campaigns.map(c =>
          c.id === id ? response.data.data : c
        ),
        selectedCampaign: response.data.data,
        loading: false
      }));

      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
      set({
        error: error.response?.data?.message || 'Erro ao atualizar campanha',
        loading: false
      });
      throw error;
    }
  },

  // Delete campaign
  deleteCampaign: async (id) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from list
      set((state) => ({
        campaigns: state.campaigns.filter(c => c.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Erro ao deletar campanha:', error);
      set({
        error: error.response?.data?.message || 'Erro ao deletar campanha',
        loading: false
      });
      throw error;
    }
  },

  // Get audience preview
  fetchAudience: async (id) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/campaigns/${id}/audience`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        audiencePreview: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar público:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar público',
        loading: false
      });
      throw error;
    }
  },

  // Simulate send
  simulateSend: async (id) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/campaigns/${id}/simulate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        simulationStats: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      console.error('Erro ao simular envio:', error);
      set({
        error: error.response?.data?.message || 'Erro na simulação',
        loading: false
      });
      throw error;
    }
  },

  // Execute campaign
  executeCampaign: async (id) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/campaigns/${id}/execute`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update in list
      set((state) => ({
        campaigns: state.campaigns.map(c =>
          c.id === id ? response.data.data.campaign : c
        ),
        selectedCampaign: response.data.data.campaign,
        loading: false
      }));

      return response.data;
    } catch (error) {
      console.error('Erro ao executar campanha:', error);
      set({
        error: error.response?.data?.message || 'Erro ao executar campanha',
        loading: false
      });
      throw error;
    }
  },

  // Pause campaign
  pauseCampaign: async (id) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/campaigns/${id}/pause`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update in list
      set((state) => ({
        campaigns: state.campaigns.map(c =>
          c.id === id ? response.data.data : c
        ),
        loading: false
      }));

      return response.data.data;
    } catch (error) {
      console.error('Erro ao pausar campanha:', error);
      set({
        error: error.response?.data?.message || 'Erro ao pausar campanha',
        loading: false
      });
      throw error;
    }
  },

  // Complete campaign
  completeCampaign: async (id) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/campaigns/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update in list
      set((state) => ({
        campaigns: state.campaigns.map(c =>
          c.id === id ? response.data.data : c
        ),
        loading: false
      }));

      return response.data.data;
    } catch (error) {
      console.error('Erro ao completar campanha:', error);
      set({
        error: error.response?.data?.message || 'Erro ao completar campanha',
        loading: false
      });
      throw error;
    }
  },

  // Create quick reactivation campaign
  createQuickReactivation: async (days) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/campaigns/quick-reactivation`, { days }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add to list
      set((state) => ({
        campaigns: [response.data.data, ...state.campaigns],
        loading: false
      }));

      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar campanha de reativação:', error);
      set({
        error: error.response?.data?.message || 'Erro ao criar campanha',
        loading: false
      });
      throw error;
    }
  },

  // Clear selection
  clearSelection: () => {
    set({
      selectedCampaign: null,
      audiencePreview: [],
      simulationStats: null
    });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    campaigns: [],
    selectedCampaign: null,
    stats: null,
    audiencePreview: [],
    simulationStats: null,
    pagination: null,
    loading: false,
    error: null,
    filters: {
      page: 1,
      limit: 20,
      status: null,
      type: null
    }
  })
}));

export default useCampaignStore;

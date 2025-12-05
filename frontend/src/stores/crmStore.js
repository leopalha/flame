import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

const useCRMStore = create((set, get) => ({
  // State
  customers: [],
  selectedCustomer: null,
  customerStats: null,
  dashboardStats: null,
  inactiveCustomers: [],
  nearUpgradeCustomers: [],
  pagination: null,
  loading: false,
  error: null,

  // Filters
  filters: {
    search: '',
    tier: null,
    sortBy: 'totalSpent',
    sortOrder: 'DESC',
    page: 1,
    limit: 20
  },

  // Actions
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        search: '',
        tier: null,
        sortBy: 'totalSpent',
        sortOrder: 'DESC',
        page: 1,
        limit: 20
      }
    });
  },

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/crm/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        dashboardStats: response.data.data,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar dashboard stats:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar dashboard',
        loading: false
      });
    }
  },

  fetchCustomers: async () => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/crm/customers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });

      set({
        customers: response.data.data,
        pagination: response.data.pagination,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar clientes',
        loading: false
      });
    }
  },

  fetchCustomerDetails: async (customerId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/crm/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        selectedCustomer: response.data.data.user,
        customerStats: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do cliente:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar detalhes',
        loading: false
      });
      throw error;
    }
  },

  fetchInactiveCustomers: async (days = 30) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/crm/inactive`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { days }
      });

      set({
        inactiveCustomers: response.data.data,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar clientes inativos:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar clientes inativos',
        loading: false
      });
    }
  },

  fetchNearUpgradeCustomers: async (threshold = 100) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/crm/near-upgrade`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { threshold }
      });

      set({
        nearUpgradeCustomers: response.data.data,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar clientes próximos ao upgrade:', error);
      set({
        error: error.response?.data?.message || 'Erro ao carregar dados',
        loading: false
      });
    }
  },

  addManualCashback: async (customerId, amount, description) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/crm/customers/${customerId}/cashback`,
        { amount, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh customer details if this customer is currently selected
      if (get().selectedCustomer?.id === customerId) {
        await get().fetchCustomerDetails(customerId);
      }

      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar cashback:', error);
      set({
        error: error.response?.data?.message || 'Erro ao adicionar cashback',
        loading: false
      });
      throw error;
    }
  },

  adjustTier: async (customerId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/crm/customers/${customerId}/tier`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh customer details if this customer is currently selected
      if (get().selectedCustomer?.id === customerId) {
        await get().fetchCustomerDetails(customerId);
      }

      // Refresh customer list
      await get().fetchCustomers();

      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error('Erro ao ajustar tier:', error);
      set({
        error: error.response?.data?.message || 'Erro ao ajustar tier',
        loading: false
      });
      throw error;
    }
  },

  clearSelectedCustomer: () => {
    set({
      selectedCustomer: null,
      customerStats: null
    });
  },

  clearError: () => set({ error: null }),

  reset: () => set({
    customers: [],
    selectedCustomer: null,
    customerStats: null,
    dashboardStats: null,
    inactiveCustomers: [],
    nearUpgradeCustomers: [],
    pagination: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      tier: null,
      sortBy: 'totalSpent',
      sortOrder: 'DESC',
      page: 1,
      limit: 20
    }
  })
}));

export default useCRMStore;

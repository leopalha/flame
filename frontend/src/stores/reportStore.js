import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

const useReportStore = create((set, get) => ({
  // State
  dashboard: null,
  salesReport: null,
  productsReport: null,
  categoriesReport: null,
  hourlyReport: null,
  dreReport: null,
  loading: false,
  error: null,

  // Actions

  /**
   * Busca dashboard consolidado
   */
  fetchDashboard: async (days = 30) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/reports/dashboard?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        dashboard: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao buscar dashboard';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Busca relatório de vendas
   */
  fetchSalesReport: async ({ startDate, endDate, groupBy = 'day' }) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (groupBy) params.append('groupBy', groupBy);

      const response = await axios.get(`${API_URL}/reports/sales?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        salesReport: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao buscar relatório de vendas';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Busca relatório de produtos
   */
  fetchProductsReport: async ({ startDate, endDate, limit = 20 }) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (limit) params.append('limit', limit.toString());

      const response = await axios.get(`${API_URL}/reports/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        productsReport: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao buscar relatório de produtos';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Busca relatório de categorias
   */
  fetchCategoriesReport: async ({ startDate, endDate }) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`${API_URL}/reports/categories?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        categoriesReport: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao buscar relatório de categorias';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Busca relatório por horário
   */
  fetchHourlyReport: async ({ startDate, endDate }) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`${API_URL}/reports/hourly?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        hourlyReport: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao buscar relatório por horário';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Busca DRE
   */
  fetchDREReport: async ({ startDate, endDate }) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`${API_URL}/reports/dre?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        dreReport: response.data.data,
        loading: false
      });

      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao buscar DRE';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  /**
   * Limpa relatório específico
   */
  clearReport: (reportName) => {
    set({ [reportName]: null });
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
      dashboard: null,
      salesReport: null,
      productsReport: null,
      categoriesReport: null,
      hourlyReport: null,
      dreReport: null,
      loading: false,
      error: null
    });
  }
}));

export default useReportStore;

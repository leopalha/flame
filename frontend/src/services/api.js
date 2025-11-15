import axios from 'axios';
import { toast } from 'react-hot-toast';
import { safeLocalStorage } from '../utils/storage';

// API Base URL - pode vir de variáveis de ambiente
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    // Add auth token if exists
    const authData = safeLocalStorage.getItem('redlight-auth');
    const token = authData ? JSON.parse(authData).state?.token : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      toast.error('Erro de conexão. Verifique sua internet.');
      return Promise.reject(error);
    }

    // Handle 401 - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const authDataStr = safeLocalStorage.getItem('redlight-auth');
        const authData = authDataStr ? JSON.parse(authDataStr) : null;

        if (authData?.state?.refreshToken) {
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken: authData.state.refreshToken,
          });

          if (refreshResponse.data.success) {
            const newToken = refreshResponse.data.data.token;

            // Update stored auth data
            authData.state.token = newToken;
            safeLocalStorage.setItem('redlight-auth', JSON.stringify(authData));

            // Update authorization header
            api.defaults.headers.Authorization = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Retry original request
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }

      // Clear auth data and redirect to login
      safeLocalStorage.removeItem('redlight-auth');
      delete api.defaults.headers.Authorization;
      
      // Only show toast if not on login page
      if (!window.location.pathname.includes('/login')) {
        toast.error('Sessão expirada. Faça login novamente.');
      }

      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      toast.error('Acesso negado.');
    }

    // Handle 404 - Not Found
    if (error.response?.status === 404) {
      const message = error.response?.data?.message || 'Recurso não encontrado';
      if (!originalRequest.suppressErrors) {
        toast.error(message);
      }
    }

    // Handle 422 - Validation Error
    if (error.response?.status === 422) {
      const message = error.response?.data?.message || 'Dados inválidos';
      if (!originalRequest.suppressErrors) {
        toast.error(message);
      }
    }

    // Handle 429 - Rate Limit
    if (error.response?.status === 429) {
      toast.error('Muitas tentativas. Tente novamente em alguns minutos.');
    }

    // Handle 500 - Server Error
    if (error.response?.status >= 500) {
      const message = process.env.NODE_ENV === 'development' 
        ? error.response?.data?.message || 'Erro interno do servidor'
        : 'Erro interno do servidor';
      
      if (!originalRequest.suppressErrors) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

// API helper methods
export const apiHelpers = {
  // Get with error suppression
  getSilent: (url, config = {}) => {
    return api.get(url, { ...config, suppressErrors: true });
  },

  // Post with loading state
  postWithLoading: async (url, data, config = {}) => {
    const loadingToast = toast.loading('Enviando...');
    try {
      const response = await api.post(url, data, config);
      toast.dismiss(loadingToast);
      return response;
    } catch (error) {
      toast.dismiss(loadingToast);
      throw error;
    }
  },

  // Upload file with progress
  uploadFile: (url, formData, onUploadProgress) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  // Download file
  downloadFile: async (url, filename) => {
    try {
      const response = await api.get(url, {
        responseType: 'blob',
      });

      // Create blob link to download
      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      return { success: true };
    } catch (error) {
      toast.error('Erro ao fazer download do arquivo');
      return { success: false, error };
    }
  },

  // Retry request with exponential backoff
  retryRequest: async (requestFn, maxRetries = 3, initialDelay = 1000) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw error;
        }
        
        if (i < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health', { suppressErrors: true });
    return response.data.success;
  } catch (error) {
    return false;
  }
};

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.Authorization;
  }
};

// Clear auth token
export const clearAuthToken = () => {
  delete api.defaults.headers.Authorization;
};

export { api };
export default api;
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { mockUsers } from '../data/mockData';
import { safeLocalStorage } from '../utils/storage';

// Função para verificar se deve usar dados mockados
const shouldUseMockData = () => {
  // Verificar se está no ambiente de browser
  if (typeof window === 'undefined') {
    // No servidor (SSR), sempre usar mock em desenvolvimento
    return process.env.NODE_ENV === 'development';
  }

  if (process.env.NODE_ENV === 'development') {
    const mockDataSetting = safeLocalStorage.getItem('useMockData');
    return mockDataSetting === null || mockDataSetting === 'true';
  }
  return !process.env.NEXT_PUBLIC_API_URL || safeLocalStorage.getItem('useMockData') === 'true';
};

// Função para simular delay de rede
const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Usuários mockados para autenticação rápida
const mockAuthUsers = {
  'admin@admin.com': {
    id: '3',
    nome: 'Admin Exxquema',
    email: 'admin@admin.com',
    telefone: '(21) 99999-0000',
    role: 'admin',
    ativo: true,
    password: 'admin123'
  },
  'admin@redlight.com.br': {
    id: '3',
    nome: 'Admin Exxquema',
    email: 'admin@redlight.com.br',
    telefone: '(21) 99999-0000',
    role: 'admin',
    ativo: true,
    password: '123456'
  },
  'cliente@test.com': {
    id: '1',
    nome: 'Cliente Teste',
    email: 'cliente@test.com',
    telefone: '(21) 99999-1234',
    role: 'customer',
    ativo: true,
    password: '123456'
  },
  '21999991234': {
    id: '1',
    nome: 'Cliente SMS',
    email: 'cliente@sms.com',
    telefone: '(21) 99999-1234',
    role: 'customer',
    ativo: true
  },
  '21999990000': {
    id: '3',
    nome: 'Admin SMS',
    email: 'admin@redlight.com.br',
    telefone: '(21) 99999-0000',
    role: 'admin',
    ativo: true
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Actions
      setAuth: (authData) => {
        set({
          user: authData.user,
          token: authData.token,
          refreshToken: authData.refreshToken,
          isAuthenticated: true,
        });
        
        // Set token in API headers
        if (authData.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
        }
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        
        // Remove token from API headers
        delete api.defaults.headers.common['Authorization'];
      },

      // Register user
      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', userData);
          
          if (response.data.success) {
            toast.success('Cadastro realizado! Verifique seu celular.');
            return { success: true, data: response.data.data };
          } else {
            toast.error(response.data.message || 'Erro no cadastro');
            return { success: false, error: response.data.message };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Erro no servidor';
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Verify SMS code
      verifySMS: async (celular, codigo) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/verify-sms', { celular, codigo });
          
          if (response.data.success) {
            const authData = response.data.data;
            get().setAuth(authData);
            toast.success('Celular verificado com sucesso!');
            return { success: true, data: authData };
          } else {
            toast.error(response.data.message || 'Código inválido');
            return { success: false, error: response.data.message };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Código inválido';
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Login with SMS
      loginWithSMS: async (celular) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login-sms', { celular });
          
          if (response.data.success) {
            toast.success('Código enviado para seu celular!');
            return { success: true };
          } else {
            toast.error(response.data.message || 'Erro ao enviar código');
            return { success: false, error: response.data.message };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Erro no servidor';
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Login with email/password
      loginWithPassword: async (email, password) => {
        set({ isLoading: true });
        try {
          if (shouldUseMockData()) {
            await simulateDelay(1000);
            
            const mockUser = mockAuthUsers[email];
            if (mockUser && mockUser.password === password) {
              const authData = {
                user: {
                  id: mockUser.id,
                  nome: mockUser.nome,
                  email: mockUser.email,
                  telefone: mockUser.telefone,
                  role: mockUser.role,
                  ativo: mockUser.ativo
                },
                token: `mock_token_${Date.now()}`,
                refreshToken: `mock_refresh_${Date.now()}`
              };
              
              get().setAuth(authData);
              toast.success(`Bem-vindo(a), ${authData.user.nome}!`);
              return { success: true, data: authData };
            } else {
              toast.error('Email ou senha incorretos');
              return { success: false, error: 'Credenciais inválidas' };
            }
          } else {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.success) {
              const authData = response.data.data;
              get().setAuth(authData);
              toast.success(`Bem-vindo(a), ${authData.user.nome}!`);
              return { success: true, data: authData };
            } else {
              toast.error(response.data.message || 'Credenciais inválidas');
              return { success: false, error: response.data.message };
            }
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Erro no login';
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Verify SMS login code
      verifySMSLogin: async (celular, codigo) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/verify-sms-login', { celular, codigo });
          
          if (response.data.success) {
            const authData = response.data.data;
            get().setAuth(authData);
            toast.success(`Bem-vindo(a), ${authData.user.nome}!`);
            return { success: true, data: authData };
          } else {
            toast.error(response.data.message || 'Código inválido');
            return { success: false, error: response.data.message };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Código inválido';
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Erro no logout:', error);
        } finally {
          get().clearAuth();
          set({ isLoading: false });
          toast.success('Logout realizado com sucesso!');
        }
      },

      // Refresh token
      refreshAuthToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().clearAuth();
          return false;
        }

        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          
          if (response.data.success) {
            const authData = response.data.data;
            get().setAuth({
              ...get().user ? { user: get().user } : {},
              token: authData.token,
              refreshToken: authData.refreshToken || refreshToken,
            });
            return true;
          } else {
            get().clearAuth();
            return false;
          }
        } catch (error) {
          console.error('Erro ao renovar token:', error);
          get().clearAuth();
          return false;
        }
      },

      // Check authentication status
      checkAuth: async () => {
        const { token, refreshToken, user } = get();
        
        if (!token) {
          get().clearAuth();
          return false;
        }

        try {
          if (shouldUseMockData() && token.startsWith('mock_token_')) {
            // Para dados mockados, validar apenas se tem token e user
            if (user) {
              set({ isAuthenticated: true });
              return true;
            } else {
              get().clearAuth();
              return false;
            }
          } else {
            // Set token in headers before making request
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            const response = await api.get('/auth/me');
            
            if (response.data.success) {
              set({
                user: response.data.data.user,
                isAuthenticated: true,
              });
              return true;
            } else {
              // Try to refresh token
              const refreshed = await get().refreshAuthToken();
              if (refreshed) {
                return get().checkAuth();
              }
              return false;
            }
          }
        } catch (error) {
          if (error.response?.status === 401 && refreshToken) {
            // Try to refresh token
            const refreshed = await get().refreshAuthToken();
            if (refreshed) {
              return get().checkAuth();
            }
          }
          
          console.error('Erro na verificação de auth:', error);
          get().clearAuth();
          return false;
        }
      },

      // Update user profile
      updateProfile: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.put('/auth/profile', userData);
          
          if (response.data.success) {
            set({ user: response.data.data.user });
            toast.success('Perfil atualizado com sucesso!');
            return { success: true, data: response.data.data };
          } else {
            toast.error(response.data.message || 'Erro ao atualizar perfil');
            return { success: false, error: response.data.message };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Erro no servidor';
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Change password
      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true });
        try {
          const response = await api.put('/auth/change-password', {
            currentPassword,
            newPassword,
          });
          
          if (response.data.success) {
            toast.success('Senha alterada com sucesso!');
            return { success: true };
          } else {
            toast.error(response.data.message || 'Erro ao alterar senha');
            return { success: false, error: response.data.message };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Erro no servidor';
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Reset password
      resetPassword: async (email) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/reset-password', { email });
          
          if (response.data.success) {
            toast.success('Email de recuperação enviado!');
            return { success: true };
          } else {
            toast.error(response.data.message || 'Erro ao enviar email');
            return { success: false, error: response.data.message };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Erro no servidor';
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Resend verification SMS
      resendSMS: async (celular) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/resend-sms', { celular });
          
          if (response.data.success) {
            toast.success('Novo código enviado!');
            return { success: true };
          } else {
            toast.error(response.data.message || 'Erro ao reenviar código');
            return { success: false, error: response.data.message };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Erro no servidor';
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'redlight-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize token in API headers if it exists
const state = useAuthStore.getState();
if (state.token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
}

export { useAuthStore };
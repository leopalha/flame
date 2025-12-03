import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { mockUsers } from '../data/mockData';
import { safeLocalStorage } from '../utils/storage';

// Função para verificar se deve usar dados mockados
const shouldUseMockData = () => {
  // SEMPRE USAR MOCK DATA (não há backend rodando)
  console.log('🔧 shouldUseMockData: FORÇANDO TRUE (modo demo)');
  return true;

  // Código antigo comentado para referência futura
  /*
  if (typeof window === 'undefined') {
    console.log('🔧 shouldUseMockData (SSR): NODE_ENV =', process.env.NODE_ENV);
    return process.env.NODE_ENV === 'development';
  }

  const nodeEnv = process.env.NODE_ENV;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const mockDataSetting = safeLocalStorage.getItem('useMockData');

  console.log('🔧 shouldUseMockData (Browser):', {
    nodeEnv,
    apiUrl,
    mockDataSetting,
    window: typeof window !== 'undefined'
  });

  if (nodeEnv === 'development') {
    const result = mockDataSetting === null || mockDataSetting === 'true';
    console.log('🔧 shouldUseMockData (Dev) returning:', result);
    return result;
  }

  const result = !apiUrl || mockDataSetting === 'true';
  console.log('🔧 shouldUseMockData (Prod) returning:', result);
  return result;
  */
};

// Função para simular delay de rede
const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Usuários mockados para autenticação rápida
const mockAuthUsers = {
  'admin@admin.com': {
    id: '3',
    nome: 'Admin FLAME',
    email: 'admin@admin.com',
    telefone: '(21) 99999-0000',
    role: 'admin',
    ativo: true,
    password: 'admin123'
  },
  'admin@redlight.com.br': {
    id: '3',
    nome: 'Admin FLAME',
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
          const useMock = shouldUseMockData();

          if (useMock) {
            // Mock: simula delay e retorna sucesso
            await simulateDelay(500);

            // Simula envio de SMS
            console.log('📱 [MOCK] Código SMS enviado:', '123456');
            toast.success('Cadastro realizado! Use o código: 123456');

            return {
              success: true,
              data: {
                celular: userData.celular,
                needsVerification: true
              }
            };
          }

          // API real
          const response = await api.post('/auth/register', userData);

          if (response.data.success) {
            toast.success('Cadastro realizado! Verifique seu celular.');
            return { success: true, data: response.data.data };
          } else {
            toast.error(response.data.message || 'Erro no cadastro');
            return { success: false, error: response.data.message };
          }
        } catch (error) {
          console.error('Erro no registro:', error);

          // Fallback para mock em caso de erro de rede
          if (!shouldUseMockData()) {
            console.log('API falhou, usando modo mock para registro...');
            await simulateDelay(300);
            toast.success('Cadastro realizado! Use o código: 123456');
            return {
              success: true,
              data: {
                celular: userData.celular,
                needsVerification: true
              }
            };
          }

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
          const useMock = shouldUseMockData();

          if (useMock) {
            // Mock mode: aceita código 123456 ou qualquer código de 6 dígitos
            await simulateDelay(500);

            if (codigo === '123456' || codigo.length === 6) {
              // Criar usuário mock
              const mockUser = {
                id: 'mock-user-' + Date.now(),
                nome: 'Usuário Mock',
                email: 'mock@FLAME.com',
                celular: celular,
                role: 'customer',
                verificado: true
              };

              const mockToken = 'mock-token-' + Date.now();

              const authData = {
                user: mockUser,
                token: mockToken
              };

              get().setAuth(authData);
              toast.success('Cadastro concluído! Bem-vindo ao FLAME!');
              return { success: true, data: authData };
            } else {
              toast.error('Código inválido. Use 123456');
              return { success: false, error: 'Código inválido' };
            }
          }

          // API real
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
          // Fallback para mock
          if (!shouldUseMockData() && codigo === '123456') {
            await simulateDelay(300);
            const mockUser = {
              id: 'mock-user-' + Date.now(),
              nome: 'Usuário Mock',
              email: 'mock@FLAME.com',
              celular: celular,
              role: 'customer',
              verificado: true
            };
            const authData = { user: mockUser, token: 'mock-token-' + Date.now() };
            get().setAuth(authData);
            toast.success('Cadastro concluído! Bem-vindo ao FLAME!');
            return { success: true, data: authData };
          }

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
          const useMock = shouldUseMockData();
          console.log('📱 SMS REQUEST: useMock =', useMock, 'celular =', celular);

          if (useMock) {
            await simulateDelay(800);

            // No modo demo, verificar se o celular existe nos mockUsers
            const mockUser = Object.values(mockAuthUsers).find(user =>
              user.telefone && user.telefone.replace(/\D/g, '') === celular
            );

            console.log('📱 SMS REQUEST: Celular encontrado:', mockUser ? 'SIM' : 'NÃO');

            if (mockUser) {
              toast.success('Código enviado! Use qualquer código de 6 dígitos.');
              console.log('✅ SMS REQUEST: Código "enviado" (modo demo)');
              return { success: true };
            } else {
              toast.error('Celular não cadastrado. Use (21) 99999-1234');
              console.log('❌ SMS REQUEST: Celular não encontrado');
              return { success: false, error: 'Celular não cadastrado' };
            }
          } else {
            console.log('🌐 SMS REQUEST: Tentando via API...');
            const response = await api.post('/auth/login-sms', { celular });

            if (response.data.success) {
              toast.success('Código enviado para seu celular!');
              return { success: true };
            } else {
              toast.error(response.data.message || 'Erro ao enviar código');
              return { success: false, error: response.data.message };
            }
          }
        } catch (error) {
          console.error('❌ SMS REQUEST ERROR:', error);
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
          const useMock = shouldUseMockData();
          console.log('🔐 LOGIN: useMock =', useMock, 'NODE_ENV =', process.env.NODE_ENV);

          if (useMock) {
            await simulateDelay(1000);

            console.log('🔐 LOGIN: Tentando login mock com email:', email);
            console.log('🔐 LOGIN: mockAuthUsers disponíveis:', Object.keys(mockAuthUsers));

            const mockUser = mockAuthUsers[email];
            if (mockUser && mockUser.password === password) {
              console.log('✅ LOGIN: Credenciais corretas! Usuário:', mockUser.nome);
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
              console.log('❌ LOGIN: Credenciais incorretas para:', email);
              toast.error('Email ou senha incorretos');
              return { success: false, error: 'Credenciais inválidas' };
            }
          } else {
            console.log('🌐 LOGIN: Tentando login via API...');
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
          console.error('❌ LOGIN ERROR:', error);
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
          const useMock = shouldUseMockData();
          console.log('📱 SMS LOGIN: useMock =', useMock, 'celular =', celular, 'codigo =', codigo);

          if (useMock) {
            await simulateDelay(1000);

            // No modo demo, qualquer código de 6 dígitos funciona
            if (codigo && codigo.length === 6) {
              // Procurar usuário pelo celular
              const mockUser = Object.values(mockAuthUsers).find(user =>
                user.telefone && user.telefone.replace(/\D/g, '') === celular
              );

              console.log('📱 SMS LOGIN: Usuário encontrado:', mockUser ? mockUser.nome : 'nenhum');

              if (mockUser) {
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
                console.log('✅ SMS LOGIN: Login bem-sucedido!');
                return { success: true, data: authData };
              } else {
                console.log('❌ SMS LOGIN: Celular não cadastrado');
                toast.error('Celular não cadastrado');
                return { success: false, error: 'Celular não cadastrado' };
              }
            } else {
              console.log('❌ SMS LOGIN: Código inválido');
              toast.error('Código deve ter 6 dígitos');
              return { success: false, error: 'Código inválido' };
            }
          } else {
            console.log('🌐 SMS LOGIN: Tentando via API...');
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
          }
        } catch (error) {
          console.error('❌ SMS LOGIN ERROR:', error);
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
          const useMock = shouldUseMockData();

          if (!useMock) {
            await api.post('/auth/logout');
          }
          // Mock mode: apenas limpa localmente
        } catch (error) {
          console.log('Erro no logout (usando fallback local):', error);
          // Continua com logout local mesmo se API falhar
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
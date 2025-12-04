import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

export const useHookahStore = create(
  persist(
    (set, get) => ({
      // State
      flavors: [],
      sessions: [],
      selectedFlavor: null,
      loading: false,
      error: null,
      sessionTimers: {}, // { sessionId: { elapsed, remaining } }
      revenueReport: null,
      history: [],

      // Fetch all flavors
      fetchFlavors: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/hookah/flavors`);
          const data = await response.json();

          if (data.success) {
            set({ flavors: data.data, loading: false });
            return data.data;
          }
        } catch (error) {
          console.error('Erro ao buscar sabores:', error);
          set({ error: error.message, loading: false });
        }
      },

      // Fetch active sessions
      fetchSessions: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/hookah/sessions`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();

          if (data.success) {
            set({ sessions: data.data, loading: false });
            return data.data;
          }
        } catch (error) {
          console.error('Erro ao buscar sessões:', error);
          set({ error: error.message, loading: false });
        }
      },

      // Create new session
      startSession: async (mesaId, flavorId, quantity = 1, duration = 30) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/hookah/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              mesaId,
              flavorId,
              quantity,
              duration,
            }),
          });

          const data = await response.json();

          if (data.success) {
            const newSession = data.data;
            set((state) => ({
              sessions: [...state.sessions, newSession],
              loading: false,
            }));
            return newSession;
          } else {
            set({ error: data.error, loading: false });
          }
        } catch (error) {
          console.error('Erro ao iniciar sessão:', error);
          set({ error: error.message, loading: false });
        }
      },

      // Register coal change
      registerCoalChange: async (sessionId) => {
        try {
          const response = await fetch(`${API_BASE_URL}/hookah/sessions/${sessionId}/coal`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          const data = await response.json();

          if (data.success) {
            set((state) => ({
              sessions: state.sessions.map((s) =>
                s.id === sessionId ? data.data : s
              ),
            }));
            return data.data;
          }
        } catch (error) {
          console.error('Erro ao registrar troca de carvão:', error);
          set({ error: error.message });
        }
      },

      // Pause session
      pauseSession: async (sessionId) => {
        try {
          const response = await fetch(`${API_BASE_URL}/hookah/sessions/${sessionId}/pause`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          const data = await response.json();

          if (data.success) {
            set((state) => ({
              sessions: state.sessions.map((s) =>
                s.id === sessionId ? data.data : s
              ),
            }));
            return data.data;
          }
        } catch (error) {
          console.error('Erro ao pausar sessão:', error);
          set({ error: error.message });
        }
      },

      // Resume session
      resumeSession: async (sessionId) => {
        try {
          const response = await fetch(`${API_BASE_URL}/hookah/sessions/${sessionId}/resume`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          const data = await response.json();

          if (data.success) {
            set((state) => ({
              sessions: state.sessions.map((s) =>
                s.id === sessionId ? data.data : s
              ),
            }));
            return data.data;
          }
        } catch (error) {
          console.error('Erro ao retomar sessão:', error);
          set({ error: error.message });
        }
      },

      // End session
      endSession: async (sessionId, notes = '') => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/hookah/sessions/${sessionId}/end`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ notes }),
          });

          const data = await response.json();

          if (data.success) {
            set((state) => ({
              sessions: state.sessions.map((s) =>
                s.id === sessionId ? data.data : s
              ),
              loading: false,
            }));
            return data.data;
          } else {
            set({ error: data.error, loading: false });
          }
        } catch (error) {
          console.error('Erro ao finalizar sessão:', error);
          set({ error: error.message, loading: false });
        }
      },

      // Get session history
      fetchHistory: async (days = 30) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(
            `${API_BASE_URL}/hookah/history?days=${days}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

          const data = await response.json();

          if (data.success) {
            set({ history: data.data, loading: false });
            return data.data;
          }
        } catch (error) {
          console.error('Erro ao buscar histórico:', error);
          set({ error: error.message, loading: false });
        }
      },

      // Get revenue report
      fetchRevenueReport: async (days = 30) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(
            `${API_BASE_URL}/hookah/revenue-report?days=${days}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

          const data = await response.json();

          if (data.success) {
            set({ revenueReport: data.data, loading: false });
            return data.data;
          }
        } catch (error) {
          console.error('Erro ao buscar relatório:', error);
          set({ error: error.message, loading: false });
        }
      },

      // Get popular flavors
      fetchPopularFlavors: async (limit = 5) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/hookah/popular-flavors?limit=${limit}`
          );

          const data = await response.json();

          if (data.success) {
            return data.data;
          }
        } catch (error) {
          console.error('Erro ao buscar sabores populares:', error);
        }
        return [];
      },

      // Update timer for session
      tickTimer: (sessionId, elapsedSeconds, remainingSeconds) => {
        set((state) => ({
          sessionTimers: {
            ...state.sessionTimers,
            [sessionId]: {
              elapsed: elapsedSeconds,
              remaining: remainingSeconds,
            },
          },
        }));
      },

      // Select flavor for new session
      selectFlavor: (flavor) => {
        set({ selectedFlavor: flavor });
      },

      // Clear selection
      clearSelection: () => {
        set({ selectedFlavor: null, error: null });
      },

      // Get flavor by ID
      getFlavorById: (flavorId) => {
        const { flavors } = get();
        return flavors.find((f) => f.id === flavorId);
      },

      // Get session by ID
      getSessionById: (sessionId) => {
        const { sessions } = get();
        return sessions.find((s) => s.id === sessionId);
      },

      // Get active sessions count
      getActiveCount: () => {
        const { sessions } = get();
        return sessions.filter((s) => s.status === 'active').length;
      },
    }),
    {
      name: 'hookah-store',
      partialize: (state) => ({
        selectedFlavor: state.selectedFlavor,
        history: state.history,
        revenueReport: state.revenueReport,
      }),
    }
  )
);

export default useHookahStore;

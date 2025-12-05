import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

// Status de reserva
export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  COMPLETED: 'completed'
};

// Ocasioes especiais
export const OCASIOES = [
  'Jantar casual',
  'Aniversario',
  'Encontro romantico',
  'Reuniao de negocios',
  'Confraternizacao',
  'Happy Hour',
  'Evento especial'
];

export const useReservationStore = create(
  persist(
    (set, get) => ({
      // Estado
      reservations: [],
      myReservations: [],
      availableSlots: [],
      selectedDate: null,
      selectedSlot: null,
      currentReservation: null,
      loading: false,
      error: null,
      stats: null,

      // Actions: Reservas (Cliente)

      /**
       * Buscar slots disponíveis para uma data
       */
      fetchAvailableSlots: async (date) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(
            `${API_BASE_URL}/reservations/availability?date=${date}`
          );
          const data = await response.json();

          if (data.success) {
            set({ availableSlots: data.data, selectedDate: date, loading: false });
            return data.data;
          } else {
            set({ error: data.error, loading: false });
            return [];
          }
        } catch (error) {
          console.error('Erro ao buscar slots:', error);
          set({ error: error.message, loading: false });
          return [];
        }
      },

      /**
       * Criar nova reserva (público - com ou sem login)
       */
      createReservation: async (reservationData) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem('token');

          const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(reservationData)
          });

          const data = await response.json();

          if (data.success) {
            set({ currentReservation: data.data, loading: false });
            toast.success(`Reserva criada! Código: ${data.data.confirmationCode}`);

            // Atualizar minhas reservas se logado
            if (token) {
              get().fetchMyReservations();
            }

            return { success: true, reservation: data.data };
          } else {
            set({ error: data.error, loading: false });
            toast.error(data.error || 'Erro ao criar reserva');
            return { success: false, error: data.error };
          }
        } catch (error) {
          console.error('Erro ao criar reserva:', error);
          set({ error: error.message, loading: false });
          toast.error('Erro ao criar reserva');
          return { success: false, error: error.message };
        }
      },

      /**
       * Buscar minhas reservas (cliente logado)
       */
      fetchMyReservations: async () => {
        const token = localStorage.getItem('token');
        if (!token) return [];

        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/reservations`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();

          if (data.success) {
            set({ myReservations: data.data, loading: false });
            return data.data;
          } else {
            set({ error: data.error, loading: false });
            return [];
          }
        } catch (error) {
          console.error('Erro ao buscar minhas reservas:', error);
          set({ error: error.message, loading: false });
          return [];
        }
      },

      /**
       * Buscar reserva por código de confirmação (público)
       */
      fetchByConfirmationCode: async (code) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/reservations/by-code/${code}`);
          const data = await response.json();

          if (data.success) {
            set({ currentReservation: data.data, loading: false });
            return data.data;
          } else {
            set({ error: data.error, loading: false });
            toast.error('Reserva não encontrada');
            return null;
          }
        } catch (error) {
          console.error('Erro ao buscar reserva:', error);
          set({ error: error.message, loading: false });
          toast.error('Erro ao buscar reserva');
          return null;
        }
      },

      /**
       * Atualizar reserva (apenas se pending)
       */
      updateReservation: async (id, updates) => {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Você precisa estar logado');
          return { success: false };
        }

        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          });

          const data = await response.json();

          if (data.success) {
            set({ loading: false });
            toast.success('Reserva atualizada!');
            get().fetchMyReservations();
            return { success: true, reservation: data.data };
          } else {
            set({ error: data.error, loading: false });
            toast.error(data.error || 'Erro ao atualizar');
            return { success: false, error: data.error };
          }
        } catch (error) {
          console.error('Erro ao atualizar reserva:', error);
          set({ error: error.message, loading: false });
          toast.error('Erro ao atualizar reserva');
          return { success: false, error: error.message };
        }
      },

      /**
       * Cancelar reserva
       */
      cancelReservation: async (id, reason = '') => {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Você precisa estar logado');
          return { success: false };
        }

        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/reservations/${id}/cancel`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reason })
          });

          const data = await response.json();

          if (data.success) {
            set({ loading: false });
            toast.success('Reserva cancelada');
            get().fetchMyReservations();
            return { success: true };
          } else {
            set({ error: data.error, loading: false });
            toast.error(data.error || 'Erro ao cancelar');
            return { success: false, error: data.error };
          }
        } catch (error) {
          console.error('Erro ao cancelar reserva:', error);
          set({ error: error.message, loading: false });
          toast.error('Erro ao cancelar reserva');
          return { success: false, error: error.message };
        }
      },

      // Actions: Admin

      /**
       * Buscar todas as reservas (admin)
       */
      fetchAllReservations: async (filters = {}) => {
        const token = localStorage.getItem('token');
        if (!token) return [];

        set({ loading: true, error: null });
        try {
          const params = new URLSearchParams(filters).toString();
          const response = await fetch(
            `${API_BASE_URL}/reservations/admin/all${params ? '?' + params : ''}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );

          const data = await response.json();

          if (data.success) {
            set({ reservations: data.data, loading: false });
            return { data: data.data, total: data.total };
          } else {
            set({ error: data.error, loading: false });
            return { data: [], total: 0 };
          }
        } catch (error) {
          console.error('Erro ao buscar todas reservas:', error);
          set({ error: error.message, loading: false });
          return { data: [], total: 0 };
        }
      },

      /**
       * Confirmar reserva (admin)
       */
      confirmReservation: async (id, tableId = null) => {
        const token = localStorage.getItem('token');
        if (!token) return { success: false };

        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/reservations/admin/${id}/confirm`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ tableId })
          });

          const data = await response.json();

          if (data.success) {
            set({ loading: false });
            toast.success('Reserva confirmada!');
            get().fetchAllReservations();
            return { success: true, reservation: data.data };
          } else {
            set({ error: data.error, loading: false });
            toast.error(data.error || 'Erro ao confirmar');
            return { success: false, error: data.error };
          }
        } catch (error) {
          console.error('Erro ao confirmar reserva:', error);
          set({ error: error.message, loading: false });
          toast.error('Erro ao confirmar reserva');
          return { success: false, error: error.message };
        }
      },

      /**
       * Marcar chegada (admin)
       */
      markArrived: async (id) => {
        const token = localStorage.getItem('token');
        if (!token) return { success: false };

        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/reservations/admin/${id}/arrived`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();

          if (data.success) {
            set({ loading: false });
            toast.success('Chegada registrada');
            get().fetchAllReservations();
            return { success: true };
          } else {
            set({ error: data.error, loading: false });
            toast.error(data.error || 'Erro ao marcar chegada');
            return { success: false, error: data.error };
          }
        } catch (error) {
          console.error('Erro ao marcar chegada:', error);
          set({ error: error.message, loading: false });
          toast.error('Erro ao marcar chegada');
          return { success: false, error: error.message };
        }
      },

      /**
       * Enviar lembrete (admin)
       */
      sendReminder: async (id) => {
        const token = localStorage.getItem('token');
        if (!token) return { success: false };

        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/reservations/admin/${id}/send-reminder`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();

          if (data.success) {
            set({ loading: false });
            toast.success(data.message || 'Lembrete enviado');
            return { success: true };
          } else {
            set({ error: data.error, loading: false });
            toast.error(data.error || 'Erro ao enviar lembrete');
            return { success: false, error: data.error };
          }
        } catch (error) {
          console.error('Erro ao enviar lembrete:', error);
          set({ error: error.message, loading: false });
          toast.error('Erro ao enviar lembrete');
          return { success: false, error: error.message };
        }
      },

      /**
       * Buscar estatísticas (admin)
       */
      fetchStats: async (days = 30) => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        set({ loading: true, error: null });
        try {
          const response = await fetch(
            `${API_BASE_URL}/reservations/admin/stats?days=${days}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );

          const data = await response.json();

          if (data.success) {
            set({ stats: data.data, loading: false });
            return data.data;
          } else {
            set({ error: data.error, loading: false });
            return null;
          }
        } catch (error) {
          console.error('Erro ao buscar estatísticas:', error);
          set({ error: error.message, loading: false });
          return null;
        }
      },

      // Helpers locais

      /**
       * Selecionar data e slot
       */
      selectSlot: (date, slot) => {
        set({ selectedDate: date, selectedSlot: slot });
      },

      /**
       * Limpar seleção
       */
      clearSelection: () => {
        set({ selectedDate: null, selectedSlot: null, currentReservation: null, error: null });
      },

      /**
       * Filtrar reservas futuras
       */
      getUpcomingReservations: () => {
        const now = new Date();
        return get().myReservations.filter(
          r => new Date(r.reservationDate) > now && r.status !== RESERVATION_STATUS.CANCELLED
        );
      },

      /**
       * Filtrar reservas passadas
       */
      getPastReservations: () => {
        const now = new Date();
        return get().myReservations.filter(
          r => new Date(r.reservationDate) <= now || [RESERVATION_STATUS.COMPLETED, RESERVATION_STATUS.NO_SHOW].includes(r.status)
        );
      }
    }),
    {
      name: 'reservation-store',
      partialize: (state) => ({
        myReservations: state.myReservations,
        currentReservation: state.currentReservation
      })
    }
  )
);

export default useReservationStore;

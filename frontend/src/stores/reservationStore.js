import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

// Horarios disponiveis para reserva
export const HORARIOS_DISPONIVEIS = [
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'
];

// Tipos de mesa
export const TIPOS_MESA = [
  { id: 'standard', nome: 'Mesa Standard', capacidade: '2-4 pessoas', preco: 0, descricao: 'Mesa confortavel no salao principal' },
  { id: 'lounge', nome: 'Lounge', capacidade: '4-6 pessoas', preco: 50, descricao: 'Sofa estilo lounge com mais privacidade' },
  { id: 'vip', nome: 'Area VIP', capacidade: '6-10 pessoas', preco: 150, descricao: 'Area exclusiva com atendimento diferenciado' },
  { id: 'externa', nome: 'Area Externa', capacidade: '2-6 pessoas', preco: 0, descricao: 'Mesas na varanda com vista' }
];

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

// Mock de reservas existentes
const mockReservations = [
  {
    id: '1',
    userId: '6',
    userName: 'Cliente Teste',
    data: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    horario: '20:00',
    pessoas: 4,
    tipoMesa: 'standard',
    ocasiao: 'Jantar casual',
    observacoes: '',
    status: 'confirmada',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    userId: '6',
    userName: 'Cliente Teste',
    data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    horario: '21:00',
    pessoas: 2,
    tipoMesa: 'lounge',
    ocasiao: 'Encontro romantico',
    observacoes: 'Pedido de decoracao especial',
    status: 'concluida',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const useReservationStore = create(
  persist(
    (set, get) => ({
      // Estado
      reservations: mockReservations,
      currentReservation: null,
      loading: false,

      // Getters
      getUpcomingReservations: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().reservations
          .filter(r => r.data >= today && r.status !== 'cancelada')
          .sort((a, b) => new Date(a.data) - new Date(b.data));
      },

      getPastReservations: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().reservations
          .filter(r => r.data < today || r.status === 'concluida')
          .sort((a, b) => new Date(b.data) - new Date(a.data));
      },

      getReservationsByDate: (data) => {
        return get().reservations.filter(r => r.data === data);
      },

      checkAvailability: (data, horario) => {
        const reservationsOnDate = get().reservations.filter(
          r => r.data === data && r.horario === horario && r.status !== 'cancelada'
        );
        // Simula que temos 10 mesas disponiveis por horario
        return reservationsOnDate.length < 10;
      },

      getAvailableSlots: (data) => {
        return HORARIOS_DISPONIVEIS.filter(horario => get().checkAvailability(data, horario));
      },

      // Acoes
      createReservation: async (reservationData) => {
        set({ loading: true });

        try {
          // Simula delay de API
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Verifica disponibilidade
          if (!get().checkAvailability(reservationData.data, reservationData.horario)) {
            toast.error('Horario indisponivel. Escolha outro horario.');
            return { success: false, error: 'Horario indisponivel' };
          }

          // Calcula preco adicional do tipo de mesa
          const tipoMesa = TIPOS_MESA.find(t => t.id === reservationData.tipoMesa);
          const precoAdicional = tipoMesa?.preco || 0;

          const newReservation = {
            id: Date.now().toString(),
            ...reservationData,
            precoAdicional,
            status: 'pendente',
            createdAt: new Date().toISOString()
          };

          set(state => ({
            reservations: [...state.reservations, newReservation],
            currentReservation: newReservation
          }));

          toast.success('Reserva realizada com sucesso! Aguarde confirmacao.');
          return { success: true, reservation: newReservation };
        } catch (error) {
          toast.error('Erro ao criar reserva');
          return { success: false, error: 'Erro ao criar reserva' };
        } finally {
          set({ loading: false });
        }
      },

      updateReservation: async (id, updates) => {
        set({ loading: true });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          set(state => ({
            reservations: state.reservations.map(r =>
              r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
            )
          }));

          toast.success('Reserva atualizada!');
          return { success: true };
        } catch (error) {
          toast.error('Erro ao atualizar reserva');
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      cancelReservation: async (id) => {
        set({ loading: true });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          set(state => ({
            reservations: state.reservations.map(r =>
              r.id === id ? { ...r, status: 'cancelada', canceledAt: new Date().toISOString() } : r
            )
          }));

          toast.success('Reserva cancelada.');
          return { success: true };
        } catch (error) {
          toast.error('Erro ao cancelar reserva');
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      confirmReservation: async (id) => {
        return get().updateReservation(id, { status: 'confirmada' });
      },

      // Para admin - simular confirmacao
      adminConfirmReservation: async (id) => {
        set({ loading: true });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          set(state => ({
            reservations: state.reservations.map(r =>
              r.id === id ? { ...r, status: 'confirmada', confirmedAt: new Date().toISOString() } : r
            )
          }));

          toast.success('Reserva confirmada!');
          return { success: true };
        } catch (error) {
          toast.error('Erro ao confirmar reserva');
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      // Limpar dados (para testes)
      clearReservations: () => {
        set({ reservations: [], currentReservation: null });
      }
    }),
    {
      name: 'flame-reservations-storage',
      partialize: (state) => ({
        reservations: state.reservations
      })
    }
  )
);

export default useReservationStore;

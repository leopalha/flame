import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

// Configuração dos Tiers
export const TIERS = {
  bronze: {
    name: 'Bronze',
    minPoints: 0,
    multiplier: 1,
    color: '#CD7F32',
    benefits: ['1 ponto por R$1 gasto', 'Acesso ao programa de fidelidade']
  },
  silver: {
    name: 'Silver',
    minPoints: 500,
    multiplier: 1.2,
    color: '#C0C0C0',
    benefits: ['+20% de pontos', 'Drink de boas-vindas no aniversário', 'Acesso a promoções exclusivas']
  },
  gold: {
    name: 'Gold',
    minPoints: 2000,
    multiplier: 1.5,
    color: '#FFD700',
    benefits: ['+50% de pontos', 'Reserva prioritária', 'Mesa VIP quando disponível', 'Desconto de 10% em narguilé']
  },
  platinum: {
    name: 'Platinum',
    minPoints: 5000,
    multiplier: 2,
    color: '#E5E4E2',
    benefits: ['+100% de pontos', 'Drink cortesia por mês', 'Mesa VIP garantida', 'Acesso a eventos exclusivos', 'Estacionamento grátis']
  }
};

// Recompensas disponíveis para resgate
export const REWARDS = [
  { id: 'drink-basico', name: 'Drink Básico', description: 'Qualquer drink clássico', points: 100, type: 'product', icon: '🍹' },
  { id: 'drink-premium', name: 'Drink Premium', description: 'Drink autoral ou premium', points: 200, type: 'product', icon: '🍸' },
  { id: 'porcao', name: 'Porção', description: 'Qualquer petisco do cardápio', points: 150, type: 'product', icon: '🍟' },
  { id: 'narguilé-30min', name: '30min Narguilé', description: 'Meia hora de sessão', points: 250, type: 'service', icon: '💨' },
  { id: 'desconto-10', name: 'R$10 de Desconto', description: 'Vale desconto de R$10', points: 100, type: 'discount', value: 10, icon: '💰' },
  { id: 'desconto-25', name: 'R$25 de Desconto', description: 'Vale desconto de R$25', points: 225, type: 'discount', value: 25, icon: '💰' },
  { id: 'desconto-50', name: 'R$50 de Desconto', description: 'Vale desconto de R$50', points: 450, type: 'discount', value: 50, icon: '💎' },
  { id: 'mesa-vip', name: 'Reserva Mesa VIP', description: 'Uma reserva em mesa VIP', points: 500, type: 'experience', icon: '👑' },
];

// Histórico de transações de exemplo
const mockTransactions = [
  { id: '1', type: 'credit', amount: 50, reason: 'Bônus de cadastro', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', type: 'credit', amount: 85, reason: 'Compra - Pedido #1234', orderId: '1234', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', type: 'credit', amount: 120, reason: 'Compra - Pedido #1235', orderId: '1235', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', type: 'debit', amount: 100, reason: 'Resgate - Drink Básico', rewardId: 'drink-basico', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

export const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      // Estado
      points: 155,
      tier: 'bronze',
      transactions: mockTransactions,
      redeemedRewards: [],
      loading: false,

      // Getters computados
      getTier: () => {
        const points = get().points;
        if (points >= TIERS.platinum.minPoints) return 'platinum';
        if (points >= TIERS.gold.minPoints) return 'gold';
        if (points >= TIERS.silver.minPoints) return 'silver';
        return 'bronze';
      },

      getTierInfo: () => {
        const tier = get().getTier();
        return TIERS[tier];
      },

      getNextTier: () => {
        const currentTier = get().getTier();
        const tiers = ['bronze', 'silver', 'gold', 'platinum'];
        const currentIndex = tiers.indexOf(currentTier);
        if (currentIndex < tiers.length - 1) {
          return tiers[currentIndex + 1];
        }
        return null;
      },

      getPointsToNextTier: () => {
        const nextTier = get().getNextTier();
        if (!nextTier) return 0;
        return TIERS[nextTier].minPoints - get().points;
      },

      getMultiplier: () => {
        const tier = get().getTier();
        return TIERS[tier].multiplier;
      },

      // Ações
      addPoints: (amount, reason, orderId = null) => {
        const multiplier = get().getMultiplier();
        const finalAmount = Math.floor(amount * multiplier);

        const transaction = {
          id: Date.now().toString(),
          type: 'credit',
          amount: finalAmount,
          reason: reason,
          orderId,
          date: new Date().toISOString()
        };

        set(state => ({
          points: state.points + finalAmount,
          transactions: [transaction, ...state.transactions]
        }));

        // Verificar upgrade de tier
        const newTier = get().getTier();
        const oldTier = get().tier;
        if (newTier !== oldTier) {
          set({ tier: newTier });
          toast.success(`🎉 Parabéns! Você subiu para ${TIERS[newTier].name}!`, {
            duration: 5000,
            icon: '👑'
          });
        }

        return finalAmount;
      },

      redeemReward: (rewardId) => {
        const reward = REWARDS.find(r => r.id === rewardId);
        if (!reward) {
          toast.error('Recompensa não encontrada');
          return false;
        }

        if (get().points < reward.points) {
          toast.error('Pontos insuficientes');
          return false;
        }

        const transaction = {
          id: Date.now().toString(),
          type: 'debit',
          amount: reward.points,
          reason: `Resgate - ${reward.name}`,
          rewardId,
          date: new Date().toISOString()
        };

        const redeemedReward = {
          id: Date.now().toString(),
          reward,
          redeemedAt: new Date().toISOString(),
          used: false,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
        };

        set(state => ({
          points: state.points - reward.points,
          transactions: [transaction, ...state.transactions],
          redeemedRewards: [redeemedReward, ...state.redeemedRewards]
        }));

        toast.success(`🎁 ${reward.name} resgatado com sucesso!`);
        return true;
      },

      useRedeemedReward: (redeemedId) => {
        set(state => ({
          redeemedRewards: state.redeemedRewards.map(r =>
            r.id === redeemedId ? { ...r, used: true, usedAt: new Date().toISOString() } : r
          )
        }));
      },

      // Para desenvolvimento/testes
      addBonusPoints: (amount, reason = 'Bônus especial') => {
        get().addPoints(amount, reason);
      },

      resetPoints: () => {
        set({
          points: 0,
          tier: 'bronze',
          transactions: [],
          redeemedRewards: []
        });
      }
    }),
    {
      name: 'flame-loyalty-storage',
      partialize: (state) => ({
        points: state.points,
        tier: state.tier,
        transactions: state.transactions,
        redeemedRewards: state.redeemedRewards
      })
    }
  )
);

export default useLoyaltyStore;

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useCashbackStore from '../stores/cashbackStore';

const tierConfig = {
  bronze: {
    name: 'Bronze',
    color: 'from-[var(--theme-primary)] to-[var(--theme-accent)]',
    textColor: 'text-[var(--theme-primary)]',
    bgColor: 'bg-[var(--theme-primary)]/10',
    borderColor: 'border-[var(--theme-primary)]/30',
    icon: '🥉',
    cashbackPercent: 1.5
  },
  silver: {
    name: 'Prata',
    color: 'from-gray-400 to-gray-300',
    textColor: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
    borderColor: 'border-gray-400/30',
    icon: '🥈',
    cashbackPercent: 3
  },
  gold: {
    name: 'Ouro',
    color: 'from-yellow-500 to-yellow-300',
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    icon: '🥇',
    cashbackPercent: 4.5
  },
  platinum: {
    name: 'Platina',
    color: 'from-[var(--theme-secondary)] to-[var(--theme-primary)]',
    textColor: 'text-[var(--theme-secondary)]',
    bgColor: 'bg-[var(--theme-secondary)]/10',
    borderColor: 'border-[var(--theme-secondary)]/30',
    icon: '💎',
    cashbackPercent: 5
  }
};

export default function CashbackDisplay({ compact = false, showProgress = true }) {
  const { balance, tier, tierBenefits, nextTierInfo, loading, fetchBalance } = useCashbackStore();
  const currentTier = tierConfig[tier] || tierConfig.bronze;

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  if (loading && balance === 0) {
    return (
      <div className="animate-pulse">
        <div className="h-24 bg-zinc-800 rounded-lg"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center justify-between p-4 rounded-lg border ${currentTier.bgColor} ${currentTier.borderColor}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentTier.icon}</span>
          <div>
            <p className="text-sm text-zinc-400">Cashback disponível</p>
            <p className="text-xl font-bold text-white">
              R$ {balance.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${currentTier.textColor}`}>
            {currentTier.name}
          </p>
          <p className="text-xs text-zinc-500">
            {currentTier.cashbackPercent}% de cashback
          </p>
        </div>
      </motion.div>
    );
  }

  const progressPercentage = nextTierInfo
    ? ((nextTierInfo.current / nextTierInfo.required) * 100).toFixed(1)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-xl border ${currentTier.bgColor} ${currentTier.borderColor}`}
    >
      {/* Header com tier e saldo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{currentTier.icon}</span>
          <div>
            <h3 className={`text-2xl font-bold ${currentTier.textColor}`}>
              {currentTier.name}
            </h3>
            <p className="text-sm text-zinc-400">
              {currentTier.cashbackPercent}% de cashback em todas as compras
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-400">Saldo disponível</p>
          <p className="text-3xl font-bold text-white">
            R$ {balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progress bar para próximo tier */}
      {showProgress && nextTierInfo && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">
              Progresso para {tierConfig[nextTierInfo.nextTier]?.name || 'Próximo nível'}
            </span>
            <span className="text-zinc-300 font-semibold">
              {progressPercentage}%
            </span>
          </div>
          <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${tierConfig[nextTierInfo.nextTier]?.color || currentTier.color}`}
            />
          </div>
          <p className="text-xs text-zinc-500">
            Faltam R$ {nextTierInfo.remaining.toFixed(2)} para alcançar {tierConfig[nextTierInfo.nextTier]?.name}
          </p>
        </div>
      )}

      {/* Benefícios do tier atual */}
      {tierBenefits && (
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-300 mb-3">Seus benefícios:</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-zinc-400">
                {tierBenefits.cashbackPercentage}% cashback
              </span>
            </div>
            {tierBenefits.deliveryFree && (
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-zinc-400">Entrega grátis</span>
              </div>
            )}
            {tierBenefits.prioritySupport && (
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-zinc-400">Suporte prioritário</span>
              </div>
            )}
            {tierBenefits.exclusiveProducts && (
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-zinc-400">Produtos exclusivos</span>
              </div>
            )}
            {tierBenefits.birthdayBonus && (
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-zinc-400">Bônus aniversário</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tier máximo atingido */}
      {tier === 'platinum' && !nextTierInfo && (
        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
          <p className="text-sm text-[var(--theme-secondary)] font-semibold">
            🎉 Parabéns! Você atingiu o nível máximo!
          </p>
        </div>
      )}
    </motion.div>
  );
}

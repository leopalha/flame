import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuthStore } from '../stores/authStore';
import { useLoyaltyStore, TIERS, REWARDS } from '../stores/loyaltyStore';
import {
  Crown,
  Gift,
  History,
  Star,
  ChevronRight,
  Sparkles,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Componente de Card do Tier
const TierCard = ({ tier, isActive, points }) => {
  const tierInfo = TIERS[tier];
  const progress = tier === 'platinum' ? 100 :
    Math.min(100, ((points - (TIERS[tier].minPoints || 0)) / (TIERS[Object.keys(TIERS)[Object.keys(TIERS).indexOf(tier) + 1]]?.minPoints - TIERS[tier].minPoints || 1)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-6 rounded-2xl border-2 transition-all ${
        isActive
          ? 'border-magenta-500 bg-gradient-to-br from-neutral-900 to-neutral-950 shadow-glow-magenta'
          : 'border-neutral-700 bg-neutral-900/50 opacity-60'
      }`}
    >
      {isActive && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-magenta-500 to-cyan-500 rounded-full text-xs font-bold text-white">
          SEU TIER
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${tierInfo.color}20`, borderColor: tierInfo.color, borderWidth: 2 }}
        >
          <Crown className="w-7 h-7" style={{ color: tierInfo.color }} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{tierInfo.name}</h3>
          <p className="text-sm text-neutral-400">{tierInfo.minPoints}+ pontos</p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-2xl font-bold" style={{ color: tierInfo.color }}>{tierInfo.multiplier}x</span>
          <p className="text-xs text-neutral-400">multiplicador</p>
        </div>
      </div>

      <ul className="space-y-2">
        {tierInfo.benefits.map((benefit, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-neutral-300">
            <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>

      {isActive && tier !== 'platinum' && (
        <div className="mt-4 pt-4 border-t border-neutral-700">
          <div className="flex justify-between text-xs text-neutral-400 mb-1">
            <span>Progresso para próximo tier</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-magenta-500 to-cyan-500"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Componente de Card de Recompensa
const RewardCard = ({ reward, canRedeem, onRedeem }) => {
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    onRedeem(reward.id);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 flex items-center gap-4"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-magenta-500/20 to-cyan-500/20 flex items-center justify-center text-3xl">
        {reward.icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-white">{reward.name}</h4>
        <p className="text-sm text-neutral-400">{reward.description}</p>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1 text-magenta-400 font-bold">
          <Star className="w-4 h-4" />
          {reward.points}
        </div>
        <button
          onClick={handleRedeem}
          disabled={!canRedeem || loading}
          className={`mt-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            canRedeem
              ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white hover:shadow-glow-magenta'
              : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {loading ? '...' : 'Resgatar'}
        </button>
      </div>
    </motion.div>
  );
};

// Componente de Transação
const TransactionItem = ({ transaction }) => {
  const isCredit = transaction.type === 'credit';
  return (
    <div className="flex items-center gap-4 py-3 border-b border-neutral-800 last:border-0">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isCredit ? 'bg-success-500/20' : 'bg-error-500/20'
      }`}>
        {isCredit ? (
          <TrendingUp className="w-5 h-5 text-success-500" />
        ) : (
          <Gift className="w-5 h-5 text-error-500" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-white font-medium">{transaction.reason}</p>
        <p className="text-xs text-neutral-400">
          {new Date(transaction.date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </p>
      </div>
      <span className={`font-bold ${isCredit ? 'text-success-500' : 'text-error-500'}`}>
        {isCredit ? '+' : '-'}{transaction.amount}
      </span>
    </div>
  );
};

export default function FidelidadePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const {
    points,
    transactions,
    redeemedRewards,
    getTier,
    getTierInfo,
    getPointsToNextTier,
    getNextTier,
    redeemReward
  } = useLoyaltyStore();

  const [activeTab, setActiveTab] = useState('rewards');

  const currentTier = getTier();
  const tierInfo = getTierInfo();
  const nextTier = getNextTier();
  const pointsToNext = getPointsToNextTier();

  const handleRedeem = (rewardId) => {
    const success = redeemReward(rewardId);
    if (success) {
      // Opcional: redirecionar para recompensas resgatadas
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center p-8">
            <Crown className="w-16 h-16 text-magenta-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Programa de Fidelidade FLAME</h2>
            <p className="text-neutral-400 mb-6">Faça login para acessar seus pontos e recompensas</p>
            <button
              onClick={() => router.push('/login?returnTo=/fidelidade')}
              className="btn btn-primary"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Fidelidade FLAME | Seus Pontos e Recompensas</title>
        <meta name="description" content="Acumule pontos, suba de tier e resgate recompensas exclusivas no FLAME" />
      </Head>

      <div className="min-h-screen bg-black pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => router.back()} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Programa de Fidelidade</h1>
              <p className="text-neutral-400">Acumule pontos e resgate recompensas</p>
            </div>
          </div>

          {/* Card Principal de Pontos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-700 rounded-2xl p-6 mb-6 relative overflow-hidden"
          >
            {/* Efeito decorativo */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-magenta-500/20 to-cyan-500/20 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${tierInfo.color}30` }}
                  >
                    <Crown className="w-6 h-6" style={{ color: tierInfo.color }} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Membro</p>
                    <p className="text-lg font-bold" style={{ color: tierInfo.color }}>{tierInfo.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Multiplicador</p>
                  <p className="text-2xl font-bold text-white">{tierInfo.multiplier}x</p>
                </div>
              </div>

              <div className="text-center py-6">
                <p className="text-neutral-400 text-sm mb-1">Seus pontos</p>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-8 h-8 text-magenta-400" />
                  <span className="text-5xl font-bold text-gradient-flame">{points}</span>
                </div>
              </div>

              {nextTier && (
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-400">Próximo tier: {TIERS[nextTier].name}</span>
                    <span className="text-sm font-medium text-magenta-400">{pointsToNext} pontos restantes</span>
                  </div>
                  <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((TIERS[nextTier].minPoints - pointsToNext) / TIERS[nextTier].minPoints) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-magenta-500 to-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'rewards', label: 'Recompensas', icon: Gift },
              { id: 'tiers', label: 'Tiers', icon: Crown },
              { id: 'history', label: 'Historico', icon: History },
              { id: 'redeemed', label: 'Resgatados', icon: Award }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteúdo das Tabs */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'rewards' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Recompensas Disponíveis</h3>
                {REWARDS.map(reward => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    canRedeem={points >= reward.points}
                    onRedeem={handleRedeem}
                  />
                ))}
              </div>
            )}

            {activeTab === 'tiers' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Niveis do Programa</h3>
                {Object.keys(TIERS).map(tier => (
                  <TierCard
                    key={tier}
                    tier={tier}
                    isActive={tier === currentTier}
                    points={points}
                  />
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Historico de Pontos</h3>
                {transactions.length > 0 ? (
                  <div className="divide-y divide-neutral-800">
                    {transactions.map(t => (
                      <TransactionItem key={t.id} transaction={t} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-neutral-400 py-8">Nenhuma transacao ainda</p>
                )}
              </div>
            )}

            {activeTab === 'redeemed' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Recompensas Resgatadas</h3>
                {redeemedRewards.length > 0 ? (
                  redeemedRewards.map(item => (
                    <div
                      key={item.id}
                      className={`bg-neutral-900 border rounded-xl p-4 flex items-center gap-4 ${
                        item.used ? 'border-neutral-700 opacity-60' : 'border-success-500/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-magenta-500/20 to-cyan-500/20 flex items-center justify-center text-2xl">
                        {item.reward.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.reward.name}</h4>
                        <p className="text-sm text-neutral-400">
                          Resgatado em {new Date(item.redeemedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        {item.used ? (
                          <span className="flex items-center gap-1 text-neutral-400 text-sm">
                            <CheckCircle className="w-4 h-4" /> Usado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-success-500 text-sm font-medium">
                            <Clock className="w-4 h-4" /> Disponivel
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400">Nenhuma recompensa resgatada ainda</p>
                    <button
                      onClick={() => setActiveTab('rewards')}
                      className="mt-4 text-magenta-400 hover:text-magenta-300"
                    >
                      Ver recompensas disponiveis
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

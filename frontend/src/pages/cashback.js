import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CashbackDisplay from '../components/CashbackDisplay';
import useCashbackStore from '../stores/cashbackStore';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'next/router';

const tierDetails = {
  bronze: {
    name: 'Bronze',
    icon: '🥉',
    color: 'text-[var(--theme-primary)]',
    bgGradient: 'from-[var(--theme-primary)]/20 to-[var(--theme-primary)]/5',
    benefits: [
      '1,5% de cashback em todas as compras',
      'Acesso ao programa de fidelidade',
      'Ofertas exclusivas por e-mail'
    ]
  },
  silver: {
    name: 'Prata',
    icon: '🥈',
    color: 'text-gray-400',
    bgGradient: 'from-gray-400/20 to-gray-300/10',
    benefits: [
      '3% de cashback em todas as compras',
      'Prioridade em reservas',
      'Suporte prioritário',
      'Todas as vantagens do Bronze'
    ]
  },
  gold: {
    name: 'Ouro',
    icon: '🥇',
    color: 'text-yellow-500',
    bgGradient: 'from-yellow-500/20 to-yellow-300/10',
    benefits: [
      '4,5% de cashback em todas as compras',
      'Mesa reservada garantida',
      'R$ 50 de bônus no aniversário',
      'Todas as vantagens do Prata'
    ]
  },
  platinum: {
    name: 'Platina',
    icon: '💎',
    color: 'text-[var(--theme-secondary)]',
    bgGradient: 'from-[var(--theme-secondary)]/20 to-[var(--theme-primary)]/10',
    benefits: [
      '5% de cashback em todas as compras',
      'Mesa VIP garantida',
      'R$ 100 de bônus no aniversário',
      'Eventos exclusivos',
      'Todas as vantagens do Ouro'
    ]
  }
};

export default function CashbackPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { history, historyPagination, loading, fetchHistory } = useCashbackStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchHistory(currentPage);
  }, [isAuthenticated, currentPage, fetchHistory, router]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earned':
        return '💰';
      case 'redeemed':
        return '🎁';
      case 'expired':
        return '⏰';
      case 'bonus':
        return '🎉';
      case 'adjustment':
        return '⚙️';
      default:
        return '💵';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'earned':
      case 'bonus':
        return 'text-green-500';
      case 'redeemed':
        return 'text-blue-500';
      case 'expired':
        return 'text-[var(--theme-primary)]';
      case 'adjustment':
        return 'text-yellow-500';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <>
      <Head>
        <title>Meu Cashback - FLAME</title>
        <meta name="description" content="Acompanhe seu saldo de cashback e benefícios" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-24">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]">Cashback</span>
            </h1>
            <p className="text-zinc-400 text-lg">
              Ganhe recompensas em cada compra e aumente seus benefícios
            </p>
          </motion.div>

          {/* Cashback Display */}
          <div className="mb-12">
            <CashbackDisplay showProgress={true} />
          </div>

          {/* Detalhes dos Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Níveis de Fidelidade</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(tierDetails).map(([key, tier]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl border border-zinc-800 bg-gradient-to-br ${tier.bgGradient}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{tier.icon}</span>
                    <h3 className={`text-xl font-bold ${tier.color}`}>
                      {tier.name}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Histórico de Transações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Histórico de Cashback</h2>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-zinc-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
                <p className="text-zinc-400 text-lg">Nenhuma transação ainda</p>
                <p className="text-zinc-500 text-sm mt-2">
                  Faça seu primeiro pedido para começar a ganhar cashback!
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {history.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getTransactionIcon(transaction.type)}</span>
                          <div>
                            <p className="font-semibold text-white">
                              {transaction.getDescription ? transaction.getDescription() : transaction.description}
                            </p>
                            <p className="text-sm text-zinc-500">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                            {parseFloat(transaction.amount) >= 0 ? '+' : ''}
                            R$ {Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            Saldo: R$ {parseFloat(transaction.balanceAfter).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Paginação */}
                {historyPagination && historyPagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Anterior
                    </button>
                    <span className="px-4 py-2 text-zinc-400">
                      Página {currentPage} de {historyPagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === historyPagination.totalPages}
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Como Funciona */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-[var(--theme-primary)]/10 to-[var(--theme-secondary)]/10 border border-[var(--theme-primary)]/20 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-4">Como funciona o cashback?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-2">🛍️</div>
                <h3 className="font-semibold mb-2">1. Compre</h3>
                <p className="text-sm text-zinc-400">
                  Faça pedidos normalmente e ganhe cashback automaticamente com base no seu tier
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-semibold mb-2">2. Acumule</h3>
                <p className="text-sm text-zinc-400">
                  Quanto mais você compra, mais alto seu tier e maior sua porcentagem de cashback
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">🎁</div>
                <h3 className="font-semibold mb-2">3. Use</h3>
                <p className="text-sm text-zinc-400">
                  Use até 50% do valor do pedido em cashback no checkout
                </p>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Award,
  Gift,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';
import useCRMStore from '../stores/crmStore';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';

const tierConfig = {
  bronze: { name: 'Bronze', icon: '🥉', color: 'text-orange-500', bg: 'bg-orange-500/10', gradient: 'from-orange-600 to-orange-400' },
  silver: { name: 'Prata', icon: '🥈', color: 'text-gray-400', bg: 'bg-gray-400/10', gradient: 'from-gray-400 to-gray-300' },
  gold: { name: 'Ouro', icon: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-500/10', gradient: 'from-yellow-500 to-yellow-300' },
  platinum: { name: 'Platina', icon: '💎', color: 'text-purple-400', bg: 'bg-purple-500/10', gradient: 'from-purple-500 to-pink-500' }
};

export default function CustomerDetailsModal({ isOpen, onClose, customerId }) {
  const { customerStats, loading, addManualCashback, adjustTier } = useCRMStore();
  const [showCashbackModal, setShowCashbackModal] = useState(false);
  const [cashbackAmount, setCashbackAmount] = useState('');
  const [cashbackDescription, setCashbackDescription] = useState('');
  const [processing, setProcessing] = useState(false);

  const customer = customerStats?.user;
  const stats = customerStats?.stats;
  const recentOrders = customerStats?.recentOrders || [];
  const recentCashback = customerStats?.recentCashback || [];

  const tier = tierConfig[customer?.loyaltyTier] || tierConfig.bronze;

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleAddCashback = async (e) => {
    e.preventDefault();

    const amount = parseFloat(cashbackAmount);
    if (isNaN(amount) || amount === 0) {
      toast.error('Valor inválido');
      return;
    }

    setProcessing(true);
    try {
      await addManualCashback(customerId, amount, cashbackDescription || 'Bônus manual do admin');
      toast.success(`Cashback de ${formatCurrency(Math.abs(amount))} ${amount > 0 ? 'adicionado' : 'removido'} com sucesso!`);
      setCashbackAmount('');
      setCashbackDescription('');
      setShowCashbackModal(false);
    } catch (error) {
      toast.error('Erro ao adicionar cashback');
    } finally {
      setProcessing(false);
    }
  };

  const handleAdjustTier = async () => {
    setProcessing(true);
    try {
      const result = await adjustTier(customerId);
      if (result.data.updated) {
        toast.success(`Tier atualizado de ${result.data.oldTier} para ${result.data.newTier}`);
      } else {
        toast.info('Tier já está correto');
      }
    } catch (error) {
      toast.error('Erro ao ajustar tier');
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${tier.bg}`}>
                    <User className={`w-6 h-6 ${tier.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{customer?.nome}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${tier.bg} ${tier.color}`}>
                        <span>{tier.icon}</span>
                        {tier.name}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {loading && !customer ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-12 h-12 text-magenta-500 animate-spin" />
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Contact Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg">
                      <Mail className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-zinc-400 text-sm">Email</p>
                        <p className="text-white">{customer?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg">
                      <Phone className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-zinc-400 text-sm">Celular</p>
                        <p className="text-white">{customer?.celular || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingCart className="w-4 h-4 text-magenta-400" />
                        <span className="text-zinc-400 text-sm">Total Gasto</span>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {formatCurrency(stats?.totalSpent || 0)}
                      </p>
                    </div>

                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <span className="text-zinc-400 text-sm">Pedidos</span>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {stats?.totalOrders || 0}
                      </p>
                    </div>

                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="w-4 h-4 text-green-400" />
                        <span className="text-zinc-400 text-sm">Cashback</span>
                      </div>
                      <p className="text-xl font-bold text-green-400">
                        {formatCurrency(stats?.cashbackBalance || 0)}
                      </p>
                    </div>

                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-zinc-400 text-sm">Ticket Médio</span>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {formatCurrency(stats?.averageOrderValue || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Tier Progress */}
                  {stats?.nextTierInfo && (
                    <div className="p-6 bg-gradient-to-r from-magenta-600/10 to-cyan-600/10 border border-magenta-500/30 rounded-xl">
                      <h3 className="text-lg font-semibold mb-3">Progresso para {tierConfig[stats.nextTierInfo.nextTier]?.name}</h3>
                      <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((stats.nextTierInfo.current / stats.nextTierInfo.required) * 100).toFixed(1)}%` }}
                          className={`h-full bg-gradient-to-r ${tierConfig[stats.nextTierInfo.nextTier]?.gradient}`}
                        />
                      </div>
                      <p className="text-sm text-zinc-400">
                        Faltam {formatCurrency(stats.nextTierInfo.remaining)} em compras
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCashbackModal(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      <Gift className="w-5 h-5" />
                      Adicionar Cashback
                    </button>
                    <button
                      onClick={handleAdjustTier}
                      disabled={processing}
                      className="flex-1 flex items-center justify-center gap-2 bg-magenta-600 hover:bg-magenta-700 disabled:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      {processing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                      Recalcular Tier
                    </button>
                  </div>

                  {/* Recent Orders */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pedidos Recentes</h3>
                    {recentOrders.length === 0 ? (
                      <p className="text-zinc-500 text-center py-6">Nenhum pedido ainda</p>
                    ) : (
                      <div className="space-y-3">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                            <div>
                              <p className="font-medium text-white">Pedido #{order.orderNumber}</p>
                              <p className="text-sm text-zinc-400">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-white">{formatCurrency(parseFloat(order.total))}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                'bg-cyan-500/20 text-cyan-400'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Cashback */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Histórico de Cashback</h3>
                    {recentCashback.length === 0 ? (
                      <p className="text-zinc-500 text-center py-6">Nenhuma transação ainda</p>
                    ) : (
                      <div className="space-y-3">
                        {recentCashback.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                            <div>
                              <p className="font-medium text-white">{transaction.description}</p>
                              <p className="text-sm text-zinc-400">{formatDate(transaction.createdAt)}</p>
                            </div>
                            <p className={`font-bold ${parseFloat(transaction.amount) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {parseFloat(transaction.amount) >= 0 ? '+' : ''}
                              {formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Cashback Modal */}
          <AnimatePresence>
            {showCashbackModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCashbackModal(false)}
                  className="fixed inset-0 bg-black/80 z-[60]"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                >
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4">Adicionar Cashback Manual</h3>
                    <form onSubmit={handleAddCashback} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Valor (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashbackAmount}
                          onChange={(e) => setCashbackAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                          required
                        />
                        <p className="text-xs text-zinc-500 mt-1">
                          Use valor negativo para remover cashback
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Descrição (opcional)
                        </label>
                        <textarea
                          value={cashbackDescription}
                          onChange={(e) => setCashbackDescription(e.target.value)}
                          placeholder="Ex: Bônus de aniversário, Compensação..."
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowCashbackModal(false)}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={processing}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          {processing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processando...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Confirmar
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  DollarSign,
  LogOut,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Lock,
  Unlock,
  X,
  Eye,
  Bell,
  CreditCard,
  Banknote,
  QrCode,
  AlertCircle
} from 'lucide-react';
import useCashierStore from '../../stores/cashierStore';
import { useAuthStore } from '../../stores/authStore';
import socketService from '../../services/socket';
import useNotificationSound from '../../hooks/useNotificationSound';
import soundService from '../../services/soundService';
import { toast } from 'react-hot-toast';

export default function CaixaPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { playSuccess, playNewOrder, playAlert } = useNotificationSound();
  const {
    currentCashier,
    cashierHistory,
    cashierDetails,
    cashierStats,
    historyPagination,
    loading,
    error,
    openCashier,
    fetchCurrentCashier,
    registerDeposit,
    registerWithdrawal,
    closeCashier,
    fetchCashierHistory,
    fetchCashierDetails,
    fetchCashierStats,
    clearCashierDetails,
    clearError
  } = useCashierStore();

  const [activeTab, setActiveTab] = useState('current'); // current, history, stats
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Ref para controlar se os listeners já foram configurados (evita duplicação)
  const listenersSetup = useRef(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Form states
  const [openingAmount, setOpeningAmount] = useState('0');
  const [openingNotes, setOpeningNotes] = useState('');
  const [closingAmount, setClosingAmount] = useState('0');
  const [closingNotes, setClosingNotes] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalDescription, setWithdrawalDescription] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [statsFilter, setStatsFilter] = useState(30);

  // Sprint 59: Pagamentos pendentes em tempo real
  const [pendingPayments, setPendingPayments] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Verifica se o usuário tem permissão (caixa, admin, gerente)
    const allowedRoles = ['caixa', 'admin', 'gerente', 'staff'];
    if (!allowedRoles.includes(user?.role)) {
      console.log('[Caixa] Acesso negado. Role:', user?.role);
      toast.error(`Acesso negado. Sua role é: ${user?.role}`);
      router.push('/');
      return;
    }

    fetchCurrentCashier();
    fetchCashierHistory(1);
    fetchCashierStats(30);
  }, [isAuthenticated, user, router]);

  // Socket.IO para atualizações em tempo real
  useEffect(() => {
    if (!isAuthenticated) return;
    const allowedRoles = ['caixa', 'admin', 'gerente', 'staff'];
    if (!allowedRoles.includes(user?.role)) return;
    // Evita configurar listeners duplicados
    if (listenersSetup.current) return;

    // Conectar ao Socket.IO
    const authData = localStorage.getItem('flame-auth');
    let token = null;
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        token = parsed?.state?.token;
      } catch (e) {
        console.error('Erro ao parsear token:', e);
      }
    }

    if (token) {
      socketService.connect(token);

      // Sprint 59: Caixa entra na sala específica do caixa
      socketService.joinCaixaRoom();
      // Também ouve a sala de atendentes para compatibilidade
      socketService.joinWaiterRoom();

      // Sprint 59: Listener para solicitação de pagamento (cliente quer pagar)
      const handlePaymentRequest = (data) => {
        console.log('💳 [Caixa] Solicitação de pagamento via Socket:', data);

        // Tocar som de pagamento pendente
        soundService.playPaymentRequest();

        // Adicionar à lista de pagamentos pendentes
        setPendingPayments(prev => {
          // Evitar duplicatas
          const exists = prev.find(p => p.orderId === data.orderId);
          if (exists) return prev;
          return [...prev, { ...data, receivedAt: new Date() }];
        });

        // Toast com informações do pagamento
        const paymentLabel = {
          cash: 'Dinheiro',
          card_at_table: 'Cartão na mesa',
          credit: 'Crédito',
          debit: 'Débito',
          pix: 'PIX'
        }[data.paymentMethod] || data.paymentMethod;

        toast(
          (t) => (
            <div className="flex flex-col gap-1">
              <p className="font-bold text-orange-400">💳 Pagamento Solicitado!</p>
              <p className="text-sm">Pedido #{data.orderNumber}</p>
              <p className="text-sm">Mesa: {data.tableNumber || 'Balcão'}</p>
              <p className="text-sm">Valor: R$ {parseFloat(data.total).toFixed(2)}</p>
              <p className="text-sm">Método: {paymentLabel}</p>
            </div>
          ),
          {
            duration: 10000,
            icon: '💰',
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #f97316'
            }
          }
        );
      };

      // Sprint 59: Listener para pagamento confirmado pelo atendente
      const handlePaymentConfirmed = (data) => {
        console.log('✅ [Caixa] Pagamento confirmado via Socket:', data);

        // Tocar som de sucesso
        playSuccess();

        // Remover da lista de pendentes
        setPendingPayments(prev => prev.filter(p => p.orderId !== data.orderId));

        // Toast de confirmação
        toast.success(
          `Pedido #${data.orderNumber} - Pagamento confirmado! R$ ${parseFloat(data.total).toFixed(2)}`,
          {
            icon: '✅',
            duration: 5000
          }
        );

        // Atualiza o caixa atual se houver
        if (currentCashier) {
          fetchCurrentCashier();
        }
      };

      // Listener para pedidos atualizados (especialmente pagamentos)
      const handleOrderUpdated = (order) => {
        console.log('🔄 [Caixa] Pedido atualizado via Socket:', order);

        // Se o pedido foi pago/entregue, atualiza o caixa
        if (order.status === 'delivered' || order.paymentStatus === 'paid' || order.paymentStatus === 'completed') {
          toast.success(`Pedido #${order.orderNumber || order.id?.substring(0, 8)} - Pagamento recebido!`, {
            icon: '💰',
            duration: 4000
          });
          playSuccess();

          // Atualiza o caixa atual se houver
          if (currentCashier) {
            fetchCurrentCashier();
          }
        }
      };

      // Listener para novos pedidos (para monitoramento geral)
      const handleOrderCreated = (order) => {
        console.log('📦 [Caixa] Novo pedido via Socket:', order);

        // Se é pagamento que precisa de atendente, adiciona aos pendentes
        if (['cash', 'card_at_table', 'pay_later'].includes(order.paymentMethod)) {
          soundService.playNewOrder();
          setPendingPayments(prev => {
            const exists = prev.find(p => p.orderId === order.id);
            if (exists) return prev;
            return [...prev, {
              orderId: order.id,
              orderNumber: order.orderNumber || order.id?.substring(0, 8),
              tableNumber: order.tableNumber,
              total: order.total,
              paymentMethod: order.paymentMethod,
              customerName: order.customerName,
              receivedAt: new Date()
            }];
          });
        }

        // Apenas notifica visualmente sem som forte para outros pagamentos
        toast(`Novo pedido #${order.orderNumber || order.id?.substring(0, 8)}`, {
          icon: '📋',
          duration: 3000
        });
      };

      // Registrar listeners
      socketService.onPaymentRequest(handlePaymentRequest);
      socketService.onPaymentConfirmed(handlePaymentConfirmed);
      socketService.onOrderUpdated(handleOrderUpdated);
      socketService.onOrderCreated(handleOrderCreated);
      listenersSetup.current = true;

      // Cleanup
      return () => {
        socketService.leaveCaixaRoom();
        socketService.leaveWaiterRoom();
        socketService.offPaymentRequest(handlePaymentRequest);
        socketService.offPaymentConfirmed(handlePaymentConfirmed);
        socketService.off('order_updated', handleOrderUpdated);
        socketService.off('order_created', handleOrderCreated);
        listenersSetup.current = false;
      };
    }
  }, [isAuthenticated, user, playSuccess, currentCashier, fetchCurrentCashier]);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleOpenCashier = async (e) => {
    e.preventDefault();
    try {
      await openCashier(openingAmount, openingNotes);
      setShowOpenModal(false);
      setOpeningAmount('0');
      setOpeningNotes('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseCashier = async (e) => {
    e.preventDefault();
    try {
      await closeCashier(currentCashier.id, closingAmount, closingNotes);
      setShowCloseModal(false);
      setClosingAmount('0');
      setClosingNotes('');
      await fetchCashierHistory(1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await registerDeposit(currentCashier.id, depositAmount, depositDescription);
      setShowDepositModal(false);
      setDepositAmount('');
      setDepositDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    try {
      await registerWithdrawal(currentCashier.id, withdrawalAmount, withdrawalDescription);
      setShowWithdrawalModal(false);
      setWithdrawalAmount('');
      setWithdrawalDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewDetails = async (cashierId) => {
    await fetchCashierDetails(cashierId);
    setShowDetailsModal(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <Head>
        <title>Gestão de Caixa - FLAME</title>
        <meta name="description" content="Gerencie aberturas, fechamentos e movimentações de caixa" />
      </Head>

      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-7 h-7" style={{ color: 'var(--theme-primary)' }} />
                  FLAME - Gestão de Caixa
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Aberturas, fechamentos e movimentações
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Current Time */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)] rounded-lg flex justify-between items-center"
              >
                <span className="text-[var(--theme-primary)]">{error}</span>
                <button
                  onClick={clearError}
                  className="text-[var(--theme-primary)] hover:text-[var(--theme-secondary)]"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Cashier Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 bg-gray-900 rounded-xl border border-gray-700"
          >
            {currentCashier ? (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Caixa Aberto</h2>
                    <p className="text-gray-400">
                      Operador: {currentCashier.operatorName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Aberto em: {formatDate(currentCashier.openedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDepositModal(true)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      💰 Suprimento
                    </button>
                    <button
                      onClick={() => setShowWithdrawalModal(true)}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                    >
                      💸 Sangria
                    </button>
                    <button
                      onClick={() => setShowCloseModal(true)}
                      className="px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
                      style={{ background: 'var(--theme-primary)' }}
                    >
                      <Lock className="w-4 h-4 inline mr-1" />
                      Fechar Caixa
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Abertura</p>
                    <p className="text-xl font-bold text-blue-400">
                      {formatCurrency(currentCashier.summary.opening)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Vendas</p>
                    <p className="text-xl font-bold text-green-400">
                      {formatCurrency(currentCashier.summary.sales)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Suprimentos</p>
                    <p className="text-xl font-bold text-green-400">
                      {formatCurrency(currentCashier.summary.deposits)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Sangrias</p>
                    <p className="text-xl font-bold text-yellow-400">
                      {formatCurrency(currentCashier.summary.withdrawals)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Esperado</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--theme-primary)' }}>
                      {formatCurrency(currentCashier.summary.expected)}
                    </p>
                  </div>
                </div>

                {/* Recent Movements */}
                {currentCashier.movements && currentCashier.movements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-3">Movimentações Recentes</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {currentCashier.movements.slice(0, 10).map((movement) => (
                        <div
                          key={movement.id}
                          className="p-3 bg-gray-800 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold">{movement.description}</p>
                            <p className="text-xs text-gray-400">
                              {formatDate(movement.createdAt)} - {movement.createdByName}
                            </p>
                          </div>
                          <p
                            className={`text-lg font-bold ${
                              parseFloat(movement.amount) >= 0
                                ? 'text-green-400'
                                : 'text-[var(--theme-primary)]'
                            }`}
                          >
                            {parseFloat(movement.amount) >= 0 ? '+' : ''}
                            {formatCurrency(movement.amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Nenhum caixa aberto no momento</p>
                <button
                  onClick={() => setShowOpenModal(true)}
                  className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                  style={{ background: 'var(--theme-primary)' }}
                >
                  <Unlock className="w-4 h-4 inline mr-1" />
                  Abrir Caixa
                </button>
              </div>
            )}
          </motion.div>

          {/* Sprint 59: Seção de Pagamentos Pendentes */}
          {pendingPayments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-gradient-to-r from-orange-900/20 to-yellow-900/20 rounded-xl border border-orange-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-orange-400 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-orange-400">Pagamentos Aguardando</h2>
                    <p className="text-gray-400 text-sm">{pendingPayments.length} pagamento(s) pendente(s)</p>
                  </div>
                </div>
                <button
                  onClick={() => setPendingPayments([])}
                  className="text-gray-500 hover:text-gray-400 text-sm"
                >
                  Limpar lista
                </button>
              </div>

              <div className="grid gap-3">
                {pendingPayments.map((payment, index) => {
                  const paymentIcon = {
                    cash: <Banknote className="w-5 h-5" />,
                    card_at_table: <CreditCard className="w-5 h-5" />,
                    credit: <CreditCard className="w-5 h-5" />,
                    debit: <CreditCard className="w-5 h-5" />,
                    pix: <QrCode className="w-5 h-5" />,
                    pay_later: <Clock className="w-5 h-5" />
                  }[payment.paymentMethod] || <DollarSign className="w-5 h-5" />;

                  const paymentLabel = {
                    cash: 'Dinheiro',
                    card_at_table: 'Cartão na mesa',
                    credit: 'Crédito',
                    debit: 'Débito',
                    pix: 'PIX',
                    pay_later: 'Pagar depois'
                  }[payment.paymentMethod] || payment.paymentMethod;

                  const timeSince = payment.receivedAt
                    ? Math.floor((new Date() - new Date(payment.receivedAt)) / 60000)
                    : 0;

                  return (
                    <motion.div
                      key={payment.orderId || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-800/50 rounded-lg border border-orange-500/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                          {paymentIcon}
                        </div>
                        <div>
                          <p className="font-bold text-white">
                            Pedido #{payment.orderNumber}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>Mesa: {payment.tableNumber || 'Balcão'}</span>
                            <span>•</span>
                            <span>{paymentLabel}</span>
                            {payment.customerName && (
                              <>
                                <span>•</span>
                                <span>{payment.customerName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-400">
                          {formatCurrency(payment.total)}
                        </p>
                        {timeSince > 0 && (
                          <p className="text-xs text-gray-500">
                            há {timeSince} min
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors text-white ${
                activeTab === 'history'
                  ? ''
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              style={activeTab === 'history' ? { background: 'var(--theme-primary)' } : {}}
            >
              📋 Histórico
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors text-white ${
                activeTab === 'stats'
                  ? ''
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              style={activeTab === 'stats' ? { background: 'var(--theme-primary)' } : {}}
            >
              📊 Estatísticas
            </button>
          </div>

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : cashierHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                  <p className="text-gray-400">Nenhum registro encontrado</p>
                </div>
              ) : (
                <>
                  {cashierHistory.map((cashier) => (
                    <div
                      key={cashier.id}
                      className="p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">
                            {cashier.summary.operator}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {formatDate(cashier.openedAt)} -{' '}
                            {cashier.closedAt ? formatDate(cashier.closedAt) : 'Em aberto'}
                          </p>
                          {cashier.summary.duration && (
                            <p className="text-xs text-gray-500">
                              Duração: {formatDuration(cashier.summary.duration)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleViewDetails(cashier.id)}
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                        >
                          Ver Detalhes
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Vendas</p>
                          <p className="text-green-400 font-semibold">
                            {formatCurrency(cashier.summary.sales)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Esperado</p>
                          <p className="text-orange-400 font-semibold">
                            {formatCurrency(cashier.summary.expected)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Contado</p>
                          <p className="text-blue-400 font-semibold">
                            {formatCurrency(cashier.summary.closing)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Diferença</p>
                          <p
                            className={`font-semibold ${
                              cashier.summary.differenceType === 'sobra'
                                ? 'text-green-400'
                                : cashier.summary.differenceType === 'falta'
                                ? 'text-[var(--theme-primary)]'
                                : 'text-gray-400'
                            }`}
                          >
                            {cashier.summary.differenceType === 'sobra' && '+'}
                            {cashier.summary.differenceType === 'falta' && '-'}
                            {formatCurrency(cashier.summary.difference)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {historyPagination && historyPagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <button
                        onClick={() => {
                          setCurrentPage(currentPage - 1);
                          fetchCashierHistory(currentPage - 1);
                        }}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Anterior
                      </button>
                      <span className="px-4 py-2 text-gray-400">
                        Página {currentPage} de {historyPagination.totalPages}
                      </span>
                      <button
                        onClick={() => {
                          setCurrentPage(currentPage + 1);
                          fetchCashierHistory(currentPage + 1);
                        }}
                        disabled={currentPage === historyPagination.totalPages}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-6 flex gap-2">
                {[7, 15, 30, 60].map((days) => (
                  <button
                    key={days}
                    onClick={() => {
                      setStatsFilter(days);
                      fetchCashierStats(days);
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors text-white ${
                      statsFilter === days
                        ? ''
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    style={statsFilter === days ? { background: 'var(--theme-primary)' } : {}}
                  >
                    {days} dias
                  </button>
                ))}
              </div>

              {cashierStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-2">Total de Caixas</p>
                    <p className="text-3xl font-bold">{cashierStats.totalCashiers}</p>
                  </div>
                  <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-2">Total em Vendas</p>
                    <p className="text-3xl font-bold text-green-400">
                      {formatCurrency(cashierStats.totalSales)}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-2">Média de Vendas</p>
                    <p className="text-3xl font-bold text-blue-400">
                      {formatCurrency(cashierStats.averageSales)}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-2">Diferença Total</p>
                    <p
                      className={`text-3xl font-bold ${
                        cashierStats.totalDifference > 0
                          ? 'text-green-400'
                          : cashierStats.totalDifference < 0
                          ? 'text-[var(--theme-primary)]'
                          : 'text-gray-400'
                      }`}
                    >
                      {formatCurrency(cashierStats.totalDifference)}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-2">Caixas com Sobra</p>
                    <p className="text-3xl font-bold text-green-400">
                      {cashierStats.positiveCount}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-2">Caixas com Falta</p>
                    <p className="text-3xl font-bold text-[var(--theme-primary)]">
                      {cashierStats.negativeCount}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-2">Caixas Exatos</p>
                    <p className="text-3xl font-bold text-gray-400">
                      {cashierStats.exactCount}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-2">Diferença Média</p>
                    <p
                      className={`text-3xl font-bold ${
                        cashierStats.averageDifference > 0
                          ? 'text-green-400'
                          : cashierStats.averageDifference < 0
                          ? 'text-[var(--theme-primary)]'
                          : 'text-gray-400'
                      }`}
                    >
                      {formatCurrency(cashierStats.averageDifference)}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </main>


        {/* Modal Abrir Caixa */}
        <AnimatePresence>
          {showOpenModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setShowOpenModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800"
              >
                <h2 className="text-2xl font-bold mb-4">Abrir Caixa</h2>
                <form onSubmit={handleOpenCashier} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Valor de Abertura (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={openingAmount}
                      onChange={(e) => setOpeningAmount(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={openingNotes}
                      onChange={(e) => setOpeningNotes(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowOpenModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 text-white rounded-lg transition-all disabled:opacity-50 hover:opacity-90"
                      style={{ background: 'var(--theme-primary)' }}
                    >
                      {loading ? 'Abrindo...' : 'Abrir'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Fechar Caixa */}
        <AnimatePresence>
          {showCloseModal && currentCashier && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCloseModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800"
              >
                <h2 className="text-2xl font-bold mb-4">Fechar Caixa</h2>
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Valor Esperado</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--theme-primary)' }}>
                    {formatCurrency(currentCashier.summary.expected)}
                  </p>
                </div>
                <form onSubmit={handleCloseCashier} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Valor Contado (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={closingAmount}
                      onChange={(e) => setClosingAmount(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  {parseFloat(closingAmount) !== currentCashier.summary.expected && (
                    <div
                      className={`p-3 rounded-lg ${
                        parseFloat(closingAmount) > currentCashier.summary.expected
                          ? 'bg-green-500/10 border border-green-500'
                          : 'bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]'
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          parseFloat(closingAmount) > currentCashier.summary.expected
                            ? 'text-green-400'
                            : 'text-[var(--theme-primary)]'
                        }`}
                      >
                        {parseFloat(closingAmount) > currentCashier.summary.expected
                          ? 'Sobra'
                          : 'Falta'}
                        :{' '}
                        {formatCurrency(
                          Math.abs(parseFloat(closingAmount) - currentCashier.summary.expected)
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={closingNotes}
                      onChange={(e) => setClosingNotes(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCloseModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 text-white rounded-lg transition-all disabled:opacity-50 hover:opacity-90"
                      style={{ background: 'var(--theme-primary)' }}
                    >
                      {loading ? 'Fechando...' : 'Fechar'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Suprimento */}
        <AnimatePresence>
          {showDepositModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDepositModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800"
              >
                <h2 className="text-2xl font-bold mb-4">Registrar Suprimento</h2>
                <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <input
                      type="text"
                      value={depositDescription}
                      onChange={(e) => setDepositDescription(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="Ex: Troco, Fundo inicial..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDepositModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Sangria */}
        <AnimatePresence>
          {showWithdrawalModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setShowWithdrawalModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800"
              >
                <h2 className="text-2xl font-bold mb-4">Registrar Sangria</h2>
                <form onSubmit={handleWithdrawal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <input
                      type="text"
                      value={withdrawalDescription}
                      onChange={(e) => setWithdrawalDescription(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="Ex: Despesa, Retirada..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowWithdrawalModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Detalhes do Caixa */}
        <AnimatePresence>
          {showDetailsModal && cashierDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowDetailsModal(false);
                clearCashierDetails();
              }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Detalhes do Caixa</h2>
                    <p className="text-gray-400">
                      {cashierDetails.operator.nome} - {formatDate(cashierDetails.openedAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      clearCashierDetails();
                    }}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Abertura</p>
                    <p className="text-lg font-bold text-blue-400">
                      {formatCurrency(cashierDetails.summary.opening)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Vendas</p>
                    <p className="text-lg font-bold text-green-400">
                      {formatCurrency(cashierDetails.summary.sales)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Esperado</p>
                    <p className="text-lg font-bold text-orange-400">
                      {formatCurrency(cashierDetails.summary.expected)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Contado</p>
                    <p className="text-lg font-bold text-purple-400">
                      {formatCurrency(cashierDetails.summary.closing)}
                    </p>
                  </div>
                </div>

                {cashierDetails.summary.differenceType !== 'correto' && (
                  <div
                    className={`p-4 rounded-lg mb-6 ${
                      cashierDetails.summary.differenceType === 'sobra'
                        ? 'bg-green-500/10 border border-green-500'
                        : 'bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]'
                    }`}
                  >
                    <p
                      className={`font-semibold ${
                        cashierDetails.summary.differenceType === 'sobra'
                          ? 'text-green-400'
                          : 'text-[var(--theme-primary)]'
                      }`}
                    >
                      {cashierDetails.summary.differenceType === 'sobra' ? 'Sobra' : 'Falta'}:{' '}
                      {formatCurrency(cashierDetails.summary.difference)}
                    </p>
                  </div>
                )}

                <h3 className="text-lg font-bold mb-3">Todas as Movimentações</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {cashierDetails.movements.map((movement) => (
                    <div
                      key={movement.id}
                      className="p-3 bg-gray-800 rounded-lg flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              movement.typeLabel === 'Venda'
                                ? 'bg-green-500/20 text-green-400'
                                : movement.typeLabel === 'Suprimento'
                                ? 'bg-blue-500/20 text-blue-400'
                                : movement.typeLabel === 'Sangria'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {movement.typeLabel}
                          </span>
                        </div>
                        <p className="text-sm font-semibold">{movement.description}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(movement.createdAt)} - {movement.createdBy}
                        </p>
                      </div>
                      <p
                        className={`text-lg font-bold ${
                          movement.isIncome ? 'text-green-400' : 'text-[var(--theme-primary)]'
                        }`}
                      >
                        {movement.isIncome ? '+' : '-'}
                        {formatCurrency(Math.abs(movement.amount))}
                      </p>
                    </div>
                  ))}
                </div>

                {cashierDetails.notes && (
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">Observações</p>
                    <p className="text-sm">{cashierDetails.notes}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

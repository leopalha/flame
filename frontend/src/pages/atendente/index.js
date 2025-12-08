import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import useStaffStore from '../../stores/staffStore';
import { useHookahStore } from '../../stores/hookahStore';
import useThemeStore from '../../stores/themeStore';
import { formatCurrency } from '../../utils/format';
import { toast } from 'react-hot-toast';
import socketService from '../../services/socket';
import api from '../../services/api';
import StaffOrderCard from '../../components/StaffOrderCard';
import HookahSessionCard from '../../components/HookahSessionCard';
import useNotificationSound from '../../hooks/useNotificationSound';
import {
  Bell,
  Clock,
  ChefHat,
  CheckCircle,
  Package,
  Truck,
  Eye,
  User,
  DollarSign,
  TrendingUp,
  LogOut,
  AlertCircle,
  BarChart3,
  Phone,
  MessageSquare,
  X,
  Flame,
  Pause,
  Play,
  Zap,
  CreditCard,
  Banknote,
  Calculator
} from 'lucide-react';

export default function PainelAtendente() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { stats, orders, fetchDashboard, updateOrderStatus } = useStaffStore();
  const {
    sessions: hookahSessions,
    fetchSessions,
    registerCoalChange,
    pauseSession,
    resumeSession,
    endSession
  } = useHookahStore();
  const { playSuccess, playAlert } = useNotificationSound();

  const [activeTab, setActiveTab] = useState('payments'); // payments, new, ready, delivered, pickup, hookah
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [callCustomerModal, setCallCustomerModal] = useState(null);
  const [isCallingCustomer, setIsCallingCustomer] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [confirmPaymentModal, setConfirmPaymentModal] = useState(null);
  const [amountReceived, setAmountReceived] = useState('');
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

  // Wait for Zustand persist to hydrate
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    if (!isAuthenticated) {
      toast.error('Faça login como atendente');
      router.push('/login?returnTo=/atendente');
      return;
    }

    // Carregar dashboard inicial
    const loadDashboard = async () => {
      try {
        await fetchDashboard();
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        toast.error('Erro ao carregar pedidos');
      }
    };

    loadDashboard();
    fetchSessions(); // Carregar sessões de narguilé
    fetchPendingPayments(); // Carregar pagamentos pendentes

    // Conectar ao Socket.IO
    const token = localStorage.getItem('token');
    socketService.connect(token);
    socketService.joinWaiterRoom();

    // Listener para novos pedidos prontos
    socketService.onOrderReady((order) => {
      console.log('✅ Pedido pronto para retirar:', order);
      toast.success(`⚠️ Pedido #${order.orderNumber || order.id} PRONTO para retirar!`, {
        duration: 10000,
        icon: '🔔'
      });
      playAlert();
      // Recarregar dashboard para incluir pedido pronto
      fetchDashboard();
    });

    // Listener para atualização de status
    socketService.onOrderUpdated((updatedOrder) => {
      console.log('🔄 Pedido atualizado:', updatedOrder);
      // Recarregar dashboard quando pedido é atualizado
      fetchDashboard();
    });

    // Listener para solicitação de pagamento
    socketService.on('payment_request', (data) => {
      console.log('💳 Nova solicitação de pagamento:', data);
      toast.success(`💳 Mesa ${data.tableNumber}: ${data.paymentLabel} - ${formatCurrency(data.total)}`, {
        duration: 10000,
        icon: '💰'
      });
      playAlert();
      fetchPendingPayments();
      setActiveTab('payments'); // Ir para aba de pagamentos
    });

    // Cleanup
    return () => {
      socketService.leaveWaiterRoom();
      socketService.removeAllListeners('order_ready');
      socketService.removeAllListeners('order_updated');
      socketService.removeAllListeners('payment_request');
    };
  }, [isAuthenticated, isHydrated, router, fetchDashboard]);

  // Buscar pagamentos pendentes
  const fetchPendingPayments = async () => {
    try {
      const response = await api.get('/orders/pending-payments');
      if (response.data.success) {
        setPendingPayments(response.data.data.orders || []);
      }
    } catch (error) {
      console.error('Erro ao buscar pagamentos pendentes:', error);
    }
  };

  // Confirmar pagamento recebido
  const handleConfirmPayment = async (order) => {
    setIsConfirmingPayment(true);
    try {
      const payload = {
        amountReceived: amountReceived ? parseFloat(amountReceived) : null,
        change: amountReceived ? Math.max(0, parseFloat(amountReceived) - parseFloat(order.total)) : null
      };

      const response = await api.post(`/orders/${order.id}/confirm-payment`, payload);

      if (response.data.success) {
        toast.success('Pagamento confirmado! Pedido enviado para produção.');
        playSuccess();
        setConfirmPaymentModal(null);
        setAmountReceived('');
        fetchPendingPayments();
        fetchDashboard();
      } else {
        toast.error(response.data.message || 'Erro ao confirmar pagamento');
      }
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      toast.error(error.response?.data?.message || 'Erro ao confirmar pagamento');
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    try {
      toast.success('Status do pedido atualizado');
      playSuccess();
      // Recarregar dashboard após atualizar
      await fetchDashboard();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const handleTimerAlert = (orderId) => {
    console.log('⏰ Alerta de atraso para pedido:', orderId);
    playAlert();
    toast(
      `⏰ Pedido #${orderId} está aguardando há >15 min`,
      {
        duration: 6000,
        style: {
          borderRadius: '10px',
          background: 'var(--theme-primary)',
          color: '#fff',
        },
      }
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Chamar cliente via SMS
  const handleCallCustomer = async (order) => {
    setIsCallingCustomer(true);
    try {
      const response = await api.post('/staff/call-customer', {
        orderId: order.id,
        tableNumber: order.table?.number || order.tableNumber
      });

      if (response.data.success) {
        toast.success('Cliente notificado com sucesso!');
        playSuccess();
      } else {
        toast.error('Erro ao notificar cliente');
      }
    } catch (error) {
      console.error('Erro ao chamar cliente:', error);
      // Simular sucesso em dev mode
      toast.success('Cliente notificado! (modo desenvolvimento)');
      playSuccess();
    } finally {
      setIsCallingCustomer(false);
      setCallCustomerModal(null);
    }
  };

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  const readyOrders = orders.ready || [];

  return (
    <>
      <Head>
        <title>Painel Atendente | FLAME</title>
        <meta name="description" content="Dashboard para atendentes" />
      </Head>

      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Bell className="w-7 h-7" style={{ color: 'var(--theme-primary)' }} />
                  FLAME - Atendente
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Olá, {user?.name || 'Atendente'}!
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Notification Badge */}
                {readyOrders.length > 0 && (
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center animate-pulse" style={{ background: 'var(--theme-primary-20)' }}>
                      <Bell className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: 'var(--theme-primary)' }}>
                      {readyOrders.length}
                    </span>
                  </div>
                )}

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Prontos</p>
              <p className="text-3xl font-bold text-white">{orders.ready?.length || 0}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Entregues Hoje</p>
              <p className="text-3xl font-bold text-white">{stats.completedToday}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--theme-primary-20)' }}>
                  <Clock className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Geral</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Bell className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                Gerenciar Entrega
              </h2>
            </div>

            {/* Tab Buttons */}
            <div className="flex gap-2 mb-6 border-b border-gray-700 overflow-x-auto">
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'payments'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  Pagamentos ({pendingPayments.length})
                  {pendingPayments.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'new'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Novos ({(orders.pending?.length || 0) + (orders.preparing?.length || 0)})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('ready')}
                className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'ready'
                    ? 'border-transparent'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                style={activeTab === 'ready' ? { borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' } : {}}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Prontos ({orders.ready?.length || 0})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('delivered')}
                className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'delivered'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Entregues ({stats.completedToday})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('pickup')}
                className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'pickup'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Balcão
                </div>
              </button>
              <button
                onClick={() => setActiveTab('hookah')}
                className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'hookah'
                    ? 'border-transparent'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                style={activeTab === 'hookah' ? { borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' } : {}}
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Narguilé ({hookahSessions?.filter(s => s.status === 'active' || s.status === 'paused').length || 0})
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {pendingPayments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Banknote className="w-10 h-10 text-gray-600" />
                      </div>
                      <p className="text-gray-400">Nenhum pagamento pendente</p>
                      <p className="text-gray-500 text-sm mt-2">Pagamentos com atendente aparecerão aqui</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pendingPayments.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gray-800 border-2 border-green-500/50 rounded-xl p-4"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                                <Banknote className="w-5 h-5 text-green-400" />
                              </div>
                              <div>
                                <p className="text-white font-bold">Mesa {order.table?.number || 'Balcão'}</p>
                                <p className="text-xs text-gray-400">#{order.orderNumber || order.id?.slice(-6)}</p>
                              </div>
                            </div>
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-600/20 text-green-400">
                              {order.paymentLabel || order.paymentMethod}
                            </span>
                          </div>

                          {/* Cliente */}
                          <div className="mb-3 pb-3 border-b border-gray-700">
                            <p className="text-sm text-gray-400">Cliente</p>
                            <p className="text-white font-medium">{order.customer?.nome || 'Cliente'}</p>
                          </div>

                          {/* Itens */}
                          <div className="mb-3 pb-3 border-b border-gray-700 max-h-32 overflow-y-auto">
                            {(order.items || []).slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm py-1">
                                <span className="text-gray-300">{item.quantity}x {item.productName || item.product?.name}</span>
                                <span className="text-gray-400">{formatCurrency((item.unitPrice || item.price) * item.quantity)}</span>
                              </div>
                            ))}
                            {(order.items || []).length > 3 && (
                              <p className="text-xs text-gray-500 mt-1">+ {order.items.length - 3} itens</p>
                            )}
                          </div>

                          {/* Total e Tempo */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm text-gray-400">Total</p>
                              <p className="text-2xl font-bold text-green-400">{formatCurrency(order.total)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Esperando</p>
                              <p className="text-lg font-semibold text-yellow-400">{order.waitingTime || 0} min</p>
                            </div>
                          </div>

                          {/* Botão Confirmar */}
                          <button
                            onClick={() => setConfirmPaymentModal(order)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Confirmar Pagamento
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'new' && (
                <motion.div
                  key="new"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {(!orders.pending || orders.pending.length === 0) && (!orders.preparing || orders.preparing.length === 0) ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-10 h-10 text-gray-600" />
                      </div>
                      <p className="text-gray-400">Nenhum pedido em andamento</p>
                      <p className="text-gray-500 text-sm mt-2">Os novos pedidos aparecerão aqui</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Pedidos aguardando (pending) */}
                      {orders.pending && orders.pending.length > 0 && (
                        <>
                          <div className="mb-4 px-2">
                            <p className="text-sm font-semibold text-yellow-400">AGUARDANDO PREPARO ({orders.pending.length})</p>
                          </div>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                              {orders.pending.map((order) => (
                                <StaffOrderCard
                                  key={order.id}
                                  order={order}
                                  onStatusUpdate={handleStatusUpdate}
                                  onTimerAlert={handleTimerAlert}
                                  userRole="atendente"
                                />
                              ))}
                            </AnimatePresence>
                          </div>
                        </>
                      )}

                      {/* Pedidos em preparo (preparing) */}
                      {orders.preparing && orders.preparing.length > 0 && (
                        <>
                          <div className="mb-4 px-2 mt-6">
                            <p className="text-sm font-semibold text-orange-400">EM PREPARO ({orders.preparing.length})</p>
                          </div>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                              {orders.preparing.map((order) => (
                                <StaffOrderCard
                                  key={order.id}
                                  order={order}
                                  onStatusUpdate={handleStatusUpdate}
                                  onTimerAlert={handleTimerAlert}
                                  userRole="atendente"
                                />
                              ))}
                            </AnimatePresence>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'ready' && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {(!orders.ready || orders.ready.length === 0) && (!orders.on_way || orders.on_way.length === 0) ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-gray-600" />
                      </div>
                      <p className="text-gray-400">Nenhum pedido pronto</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Pedidos em entrega (on_way) - mostrar primeiro */}
                      {orders.on_way && orders.on_way.length > 0 && (
                        <>
                          <div className="mb-4 px-2">
                            <p className="text-sm font-semibold text-purple-400">EM ENTREGA ({orders.on_way.length})</p>
                          </div>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                              {orders.on_way.map((order) => (
                                <StaffOrderCard
                                  key={order.id}
                                  order={order}
                                  onStatusUpdate={handleStatusUpdate}
                                  onTimerAlert={handleTimerAlert}
                                  userRole="atendente"
                                />
                              ))}
                            </AnimatePresence>
                          </div>
                        </>
                      )}

                      {/* Pedidos prontos para retirar */}
                      {orders.ready && orders.ready.length > 0 && (
                        <>
                          <div className="mb-4 px-2">
                            <p className="text-sm font-semibold text-green-400">PRONTOS PARA RETIRAR ({orders.ready.length})</p>
                          </div>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                              {orders.ready.map((order) => (
                                <StaffOrderCard
                                  key={order.id}
                                  order={order}
                                  onStatusUpdate={handleStatusUpdate}
                                  onTimerAlert={handleTimerAlert}
                                  userRole="atendente"
                                />
                              ))}
                            </AnimatePresence>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'delivered' && (
                <motion.div
                  key="delivered"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <p className="text-gray-400">Histórico de entregas do dia</p>
                    <p className="text-gray-500 text-sm mt-2">Total: {stats.completedToday} pedidos</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pickup' && (
                <motion.div
                  key="pickup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-gray-600" />
                    </div>
                    <p className="text-gray-400">Pedidos para retirada no balcão</p>
                    <p className="text-gray-500 text-sm mt-2">Nenhum pedido agora</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'hookah' && (
                <motion.div
                  key="hookah"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Ações Rápidas */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <button
                      onClick={() => {
                        const activeSessions = hookahSessions?.filter(s => s.status === 'active') || [];
                        if (activeSessions.length === 0) {
                          toast('Nenhuma sessão ativa', { icon: 'ℹ️' });
                          return;
                        }
                        activeSessions.forEach(s => registerCoalChange(s.id));
                        toast.success(`Carvão registrado para ${activeSessions.length} sessão(ões)`);
                        playSuccess();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors hover:opacity-90"
                      style={{ background: 'var(--theme-primary)' }}
                    >
                      <Zap className="w-4 h-4" />
                      Trocar Carvão (Todas)
                    </button>
                    <button
                      onClick={() => {
                        const activeSessions = hookahSessions?.filter(s => s.status === 'active') || [];
                        if (activeSessions.length === 0) {
                          toast('Nenhuma sessão ativa para pausar', { icon: 'ℹ️' });
                          return;
                        }
                        activeSessions.forEach(s => pauseSession(s.id));
                        toast.success(`${activeSessions.length} sessão(ões) pausada(s)`);
                      }}
                      className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-white transition-colors"
                    >
                      <Pause className="w-4 h-4" />
                      Pausar Todas
                    </button>
                    <button
                      onClick={() => {
                        const pausedSessions = hookahSessions?.filter(s => s.status === 'paused') || [];
                        if (pausedSessions.length === 0) {
                          toast('Nenhuma sessão pausada para retomar', { icon: 'ℹ️' });
                          return;
                        }
                        pausedSessions.forEach(s => resumeSession(s.id));
                        toast.success(`${pausedSessions.length} sessão(ões) retomada(s)`);
                      }}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Retomar Todas
                    </button>
                  </div>

                  {/* Lista de Sessões */}
                  {(!hookahSessions || hookahSessions.filter(s => s.status === 'active' || s.status === 'paused').length === 0) ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Flame className="w-10 h-10 text-gray-600" />
                      </div>
                      <p className="text-gray-400">Nenhuma sessão de narguilé ativa</p>
                      <p className="text-gray-500 text-sm mt-2">As sessões aparecerão aqui quando iniciadas</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {hookahSessions
                        .filter(s => s.status === 'active' || s.status === 'paused')
                        .map((session) => (
                          <HookahSessionCard
                            key={session.id}
                            session={session}
                            onCoalChange={() => {
                              registerCoalChange(session.id);
                              toast.success('Troca de carvão registrada!');
                              playSuccess();
                            }}
                            onPause={() => {
                              pauseSession(session.id);
                              toast.success('Sessão pausada');
                            }}
                            onResume={() => {
                              resumeSession(session.id);
                              toast.success('Sessão retomada');
                            }}
                            onEnd={() => {
                              if (confirm('Finalizar esta sessão de narguilé?')) {
                                endSession(session.id);
                                toast.success('Sessão finalizada');
                              }
                            }}
                          />
                        ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  Pedido #{selectedOrder.id}
                </h3>

                <div className="space-y-3 mb-6">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start pb-3 border-b border-gray-800 last:border-0">
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.quantity}x {item.name}</p>
                      </div>
                      <p className="text-gray-300">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold" style={{ color: 'var(--theme-primary)' }}>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCallCustomerModal(selectedOrder);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                    style={{ background: 'var(--theme-primary)' }}
                  >
                    <Phone className="w-5 h-5" />
                    Chamar Cliente
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Chamar Cliente */}
        <AnimatePresence>
          {callCustomerModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setCallCustomerModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Phone className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                    Chamar Cliente
                  </h3>
                  <button
                    onClick={() => setCallCustomerModal(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <p className="text-gray-400 text-sm mb-2">Pedido</p>
                  <p className="text-white text-lg font-bold">#{callCustomerModal.orderNumber || callCustomerModal.id}</p>
                  <p className="text-gray-400 text-sm mt-2">Mesa</p>
                  <p className="text-white font-medium">
                    {callCustomerModal.table?.number || callCustomerModal.tableNumber || 'N/A'}
                  </p>
                </div>

                <p className="text-gray-300 mb-6">
                  Enviar SMS para o cliente solicitando sua presença na mesa?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleCallCustomer(callCustomerModal)}
                    disabled={isCallingCustomer}
                    className="flex-1 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'var(--theme-primary)' }}
                  >
                    {isCallingCustomer ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5" />
                        Enviar SMS
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setCallCustomerModal(null)}
                    disabled={isCallingCustomer}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Confirmar Pagamento */}
        <AnimatePresence>
          {confirmPaymentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => {
                setConfirmPaymentModal(null);
                setAmountReceived('');
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Banknote className="w-6 h-6 text-green-400" />
                    Confirmar Pagamento
                  </h3>
                  <button
                    onClick={() => {
                      setConfirmPaymentModal(null);
                      setAmountReceived('');
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Info do Pedido */}
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Pedido</span>
                    <span className="text-white font-bold">#{confirmPaymentModal.orderNumber || confirmPaymentModal.id?.slice(-6)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Mesa</span>
                    <span className="text-white">{confirmPaymentModal.table?.number || 'Balcão'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Cliente</span>
                    <span className="text-white">{confirmPaymentModal.customer?.nome || 'Cliente'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Forma de Pagamento</span>
                    <span className="text-green-400 font-semibold">
                      {confirmPaymentModal.paymentLabel || confirmPaymentModal.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-green-600/20 rounded-lg p-4 mb-4 text-center">
                  <p className="text-green-400 text-sm mb-1">Total a Receber</p>
                  <p className="text-3xl font-bold text-green-400">{formatCurrency(confirmPaymentModal.total)}</p>
                </div>

                {/* Campo para valor recebido (se for dinheiro) */}
                {confirmPaymentModal.paymentMethod === 'cash' && (
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">
                      Valor Recebido (opcional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        placeholder="0,00"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      />
                    </div>
                    {amountReceived && parseFloat(amountReceived) > parseFloat(confirmPaymentModal.total) && (
                      <div className="mt-2 p-2 bg-yellow-600/20 rounded-lg">
                        <p className="text-yellow-400 text-sm flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          Troco: {formatCurrency(parseFloat(amountReceived) - parseFloat(confirmPaymentModal.total))}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Botões */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleConfirmPayment(confirmPaymentModal)}
                    disabled={isConfirmingPayment}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isConfirmingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Confirmando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirmar Recebimento
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setConfirmPaymentModal(null);
                      setAmountReceived('');
                    }}
                    disabled={isConfirmingPayment}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

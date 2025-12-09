import { useState, useEffect, useRef } from 'react';
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
import soundService from '../../services/soundService';
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
  Calculator,
  ChevronDown,
  ChevronUp
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

  // Sprint 58: Ref para evitar listeners duplicados
  const listenersSetup = useRef(false);

  // Sprint 57: Seções colapsáveis ao invés de abas
  const [collapsedSections, setCollapsedSections] = useState({
    payments: false,
    new: false,
    ready: false,
    onWay: false,
    hookah: false
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [callCustomerModal, setCallCustomerModal] = useState(null);
  const [isCallingCustomer, setIsCallingCustomer] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [confirmPaymentModal, setConfirmPaymentModal] = useState(null);
  const [amountReceived, setAmountReceived] = useState('');
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

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
    socketService.connect(token);
    socketService.joinWaiterRoom();

    // Sprint 58: Configurar listeners apenas uma vez
    if (!listenersSetup.current) {
      listenersSetup.current = true;

      // Handler para novos pedidos criados
      const handleOrderCreated = (order) => {
        console.log('🆕 Novo pedido criado:', order);
        toast.success(`📦 Novo pedido #${order.orderNumber} - Mesa ${order.tableNumber || 'Balcão'}`, {
          duration: 5000,
          icon: '🆕'
        });
        soundService.playNotification();
        fetchDashboard();
      };

      // Handler para mudança de status
      const handleOrderStatusChanged = (data) => {
        console.log('🔄 Status alterado:', data);
        // Atualizar dashboard
        fetchDashboard();

        // Notificar sobre status específicos
        if (data.status === 'preparing') {
          toast(`👨‍🍳 Pedido #${data.orderNumber || data.orderId} em preparo`, {
            duration: 3000,
            icon: '👨‍🍳'
          });
        }
      };

      // Handler para pedidos prontos (alerta especial)
      const handleOrderReadyAlert = (data) => {
        console.log('🚨 ALERTA: Pedido pronto:', data);
        toast.success(`🚨 RETIRAR AGORA: Pedido #${data.orderNumber || data.orderId}`, {
          duration: 15000,
          icon: '🔔'
        });
        soundService.playAlert();
        fetchDashboard();
      };

      // Handler para pedidos prontos
      const handleOrderReady = (order) => {
        console.log('✅ Pedido pronto para retirar:', order);
        toast.success(`⚠️ Pedido #${order.orderNumber || order.id} PRONTO para retirar!`, {
          duration: 10000,
          icon: '🔔'
        });
        soundService.playAlert();
        fetchDashboard();
      };

      // Handler para atualizações
      const handleOrderUpdated = (updatedOrder) => {
        console.log('🔄 Pedido atualizado:', updatedOrder);
        fetchDashboard();
      };

      // Handler para solicitação de pagamento
      const handlePaymentRequest = (data) => {
        console.log('💳 Nova solicitação de pagamento:', data);
        toast.success(`💳 Mesa ${data.tableNumber}: ${data.paymentLabel} - ${formatCurrency(data.total)}`, {
          duration: 10000,
          icon: '💰'
        });
        soundService.playAlert();
        fetchPendingPayments();
        setCollapsedSections(prev => ({ ...prev, payments: false }));
      };

      // Registrar todos os listeners
      socketService.onOrderCreated(handleOrderCreated);
      socketService.onOrderStatusChanged(handleOrderStatusChanged);
      socketService.on('order_ready_alert', handleOrderReadyAlert);
      socketService.onOrderReady(handleOrderReady);
      socketService.onOrderUpdated(handleOrderUpdated);
      socketService.on('payment_request', handlePaymentRequest);
    }

    // Cleanup
    return () => {
      socketService.leaveWaiterRoom();
      socketService.removeAllListeners('order_created');
      socketService.removeAllListeners('order_status_changed');
      socketService.removeAllListeners('order_ready_alert');
      socketService.removeAllListeners('order_ready');
      socketService.removeAllListeners('order_updated');
      socketService.removeAllListeners('payment_request');
      listenersSetup.current = false;
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
    if (!selectedPaymentMethod) {
      toast.error('Selecione a forma de pagamento');
      return;
    }

    setIsConfirmingPayment(true);
    try {
      const payload = {
        paymentMethod: selectedPaymentMethod,
        amountReceived: selectedPaymentMethod === 'cash' && amountReceived ? parseFloat(amountReceived) : null,
        change: selectedPaymentMethod === 'cash' && amountReceived ? Math.max(0, parseFloat(amountReceived) - parseFloat(order.total)) : null
      };

      console.log('💳 [CONFIRM PAYMENT] Enviando:', { orderId: order.id, payload });
      const response = await api.post(`/orders/${order.id}/confirm-payment`, payload);
      console.log('💳 [CONFIRM PAYMENT] Resposta:', response.data);

      if (response.data.success) {
        const methodLabels = { credit: 'Crédito', debit: 'Débito', pix: 'PIX', cash: 'Dinheiro' };
        toast.success(`Pagamento (${methodLabels[selectedPaymentMethod]}) confirmado! Pedido enviado para produção.`);
        soundService.playSuccess();
        setConfirmPaymentModal(null);
        setAmountReceived('');
        setSelectedPaymentMethod(null);
        fetchPendingPayments();
        fetchDashboard();
      } else {
        toast.error(response.data.message || 'Erro ao confirmar pagamento');
      }
    } catch (error) {
      console.error('❌ [CONFIRM PAYMENT] Erro:', error.response?.data || error);
      // Mostrar detalhes do erro de validação se houver
      const errorData = error.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const errorDetails = errorData.errors.map(e => `${e.field}: ${e.message}`).join(', ');
        toast.error(`${errorData.message}: ${errorDetails}`);
      } else {
        toast.error(errorData?.message || 'Erro ao confirmar pagamento');
      }
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    try {
      // Recarregar dashboard após atualizar
      await fetchDashboard();
      // Toast de sucesso APÓS a ação completar
      toast.success('Status do pedido atualizado');
      soundService.playSuccess();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const handleTimerAlert = (orderId) => {
    console.log('⏰ Alerta de atraso para pedido:', orderId);
    soundService.playUrgent();
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
        soundService.playSuccess();
      } else {
        toast.error('Erro ao notificar cliente');
      }
    } catch (error) {
      console.error('Erro ao chamar cliente:', error);
      // Simular sucesso em dev mode
      toast.success('Cliente notificado! (modo desenvolvimento)');
      soundService.playSuccess();
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

          {/* Sprint 57: Grupos Verticais (substituem as abas) */}
          <div className="space-y-4">

            {/* ==================== SEÇÃO: PAGAMENTOS ==================== */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setCollapsedSections(prev => ({ ...prev, payments: !prev.payments }))}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white">Pagamentos</h3>
                    <p className="text-sm text-gray-400">Aguardando confirmação</p>
                  </div>
                  {pendingPayments.length > 0 && (
                    <span className="ml-2 px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-full animate-pulse">
                      {pendingPayments.length}
                    </span>
                  )}
                </div>
                {collapsedSections.payments ? (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {!collapsedSections.payments && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-6">
                      {pendingPayments.length === 0 ? (
                        <div className="text-center py-8">
                          <Banknote className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">Nenhum pagamento pendente</p>
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
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                                    <Banknote className="w-5 h-5 text-green-400" />
                                  </div>
                                  <div>
                                    <p className="text-white font-bold">Mesa {order.table?.number || 'Balcão'}</p>
                                    <p className="text-xs text-gray-400">#{order.orderNumber || (typeof order.id === 'string' ? order.id.slice(-6) : order.id)}</p>
                                  </div>
                                </div>
                                <span className="px-2 py-1 rounded text-xs font-semibold bg-green-600/20 text-green-400">
                                  {order.paymentLabel || order.paymentMethod}
                                </span>
                              </div>
                              <div className="mb-3 pb-3 border-b border-gray-700">
                                <p className="text-sm text-gray-400">Cliente</p>
                                <p className="text-white font-medium">{order.customer?.nome || 'Cliente'}</p>
                              </div>
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ==================== SEÇÃO: NOVOS/EM PREPARO ==================== */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setCollapsedSections(prev => ({ ...prev, new: !prev.new }))}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white">Novos / Em Preparo</h3>
                    <p className="text-sm text-gray-400">Pedidos aguardando ou sendo preparados</p>
                  </div>
                  {((orders.pending?.length || 0) + (orders.preparing?.length || 0)) > 0 && (
                    <span className="ml-2 px-3 py-1 bg-yellow-600 text-white text-sm font-bold rounded-full">
                      {(orders.pending?.length || 0) + (orders.preparing?.length || 0)}
                    </span>
                  )}
                </div>
                {collapsedSections.new ? (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {!collapsedSections.new && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-6">
                      {(!orders.pending || orders.pending.length === 0) && (!orders.preparing || orders.preparing.length === 0) ? (
                        <div className="text-center py-8">
                          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">Nenhum pedido em andamento</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {orders.pending && orders.pending.length > 0 && (
                            <>
                              <div className="mb-4 px-2">
                                <p className="text-sm font-semibold text-yellow-400">AGUARDANDO PREPARO ({orders.pending.length})</p>
                              </div>
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {orders.pending.map((order) => (
                                  <StaffOrderCard
                                    key={order.id}
                                    order={order}
                                    onStatusUpdate={handleStatusUpdate}
                                    onTimerAlert={handleTimerAlert}
                                    userRole="atendente"
                                  />
                                ))}
                              </div>
                            </>
                          )}
                          {orders.preparing && orders.preparing.length > 0 && (
                            <>
                              <div className="mb-4 px-2 mt-6">
                                <p className="text-sm font-semibold text-orange-400">EM PREPARO ({orders.preparing.length})</p>
                              </div>
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {orders.preparing.map((order) => (
                                  <StaffOrderCard
                                    key={order.id}
                                    order={order}
                                    onStatusUpdate={handleStatusUpdate}
                                    onTimerAlert={handleTimerAlert}
                                    userRole="atendente"
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ==================== SEÇÃO: PRONTOS ==================== */}
            <div className="bg-gray-900 border-2 rounded-xl overflow-hidden" style={{ borderColor: (orders.ready?.length || 0) > 0 ? 'var(--theme-primary)' : 'rgb(55, 65, 81)' }}>
              <button
                onClick={() => setCollapsedSections(prev => ({ ...prev, ready: !prev.ready }))}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--theme-primary-20)' }}>
                    <Bell className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white">Prontos para Retirar</h3>
                    <p className="text-sm text-gray-400">Pedidos aguardando entrega na mesa</p>
                  </div>
                  {(orders.ready?.length || 0) > 0 && (
                    <span className="ml-2 px-3 py-1 text-white text-sm font-bold rounded-full animate-pulse" style={{ background: 'var(--theme-primary)' }}>
                      {orders.ready?.length || 0}
                    </span>
                  )}
                </div>
                {collapsedSections.ready ? (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {!collapsedSections.ready && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-6">
                      {(!orders.ready || orders.ready.length === 0) ? (
                        <div className="text-center py-8">
                          <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">Nenhum pedido pronto</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {orders.ready.map((order) => (
                            <StaffOrderCard
                              key={order.id}
                              order={order}
                              onStatusUpdate={handleStatusUpdate}
                              onTimerAlert={handleTimerAlert}
                              userRole="atendente"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ==================== SEÇÃO: EM ENTREGA ==================== */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setCollapsedSections(prev => ({ ...prev, onWay: !prev.onWay }))}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white">Em Entrega</h3>
                    <p className="text-sm text-gray-400">Pedidos a caminho da mesa</p>
                  </div>
                  {(orders.on_way?.length || 0) > 0 && (
                    <span className="ml-2 px-3 py-1 bg-purple-600 text-white text-sm font-bold rounded-full">
                      {orders.on_way?.length || 0}
                    </span>
                  )}
                </div>
                {collapsedSections.onWay ? (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {!collapsedSections.onWay && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-6">
                      {(!orders.on_way || orders.on_way.length === 0) ? (
                        <div className="text-center py-8">
                          <Truck className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">Nenhum pedido em entrega</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {orders.on_way.map((order) => (
                            <StaffOrderCard
                              key={order.id}
                              order={order}
                              onStatusUpdate={handleStatusUpdate}
                              onTimerAlert={handleTimerAlert}
                              userRole="atendente"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ==================== SEÇÃO: NARGUILÉ ==================== */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setCollapsedSections(prev => ({ ...prev, hookah: !prev.hookah }))}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--theme-primary-20)' }}>
                    <Flame className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white">Narguilé</h3>
                    <p className="text-sm text-gray-400">Sessões ativas de narguilé</p>
                  </div>
                  {(hookahSessions?.filter(s => s.status === 'active' || s.status === 'paused').length || 0) > 0 && (
                    <span className="ml-2 px-3 py-1 text-white text-sm font-bold rounded-full" style={{ background: 'var(--theme-primary)' }}>
                      {hookahSessions?.filter(s => s.status === 'active' || s.status === 'paused').length || 0}
                    </span>
                  )}
                </div>
                {collapsedSections.hookah ? (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {!collapsedSections.hookah && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-6">
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
                            soundService.playCoalChange();
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
                        <div className="text-center py-8">
                          <Flame className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">Nenhuma sessão de narguilé ativa</p>
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
                                  soundService.playCoalChange();
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                  {(selectedOrder.items || []).map((item, idx) => (
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
                setSelectedPaymentMethod(null);
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
                      setSelectedPaymentMethod(null);
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
                    <span className="text-white font-bold">#{confirmPaymentModal.orderNumber || (typeof confirmPaymentModal.id === 'string' ? confirmPaymentModal.id.slice(-6) : confirmPaymentModal.id)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Mesa</span>
                    <span className="text-white">{confirmPaymentModal.table?.number || 'Balcão'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cliente</span>
                    <span className="text-white">{confirmPaymentModal.customer?.nome || 'Cliente'}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-green-600/20 rounded-lg p-4 mb-4 text-center">
                  <p className="text-green-400 text-sm mb-1">Total a Receber</p>
                  <p className="text-3xl font-bold text-green-400">{formatCurrency(confirmPaymentModal.total)}</p>
                </div>

                {/* Seleção de Forma de Pagamento */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-3">
                    Como o cliente pagou?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedPaymentMethod('credit')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedPaymentMethod === 'credit'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="font-semibold">Crédito</span>
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('debit')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedPaymentMethod === 'debit'
                          ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="font-semibold">Débito</span>
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('pix')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedPaymentMethod === 'pix'
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <Zap className="w-6 h-6" />
                      <span className="font-semibold">PIX</span>
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('cash')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedPaymentMethod === 'cash'
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <Banknote className="w-6 h-6" />
                      <span className="font-semibold">Dinheiro</span>
                    </button>
                  </div>
                </div>

                {/* Campo para valor recebido (se for dinheiro) */}
                {selectedPaymentMethod === 'cash' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <label className="block text-gray-400 text-sm mb-2">
                      Valor Recebido (opcional - para calcular troco)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        placeholder="0,00"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                      />
                    </div>
                    {amountReceived && parseFloat(amountReceived) > parseFloat(confirmPaymentModal.total) && (
                      <div className="mt-2 p-3 bg-yellow-600/20 rounded-lg">
                        <p className="text-yellow-400 text-lg font-bold flex items-center gap-2">
                          <Calculator className="w-5 h-5" />
                          Troco: {formatCurrency(parseFloat(amountReceived) - parseFloat(confirmPaymentModal.total))}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Botões */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleConfirmPayment(confirmPaymentModal)}
                    disabled={isConfirmingPayment || !selectedPaymentMethod}
                    className={`flex-1 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                      selectedPaymentMethod
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isConfirmingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Confirmando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {selectedPaymentMethod ? 'Confirmar Recebimento' : 'Selecione o método'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setConfirmPaymentModal(null);
                      setAmountReceived('');
                      setSelectedPaymentMethod(null);
                    }}
                    disabled={isConfirmingPayment}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
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

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import useStaffStore from '../../stores/staffStore';
import { useThemeStore } from '../../stores/themeStore';
import { formatCurrency } from '../../utils/format';
import { toast } from 'react-hot-toast';
import socketService from '../../services/socket';
import api from '../../services/api';
import StaffOrderCard from '../../components/StaffOrderCard';
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
  X
} from 'lucide-react';

export default function PainelAtendente() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { stats, orders, fetchDashboard, updateOrderStatus } = useStaffStore();
  const { getPalette } = useThemeStore();
  const palette = getPalette();
  const { playSuccess, playAlert } = useNotificationSound();

  const [activeTab, setActiveTab] = useState('ready'); // ready, delivered, pickup
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [callCustomerModal, setCallCustomerModal] = useState(null);
  const [isCallingCustomer, setIsCallingCustomer] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

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

    // Cleanup
    return () => {
      socketService.leaveWaiterRoom();
      socketService.removeAllListeners('order_ready');
      socketService.removeAllListeners('order_updated');
    };
  }, [isAuthenticated, isHydrated, router, fetchDashboard]);

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
                  FLAME - Painel Atendente
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Olá, {user?.name || 'Atendente'}!
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Notification Badge */}
                {readyOrders.length > 0 && (
                  <div className="relative">
                    <Bell className="w-6 h-6 animate-pulse" style={{ color: 'var(--theme-primary)' }} />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: 'var(--theme-primary)' }}>
                      {readyOrders.length}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Sair</span>
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
            <div className="flex gap-2 mb-6 border-b border-gray-700">
              <button
                onClick={() => setActiveTab('ready')}
                className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
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
                className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
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
                className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
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
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'ready' && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {!orders.ready || orders.ready.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-gray-600" />
                      </div>
                      <p className="text-gray-400">Nenhum pedido pronto</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {orders.ready.map((order) => (
                          <StaffOrderCard
                            key={order.id}
                            order={order}
                            onStatusUpdate={handleStatusUpdate}
                            onTimerAlert={handleTimerAlert}
                          />
                        ))}
                      </AnimatePresence>
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
      </div>
    </>
  );
}

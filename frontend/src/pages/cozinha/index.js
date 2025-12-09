import { useState, useEffect, useRef } from 'react';
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
import soundService from '../../services/soundService';
import {
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Package,
  User,
  MapPin,
  LogOut,
  TrendingUp,
  Timer,
  Flame,
  Filter,
  X,
  Bell
} from 'lucide-react';

export default function PainelCozinha() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { stats, orders, alerts, fetchDashboard, updateOrderStatus } = useStaffStore();
  const { getPalette } = useThemeStore();
  const palette = getPalette();

  const [isHydrated, setIsHydrated] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const listenersSetup = useRef(false); // Evitar duplicacao de listeners

  // Categorias disponiveis para filtro na cozinha
  const categories = [
    { id: 'all', name: 'Todos', icon: '🍽️' },
    { id: 'entradas', name: 'Entradas', icon: '🥗' },
    { id: 'pratos', name: 'Pratos', icon: '🍖' },
    { id: 'sobremesas', name: 'Sobremesas', icon: '🍰' },
    { id: 'petiscos', name: 'Petiscos', icon: '🍟' }
  ];

  // Filtrar pedidos por categoria
  const filterOrdersByCategory = (ordersList) => {
    if (!ordersList || categoryFilter === 'all') return ordersList;
    return ordersList.filter(order => {
      if (!order.items) return false;
      return order.items.some(item => {
        const productCategory = item.product?.category?.toLowerCase() || '';
        return productCategory.includes(categoryFilter);
      });
    });
  };

  // Wait for Zustand persist to hydrate
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    if (!isAuthenticated) {
      toast.error('Faça login como cozinheiro');
      router.push('/login?returnTo=/cozinha');
      return;
    }

    // Validar role - apenas cozinha e admin podem acessar
    const allowedRoles = ['cozinha', 'admin', 'gerente'];
    if (!allowedRoles.includes(user?.role)) {
      toast.error(`Acesso negado. Sua role é: ${user?.role}`);
      // Redirecionar para a página correta baseada na role
      if (user?.role === 'bar' || user?.role === 'barman') {
        router.push('/staff/bar');
      } else if (user?.role === 'atendente') {
        router.push('/atendente');
      } else {
        router.push('/');
      }
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

    // Polling como fallback - atualiza a cada 30 segundos caso Socket falhe
    const pollingInterval = setInterval(() => {
      console.log('🔄 [COZINHA] Polling: atualizando dados...');
      fetchDashboard();
    }, 30000);

    // Conectar ao Socket.IO (apenas uma vez)
    if (!listenersSetup.current) {
      listenersSetup.current = true;

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
      socketService.joinKitchenRoom();

      // Handler para novos pedidos (usando funcao nomeada para cleanup)
      const handleNewOrder = (order) => {
        console.log('🆕 [COZINHA] Novo pedido recebido:', order);
        toast.success(`Novo pedido #${order.orderNumber || order.id}`);
        soundService.playNewOrder();
        fetchDashboard();
      };

      // Handler para atualizacao de status
      const handleOrderUpdated = (updatedOrder) => {
        console.log('🔄 [COZINHA] Pedido atualizado:', updatedOrder);
        fetchDashboard();
      };

      // Handler para mudanças de status (quando atendente retira, etc)
      const handleStatusChanged = (data) => {
        console.log('🔄 [COZINHA] Status alterado:', data);
        fetchDashboard();

        // Notificar quando pedido foi retirado
        if (data.status === 'on_way') {
          toast.success(`✅ Pedido #${data.orderNumber || data.orderId} retirado pelo atendente`, {
            duration: 3000,
            icon: '🚶'
          });
        }
      };

      // Handler para pedido retirado
      const handleOrderPickedUp = (data) => {
        console.log('🚶 [COZINHA] Pedido retirado:', data);
        toast.success(`✅ Pedido #${data.orderId} retirado por ${data.attendant}`, {
          duration: 3000,
          icon: '🚶'
        });
        fetchDashboard();
      };

      socketService.on('order_created', handleNewOrder);
      socketService.on('order_updated', handleOrderUpdated);
      socketService.onOrderStatusChanged(handleStatusChanged);
      socketService.on('order_picked_up', handleOrderPickedUp);

      // Cleanup
      return () => {
        clearInterval(pollingInterval);
        socketService.leaveKitchenRoom();
        socketService.off('order_created', handleNewOrder);
        socketService.off('order_updated', handleOrderUpdated);
        socketService.removeAllListeners('order_status_changed');
        socketService.removeAllListeners('order_picked_up');
        listenersSetup.current = false;
      };
    }

    // Cleanup do polling (caso Socket não esteja configurado)
    return () => {
      clearInterval(pollingInterval);
    };
  }, [isAuthenticated, isHydrated, router, fetchDashboard]);

  const handleStatusUpdate = async (orderId) => {
    try {
      // Recarregar dashboard após atualizar
      await fetchDashboard();
      // Toast de sucesso APÓS a ação completar
      toast.success('Status do pedido atualizado');
      soundService.playStatusChange();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const handleTimerAlert = (orderId) => {
    console.log('⏰ Alerta de atraso para pedido:', orderId);
    soundService.playUrgent();
    toast(
      `⏰ Pedido #${orderId} está atrasado (>15 min)`,
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

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Painel Cozinha | FLAME</title>
        <meta name="description" content="Dashboard para cozinha" />
      </Head>

      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ChefHat className="w-7 h-7" style={{ color: 'var(--theme-primary)' }} />
                  FLAME - COZINHA
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Fila de Produção
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sprint 57: Notification Badge para novos pedidos */}
                {((orders.pending?.length || 0) + (orders.preparing?.length || 0)) > 0 && (
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center animate-pulse" style={{ background: 'var(--theme-primary-20)' }}>
                      <Bell className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: 'var(--theme-primary)' }}>
                      {(orders.pending?.length || 0) + (orders.preparing?.length || 0)}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Pedidos</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Concluídos Hoje</p>
              <p className="text-3xl font-bold text-white">{stats.completedToday}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Em Preparação</p>
              <p className="text-3xl font-bold text-white">{stats.preparing}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--theme-primary-20)' }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Atrasados (&gt;15min)</p>
              <p className="text-3xl font-bold text-white">{stats.delayed}</p>
            </div>
          </div>

          {/* Delayed Alert */}
          {alerts.delayed && alerts.delayed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-6 mb-6 flex items-center gap-4 border-2"
              style={{ background: 'var(--theme-primary-10)', borderColor: 'var(--theme-primary)' }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center animate-pulse" style={{ background: 'var(--theme-primary)' }}>
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--theme-primary)' }}>
                  ⚠️ ATENÇÃO: {alerts.delayed.length} pedido(s) atrasado(s)
                </h3>
                <p className="text-gray-300">
                  {alerts.delayed.map(o => `Mesa #${o.table?.number || '?'}`).join(', ')} aguardando há mais de 15 minutos
                </p>
              </div>
            </motion.div>
          )}

          {/* Queue */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Flame className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                Fila de Produção
              </h2>
              <span className="text-gray-400">
                {(filterOrdersByCategory(orders.pending)?.length || 0) + (filterOrdersByCategory(orders.preparing)?.length || 0)} {
                  ((filterOrdersByCategory(orders.pending)?.length || 0) + (filterOrdersByCategory(orders.preparing)?.length || 0)) === 1 ? 'pedido' : 'pedidos'
                }
              </span>
            </div>

            {/* Filtro por Categoria */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    categoryFilter === cat.id
                      ? 'text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                  style={categoryFilter === cat.id ? { background: 'var(--theme-primary)' } : {}}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
              {categoryFilter !== 'all' && (
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all"
                  title="Limpar filtro"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {(() => {
              const filteredPending = filterOrdersByCategory(orders.pending);
              const filteredPreparing = filterOrdersByCategory(orders.preparing);
              const hasOrders = (filteredPending?.length || 0) + (filteredPreparing?.length || 0) > 0;

              if (!hasOrders) {
                return (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-gray-600" />
                    </div>
                    <p className="text-gray-400">
                      {categoryFilter !== 'all'
                        ? `Nenhum pedido de "${categories.find(c => c.id === categoryFilter)?.name}" na fila`
                        : 'Nenhum pedido na fila'
                      }
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredPreparing && filteredPreparing.length > 0 && (
                      <>
                        <div className="mb-4 px-2">
                          <p className="text-sm font-semibold text-yellow-400">EM PREPARAÇÃO ({filteredPreparing.length})</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {filteredPreparing.map((order) => (
                            <StaffOrderCard
                              key={order.id}
                              order={order}
                              onStatusUpdate={handleStatusUpdate}
                              onTimerAlert={handleTimerAlert}
                              userRole="cozinha"
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {filteredPending && filteredPending.length > 0 && (
                      <>
                        <div className="mb-4 px-2">
                          <p className="text-sm font-semibold text-green-400">AGUARDANDO ({filteredPending.length})</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredPending.map((order) => (
                            <StaffOrderCard
                              key={order.id}
                              order={order}
                              onStatusUpdate={handleStatusUpdate}
                              onTimerAlert={handleTimerAlert}
                              userRole="cozinha"
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
}

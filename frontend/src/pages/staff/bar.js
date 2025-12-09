import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import useStaffStore from '../../stores/staffStore';
import useThemeStore from '../../stores/themeStore';
import { toast } from 'react-hot-toast';
import socketService from '../../services/socket';
import StaffOrderCard from '../../components/StaffOrderCard';
import soundService from '../../services/soundService';
import {
  Wine,
  Clock,
  CheckCircle,
  Package,
  LogOut,
  AlertTriangle,
  Flame,
  Filter,
  X,
  Bell
} from 'lucide-react';

// NOTA: Narguilé foi migrado para /atendente (Sprint 23)

export default function PainelBar() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const { stats, orders, alerts, fetchDashboard, updateOrderStatus } = useStaffStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const listenersSetup = useRef(false); // Evitar duplicacao de listeners

  // Categorias disponiveis para filtro no bar
  const categories = [
    { id: 'all', name: 'Todos', icon: '🍹' },
    { id: 'coqueteis', name: 'Coqueteis', icon: '🍸' },
    { id: 'cervejas', name: 'Cervejas', icon: '🍺' },
    { id: 'vinhos', name: 'Vinhos', icon: '🍷' },
    { id: 'destilados', name: 'Destilados', icon: '🥃' },
    { id: 'drinks', name: 'Drinks', icon: '🧉' },
    { id: 'sem-alcool', name: 'Sem Alcool', icon: '🥤' }
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
      toast.error('Faça login como bartender');
      router.push('/login?returnTo=/staff/bar');
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
      console.log('🔄 [BAR] Polling: atualizando dados...');
      fetchDashboard();
    }, 30000);

    // Conectar ao Socket.IO com token do store (apenas uma vez)
    if (token && !listenersSetup.current) {
      listenersSetup.current = true;

      socketService.connect(token);
      socketService.joinBarRoom();

      // Handler para novos pedidos (usando funcao nomeada para cleanup)
      const handleNewOrder = (order) => {
        console.log('🆕 [BAR] Novo pedido recebido:', order);
        toast.success(`Novo pedido #${order.orderNumber || order.id}`);
        soundService.playNewOrder();
        fetchDashboard();
      };

      // Handler para atualizacao de status
      const handleOrderUpdated = (updatedOrder) => {
        console.log('🔄 [BAR] Pedido atualizado:', updatedOrder);
        fetchDashboard();
      };

      // Handler para mudanças de status (quando atendente retira, etc)
      const handleStatusChanged = (data) => {
        console.log('🔄 [BAR] Status alterado:', data);
        fetchDashboard();

        if (data.status === 'on_way') {
          toast.success(`✅ Bebida #${data.orderNumber || data.orderId} retirada`, {
            duration: 3000,
            icon: '🚶'
          });
        }
      };

      // Handler para pedido retirado
      const handleOrderPickedUp = (data) => {
        console.log('🚶 [BAR] Pedido retirado:', data);
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
        socketService.leaveBarRoom();
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
  }, [isAuthenticated, isHydrated, token, router, fetchDashboard]);

  const handleStatusUpdate = async (orderId) => {
    try {
      // Recarregar dashboard após atualizar
      await fetchDashboard();
      // Toast de sucesso APÓS a ação completar
      toast.success('Status da bebida atualizado');
      soundService.playStatusChange();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleTimerAlert = (orderId) => {
    console.log('⏰ Alerta de atraso para pedido:', orderId);
    soundService.playUrgent();
    toast(
      `⏰ Bebida #${orderId} está atrasada (>15 min)`,
      {
        duration: 6000,
        style: {
          borderRadius: '10px',
          background: '#ff9500',
          color: '#fff',
        },
      }
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Aguardar hydration do Zustand antes de renderizar
  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Painel Bar | FLAME</title>
        <meta name="description" content="Dashboard para bartenders" />
      </Head>

      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Wine className="w-7 h-7" style={{ color: 'var(--theme-primary)' }} />
                  FLAME - BAR
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Fila de Bebidas
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sprint 57: Notification Badge para novas bebidas */}
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
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Wine className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Bebidas</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Concluídas Hoje</p>
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
              <p className="text-gray-400 text-sm mb-1">Atrasadas (&gt;15min)</p>
              <p className="text-3xl font-bold text-white">{stats.delayed}</p>
            </div>
          </div>


          {/* Delayed Alert */}
          {alerts.delayed && alerts.delayed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-6 mb-6 flex items-center gap-4"
              style={{
                background: 'var(--theme-primary-10)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'var(--theme-primary)'
              }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center animate-pulse" style={{ background: 'var(--theme-primary)' }}>
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--theme-primary)' }}>
                  ⚠️ ATENÇÃO: {alerts.delayed.length} bebida(s) atrasada(s)
                </h3>
                <p className="text-gray-300">
                  {alerts.delayed.map(o => `Mesa #${o.table?.number || '?'}`).join(', ')} aguardando há mais de 15 minutos
                </p>
              </div>
            </motion.div>
          )}


          {/* Fila de Bebidas */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Wine className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                Fila de Bebidas
              </h2>
              <span className="text-gray-400">
                {(filterOrdersByCategory(orders.pending)?.length || 0) + (filterOrdersByCategory(orders.preparing)?.length || 0)} {
                  ((filterOrdersByCategory(orders.pending)?.length || 0) + (filterOrdersByCategory(orders.preparing)?.length || 0)) === 1 ? 'bebida' : 'bebidas'
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
                        ? `Nenhuma bebida de "${categories.find(c => c.id === categoryFilter)?.name}" na fila`
                        : 'Nenhuma bebida na fila'
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
                          <p className="text-sm font-semibold text-yellow-400">EM PREPARO ({filteredPreparing.length})</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {filteredPreparing.map((order) => (
                            <StaffOrderCard
                              key={order.id}
                              order={order}
                              onStatusUpdate={handleStatusUpdate}
                              onTimerAlert={handleTimerAlert}
                              userRole="bar"
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
                              userRole="bar"
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

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { formatCurrency } from '../../utils/format';
import { toast } from 'react-hot-toast';
import socketService from '../../services/socket';
import api from '../../services/api';
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
  BarChart3
} from 'lucide-react';

export default function PainelAtendente() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({
    ordersToday: 0,
    totalRevenue: 0,
    avgDeliveryTime: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login como atendente');
      router.push('/login?returnTo=/atendente');
      return;
    }

    // Carregar pedidos do backend
    const loadOrders = async () => {
      try {
        const response = await api.get('/orders?status=preparing,ready,delivering');
        const ordersData = response.data.map(order => ({
          ...order,
          createdAt: new Date(order.createdAt),
          customer: order.customer?.name || 'Cliente'
        }));
        setActiveOrders(ordersData);

        // Carregar estatísticas do dia
        const statsResponse = await api.get('/orders/stats/today');
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        toast.error('Modo offline - usando dados de demonstração');

        // Mock orders data (fallback)
        const mockOrders = [
          {
            id: 1234,
            tableNumber: 12,
            customer: 'João Silva',
            status: 'ready',
            items: [
              { name: 'Gin Tônica Red', quantity: 1, price: 28.00 },
              { name: 'Moscow Mule', quantity: 2, price: 32.00 },
              { name: 'Tábua de Queijos', quantity: 1, price: 65.00 }
            ],
            total: 172.70,
            createdAt: new Date(Date.now() - 18 * 60000),
            paymentStatus: 'paid'
          },
          {
            id: 1235,
            tableNumber: 8,
            customer: 'Maria Santos',
            status: 'preparing',
            items: [
              { name: 'Caipirinha', quantity: 2, price: 24.00 },
            ],
            total: 48.00,
            createdAt: new Date(Date.now() - 8 * 60000),
            paymentStatus: 'paid'
          }
        ];
        setActiveOrders(mockOrders);

        setStats({
          ordersToday: 12,
          totalRevenue: 2140.00,
          avgDeliveryTime: 18
        });
      }
    };

    loadOrders();

    // Conectar ao Socket.IO
    const token = localStorage.getItem('token');
    socketService.connect(token);
    socketService.joinWaiterRoom();

    // Listener para novos pedidos criados
    socketService.onOrderCreated((order) => {
      console.log('🆕 Novo pedido criado:', order);
      setActiveOrders(prev => [...prev, {
        ...order,
        createdAt: new Date(order.createdAt),
        customer: order.customer?.name || 'Cliente'
      }]);
      toast.success(`Novo pedido #${order.id} - Mesa ${order.tableNumber}`);
    });

    // Listener para pedidos atualizados (status changed)
    socketService.onOrderUpdated((updatedOrder) => {
      console.log('🔄 Pedido atualizado:', updatedOrder);
      setActiveOrders(prev => prev.map(order =>
        order.id === updatedOrder.id
          ? { ...updatedOrder, createdAt: new Date(updatedOrder.createdAt), customer: updatedOrder.customer?.name || 'Cliente' }
          : order
      ));
    });

    // Listener para pedidos prontos (notificação especial)
    socketService.onOrderReady((order) => {
      console.log('✅ Pedido pronto para retirar:', order);
      setActiveOrders(prev => prev.map(o =>
        o.id === order.id
          ? { ...order, createdAt: new Date(order.createdAt), customer: order.customer?.name || 'Cliente' }
          : o
      ));
      toast.success(`⚠️ Pedido #${order.id} PRONTO para retirar!`, {
        duration: 10000,
        icon: '🔔'
      });
      playNotificationSound();
    });

    // Simulate real-time updates for elapsed time
    const interval = setInterval(() => {
      setActiveOrders(prev => prev.map(order => ({
        ...order,
        createdAt: order.createdAt
      })));
    }, 30000); // Update every 30 seconds

    // Cleanup
    return () => {
      clearInterval(interval);
      socketService.leaveWaiterRoom();
      socketService.removeAllListeners('order_created');
      socketService.removeAllListeners('order_updated');
      socketService.removeAllListeners('order_ready');
    };
  }, [isAuthenticated, router]);

  const getStatusInfo = (status) => {
    const statuses = {
      received: {
        label: 'Aguardando Preparo',
        color: 'bg-blue-600',
        textColor: 'text-blue-400',
        icon: Package
      },
      preparing: {
        label: 'Em Preparo',
        color: 'bg-yellow-600',
        textColor: 'text-yellow-400',
        icon: ChefHat
      },
      ready: {
        label: 'Pronto para Retirar',
        color: 'bg-orange-600 animate-pulse',
        textColor: 'text-orange-400',
        icon: Bell
      },
      delivering: {
        label: 'A Caminho da Mesa',
        color: 'bg-purple-600',
        textColor: 'text-purple-400',
        icon: Truck
      }
    };

    return statuses[status] || statuses.received;
  };

  const getElapsedTime = (createdAt) => {
    const now = new Date();
    const elapsed = Math.floor((now - createdAt) / 60000); // minutes
    return elapsed;
  };

  const handlePickup = async (orderId) => {
    try {
      // Atualizar status no backend
      await api.patch(`/orders/${orderId}/status`, { status: 'delivering' });

      // Emitir evento Socket.IO
      socketService.updateOrderStatus(orderId, 'delivering');

      // Atualizar estado local
      setActiveOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: 'delivering' } : order
      ));

      toast.success('Pedido marcado como "A caminho"');
      playNotificationSound();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar pedido');
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      // Atualizar status no backend
      await api.patch(`/orders/${orderId}/status`, { status: 'delivered' });

      // Emitir evento Socket.IO
      socketService.markOrderDelivered(orderId);

      // Remover da lista de pedidos ativos
      setActiveOrders(prev => prev.filter(order => order.id !== orderId));

      toast.success('Pedido entregue com sucesso!');
      setSelectedOrder(null);
    } catch (error) {
      console.error('Erro ao marcar como entregue:', error);
      toast.error('Erro ao finalizar pedido');
    }
  };

  const playNotificationSound = () => {
    // Mock notification sound
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const readyOrders = activeOrders.filter(o => o.status === 'ready');

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
                    <Bell className="w-6 h-6 text-orange-400 animate-pulse" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
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
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Pedidos Atendidos</p>
              <p className="text-3xl font-bold text-white">{stats.ordersToday}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Valor Total</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Tempo Médio Entrega</p>
              <p className="text-3xl font-bold text-white">{stats.avgDeliveryTime} min</p>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Bell className="w-6 h-6 text-orange-400" />
                Pedidos Ativos
              </h2>
              <span className="text-gray-400">
                {activeOrders.length} {activeOrders.length === 1 ? 'pedido' : 'pedidos'}
              </span>
            </div>

            {activeOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400">Nenhum pedido ativo no momento</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {activeOrders
                    .sort((a, b) => {
                      const statusPriority = { ready: 0, preparing: 1, received: 2, delivering: 3 };
                      return statusPriority[a.status] - statusPriority[b.status];
                    })
                    .map((order) => {
                      const statusInfo = getStatusInfo(order.status);
                      const StatusIcon = statusInfo.icon;
                      const elapsedTime = getElapsedTime(order.createdAt);

                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className={`bg-gray-800 border-2 rounded-xl p-6 ${
                            order.status === 'ready' ? 'border-orange-500' : 'border-gray-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-10 h-10 ${statusInfo.color} rounded-lg flex items-center justify-center`}>
                                  <StatusIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-white">
                                    Pedido #{order.id} • Mesa #{order.tableNumber}
                                  </h3>
                                  <p className={`text-sm font-semibold ${statusInfo.textColor}`}>
                                    {statusInfo.label}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {order.customer}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {elapsedTime} min
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {formatCurrency(order.total)}
                                </span>
                                <span className={`flex items-center gap-1 ${
                                  order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'
                                }`}>
                                  <CheckCircle className="w-4 h-4" />
                                  {order.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                                </span>
                              </div>

                              {/* Items Preview */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {order.items.map((item, idx) => (
                                  <span key={idx} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                                    {item.quantity}x {item.name}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Time Alert */}
                            {elapsedTime > 20 && (
                              <div className="flex items-center gap-2 text-orange-400 text-sm">
                                <AlertCircle className="w-5 h-5" />
                                <span>Atrasado</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Itens
                            </button>

                            {order.status === 'ready' && (
                              <button
                                onClick={() => handlePickup(order.id)}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
                              >
                                <Truck className="w-4 h-4" />
                                RETIREI
                              </button>
                            )}

                            {order.status === 'delivering' && (
                              <button
                                onClick={() => handleDeliver(order.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
                              >
                                <CheckCircle className="w-4 h-4" />
                                ENTREGUE
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            )}
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
                    <span className="text-2xl font-bold text-orange-400">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

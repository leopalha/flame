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
  Flame
} from 'lucide-react';

export default function PainelCozinha() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    avgTime: 0,
    delayed: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login como cozinheiro');
      router.push('/login?returnTo=/cozinha');
      return;
    }

    // Carregar pedidos do backend
    const loadOrders = async () => {
      try {
        const response = await api.get('/orders?status=pending,preparing');
        const ordersData = response.data.map(order => ({
          ...order,
          createdAt: new Date(order.createdAt),
          startedAt: order.startedAt ? new Date(order.startedAt) : null
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        // Fallback para dados mock se API falhar
        toast.error('Modo offline - usando dados de demonstração');
      }
    };

    loadOrders();

    // Conectar ao Socket.IO
    const token = localStorage.getItem('token');
    socketService.connect(token);
    socketService.joinKitchenRoom();

    // Listener para novos pedidos
    socketService.onOrderCreated((order) => {
      console.log('🆕 Novo pedido recebido:', order);
      setOrders(prev => [...prev, {
        ...order,
        createdAt: new Date(order.createdAt),
        startedAt: null
      }]);
      toast.success(`Novo pedido #${order.id} - Mesa ${order.tableNumber}`);
      playNotificationSound();
    });

    // Listener para atualização de status
    socketService.onOrderUpdated((updatedOrder) => {
      console.log('🔄 Pedido atualizado:', updatedOrder);
      setOrders(prev => prev.map(order =>
        order.id === updatedOrder.id
          ? { ...updatedOrder, createdAt: new Date(updatedOrder.createdAt), startedAt: updatedOrder.startedAt ? new Date(updatedOrder.startedAt) : null }
          : order
      ));
    });

    // Atualizar timers a cada segundo
    const interval = setInterval(() => {
      setOrders(prev => [...prev]);
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(interval);
      socketService.leaveKitchenRoom();
      socketService.removeAllListeners('order_created');
      socketService.removeAllListeners('order_updated');
    };
  }, [isAuthenticated, router]);

  const getElapsedTime = (createdAt) => {
    const now = new Date();
    const elapsed = Math.floor((now - createdAt) / 1000); // seconds
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return { mins, secs, total: elapsed };
  };

  const getPreparationTime = (startedAt) => {
    if (!startedAt) return null;
    const now = new Date();
    const elapsed = Math.floor((now - startedAt) / 1000); // seconds
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return { mins, secs };
  };

  const handleStartPreparing = async (orderId) => {
    try {
      // Atualizar no backend
      await api.patch(`/orders/${orderId}/status`, { status: 'preparing' });

      // Atualizar localmente
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'preparing', startedAt: new Date() }
          : order
      ));

      // Emitir evento via Socket.IO
      socketService.updateOrderStatus(orderId, 'preparing');

      toast.success(`Preparo do pedido #${orderId} iniciado!`);
      playNotificationSound();
    } catch (error) {
      console.error('Erro ao iniciar preparo:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const handleMarkReady = async (orderId) => {
    try {
      const order = orders.find(o => o.id === orderId);

      // Atualizar no backend
      await api.patch(`/orders/${orderId}/status`, { status: 'ready' });

      if (order) {
        const prepTime = getPreparationTime(order.startedAt);
        toast.success(
          `Pedido #${orderId} pronto! Tempo de preparo: ${prepTime?.mins || 0}:${String(prepTime?.secs || 0).padStart(2, '0')}`
        );
      }

      // Emitir evento via Socket.IO
      socketService.updateOrderStatus(orderId, 'ready');

      // Remove from list (goes to waiters)
      setOrders(prev => prev.filter(order => order.id !== orderId));
      playNotificationSound();
    } catch (error) {
      console.error('Erro ao marcar como pronto:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const playNotificationSound = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 600;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const waitingOrders = orders.filter(o => o.status === 'waiting');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const delayedOrders = orders.filter(o => {
    const elapsed = getElapsedTime(o.createdAt);
    return elapsed.total > 1200; // > 20 minutes
  });

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
                  <ChefHat className="w-7 h-7 text-orange-400" />
                  FLAME - COZINHA
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Fila de Produção
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Pedidos Concluídos</p>
              <p className="text-3xl font-bold text-white">{stats.completed}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Timer className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Tempo Médio</p>
              <p className="text-3xl font-bold text-white">{stats.avgTime} min</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Pedidos Atrasados</p>
              <p className="text-3xl font-bold text-white">{delayedOrders.length}</p>
            </div>
          </div>

          {/* Delayed Alert */}
          {delayedOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-900/20 border-2 border-orange-500 rounded-xl p-6 mb-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-orange-400 mb-1">
                  ⚠️ ATENÇÃO: {delayedOrders.length} pedido(s) atrasado(s)
                </h3>
                <p className="text-gray-300">
                  {delayedOrders.map(o => `Mesa #${o.tableNumber}`).join(', ')} aguardando há mais de 20 minutos
                </p>
              </div>
            </motion.div>
          )}

          {/* Queue */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-400" />
                Fila de Produção
              </h2>
              <span className="text-gray-400">
                {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400">Nenhum pedido na fila</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {orders
                    .sort((a, b) => {
                      // Delayed first, then preparing, then waiting
                      const aElapsed = getElapsedTime(a.createdAt).total;
                      const bElapsed = getElapsedTime(b.createdAt).total;
                      const aDelayed = aElapsed > 1200;
                      const bDelayed = bElapsed > 1200;

                      if (aDelayed && !bDelayed) return -1;
                      if (!aDelayed && bDelayed) return 1;

                      if (a.status === 'preparing' && b.status === 'waiting') return -1;
                      if (a.status === 'waiting' && b.status === 'preparing') return 1;

                      return aElapsed - bElapsed;
                    })
                    .map((order) => {
                      const elapsed = getElapsedTime(order.createdAt);
                      const prepTime = getPreparationTime(order.startedAt);
                      const isDelayed = elapsed.total > 1200;

                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`relative bg-gray-800 rounded-xl p-6 border-2 ${
                            isDelayed
                              ? 'border-orange-500'
                              : order.status === 'preparing'
                              ? 'border-yellow-600'
                              : 'border-green-600'
                          }`}
                        >
                          {/* Status Badge */}
                          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'preparing'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-green-600 text-white'
                          }`}>
                            {order.status === 'preparing' ? '🔥 EM PREPARO' : '🟢 AGUARDANDO'}
                          </div>

                          {/* Order Header */}
                          <div className="mb-4">
                            <h3 className="text-2xl font-bold text-white mb-2">
                              PEDIDO #{order.id}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-orange-400" />
                                Mesa #{order.tableNumber}
                              </span>
                            </div>
                          </div>

                          {/* Timer */}
                          <div className={`mb-4 p-3 rounded-lg ${
                            isDelayed ? 'bg-orange-900/30' : 'bg-gray-700'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {order.status === 'preparing' ? 'Preparando há' : 'Aguardando há'}
                              </span>
                              <span className={`text-2xl font-bold ${
                                isDelayed ? 'text-orange-400' : 'text-white'
                              }`}>
                                {elapsed.mins}:{String(elapsed.secs).padStart(2, '0')}
                              </span>
                            </div>

                            {order.status === 'preparing' && prepTime && (
                              <div className="mt-2 pt-2 border-t border-gray-600">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">Tempo de preparo</span>
                                  <span className="text-yellow-400 font-semibold">
                                    {prepTime.mins}:{String(prepTime.secs).padStart(2, '0')}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Items */}
                          <div className="mb-4">
                            <h4 className="text-white font-semibold mb-2 text-sm">ITENS:</h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="bg-gray-700 rounded p-2">
                                  <p className="text-white font-medium">
                                    {item.quantity}x {item.name}
                                  </p>
                                  {item.notes && (
                                    <p className="text-yellow-400 text-xs mt-1">
                                      ⚠️ OBS: {item.notes}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Customer */}
                          <div className="mb-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              Cliente: {order.customer}
                            </span>
                          </div>

                          {/* Action Button */}
                          {order.status === 'waiting' ? (
                            <button
                              onClick={() => handleStartPreparing(order.id)}
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <Play className="w-5 h-5" />
                              INICIAR PREPARO
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkReady(order.id)}
                              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-5 h-5" />
                              PRONTO
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

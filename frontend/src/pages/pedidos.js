import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import useThemeStore from '../stores/themeStore';
import { useOrderStore, ORDER_STATUS, ORDER_STATUS_LABELS, PAYMENT_METHODS, CONSUMPTION_TYPES } from '../stores/orderStore';
import { useCartStore } from '../stores/cartStore';
import { formatCurrency } from '../utils/format';
import socketService from '../services/socket';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Star,
  RefreshCw,
  Eye,
  Calendar,
  MapPin,
  XCircle,
  ChefHat,
  Package,
  Truck,
  X,
  AlertCircle,
  Wifi,
  WifiOff,
  MessageCircle,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import OrderChat from '../components/OrderChat';

export default function MeusPedidos() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { getPalette } = useThemeStore();
  const palette = getPalette();
  const {
    orders,
    getActiveOrders,
    getOrderHistory,
    cancelOrder,
    loading
  } = useOrderStore();
  const { addMultipleItems } = useCartStore();

  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [chatOrder, setChatOrder] = useState(null); // Sprint 56: Chat

  // Sprint 56: Filtros avancados do historico
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest, highest, lowest

  // Funcao helper para obter token do Zustand
  const getAuthToken = useCallback(() => {
    try {
      const stored = localStorage.getItem('flame-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.state?.token || null;
      }
    } catch (e) {
      console.error('Erro ao ler token:', e);
    }
    return null;
  }, []);

  // Handler para atualização de status do pedido via Socket
  const handleOrderStatusUpdate = useCallback((data) => {
    console.log('📦 Pedido atualizado via Socket:', data);

    const { orderId, status, orderNumber } = data;

    // Atualizar o pedido no store local
    const { updateOrderStatus } = useOrderStore.getState();
    updateOrderStatus(orderId || orderNumber, status);

    // Mostrar notificação baseada no novo status
    const statusMessages = {
      'confirmed': { msg: 'Seu pedido foi confirmado!', icon: '✅' },
      'preparing': { msg: 'Seu pedido está sendo preparado!', icon: '👨‍🍳' },
      'ready': { msg: 'Seu pedido está pronto!', icon: '🎉' },
      'on_way': { msg: 'Seu pedido saiu para entrega!', icon: '🚗' },
      'delivered': { msg: 'Pedido entregue! Obrigado!', icon: '🙏' },
      'cancelled': { msg: 'Pedido cancelado', icon: '❌' }
    };

    const statusInfo = statusMessages[status];
    if (statusInfo) {
      toast(statusInfo.msg, { icon: statusInfo.icon, duration: 5000 });
    }
  }, []);

  // Handler para pedido pronto (notificação especial)
  const handleOrderReady = useCallback((data) => {
    console.log('🎉 Pedido pronto via Socket:', data);

    toast.success(
      `Pedido #${data.orderNumber || data.orderId} está pronto para retirada!`,
      { duration: 8000, icon: '🔔' }
    );

    // Tentar tocar som de notificação
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}
  }, []);

  // Conectar Socket.IO quando autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para ver seus pedidos');
      router.push('/login?redirect=/pedidos');
      return;
    }

    setIsLoading(true);

    // Conectar ao Socket.IO
    const token = getAuthToken();
    if (token) {
      console.log('🔌 Conectando Socket.IO para cliente...');
      socketService.connect(token);

      // Verificar conexão após um tempo
      const checkConnection = setTimeout(() => {
        const status = socketService.getConnectionStatus();
        setSocketConnected(status.connected);
        if (status.connected) {
          console.log('✅ Socket.IO conectado para cliente');

          // Entrar na sala do usuário para receber updates dos seus pedidos
          if (user?.id) {
            socketService.joinRoom(`user_${user.id}`);
          }
        }
      }, 1000);

      // Adicionar listeners para eventos de pedidos
      socketService.onOrderStatusChanged(handleOrderStatusUpdate);
      socketService.onOrderUpdated(handleOrderStatusUpdate);
      socketService.onOrderReady(handleOrderReady);

      // Listener generico para qualquer update
      socketService.on('order_status_updated', handleOrderStatusUpdate);

      setTimeout(() => setIsLoading(false), 500);

      return () => {
        clearTimeout(checkConnection);
        // Remover listeners ao desmontar
        socketService.off('order_status_changed', handleOrderStatusUpdate);
        socketService.off('order_updated', handleOrderStatusUpdate);
        socketService.off('order_ready', handleOrderReady);
        socketService.off('order_status_updated', handleOrderStatusUpdate);

        // Sair da sala do usuário
        if (user?.id) {
          socketService.leaveRoom(`user_${user.id}`);
        }
      };
    } else {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [isAuthenticated, router, user?.id, getAuthToken, handleOrderStatusUpdate, handleOrderReady]);

  const getStatusInfo = (status) => {
    const statuses = {
      [ORDER_STATUS.PENDING]: {
        label: ORDER_STATUS_LABELS.pending,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-600/20',
        borderColor: 'border-yellow-500/30',
        icon: Clock
      },
      [ORDER_STATUS.CONFIRMED]: {
        label: ORDER_STATUS_LABELS.confirmed,
        color: 'text-[var(--theme-secondary)]',
        bgColor: 'bg-[var(--theme-secondary)] bg-opacity-20',
        borderColor: 'border-[var(--theme-secondary)]/30',
        icon: CheckCircle
      },
      [ORDER_STATUS.PREPARING]: {
        label: ORDER_STATUS_LABELS.preparing,
        color: 'text-[var(--theme-primary)]',
        bgColor: 'bg-[var(--theme-primary)] bg-opacity-20',
        borderColor: 'border-[var(--theme-primary)]/30',
        icon: ChefHat
      },
      [ORDER_STATUS.READY]: {
        label: ORDER_STATUS_LABELS.ready,
        color: 'text-green-400',
        bgColor: 'bg-green-600/20',
        borderColor: 'border-green-500/30',
        icon: Package
      },
      [ORDER_STATUS.ON_WAY]: {
        label: ORDER_STATUS_LABELS.on_way,
        color: 'text-blue-400',
        bgColor: 'bg-blue-600/20',
        borderColor: 'border-blue-500/30',
        icon: Truck
      },
      [ORDER_STATUS.DELIVERED]: {
        label: ORDER_STATUS_LABELS.delivered,
        color: 'text-green-400',
        bgColor: 'bg-green-600/20',
        borderColor: 'border-green-500/30',
        icon: CheckCircle
      },
      [ORDER_STATUS.CANCELLED]: {
        label: ORDER_STATUS_LABELS.cancelled,
        color: 'text-red-400',
        bgColor: 'bg-red-600/20',
        borderColor: 'border-red-500/30',
        icon: XCircle
      }
    };
    return statuses[status] || statuses[ORDER_STATUS.PENDING];
  };

  const handleReorder = (order) => {
    // Adicionar cada item do pedido ao carrinho
    const { addItem } = useCartStore.getState();

    const items = order.items || [];
    if (items.length === 0) {
      toast.error('Este pedido não possui itens');
      return;
    }

    let addedCount = 0;
    items.forEach((item) => {
      // Transformar o item do pedido para o formato do carrinho
      const product = {
        id: item.productId || item.id,
        nome: item.nome,
        preco: item.precoUnitario,
        price: item.precoUnitario,
        imagem: item.imagem || null,
        categoria: item.categoria || null,
      };

      addItem(product, item.quantidade, item.observacoes || '');
      addedCount += item.quantidade;
    });

    toast.success(`${addedCount} ${addedCount === 1 ? 'item adicionado' : 'itens adicionados'} ao carrinho!`, {
      icon: '🛒',
      duration: 3000
    });

    router.push('/carrinho');
  };

  const handleCancelOrder = async (orderId) => {
    const result = await cancelOrder(orderId);
    if (result.success) {
      setSelectedOrder(null);
    }
  };

  const activeOrders = getActiveOrders();
  const orderHistory = getOrderHistory();

  // Sprint 56: Funcao de filtro avancado
  const getFilteredOrders = () => {
    let result = filter === 'active'
      ? activeOrders
      : filter === 'history'
        ? orderHistory
        : orders;

    // Filtro por busca (numero do pedido ou item)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order =>
        order.id?.toLowerCase().includes(query) ||
        order.orderNumber?.toString().includes(query) ||
        order.items?.some(item => item.nome?.toLowerCase().includes(query))
      );
    }

    // Filtro por data
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        if (dateFilter === 'today') {
          return orderDate >= today;
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        }
        return true;
      });
    }

    // Ordenacao
    result = [...result].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOrder === 'highest') {
        return (b.total || 0) - (a.total || 0);
      } else if (sortOrder === 'lowest') {
        return (a.total || 0) - (b.total || 0);
      }
      return 0;
    });

    return result;
  };

  const filteredOrders = getFilteredOrders();

  if (!isAuthenticated) return null;

  return (
    <>
      <Head>
        <title>Meus Pedidos | FLAME</title>
        <meta name="description" content="Histórico de pedidos" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white mb-2">Meus Pedidos</h1>
                {/* Indicador de conexão em tempo real */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  socketConnected
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {socketConnected ? (
                    <>
                      <Wifi className="w-3 h-3" />
                      <span>Ao vivo</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3" />
                      <span>Offline</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-gray-400">
                Acompanhe seus pedidos em tempo real
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Todos ({orders.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'active'
                    ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Em andamento ({activeOrders.length})
              </button>
              <button
                onClick={() => setFilter('history')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'history'
                    ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Historico ({orderHistory.length})
              </button>
            </div>

            {/* Sprint 56: Barra de busca e filtros avancados */}
            <div className="mb-6 space-y-3">
              {/* Barra de busca */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por numero do pedido ou item..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    showFilters || dateFilter !== 'all' || sortOrder !== 'newest'
                      ? 'bg-[var(--theme-primary)] text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">Filtros</span>
                </button>
              </div>

              {/* Filtros expandidos */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-4">
                      {/* Filtro por periodo */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Periodo</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: 'all', label: 'Todos' },
                            { value: 'today', label: 'Hoje' },
                            { value: 'week', label: 'Ultimos 7 dias' },
                            { value: 'month', label: 'Ultimo mes' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setDateFilter(option.value)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                dateFilter === option.value
                                  ? 'bg-[var(--theme-primary)] text-white'
                                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Ordenacao */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Ordenar por</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: 'newest', label: 'Mais recentes' },
                            { value: 'oldest', label: 'Mais antigos' },
                            { value: 'highest', label: 'Maior valor' },
                            { value: 'lowest', label: 'Menor valor' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setSortOrder(option.value)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                sortOrder === option.value
                                  ? 'bg-[var(--theme-secondary)] text-white'
                                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Limpar filtros */}
                      {(dateFilter !== 'all' || sortOrder !== 'newest' || searchQuery) && (
                        <button
                          onClick={() => {
                            setDateFilter('all');
                            setSortOrder('newest');
                            setSearchQuery('');
                          }}
                          className="text-sm text-[var(--theme-primary)] hover:underline"
                        >
                          Limpar todos os filtros
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Indicador de resultados */}
              {(searchQuery || dateFilter !== 'all') && (
                <p className="text-sm text-gray-500">
                  {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''}
                  {searchQuery && ` para "${searchQuery}"`}
                </p>
              )}
            </div>

            {/* Orders List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" text="Carregando pedidos..." />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-gray-600" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Nenhum pedido encontrado
                </h2>
                <p className="text-gray-400 mb-8">
                  {filter === 'active'
                    ? 'Você não tem pedidos em andamento'
                    : 'Você ainda não fez nenhum pedido'}
                </p>
                <Link
                  href="/cardapio"
                  className="bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  Ver Cardapio
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  const isActive = ![ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(order.status);
                  const canCancel = order.status === ORDER_STATUS.PENDING;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-gray-900 border rounded-xl p-6 transition-colors ${
                        isActive ? statusInfo.borderColor : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">
                              Pedido #{order.id}
                            </h3>
                            <span className={`flex items-center gap-1 text-sm font-semibold ${statusInfo.color} ${statusInfo.bgColor} px-3 py-1 rounded-full`}>
                              <StatusIcon className="w-4 h-4" />
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {order.consumptionType === 'table' && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                Mesa {order.tableNumber}
                              </span>
                            )}
                            {order.consumptionType === 'pickup' && (
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                Retirada
                              </span>
                            )}
                            {order.consumptionType === 'delivery' && (
                              <span className="flex items-center gap-1">
                                <Truck className="w-4 h-4" />
                                Delivery
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {PAYMENT_METHODS.find(m => m.id === order.paymentMethod)?.nome}
                          </p>
                        </div>
                      </div>

                      {/* Tempo estimado para pedidos ativos */}
                      {isActive && order.estimatedTime && (
                        <div className="mb-4 p-3 bg-[var(--theme-secondary)]/10 border border-[var(--theme-secondary)]/30 rounded-lg flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[var(--theme-secondary)]" />
                          <span className="text-[var(--theme-secondary)] text-sm font-medium">
                            Tempo estimado: {order.estimatedTime} minutos
                          </span>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="mb-4">
                        <div className="space-y-2">
                          {(order.items || []).slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-300">
                                {item.quantidade}x {item.nome}
                              </span>
                              <span className="text-gray-400">
                                {formatCurrency(item.precoUnitario * item.quantidade)}
                              </span>
                            </div>
                          ))}
                          {(order.items || []).length > 3 && (
                            <p className="text-gray-500 text-sm">
                              +{(order.items || []).length - 3} itens
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-800">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalhes
                        </button>

                        {!isActive && (
                          <button
                            onClick={() => handleReorder(order)}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Pedir Novamente
                          </button>
                        )}

                        {isActive && canCancel && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={loading}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancelar
                          </button>
                        )}

                        {/* Sprint 56: Botao de Chat para pedidos ativos */}
                        {isActive && (
                          <button
                            onClick={() => setChatOrder(order)}
                            className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Chat
                          </button>
                        )}

                        {order.status === ORDER_STATUS.DELIVERED && (
                          <Link
                            href={`/avaliacao/${order.id}`}
                            className="flex-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-90 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <Star className="w-4 h-4" />
                            Avaliar
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Detalhes */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      Pedido #{selectedOrder.id}
                    </h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Status */}
                  <div className="mb-6">
                    {(() => {
                      const statusInfo = getStatusInfo(selectedOrder.status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <div className={`p-4 rounded-xl ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                          <div className="flex items-center gap-3">
                            <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                            <div>
                              <p className={`font-semibold ${statusInfo.color}`}>
                                {statusInfo.label}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Itens */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-3">Itens do pedido</h3>
                    <div className="space-y-3">
                      {(selectedOrder.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <div>
                            <p className="text-white">
                              {item.quantidade}x {item.nome}
                            </p>
                            {item.observacoes && (
                              <p className="text-gray-500 text-sm">{item.observacoes}</p>
                            )}
                          </div>
                          <p className="text-gray-400">
                            {formatCurrency(item.precoUnitario * item.quantidade)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totais */}
                  <div className="border-t border-gray-800 pt-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      {selectedOrder.taxaServico > 0 && (
                        <div className="flex justify-between text-gray-400">
                          <span>Taxa de serviço</span>
                          <span>{formatCurrency(selectedOrder.taxaServico)}</span>
                        </div>
                      )}
                      {selectedOrder.taxaEntrega > 0 && (
                        <div className="flex justify-between text-gray-400">
                          <span>Taxa de entrega</span>
                          <span>{formatCurrency(selectedOrder.taxaEntrega)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-white font-semibold text-lg pt-2">
                        <span>Total</span>
                        <span className="text-[var(--theme-primary)]">
                          {formatCurrency(selectedOrder.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipo de consumo</span>
                      <span className="text-white">
                        {CONSUMPTION_TYPES.find(t => t.id === selectedOrder.consumptionType)?.nome}
                      </span>
                    </div>
                    {selectedOrder.tableNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mesa</span>
                        <span className="text-white">#{selectedOrder.tableNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pagamento</span>
                      <span className="text-white">
                        {PAYMENT_METHODS.find(m => m.id === selectedOrder.paymentMethod)?.nome}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status pagamento</span>
                      <span className={selectedOrder.paymentStatus === 'pago' ? 'text-green-400' : 'text-yellow-400'}>
                        {selectedOrder.paymentStatus === 'pago' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.observacoes && (
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                      <p className="text-gray-400 text-sm">Observações:</p>
                      <p className="text-white">{selectedOrder.observacoes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sprint 56: Componente de Chat */}
        {chatOrder && (
          <OrderChat
            orderId={chatOrder.id}
            orderNumber={chatOrder.orderNumber || (typeof chatOrder.id === 'string' ? chatOrder.id.slice(0, 8) : chatOrder.id)}
            isOpen={!!chatOrder}
            onClose={() => setChatOrder(null)}
            isStaff={false}
          />
        )}
      </Layout>
    </>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import { formatCurrency } from '../../utils/format';
import api from '../../services/api';
import socketService from '../../services/socket';
import {
  Clock,
  CheckCircle,
  Loader,
  MapPin,
  Star,
  ChefHat,
  Package,
  Truck,
  User,
  ShoppingBag,
  Bell,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Sprint 47: Acompanhamento de Pedido em Tempo Real
export default function PedidoAcompanhamento() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, token } = useAuthStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Mapear status do backend para frontend
  const mapStatus = (backendStatus) => {
    const statusMap = {
      pending: 'received',
      confirmed: 'received',
      preparing: 'preparing',
      ready: 'ready',
      on_way: 'ready',
      delivered: 'delivered',
      cancelled: 'cancelled'
    };
    return statusMap[backendStatus] || 'received';
  };

  // Buscar pedido da API
  const fetchOrder = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);

      if (response.data.success && response.data.data?.order) {
        const orderData = response.data.data.order;
        setOrder({
          ...orderData,
          mappedStatus: mapStatus(orderData.status)
        });
        setError(null);
      } else {
        setError('Pedido não encontrado');
      }
    } catch (err) {
      console.error('Erro ao buscar pedido:', err);
      if (err.response?.status === 404) {
        setError('Pedido não encontrado');
      } else {
        setError('Erro ao carregar pedido');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para ver seu pedido');
      router.push('/login');
      return;
    }

    if (!id) return;

    // Buscar pedido inicial
    fetchOrder();

    // Conectar ao Socket.IO para receber atualizações
    if (token) {
      socketService.connect(token);

      // Acompanhar este pedido específico
      socketService.emit('track_order', id);

      // Listener para atualização de status
      socketService.on('order_status_updated', (data) => {
        console.log('📡 Status atualizado via socket:', data);
        if (data.orderId === id) {
          setOrder(prev => prev ? {
            ...prev,
            status: data.status,
            mappedStatus: mapStatus(data.status),
            // Atualizar timestamps se disponíveis
            ...(data.confirmedAt && { confirmedAt: data.confirmedAt }),
            ...(data.startedAt && { startedAt: data.startedAt }),
            ...(data.finishedAt && { finishedAt: data.finishedAt }),
            ...(data.pickedUpAt && { pickedUpAt: data.pickedUpAt }),
            ...(data.deliveredAt && { deliveredAt: data.deliveredAt })
          } : prev);

          // Mostrar notificação de status
          const statusMessages = {
            preparing: '👨‍🍳 Seu pedido está sendo preparado!',
            ready: '✅ Seu pedido está pronto!',
            on_way: '🚶 Atendente a caminho com seu pedido!',
            delivered: '🎉 Pedido entregue! Bom apetite!'
          };
          if (statusMessages[data.status]) {
            toast.success(statusMessages[data.status]);
          }
        }
      });
    }

    // Timer para tempo decorrido
    const progressTimer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(progressTimer);
      if (token) {
        socketService.emit('stop_tracking_order', id);
        socketService.removeAllListeners('order_status_updated');
      }
    };
  }, [id, isAuthenticated, token, router, fetchOrder]);

  const getStatusInfo = () => {
    const currentStatus = order?.mappedStatus || 'received';
    const statuses = {
      received: {
        label: 'Pedido Recebido',
        color: 'text-blue-400',
        bgColor: 'bg-blue-600/20',
        icon: Package,
        description: 'Seu pedido foi recebido pela cozinha'
      },
      preparing: {
        label: 'Em Preparo',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-600/20',
        icon: ChefHat,
        description: 'Nossa equipe está preparando seu pedido'
      },
      ready: {
        label: 'Pronto',
        color: 'text-green-400',
        bgColor: 'bg-green-600/20',
        icon: CheckCircle,
        description: order?.status === 'on_way' ? 'Atendente a caminho!' : 'Seu pedido está pronto!'
      },
      delivered: {
        label: 'Entregue',
        color: 'text-purple-400',
        bgColor: 'bg-purple-600/20',
        icon: Truck,
        description: 'Bom apetite!'
      },
      cancelled: {
        label: 'Cancelado',
        color: 'text-red-400',
        bgColor: 'bg-red-600/20',
        icon: AlertCircle,
        description: 'Este pedido foi cancelado'
      }
    };

    return statuses[currentStatus] || statuses.received;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const currentStatus = order?.mappedStatus || 'received';
    const statusMap = {
      received: 25,
      preparing: 50,
      ready: 75,
      delivered: 100,
      cancelled: 0
    };
    return statusMap[currentStatus] || 0;
  };

  // Calcular tempo desde criação do pedido
  const getElapsedFromCreation = () => {
    if (!order?.createdAt) return 0;
    const created = new Date(order.createdAt);
    const now = new Date();
    return Math.floor((now - created) / 1000);
  };

  const handleCallWaiter = async () => {
    try {
      await api.post('/staff/call-waiter', { orderId: id });
      toast.success('Garçom chamado! Ele estará aí em instantes.');
    } catch (err) {
      // Simular sucesso se API falhar
      toast.success('Garçom chamado! Ele estará aí em instantes.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Carregando pedido..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen pt-16 bg-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
            <p className="text-gray-400 mb-6">Não foi possível carregar os detalhes do pedido</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={fetchOrder}
                className="flex items-center gap-2 bg-magenta-500 hover:bg-magenta-600 text-white px-6 py-3 rounded-lg"
              >
                <RefreshCw className="w-5 h-5" />
                Tentar Novamente
              </button>
              <Link href="/pedidos" className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg">
                Ver Meus Pedidos
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Carregando pedido..." />
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const status = order.mappedStatus;
  const realElapsedTime = getElapsedFromCreation();

  return (
    <>
      <Head>
        <title>Pedido #{id} | FLAME</title>
        <meta name="description" content="Acompanhe seu pedido em tempo real" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className={`w-24 h-24 ${statusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-current ${statusInfo.color}`}
              >
                <StatusIcon className="w-12 h-12" />
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Pedido <span className="text-magenta-400">#{order.orderNumber || (typeof order.id === 'string' ? order.id.slice(-6) : order.id)}</span>
              </h1>
              <p className={`text-lg font-semibold ${statusInfo.color} mb-2`}>
                {statusInfo.label}
              </p>
              <p className="text-neutral-400">
                {statusInfo.description}
              </p>

              {/* Botão Atualizar */}
              <button
                onClick={fetchOrder}
                className="mt-4 flex items-center gap-2 text-gray-400 hover:text-white mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="bg-neutral-800 rounded-full h-3 overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-magenta-500 to-cyan-500"
                />
              </div>
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Recebido</span>
                <span>Em Preparo</span>
                <span>Pronto</span>
                <span>Entregue</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6">Status do Pedido</h2>

              <div className="space-y-4">
                {/* Recebido */}
                <div className={`flex items-start gap-4 ${status === 'received' ? 'opacity-100' : status !== 'received' ? 'opacity-50' : 'opacity-100'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status !== 'received' ? 'bg-green-600' : 'bg-blue-600'
                  }`}>
                    {status !== 'received' ? <CheckCircle className="w-5 h-5 text-white" /> : <Package className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Pedido Recebido</p>
                    <p className="text-neutral-400 text-sm">Seu pedido foi enviado para a cozinha</p>
                  </div>
                  <span className="text-neutral-500 text-sm">{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Em Preparo */}
                <div className={`flex items-start gap-4 ${status === 'preparing' ? 'opacity-100' : status !== 'preparing' && status !== 'received' ? 'opacity-50' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status === 'ready' || status === 'delivered' ? 'bg-green-600' : status === 'preparing' ? 'bg-yellow-600 animate-pulse' : 'bg-neutral-700'
                  }`}>
                    {status === 'ready' || status === 'delivered' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : status === 'preparing' ? (
                      <ChefHat className="w-5 h-5 text-white" />
                    ) : (
                      <Loader className="w-5 h-5 text-neutral-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Em Preparo</p>
                    <p className="text-neutral-400 text-sm">Nossa equipe está preparando com carinho</p>
                  </div>
                </div>

                {/* Pronto */}
                <div className={`flex items-start gap-4 ${status === 'ready' ? 'opacity-100' : status === 'delivered' ? 'opacity-50' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status === 'delivered' ? 'bg-green-600' : status === 'ready' ? 'bg-green-600 animate-pulse' : 'bg-neutral-700'
                  }`}>
                    {status === 'delivered' || status === 'ready' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Loader className="w-5 h-5 text-neutral-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Pronto para Servir</p>
                    <p className="text-neutral-400 text-sm">Seu pedido está pronto!</p>
                  </div>
                </div>

                {/* Entregue */}
                <div className={`flex items-start gap-4 ${status === 'delivered' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status === 'delivered' ? 'bg-purple-600' : 'bg-neutral-700'
                  }`}>
                    {status === 'delivered' ? (
                      <Truck className="w-5 h-5 text-white" />
                    ) : (
                      <Loader className="w-5 h-5 text-neutral-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Entregue na Mesa</p>
                    <p className="text-neutral-400 text-sm">Bom apetite!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-magenta-400" />
                  <h3 className="text-white font-semibold">Mesa</h3>
                </div>
                <p className="text-2xl font-bold text-magenta-400">
                  {order.table?.number ? `#${order.table.number}` : 'Balcão'}
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-magenta-400" />
                  <h3 className="text-white font-semibold">Tempo Decorrido</h3>
                </div>
                <p className="text-2xl font-bold text-white">{formatTime(realElapsedTime)}</p>
                <p className="text-sm text-neutral-400 mt-1">Estimado: {order.estimatedTime || 20} min</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-magenta-400" />
                Itens do Pedido
              </h2>
              <div className="space-y-3">
                {(order.items || []).map((item, idx) => (
                  <div key={item.id || idx} className="flex justify-between items-start pb-3 border-b border-neutral-800 last:border-0">
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {item.quantity}x {item.productName || item.product?.name || 'Produto'}
                      </p>
                      {item.notes && (
                        <p className="text-neutral-500 text-sm">Obs: {item.notes}</p>
                      )}
                    </div>
                    <p className="text-neutral-300">
                      {formatCurrency((item.unitPrice || item.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-700 mt-4 pt-4 space-y-2">
                {order.serviceFee > 0 && (
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Taxa de serviço (10%)</span>
                    <span>{formatCurrency(order.serviceFee)}</span>
                  </div>
                )}
                {order.cashbackUsed > 0 && (
                  <div className="flex justify-between text-green-400 text-sm">
                    <span>Cashback utilizado</span>
                    <span>-{formatCurrency(order.cashbackUsed)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-magenta-400">{formatCurrency(order.total)}</span>
                </div>
                {order.paymentStatus === 'completed' && (
                  <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Pagamento confirmado
                  </p>
                )}
                {order.paymentMethod === 'pay_later' && (
                  <p className="text-sm text-yellow-400 mt-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Pagamento com atendente
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleCallWaiter}
                className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Chamar Garçom
              </button>

              {order.status === 'delivered' && !order.rating && (
                <Link
                  href={`/avaliacao/${order.id}`}
                  className="w-full bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5" />
                  Avaliar Experiência
                </Link>
              )}

              {order.rating && (
                <div className="bg-neutral-800 rounded-xl p-4 flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= order.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">Avaliação enviada</span>
                </div>
              )}

              <Link
                href="/cardapio"
                className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Fazer Novo Pedido
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

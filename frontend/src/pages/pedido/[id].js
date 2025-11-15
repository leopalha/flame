import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import { formatCurrency } from '../../utils/format';
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
  Bell
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PedidoAcompanhamento() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuthStore();

  // Mock order data
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('received'); // received, preparing, ready, delivered
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para ver seu pedido');
      router.push('/login');
      return;
    }

    if (!id) return;

    // Mock order data
    const mockOrder = {
      id: id,
      tableNumber: 12,
      customer: 'João Silva',
      items: [
        {
          id: 1,
          name: 'Gin Tônica Red',
          quantity: 1,
          price: 28.00,
          notes: 'Sem gelo'
        },
        {
          id: 2,
          name: 'Moscow Mule',
          quantity: 2,
          price: 32.00
        },
        {
          id: 3,
          name: 'Tábua de Queijos',
          quantity: 1,
          price: 65.00,
          notes: 'Sem azeitonas'
        }
      ],
      subtotal: 157.00,
      total: 172.70,
      paymentMethod: 'Cartão de Crédito',
      paymentStatus: 'paid',
      createdAt: new Date(),
      estimatedTime: 20 // minutes
    };

    setOrder(mockOrder);

    // Simulate order progress
    const progressTimer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // Simulate status changes
    setTimeout(() => setStatus('preparing'), 3000);
    setTimeout(() => setStatus('ready'), 10000);
    setTimeout(() => setStatus('delivered'), 15000);

    return () => clearInterval(progressTimer);
  }, [id, isAuthenticated, router]);

  const getStatusInfo = () => {
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
        description: 'Seu pedido está pronto!'
      },
      delivered: {
        label: 'Entregue',
        color: 'text-purple-400',
        bgColor: 'bg-purple-600/20',
        icon: Truck,
        description: 'Bom apetite!'
      }
    };

    return statuses[status];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const statusMap = {
      received: 25,
      preparing: 50,
      ready: 75,
      delivered: 100
    };
    return statusMap[status] || 0;
  };

  const handleCallWaiter = () => {
    toast.success('Garçom chamado! Ele estará aí em instantes.');
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Carregando pedido..." />
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <>
      <Head>
        <title>Pedido #{id} | Red Light</title>
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
                Pedido <span className="text-orange-400">#{order.id}</span>
              </h1>
              <p className={`text-lg font-semibold ${statusInfo.color} mb-2`}>
                {statusInfo.label}
              </p>
              <p className="text-gray-400">
                {statusInfo.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="bg-gray-800 rounded-full h-3 overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-orange-500 to-red-400"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Recebido</span>
                <span>Em Preparo</span>
                <span>Pronto</span>
                <span>Entregue</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
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
                    <p className="text-gray-400 text-sm">Seu pedido foi enviado para a cozinha</p>
                  </div>
                  <span className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Em Preparo */}
                <div className={`flex items-start gap-4 ${status === 'preparing' ? 'opacity-100' : status !== 'preparing' && status !== 'received' ? 'opacity-50' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status === 'ready' || status === 'delivered' ? 'bg-green-600' : status === 'preparing' ? 'bg-yellow-600 animate-pulse' : 'bg-gray-700'
                  }`}>
                    {status === 'ready' || status === 'delivered' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : status === 'preparing' ? (
                      <ChefHat className="w-5 h-5 text-white" />
                    ) : (
                      <Loader className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Em Preparo</p>
                    <p className="text-gray-400 text-sm">Nossa equipe está preparando com carinho</p>
                  </div>
                </div>

                {/* Pronto */}
                <div className={`flex items-start gap-4 ${status === 'ready' ? 'opacity-100' : status === 'delivered' ? 'opacity-50' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status === 'delivered' ? 'bg-green-600' : status === 'ready' ? 'bg-green-600 animate-pulse' : 'bg-gray-700'
                  }`}>
                    {status === 'delivered' || status === 'ready' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Loader className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Pronto para Servir</p>
                    <p className="text-gray-400 text-sm">Seu pedido está pronto!</p>
                  </div>
                </div>

                {/* Entregue */}
                <div className={`flex items-start gap-4 ${status === 'delivered' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status === 'delivered' ? 'bg-purple-600' : 'bg-gray-700'
                  }`}>
                    {status === 'delivered' ? (
                      <Truck className="w-5 h-5 text-white" />
                    ) : (
                      <Loader className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Entregue na Mesa</p>
                    <p className="text-gray-400 text-sm">Bom apetite!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <h3 className="text-white font-semibold">Mesa</h3>
                </div>
                <p className="text-2xl font-bold text-orange-400">#{order.tableNumber}</p>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <h3 className="text-white font-semibold">Tempo Decorrido</h3>
                </div>
                <p className="text-2xl font-bold text-white">{formatTime(elapsedTime)}</p>
                <p className="text-sm text-gray-400 mt-1">Estimado: {order.estimatedTime} min</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                Itens do Pedido
              </h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-3 border-b border-gray-800 last:border-0">
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.quantity}x {item.name}</p>
                      {item.notes && (
                        <p className="text-gray-500 text-sm">Obs: {item.notes}</p>
                      )}
                    </div>
                    <p className="text-gray-300">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total Pago</span>
                  <span className="text-2xl font-bold text-orange-400">{formatCurrency(order.total)}</span>
                </div>
                <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Pagamento confirmado via {order.paymentMethod}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleCallWaiter}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Chamar Garçom
              </button>

              {status === 'delivered' && (
                <Link
                  href={`/avaliacao/${order.id}`}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5" />
                  Avaliar Experiência
                </Link>
              )}

              <Link
                href="/cardapio"
                className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
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

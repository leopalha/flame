import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../utils/format';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Star,
  RefreshCw,
  Eye,
  Calendar,
  MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MeusPedidos() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, delivered, pending

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para ver seus pedidos');
      router.push('/login?returnTo=/pedidos');
      return;
    }

    // Mock orders data
    const mockOrders = [
      {
        id: 1234,
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'delivered',
        tableNumber: 12,
        items: [
          { name: 'Gin Tônica Red', quantity: 1, price: 28.00 },
          { name: 'Moscow Mule', quantity: 2, price: 32.00 },
          { name: 'Tábua de Queijos', quantity: 1, price: 65.00 }
        ],
        total: 172.70,
        paymentMethod: 'Cartão de Crédito',
        rating: 9
      },
      {
        id: 1189,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        status: 'delivered',
        tableNumber: 8,
        items: [
          { name: 'Caipirinha', quantity: 2, price: 24.00 },
          { name: 'Bruschetta', quantity: 1, price: 38.00 }
        ],
        total: 86.00,
        paymentMethod: 'PIX',
        rating: null
      },
      {
        id: 1156,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: 'delivered',
        tableNumber: 15,
        items: [
          { name: 'Aperol Spritz', quantity: 1, price: 30.00 },
          { name: 'Carpaccio', quantity: 1, price: 55.00 }
        ],
        total: 85.00,
        paymentMethod: 'Dinheiro',
        rating: 10
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  const getStatusInfo = (status) => {
    const statuses = {
      pending: { label: 'Em andamento', color: 'text-yellow-400', bgColor: 'bg-yellow-600/20', icon: Clock },
      delivered: { label: 'Entregue', color: 'text-green-400', bgColor: 'bg-green-600/20', icon: CheckCircle }
    };
    return statuses[status] || statuses.delivered;
  };

  const handleReorder = (order) => {
    // Add all items to cart
    toast.success('Itens adicionados ao carrinho!');
    router.push('/carrinho');
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'delivered') return order.status === 'delivered';
    if (filter === 'pending') return order.status === 'pending';
    return true;
  });

  if (!isAuthenticated) {
    return null;
  }

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
              <h1 className="text-4xl font-bold text-white mb-2">Meus Pedidos</h1>
              <p className="text-neutral-400">
                Histórico completo de seus pedidos no FLAME
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                Todos ({orders.length})
              </button>
              <button
                onClick={() => setFilter('delivered')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'delivered'
                    ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                Entregues ({orders.filter(o => o.status === 'delivered').length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'pending'
                    ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                Em andamento ({orders.filter(o => o.status === 'pending').length})
              </button>
            </div>

            {/* Orders List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" text="Carregando pedidos..." />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-neutral-600" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Nenhum pedido encontrado
                </h2>
                <p className="text-neutral-400 mb-8">
                  Você ainda não fez nenhum pedido
                </p>
                <Link
                  href="/cardapio"
                  className="bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  Ver Cardápio
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors"
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

                          <div className="flex items-center gap-4 text-sm text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {order.date.toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Mesa {order.tableNumber}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-cyan-400">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-sm text-neutral-400">{order.paymentMethod}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-neutral-300">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="text-neutral-400">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-neutral-800">
                        <Link
                          href={`/pedido/${order.id}`}
                          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalhes
                        </Link>

                        <button
                          onClick={() => handleReorder(order)}
                          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Pedir Novamente
                        </button>

                        {order.status === 'delivered' && !order.rating && (
                          <Link
                            href={`/avaliacao/${order.id}`}
                            className="flex-1 bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <Star className="w-4 h-4" />
                            Avaliar
                          </Link>
                        )}

                        {order.rating && (
                          <div className="flex-1 bg-green-600/20 border border-green-600/50 text-green-400 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                            <Star className="w-4 h-4 fill-current" />
                            Nota {order.rating}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

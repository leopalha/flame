import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import useThemeStore from '../stores/themeStore';
import { useOrderStore, ORDER_STATUS, PAYMENT_METHODS, CONSUMPTION_TYPES } from '../stores/orderStore';
import { useCartStore } from '../stores/cartStore';
import { formatCurrency } from '../utils/format';
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
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para ver seus pedidos');
      router.push('/login?redirect=/pedidos');
      return;
    }

    // Simular carregamento
    setTimeout(() => setIsLoading(false), 500);
  }, [isAuthenticated, router]);

  const getStatusInfo = (status) => {
    const statuses = {
      [ORDER_STATUS.PENDING]: {
        label: 'Pendente',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-600/20',
        borderColor: 'border-yellow-500/30',
        icon: Clock
      },
      [ORDER_STATUS.CONFIRMED]: {
        label: 'Confirmado',
        color: 'text-[var(--theme-secondary)]',
        bgColor: 'bg-[var(--theme-secondary)] bg-opacity-20',
        borderColor: 'border-[var(--theme-secondary)]/30',
        icon: CheckCircle
      },
      [ORDER_STATUS.PREPARING]: {
        label: 'Preparando',
        color: 'text-[var(--theme-primary)]',
        bgColor: 'bg-[var(--theme-primary)] bg-opacity-20',
        borderColor: 'border-[var(--theme-primary)]/30',
        icon: ChefHat
      },
      [ORDER_STATUS.READY]: {
        label: 'Pronto',
        color: 'text-green-400',
        bgColor: 'bg-green-600/20',
        borderColor: 'border-green-500/30',
        icon: Package
      },
      [ORDER_STATUS.DELIVERED]: {
        label: 'Entregue',
        color: 'text-green-400',
        bgColor: 'bg-green-600/20',
        borderColor: 'border-green-500/30',
        icon: CheckCircle
      },
      [ORDER_STATUS.CANCELLED]: {
        label: 'Cancelado',
        color: 'text-red-400',
        bgColor: 'bg-red-600/20',
        borderColor: 'border-red-500/30',
        icon: XCircle
      }
    };
    return statuses[status] || statuses[ORDER_STATUS.PENDING];
  };

  const handleReorder = (order) => {
    // Simular adicionar itens ao carrinho
    toast.success('Itens adicionados ao carrinho!');
    router.push('/cardapio');
  };

  const handleCancelOrder = async (orderId) => {
    const result = await cancelOrder(orderId);
    if (result.success) {
      setSelectedOrder(null);
    }
  };

  const activeOrders = getActiveOrders();
  const orderHistory = getOrderHistory();

  const filteredOrders = filter === 'active'
    ? activeOrders
    : filter === 'history'
      ? orderHistory
      : orders;

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
              <h1 className="text-4xl font-bold text-white mb-2">Meus Pedidos</h1>
              <p className="text-neutral-400">
                Acompanhe seus pedidos em tempo real
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                Todos ({orders.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'active'
                    ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                Em andamento ({activeOrders.length})
              </button>
              <button
                onClick={() => setFilter('history')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'history'
                    ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                Histórico ({orderHistory.length})
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

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-neutral-900 border rounded-xl p-6 transition-colors ${
                        isActive ? statusInfo.borderColor : 'border-neutral-700 hover:border-neutral-600'
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

                          <div className="flex items-center gap-4 text-sm text-neutral-400">
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
                          <p className="text-sm text-neutral-400">
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
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-neutral-300">
                                {item.quantidade}x {item.nome}
                              </span>
                              <span className="text-neutral-400">
                                {formatCurrency(item.precoUnitario * item.quantidade)}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-neutral-500 text-sm">
                              +{order.items.length - 3} itens
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-neutral-800">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalhes
                        </button>

                        {!isActive && (
                          <button
                            onClick={() => handleReorder(order)}
                            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Pedir Novamente
                          </button>
                        )}

                        {isActive && order.status === ORDER_STATUS.PENDING && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={loading}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancelar
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
                className="bg-neutral-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      Pedido #{selectedOrder.id}
                    </h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
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
                              <p className="text-neutral-400 text-sm">
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
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <div>
                            <p className="text-white">
                              {item.quantidade}x {item.nome}
                            </p>
                            {item.observacoes && (
                              <p className="text-neutral-500 text-sm">{item.observacoes}</p>
                            )}
                          </div>
                          <p className="text-neutral-400">
                            {formatCurrency(item.precoUnitario * item.quantidade)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totais */}
                  <div className="border-t border-neutral-800 pt-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-neutral-400">
                        <span>Subtotal</span>
                        <span>{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      {selectedOrder.taxaServico > 0 && (
                        <div className="flex justify-between text-neutral-400">
                          <span>Taxa de serviço</span>
                          <span>{formatCurrency(selectedOrder.taxaServico)}</span>
                        </div>
                      )}
                      {selectedOrder.taxaEntrega > 0 && (
                        <div className="flex justify-between text-neutral-400">
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
                      <span className="text-neutral-400">Tipo de consumo</span>
                      <span className="text-white">
                        {CONSUMPTION_TYPES.find(t => t.id === selectedOrder.consumptionType)?.nome}
                      </span>
                    </div>
                    {selectedOrder.tableNumber && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Mesa</span>
                        <span className="text-white">#{selectedOrder.tableNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Pagamento</span>
                      <span className="text-white">
                        {PAYMENT_METHODS.find(m => m.id === selectedOrder.paymentMethod)?.nome}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Status pagamento</span>
                      <span className={selectedOrder.paymentStatus === 'pago' ? 'text-green-400' : 'text-yellow-400'}>
                        {selectedOrder.paymentStatus === 'pago' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.observacoes && (
                    <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
                      <p className="text-neutral-400 text-sm">Observações:</p>
                      <p className="text-white">{selectedOrder.observacoes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
}

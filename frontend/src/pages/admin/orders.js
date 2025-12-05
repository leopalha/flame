import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Download,
  RefreshCw,
  Eye,
  Clock,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  X,
  Receipt,
  ChefHat,
  Utensils,
  Truck
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner, { SkeletonCard } from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';
import { formatCurrency, formatRelativeTime } from '../../utils/format';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

const STATUS_CONFIG = {
  pending: { label: 'Pendente', color: 'bg-yellow-500', icon: AlertCircle },
  confirmed: { label: 'Confirmado', color: 'bg-blue-500', icon: CheckCircle },
  preparing: { label: 'Preparando', color: 'bg-orange-500', icon: ChefHat },
  ready: { label: 'Pronto', color: 'bg-green-500', icon: Utensils },
  on_way: { label: 'A caminho', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Entregue', color: 'bg-emerald-600', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-500', icon: XCircle }
};

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'on_way', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { getPalette } = useThemeStore();
  const palette = getPalette();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/admin/orders');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 20
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await api.get('/orders', { params });

      if (response.data.success) {
        const ordersData = response.data.data.orders || [];
        setOrders(ordersData);

        if (response.data.data.pagination) {
          setPagination(response.data.data.pagination);
        }
      } else {
        throw new Error(response.data.message || 'Erro ao carregar pedidos');
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      // Se for erro de autenticação ou permissão, não mostra toast (api.js já trata)
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error('Erro ao carregar pedidos. Tente novamente.');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, pagination.currentPage]);

  // Load orders on mount and when filter changes
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchOrders();
    }
  }, [fetchOrders, isAuthenticated, user]);

  // Filter orders by search term (client-side)
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const orderNumber = order.orderNumber || '';
    const customerName = order.customer?.nome || '';
    const tableNumber = order.table?.number?.toString() || '';

    return orderNumber.toLowerCase().includes(searchLower) ||
           customerName.toLowerCase().includes(searchLower) ||
           tableNumber.includes(searchLower);
  });

  // Update order status via API
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status: newStatus });

      if (response.data.success) {
        // Update local state
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success(`Pedido atualizado para: ${STATUS_CONFIG[newStatus].label}`);

        // Update selected order if viewing details
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pedido');
    } finally {
      setUpdating(null);
    }
  };

  const handleRefresh = () => {
    fetchOrders();
    toast.success('Atualizando pedidos...');
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'on_way',
      on_way: 'delivered'
    };
    return flow[currentStatus] || null;
  };

  // Export orders to CSV
  const handleExport = () => {
    if (orders.length === 0) {
      toast.error('Nenhum pedido para exportar');
      return;
    }

    const headers = ['Pedido', 'Mesa', 'Cliente', 'Total', 'Status', 'Data'];
    const csvData = orders.map(order => [
      order.orderNumber || `#${order.id}`,
      order.table?.number || '-',
      order.customer?.nome || '-',
      order.total || order.subtotal || '0.00',
      STATUS_CONFIG[order.status]?.label || order.status,
      new Date(order.createdAt).toLocaleString('pt-BR')
    ]);

    const csv = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Pedidos exportados!');
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Verificando permissoes..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gerenciar Pedidos | FLAME Admin</title>
        <meta name="description" content="Gerencie pedidos do FLAME" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-24 bg-black">
          {/* Header */}
          <div className="bg-neutral-900 border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push('/admin')}
                    className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Gerenciar Pedidos</h1>
                    <p className="text-neutral-400 text-sm">
                      {pagination.totalOrders || orders.length} pedidos encontrados
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                    disabled={loading}
                  >
                    <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleExport}
                    className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filters */}
            <div className="bg-neutral-900 rounded-xl p-4 mb-6 border border-neutral-800">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Buscar por numero, cliente ou mesa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        statusFilter === status
                          ? 'bg-[var(--theme-primary)] text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      {status === 'all' ? 'Todos' : STATUS_CONFIG[status]?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const count = orders.filter(o => o.status === key).length;
                return (
                  <div key={key} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${config.color}`} />
                      <div>
                        <div className="text-xl font-bold text-white">{count}</div>
                        <div className="text-xs text-neutral-400">{config.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-neutral-900 rounded-xl p-12 text-center border border-neutral-800">
                <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum pedido encontrado</h3>
                <p className="text-neutral-400">
                  {orders.length === 0
                    ? 'Ainda não há pedidos registrados.'
                    : 'Tente ajustar os filtros de busca.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusConfig.icon;
                  const nextStatus = getNextStatus(order.status);
                  const orderNumber = order.orderNumber || `#${order.id?.substring(0, 8)}`;
                  const orderTotal = parseFloat(order.total || order.subtotal || 0);
                  const orderItems = order.items || [];

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-colors"
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusConfig.color}/20`}>
                              <StatusIcon className={`w-6 h-6 ${statusConfig.color.replace('bg-', 'text-').replace('-500', '-400').replace('-600', '-400')}`} />
                            </div>

                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg font-bold text-white">{orderNumber}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} text-white`}>
                                  {statusConfig.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-neutral-400">
                                {order.table && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    Mesa {order.table.number || order.table.name}
                                  </span>
                                )}
                                {order.customer && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {order.customer.nome}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatRelativeTime(new Date(order.createdAt))}
                                </span>
                              </div>

                              {order.notes && (
                                <p className="text-sm text-yellow-400 mt-2">
                                  Obs: {order.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Order Value & Actions */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-neutral-400">
                                {orderItems.length} {orderItems.length === 1 ? 'item' : 'itens'}
                              </div>
                              <div className="text-xl font-bold text-[var(--theme-primary)]">
                                {formatCurrency(orderTotal)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                                title="Ver detalhes"
                              >
                                <Eye className="w-5 h-5" />
                              </button>

                              {nextStatus && order.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleStatusChange(order.id, nextStatus)}
                                  disabled={updating === order.id}
                                  className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90 text-sm disabled:opacity-50"
                                  style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))' }}
                                >
                                  {updating === order.id ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    STATUS_CONFIG[nextStatus].label
                                  )}
                                </button>
                              )}

                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleStatusChange(order.id, 'cancelled')}
                                  disabled={updating === order.id}
                                  className="p-2 bg-neutral-800 rounded-lg hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors disabled:opacity-50"
                                  title="Cancelar"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pagination.currentPage === page
                        ? 'bg-[var(--theme-primary)] text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
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
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-900 rounded-xl border border-neutral-800 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Receipt className="w-6 h-6 text-[var(--theme-primary)]" />
                      <h3 className="text-xl font-bold text-white">
                        Pedido {selectedOrder.orderNumber || `#${selectedOrder.id?.substring(0, 8)}`}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 text-neutral-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-4 mb-6">
                    {selectedOrder.table && (
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Mesa</span>
                        <span className="text-white font-medium">
                          Mesa {selectedOrder.table.number || selectedOrder.table.name}
                        </span>
                      </div>
                    )}
                    {selectedOrder.customer && (
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Cliente</span>
                        <span className="text-white font-medium">{selectedOrder.customer.nome}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[selectedOrder.status]?.color || 'bg-gray-500'} text-white`}>
                        {STATUS_CONFIG[selectedOrder.status]?.label || selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Horario</span>
                      <span className="text-white">
                        {formatRelativeTime(new Date(selectedOrder.createdAt))}
                      </span>
                    </div>
                    {selectedOrder.paymentMethod && (
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Pagamento</span>
                        <span className="text-white capitalize">{selectedOrder.paymentMethod}</span>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div className="border-t border-neutral-800 pt-4 mb-6">
                    <h4 className="text-white font-medium mb-4">Itens do Pedido</h4>
                    <div className="space-y-3">
                      {(selectedOrder.items || []).map((item, index) => (
                        <div key={item.id || index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center text-xs text-white">
                              {item.quantity}
                            </span>
                            <span className="text-white">{item.productName || item.name}</span>
                          </div>
                          <span className="text-neutral-400">
                            {formatCurrency(parseFloat(item.subtotal || item.unitPrice * item.quantity || 0))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observations */}
                  {selectedOrder.notes && (
                    <div className="border-t border-neutral-800 pt-4 mb-6">
                      <h4 className="text-white font-medium mb-2">Observações</h4>
                      <p className="text-yellow-400 text-sm">{selectedOrder.notes}</p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t border-neutral-800 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-white">Total</span>
                      <span className="text-2xl font-bold text-[var(--theme-primary)]">
                        {formatCurrency(parseFloat(selectedOrder.total || selectedOrder.subtotal || 0))}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                    <div className="mt-6 flex gap-3">
                      {getNextStatus(selectedOrder.status) && (
                        <button
                          onClick={() => {
                            handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status));
                          }}
                          disabled={updating === selectedOrder.id}
                          className="flex-1 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
                          style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))' }}
                        >
                          {updating === selectedOrder.id ? (
                            <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
                          ) : (
                            `Marcar como ${STATUS_CONFIG[getNextStatus(selectedOrder.status)].label}`
                          )}
                        </button>
                      )}
                      {selectedOrder.status === 'pending' && (
                        <button
                          onClick={() => {
                            handleStatusChange(selectedOrder.id, 'cancelled');
                          }}
                          disabled={updating === selectedOrder.id}
                          className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      )}
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

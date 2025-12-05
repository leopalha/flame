import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Users,
  Search,
  Filter,
  TrendingUp,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Eye,
  Gift,
  RefreshCw,
  Download,
  Award,
  UserX,
  Clock,
  Mail
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CustomerDetailsModal from '../../components/CustomerDetailsModal';
import useCRMStore from '../../stores/crmStore';
import { useAuthStore } from '../../stores/authStore';
import { formatCurrency } from '../../utils/format';
import { toast } from 'react-hot-toast';

const tierConfig = {
  bronze: { name: 'Bronze', icon: '🥉', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  silver: { name: 'Prata', icon: '🥈', color: 'text-gray-400', bg: 'bg-gray-400/10' },
  gold: { name: 'Ouro', icon: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  platinum: { name: 'Platina', icon: '💎', color: 'text-purple-400', bg: 'bg-purple-500/10' }
};

export default function AdminClientes() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    customers,
    dashboardStats,
    pagination,
    filters,
    loading,
    inactiveCustomers,
    setFilters,
    fetchCustomers,
    fetchDashboardStats,
    fetchCustomerDetails,
    fetchInactiveCustomers
  } = useCRMStore();

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'inactive'
  const [inactiveDays, setInactiveDays] = useState(30);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      toast.error('Acesso negado');
      router.push('/');
      return;
    }

    fetchDashboardStats();
    fetchCustomers();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      if (activeTab === 'all') {
        fetchCustomers();
      } else if (activeTab === 'inactive') {
        fetchInactiveCustomers(inactiveDays);
      }
    }
  }, [filters, isAuthenticated, user, activeTab, inactiveDays]);

  const handleSearch = (e) => {
    setFilters({ search: e.target.value, page: 1 });
  };

  const handleTierFilter = (tier) => {
    setFilters({ tier: tier === filters.tier ? null : tier, page: 1 });
  };

  const handleSort = (sortBy) => {
    const newOrder = filters.sortBy === sortBy && filters.sortOrder === 'DESC' ? 'ASC' : 'DESC';
    setFilters({ sortBy, sortOrder: newOrder, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ page: newPage });
  };

  const handleViewDetails = async (customerId) => {
    setSelectedCustomerId(customerId);
    setShowDetailsModal(true);
    try {
      await fetchCustomerDetails(customerId);
    } catch (error) {
      toast.error('Erro ao carregar detalhes do cliente');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <>
      <Head>
        <title>Gerenciar Clientes - FLAME Admin</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Gerenciar Clientes
            </h1>
            <p className="text-zinc-400">
              Dashboard CRM e fidelidade
            </p>
          </div>

          {/* Dashboard Stats */}
          {dashboardStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span className="text-zinc-400 text-sm">Total Clientes</span>
                </div>
                <p className="text-2xl font-bold">{dashboardStats.totalCustomers}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-400 text-sm">Ativos (30d)</span>
                </div>
                <p className="text-2xl font-bold">{dashboardStats.activeCustomers}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Wallet className="w-5 h-5 text-magenta-400" />
                  <span className="text-zinc-400 text-sm">Cashback Total</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(dashboardStats.cashback?.totalBalance || 0)}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-zinc-400 text-sm">Distribuído</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(dashboardStats.cashback?.totalDistributed || 0)}
                </p>
              </motion.div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-magenta-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <Users className="w-5 h-5" />
              Todos os Clientes
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'inactive'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <UserX className="w-5 h-5" />
              Clientes Inativos
              {inactiveCustomers.length > 0 && activeTab !== 'inactive' && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {inactiveCustomers.length}
                </span>
              )}
            </button>
          </div>

          {/* Filters - Only for All Customers tab */}
          {activeTab === 'all' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={handleSearch}
                      placeholder="Buscar por nome, email ou telefone..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-zinc-500 focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500 outline-none"
                    />
                  </div>
                </div>

                {/* Tier Filter */}
                <div className="flex gap-2">
                  {Object.entries(tierConfig).map(([key, tier]) => (
                    <button
                      key={key}
                      onClick={() => handleTierFilter(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.tier === key
                          ? `${tier.bg} ${tier.color} border-2 border-current`
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      <span className="mr-1">{tier.icon}</span>
                      {tier.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Inactive Customers Filters */}
          {activeTab === 'inactive' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-400" />
                  <span className="text-zinc-300">Clientes sem pedidos há mais de:</span>
                </div>
                <div className="flex gap-2">
                  {[30, 60, 90, 180].map((days) => (
                    <button
                      key={days}
                      onClick={() => setInactiveDays(days)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        inactiveDays === days
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {days} dias
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* All Customers Table */}
          {activeTab === 'all' && (
            <>
              {loading && customers.length === 0 ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-500"></div>
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800">
                  <Users className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400 text-lg">Nenhum cliente encontrado</p>
                </div>
              ) : (
                <>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-zinc-800 border-b border-zinc-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              Tier
                            </th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white"
                              onClick={() => handleSort('totalSpent')}
                            >
                              Total Gasto {filters.sortBy === 'totalSpent' && (filters.sortOrder === 'DESC' ? '↓' : '↑')}
                            </th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white"
                              onClick={() => handleSort('totalOrders')}
                            >
                              Pedidos {filters.sortBy === 'totalOrders' && (filters.sortOrder === 'DESC' ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              Cashback
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              Último Pedido
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {customers.map((customer) => {
                            const tier = tierConfig[customer.loyaltyTier] || tierConfig.bronze;
                            return (
                              <tr key={customer.id} className="hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4">
                                  <div>
                                    <p className="font-medium text-white">{customer.nome}</p>
                                    <p className="text-sm text-zinc-500">{customer.email}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${tier.bg} ${tier.color}`}>
                                    <span>{tier.icon}</span>
                                    {tier.name}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-white font-medium">
                                  {formatCurrency(parseFloat(customer.totalSpent) || 0)}
                                </td>
                                <td className="px-6 py-4 text-white">
                                  {customer.totalOrders || 0}
                                </td>
                                <td className="px-6 py-4 text-green-400 font-medium">
                                  {formatCurrency(parseFloat(customer.cashbackBalance) || 0)}
                                </td>
                                <td className="px-6 py-4 text-zinc-400 text-sm">
                                  {formatDate(customer.lastOrderDate)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleViewDetails(customer.id)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-magenta-600 hover:bg-magenta-700 text-white text-sm font-medium rounded-lg transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Detalhes
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-zinc-400">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Inactive Customers Table */}
          {activeTab === 'inactive' && (
            <>
              {loading && inactiveCustomers.length === 0 ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
              ) : inactiveCustomers.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800">
                  <UserX className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400 text-lg">Nenhum cliente inativo há mais de {inactiveDays} dias</p>
                  <p className="text-zinc-500 text-sm mt-2">Ótimo! Todos os clientes estão ativos.</p>
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-zinc-800 border-b border-zinc-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Tier
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Total Gasto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Dias Inativo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Último Pedido
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Cashback
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {inactiveCustomers.map((customer) => {
                          const tier = tierConfig[customer.loyaltyTier] || tierConfig.bronze;
                          const daysInactive = customer.daysInactive || Math.floor((new Date() - new Date(customer.lastOrderDate)) / (1000 * 60 * 60 * 24));
                          return (
                            <tr key={customer.id} className="hover:bg-zinc-800/50 transition-colors">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-medium text-white">{customer.nome}</p>
                                  <p className="text-sm text-zinc-500">{customer.email}</p>
                                  {customer.telefone && (
                                    <p className="text-xs text-zinc-600">{customer.telefone}</p>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${tier.bg} ${tier.color}`}>
                                  <span>{tier.icon}</span>
                                  {tier.name}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-white font-medium">
                                {formatCurrency(parseFloat(customer.totalSpent) || 0)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                  daysInactive > 90
                                    ? 'bg-red-500/20 text-red-400'
                                    : daysInactive > 60
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  {daysInactive} dias
                                </span>
                              </td>
                              <td className="px-6 py-4 text-zinc-400 text-sm">
                                {formatDate(customer.lastOrderDate)}
                              </td>
                              <td className="px-6 py-4 text-green-400 font-medium">
                                {formatCurrency(parseFloat(customer.cashbackBalance) || 0)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleViewDetails(customer.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded-lg transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Ver
                                  </button>
                                  {customer.email && (
                                    <a
                                      href={`mailto:${customer.email}?subject=Sentimos sua falta na FLAME!&body=Olá ${customer.nome},%0A%0ASentimos sua falta! Que tal voltar para aproveitar nosso cardápio e suas ofertas exclusivas?%0A%0AEquipe FLAME`}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                      <Mail className="w-4 h-4" />
                                      Email
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="bg-zinc-800/50 border-t border-zinc-700 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-zinc-400 text-sm">
                        <span className="font-medium text-white">{inactiveCustomers.length}</span> clientes inativos há mais de {inactiveDays} dias
                      </p>
                      <p className="text-zinc-400 text-sm">
                        Valor potencial: <span className="font-medium text-green-400">
                          {formatCurrency(inactiveCustomers.reduce((sum, c) => sum + (parseFloat(c.cashbackBalance) || 0), 0))}
                        </span> em cashback acumulado
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCustomerId(null);
        }}
        customerId={selectedCustomerId}
      />
    </>
  );
}

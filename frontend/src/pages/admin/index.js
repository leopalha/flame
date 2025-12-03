import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  Package,
  MapPin,
  AlertTriangle,
  Eye,
  Calendar,
  Activity,
  QrCode
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner, { SkeletonChart, SkeletonCard } from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import { useApi } from '../../hooks';
import { formatCurrency, formatNumber, formatRelativeTime } from '../../utils/format';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [dateRange, setDateRange] = useState('today');

  // Dashboard data (mockado)
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  
  const refetchDashboard = () => {
    setDashboardLoading(true);
    setTimeout(() => {
      setDashboardData({
        revenue: {
          today: 2450.80,
          yesterday: 1890.50,
          growth: 29.6
        },
        orders: {
          today: 32,
          yesterday: 28,
          growth: 14.3,
          averageTicket: 76.59
        },
        customers: {
          active: 156,
          new: 8,
          returning: 24
        },
        products: {
          lowStock: 3,
          outOfStock: 1,
          total: 45
        }
      });
      setDashboardLoading(false);
    }, 1000);
  };
  
  useEffect(() => {
    refetchDashboard();
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/admin');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // Refetch data with new date range
    refetchDashboard();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Verificando permissões..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Painel Administrativo | FLAME</title>
        <meta name="description" content="Painel de controle administrativo do FLAME" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
                  <p className="text-gray-400 mt-2">
                    Bem-vindo, {user?.nome}! Gerencie o FLAME
                  </p>
                </div>

                {/* Date Range Selector */}
                <div className="flex items-center gap-4">
                  <select
                    value={dateRange}
                    onChange={(e) => handleDateRangeChange(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="today">Hoje</option>
                    <option value="yesterday">Ontem</option>
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mês</option>
                    <option value="custom">Personalizado</option>
                  </select>
                  
                  <button
                    onClick={refetchDashboard}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Atualizar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {dashboardLoading ? (
              /* Loading State */
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  <SkeletonChart />
                  <SkeletonChart />
                </div>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Key Metrics */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Revenue */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-400" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        dashboardData?.revenue?.growth >= 0 ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        <TrendingUp className="w-4 h-4" />
                        {dashboardData?.revenue?.growth >= 0 ? '+' : ''}{dashboardData?.revenue?.growth}%
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(dashboardData?.revenue?.today || 0)}
                      </div>
                      <div className="text-sm text-gray-400">Receita hoje</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Ontem: {formatCurrency(dashboardData?.revenue?.yesterday || 0)}
                    </div>
                  </div>

                  {/* Orders */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        dashboardData?.orders?.growth >= 0 ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        <TrendingUp className="w-4 h-4" />
                        {dashboardData?.orders?.growth >= 0 ? '+' : ''}{dashboardData?.orders?.growth}%
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">
                        {formatNumber(dashboardData?.orders?.today || 0)}
                      </div>
                      <div className="text-sm text-gray-400">Pedidos hoje</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Ticket médio: {formatCurrency(dashboardData?.orders?.averageTicket || 0)}
                    </div>
                  </div>

                  {/* Customers */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Activity className="w-4 h-4" />
                        {dashboardData?.users?.activeRate}%
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">
                        {formatNumber(dashboardData?.users?.total || 0)}
                      </div>
                      <div className="text-sm text-gray-400">Total de usuários</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Ativos: {formatNumber(dashboardData?.users?.active || 0)}
                    </div>
                  </div>

                  {/* Tables */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-orange-400">
                        <Activity className="w-4 h-4" />
                        {dashboardData?.tables?.occupancyRate}%
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">
                        {formatNumber(dashboardData?.tables?.occupied || 0)}/{formatNumber(dashboardData?.tables?.total || 0)}
                      </div>
                      <div className="text-sm text-gray-400">Mesas ocupadas</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Disponíveis: {formatNumber(dashboardData?.tables?.available || 0)}
                    </div>
                  </div>
                </motion.div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Orders Chart */}
                  <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Pedidos por Status</h3>
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    {dashboardData?.orders?.statusBreakdown ? (
                      <div className="space-y-4">
                        {dashboardData.orders.statusBreakdown.map((item, index) => (
                          <div key={item.status} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full bg-${
                                item.status === 'confirmed' ? 'blue' :
                                item.status === 'preparing' ? 'yellow' :
                                item.status === 'ready' ? 'green' :
                                item.status === 'delivered' ? 'green' :
                                'gray'
                              }-500`} />
                              <span className="text-gray-300 capitalize">{item.status}</span>
                            </div>
                            <div className="text-white font-medium">{item.count}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum dado disponível
                      </div>
                    )}
                  </motion.div>

                  {/* Revenue Chart */}
                  <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Receita do Mês</h3>
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-3xl font-bold text-white mb-2">
                        {formatCurrency(dashboardData?.revenue?.thisMonth || 0)}
                      </div>
                      <div className="text-sm">
                        {dashboardData?.revenue?.monthlyGrowth >= 0 ? '+' : ''}{dashboardData?.revenue?.monthlyGrowth}% vs mês anterior
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-xl font-semibold text-white mb-6">Ações Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button
                      onClick={() => router.push('/admin/orders')}
                      className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-xl p-6 text-left transition-colors group"
                    >
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30">
                        <ShoppingBag className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="text-white font-semibold mb-2">Gerenciar Pedidos</div>
                      <div className="text-gray-400 text-sm">Ver e atualizar status dos pedidos</div>
                    </button>

                    <button
                      onClick={() => router.push('/admin/products')}
                      className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-xl p-6 text-left transition-colors group"
                    >
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30">
                        <Package className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="text-white font-semibold mb-2">Produtos</div>
                      <div className="text-gray-400 text-sm">Adicionar e editar produtos do cardápio</div>
                    </button>

                    <button
                      onClick={() => router.push('/admin/tables')}
                      className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-xl p-6 text-left transition-colors group"
                    >
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30">
                        <MapPin className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="text-white font-semibold mb-2">Mesas</div>
                      <div className="text-gray-400 text-sm">Controlar layout e status das mesas</div>
                    </button>

                    <button
                      onClick={() => router.push('/qr-codes')}
                      className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-xl p-6 text-left transition-colors group"
                    >
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30">
                        <QrCode className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="text-white font-semibold mb-2">QR Codes</div>
                      <div className="text-gray-400 text-sm">Imprimir QR Codes das mesas</div>
                    </button>

                    <button
                      onClick={() => router.push('/admin/reports')}
                      className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-xl p-6 text-left transition-colors group"
                    >
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30">
                        <BarChart3 className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="text-white font-semibold mb-2">Relatórios</div>
                      <div className="text-gray-400 text-sm">Análises detalhadas e exportações</div>
                    </button>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Atividade Recente</h3>
                    <button 
                      onClick={() => router.push('/admin/logs')}
                      className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver todos
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Mock recent activity - replace with real data */}
                    <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <div className="text-white font-medium">Novo pedido #1234</div>
                        <div className="text-gray-400 text-sm">Mesa 5 • {formatCurrency(45.80)}</div>
                      </div>
                      <div className="text-gray-500 text-sm">{formatRelativeTime(new Date(Date.now() - 5 * 60 * 1000))}</div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <div className="text-white font-medium">Produto atualizado</div>
                        <div className="text-gray-400 text-sm">Caipirinha Premium • Estoque: 15 unidades</div>
                      </div>
                      <div className="text-gray-500 text-sm">{formatRelativeTime(new Date(Date.now() - 10 * 60 * 1000))}</div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <div className="flex-1">
                        <div className="text-white font-medium">Mesa liberada</div>
                        <div className="text-gray-400 text-sm">Mesa 3 • Limpeza concluída</div>
                      </div>
                      <div className="text-gray-500 text-sm">{formatRelativeTime(new Date(Date.now() - 15 * 60 * 1000))}</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
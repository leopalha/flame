import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useReportStore from '../../stores/reportStore';
import { useAuthStore } from '../../stores/authStore';

export default function RelatoriosPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    dashboard,
    salesReport,
    productsReport,
    categoriesReport,
    hourlyReport,
    dreReport,
    loading,
    error,
    fetchDashboard,
    fetchSalesReport,
    fetchProductsReport,
    fetchCategoriesReport,
    fetchHourlyReport,
    fetchDREReport,
    clearError
  } = useReportStore();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardDays, setDashboardDays] = useState(30);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupBy, setGroupBy] = useState('day');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.tipo !== 'staff' && user?.tipo !== 'admin') {
      router.push('/');
      return;
    }

    // Set default dates (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);

    fetchDashboard(30);
  }, [isAuthenticated, user, router]);

  const handleFetchReport = async (reportType) => {
    try {
      switch (reportType) {
        case 'dashboard':
          await fetchDashboard(dashboardDays);
          break;
        case 'sales':
          await fetchSalesReport({ startDate, endDate, groupBy });
          break;
        case 'products':
          await fetchProductsReport({ startDate, endDate });
          break;
        case 'categories':
          await fetchCategoriesReport({ startDate, endDate });
          break;
        case 'hourly':
          await fetchHourlyReport({ startDate, endDate });
          break;
        case 'dre':
          await fetchDREReport({ startDate, endDate });
          break;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatPercent = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  // Tab navigation
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'sales', label: 'Vendas', icon: '💰' },
    { id: 'products', label: 'Produtos', icon: '📦' },
    { id: 'categories', label: 'Categorias', icon: '📁' },
    { id: 'hourly', label: 'Por Horário', icon: '🕐' },
    { id: 'dre', label: 'DRE', icon: '📈' }
  ];

  return (
    <>
      <Head>
        <title>Relatórios | FLAME</title>
      </Head>

      <div className="min-h-screen bg-black flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Relatórios</h1>
                <p className="text-gray-400">Análise de vendas e desempenho</p>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--theme-primary)]/20 border border-[var(--theme-primary)] text-[var(--theme-primary)] px-4 py-3 rounded-lg mb-6 flex items-center justify-between"
              >
                <span>{error}</span>
                <button onClick={clearError} className="text-[var(--theme-primary)] hover:text-[var(--theme-secondary)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )}

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    handleFetchReport(tab.id);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Date Filters */}
            {activeTab !== 'dashboard' && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Data Início</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Data Fim</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  {activeTab === 'sales' && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Agrupar por</label>
                      <select
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="hour">Hora</option>
                        <option value="day">Dia</option>
                        <option value="week">Semana</option>
                        <option value="month">Mês</option>
                      </select>
                    </div>
                  )}
                  <button
                    onClick={() => handleFetchReport(activeTab)}
                    disabled={loading}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Carregando...' : 'Atualizar'}
                  </button>
                </div>
              </div>
            )}

            {/* Dashboard Filters */}
            {activeTab === 'dashboard' && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-gray-400">Período:</span>
                  {[7, 15, 30, 60].map((days) => (
                    <button
                      key={days}
                      onClick={() => {
                        setDashboardDays(days);
                        fetchDashboard(days);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        dashboardDays === days
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {days} dias
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && !loading && dashboard && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-xl p-6">
                    <div className="text-orange-400 text-sm mb-1">Receita Total</div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(dashboard.sales?.totalRevenue)}</div>
                    <div className="text-gray-400 text-sm mt-1">{dashboard.sales?.totalOrders} pedidos</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
                    <div className="text-green-400 text-sm mb-1">Ticket Médio</div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(dashboard.sales?.averageTicket)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
                    <div className="text-blue-400 text-sm mb-1">Taxa de Serviço</div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(dashboard.sales?.totalServiceFee)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
                    <div className="text-purple-400 text-sm mb-1">Horário de Pico</div>
                    <div className="text-2xl font-bold text-white">{dashboard.peakHours?.hour || '-'}</div>
                    <div className="text-gray-400 text-sm mt-1">{dashboard.peakHours?.orders || 0} pedidos</div>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Top 5 Produtos</h3>
                  <div className="space-y-3">
                    {dashboard.topProducts?.map((product, index) => (
                      <div key={product.productId} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-orange-500 font-bold text-lg">#{index + 1}</span>
                          <div>
                            <div className="text-white font-medium">{product.productName}</div>
                            <div className="text-gray-400 text-sm">{product.categoryLabel}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{formatCurrency(product.revenue)}</div>
                          <div className="text-gray-400 text-sm">{product.quantitySold} vendidos</div>
                        </div>
                      </div>
                    ))}
                    {(!dashboard.topProducts || dashboard.topProducts.length === 0) && (
                      <div className="text-gray-500 text-center py-4">Nenhum produto vendido no período</div>
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Métodos de Pagamento</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dashboard.paymentMethods?.map((method) => (
                      <div key={method.method} className="bg-gray-800/50 rounded-lg p-4 text-center">
                        <div className="text-gray-400 text-sm mb-1">{method.methodLabel}</div>
                        <div className="text-white font-bold text-lg">{formatCurrency(method.total)}</div>
                        <div className="text-orange-400 text-sm">{formatPercent(method.percentage)}</div>
                      </div>
                    ))}
                    {(!dashboard.paymentMethods || dashboard.paymentMethods.length === 0) && (
                      <div className="col-span-4 text-gray-500 text-center py-4">Nenhum pagamento no período</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sales Tab */}
            {activeTab === 'sales' && !loading && salesReport && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Total de Pedidos</div>
                    <div className="text-2xl font-bold text-white">{formatNumber(salesReport.summary?.totalOrders)}</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Receita Total</div>
                    <div className="text-2xl font-bold text-orange-500">{formatCurrency(salesReport.summary?.totalRevenue)}</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Taxa de Serviço</div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(salesReport.summary?.totalServiceFee)}</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Ticket Médio</div>
                    <div className="text-2xl font-bold text-green-500">{formatCurrency(salesReport.summary?.averageTicket)}</div>
                  </div>
                </div>

                {/* Sales by Period */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Vendas por Período</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="pb-3">Período</th>
                          <th className="pb-3 text-right">Pedidos</th>
                          <th className="pb-3 text-right">Receita</th>
                          <th className="pb-3 text-right">Taxa Serviço</th>
                          <th className="pb-3 text-right">Ticket Médio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesReport.byPeriod?.map((period) => (
                          <tr key={period.period} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                            <td className="py-3 text-white">{period.period}</td>
                            <td className="py-3 text-right text-gray-300">{period.orders}</td>
                            <td className="py-3 text-right text-orange-400">{formatCurrency(period.revenue)}</td>
                            <td className="py-3 text-right text-gray-300">{formatCurrency(period.serviceFee)}</td>
                            <td className="py-3 text-right text-green-400">{formatCurrency(period.averageTicket)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!salesReport.byPeriod || salesReport.byPeriod.length === 0) && (
                      <div className="text-gray-500 text-center py-8">Nenhuma venda no período selecionado</div>
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Por Método de Pagamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {salesReport.byPaymentMethod?.map((method) => (
                      <div key={method.method} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">{method.methodLabel}</div>
                        <div className="text-white font-bold">{formatCurrency(method.total)}</div>
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-gray-400">{method.count} pedidos</span>
                          <span className="text-orange-400">{formatPercent(method.percentage)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && !loading && productsReport && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Produtos Vendidos</div>
                    <div className="text-2xl font-bold text-white">{formatNumber(productsReport.summary?.totalProducts)}</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Quantidade Total</div>
                    <div className="text-2xl font-bold text-white">{formatNumber(productsReport.summary?.totalQuantitySold)}</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Receita Total</div>
                    <div className="text-2xl font-bold text-orange-500">{formatCurrency(productsReport.summary?.totalRevenue)}</div>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Ranking de Produtos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="pb-3">#</th>
                          <th className="pb-3">Produto</th>
                          <th className="pb-3">Categoria</th>
                          <th className="pb-3 text-right">Qtd Vendida</th>
                          <th className="pb-3 text-right">Receita</th>
                          <th className="pb-3 text-right">% Receita</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsReport.topProducts?.map((product) => (
                          <tr key={product.productId} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                            <td className="py-3 text-orange-500 font-bold">{product.rank}</td>
                            <td className="py-3 text-white">{product.productName}</td>
                            <td className="py-3 text-gray-400">{product.categoryLabel}</td>
                            <td className="py-3 text-right text-gray-300">{product.quantitySold}</td>
                            <td className="py-3 text-right text-orange-400">{formatCurrency(product.revenue)}</td>
                            <td className="py-3 text-right text-gray-300">{formatPercent(product.revenuePercentage)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!productsReport.topProducts || productsReport.topProducts.length === 0) && (
                      <div className="text-gray-500 text-center py-8">Nenhum produto vendido no período</div>
                    )}
                  </div>
                </div>

                {/* Bottom Products */}
                {productsReport.bottomProducts && productsReport.bottomProducts.length > 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Produtos com Menor Saída</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-400 border-b border-gray-800">
                            <th className="pb-3">Produto</th>
                            <th className="pb-3">Categoria</th>
                            <th className="pb-3 text-right">Qtd Vendida</th>
                            <th className="pb-3 text-right">Receita</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productsReport.bottomProducts.map((product) => (
                            <tr key={product.productId} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                              <td className="py-3 text-white">{product.productName}</td>
                              <td className="py-3 text-gray-400">{product.categoryLabel}</td>
                              <td className="py-3 text-right text-[var(--theme-primary)]">{product.quantitySold}</td>
                              <td className="py-3 text-right text-gray-300">{formatCurrency(product.revenue)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && !loading && categoriesReport && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Categorias Ativas</div>
                    <div className="text-2xl font-bold text-white">{categoriesReport.summary?.totalCategories}</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Itens Vendidos</div>
                    <div className="text-2xl font-bold text-white">{formatNumber(categoriesReport.summary?.totalQuantitySold)}</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Receita Total</div>
                    <div className="text-2xl font-bold text-orange-500">{formatCurrency(categoriesReport.summary?.totalRevenue)}</div>
                  </div>
                </div>

                {/* Categories List */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Vendas por Categoria</h3>
                  <div className="space-y-4">
                    {categoriesReport.categories?.map((category, index) => (
                      <div key={category.category} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-orange-500 font-bold">#{index + 1}</span>
                            <span className="text-white font-medium">{category.categoryLabel}</span>
                          </div>
                          <div className="text-orange-400 font-bold">{formatCurrency(category.revenue)}</div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${category.revenuePercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{category.quantitySold} itens vendidos</span>
                          <span>{formatPercent(category.revenuePercentage)} da receita</span>
                        </div>
                      </div>
                    ))}
                    {(!categoriesReport.categories || categoriesReport.categories.length === 0) && (
                      <div className="text-gray-500 text-center py-8">Nenhuma venda no período selecionado</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Hourly Tab */}
            {activeTab === 'hourly' && !loading && hourlyReport && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Total de Pedidos</div>
                    <div className="text-2xl font-bold text-white">{formatNumber(hourlyReport.summary?.totalOrders)}</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Receita Total</div>
                    <div className="text-2xl font-bold text-orange-500">{formatCurrency(hourlyReport.summary?.totalRevenue)}</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Horário Pico (Pedidos)</div>
                    <div className="text-2xl font-bold text-white">{hourlyReport.summary?.peakHour || '-'}</div>
                    <div className="text-gray-400 text-sm">{hourlyReport.summary?.peakOrders} pedidos</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Horário Pico (Receita)</div>
                    <div className="text-2xl font-bold text-white">{hourlyReport.summary?.peakRevenueHour || '-'}</div>
                    <div className="text-gray-400 text-sm">{formatCurrency(hourlyReport.summary?.peakRevenue)}</div>
                  </div>
                </div>

                {/* Peak Analysis */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Análise por Período do Dia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {hourlyReport.peakAnalysis && Object.entries(hourlyReport.peakAnalysis).map(([key, data]) => (
                      <div key={key} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-2">{data.label}</div>
                        <div className="text-white font-bold text-lg">{formatCurrency(data.revenue)}</div>
                        <div className="text-gray-400 text-sm">{data.orders} pedidos</div>
                        <div className="text-orange-400 text-sm">Ticket: {formatCurrency(data.averageTicket)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hourly Chart (simplified table) */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Vendas por Hora</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="pb-3">Horário</th>
                          <th className="pb-3 text-right">Pedidos</th>
                          <th className="pb-3 text-right">Receita</th>
                          <th className="pb-3 text-right">Ticket Médio</th>
                          <th className="pb-3">Proporção</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hourlyReport.hourlyData?.filter(h => h.orders > 0).map((hour) => (
                          <tr key={hour.hour} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                            <td className="py-3 text-white font-medium">{hour.hourLabel}</td>
                            <td className="py-3 text-right text-gray-300">{hour.orders}</td>
                            <td className="py-3 text-right text-orange-400">{formatCurrency(hour.revenue)}</td>
                            <td className="py-3 text-right text-gray-300">{formatCurrency(hour.averageTicket)}</td>
                            <td className="py-3">
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-orange-500 h-2 rounded-full"
                                  style={{ width: `${hour.ordersPercentage}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!hourlyReport.hourlyData || hourlyReport.hourlyData.filter(h => h.orders > 0).length === 0) && (
                      <div className="text-gray-500 text-center py-8">Nenhuma venda no período selecionado</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DRE Tab */}
            {activeTab === 'dre' && !loading && dreReport && (
              <div className="space-y-6">
                {/* Receitas */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-green-500">+</span> Receitas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">Receita Bruta (Vendas)</span>
                      <span className="text-white">{formatCurrency(dreReport.receitas?.receitaBruta)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">Taxa de Serviço (10%)</span>
                      <span className="text-white">{formatCurrency(dreReport.receitas?.taxaServico)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">Impostos Retidos</span>
                      <span className="text-white">{formatCurrency(dreReport.receitas?.impostos)}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-green-500/10 rounded-lg px-3">
                      <span className="text-green-400 font-medium">Receita Líquida</span>
                      <span className="text-green-400 font-bold">{formatCurrency(dreReport.receitas?.receitaLiquida)}</span>
                    </div>
                    <div className="text-gray-500 text-sm text-right">{dreReport.receitas?.totalPedidos} pedidos no período</div>
                  </div>
                </div>

                {/* Custos */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-[var(--theme-primary)]">-</span> Custos
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">CMV (Custo das Mercadorias Vendidas)</span>
                      <span className="text-[var(--theme-primary)]">{formatCurrency(dreReport.custos?.cmvEstimado)}</span>
                    </div>
                    <div className="text-yellow-500/80 text-sm bg-yellow-500/10 rounded-lg px-3 py-2">
                      {dreReport.custos?.nota}
                    </div>
                  </div>
                </div>

                {/* Lucro Operacional */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-blue-500">=</span> Lucro Operacional
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">Lucro Bruto</span>
                      <span className="text-white">{formatCurrency(dreReport.lucroOperacional?.bruto)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">Despesas Operacionais ({dreReport.lucroOperacional?.percentualDespesas}%)</span>
                      <span className="text-[var(--theme-primary)]">-{formatCurrency(dreReport.lucroOperacional?.despesasOperacionais)}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-blue-500/10 rounded-lg px-3">
                      <span className="text-blue-400 font-medium">Lucro Operacional Líquido</span>
                      <span className={`font-bold ${dreReport.lucroOperacional?.liquido >= 0 ? 'text-green-400' : 'text-[var(--theme-primary)]'}`}>
                        {formatCurrency(dreReport.lucroOperacional?.liquido)}
                      </span>
                    </div>
                    <div className="text-yellow-500/80 text-sm bg-yellow-500/10 rounded-lg px-3 py-2">
                      {dreReport.lucroOperacional?.nota}
                    </div>
                  </div>
                </div>

                {/* Margens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Margem Bruta</div>
                    <div className={`text-3xl font-bold ${dreReport.margens?.bruta >= 50 ? 'text-green-500' : dreReport.margens?.bruta >= 30 ? 'text-yellow-500' : 'text-[var(--theme-primary)]'}`}>
                      {formatPercent(dreReport.margens?.bruta)}
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Margem Líquida</div>
                    <div className={`text-3xl font-bold ${dreReport.margens?.liquida >= 20 ? 'text-green-500' : dreReport.margens?.liquida >= 10 ? 'text-yellow-500' : 'text-[var(--theme-primary)]'}`}>
                      {formatPercent(dreReport.margens?.liquida)}
                    </div>
                  </div>
                </div>

                {/* Indicadores */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Indicadores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-gray-400 text-sm mb-1">Ticket Médio</div>
                      <div className="text-white font-bold text-xl">{formatCurrency(dreReport.indicadores?.ticketMedio)}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-gray-400 text-sm mb-1">Receita/Dia</div>
                      <div className="text-white font-bold text-xl">{formatCurrency(dreReport.indicadores?.receitaPorDia)}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-gray-400 text-sm mb-1">Pedidos/Dia</div>
                      <div className="text-white font-bold text-xl">{(dreReport.indicadores?.pedidosPorDia || 0).toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                {/* Fluxo de Caixa */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Fluxo de Caixa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Caixas Fechados</div>
                      <div className="text-white font-bold">{dreReport.fluxoCaixa?.totalCaixasFechados}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Vendas em Dinheiro</div>
                      <div className="text-green-400 font-bold">{formatCurrency(dreReport.fluxoCaixa?.vendasEmDinheiro)}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Suprimentos</div>
                      <div className="text-blue-400 font-bold">{formatCurrency(dreReport.fluxoCaixa?.suprimentos)}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Sangrias</div>
                      <div className="text-[var(--theme-primary)] font-bold">{formatCurrency(dreReport.fluxoCaixa?.sangrias)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State for reports not yet loaded */}
            {!loading && !dashboard && activeTab === 'dashboard' && (
              <div className="text-center py-20">
                <div className="text-gray-500 mb-4">Nenhum dado disponível</div>
                <button
                  onClick={() => fetchDashboard(dashboardDays)}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                >
                  Carregar Dashboard
                </button>
              </div>
            )}
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}

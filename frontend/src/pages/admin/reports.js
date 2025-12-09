import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  MapPin,
  Clock,
  Filter,
  BarChart3,
  PieChart,
  FileText,
  Printer,
  Mail,
  RefreshCw
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner, { SkeletonChart, SkeletonCard } from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import { useApi } from '../../hooks';
import { formatCurrency, formatNumber, formatDate, formatPercentage } from '../../utils/format';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // State
  const [dateRange, setDateRange] = useState('month'); // 'today', 'week', 'month', 'quarter', 'year', 'custom'
  const [reportType, setReportType] = useState('sales'); // 'sales', 'products', 'customers', 'tables'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [exporting, setExporting] = useState(false);

  // API calls
  const { data: reportsData, loading: reportsLoading, refetch: refetchReports } = useApi(
    `/admin/reports?type=${reportType}&period=${dateRange}&start=${customStartDate}&end=${customEndDate}`
  );

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/admin/reports');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (range !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const getReportTitle = () => {
    const types = {
      sales: 'Vendas',
      products: 'Produtos',
      customers: 'Clientes',
      tables: 'Mesas',
      financial: 'Financeiro'
    };
    return `Relatório de ${types[reportType] || 'Dados'}`;
  };

  const generateMockData = () => {
    // Mock data for development/demo
    const salesData = [
      { date: '2024-12-01', orders: 45, revenue: 3250.00, averageTicket: 72.22 },
      { date: '2024-12-02', orders: 52, revenue: 4180.50, averageTicket: 80.39 },
      { date: '2024-12-03', orders: 38, revenue: 2890.00, averageTicket: 76.05 },
      { date: '2024-12-04', orders: 61, revenue: 5120.00, averageTicket: 83.93 }
    ];
    const productsData = [
      { name: 'Caipirinha Premium', category: 'Drinks', quantity: 156, revenue: 4680.00 },
      { name: 'Mojito Classico', category: 'Drinks', quantity: 128, revenue: 3840.00 },
      { name: 'Burger Angus', category: 'Pratos', quantity: 89, revenue: 4005.00 },
      { name: 'Narguilé Premium', category: 'Narguilé', quantity: 45, revenue: 3600.00 }
    ];
    const customersData = [
      { name: 'João Silva', orders: 12, totalSpent: 890.50, lastVisit: '2024-12-04' },
      { name: 'Maria Santos', orders: 8, totalSpent: 645.00, lastVisit: '2024-12-03' },
      { name: 'Pedro Oliveira', orders: 15, totalSpent: 1250.00, lastVisit: '2024-12-04' }
    ];
    const tablesData = [
      { number: 1, occupations: 45, revenue: 3200.00, occupancyRate: 78 },
      { number: 2, occupations: 52, revenue: 4100.00, occupancyRate: 85 },
      { number: 3, occupations: 38, revenue: 2800.00, occupancyRate: 62 }
    ];

    return {
      sales: salesData,
      products: productsData,
      customers: customersData,
      tables: tablesData
    };
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const XLSX = (await import('xlsx')).default;

      const data = reportsData?.details || generateMockData()[reportType] || [];

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      // Add header styling info
      XLSX.utils.book_append_sheet(wb, ws, getReportTitle());

      // Generate file
      const fileName = `FLAME_${reportType}_${dateRange}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success(`Relatório Excel exportado: ${fileName}`);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Erro ao exportar Excel');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(255, 149, 0); // Orange color
      doc.text('FLAME', 105, 20, { align: 'center' });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(getReportTitle(), 105, 30, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Período: ${dateRange} | Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 105, 38, { align: 'center' });

      // Data table
      const data = reportsData?.details || generateMockData()[reportType] || [];

      let columns = [];
      let rows = [];

      if (reportType === 'sales') {
        columns = ['Data', 'Pedidos', 'Receita', 'Ticket Médio'];
        rows = data.map(item => [
          formatDate(item.date),
          item.orders,
          formatCurrency(item.revenue),
          formatCurrency(item.averageTicket)
        ]);
      } else if (reportType === 'products') {
        columns = ['Produto', 'Categoria', 'Quantidade', 'Receita'];
        rows = data.map(item => [
          item.name,
          item.category,
          item.quantity,
          formatCurrency(item.revenue)
        ]);
      } else if (reportType === 'customers') {
        columns = ['Cliente', 'Pedidos', 'Total Gasto', 'Última Visita'];
        rows = data.map(item => [
          item.name,
          item.orders,
          formatCurrency(item.totalSpent),
          formatDate(item.lastVisit)
        ]);
      } else if (reportType === 'tables') {
        columns = ['Mesa', 'Ocupações', 'Receita', 'Taxa Ocupação'];
        rows = data.map(item => [
          `Mesa ${item.number}`,
          item.occupations,
          formatCurrency(item.revenue),
          `${item.occupancyRate}%`
        ]);
      }

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 50,
        theme: 'grid',
        headStyles: {
          fillColor: [255, 149, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`FLAME Lounge Bar - Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
      }

      const fileName = `FLAME_${reportType}_${dateRange}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast.success(`Relatório PDF exportado: ${fileName}`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Erro ao exportar PDF');
    } finally {
      setExporting(false);
    }
  };

  const exportReport = async (format) => {
    if (format === 'xlsx') {
      await exportToExcel();
    } else if (format === 'pdf') {
      await exportToPDF();
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
        <title>Relatórios | Red Light Admin</title>
        <meta name="description" content="Relatórios e análises do Red Light" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push('/admin')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Relatórios</h1>
                    <p className="text-gray-400 mt-1">
                      Análises e dados do Red Light
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => refetchReports()}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Atualizar
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportReport('pdf')}
                      disabled={exporting}
                      className="text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                      style={{ background: 'var(--theme-primary)' }}
                    >
                      {exporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      PDF
                    </button>
                    <button
                      onClick={() => exportReport('xlsx')}
                      disabled={exporting}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {exporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filters */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Report Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tipo de Relatório
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:outline-none"
                  >
                    <option value="sales">Vendas</option>
                    <option value="products">Produtos</option>
                    <option value="customers">Clientes</option>
                    <option value="tables">Mesas</option>
                    <option value="financial">Financeiro</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Período
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => handleDateRangeChange(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:outline-none"
                  >
                    <option value="today">Hoje</option>
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mês</option>
                    <option value="quarter">Este Trimestre</option>
                    <option value="year">Este Ano</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                {/* Custom Date Range */}
                {dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        De
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Até
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {reportsLoading ? (
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Revenue */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-400" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        (reportsData?.summary?.revenue?.growth || 0) >= 0 ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {(reportsData?.summary?.revenue?.growth || 0) >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {reportsData?.summary?.revenue?.growth >= 0 ? '+' : ''}{reportsData?.summary?.revenue?.growth || 0}%
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(reportsData?.summary?.revenue?.current || 0)}
                      </div>
                      <div className="text-sm text-gray-400">Receita Total</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Período anterior: {formatCurrency(reportsData?.summary?.revenue?.previous || 0)}
                    </div>
                  </motion.div>

                  {/* Total Orders */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        (reportsData?.summary?.orders?.growth || 0) >= 0 ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {(reportsData?.summary?.orders?.growth || 0) >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {reportsData?.summary?.orders?.growth >= 0 ? '+' : ''}{reportsData?.summary?.orders?.growth || 0}%
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">
                        {formatNumber(reportsData?.summary?.orders?.current || 0)}
                      </div>
                      <div className="text-sm text-gray-400">Total de Pedidos</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Ticket médio: {formatCurrency(reportsData?.summary?.orders?.averageTicket || 0)}
                    </div>
                  </motion.div>

                  {/* Active Customers */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        (reportsData?.summary?.customers?.growth || 0) >= 0 ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {(reportsData?.summary?.customers?.growth || 0) >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {reportsData?.summary?.customers?.growth >= 0 ? '+' : ''}{reportsData?.summary?.customers?.growth || 0}%
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">
                        {formatNumber(reportsData?.summary?.customers?.active || 0)}
                      </div>
                      <div className="text-sm text-gray-400">Clientes Ativos</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Novos: {formatNumber(reportsData?.summary?.customers?.new || 0)}
                    </div>
                  </motion.div>

                  {/* Table Occupancy */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-orange-400">
                        <Clock className="w-4 h-4" />
                        {formatPercentage(reportsData?.summary?.tables?.averageTurnoverTime || 0)}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">
                        {formatPercentage(reportsData?.summary?.tables?.occupancyRate || 0)}
                      </div>
                      <div className="text-sm text-gray-400">Taxa de Ocupação</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Tempo médio: {reportsData?.summary?.tables?.averageTime || 0} min
                    </div>
                  </motion.div>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Revenue Chart */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Receita por Período</h3>
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    {reportsData?.charts?.revenue?.length > 0 ? (
                      <div className="space-y-4">
                        {reportsData.charts.revenue.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-gray-300">{item.period}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">{formatCurrency(item.value)}</div>
                              <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ 
                                    width: `${(item.value / Math.max(...reportsData.charts.revenue.map(r => r.value))) * 100}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum dado disponível para o período selecionado
                      </div>
                    )}
                  </motion.div>

                  {/* Top Products */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Produtos Mais Vendidos</h3>
                      <PieChart className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    {reportsData?.charts?.topProducts?.length > 0 ? (
                      <div className="space-y-4">
                        {reportsData.charts.topProducts.slice(0, 5).map((product, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <div className="text-white font-medium">{product.name}</div>
                                <div className="text-gray-400 text-sm">{product.quantity} vendidos</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">{formatCurrency(product.revenue)}</div>
                              <div className="text-gray-400 text-sm">
                                {formatPercentage((product.quantity / reportsData.charts.topProducts.reduce((sum, p) => sum + p.quantity, 0)) * 100)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum produto vendido no período
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Detailed Tables */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Detalhamento por {reportType === 'sales' ? 'Vendas' : reportType === 'products' ? 'Produtos' : reportType === 'customers' ? 'Clientes' : 'Mesas'}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportReport('pdf')}
                        className="text-gray-400 hover:text-white transition-colors p-2"
                        title="Exportar PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exportReport('xlsx')}
                        className="text-gray-400 hover:text-white transition-colors p-2"
                        title="Exportar Excel"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {reportsData?.details?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            {reportType === 'sales' && (
                              <>
                                <th className="py-3 text-gray-400 font-medium">Data</th>
                                <th className="py-3 text-gray-400 font-medium">Pedidos</th>
                                <th className="py-3 text-gray-400 font-medium">Receita</th>
                                <th className="py-3 text-gray-400 font-medium">Ticket Médio</th>
                              </>
                            )}
                            {reportType === 'products' && (
                              <>
                                <th className="py-3 text-gray-400 font-medium">Produto</th>
                                <th className="py-3 text-gray-400 font-medium">Categoria</th>
                                <th className="py-3 text-gray-400 font-medium">Quantidade</th>
                                <th className="py-3 text-gray-400 font-medium">Receita</th>
                              </>
                            )}
                            {reportType === 'customers' && (
                              <>
                                <th className="py-3 text-gray-400 font-medium">Cliente</th>
                                <th className="py-3 text-gray-400 font-medium">Pedidos</th>
                                <th className="py-3 text-gray-400 font-medium">Total Gasto</th>
                                <th className="py-3 text-gray-400 font-medium">Última Visita</th>
                              </>
                            )}
                            {reportType === 'tables' && (
                              <>
                                <th className="py-3 text-gray-400 font-medium">Mesa</th>
                                <th className="py-3 text-gray-400 font-medium">Ocupações</th>
                                <th className="py-3 text-gray-400 font-medium">Receita</th>
                                <th className="py-3 text-gray-400 font-medium">Taxa de Ocupação</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {(reportsData.details || []).slice(0, 10).map((item, index) => (
                            <tr key={index} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                              {reportType === 'sales' && (
                                <>
                                  <td className="py-4 text-white">{formatDate(item.date)}</td>
                                  <td className="py-4 text-white">{formatNumber(item.orders)}</td>
                                  <td className="py-4 text-white">{formatCurrency(item.revenue)}</td>
                                  <td className="py-4 text-white">{formatCurrency(item.averageTicket)}</td>
                                </>
                              )}
                              {reportType === 'products' && (
                                <>
                                  <td className="py-4 text-white">{item.name}</td>
                                  <td className="py-4 text-gray-400">{item.category}</td>
                                  <td className="py-4 text-white">{formatNumber(item.quantity)}</td>
                                  <td className="py-4 text-white">{formatCurrency(item.revenue)}</td>
                                </>
                              )}
                              {reportType === 'customers' && (
                                <>
                                  <td className="py-4 text-white">{item.name}</td>
                                  <td className="py-4 text-white">{formatNumber(item.orders)}</td>
                                  <td className="py-4 text-white">{formatCurrency(item.totalSpent)}</td>
                                  <td className="py-4 text-gray-400">{formatDate(item.lastVisit)}</td>
                                </>
                              )}
                              {reportType === 'tables' && (
                                <>
                                  <td className="py-4 text-white">Mesa {item.number}</td>
                                  <td className="py-4 text-white">{formatNumber(item.occupations)}</td>
                                  <td className="py-4 text-white">{formatCurrency(item.revenue)}</td>
                                  <td className="py-4 text-white">{formatPercentage(item.occupancyRate)}</td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum dado disponível para o período e tipo selecionados
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
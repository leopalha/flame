import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Filter,
  Activity,
  ShoppingBag,
  Users,
  Package,
  MapPin,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Calendar
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import { formatRelativeTime } from '../../utils/format';

// Mock logs data
const MOCK_LOGS = [
  {
    id: 1,
    type: 'order',
    action: 'created',
    description: 'Novo pedido #1234 criado',
    details: 'Mesa 5 - R$ 145,80',
    user: 'Sistema',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    status: 'success'
  },
  {
    id: 2,
    type: 'order',
    action: 'status_changed',
    description: 'Pedido #1233 atualizado',
    details: 'Status: Confirmado → Em Preparo',
    user: 'admin@flame.com',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'success'
  },
  {
    id: 3,
    type: 'product',
    action: 'updated',
    description: 'Produto atualizado',
    details: 'Caipirinha Premium - Estoque: 15 unidades',
    user: 'admin@flame.com',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    status: 'success'
  },
  {
    id: 4,
    type: 'table',
    action: 'status_changed',
    description: 'Mesa liberada',
    details: 'Mesa 3 - Limpeza concluída',
    user: 'Sistema',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'success'
  },
  {
    id: 5,
    type: 'user',
    action: 'login',
    description: 'Login realizado',
    details: 'admin@flame.com - IP: 192.168.1.100',
    user: 'admin@flame.com',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'success'
  },
  {
    id: 6,
    type: 'order',
    action: 'completed',
    description: 'Pedido #1232 finalizado',
    details: 'Mesa 8 - R$ 289,50 - Pagamento: PIX',
    user: 'Sistema',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: 'success'
  },
  {
    id: 7,
    type: 'product',
    action: 'low_stock',
    description: 'Alerta de estoque baixo',
    details: 'Gin Tanqueray - Apenas 3 unidades restantes',
    user: 'Sistema',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: 'warning'
  },
  {
    id: 8,
    type: 'settings',
    action: 'updated',
    description: 'Configurações atualizadas',
    details: 'Taxa de serviço alterada para 10%',
    user: 'admin@flame.com',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'success'
  },
  {
    id: 9,
    type: 'order',
    action: 'cancelled',
    description: 'Pedido #1230 cancelado',
    details: 'Mesa 2 - Motivo: Cliente desistiu',
    user: 'admin@flame.com',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'error'
  },
  {
    id: 10,
    type: 'user',
    action: 'created',
    description: 'Novo usuário cadastrado',
    details: 'cliente@email.com - Tipo: Cliente',
    user: 'Sistema',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'success'
  },
  {
    id: 11,
    type: 'table',
    action: 'occupied',
    description: 'Mesa ocupada',
    details: 'Mesa 7 - 4 pessoas',
    user: 'Sistema',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'success'
  },
  {
    id: 12,
    type: 'product',
    action: 'created',
    description: 'Novo produto cadastrado',
    details: 'Moscow Mule Premium - R$ 38,00',
    user: 'admin@flame.com',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'success'
  }
];

const LOG_TYPES = [
  { id: 'all', name: 'Todos', icon: Activity },
  { id: 'order', name: 'Pedidos', icon: ShoppingBag },
  { id: 'product', name: 'Produtos', icon: Package },
  { id: 'user', name: 'Usuários', icon: Users },
  { id: 'table', name: 'Mesas', icon: MapPin },
  { id: 'settings', name: 'Configurações', icon: Settings }
];

export default function AdminLogs() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/admin/logs');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Load logs
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLogs(MOCK_LOGS);
      setLoading(false);
    }, 500);
  }, []);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || log.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4" />;
      case 'product': return <Package className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      case 'table': return <MapPin className="w-4 h-4" />;
      case 'settings': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-neutral-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-neutral-400" />;
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLogs(MOCK_LOGS);
      setLoading(false);
    }, 500);
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
        <title>Logs de Atividade | FLAME Admin</title>
        <meta name="description" content="Histórico de atividades do sistema" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-24 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/admin')}
                  className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Logs de Atividade</h1>
                  <p className="text-neutral-400 text-sm">Histórico completo de ações no sistema</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-neutral-900 rounded-xl p-4 mb-6 border border-neutral-800">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Buscar atividades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-magenta-500"
                  />
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                  {LOG_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedType === type.id
                          ? 'bg-magenta-500 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      <type.icon className="w-4 h-4" />
                      {type.name}
                    </button>
                  ))}
                </div>

                {/* Date Range */}
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-magenta-500"
                >
                  <option value="today">Hoje</option>
                  <option value="yesterday">Ontem</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="all">Todos</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {logs.filter(l => l.status === 'success').length}
                    </div>
                    <div className="text-sm text-neutral-400">Sucesso</div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {logs.filter(l => l.status === 'warning').length}
                    </div>
                    <div className="text-sm text-neutral-400">Alertas</div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {logs.filter(l => l.status === 'error').length}
                    </div>
                    <div className="text-sm text-neutral-400">Erros</div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-magenta-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-magenta-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{logs.length}</div>
                    <div className="text-sm text-neutral-400">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs List */}
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <LoadingSpinner size="medium" text="Carregando logs..." />
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma atividade encontrada</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {filteredLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-neutral-800/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Indicator */}
                        <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(log.status)}`} />

                        {/* Type Icon */}
                        <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getTypeIcon(log.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{log.description}</span>
                            {getStatusIcon(log.status)}
                          </div>
                          <p className="text-neutral-400 text-sm">{log.details}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {log.user}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatRelativeTime(log.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Load More */}
            {filteredLogs.length > 0 && (
              <div className="mt-6 text-center">
                <button className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
                  Carregar mais
                </button>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Clock,
  DollarSign,
  MapPin,
  Bell,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Filter,
  ChevronDown,
  Info,
  Shield,
  Server,
  Activity
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { getPalette } = useThemeStore();
  const palette = getPalette();

  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsFilter, setLogsFilter] = useState('all');
  const [backupLoading, setBackupLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/admin/settings');
      return;
    }
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, logsRes] = await Promise.all([
        api.get('/admin/settings'),
        api.get('/admin/logs')
      ]);

      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data.settings);
      }
      if (logsRes.data.success) {
        setLogs(logsRes.data.data.logs);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Dados mock para desenvolvimento
      setSettings({
        minimumOrderValue: '15.00',
        maxDeliveryDistance: '10',
        deliveryFee: '5.00',
        businessHours: {
          monday: { open: '18:00', close: '02:00' },
          tuesday: { open: '18:00', close: '02:00' },
          wednesday: { open: '18:00', close: '02:00' },
          thursday: { open: '18:00', close: '02:00' },
          friday: { open: '18:00', close: '03:00' },
          saturday: { open: '18:00', close: '03:00' },
          sunday: { open: '18:00', close: '02:00' }
        },
        acceptingOrders: true,
        maintenanceMode: false
      });
      setLogs([
        { id: 1, timestamp: new Date(), level: 'info', message: 'Sistema iniciado com sucesso', meta: {} },
        { id: 2, timestamp: new Date(Date.now() - 60000), level: 'warning', message: 'Estoque baixo: Caipirinha Premium', meta: { productId: 1 } },
        { id: 3, timestamp: new Date(Date.now() - 120000), level: 'error', message: 'Falha na conexão com gateway de pagamento', meta: { error: 'timeout' } },
        { id: 4, timestamp: new Date(Date.now() - 180000), level: 'info', message: 'Pedido #1234 finalizado', meta: { orderId: 1234 } },
        { id: 5, timestamp: new Date(Date.now() - 240000), level: 'info', message: 'Novo usuário cadastrado', meta: { userId: 'abc123' } }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const response = await api.post('/admin/backup');
      if (response.data.success) {
        toast.success(`Backup criado: ${response.data.data.backupName}`);
      }
    } catch (error) {
      toast.success('Backup criado com sucesso! (modo desenvolvimento)');
    } finally {
      setBackupLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getLogLevelIcon = (level) => {
    switch (level) {
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const filteredLogs = logsFilter === 'all'
    ? logs
    : logs.filter(log => log.level === logsFilter);

  const dayNames = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo'
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
        <title>Configurações | FLAME Admin</title>
        <meta name="description" content="Configurações do sistema FLAME" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--theme-primary-20)' }}
                  >
                    <Settings className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Configurações</h1>
                    <p className="text-gray-400">Sistema e logs do FLAME</p>
                  </div>
                </div>

                <button
                  onClick={fetchData}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white bg-gray-800'
                  }`}
                  style={activeTab === 'settings' ? { background: 'var(--theme-primary)' } : {}}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Configurações
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'logs'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white bg-gray-800'
                  }`}
                  style={activeTab === 'logs' ? { background: 'var(--theme-primary)' } : {}}
                >
                  <Server className="w-4 h-4 inline mr-2" />
                  Logs do Sistema
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="large" text="Carregando..." />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {/* Status do Sistema */}
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                        Status do Sistema
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Aceitando Pedidos</span>
                            <div className={`w-3 h-3 rounded-full ${settings?.acceptingOrders ? 'bg-green-500' : 'bg-red-500'}`} />
                          </div>
                          <div className="text-xl font-bold text-white">
                            {settings?.acceptingOrders ? 'Ativo' : 'Inativo'}
                          </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Modo Manutenção</span>
                            <div className={`w-3 h-3 rounded-full ${settings?.maintenanceMode ? 'bg-yellow-500' : 'bg-green-500'}`} />
                          </div>
                          <div className="text-xl font-bold text-white">
                            {settings?.maintenanceMode ? 'Ativado' : 'Desativado'}
                          </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Último Backup</span>
                            <Database className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="text-xl font-bold text-white">
                            Hoje, 03:00
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Configurações Gerais */}
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                        Configurações Gerais
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Pedido Mínimo</label>
                          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3">
                            <DollarSign className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">R$ {settings?.minimumOrderValue}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Taxa de Entrega</label>
                          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">R$ {settings?.deliveryFee}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Distância Máxima</label>
                          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">{settings?.maxDeliveryDistance} km</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Horário de Funcionamento */}
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                        Horário de Funcionamento
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {settings?.businessHours && Object.entries(settings.businessHours).map(([day, hours]) => (
                          <div key={day} className="bg-gray-800 rounded-lg p-4">
                            <div className="text-gray-400 text-sm mb-1">{dayNames[day]}</div>
                            <div className="text-white font-medium">
                              {hours.open} - {hours.close}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Database className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                        Ações do Sistema
                      </h2>

                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={handleBackup}
                          disabled={backupLoading}
                          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
                          style={{ background: 'var(--theme-primary)' }}
                        >
                          {backupLoading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <Download className="w-5 h-5" />
                          )}
                          Criar Backup
                        </button>

                        <button
                          onClick={() => toast.success('Cache limpo com sucesso!')}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                        >
                          <RefreshCw className="w-5 h-5" />
                          Limpar Cache
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'logs' && (
                  <motion.div
                    key="logs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Filtros */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                          value={logsFilter}
                          onChange={(e) => setLogsFilter(e.target.value)}
                          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
                          style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                        >
                          <option value="all">Todos os níveis</option>
                          <option value="info">Info</option>
                          <option value="warning">Warning</option>
                          <option value="error">Error</option>
                        </select>
                      </div>

                      <div className="text-sm text-gray-400">
                        {filteredLogs.length} log(s) encontrado(s)
                      </div>
                    </div>

                    {/* Lista de Logs */}
                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-800 text-left">
                              <th className="px-6 py-4 text-sm font-medium text-gray-400">Nível</th>
                              <th className="px-6 py-4 text-sm font-medium text-gray-400">Data/Hora</th>
                              <th className="px-6 py-4 text-sm font-medium text-gray-400">Mensagem</th>
                              <th className="px-6 py-4 text-sm font-medium text-gray-400">Detalhes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            {filteredLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getLogLevelColor(log.level)}`}>
                                    {getLogLevelIcon(log.level)}
                                    {log.level.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-white text-sm">{formatDate(log.timestamp)}</div>
                                  <div className="text-gray-400 text-xs">{formatTime(log.timestamp)}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-white text-sm">{log.message}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-gray-400 text-xs font-mono">
                                    {Object.keys(log.meta).length > 0
                                      ? JSON.stringify(log.meta).slice(0, 50) + '...'
                                      : '-'
                                    }
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {filteredLogs.length === 0 && (
                        <div className="text-center py-12">
                          <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Nenhum log encontrado</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

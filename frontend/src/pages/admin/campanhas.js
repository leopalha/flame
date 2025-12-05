import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Megaphone,
  Plus,
  Play,
  Pause,
  Check,
  Trash2,
  Edit,
  Eye,
  Send,
  Users,
  Mail,
  MessageSquare,
  TrendingUp,
  Calendar,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useCampaignStore from '../../stores/campaignStore';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';

const typeConfig = {
  reactivation: { name: 'Reativação', icon: RefreshCw, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  promotion: { name: 'Promoção', icon: Megaphone, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  loyalty: { name: 'Fidelidade', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  announcement: { name: 'Anúncio', icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10' }
};

const statusConfig = {
  draft: { name: 'Rascunho', color: 'text-gray-400', bg: 'bg-gray-500/20' },
  active: { name: 'Ativa', color: 'text-green-400', bg: 'bg-green-500/20' },
  paused: { name: 'Pausada', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  completed: { name: 'Concluída', color: 'text-blue-400', bg: 'bg-blue-500/20' }
};

export default function AdminCampanhas() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    campaigns,
    stats,
    pagination,
    loading,
    fetchCampaigns,
    fetchStats,
    createCampaign,
    deleteCampaign,
    executeCampaign,
    pauseCampaign,
    completeCampaign,
    createQuickReactivation,
    setFilters
  } = useCampaignStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedType, setSelectedType] = useState('promotion');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'promotion',
    targetType: 'all',
    targetFilters: {},
    content: {
      subject: '',
      body: '',
      sms: ''
    },
    channels: ['email']
  });

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

    fetchCampaigns();
    fetchStats();
  }, [isAuthenticated, user, router]);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nome da campanha é obrigatório');
      return;
    }

    try {
      await createCampaign(formData);
      toast.success('Campanha criada com sucesso!');
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao criar campanha');
    }
  };

  const handleQuickReactivation = async (days) => {
    try {
      await createQuickReactivation(days);
      toast.success(`Campanha de reativação (${days} dias) criada!`);
    } catch (error) {
      toast.error('Erro ao criar campanha');
    }
  };

  const handleExecute = async (id) => {
    if (!confirm('Deseja executar esta campanha e enviar para todos os destinatários?')) return;

    try {
      const result = await executeCampaign(id);
      toast.success(result.message);
    } catch (error) {
      toast.error('Erro ao executar campanha');
    }
  };

  const handlePause = async (id) => {
    try {
      await pauseCampaign(id);
      toast.success('Campanha pausada');
    } catch (error) {
      toast.error('Erro ao pausar campanha');
    }
  };

  const handleComplete = async (id) => {
    if (!confirm('Deseja marcar esta campanha como concluída?')) return;

    try {
      await completeCampaign(id);
      toast.success('Campanha concluída');
    } catch (error) {
      toast.error('Erro ao completar campanha');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja deletar esta campanha?')) return;

    try {
      await deleteCampaign(id);
      toast.success('Campanha deletada');
    } catch (error) {
      toast.error('Erro ao deletar campanha');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'promotion',
      targetType: 'all',
      targetFilters: {},
      content: {
        subject: '',
        body: '',
        sms: ''
      },
      channels: ['email']
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({ page: newPage });
    fetchCampaigns();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <>
      <Head>
        <title>Campanhas de Marketing - FLAME Admin</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Campanhas de Marketing
              </h1>
              <p className="text-zinc-400">
                Gerencie campanhas de email e SMS para seus clientes
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-magenta-600 hover:bg-magenta-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nova Campanha
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Megaphone className="w-5 h-5 text-magenta-400" />
                  <span className="text-zinc-400 text-sm">Total</span>
                </div>
                <p className="text-2xl font-bold">{stats.total}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Play className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-400 text-sm">Ativas</span>
                </div>
                <p className="text-2xl font-bold">{stats.active}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Check className="w-5 h-5 text-blue-400" />
                  <span className="text-zinc-400 text-sm">Concluídas</span>
                </div>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span className="text-zinc-400 text-sm">Alcançados</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalReached || 0}</p>
              </motion.div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Ações Rápidas - Campanhas de Reativação
            </h3>
            <div className="flex flex-wrap gap-3">
              {[30, 60, 90, 180].map((days) => (
                <button
                  key={days}
                  onClick={() => handleQuickReactivation(days)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-400 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reativar {days}+ dias
                </button>
              ))}
            </div>
          </div>

          {/* Campaigns List */}
          {loading && campaigns.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-500"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800">
              <Megaphone className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg">Nenhuma campanha criada</p>
              <p className="text-zinc-500 text-sm mt-2">
                Crie sua primeira campanha para alcançar seus clientes
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => {
                const type = typeConfig[campaign.type] || typeConfig.promotion;
                const status = statusConfig[campaign.status] || statusConfig.draft;
                const TypeIcon = type.icon;

                return (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${type.bg}`}>
                            <TypeIcon className={`w-5 h-5 ${type.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{campaign.name}</h3>
                            <p className="text-sm text-zinc-500">{campaign.description || 'Sem descrição'}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                          <span className={`px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                            {status.name}
                          </span>
                          <span className={`px-3 py-1 rounded-full ${type.bg} ${type.color}`}>
                            {type.name}
                          </span>
                          {campaign.channels?.includes('email') && (
                            <span className="flex items-center gap-1 text-zinc-400">
                              <Mail className="w-4 h-4" />
                              Email
                            </span>
                          )}
                          {campaign.channels?.includes('sms') && (
                            <span className="flex items-center gap-1 text-zinc-400">
                              <MessageSquare className="w-4 h-4" />
                              SMS
                            </span>
                          )}
                        </div>

                        {campaign.stats && campaign.status !== 'draft' && (
                          <div className="flex items-center gap-6 mt-4 text-sm text-zinc-400">
                            <span>
                              <strong className="text-white">{campaign.stats.totalTargets}</strong> alvos
                            </span>
                            <span>
                              <strong className="text-green-400">{campaign.stats.sent}</strong> enviados
                            </span>
                            <span>
                              Enviado em: {formatDate(campaign.sentAt)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {campaign.status === 'draft' && (
                          <>
                            <button
                              onClick={() => handleExecute(campaign.id)}
                              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              title="Executar"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(campaign.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {campaign.status === 'active' && (
                          <>
                            <button
                              onClick={() => handlePause(campaign.id)}
                              className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                              title="Pausar"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleComplete(campaign.id)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                              title="Concluir"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {campaign.status === 'paused' && (
                          <button
                            onClick={() => handleExecute(campaign.id)}
                            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            title="Retomar"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

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
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Nova Campanha</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Nome da Campanha *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500 outline-none"
                    placeholder="Ex: Promoção de Verão"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500 outline-none resize-none"
                    rows={3}
                    placeholder="Descrição da campanha..."
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Tipo de Campanha
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(typeConfig).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: key })}
                          className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                            formData.type === key
                              ? `${config.bg} border-current ${config.color}`
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {config.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Público-alvo
                  </label>
                  <select
                    value={formData.targetType}
                    onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500 outline-none"
                  >
                    <option value="all">Todos os clientes</option>
                    <option value="inactive">Clientes inativos</option>
                    <option value="tier">Por tier de fidelidade</option>
                  </select>
                </div>

                {/* Inactive Days Filter */}
                {formData.targetType === 'inactive' && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Inativos há quantos dias?
                    </label>
                    <select
                      value={formData.targetFilters.inactiveDays || 30}
                      onChange={(e) => setFormData({
                        ...formData,
                        targetFilters: { ...formData.targetFilters, inactiveDays: parseInt(e.target.value) }
                      })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500 outline-none"
                    >
                      <option value={30}>30 dias</option>
                      <option value={60}>60 dias</option>
                      <option value={90}>90 dias</option>
                      <option value={180}>180 dias</option>
                    </select>
                  </div>
                )}

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Assunto do Email
                  </label>
                  <input
                    type="text"
                    value={formData.content.subject}
                    onChange={(e) => setFormData({
                      ...formData,
                      content: { ...formData.content, subject: e.target.value }
                    })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500 outline-none"
                    placeholder="Ex: Sentimos sua falta!"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Corpo do Email
                  </label>
                  <textarea
                    value={formData.content.body}
                    onChange={(e) => setFormData({
                      ...formData,
                      content: { ...formData.content, body: e.target.value }
                    })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500 outline-none resize-none"
                    rows={4}
                    placeholder="Use {nome} para personalizar a mensagem..."
                  />
                </div>

                {/* Channels */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Canais de Envio
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const channels = formData.channels.includes('email')
                          ? formData.channels.filter(c => c !== 'email')
                          : [...formData.channels, 'email'];
                        setFormData({ ...formData, channels });
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        formData.channels.includes('email')
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const channels = formData.channels.includes('sms')
                          ? formData.channels.filter(c => c !== 'sms')
                          : [...formData.channels, 'sms'];
                        setFormData({ ...formData, channels });
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        formData.channels.includes('sms')
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      SMS
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-magenta-600 hover:bg-magenta-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                  >
                    {loading ? 'Criando...' : 'Criar Campanha'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

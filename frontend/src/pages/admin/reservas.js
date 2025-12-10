import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import Layout from '../../components/Layout';
import useReservationStore, { RESERVATION_STATUS } from '../../stores/reservationStore';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';

export default function AdminReservas() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const {
    reservations,
    stats,
    loading,
    fetchAllReservations,
    confirmReservation,
    markArrived,
    sendReminder,
    fetchStats
  } = useReservationStore();

  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: ''
  });
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  // Verificar se é admin
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (user && user.role !== 'admin') {
      toast.error('Acesso negado');
      router.push('/');
      return;
    }

    // Buscar dados
    fetchAllReservations(filters);
    fetchStats(30);
  }, [isLoggedIn, user, router]);

  // Atualizar quando filtros mudarem
  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      const queryFilters = {};
      if (filters.status) queryFilters.status = filters.status;
      if (filters.date) queryFilters.date = filters.date;
      if (filters.search) queryFilters.search = filters.search;

      fetchAllReservations(queryFilters);
    }
  }, [filters, isLoggedIn, user]);

  const handleConfirmReservation = async (id) => {
    const result = await confirmReservation(id);
    if (result.success) {
      fetchAllReservations(filters);
      toast.success('Reserva confirmada!');
    }
  };

  const handleMarkArrived = async (id) => {
    const result = await markArrived(id);
    if (result.success) {
      fetchAllReservations(filters);
    }
  };

  const handleSendReminder = async (id) => {
    const result = await sendReminder(id);
    if (result.success) {
      toast.success('Lembrete enviado!');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [RESERVATION_STATUS.PENDING]: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        icon: <Clock size={14} />,
        label: 'Pendente'
      },
      [RESERVATION_STATUS.CONFIRMED]: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        icon: <CheckCircle size={14} />,
        label: 'Confirmada'
      },
      [RESERVATION_STATUS.CANCELLED]: {
        bg: 'bg-[var(--theme-primary)]/20',
        text: 'text-[var(--theme-primary)]',
        icon: <XCircle size={14} />,
        label: 'Cancelada'
      },
      [RESERVATION_STATUS.COMPLETED]: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        icon: <CheckCircle size={14} />,
        label: 'Concluída'
      },
      [RESERVATION_STATUS.NO_SHOW]: {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        icon: <AlertCircle size={14} />,
        label: 'No-show'
      }
    };

    const config = statusConfig[status] || statusConfig[RESERVATION_STATUS.PENDING];

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Gerenciar Reservas | Admin FLAME</title>
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Reservas</h1>
                  <p className="text-gray-400">Administre todas as reservas do FLAME</p>
                </div>
                <Calendar size={48} style={{ color: 'var(--theme-primary)' }} />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm">Total</p>
                    <TrendingUp size={20} className="text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.totalReservations || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm">Pendentes</p>
                    <Clock size={20} className="text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-400">{stats.pendingReservations || 0}</p>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm">Confirmadas</p>
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-400">{stats.confirmedReservations || 0}</p>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm">Taxa de Conclusão</p>
                    <TrendingDown size={20} style={{ color: 'var(--theme-primary)' }} />
                  </div>
                  <p className="text-3xl font-bold" style={{ color: 'var(--theme-primary)' }}>
                    {stats.completionRate ? `${stats.completionRate.toFixed(0)}%` : '0%'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Buscar por nome, email, código..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
                    style={{ borderColor: filters.search ? 'var(--theme-primary)' : '' }}
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none transition-colors"
                  style={{ borderColor: filters.status ? 'var(--theme-primary)' : '' }}
                >
                  <option value="">Todos os status</option>
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="completed">Concluída</option>
                  <option value="no_show">No-show</option>
                </select>

                {/* Date Filter */}
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none transition-colors"
                  style={{ borderColor: filters.date ? 'var(--theme-primary)' : '' }}
                />

                {/* Clear Filters */}
                <button
                  onClick={() => setFilters({ status: '', date: '', search: '' })}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Reservations Table */}
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Clock size={24} className="animate-spin mr-2" style={{ color: 'var(--theme-primary)' }} />
                  <span className="text-gray-400">Carregando...</span>
                </div>
              ) : !reservations || reservations.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">Nenhuma reserva encontrada</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800 border-b border-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                          Data/Hora
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                          Cliente
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                          Pessoas
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                          Código
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {reservations.map((reservation) => (
                        <>
                          <tr
                            key={reservation.id}
                            className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                            onClick={() =>
                              setExpandedRow(expandedRow === reservation.id ? null : reservation.id)
                            }
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-500" />
                                <div>
                                  <p className="text-white font-medium">
                                    {formatDate(reservation.reservationDate)}
                                  </p>
                                  <p className="text-gray-500 text-sm">{reservation.reservationTime}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-white font-medium">{reservation.guestName}</p>
                                <p className="text-gray-500 text-sm">{reservation.guestPhone}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1 text-gray-400">
                                <Users size={16} />
                                <span>{reservation.partySize}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">{getStatusBadge(reservation.status)}</td>
                            <td className="px-4 py-4">
                              <span className="font-mono text-sm" style={{ color: 'var(--theme-primary)' }}>
                                {reservation.confirmationCode}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                {reservation.status === RESERVATION_STATUS.PENDING && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirmReservation(reservation.id);
                                    }}
                                    className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-colors"
                                    title="Confirmar"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                )}
                                {reservation.status === RESERVATION_STATUS.CONFIRMED && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkArrived(reservation.id);
                                      }}
                                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors"
                                      title="Marcar chegada"
                                    >
                                      <Users size={16} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendReminder(reservation.id);
                                      }}
                                      className="p-2 rounded transition-colors"
                                      style={{
                                        background: 'var(--theme-primary-20)',
                                        color: 'var(--theme-primary)'
                                      }}
                                      title="Enviar lembrete"
                                    >
                                      <Send size={16} />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                  {expandedRow === reservation.id ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Row */}
                          {expandedRow === reservation.id && (
                            <tr>
                              <td colSpan={6} className="px-4 py-4 bg-gray-800/30">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500 mb-1">Email</p>
                                    <p className="text-white flex items-center gap-2">
                                      <Mail size={14} />
                                      {reservation.guestEmail}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 mb-1">Telefone</p>
                                    <p className="text-white flex items-center gap-2">
                                      <Phone size={14} />
                                      {reservation.guestPhone}
                                    </p>
                                  </div>
                                  {reservation.specialRequests && (
                                    <div>
                                      <p className="text-gray-500 mb-1">Ocasião</p>
                                      <p className="text-white">{reservation.specialRequests}</p>
                                    </div>
                                  )}
                                  {reservation.guestNotes && (
                                    <div className="col-span-2">
                                      <p className="text-gray-500 mb-1">Observações</p>
                                      <p className="text-white">{reservation.guestNotes}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-gray-500 mb-1">Criada em</p>
                                    <p className="text-white">{formatDateTime(reservation.createdAt)}</p>
                                  </div>
                                  {reservation.confirmedAt && (
                                    <div>
                                      <p className="text-gray-500 mb-1">Confirmada em</p>
                                      <p className="text-white">
                                        {formatDateTime(reservation.confirmedAt)}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

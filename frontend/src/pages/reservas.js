import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, ChevronLeft, ChevronRight, Check, X, Flame, PartyPopper, CalendarDays, History } from 'lucide-react';
import Layout from '../components/Layout';
import { useReservationStore, HORARIOS_DISPONIVEIS, TIPOS_MESA, OCASIOES } from '../stores/reservationStore';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';

export default function Reservas() {
  const [activeTab, setActiveTab] = useState('nova');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    data: '',
    horario: '',
    pessoas: 2,
    tipoMesa: 'standard',
    ocasiao: '',
    observacoes: '',
    nome: '',
    telefone: ''
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const { user, isAuthenticated } = useAuthStore();
  const {
    reservations,
    loading,
    createReservation,
    cancelReservation,
    getUpcomingReservations,
    getPastReservations,
    getAvailableSlots
  } = useReservationStore();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || user.name || '',
        telefone: user.telefone || user.phone || ''
      }));
    }
  }, [user]);

  const upcomingReservations = getUpcomingReservations();
  const pastReservations = getPastReservations();

  // Gera os dias do mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Dias do mes anterior para preencher
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Dias do mes atual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    return days;
  };

  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // Permite reservas ate 30 dias no futuro
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);

    return checkDate >= today && checkDate <= maxDate;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handleDateSelect = (date) => {
    if (!isDateAvailable(date)) return;
    setFormData(prev => ({
      ...prev,
      data: date.toISOString().split('T')[0],
      horario: '' // Reset horario quando muda a data
    }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Faca login para fazer uma reserva');
      return;
    }

    if (!formData.data || !formData.horario || !formData.pessoas) {
      toast.error('Preencha todos os campos obrigatorios');
      return;
    }

    const result = await createReservation({
      ...formData,
      userId: user?.id,
      userName: formData.nome
    });

    if (result.success) {
      setStep(1);
      setFormData({
        data: '',
        horario: '',
        pessoas: 2,
        tipoMesa: 'standard',
        ocasiao: '',
        observacoes: '',
        nome: user?.nome || '',
        telefone: user?.telefone || ''
      });
      setActiveTab('minhas');
    }
  };

  const tipoMesaInfo = TIPOS_MESA.find(t => t.id === formData.tipoMesa);
  const availableSlots = formData.data ? getAvailableSlots(formData.data) : HORARIOS_DISPONIVEIS;

  return (
    <>
      <Head>
        <title>Reservas | FLAME</title>
        <meta name="description" content="Faca sua reserva no FLAME Lounge Bar - Mesas, lounges e area VIP" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-magenta-900/50 via-purple-900/50 to-cyan-900/50 py-16 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-magenta-500/20 via-transparent to-transparent" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-magenta-500/10 rounded-full blur-3xl" />

            <div className="relative max-w-4xl mx-auto px-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-magenta-500 to-cyan-500 rounded-full mb-6"
              >
                <CalendarDays className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 via-purple-400 to-cyan-400">
                  Reservas
                </span>
              </motion.h1>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-neutral-300"
              >
                Garanta sua mesa no FLAME
              </motion.p>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex bg-neutral-900 rounded-xl p-1 mb-8">
              {[
                { id: 'nova', label: 'Nova Reserva', icon: Calendar },
                { id: 'minhas', label: 'Minhas Reservas', icon: CalendarDays },
                { id: 'historico', label: 'Historico', icon: History }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Nova Reserva */}
            <AnimatePresence mode="wait">
              {activeTab === 'nova' && (
                <motion.div
                  key="nova"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Progress Steps */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    {[1, 2, 3].map(s => (
                      <div key={s} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          step >= s
                            ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}>
                          {step > s ? <Check className="w-5 h-5" /> : s}
                        </div>
                        {s < 3 && (
                          <div className={`w-16 h-1 mx-2 rounded ${
                            step > s ? 'bg-gradient-to-r from-magenta-500 to-cyan-500' : 'bg-neutral-800'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Data e Horario */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold text-white text-center mb-6">
                        Escolha a data e horario
                      </h2>

                      {/* Calendario */}
                      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <div className="flex items-center justify-between mb-6">
                          <button
                            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5 text-neutral-400" />
                          </button>
                          <h3 className="text-lg font-semibold text-white">
                            {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                          </h3>
                          <button
                            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            <ChevronRight className="w-5 h-5 text-neutral-400" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
                            <div key={day} className="text-center text-xs text-neutral-500 py-2">
                              {day}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {getDaysInMonth(selectedMonth).map((day, index) => {
                            const dateStr = day.date.toISOString().split('T')[0];
                            const isSelected = formData.data === dateStr;
                            const isAvailable = isDateAvailable(day.date) && day.isCurrentMonth;

                            return (
                              <button
                                key={index}
                                onClick={() => isAvailable && handleDateSelect(day.date)}
                                disabled={!isAvailable}
                                className={`p-3 rounded-lg text-center transition-all ${
                                  !day.isCurrentMonth
                                    ? 'text-neutral-700'
                                    : isSelected
                                      ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white font-bold'
                                      : isAvailable
                                        ? 'text-white hover:bg-neutral-800'
                                        : 'text-neutral-600 cursor-not-allowed'
                                }`}
                              >
                                {day.date.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Horarios */}
                      {formData.data && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800"
                        >
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-cyan-400" />
                            Horarios disponiveis
                          </h3>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {HORARIOS_DISPONIVEIS.map(horario => {
                              const isAvailable = availableSlots.includes(horario);
                              const isSelected = formData.horario === horario;

                              return (
                                <button
                                  key={horario}
                                  onClick={() => isAvailable && setFormData(prev => ({ ...prev, horario }))}
                                  disabled={!isAvailable}
                                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                                    isSelected
                                      ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white'
                                      : isAvailable
                                        ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                                        : 'bg-neutral-800/50 text-neutral-600 cursor-not-allowed'
                                  }`}
                                >
                                  {horario}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      <button
                        onClick={() => setStep(2)}
                        disabled={!formData.data || !formData.horario}
                        className="w-full bg-gradient-to-r from-magenta-600 to-cyan-600 hover:from-magenta-700 hover:to-cyan-700 disabled:from-neutral-700 disabled:to-neutral-700 text-white font-semibold py-4 rounded-xl transition-all"
                      >
                        Continuar
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2: Detalhes */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold text-white text-center mb-6">
                        Detalhes da reserva
                      </h2>

                      {/* Numero de pessoas */}
                      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-cyan-400" />
                          Numero de pessoas
                        </h3>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, pessoas: Math.max(1, prev.pessoas - 1) }))}
                            className="w-12 h-12 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center text-white text-2xl"
                          >
                            -
                          </button>
                          <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-cyan-400 w-20 text-center">
                            {formData.pessoas}
                          </span>
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, pessoas: Math.min(20, prev.pessoas + 1) }))}
                            className="w-12 h-12 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center text-white text-2xl"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tipo de mesa */}
                      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-cyan-400" />
                          Tipo de mesa
                        </h3>
                        <div className="grid gap-3">
                          {TIPOS_MESA.map(tipo => (
                            <button
                              key={tipo.id}
                              onClick={() => setFormData(prev => ({ ...prev, tipoMesa: tipo.id }))}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                formData.tipoMesa === tipo.id
                                  ? 'border-magenta-500 bg-magenta-500/10'
                                  : 'border-neutral-700 hover:border-neutral-600'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-white">{tipo.nome}</p>
                                  <p className="text-sm text-neutral-400">{tipo.capacidade}</p>
                                  <p className="text-xs text-neutral-500 mt-1">{tipo.descricao}</p>
                                </div>
                                <div className="text-right">
                                  {tipo.preco > 0 ? (
                                    <span className="text-cyan-400 font-bold">+{formatCurrency(tipo.preco)}</span>
                                  ) : (
                                    <span className="text-green-400 text-sm">Incluso</span>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Ocasiao */}
                      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <PartyPopper className="w-5 h-5 text-cyan-400" />
                          Ocasiao (opcional)
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {OCASIOES.map(ocasiao => (
                            <button
                              key={ocasiao}
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                ocasiao: prev.ocasiao === ocasiao ? '' : ocasiao
                              }))}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                formData.ocasiao === ocasiao
                                  ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white'
                                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                              }`}
                            >
                              {ocasiao}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-4 rounded-xl transition-all"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={() => setStep(3)}
                          className="flex-1 bg-gradient-to-r from-magenta-600 to-cyan-600 hover:from-magenta-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl transition-all"
                        >
                          Continuar
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Confirmacao */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold text-white text-center mb-6">
                        Confirme sua reserva
                      </h2>

                      {/* Resumo */}
                      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                            <span className="text-neutral-400">Data</span>
                            <span className="text-white font-medium">{formatDate(formData.data)}</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                            <span className="text-neutral-400">Horario</span>
                            <span className="text-white font-medium">{formData.horario}</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                            <span className="text-neutral-400">Pessoas</span>
                            <span className="text-white font-medium">{formData.pessoas} {formData.pessoas === 1 ? 'pessoa' : 'pessoas'}</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                            <span className="text-neutral-400">Mesa</span>
                            <span className="text-white font-medium">{tipoMesaInfo?.nome}</span>
                          </div>
                          {formData.ocasiao && (
                            <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                              <span className="text-neutral-400">Ocasiao</span>
                              <span className="text-white font-medium">{formData.ocasiao}</span>
                            </div>
                          )}
                          {tipoMesaInfo?.preco > 0 && (
                            <div className="flex items-center justify-between py-3">
                              <span className="text-neutral-400">Taxa de reserva</span>
                              <span className="text-cyan-400 font-bold">{formatCurrency(tipoMesaInfo.preco)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contato */}
                      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Seus dados</h3>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Seu nome"
                            value={formData.nome}
                            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-magenta-500"
                          />
                          <input
                            type="tel"
                            placeholder="Telefone para contato"
                            value={formData.telefone}
                            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-magenta-500"
                          />
                          <textarea
                            placeholder="Observacoes (opcional)"
                            value={formData.observacoes}
                            onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-magenta-500 resize-none"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setStep(2)}
                          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-4 rounded-xl transition-all"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={loading || !formData.nome || !formData.telefone}
                          className="flex-1 bg-gradient-to-r from-magenta-600 to-cyan-600 hover:from-magenta-700 hover:to-cyan-700 disabled:from-neutral-700 disabled:to-neutral-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Reservando...
                            </>
                          ) : (
                            <>
                              <Flame className="w-5 h-5" />
                              Confirmar Reserva
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Minhas Reservas */}
              {activeTab === 'minhas' && (
                <motion.div
                  key="minhas"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {upcomingReservations.length === 0 ? (
                    <div className="text-center py-16">
                      <CalendarDays className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Nenhuma reserva agendada</h3>
                      <p className="text-neutral-400 mb-6">Faca sua primeira reserva agora!</p>
                      <button
                        onClick={() => setActiveTab('nova')}
                        className="bg-gradient-to-r from-magenta-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl"
                      >
                        Fazer Reserva
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingReservations.map(reservation => (
                        <div
                          key={reservation.id}
                          className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-lg font-bold text-white">
                                {formatDate(reservation.data)}
                              </p>
                              <p className="text-cyan-400 font-medium">{reservation.horario}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              reservation.status === 'confirmada'
                                ? 'bg-green-500/20 text-green-400'
                                : reservation.status === 'pendente'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-neutral-500/20 text-neutral-400'
                            }`}>
                              {reservation.status === 'confirmada' ? 'Confirmada' : 'Pendente'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-neutral-500">Pessoas:</span>
                              <span className="text-white ml-2">{reservation.pessoas}</span>
                            </div>
                            <div>
                              <span className="text-neutral-500">Mesa:</span>
                              <span className="text-white ml-2">
                                {TIPOS_MESA.find(t => t.id === reservation.tipoMesa)?.nome}
                              </span>
                            </div>
                          </div>
                          {reservation.status !== 'cancelada' && (
                            <button
                              onClick={() => cancelReservation(reservation.id)}
                              className="text-red-400 hover:text-red-300 text-sm font-medium"
                            >
                              Cancelar reserva
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Historico */}
              {activeTab === 'historico' && (
                <motion.div
                  key="historico"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {pastReservations.length === 0 ? (
                    <div className="text-center py-16">
                      <History className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Sem historico</h3>
                      <p className="text-neutral-400">Suas reservas anteriores aparecerão aqui</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastReservations.map(reservation => (
                        <div
                          key={reservation.id}
                          className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-neutral-400">
                                {formatDate(reservation.data)}
                              </p>
                              <p className="text-neutral-500 text-sm">{reservation.horario}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              reservation.status === 'concluida'
                                ? 'bg-green-500/10 text-green-400/70'
                                : 'bg-red-500/10 text-red-400/70'
                            }`}>
                              {reservation.status === 'concluida' ? 'Concluida' : 'Cancelada'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Layout>
    </>
  );
}

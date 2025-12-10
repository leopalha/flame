import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, CalendarDays, History, CheckCircle, XCircle, AlertCircle, Clock, Users, MapPin, Phone, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import Layout from '../components/Layout';
import ReservationCalendar from '../components/ReservationCalendar';
import ReservationTimeSlots from '../components/ReservationTimeSlots';
import ReservationForm from '../components/ReservationForm';
import useReservationStore, { RESERVATION_STATUS } from '../stores/reservationStore';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { toast } from 'react-hot-toast';

export default function Reservas() {
  const [activeTab, setActiveTab] = useState('nova');
  const [currentStep, setCurrentStep] = useState(1); // 1: Data, 2: Horário, 3: Formulário, 4: Sucesso
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const { user, isLoggedIn } = useAuthStore();
  const themeStore = useThemeStore();
  const palette = themeStore?.getPalette?.();

  const {
    myReservations,
    selectedDate,
    selectedSlot,
    currentReservation,
    loading,
    fetchMyReservations,
    fetchByConfirmationCode,
    cancelReservation,
    clearSelection,
    getUpcomingReservations,
    getPastReservations
  } = useReservationStore();

  // Buscar reservas ao carregar se logado
  useEffect(() => {
    if (isLoggedIn) {
      fetchMyReservations();
    }
  }, [isLoggedIn, fetchMyReservations]);

  // Controlar passos
  useEffect(() => {
    if (selectedDate && !selectedSlot) {
      setCurrentStep(2);
    } else if (selectedDate && selectedSlot) {
      setCurrentStep(3);
    } else {
      setCurrentStep(1);
    }
  }, [selectedDate, selectedSlot]);

  const handleDateSelect = (date) => {
    setCurrentStep(2);
  };

  const handleSlotSelect = (slot) => {
    setCurrentStep(3);
  };

  const handleReservationSuccess = (reservation) => {
    // Guardar dados da reserva para mostrar na tela de sucesso
    setConfirmedReservation(reservation);
    setCurrentStep(4); // Ir para tela de sucesso

    if (isLoggedIn) {
      fetchMyReservations();
    }
  };

  const handleCopyCode = () => {
    if (confirmedReservation?.confirmationCode) {
      navigator.clipboard.writeText(confirmedReservation.confirmationCode);
      setCodeCopied(true);
      toast.success('Código copiado!');
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleNewReservation = () => {
    setConfirmedReservation(null);
    clearSelection();
    setCurrentStep(1);
    setCodeCopied(false);
  };

  const handleCancelReservation = async (id) => {
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
      const result = await cancelReservation(id);
      if (result.success) {
        fetchMyReservations();
      }
    }
  };

  const handleSearchByCode = async () => {
    if (!confirmationCode.trim()) {
      toast.error('Digite um código de confirmação');
      return;
    }

    const reservation = await fetchByConfirmationCode(confirmationCode.toUpperCase());
    if (reservation) {
      toast.success('Reserva encontrada!');
    }
  };

  const upcomingReservations = getUpcomingReservations();
  const pastReservations = getPastReservations();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [RESERVATION_STATUS.PENDING]: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        label: 'Pendente'
      },
      [RESERVATION_STATUS.CONFIRMED]: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        label: 'Confirmada'
      },
      [RESERVATION_STATUS.CANCELLED]: {
        bg: 'bg-[var(--theme-primary)]/20',
        text: 'text-[var(--theme-primary)]',
        label: 'Cancelada'
      },
      [RESERVATION_STATUS.COMPLETED]: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        label: 'Concluída'
      },
      [RESERVATION_STATUS.NO_SHOW]: {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        label: 'Não compareceu'
      }
    };

    const config = statusConfig[status] || statusConfig[RESERVATION_STATUS.PENDING];

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <>
      <Head>
        <title>Reservas | FLAME</title>
        <meta name="description" content="Faça sua reserva no FLAME Lounge Bar" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          {/* Header */}
          <div
            className="relative py-16 overflow-hidden"
            style={{
              background: 'linear-gradient(to right, rgba(255, 0, 110, 0.2), rgba(0, 212, 255, 0.2))'
            }}
          >
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-[var(--theme-primary)]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-[var(--theme-secondary)]" />

            <div className="relative max-w-6xl mx-auto px-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-secondary)]"
              >
                <CalendarIcon className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--theme-primary)] via-[var(--theme-accent)] to-[var(--theme-secondary)] bg-clip-text text-transparent"
              >
                Reservas
              </motion.h1>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-300"
              >
                Garanta sua mesa no FLAME
              </motion.p>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex bg-gray-900 rounded-xl p-1 mb-8 border border-gray-800">
              {[
                { id: 'nova', label: 'Nova Reserva', icon: CalendarIcon },
                { id: 'minhas', label: 'Minhas Reservas', icon: CalendarDays },
                { id: 'buscar', label: 'Buscar', icon: History }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {/* Nova Reserva */}
              {activeTab === 'nova' && (
                <motion.div
                  key="nova"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Progress Steps */}
                  {currentStep < 4 && (
                    <div className="flex items-center justify-center gap-4">
                      {[
                        { step: 1, label: 'Data' },
                        { step: 2, label: 'Horário' },
                        { step: 3, label: 'Confirmar' }
                      ].map(({ step, label }, index) => (
                        <div key={step} className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                              currentStep >= step
                                ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                                : 'bg-gray-800 text-gray-500'
                            }`}
                          >
                            {currentStep > step ? <CheckCircle size={20} /> : step}
                          </div>
                          <span
                            className={`ml-2 text-sm font-medium hidden sm:inline ${
                              currentStep >= step ? 'text-white' : 'text-gray-500'
                            }`}
                          >
                            {label}
                          </span>
                          {index < 2 && (
                            <div
                              className={`w-12 md:w-24 h-1 mx-2 rounded transition-all ${
                                currentStep > step
                                  ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]'
                                  : 'bg-gray-800'
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Step 1: Calendar */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <h2 className="text-2xl font-bold text-white text-center mb-6">
                        Selecione uma data
                      </h2>
                      <ReservationCalendar onDateSelect={handleDateSelect} useThemeStore={useThemeStore} />
                    </motion.div>
                  )}

                  {/* Step 2: Time Slots */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Escolha o horário</h2>
                        <button
                          onClick={() => {
                            clearSelection();
                            setCurrentStep(1);
                          }}
                          className="text-gray-400 hover:text-white text-sm"
                        >
                          Voltar
                        </button>
                      </div>
                      <ReservationTimeSlots onSlotSelect={handleSlotSelect} useThemeStore={useThemeStore} />
                    </motion.div>
                  )}

                  {/* Step 3: Form */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Confirme sua reserva</h2>
                        <button
                          onClick={() => {
                            useReservationStore.getState().selectSlot(selectedDate, null);
                            setCurrentStep(2);
                          }}
                          className="text-gray-400 hover:text-white text-sm"
                        >
                          Voltar
                        </button>
                      </div>
                      <ReservationForm onSuccess={handleReservationSuccess} useThemeStore={useThemeStore} />
                    </motion.div>
                  )}

                  {/* Step 4: Sucesso */}
                  {currentStep === 4 && confirmedReservation && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="max-w-lg mx-auto"
                    >
                      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-green-500/30 shadow-2xl text-center">
                        {/* Ícone de sucesso */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 0.2 }}
                          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                        >
                          <CheckCircle size={40} className="text-white" />
                        </motion.div>

                        <h2 className="text-3xl font-bold text-white mb-2">
                          Reserva Confirmada!
                        </h2>
                        <p className="text-gray-400 mb-8">
                          Enviamos um SMS com os detalhes para seu celular
                        </p>

                        {/* Código de confirmação */}
                        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                          <p className="text-sm text-gray-400 mb-2">Código de Confirmação</p>
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-3xl font-mono font-bold text-[var(--theme-primary)] tracking-wider">
                              {confirmedReservation.confirmationCode}
                            </span>
                            <button
                              onClick={handleCopyCode}
                              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                              title="Copiar código"
                            >
                              {codeCopied ? (
                                <Check size={20} className="text-green-400" />
                              ) : (
                                <Copy size={20} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Detalhes da reserva */}
                        <div className="bg-gray-800/30 rounded-xl p-5 mb-6 text-left space-y-3">
                          <div className="flex items-center gap-3">
                            <CalendarIcon size={18} className="text-[var(--theme-primary)]" />
                            <span className="text-gray-300">
                              {new Date(confirmedReservation.reservationDate).toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock size={18} className="text-[var(--theme-primary)]" />
                            <span className="text-gray-300">
                              {new Date(confirmedReservation.reservationDate).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users size={18} className="text-[var(--theme-primary)]" />
                            <span className="text-gray-300">
                              {confirmedReservation.partySize} pessoa{confirmedReservation.partySize > 1 ? 's' : ''}
                            </span>
                          </div>
                          {confirmedReservation.specialRequests && (
                            <div className="flex items-start gap-3">
                              <MapPin size={18} className="text-[var(--theme-primary)] mt-0.5" />
                              <span className="text-gray-300">{confirmedReservation.specialRequests}</span>
                            </div>
                          )}
                        </div>

                        {/* Aviso SMS */}
                        <div className="flex items-center justify-center gap-2 text-sm text-green-400 mb-6">
                          <MessageCircle size={16} />
                          <span>SMS de confirmação enviado para seu celular</span>
                        </div>

                        {/* Localização */}
                        <div className="bg-[var(--theme-primary)]/10 rounded-xl p-4 mb-6">
                          <p className="text-[var(--theme-primary)] font-semibold mb-1">
                            FLAME Lounge Bar
                          </p>
                          <p className="text-gray-400 text-sm">
                            R. Voluntários da Pátria, 446 - Botafogo, RJ
                          </p>
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => setActiveTab('minhas')}
                            className="flex-1 py-3 px-6 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-colors"
                          >
                            Ver Minhas Reservas
                          </button>
                          <button
                            onClick={handleNewReservation}
                            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white font-semibold hover:opacity-90 transition-opacity"
                          >
                            Nova Reserva
                          </button>
                        </div>
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
                  {!isLoggedIn ? (
                    <div className="text-center py-16">
                      <AlertCircle size={64} className="mx-auto text-[var(--theme-primary)] mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">Login necessário</h3>
                      <p className="text-gray-400 mb-6">
                        Faça login para ver suas reservas
                      </p>
                    </div>
                  ) : upcomingReservations.length === 0 ? (
                    <div className="text-center py-16">
                      <CalendarDays size={64} className="mx-auto text-gray-600 mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Nenhuma reserva agendada
                      </h3>
                      <p className="text-gray-400 mb-6">Faça sua primeira reserva agora!</p>
                      <button
                        onClick={() => setActiveTab('nova')}
                        className="bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white font-semibold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Fazer Reserva
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingReservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-[var(--theme-primary)]/30 shadow-lg"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-xl font-bold text-white mb-1">
                                {formatDate(reservation.reservationDate)}
                              </p>
                              <div className="flex items-center gap-2 text-[var(--theme-primary)] font-semibold">
                                <Clock size={16} />
                                {reservation.reservationTime}
                              </div>
                            </div>
                            {getStatusBadge(reservation.status)}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-gray-500" />
                              <span className="text-gray-400">Pessoas:</span>
                              <span className="text-white font-semibold">{reservation.guests}</span>
                            </div>
                            {reservation.occasion && (
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-500" />
                                <span className="text-gray-400">Ocasião:</span>
                                <span className="text-white font-semibold">{reservation.occasion}</span>
                              </div>
                            )}
                          </div>

                          {reservation.confirmationCode && (
                            <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                              <p className="text-xs text-gray-500 mb-1">Código de confirmação</p>
                              <p className="text-lg font-mono font-bold text-[var(--theme-primary)]">
                                {reservation.confirmationCode}
                              </p>
                            </div>
                          )}

                          {reservation.notes && (
                            <div className="text-sm text-gray-400 mb-4">
                              <p className="text-gray-500 mb-1">Observações:</p>
                              <p>{reservation.notes}</p>
                            </div>
                          )}

                          {reservation.status === RESERVATION_STATUS.PENDING && (
                            <button
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="text-[var(--theme-primary)] hover:text-[var(--theme-secondary)] text-sm font-semibold transition-colors"
                            >
                              Cancelar reserva
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reservas Passadas */}
                  {isLoggedIn && pastReservations.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <History size={20} />
                        Histórico
                      </h3>
                      <div className="space-y-3">
                        {pastReservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className="bg-gray-900/50 rounded-lg p-4 border border-gray-800"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-gray-400">
                                  {formatDate(reservation.reservationDate)}
                                </p>
                                <p className="text-gray-500 text-sm">{reservation.reservationTime}</p>
                              </div>
                              {getStatusBadge(reservation.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Buscar por Código */}
              {activeTab === 'buscar' && (
                <motion.div
                  key="buscar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-md mx-auto"
                >
                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 border border-[var(--theme-primary)]/30">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                      Buscar Reserva
                    </h2>
                    <p className="text-gray-400 text-center mb-6">
                      Digite o código de confirmação da sua reserva
                    </p>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                        placeholder="Ex: A1B2C3D4E5F6"
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border-2 border-gray-700 focus:border-[var(--theme-primary)] text-white font-mono text-center text-lg placeholder-gray-600 transition-colors"
                        maxLength={12}
                      />

                      <button
                        onClick={handleSearchByCode}
                        disabled={loading || confirmationCode.length < 12}
                        className={`w-full py-3 rounded-lg font-semibold transition-all ${
                          loading || confirmationCode.length < 12
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white hover:opacity-90'
                        }`}
                      >
                        {loading ? 'Buscando...' : 'Buscar Reserva'}
                      </button>
                    </div>

                    {/* Resultado da busca */}
                    {currentReservation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-white font-bold">
                              {formatDate(currentReservation.reservationDate)}
                            </p>
                            <p className="text-[var(--theme-primary)]">{currentReservation.reservationTime}</p>
                          </div>
                          {getStatusBadge(currentReservation.status)}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Users size={14} />
                            {currentReservation.guests} pessoa(s)
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Phone size={14} />
                            {currentReservation.phone}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Mail size={14} />
                            {currentReservation.email}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Layout>
    </>
  );
}

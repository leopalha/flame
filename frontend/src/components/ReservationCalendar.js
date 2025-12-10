import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import useReservationStore from '../stores/reservationStore';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function ReservationCalendar({ onDateSelect, useThemeStore }) {
  const palette = useThemeStore?.getPalette?.();
  const { selectedDate, availableSlots, fetchAvailableSlots, loading } = useReservationStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [availabilityCache, setAvailabilityCache] = useState({});

  // Gerar dias do calendário
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const firstDayOfWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();

    const days = [];

    // Dias do mês anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevLastDate - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevLastDate - i)
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= lastDate; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }

    // Dias do próximo mês (preencher semana)
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: i,
          isCurrentMonth: false,
          fullDate: new Date(year, month + 1, i)
        });
      }
    }

    return days;
  };

  // Verificar se é data passada
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Verificar se é hoje
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Verificar se é data selecionada
  const isSelected = (date) => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  // Buscar disponibilidade ao passar mouse
  const handleDateHover = async (day) => {
    if (!day.isCurrentMonth || isPastDate(day.fullDate)) {
      setHoveredDate(null);
      return;
    }

    setHoveredDate(day.fullDate);

    const dateKey = day.fullDate.toISOString().split('T')[0];

    // Se já temos no cache, não buscar novamente
    if (availabilityCache[dateKey]) return;

    try {
      const slots = await fetchAvailableSlots(dateKey);
      setAvailabilityCache(prev => ({
        ...prev,
        [dateKey]: slots.length
      }));
    } catch (error) {
      console.error('Erro ao buscar disponibilidade:', error);
    }
  };

  // Selecionar data
  const handleDateClick = async (day) => {
    if (!day.isCurrentMonth || isPastDate(day.fullDate)) return;

    const dateKey = day.fullDate.toISOString().split('T')[0];
    await fetchAvailableSlots(dateKey);

    if (onDateSelect) {
      onDateSelect(dateKey);
    }
  };

  // Navegar entre meses
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Obter status de disponibilidade
  const getAvailabilityStatus = (day) => {
    if (!day.isCurrentMonth || isPastDate(day.fullDate)) return null;

    const dateKey = day.fullDate.toISOString().split('T')[0];
    const count = availabilityCache[dateKey];

    if (count === undefined) return 'unknown';
    if (count === 0) return 'full';
    if (count <= 2) return 'limited';
    return 'available';
  };

  const days = generateCalendarDays();

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-black rounded-xl border border-[var(--theme-primary)]/30 overflow-hidden shadow-2xl">
      {/* Header do Calendário */}
      <div className="p-4" style={{ background: 'linear-gradient(to right, var(--theme-primary, #FF006E), var(--theme-secondary, #00D4FF))' }}>
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-white" />
          </motion.button>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 justify-center">
              <Calendar size={24} />
              {MESES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNextMonth}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronRight size={24} className="text-white" />
          </motion.button>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="p-4">
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DIAS_SEMANA.map((dia) => (
            <div key={dia} className="text-center text-sm font-semibold text-gray-400 py-2">
              {dia}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-2">
          <AnimatePresence mode="wait">
            {days.map((day, index) => {
              const past = isPastDate(day.fullDate);
              const today = isToday(day.fullDate);
              const selected = isSelected(day.fullDate);
              const status = getAvailabilityStatus(day);
              const isHovered = hoveredDate && hoveredDate.getTime() === day.fullDate.getTime();

              return (
                <motion.button
                  key={`${day.fullDate.getTime()}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={!past && day.isCurrentMonth ? { scale: 1.1 } : {}}
                  whileTap={!past && day.isCurrentMonth ? { scale: 0.95 } : {}}
                  onClick={() => handleDateClick(day)}
                  onMouseEnter={() => handleDateHover(day)}
                  onMouseLeave={() => setHoveredDate(null)}
                  disabled={past || !day.isCurrentMonth}
                  style={selected ? { background: 'linear-gradient(135deg, var(--theme-primary, #FF006E), var(--theme-secondary, #00D4FF))' } : {}}
                  className={`
                    relative aspect-square p-2 rounded-lg font-semibold text-sm transition-all
                    ${!day.isCurrentMonth ? 'text-gray-600' : ''}
                    ${past ? 'text-gray-700 cursor-not-allowed' : ''}
                    ${today && day.isCurrentMonth ? 'ring-2 ring-[var(--theme-secondary)]' : ''}
                    ${selected ? 'text-white shadow-lg' : ''}
                    ${!selected && !past && day.isCurrentMonth ? 'hover:bg-gray-800' : ''}
                    ${!selected && day.isCurrentMonth && !past ? 'text-gray-200' : ''}
                    ${
                      status === 'available' && !selected
                        ? 'border-2 border-green-500/50'
                        : status === 'limited' && !selected
                        ? 'border-2 border-yellow-500/50'
                        : status === 'full' && !selected
                        ? 'border-2 border-red-500/50'
                        : 'border-2 border-gray-700/30'
                    }
                  `}
                >
                  <span className="relative z-10">{day.date}</span>

                  {/* Indicador de disponibilidade */}
                  {status && !selected && day.isCurrentMonth && !past && (
                    <div
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full
                        ${status === 'available' ? 'bg-green-500' : ''}
                        ${status === 'limited' ? 'bg-yellow-500' : ''}
                        ${status === 'full' ? 'bg-red-500' : ''}
                      `}
                    />
                  )}

                  {/* Tooltip ao hover */}
                  {isHovered && status && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-20"
                    >
                      {status === 'unknown' ? 'Carregando...' : ''}
                      {status === 'available' ? `${availabilityCache[day.fullDate.toISOString().split('T')[0]]} horários` : ''}
                      {status === 'limited' ? 'Poucos horários' : ''}
                      {status === 'full' ? 'Sem horários' : ''}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Legenda */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Poucos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Esgotado</span>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center gap-2 mt-4 text-[var(--theme-primary)]">
            <Clock size={16} className="animate-spin" />
            <span className="text-sm">Buscando horários...</span>
          </div>
        )}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import useReservationStore from '../stores/reservationStore';

export default function ReservationTimeSlots({ onSlotSelect, useThemeStore }) {
  const palette = useThemeStore?.getPalette?.();
  const { availableSlots, selectedSlot, selectSlot, selectedDate } = useReservationStore();

  if (!selectedDate) {
    return (
      <div className="text-center py-12">
        <Clock size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400">Selecione uma data para ver os horários disponíveis</p>
      </div>
    );
  }

  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <XCircle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-gray-300 font-semibold mb-2">Nenhum horário disponível</p>
        <p className="text-gray-500 text-sm">Tente outra data</p>
      </div>
    );
  }

  // Agrupar slots por período do dia
  const groupSlotsByPeriod = () => {
    const periods = {
      manha: { label: 'Manhã', icon: '🌅', slots: [] },
      tarde: { label: 'Tarde', icon: '☀️', slots: [] },
      noite: { label: 'Noite', icon: '🌙', slots: [] }
    };

    availableSlots.forEach(slot => {
      const hour = parseInt(slot.time.split(':')[0]);

      if (hour < 12) {
        periods.manha.slots.push(slot);
      } else if (hour < 18) {
        periods.tarde.slots.push(slot);
      } else {
        periods.noite.slots.push(slot);
      }
    });

    return periods;
  };

  const handleSlotClick = (slot) => {
    selectSlot(selectedDate, slot);
    if (onSlotSelect) {
      onSlotSelect(slot);
    }
  };

  const periods = groupSlotsByPeriod();

  // Calcular cor de disponibilidade
  const getAvailabilityColor = (available, capacity) => {
    const percentage = (available / capacity) * 100;
    if (percentage > 60) return 'green';
    if (percentage > 30) return 'yellow';
    return 'red';
  };

  return (
    <div className="space-y-6">
      {Object.entries(periods).map(([key, period]) => {
        if (period.slots.length === 0) return null;

        return (
          <div key={key} className="space-y-3">
            {/* Cabeçalho do período */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">{period.icon}</span>
              <h3 className="text-lg font-bold text-white">{period.label}</h3>
              <span className="text-sm text-gray-500">({period.slots.length} horários)</span>
            </div>

            {/* Grid de slots */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {period.slots.map((slot, index) => {
                const isSelected = selectedSlot?.time === slot.time;
                const availabilityColor = getAvailabilityColor(slot.availableTables, slot.totalTables);

                return (
                  <motion.button
                    key={slot.time}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSlotClick(slot)}
                    style={isSelected ? { background: 'linear-gradient(135deg, var(--theme-primary, #FF006E), var(--theme-secondary, #00D4FF))' } : {}}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all overflow-hidden
                      ${
                        isSelected
                          ? 'border-[var(--theme-primary)] shadow-lg'
                          : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                      }
                    `}
                  >
                    {/* Background gradient */}
                    {!isSelected && (
                      <div
                        className={`absolute inset-0 opacity-10 bg-gradient-to-br ${
                          availabilityColor === 'green'
                            ? 'from-green-500 to-emerald-500'
                            : availabilityColor === 'yellow'
                            ? 'from-yellow-500 to-amber-500'
                            : 'from-red-500 to-orange-500'
                        }`}
                      />
                    )}

                    <div className="relative z-10 space-y-2">
                      {/* Horário */}
                      <div className="flex items-center justify-center gap-2">
                        <Clock size={18} className={isSelected ? 'text-white' : 'text-[var(--theme-primary)]'} />
                        <span
                          className={`text-lg font-bold ${
                            isSelected ? 'text-white' : 'text-gray-200'
                          }`}
                        >
                          {slot.time}
                        </span>
                      </div>

                      {/* Disponibilidade de mesas */}
                      <div className="flex items-center justify-center gap-1">
                        <Users size={14} className={isSelected ? 'text-white/80' : 'text-gray-400'} />
                        <span
                          className={`text-xs font-medium ${
                            isSelected ? 'text-white/90' : 'text-gray-400'
                          }`}
                        >
                          {slot.availableTables}/{slot.totalTables} mesas
                        </span>
                      </div>

                      {/* Indicador de disponibilidade */}
                      <div className="flex items-center justify-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isSelected
                              ? 'bg-white'
                              : availabilityColor === 'green'
                              ? 'bg-green-500'
                              : availabilityColor === 'yellow'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            isSelected
                              ? 'text-white'
                              : availabilityColor === 'green'
                              ? 'text-green-400'
                              : availabilityColor === 'yellow'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {availabilityColor === 'green'
                            ? 'Disponível'
                            : availabilityColor === 'yellow'
                            ? 'Limitado'
                            : 'Quase cheio'}
                        </span>
                      </div>

                      {/* Check de selecionado */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <CheckCircle size={20} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legenda */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 mb-2">Disponibilidade:</p>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400">Disponível (60%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-400">Limitado (30-60%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-400">Quase cheio (&lt;30%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Users, MessageSquare, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import useReservationStore, { OCASIOES } from '../stores/reservationStore';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';

export default function ReservationForm({ onSuccess, useThemeStore }) {
  const palette = useThemeStore?.getPalette?.();
  const { user, isLoggedIn } = useAuthStore();
  const { selectedDate, selectedSlot, createReservation, loading, clearSelection } = useReservationStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    occasion: 'Jantar casual',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Pré-preencher com dados do usuário se logado
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isLoggedIn, user]);

  // Validação de formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido (ex: (11) 98765-4321)';
    }

    if (formData.guests < 1 || formData.guests > 20) {
      newErrors.guests = 'Número de pessoas deve ser entre 1 e 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formatar telefone automaticamente
  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlot) {
      toast.error('Selecione uma data e horário');
      return;
    }

    if (!validateForm()) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    const reservationData = {
      reservationDate: `${selectedDate}T${selectedSlot.time}:00`,
      guestName: formData.name,
      guestEmail: formData.email,
      guestPhone: formData.phone,
      partySize: parseInt(formData.guests),
      specialRequests: formData.occasion,
      guestNotes: formData.notes
    };

    const result = await createReservation(reservationData);

    if (result.success) {
      // Resetar formulário
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        guests: 2,
        occasion: 'Jantar casual',
        notes: ''
      });

      if (onSuccess) {
        onSuccess(result.reservation);
      }
    }
  };

  const handleCancel = () => {
    clearSelection();
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      guests: 2,
      occasion: 'Jantar casual',
      notes: ''
    });
    setErrors({});
  };

  if (!selectedDate || !selectedSlot) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-[var(--theme-primary)] mb-4" />
        <p className="text-gray-400">Selecione uma data e horário para continuar</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-[var(--theme-primary)]/30 overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="p-4" style={{ background: 'linear-gradient(to right, var(--theme-primary, #FF006E), var(--theme-secondary, #00D4FF))' }}>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle size={24} />
          Confirmar Reserva
        </h3>
      </div>

      {/* Resumo da seleção */}
      <div className="p-4 bg-gray-800/50 border-b border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[var(--theme-primary)]" />
            <div>
              <p className="text-gray-500 text-xs">Data</p>
              <p className="text-white font-semibold">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[var(--theme-primary)]" />
            <div>
              <p className="text-gray-500 text-xs">Horário</p>
              <p className="text-white font-semibold">{selectedSlot.time}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            <User size={16} className="inline mr-1" />
            Nome completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoggedIn}
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 border-2 text-white placeholder-gray-500 transition-colors ${
              errors.name
                ? 'border-red-500 focus:border-red-400'
                : 'border-gray-700 focus:border-[var(--theme-primary)]'
            } ${isLoggedIn ? 'opacity-60 cursor-not-allowed' : ''}`}
            placeholder="Seu nome"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            <Mail size={16} className="inline mr-1" />
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoggedIn}
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 border-2 text-white placeholder-gray-500 transition-colors ${
              errors.email
                ? 'border-red-500 focus:border-red-400'
                : 'border-gray-700 focus:border-[var(--theme-primary)]'
            } ${isLoggedIn ? 'opacity-60 cursor-not-allowed' : ''}`}
            placeholder="seu@email.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            <Phone size={16} className="inline mr-1" />
            Telefone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 border-2 text-white placeholder-gray-500 transition-colors ${
              errors.phone
                ? 'border-red-500 focus:border-red-400'
                : 'border-gray-700 focus:border-[var(--theme-primary)]'
            }`}
            placeholder="(11) 98765-4321"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Número de pessoas */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            <Users size={16} className="inline mr-1" />
            Número de pessoas *
          </label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
            max="20"
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 border-2 text-white placeholder-gray-500 transition-colors ${
              errors.guests
                ? 'border-red-500 focus:border-red-400'
                : 'border-gray-700 focus:border-[var(--theme-primary)]'
            }`}
          />
          {errors.guests && <p className="text-red-400 text-xs mt-1">{errors.guests}</p>}
        </div>

        {/* Ocasião */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Ocasião
          </label>
          <select
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border-2 border-gray-700 focus:border-[var(--theme-primary)] text-white transition-colors"
          >
            {OCASIOES.map(ocasiao => (
              <option key={ocasiao} value={ocasiao}>
                {ocasiao}
              </option>
            ))}
          </select>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            <MessageSquare size={16} className="inline mr-1" />
            Observações
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border-2 border-gray-700 focus:border-[var(--theme-primary)] text-white placeholder-gray-500 transition-colors resize-none"
            placeholder="Alguma preferência ou necessidade especial?"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <motion.button
            type="button"
            onClick={handleCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={!loading ? { background: 'linear-gradient(to right, var(--theme-primary, #FF006E), var(--theme-secondary, #00D4FF))' } : {}}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'text-white shadow-lg hover:opacity-90'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Clock size={18} className="animate-spin" />
                Reservando...
              </span>
            ) : (
              'Confirmar Reserva'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Calendar, Sparkles, Clock } from 'lucide-react';

const TimelineEvent = ({ event, index }) => {
  const getStatusBadge = (status) => {
    const badges = {
      'vagas-limitadas': {
        text: 'VAGAS LIMITADAS',
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500',
        textColor: 'text-yellow-400'
      },
      'last-tickets': {
        text: 'ÚLTIMOS INGRESSOS',
        bg: 'bg-red-500/20',
        border: 'border-red-500',
        textColor: 'text-red-400'
      },
      'em-breve': {
        text: 'EM BREVE',
        bg: 'bg-blue-500/20',
        border: 'border-blue-500',
        textColor: 'text-blue-400'
      }
    };

    return badges[status] || badges['em-breve'];
  };

  const badge = getStatusBadge(event.status);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.05 }}
      className="flex-shrink-0 w-72 relative"
    >
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 hover:border-magenta-500/50 transition-all shadow-lg hover:shadow-magenta-500/30">
        {/* Badge Status */}
        <div className={`inline-flex items-center gap-2 ${badge.bg} border ${badge.border} ${badge.textColor} text-xs font-bold px-3 py-1 rounded-full mb-4`}>
          {event.status === 'last-tickets' && <Sparkles className="w-3 h-3" />}
          {event.status === 'vagas-limitadas' && <Clock className="w-3 h-3" />}
          {badge.text}
        </div>

        {/* Data Grande */}
        <div className="flex items-baseline gap-3 mb-4">
          <div className="text-center">
            <div className="text-magenta-400 font-bold text-sm uppercase">{event.mes}</div>
            <div className="text-white font-black text-5xl leading-none">{event.dia}</div>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl mb-1">{event.titulo}</h3>
            <p className="text-gray-400 text-sm">{event.subtitulo}</p>
          </div>
        </div>

        {/* Tipo de Evento */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4" />
          <span className="capitalize">{event.tipo.replace('-', ' ')}</span>
        </div>

        {/* CTA */}
        <button className="w-full bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 text-sm">
          Saber Mais
        </button>
      </div>

      {/* Conector de Timeline (exceto último item) */}
      <div className="absolute top-1/2 -right-12 w-12 h-0.5 bg-gradient-to-r from-magenta-500 to-transparent hidden xl:block" />
    </motion.div>
  );
};

export default TimelineEvent;

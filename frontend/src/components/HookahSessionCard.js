import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Flame, Clock, Zap, X } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { toast } from 'react-hot-toast';

export default function HookahSessionCard({
  session,
  onCoalChange,
  onPause,
  onResume,
  onEnd,
  useThemeStore,
}) {
  const [showActions, setShowActions] = useState(false);
  const palette = useThemeStore?.getPalette?.();

  const categoryEmoji = {
    frutas: '🍓',
    mentol: '❄️',
    especial: '✨',
    classico: '🔥',
    premium: '👑',
  };

  const handleCoalChange = async () => {
    try {
      await onCoalChange(session.id);
      toast.success('Carvão trocado!', {
        icon: '🔄',
      });
    } catch (error) {
      toast.error('Erro ao trocar carvão');
    }
  };

  const handlePauseResume = async () => {
    try {
      if (session.status === 'active') {
        await onPause(session.id);
        toast.success('Sessão pausada');
      } else if (session.status === 'paused') {
        await onResume(session.id);
        toast.success('Sessão retomada');
      }
    } catch (error) {
      toast.error('Erro ao pausar/retomar');
    }
  };

  const handleEnd = async () => {
    if (confirm('Tem certeza que deseja finalizar esta sessão?')) {
      try {
        await onEnd(session.id);
        toast.success('Sessão finalizada');
      } catch (error) {
        toast.error('Erro ao finalizar sessão');
      }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, translateY: -2 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`relative rounded-lg border-2 overflow-hidden transition-all ${
        session.status === 'active'
          ? 'border-green-500/50 bg-green-950/20'
          : session.status === 'paused'
          ? 'border-yellow-500/50 bg-yellow-950/20'
          : 'border-gray-700 bg-gray-900/20'
      }`}
    >
      {/* Status Indicator */}
      <div className="absolute top-0 right-0 w-3 h-3 rounded-full mt-2 mr-2"
        style={{
          backgroundColor:
            session.status === 'active'
              ? '#22c55e'
              : session.status === 'paused'
              ? '#eab308'
              : '#6b7280',
        }}
      />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">
                Mesa {session.mesa?.number || '?'}
              </h3>
              {session.quantity > 1 && (
                <span className="text-xs bg-orange-500/30 text-orange-400 px-2 py-1 rounded">
                  x{session.quantity}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">
              {categoryEmoji[session.flavor?.category] || '🔥'} {session.flavor?.name}
            </p>
          </div>

          {/* Quick Actions */}
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-1"
            >
              <button
                onClick={handlePauseResume}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
                title={session.status === 'active' ? 'Pausar' : 'Retomar'}
              >
                {session.status === 'active' ? (
                  <Pause size={16} className="text-yellow-400" />
                ) : (
                  <Play size={16} className="text-green-400" />
                )}
              </button>
              <button
                onClick={handleEnd}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
                title="Finalizar"
              >
                <X size={16} className="text-red-400" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between">
          <CountdownTimer
            orderId={session.id}
            startedAt={session.startedAt}
            thresholdMinutes={session.duration - 5}
            compact={true}
          />
          <span className="text-xs text-gray-500">
            Duração: {session.duration}min
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-800/50 rounded p-2">
            <p className="text-gray-400">Carvão</p>
            <p className="font-bold text-white">{session.coalChangeCount}x</p>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <p className="text-gray-400">Tempo Total</p>
            <p className="font-bold text-white">{session.totalDuration}m</p>
          </div>
        </div>

        {/* Coal Change Button (if active) */}
        {session.status === 'active' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCoalChange}
            className="w-full py-2 px-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Zap size={16} />
            Trocar Carvão
          </motion.button>
        )}

        {/* Status Badge */}
        {session.status === 'paused' && (
          <div className="flex items-center justify-center gap-2 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-400 text-xs font-semibold">
            <Clock size={14} />
            PAUSADA
          </div>
        )}

        {/* Price (if ended) */}
        {session.status === 'ended' && session.price && (
          <div className="flex items-center justify-between py-2 bg-green-500/20 border border-green-500/50 rounded px-2">
            <span className="text-green-400 text-xs font-semibold">Total</span>
            <span className="text-green-300 font-bold">R$ {session.price.toFixed(2)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

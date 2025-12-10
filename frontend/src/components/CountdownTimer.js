import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import useThemeStore from '../stores/themeStore';

const CountdownTimer = ({ orderId, startedAt, thresholdMinutes = 15, onThresholdReached }) => {
  const { getPalette } = useThemeStore();
  const [elapsed, setElapsed] = useState(0);
  const [isDelayed, setIsDelayed] = useState(false);
  const palette = getPalette();

  useEffect(() => {
    const interval = setInterval(() => {
      if (startedAt) {
        const now = new Date();
        const start = new Date(startedAt);
        const diff = Math.floor((now - start) / 1000);
        setElapsed(diff);

        const minutes = diff / 60;
        const wasDelayed = isDelayed;
        const delayedNow = minutes > thresholdMinutes;

        if (delayedNow && !wasDelayed && onThresholdReached) {
          onThresholdReached(orderId);
        }

        setIsDelayed(delayedNow);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, thresholdMinutes, orderId, isDelayed, onThresholdReached]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Cores baseadas no estado
  let statusColor = palette?.primary || '#FF006E'; // Fallback para cor padrão FLAME (magenta)
  let statusIcon = <Clock className="w-4 h-4" />;
  let statusLabel = 'Em preparo';

  if (isDelayed) {
    statusColor = '#ff6b6b'; // Vermelho
    statusIcon = <AlertTriangle className="w-4 h-4" />;
    statusLabel = '⚠️ ATRASADO!';
  }

  // Animação de pulse quando atrasado
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity
      }
    }
  };

  // Helper to convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    if (!hex || typeof hex !== 'string') return `rgba(255, 0, 110, ${alpha})`; // Magenta FLAME
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <motion.div
      variants={isDelayed ? pulseVariants : {}}
      animate={isDelayed ? 'pulse' : 'initial'}
      className="flex items-center gap-3 p-3 rounded-lg"
      style={{
        backgroundColor: isDelayed ? 'rgba(255, 107, 107, 0.1)' : hexToRgba(palette?.primary, 0.05),
        borderColor: statusColor,
        borderWidth: '1px'
      }}
    >
      {/* Ícone */}
      <div
        className="flex-shrink-0 p-2 rounded-full"
        style={{
          backgroundColor: `${statusColor}20`,
          color: statusColor
        }}
      >
        {statusIcon}
      </div>

      {/* Timer */}
      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-gray-400">{statusLabel}</span>
          <motion.span
            key={elapsed}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="text-2xl font-bold font-mono"
            style={{ color: statusColor }}
          >
            {formattedTime}
          </motion.span>
        </div>

        {/* Barra de progresso */}
        <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            animate={{
              width: `${Math.min((minutes / thresholdMinutes) * 100, 100)}%`
            }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{
              backgroundColor: isDelayed ? '#ff6b6b' : statusColor
            }}
          />
        </div>
      </div>

      {/* Badge de status */}
      {isDelayed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0 text-sm font-bold px-2 py-1 rounded"
          style={{
            backgroundColor: `${statusColor}30`,
            color: statusColor
          }}
        >
          +{minutes}m
        </motion.div>
      )}
    </motion.div>
  );
};

export default CountdownTimer;

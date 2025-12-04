import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShoppingCart } from 'lucide-react';

export default function HookahFlavorCard({ flavor, isSelected, onSelect, useThemeStore }) {
  const [isHovered, setIsHovered] = useState(false);
  const palette = useThemeStore?.getPalette?.();

  const categoryColors = {
    frutas: 'bg-red-500/20 border-red-500/50 text-red-400',
    mentol: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
    especial: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    classico: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    premium: 'bg-pink-500/20 border-pink-500/50 text-pink-400',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, translateY: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
        isSelected ? 'border-orange-500 shadow-lg' : 'border-gray-700 hover:border-gray-600'
      }`}
      onClick={() => onSelect(flavor)}
    >
      {/* Background Image */}
      {flavor.image && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${flavor.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />

      {/* Content */}
      <div className="relative p-4 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{flavor.name}</h3>
            <p className={`text-xs px-2 py-1 rounded-full border ${categoryColors[flavor.category] || categoryColors.classico}`}>
              {flavor.category}
            </p>
          </div>

          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 p-2 bg-orange-500 rounded-full"
            >
              <Check size={18} className="text-white" />
            </motion.div>
          )}
        </div>

        {/* Description */}
        {flavor.description && (
          <p className="text-xs text-gray-300 line-clamp-2 mb-3">{flavor.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400">Preço Base</p>
            <p className="text-xl font-bold text-white">
              R$ {parseFloat(flavor.price).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">30 minutos</p>
          </div>

          {/* Stats */}
          <div className="text-right">
            {flavor.popularity > 0 && (
              <div className="text-xs text-amber-400 mb-1">
                ⭐ {flavor.popularity} sessões
              </div>
            )}

            {flavor.rating > 0 && (
              <div className="text-xs text-yellow-400">
                ⭐ {flavor.rating.toFixed(1)}
              </div>
            )}
          </div>
        </div>

        {/* Hover Action */}
        {isHovered && !isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 flex items-center justify-center"
          >
            <ShoppingCart size={32} className="text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

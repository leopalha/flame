import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Edit2 } from 'lucide-react';
import Image from 'next/image';

/**
 * FLAME CartItem Component
 *
 * Displays a single item in the shopping cart with quantity controls
 */

const CartItem = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onEdit,
  showImage = true,
  showNotes = true,
  compact = false,
  className = '',
}) => {
  const {
    id,
    name,
    price,
    quantity,
    image,
    notes,
    options = [],
  } = item;

  const total = (price * quantity).toFixed(2);

  if (compact) {
    return (
      <div className={`flex items-center justify-between py-2 ${className}`}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--theme-primary)]">
            {quantity}x
          </span>
          <span className="text-sm text-white">{name}</span>
        </div>
        <span className="text-sm text-gray-400">R$ {total}</span>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`
        flex gap-4 p-4
        bg-gradient-to-br from-gray-800/50 to-gray-900/50
        border border-white/5 rounded-xl
        ${className}
      `}
    >
      {/* Image */}
      {showImage && image && (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name and Price */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-white truncate">{name}</h4>
          <span className="text-[var(--theme-primary)] font-semibold whitespace-nowrap">
            R$ {total}
          </span>
        </div>

        {/* Unit price */}
        <p className="text-sm text-gray-400 mt-0.5">
          R$ {price.toFixed(2)} cada
        </p>

        {/* Options */}
        {options.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {options.map((opt, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300"
              >
                {opt}
              </span>
            ))}
          </div>
        )}

        {/* Notes */}
        {showNotes && notes && (
          <p className="text-sm text-gray-500 mt-2 italic">
            &quot;{notes}&quot;
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDecrement?.(id)}
              disabled={quantity <= 1}
              className="
                w-8 h-8 flex items-center justify-center
                rounded-lg bg-white/5 hover:bg-white/10
                text-gray-400 hover:text-white
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-10 text-center text-white font-medium">
              {quantity}
            </span>

            <button
              onClick={() => onIncrement?.(id)}
              className="
                w-8 h-8 flex items-center justify-center
                rounded-lg bg-white/5 hover:bg-white/10
                text-gray-400 hover:text-white
                transition-colors
              "
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Edit and Remove */}
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit?.(item)}
                className="
                  p-2 rounded-lg
                  text-gray-400 hover:text-white hover:bg-white/10
                  transition-colors
                "
                aria-label="Editar item"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onRemove?.(id)}
              className="
                p-2 rounded-lg
                text-gray-400 hover:text-red-400 hover:bg-red-500/10
                transition-colors
              "
              aria-label="Remover item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Cart Summary Component
export const CartSummary = ({
  subtotal,
  discount = 0,
  cashbackUsed = 0,
  deliveryFee = 0,
  total,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-gray-400">
        <span>Subtotal</span>
        <span>R$ {subtotal.toFixed(2)}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-green-400">
          <span>Desconto</span>
          <span>- R$ {discount.toFixed(2)}</span>
        </div>
      )}

      {cashbackUsed > 0 && (
        <div className="flex justify-between text-[var(--theme-primary)]">
          <span>Cashback usado</span>
          <span>- R$ {cashbackUsed.toFixed(2)}</span>
        </div>
      )}

      {deliveryFee > 0 && (
        <div className="flex justify-between text-gray-400">
          <span>Taxa de entrega</span>
          <span>R$ {deliveryFee.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between pt-2 border-t border-white/10">
        <span className="text-lg font-semibold text-white">Total</span>
        <span className="text-lg font-bold text-[var(--theme-primary)]">
          R$ {total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default CartItem;

import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
  Truck,
  Package,
  AlertCircle,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

/**
 * FLAME OrderCard Component
 *
 * Displays order information in a card format
 */

// Status configuration
const STATUS_CONFIG = {
  pending: {
    label: 'Pendente',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmado',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    icon: CheckCircle,
  },
  preparing: {
    label: 'Preparando',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    icon: ChefHat,
  },
  ready: {
    label: 'Pronto',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    icon: Package,
  },
  on_way: {
    label: 'A caminho',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    icon: Truck,
  },
  delivered: {
    label: 'Entregue',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    icon: XCircle,
  },
};

const OrderCard = ({
  order,
  onClick,
  showItems = true,
  showActions = false,
  onViewDetails,
  onReorder,
  onRate,
  variant = 'default',
  className = '',
}) => {
  const {
    id,
    orderNumber,
    status,
    items = [],
    totalAmount,
    createdAt,
    tableNumber,
    consumptionType,
    paymentMethod,
  } = order;

  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format consumption type
  const consumptionLabels = {
    table: 'Mesa',
    counter: 'Balcão',
    delivery: 'Delivery',
  };

  const content = (
    <motion.div
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      className={`
        p-4 rounded-xl
        bg-gradient-to-br from-gray-800/50 to-gray-900/50
        border ${statusConfig.borderColor}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-200
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              #{orderNumber || (typeof id === 'string' ? id.slice(0, 8) : id)}
            </span>
            {tableNumber && (
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Mesa {tableNumber}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-0.5">
            {formatDate(createdAt)}
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={`
            flex items-center gap-1.5
            px-3 py-1 rounded-full
            ${statusConfig.bgColor}
          `}
        >
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
          <span className={`text-sm font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Items preview */}
      {showItems && items.length > 0 && (
        <div className="mb-3 py-3 border-y border-white/5">
          {items.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm py-1"
            >
              <span className="text-gray-300">
                <span className="text-[var(--theme-primary)] font-medium">
                  {item.quantity}x
                </span>{' '}
                {item.name || item.product?.name}
              </span>
              <span className="text-gray-400">
                R$ {((item.price || item.unitPrice) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-gray-500 mt-1">
              +{items.length - 3} {items.length - 3 === 1 ? 'item' : 'itens'}
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {consumptionType && (
            <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">
              {consumptionLabels[consumptionType] || consumptionType}
            </span>
          )}
          {paymentMethod && (
            <span className="text-xs text-gray-500">
              {paymentMethod === 'pix' && 'PIX'}
              {paymentMethod === 'card' && 'Cartão'}
              {paymentMethod === 'cash' && 'Dinheiro'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[var(--theme-primary)]">
            R$ {parseFloat(totalAmount).toFixed(2)}
          </span>
          {onClick && (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
          {onViewDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(order);
              }}
              className="flex-1 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Ver detalhes
            </button>
          )}
          {status === 'delivered' && onRate && !order.rating && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRate(order);
              }}
              className="flex-1 py-2 text-sm font-medium text-[var(--theme-primary)] hover:text-white transition-colors"
            >
              Avaliar
            </button>
          )}
          {status === 'delivered' && onReorder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReorder(order);
              }}
              className="
                flex-1 py-2 text-sm font-medium
                bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]
                text-white rounded-lg
                hover:opacity-90 transition-opacity
              "
            >
              Pedir novamente
            </button>
          )}
        </div>
      )}
    </motion.div>
  );

  // Wrap with Link if has id and onClick not provided
  if (id && !onClick && variant === 'default') {
    return (
      <Link href={`/pedido/${id}`}>
        {content}
      </Link>
    );
  }

  return content;
};

// Order Status Badge standalone component
export const OrderStatusBadge = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5
        ${sizes[size]}
        rounded-full
        ${config.bgColor}
      `}
    >
      <Icon className={`${iconSizes[size]} ${config.color}`} />
      <span className={`font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

export default OrderCard;

import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Calendar,
  Users,
  FileText,
  Search,
  Inbox,
  AlertCircle,
} from 'lucide-react';

/**
 * FLAME EmptyState Component
 *
 * Used to display when there's no data to show
 *
 * Types:
 * - default: Generic empty state
 * - cart: Empty shopping cart
 * - orders: No orders
 * - products: No products
 * - reservations: No reservations
 * - customers: No customers
 * - search: No search results
 * - error: Error state
 */

const EmptyState = ({
  type = 'default',
  title,
  description,
  icon: CustomIcon,
  action,
  actionLabel,
  onAction,
  className = '',
  size = 'md',
}) => {
  // Predefined content based on type
  const presets = {
    default: {
      icon: Inbox,
      title: 'Nenhum dado encontrado',
      description: 'Não há informações para exibir no momento.',
    },
    cart: {
      icon: ShoppingCart,
      title: 'Carrinho vazio',
      description: 'Adicione itens do cardápio ao seu carrinho.',
    },
    orders: {
      icon: Package,
      title: 'Nenhum pedido',
      description: 'Você ainda não fez nenhum pedido.',
    },
    products: {
      icon: Package,
      title: 'Nenhum produto',
      description: 'Não há produtos cadastrados.',
    },
    reservations: {
      icon: Calendar,
      title: 'Nenhuma reserva',
      description: 'Você ainda não tem reservas.',
    },
    customers: {
      icon: Users,
      title: 'Nenhum cliente',
      description: 'Não há clientes cadastrados.',
    },
    search: {
      icon: Search,
      title: 'Nenhum resultado',
      description: 'Tente buscar com outros termos.',
    },
    reports: {
      icon: FileText,
      title: 'Nenhum relatório',
      description: 'Não há dados para gerar relatórios neste período.',
    },
    error: {
      icon: AlertCircle,
      title: 'Erro ao carregar',
      description: 'Ocorreu um erro. Tente novamente.',
    },
  };

  const preset = presets[type] || presets.default;
  const Icon = CustomIcon || preset.icon;
  const displayTitle = title || preset.title;
  const displayDescription = description || preset.description;

  // Size styles
  const sizes = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      iconBg: 'w-20 h-20',
      title: 'text-lg',
      description: 'text-sm',
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      iconBg: 'w-28 h-28',
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      iconBg: 'w-36 h-36',
      title: 'text-2xl',
      description: 'text-lg',
    },
  };

  const sizeStyle = sizes[size] || sizes.md;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center ${sizeStyle.container} ${className}`}
    >
      {/* Icon with gradient background */}
      <div
        className={`
          ${sizeStyle.iconBg}
          flex items-center justify-center
          rounded-full
          bg-gradient-to-br from-gray-800 to-gray-900
          border border-white/10
          mb-6
        `}
      >
        <Icon
          className={`${sizeStyle.icon} text-gray-500`}
          strokeWidth={1.5}
        />
      </div>

      {/* Title */}
      <h3 className={`${sizeStyle.title} font-semibold text-white mb-2`}>
        {displayTitle}
      </h3>

      {/* Description */}
      <p className={`${sizeStyle.description} text-gray-400 max-w-sm mb-6`}>
        {displayDescription}
      </p>

      {/* Action button */}
      {(action || onAction) && (
        <button
          onClick={onAction}
          className="
            px-6 py-2.5
            bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]
            text-white font-medium
            rounded-lg
            transition-all duration-200
            hover:shadow-lg hover:-translate-y-0.5
            focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:ring-offset-2 focus:ring-offset-gray-900
          "
        >
          {actionLabel || action}
        </button>
      )}
    </motion.div>
  );
};

// Inline version for smaller spaces
export const EmptyStateInline = ({
  icon: Icon = Inbox,
  message = 'Nenhum dado encontrado',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 py-8 text-gray-400 ${className}`}>
      <Icon className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
};

export default EmptyState;

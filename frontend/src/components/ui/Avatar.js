import { forwardRef } from 'react';
import { User } from 'lucide-react';

/**
 * FLAME Avatar Component
 *
 * Variants:
 * - default: Avatar padrão com gradiente FLAME
 * - bordered: Com borda gradiente
 *
 * Sizes: xs, sm, md, lg, xl
 */

const Avatar = forwardRef(({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  variant = 'default',
  status,
  className = '',
  ...props
}, ref) => {
  // Size styles
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  // Icon sizes
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
  };

  // Status indicator sizes
  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  // Status colors
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Border styles for variant
  const borderStyles = variant === 'bordered'
    ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-transparent bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] p-[2px]'
    : '';

  return (
    <div className={`relative inline-flex ${className}`} ref={ref} {...props}>
      <div
        className={`
          ${sizes[size]}
          ${borderStyles}
          rounded-full overflow-hidden
          flex items-center justify-center
          bg-gradient-to-br from-gray-700 to-gray-800
        `}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : name ? (
          <span
            className={`
              font-semibold text-white
              bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-secondary)]
              w-full h-full flex items-center justify-center
            `}
          >
            {getInitials(name)}
          </span>
        ) : (
          <User className={`${iconSizes[size]} text-gray-400`} />
        )}
        {/* Fallback for failed image */}
        <span
          className="hidden w-full h-full items-center justify-center font-semibold text-white bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-secondary)]"
        >
          {name ? getInitials(name) : <User className={`${iconSizes[size]} text-white`} />}
        </span>
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${statusColors[status] || statusColors.offline}
            rounded-full
            ring-2 ring-gray-900
          `}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

// Avatar Group Component
export const AvatarGroup = ({
  children,
  max = 3,
  size = 'md',
  className = '',
}) => {
  const avatars = Array.isArray(children) ? children : [children];
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  // Overlap sizes
  const overlapSizes = {
    xs: '-ml-2',
    sm: '-ml-2.5',
    md: '-ml-3',
    lg: '-ml-4',
    xl: '-ml-5',
    '2xl': '-ml-6',
  };

  // Badge sizes
  const badgeSizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  };

  return (
    <div className={`flex items-center ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className={`${index > 0 ? overlapSizes[size] : ''} ring-2 ring-gray-900 rounded-full`}
        >
          {avatar}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            ${overlapSizes[size]}
            ${badgeSizes[size]}
            flex items-center justify-center
            rounded-full
            bg-gray-700 text-white font-medium
            ring-2 ring-gray-900
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;

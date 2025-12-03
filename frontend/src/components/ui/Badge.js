/**
 * FLAME Badge Component
 *
 * Variants:
 * - flame: Gradiente FLAME
 * - magenta: Cor solida magenta
 * - cyan: Cor solida cyan
 * - success/warning/error/info: Semanticos
 * - outline: Apenas borda
 */
const Badge = ({
  children,
  variant = 'flame',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {

  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-full
    transition-all duration-200
  `;

  // Variant styles
  const variants = {
    flame: 'bg-gradient-flame text-white',
    magenta: 'bg-magenta-500 text-white',
    cyan: 'bg-cyan-500 text-black',
    success: 'bg-success-500 text-white',
    warning: 'bg-warning-500 text-black',
    error: 'bg-error-500 text-white',
    info: 'bg-info-500 text-white',
    outline: 'bg-transparent border border-neutral-400 text-neutral-800',
    'outline-magenta': 'bg-transparent border border-magenta-500 text-magenta-500',
    'outline-cyan': 'bg-transparent border border-cyan-500 text-cyan-500',
    neutral: 'bg-neutral-300 text-neutral-900',
  };

  // Size styles
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  // Dot variant (just a circle)
  if (dot) {
    const dotSizes = {
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
    };

    return (
      <span
        className={`
          ${dotSizes[size]}
          rounded-full
          ${variants[variant]}
          ${className}
        `.replace(/\s+/g, ' ').trim()}
        {...props}
      />
    );
  }

  return (
    <span
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

import { forwardRef } from 'react';

/**
 * FLAME Button Component
 *
 * Variants:
 * - primary: Gradiente FLAME (magenta -> cyan)
 * - secondary: Outline magenta
 * - ghost: Transparente com hover
 * - danger: Vermelho para acoes destrutivas
 *
 * Sizes: sm, md, lg
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}, ref) => {

  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98]
  `;

  // Variant styles
  const variants = {
    primary: `
      bg-gradient-flame text-white
      hover:shadow-glow-magenta hover:-translate-y-0.5
      focus:ring-magenta-500
    `,
    secondary: `
      bg-transparent text-magenta-500 border-2 border-magenta-500
      hover:bg-magenta-500/10 hover:shadow-glow-magenta hover:-translate-y-0.5
      focus:ring-magenta-500
    `,
    ghost: `
      bg-transparent text-white/80
      hover:bg-white/10 hover:text-white
      focus:ring-white/50
    `,
    danger: `
      bg-error-500 text-white
      hover:bg-error-600 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-error-500
    `,
    success: `
      bg-success-500 text-white
      hover:bg-success-600 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-success-500
    `,
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthStyles}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          <span>Carregando...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

/**
 * FLAME Spinner Component
 *
 * Variants:
 * - flame: Gradiente animado magenta -> cyan
 * - simple: Spinner simples
 */
const Spinner = ({
  size = 'md',
  variant = 'flame',
  className = '',
  label,
  ...props
}) => {

  // Size styles
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Border sizes
  const borderSizes = {
    xs: 'border-2',
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4',
    xl: 'border-4',
  };

  if (variant === 'flame') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`} {...props}>
        <div className={`${sizes[size]} relative`}>
          {/* Outer ring - cyan */}
          <div
            className={`
              absolute inset-0 rounded-full
              ${borderSizes[size]} border-transparent border-t-cyan-500 border-r-cyan-500
              animate-spin
            `}
            style={{ animationDuration: '1s' }}
          />
          {/* Inner ring - magenta */}
          <div
            className={`
              absolute inset-1 rounded-full
              ${borderSizes[size]} border-transparent border-t-magenta-500 border-l-magenta-500
              animate-spin
            `}
            style={{ animationDuration: '0.75s', animationDirection: 'reverse' }}
          />
        </div>
        {label && (
          <span className="text-sm text-neutral-700">{label}</span>
        )}
      </div>
    );
  }

  // Simple variant
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`} {...props}>
      <svg
        className={`animate-spin ${sizes[size]}`}
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
      {label && (
        <span className="text-sm text-neutral-700">{label}</span>
      )}
    </div>
  );
};

// Full page loading overlay
const LoadingOverlay = ({ label = 'Carregando...', ...props }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    {...props}
  >
    <div className="flex flex-col items-center gap-4">
      <Spinner size="xl" variant="flame" />
      <span className="text-lg text-white font-medium">{label}</span>
    </div>
  </div>
);

export default Spinner;
export { Spinner, LoadingOverlay };

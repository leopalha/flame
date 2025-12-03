import { forwardRef } from 'react';

/**
 * FLAME Card Component
 *
 * Variants:
 * - default: Fundo escuro com borda sutil
 * - elevated: Com sombra e hover effect
 * - gradient: Background com gradiente sutil
 * - glass: Glass morphism effect
 */
const Card = forwardRef(({
  children,
  variant = 'default',
  hover = true,
  padding = 'md',
  className = '',
  onClick,
  ...props
}, ref) => {

  // Base styles
  const baseStyles = `
    rounded-2xl
    transition-all duration-300 ease-out
  `;

  // Variant styles
  const variants = {
    default: `
      bg-neutral-100 border border-neutral-300
      ${hover ? 'hover:border-magenta-500/30 hover:shadow-card-hover' : ''}
    `,
    elevated: `
      bg-neutral-100 border border-neutral-300
      shadow-card
      ${hover ? 'hover:shadow-card-hover hover:border-magenta-500/30 hover:-translate-y-1' : ''}
    `,
    gradient: `
      bg-gradient-to-b from-neutral-100 to-neutral-50
      border border-neutral-300
      ${hover ? 'hover:border-magenta-500/30 hover:shadow-card-hover' : ''}
    `,
    glass: `
      bg-neutral-100/60 backdrop-blur-lg
      border border-white/10
      ${hover ? 'hover:bg-neutral-100/80 hover:border-magenta-500/20' : ''}
    `,
    outline: `
      bg-transparent border-2 border-neutral-300
      ${hover ? 'hover:border-magenta-500/50 hover:bg-neutral-100/50' : ''}
    `,
  };

  // Padding styles
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  // Clickable styles
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${clickableStyles}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header subcomponent
const CardHeader = ({ children, className = '', ...props }) => (
  <div
    className={`mb-4 pb-4 border-b border-neutral-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Card Title subcomponent
const CardTitle = ({ children, className = '', ...props }) => (
  <h3
    className={`text-lg font-semibold text-white ${className}`}
    {...props}
  >
    {children}
  </h3>
);

// Card Description subcomponent
const CardDescription = ({ children, className = '', ...props }) => (
  <p
    className={`text-sm text-neutral-700 mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
);

// Card Content subcomponent
const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

// Card Footer subcomponent
const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`mt-4 pt-4 border-t border-neutral-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

import { forwardRef, useState } from 'react';

/**
 * FLAME Input Component
 *
 * Features:
 * - Focus com borda magenta e glow
 * - Suporte a icones esquerda/direita
 * - Estados de erro e sucesso
 * - Label e helper text
 */
const Input = forwardRef(({
  type = 'text',
  label,
  helperText,
  error,
  success,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  inputClassName = '',
  fullWidth = true,
  ...props
}, ref) => {

  const [isFocused, setIsFocused] = useState(false);

  // Container styles
  const containerStyles = fullWidth ? 'w-full' : '';

  // Input wrapper styles
  const wrapperStyles = `
    relative flex items-center
    bg-neutral-100 rounded-lg
    border transition-all duration-300
    ${error
      ? 'border-error-500 focus-within:ring-2 focus-within:ring-error-500/20'
      : success
        ? 'border-success-500 focus-within:ring-2 focus-within:ring-success-500/20'
        : 'border-neutral-300 focus-within:border-magenta-500 focus-within:ring-2 focus-within:ring-magenta-500/20'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  // Input styles
  const inputStyles = `
    w-full bg-transparent
    px-4 py-3
    text-white placeholder-neutral-500
    focus:outline-none
    disabled:cursor-not-allowed
    ${leftIcon ? 'pl-11' : ''}
    ${rightIcon ? 'pr-11' : ''}
  `;

  // Icon styles
  const iconStyles = `
    absolute text-neutral-500
    transition-colors duration-300
    ${isFocused && !error && !success ? 'text-magenta-500' : ''}
    ${error ? 'text-error-500' : ''}
    ${success ? 'text-success-500' : ''}
  `;

  return (
    <div className={`${containerStyles} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-800 mb-2">
          {label}
        </label>
      )}

      <div className={wrapperStyles}>
        {leftIcon && (
          <span className={`${iconStyles} left-3`}>
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={`${inputStyles} ${inputClassName}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && (
          <span className={`${iconStyles} right-3`}>
            {rightIcon}
          </span>
        )}
      </div>

      {(helperText || error) && (
        <p className={`mt-2 text-sm ${error ? 'text-error-500' : success ? 'text-success-500' : 'text-neutral-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea variant
const Textarea = forwardRef(({
  label,
  helperText,
  error,
  success,
  disabled = false,
  className = '',
  rows = 4,
  ...props
}, ref) => {

  const [isFocused, setIsFocused] = useState(false);

  const textareaStyles = `
    w-full bg-neutral-100 rounded-lg
    px-4 py-3
    text-white placeholder-neutral-500
    border transition-all duration-300
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
    resize-none
    ${error
      ? 'border-error-500 focus:ring-2 focus:ring-error-500/20'
      : success
        ? 'border-success-500 focus:ring-2 focus:ring-success-500/20'
        : 'border-neutral-300 focus:border-magenta-500 focus:ring-2 focus:ring-magenta-500/20'
    }
  `;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-800 mb-2">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        disabled={disabled}
        rows={rows}
        className={textareaStyles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {(helperText || error) && (
        <p className={`mt-2 text-sm ${error ? 'text-error-500' : success ? 'text-success-500' : 'text-neutral-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;
export { Input, Textarea };

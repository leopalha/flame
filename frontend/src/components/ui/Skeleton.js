/**
 * FLAME Skeleton Component
 *
 * Loading placeholder com shimmer effect
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  animate = true,
  ...props
}) => {

  // Base styles
  const baseStyles = `
    bg-neutral-200 rounded
    ${animate ? 'animate-pulse' : ''}
  `;

  // Variant styles
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    avatar: 'rounded-full',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  // Default dimensions by variant
  const defaultDimensions = {
    text: { width: '100%', height: '1rem' },
    title: { width: '60%', height: '2rem' },
    avatar: { width: '3rem', height: '3rem' },
    rectangular: { width: '100%', height: '8rem' },
    circular: { width: '3rem', height: '3rem' },
  };

  const finalWidth = width || defaultDimensions[variant]?.width || '100%';
  const finalHeight = height || defaultDimensions[variant]?.height || '1rem';

  return (
    <div
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      style={{
        width: finalWidth,
        height: finalHeight,
      }}
      {...props}
    />
  );
};

// Skeleton Text (multiple lines)
const SkeletonText = ({ lines = 3, className = '', ...props }) => (
  <div className={`space-y-2 ${className}`} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '60%' : '100%'}
      />
    ))}
  </div>
);

// Skeleton Card (product card placeholder)
const SkeletonCard = ({ className = '', ...props }) => (
  <div
    className={`bg-neutral-100 border border-neutral-300 rounded-2xl p-4 ${className}`}
    {...props}
  >
    <Skeleton variant="rectangular" height="10rem" className="mb-4" />
    <Skeleton variant="title" width="70%" className="mb-2" />
    <Skeleton variant="text" width="40%" className="mb-4" />
    <div className="flex justify-between items-center">
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="rectangular" width="5rem" height="2.5rem" />
    </div>
  </div>
);

// Skeleton Avatar with text
const SkeletonAvatar = ({ withText = true, className = '', ...props }) => (
  <div className={`flex items-center gap-3 ${className}`} {...props}>
    <Skeleton variant="avatar" width="3rem" height="3rem" />
    {withText && (
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" height="0.75rem" />
      </div>
    )}
  </div>
);

// Skeleton Table Row
const SkeletonTableRow = ({ columns = 4, className = '', ...props }) => (
  <div className={`flex items-center gap-4 py-3 ${className}`} {...props}>
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === 0 ? '30%' : `${100 / columns}%`}
      />
    ))}
  </div>
);

export default Skeleton;
export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonTableRow };

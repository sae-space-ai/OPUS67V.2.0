/**
 * OPUS67 — Spectral Line Component
 * 
 * The signature visual element of OPUS67.
 * A thin luminous line that transitions through the spectral palette.
 * Used for active borders, navigation highlights, process indicators.
 */

interface SpectralLineProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'thin' | 'accent';
  className?: string;
  animated?: boolean;
}

export function SpectralLine({
  orientation = 'horizontal',
  variant = 'thin',
  className = '',
  animated = true,
}: SpectralLineProps) {
  const baseClasses = orientation === 'horizontal' 
    ? 'w-full h-px' 
    : 'h-full w-px';

  const variantClasses = variant === 'accent' 
    ? 'h-0.5 opacity-90' 
    : 'opacity-60';

  const animationClass = animated ? 'spectral-line' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${animationClass} ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Spectral border wrapper for cards and containers
 */
export function SpectralBorder({
  children,
  position = 'top',
  className = '',
}: {
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}) {
  const positionClasses = {
    top: 'top-0 left-0 right-0 h-px',
    bottom: 'bottom-0 left-0 right-0 h-px',
    left: 'top-0 bottom-0 left-0 w-px',
    right: 'top-0 bottom-0 right-0 w-px',
  };

  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        className={`absolute ${positionClasses[position]} spectral-line`}
        aria-hidden="true"
      />
    </div>
  );
}

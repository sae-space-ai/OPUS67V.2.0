/**
 * OPUS67 — Logo Component
 * 
 * Wordmark with chromatic treatment: OPUS in ice, 67 in spectral accent.
 * Supports multiple sizes and monogram variant (O67).
 */

import type { ReactNode } from 'react';

interface OpusLogoProps {
  variant?: 'full' | 'monogram' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export function OpusLogo({
  variant = 'full',
  size = 'md',
  showTagline = false,
  className = '',
}: OpusLogoProps) {
  const sizes = {
    sm: { main: 'text-base', sub: 'text-base', tag: 'text-[8px]' },
    md: { main: 'text-xl', sub: 'text-xl', tag: 'text-[9px]' },
    lg: { main: 'text-3xl', sub: 'text-3xl', tag: 'text-[10px]' },
    xl: { main: 'text-5xl', sub: 'text-5xl', tag: 'text-xs' },
  };

  const s = sizes[size];

  if (variant === 'monogram') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="relative">
          <span className={`${s.main} font-bold tracking-tight text-ice`}>
            O
          </span>
          <span className={`${s.sub} font-bold tracking-tight text-spectral`}>
            67
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-baseline gap-0.5 ${className}`}>
        <span className={`${s.main} font-bold tracking-tight text-ice`}>
          OPUS
        </span>
        <span className={`${s.sub} font-bold tracking-tight text-spectral`}>
          67
        </span>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline gap-0.5">
        <span className={`${s.main} font-bold tracking-tight text-ice`}>
          OPUS
        </span>
        <span className={`${s.sub} font-bold tracking-tight text-spectral`}>
          67
        </span>
      </div>
      {showTagline && (
        <span className={`${s.tag} uppercase tracking-[0.2em] text-muted font-medium mt-0.5`}>
          AI Systems Platform
        </span>
      )}
    </div>
  );
}

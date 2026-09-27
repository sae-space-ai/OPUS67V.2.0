/**
 * OPUS67 — Shared UI Components
 * 
 * Uses OPUS67 SPECTRAL SYSTEM design tokens.
 */

import type { ReactNode } from 'react';
import { capitalize } from '../../lib/utils';

// ============================================================
// Status Badge — SPECTRAL SYSTEM
// ============================================================

export function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    active: 'bg-spectral/10 text-spectral border-spectral/30',
    available: 'bg-spectral/10 text-spectral border-spectral/30',
    operational: 'bg-spectral/10 text-spectral border-spectral/30',
    configured: 'bg-spectral/10 text-spectral border-spectral/30',
    connected: 'bg-spectral/10 text-spectral border-spectral/30',
    approved: 'bg-spectral/10 text-spectral border-spectral/30',
    
    draft: 'bg-graphite-light text-steel border-graphite-lighter',
    paused: 'bg-amber/10 text-amber border-amber/30',
    configuration_required: 'bg-amber/10 text-amber border-amber/30',
    under_review: 'bg-amber/10 text-amber border-amber/30',
    ongoing: 'bg-amber/10 text-amber border-amber/30',
    
    disabled: 'bg-coral/10 text-coral border-coral/30',
    error: 'bg-coral/10 text-coral border-coral/30',
    failed: 'bg-coral/10 text-coral border-coral/30',
    rejected: 'bg-coral/10 text-coral border-coral/30',
    suspended: 'bg-coral/10 text-coral border-coral/30',
    unacceptable: 'bg-coral/10 text-coral border-coral/30',
    
    running: 'bg-ion/10 text-ion border-ion/30',
    queued: 'bg-graphite-light text-steel border-graphite-lighter',
    cancelled: 'bg-graphite-light text-steel border-graphite-lighter',
    
    unverified: 'bg-graphite-light text-steel border-graphite-lighter',
    system_generated: 'bg-ion/10 text-ion border-ion/30',
    source_verified: 'bg-ion/10 text-ion border-ion/30',
    human_reviewed: 'bg-ultra/10 text-ultra border-ultra/30',
    
    registered: 'bg-graphite-light text-steel border-graphite-lighter',
    minimal: 'bg-spectral/10 text-spectral border-spectral/30',
    limited: 'bg-amber/10 text-amber border-amber/30',
    high: 'bg-coral/10 text-coral border-coral/30',
  };

  const colorClasses = colorMap[status] || 'bg-graphite-light text-steel border-graphite-lighter';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${colorClasses}`}
    >
      {capitalize(status)}
    </span>
  );
}

// ============================================================
// Empty State — SPECTRAL SYSTEM
// ============================================================

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-graphite-light border border-graphite-lighter flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-steel"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-ice mb-1">{title}</h3>
      <p className="text-sm text-steel max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ============================================================
// Card — SPECTRAL SYSTEM
// ============================================================

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`spectral-card ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================================
// Page Header — SPECTRAL SYSTEM
// ============================================================

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-ice">{title}</h2>
        {description && (
          <p className="text-sm text-steel mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================================
// Button — SPECTRAL SYSTEM
// ============================================================

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spectral focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian';

  const variants = {
    primary: 'bg-spectral text-obsidian hover:bg-spectral-dim disabled:opacity-50',
    secondary: 'bg-graphite-light text-ice hover:bg-graphite-lighter border border-graphite-lighter disabled:opacity-50',
    ghost: 'text-steel hover:text-ice hover:bg-graphite-light disabled:opacity-50',
    danger: 'bg-coral/10 text-coral hover:bg-coral/20 border border-coral/30 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ============================================================
// Stat Card — SPECTRAL SYSTEM
// ============================================================

export function StatCard({
  label,
  value,
  status,
}: {
  label: string;
  value: string | number;
  status?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-steel uppercase tracking-wider">{label}</span>
        {status && <StatusBadge status={status} />}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold text-ice">{value}</span>
      </div>
    </Card>
  );
}

// ============================================================
// Configuration Required Banner — SPECTRAL SYSTEM
// ============================================================

export function ConfigBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-amber/5 border border-amber/30 text-amber text-sm">
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

/**
 * OPUS67 — Shared UI Components
 */

import type { ReactNode } from 'react';
import { getStatusColor, capitalize } from '../../lib/utils';

// ============================================================
// Status Badge
// ============================================================

export function StatusBadge({ status }: { status: string }) {
  const colorClasses = getStatusColor(status);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      {capitalize(status)}
    </span>
  );
}

// ============================================================
// Empty State
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
      <div className="w-12 h-12 rounded-full bg-opus-700 flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-opus-400"
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
      <h3 className="text-sm font-medium text-opus-200 mb-1">{title}</h3>
      <p className="text-sm text-opus-400 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ============================================================
// Card
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
      className={`bg-opus-800 border border-opus-700 rounded-xl ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================================
// Page Header
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
        <h2 className="text-xl font-semibold text-opus-100">{title}</h2>
        {description && (
          <p className="text-sm text-opus-400 mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================================
// Button
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
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-opus-900';

  const variants = {
    primary: 'bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-50',
    secondary: 'bg-opus-700 text-opus-200 hover:bg-opus-600 border border-opus-600 disabled:opacity-50',
    ghost: 'text-opus-300 hover:text-opus-100 hover:bg-opus-700 disabled:opacity-50',
    danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 disabled:opacity-50',
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
// Stat Card
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
        <span className="text-xs text-opus-400 uppercase tracking-wider">{label}</span>
        {status && <StatusBadge status={status} />}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-semibold text-opus-100">{value}</span>
      </div>
    </Card>
  );
}

// ============================================================
// Configuration Required Banner
// ============================================================

export function ConfigBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-300 text-sm">
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

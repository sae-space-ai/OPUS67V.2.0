/**
 * OPUS67 — Utility Functions
 */

/**
 * Generate a unique ID (UUID v4 format)
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Format a date string for display
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a relative time string
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    draft: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    paused: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    disabled: 'text-red-400 bg-red-400/10 border-red-400/20',
    available: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    configuration_required: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    error: 'text-red-400 bg-red-400/10 border-red-400/20',
    completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    running: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    queued: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    failed: 'text-red-400 bg-red-400/10 border-red-400/20',
    cancelled: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    approved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
    unverified: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    human_reviewed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    registered: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    under_review: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    suspended: 'text-red-400 bg-red-400/10 border-red-400/20',
    minimal: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    limited: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    unacceptable: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return colors[status] || 'text-slate-400 bg-slate-400/10 border-slate-400/20';
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Generate a simple hash for demonstration (not cryptographic)
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * OPUS67 — Auth Module Exports
 */

export { authService, getAuthConfig, isAuthOperational } from './supabase-auth';
export { AuthProvider, useAuth } from './context';
export type { AuthStatus, AuthConfig } from './supabase-auth';

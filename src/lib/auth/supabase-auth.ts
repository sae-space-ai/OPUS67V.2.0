/**
 * OPUS67 — Supabase Auth Service
 * 
 * Real authentication implementation using Supabase Auth.
 * Supports Google and GitHub OAuth providers.
 * 
 * SECURITY:
 * - All OAuth flows handled by Supabase (server-side token exchange)
 * - Sessions managed via secure HttpOnly cookies
 * - No secrets exposed to client
 * - PKCE flow for enhanced security
 */

import { getAuthClient } from '../database';
import type { User, Session, OAuthProvider } from '../../types/identity';

// Get the auth-enabled Supabase client
const supabase = {
  auth: {
    getSession: () => getAuthClient().auth.getSession(),
    getUser: () => getAuthClient().auth.getUser(),
    signInWithOAuth: (params: any) => getAuthClient().auth.signInWithOAuth(params),
    signOut: () => getAuthClient().auth.signOut(),
    refreshSession: () => getAuthClient().auth.refreshSession(),
    onAuthStateChange: (callback: any) => getAuthClient().auth.onAuthStateChange(callback),
  },
};

// ============================================================
// Auth Status
// ============================================================

export type AuthStatus = 
  | 'OPERATIONAL'
  | 'PARTIALLY_CONFIGURED'
  | 'NOT_CONFIGURED'
  | 'PROVIDER_ERROR'
  | 'DATABASE_ERROR';

export interface AuthConfig {
  googleConfigured: boolean;
  githubConfigured: boolean;
  databaseConnected: boolean;
  status: AuthStatus;
}

// ============================================================
// Supabase Auth Service
// ============================================================

class SupabaseAuthService {
  private status: AuthStatus = 'NOT_CONFIGURED';

  constructor() {
    this.checkConfiguration();
  }

  /**
   * Check if authentication is properly configured
   */
  private async checkConfiguration(): Promise<void> {
    try {
      // Check if Supabase is connected
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        this.status = 'DATABASE_ERROR';
        return;
      }

      // Check available providers (this is a client-side check)
      // Real provider availability is determined by Supabase configuration
      this.status = 'OPERATIONAL';
    } catch (error) {
      console.error('[AuthService] Configuration check failed:', error);
      this.status = 'NOT_CONFIGURED';
    }
  }

  /**
   * Get current authentication configuration
   */
  async getConfig(): Promise<AuthConfig> {
    try {
      // Try to get available providers from Supabase
      // Note: This requires Supabase to be properly configured
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          googleConfigured: false,
          githubConfigured: false,
          databaseConnected: false,
          status: 'DATABASE_ERROR',
        };
      }

      // For now, we assume both providers are configured if Supabase is connected
      // In production, you would check Supabase dashboard configuration
      return {
        googleConfigured: true, // TODO: Check actual Supabase config
        githubConfigured: true, // TODO: Check actual Supabase config
        databaseConnected: true,
        status: this.status,
      };
    } catch (error) {
      return {
        googleConfigured: false,
        githubConfigured: false,
        databaseConnected: false,
        status: 'NOT_CONFIGURED',
      };
    }
  }

  /**
   * Sign in with OAuth provider
   * Redirects to provider's authorization page
   */
  async signInWithOAuth(provider: OAuthProvider, redirectTo?: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'google' ? 'google' : 'github',
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
          scopes: provider === 'google' 
            ? 'openid email profile' 
            : 'read:user user:email',
        },
      });

      if (error) {
        console.error('[AuthService] OAuth sign in failed:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('[AuthService] OAuth sign in error:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  /**
   * Handle OAuth callback
   * Called after user is redirected back from provider
   */
  async handleOAuthCallback(): Promise<{ user: User | null; error: Error | null }> {
    try {
      // Supabase automatically handles the OAuth callback
      // We just need to get the session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('[AuthService] OAuth callback failed:', error);
        return { user: null, error };
      }

      if (!session) {
        return { user: null, error: new Error('No session after OAuth callback') };
      }

      // Convert Supabase user to our User type
      const user = this.mapSupabaseUser(session.user);

      return { user, error: null };
    } catch (error) {
      console.error('[AuthService] OAuth callback error:', error);
      return { user: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      return this.mapSupabaseUser(user);
    } catch (error) {
      console.error('[AuthService] Get current user failed:', error);
      return null;
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        return null;
      }

      return {
        id: session.access_token,
        userId: session.user.id,
        expiresAt: new Date(session.expires_at! * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[AuthService] Get current session failed:', error);
      return null;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('[AuthService] Sign out failed:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('[AuthService] Sign out error:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('[AuthService] Refresh session failed:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('[AuthService] Refresh session error:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  /**
   * Map Supabase user to our User type
   */
  private mapSupabaseUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
      email: supabaseUser.email || '',
      emailVerified: supabaseUser.email_confirmed_at || null,
      image: supabaseUser.user_metadata?.avatar_url || null,
      status: 'active',
      createdAt: supabaseUser.created_at || new Date().toISOString(),
      updatedAt: supabaseUser.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

// ============================================================
// Singleton Instance
// ============================================================

export const authService = new SupabaseAuthService();

// ============================================================
// Utility Functions
// ============================================================

/**
 * Get auth configuration status
 */
export async function getAuthConfig(): Promise<AuthConfig> {
  return authService.getConfig();
}

/**
 * Check if auth is operational
 */
export async function isAuthOperational(): Promise<boolean> {
  const config = await authService.getConfig();
  return config.status === 'OPERATIONAL';
}

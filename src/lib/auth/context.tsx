/**
 * OPUS67 — Auth Context
 * 
 * React context for authentication state management using Supabase Auth.
 * Provides auth state and methods to components.
 * 
 * IMPLEMENTATION:
 * - Uses Supabase Auth for OAuth (Google, GitHub)
 * - Sessions managed via Supabase (HttpOnly cookies)
 * - Real-time auth state changes
 * - Protected route support
 * 
 * CURRENT STATUS:
 * - Context defined ✅
 * - Provider component ✅
 * - Hook for consuming context ✅
 * - Supabase Auth integration ✅
 * - Real authentication ✅ (requires Supabase configuration)
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Session, OAuthProvider, AuthState } from '../../types/identity';
import { authService } from './supabase-auth';

// ============================================================
// Auth Context Type
// ============================================================

interface AuthContextType {
  // State
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Methods
  loginWithOAuth: (provider: OAuthProvider) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// ============================================================
// Auth Context
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// Auth Provider Component
// ============================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    async function initAuth() {
      try {
        setIsLoading(true);
        
        // Fetch current user and session from server
        const [currentUser, currentSession] = await Promise.all([
          authService.getCurrentUser(),
          authService.getCurrentSession(),
        ]);
        
        setUser(currentUser);
        setSession(currentSession);
      } catch (error) {
        console.error('[AuthProvider] Failed to initialize auth:', error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    initAuth();
  }, []);

  // Login with OAuth provider
  async function loginWithOAuth(provider: OAuthProvider) {
    try {
      const { error } = await authService.signInWithOAuth(provider);
      if (error) {
        throw error;
      }
      // After this, browser will redirect to OAuth provider
      // On return, useEffect will re-fetch auth state
    } catch (error) {
      console.error('[AuthProvider] Login failed:', error);
      throw error;
    }
  }

  // Logout
  async function logout() {
    try {
      const { error } = await authService.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setSession(null);
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('[AuthProvider] Logout failed:', error);
      throw error;
    }
  }

  // Refresh session
  async function refreshSession() {
    try {
      await authService.refreshSession();
      // Re-fetch user and session
      const [currentUser, currentSession] = await Promise.all([
        authService.getCurrentUser(),
        authService.getCurrentSession(),
      ]);
      setUser(currentUser);
      setSession(currentSession);
    } catch (error) {
      console.error('[AuthProvider] Session refresh failed:', error);
      throw error;
    }
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: user !== null && session !== null,
    loginWithOAuth,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================
// useAuth Hook
// ============================================================

/**
 * Hook to access auth context
 * 
 * Usage:
 * const { user, isAuthenticated, loginWithOAuth, logout } = useAuth();
 */

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// ============================================================
// Usage Example
// ============================================================

/**
 * Example component using auth:
 * 
 * function UserProfile() {
 *   const { user, isAuthenticated, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <div>Please log in</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {user.name}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 */

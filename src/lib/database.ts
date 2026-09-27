/**
 * OPUS67 — PostgreSQL Database Layer (Supabase)
 * 
 * Real PostgreSQL connection via Supabase client.
 * 
 * STATUS: CODE READY, CONFIGURATION REQUIRED
 * 
 * Required environment variables:
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_ANON_KEY: Supabase anonymous key (public)
 * - SUPABASE_SERVICE_KEY: Supabase service role key (server-side only)
 * 
 * Health states:
 * - NOT_CONFIGURED: Environment variables missing
 * - CONNECTING: Attempting connection
 * - OPERATIONAL: Connection successful, queries working
 * - DEGRADED: Connection exists but queries failing
 * - ERROR: Connection failed
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ============================================================
// Database Status Types
// ============================================================

export type DatabaseStatus = 
  | 'NOT_CONFIGURED'
  | 'CONNECTING'
  | 'OPERATIONAL'
  | 'DEGRADED'
  | 'ERROR';

export interface DatabaseHealth {
  status: DatabaseStatus;
  message: string;
  lastChecked: string;
  latency?: number;
  error?: string;
}

// ============================================================
// Environment Configuration
// ============================================================

interface DatabaseConfig {
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
  supabaseServiceKey: string | undefined;
}

function getDatabaseConfig(): DatabaseConfig {
  // In Vite, environment variables are accessed via import.meta.env
  // In production, these would be set in Vercel environment variables
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabaseServiceKey: import.meta.env.VITE_SUPABASE_SERVICE_KEY,
  };
}

// ============================================================
// Database Client
// ============================================================

class DatabaseClient {
  private client: SupabaseClient | null = null;
  private status: DatabaseStatus = 'NOT_CONFIGURED';
  private lastHealth: DatabaseHealth | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const config = getDatabaseConfig();

    // Check if configuration is complete
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      this.status = 'NOT_CONFIGURED';
      this.lastHealth = {
        status: 'NOT_CONFIGURED',
        message: 'Database not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        lastChecked: new Date().toISOString(),
      };
      return;
    }

    // Create Supabase client
    this.status = 'CONNECTING';
    
    // Use service key if available (server-side), otherwise anon key (client-side)
    const accessToken = config.supabaseServiceKey || config.supabaseAnonKey;
    
    this.client = createClient(config.supabaseUrl, accessToken, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Perform initial health check
    this.checkHealth();
  }

  /**
   * Get Supabase client instance
   * Returns null if not configured
   */
  getClient(): SupabaseClient | null {
    return this.client;
  }

  /**
   * Check if database is configured
   */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * Get current database status
   */
  getStatus(): DatabaseStatus {
    return this.status;
  }

  /**
   * Get last health check result
   */
  getHealth(): DatabaseHealth {
    return this.lastHealth || {
      status: this.status,
      message: 'No health check performed yet',
      lastChecked: new Date().toISOString(),
    };
  }

  /**
   * Perform health check
   * Tests actual database connectivity with a real query
   */
  async checkHealth(): Promise<DatabaseHealth> {
    const startTime = Date.now();

    if (!this.client) {
      this.status = 'NOT_CONFIGURED';
      this.lastHealth = {
        status: 'NOT_CONFIGURED',
        message: 'Database client not initialized',
        lastChecked: new Date().toISOString(),
      };
      return this.lastHealth;
    }

    try {
      // Real health check: query the database
      const { data, error } = await this.client
        .from('health_check')
        .select('count')
        .limit(1);

      const latency = Date.now() - startTime;

      if (error) {
        // Table might not exist yet, but connection is working
        if (error.message.includes('does not exist') || error.code === '42P01') {
          this.status = 'OPERATIONAL';
          this.lastHealth = {
            status: 'OPERATIONAL',
            message: 'Database connected. Schema migration required.',
            lastChecked: new Date().toISOString(),
            latency,
          };
        } else {
          this.status = 'DEGRADED';
          this.lastHealth = {
            status: 'DEGRADED',
            message: 'Database connected but query failed',
            lastChecked: new Date().toISOString(),
            latency,
            error: error.message,
          };
        }
      } else {
        this.status = 'OPERATIONAL';
        this.lastHealth = {
          status: 'OPERATIONAL',
          message: 'Database operational',
          lastChecked: new Date().toISOString(),
          latency,
        };
      }

      return this.lastHealth;
    } catch (error) {
      const latency = Date.now() - startTime;
      this.status = 'ERROR';
      this.lastHealth = {
        status: 'ERROR',
        message: 'Database connection failed',
        lastChecked: new Date().toISOString(),
        latency,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      return this.lastHealth;
    }
  }

  /**
   * Execute a select query
   */
  async select<T>(tableName: string, where?: Record<string, any>): Promise<{ data: T[] | null; error: string | null }> {
    if (!this.client) {
      return { data: null, error: 'Database not configured' };
    }

    try {
      let query = this.client.from(tableName).select('*');
      
      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as T[], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute an insert query
   */
  async insert<T>(tableName: string, data: Record<string, any>): Promise<{ data: T | null; error: string | null }> {
    if (!this.client) {
      return { data: null, error: 'Database not configured' };
    }

    try {
      const { data: result, error } = await this.client.from(tableName).insert(data).select().single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: result as T, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute an update query
   */
  async update<T>(tableName: string, data: Record<string, any>, where: Record<string, any>): Promise<{ data: T | null; error: string | null }> {
    if (!this.client) {
      return { data: null, error: 'Database not configured' };
    }

    try {
      let query = this.client.from(tableName).update(data);
      
      Object.entries(where).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data: result, error } = await query.select().single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: result as T, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute a delete query
   */
  async delete(tableName: string, where: Record<string, any>): Promise<{ error: string | null }> {
    if (!this.client) {
      return { error: 'Database not configured' };
    }

    try {
      let query = this.client.from(tableName).delete();
      
      Object.entries(where).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { error } = await query;

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// ============================================================
// Singleton Instance
// ============================================================

export const database = new DatabaseClient();

// ============================================================
// Utility Functions
// ============================================================

/**
 * Check if database is operational
 */
export function isDatabaseOperational(): boolean {
  return database.getStatus() === 'OPERATIONAL';
}

/**
 * Get database health status
 */
export function getDatabaseHealth(): DatabaseHealth {
  return database.getHealth();
}

/**
 * Get Supabase client directly
 * Used by auth service and other modules that need direct access
 */
export function getSupabaseClient(): SupabaseClient | null {
  return database.getClient();
}

// Create a direct client export for auth
// This client has auth enabled (persistSession, autoRefreshToken)
let authClient: SupabaseClient | null = null;

export function getAuthClient(): SupabaseClient {
  if (authClient) return authClient;
  
  const config = getDatabaseConfig();
  
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error('Supabase not configured for auth');
  }
  
  authClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  
  return authClient;
}

// Export supabase as the auth client for convenience
export const supabase = {
  auth: {
    getSession: () => getAuthClient().auth.getSession(),
    getUser: () => getAuthClient().auth.getUser(),
    signInWithOAuth: (params: any) => getAuthClient().auth.signInWithOAuth(params),
    signOut: () => getAuthClient().auth.signOut(),
    refreshSession: () => getAuthClient().auth.refreshSession(),
    onAuthStateChange: (callback: any) => getAuthClient().auth.onAuthStateChange(callback),
  },
};

/**
 * Refresh database health check
 */
export async function refreshDatabaseHealth(): Promise<DatabaseHealth> {
  return database.checkHealth();
}

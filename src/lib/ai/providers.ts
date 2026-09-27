/**
 * OPUS67 — AI Provider Abstraction Layer
 * 
 * Decoupled provider interface for AI model integration.
 * No actual API calls are made until credentials are configured.
 * 
 * Architecture:
 * - Provider interface defines the contract
 * - Adapters implement specific providers (OpenAI, Anthropic, etc.)
 * - Registry manages available providers
 * - No API keys are hardcoded or exposed to client
 * 
 * Security:
 * - API keys must come from environment variables (server-side only)
 * - Never expose credentials to browser
 * - All provider calls go through server-side API routes (future)
 */

// ============================================================
// Provider Interface
// ============================================================

export interface AIProvider {
  id: string;
  name: string;
  isConfigured(): boolean;
  getModels(): Promise<ModelInfo[]>;
  healthCheck(): Promise<ProviderHealth>;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextWindow?: number;
}

export interface ProviderHealth {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';
  latency?: number;
  error?: string;
  timestamp: string;
}

// ============================================================
// Provider Registry
// ============================================================

class ProviderRegistry {
  private providers: Map<string, AIProvider> = new Map();

  register(provider: AIProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(id: string): AIProvider | undefined {
    return this.providers.get(id);
  }

  getAll(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  getConfiguredProviders(): AIProvider[] {
    return this.getAll().filter((p) => p.isConfigured());
  }

  async checkAllHealth(): Promise<Map<string, ProviderHealth>> {
    const results = new Map<string, ProviderHealth>();
    
    for (const [id, provider] of this.providers) {
      try {
        const health = await provider.healthCheck();
        results.set(id, health);
      } catch (error) {
        results.set(id, {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });
      }
    }
    
    return results;
  }
}

export const providerRegistry = new ProviderRegistry();

// ============================================================
// OpenAI Provider (Stub — requires configuration)
// ============================================================

class OpenAIProvider implements AIProvider {
  id = 'openai';
  name = 'OpenAI';

  isConfigured(): boolean {
    // In production, this would check for OPENAI_API_KEY in environment
    // For now, always returns false (not configured)
    return false;
  }

  async getModels(): Promise<ModelInfo[]> {
    if (!this.isConfigured()) {
      return [];
    }
    
    // Future: Call OpenAI API to get available models
    // For now, return empty array
    return [];
  }

  async healthCheck(): Promise<ProviderHealth> {
    if (!this.isConfigured()) {
      return {
        status: 'not_configured',
        timestamp: new Date().toISOString(),
      };
    }

    // Future: Make actual health check call
    return {
      status: 'healthy',
      latency: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================
// Anthropic Provider (Stub — requires configuration)
// ============================================================

class AnthropicProvider implements AIProvider {
  id = 'anthropic';
  name = 'Anthropic';

  isConfigured(): boolean {
    // In production, this would check for ANTHROPIC_API_KEY in environment
    return false;
  }

  async getModels(): Promise<ModelInfo[]> {
    if (!this.isConfigured()) {
      return [];
    }
    
    return [];
  }

  async healthCheck(): Promise<ProviderHealth> {
    if (!this.isConfigured()) {
      return {
        status: 'not_configured',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      status: 'healthy',
      latency: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================
// Register Providers
// ============================================================

providerRegistry.register(new OpenAIProvider());
providerRegistry.register(new AnthropicProvider());

// ============================================================
// Utility Functions
// ============================================================

export async function getAvailableProviders(): Promise<AIProvider[]> {
  return providerRegistry.getConfiguredProviders();
}

export async function getProviderHealth(): Promise<Map<string, ProviderHealth>> {
  return providerRegistry.checkAllHealth();
}

export function isAnyProviderConfigured(): boolean {
  return providerRegistry.getConfiguredProviders().length > 0;
}

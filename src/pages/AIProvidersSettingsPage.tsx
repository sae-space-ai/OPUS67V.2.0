/**
 * OPUS67 — AI Providers Settings Page
 * 
 * Displays configured AI providers and their status.
 * Allows selection of default provider and models.
 * 
 * STATUS: CODE READY, CONFIGURATION REQUIRED
 * 
 * This page shows:
 * - Provider configuration status
 * - Available models
 * - Health status
 * - Default provider selection
 */

import { useState, useEffect } from 'react';
import { providerRegistry, type AIProvider, type ProviderHealth, type ModelInfo } from '../lib/ai/providers';
import { PageHeader, Card, StatusBadge, Button } from '../components/ui';
import { Brain, RefreshCw, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export function AIProvidersSettingsPage() {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [healthStatus, setHealthStatus] = useState<Map<string, ProviderHealth>>(new Map());
  const [models, setModels] = useState<Map<string, ModelInfo[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      // Get all providers
      const allProviders = providerRegistry.getAll();
      setProviders(allProviders);

      // Check health for all providers
      const health = await providerRegistry.checkAllHealth();
      setHealthStatus(health);

      // Get models for configured providers
      const modelsMap = new Map<string, ModelInfo[]>();
      for (const provider of allProviders) {
        if (provider.isConfigured()) {
          const providerModels = await provider.getModels();
          modelsMap.set(provider.id, providerModels);
        }
      }
      setModels(modelsMap);
    } catch (error) {
      console.error('[AIProvidersSettings] Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      const health = await providerRegistry.checkAllHealth();
      setHealthStatus(health);
    } catch (error) {
      console.error('[AIProvidersSettings] Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'OPERATIONAL':
        return <StatusBadge status="active" />;
      case 'CONFIGURED':
        return <StatusBadge status="configuration_required" />;
      case 'NOT_CONFIGURED':
        return <StatusBadge status="disabled" />;
      case 'ERROR':
        return <StatusBadge status="error" />;
      default:
        return <StatusBadge status="draft" />;
    }
  }

  function getHealthIcon(health?: ProviderHealth) {
    if (!health) return <AlertCircle size={16} className="text-muted" />;
    
    switch (health.status) {
      case 'healthy':
        return <CheckCircle2 size={16} className="text-spectral" />;
      case 'degraded':
        return <AlertCircle size={16} className="text-amber" />;
      case 'unhealthy':
        return <XCircle size={16} className="text-coral" />;
      case 'not_configured':
        return <AlertCircle size={16} className="text-muted" />;
      default:
        return <AlertCircle size={16} className="text-muted" />;
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-spectral mx-auto" />
          <p className="mt-4 text-steel text-sm">Loading AI providers...</p>
        </div>
      </div>
    );
  }

  const configuredCount = providers.filter((p) => p.isConfigured()).length;

  return (
    <div className="min-h-screen bg-obsidian p-6">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="AI Providers"
          description="Configure and manage AI provider integrations"
          action={
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          }
        />

        {/* Summary */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-ice mb-1">Provider Status</h3>
              <p className="text-sm text-steel">
                {configuredCount} of {providers.length} providers configured
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-spectral">{configuredCount}</p>
              <p className="text-xs text-steel">Active</p>
            </div>
          </div>
        </Card>

        {/* Providers List */}
        <div className="space-y-4">
          {providers.map((provider) => {
            const health = healthStatus.get(provider.id);
            const providerModels = models.get(provider.id) || [];

            return (
              <Card key={provider.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-ultra/10 border border-ultra/30 flex items-center justify-center">
                      <Brain size={24} className="text-ultra" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-ice">{provider.name}</h3>
                      <p className="text-xs text-steel font-mono-tech">{provider.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getHealthIcon(health)}
                    {getStatusBadge(provider.status)}
                  </div>
                </div>

                {/* Configuration Status */}
                {!provider.isConfigured() && (
                  <div className="p-4 rounded-lg bg-amber/5 border border-amber/30 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-amber flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber font-medium">Not Configured</p>
                        <p className="text-xs text-steel mt-1">
                          Set <code className="text-spectral">VITE_{provider.id.toUpperCase()}_API_KEY</code> in environment variables
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Health Status */}
                {health && provider.isConfigured() && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-steel mb-2">Health Status</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-graphite/60 border border-graphite-lighter">
                        <p className="text-xs text-steel mb-1">Status</p>
                        <p className="text-sm font-medium text-ice capitalize">{health.status}</p>
                      </div>
                      {health.latency !== undefined && (
                        <div className="p-3 rounded-lg bg-graphite/60 border border-graphite-lighter">
                          <p className="text-xs text-steel mb-1">Latency</p>
                          <p className="text-sm font-medium text-ice">{health.latency}ms</p>
                        </div>
                      )}
                    </div>
                    {health.error && (
                      <div className="mt-2 p-3 rounded-lg bg-coral/5 border border-coral/30">
                        <p className="text-xs text-coral">{health.error}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Available Models */}
                {providerModels.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-steel mb-2">
                      Available Models ({providerModels.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {providerModels.slice(0, 6).map((model) => (
                        <div
                          key={model.id}
                          className="p-3 rounded-lg bg-graphite/40 border border-graphite-lighter"
                        >
                          <p className="text-sm font-medium text-ice">{model.name}</p>
                          <p className="text-xs text-steel font-mono-tech mt-1">{model.id}</p>
                          {model.contextWindow && (
                            <p className="text-xs text-muted mt-1">
                              Context: {model.contextWindow.toLocaleString()} tokens
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    {providerModels.length > 6 && (
                      <p className="text-xs text-steel mt-2">
                        + {providerModels.length - 6} more models
                      </p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Configuration Help */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-ice mb-3">Configuration Help</h3>
          <div className="space-y-3 text-sm text-steel">
            <div>
              <p className="font-medium text-ice mb-1">OpenAI</p>
              <p className="text-xs">
                Get your API key from{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-spectral hover:text-spectral-dim underline"
                >
                  platform.openai.com
                </a>
              </p>
              <p className="text-xs font-mono-tech mt-1">
                VITE_OPENAI_API_KEY=sk-...
              </p>
            </div>
            <div>
              <p className="font-medium text-ice mb-1">Anthropic</p>
              <p className="text-xs">
                Get your API key from{' '}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-spectral hover:text-spectral-dim underline"
                >
                  console.anthropic.com
                </a>
              </p>
              <p className="text-xs font-mono-tech mt-1">
                VITE_ANTHROPIC_API_KEY=sk-ant-...
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/**
 * OPUS67 — System Status Component
 * 
 * Displays real-time status of database and AI providers.
 * Shows OPERATIONAL only when systems are actually working.
 */

import { useState, useEffect } from 'react';
import { database, type DatabaseHealth } from '../lib/database';
import { providerRegistry, type ProviderHealth } from '../lib/ai/providers';
import { Card } from './ui';
import { Database, Brain, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export function SystemStatus() {
  const [dbHealth, setDbHealth] = useState<DatabaseHealth | null>(null);
  const [providerHealth, setProviderHealth] = useState<Map<string, ProviderHealth>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatus();
    // Refresh every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadStatus() {
    setIsLoading(true);
    try {
      // Check database health
      const dbStatus = await database.checkHealth();
      setDbHealth(dbStatus);

      // Check provider health
      const providers = await providerRegistry.checkAllHealth();
      setProviderHealth(providers);
    } catch (error) {
      console.error('[SystemStatus] Failed to load status:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function getDatabaseStatusColor(status: string) {
    switch (status) {
      case 'OPERATIONAL':
        return 'text-spectral border-spectral/30 bg-spectral/5';
      case 'DEGRADED':
        return 'text-amber border-amber/30 bg-amber/5';
      case 'ERROR':
        return 'text-coral border-coral/30 bg-coral/5';
      case 'CONNECTING':
        return 'text-ion border-ion/30 bg-ion/5';
      default:
        return 'text-steel border-graphite-lighter bg-graphite/40';
    }
  }

  function getProviderStatusColor(status: string) {
    switch (status) {
      case 'healthy':
        return 'text-spectral border-spectral/30 bg-spectral/5';
      case 'degraded':
        return 'text-amber border-amber/30 bg-amber/5';
      case 'unhealthy':
        return 'text-coral border-coral/30 bg-coral/5';
      default:
        return 'text-steel border-graphite-lighter bg-graphite/40';
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'OPERATIONAL':
      case 'healthy':
        return <CheckCircle2 size={20} className="text-spectral" />;
      case 'DEGRADED':
      case 'degraded':
        return <AlertCircle size={20} className="text-amber" />;
      case 'ERROR':
      case 'unhealthy':
        return <XCircle size={20} className="text-coral" />;
      case 'CONNECTING':
        return <Loader2 size={20} className="text-ion animate-spin" />;
      default:
        return <AlertCircle size={20} className="text-steel" />;
    }
  }

  if (isLoading && !dbHealth) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-spectral" />
          <span className="ml-2 text-steel">Checking system status...</span>
        </div>
      </Card>
    );
  }

  const configuredProviders = Array.from(providerHealth.entries()).filter(
    ([_, health]) => health.status !== 'not_configured'
  );

  return (
    <div className="space-y-4">
      {/* Database Status */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ion/10 border border-ion/30 flex items-center justify-center">
              <Database size={20} className="text-ion" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ice">Database</h3>
              <p className="text-xs text-steel">PostgreSQL via Supabase</p>
            </div>
          </div>
          {dbHealth && getStatusIcon(dbHealth.status)}
        </div>

        {dbHealth && (
          <div className={`p-4 rounded-lg border ${getDatabaseStatusColor(dbHealth.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium uppercase tracking-wider">
                {dbHealth.status}
              </span>
              {dbHealth.latency !== undefined && (
                <span className="text-xs text-steel">{dbHealth.latency}ms</span>
              )}
            </div>
            <p className="text-xs text-steel">{dbHealth.message}</p>
            {dbHealth.error && (
              <p className="text-xs text-coral mt-2">{dbHealth.error}</p>
            )}
          </div>
        )}
      </Card>

      {/* AI Providers Status */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ultra/10 border border-ultra/30 flex items-center justify-center">
              <Brain size={20} className="text-ultra" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ice">AI Providers</h3>
              <p className="text-xs text-steel">
                {configuredProviders.length} configured
              </p>
            </div>
          </div>
        </div>

        {configuredProviders.length === 0 ? (
          <div className="p-4 rounded-lg border border-graphite-lighter bg-graphite/40">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-steel" />
              <span className="text-sm font-medium text-steel">NOT CONFIGURED</span>
            </div>
            <p className="text-xs text-steel">
              Set provider API keys in environment variables to enable AI functionality.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from(providerHealth.entries()).map(([providerId, health]) => (
              <div
                key={providerId}
                className={`p-3 rounded-lg border ${getProviderStatusColor(health.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(health.status)}
                    <span className="text-sm font-medium text-ice capitalize">
                      {providerId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {health.latency !== undefined && (
                      <span className="text-xs text-steel">{health.latency}ms</span>
                    )}
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {health.status}
                    </span>
                  </div>
                </div>
                {health.error && (
                  <p className="text-xs text-coral mt-2">{health.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

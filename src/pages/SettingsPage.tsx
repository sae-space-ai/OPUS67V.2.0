/**
 * OPUS67 — Settings Page
 * 
 * System configuration and status.
 * Shows environment variable requirements and system status.
 */

import { useAppStore } from '../lib/store';
import { Card, PageHeader, StatusBadge, ConfigBanner } from '../components/ui';
import { Database, Cloud, Key, Shield, FileText } from 'lucide-react';

export function SettingsPage() {
  const { state } = useAppStore();

  const envVars = [
    { name: 'OPENAI_API_KEY', category: 'PROVIDER', required: false, description: 'OpenAI API key for GPT models' },
    { name: 'ANTHROPIC_API_KEY', category: 'PROVIDER', required: false, description: 'Anthropic API key for Claude models' },
    { name: 'DATABASE_URL', category: 'DATABASE', required: false, description: 'PostgreSQL connection string (Neon/Supabase)' },
    { name: 'LOG_LEVEL', category: 'OBSERVABILITY', required: false, description: 'Logging level: debug, info, warn, error' },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        description="System configuration and operational status"
      />

      {/* System Status */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          System Information
        </h3>
        <Card className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-opus-400 mb-1">Service</p>
              <p className="text-sm text-opus-200 font-medium">{state.systemStatus.service}</p>
            </div>
            <div>
              <p className="text-xs text-opus-400 mb-1">Version</p>
              <p className="text-sm text-opus-200 font-medium">{state.systemStatus.version}</p>
            </div>
            <div>
              <p className="text-xs text-opus-400 mb-1">Status</p>
              <StatusBadge status={state.systemStatus.status} />
            </div>
            <div>
              <p className="text-xs text-opus-400 mb-1">Last Updated</p>
              <p className="text-sm text-opus-200">{new Date(state.systemStatus.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Module Status */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          Module Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ModuleStatusCard
            icon={Cloud}
            name="AI Providers"
            status={state.systemStatus.modules.providers}
            description="External AI model providers"
          />
          <ModuleStatusCard
            icon={Database}
            name="Database"
            status={state.systemStatus.modules.database}
            description="PostgreSQL persistence layer"
          />
          <ModuleStatusCard
            icon={Shield}
            name="Agents"
            status={state.systemStatus.modules.agents}
            description="AI agent configuration"
          />
        </div>
      </div>

      {/* Environment Variables */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          Environment Variables
        </h3>
        <ConfigBanner message="Environment variables must be configured in your deployment platform (Vercel) or local .env file. Never commit secrets to version control." />
        
        <Card className="mt-4 divide-y divide-opus-700">
          {envVars.map((envVar) => (
            <div key={envVar.name} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key size={14} className="text-opus-400" />
                <div>
                  <p className="text-sm font-mono text-opus-200">{envVar.name}</p>
                  <p className="text-xs text-opus-400">{envVar.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-opus-500 px-2 py-0.5 rounded bg-opus-700">
                  {envVar.category}
                </span>
                <StatusBadge status={envVar.required ? 'configuration_required' : 'draft'} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Security Info */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          Security
        </h3>
        <Card className="p-5">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield size={16} className="text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm text-opus-200">Secrets Protection</p>
                <p className="text-xs text-opus-400">API keys are never exposed to the client. All provider calls are server-side only.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText size={16} className="text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm text-opus-200">Input Validation</p>
                <p className="text-xs text-opus-400">All inputs are validated using Zod schemas before processing.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database size={16} className="text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm text-opus-200">Authentication</p>
                <p className="text-xs text-opus-400">Authentication is not yet implemented. Required before production use.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Audit Log Summary */}
      <div>
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          Audit Log
        </h3>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-opus-200">{state.auditLog.length} events recorded</p>
              <p className="text-xs text-opus-400">System actions are tracked for traceability</p>
            </div>
            <StatusBadge status={state.auditLog.length > 0 ? 'active' : 'draft'} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ModuleStatusCard({
  icon: Icon,
  name,
  status,
  description,
}: {
  icon: typeof Database;
  name: string;
  status: string;
  description: string;
}) {
  const statusMap: Record<string, string> = {
    available: 'active',
    configured: 'active',
    connected: 'active',
    configuration_required: 'configuration_required',
    not_configured: 'paused',
    disconnected: 'error',
    unavailable: 'disabled',
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-2">
        <Icon size={16} className="text-opus-400" />
        <span className="text-sm font-medium text-opus-200">{name}</span>
      </div>
      <p className="text-xs text-opus-400 mb-3">{description}</p>
      <StatusBadge status={statusMap[status] || status} />
    </Card>
  );
}

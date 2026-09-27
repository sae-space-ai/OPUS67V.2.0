/**
 * OPUS67 — Dashboard Page
 * 
 * AI Operations Command Surface.
 * Shows system status, module overview, and recent activity.
 * Uses OPUS67 SPECTRAL SYSTEM visual design.
 */

import { Link } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { OpusLogo } from '../components/OpusLogo';
import { SpectralLine } from '../components/SpectralLine';
import { SystemStatus } from '../components/SystemStatus';
import {
  Bot,
  Wrench,
  GitBranch,
  FolderKanban,
  Shield,
  Landmark,
  Activity,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export function DashboardPage() {
  const { state } = useAppStore();

  const moduleCards = [
    {
      name: 'Agents',
      count: state.agents.length,
      icon: Bot,
      href: '/agents',
      status: state.systemStatus.modules.agents,
      accent: 'ultra',
    },
    {
      name: 'Tools',
      count: state.tools.length,
      icon: Wrench,
      href: '/tools',
      status: state.systemStatus.modules.tools,
      accent: 'ion',
    },
    {
      name: 'Workflows',
      count: state.workflows.length,
      icon: GitBranch,
      href: '/workflows',
      status: state.systemStatus.modules.workflows,
      accent: 'spectral',
    },
    {
      name: 'Projects',
      count: state.projects.length,
      icon: FolderKanban,
      href: '/projects',
      status: 'available',
      accent: 'amber',
    },
    {
      name: 'Evidence',
      count: state.evidence.length,
      icon: Shield,
      href: '/evidence',
      status: 'available',
      accent: 'ion',
    },
    {
      name: 'Governance',
      count: state.aiSystems.length,
      icon: Landmark,
      href: '/governance',
      status: 'available',
      accent: 'coral',
    },
  ];

  // System status is now handled by SystemStatus component
  // which shows real database and AI provider status

  return (
    <div className="min-h-full">
      {/* Command Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <OpusLogo variant="compact" size="md" />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-spectral/10 border border-spectral/30 text-spectral font-semibold uppercase tracking-wider">
                MVP
              </span>
            </div>
            <h1 className="text-2xl font-bold text-ice">
              System Status
            </h1>
            <p className="text-sm text-steel mt-1">
              AI Operations Command Surface
            </p>
          </div>
        </div>

        {/* System Status - Real Database & AI Provider Status */}
        <SystemStatus />
      </div>

      <SpectralLine variant="accent" className="mb-8" />

      {/* Module Overview */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-steel uppercase tracking-wider mb-4">
          Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleCards.map((module) => (
            <Link
              key={module.name}
              to={module.href}
              className="group spectral-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <module.icon size={20} className={`text-${module.accent}`} />
                <ArrowRight size={14} className="text-muted group-hover:text-spectral transition-colors" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-ice">{module.count}</p>
                  <p className="text-xs text-steel mt-1">{module.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  {module.status === 'available' || module.status === 'configured' ? (
                    <CheckCircle2 size={14} className="text-spectral" />
                  ) : module.status === 'configuration_required' ? (
                    <Clock size={14} className="text-amber" />
                  ) : (
                    <AlertCircle size={14} className="text-muted" />
                  )}
                  <span className={`text-[10px] font-semibold uppercase tracking-wider text-${module.status === 'available' || module.status === 'configured' ? 'spectral' : module.status === 'configuration_required' ? 'amber' : 'muted'}`}>
                    {module.status === 'available' ? 'ACTIVE' : module.status === 'configuration_required' ? 'REVIEW' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-semibold text-steel uppercase tracking-wider mb-4">
          Recent Activity
        </h2>
        {state.auditLog.length === 0 ? (
          <div className="spectral-card p-8 text-center">
            <Activity size={32} className="text-muted mx-auto mb-3" />
            <h3 className="text-sm font-medium text-ice mb-1">No activity recorded</h3>
            <p className="text-xs text-steel">
              Audit events will appear here as you create and manage resources.
            </p>
          </div>
        ) : (
          <div className="spectral-card divide-y divide-graphite-lighter">
            {state.auditLog.slice(0, 10).map((event) => (
              <div key={event.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-spectral" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ice truncate">
                    <span className="font-medium">{event.action}</span>
                    {' '}
                    <span className="text-steel font-mono-tech text-xs">
                      {event.resourceType}/{event.resourceId.slice(0, 8)}
                    </span>
                  </p>
                </div>
                <span className="text-xs text-muted font-mono-tech whitespace-nowrap">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

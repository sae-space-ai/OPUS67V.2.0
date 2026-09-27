/**
 * OPUS67 — Dashboard Page
 * 
 * Operational overview of the system.
 * Shows module status, counts, and system health.
 * Uses empty states when no data exists (no fake numbers).
 */

import { Link } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import {
  Card,
  PageHeader,
  StatusBadge,
  EmptyState,
} from '../components/ui';
import {
  Bot,
  Wrench,
  GitBranch,
  FolderKanban,
  Shield,
  Landmark,
  Activity,
  Database,
  Cloud,
  ArrowRight,
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
    },
    {
      name: 'Tools',
      count: state.tools.length,
      icon: Wrench,
      href: '/tools',
      status: state.systemStatus.modules.tools,
    },
    {
      name: 'Workflows',
      count: state.workflows.length,
      icon: GitBranch,
      href: '/workflows',
      status: state.systemStatus.modules.workflows,
    },
    {
      name: 'Projects',
      count: state.projects.length,
      icon: FolderKanban,
      href: '/projects',
      status: 'available',
    },
    {
      name: 'Evidence',
      count: state.evidence.length,
      icon: Shield,
      href: '/evidence',
      status: 'available',
    },
    {
      name: 'Governance',
      count: state.aiSystems.length,
      icon: Landmark,
      href: '/governance',
      status: 'available',
    },
  ];

  const infrastructureStatus = [
    {
      name: 'Application',
      status: state.systemStatus.status === 'ok' ? 'operational' : 'degraded',
      icon: Activity,
      detail: `v${state.systemStatus.version}`,
    },
    {
      name: 'Database',
      status: state.systemStatus.modules.database === 'connected' ? 'connected' : 'not configured',
      icon: Database,
      detail: state.systemStatus.modules.database === 'not_configured'
        ? 'PostgreSQL connection required'
        : 'Connected',
    },
    {
      name: 'AI Providers',
      status: state.systemStatus.modules.providers === 'configured' ? 'configured' : 'not configured',
      icon: Cloud,
      detail: state.systemStatus.modules.providers === 'not_configured'
        ? 'Set provider environment variables'
        : 'Active',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Operational overview of the OPUS67 platform"
      />

      {/* System Status */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          Infrastructure Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {infrastructureStatus.map((item) => (
            <Card key={item.name} className="p-4">
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-opus-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-opus-200">{item.name}</p>
                  <p className="text-xs text-opus-400 truncate">{item.detail}</p>
                </div>
                <StatusBadge
                  status={item.status === 'operational' || item.status === 'connected' || item.status === 'configured' ? 'active' : 'paused'}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Module Overview */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleCards.map((module) => (
            <Link
              key={module.name}
              to={module.href}
              className="group"
            >
              <Card className="p-4 hover:border-accent-500/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <module.icon size={18} className="text-opus-400 group-hover:text-accent-400 transition-colors" />
                  <ArrowRight size={14} className="text-opus-500 group-hover:text-accent-400 transition-colors" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-opus-100">{module.count}</p>
                    <p className="text-xs text-opus-400 mt-0.5">{module.name}</p>
                  </div>
                  <StatusBadge status={module.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          Recent Activity
        </h3>
        {state.auditLog.length === 0 ? (
          <Card className="p-0 overflow-hidden">
            <EmptyState
              title="No activity recorded"
              description="Audit events will appear here as you create and manage resources."
            />
          </Card>
        ) : (
          <Card className="divide-y divide-opus-700">
            {state.auditLog.slice(0, 10).map((event) => (
              <div key={event.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-opus-200 truncate">
                    <span className="font-medium">{event.action}</span>
                    {' '}
                    <span className="text-opus-400">
                      {event.resourceType}/{event.resourceId.slice(0, 8)}
                    </span>
                  </p>
                </div>
                <span className="text-xs text-opus-500 whitespace-nowrap">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * OPUS67 — Home Page
 * 
 * Landing page that identifies OPUS67 as an AI systems platform.
 * Provides navigation to all implemented modules.
 */

import { Link } from 'react-router-dom';
import {
  Bot,
  Wrench,
  GitBranch,
  FolderKanban,
  Shield,
  Landmark,
  ArrowRight,
  Cpu,
  Lock,
  Eye,
} from 'lucide-react';

const modules = [
  {
    name: 'Agents',
    description: 'Configure and manage AI agents with provider abstraction.',
    href: '/agents',
    icon: Bot,
    status: 'Module ready',
  },
  {
    name: 'Tools',
    description: 'Register and manage tools available to agents.',
    href: '/tools',
    icon: Wrench,
    status: 'Module ready',
  },
  {
    name: 'Workflows',
    description: 'Design multi-step workflows with agents and tools.',
    href: '/workflows',
    icon: GitBranch,
    status: 'Module ready',
  },
  {
    name: 'Projects',
    description: 'Organize work into projects with ownership and status.',
    href: '/projects',
    icon: FolderKanban,
    status: 'Module ready',
  },
  {
    name: 'Evidence',
    description: 'Track provenance, hashes, and human review of AI outputs.',
    href: '/evidence',
    icon: Shield,
    status: 'Module ready',
  },
  {
    name: 'Governance',
    description: 'AI system inventory, risk classification, and controls.',
    href: '/governance',
    icon: Landmark,
    status: 'Module ready',
  },
];

const principles = [
  {
    icon: Cpu,
    title: 'Modular Architecture',
    description: 'Decoupled components with clear interfaces and provider abstraction.',
  },
  {
    icon: Lock,
    title: 'Security First',
    description: 'Server-side validation, secret protection, and minimal privilege.',
  },
  {
    icon: Eye,
    title: 'Full Traceability',
    description: 'Audit logs, evidence chains, and human oversight records.',
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-opus-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-500/5 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="flex flex-col items-center text-center">
            {/* Logo mark */}
            <div className="w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-8">
              <span className="text-2xl font-bold text-accent-400">O67</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-opus-100 tracking-tight">
              OPUS67
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-opus-300 max-w-2xl">
              AI Systems Platform for agents, tools, workflows, and governance.
              Build, operate, and audit intelligent systems with full traceability.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors"
              >
                Open Dashboard
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/governance"
                className="inline-flex items-center gap-2 px-6 py-3 bg-opus-700 text-opus-200 font-medium rounded-lg hover:bg-opus-600 border border-opus-600 transition-colors"
              >
                Governance
              </Link>
            </div>

            {/* System status */}
            <div className="mt-12 flex items-center gap-4 text-sm text-opus-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Application operational</span>
              </div>
              <span className="text-opus-600">•</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Providers not configured</span>
              </div>
              <span className="text-opus-600">•</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Database not connected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="p-6 rounded-xl bg-opus-800 border border-opus-700"
            >
              <principle.icon size={24} className="text-accent-400 mb-3" />
              <h3 className="text-sm font-semibold text-opus-100 mb-1">
                {principle.title}
              </h3>
              <p className="text-sm text-opus-400">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-semibold text-opus-100 mb-2">Platform Modules</h2>
        <p className="text-sm text-opus-400 mb-8">
          Each module is independently accessible and designed for progressive enhancement.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => (
            <Link
              key={module.name}
              to={module.href}
              className="group p-5 rounded-xl bg-opus-800 border border-opus-700 hover:border-accent-500/30 hover:bg-opus-800/80 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <module.icon size={20} className="text-opus-300 group-hover:text-accent-400 transition-colors" />
                <span className="text-xs text-opus-500">{module.status}</span>
              </div>
              <h3 className="text-sm font-semibold text-opus-100 mb-1 group-hover:text-accent-400 transition-colors">
                {module.name}
              </h3>
              <p className="text-xs text-opus-400 leading-relaxed">
                {module.description}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Open module</span>
                <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-opus-700 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="text-sm font-medium text-opus-300">OPUS67</span>
          </div>
          <p className="text-xs text-opus-500">
            AI Systems Platform — v0.1.0 — Architecture ready for production deployment
          </p>
        </div>
      </footer>
    </div>
  );
}

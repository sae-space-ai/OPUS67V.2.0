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

            {/* MVP Badge */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/30">
              <span className="text-xs font-semibold text-accent-400 uppercase tracking-wider">MVP</span>
              <span className="text-xs text-opus-400">Minimum Viable Product</span>
            </div>

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

      {/* EU Compliance Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 via-opus-800 to-opus-800 border border-blue-500/20">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* EU Flag & Badges */}
            <div className="flex flex-col items-center gap-4 lg:min-w-[200px]">
              {/* EU Flag */}
              <div className="w-24 h-16 rounded-lg bg-blue-600 flex items-center justify-center relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Circle of stars */}
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30 - 90) * (Math.PI / 180);
                      const x = Math.cos(angle) * 20;
                      const y = Math.sin(angle) * 20;
                      return (
                        <div
                          key={i}
                          className="absolute w-1.5 h-1.5 bg-yellow-400"
                          style={{
                            left: `${x + 24}px`,
                            top: `${y + 16}px`,
                            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Compliance Badges */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <Shield size={14} className="text-blue-400" />
                  <span className="text-xs font-medium text-blue-300">EU AI Act</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <Lock size={14} className="text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-300">RGPD/GDPR</span>
                </div>
              </div>
            </div>

            {/* Compliance Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-opus-100 mb-2">
                Cumplimiento Normativo Europeo
              </h2>
              <p className="text-sm text-opus-300 mb-6 leading-relaxed">
                OPUS67 ha sido diseñado y desarrollado para cumplir con los requisitos de la normativa europea 
                de inteligencia artificial y protección de datos, garantizando sistemas de IA seguros, 
                transparentes y respetuosos con los derechos fundamentales.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* AI Act */}
                <div className="p-4 rounded-lg bg-opus-800/50 border border-opus-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-opus-100 mb-1">EU AI Act</h3>
                      <p className="text-xs text-opus-400 leading-relaxed">
                        Arquitectura preparada para clasificación de riesgos, supervisión humana, 
                        transparencia y documentación técnica según el Reglamento de IA de la UE.
                      </p>
                    </div>
                  </div>
                </div>

                {/* GDPR/RGPD */}
                <div className="p-4 rounded-lg bg-opus-800/50 border border-opus-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Lock size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-opus-100 mb-1">RGPD/GDPR</h3>
                      <p className="text-xs text-opus-400 leading-relaxed">
                        Diseño orientado a la protección de datos: minimización, consentimiento, 
                        derecho al olvido, portabilidad y privacidad por defecto.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk Classification */}
                <div className="p-4 rounded-lg bg-opus-800/50 border border-opus-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-opus-100 mb-1">Clasificación de Riesgos</h3>
                      <p className="text-xs text-opus-400 leading-relaxed">
                        Sistema de clasificación en 4 niveles: mínimo, limitado, alto e inaceptable, 
                        con controles específicos para cada categoría.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Human Oversight */}
                <div className="p-4 rounded-lg bg-opus-800/50 border border-opus-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Eye size={18} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-opus-100 mb-1">Supervisión Humana</h3>
                      <p className="text-xs text-opus-400 leading-relaxed">
                        Registros de revisión humana, trazabilidad de decisiones, 
                        evidencia verificable y capacidad de intervención manual.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Note */}
              <div className="mt-6 p-4 rounded-lg bg-opus-700/30 border border-opus-600">
                <p className="text-xs text-opus-400 leading-relaxed">
                  <span className="font-semibold text-opus-300">Nota:</span> OPUS67 proporciona herramientas y arquitectura 
                  orientadas al cumplimiento normativo. La conformidad final depende de la configuración, 
                  procesos organizativos y auditorías externas según el caso de uso específico.
                </p>
              </div>
            </div>
          </div>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">O</span>
              </div>
              <span className="text-sm font-medium text-opus-300">OPUS67</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 font-medium">
                MVP
              </span>
            </div>
            <p className="text-xs text-opus-500">
              AI Systems Platform — v0.1.0
            </p>
          </div>
          
          {/* Compliance Footer */}
          <div className="pt-6 border-t border-opus-700/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-blue-400" />
                  <span className="text-xs text-opus-400">EU AI Act Compliant Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-emerald-400" />
                  <span className="text-xs text-opus-400">RGPD/GDPR Ready</span>
                </div>
              </div>
              <p className="text-xs text-opus-500 text-center sm:text-right">
                Diseñado para cumplir con la normativa europea de IA y protección de datos
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * OPUS67 — Home Page
 *
 * Landing page that identifies OPUS67 as an AI systems platform.
 * Communicates MVP status and compliance-oriented governance framework.
 *
 * IMPORTANT — LEGAL PRECISION:
 * This page does NOT claim official certification, approval or endorsement
 * by the European Union, the European Commission or any supervisory authority.
 * All regulatory references describe the design and governance framework
 * adopted by OPUS67. See the Regulatory Disclaimer at the bottom of this page.
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
  FileText,
  Scale,
  Fingerprint,
  AlertTriangle,
  Info,
} from 'lucide-react';

// ============================================================
// Module catalog
// ============================================================

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

// ============================================================
// Architectural principles
// ============================================================

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

// ============================================================
// Governance indicators (EU AI Act alignment)
// ============================================================

const governanceIndicators = [
  { icon: Scale, label: 'EU AI Act', sublabel: 'Compliance-oriented' },
  { icon: Lock, label: 'GDPR / RGPD', sublabel: 'Privacy-by-design' },
  { icon: Eye, label: 'Human Oversight', sublabel: 'Review records' },
  { icon: FileText, label: 'Traceability', sublabel: 'Audit trail' },
  { icon: AlertTriangle, label: 'Risk Management', sublabel: '4-level classification' },
  { icon: Fingerprint, label: 'Evidence Governance', sublabel: 'Provenance & hashes' },
];

// ============================================================
// Home Page
// ============================================================

export function HomePage() {
  return (
    <div className="min-h-screen bg-opus-900">
      {/* ====================================================== */}
      {/* HERO — Product identification + MVP status             */}
      {/* ====================================================== */}
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

            {/* MVP Badge — Product status */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/30">
                <span className="text-xs font-semibold text-accent-400 uppercase tracking-wider">
                  MVP
                </span>
                <span className="text-opus-600">·</span>
                <span className="text-xs text-opus-400">Minimum Viable Product</span>
              </div>
              <p className="text-xs text-opus-500 max-w-md">
                OPUS67 is currently an MVP under active technical, security and governance validation.
              </p>
            </div>

            {/* CTAs */}
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
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-opus-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Application operational</span>
              </div>
              <span className="text-opus-600">·</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Providers not configured</span>
              </div>
              <span className="text-opus-600">·</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Database not connected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* ARCHITECTURAL PRINCIPLES                               */}
      {/* ====================================================== */}
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

      {/* ====================================================== */}
      {/* EUROPEAN AI GOVERNANCE BLOCK                           */}
      {/*                                                        */}
      {/* PRECISION:                                             */}
      {/* - "compliance-oriented architecture" (NOT "compliant") */}
      {/* - "aligned with ... principles" (NOT "certified")      */}
      {/* - Badges are OPUS67's own design, NOT EU institutional */}
      {/* ====================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/10 via-opus-800 to-opus-800 border border-opus-700">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Scale size={18} className="text-blue-400" />
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Governance Framework
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-opus-100">
                European AI Governance
              </h2>
              <p className="mt-3 text-sm text-opus-300 max-w-2xl leading-relaxed">
                OPUS67 is designed with a compliance-oriented architecture aligned with
                the governance, transparency, traceability, human oversight and
                risk-management principles of the EU AI Act.
              </p>
            </div>

            {/* OPUS67's own compliance badges (NOT institutional) */}
            <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[220px]">
              <div className="flex-1 lg:flex-none px-4 py-3 rounded-lg bg-opus-900/60 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={14} className="text-blue-400" />
                  <span className="text-xs font-bold text-opus-100 tracking-wide">
                    EU AI ACT
                  </span>
                </div>
                <p className="text-[10px] text-opus-400 uppercase tracking-wider">
                  Compliance-oriented
                </p>
              </div>
              <div className="flex-1 lg:flex-none px-4 py-3 rounded-lg bg-opus-900/60 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold text-opus-100 tracking-wide">
                    GDPR / RGPD
                  </span>
                </div>
                <p className="text-[10px] text-opus-400 uppercase tracking-wider">
                  Privacy-by-design
                </p>
              </div>
            </div>
          </div>

          {/* Governance indicators grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {governanceIndicators.map((indicator) => (
              <div
                key={indicator.label}
                className="p-3 rounded-lg bg-opus-900/40 border border-opus-700 text-center"
              >
                <indicator.icon size={18} className="text-opus-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-opus-200 leading-tight">
                  {indicator.label}
                </p>
                <p className="text-[10px] text-opus-500 mt-1">
                  {indicator.sublabel}
                </p>
              </div>
            ))}
          </div>

          {/* EU AI Act + GDPR detail cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* EU AI Act */}
            <div className="p-5 rounded-xl bg-opus-900/40 border border-opus-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Scale size={18} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-opus-100 mb-2">
                    EU AI Act — Design Alignment
                  </h3>
                  <p className="text-xs text-opus-400 leading-relaxed mb-3">
                    The architecture of OPUS67 is structured to support the implementation
                    of controls aligned with the EU AI Act, including risk classification,
                    transparency obligations, human oversight records and technical
                    documentation.
                  </p>
                  <ul className="text-xs text-opus-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-400" />
                      Risk classification (minimal / limited / high / unacceptable)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-400" />
                      Human oversight and review records
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-400" />
                      Traceability and audit events
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-400" />
                      Evidence governance and provenance
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* GDPR / RGPD */}
            <div className="p-5 rounded-xl bg-opus-900/40 border border-opus-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Lock size={18} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-opus-100 mb-2">
                    GDPR / RGPD — Privacy-by-design
                  </h3>
                  <p className="text-xs text-opus-400 leading-relaxed mb-3">
                    OPUS67 incorporates privacy-by-design and data-governance principles
                    intended to support GDPR/RGPD-compliant operation. The architecture
                    is prepared to document the following controls:
                  </p>
                  <ul className="text-xs text-opus-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      Lawful basis & purpose limitation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      Data minimisation & retention
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      Transparency & data subject rights
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      Access control, security & accountability
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Link to full Governance page */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-opus-900/40 border border-opus-700">
            <div className="flex items-start gap-3">
              <Info size={16} className="text-opus-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-opus-400 leading-relaxed">
                Detailed control status, implementation evidence and regulatory traceability
                matrix are available in the Governance module.
              </p>
            </div>
            <Link
              to="/governance"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-400 hover:text-accent-300 whitespace-nowrap"
            >
              View governance matrix
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* PLATFORM MODULES                                       */}
      {/* ====================================================== */}
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

      {/* ====================================================== */}
      {/* FOOTER                                                 */}
      {/* ====================================================== */}
      <footer className="border-t border-opus-700 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top row: brand + version */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">O</span>
              </div>
              <span className="text-sm font-medium text-opus-300">OPUS67</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 font-semibold uppercase tracking-wider">
                MVP
              </span>
            </div>
            <p className="text-xs text-opus-500">
              AI Systems Platform · v0.1.0
            </p>
          </div>

          {/* Middle row: governance badges (OPUS67's own design) */}
          <div className="pt-6 border-t border-opus-700/50 mb-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/governance"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-opus-800 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
              >
                <Shield size={12} className="text-blue-400" />
                <span className="text-[11px] font-medium text-opus-300">
                  EU AI Act · Compliance-oriented
                </span>
              </Link>
              <Link
                to="/governance"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-opus-800 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
              >
                <Lock size={12} className="text-emerald-400" />
                <span className="text-[11px] font-medium text-opus-300">
                  GDPR / RGPD · Privacy-by-design
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom row: REGULATORY DISCLAIMER */}
          <div className="pt-4 border-t border-opus-700/30">
            <p className="text-[10px] text-opus-500 leading-relaxed text-center max-w-3xl mx-auto">
              Regulatory references on this page describe the design and governance
              framework adopted by OPUS67. They do not constitute certification,
              endorsement or approval by the European Union, the European Commission
              or any supervisory authority. Compliance status of individual controls
              is documented in the Governance module with verifiable evidence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

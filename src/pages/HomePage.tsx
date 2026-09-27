/**
 * OPUS67 — Home Page
 * 
 * Landing page with OPUS67 SPECTRAL SYSTEM visual identity.
 * Maintains all regulatory compliance elements with new visual design.
 */

import { Link } from 'react-router-dom';
import { OpusLogo } from '../components/OpusLogo';
import { SpectralLine } from '../components/SpectralLine';
import {
  ArrowRight,
  Bot,
  Wrench,
  GitBranch,
  FolderKanban,
  Shield,
  Landmark,
  Cpu,
  Lock,
  Eye,
  Scale,
  Fingerprint,
  AlertTriangle,
  FileText,
  Info,
} from 'lucide-react';

const modules = [
  {
    name: 'Agents',
    description: 'Configure and manage AI agents with provider abstraction.',
    href: '/agents',
    icon: Bot,
    accent: 'ultra',
  },
  {
    name: 'Tools',
    description: 'Register and manage tools available to agents.',
    href: '/tools',
    icon: Wrench,
    accent: 'ion',
  },
  {
    name: 'Workflows',
    description: 'Design multi-step workflows with agents and tools.',
    href: '/workflows',
    icon: GitBranch,
    accent: 'spectral',
  },
  {
    name: 'Projects',
    description: 'Organize work into projects with ownership and status.',
    href: '/projects',
    icon: FolderKanban,
    accent: 'amber',
  },
  {
    name: 'Evidence',
    description: 'Track provenance, hashes, and human review of AI outputs.',
    href: '/evidence',
    icon: Shield,
    accent: 'ion',
  },
  {
    name: 'Governance',
    description: 'AI system inventory, risk classification, and controls.',
    href: '/governance',
    icon: Landmark,
    accent: 'coral',
  },
];

const governanceIndicators = [
  { icon: Scale, label: 'EU AI Act', sublabel: 'Compliance-oriented' },
  { icon: Lock, label: 'GDPR / RGPD', sublabel: 'Privacy-by-design' },
  { icon: Eye, label: 'Human Oversight', sublabel: 'Review records' },
  { icon: FileText, label: 'Traceability', sublabel: 'Audit trail' },
  { icon: AlertTriangle, label: 'Risk Management', sublabel: '4-level classification' },
  { icon: Fingerprint, label: 'Evidence Governance', sublabel: 'Provenance & hashes' },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-obsidian grid-pattern">
      {/* ====================================================== */}
      {/* HERO                                                    */}
      {/* ====================================================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-spectral/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <OpusLogo variant="full" size="xl" showTagline={true} />

            {/* MVP Badge */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spectral/10 border border-spectral/30">
                <span className="text-xs font-semibold text-spectral uppercase tracking-wider">
                  MVP
                </span>
                <span className="text-steel">·</span>
                <span className="text-xs text-steel">Minimum Viable Product</span>
              </div>
              <p className="text-sm text-muted max-w-md">
                OPUS67 is currently an MVP under active technical, security and governance validation.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-spectral text-obsidian font-semibold rounded-lg hover:bg-spectral-dim transition-all"
              >
                Open Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/governance"
                className="inline-flex items-center gap-2 px-6 py-3 bg-graphite-light text-ice font-medium rounded-lg border border-graphite-lighter hover:border-spectral/30 transition-all"
              >
                Governance
              </Link>
            </div>

            {/* System Status */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-spectral status-pulse" />
                <span className="text-steel">Application operational</span>
              </div>
              <span className="text-graphite-lighter">·</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber status-pulse" />
                <span className="text-steel">Providers not configured</span>
              </div>
              <span className="text-graphite-lighter">·</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted" />
                <span className="text-steel">Database not connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spectral Line separator */}
        <SpectralLine variant="accent" className="mt-8" />
      </section>

      {/* ====================================================== */}
      {/* ARCHITECTURAL PRINCIPLES                                */}
      {/* ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: 'Modular Architecture', desc: 'Decoupled components with clear interfaces and provider abstraction.', color: 'ion' },
            { icon: Lock, title: 'Security First', desc: 'Server-side validation, secret protection, and minimal privilege.', color: 'coral' },
            { icon: Eye, title: 'Full Traceability', desc: 'Audit logs, evidence chains, and human oversight records.', color: 'spectral' },
          ].map((item) => (
            <div key={item.title} className="spectral-card p-6">
              <item.icon size={24} className={`text-${item.color} mb-3`} />
              <h3 className="text-sm font-semibold text-ice mb-1">{item.title}</h3>
              <p className="text-sm text-steel">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* EUROPEAN AI GOVERNANCE                                  */}
      {/* ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="spectral-card p-8">
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* LEFT: EU Emblem */}
            <div className="flex flex-col items-center lg:items-start gap-4 lg:min-w-[240px]">
              <div className="w-32 h-20 sm:w-40 sm:h-24 rounded-lg overflow-hidden shadow-lg border border-ion/20">
                <img
                  src="/regulatory/eu/eu-emblem.svg"
                  alt="European Union emblem"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xs font-semibold text-ion uppercase tracking-wider">
                  European Union
                </p>
                <p className="text-xs text-steel mt-1">
                  Regulatory Framework
                </p>
              </div>
            </div>

            {/* RIGHT: Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Scale size={18} className="text-ion" />
                <span className="text-xs font-semibold text-ion uppercase tracking-wider">
                  European AI Governance
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-ice mb-4">
                European Regulatory Framework
              </h2>
              
              <p className="text-sm text-steel leading-relaxed mb-6">
                OPUS67 is an MVP designed with a compliance-oriented architecture aligned 
                with key governance principles of the European Union Artificial Intelligence Act 
                and with privacy-by-design principles under the GDPR/RGPD.
              </p>

              {/* Regulation references */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-carbon/60 border border-ion/20">
                  <p className="text-xs font-semibold text-ion mb-1">EU AI Act</p>
                  <p className="text-[10px] text-steel font-mono-tech">Regulation (EU) 2024/1689</p>
                </div>
                <div className="p-3 rounded-lg bg-carbon/60 border border-spectral/20">
                  <p className="text-xs font-semibold text-spectral mb-1">GDPR / RGPD</p>
                  <p className="text-[10px] text-steel font-mono-tech">Regulation (EU) 2016/679</p>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-spectral/10 border border-spectral/30">
                  <span className="text-[10px] font-semibold text-spectral uppercase tracking-wider">
                    Status: MVP
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ion/10 border border-ion/30">
                  <span className="text-[10px] font-semibold text-ion uppercase tracking-wider">
                    Governance Architecture: Active
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/30">
                  <span className="text-[10px] font-semibold text-amber uppercase tracking-wider">
                    Regulatory Assessment: Ongoing
                  </span>
                </div>
              </div>

              {/* Badges propios */}
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-2 rounded-lg bg-carbon/60 border border-ion/20">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Shield size={12} className="text-ion" />
                    <span className="text-[10px] font-bold text-ice tracking-wide">
                      EU AI ACT
                    </span>
                  </div>
                  <p className="text-[9px] text-steel uppercase tracking-wider">
                    Compliance-Oriented
                  </p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-carbon/60 border border-spectral/20">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Lock size={12} className="text-spectral" />
                    <span className="text-[10px] font-bold text-ice tracking-wide">
                      GDPR / RGPD
                    </span>
                  </div>
                  <p className="text-[9px] text-steel uppercase tracking-wider">
                    Privacy-by-Design
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Governance indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {governanceIndicators.map((indicator) => (
              <div
                key={indicator.label}
                className="p-3 rounded-lg bg-carbon/40 border border-graphite-lighter text-center"
              >
                <indicator.icon size={18} className="text-steel mx-auto mb-2" />
                <p className="text-xs font-medium text-ice leading-tight">
                  {indicator.label}
                </p>
                <p className="text-[10px] text-muted mt-1">
                  {indicator.sublabel}
                </p>
              </div>
            ))}
          </div>

          {/* Link to Governance */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-carbon/40 border border-graphite-lighter">
            <div className="flex items-start gap-3">
              <Info size={16} className="text-steel mt-0.5 flex-shrink-0" />
              <p className="text-xs text-steel leading-relaxed">
                Detailed control status, implementation evidence and regulatory traceability
                matrix are available in the Governance module.
              </p>
            </div>
            <Link
              to="/governance"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-spectral hover:text-spectral-dim whitespace-nowrap"
            >
              View governance matrix
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Project Status */}
          <div className="mt-8 p-6 rounded-xl bg-carbon/40 border border-graphite-lighter">
            <h3 className="text-sm font-semibold text-ice mb-4 flex items-center gap-2">
              <Info size={16} className="text-spectral" />
              Project Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Version', value: 'MVP', color: 'spectral' },
                { label: 'Product Stage', value: 'Minimum Viable Product', color: 'ice' },
                { label: 'Application', value: 'Operational', color: 'spectral' },
                { label: 'Regulatory Architecture', value: 'Implemented', color: 'spectral' },
                { label: 'Regulatory Assessment', value: 'Ongoing', color: 'amber' },
                { label: 'AI Act Classification', value: 'Requires Assessment', color: 'amber' },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-graphite/60 border border-graphite-lighter">
                  <p className="text-[10px] text-steel mb-1">{item.label}</p>
                  <p className={`text-sm font-semibold text-${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 rounded-lg bg-carbon/60 border border-graphite-lighter">
            <p className="text-[10px] text-muted leading-relaxed">
              <span className="font-semibold text-steel">Regulatory alignment does not constitute 
              certification, conformity assessment, approval or endorsement</span> by the European Union, 
              European Commission or any supervisory authority. The European Union emblem is displayed 
              as a reference to the regulatory framework and does not imply connection with or approval 
              by the European Union or any of its institutions.
            </p>
            <Link
              to="/legal/ai"
              className="inline-flex items-center gap-1 text-[10px] text-spectral hover:text-spectral-dim mt-2"
            >
              Read full AI Legal Notice
              <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* PLATFORM MODULES                                        */}
      {/* ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-semibold text-ice mb-2">Platform Modules</h2>
        <p className="text-sm text-steel mb-8">
          Each module is independently accessible and designed for progressive enhancement.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => (
            <Link
              key={module.name}
              to={module.href}
              className="group spectral-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <module.icon size={20} className={`text-${module.accent} group-hover:text-spectral transition-colors`} />
                <span className="text-xs text-muted">Module ready</span>
              </div>
              <h3 className="text-sm font-semibold text-ice mb-1 group-hover:text-spectral transition-colors">
                {module.name}
              </h3>
              <p className="text-xs text-steel leading-relaxed">
                {module.description}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-spectral opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Open module</span>
                <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* FOOTER                                                  */}
      {/* ====================================================== */}
      <footer className="border-t border-graphite-lighter py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <OpusLogo variant="compact" size="sm" />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-spectral/10 border border-spectral/30 text-spectral font-semibold uppercase tracking-wider">
                MVP
              </span>
            </div>
            <p className="text-xs text-muted">
              AI Systems Platform · v0.1.0
            </p>
          </div>

          <div className="pt-6 border-t border-graphite-lighter/50 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/regulatory/eu/eu-emblem.svg"
                  alt="European Union emblem"
                  className="w-12 h-8 rounded border border-ion/20"
                />
                <div className="text-left">
                  <p className="text-[10px] font-semibold text-ion uppercase tracking-wider">
                    European Union
                  </p>
                  <p className="text-[9px] text-muted">
                    Regulatory Framework Reference
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Link
                  to="/governance"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-graphite-light border border-ion/20 hover:border-ion/40 transition-colors"
                >
                  <Shield size={12} className="text-ion" />
                  <span className="text-[11px] font-medium text-steel">
                    EU AI Act · Compliance-oriented
                  </span>
                </Link>
                <Link
                  to="/governance"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-graphite-light border border-spectral/20 hover:border-spectral/40 transition-colors"
                >
                  <Lock size={12} className="text-spectral" />
                  <span className="text-[11px] font-medium text-steel">
                    GDPR / RGPD · Privacy-by-design
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-graphite-lighter/30">
            <p className="text-[10px] text-muted leading-relaxed text-center max-w-3xl mx-auto">
              Regulatory references on this page describe the design and governance
              framework adopted by OPUS67. They do not constitute certification,
              endorsement or approval by the European Union, the European Commission
              or any supervisory authority.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-graphite-lighter/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-spectral/10 border border-spectral/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-spectral">MG</span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-steel">Prof. Manuel Gago Fernández</p>
                  <p className="text-[10px] text-muted">Author & Developer</p>
                </div>
              </div>
              <Link
                to="/legal/ai"
                className="text-[10px] text-steel hover:text-ice transition-colors"
              >
                AI Legal Notice →
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

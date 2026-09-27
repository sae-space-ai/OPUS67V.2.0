/**
 * OPUS67 — Artificial Intelligence Legal Notice
 *
 * Legal notice regarding AI systems, regulatory framework, and governance.
 * This page provides transparency about OPUS67's approach to AI governance
 * and regulatory alignment.
 *
 * IMPORTANT: This page does NOT claim certification or official approval.
 * All regulatory references describe the design framework adopted by OPUS67.
 */

import { Link } from 'react-router-dom';
import {
  Shield,
  Scale,
  Lock,
  Eye,
  FileText,
  Fingerprint,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export function AILegalPage() {
  return (
    <div className="min-h-screen bg-opus-900">
      {/* Header */}
      <div className="border-b border-opus-700 bg-opus-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-opus-400 hover:text-opus-200 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-opus-100">
            Artificial Intelligence Legal Notice
          </h1>
          <p className="text-sm text-opus-400 mt-2">
            Regulatory framework, governance principles, and legal disclaimers
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* European AI Governance */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Scale size={24} className="text-blue-400" />
            <h2 className="text-2xl font-semibold text-opus-100">
              European AI Governance
            </h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-opus-300 leading-relaxed">
              OPUS67 is designed with a compliance-oriented architecture aligned with
              key governance and transparency principles of{' '}
              <strong className="text-opus-200">Regulation (EU) 2024/1689</strong>{' '}
              (Artificial Intelligence Act) and privacy-by-design principles under{' '}
              <strong className="text-opus-200">Regulation (EU) 2016/679</strong>{' '}
              (General Data Protection Regulation).
            </p>
          </div>
        </section>

        {/* EU AI Act */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-blue-400" />
            <h2 className="text-xl font-semibold text-opus-100">EU AI Act</h2>
          </div>
          <div className="p-6 rounded-xl bg-opus-800 border border-opus-700">
            <p className="text-sm text-opus-300 leading-relaxed mb-4">
              The EU AI Act establishes a risk-based framework for artificial intelligence
              systems in the European Union. OPUS67's architecture is structured to support
              the following principles:
            </p>
            <ul className="space-y-3 text-sm text-opus-300">
              <li className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-opus-200">Risk Management:</strong> Four-level
                  classification system (minimal, limited, high, unacceptable risk)
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Eye size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-opus-200">Human Oversight:</strong> Review records,
                  approval workflows, and intervention capabilities
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileText size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-opus-200">Transparency:</strong> Audit trails,
                  event logging, and documentation requirements
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Fingerprint size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-opus-200">Traceability:</strong> Evidence governance,
                  provenance tracking, and hash verification
                </div>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-lg bg-opus-900/60 border border-opus-700">
              <p className="text-xs text-opus-400 leading-relaxed">
                <strong className="text-opus-300">Official Source:</strong>{' '}
                <a
                  href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                >
                  Regulation (EU) 2024/1689
                  <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* GDPR / RGPD */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Lock size={24} className="text-emerald-400" />
            <h2 className="text-xl font-semibold text-opus-100">GDPR / RGPD</h2>
          </div>
          <div className="p-6 rounded-xl bg-opus-800 border border-opus-700">
            <p className="text-sm text-opus-300 leading-relaxed mb-4">
              OPUS67 incorporates privacy-by-design and data-governance principles intended
              to support operation aligned with the General Data Protection Regulation:
            </p>
            <ul className="space-y-2 text-sm text-opus-300">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Lawful basis and purpose limitation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Data minimisation and retention policies
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Transparency and data subject rights
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Access control and security measures
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Accountability and documentation
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-lg bg-opus-900/60 border border-opus-700">
              <p className="text-xs text-opus-400 leading-relaxed">
                <strong className="text-opus-300">Official Source:</strong>{' '}
                <a
                  href="https://eur-lex.europa.eu/eli/reg/2016/679/oj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                >
                  Regulation (EU) 2016/679
                  <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* AI-Generated Content */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-cyan-400" />
            <h2 className="text-xl font-semibold text-opus-100">
              AI-Generated Content
            </h2>
          </div>
          <div className="p-6 rounded-xl bg-opus-800 border border-opus-700">
            <p className="text-sm text-opus-300 leading-relaxed mb-4">
              The European Commission has developed official icons for labelling
              AI-generated content under Article 50 of the AI Act. These icons are
              intended for deployers to label specific AI-generated or manipulated
              content (deepfakes, text) to ensure transparency.
            </p>
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs text-amber-300 leading-relaxed">
                <strong>Important:</strong> These icons are for content labelling purposes
                only and do not constitute a general compliance certification. OPUS67,
                as a platform, does not use these icons as a compliance badge.
              </p>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-opus-900/60 border border-opus-700">
              <p className="text-xs text-opus-400 leading-relaxed">
                <strong className="text-opus-300">Official Source:</strong>{' '}
                <a
                  href="https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  EU Icons for AI-Generated Content
                  <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Data Governance */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Fingerprint size={24} className="text-indigo-400" />
            <h2 className="text-xl font-semibold text-opus-100">Data Governance</h2>
          </div>
          <div className="p-6 rounded-xl bg-opus-800 border border-opus-700">
            <p className="text-sm text-opus-300 leading-relaxed">
              OPUS67 implements evidence governance with provenance tracking, integrity
              verification through cryptographic hashes, and comprehensive audit trails.
              All system mutations are logged with request correlation for full traceability.
            </p>
          </div>
        </section>

        {/* MVP Status */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={24} className="text-accent-400" />
            <h2 className="text-xl font-semibold text-opus-100">MVP Status</h2>
          </div>
          <div className="p-6 rounded-xl bg-opus-800 border border-opus-700">
            <p className="text-sm text-opus-300 leading-relaxed mb-4">
              OPUS67 is currently a <strong className="text-opus-200">Minimum Viable Product (MVP)</strong>{' '}
              under active technical, security, and governance validation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-opus-900/40 border border-opus-700">
                <p className="text-xs text-opus-400 mb-1">Version</p>
                <p className="text-sm font-semibold text-opus-200">MVP</p>
              </div>
              <div className="p-3 rounded-lg bg-opus-900/40 border border-opus-700">
                <p className="text-xs text-opus-400 mb-1">Product Stage</p>
                <p className="text-sm font-semibold text-opus-200">Minimum Viable Product</p>
              </div>
              <div className="p-3 rounded-lg bg-opus-900/40 border border-opus-700">
                <p className="text-xs text-opus-400 mb-1">Application</p>
                <p className="text-sm font-semibold text-emerald-400">Operational</p>
              </div>
              <div className="p-3 rounded-lg bg-opus-900/40 border border-opus-700">
                <p className="text-xs text-opus-400 mb-1">Regulatory Architecture</p>
                <p className="text-sm font-semibold text-emerald-400">Implemented</p>
              </div>
              <div className="p-3 rounded-lg bg-opus-900/40 border border-opus-700">
                <p className="text-xs text-opus-400 mb-1">Regulatory Assessment</p>
                <p className="text-sm font-semibold text-amber-400">Ongoing</p>
              </div>
              <div className="p-3 rounded-lg bg-opus-900/40 border border-opus-700">
                <p className="text-xs text-opus-400 mb-1">AI Act Classification</p>
                <p className="text-sm font-semibold text-amber-400">Requires Assessment</p>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Disclaimer */}
        <section className="mb-12">
          <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
            <h2 className="text-xl font-semibold text-red-300 mb-4">
              Regulatory Disclaimer
            </h2>
            <div className="space-y-4 text-sm text-opus-300 leading-relaxed">
              <p>
                References to EU legislation (AI Act, GDPR/RGPD) on this website describe
                the regulatory framework considered in the design of OPUS67 and{' '}
                <strong className="text-red-300">
                  do not constitute certification, conformity assessment, endorsement, or
                  approval
                </strong>{' '}
                by the European Union, the European Commission, or any supervisory authority.
              </p>
              <p>
                The European Union emblem is displayed as a reference to the regulatory
                framework and does not imply connection with or approval by the European
                Union or any of its institutions.
              </p>
              <p>
                Regulatory compliance depends on actual implementation, specific use cases,
                external audits, and assessment by qualified entities according to applicable
                regulations.
              </p>
              <p>
                <strong className="text-red-300">
                  No claims of "EU AI Act Certified", "GDPR Certified", or similar
                  certifications are made unless supported by documented evidence from
                  qualified certification bodies.
                </strong>
              </p>
            </div>
          </div>
        </section>

        {/* Author & Development */}
        <section className="mb-12">
          <div className="p-6 rounded-xl bg-opus-800 border border-opus-700">
            <h2 className="text-xl font-semibold text-opus-100 mb-4">
              Author & Development
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-500/10 border border-accent-500/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-accent-400">MG</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-opus-100">
                  Prof. Manuel Gago Fernández
                </p>
                <p className="text-sm text-opus-400">Author & Developer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Official Sources */}
        <section>
          <h2 className="text-xl font-semibold text-opus-100 mb-4">
            Official Sources
          </h2>
          <div className="space-y-3">
            <a
              href="https://european-union.europa.eu/principles-countries-history/symbols/european-flag_en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg bg-opus-800 border border-opus-700 hover:border-blue-500/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-opus-200">
                  European Union Emblem
                </p>
                <p className="text-xs text-opus-400">
                  european-union.europa.eu
                </p>
              </div>
              <ExternalLink size={16} className="text-opus-400" />
            </a>
            <a
              href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg bg-opus-800 border border-opus-700 hover:border-blue-500/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-opus-200">
                  Regulation (EU) 2024/1689 — AI Act
                </p>
                <p className="text-xs text-opus-400">eur-lex.europa.eu</p>
              </div>
              <ExternalLink size={16} className="text-opus-400" />
            </a>
            <a
              href="https://eur-lex.europa.eu/eli/reg/2016/679/oj"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg bg-opus-800 border border-opus-700 hover:border-emerald-500/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-opus-200">
                  Regulation (EU) 2016/679 — GDPR
                </p>
                <p className="text-xs text-opus-400">eur-lex.europa.eu</p>
              </div>
              <ExternalLink size={16} className="text-opus-400" />
            </a>
            <a
              href="https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg bg-opus-800 border border-opus-700 hover:border-cyan-500/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-opus-200">
                  EU Icons for AI-Generated Content
                </p>
                <p className="text-xs text-opus-400">digital-strategy.ec.europa.eu</p>
              </div>
              <ExternalLink size={16} className="text-opus-400" />
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-opus-700 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-opus-500">
            OPUS67 · AI Systems Platform · v0.1.0 · MVP
          </p>
        </div>
      </footer>
    </div>
  );
}

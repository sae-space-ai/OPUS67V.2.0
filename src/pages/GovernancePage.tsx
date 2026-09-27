/**
 * OPUS67 — Governance Page
 * 
 * AI system inventory, risk classification, and compliance-oriented controls.
 * Supports governance-oriented documentation and human oversight records.
 */

import { useState } from 'react';
import { useAppStore, createAuditEvent } from '../lib/store';
import { Card, PageHeader, EmptyState, Button, StatusBadge, ConfigBanner } from '../components/ui';
import { generateId } from '../lib/utils';
import type { AISystem, RiskLevel } from '../types';
import { Plus, Trash2, Scale, AlertTriangle, Lock, Eye, FileText, Fingerprint, Shield } from 'lucide-react';

export function GovernancePage() {
  const { state, dispatch } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id: string) => {
    dispatch({ type: 'ADD_AUDIT_EVENT', payload: createAuditEvent('delete', 'ai_system', id) });
  };

  return (
    <div>
      <PageHeader
        title="Governance"
        description="AI system inventory, risk classification, and compliance-oriented controls"
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={14} />
            Register AI System
          </Button>
        }
      />

      <ConfigBanner message="Governance support is architecturally ready. This module provides compliance-oriented controls and evidence management. Regulatory compliance status depends on actual implementation and external audit." />

      {/* ====================================================== */}
      {/* EU REGULATORY FRAMEWORK                                */}
      {/* ====================================================== */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-opus-300 mb-4 uppercase tracking-wider">
          EU Regulatory Framework
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'EU AI Act', icon: Scale, color: 'blue', status: 'Design-aligned' },
            { name: 'GDPR / RGPD', icon: Lock, color: 'emerald', status: 'Privacy-by-design' },
            { name: 'Human Oversight', icon: Eye, color: 'purple', status: 'Architectural support' },
            { name: 'Transparency', icon: FileText, color: 'cyan', status: 'Audit trail' },
            { name: 'Traceability', icon: Fingerprint, color: 'indigo', status: 'Event logging' },
            { name: 'Risk Management', icon: AlertTriangle, color: 'amber', status: '4-level taxonomy' },
            { name: 'Evidence', icon: Shield, color: 'green', status: 'Provenance tracking' },
            { name: 'Auditability', icon: FileText, color: 'slate', status: 'Full audit log' },
          ].map((item) => {
            const colorClasses: Record<string, string> = {
              blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
              emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
              purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
              cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
              indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
              amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
              green: 'bg-green-500/10 border-green-500/20 text-green-400',
              slate: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
            };
            return (
              <div key={item.name} className={`p-3 rounded-lg border ${colorClasses[item.color]}`}>
                <item.icon size={16} className="mb-2" />
                <p className="text-xs font-semibold text-opus-200 mb-1">{item.name}</p>
                <p className="text-[10px] text-opus-400">{item.status}</p>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <AISystemForm
          onSave={(system) => {
            dispatch({ type: 'ADD_AI_SYSTEM', payload: system });
            dispatch({ type: 'ADD_AUDIT_EVENT', payload: createAuditEvent('register', 'ai_system', system.id) });
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Risk Classification Reference */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          Risk Classification
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { level: 'minimal' as RiskLevel, desc: 'Low risk, standard transparency' },
            { level: 'limited' as RiskLevel, desc: 'Specific transparency obligations' },
            { level: 'high' as RiskLevel, desc: 'Enhanced controls and monitoring' },
            { level: 'unacceptable' as RiskLevel, desc: 'Prohibited uses' },
          ].map((item) => (
            <div key={item.level} className="p-3 rounded-lg bg-opus-800 border border-opus-700">
              <StatusBadge status={item.level} />
              <p className="text-xs text-opus-400 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Systems Inventory */}
      <div>
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          AI Systems Inventory
        </h3>

        {state.aiSystems.length === 0 && !showForm ? (
          <Card>
            <EmptyState
              title="No AI systems registered"
              description="Register AI systems to track their risk classification, controls, assessments, and human oversight records."
              action={
                <Button onClick={() => setShowForm(true)}>
                  <Plus size={14} />
                  Register System
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {state.aiSystems.map((system) => (
              <Card key={system.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Scale size={18} className="text-opus-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-opus-100">{system.name}</h3>
                      <p className="text-xs text-opus-400 mt-0.5">{system.description || 'No description'}</p>
                    </div>
                  </div>
                  <StatusBadge status={system.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-opus-400">
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>Risk:</span>
                    <StatusBadge status={system.riskLevel} />
                  </div>
                  <span>Last assessment: {new Date(system.lastAssessment).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-opus-700">
                  <Button variant="danger" size="sm" onClick={() => handleDelete(system.id)}>
                    <Trash2 size={12} /> Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Governance capabilities */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-opus-800 border border-opus-700">
          <h4 className="text-sm font-medium text-opus-200 mb-2">Governance Support</h4>
          <ul className="text-xs text-opus-400 space-y-1">
            <li>• AI system inventory management</li>
            <li>• Risk classification framework</li>
            <li>• Control registration and tracking</li>
            <li>• Assessment scheduling</li>
            <li>• Evidence management</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-opus-800 border border-opus-700">
          <h4 className="text-sm font-medium text-opus-200 mb-2">Human Oversight</h4>
          <ul className="text-xs text-opus-400 space-y-1">
            <li>• Human review records</li>
            <li>• Decision documentation</li>
            <li>• Incident tracking</li>
            <li>• Audit trail</li>
            <li>• Compliance-oriented controls</li>
          </ul>
        </div>
      </div>

      {/* ====================================================== */}
      {/* REGULATORY TRACEABILITY MATRIX                         */}
      {/*                                                        */}
      {/* Maps: REGULATION → REQUIREMENT → CONTROL → STATUS →    */}
      {/*       EVIDENCE → HUMAN REVIEW → LAST REVIEW            */}
      {/*                                                        */}
      {/* Status values are VERIFIABLE, not aspirational:        */}
      {/*   IMPLEMENTED | PARTIAL | PLANNED |                    */}
      {/*   NOT APPLICABLE | REQUIRES ASSESSMENT                 */}
      {/* ====================================================== */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-opus-300 uppercase tracking-wider">
              Regulatory Traceability Matrix
            </h3>
            <p className="text-xs text-opus-500 mt-1">
              Each control is tracked with verifiable implementation status and evidence.
            </p>
          </div>
        </div>

        {/* Status legend */}
        <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-lg bg-opus-800/50 border border-opus-700">
          <span className="text-[10px] text-opus-500 uppercase tracking-wider mr-2 self-center">Status:</span>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> IMPLEMENTED
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> PARTIAL
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> PLANNED
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-opus-400">
            <span className="w-1.5 h-1.5 rounded-full bg-opus-400" /> NOT APPLICABLE
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-purple-400">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> REQUIRES ASSESSMENT
          </span>
        </div>

        {/* Matrix table */}
        <div className="overflow-x-auto rounded-xl border border-opus-700">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-opus-800 border-b border-opus-700">
                <th className="text-left px-4 py-3 font-semibold text-opus-300 uppercase tracking-wider">Regulation</th>
                <th className="text-left px-4 py-3 font-semibold text-opus-300 uppercase tracking-wider">Requirement</th>
                <th className="text-left px-4 py-3 font-semibold text-opus-300 uppercase tracking-wider">Control</th>
                <th className="text-left px-4 py-3 font-semibold text-opus-300 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-opus-300 uppercase tracking-wider">Evidence</th>
                <th className="text-left px-4 py-3 font-semibold text-opus-300 uppercase tracking-wider">Human Review</th>
                <th className="text-left px-4 py-3 font-semibold text-opus-300 uppercase tracking-wider">Last Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-opus-700">
              {/* EU AI Act rows */}
              <MatrixRow
                regulation="EU AI Act"
                requirement="Risk classification"
                control="4-level risk taxonomy (minimal / limited / high / unacceptable)"
                status="IMPLEMENTED"
                evidence="Governance module · AI system registry"
                humanReview="Required for high-risk systems"
                lastReview="Architecture review — MVP"
              />
              <MatrixRow
                regulation="EU AI Act"
                requirement="Transparency obligations"
                control="System documentation, model/provider disclosure"
                status="PARTIAL"
                evidence="Agent model/provider fields; technical docs pending"
                humanReview="Planned — review workflow"
                lastReview="MVP baseline"
              />
              <MatrixRow
                regulation="EU AI Act"
                requirement="Human oversight"
                control="Human review records, override capability, audit trail"
                status="PARTIAL"
                evidence="Evidence status progression; approval requires review"
                humanReview="Architecturally supported"
                lastReview="MVP baseline"
              />
              <MatrixRow
                regulation="EU AI Act"
                requirement="Traceability & logging"
                control="Audit events for all mutations with request correlation"
                status="IMPLEMENTED"
                evidence="AuditEvent entity · in-memory log (1000 events)"
                humanReview="Automatic"
                lastReview="MVP baseline"
              />
              <MatrixRow
                regulation="EU AI Act"
                requirement="Technical documentation"
                control="System inventory, intended purpose, risk assessment"
                status="PARTIAL"
                evidence="AI system registry; full docs pending"
                humanReview="Planned"
                lastReview="MVP baseline"
              />
              <MatrixRow
                regulation="EU AI Act"
                requirement="Post-market monitoring"
                control="Incident tracking, performance monitoring"
                status="PLANNED"
                evidence="Architecture prepared; not yet operational"
                humanReview="Planned"
                lastReview="—"
              />
              <MatrixRow
                regulation="EU AI Act"
                requirement="Prohibited practices"
                control="Unacceptable-risk systems cannot be registered as approved"
                status="IMPLEMENTED"
                evidence="Status workflow prevents auto-approval"
                humanReview="Required"
                lastReview="MVP baseline"
              />

              {/* GDPR / RGPD rows */}
              <MatrixRow
                regulation="GDPR / RGPD"
                requirement="Lawful basis"
                control="Documented lawful basis per processing activity"
                status="PLANNED"
                evidence="Architecture prepared; documentation pending"
                humanReview="Required"
                lastReview="—"
              />
              <MatrixRow
                regulation="GDPR / RGPD"
                requirement="Data minimisation"
                control="Only necessary data collected and stored"
                status="PARTIAL"
                evidence="Schema design follows minimisation; validation pending"
                humanReview="Planned"
                lastReview="MVP baseline"
              />
              <MatrixRow
                regulation="GDPR / RGPD"
                requirement="Purpose limitation"
                control="Data used only for declared purposes"
                status="PLANNED"
                evidence="Architecture prepared"
                humanReview="Required"
                lastReview="—"
              />
              <MatrixRow
                regulation="GDPR / RGPD"
                requirement="Transparency"
                control="Clear information to data subjects"
                status="PLANNED"
                evidence="Privacy notice pending"
                humanReview="Required"
                lastReview="—"
              />
              <MatrixRow
                regulation="GDPR / RGPD"
                requirement="Access control"
                control="RBAC with role-based permissions"
                status="PLANNED"
                evidence="Role model designed (Owner/Admin/Operator/Reviewer/Viewer)"
                humanReview="Required"
                lastReview="—"
              />
              <MatrixRow
                regulation="GDPR / RGPD"
                requirement="Retention"
                control="Defined retention periods with automatic deletion"
                status="PLANNED"
                evidence="Architecture prepared"
                humanReview="Required"
                lastReview="—"
              />
              <MatrixRow
                regulation="GDPR / RGPD"
                requirement="Data subject rights"
                control="Access, rectification, erasure, portability"
                status="PLANNED"
                evidence="Architecture prepared"
                humanReview="Required"
                lastReview="—"
              />
              <MatrixRow
                regulation="GDPR / RGPD"
                requirement="Privacy by design / by default"
                control="Privacy considered at architecture and defaults"
                status="PARTIAL"
                evidence="No secrets in client; server-only provider calls"
                humanReview="Architecture review"
                lastReview="MVP baseline"
              />
              <MatrixRow
                regulation="GDPR / RGPD"
                requirement="Security"
                control="Input validation, secret protection, audit logging"
                status="IMPLEMENTED"
                evidence="Zod schemas; .env.example; audit log"
                humanReview="Security review pending"
                lastReview="MVP baseline"
              />
              <MatrixRow
                regulation="GDPR / RGPD"
                requirement="Accountability"
                control="Documented compliance measures and evidence"
                status="PARTIAL"
                evidence="This matrix; governance module"
                humanReview="Required"
                lastReview="MVP baseline"
              />
            </tbody>
          </table>
        </div>

        {/* Matrix disclaimer */}
        <div className="mt-4 p-3 rounded-lg bg-opus-800/50 border border-opus-700">
          <p className="text-[10px] text-opus-500 leading-relaxed">
            <span className="font-semibold text-opus-400">Note:</span> Status values in this
            matrix reflect the current verifiable state of OPUS67 as an MVP. "IMPLEMENTED"
            indicates the control is architecturally present and operational. "PARTIAL"
            indicates partial implementation requiring completion. "PLANNED" indicates the
            control is designed but not yet operational. No status in this matrix should
            be interpreted as certification or conformity assessment.
          </p>
        </div>
      </div>

      {/* Regulatory disclaimer */}
      <div className="mt-8 p-4 rounded-lg bg-opus-800 border border-opus-700">
        <p className="text-[11px] text-opus-500 leading-relaxed">
          <span className="font-semibold text-opus-400">Regulatory disclaimer:</span>{' '}
          References to the EU AI Act and GDPR/RGPD in this page describe the design and
          governance framework adopted by OPUS67. They do not constitute certification,
          endorsement or approval by the European Union, the European Commission or any
          supervisory authority. Conformity assessment requires independent evaluation by
          qualified entities according to applicable regulations.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Matrix Row Component
// ============================================================

function MatrixRow({
  regulation,
  requirement,
  control,
  status,
  evidence,
  humanReview,
  lastReview,
}: {
  regulation: string;
  requirement: string;
  control: string;
  status: 'IMPLEMENTED' | 'PARTIAL' | 'PLANNED' | 'NOT APPLICABLE' | 'REQUIRES ASSESSMENT';
  evidence: string;
  humanReview: string;
  lastReview: string;
}) {
  const statusStyles: Record<string, string> = {
    IMPLEMENTED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    PARTIAL: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    PLANNED: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'NOT APPLICABLE': 'text-opus-400 bg-opus-400/10 border-opus-400/20',
    'REQUIRES ASSESSMENT': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  };

  return (
    <tr className="hover:bg-opus-800/30 transition-colors">
      <td className="px-4 py-3 text-opus-300 font-medium whitespace-nowrap">{regulation}</td>
      <td className="px-4 py-3 text-opus-200">{requirement}</td>
      <td className="px-4 py-3 text-opus-400 max-w-xs">{control}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusStyles[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-3 text-opus-400 max-w-xs">{evidence}</td>
      <td className="px-4 py-3 text-opus-400">{humanReview}</td>
      <td className="px-4 py-3 text-opus-500 whitespace-nowrap">{lastReview}</td>
    </tr>
  );
}

function AISystemForm({
  onSave,
  onCancel,
}: {
  onSave: (system: AISystem) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('minimal');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    const now = new Date().toISOString();
    const system: AISystem = {
      id: generateId(),
      name: name.trim(),
      description: description.trim(),
      riskLevel,
      status: 'registered',
      lastAssessment: now,
      createdAt: now,
      updatedAt: now,
    };

    onSave(system);
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-sm font-semibold text-opus-100 mb-4">Register AI System</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-opus-300 mb-1">System Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 placeholder-opus-500 focus:border-accent-500 focus:outline-none"
              placeholder="e.g. Content Moderation System"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-opus-300 mb-1">Risk Level</label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
              className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 focus:border-accent-500 focus:outline-none"
            >
              <option value="minimal">Minimal</option>
              <option value="limited">Limited</option>
              <option value="high">High</option>
              <option value="unacceptable">Unacceptable</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-opus-300 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 placeholder-opus-500 focus:border-accent-500 focus:outline-none"
            placeholder="Purpose and scope of the AI system"
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="primary" size="sm">Register System</Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

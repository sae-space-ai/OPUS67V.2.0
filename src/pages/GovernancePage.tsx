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
import { Plus, Trash2, Scale, AlertTriangle } from 'lucide-react';

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
    </div>
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

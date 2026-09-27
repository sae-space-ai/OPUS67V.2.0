/**
 * OPUS67 — Workflows Page
 * 
 * Design multi-step workflows with agents and tools.
 * Engine designed for future expansion.
 */

import { useState } from 'react';
import { useAppStore, createAuditEvent } from '../lib/store';
import { Card, PageHeader, EmptyState, Button, StatusBadge } from '../components/ui';
import { generateId } from '../lib/utils';
import type { Workflow, WorkflowStatus } from '../types';
import { Plus, Trash2, GitBranch } from 'lucide-react';

export function WorkflowsPage() {
  const { state, dispatch } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_WORKFLOW', payload: id });
    dispatch({ type: 'ADD_AUDIT_EVENT', payload: createAuditEvent('delete', 'workflow', id) });
  };

  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Design multi-step workflows with agents and tools"
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={14} />
            New Workflow
          </Button>
        }
      />

      {showForm && (
        <WorkflowForm
          onSave={(workflow) => {
            dispatch({ type: 'ADD_WORKFLOW', payload: workflow });
            dispatch({ type: 'ADD_AUDIT_EVENT', payload: createAuditEvent('create', 'workflow', workflow.id) });
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {state.workflows.length === 0 && !showForm ? (
        <Card>
          <EmptyState
            title="No workflows configured"
            description="Create workflows to orchestrate agents and tools in sequential or parallel steps."
            action={
              <Button onClick={() => setShowForm(true)}>
                <Plus size={14} />
                Create Workflow
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {state.workflows.map((workflow) => (
            <Card key={workflow.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <GitBranch size={18} className="text-opus-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-opus-100">{workflow.name}</h3>
                    <p className="text-xs text-opus-400 mt-0.5">{workflow.description || 'No description'}</p>
                  </div>
                </div>
                <StatusBadge status={workflow.status} />
              </div>
              <div className="flex items-center gap-6 text-xs text-opus-400 mb-3">
                <span>{workflow.steps.length} steps</span>
                <span>{workflow.triggers.length} triggers</span>
              </div>
              {workflow.steps.length > 0 && (
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
                  {workflow.steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className="px-2 py-1 rounded bg-opus-700 text-xs text-opus-300 whitespace-nowrap">
                        {step.name}
                      </div>
                      {i < workflow.steps.length - 1 && (
                        <span className="text-opus-500">→</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 pt-3 border-t border-opus-700">
                <Button variant="danger" size="sm" onClick={() => handleDelete(workflow.id)}>
                  <Trash2 size={12} /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkflowForm({
  onSave,
  onCancel,
}: {
  onSave: (workflow: Workflow) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<WorkflowStatus>('draft');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    const now = new Date().toISOString();
    const workflow: Workflow = {
      id: generateId(),
      name: name.trim(),
      description: description.trim(),
      status,
      steps: [],
      triggers: [],
      createdAt: now,
      updatedAt: now,
    };

    onSave(workflow);
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-sm font-semibold text-opus-100 mb-4">New Workflow</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-opus-300 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 placeholder-opus-500 focus:border-accent-500 focus:outline-none"
              placeholder="e.g. Document Analysis Pipeline"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-opus-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as WorkflowStatus)}
              className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 focus:border-accent-500 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
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
            placeholder="What this workflow does"
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="primary" size="sm">Create Workflow</Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

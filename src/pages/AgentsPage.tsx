/**
 * OPUS67 — Agents Page
 * 
 * Manage AI agents with provider abstraction.
 * Supports CRUD operations with validation.
 */

import { useState } from 'react';
import { useAppStore, createAuditEvent } from '../lib/store';
import { Card, PageHeader, EmptyState, Button, StatusBadge } from '../components/ui';
import { generateId } from '../lib/utils';
import type { Agent, AgentStatus } from '../types';
import { createAgentSchema } from '../lib/validation';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export function AgentsPage() {
  const { state, dispatch } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_AGENT', payload: id });
    dispatch({
      type: 'ADD_AUDIT_EVENT',
      payload: createAuditEvent('delete', 'agent', id),
    });
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingAgent(null);
    setShowForm(true);
  };

  return (
    <div>
      <PageHeader
        title="Agents"
        description="Configure and manage AI agents with provider abstraction"
        action={
          <Button onClick={handleCreate}>
            <Plus size={14} />
            New Agent
          </Button>
        }
      />

      {showForm && (
        <AgentForm
          agent={editingAgent}
          onSave={(agent) => {
            if (editingAgent) {
              dispatch({ type: 'UPDATE_AGENT', payload: agent });
              dispatch({
                type: 'ADD_AUDIT_EVENT',
                payload: createAuditEvent('update', 'agent', agent.id),
              });
            } else {
              dispatch({ type: 'ADD_AGENT', payload: agent });
              dispatch({
                type: 'ADD_AUDIT_EVENT',
                payload: createAuditEvent('create', 'agent', agent.id),
              });
            }
            setShowForm(false);
            setEditingAgent(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingAgent(null);
          }}
        />
      )}

      {state.agents.length === 0 && !showForm ? (
        <Card>
          <EmptyState
            title="No agents configured"
            description="Create your first agent to start building AI-powered workflows."
            action={
              <Button onClick={handleCreate}>
                <Plus size={14} />
                Create Agent
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {state.agents.map((agent) => (
            <Card key={agent.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-opus-100">{agent.name}</h3>
                  <p className="text-xs text-opus-400 mt-0.5">{agent.description || 'No description'}</p>
                </div>
                <StatusBadge status={agent.status} />
              </div>
              <div className="space-y-2 text-xs text-opus-400">
                <div className="flex justify-between">
                  <span>Provider</span>
                  <span className="text-opus-300">{agent.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span>Model</span>
                  <span className="text-opus-300">{agent.model}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capabilities</span>
                  <span className="text-opus-300">{agent.capabilities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tools</span>
                  <span className="text-opus-300">{agent.tools.length}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-opus-700">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(agent)}>
                  <Edit2 size={12} />
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(agent.id)}>
                  <Trash2 size={12} />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Agent Form
// ============================================================

function AgentForm({
  agent,
  onSave,
  onCancel,
}: {
  agent: Agent | null;
  onSave: (agent: Agent) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(agent?.name || '');
  const [description, setDescription] = useState(agent?.description || '');
  const [status, setStatus] = useState<AgentStatus>(agent?.status || 'draft');
  const [provider, setProvider] = useState(agent?.provider || '');
  const [model, setModel] = useState(agent?.model || '');
  const [systemInstructions, setSystemInstructions] = useState(agent?.systemInstructions || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const now = new Date().toISOString();
    const agentData: Agent = {
      id: agent?.id || generateId(),
      name,
      description,
      status,
      provider,
      model,
      systemInstructions,
      capabilities: agent?.capabilities || [],
      tools: agent?.tools || [],
      createdAt: agent?.createdAt || now,
      updatedAt: now,
    };

    // Validate
    const result = createAgentSchema.safeParse({
      name: agentData.name,
      description: agentData.description,
      status: agentData.status,
      provider: agentData.provider,
      model: agentData.model,
      systemInstructions: agentData.systemInstructions,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    onSave(agentData);
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-sm font-semibold text-opus-100 mb-4">
        {agent ? 'Edit Agent' : 'New Agent'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-opus-300 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 placeholder-opus-500 focus:border-accent-500 focus:outline-none"
              placeholder="e.g. Research Assistant"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-opus-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AgentStatus)}
              className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 focus:border-accent-500 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-opus-300 mb-1">Provider *</label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 placeholder-opus-500 focus:border-accent-500 focus:outline-none"
              placeholder="e.g. openai, anthropic"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-opus-300 mb-1">Model *</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 placeholder-opus-500 focus:border-accent-500 focus:outline-none"
              placeholder="e.g. gpt-4, claude-3"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-opus-300 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 placeholder-opus-500 focus:border-accent-500 focus:outline-none"
            placeholder="Brief description of the agent's purpose"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-opus-300 mb-1">System Instructions</label>
          <textarea
            value={systemInstructions}
            onChange={(e) => setSystemInstructions(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 placeholder-opus-500 focus:border-accent-500 focus:outline-none resize-none"
            placeholder="Instructions for the agent's behavior..."
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" size="sm">
            {agent ? 'Update Agent' : 'Create Agent'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

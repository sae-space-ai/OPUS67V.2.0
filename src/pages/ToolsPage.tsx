/**
 * OPUS67 — Tools Page
 * 
 * Manage tools available to agents.
 * Distinguishes between AVAILABLE, CONFIGURATION_REQUIRED, DISABLED, ERROR.
 */

import { useState } from 'react';
import { useAppStore, createAuditEvent } from '../lib/store';
import { Card, PageHeader, EmptyState, Button, StatusBadge } from '../components/ui';
import { generateId } from '../lib/utils';
import type { Tool, ToolStatus } from '../types';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export function ToolsPage() {
  const { state, dispatch } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TOOL', payload: id });
    dispatch({
      type: 'ADD_AUDIT_EVENT',
      payload: createAuditEvent('delete', 'tool', id),
    });
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setShowForm(true);
  };

  return (
    <div>
      <PageHeader
        title="Tools"
        description="Register and manage tools available to agents"
        action={
          <Button onClick={() => { setEditingTool(null); setShowForm(true); }}>
            <Plus size={14} />
            New Tool
          </Button>
        }
      />

      {showForm && (
        <ToolForm
          tool={editingTool}
          onSave={(tool) => {
            if (editingTool) {
              dispatch({ type: 'UPDATE_TOOL', payload: tool });
              dispatch({ type: 'ADD_AUDIT_EVENT', payload: createAuditEvent('update', 'tool', tool.id) });
            } else {
              dispatch({ type: 'ADD_TOOL', payload: tool });
              dispatch({ type: 'ADD_AUDIT_EVENT', payload: createAuditEvent('create', 'tool', tool.id) });
            }
            setShowForm(false);
            setEditingTool(null);
          }}
          onCancel={() => { setShowForm(false); setEditingTool(null); }}
        />
      )}

      {state.tools.length === 0 && !showForm ? (
        <Card>
          <EmptyState
            title="No tools registered"
            description="Register tools that agents can use in their workflows. Tools must be validated before being marked as available."
            action={
              <Button onClick={() => { setEditingTool(null); setShowForm(true); }}>
                <Plus size={14} />
                Register Tool
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {state.tools.map((tool) => (
            <Card key={tool.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-opus-100">{tool.name}</h3>
                  <p className="text-xs text-opus-400 mt-0.5">{tool.description || 'No description'}</p>
                </div>
                <StatusBadge status={tool.status} />
              </div>
              <div className="space-y-2 text-xs text-opus-400">
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="text-opus-300">{tool.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Permissions</span>
                  <span className="text-opus-300">{tool.permissions.length}</span>
                </div>
              </div>
              {tool.status === 'configuration_required' && (
                <div className="mt-3 p-2 rounded bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300">
                  This tool requires configuration before it can be used.
                </div>
              )}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-opus-700">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(tool)}>
                  <Edit2 size={12} /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(tool.id)}>
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

function ToolForm({
  tool,
  onSave,
  onCancel,
}: {
  tool: Tool | null;
  onSave: (tool: Tool) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(tool?.name || '');
  const [description, setDescription] = useState(tool?.description || '');
  const [category, setCategory] = useState(tool?.category || '');
  const [status, setStatus] = useState<ToolStatus>(tool?.status || 'configuration_required');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !category.trim()) {
      setError('Name and category are required.');
      return;
    }

    const now = new Date().toISOString();
    const toolData: Tool = {
      id: tool?.id || generateId(),
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      status,
      inputSchema: tool?.inputSchema || {},
      outputSchema: tool?.outputSchema || {},
      permissions: tool?.permissions || [],
      createdAt: tool?.createdAt || now,
      updatedAt: now,
    };

    onSave(toolData);
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-sm font-semibold text-opus-100 mb-4">
        {tool ? 'Edit Tool' : 'Register Tool'}
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
              placeholder="e.g. Web Search"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-opus-300 mb-1">Category *</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 placeholder-opus-500 focus:border-accent-500 focus:outline-none"
              placeholder="e.g. search, code, data"
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
            placeholder="What this tool does"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-opus-300 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ToolStatus)}
            className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 focus:border-accent-500 focus:outline-none"
          >
            <option value="configuration_required">Configuration Required</option>
            <option value="available">Available</option>
            <option value="disabled">Disabled</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="primary" size="sm">
            {tool ? 'Update Tool' : 'Register Tool'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

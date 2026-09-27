/**
 * OPUS67 — Projects Page
 * 
 * Organize work into projects with ownership and status.
 */

import { useState } from 'react';
import { useAppStore, createAuditEvent } from '../lib/store';
import { Card, PageHeader, EmptyState, Button, StatusBadge } from '../components/ui';
import { generateId } from '../lib/utils';
import type { Project, ProjectStatus } from '../types';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export function ProjectsPage() {
  const { state, dispatch } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
    dispatch({ type: 'ADD_AUDIT_EVENT', payload: createAuditEvent('delete', 'project', id) });
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Organize work into projects with ownership and status tracking"
        action={
          <Button onClick={() => { setEditingProject(null); setShowForm(true); }}>
            <Plus size={14} />
            New Project
          </Button>
        }
      />

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={(project) => {
            if (editingProject) {
              dispatch({ type: 'UPDATE_PROJECT', payload: project });
              dispatch({ type: 'ADD_AUDIT_EVENT', payload: createAuditEvent('update', 'project', project.id) });
            } else {
              dispatch({ type: 'ADD_PROJECT', payload: project });
              dispatch({ type: 'ADD_AUDIT_EVENT', payload: createAuditEvent('create', 'project', project.id) });
            }
            setShowForm(false);
            setEditingProject(null);
          }}
          onCancel={() => { setShowForm(false); setEditingProject(null); }}
        />
      )}

      {state.projects.length === 0 && !showForm ? (
        <Card>
          <EmptyState
            title="No projects created"
            description="Projects group agents, workflows, evidence, and executions under a single organizational unit."
            action={
              <Button onClick={() => { setEditingProject(null); setShowForm(true); }}>
                <Plus size={14} />
                Create Project
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {state.projects.map((project) => (
            <Card key={project.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-opus-100">{project.name}</h3>
                  <p className="text-xs text-opus-400 mt-0.5">{project.description || 'No description'}</p>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <div className="space-y-2 text-xs text-opus-400">
                <div className="flex justify-between">
                  <span>Owner</span>
                  <span className="text-opus-300">{project.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created</span>
                  <span className="text-opus-300">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-opus-700">
                <Button variant="ghost" size="sm" onClick={() => { setEditingProject(project); setShowForm(true); }}>
                  <Edit2 size={12} /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
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

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(project?.status || 'active');
  const [owner, setOwner] = useState(project?.owner || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !owner.trim()) {
      setError('Name and owner are required.');
      return;
    }

    const now = new Date().toISOString();
    const projectData: Project = {
      id: project?.id || generateId(),
      name: name.trim(),
      description: description.trim(),
      status,
      owner: owner.trim(),
      createdAt: project?.createdAt || now,
      updatedAt: now,
    };

    onSave(projectData);
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-sm font-semibold text-opus-100 mb-4">
        {project ? 'Edit Project' : 'New Project'}
      </h3>
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
              placeholder="e.g. Customer Support AI"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-opus-300 mb-1">Owner *</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 placeholder-opus-500 focus:border-accent-500 focus:outline-none"
              placeholder="e.g. engineering-team"
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
            placeholder="Project description"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-opus-300 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className="w-full px-3 py-2 bg-opus-700 border border-opus-600 rounded-lg text-sm text-opus-100 focus:border-accent-500 focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="primary" size="sm">{project ? 'Update' : 'Create'}</Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

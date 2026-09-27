/**
 * OPUS67 — Core Type Definitions
 * 
 * All domain entities are defined here with strict TypeScript types.
 * These types serve as the canonical data model for the application.
 */

// ============================================================
// Status Types
// ============================================================

export type AgentStatus = 'draft' | 'active' | 'paused' | 'disabled';
export type ToolStatus = 'available' | 'configuration_required' | 'disabled' | 'error';
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'archived';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export type ExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
export type EvidenceStatus = 'unverified' | 'system_generated' | 'source_verified' | 'human_reviewed' | 'approved' | 'rejected';
export type RiskLevel = 'minimal' | 'limited' | 'high' | 'unacceptable';

// ============================================================
// Agent
// ============================================================

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  provider: string;
  model: string;
  systemInstructions: string;
  capabilities: string[];
  tools: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Tool
// ============================================================

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ToolStatus;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Workflow
// ============================================================

export interface WorkflowStep {
  id: string;
  name: string;
  agentId?: string;
  toolId?: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  dependsOn: string[];
  errorPolicy: 'stop' | 'retry' | 'skip' | 'fallback';
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  triggers: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Project
// ============================================================

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Evidence
// ============================================================

export interface Evidence {
  id: string;
  projectId: string;
  source: string;
  sourceType: 'execution' | 'model_output' | 'human_review' | 'system_log' | 'external';
  timestamp: string;
  hash: string;
  metadata: Record<string, unknown>;
  status: EvidenceStatus;
  createdAt: string;
}

// ============================================================
// Execution
// ============================================================

export interface Execution {
  id: string;
  projectId: string;
  workflowId: string;
  agentId: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  provider: string;
  model: string;
  requestId: string;
}

// ============================================================
// Governance
// ============================================================

export interface AISystem {
  id: string;
  name: string;
  description: string;
  riskLevel: RiskLevel;
  status: 'registered' | 'under_review' | 'approved' | 'suspended';
  lastAssessment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Control {
  id: string;
  systemId: string;
  name: string;
  description: string;
  type: 'technical' | 'organizational' | 'procedural';
  status: 'active' | 'pending' | 'expired';
  lastVerified: string;
}

// ============================================================
// Audit
// ============================================================

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorType: 'system' | 'user' | 'agent';
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata: Record<string, unknown>;
  requestId: string;
}

// ============================================================
// System Status
// ============================================================

export interface SystemStatus {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  version: string;
  timestamp: string;
  modules: {
    agents: 'available' | 'configuration_required' | 'unavailable';
    tools: 'available' | 'configuration_required' | 'unavailable';
    workflows: 'available' | 'configuration_required' | 'unavailable';
    database: 'connected' | 'disconnected' | 'not_configured';
    providers: 'configured' | 'not_configured';
  };
}

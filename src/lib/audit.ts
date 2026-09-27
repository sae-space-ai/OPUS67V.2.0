/**
 * OPUS67 — Audit Log Service
 * 
 * Typed audit events with structured logging.
 * Tracks all significant system actions for traceability.
 */

import type { AuditEvent } from '../types';
import { auditLogRepository } from './repository';
import { generateId } from './utils';

// ============================================================
// Audit Event Types
// ============================================================

export type AuditAction =
  // Projects
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_ARCHIVED'
  | 'PROJECT_DELETED'
  // Agents
  | 'AGENT_CREATED'
  | 'AGENT_UPDATED'
  | 'AGENT_ENABLED'
  | 'AGENT_DISABLED'
  | 'AGENT_DELETED'
  // Tools
  | 'TOOL_CREATED'
  | 'TOOL_UPDATED'
  | 'TOOL_EXECUTED'
  | 'TOOL_DELETED'
  // Workflows
  | 'WORKFLOW_CREATED'
  | 'WORKFLOW_UPDATED'
  | 'WORKFLOW_STARTED'
  | 'WORKFLOW_COMPLETED'
  | 'WORKFLOW_FAILED'
  | 'WORKFLOW_CANCELLED'
  // Evidence
  | 'EVIDENCE_CREATED'
  | 'EVIDENCE_VERIFIED'
  | 'EVIDENCE_APPROVED'
  | 'EVIDENCE_REJECTED'
  // Governance
  | 'AI_SYSTEM_REGISTERED'
  | 'CONTROL_CREATED'
  | 'ASSESSMENT_CREATED'
  // System
  | 'CONFIG_CHANGED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'HUMAN_REVIEW';

export type ResourceType =
  | 'project'
  | 'agent'
  | 'tool'
  | 'workflow'
  | 'evidence'
  | 'execution'
  | 'ai_system'
  | 'control'
  | 'assessment'
  | 'system';

export interface CreateAuditEventInput {
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  actorType?: 'user' | 'system' | 'agent';
  actorId?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================
// Audit Log Service
// ============================================================

export function createAuditEvent(input: CreateAuditEventInput): AuditEvent {
  const event: AuditEvent = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    actorType: input.actorType || 'system',
    actorId: input.actorId || 'system',
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    metadata: input.metadata || {},
    requestId: generateId(),
  };
  
  auditLogRepository.add(event);
  
  return event;
}

// ============================================================
// Query Functions
// ============================================================

export function getRecentAuditEvents(limit: number = 50): AuditEvent[] {
  return auditLogRepository.getAll().slice(0, limit);
}

export function getAuditEventsByResource(resourceType: ResourceType, resourceId: string): AuditEvent[] {
  return auditLogRepository
    .getAll()
    .filter((e) => e.resourceType === resourceType && e.resourceId === resourceId);
}

export function getAuditEventsByAction(action: AuditAction): AuditEvent[] {
  return auditLogRepository.getAll().filter((e) => e.action === action);
}

export function getAuditEventsByDateRange(start: Date, end: Date): AuditEvent[] {
  return auditLogRepository
    .getAll()
    .filter((e) => {
      const eventDate = new Date(e.timestamp);
      return eventDate >= start && eventDate <= end;
    });
}

// ============================================================
// Convenience Functions
// ============================================================

export function logProjectCreated(projectId: string, projectName: string): AuditEvent {
  return createAuditEvent({
    action: 'PROJECT_CREATED',
    resourceType: 'project',
    resourceId: projectId,
    metadata: { name: projectName },
  });
}

export function logAgentCreated(agentId: string, agentName: string, provider: string): AuditEvent {
  return createAuditEvent({
    action: 'AGENT_CREATED',
    resourceType: 'agent',
    resourceId: agentId,
    metadata: { name: agentName, provider },
  });
}

export function logToolExecuted(toolId: string, duration: number, success: boolean): AuditEvent {
  return createAuditEvent({
    action: 'TOOL_EXECUTED',
    resourceType: 'tool',
    resourceId: toolId,
    metadata: { duration, success },
  });
}

export function logWorkflowStarted(workflowId: string, runId: string): AuditEvent {
  return createAuditEvent({
    action: 'WORKFLOW_STARTED',
    resourceType: 'workflow',
    resourceId: workflowId,
    metadata: { runId },
  });
}

export function logEvidenceCreated(evidenceId: string, source: string): AuditEvent {
  return createAuditEvent({
    action: 'EVIDENCE_CREATED',
    resourceType: 'evidence',
    resourceId: evidenceId,
    metadata: { source },
  });
}

/**
 * OPUS67 — Zod Validation Schemas
 * 
 * Server-side and client-side validation using Zod.
 * All data entering the system must pass through these schemas.
 */

import { z } from 'zod';

// Helper for record types
const unknownRecord = z.record(z.string(), z.unknown());

// ============================================================
// Agent Schema
// ============================================================

export const agentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(2000),
  status: z.enum(['draft', 'active', 'paused', 'disabled']),
  provider: z.string().min(1),
  model: z.string().min(1),
  systemInstructions: z.string().max(10000),
  capabilities: z.array(z.string()),
  tools: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  status: z.enum(['draft', 'active', 'paused', 'disabled']),
  provider: z.string().min(1),
  model: z.string().min(1),
  systemInstructions: z.string().max(10000).optional(),
  capabilities: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
});

export type AgentInput = z.infer<typeof createAgentSchema>;

// ============================================================
// Tool Schema
// ============================================================

export const toolSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(2000),
  category: z.string().min(1),
  status: z.enum(['available', 'configuration_required', 'disabled', 'error']),
  inputSchema: unknownRecord,
  outputSchema: unknownRecord,
  permissions: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================
// Workflow Schema
// ============================================================

export const workflowStepSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  agentId: z.string().optional(),
  toolId: z.string().optional(),
  input: unknownRecord,
  output: unknownRecord.optional(),
  dependsOn: z.array(z.string()),
  errorPolicy: z.enum(['stop', 'retry', 'skip', 'fallback']),
});

export const workflowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(2000),
  status: z.enum(['draft', 'active', 'paused', 'archived']),
  steps: z.array(workflowStepSchema),
  triggers: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================
// Project Schema
// ============================================================

export const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(2000),
  status: z.enum(['active', 'paused', 'completed', 'archived']),
  owner: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================
// Evidence Schema
// ============================================================

export const evidenceSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  source: z.string().min(1),
  sourceType: z.enum(['execution', 'model_output', 'human_review', 'system_log', 'external']),
  timestamp: z.string(),
  hash: z.string().min(1),
  metadata: unknownRecord,
  status: z.enum(['unverified', 'system_generated', 'source_verified', 'human_reviewed', 'approved', 'rejected']),
  createdAt: z.string(),
});

// ============================================================
// Governance Schemas
// ============================================================

export const aiSystemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(2000),
  riskLevel: z.enum(['minimal', 'limited', 'high', 'unacceptable']),
  status: z.enum(['registered', 'under_review', 'approved', 'suspended']),
  lastAssessment: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================
// Audit Schema
// ============================================================

export const auditEventSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string(),
  actorType: z.enum(['system', 'user', 'agent']),
  actorId: z.string().min(1),
  action: z.string().min(1),
  resourceType: z.string().min(1),
  resourceId: z.string().min(1),
  metadata: unknownRecord,
  requestId: z.string().min(1),
});

// ============================================================
// Security: Ensure no secrets in metadata
// ============================================================

const SECRET_PATTERNS = [
  /api[_-]?key/i,
  /secret/i,
  /password/i,
  /token/i,
  /private[_-]?key/i,
];

export function containsSecrets(obj: Record<string, unknown>): boolean {
  for (const [key, value] of Object.entries(obj)) {
    if (SECRET_PATTERNS.some(pattern => pattern.test(key))) {
      return true;
    }
    if (typeof value === 'string' && SECRET_PATTERNS.some(pattern => pattern.test(value))) {
      return true;
    }
  }
  return false;
}

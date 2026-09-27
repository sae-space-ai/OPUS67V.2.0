/**
 * OPUS67 — Workflow Engine
 * 
 * Minimal but real workflow execution engine.
 * Manages workflow runs with state transitions and human oversight gates.
 */

import type { Workflow, WorkflowStep } from '../types';
import { workflowRepository } from './repository';
import { generateId } from './utils';
import { createAuditEvent } from './audit';

// ============================================================
// Workflow Run Types
// ============================================================

export type WorkflowRunStatus =
  | 'DRAFT'
  | 'READY'
  | 'RUNNING'
  | 'WAITING_HUMAN'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: WorkflowRunStatus;
  currentStepIndex: number;
  startedAt: string;
  completedAt?: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  stepResults: StepResult[];
  error?: string;
}

export interface StepResult {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'waiting_human';
  startedAt?: string;
  completedAt?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  humanDecision?: 'approved' | 'rejected' | 'changes_requested';
  humanNotes?: string;
}

// ============================================================
// Workflow Execution
// ============================================================

export function startWorkflowRun(
  workflowId: string,
  input: Record<string, unknown>
): WorkflowRun | null {
  const workflow = workflowRepository.getById(workflowId);
  if (!workflow) return null;
  
  if (workflow.status !== 'active') {
    throw new Error(`Workflow ${workflowId} is not active`);
  }
  
  const run: WorkflowRun = {
    id: generateId(),
    workflowId,
    status: 'RUNNING',
    currentStepIndex: 0,
    startedAt: new Date().toISOString(),
    input,
    stepResults: workflow.steps.map((step) => ({
      stepId: step.id,
      status: 'pending',
    })),
  };
  
  createAuditEvent({
    action: 'WORKFLOW_STARTED',
    resourceType: 'workflow',
    resourceId: workflowId,
    metadata: { runId: run.id },
  });
  
  return run;
}

export function advanceWorkflowRun(run: WorkflowRun): WorkflowRun {
  if (run.status !== 'RUNNING') {
    throw new Error(`Cannot advance workflow in status ${run.status}`);
  }
  
  const workflow = workflowRepository.getById(run.workflowId);
  if (!workflow) {
    throw new Error('Workflow not found');
  }
  
  // Mark current step as completed
  if (run.currentStepIndex < run.stepResults.length) {
    run.stepResults[run.currentStepIndex] = {
      ...run.stepResults[run.currentStepIndex],
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
  }
  
  // Move to next step
  run.currentStepIndex++;
  
  // Check if workflow is complete
  if (run.currentStepIndex >= workflow.steps.length) {
    run.status = 'COMPLETED';
    run.completedAt = new Date().toISOString();
    
    createAuditEvent({
      action: 'WORKFLOW_COMPLETED',
      resourceType: 'workflow',
      resourceId: run.workflowId,
      metadata: { runId: run.id },
    });
  } else {
    // Check if next step requires human oversight
    const nextStep = workflow.steps[run.currentStepIndex];
    if (nextStep.requiresHumanApproval) {
      run.status = 'WAITING_HUMAN';
      run.stepResults[run.currentStepIndex].status = 'waiting_human';
    } else {
      run.stepResults[run.currentStepIndex].status = 'running';
      run.stepResults[run.currentStepIndex].startedAt = new Date().toISOString();
    }
  }
  
  return run;
}

export function approveHumanGate(
  run: WorkflowRun,
  approved: boolean,
  notes?: string
): WorkflowRun {
  if (run.status !== 'WAITING_HUMAN') {
    throw new Error('Workflow is not waiting for human approval');
  }
  
  run.stepResults[run.currentStepIndex] = {
    ...run.stepResults[run.currentStepIndex],
    humanDecision: approved ? 'approved' : 'rejected',
    humanNotes: notes,
    status: approved ? 'completed' : 'failed',
    completedAt: new Date().toISOString(),
  };
  
  if (!approved) {
    run.status = 'FAILED';
    run.completedAt = new Date().toISOString();
    run.error = 'Human review rejected';
    
    createAuditEvent({
      action: 'WORKFLOW_FAILED',
      resourceType: 'workflow',
      resourceId: run.workflowId,
      metadata: { runId: run.id, reason: 'human_rejected' },
    });
  } else {
    run.status = 'RUNNING';
    run = advanceWorkflowRun(run);
  }
  
  return run;
}

export function cancelWorkflowRun(run: WorkflowRun): WorkflowRun {
  if (run.status === 'COMPLETED' || run.status === 'FAILED' || run.status === 'CANCELLED') {
    throw new Error(`Cannot cancel workflow in status ${run.status}`);
  }
  
  run.status = 'CANCELLED';
  run.completedAt = new Date().toISOString();
  
  createAuditEvent({
    action: 'WORKFLOW_CANCELLED',
    resourceType: 'workflow',
    resourceId: run.workflowId,
    metadata: { runId: run.id },
  });
  
  return run;
}

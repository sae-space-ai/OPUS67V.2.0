/**
 * OPUS67 — AI Execution Service
 * 
 * Connects AI providers with billing and usage tracking.
 * 
 * Flow:
 * 1. User requests AI generation
 * 2. Execution service calls provider
 * 3. Provider returns response + usage metadata
 * 4. Usage event is recorded
 * 5. If pricing is configured, charge is calculated
 * 6. Ledger entry is created
 * 7. Audit event is logged
 * 
 * Security:
 * - All execution happens server-side
 * - API keys never exposed to client
 * - Usage is measured server-side
 */

import { generateWithProvider, type GenerateOptions, type GenerateResult } from './providers';
import { meteringService } from '../billing/metering';
import { ledgerService } from '../billing/ledger';
import { createAuditEvent } from '../audit';
import { generateId } from '../utils';

// ============================================================
// Execution Types
// ============================================================

export interface ExecutionRequest {
  userId: string;
  projectId?: string;
  agentId?: string;
  providerId: string;
  prompt: string;
  options?: GenerateOptions;
}

export interface ExecutionResult {
  success: boolean;
  result?: GenerateResult;
  usageEventId?: string;
  chargeId?: string;
  error?: string;
}

// ============================================================
// Execution Service
// ============================================================

export class ExecutionService {
  /**
   * Execute AI generation with full tracking
   */
  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const executionId = generateId();
    const startTime = Date.now();

    try {
      // 1. Call AI provider
      const result = await generateWithProvider(
        request.providerId,
        request.prompt,
        request.options
      );

      // 2. Record usage events
      const usageEventIds = this.recordUsage(request, result, executionId);

      // 3. Create charges if pricing is configured
      const chargeIds = await this.createCharges(request, usageEventIds);

      // 4. Log audit event
      createAuditEvent({
        action: 'AI_EXECUTION_COMPLETED',
        resourceType: 'execution',
        resourceId: executionId,
        actorType: 'user',
        actorId: request.userId,
        metadata: {
          provider: request.providerId,
          model: result.model,
          totalTokens: result.usage.totalTokens,
          latency: result.latency,
          projectId: request.projectId,
          agentId: request.agentId,
        },
      });

      return {
        success: true,
        result,
        usageEventId: usageEventIds[0],
        chargeId: chargeIds[0],
      };
    } catch (error) {
      // Log failed execution
      createAuditEvent({
        action: 'AI_EXECUTION_FAILED',
        resourceType: 'execution',
        resourceId: executionId,
        actorType: 'user',
        actorId: request.userId,
        metadata: {
          provider: request.providerId,
          error: error instanceof Error ? error.message : 'Unknown error',
          projectId: request.projectId,
          agentId: request.agentId,
        },
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Record usage events for billing
   */
  private recordUsage(
    request: ExecutionRequest,
    result: GenerateResult,
    executionId: string
  ): string[] {
    const usageEventIds: string[] = [];

    // Record AI request
    const requestEvent = meteringService.recordUsage({
      userId: request.userId,
      projectId: request.projectId || null,
      resourceType: 'agent',
      resourceId: request.agentId || executionId,
      metric: 'ai_request',
      quantity: 1,
      unit: 'request',
      metadata: {
        executionId,
        provider: result.provider,
        model: result.model,
      },
      idempotencyKey: `exec-${executionId}-request`,
    });

    if (requestEvent) {
      usageEventIds.push(requestEvent.id);
    }

    // Record input tokens
    if (result.usage.promptTokens > 0) {
      const inputEvent = meteringService.recordUsage({
        userId: request.userId,
        projectId: request.projectId || null,
        resourceType: 'agent',
        resourceId: request.agentId || executionId,
        metric: 'input_tokens',
        quantity: result.usage.promptTokens,
        unit: 'token',
        metadata: {
          executionId,
          provider: result.provider,
          model: result.model,
        },
        idempotencyKey: `exec-${executionId}-input`,
      });

      if (inputEvent) {
        usageEventIds.push(inputEvent.id);
      }
    }

    // Record output tokens
    if (result.usage.completionTokens > 0) {
      const outputEvent = meteringService.recordUsage({
        userId: request.userId,
        projectId: request.projectId || null,
        resourceType: 'agent',
        resourceId: request.agentId || executionId,
        metric: 'output_tokens',
        quantity: result.usage.completionTokens,
        unit: 'token',
        metadata: {
          executionId,
          provider: result.provider,
          model: result.model,
        },
        idempotencyKey: `exec-${executionId}-output`,
      });

      if (outputEvent) {
        usageEventIds.push(outputEvent.id);
      }
    }

    return usageEventIds;
  }

  /**
   * Create charges for usage events
   */
  private async createCharges(
    request: ExecutionRequest,
    usageEventIds: string[]
  ): Promise<string[]> {
    const chargeIds: string[] = [];

    // Note: In production, this would:
    // 1. Get billing account for user
    // 2. Check if pricing is configured
    // 3. Calculate charges using pricing engine
    // 4. Create ledger entries
    // 5. Check spending limits

    // For now, we just log that charges would be created
    if (usageEventIds.length > 0) {
      console.log(`[ExecutionService] Would create ${usageEventIds.length} charges for execution`);
      
      // Log audit event for billing
      createAuditEvent({
        action: 'USAGE_RECORDED',
        resourceType: 'execution',
        resourceId: usageEventIds[0],
        actorType: 'system',
        actorId: 'billing-system',
        metadata: {
          userId: request.userId,
          usageEventCount: usageEventIds.length,
        },
      });
    }

    return chargeIds;
  }
}

// ============================================================
// Singleton Instance
// ============================================================

export const executionService = new ExecutionService();

// ============================================================
// Example Usage
// ============================================================

/**
 * Example: Execute AI generation
 * 
 * const result = await executionService.execute({
 *   userId: 'user-123',
 *   projectId: 'project-456',
 *   agentId: 'agent-789',
 *   providerId: 'openai',
 *   prompt: 'Explain quantum computing',
 *   options: {
 *     model: 'gpt-4',
 *     maxTokens: 500,
 *     temperature: 0.7,
 *   },
 * });
 * 
 * if (result.success) {
 *   console.log('Response:', result.result?.content);
 *   console.log('Usage:', result.result?.usage);
 *   console.log('Latency:', result.result?.latency, 'ms');
 * } else {
 *   console.error('Error:', result.error);
 * }
 */

/**
 * OPUS67 — Metering Service
 * 
 * Records usage events for billing purposes.
 * 
 * IMPORTANT — SERVER-SIDE AUTHORITY:
 * 
 * Usage events MUST originate or be validated server-side.
 * Browser cannot be trusted to report usage.
 * 
 * Flow:
 * 1. User performs action (e.g., AI request)
 * 2. Server processes action
 * 3. Server records usage event
 * 4. Pricing engine calculates charge
 * 5. Ledger records charge
 * 
 * Browser NEVER reports usage directly.
 * 
 * CURRENT STATUS:
 * - Metering interface defined ✅
 * - Usage event recording ✅
 * - Idempotency checks ✅
 * - Real metering ❌ (requires backend integration)
 * 
 * EXAMPLE METRICS:
 * - ai_request: Each AI API call
 * - input_tokens: Tokens sent to AI
 * - output_tokens: Tokens received from AI
 * - tool_execution: Tool invocations
 * - workflow_run: Workflow executions
 * - storage_bytes: Storage used
 */

import type { UsageEvent, UsageMetric } from '../../types/billing';
import { generateId } from '../utils';

// ============================================================
// Metering Service
// ============================================================

export class MeteringService {
  private usageEvents: UsageEvent[] = [];

  /**
   * Load usage events from database
   * In production, this would fetch from database
   */
  loadUsageEvents(events: UsageEvent[]): void {
    this.usageEvents = events;
  }

  /**
   * Record a usage event
   * 
   * This is the core metering operation.
   * Must be called server-side when user performs billable action.
   * 
   * IMPORTANT:
   * - Must have idempotency key to prevent duplicates
   * - Must include all relevant metadata
   * - Timestamp should be server time, not client time
   */
  recordUsage(params: {
    userId: string;
    projectId: string | null;
    resourceType: string;
    resourceId: string;
    metric: UsageMetric;
    quantity: number;
    unit: string;
    metadata?: Record<string, unknown>;
    idempotencyKey: string;
  }): UsageEvent | null {
    // Check idempotency
    if (this.hasEventWithIdempotencyKey(params.idempotencyKey)) {
      console.warn('[MeteringService] Duplicate usage prevented:', params.idempotencyKey);
      return null;
    }

    // Validate quantity
    if (params.quantity < 0) {
      throw new Error('Usage quantity cannot be negative');
    }

    // Create usage event
    const event: UsageEvent = {
      id: generateId(),
      userId: params.userId,
      projectId: params.projectId,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      metric: params.metric,
      quantity: params.quantity,
      unit: params.unit,
      timestamp: new Date().toISOString(), // Server time
      metadata: params.metadata || {},
      idempotencyKey: params.idempotencyKey,
    };

    // Add to usage events (in production, persist to database)
    this.usageEvents.push(event);

    return event;
  }

  /**
   * Record AI request usage
   * 
   * Convenience method for recording AI API calls
   */
  recordAIRequest(params: {
    userId: string;
    projectId: string | null;
    agentId: string;
    inputTokens?: number;
    outputTokens?: number;
    idempotencyKey: string;
  }): UsageEvent[] {
    const events: UsageEvent[] = [];

    // Record the request itself
    const requestEvent = this.recordUsage({
      userId: params.userId,
      projectId: params.projectId,
      resourceType: 'agent',
      resourceId: params.agentId,
      metric: 'ai_request',
      quantity: 1,
      unit: 'request',
      metadata: {
        inputTokens: params.inputTokens,
        outputTokens: params.outputTokens,
      },
      idempotencyKey: `${params.idempotencyKey}:request`,
    });

    if (requestEvent) {
      events.push(requestEvent);
    }

    // Record input tokens if provided
    if (params.inputTokens && params.inputTokens > 0) {
      const inputEvent = this.recordUsage({
        userId: params.userId,
        projectId: params.projectId,
        resourceType: 'agent',
        resourceId: params.agentId,
        metric: 'input_tokens',
        quantity: params.inputTokens,
        unit: 'token',
        idempotencyKey: `${params.idempotencyKey}:input`,
      });

      if (inputEvent) {
        events.push(inputEvent);
      }
    }

    // Record output tokens if provided
    if (params.outputTokens && params.outputTokens > 0) {
      const outputEvent = this.recordUsage({
        userId: params.userId,
        projectId: params.projectId,
        resourceType: 'agent',
        resourceId: params.agentId,
        metric: 'output_tokens',
        quantity: params.outputTokens,
        unit: 'token',
        idempotencyKey: `${params.idempotencyKey}:output`,
      });

      if (outputEvent) {
        events.push(outputEvent);
      }
    }

    return events;
  }

  /**
   * Record tool execution usage
   */
  recordToolExecution(params: {
    userId: string;
    projectId: string | null;
    toolId: string;
    idempotencyKey: string;
  }): UsageEvent | null {
    return this.recordUsage({
      userId: params.userId,
      projectId: params.projectId,
      resourceType: 'tool',
      resourceId: params.toolId,
      metric: 'tool_execution',
      quantity: 1,
      unit: 'execution',
      idempotencyKey: params.idempotencyKey,
    });
  }

  /**
   * Record workflow run usage
   */
  recordWorkflowRun(params: {
    userId: string;
    projectId: string | null;
    workflowId: string;
    idempotencyKey: string;
  }): UsageEvent | null {
    return this.recordUsage({
      userId: params.userId,
      projectId: params.projectId,
      resourceType: 'workflow',
      resourceId: params.workflowId,
      metric: 'workflow_run',
      quantity: 1,
      unit: 'run',
      idempotencyKey: params.idempotencyKey,
    });
  }

  /**
   * Get usage events for a user
   */
  getUsageByUser(userId: string): UsageEvent[] {
    return this.usageEvents
      .filter((e) => e.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get usage events in date range
   */
  getUsageByDateRange(userId: string, startDate: Date, endDate: Date): UsageEvent[] {
    return this.usageEvents.filter((e) => {
      if (e.userId !== userId) return false;
      
      const eventDate = new Date(e.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  /**
   * Get usage summary by metric
   */
  getUsageSummary(userId: string, startDate: Date, endDate: Date): Record<UsageMetric, number> {
    const events = this.getUsageByDateRange(userId, startDate, endDate);
    
    const summary: Record<UsageMetric, number> = {
      ai_request: 0,
      input_tokens: 0,
      output_tokens: 0,
      tool_execution: 0,
      workflow_run: 0,
      storage_bytes: 0,
      api_request: 0,
    };

    for (const event of events) {
      summary[event.metric] += event.quantity;
    }

    return summary;
  }

  /**
   * Check if event with idempotency key exists
   */
  private hasEventWithIdempotencyKey(key: string): boolean {
    return this.usageEvents.some((e) => e.idempotencyKey === key);
  }
}

// ============================================================
// Singleton Instance
// ============================================================

export const meteringService = new MeteringService();

// ============================================================
// Example Usage
// ============================================================

/**
 * Example: Record AI request in API route
 * 
 * // Server-side API route
 * app.post('/api/agents/:id/chat', async (req, res) => {
 *   const { userId, projectId, agentId, message } = req.body;
 *   
 *   // 1. Process AI request
 *   const response = await aiProvider.generate(message);
 *   
 *   // 2. Record usage (server-side)
 *   const usageEvents = meteringService.recordAIRequest({
 *     userId,
 *     projectId,
 *     agentId,
 *     inputTokens: response.usage.prompt_tokens,
 *     outputTokens: response.usage.completion_tokens,
 *     idempotencyKey: `ai-${Date.now()}-${userId}`,
 *   });
 *   
 *   // 3. Create charges for each usage event
 *   for (const usage of usageEvents) {
 *     const charge = ledgerService.createChargeFromUsage(usage, billingAccountId);
 *     if (charge) {
 *       await db.ledger.create(charge); // Persist in transaction
 *     }
 *   }
 *   
 *   // 4. Return response
 *   res.json({ response: response.content });
 * });
 */

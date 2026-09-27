/**
 * OPUS67 — Billing Domain Types
 * 
 * Core types for usage metering, pricing, ledger, and payments.
 * 
 * IMPORTANT — ARCHITECTURAL BOUNDARIES:
 * 
 * 1. USAGE ≠ PRICE
 *    - Usage records consumption (tokens, requests, etc.)
 *    - Price transforms usage into monetary amounts
 *    - These are separate concerns
 * 
 * 2. LEDGER ≠ PAYMENT
 *    - Ledger records economic movements (charges, credits)
 *    - Payment processes actual money transfer
 *    - Webhook confirmation is the authority, not browser return
 * 
 * 3. MONEY PRECISION
 *    - NEVER use floating-point for money
 *    - Use integer minor units (cents): 100 = $1.00
 *    - All calculations in minor units
 * 
 * 4. SERVER-SIDE AUTHORITY
 *    - Browser NEVER decides balance, credits, charges
 *    - All economic state changes happen server-side
 *    - Webhook verification is mandatory
 * 
 * 5. IDEMPOTENCY
 *    - Every economic operation must be idempotent
 *    - Prevent double-charges, duplicate webhooks
 *    - Use idempotency keys
 * 
 * 6. PRICE VERSIONING
 *    - Prices can change over time
 *    - Historical charges reference the price version used
 *    - Never retroactively change historical calculations
 * 
 * CURRENT STATUS:
 * - Types defined (this file)
 * - Pricing engine logic implemented
 * - Ledger logic implemented
 * - Implementation requires backend server + payment provider
 * - Status: CODE READY, EXTERNAL CONFIGURATION REQUIRED
 */

// ============================================================
// Money — Integer Minor Units
// ============================================================

/**
 * All monetary amounts are stored as integers in minor units.
 * Example: 100 = $1.00 USD, 100 = €1.00 EUR
 * 
 * This prevents floating-point precision errors.
 * Display functions convert to major units for UI.
 */

export type Currency = 'USD' | 'EUR' | 'GBP';

export interface Money {
  amount: number; // Integer minor units (e.g., 100 = $1.00)
  currency: Currency;
}

// ============================================================
// Billing Account
// ============================================================

export type BillingAccountStatus = 'active' | 'suspended' | 'closed';

export interface BillingAccount {
  id: string;
  userId: string;
  providerCustomerId: string | null; // Stripe customer ID, etc.
  status: BillingAccountStatus;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Usage Event — Server-Side Only
// ============================================================

/**
 * Usage events MUST originate or be validated server-side.
 * Browser cannot be trusted to report usage.
 * 
 * Examples:
 * - AI_REQUEST: Each AI API call
 * - INPUT_TOKENS: Tokens sent to AI
 * - OUTPUT_TOKENS: Tokens received from AI
 * - TOOL_EXECUTION: Tool invocations
 * - WORKFLOW_RUN: Workflow executions
 * - STORAGE: Storage used (bytes)
 * 
 * CURRENT STATUS:
 * - Types defined
 * - Metering service stub exists
 * - Real metering requires backend integration
 */

export type UsageMetric =
  | 'ai_request'
  | 'input_tokens'
  | 'output_tokens'
  | 'tool_execution'
  | 'workflow_run'
  | 'storage_bytes'
  | 'api_request';

export interface UsageEvent {
  id: string;
  userId: string;
  projectId: string | null;
  resourceType: string; // e.g., 'agent', 'tool', 'workflow'
  resourceId: string;
  metric: UsageMetric;
  quantity: number; // Integer (tokens, count, bytes)
  unit: string; // e.g., 'token', 'request', 'byte'
  timestamp: string; // ISO timestamp
  metadata: Record<string, unknown>;
  idempotencyKey: string; // Prevent duplicate recording
}

// ============================================================
// Price Rule — Versioned
// ============================================================

/**
 * Price rules are versioned to allow price changes without
 * affecting historical calculations.
 * 
 * When a usage event is charged, it references:
 * - The price rule ID
 * - The price rule version
 * - The calculated amount
 * 
 * This ensures historical charges can always be reconstructed.
 * 
 * CURRENT STATUS:
 * - Types defined
 * - Pricing engine implemented (see lib/billing/pricing.ts)
 * - Real pricing requires database persistence
 */

export interface PriceRule {
  id: string;
  metric: UsageMetric;
  unit: string;
  unitPrice: number; // Integer minor units per unit
  currency: Currency;
  activeFrom: string; // ISO timestamp
  activeTo: string | null; // null = currently active
  version: number; // Incremented on changes
  createdAt: string;
}

// ============================================================
// Ledger Entry — Immutable Record
// ============================================================

/**
 * Ledger entries are immutable economic records.
 * Once created, they cannot be modified (only reversed).
 * 
 * Types:
 * - charge: Usage converted to monetary amount
 * - credit: Prepaid credits added
 * - adjustment: Manual correction (with reason)
 * - refund: Money returned to customer
 * - payment: Payment received
 * 
 * Every entry has:
 * - Unique ID
 * - Timestamp
 * - Amount (integer minor units)
 * - Description
 * - References to usage event or payment
 */

export type LedgerEntryType = 'charge' | 'credit' | 'adjustment' | 'refund' | 'payment';

export interface LedgerEntry {
  id: string;
  billingAccountId: string;
  usageEventId: string | null; // For charges
  paymentId: string | null; // For payments
  type: LedgerEntryType;
  amount: number; // Integer minor units (positive = credit, negative = debit)
  currency: Currency;
  timestamp: string;
  description: string;
  metadata?: Record<string, unknown>;
  idempotencyKey: string;
}

// ============================================================
// Payment
// ============================================================

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface Payment {
  id: string;
  billingAccountId: string;
  providerPaymentId: string; // Stripe payment_intent ID, etc.
  amount: number; // Integer minor units
  currency: Currency;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

// ============================================================
// Checkout Session
// ============================================================

export type CheckoutStatus = 'open' | 'complete' | 'expired';

export interface CheckoutSession {
  id: string;
  billingAccountId: string;
  providerSessionId: string; // Stripe checkout session ID
  amount: number;
  currency: Currency;
  status: CheckoutStatus;
  createdAt: string;
  expiresAt: string;
  completedAt: string | null;
}

// ============================================================
// Webhook Event
// ============================================================

/**
 * Webhook events from payment provider.
 * MUST be verified with signature before processing.
 * 
 * Security:
 * - Verify signature using provider's webhook secret
 * - Check timestamp to prevent replay attacks
 * - Use idempotency key to prevent duplicate processing
 * - Log all webhook events for audit
 */

export type WebhookEventType =
  | 'checkout.session.completed'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'charge.refunded'
  | 'customer.subscription.created'
  | 'customer.subscription.deleted';

export interface WebhookEvent {
  id: string;
  providerEventId: string;
  eventType: WebhookEventType;
  payload: Record<string, unknown>;
  receivedAt: string;
  processedAt: string | null;
  status: 'received' | 'processing' | 'processed' | 'failed';
  errorMessage: string | null;
  idempotencyKey: string;
}

// ============================================================
// Spending Limit
// ============================================================

/**
 * Spending limits prevent unexpected charges.
 * 
 * Levels:
 * - warning_50: Notify at 50% of limit
 * - warning_80: Notify at 80% of limit
 * - hard_limit: Block usage at 100%
 * 
 * Percentages are configurable per user.
 * Hard limit prevents race conditions.
 */

export interface SpendingLimit {
  id: string;
  billingAccountId: string;
  monthlyLimit: number; // Integer minor units
  warningThresholds: number[]; // Percentages: [50, 80]
  hardStopEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Credit Balance
// ============================================================

/**
 * Credit types (not all equivalent):
 * 
 * - PROMOTIONAL: Free credits (may have expiration)
 * - PURCHASED: Paid credits (no expiration typically)
 * - REFUND: Credits from refund
 * - ADJUSTMENT: Manual correction
 * 
 * Different types may have different consumption rules.
 */

export type CreditType = 'promotional' | 'purchased' | 'refund' | 'adjustment';

export interface CreditBalance {
  id: string;
  billingAccountId: string;
  type: CreditType;
  amount: number; // Integer minor units
  currency: Currency;
  expiresAt: string | null;
  createdAt: string;
  consumedAt: string | null;
}

// ============================================================
// Usage Aggregation
// ============================================================

export interface UsageSummary {
  userId: string;
  period: 'today' | '7days' | '30days' | 'current_billing_period';
  startDate: string;
  endDate: string;
  byMetric: Record<UsageMetric, {
    quantity: number;
    unit: string;
    estimatedCost: Money;
  }>;
  totalEstimatedCost: Money;
}

// ============================================================
// Billing Audit Events
// ============================================================

export type BillingAuditAction =
  | 'BILLING_ACCOUNT_CREATED'
  | 'CHECKOUT_CREATED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'USAGE_RECORDED'
  | 'CHARGE_CREATED'
  | 'CREDIT_ADDED'
  | 'CREDIT_CONSUMED'
  | 'REFUND_CONFIRMED'
  | 'LIMIT_CHANGED'
  | 'WEBHOOK_RECEIVED'
  | 'WEBHOOK_PROCESSED'
  | 'PRICE_RULE_CREATED'
  | 'PRICE_RULE_UPDATED';

// ============================================================
// Pricing Status
// ============================================================

/**
 * PRICING_STATUS values:
 * 
 * - NOT_CONFIGURED: No price rules defined
 * - CONFIGURED: Price rules exist but not activated
 * - ACTIVE: Pricing is active and being applied
 * - SUSPENDED: Pricing temporarily disabled
 * 
 * CURRENT STATUS: NOT_CONFIGURED
 * Commercial pricing requires human approval.
 * No prices are hardcoded or invented.
 */

export type PricingStatus = 'not_configured' | 'configured' | 'active' | 'suspended';

// ============================================================
// Payment Mode
// ============================================================

/**
 * PAYMENT_MODE values:
 * 
 * - TEST: Sandbox mode, no real charges
 * - LIVE: Production mode, real charges
 * 
 * CRITICAL: LIVE mode requires explicit human approval.
 * Never auto-activate LIVE mode.
 * Never mix TEST and LIVE credentials.
 * 
 * CURRENT STATUS: TEST (default)
 */

export type PaymentMode = 'test' | 'live';

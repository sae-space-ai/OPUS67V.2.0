# OPUS67 — Billing Setup Guide

## Overview

This guide explains how to configure usage-based billing for OPUS67.

## Current Status

**CODE READY** — Implementation complete, requires external configuration:
- ✅ Pricing engine implemented
- ✅ Ledger service implemented
- ✅ Metering service implemented
- ✅ Billing UI created
- ❌ Backend server (required)
- ❌ Payment provider (required)
- ❌ Commercial pricing (requires human approval)

## Architecture

### Billing Flow

```
1. User performs action (e.g., AI request)
2. Server processes action
3. Server records usage event (metering)
4. Pricing engine calculates charge
5. Ledger records charge
6. Check balance and spending limits
7. If prepaid: deduct from balance
8. If postpaid: accumulate for invoice
9. Periodically: create invoice and process payment
```

### Separation of Concerns

**USAGE** (Metering Service)
- Records consumption
- Server-side only
- Idempotent

**PRICE** (Pricing Engine)
- Transforms usage into monetary amounts
- Versioned price rules
- Deterministic calculation

**LEDGER** (Ledger Service)
- Records economic movements
- Immutable entries
- Double-entry bookkeeping

**BILLING** (Billing Service)
- Calculates invoices
- Manages billing periods
- Generates statements

**PAYMENT** (Payment Provider)
- Processes actual money transfer
- Webhook confirmation
- Receipt generation

## Required Components

### 1. Backend Server

You need a backend server to handle:
- Usage event recording
- Price calculation
- Ledger management
- Payment provider integration
- Webhook processing

### 2. Database Tables

```sql
-- Billing accounts
CREATE TABLE billing_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_customer_id TEXT, -- Stripe customer ID
  status TEXT DEFAULT 'active',
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage events
CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  project_id UUID,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  metric TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  idempotency_key TEXT UNIQUE NOT NULL
);

-- Price rules
CREATE TABLE price_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_price INTEGER NOT NULL, -- Minor units (cents)
  currency TEXT DEFAULT 'USD',
  active_from TIMESTAMP WITH TIME ZONE NOT NULL,
  active_to TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ledger entries
CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_account_id UUID REFERENCES billing_accounts(id),
  usage_event_id UUID REFERENCES usage_events(id),
  payment_id UUID,
  type TEXT NOT NULL, -- 'charge', 'credit', 'payment', 'refund', 'adjustment'
  amount INTEGER NOT NULL, -- Minor units
  currency TEXT DEFAULT 'USD',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  idempotency_key TEXT UNIQUE NOT NULL
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_account_id UUID REFERENCES billing_accounts(id),
  provider_payment_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook events
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'received',
  error_message TEXT,
  idempotency_key TEXT UNIQUE NOT NULL
);

-- Spending limits
CREATE TABLE spending_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_account_id UUID REFERENCES billing_accounts(id),
  monthly_limit INTEGER NOT NULL, -- Minor units
  warning_thresholds INTEGER[] DEFAULT '{50,80}',
  hard_stop_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_usage_events_user_id ON usage_events(user_id);
CREATE INDEX idx_usage_events_timestamp ON usage_events(timestamp);
CREATE INDEX idx_ledger_entries_billing_account_id ON ledger_entries(billing_account_id);
CREATE INDEX idx_ledger_entries_timestamp ON ledger_entries(timestamp);
CREATE INDEX idx_payments_billing_account_id ON payments(billing_account_id);
```

### 3. Environment Variables

Add to `.env.local` or Vercel environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/opus67

# Payment Provider (Stripe example)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLIC_KEY=pk_test_...

# Payment Mode
PAYMENT_MODE=test  # or 'live' for production
```

**IMPORTANT:**
- Never commit secrets to Git
- Use TEST keys for development
- Use LIVE keys only for production
- Rotate keys periodically

## Payment Provider Setup (Stripe Example)

### 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create account or sign in
3. Switch to test mode for development

### 2. Get API Keys

1. Go to "Developers" → "API keys"
2. Copy:
   - Publishable key (public, safe for client)
   - Secret key (private, server-side only)

### 3. Configure Webhooks

1. Go to "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Endpoint URL:
   - Development: `http://localhost:3000/api/billing/webhook`
   - Production: `https://opus67.vercel.app/api/billing/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy webhook signing secret

### 4. Environment Variables

```bash
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLIC_KEY=pk_test_51...
PAYMENT_MODE=test
```

## Pricing Configuration

### Current Status

**PRICING NOT CONFIGURED**

Commercial pricing requires human approval. No prices are hardcoded.

### Future Configuration

When pricing is approved, create price rules:

```typescript
// Example: $0.01 per AI request
const aiRequestPrice: PriceRule = {
  id: generateId(),
  metric: 'ai_request',
  unit: 'request',
  unitPrice: 1, // 1 cent = $0.01
  currency: 'USD',
  activeFrom: new Date().toISOString(),
  activeTo: null,
  version: 1,
  createdAt: new Date().toISOString(),
};

// Example: $0.00001 per input token
const inputTokenPrice: PriceRule = {
  id: generateId(),
  metric: 'input_tokens',
  unit: 'token',
  unitPrice: 0.001, // Rounded to 1 for integer minor units
  currency: 'USD',
  activeFrom: new Date().toISOString(),
  activeTo: null,
  version: 1,
  createdAt: new Date().toISOString(),
};

pricingEngine.loadPriceRules([aiRequestPrice, inputTokenPrice]);
pricingEngine.activate();
```

### Price Versioning

When prices change:

1. Create new price rule with incremented version
2. Set `activeTo` on old rule
3. Set `activeFrom` on new rule
4. Historical charges reference old version

```typescript
// Old price (deactivate)
oldPriceRule.activeTo = new Date().toISOString();

// New price (activate)
const newPriceRule = {
  ...oldPriceRule,
  id: generateId(),
  unitPrice: 2, // New price: 2 cents
  activeFrom: new Date().toISOString(),
  activeTo: null,
  version: oldPriceRule.version + 1,
};
```

## Usage Metering

### Server-Side Recording

Usage events MUST be recorded server-side:

```typescript
// Example: Record AI request in API route
app.post('/api/agents/:id/chat', async (req, res) => {
  const { userId, projectId, agentId, message } = req.body;
  
  // 1. Process AI request
  const response = await aiProvider.generate(message);
  
  // 2. Record usage (server-side)
  const usageEvents = meteringService.recordAIRequest({
    userId,
    projectId,
    agentId,
    inputTokens: response.usage.prompt_tokens,
    outputTokens: response.usage.completion_tokens,
    idempotencyKey: `ai-${Date.now()}-${userId}`,
  });
  
  // 3. Create charges for each usage event
  for (const usage of usageEvents) {
    const charge = ledgerService.createChargeFromUsage(usage, billingAccountId);
    if (charge) {
      await db.ledger.create(charge); // Persist in transaction
    }
  }
  
  // 4. Return response
  res.json({ response: response.content });
});
```

### Idempotency

Every usage event must have a unique idempotency key:

```typescript
idempotencyKey: `ai-${timestamp}-${userId}-${requestId}`
```

This prevents duplicate charges if the same request is processed multiple times.

## Webhook Processing

### Webhook Endpoint

```typescript
// POST /api/billing/webhook
app.post('/api/billing/webhook', async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const payload = req.body;
  
  // 1. Verify webhook signature
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  // 2. Check idempotency
  const idempotencyKey = `webhook-${event.id}`;
  if (await webhookExists(event.id)) {
    return res.status(200).json({ received: true });
  }
  
  // 3. Process event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }
  
  // 4. Record webhook event
  await db.webhookEvents.create({
    providerEventId: event.id,
    eventType: event.type,
    payload: event.data,
    status: 'processed',
    idempotencyKey,
  });
  
  res.status(200).json({ received: true });
});
```

### Webhook Security

1. **Verify signature**: Use provider's webhook secret
2. **Check timestamp**: Prevent replay attacks
3. **Idempotency**: Prevent duplicate processing
4. **Log everything**: Audit trail for all webhooks

## Spending Limits

### Configuration

```typescript
const spendingLimit: SpendingLimit = {
  id: generateId(),
  billingAccountId: 'billing-123',
  monthlyLimit: 10000, // $100.00 in cents
  warningThresholds: [50, 80], // 50% and 80%
  hardStopEnabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

### Enforcement

Before processing usage:

```typescript
async function checkSpendingLimit(userId: string, estimatedCharge: number): Promise<boolean> {
  const limit = await getSpendingLimit(userId);
  const currentUsage = await getCurrentMonthUsage(userId);
  
  const newTotal = currentUsage + estimatedCharge;
  
  // Check hard limit
  if (limit.hardStopEnabled && newTotal > limit.monthlyLimit) {
    return false; // Block usage
  }
  
  // Check warnings
  const percentage = (newTotal / limit.monthlyLimit) * 100;
  for (const threshold of limit.warningThresholds) {
    if (percentage >= threshold) {
      await sendWarningNotification(userId, threshold);
    }
  }
  
  return true; // Allow usage
}
```

## Testing

### Sandbox Mode

Use test mode for development:

```bash
PAYMENT_MODE=test
STRIPE_SECRET_KEY=sk_test_...
```

Test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Authentication required: `4000 0025 0000 3155`

### Manual Testing Checklist

- [ ] Usage events recorded correctly
- [ ] Charges calculated correctly
- [ ] Ledger entries created
- [ ] Balance updated
- [ ] Spending limits enforced
- [ ] Webhooks processed
- [ ] Duplicate webhooks prevented
- [ ] Payment success handled
- [ ] Payment failure handled
- [ ] Refunds processed correctly

## Compliance

### PCI DSS

OPUS67 does NOT handle card data directly. Payment provider handles:
- Card number capture
- CVV validation
- Tokenization
- PCI compliance

### GDPR

Billing data retention:
- Usage events: Retained for billing period + legal requirement
- Ledger entries: Retained for accounting requirements (typically 7 years)
- Payment records: Retained for legal requirements

### Tax/VAT

When implementing billing:
- Determine tax obligations by jurisdiction
- Configure tax calculation (Stripe Tax, etc.)
- Generate proper invoices
- Handle VAT for EU customers

## Next Steps

After billing is configured:

1. **Implement Invoicing**
   - Monthly invoice generation
   - PDF invoice creation
   - Email delivery

2. **Add Credit System**
   - Prepaid credits
   - Promotional credits
   - Credit expiration

3. **Implement Refunds**
   - Refund requests
   - Partial refunds
   - Refund tracking

4. **Add Analytics**
   - Usage trends
   - Cost optimization
   - Revenue reporting

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [PCI DSS Compliance](https://www.pcisecuritystandards.org/)
- [GDPR Guidelines](https://gdpr-info.eu/)

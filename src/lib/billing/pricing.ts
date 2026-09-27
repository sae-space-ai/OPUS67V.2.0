/**
 * OPUS67 — Pricing Engine
 * 
 * Calculates monetary amounts from usage events using price rules.
 * 
 * IMPORTANT — DESIGN PRINCIPLES:
 * 
 * 1. USAGE ≠ PRICE
 *    - Usage records consumption (tokens, requests, etc.)
 *    - Price transforms usage into monetary amounts
 *    - These are separate concerns
 * 
 * 2. PRICE VERSIONING
 *    - Prices can change over time
 *    - Each charge references the price version used
 *    - Historical charges can always be reconstructed
 * 
 * 3. MONEY PRECISION
 *    - All amounts in integer minor units (cents)
 *    - 100 = $1.00 USD
 *    - No floating-point for money
 * 
 * 4. PRICING STATUS
 *    - NOT_CONFIGURED: No price rules defined
 *    - CONFIGURED: Rules exist but not activated
 *    - ACTIVE: Pricing is active
 * 
 * CURRENT STATUS:
 * - Pricing engine logic implemented ✅
 * - Price rule matching ✅
 * - Amount calculation ✅
 * - Version tracking ✅
 * - Real pricing data ❌ (requires database)
 * - Commercial prices ❌ (requires human approval)
 */

import type { PriceRule, UsageEvent, Money, Currency, PricingStatus } from '../../types/billing';

// ============================================================
// Pricing Engine
// ============================================================

export class PricingEngine {
  private priceRules: PriceRule[] = [];
  private status: PricingStatus = 'not_configured';

  /**
   * Load price rules from database
   * In production, this would fetch from database
   */
  loadPriceRules(rules: PriceRule[]): void {
    this.priceRules = rules;
    this.status = rules.length > 0 ? 'configured' : 'not_configured';
  }

  /**
   * Activate pricing
   * Called after human approval of commercial pricing
   */
  activate(): void {
    if (this.priceRules.length === 0) {
      throw new Error('Cannot activate pricing: no price rules configured');
    }
    this.status = 'active';
  }

  /**
   * Get pricing status
   */
  getStatus(): PricingStatus {
    return this.status;
  }

  /**
   * Find applicable price rule for a usage event
   * 
   * Rules:
   * 1. Match metric
   * 2. Must be active at time of usage
   * 3. Use most recent version if multiple match
   */
  findPriceRule(usage: UsageEvent): PriceRule | null {
    const usageTime = new Date(usage.timestamp);
    
    const matchingRules = this.priceRules.filter((rule) => {
      // Match metric
      if (rule.metric !== usage.metric) return false;
      
      // Check if active at usage time
      const activeFrom = new Date(rule.activeFrom);
      const activeTo = rule.activeTo ? new Date(rule.activeTo) : null;
      
      if (usageTime < activeFrom) return false;
      if (activeTo && usageTime > activeTo) return false;
      
      return true;
    });
    
    if (matchingRules.length === 0) {
      return null;
    }
    
    // Return most recent version
    return matchingRules.sort((a, b) => b.version - a.version)[0];
  }

  /**
   * Calculate charge for a usage event
   * 
   * Returns:
   * - amount: Integer minor units
   * - currency: Currency code
   * - priceRuleId: Reference to price rule used
   * - priceRuleVersion: Version of price rule
   * 
   * This ensures historical charges can be reconstructed.
   */
  calculateCharge(usage: UsageEvent): {
    amount: number;
    currency: Currency;
    priceRuleId: string;
    priceRuleVersion: number;
  } | null {
    if (this.status !== 'active') {
      console.warn('[PricingEngine] Pricing not active. Cannot calculate charges.');
      return null;
    }
    
    const priceRule = this.findPriceRule(usage);
    
    if (!priceRule) {
      console.warn(
        `[PricingEngine] No price rule found for metric: ${usage.metric}`
      );
      return null;
    }
    
    // Calculate amount in minor units
    // amount = quantity * unitPrice
    // Example: 1000 tokens * 2 cents/token = 2000 cents = $20.00
    const amount = usage.quantity * priceRule.unitPrice;
    
    return {
      amount,
      currency: priceRule.currency,
      priceRuleId: priceRule.id,
      priceRuleVersion: priceRule.version,
    };
  }

  /**
   * Estimate cost for usage (without creating charge)
   * Useful for displaying estimated costs to user
   */
  estimateCost(usage: UsageEvent): Money | null {
    const charge = this.calculateCharge(usage);
    
    if (!charge) {
      return null;
    }
    
    return {
      amount: charge.amount,
      currency: charge.currency,
    };
  }

  /**
   * Get all price rules for a metric
   */
  getPriceRulesForMetric(metric: string): PriceRule[] {
    return this.priceRules
      .filter((rule) => rule.metric === metric)
      .sort((a, b) => b.version - a.version);
  }

  /**
   * Get currently active price rule for a metric
   */
  getActivePriceRule(metric: string): PriceRule | null {
    const now = new Date();
    
    return this.priceRules.find((rule) => {
      if (rule.metric !== metric) return false;
      
      const activeFrom = new Date(rule.activeFrom);
      const activeTo = rule.activeTo ? new Date(rule.activeTo) : null;
      
      if (now < activeFrom) return false;
      if (activeTo && now > activeTo) return false;
      
      return true;
    }) || null;
  }
}

// ============================================================
// Money Utilities
// ============================================================

/**
 * Format money for display
 * Converts minor units to major units with proper formatting
 * 
 * Example: formatMoney(1234, 'USD') → "$12.34"
 */
export function formatMoney(amount: number, currency: Currency): string {
  const majorUnits = amount / 100;
  
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  
  return `${symbols[currency]}${majorUnits.toFixed(2)}`;
}

/**
 * Parse money from string
 * Converts display format to minor units
 * 
 * Example: parseMoney("$12.34", "USD") → 1234
 */
export function parseMoney(value: string, currency: Currency): number {
  // Remove currency symbol and parse
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  
  const cleaned = value.replace(symbols[currency], '').trim();
  const majorUnits = parseFloat(cleaned);
  
  if (isNaN(majorUnits)) {
    throw new Error(`Invalid money value: ${value}`);
  }
  
  // Convert to minor units (integer)
  return Math.round(majorUnits * 100);
}

/**
 * Add two money amounts
 * Ensures currencies match
 */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add different currencies: ${a.currency} + ${b.currency}`);
  }
  
  return {
    amount: a.amount + b.amount,
    currency: a.currency,
  };
}

/**
 * Subtract money amounts
 * Ensures currencies match
 */
export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot subtract different currencies: ${a.currency} - ${b.currency}`);
  }
  
  return {
    amount: a.amount - b.amount,
    currency: a.currency,
  };
}

/**
 * Check if money amount is zero
 */
export function isZero(money: Money): boolean {
  return money.amount === 0;
}

/**
 * Check if money amount is positive
 */
export function isPositive(money: Money): boolean {
  return money.amount > 0;
}

/**
 * Check if money amount is negative
 */
export function isNegative(money: Money): boolean {
  return money.amount < 0;
}

// ============================================================
// Singleton Instance
// ============================================================

export const pricingEngine = new PricingEngine();

// ============================================================
// Example Usage
// ============================================================

/**
 * Example: Calculate charge for AI request
 * 
 * const usage: UsageEvent = {
 *   id: 'usage-123',
 *   userId: 'user-456',
 *   metric: 'ai_request',
 *   quantity: 1,
 *   unit: 'request',
 *   timestamp: new Date().toISOString(),
 *   metadata: {},
 *   idempotencyKey: 'key-789',
 *   // ... other fields
 * };
 * 
 * const charge = pricingEngine.calculateCharge(usage);
 * 
 * if (charge) {
 *   console.log(`Charge: ${formatMoney(charge.amount, charge.currency)}`);
 *   console.log(`Price rule: ${charge.priceRuleId} v${charge.priceRuleVersion}`);
 * }
 */

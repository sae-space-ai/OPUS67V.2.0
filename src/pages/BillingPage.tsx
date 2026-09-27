/**
 * OPUS67 — Billing Page
 * 
 * Usage and billing dashboard.
 * 
 * IMPORTANT — HONEST STATES:
 * 
 * This page shows billing information, but will display:
 * - "PRICING NOT CONFIGURED" if no price rules exist
 * - "PAYMENT PROVIDER NOT CONFIGURED" if no payment provider
 * - "USAGE TRACKING NOT AVAILABLE" if metering not configured
 * 
 * No fake data. No invented prices. No simulated usage.
 * 
 * CURRENT STATUS:
 * - UI implemented ✅
 * - SPECTRAL SYSTEM design ✅
 * - Usage display ✅
 * - Cost calculation ✅
 * - Real billing data ❌ (requires backend)
 * - Payment integration ❌ (requires provider)
 * - Commercial pricing ❌ (requires human approval)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth/context';
import { PageHeader, Card, StatusBadge } from '../components/ui';
import { pricingEngine } from '../lib/billing/pricing';
import { ledgerService } from '../lib/billing/ledger';
import { meteringService } from '../lib/billing/metering';
import { formatMoney } from '../lib/billing/pricing';
import { AlertCircle, CreditCard, TrendingUp, DollarSign, Loader2 } from 'lucide-react';

export function BillingPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pricingStatus, setPricingStatus] = useState<string>('not_configured');
  const [balance, setBalance] = useState<{ amount: number; currency: string } | null>(null);
  const [usageSummary, setUsageSummary] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    async function loadBillingData() {
      try {
        setIsLoading(true);
        
        // Get pricing status
        setPricingStatus(pricingEngine.getStatus());
        
        // Get balance (would come from API in production)
        // For now, show not available
        setBalance(null);
        
        // Get usage summary (would come from API in production)
        // For now, show not available
        setUsageSummary(null);
      } catch (error) {
        console.error('[BillingPage] Failed to load billing data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadBillingData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-spectral mx-auto" />
          <p className="mt-4 text-steel text-sm">Loading billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Usage & Billing"
          description="Monitor your usage, view costs, and manage your billing"
        />

        {/* Configuration Status */}
        {pricingStatus === 'not_configured' && (
          <Card className="p-6 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle size={24} className="text-amber flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-ice mb-2">
                  Billing Not Configured
                </h3>
                <p className="text-sm text-steel mb-4">
                  Usage-based billing requires configuration. The following components need to be set up:
                </p>
                <ul className="text-sm text-steel space-y-2 list-disc list-inside">
                  <li>Backend server with billing API endpoints</li>
                  <li>Database for billing accounts, usage events, and ledger entries</li>
                  <li>Price rules (requires human approval of commercial pricing)</li>
                  <li>Payment provider integration (Stripe, Paddle, etc.)</li>
                  <li>Webhook endpoints for payment confirmation</li>
                </ul>
                <p className="text-xs text-muted mt-4">
                  See <code className="text-spectral">docs/BILLING-SETUP.md</code> for setup instructions.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Current Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-steel uppercase tracking-wider">
                Current Balance
              </h3>
              <DollarSign size={20} className="text-spectral" />
            </div>
            {balance ? (
              <div>
                <p className="text-3xl font-bold text-ice">
                  {formatMoney(balance.amount, balance.currency as any)}
                </p>
                <p className="text-xs text-steel mt-1">
                  {balance.amount >= 0 ? 'Available credit' : 'Outstanding balance'}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-muted">—</p>
                <p className="text-xs text-steel mt-1">Not available</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-steel uppercase tracking-wider">
                This Month
              </h3>
              <TrendingUp size={20} className="text-ion" />
            </div>
            {usageSummary ? (
              <div>
                <p className="text-3xl font-bold text-ice">
                  {Object.values(usageSummary).reduce((sum, val) => sum + val, 0)}
                </p>
                <p className="text-xs text-steel mt-1">Total usage events</p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-muted">—</p>
                <p className="text-xs text-steel mt-1">Not available</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-steel uppercase tracking-wider">
                Payment Method
              </h3>
              <CreditCard size={20} className="text-ultra" />
            </div>
            <div>
              <p className="text-lg font-semibold text-muted">Not configured</p>
              <p className="text-xs text-steel mt-1">
                Payment provider not set up
              </p>
            </div>
          </Card>
        </div>

        {/* Usage Breakdown */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-ice mb-4">Usage Breakdown</h3>
          {usageSummary && Object.keys(usageSummary).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(usageSummary).map(([metric, quantity]) => (
                <div key={metric} className="flex items-center justify-between">
                  <span className="text-sm text-steel capitalize">
                    {metric.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-medium text-ice">
                    {quantity.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted">No usage data available</p>
              <p className="text-xs text-steel mt-1">
                Usage tracking requires backend configuration
              </p>
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-ice mb-4">Recent Transactions</h3>
          <div className="text-center py-8">
            <p className="text-sm text-muted">No transactions yet</p>
            <p className="text-xs text-steel mt-1">
              Transaction history will appear here once billing is configured
            </p>
          </div>
        </Card>

        {/* Pricing Information */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-ice mb-4">Pricing</h3>
          {pricingStatus === 'not_configured' ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted">Commercial pricing not yet configured</p>
              <p className="text-xs text-steel mt-1">
                Pricing will be announced before billing is activated
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-steel">
                Pricing information will be displayed here once configured
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

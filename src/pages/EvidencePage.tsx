/**
 * OPUS67 — Evidence Page
 * 
 * Track provenance, hashes, and human review of AI outputs.
 * Critical module for traceability and auditability.
 */

import { useAppStore } from '../lib/store';
import { Card, PageHeader, EmptyState, StatusBadge } from '../components/ui';
import { ConfigBanner } from '../components/ui';
import { Shield, FileText } from 'lucide-react';

export function EvidencePage() {
  const { state } = useAppStore();

  return (
    <div>
      <PageHeader
        title="Evidence"
        description="Track provenance, hashes, and human review of AI outputs"
      />

      <ConfigBanner message="Evidence management is architecturally ready. Evidence records will be created when executions produce outputs and when human review processes are activated." />

      <div className="mt-6">
        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          Evidence Status Model
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {['unverified', 'system_generated', 'source_verified', 'human_reviewed', 'approved', 'rejected'].map((status) => (
            <div key={status} className="flex justify-center">
              <StatusBadge status={status} />
            </div>
          ))}
        </div>

        <h3 className="text-sm font-medium text-opus-300 mb-3 uppercase tracking-wider">
          Evidence Records
        </h3>

        {state.evidence.length === 0 ? (
          <Card>
            <EmptyState
              title="No evidence records"
              description="Evidence records are created when AI executions produce outputs, when external sources are ingested, or when human reviews are completed. Each record includes provenance metadata and integrity hashes."
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {state.evidence.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-opus-400" />
                    <div>
                      <p className="text-sm font-medium text-opus-200">{item.source}</p>
                      <p className="text-xs text-opus-400">
                        {item.sourceType} • Hash: {item.hash.slice(0, 12)}...
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Architecture note */}
      <div className="mt-8 p-4 rounded-lg bg-opus-800 border border-opus-700">
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-accent-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-opus-200 mb-1">Evidence Architecture</h4>
            <p className="text-xs text-opus-400 leading-relaxed">
              The evidence module supports provenance tracking, integrity verification via hashes,
              timestamped records, and human review workflows. Evidence status progression follows:
              UNVERIFIED → SYSTEM_GENERATED → SOURCE_VERIFIED → HUMAN_REVIEWED → APPROVED/REJECTED.
              No evidence is automatically elevated to APPROVED status without human review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

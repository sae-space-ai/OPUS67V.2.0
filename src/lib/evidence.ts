/**
 * OPUS67 — Evidence Ledger
 * 
 * Cryptographic evidence tracking with real SHA-256 hashes.
 * Provides provenance, integrity verification, and audit trail.
 * 
 * Features:
 * - Real SHA-256 hashing using Web Crypto API
 * - Evidence chain verification
 * - Timestamp tracking
 * - Human review workflow
 * - Status progression tracking
 */

import type { Evidence, EvidenceStatus } from '../types';
import { evidenceRepository } from './repository';
import { generateId } from './utils';

// ============================================================
// Hash Utilities (Web Crypto API)
// ============================================================

export async function computeHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function computeEvidenceHash(evidence: Omit<Evidence, 'hash'>): Promise<string> {
  // Create deterministic string from evidence fields
  const data = JSON.stringify({
    id: evidence.id,
    projectId: evidence.projectId,
    source: evidence.source,
    sourceType: evidence.sourceType,
    timestamp: evidence.timestamp,
    metadata: evidence.metadata,
  });
  
  return computeHash(data);
}

// ============================================================
// Evidence Creation
// ============================================================

export interface CreateEvidenceInput {
  projectId: string;
  source: string;
  sourceType: Evidence['sourceType'];
  metadata?: Record<string, unknown>;
}

export async function createEvidence(input: CreateEvidenceInput): Promise<Evidence> {
  const id = generateId();
  const timestamp = new Date().toISOString();
  
  const evidenceBase = {
    id,
    projectId: input.projectId,
    source: input.source,
    sourceType: input.sourceType,
    timestamp,
    metadata: input.metadata || {},
    status: 'system_generated' as EvidenceStatus,
    createdAt: timestamp,
  };
  
  // Compute real hash
  const hash = await computeEvidenceHash(evidenceBase);
  
  const evidence: Evidence = {
    ...evidenceBase,
    hash,
  };
  
  // Persist
  evidenceRepository.create(evidence);
  
  return evidence;
}

// ============================================================
// Evidence Verification
// ============================================================

export async function verifyEvidenceIntegrity(evidence: Evidence): Promise<boolean> {
  const expectedHash = await computeEvidenceHash(evidence);
  return evidence.hash === expectedHash;
}

// ============================================================
// Evidence Status Progression
// ============================================================

export const VALID_STATUS_TRANSITIONS: Record<EvidenceStatus, EvidenceStatus[]> = {
  unverified: ['system_generated'],
  system_generated: ['source_verified', 'human_reviewed'],
  source_verified: ['human_reviewed'],
  human_reviewed: ['approved', 'rejected'],
  approved: [],
  rejected: ['human_reviewed'], // Can be re-reviewed
};

export function canTransitionTo(current: EvidenceStatus, target: EvidenceStatus): boolean {
  return VALID_STATUS_TRANSITIONS[current].includes(target);
}

export async function updateEvidenceStatus(
  evidenceId: string,
  newStatus: EvidenceStatus,
  reviewerNotes?: string
): Promise<Evidence | null> {
  const evidence = evidenceRepository.getById(evidenceId);
  if (!evidence) return null;
  
  if (!canTransitionTo(evidence.status, newStatus)) {
    throw new Error(
      `Invalid status transition: ${evidence.status} → ${newStatus}`
    );
  }
  
  const updatedMetadata = {
    ...evidence.metadata,
    statusHistory: [
      ...(evidence.metadata.statusHistory as Array<{ from: string; to: string; timestamp: string }> || []),
      {
        from: evidence.status,
        to: newStatus,
        timestamp: new Date().toISOString(),
        reviewerNotes,
      },
    ],
  };
  
  const updated = evidenceRepository.update(evidenceId, {
    status: newStatus,
    metadata: updatedMetadata,
  });
  
  return updated || null;
}

// ============================================================
// Evidence Queries
// ============================================================

export function getEvidenceByProject(projectId: string): Evidence[] {
  return evidenceRepository.getAll().filter((e) => e.projectId === projectId);
}

export function getEvidenceByStatus(status: EvidenceStatus): Evidence[] {
  return evidenceRepository.getAll().filter((e) => e.status === status);
}

export function getRecentEvidence(limit: number = 10): Evidence[] {
  return evidenceRepository
    .getAll()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

// ============================================================
// Evidence Chain Verification
// ============================================================

export async function verifyEvidenceChain(evidenceIds: string[]): Promise<{
  valid: boolean;
  invalidItems: Array<{ id: string; reason: string }>;
}> {
  const invalidItems: Array<{ id: string; reason: string }> = [];
  
  for (const id of evidenceIds) {
    const evidence = evidenceRepository.getById(id);
    if (!evidence) {
      invalidItems.push({ id, reason: 'Not found' });
      continue;
    }
    
    const isValid = await verifyEvidenceIntegrity(evidence);
    if (!isValid) {
      invalidItems.push({ id, reason: 'Hash mismatch' });
    }
  }
  
  return {
    valid: invalidItems.length === 0,
    invalidItems,
  };
}

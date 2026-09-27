/**
 * OPUS67 — Repository Layer
 * 
 * Data persistence abstraction with localStorage adapter.
 * In production, this would connect to PostgreSQL via API routes.
 * 
 * Architecture:
 * UI → Service → Repository → Storage Adapter (localStorage/PostgreSQL)
 */

import type {
  Agent,
  Tool,
  Workflow,
  Project,
  Evidence,
  Execution,
  AISystem,
  AuditEvent,
} from '../types';

// ============================================================
// Storage Keys
// ============================================================

const STORAGE_KEYS = {
  AGENTS: 'opus67_agents',
  TOOLS: 'opus67_tools',
  WORKFLOWS: 'opus67_workflows',
  PROJECTS: 'opus67_projects',
  EVIDENCE: 'opus67_evidence',
  EXECUTIONS: 'opus67_executions',
  AI_SYSTEMS: 'opus67_ai_systems',
  AUDIT_LOG: 'opus67_audit_log',
} as const;

// ============================================================
// Storage Adapter
// ============================================================

class StorageAdapter {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = typeof window !== 'undefined' && window.localStorage !== undefined;
  }

  get<T>(key: string): T[] {
    if (!this.isAvailable) return [];
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`[StorageAdapter] Failed to read ${key}:`, error);
      return [];
    }
  }

  set<T>(key: string, data: T[]): void {
    if (!this.isAvailable) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`[StorageAdapter] Failed to write ${key}:`, error);
    }
  }

  clear(key: string): void {
    if (!this.isAvailable) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageAdapter] Failed to clear ${key}:`, error);
    }
  }
}

const storage = new StorageAdapter();

// ============================================================
// Repository Interface
// ============================================================

export interface Repository<T extends { id: string }> {
  getAll(): T[];
  getById(id: string): T | undefined;
  create(item: T): T;
  update(id: string, item: Partial<T>): T | undefined;
  delete(id: string): boolean;
  clear(): void;
}

// ============================================================
// Generic Repository Implementation
// ============================================================

function createRepository<T extends { id: string }>(storageKey: string): Repository<T> {
  return {
    getAll(): T[] {
      return storage.get<T>(storageKey);
    },

    getById(id: string): T | undefined {
      const items = storage.get<T>(storageKey);
      return items.find((item) => item.id === id);
    },

    create(item: T): T {
      const items = storage.get<T>(storageKey);
      items.push(item);
      storage.set(storageKey, items);
      return item;
    },

    update(id: string, updates: Partial<T>): T | undefined {
      const items = storage.get<T>(storageKey);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return undefined;
      
      items[index] = { ...items[index], ...updates };
      storage.set(storageKey, items);
      return items[index];
    },

    delete(id: string): boolean {
      const items = storage.get<T>(storageKey);
      const filtered = items.filter((item) => item.id !== id);
      if (filtered.length === items.length) return false;
      
      storage.set(storageKey, filtered);
      return true;
    },

    clear(): void {
      storage.clear(storageKey);
    },
  };
}

// ============================================================
// Repository Instances
// ============================================================

export const agentRepository = createRepository<Agent>(STORAGE_KEYS.AGENTS);
export const toolRepository = createRepository<Tool>(STORAGE_KEYS.TOOLS);
export const workflowRepository = createRepository<Workflow>(STORAGE_KEYS.WORKFLOWS);
export const projectRepository = createRepository<Project>(STORAGE_KEYS.PROJECTS);
export const evidenceRepository = createRepository<Evidence>(STORAGE_KEYS.EVIDENCE);
export const executionRepository = createRepository<Execution>(STORAGE_KEYS.EXECUTIONS);
export const aiSystemRepository = createRepository<AISystem>(STORAGE_KEYS.AI_SYSTEMS);

// ============================================================
// Audit Log Repository (special: append-only, limited size)
// ============================================================

const MAX_AUDIT_LOG_SIZE = 1000;

export const auditLogRepository = {
  getAll(): AuditEvent[] {
    return storage.get<AuditEvent>(STORAGE_KEYS.AUDIT_LOG);
  },

  add(event: AuditEvent): void {
    const events = storage.get<AuditEvent>(STORAGE_KEYS.AUDIT_LOG);
    events.unshift(event); // Add to beginning
    
    // Keep only last MAX_AUDIT_LOG_SIZE events
    if (events.length > MAX_AUDIT_LOG_SIZE) {
      events.splice(MAX_AUDIT_LOG_SIZE);
    }
    
    storage.set(STORAGE_KEYS.AUDIT_LOG, events);
  },

  clear(): void {
    storage.clear(STORAGE_KEYS.AUDIT_LOG);
  },
};

// ============================================================
// Export/Import Utilities
// ============================================================

export function exportAllData(): string {
  const data = {
    version: '0.1.0',
    exportedAt: new Date().toISOString(),
    agents: agentRepository.getAll(),
    tools: toolRepository.getAll(),
    workflows: workflowRepository.getAll(),
    projects: projectRepository.getAll(),
    evidence: evidenceRepository.getAll(),
    executions: executionRepository.getAll(),
    aiSystems: aiSystemRepository.getAll(),
    auditLog: auditLogRepository.getAll(),
  };
  
  return JSON.stringify(data, null, 2);
}

export function importAllData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    
    if (data.agents) storage.set(STORAGE_KEYS.AGENTS, data.agents);
    if (data.tools) storage.set(STORAGE_KEYS.TOOLS, data.tools);
    if (data.workflows) storage.set(STORAGE_KEYS.WORKFLOWS, data.workflows);
    if (data.projects) storage.set(STORAGE_KEYS.PROJECTS, data.projects);
    if (data.evidence) storage.set(STORAGE_KEYS.EVIDENCE, data.evidence);
    if (data.executions) storage.set(STORAGE_KEYS.EXECUTIONS, data.executions);
    if (data.aiSystems) storage.set(STORAGE_KEYS.AI_SYSTEMS, data.aiSystems);
    if (data.auditLog) storage.set(STORAGE_KEYS.AUDIT_LOG, data.auditLog);
    
    return true;
  } catch (error) {
    console.error('[Repository] Import failed:', error);
    return false;
  }
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => storage.clear(key));
}

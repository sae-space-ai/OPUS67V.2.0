/**
 * OPUS67 — Application Store
 * 
 * Centralized state management using React context.
 * All state is managed client-side for demonstration.
 * In production, this would connect to a real database.
 */

import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type {
  Agent,
  Tool,
  Workflow,
  Project,
  Evidence,
  Execution,
  AISystem,
  Control,
  AuditEvent,
  SystemStatus,
} from '../types';
import { generateId } from './utils';

// ============================================================
// State Shape
// ============================================================

export interface AppState {
  agents: Agent[];
  tools: Tool[];
  workflows: Workflow[];
  projects: Project[];
  evidence: Evidence[];
  executions: Execution[];
  aiSystems: AISystem[];
  controls: Control[];
  auditLog: AuditEvent[];
  systemStatus: SystemStatus;
}

// ============================================================
// Initial State (Empty — No fake data)
// ============================================================

const initialState: AppState = {
  agents: [],
  tools: [],
  workflows: [],
  projects: [],
  evidence: [],
  executions: [],
  aiSystems: [],
  controls: [],
  auditLog: [],
  systemStatus: {
    status: 'ok',
    service: 'OPUS67',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    modules: {
      agents: 'available',
      tools: 'available',
      workflows: 'available',
      database: 'not_configured',
      providers: 'not_configured',
    },
  },
};

// ============================================================
// Actions
// ============================================================

export type Action =
  | { type: 'ADD_AGENT'; payload: Agent }
  | { type: 'UPDATE_AGENT'; payload: Agent }
  | { type: 'DELETE_AGENT'; payload: string }
  | { type: 'ADD_TOOL'; payload: Tool }
  | { type: 'UPDATE_TOOL'; payload: Tool }
  | { type: 'DELETE_TOOL'; payload: string }
  | { type: 'ADD_WORKFLOW'; payload: Workflow }
  | { type: 'UPDATE_WORKFLOW'; payload: Workflow }
  | { type: 'DELETE_WORKFLOW'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_EVIDENCE'; payload: Evidence }
  | { type: 'UPDATE_EVIDENCE_STATUS'; payload: { id: string; status: Evidence['status'] } }
  | { type: 'ADD_EXECUTION'; payload: Execution }
  | { type: 'ADD_AI_SYSTEM'; payload: AISystem }
  | { type: 'ADD_CONTROL'; payload: Control }
  | { type: 'ADD_AUDIT_EVENT'; payload: AuditEvent }
  | { type: 'UPDATE_SYSTEM_STATUS'; payload: Partial<SystemStatus> };

// ============================================================
// Reducer
// ============================================================

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_AGENT':
      return { ...state, agents: [...state.agents, action.payload] };
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case 'DELETE_AGENT':
      return { ...state, agents: state.agents.filter((a) => a.id !== action.payload) };
    case 'ADD_TOOL':
      return { ...state, tools: [...state.tools, action.payload] };
    case 'UPDATE_TOOL':
      return {
        ...state,
        tools: state.tools.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TOOL':
      return { ...state, tools: state.tools.filter((t) => t.id !== action.payload) };
    case 'ADD_WORKFLOW':
      return { ...state, workflows: [...state.workflows, action.payload] };
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map((w) =>
          w.id === action.payload.id ? action.payload : w
        ),
      };
    case 'DELETE_WORKFLOW':
      return { ...state, workflows: state.workflows.filter((w) => w.id !== action.payload) };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter((p) => p.id !== action.payload) };
    case 'ADD_EVIDENCE':
      return { ...state, evidence: [...state.evidence, action.payload] };
    case 'UPDATE_EVIDENCE_STATUS':
      return {
        ...state,
        evidence: state.evidence.map((e) =>
          e.id === action.payload.id ? { ...e, status: action.payload.status } : e
        ),
      };
    case 'ADD_EXECUTION':
      return { ...state, executions: [...state.executions, action.payload] };
    case 'ADD_AI_SYSTEM':
      return { ...state, aiSystems: [...state.aiSystems, action.payload] };
    case 'ADD_CONTROL':
      return { ...state, controls: [...state.controls, action.payload] };
    case 'ADD_AUDIT_EVENT':
      return { ...state, auditLog: [action.payload, ...state.auditLog].slice(0, 1000) };
    case 'UPDATE_SYSTEM_STATUS':
      return { ...state, systemStatus: { ...state.systemStatus, ...action.payload } };
    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================

interface AppContextType {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return context;
}

// ============================================================
// Action Creators (helpers)
// ============================================================

export function createAuditEvent(
  action: string,
  resourceType: string,
  resourceId: string,
  metadata: Record<string, unknown> = {}
): AuditEvent {
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    actorType: 'system',
    actorId: 'system',
    action,
    resourceType,
    resourceId,
    metadata,
    requestId: generateId(),
  };
}

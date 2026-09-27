# OPUS67 — Architecture

## Overview

OPUS67 follows a modular, layered architecture designed for:
- Clear separation of concerns
- Independent module evolution
- Provider abstraction
- Auditability and traceability

## Layers

```
┌─────────────────────────────────────────┐
│              Presentation               │
│   (React Components, Pages, Layout)     │
├─────────────────────────────────────────┤
│            Application Logic            │
│   (State Management, Validation)        │
├─────────────────────────────────────────┤
│              Domain Layer               │
│   (Types, Schemas, Business Rules)      │
├─────────────────────────────────────────┤
│           Infrastructure               │
│   (Database, AI Providers, APIs)        │
└─────────────────────────────────────────┘
```

## Key Decisions

### ADR-001: React + Vite (Client-Side Application)

**Decision**: Use React with Vite as the build tool.

**Rationale**: 
- Fast development experience
- Excellent TypeScript support
- Simple deployment model
- Compatible with Vercel static hosting

**Future**: May evolve to include server-side rendering via Next.js or API routes when backend requirements emerge.

### ADR-002: React Context for State Management

**Decision**: Use React Context + useReducer for client-side state.

**Rationale**:
- No additional dependencies
- Sufficient for current scope
- Clear data flow
- Easy to test

**Future**: Will be replaced with server-state management (React Query, SWR) when API layer is implemented.

### ADR-003: Zod for Validation

**Decision**: Use Zod for all data validation.

**Rationale**:
- TypeScript-first (type inference)
- Runtime validation
- Composable schemas
- Works client and server-side

### ADR-004: Provider Abstraction

**Decision**: Abstract AI providers behind a common interface.

**Rationale**:
- Avoid vendor lock-in
- Enable multi-provider support
- Simplify testing
- Allow graceful degradation

### ADR-005: Evidence-First Design

**Decision**: Design all modules with evidence tracking in mind.

**Rationale**:
- AI systems require auditability
- Regulatory compliance demands traceability
- Human oversight requires documented decisions
- Evidence chains support accountability

## Module Architecture

### Agents Module
- CRUD operations with validation
- Provider/model configuration
- Status lifecycle (draft → active → paused → disabled)
- Capability and tool assignment

### Tools Module
- Tool registry with schemas
- Status tracking (available, configuration_required, disabled, error)
- Permission model
- Input/output schema definition

### Workflows Module
- Multi-step workflow definition
- Step dependencies
- Error policies (stop, retry, skip, fallback)
- Trigger configuration

### Evidence Module
- Provenance tracking
- Integrity hashes
- Status progression (unverified → approved/rejected)
- Human review workflow

### Governance Module
- AI system inventory
- Risk classification
- Control management
- Assessment tracking

## Security Architecture

- No secrets in client bundle
- All provider calls server-side only
- Input validation at all boundaries
- Audit logging for all mutations
- No sensitive data in URLs or logs

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Validation (Zod)
    ↓
Dispatch Action
    ↓
Reducer (State Update)
    ↓
Audit Event Created
    ↓
UI Re-render
```

## Future Architecture

When database and API layers are added:

```
Client (React)
    ↓
API Routes / Server Actions
    ↓
Service Layer
    ↓
Repository / Data Access
    ↓
Database (PostgreSQL)
```

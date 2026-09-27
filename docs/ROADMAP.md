# OPUS67 — Roadmap

## Phase 1: Foundation (Current — v0.1.0)

**Status: IN PROGRESS**

- [x] Project scaffolding
- [x] TypeScript strict mode
- [x] Tailwind CSS styling
- [x] Routing (React Router)
- [x] State management (React Context)
- [x] Validation layer (Zod)
- [x] Dashboard page
- [x] Agents module (CRUD)
- [x] Tools module (CRUD)
- [x] Workflows module (CRUD)
- [x] Projects module (CRUD)
- [x] Evidence module (architecture)
- [x] Governance module (inventory)
- [x] Settings page
- [x] Responsive design
- [x] CI pipeline
- [x] Documentation

## Phase 2: Persistence & API

**Status: PLANNED**

- [ ] PostgreSQL database setup (Neon/Supabase)
- [ ] Database schema migration system
- [ ] API routes for all modules
- [ ] Server-side data fetching
- [ ] Real CRUD operations (not client-only)
- [ ] Pagination and filtering
- [ ] Search functionality

## Phase 3: AI Provider Integration

**Status: PLANNED**

- [ ] Provider abstraction layer implementation
- [ ] OpenAI integration
- [ ] Anthropic integration
- [ ] Model configuration UI
- [ ] Streaming responses
- [ ] Token usage tracking
- [ ] Cost estimation
- [ ] Rate limiting

## Phase 4: Authentication & Authorization

**Status: PLANNED**

- [ ] Authentication provider integration
- [ ] User registration/login
- [ ] Session management
- [ ] RBAC implementation
- [ ] API key management
- [ ] Organization/team support

## Phase 5: Workflow Execution

**Status: PLANNED**

- [ ] Workflow execution engine
- [ ] Step orchestration
- [ ] Error handling and retry
- [ ] Execution history
- [ ] Real-time status updates
- [ ] Execution logs

## Phase 6: Evidence & Audit

**Status: PLANNED**

- [ ] Automatic evidence generation from executions
- [ ] Hash computation and verification
- [ ] Evidence review workflow
- [ ] Human oversight interface
- [ ] Export capabilities
- [ ] Compliance reports

## Phase 7: Advanced Governance

**Status: PLANNED**

- [ ] Risk assessment workflows
- [ ] Control automation
- [ ] Policy engine
- [ ] Incident management
- [ ] Compliance dashboards
- [ ] Regulatory reporting

## Phase 8: Production Hardening

**Status: PLANNED**

- [ ] E2E testing (Playwright)
- [ ] Performance optimization
- [ ] Error monitoring (Sentry)
- [ ] Analytics
- [ ] Backup and recovery
- [ ] Load testing
- [ ] Security audit

## Principles

Throughout all phases, OPUS67 maintains:

1. **No fake data presented as real**
2. **No features claimed as working when they're not**
3. **Security over convenience**
4. **Auditability over speed**
5. **Small, reversible changes**

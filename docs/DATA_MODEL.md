# OPUS67 — Data Model

## Entity Overview

```
┌──────────┐     ┌──────────┐     ┌───────────┐
│ Project  │────<│  Agent   │────<│ Execution │
└──────────┘     └──────────┘     └───────────┘
     │                │                 │
     │                │                 │
     v                v                 v
┌──────────┐     ┌──────────┐     ┌───────────┐
│ Workflow │────<│   Tool   │     │ Evidence  │
└──────────┘     └──────────┘     └───────────┘
     │
     v
┌──────────────┐
│  AI System   │────< Control
│ (Governance) │
└──────────────┘
```

## Entities

### Agent
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | string(100) | Display name |
| description | string(2000) | Purpose description |
| status | enum | draft, active, paused, disabled |
| provider | string | AI provider identifier |
| model | string | Model identifier |
| systemInstructions | string(10000) | System prompt |
| capabilities | string[] | Agent capabilities |
| tools | string[] | Assigned tool IDs |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last modification |

### Tool
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | string(100) | Display name |
| description | string(2000) | Purpose description |
| category | string | Tool category |
| status | enum | available, configuration_required, disabled, error |
| inputSchema | JSON | Input validation schema |
| outputSchema | JSON | Output schema |
| permissions | string[] | Required permissions |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last modification |

### Workflow
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | string(100) | Display name |
| description | string(2000) | Purpose description |
| status | enum | draft, active, paused, archived |
| steps | WorkflowStep[] | Ordered execution steps |
| triggers | string[] | Trigger conditions |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last modification |

### WorkflowStep
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Step identifier |
| name | string(200) | Step name |
| agentId | UUID? | Assigned agent |
| toolId | UUID? | Assigned tool |
| input | JSON | Step input |
| output | JSON? | Step output |
| dependsOn | string[] | Dependency step IDs |
| errorPolicy | enum | stop, retry, skip, fallback |

### Project
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | string(100) | Display name |
| description | string(2000) | Purpose description |
| status | enum | active, paused, completed, archived |
| owner | string | Owner identifier |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last modification |

### Evidence
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| projectId | UUID | Associated project |
| source | string | Source description |
| sourceType | enum | execution, model_output, human_review, system_log, external |
| timestamp | timestamp | Evidence time |
| hash | string | Integrity hash |
| metadata | JSON | Additional data |
| status | enum | unverified, system_generated, source_verified, human_reviewed, approved, rejected |
| createdAt | timestamp | Creation time |

### Execution
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| projectId | UUID | Associated project |
| workflowId | UUID | Associated workflow |
| agentId | UUID | Associated agent |
| status | enum | queued, running, completed, failed, cancelled |
| startedAt | timestamp | Start time |
| completedAt | timestamp? | Completion time |
| input | JSON | Execution input |
| output | JSON? | Execution output |
| error | string? | Error message |
| provider | string | AI provider used |
| model | string | Model used |
| requestId | UUID | Request correlation ID |

### AISystem (Governance)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | string(100) | System name |
| description | string(2000) | Purpose description |
| riskLevel | enum | minimal, limited, high, unacceptable |
| status | enum | registered, under_review, approved, suspended |
| lastAssessment | timestamp | Last review date |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last modification |

### AuditEvent
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| timestamp | timestamp | Event time |
| actorType | enum | system, user, agent |
| actorId | string | Actor identifier |
| action | string | Action performed |
| resourceType | string | Affected resource type |
| resourceId | string | Affected resource ID |
| metadata | JSON | Additional context |
| requestId | UUID | Request correlation ID |

## Relationships

- Project 1:N Agent (future)
- Project 1:N Workflow
- Project 1:N Evidence
- Project 1:N Execution
- Workflow N:N Agent (via steps)
- Workflow N:N Tool (via steps)
- AISystem 1:N Control
- Execution 1:N Evidence

## Status Lifecycle

### Agent: draft → active → paused → disabled
### Tool: configuration_required → available → disabled → error
### Workflow: draft → active → paused → archived
### Evidence: unverified → system_generated → source_verified → human_reviewed → approved | rejected
### Execution: queued → running → completed | failed | cancelled

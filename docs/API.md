# OPUS67 — API Reference

## Current Status

The application currently operates as a client-side application. API routes will be implemented when the server layer is added.

## Planned API Endpoints

### Health

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "service": "OPUS67",
  "version": "0.1.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Note**: Never returns environment variables, credentials, or internal paths.

### Status

```
GET /api/status
```

Response:
```json
{
  "status": "ok",
  "modules": {
    "agents": "available",
    "tools": "available",
    "workflows": "available",
    "database": "not_configured",
    "providers": "not_configured"
  }
}
```

### Agents

```
GET    /api/agents          # List agents
POST   /api/agents          # Create agent
GET    /api/agents/:id      # Get agent
PATCH  /api/agents/:id      # Update agent
DELETE /api/agents/:id      # Delete agent
```

### Tools

```
GET    /api/tools           # List tools
POST   /api/tools           # Create tool
GET    /api/tools/:id       # Get tool
PATCH  /api/tools/:id       # Update tool
DELETE /api/tools/:id       # Delete tool
```

### Workflows

```
GET    /api/workflows       # List workflows
POST   /api/workflows       # Create workflow
GET    /api/workflows/:id   # Get workflow
PATCH  /api/workflows/:id   # Update workflow
DELETE /api/workflows/:id   # Delete workflow
```

### Projects

```
GET    /api/projects        # List projects
POST   /api/projects        # Create project
GET    /api/projects/:id    # Get project
PATCH  /api/projects/:id    # Update project
DELETE /api/projects/:id    # Delete project
```

### Evidence

```
GET    /api/evidence        # List evidence
POST   /api/evidence        # Create evidence
GET    /api/evidence/:id    # Get evidence
PATCH  /api/evidence/:id    # Update evidence status
```

### Governance

```
GET    /api/governance/systems      # List AI systems
POST   /api/governance/systems      # Register system
GET    /api/governance/systems/:id  # Get system
DELETE /api/governance/systems/:id  # Remove system
```

### Audit

```
GET    /api/audit           # List audit events (paginated)
GET    /api/audit/:id       # Get specific event
```

## Security Rules

1. All API endpoints require authentication (when implemented)
2. Input validation via Zod on all endpoints
3. No secrets in responses
4. Rate limiting on all endpoints
5. Request ID tracking for all operations
6. Audit logging for all mutations

## Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [...]
  }
}
```

Error codes:
- `VALIDATION_ERROR` — Input validation failed
- `NOT_FOUND` — Resource not found
- `UNAUTHORIZED` — Authentication required
- `FORBIDDEN` — Insufficient permissions
- `RATE_LIMITED` — Too many requests
- `INTERNAL_ERROR` — Server error (no details exposed)

# OPUS67 — Security

## Security Model

OPUS67 follows a defense-in-depth security approach with these principles:

1. **Minimum Privilege**: Components operate with the least access necessary
2. **Input Validation**: All data is validated at system boundaries
3. **Secret Protection**: API keys and credentials never reach the client
4. **Audit Trail**: All significant actions are logged
5. **Fail Secure**: Errors do not expose internal state

## Threat Model

### Current Threats (Mitigated)

| Threat | Mitigation |
|--------|-----------|
| XSS | React's built-in escaping + no dangerouslySetInnerHTML |
| Secret leakage | No secrets in client bundle |
| Invalid data | Zod validation at all entry points |
| Dependency vulnerabilities | npm audit, minimal dependencies |

### Future Threats (Planned Mitigations)

| Threat | Planned Mitigation |
|--------|-------------------|
| Unauthorized access | Authentication (OAuth/JWT) |
| Privilege escalation | RBAC implementation |
| Data breach | Encryption at rest, access controls |
| Prompt injection | Input sanitization, system/user separation |
| Supply chain | Lockfile integrity, dependency pinning |

## Secret Management

### Rules

1. **Never commit secrets** to version control
2. **Never expose secrets** to the client/browser
3. **Never log secrets** in any output
4. **Use environment variables** for all credentials
5. **Rotate secrets** periodically

### Where Secrets Live

| Location | Purpose |
|----------|---------|
| Vercel Environment Variables | Production secrets |
| `.env` (local, gitignored) | Development secrets |
| `.env.example` | Template (no real values) |

### What Must Never Be Exposed

- API keys (OpenAI, Anthropic, etc.)
- Database credentials
- JWT secrets
- Private keys
- Internal URLs/paths

## Input Validation

All inputs are validated using Zod schemas:

- Agent creation/update
- Tool registration
- Workflow definition
- Project management
- Evidence records

Validation occurs before any data enters the state management layer.

## Prompt Security (Future)

When AI providers are integrated:

1. **Separate system instructions from user input**
2. **Sanitize external content** before inclusion in prompts
3. **Limit tool permissions** per agent
4. **Validate tool outputs** before processing
5. **Log all AI interactions** for audit

## Authentication & Authorization (Planned)

### Future RBAC Model

| Role | Permissions |
|------|------------|
| OWNER | Full access, billing, team management |
| ADMIN | All operations except billing |
| OPERATOR | Create/edit agents, tools, workflows |
| REVIEWER | Review evidence, approve/reject |
| VIEWER | Read-only access |

### Authentication Provider

To be determined. Options:
- NextAuth.js
- Clerk
- Auth0
- Custom JWT

## Security Headers

When deployed with proper server configuration:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security

## Incident Response

1. **Detect**: Monitor logs and alerts
2. **Contain**: Disable affected components
3. **Investigate**: Review audit logs
4. **Remediate**: Fix vulnerability
5. **Recover**: Restore normal operations
6. **Review**: Post-incident analysis

## Reporting

To report a security vulnerability, contact the project maintainers directly. Do not open public issues for security concerns.

## Dependencies

- Regular `npm audit` checks
- Minimal dependency surface
- No unnecessary packages
- Lockfile integrity verification

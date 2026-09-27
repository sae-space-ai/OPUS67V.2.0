# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | ✅ Active development |

## Reporting a Vulnerability

If you discover a security vulnerability in OPUS67, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Contact the project maintainers directly
3. Include a description of the vulnerability
4. Include steps to reproduce if possible
5. Allow reasonable time for resolution before disclosure

## Security Practices

- All inputs are validated using Zod schemas
- Secrets are never exposed to the client
- API keys are server-side only
- Audit logging tracks all mutations
- No sensitive data in URLs or client-side state
- Dependencies are regularly audited

## Security Documentation

See [docs/SECURITY.md](docs/SECURITY.md) for detailed security information including:
- Threat model
- Secret management
- Input validation
- Authentication plans
- Incident response

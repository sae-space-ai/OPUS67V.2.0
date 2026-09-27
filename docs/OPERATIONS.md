# OPUS67 — Operations Guide

## Monitoring

### Health Endpoint

```
GET /api/health
```

Returns system status without exposing sensitive information.

### System Status Indicators

| Indicator | Meaning |
|-----------|---------|
| Application: operational | App is running correctly |
| Database: connected | PostgreSQL is reachable |
| Providers: configured | At least one AI provider is set up |
| Providers: not configured | No AI providers configured (degraded mode) |

### Log Levels

| Level | Use Case |
|-------|----------|
| error | Failures requiring attention |
| warn | Unexpected but recoverable situations |
| info | Normal operations |
| debug | Detailed diagnostic information |

## Maintenance

### Dependency Updates

```bash
npm audit           # Check for vulnerabilities
npm outdated        # Check for updates
npm update          # Apply minor/patch updates
```

### Database Maintenance (Future)

- Regular backups
- Index optimization
- Connection pool monitoring
- Query performance analysis

### Backup Strategy (Future)

- Daily automated backups
- 30-day retention
- Point-in-time recovery
- Cross-region replication

## Incident Response

### Severity Levels

| Level | Response Time | Examples |
|-------|--------------|---------|
| P1 - Critical | Immediate | Data breach, complete outage |
| P2 - High | < 1 hour | Major feature broken |
| P3 - Medium | < 4 hours | Minor feature broken |
| P4 - Low | Next business day | Cosmetic issues |

### Response Process

1. **Acknowledge**: Confirm incident is being addressed
2. **Assess**: Determine severity and impact
3. **Contain**: Prevent further damage
4. **Fix**: Implement resolution
5. **Verify**: Confirm fix works
6. **Communicate**: Inform stakeholders
7. **Review**: Post-incident analysis

## Scaling Considerations

### Current Limitations

- Client-side state only (no persistence)
- No rate limiting
- No authentication
- Single-region deployment

### Scaling Path

1. Add database persistence
2. Add server-side rendering
3. Add CDN for static assets
4. Add caching layer
5. Add horizontal scaling
6. Add multi-region deployment

## Rollback Procedures

### Application Rollback

```bash
git revert <commit-sha>
git push origin main
# Vercel auto-deploys previous version
```

### Database Rollback (Future)

- Migration down scripts
- Point-in-time recovery
- Manual data correction if needed

### Environment Variable Rollback

- Update in Vercel Dashboard
- Redeploy affected environments

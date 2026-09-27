# Contributing to OPUS67

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Ensure build passes: `npm run build`
5. Ensure typecheck passes: `npm run typecheck`
6. Commit with clear messages
7. Push and open a Pull Request

## Branch Naming

- `feature/*` — New features
- `fix/*` — Bug fixes
- `chore/*` — Maintenance tasks
- `docs/*` — Documentation changes

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add agent creation form
fix: correct validation schema for tools
docs: update deployment guide
chore: update dependencies
```

## Pull Request Process

1. Fill out the PR template completely
2. Ensure CI passes
3. Wait for Vercel Preview deployment
4. Verify Preview matches your changes
5. Request review
6. Address feedback
7. Merge after approval

## Code Standards

- TypeScript strict mode (no `any` without justification)
- All components must be accessible
- All user inputs must be validated
- No secrets in code or commits
- Clear error messages for users
- Empty states for all lists

## Review Criteria

- [ ] Build passes
- [ ] TypeScript passes
- [ ] No security issues
- [ ] Accessible UI
- [ ] Clear documentation
- [ ] No fake data presented as real

## Questions?

Open a discussion or contact the maintainers.

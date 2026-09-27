# OPUS67 — Deployment Guide

## Vercel Deployment

### Prerequisites

- GitHub repository: `OPUS67`
- Vercel account
- Node.js 20+

### Setup Steps

1. **Import Repository**
   - Go to Vercel Dashboard
   - Import from GitHub: `OPUS67`
   - Framework Preset: Vite (auto-detected)

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   Configure in Vercel Dashboard → Settings → Environment Variables:
   - `DATABASE_URL` (when database is ready)
   - `OPENAI_API_KEY` (optional)
   - `ANTHROPIC_API_KEY` (optional)
   - `LOG_LEVEL` (optional, default: info)

4. **Deploy**
   - Push to `main` → Production deployment
   - Create PR → Preview deployment

### Important Rules

**Do not connect this GitHub repository to multiple Vercel projects unless this is an explicit architectural decision.**

One repository = One Vercel project.

### Branch Strategy

| Branch | Vercel Behavior |
|--------|----------------|
| `main` | Production deployment |
| `feature/*` | Preview deployment |
| `fix/*` | Preview deployment |
| PRs | Preview deployment |

### Preview Deployments

Each PR generates a unique preview URL.

**Validation criteria before merge:**
1. CI pipeline passes
2. Vercel Preview deployment succeeds
3. Preview SHA matches current HEAD
4. Manual verification on preview URL

If the SHA changes after verification, re-validate.

### Rollback

To rollback a production deployment:
1. Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click "Promote to Production"

Or:
1. `git revert <commit-sha>`
2. Push to `main`
3. Vercel auto-deploys

### Troubleshooting

**Build fails:**
- Check Node.js version (must be 20+)
- Verify `npm ci` works locally
- Check for TypeScript errors: `npm run typecheck`

**Preview not updating:**
- Verify Git integration is connected
- Check Vercel deployment logs
- Ensure no duplicate projects are connected

**Environment variables not working:**
- Variables must be set in Vercel Dashboard (not in code)
- Redeploy after adding new variables
- Preview and Production can have different variable values

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Production Build

```bash
npm run build
# Output in dist/
```

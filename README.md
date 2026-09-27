# OPUS67

**AI Systems Platform** — Agents, Tools, Workflows, and Governance.

OPUS67 is a modular platform for building, operating, and auditing AI-powered systems. It provides a structured environment for managing AI agents, tools, workflows, evidence tracking, and governance controls.

## Overview

OPUS67 is designed with these principles:

- **Modular Architecture**: Decoupled components with clear interfaces
- **Security First**: Server-side validation, secret protection, minimal privilege
- **Full Traceability**: Audit logs, evidence chains, human oversight records
- **Provider Agnostic**: Abstracted AI provider layer supporting multiple backends
- **Governance Ready**: Risk classification, controls, and compliance-oriented features

## Architecture

```
OPUS67/
├── src/
│   ├── App.tsx              # Application entry with routing
│   ├── main.tsx             # React DOM render
│   ├── index.css            # Global styles (Tailwind)
│   ├── components/
│   │   ├── Layout.tsx       # App shell with sidebar navigation
│   │   └── ui/              # Shared UI components
│   ├── pages/
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── DashboardPage.tsx
│   │   ├── AgentsPage.tsx
│   │   ├── ToolsPage.tsx
│   │   ├── WorkflowsPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── EvidencePage.tsx
│   │   ├── GovernancePage.tsx
│   │   └── SettingsPage.tsx
│   ├── lib/
│   │   ├── store.tsx        # State management (React Context)
│   │   ├── utils.ts         # Utility functions
│   │   └── validation.ts    # Zod validation schemas
│   └── types/
│       └── index.ts         # TypeScript type definitions
├── docs/                    # Documentation
├── .github/                 # CI/CD configuration
├── .env.example             # Environment variable template
└── README.md
```

## Features

### Current (v0.1.0)

- ✅ Dashboard with system status overview
- ✅ Agent management (CRUD with validation)
- ✅ Tool registry with status tracking
- ✅ Workflow configuration
- ✅ Project organization
- ✅ Evidence module (architecture ready)
- ✅ Governance module (inventory, risk classification)
- ✅ Settings and system configuration
- ✅ Audit logging
- ✅ Responsive design (mobile + desktop)
- ✅ TypeScript strict mode
- ✅ Zod validation schemas
- ✅ CI pipeline (GitHub Actions)

### Planned

- 🔲 Database persistence (PostgreSQL)
- 🔲 AI provider integration (OpenAI, Anthropic)
- 🔲 Authentication & authorization (RBAC)
- 🔲 Workflow execution engine
- 🔲 Real-time evidence tracking
- 🔲 API endpoints
- 🔲 E2E testing

## Requirements

- Node.js 20+ (LTS)
- npm 10+

## Installation

```bash
git clone <repository-url>
cd OPUS67
npm install
```

## Development

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run typecheck  # TypeScript validation
```

## Environment

See `.env.example` for required and optional environment variables.

Key variables:
- `DATABASE_URL` — PostgreSQL connection (required for persistence)
- `OPENAI_API_KEY` — OpenAI provider (optional)
- `ANTHROPIC_API_KEY` — Anthropic provider (optional)
- `LOG_LEVEL` — Logging verbosity (optional)

The application starts without external providers in a degraded but functional mode.

## Testing

```bash
npm run typecheck  # Validate TypeScript types
npm run build      # Verify production build
```

## Build

```bash
npm run build
```

Output: `dist/` directory with optimized production assets.

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Framework: Next.js / Vite (auto-detected)
3. Production branch: `main`
4. Configure environment variables in Vercel dashboard
5. Deploy

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## Security

See [SECURITY.md](SECURITY.md) and [docs/SECURITY.md](docs/SECURITY.md) for:
- Threat model
- Secret management
- Security practices
- Incident response

## Repository Structure

| Directory | Purpose |
|-----------|---------|
| `src/` | Application source code |
| `src/components/` | Reusable UI components |
| `src/pages/` | Route-level page components |
| `src/lib/` | Utilities, validation, state |
| `src/types/` | TypeScript type definitions |
| `docs/` | Technical documentation |
| `.github/` | CI/CD and templates |
| `public/` | Static assets |

## Contributing

1. Create a feature branch from `main`
2. Make changes with clear commits
3. Ensure build and typecheck pass
4. Open a Pull Request
5. Wait for CI and Vercel Preview
6. Request review

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Status

| Component | Status |
|-----------|--------|
| Application | ✅ Operational |
| Build | ✅ Passing |
| TypeScript | ✅ Strict mode |
| CI | ✅ Configured |
| AI Providers | 🔲 Configuration Required |
| Database | 🔲 Not Connected |
| Authentication | 🔲 Not Implemented |
| Vercel Deployment | 🔲 Pending Setup |

## License

License decision pending. All rights reserved until explicitly licensed.

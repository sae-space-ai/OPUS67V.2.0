# OPUS67 Database Setup Guide

## Overview

OPUS67 uses PostgreSQL via Supabase for data persistence. This guide explains how to set up and configure the database.

## Prerequisites

- Supabase account (free tier available)
- Supabase project created

## Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/)
2. Click "New Project"
3. Fill in project details:
   - Name: `opus67`
   - Database Password: (generate a strong password)
   - Region: (choose closest to your users)
4. Wait for project to be ready (~2 minutes)

### 2. Get Credentials

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Starts with `eyJ...`
   - **service_role key**: Starts with `eyJ...` (keep secret!)

### 3. Configure Environment Variables

Add to your `.env.local` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
VITE_SUPABASE_SERVICE_KEY=eyJ...your-service-role-key...
```

**Important:**
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are safe for client-side
- `VITE_SUPABASE_SERVICE_KEY` is **SECRET** - only use server-side
- Never commit `.env.local` to Git

### 4. Run Database Migration

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. Verify all tables are created in Table Editor

### 5. Verify Connection

Start your development server:

```bash
npm run dev
```

Check the dashboard - you should see:
- Database status: **OPERATIONAL**
- No connection errors

## Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts (extends Supabase auth) |
| `accounts` | OAuth provider accounts (Google, GitHub) |
| `sessions` | User sessions |
| `projects` | User projects |
| `agents` | AI agent configurations |
| `tools` | Tool registry |
| `workflows` | Workflow definitions |
| `evidence` | Evidence ledger |
| `audit_events` | Audit trail |
| `ai_systems` | AI system inventory |
| `controls` | Governance controls |

### Billing Tables

| Table | Purpose |
|-------|---------|
| `billing_accounts` | User billing accounts |
| `usage_events` | Usage metering |
| `price_rules` | Pricing configuration |
| `ledger_entries` | Financial ledger |
| `payments` | Payment records |
| `webhook_events` | Webhook event log |
| `spending_limits` | Spending limits |

### System Tables

| Table | Purpose |
|-------|---------|
| `health_check` | Database health monitoring |
| `schema_migrations` | Migration version tracking |

## Security

### Row Level Security (RLS)

All tables have RLS enabled by default. You need to configure policies based on your authentication strategy.

Example policy for user-owned resources:

```sql
CREATE POLICY "Users can view their own projects" 
ON public.projects
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
ON public.projects
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects
FOR DELETE 
USING (auth.uid() = user_id);
```

### Service Role Key

The `service_role` key bypasses RLS. Use it only for:
- Server-side operations
- Admin tasks
- Background jobs

**Never expose the service_role key to the client.**

## Health Check

The database includes a health check system:

```typescript
import { database } from './lib/database';

// Check database status
const health = await database.checkHealth();
console.log(health.status); // 'OPERATIONAL' | 'DEGRADED' | 'ERROR'
```

Health states:
- `NOT_CONFIGURED`: Environment variables missing
- `CONNECTING`: Attempting connection
- `OPERATIONAL`: Connection successful
- `DEGRADED`: Connection exists but queries failing
- `ERROR`: Connection failed

## Migrations

### Creating a New Migration

1. Create a new file in `supabase/migrations/`
2. Name it with a version number: `002_add_new_feature.sql`
3. Write your SQL migration
4. Run it in Supabase SQL Editor
5. Record the migration in `schema_migrations` table

### Migration Template

```sql
-- Migration: 002_add_new_feature
-- Description: Add new feature table

BEGIN;

-- Your migration SQL here
CREATE TABLE IF NOT EXISTS public.new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- ... columns
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Record migration
INSERT INTO public.schema_migrations (version) 
VALUES ('002_add_new_feature')
ON CONFLICT DO NOTHING;

COMMIT;
```

## Troubleshooting

### "Database not configured"

**Problem:** Dashboard shows "NOT CONFIGURED"

**Solution:**
1. Check `.env.local` exists
2. Verify `VITE_SUPABASE_URL` is set
3. Verify `VITE_SUPABASE_ANON_KEY` is set
4. Restart dev server

### "Database connection failed"

**Problem:** Dashboard shows "ERROR"

**Solution:**
1. Verify Supabase project is active
2. Check credentials are correct
3. Check network connectivity
4. Verify Supabase URL is accessible

### "Schema migration required"

**Problem:** Database connected but tables missing

**Solution:**
1. Run `supabase/migrations/001_initial_schema.sql` in SQL Editor
2. Verify tables are created
3. Refresh dashboard

### RLS Policy Errors

**Problem:** Queries fail with "permission denied"

**Solution:**
1. Check RLS policies are configured
2. Verify user is authenticated
3. Check policy conditions match your query

## Production Deployment

### Vercel Environment Variables

Add to Vercel project settings:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_SUPABASE_SERVICE_KEY=eyJ...
```

### Supabase Production Project

For production:
1. Create a separate Supabase project
2. Run migrations
3. Configure RLS policies
4. Set up backups
5. Monitor performance

## Backup & Recovery

Supabase automatically backs up your database. To manually backup:

1. Go to Supabase Dashboard → Database → Backups
2. Click "Download backup"
3. Store securely

## Monitoring

Monitor database health:
- Supabase Dashboard → Database → Connection pool
- Check query performance
- Monitor storage usage
- Set up alerts for errors

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

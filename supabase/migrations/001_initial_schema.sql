-- OPUS67 Database Schema
-- PostgreSQL / Supabase
-- 
-- This schema defines all tables required for OPUS67 operation.
-- Run this migration in your Supabase SQL Editor.

-- ============================================================
-- EXTENSIONS
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  email_verified_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted', 'pending_verification')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth accounts
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'github')),
  provider_account_id TEXT NOT NULL,
  type TEXT DEFAULT 'oauth',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CORE ENTITIES
-- ============================================================

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  system_instructions TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'disabled')),
  capabilities JSONB DEFAULT '[]',
  tools JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tools
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'configuration_required' CHECK (status IN ('available', 'configuration_required', 'disabled', 'error')),
  input_schema JSONB DEFAULT '{}',
  output_schema JSONB DEFAULT '{}',
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflows
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  steps JSONB DEFAULT '[]',
  triggers JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EVIDENCE & AUDIT
-- ============================================================

-- Evidence ledger
CREATE TABLE IF NOT EXISTS public.evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  source TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('execution', 'model_output', 'human_review', 'system_log', 'external')),
  hash TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'unverified' CHECK (status IN ('unverified', 'system_generated', 'source_verified', 'human_reviewed', 'approved', 'rejected')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit events
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  actor_type TEXT DEFAULT 'user' CHECK (actor_type IN ('user', 'system', 'agent')),
  metadata JSONB DEFAULT '{}',
  request_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GOVERNANCE
-- ============================================================

-- AI Systems inventory
CREATE TABLE IF NOT EXISTS public.ai_systems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  risk_level TEXT CHECK (risk_level IN ('minimal', 'limited', 'high', 'unacceptable')),
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'under_review', 'approved', 'suspended')),
  last_assessment TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Governance controls
CREATE TABLE IF NOT EXISTS public.controls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  system_id UUID REFERENCES public.ai_systems(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('technical', 'organizational', 'procedural')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'expired')),
  last_verified TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BILLING
-- ============================================================

-- Billing accounts
CREATE TABLE IF NOT EXISTS public.billing_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_customer_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage events
CREATE TABLE IF NOT EXISTS public.usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  metric TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  idempotency_key TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Price rules
CREATE TABLE IF NOT EXISTS public.price_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  active_from TIMESTAMPTZ NOT NULL,
  active_to TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ledger entries
CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  billing_account_id UUID NOT NULL REFERENCES public.billing_accounts(id) ON DELETE CASCADE,
  usage_event_id UUID REFERENCES public.usage_events(id) ON DELETE SET NULL,
  payment_id UUID,
  type TEXT NOT NULL CHECK (type IN ('charge', 'credit', 'adjustment', 'refund', 'payment')),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  metadata JSONB DEFAULT '{}',
  idempotency_key TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  billing_account_id UUID NOT NULL REFERENCES public.billing_accounts(id) ON DELETE CASCADE,
  provider_payment_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook events
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'processing', 'processed', 'failed')),
  error_message TEXT,
  idempotency_key TEXT UNIQUE NOT NULL
);

-- Spending limits
CREATE TABLE IF NOT EXISTS public.spending_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  billing_account_id UUID NOT NULL REFERENCES public.billing_accounts(id) ON DELETE CASCADE,
  monthly_limit INTEGER NOT NULL,
  warning_thresholds INTEGER[] DEFAULT '{50,80}',
  hard_stop_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Accounts
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON public.accounts(provider, provider_account_id);

-- Sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON public.sessions(expires_at);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- Agents
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_project_id ON public.agents(project_id);

-- Tools
CREATE INDEX IF NOT EXISTS idx_tools_user_id ON public.tools(user_id);

-- Workflows
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_project_id ON public.workflows(project_id);

-- Evidence
CREATE INDEX IF NOT EXISTS idx_evidence_user_id ON public.evidence(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_project_id ON public.evidence(project_id);
CREATE INDEX IF NOT EXISTS idx_evidence_timestamp ON public.evidence(timestamp);

-- Audit events
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON public.audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON public.audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events(action);

-- AI Systems
CREATE INDEX IF NOT EXISTS idx_ai_systems_user_id ON public.ai_systems(user_id);

-- Controls
CREATE INDEX IF NOT EXISTS idx_controls_user_id ON public.controls(user_id);
CREATE INDEX IF NOT EXISTS idx_controls_system_id ON public.controls(system_id);

-- Billing
CREATE INDEX IF NOT EXISTS idx_billing_accounts_user_id ON public.billing_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_user_id ON public.usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_timestamp ON public.usage_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_billing_account_id ON public.ledger_entries(billing_account_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_timestamp ON public.ledger_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_payments_billing_account_id ON public.payments(billing_account_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$ 
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'updated_at' 
    AND table_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I', t, t);
    EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
  END LOOP;
END;
$$;

-- ============================================================
-- HEALTH CHECK TABLE
-- ============================================================

-- Simple table for health checks
CREATE TABLE IF NOT EXISTS public.health_check (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT DEFAULT 'ok',
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial health check record
INSERT INTO public.health_check (status) VALUES ('ok')
ON CONFLICT DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
DO $$ 
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END;
$$;

-- Note: RLS policies should be configured based on your authentication strategy.
-- Example policy for user-owned resources:
-- CREATE POLICY "Users can view their own projects" ON public.projects
--   FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================

-- Schema version tracking
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.schema_migrations (version) VALUES ('001_initial_schema')
ON CONFLICT DO NOTHING;

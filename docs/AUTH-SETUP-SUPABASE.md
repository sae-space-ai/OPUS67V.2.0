# OPUS67 — Authentication Setup Guide (Supabase Auth)

## Overview

OPUS67 uses **Supabase Auth** for authentication, providing:
- Google OAuth
- GitHub OAuth
- Secure session management
- Automatic token refresh
- Integration with Supabase database

## Current Status

**CODE READY** — Implementation complete, requires Supabase configuration:
- ✅ Supabase Auth service implemented
- ✅ OAuth flows (Google, GitHub)
- ✅ Session management
- ✅ Protected routes
- ✅ User menu
- ✅ Auth callback page
- ❌ Supabase project configuration (required)
- ❌ OAuth provider setup in Supabase (required)

## Architecture

### Authentication Flow

```
1. User clicks "Continue with Google/GitHub"
2. Browser redirects to Supabase Auth
3. Supabase redirects to OAuth provider (Google/GitHub)
4. User authenticates with provider
5. Provider redirects to Supabase callback
6. Supabase validates and creates session
7. Supabase redirects to OPUS67 /auth/callback
8. OPUS67 detects session and redirects to /dashboard
```

### Key Components

- **Supabase Auth**: Handles OAuth flows, session management
- **Auth Context**: React context for auth state
- **Protected Routes**: Redirect unauthenticated users
- **Auth Callback**: Handles OAuth redirect
- **User Menu**: Shows user info and logout

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/)
2. Click "New Project"
3. Fill in:
   - Name: `opus67`
   - Database Password: (generate strong password)
   - Region: (choose closest to users)
4. Wait for project to be ready (~2 minutes)

### Step 2: Get Supabase Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Starts with `eyJ...`
   - **service_role key**: Starts with `eyJ...` (SECRET!)

### Step 3: Configure Environment Variables

Add to `.env.local`:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
VITE_SUPABASE_SERVICE_KEY=eyJ...your-service-role-key...
```

### Step 4: Enable OAuth Providers in Supabase

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Application type: "Web application"
6. Name: "OPUS67"
7. Add authorized redirect URI:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
   (Replace `xxxxx` with your Supabase project ID)
8. Click "Create"
9. Copy **Client ID** and **Client Secret**

10. Go to Supabase Dashboard → Authentication → Providers
11. Click "Google"
12. Enable "Enable Google provider"
13. Paste Client ID and Client Secret
14. Click "Save"

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - Application name: "OPUS67"
   - Homepage URL: `https://opus-67-v-2-0.vercel.app` (or your URL)
   - Authorization callback URL:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
     (Replace `xxxxx` with your Supabase project ID)
4. Click "Register application"
5. Click "Generate a new client secret"
6. Copy **Client ID** and **Client Secret**

7. Go to Supabase Dashboard → Authentication → Providers
8. Click "GitHub"
9. Enable "Enable GitHub provider"
10. Paste Client ID and Client Secret
11. Click "Save"

### Step 5: Run Database Migration

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. Verify tables are created

### Step 6: Test Authentication

1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Click "Continue with Google" or "Continue with GitHub"
4. Complete OAuth flow
5. Verify redirect to dashboard
6. Check user menu shows user info

## Callback URLs

### For Google Cloud Console

```
https://your-project-id.supabase.co/auth/v1/callback
```

**Example:**
```
https://abcdefghijk.supabase.co/auth/v1/callback
```

### For GitHub OAuth App

```
https://your-project-id.supabase.co/auth/v1/callback
```

**Example:**
```
https://abcdefghijk.supabase.co/auth/v1/callback
```

**Important:** The callback URL must match EXACTLY, including the `/auth/v1/callback` path.

## Security Features

### Implemented

- ✅ OAuth state parameter validation (handled by Supabase)
- ✅ PKCE flow for enhanced security
- ✅ Secure session cookies (HttpOnly, Secure, SameSite)
- ✅ Automatic token refresh
- ✅ No secrets in client bundle
- ✅ Server-side session validation
- ✅ Protected routes
- ✅ Safe redirects (no open redirects)

### Scopes

**Google:**
- `openid` — Required for OpenID Connect
- `email` — Get user email
- `profile` — Get user name and avatar

**GitHub:**
- `read:user` — Read user profile
- `user:email` — Read user email

**Note:** We do NOT request access to:
- Google Drive, Gmail, Calendar, etc.
- GitHub repositories, organizations, etc.

Login is for **IDENTITY ONLY**, not service access.

## Troubleshooting

### "Sign-in is temporarily unavailable"

**Cause:** Supabase not configured or OAuth providers not enabled

**Solution:**
1. Check `.env.local` has Supabase credentials
2. Verify Supabase project is active
3. Check OAuth providers are enabled in Supabase Dashboard
4. Verify callback URLs match exactly

### OAuth callback fails

**Cause:** Callback URL mismatch

**Solution:**
1. Check callback URL in Google/GitHub matches exactly:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
2. No trailing slashes
3. HTTPS only (except localhost)

### Session not persisting

**Cause:** Cookie settings or browser blocking

**Solution:**
1. Check browser allows third-party cookies
2. Verify Supabase Auth settings:
   - Go to Supabase Dashboard → Authentication → Settings
   - Ensure "Enable automatic access token refresh" is ON
3. Check browser console for errors

### User not created in database

**Cause:** Migration not run or RLS policies blocking

**Solution:**
1. Run migration in Supabase SQL Editor
2. Check RLS policies allow inserts
3. Verify `auth.users` table has the user

## Production Deployment

### Vercel Environment Variables

Add to Vercel project settings:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_SUPABASE_SERVICE_KEY=eyJ... (SECRET)
```

### Supabase Production Project

For production:
1. Create separate Supabase project
2. Run migrations
3. Configure OAuth providers
4. Set up Row Level Security (RLS) policies
5. Enable backups

### RLS Policies

Example policies for user-owned resources:

```sql
-- Users can view their own data
CREATE POLICY "Users can view own projects" 
ON public.projects
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own data
CREATE POLICY "Users can create own projects" 
ON public.projects
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own projects" 
ON public.projects
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "Users can delete own projects" 
ON public.projects
FOR DELETE 
USING (auth.uid() = user_id);
```

## Account Linking

### Current Behavior

Supabase Auth handles account linking automatically:
- If user signs in with Google and GitHub using same email
- Supabase links accounts automatically
- User can sign in with either provider

### Security

- Email must be verified by provider
- Supabase handles linking securely
- No manual linking required

## Testing

### Manual Testing Checklist

- [ ] Login with Google works
- [ ] Login with GitHub works
- [ ] Session persists across page reloads
- [ ] Protected routes redirect to login
- [ ] Protected routes work when authenticated
- [ ] Logout clears session
- [ ] User menu shows correct info
- [ ] Auth callback redirects to dashboard
- [ ] Error states display correctly

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase OAuth Guide](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)

## Support

For issues:
1. Check Supabase Dashboard → Logs
2. Check browser console for errors
3. Verify all configuration steps
4. Check Supabase status: https://status.supabase.com/

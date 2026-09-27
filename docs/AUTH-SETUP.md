# OPUS67 — Authentication Setup Guide

## Overview

This guide explains how to configure OAuth authentication (Google and GitHub) for OPUS67.

## Current Status

**CODE READY** — Implementation complete, requires external configuration:
- ✅ Auth service interface defined
- ✅ Auth context implemented
- ✅ Login page UI created
- ✅ Protected routes configured
- ❌ Backend server (required)
- ❌ OAuth credentials (required)
- ❌ Database tables (required)

## Architecture

### Authentication Flow

```
1. User clicks "Continue with Google/GitHub"
2. Browser redirects to OAuth provider
3. User authenticates with provider
4. Provider redirects to OPUS67 callback URL
5. Server validates state and exchanges code for tokens
6. Server creates/updates user in database
7. Server creates session and sets HttpOnly cookie
8. Server redirects to application
9. Client fetches user/session from server API
10. User is authenticated
```

### Security Boundaries

- **Browser**: Cannot be trusted for auth state
- **Server**: Authority for authentication
- **Cookies**: HttpOnly, Secure, SameSite for session
- **OAuth Secrets**: Server-side only (never exposed to client)

## Required Components

### 1. Backend Server

You need a backend server to handle:
- OAuth callbacks
- Token exchange
- Session management
- User/account storage

**Options:**
- Next.js API routes (if migrating to Next.js)
- Express.js server
- Serverless functions (Vercel, AWS Lambda)

### 2. Database Tables

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  image TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table (OAuth providers)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'google' or 'github'
  provider_account_id TEXT NOT NULL,
  type TEXT DEFAULT 'oauth',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### 3. Environment Variables

Add to `.env.local` (development) or Vercel environment variables:

```bash
# Authentication
AUTH_SECRET=your-random-secret-key-min-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database
DATABASE_URL=postgresql://user:password@host:5432/opus67
```

**IMPORTANT:**
- Never commit secrets to Git
- Use different secrets for development/production
- Rotate secrets periodically
- AUTH_SECRET must be at least 32 characters

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API" or "Google Identity Services"

### 2. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in app information:
   - App name: OPUS67
   - User support email: your-email
   - Developer contact: your-email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (for development)

### 3. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "OPUS67 Web"
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Preview: `https://<preview-url>.vercel.app/api/auth/google/callback`
   - Production: `https://opus67.vercel.app/api/auth/google/callback`
6. Click "Create"
7. Copy Client ID and Client Secret to environment variables

### 4. Callback URLs

Configure these in Google Cloud Console:

**Development:**
```
http://localhost:3000/api/auth/google/callback
```

**Vercel Preview:**
```
https://<branch-name>-<project>.vercel.app/api/auth/google/callback
```

**Production:**
```
https://opus67.vercel.app/api/auth/google/callback
```

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in application details:
   - Application name: OPUS67
   - Homepage URL: `https://opus67.vercel.app` (or localhost for dev)
   - Authorization callback URL: see below
4. Click "Register application"
5. Generate a new client secret
6. Copy Client ID and Client Secret to environment variables

### 2. Callback URLs

Configure these in GitHub OAuth App settings:

**Development:**
```
http://localhost:3000/api/auth/github/callback
```

**Vercel Preview:**
```
https://<branch-name>-<project>.vercel.app/api/auth/github/callback
```

**Production:**
```
https://opus67.vercel.app/api/auth/github/callback
```

## Account Linking Strategy

### Current Implementation

When a user logs in with different OAuth providers:

1. **Same email, different providers:**
   - DO NOT auto-link without verification
   - Require email verification on both accounts
   - Prompt user to confirm linking

2. **Different emails, same provider account:**
   - Impossible (providerAccountId is unique per provider)

3. **Security:**
   - Never link based solely on email (can be spoofed)
   - Require email verification on both accounts
   - Log all linking events for audit
   - Allow users to unlink accounts

### Future Enhancement

Implement explicit account linking UI:
- Settings → Connected Accounts
- Link/unlink Google and GitHub
- Require re-authentication for linking

## Session Security

### Cookie Configuration

```javascript
// Server-side session cookie
res.cookie('session_token', token, {
  httpOnly: true,      // Prevent XSS
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Session Validation

Every API request must:
1. Extract session token from cookie
2. Validate token in database
3. Check expiration
4. Attach user to request context

### Logout

1. Delete session from database
2. Clear session cookie
3. Redirect to home page
4. Log audit event

## Testing

### Manual Testing Checklist

- [ ] Login with Google works
- [ ] Login with GitHub works
- [ ] Session persists across page reloads
- [ ] Protected routes redirect to login when not authenticated
- [ ] Protected routes work when authenticated
- [ ] Logout clears session and redirects
- [ ] Same email from different providers handled correctly
- [ ] Session expires after configured time
- [ ] Invalid/expired sessions rejected

### Automated Testing

```typescript
// Example test structure
describe('Authentication', () => {
  test('unauthenticated user redirected to login', () => {
    // Navigate to /dashboard
    // Expect redirect to /login
  });

  test('authenticated user can access protected routes', () => {
    // Mock authenticated session
    // Navigate to /dashboard
    // Expect page to load
  });

  test('logout clears session', () => {
    // Mock authenticated session
    // Click logout
    // Expect redirect to /
    // Expect session cleared
  });
});
```

## Troubleshooting

### "Configuration Required" Message

If you see "Google — Configuration Required" or "GitHub — Configuration Required":

1. Check environment variables are set
2. Verify backend server is running
3. Check OAuth credentials are correct
4. Verify callback URLs match exactly

### OAuth Callback Errors

Common issues:
- **Redirect URI mismatch**: Callback URL must match exactly
- **Invalid state**: State parameter validation failed
- **Code exchange failed**: Check client secret is correct
- **User not created**: Check database connection

### Session Issues

- **Session not persisting**: Check cookie settings (HttpOnly, Secure, SameSite)
- **Session expired too quickly**: Check maxAge configuration
- **Session not invalidated on logout**: Check database deletion

## Next Steps

After authentication is working:

1. **Implement Authorization (RBAC)**
   - Define roles (owner, admin, operator, reviewer, viewer)
   - Implement permission checks
   - Add role management UI

2. **Add Account Management**
   - Profile editing
   - Password change (if not OAuth-only)
   - Connected accounts management

3. **Implement Security Features**
   - Two-factor authentication
   - Session management UI
   - Login history
   - Suspicious activity detection

## Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [RFC 6749 - OAuth 2.0](https://tools.ietf.org/html/rfc6749)

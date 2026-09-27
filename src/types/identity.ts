/**
 * OPUS67 — Identity Domain Types
 * 
 * Core types for authentication, authorization, and user management.
 * 
 * IMPORTANT — ARCHITECTURAL BOUNDARIES:
 * 
 * 1. IDENTITY ≠ AUTHORIZATION
 *    - Authentication verifies who the user is
 *    - Authorization determines what they can do
 *    - These are separate concerns with separate implementations
 * 
 * 2. AUTHENTICATION ≠ INTEGRATION
 *    - Login with Google/GitHub only authenticates identity
 *    - It does NOT grant access to Google Drive, GitHub repos, etc.
 *    - Additional integrations require separate consent and scopes
 * 
 * 3. CLIENT ≠ AUTHORITY
 *    - Browser cannot be trusted for auth state
 *    - Server must validate sessions on every request
 *    - Cookies (HttpOnly, Secure, SameSite) are the authority
 * 
 * 4. OAUTH SCOPES
 *    - Initial login: openid, email, profile ONLY
 *    - No Drive, Gmail, Calendar, repos, etc.
 *    - Additional scopes require separate consent flow
 * 
 * CURRENT STATUS:
 * - Types defined (this file)
 * - Implementation requires backend server
 * - Status: CODE READY, EXTERNAL CONFIGURATION REQUIRED
 */

// ============================================================
// User
// ============================================================

export type UserStatus = 'active' | 'suspended' | 'deleted' | 'pending_verification';

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null; // ISO timestamp
  image: string | null;
  status: UserStatus;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// ============================================================
// Account (OAuth Provider Account)
// ============================================================

export type OAuthProvider = 'google' | 'github';

export interface Account {
  id: string;
  userId: string;
  provider: OAuthProvider;
  providerAccountId: string; // Google sub or GitHub id
  type: 'oauth';
  createdAt: string;
  updatedAt: string;
  // NOTE: No access_token, refresh_token stored here
  // If needed for specific functionality, must be encrypted
  // and documented with justification
}

// ============================================================
// Session
// ============================================================

export interface Session {
  id: string; // Session token (for DB sessions)
  userId: string;
  expiresAt: string; // ISO timestamp
  createdAt: string;
  updatedAt: string;
  // NOTE: Session validation must happen server-side
  // Browser cannot be trusted for session state
}

// ============================================================
// Auth State (Client-side representation)
// ============================================================

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ============================================================
// OAuth Configuration
// ============================================================

export interface OAuthConfig {
  provider: OAuthProvider;
  clientId: string;
  // NOTE: clientSecret is NEVER exposed to client
  // It lives only in server environment variables
  redirectUri: string;
  scopes: string[];
}

// ============================================================
// Account Linking Strategy
// ============================================================

/**
 * Account Linking Rules:
 * 
 * 1. Same email + different providers:
 *    - DO NOT auto-link without verification
 *    - Require email verification on both accounts
 *    - Prompt user to confirm linking
 * 
 * 2. Different emails + same provider account:
 *    - Impossible (providerAccountId is unique per provider)
 * 
 * 3. Security considerations:
 *    - Never link based solely on email (can be spoofed)
 *    - Require email verification on both accounts
 *    - Log all linking events for audit
 *    - Allow users to unlink accounts
 */

export interface AccountLinkingRequest {
  userId: string;
  primaryProvider: OAuthProvider;
  secondaryProvider: OAuthProvider;
  primaryEmail: string;
  secondaryEmail: string;
  requestedAt: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
}

// ============================================================
// Authorization (Future — Not Yet Implemented)
// ============================================================

/**
 * RBAC Model (Planned):
 * 
 * OWNER: Full access, billing, team management
 * ADMIN: All operations except billing
 * OPERATOR: Create/edit agents, tools, workflows
 * REVIEWER: Review evidence, approve/reject
 * VIEWER: Read-only access
 * 
 * CURRENT STATUS: NOT IMPLEMENTED
 * Requires backend implementation with server-side validation
 */

export type Role = 'owner' | 'admin' | 'operator' | 'reviewer' | 'viewer';

export interface Permission {
  resource: string; // e.g., 'project', 'agent', 'workflow'
  action: string; // e.g., 'create', 'read', 'update', 'delete'
}

// ============================================================
// Audit Events for Identity
// ============================================================

export type IdentityAuditAction =
  | 'USER_REGISTERED'
  | 'USER_LOGGED_IN'
  | 'USER_LOGGED_OUT'
  | 'USER_SUSPENDED'
  | 'USER_DELETED'
  | 'ACCOUNT_LINKED'
  | 'ACCOUNT_UNLINKED'
  | 'SESSION_CREATED'
  | 'SESSION_REVOKED'
  | 'PASSWORD_CHANGED'
  | 'EMAIL_VERIFIED';

// ============================================================
// Security Notes
// ============================================================

/**
 * SESSION SECURITY REQUIREMENTS:
 * 
 * 1. Cookies:
 *    - HttpOnly: true (prevent XSS)
 *    - Secure: true (HTTPS only)
 *    - SameSite: 'strict' or 'lax' (prevent CSRF)
 *    - Max-Age: reasonable expiration (e.g., 7 days)
 * 
 * 2. Server-side validation:
 *    - Every API request must validate session
 *    - Never trust client-side session state
 *    - Check expiration on every request
 * 
 * 3. Logout:
 *    - Invalidate session in database
 *    - Clear cookie
 *    - Audit log event
 * 
 * 4. Session rotation:
 *    - Consider rotating session tokens periodically
 *    - Invalidate old sessions on password change
 * 
 * CURRENT STATUS:
 * - Architecture designed
 * - Implementation requires backend server
 * - No client-side session storage (localStorage) for auth
 */

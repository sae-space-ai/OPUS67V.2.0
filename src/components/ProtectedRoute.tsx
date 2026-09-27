/**
 * OPUS67 — Protected Route Component
 * 
 * Wraps routes that require authentication.
 * Redirects to /login if user is not authenticated.
 * 
 * IMPORTANT — CLIENT-SIDE PROTECTION ONLY:
 * 
 * This component provides CLIENT-SIDE route protection.
 * It improves UX by redirecting unauthenticated users.
 * 
 * HOWEVER:
 * - This is NOT a security boundary
 * - Server MUST validate authentication on every API request
 * - Client-side protection can be bypassed
 * - Real authorization happens server-side
 * 
 * ARCHITECTURE:
 * 
 * Browser → ProtectedRoute (client check) → Component
 *                                              ↓
 *                                         API Request
 *                                              ↓
 *                                    Server validates session
 *                                              ↓
 *                                    Server checks authorization
 *                                              ↓
 *                                         Return data
 * 
 * CURRENT STATUS:
 * - Component implemented ✅
 * - Redirects to /login ✅
 * - Shows loading state ✅
 * - Client-side only ❌ (server validation required)
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth/context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-spectral"></div>
          <p className="mt-4 text-steel text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Preserve the attempted URL for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

// ============================================================
// Usage Example
// ============================================================

/**
 * Wrap protected routes in App.tsx:
 * 
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 * 
 * Public routes (no protection):
 * 
 * <Route path="/" element={<HomePage />} />
 * <Route path="/login" element={<LoginPage />} />
 * <Route path="/privacy" element={<PrivacyPage />} />
 * <Route path="/terms" element={<TermsPage />} />
 */

// ============================================================
// Security Notes
// ============================================================

/**
 * SERVER-SIDE AUTHORIZATION (Required):
 * 
 * Even with ProtectedRoute, server MUST:
 * 
 * 1. Validate session on every API request
 *    - Check session cookie
 *    - Verify session not expired
 *    - Verify session not revoked
 * 
 * 2. Check authorization
 *    - User can only access their own resources
 *    - Role-based access control (RBAC)
 *    - Resource ownership validation
 * 
 * 3. Never trust client
 *    - Client can bypass ProtectedRoute
 *    - Client can modify requests
 *    - Client can inspect network traffic
 * 
 * Example API middleware:
 * 
 * async function requireAuth(req, res, next) {
 *   const session = await validateSession(req.cookies.session);
 *   
 *   if (!session) {
 *     return res.status(401).json({ error: 'Unauthorized' });
 *   }
 *   
 *   req.userId = session.userId;
 *   next();
 * }
 * 
 * app.get('/api/projects', requireAuth, async (req, res) => {
 *   // Only return projects owned by req.userId
 *   const projects = await getProjectsByUserId(req.userId);
 *   res.json(projects);
 * });
 */

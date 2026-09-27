/**
 * OPUS67 — OAuth Callback Page
 * 
 * Handles the redirect back from OAuth providers (Google, GitHub).
 * Supabase Auth automatically processes the OAuth callback.
 * 
 * Flow:
 * 1. User clicks "Continue with Google/GitHub"
 * 2. Redirects to provider
 * 3. User authenticates
 * 4. Provider redirects to /auth/callback
 * 5. Supabase processes the callback
 * 6. This page detects the session and redirects to dashboard
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth/context';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in URL params
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
      setStatus('error');
      setError(errorDescription || errorParam);
      return;
    }

    // Check if user is authenticated
    if (!isLoading) {
      if (user) {
        setStatus('success');
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      } else {
        setStatus('error');
        setError('Authentication failed. Please try again.');
      }
    }
  }, [user, isLoading, searchParams, navigate]);

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="spectral-card p-8 text-center">
          {status === 'processing' && (
            <>
              <Loader2 size={48} className="animate-spin text-spectral mx-auto mb-4" />
              <h1 className="text-xl font-bold text-ice mb-2">
                Completing sign in...
              </h1>
              <p className="text-sm text-steel">
                Please wait while we complete your authentication.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 size={48} className="text-spectral mx-auto mb-4" />
              <h1 className="text-xl font-bold text-ice mb-2">
                Sign in successful!
              </h1>
              <p className="text-sm text-steel mb-4">
                Welcome to OPUS67, {user?.name || user?.email}.
              </p>
              <p className="text-xs text-muted">
                Redirecting to dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle size={48} className="text-coral mx-auto mb-4" />
              <h1 className="text-xl font-bold text-ice mb-2">
                Authentication failed
              </h1>
              <p className="text-sm text-steel mb-4">
                {error || 'An error occurred during authentication.'}
              </p>
              <button
                onClick={() => navigate('/login', { replace: true })}
                className="inline-flex items-center gap-2 px-4 py-2 bg-spectral text-obsidian font-medium rounded-lg hover:bg-spectral-dim transition-colors"
              >
                Return to login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

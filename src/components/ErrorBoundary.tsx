/**
 * OPUS67 — Error Boundary
 * 
 * Catches React rendering errors and displays a user-friendly error page.
 * Prevents entire app from crashing on component errors.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log error for observability (future: send to monitoring service)
    console.error('[OPUS67 ErrorBoundary]', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-obsidian flex items-center justify-center p-4">
          <div className="max-w-md w-full spectral-card p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-coral/10 border border-coral/30 flex items-center justify-center">
                <AlertTriangle size={24} className="text-coral" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-ice">Something went wrong</h1>
                <p className="text-sm text-steel">An unexpected error occurred</p>
              </div>
            </div>

            {/* Error details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 rounded-lg bg-graphite/60 border border-graphite-lighter">
                <p className="text-xs font-semibold text-coral mb-2">Error Details:</p>
                <p className="text-xs text-steel font-mono-tech break-all">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="mt-2 text-[10px] text-muted font-mono-tech overflow-x-auto">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            {/* User-safe message */}
            <div className="mb-6 p-4 rounded-lg bg-graphite/40 border border-graphite-lighter">
              <p className="text-sm text-steel leading-relaxed">
                The application encountered an error. You can try reloading the page or 
                return to the home page. If the problem persists, please contact support.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-spectral text-obsidian font-medium rounded-lg hover:bg-spectral-dim transition-colors"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-graphite-light text-ice font-medium rounded-lg border border-graphite-lighter hover:bg-graphite-lighter transition-colors"
              >
                <Home size={16} />
                Go Home
              </button>
            </div>

            {/* Error ID for support */}
            <div className="mt-6 pt-4 border-t border-graphite-lighter">
              <p className="text-[10px] text-muted text-center">
                Error ID: {this.state.error?.name || 'Unknown'} · {new Date().toISOString()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

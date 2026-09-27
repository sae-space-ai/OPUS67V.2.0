/**
 * OPUS67 — Main Application
 * 
 * Entry point with routing configuration.
 * Uses React Router for client-side navigation.
 * Includes ErrorBoundary for error handling and CommandPalette for keyboard navigation.
 * 
 * ROUTE STRUCTURE:
 * 
 * PUBLIC ROUTES (no authentication required):
 * - / → HomePage
 * - /login → LoginPage
 * - /privacy → PrivacyPage
 * - /terms → TermsPage
 * - /legal/ai → AILegalPage
 * 
 * PROTECTED ROUTES (authentication required):
 * - /dashboard → DashboardPage
 * - /agents → AgentsPage
 * - /tools → ToolsPage
 * - /workflows → WorkflowsPage
 * - /projects → ProjectsPage
 * - /evidence → EvidencePage
 * - /governance → GovernancePage
 * - /settings → SettingsPage
 * - /billing → BillingPage
 * 
 * IMPORTANT — CLIENT-SIDE PROTECTION:
 * 
 * ProtectedRoute provides CLIENT-SIDE route protection for UX.
 * Server MUST validate authentication on every API request.
 * Client-side protection can be bypassed.
 * Real authorization happens server-side.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './lib/store';
import { AuthProvider } from './lib/auth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CommandPalette } from './components/CommandPalette';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentsPage } from './pages/AgentsPage';
import { ToolsPage } from './pages/ToolsPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { EvidencePage } from './pages/EvidencePage';
import { GovernancePage } from './pages/GovernancePage';
import { SettingsPage } from './pages/SettingsPage';
import { BillingPage } from './pages/BillingPage';
import { AILegalPage } from './pages/AILegalPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <CommandPalette />
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/legal/ai" element={<AILegalPage />} />

              {/* PROTECTED ROUTES */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/workflows" element={<WorkflowsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/evidence" element={<EvidencePage />} />
                <Route path="/governance" element={<GovernancePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/billing" element={<BillingPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

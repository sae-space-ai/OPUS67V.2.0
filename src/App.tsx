/**
 * OPUS67 — Main Application
 * 
 * Entry point with routing configuration.
 * Uses React Router for client-side navigation.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './lib/store';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentsPage } from './pages/AgentsPage';
import { ToolsPage } from './pages/ToolsPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { EvidencePage } from './pages/EvidencePage';
import { GovernancePage } from './pages/GovernancePage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Home page (no sidebar layout) */}
          <Route path="/" element={<HomePage />} />

          {/* App pages (with sidebar layout) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

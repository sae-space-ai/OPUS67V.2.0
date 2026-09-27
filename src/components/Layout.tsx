/**
 * OPUS67 — Layout Component
 * 
 * Main application layout with sidebar navigation.
 * Uses OPUS67 SPECTRAL SYSTEM visual design.
 * Responsive: collapses to hamburger menu on mobile.
 */

import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { OpusLogo } from './OpusLogo';
import { SpectralLine } from './SpectralLine';
import { UserMenu } from './UserMenu';
import {
  LayoutDashboard,
  Bot,
  Wrench,
  GitBranch,
  FolderKanban,
  Shield,
  Landmark,
  Settings,
  CreditCard,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Tools', href: '/tools', icon: Wrench },
  { name: 'Workflows', href: '/workflows', icon: GitBranch },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Evidence', href: '/evidence', icon: Shield },
  { name: 'Governance', href: '/governance', icon: Landmark },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPage = navigation.find((item) =>
    location.pathname.startsWith(item.href)
  );

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[260px] bg-carbon border-r border-graphite-lighter
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-graphite-lighter">
            <NavLink to="/" className="flex items-center gap-2">
              <OpusLogo variant="compact" size="md" />
            </NavLink>
            <button
              className="lg:hidden text-steel hover:text-ice"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${isActive
                      ? 'bg-spectral/10 text-spectral border border-spectral/30'
                      : 'text-steel hover:text-ice hover:bg-graphite-light'
                    }
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-spectral" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-graphite-lighter">
            <div className="flex items-center gap-2 text-xs text-steel">
              <div className="w-2 h-2 rounded-full bg-spectral status-pulse" />
              <span>System operational</span>
            </div>
            <p className="text-xs text-muted mt-1">v0.1.0</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-graphite-lighter bg-carbon/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-steel hover:text-ice"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-ice">
                {currentPage?.name || 'OPUS67'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-steel bg-graphite-light px-3 py-1.5 rounded-full border border-graphite-lighter">
              <div className="w-1.5 h-1.5 rounded-full bg-amber status-pulse" />
              <span>Providers not configured</span>
            </div>
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/**
 * OPUS67 — Layout Component
 * 
 * Main application layout with sidebar navigation.
 * Responsive: collapses to hamburger menu on mobile.
 */

import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Wrench,
  GitBranch,
  FolderKanban,
  Shield,
  Landmark,
  Settings,
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
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPage = navigation.find((item) =>
    location.pathname.startsWith(item.href)
  );

  return (
    <div className="min-h-screen bg-opus-900 flex">
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
          fixed inset-y-0 left-0 z-50 w-[260px] bg-opus-800 border-r border-opus-700
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-opus-700">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-lg font-semibold text-opus-100 tracking-tight">
                OPUS67
              </span>
            </NavLink>
            <button
              className="lg:hidden text-opus-400 hover:text-opus-100"
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
                      ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                      : 'text-opus-300 hover:text-opus-100 hover:bg-opus-700/50'
                    }
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-accent-400" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-opus-700">
            <div className="flex items-center gap-2 text-xs text-opus-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>System operational</span>
            </div>
            <p className="text-xs text-opus-500 mt-1">v0.1.0</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-opus-700 bg-opus-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-opus-400 hover:text-opus-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-opus-100">
                {currentPage?.name || 'OPUS67'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-opus-400 bg-opus-700/50 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Providers not configured</span>
            </div>
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

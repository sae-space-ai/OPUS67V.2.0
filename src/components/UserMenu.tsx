/**
 * OPUS67 — User Menu Component
 * 
 * Dropdown menu for authenticated users.
 * Shows user info and provides access to account settings, billing, and logout.
 * 
 * IMPORTANT — SECURITY:
 * 
 * - Does NOT show OAuth tokens or sensitive data
 * - Logout invalidates session server-side
 * - All links go to protected routes
 * 
 * CURRENT STATUS:
 * - UI implemented ✅
 * - User info display ✅
 * - Navigation links ✅
 * - Logout functionality ✅
 * - Real authentication ❌ (requires backend)
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth/context';
import { User, CreditCard, Settings, LogOut, ChevronDown } from 'lucide-react';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  if (!user) {
    return null;
  }

  async function handleLogout() {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('[UserMenu] Logout failed:', error);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-graphite-light border border-graphite-lighter hover:bg-graphite-lighter hover:border-spectral/30 transition-all"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || user.email}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-spectral/10 border border-spectral/30 flex items-center justify-center">
            <User size={16} className="text-spectral" />
          </div>
        )}

        {/* User Info */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-ice leading-tight">
            {user.name || user.email}
          </p>
          {user.name && (
            <p className="text-xs text-steel leading-tight">{user.email}</p>
          )}
        </div>

        <ChevronDown
          size={16}
          className={`text-steel transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg bg-carbon border border-graphite-lighter shadow-xl overflow-hidden z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-graphite-lighter">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || user.email}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-spectral/10 border border-spectral/30 flex items-center justify-center">
                  <User size={20} className="text-spectral" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ice truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-steel truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-steel hover:bg-graphite-light hover:text-ice transition-colors"
            >
              <Settings size={16} />
              <span>Account Settings</span>
            </Link>

            <Link
              to="/billing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-steel hover:bg-graphite-light hover:text-ice transition-colors"
            >
              <CreditCard size={16} />
              <span>Usage & Billing</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-graphite-lighter py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-coral hover:bg-coral/10 transition-colors text-left"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

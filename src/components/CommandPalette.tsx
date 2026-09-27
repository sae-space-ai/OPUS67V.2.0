/**
 * OPUS67 — Command Palette
 * 
 * Keyboard-driven navigation and actions (CMD/CTRL + K).
 * Provides quick access to common operations without mouse.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, ArrowRight } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  action: () => void;
  category: 'navigation' | 'action';
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      description: 'View system status and overview',
      action: () => navigate('/dashboard'),
      category: 'navigation',
    },
    {
      id: 'nav-agents',
      label: 'Go to Agents',
      description: 'Manage AI agents',
      action: () => navigate('/agents'),
      category: 'navigation',
    },
    {
      id: 'nav-tools',
      label: 'Go to Tools',
      description: 'Manage available tools',
      action: () => navigate('/tools'),
      category: 'navigation',
    },
    {
      id: 'nav-workflows',
      label: 'Go to Workflows',
      description: 'Design and manage workflows',
      action: () => navigate('/workflows'),
      category: 'navigation',
    },
    {
      id: 'nav-projects',
      label: 'Go to Projects',
      description: 'Manage projects',
      action: () => navigate('/projects'),
      category: 'navigation',
    },
    {
      id: 'nav-evidence',
      label: 'Go to Evidence',
      description: 'View evidence ledger',
      action: () => navigate('/evidence'),
      category: 'navigation',
    },
    {
      id: 'nav-governance',
      label: 'Go to Governance',
      description: 'AI governance and compliance',
      action: () => navigate('/governance'),
      category: 'navigation',
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      description: 'System configuration',
      action: () => navigate('/settings'),
      category: 'navigation',
    },
    // Actions
    {
      id: 'action-new-project',
      label: 'New Project',
      description: 'Create a new project',
      action: () => {
        navigate('/projects');
        // Future: Open create project modal
      },
      category: 'action',
    },
    {
      id: 'action-new-agent',
      label: 'New Agent',
      description: 'Create a new AI agent',
      action: () => {
        navigate('/agents');
        // Future: Open create agent modal
      },
      category: 'action',
    },
    {
      id: 'action-new-workflow',
      label: 'New Workflow',
      description: 'Create a new workflow',
      action: () => {
        navigate('/workflows');
        // Future: Open create workflow modal
      },
      category: 'action',
    },
    {
      id: 'action-export',
      label: 'Export Data',
      description: 'Export all data as JSON',
      action: () => {
        navigate('/settings');
        // Future: Trigger export
      },
      category: 'action',
    },
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter((cmd) => {
    const searchLower = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.description?.toLowerCase().includes(searchLower)
    );
  });

  // Keyboard shortcut handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // CMD/CTRL + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleCommandSelect = (command: Command) => {
    command.action();
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
      onClick={() => {
        setIsOpen(false);
        setQuery('');
      }}
    >
      <div
        className="w-full max-w-2xl bg-carbon border border-graphite-lighter rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-graphite-lighter">
          <Search size={18} className="text-steel" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-ice placeholder-steel outline-none text-sm"
            autoFocus
          />
          <button
            onClick={() => {
              setIsOpen(false);
              setQuery('');
            }}
            className="text-steel hover:text-ice transition-colors"
            aria-label="Close command palette"
          >
            <X size={18} />
          </button>
        </div>

        {/* Commands list */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-steel text-sm">
              No commands found
            </div>
          ) : (
            <>
              {/* Navigation commands */}
              {filteredCommands.filter((c) => c.category === 'navigation').length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-steel uppercase tracking-wider bg-graphite/50">
                    Navigation
                  </div>
                  {filteredCommands
                    .filter((c) => c.category === 'navigation')
                    .map((command) => (
                      <button
                        key={command.id}
                        onClick={() => handleCommandSelect(command)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-graphite-light transition-colors text-left"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-ice">{command.label}</div>
                          {command.description && (
                            <div className="text-xs text-steel mt-0.5">{command.description}</div>
                          )}
                        </div>
                        <ArrowRight size={14} className="text-muted" />
                      </button>
                    ))}
                </div>
              )}

              {/* Action commands */}
              {filteredCommands.filter((c) => c.category === 'action').length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-steel uppercase tracking-wider bg-graphite/50">
                    Actions
                  </div>
                  {filteredCommands
                    .filter((c) => c.category === 'action')
                    .map((command) => (
                      <button
                        key={command.id}
                        onClick={() => handleCommandSelect(command)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-graphite-light transition-colors text-left"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-ice">{command.label}</div>
                          {command.description && (
                            <div className="text-xs text-steel mt-0.5">{command.description}</div>
                          )}
                        </div>
                        <ArrowRight size={14} className="text-muted" />
                      </button>
                    ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-graphite-lighter bg-graphite/30">
          <div className="flex items-center justify-between text-xs text-steel">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-graphite-lighter rounded text-[10px]">↑↓</kbd> Navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-graphite-lighter rounded text-[10px]">↵</kbd> Select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-graphite-lighter rounded text-[10px]">esc</kbd> Close
              </span>
            </div>
            <span className="text-muted">OPUS67 Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}

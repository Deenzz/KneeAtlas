import React, { useState } from 'react';
import {
  Bell,
  Bookmark,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { AppTab } from '../types/clinical';

interface TopNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenReminders: () => void;
  bookmarkCount: number;
  dueRemindersCount: number;
  masteryPct: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const NAV_ITEMS: { id: AppTab; label: string }[] = [
  { id: 'studio', label: '3D Studio' },
  { id: 'cases', label: 'Clinic Cases' },
  { id: 'procedures', label: 'Procedures' },
  { id: 'protocols', label: 'Protocols' },
  { id: 'assessment', label: 'OSCE & Quiz' },
];

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenBookmarks,
  onOpenReminders,
  bookmarkCount,
  dueRemindersCount,
  masteryPct,
  darkMode,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('studio')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-500 rounded"
        >
          KneeAtlas
        </button>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-500 ${
                  active
                    ? 'border-sky-600 text-sky-700 dark:border-sky-400 dark:text-sky-300 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search anatomy, portals, cases, and drugs"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Search</span>
            <kbd className="hidden sm:inline font-mono text-[11px] opacity-75">⌘K</kbd>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 bg-white dark:bg-slate-950"
        >
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap shrink-0 min-h-[40px] ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}

      {/* Compact Workspace Utility Strip (Theme, Bookmarks, Reminders, Progress) */}
      <div className="bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-10 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 truncate">
            <span className="font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Clinical Mastery
            </span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-2">
              <div
                className="w-20 sm:w-28 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-sky-600 dark:bg-sky-400 transition-all duration-300"
                  style={{ width: `${masteryPct}%` }}
                />
              </div>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200 font-medium">
                {masteryPct}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={onOpenBookmarks}
              aria-label={`Open saved bookmarks (${bookmarkCount})`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
              <span>Bookmarks</span>
              <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                ({bookmarkCount})
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenReminders}
              aria-label={`Open study reminders (${dueRemindersCount} due)`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Bell
                className={`w-3.5 h-3.5 ${
                  dueRemindersCount > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Reminders</span>
              {dueRemindersCount > 0 && (
                <span className="font-mono tabular-nums font-semibold text-amber-700 dark:text-amber-300">
                  {dueRemindersCount} due
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { SearchResult } from '../types/clinical';
import { buildSearchIndex, searchClinicalContent } from '../utils/clinicalLogic';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectResult: (result: SearchResult) => void;
}

const KIND_LABELS: Record<SearchResult['kind'], string> = {
  anatomy: '3D Structure',
  portal: 'Approach Portal',
  case: 'GP Clinic Case',
  protocol: 'Protocol & Drug',
  quiz: 'Quiz Question',
};

const QUICK_TOPICS = [
  'Superolateral',
  'Hoffa',
  'Pes Anserine',
  'Triamcinolone',
  'Septic',
  'CPPD',
  'Warfarin',
  'Ultrasound',
];

export const SearchModal: React.FC<SearchModalProps> = ({
  open,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<'all' | SearchResult['kind']>('all');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchIndex = useMemo(() => buildSearchIndex(), []);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setKindFilter('all');
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 20);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const raw = searchClinicalContent(query, searchIndex, 30);
    const filtered =
      kindFilter === 'all' ? raw : raw.filter((item) => item.kind === kindFilter);
    return filtered.slice(0, 14);
  }, [query, kindFilter, searchIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/55"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search anatomy, portals, clinic cases, and protocols"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <label htmlFor="kneeatlas-global-search" className="sr-only">
            Search anatomical structures, portals, cases, or medications
          </label>
          <input
            id="kneeatlas-global-search"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search structures (Hoffa, saphenous), portals, cases, or drugs..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-1.5 py-0.5 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search modal"
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto text-xs">
          {(
            [
              { id: 'all', label: 'All Topics' },
              { id: 'anatomy', label: '3D Structures' },
              { id: 'portal', label: 'Portals' },
              { id: 'case', label: 'GP Cases' },
              { id: 'protocol', label: 'Protocols & Fluid' },
              { id: 'quiz', label: 'Quiz' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setKindFilter(tab.id)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                kindFilter === tab.id
                  ? 'bg-slate-900 text-white dark:bg-sky-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Topic Suggestions */}
        {!query.trim() && (
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/70 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Quick jump:
            </span>
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setQuery(topic)}
                className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching medical topics or anatomical landmarks found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-sky-700 dark:text-sky-400">
                    {KIND_LABELS[item.kind]}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { ArrowUpRight, Bookmark, Trash2, X } from 'lucide-react';
import { BookmarkItem } from '../types/clinical';

interface BookmarksDrawerProps {
  open: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  onOpenBookmark: (item: BookmarkItem) => void;
  onRemoveBookmark: (id: string) => void;
}

const KIND_LABELS: Record<BookmarkItem['kind'], string> = {
  anatomy: '3D Structure',
  portal: 'Approach Portal',
  case: 'GP Clinic Case',
  protocol: 'Protocol & Drug',
};

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  open,
  onClose,
  bookmarks,
  onOpenBookmark,
  onRemoveBookmark,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Saved study bookmarks"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
      >
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Saved Bookmarks ({bookmarks.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bookmarks drawer"
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {bookmarks.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                No saved study bookmarks yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Bookmark any 3D structure, approach portal, GP clinic case, or medication protocol to jump back to it immediately during exam revision.
              </p>
            </div>
          ) : (
            bookmarks.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 flex items-start justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    onOpenBookmark(item);
                    onClose();
                  }}
                  className="text-left flex-1 min-w-0 cursor-pointer group"
                >
                  <div className="text-[11px] font-medium text-sky-700 dark:text-sky-400">
                    {KIND_LABELS[item.kind]}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-700 dark:group-hover:text-sky-300 flex items-center gap-1 mt-0.5">
                    <span className="truncate">{item.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveBookmark(item.id)}
                  aria-label={`Remove bookmark '${item.title}'`}
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

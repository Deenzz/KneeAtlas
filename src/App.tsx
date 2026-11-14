import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { APPROACH_PORTALS } from './data/anatomyData';
import { CLINIC_CASES } from './data/casesData';
import { AssessmentView } from './components/AssessmentView';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { ClinicCasesView } from './components/ClinicCasesView';
import { KneeViewport3D } from './components/KneeViewport3D';
import { ProceduresView } from './components/ProceduresView';
import { ProtocolsView } from './components/ProtocolsView';
import { RemindersModal } from './components/RemindersModal';
import { SearchModal } from './components/SearchModal';
import { TopNav } from './components/TopNav';
import {
  AppTab,
  BookmarkItem,
  LearningProgress,
  PathologyMode,
  PortalId,
  SearchResult,
  StudyReminder,
} from './types/clinical';
import { calculateOverallMastery, isReminderDue } from './utils/clinicalLogic';

const STORAGE_KEYS = {
  theme: 'kneeatlas_theme_v1',
  bookmarks: 'kneeatlas_bookmarks_v1',
  reminders: 'kneeatlas_reminders_v1',
  progress: 'kneeatlas_progress_v1',
};

const DEFAULT_PROGRESS: LearningProgress = {
  inspectedStructures: [],
  simulatedPortals: [],
  completedCases: [],
  completedOsceSteps: [],
  quizAnswers: {},
};

const DEFAULT_REMINDERS: StudyReminder[] = [
  {
    id: 'rem-portals',
    title: 'Knee Portal Landmarks & Accuracy Review',
    topic: '6 Intra-Articular Approach Portals',
    timeOfDay: '19:30',
    daysOfWeek: [1, 3, 5],
    enabled: true,
  },
  {
    id: 'rem-osce',
    title: '11-Step OSCE & Septic Knee Checklist',
    topic: 'GP Clinic Scenarios & Septic Knee Exclusion',
    timeOfDay: '09:00',
    daysOfWeek: [2, 6],
    enabled: true,
  },
];

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getInitialTab(): AppTab {
  if (typeof window === 'undefined') return 'studio';
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('tab');
  if (
    requested === 'studio' ||
    requested === 'cases' ||
    requested === 'procedures' ||
    requested === 'protocols' ||
    requested === 'assessment'
  ) {
    return requested;
  }
  return 'studio';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(getInitialTab);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEYS.theme) === 'dark';
  });

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() =>
    typeof window === 'undefined'
      ? []
      : safeReadJson<BookmarkItem[]>(STORAGE_KEYS.bookmarks, []),
  );
  const [reminders, setReminders] = useState<StudyReminder[]>(() =>
    typeof window === 'undefined'
      ? DEFAULT_REMINDERS
      : safeReadJson<StudyReminder[]>(STORAGE_KEYS.reminders, DEFAULT_REMINDERS),
  );
  const [progress, setProgress] = useState<LearningProgress>(() =>
    typeof window === 'undefined'
      ? DEFAULT_PROGRESS
      : safeReadJson<LearningProgress>(STORAGE_KEYS.progress, DEFAULT_PROGRESS),
  );

  // 3D Simulator & Deep-link State
  const [selectedPortalId, setSelectedPortalId] = useState<PortalId>('superolateral');
  const [pathologyMode, setPathologyMode] = useState<PathologyMode>('oa_effusion');
  const [flexionDeg, setFlexionDeg] = useState<number>(0);
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CLINIC_CASES[0].id);
  const [highlightedProtocolId, setHighlightedProtocolId] = useState<string | null>(null);

  // Overlays & Due Reminder Banner
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [dueBannerDismissed, setDueBannerDismissed] = useState(false);
  const [nowTick, setNowTick] = useState(() => new Date());

  // Sync Tailwind v4 .dark class & persistence
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, darkMode ? 'dark' : 'light');
    } catch {
      // ignore storage quota errors
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }, [reminders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Global Cmd+K / Ctrl+K Search shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Periodic reminder check every 60s
  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const dueReminders = useMemo(
    () => reminders.filter((r) => isReminderDue(r, nowTick)),
    [reminders, nowTick],
  );

  const masteryPct = useMemo(() => calculateOverallMastery(progress), [progress]);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks],
  );

  const handleToggleBookmark = useCallback(
    (item: Omit<BookmarkItem, 'createdAt'>) => {
      setBookmarks((prev) => {
        if (prev.some((b) => b.id === item.id)) {
          return prev.filter((b) => b.id !== item.id);
        }
        return [
          { ...item, createdAt: new Date().toISOString() },
          ...prev,
        ];
      });
    },
    [],
  );

  const handleRemoveBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleSelectStructure = useCallback((id: string | null) => {
    setSelectedStructureId(id);
    if (!id) return;
    setProgress((prev) =>
      prev.inspectedStructures.includes(id)
        ? prev
        : { ...prev, inspectedStructures: [...prev.inspectedStructures, id] },
    );
  }, []);

  const handleRecordSimulatedPortal = useCallback((portalId: PortalId) => {
    setProgress((prev) =>
      prev.simulatedPortals.includes(portalId)
        ? prev
        : { ...prev, simulatedPortals: [...prev.simulatedPortals, portalId] },
    );
  }, []);

  const handleCompleteCase = useCallback((caseId: string) => {
    setProgress((prev) =>
      prev.completedCases.includes(caseId)
        ? prev
        : { ...prev, completedCases: [...prev.completedCases, caseId] },
    );
  }, []);

  const handleToggleOsceStep = useCallback((stepId: string, passed: boolean) => {
    setProgress((prev) => {
      const exists = prev.completedOsceSteps.includes(stepId);
      if (passed && !exists) {
        return { ...prev, completedOsceSteps: [...prev.completedOsceSteps, stepId] };
      }
      if (!passed && exists) {
        return {
          ...prev,
          completedOsceSteps: prev.completedOsceSteps.filter((id) => id !== stepId),
        };
      }
      return prev;
    });
  }, []);

  const handleAnswerQuiz = useCallback(
    (questionId: string, selectedIndex: number, isCorrect: boolean) => {
      setProgress((prev) => ({
        ...prev,
        quizAnswers: {
          ...prev.quizAnswers,
          [questionId]: { selectedIndex, isCorrect },
        },
      }));
    },
    [],
  );

  const handleResetQuiz = useCallback(() => {
    setProgress((prev) => ({ ...prev, quizAnswers: {} }));
  }, []);

  const handleInspectIn3D = useCallback(
    (pathology: PathologyMode, portal: PortalId, flexion: number) => {
      setPathologyMode(pathology);
      setSelectedPortalId(portal);
      setFlexionDeg(flexion);
      setSelectedStructureId(null);
      setActiveTab('studio');
    },
    [],
  );

  const handleLaunchPortal3D = useCallback((portal: PortalId, flexion: number) => {
    setSelectedPortalId(portal);
    setFlexionDeg(flexion);
    setSelectedStructureId(null);
    setActiveTab('studio');
  }, []);

  const handleSelectSearchResult = useCallback(
    (result: SearchResult) => {
      if (result.kind === 'anatomy') {
        setActiveTab('studio');
        handleSelectStructure(result.targetId);
      } else if (result.kind === 'portal') {
        const portal = APPROACH_PORTALS.find((p) => p.id === result.targetId);
        setSelectedPortalId(result.targetId as PortalId);
        if (portal) setFlexionDeg(portal.recommendedFlexionDeg);
        setSelectedStructureId(null);
        setActiveTab('studio');
      } else if (result.kind === 'case') {
        setSelectedCaseId(result.targetId);
        setActiveTab('cases');
      } else if (result.kind === 'protocol') {
        setHighlightedProtocolId(result.targetId);
        setActiveTab('protocols');
      } else if (result.kind === 'quiz') {
        setActiveTab('assessment');
      }
    },
    [handleSelectStructure],
  );

  const handleOpenBookmark = useCallback(
    (item: BookmarkItem) => {
      if (item.kind === 'anatomy') {
        setActiveTab('studio');
        handleSelectStructure(item.targetId);
      } else if (item.kind === 'portal') {
        const portal = APPROACH_PORTALS.find((p) => p.id === item.targetId);
        setSelectedPortalId(item.targetId as PortalId);
        if (portal) setFlexionDeg(portal.recommendedFlexionDeg);
        setSelectedStructureId(null);
        setActiveTab('studio');
      } else if (item.kind === 'case') {
        setSelectedCaseId(item.targetId);
        setActiveTab('cases');
      } else if (item.kind === 'protocol') {
        setHighlightedProtocolId(item.targetId);
        setActiveTab('protocols');
      }
    },
    [handleSelectStructure],
  );

  const handleAddReminder = useCallback((input: Omit<StudyReminder, 'id'>) => {
    const newReminder: StudyReminder = {
      ...input,
      id: `rem-${Date.now()}`,
    };
    setReminders((prev) => [newReminder, ...prev]);
  }, []);

  const handleToggleReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  }, []);

  const handleDeleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleMarkReminderDoneToday = useCallback((id: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, lastTriggeredDate: todayStr } : r)),
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenBookmarks={() => setBookmarksOpen(true)}
        onOpenReminders={() => setRemindersOpen(true)}
        bookmarkCount={bookmarks.length}
        dueRemindersCount={dueReminders.length}
        masteryPct={masteryPct}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
      />

      {/* Non-blocking due study reminder banner */}
      {dueReminders.length > 0 && !dueBannerDismissed && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-900 px-4 py-2 text-xs">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 min-w-0">
              <Bell className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                Study reminder due: <strong>{dueReminders[0].title}</strong> ({dueReminders[0].topic})
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setRemindersOpen(true)}
                className="font-semibold text-amber-800 dark:text-amber-200 underline cursor-pointer"
              >
                Open Reminders
              </button>
              <button
                type="button"
                onClick={() => setDueBannerDismissed(true)}
                aria-label="Dismiss due reminder banner"
                className="p-1 text-amber-700 dark:text-amber-300 hover:opacity-75 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {activeTab === 'studio' && (
          <KneeViewport3D
            darkMode={darkMode}
            selectedPortalId={selectedPortalId}
            onChangePortal={setSelectedPortalId}
            pathologyMode={pathologyMode}
            onChangePathology={setPathologyMode}
            flexionDeg={flexionDeg}
            onChangeFlexion={setFlexionDeg}
            selectedStructureId={selectedStructureId}
            onSelectStructure={handleSelectStructure}
            onRecordSimulatedPortal={handleRecordSimulatedPortal}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'cases' && (
          <ClinicCasesView
            selectedCaseId={selectedCaseId}
            onSelectCaseId={setSelectedCaseId}
            completedCases={progress.completedCases}
            onCompleteCase={handleCompleteCase}
            onInspectIn3D={handleInspectIn3D}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'procedures' && (
          <ProceduresView
            onLaunchPortal3D={handleLaunchPortal3D}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'protocols' && (
          <ProtocolsView
            highlightedId={highlightedProtocolId}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentView
            completedOsceSteps={progress.completedOsceSteps}
            onToggleOsceStep={handleToggleOsceStep}
            quizAnswers={progress.quizAnswers}
            onAnswerQuiz={handleAnswerQuiz}
            onResetQuiz={handleResetQuiz}
          />
        )}
      </main>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      <BookmarksDrawer
        open={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        bookmarks={bookmarks}
        onOpenBookmark={handleOpenBookmark}
        onRemoveBookmark={handleRemoveBookmark}
      />

      <RemindersModal
        open={remindersOpen}
        onClose={() => setRemindersOpen(false)}
        progress={progress}
        reminders={reminders}
        onAddReminder={handleAddReminder}
        onToggleReminder={handleToggleReminder}
        onDeleteReminder={handleDeleteReminder}
        onMarkReminderDoneToday={handleMarkReminderDoneToday}
      />
    </div>
  );
}

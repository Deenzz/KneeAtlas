import React, { useEffect, useState } from 'react';
import {
  Bell,
  CalendarPlus,
  Check,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { ANATOMICAL_STRUCTURES, APPROACH_PORTALS } from '../data/anatomyData';
import { OSCE_STEPS, QUIZ_QUESTIONS } from '../data/assessmentData';
import { CLINIC_CASES } from '../data/casesData';
import { LearningProgress, StudyReminder } from '../types/clinical';
import {
  calculateOverallMastery,
  calculateQuizSummary,
  generateReminderIcs,
  isReminderDue,
} from '../utils/clinicalLogic';

interface RemindersModalProps {
  open: boolean;
  onClose: () => void;
  progress: LearningProgress;
  reminders: StudyReminder[];
  onAddReminder: (reminder: Omit<StudyReminder, 'id'>) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onMarkReminderDoneToday: (id: string) => void;
}

const WEEKDAYS = [
  { day: 0, label: 'Sun' },
  { day: 1, label: 'Mon' },
  { day: 2, label: 'Tue' },
  { day: 3, label: 'Wed' },
  { day: 4, label: 'Thu' },
  { day: 5, label: 'Fri' },
  { day: 6, label: 'Sat' },
];

const TOPIC_OPTIONS = [
  '3D Anatomy & Danger Zones',
  '6 Intra-Articular Approach Portals',
  'GP Clinic Scenarios & Septic Knee Exclusion',
  'Corticosteroids, Viscosupplements & Fluid Analysis',
  '11-Step OSCE & Exam Questions',
];

export const RemindersModal: React.FC<RemindersModalProps> = ({
  open,
  onClose,
  progress,
  reminders,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  onMarkReminderDoneToday,
}) => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0]);
  const [timeOfDay, setTimeOfDay] = useState('19:00');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 3, 5]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const masteryPct = calculateOverallMastery(progress);
  const quizSummary = calculateQuizSummary(progress.quizAnswers);
  const now = new Date();

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setFormError('Enter a reminder title (e.g., OSCE Portal Review).');
      return;
    }
    if (daysOfWeek.length === 0) {
      setFormError('Select at least one weekday.');
      return;
    }
    setFormError(null);
    onAddReminder({
      title: trimmed,
      topic,
      timeOfDay,
      daysOfWeek,
      enabled: true,
    });
    setTitle('');
  };

  const handleDownloadIcs = (reminder: StudyReminder) => {
    const ics = generateReminderIcs(reminder);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reminder.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const progressRows = [
    {
      label: '3D Anatomical Structures Inspected',
      done: progress.inspectedStructures.length,
      total: ANATOMICAL_STRUCTURES.length,
    },
    {
      label: 'Injection Portals Simulated',
      done: progress.simulatedPortals.length,
      total: APPROACH_PORTALS.length,
    },
    {
      label: 'GP Clinic Cases Solved',
      done: progress.completedCases.length,
      total: CLINIC_CASES.length,
    },
    {
      label: 'OSCE Steps Verified',
      done: progress.completedOsceSteps.length,
      total: OSCE_STEPS.length,
    },
    {
      label: 'Quiz Mastery Score',
      done: quizSummary.correctCount,
      total: QUIZ_QUESTIONS.length,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Study progress and customizable reminders"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl"
      >
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Study Progress &amp; Reminders
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close progress and reminders modal"
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Progress Overview */}
          <section aria-label="Progress metrics" className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Clinical Competency Breakdown
              </h3>
              <span className="font-mono text-sm font-bold text-sky-700 dark:text-sky-300 tabular-nums">
                {masteryPct}% Overall Mastery
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {progressRows.map((row) => {
                const pct = Math.round((row.done / Math.max(1, row.total)) * 100);
                return (
                  <div
                    key={row.label}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {row.label}
                      </span>
                      <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100 font-semibold">
                        {row.done}/{row.total}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-sky-600 dark:bg-sky-400 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Create Study Reminder Form */}
          <section
            aria-label="Schedule a study reminder"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Add Customizable Study Reminder
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="sm:col-span-2 space-y-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Reminder Title
                  </span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Superolateral & Septic Knee Review"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Time of Day
                  </span>
                  <input
                    type="time"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <label className="space-y-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Study Focus Topic
                  </span>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    {TOPIC_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="space-y-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300 block">
                    Repeat Days
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {WEEKDAYS.map((w) => {
                      const active = daysOfWeek.includes(w.day);
                      return (
                        <button
                          key={w.day}
                          type="button"
                          onClick={() => toggleDay(w.day)}
                          className={`px-2 py-1.5 rounded border font-medium cursor-pointer transition-colors ${
                            active
                              ? 'bg-sky-600 border-sky-600 text-white'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {w.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-red-600 dark:text-red-400 font-medium">{formError}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Save Reminder</span>
                </button>
              </div>
            </form>
          </section>

          {/* Existing Reminders List */}
          <section aria-label="Configured study reminders" className="space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Scheduled Study Sessions ({reminders.length})
            </h3>

            {reminders.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4">
                No reminders configured yet. Create one above to track spaced repetition sessions.
              </p>
            ) : (
              <div className="space-y-2">
                {reminders.map((r) => {
                  const due = isReminderDue(r, now);
                  const dayLabels = r.daysOfWeek
                    .map((d) => WEEKDAYS.find((w) => w.day === d)?.label)
                    .filter(Boolean)
                    .join(', ');

                  return (
                    <div
                      key={r.id}
                      className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
                        due
                          ? 'border-amber-400 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60'
                      }`}
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {r.title}
                          </span>
                          {due && (
                            <span className="font-medium text-amber-700 dark:text-amber-300">
                              · Due Now
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {r.topic} · <span className="font-mono">{r.timeOfDay}</span> · {dayLabels}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {due && (
                          <button
                            type="button"
                            onClick={() => onMarkReminderDoneToday(r.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Mark Done</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDownloadIcs(r)}
                          aria-label={`Export calendar file for '${r.title}'`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>.ICS</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleReminder(r.id)}
                          aria-label={`${r.enabled ? 'Pause' : 'Enable'} reminder '${r.title}'`}
                          className={`px-2.5 py-1.5 rounded-md font-medium border cursor-pointer ${
                            r.enabled
                              ? 'border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40'
                              : 'border-slate-200 dark:border-slate-700 text-slate-500'
                          }`}
                        >
                          {r.enabled ? 'Active' : 'Paused'}
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteReminder(r.id)}
                          aria-label={`Delete reminder '${r.title}'`}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

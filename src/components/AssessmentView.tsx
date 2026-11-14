import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { OSCE_STEPS, QUIZ_QUESTIONS } from '../data/assessmentData';
import { QuizQuestion } from '../types/clinical';
import { calculateQuizSummary } from '../utils/clinicalLogic';

interface AssessmentViewProps {
  completedOsceSteps: string[];
  onToggleOsceStep: (stepId: string, passed: boolean) => void;
  quizAnswers: Record<string, { selectedIndex: number; isCorrect: boolean }>;
  onAnswerQuiz: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  onResetQuiz: () => void;
}

type AssessmentTab = 'osce' | 'quiz';

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  completedOsceSteps,
  onToggleOsceStep,
  quizAnswers,
  onAnswerQuiz,
  onResetQuiz,
}) => {
  const [mode, setMode] = useState<AssessmentTab>('osce');
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [stepChallengeSelection, setStepChallengeSelection] = useState<Record<string, number>>({});
  const [topicFilter, setTopicFilter] = useState<string>('All');

  const activeOsceStep = OSCE_STEPS[activeStepIdx] ?? OSCE_STEPS[0];
  const quizSummary = calculateQuizSummary(quizAnswers);

  const topics = ['All', 'Anatomy & Portals', 'Pharmacology & Dosing', 'GP Clinical Cases', 'Safety & Complications'];
  const filteredQuestions: QuizQuestion[] =
    topicFilter === 'All'
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter((q) => q.topic === topicFilter);

  const handleVerifyOsceStep = (optionIndex: number) => {
    setStepChallengeSelection((prev) => ({
      ...prev,
      [activeOsceStep.id]: optionIndex,
    }));
    const passed = optionIndex === activeOsceStep.verificationPrompt.correctIndex;
    onToggleOsceStep(activeOsceStep.id, passed);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <p className="text-xs font-medium text-sky-700 dark:text-sky-400">
            Student Examination Modules &amp; Outcome Assessment
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 text-balance">
            OSCE Procedure Exam &amp; Clinical Quiz
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Practice the 11-step OSCE clinical checklist with safety gates and test mastery across 15 evidence-based questions from the course PDFs.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setMode('osce')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'osce'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
            <span>OSCE Exam ({completedOsceSteps.length}/{OSCE_STEPS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('quiz')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'quiz'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clinical Quiz ({quizSummary.correctCount}/{quizSummary.totalQuestions})</span>
          </button>
        </div>
      </div>

      {/* OSCE EXAM MODULE */}
      {mode === 'osce' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-2">
            {OSCE_STEPS.map((step, idx) => {
              const active = idx === activeStepIdx;
              const verified = completedOsceSteps.includes(step.id);
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepIdx(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                    active
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold tabular-nums w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {step.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {step.phase}
                      </div>
                    </div>
                  </div>
                  {verified && (
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
                      aria-label="Verified"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">
                  OSCE Step {activeOsceStep.stepNumber} of {OSCE_STEPS.length} · {activeOsceStep.phase}
                </p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeOsceStep.title}
                </h2>
              </div>
              <span className="font-mono text-xs tabular-nums text-slate-600 dark:text-slate-400">
                Verified: {completedOsceSteps.length}/{OSCE_STEPS.length}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Required Clinical Action
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed text-sm">
                  {activeOsceStep.checklistDetail}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                  <div className="font-semibold text-emerald-900 dark:text-emerald-300">
                    Critical Safety Check
                  </div>
                  <p className="text-emerald-800 dark:text-emerald-200/80 mt-1 leading-relaxed">
                    {activeOsceStep.criticalSafetyCheck}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <div className="font-semibold text-amber-900 dark:text-amber-300">
                    Common OSCE Error
                  </div>
                  <p className="text-amber-800 dark:text-amber-200/80 mt-1 leading-relaxed">
                    {activeOsceStep.commonError}
                  </p>
                </div>
              </div>
            </div>

            {/* Step Checkpoint Question */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Examiner Verification: {activeOsceStep.verificationPrompt.question}
              </p>
              <div className="space-y-2">
                {activeOsceStep.verificationPrompt.options.map((opt, oIdx) => {
                  const chosen = stepChallengeSelection[activeOsceStep.id] === oIdx;
                  const isCorrect = oIdx === activeOsceStep.verificationPrompt.correctIndex;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleVerifyOsceStep(oIdx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${
                        chosen
                          ? isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                            : 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <span className="font-mono font-semibold shrink-0">{oIdx + 1}.</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {stepChallengeSelection[activeOsceStep.id] !== undefined && (
                <p className="text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <strong>Rationale:</strong> {activeOsceStep.verificationPrompt.explanation}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={activeStepIdx === 0}
                onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
                className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                Previous Step
              </button>
              <button
                type="button"
                disabled={activeStepIdx === OSCE_STEPS.length - 1}
                onClick={() => setActiveStepIdx((i) => Math.min(OSCE_STEPS.length - 1, i + 1))}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-40 cursor-pointer"
              >
                Next OSCE Step
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLINICAL QUIZ MODULE */}
      {mode === 'quiz' && (
        <div className="space-y-6">
          {/* Scoreboard + Topic Filter */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Overall Accuracy</div>
                  <div className="font-mono text-base font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {quizSummary.accuracyPct}% ({quizSummary.correctCount}/{quizSummary.answeredCount} answered)
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                {Object.entries(quizSummary.byTopic).map(([topic, stat]) => (
                  <div key={topic}>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{topic}</div>
                    <div className="font-mono font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                      {stat.correct}/{stat.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg overflow-x-auto">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopicFilter(t)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                      topicFilter === t
                        ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onResetQuiz}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Quiz</span>
              </button>
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {filteredQuestions.map((q, qIdx) => {
              const userAns = quizAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Question {qIdx + 1} · {q.topic} · {q.difficulty}
                    </span>
                    <span className="font-mono text-[11px]">{q.sourceRef}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                    {q.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isPicked = userAns?.selectedIndex === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      const revealed = userAns !== undefined;

                      let cls =
                        'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/70';
                      if (revealed) {
                        if (isCorrect) {
                          cls =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                        } else if (isPicked && !isCorrect) {
                          cls =
                            'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() =>
                            onAnswerQuiz(q.id, optIdx, optIdx === q.correctIndex)
                          }
                          className={`text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${cls}`}
                        >
                          <span className="mt-0.5 shrink-0">
                            {revealed && isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : revealed && isPicked ? (
                              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            ) : (
                              <span className="font-mono font-semibold text-slate-500">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                            )}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {userAns && (
                    <div className="p-3 rounded-lg bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                      <strong>Clinical Rationale:</strong> {q.rationale}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Activity,
  Bookmark,
  BookmarkCheck,
  Box,
  CheckCircle2,
  ClipboardCheck,
  Stethoscope,
  XCircle,
} from 'lucide-react';
import { APPROACH_PORTALS } from '../data/anatomyData';
import { CLINIC_CASES, PHYSICAL_EXAM_SIGNS } from '../data/casesData';
import { PathologyMode, PortalId } from '../types/clinical';
import { recommendKneePortal } from '../utils/clinicalLogic';

interface ClinicCasesViewProps {
  selectedCaseId: string;
  onSelectCaseId: (id: string) => void;
  completedCases: string[];
  onCompleteCase: (id: string) => void;
  onInspectIn3D: (
    pathology: PathologyMode,
    portal: PortalId,
    flexionDeg: number,
  ) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (item: {
    id: string;
    kind: 'case';
    title: string;
    subtitle: string;
    targetTab: 'cases';
    targetId: string;
  }) => void;
}

export const ClinicCasesView: React.FC<ClinicCasesViewProps> = ({
  selectedCaseId,
  onSelectCaseId,
  completedCases,
  onCompleteCase,
  onInspectIn3D,
  isBookmarked,
  onToggleBookmark,
}) => {
  const activeCase =
    CLINIC_CASES.find((c) => c.id === selectedCaseId) ?? CLINIC_CASES[0];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  // Interactive GP Portal Decision Helper state
  const [effusionSize, setEffusionSize] = useState<'none' | 'moderate' | 'large'>('large');
  const [canExtendKnee, setCanExtendKnee] = useState(true);
  const [suspectedBursitis, setSuspectedBursitis] = useState<'none' | 'anserine' | 'prepatellar'>('none');
  const [lateralPfOa, setLateralPfOa] = useState(false);

  const recommendation = recommendKneePortal({
    effusionSize,
    canExtendKnee,
    suspectedBursitis,
    lateralPatellofemoralOA: lateralPfOa,
  });

  const recPortalObj = APPROACH_PORTALS.find(
    (p) => p.id === recommendation.primaryPortal,
  );

  const chosenOptionId = selectedAnswers[activeCase.id];
  const chosenOption = activeCase.decisionPrompt.options.find(
    (o) => o.id === chosenOptionId,
  );

  const handleAnswerCase = (optionId: string, isCorrect: boolean) => {
    setSelectedAnswers((prev) => ({ ...prev, [activeCase.id]: optionId }));
    if (isCorrect) {
      onCompleteCase(activeCase.id);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <p className="text-xs font-medium text-sky-700 dark:text-sky-400">
            General Practice Clinical Scenarios · {CLINIC_CASES.length} Cases
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 text-balance">
            GP Clinic Cases &amp; Physical Findings Visualization
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Inspect clinical presentations, differentiate intra-articular effusions from para-articular bursitis or septic emergencies, and launch any case directly in the 3D knee simulator.
          </p>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 font-mono tabular-nums">
          Cases Solved: <strong className="text-slate-900 dark:text-slate-100">{completedCases.length}/{CLINIC_CASES.length}</strong>
        </div>
      </div>

      {/* Main Split: Case Directory + Active Case Workup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Case List */}
        <div className="lg:col-span-4 space-y-2">
          {CLINIC_CASES.map((c) => {
            const active = c.id === activeCase.id;
            const solved = completedCases.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCaseId(c.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  active
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {c.title}
                  </span>
                  {solved && (
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                      aria-label="Completed"
                    />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {c.subtitle}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <span>Effusion: {c.physicalExam.effusionGrade}</span>
                  <span aria-hidden="true">·</span>
                  <span>Flexion {c.recommendedFlexionDeg}°</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Case Detail */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeCase.patientProfile}
              </p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {activeCase.title}
              </h2>
              <p className="text-sm text-sky-700 dark:text-sky-400 font-medium mt-0.5">
                {activeCase.chiefComplaint}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                aria-label="Bookmark this clinic case"
                onClick={() =>
                  onToggleBookmark({
                    id: `case:${activeCase.id}`,
                    kind: 'case',
                    title: activeCase.title,
                    subtitle: activeCase.subtitle,
                    targetTab: 'cases',
                    targetId: activeCase.id,
                  })
                }
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isBookmarked(`case:${activeCase.id}`) ? (
                  <BookmarkCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  onInspectIn3D(
                    activeCase.pathologyMode,
                    activeCase.recommendedPortal,
                    activeCase.recommendedFlexionDeg,
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Box className="w-4 h-4" aria-hidden="true" />
                <span>View Pathology &amp; Portal in 3D</span>
              </button>
            </div>
          </div>

          {/* History, Exam, Imaging */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Clinical History
              </h3>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-xs leading-relaxed list-disc pl-4">
                {activeCase.history.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>

              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-2">
                Imaging &amp; Laboratory Workup
              </h3>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-xs leading-relaxed list-disc pl-4">
                {activeCase.imagingAndLabs.map((lab, i) => (
                  <li key={i}>{lab}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Physical Exam Findings</span>
              </h3>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">Inspection:</strong>{' '}
                  {activeCase.physicalExam.inspection}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">Palpation:</strong>{' '}
                  {activeCase.physicalExam.palpation}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">Special Signs:</strong>{' '}
                  {activeCase.physicalExam.specialTests.join(' · ')}
                </p>
                {activeCase.synovialFluidExpected && (
                  <p className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-slate-100">
                      Synovial Fluid Tap:
                    </strong>{' '}
                    {activeCase.synovialFluidExpected}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Clinical Decision Prompt */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400">
              <ClipboardCheck className="w-4 h-4" aria-hidden="true" />
              <span>GP Clinical Management Decision</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {activeCase.decisionPrompt.question}
            </p>
            <div className="space-y-2">
              {activeCase.decisionPrompt.options.map((opt) => {
                const selected = chosenOptionId === opt.id;
                let borderStyle =
                  'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100/70 dark:hover:bg-slate-800/70';
                if (selected) {
                  borderStyle = opt.isCorrect
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-red-500 bg-red-50 dark:bg-red-950/40';
                }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleAnswerCase(opt.id, opt.isCorrect)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${borderStyle}`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {selected ? (
                        opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )
                      ) : (
                        <span className="inline-block w-3.5 h-3.5 rounded-full border border-slate-400" />
                      )}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 leading-relaxed">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {chosenOption && (
              <div
                className={`p-3 rounded-lg text-xs leading-relaxed border ${
                  chosenOption.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
                }`}
              >
                <strong>{chosenOption.isCorrect ? 'Evidence-Based Rationale: ' : 'Clinical Pitfall: '}</strong>
                {chosenOption.rationale}
              </div>
            )}
          </div>

          {/* Full Treatment Protocol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Injection Plan &amp; Equipment
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeCase.treatmentProtocol.injectionPlan}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                <strong>Prep &amp; Needle:</strong> {activeCase.treatmentProtocol.needleAndPrep}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Aftercare &amp; Contraindications Verified
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                {activeCase.treatmentProtocol.aftercare.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Checked: {activeCase.treatmentProtocol.contraindicationsChecked.join(' · ')}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
            Citations: {activeCase.pdfCitations.join(' · ')}
          </div>
        </div>
      </div>

      {/* Physical Exam Detection Signs + Interactive Portal Recommender */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Detecting Clinical Findings: Bedside Knee Exam Signs
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PHYSICAL_EXAM_SIGNS.map((sign) => (
              <div
                key={sign.id}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {sign.name}
                </h3>
                <p className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">
                  Detects: {sign.detects}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sign.technique}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  {sign.clinicalCorrelation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Portal Recommendation Calculator */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Interactive Portal Finder by Exam Findings
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Effusion Size on Palpation
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['none', 'moderate', 'large'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setEffusionSize(sz)}
                    className={`py-1.5 px-2 rounded-md border capitalize cursor-pointer ${
                      effusionSize === sz
                        ? 'bg-sky-600 border-sky-600 text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Para-Articular Bursitis Findings
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'none', label: 'None' },
                    { id: 'anserine', label: 'Anserine' },
                    { id: 'prepatellar', label: 'Prepatellar' },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSuspectedBursitis(b.id)}
                    className={`py-1.5 px-2 rounded-md border cursor-pointer ${
                      suspectedBursitis === b.id
                        ? 'bg-sky-600 border-sky-600 text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={canExtendKnee}
                  onChange={(e) => setCanExtendKnee(e.target.checked)}
                  className="accent-sky-600"
                />
                <span>Patient can extend knee (0°)</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={lateralPfOa}
                  onChange={(e) => setLateralPfOa(e.target.checked)}
                  className="accent-sky-600"
                />
                <span>Tight lateral PF OA</span>
              </label>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-sky-900 dark:text-sky-200">
                Recommended: {recPortalObj?.name}
              </span>
              <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-300 tabular-nums">
                {recPortalObj?.pooledAccuracyPct}%
              </span>
            </div>
            <p className="text-xs text-sky-900/80 dark:text-sky-200/80 leading-relaxed">
              {recommendation.rationale}
            </p>
            <button
              type="button"
              onClick={() =>
                onInspectIn3D(
                  suspectedBursitis === 'anserine'
                    ? 'anserine_bursitis'
                    : suspectedBursitis === 'prepatellar'
                    ? 'prepatellar_bursitis'
                    : effusionSize === 'none'
                    ? 'normal'
                    : 'oa_effusion',
                  recommendation.primaryPortal,
                  recPortalObj?.recommendedFlexionDeg ?? 0,
                )
              }
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Launch Portal in 3D</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

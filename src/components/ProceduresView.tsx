import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Box,
  CheckCircle2,
  ShieldAlert,
  Syringe,
} from 'lucide-react';
import { APPROACH_PORTALS } from '../data/anatomyData';
import { OSCE_STEPS } from '../data/assessmentData';
import { PortalId } from '../types/clinical';
import { AnnotatedDiagrams } from './AnnotatedDiagrams';

interface ProceduresViewProps {
  onLaunchPortal3D: (portalId: PortalId, flexionDeg: number) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (item: {
    id: string;
    kind: 'portal';
    title: string;
    subtitle: string;
    targetTab: 'studio';
    targetId: string;
  }) => void;
}

const EQUIPMENT_LIST = [
  'Skin marker & retracted ballpoint pen (for indentation)',
  'Chlorhexidine >30s scrub or povidone-iodine + alcohol swabs',
  '1% Lidocaine without epinephrine (5 mL) or ethyl chloride spray',
  'Triamcinolone or Methylprednisolone 40 mg/mL (1 mL) or Hyaluronan',
  '5–10 mL Luer-Lok syringes (separate for aspiration vs. injection)',
  '18–20G needle (drawing up / thick effusion aspiration)',
  '21–25G 1.5–2 inch needle (routine injection; longer in obese knees)',
  'EDTA/Heparin + sterile culture tubes, 2×2 gauze, hemostat clamp, band-aid',
];

export const ProceduresView: React.FC<ProceduresViewProps> = ({
  onLaunchPortal3D,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [selectedPortalId, setSelectedPortalId] = useState<PortalId>('superolateral');
  const activePortal =
    APPROACH_PORTALS.find((p) => p.id === selectedPortalId) ?? APPROACH_PORTALS[0];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <p className="text-xs font-medium text-sky-700 dark:text-sky-400">
            Step-by-Step Procedural Mastery · 6 Intra-Articular &amp; 2 Bursal Portals
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 text-balance">
            Approach Portals, Annotated Diagrams &amp; Technique
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Compare anatomical landmark accuracy vs. ultrasound guidance (77.8% → 95.8%), inspect zoomable cross-sectional diagrams, and follow the 11-step aseptic no-touch procedure.
          </p>
        </div>
      </div>

      {/* Interactive Annotated Diagrams */}
      <AnnotatedDiagrams />

      {/* Portal Explorer & Accuracy Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Select Approach Portal
          </h2>
          {APPROACH_PORTALS.map((portal) => {
            const active = portal.id === activePortal.id;
            return (
              <button
                key={portal.id}
                type="button"
                onClick={() => setSelectedPortalId(portal.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  active
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {portal.name}
                  </span>
                  <span className="font-mono text-xs font-bold tabular-nums text-sky-700 dark:text-sky-300">
                    {portal.pooledAccuracyPct}%
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <span>{portal.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>Flexion {portal.recommendedFlexionDeg}°</span>
                  {portal.ultrasoundAccuracyPct && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 dark:text-emerald-400">
                        US {portal.ultrasoundAccuracyPct}%
                      </span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activePortal.type} · {activePortal.evidenceSource}
              </p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {activePortal.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Bookmark this approach portal"
                onClick={() =>
                  onToggleBookmark({
                    id: `portal:${activePortal.id}`,
                    kind: 'portal',
                    title: activePortal.name,
                    subtitle: `${activePortal.pooledAccuracyPct}% pooled accuracy`,
                    targetTab: 'studio',
                    targetId: activePortal.id,
                  })
                }
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isBookmarked(`portal:${activePortal.id}`) ? (
                  <BookmarkCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  onLaunchPortal3D(activePortal.id, activePortal.recommendedFlexionDeg)
                }
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white cursor-pointer whitespace-nowrap"
              >
                <Box className="w-4 h-4" />
                <span>Simulate Portal in 3D</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-slate-500">Published Accuracy</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                {activePortal.accuracyRange}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Needle Spec</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                {activePortal.needleSpec}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Depth &amp; Patella Glide</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                {activePortal.depthCm} · {activePortal.patellaDisplacement}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Patient Positioning
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {activePortal.patientPosition}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Surface Landmark &amp; Entry Site
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {activePortal.entryPoint}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Needle Trajectory
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {activePortal.trajectory}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Best Clinical Indications</span>
              </h3>
              <ul className="mt-1.5 space-y-1 text-slate-600 dark:text-slate-400 list-disc pl-4">
                {activePortal.bestIndications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Limitations &amp; Ectopic Hazard</span>
              </h3>
              <ul className="mt-1.5 space-y-1 text-slate-600 dark:text-slate-400 list-disc pl-4">
                {activePortal.limitations.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
                <li className="text-red-700 dark:text-red-400 font-medium">
                  Hazard: {activePortal.ectopicHazard}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Procedure & Equipment Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            11-Step Standard Knee Injection Procedure (TeachIM &amp; Dalal Protocol)
          </h2>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {OSCE_STEPS.map((step) => (
              <div key={step.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5">
                <span className="font-mono text-xs font-bold tabular-nums w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {String(step.stepNumber).padStart(2, '0')}
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {step.title}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-sky-700 dark:text-sky-400 font-medium">
                      {step.phase}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.checklistDetail}
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300">
                    Safety Pearl: {step.criticalSafetyCheck}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Syringe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Procedure Supply Tray</span>
            </h2>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
              {EQUIPMENT_LIST.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2.5 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Ultrasound vs. Anatomical Guidance
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              While traditional landmark approaches are safe and effective in experienced hands, Berkoff et al. showed ultrasound guidance increases intra-articular accuracy from{' '}
              <strong className="font-mono text-slate-900 dark:text-slate-100">77.8%</strong> to{' '}
              <strong className="font-mono text-emerald-700 dark:text-emerald-400">95.8%</strong>{' '}
              (OR 6.4, p &lt; 0.001), reaching{' '}
              <strong className="font-mono text-emerald-700 dark:text-emerald-400">100%</strong> in the long-axis in-plane superolateral view (Park et al.), yielding greater synovial fluid aspiration and decompression (Sibbitt et al.).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

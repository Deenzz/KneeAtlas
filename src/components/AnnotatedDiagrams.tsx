import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

type DiagramKind = 'sagittal' | 'anterior' | 'ultrasound' | 'microscopy';

interface DiagramCallout {
  id: string;
  label: string;
  detail: string;
}

const CALLOUTS: Record<DiagramKind, DiagramCallout[]> = {
  sagittal: [
    {
      id: 'suprapatellar',
      label: 'Suprapatellar Pouch (SL Target)',
      detail: 'Extends ~5 cm superior to patella beneath quadriceps tendon. Parallel-to-floor needle enters cleanly without contacting Hoffa’s fat pad.',
    },
    {
      id: 'hoffa',
      label: "Hoffa's Fat Pad (Danger Zone)",
      detail: 'Extrasynovial, richly innervated adipose pad behind patellar tendon. #1 ectopic site for missed painful injections (Douglas 2014).',
    },
    {
      id: 'anterior_trajectory',
      label: 'Anterior 45° Notch Trajectory',
      detail: 'With knee flexed 90°, enter 1 cm above tibial plateau and direct upward toward intercondylar notch to clear fat pad and anterior meniscal horn.',
    },
    {
      id: 'prepatellar',
      label: 'Prepatellar Bursa (Superficial)',
      detail: 'Subcutaneous pocket anterior to patella. Aspirate parallel to patellar cortex; never cross deep capsule unnecessarily.',
    },
  ],
  anterior: [
    {
      id: 'sl_bisect',
      label: 'Superolateral Bisection (91%)',
      detail: 'Draw straight lines along superior & lateral patella borders; insert at bisection ~2–4 cm deep under patella.',
    },
    {
      id: 'midpatellar',
      label: 'LMP / MMP Midpatellar Glide',
      detail: 'Push patella medially (LMP) or laterally (MMP) with quadriceps relaxed; slide needle horizontally beneath patellar midpole.',
    },
    {
      id: 'arthroscopic',
      label: 'Anterolateral / Anteromedial (1 cm Grid)',
      detail: 'In 90° flexion, mark 1 cm superior to tibial plateau and 1 cm lateral/medial to patellar tendon.',
    },
    {
      id: 'anserine',
      label: 'Pes Anserine Bursa (Extra-Articular)',
      detail: '3–5 cm distal & medial to tibial tuberosity at conjoined tendon (Sartorius, Gracilis, Semitendinosus) superficial to MCL.',
    },
  ],
  ultrasound: [
    {
      id: 'probe',
      label: 'Linear Transducer (Long-Axis)',
      detail: 'Placed longitudinally over quadriceps tendon & superior patellar pole. Increases accuracy from 77.8% to 95.8–100% (Berkoff/Park).',
    },
    {
      id: 'effusion',
      label: 'Anechoic Suprapatellar Effusion',
      detail: 'Fluid appears black (anechoic) between prefemoral and suprapatellar fat pads, elevating the quadriceps tendon.',
    },
    {
      id: 'needle',
      label: 'In-Plane Echogenic Needle',
      detail: 'Bright hyperechoic linear shaft visualized continuously from skin entry into fluid pocket for complete joint decompression (Sibbitt 2012).',
    },
  ],
  microscopy: [
    {
      id: 'cppd',
      label: 'CPPD (Pseudogout) Crystals',
      detail: 'Rhomboid-shaped, weakly positively birefringent (blue when parallel to compensator axis). Seen in ~70% OA-associated chondrocalcinosis.',
    },
    {
      id: 'gout',
      label: 'Monosodium Urate (Gout) Crystals',
      detail: 'Needle-shaped, strongly negatively birefringent (yellow when parallel to slow axis). Aspirate & inject steroid once sepsis excluded.',
    },
    {
      id: 'septic',
      label: 'Septic Arthritis PMNs & Cocci',
      detail: '>50,000 WBC/mm³ (>75–90% neutrophils) + intracellular bacteria. ABSOLUTE contraindication to corticosteroid injection.',
    },
  ],
};

export const AnnotatedDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<DiagramKind>('sagittal');
  const [selectedCallout, setSelectedCallout] = useState<string>('suprapatellar');
  const [zoom, setZoom] = useState(1);

  const currentCallouts = CALLOUTS[activeDiagram];
  const activeCalloutObj =
    currentCallouts.find((c) => c.id === selectedCallout) ?? currentCallouts[0];

  const handleSwitchDiagram = (kind: DiagramKind) => {
    setActiveDiagram(kind);
    setSelectedCallout(CALLOUTS[kind][0].id);
    setZoom(1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Annotated Clinical &amp; Procedural Diagrams
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Zoomable vector cross-sections · Click callout points to inspect trajectory angles &amp; safety margins
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(
            [
              { id: 'sagittal', label: 'Sagittal Cut' },
              { id: 'anterior', label: 'Portal Landmarks' },
              { id: 'ultrasound', label: 'Ultrasound View' },
              { id: 'microscopy', label: 'Fluid Microscopy' },
            ] as { id: DiagramKind; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSwitchDiagram(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeDiagram === tab.id
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Interactive Zoomable SVG Canvas */}
        <div className="lg:col-span-8 relative bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center min-h-[340px] overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))))}
              aria-label="Zoom out diagram"
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-400">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.75, Number((z + 0.15).toFixed(2))))}
              aria-label="Zoom in diagram"
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              aria-label="Reset diagram zoom"
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className="w-full max-w-[560px] transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {activeDiagram === 'sagittal' && (
              <svg viewBox="0 0 540 340" className="w-full h-auto" role="img" aria-label="Sagittal knee injection anatomical diagram">
                {/* Skin contour */}
                <path
                  d="M 140 20 Q 115 110 105 170 Q 100 215 128 320 L 390 320 Q 375 210 385 150 Q 395 90 375 20 Z"
                  fill="rgba(226, 184, 155, 0.14)"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                {/* Femur */}
                <path
                  d="M 215 20 L 218 125 Q 195 148 206 175 Q 230 192 275 180 Q 315 168 308 130 L 302 20 Z"
                  fill="#efe7d6"
                  stroke="#64748b"
                  strokeWidth="2"
                />
                <text x="242" y="75" className="fill-slate-700 dark:fill-slate-800 text-[12px] font-semibold">Femur</text>
                {/* Tibia */}
                <path
                  d="M 205 204 Q 255 198 310 206 L 306 318 L 214 318 L 208 248 Q 192 238 194 222 Z"
                  fill="#efe7d6"
                  stroke="#64748b"
                  strokeWidth="2"
                />
                <text x="242" y="276" className="fill-slate-700 dark:fill-slate-800 text-[12px] font-semibold">Tibia</text>
                {/* Patella */}
                <path
                  d="M 142 128 Q 162 124 166 155 Q 162 184 142 184 Q 128 170 132 145 Z"
                  fill="#f5efe2"
                  stroke="#475569"
                  strokeWidth="2"
                />
                <text x="114" y="156" className="fill-slate-700 dark:fill-slate-200 text-[11px] font-medium">Patella</text>
                {/* Quadriceps & Patellar Tendons */}
                <path d="M 155 24 L 148 130" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
                <path d="M 148 184 L 194 228" stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />
                {/* Suprapatellar Pouch */}
                <path
                  d="M 164 62 Q 198 54 210 112 Q 204 166 170 162 Q 162 122 164 62 Z"
                  fill="rgba(14, 165, 233, 0.28)"
                  stroke="#0284c7"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setSelectedCallout('suprapatellar')}
                />
                {/* Prepatellar Bursa */}
                <ellipse
                  cx="124"
                  cy="155"
                  rx="8"
                  ry="22"
                  fill="rgba(6, 182, 212, 0.35)"
                  stroke="#0891b2"
                  strokeWidth="1.5"
                  className="cursor-pointer"
                  onClick={() => setSelectedCallout('prepatellar')}
                />
                {/* Hoffa's Fat Pad */}
                <path
                  d="M 164 178 Q 198 178 204 205 Q 192 222 168 210 Z"
                  fill="rgba(245, 158, 11, 0.45)"
                  stroke="#d97706"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setSelectedCallout('hoffa')}
                />
                {/* Meniscus Wedge */}
                <polygon points="212,192 238,198 212,202" fill="#0d9488" />
                {/* Superolateral Needle */}
                <line x1="60" y1="92" x2="188" y2="92" stroke="#0284c7" strokeWidth="3" />
                <polygon points="188,92 178,88 178,96" fill="#0284c7" />
                <text x="20" y="84" className="fill-sky-600 dark:fill-sky-400 text-[11px] font-semibold">SL Portal (2–4 cm)</text>
                {/* Anterior 45° Needle */}
                <line x1="88" y1="224" x2="205" y2="182" stroke="#10b981" strokeWidth="3" strokeDasharray="5 3" />
                <polygon points="205,182 194,181 198,189" fill="#10b981" />
                <text x="16" y="242" className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-semibold">Anterior ~45° Notch</text>
                {/* Ectopic Warning Needle */}
                <line x1="92" y1="196" x2="178" y2="196" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                <text x="20" y="199" className="fill-red-600 dark:fill-red-400 text-[10px] font-semibold">Ectopic (Hoffa)</text>
              </svg>
            )}

            {activeDiagram === 'anterior' && (
              <svg viewBox="0 0 540 340" className="w-full h-auto" role="img" aria-label="Anterior knee portal landmark map">
                {/* Knee silhouette */}
                <path
                  d="M 160 20 Q 145 140 155 210 Q 160 280 175 325 L 365 325 Q 380 280 385 210 Q 395 140 380 20 Z"
                  fill="rgba(226, 184, 155, 0.14)"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
                {/* Patella */}
                <ellipse cx="270" cy="122" rx="46" ry="52" fill="#f5efe2" stroke="#475569" strokeWidth="2.5" />
                <text x="252" y="126" className="fill-slate-800 text-[13px] font-bold">Patella</text>
                {/* Patellar Tendon */}
                <rect x="250" y="174" width="40" height="72" rx="4" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                <text x="234" y="214" className="fill-slate-700 text-[10px] font-medium">Pat. Tendon</text>
                {/* Tibial Tuberosity */}
                <ellipse cx="270" cy="256" rx="20" ry="14" fill="#efe7d6" stroke="#64748b" strokeWidth="2" />
                <text x="236" y="284" className="fill-slate-600 dark:fill-slate-300 text-[11px] font-medium">Tibial Tuberosity</text>
                {/* Tibial Plateau Joint Line */}
                <line x1="175" y1="192" x2="365" y2="192" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 4" />
                <text x="372" y="196" className="fill-slate-500 text-[10px]">Joint Line</text>
                {/* SL Bisection Lines */}
                <line x1="205" y1="70" x2="345" y2="70" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="316" y1="48" x2="316" y2="145" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* Portal Targets */}
                <g className="cursor-pointer" onClick={() => setSelectedCallout('sl_bisect')}>
                  <circle cx="326" cy="68" r="8" fill="#0284c7" />
                  <text x="342" y="66" className="fill-sky-600 dark:fill-sky-400 text-[11px] font-semibold">SL (91%)</text>
                </g>
                <g className="cursor-pointer" onClick={() => setSelectedCallout('sl_bisect')}>
                  <circle cx="214" cy="68" r="7" fill="#0ea5e9" />
                  <text x="155" y="66" className="fill-sky-600 dark:fill-sky-400 text-[11px] font-semibold">SM (93%)</text>
                </g>
                <g className="cursor-pointer" onClick={() => setSelectedCallout('midpatellar')}>
                  <circle cx="326" cy="122" r="7" fill="#f59e0b" />
                  <text x="340" y="126" className="fill-amber-600 dark:fill-amber-400 text-[11px] font-semibold">LMP (76%)</text>
                  <circle cx="214" cy="122" r="7" fill="#f59e0b" />
                  <text x="148" y="126" className="fill-amber-600 dark:fill-amber-400 text-[11px] font-semibold">MMP (56%)</text>
                </g>
                <g className="cursor-pointer" onClick={() => setSelectedCallout('arthroscopic')}>
                  <circle cx="308" cy="176" r="7" fill="#10b981" />
                  <text x="322" y="176" className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-semibold">AL (85%)</text>
                  <circle cx="232" cy="176" r="7" fill="#10b981" />
                  <text x="164" y="176" className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-semibold">AM (73%)</text>
                </g>
                {/* Pes Anserine Bursa */}
                <g className="cursor-pointer" onClick={() => setSelectedCallout('anserine')}>
                  <ellipse cx="215" cy="276" rx="18" ry="12" fill="rgba(16, 185, 129, 0.35)" stroke="#059669" strokeWidth="2" />
                  <text x="108" y="280" className="fill-emerald-700 dark:fill-emerald-400 text-[11px] font-semibold">Anserine Bursa</text>
                </g>
              </svg>
            )}

            {activeDiagram === 'ultrasound' && (
              <svg viewBox="0 0 540 340" className="w-full h-auto" role="img" aria-label="Long-axis in-plane ultrasound view of suprapatellar knee injection">
                <rect x="20" y="20" width="500" height="300" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                {/* Linear US Transducer */}
                <g className="cursor-pointer" onClick={() => setSelectedCallout('probe')}>
                  <rect x="170" y="28" width="200" height="26" rx="4" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="212" y="45" className="fill-slate-100 text-[11px] font-semibold">Linear Probe (Long Axis)</text>
                </g>
                {/* Quadriceps Tendon */}
                <path d="M 60 95 L 335 128 L 335 148 L 60 120 Z" fill="#64748b" opacity="0.65" />
                <text x="72" y="114" className="fill-slate-200 text-[10px]">Quadriceps Tendon</text>
                {/* Patella Shadow */}
                <path d="M 335 112 Q 390 112 405 162 L 405 295 L 335 295 Z" fill="#020617" stroke="#e2e8f0" strokeWidth="3" />
                <text x="348" y="150" className="fill-slate-200 text-[11px] font-semibold">Patella</text>
                {/* Femoral Cortex */}
                <line x1="40" y1="255" x2="335" y2="255" stroke="#f8fafc" strokeWidth="4" />
                <text x="60" y="276" className="fill-slate-300 text-[11px]">Femoral Shaft Cortex</text>
                {/* Anechoic Effusion */}
                <g className="cursor-pointer" onClick={() => setSelectedCallout('effusion')}>
                  <path d="M 85 152 Q 210 138 328 168 L 320 228 Q 190 220 85 186 Z" fill="#000000" stroke="#38bdf8" strokeWidth="2" />
                  <text x="150" y="192" className="fill-sky-400 text-[12px] font-semibold">Anechoic Effusion</text>
                </g>
                {/* Echogenic In-Plane Needle */}
                <g className="cursor-pointer" onClick={() => setSelectedCallout('needle')}>
                  <line x1="48" y1="78" x2="242" y2="178" stroke="#facc15" strokeWidth="3.5" />
                  <circle cx="242" cy="178" r="5" fill="#facc15" />
                  <text x="42" y="70" className="fill-amber-300 text-[11px] font-semibold">In-Plane Needle (95.8–100% Accuracy)</text>
                </g>
              </svg>
            )}

            {activeDiagram === 'microscopy' && (
              <svg viewBox="0 0 540 340" className="w-full h-auto" role="img" aria-label="Synovial fluid polarized microscopy comparison">
                {/* 3 Microscopy Fields */}
                <g className="cursor-pointer" onClick={() => setSelectedCallout('cppd')}>
                  <circle cx="105" cy="170" r="78" fill="#1e293b" stroke="#0284c7" strokeWidth="3" />
                  <rect x="78" y="145" width="22" height="14" rx="2" fill="#38bdf8" transform="rotate(-18 89 152)" />
                  <rect x="112" y="176" width="20" height="13" rx="2" fill="#38bdf8" transform="rotate(24 122 182)" />
                  <circle cx="118" cy="138" r="14" fill="rgba(148,163,184,0.45)" />
                  <text x="44" y="274" className="fill-sky-700 dark:fill-sky-400 text-[12px] font-bold">CPPD (Pseudogout)</text>
                  <text x="44" y="290" className="fill-slate-500 text-[10px]">Rhomboid · (+) Birefringent</text>
                </g>

                <g className="cursor-pointer" onClick={() => setSelectedCallout('gout')}>
                  <circle cx="270" cy="170" r="78" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                  <line x1="238" y1="150" x2="296" y2="132" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
                  <line x1="250" y1="184" x2="306" y2="200" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="270" cy="168" r="22" fill="rgba(148,163,184,0.35)" />
                  <text x="218" y="274" className="fill-amber-700 dark:fill-amber-400 text-[12px] font-bold">Gout (MSU)</text>
                  <text x="212" y="290" className="fill-slate-500 text-[10px]">Needle · (-) Birefringent</text>
                </g>

                <g className="cursor-pointer" onClick={() => setSelectedCallout('septic')}>
                  <circle cx="435" cy="170" r="78" fill="#1e293b" stroke="#ef4444" strokeWidth="3" />
                  <circle cx="412" cy="150" r="16" fill="#fda4af" opacity="0.65" />
                  <circle cx="452" cy="154" r="15" fill="#fda4af" opacity="0.65" />
                  <circle cx="432" cy="192" r="17" fill="#fda4af" opacity="0.65" />
                  <circle cx="410" cy="152" r="2.5" fill="#7f1d1d" />
                  <circle cx="416" cy="150" r="2.5" fill="#7f1d1d" />
                  <circle cx="450" cy="154" r="2.5" fill="#7f1d1d" />
                  <text x="385" y="274" className="fill-red-600 dark:fill-red-400 text-[12px] font-bold">Septic Arthritis</text>
                  <text x="372" y="290" className="fill-slate-500 text-[10px]">WBC &gt;50k · NO STEROIDS</text>
                </g>
              </svg>
            )}
          </div>
        </div>

        {/* Callout Details Panel */}
        <div className="lg:col-span-4 p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Select Annotation Marker
            </p>
            <div className="space-y-2">
              {currentCallouts.map((c) => {
                const active = c.id === activeCalloutObj.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCallout(c.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                      active
                        ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-300 dark:border-sky-700'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {c.label}
                    </div>
                    {active && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                        {c.detail}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Sources: Neustadt 2006 · Douglas 2014 · TeachIM Checklist · Dalal &amp; Lemenchick 2015
          </div>
        </div>
      </div>
    </div>
  );
};

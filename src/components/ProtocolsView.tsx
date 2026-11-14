import React, { useEffect, useState } from 'react';
import {
  AlertOctagon,
  Bookmark,
  BookmarkCheck,
  Droplets,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react';
import {
  COMPLICATIONS_DATA,
  CONTRAINDICATIONS_DATA,
  CORTICOSTEROID_AGENTS,
  HYALURONAN_AGENTS,
  SYNOVIAL_FLUID_PROFILES,
} from '../data/protocolsData';

interface ProtocolsViewProps {
  highlightedId?: string | null;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (item: {
    id: string;
    kind: 'protocol';
    title: string;
    subtitle: string;
    targetTab: 'protocols';
    targetId: string;
  }) => void;
}

type ProtocolSection = 'steroids' | 'hyaluronans' | 'fluid' | 'safety';

export const ProtocolsView: React.FC<ProtocolsViewProps> = ({
  highlightedId,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [section, setSection] = useState<ProtocolSection>('steroids');
  const [selectedFluidId, setSelectedFluidId] = useState<string>('non_inflammatory');

  useEffect(() => {
    if (!highlightedId) return;
    if (CORTICOSTEROID_AGENTS.some((a) => a.id === highlightedId)) {
      setSection('steroids');
    } else if (HYALURONAN_AGENTS.some((h) => h.id === highlightedId)) {
      setSection('hyaluronans');
    } else if (SYNOVIAL_FLUID_PROFILES.some((f) => f.id === highlightedId)) {
      setSection('fluid');
      setSelectedFluidId(highlightedId);
    }
  }, [highlightedId]);

  const activeFluid =
    SYNOVIAL_FLUID_PROFILES.find((f) => f.id === selectedFluidId) ??
    SYNOVIAL_FLUID_PROFILES[0];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <p className="text-xs font-medium text-sky-700 dark:text-sky-400">
            Evidence-Based Pharmacology &amp; Clinical Protocols
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 text-balance">
            Treatment Protocols, Dosing &amp; Synovial Fluid Analysis
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Complete reference tables synthesized from Neustadt (2006), Douglas (2014), TeachIM Checklist, and Dalal &amp; Lemenchick (2015).
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {(
            [
              { id: 'steroids', label: 'Corticosteroids & Anesthetics' },
              { id: 'hyaluronans', label: 'Viscosupplements' },
              { id: 'fluid', label: 'Synovial Fluid Analyzer' },
              { id: 'safety', label: 'Contraindications & Aftercare' },
            ] as { id: ProtocolSection; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                section === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Corticosteroids & Local Anesthetics */}
      {section === 'steroids' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Injectable Corticosteroid Suspensions for the Knee
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Lower water solubility prolongs intra-articular residence and minimizes systemic spillover. Wait ≥ 8–12 weeks between knee injections (max 2–3/year).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Agent (Trade)</th>
                    <th className="py-3 px-4 font-semibold">Solubility</th>
                    <th className="py-3 px-4 font-semibold">Strength</th>
                    <th className="py-3 px-4 font-semibold">Potency</th>
                    <th className="py-3 px-4 font-semibold">Knee Dose</th>
                    <th className="py-3 px-4 font-semibold">Clinical Pearls</th>
                    <th className="py-3 px-4 font-semibold text-right">Save</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {CORTICOSTEROID_AGENTS.map((agent) => {
                    const isHl = highlightedId === agent.id;
                    return (
                      <tr
                        key={agent.id}
                        className={
                          isHl
                            ? 'bg-sky-50/70 dark:bg-sky-950/30'
                            : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                        }
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {agent.genericName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {agent.tradeName}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {agent.solubilityClass}
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {agent.concentrationMgMl}
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          {agent.relativePotency}×
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-sky-700 dark:text-sky-300 font-medium">
                          {agent.kneeDoseMg}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                          {agent.clinicalPearls}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            aria-label={`Bookmark ${agent.genericName}`}
                            onClick={() =>
                              onToggleBookmark({
                                id: `protocol:${agent.id}`,
                                kind: 'protocol',
                                title: `${agent.genericName} (${agent.tradeName})`,
                                subtitle: `${agent.kneeDoseMg} · ${agent.solubilityClass}`,
                                targetTab: 'protocols',
                                targetId: agent.id,
                              })
                            }
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                          >
                            {isBookmarked(`protocol:${agent.id}`) ? (
                              <BookmarkCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Local Anesthetics + OA Management Ladder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Local Anesthetics: Roles &amp; Regimens (Dalal Slide 20)
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Three clinical purposes: <strong>(1) Analgesia</strong> via Na⁺ channel blockade, <strong>(2) Diagnostic confirmation</strong> when immediate pain relief confirms intra-articular source, and <strong>(3) Volume dilution/dispersion</strong> (reduces risk of subcutaneous atrophy).
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1 font-mono">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    1% Lidocaine (plain)
                  </div>
                  <div className="text-slate-500 mt-1">Onset: Rapid (minutes)</div>
                  <div className="text-slate-500">Duration: 60–90 min</div>
                  <div className="text-sky-700 dark:text-sky-300 mt-1">
                    Standard: 2–4 mL + 1 mL steroid
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    0.25–0.5% Bupivacaine
                  </div>
                  <div className="text-slate-500 mt-1">Onset: ~30 min</div>
                  <div className="text-slate-500">Duration: 6–8 hours</div>
                  <div className="text-slate-500 mt-1">Buffer option: NaHCO₃</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Individualized Knee OA Stepwise Ladder (Neustadt 2006)
              </h3>
              <ol className="space-y-1.5 text-slate-600 dark:text-slate-400 list-decimal pl-4 leading-relaxed">
                <li>
                  <strong className="text-slate-900 dark:text-slate-100">Deloading &amp; Education:</strong> Weight reduction, isometric quad strengthening, avoid stair impact, lateral shoe heel/sole wedges for medial OA (61% favorable response).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-slate-100">Simple Analgesics &amp; NSAIDs:</strong> Acetaminophen → Nonselective or COX-2 selective NSAIDs (monitor GI/renal/CV risk).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-slate-100">Intra-Articular Injections:</strong> Corticosteroid (NNT 3–4; ideal when synovitis/effusion present) or Hyaluronan series (after CSI failure in non-bone-on-bone OA).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-slate-100">Surgical TKR:</strong> Reserved for intractable pain/disability refractory to medical &amp; injection therapy. (Saline lavage/arthroscopic debridement without loose body/tear is ineffective.)
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Viscosupplements (Hyaluronans) */}
      {section === 'hyaluronans' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Intra-Articular Hyaluronan Preparations (Viscosupplementation)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Restores viscoelasticity, scavenges reactive oxygen species, inhibits MMPs/cytokines, and stimulates endogenous hyaluronan synthesis. Poor response in severe "bone-on-bone" OA.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Brand (Generic)</th>
                  <th className="py-3 px-4 font-semibold">Source</th>
                  <th className="py-3 px-4 font-semibold">Mol. Weight</th>
                  <th className="py-3 px-4 font-semibold">Conc / Vol</th>
                  <th className="py-3 px-4 font-semibold">Schedule</th>
                  <th className="py-3 px-4 font-semibold">Safety &amp; SAIR Notes</th>
                  <th className="py-3 px-4 font-semibold text-right">Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {HYALURONAN_AGENTS.map((ha) => (
                  <tr
                    key={ha.id}
                    className={
                      highlightedId === ha.id
                        ? 'bg-sky-50/70 dark:bg-sky-950/30'
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                    }
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {ha.brandName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {ha.genericName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {ha.sourceType}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {ha.molecularWeightMDa}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {ha.concentrationMgMl} mg/mL · {ha.doseVolumeMl} mL
                    </td>
                    <td className="py-3.5 px-4 text-sky-700 dark:text-sky-300 font-medium">
                      {ha.dosingSchedule}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                      {ha.sairRiskNote}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        aria-label={`Bookmark ${ha.brandName}`}
                        onClick={() =>
                          onToggleBookmark({
                            id: `protocol:${ha.id}`,
                            kind: 'protocol',
                            title: `${ha.brandName} (${ha.genericName})`,
                            subtitle: `${ha.dosingSchedule} · ${ha.sourceType}`,
                            targetTab: 'protocols',
                            targetId: ha.id,
                          })
                        }
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        {isBookmarked(`protocol:${ha.id}`) ? (
                          <BookmarkCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: Synovial Fluid Diagnostic Analyzer */}
      {section === 'fluid' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Select Aspirated Synovial Fluid Appearance</span>
            </h2>
            {SYNOVIAL_FLUID_PROFILES.map((profile) => {
              const active = profile.id === activeFluid.id;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setSelectedFluidId(profile.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    active
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {profile.category}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-slate-500">
                      WBC {profile.wbcPerMm3}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {profile.appearance} · Viscosity: {profile.viscosity}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <Droplets
                className={`w-6 h-6 shrink-0 ${
                  activeFluid.badgeTone === 'critical'
                    ? 'text-red-600 dark:text-red-400'
                    : activeFluid.badgeTone === 'warning'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-sky-600 dark:text-sky-400'
                }`}
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {activeFluid.category}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  "Liquid biopsy of the joint" (Dalal Slide 7 · Neustadt p. 901)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-slate-500">Gross Appearance</div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeFluid.appearance}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Clarity</div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeFluid.clarity}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Viscosity</div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeFluid.viscosity}
                </div>
              </div>
              <div>
                <div className="text-slate-500">WBC / mm³</div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 tabular-nums">
                  {activeFluid.wbcPerMm3}
                </div>
              </div>
              <div>
                <div className="text-slate-500">% PMNs</div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 tabular-nums">
                  {activeFluid.pmnPercent}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Culture</div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeFluid.culture}
                </div>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100">Polarized Microscopy:</strong>{' '}
                {activeFluid.crystals}
              </p>
              <div
                className={`p-3.5 rounded-lg border ${
                  activeFluid.badgeTone === 'critical'
                    ? 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
                    : 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                }`}
              >
                <strong>Clinical Decision:</strong> {activeFluid.immediateAction}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Contraindications, Complications & Aftercare */}
      {section === 'safety' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
              <h2 className="text-base font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4" />
                <span>Absolute Contraindications</span>
              </h2>
              <div className="space-y-2.5">
                {CONTRAINDICATIONS_DATA.absolute.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs"
                  >
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {c.title}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {c.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
              <h2 className="text-base font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Relative Contraindications &amp; Nuances</span>
              </h2>
              <div className="space-y-2.5">
                {CONTRAINDICATIONS_DATA.relative.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {c.title}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {c.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Complications Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Complications &amp; Adverse Reactions (Meta-Analysis 5.5% Total Rate)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Complication</th>
                    <th className="py-3 px-4 font-semibold">Reported Rate</th>
                    <th className="py-3 px-4 font-semibold">Typical Onset</th>
                    <th className="py-3 px-4 font-semibold">Prevention &amp; Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {COMPLICATIONS_DATA.map((comp, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {comp.name}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-sky-700 dark:text-sky-300">
                        {comp.rate}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {comp.timing}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                        {comp.management}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

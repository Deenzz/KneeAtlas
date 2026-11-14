import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Info,
  Layers,
  Play,
  RotateCcw,
  Syringe,
  X,
} from 'lucide-react';
import { ANATOMICAL_STRUCTURES, APPROACH_PORTALS } from '../data/anatomyData';
import { createKneeScene, KneeSceneController } from '../three/kneeScene';
import { LayerId, PathologyMode, PortalId } from '../types/clinical';

interface KneeViewport3DProps {
  darkMode: boolean;
  selectedPortalId: PortalId;
  onChangePortal: (id: PortalId) => void;
  pathologyMode: PathologyMode;
  onChangePathology: (mode: PathologyMode) => void;
  flexionDeg: number;
  onChangeFlexion: (deg: number) => void;
  selectedStructureId: string | null;
  onSelectStructure: (id: string | null) => void;
  onRecordSimulatedPortal: (id: PortalId) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (item: {
    id: string;
    kind: 'anatomy' | 'portal';
    title: string;
    subtitle: string;
    targetTab: 'studio';
    targetId: string;
  }) => void;
}

type DockTab = 'portal' | 'layers' | 'pathology' | 'camera';

const PATHOLOGY_OPTIONS: { id: PathologyMode; label: string; summary: string }[] = [
  { id: 'normal', label: 'Normal Knee', summary: 'Healthy hyaline cartilage & minimal physiologic synovial fluid' },
  { id: 'oa_effusion', label: 'OA + Effusion', summary: 'Marginal osteophytes, mild cartilage thinning & suprapatellar effusion' },
  { id: 'oa_severe', label: 'Severe OA (KL IV)', summary: 'Bone-on-bone joint space loss, prominent osteophytes, dry joint' },
  { id: 'septic', label: 'Septic Arthritis', summary: 'Tense hyperemic erythematous synovitis — ABSOLUTE steroid contraindication' },
  { id: 'cppd', label: 'CPPD Pseudogout', summary: 'Meniscal chondrocalcinosis crystals + acute inflammatory effusion' },
  { id: 'anserine_bursitis', label: 'Anserine Bursitis', summary: 'Focal anteromedial bursal swelling below joint line (extra-articular)' },
  { id: 'prepatellar_bursitis', label: 'Prepatellar Bursitis', summary: 'Superficial anterior patellar swelling ("housemaid’s knee")' },
];

const LAYER_LABELS: { id: LayerId; label: string }[] = [
  { id: 'skin', label: 'Skin & Pen Marks' },
  { id: 'muscles', label: 'Tendons & Ligaments' },
  { id: 'bursae', label: 'Bursae & Hoffa Pad' },
  { id: 'cartilage', label: 'Cartilage & Menisci' },
  { id: 'bones', label: 'Femur, Tibia & Patella' },
];

export const KneeViewport3D: React.FC<KneeViewport3DProps> = ({
  darkMode,
  selectedPortalId,
  onChangePortal,
  pathologyMode,
  onChangePathology,
  flexionDeg,
  onChangeFlexion,
  selectedStructureId,
  onSelectStructure,
  onRecordSimulatedPortal,
  isBookmarked,
  onToggleBookmark,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<KneeSceneController | null>(null);

  const [visibleLayers, setVisibleLayers] = useState<Record<LayerId, boolean>>({
    skin: true,
    muscles: true,
    bursae: true,
    cartilage: true,
    bones: true,
  });
  const [explodeAmount, setExplodeAmount] = useState(0);
  const [effusionScale, setEffusionScale] = useState(0.55);
  const [needleProgress, setNeedleProgress] = useState(0);
  const [showEctopicError, setShowEctopicError] = useState(false);
  const [dockTab, setDockTab] = useState<DockTab>('portal');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const onSelectStructureRef = useRef(onSelectStructure);
  onSelectStructureRef.current = onSelectStructure;
  const onRecordPortalRef = useRef(onRecordSimulatedPortal);
  onRecordPortalRef.current = onRecordSimulatedPortal;
  const selectedPortalRef = useRef(selectedPortalId);
  selectedPortalRef.current = selectedPortalId;

  // Mount WebGL scene once
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const controller = createKneeScene(
      el,
      {
        visibleLayers,
        explodeAmount,
        flexionDeg,
        pathologyMode,
        effusionScale,
        selectedPortalId,
        needleProgress,
        showEctopicError,
        selectedStructureId,
        darkMode,
      },
      (structId) => {
        onSelectStructureRef.current(structId);
        if (structId) setInspectorOpen(true);
      },
      () => {
        setNeedleProgress(1);
        onRecordPortalRef.current(selectedPortalRef.current);
      },
    );
    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push reactive state updates to Three.js controller without tearing down canvas
  useEffect(() => {
    controllerRef.current?.updateState({
      visibleLayers,
      explodeAmount,
      flexionDeg,
      pathologyMode,
      effusionScale,
      selectedPortalId,
      needleProgress,
      showEctopicError,
      selectedStructureId,
      darkMode,
    });
  }, [
    visibleLayers,
    explodeAmount,
    flexionDeg,
    pathologyMode,
    effusionScale,
    selectedPortalId,
    needleProgress,
    showEctopicError,
    selectedStructureId,
    darkMode,
  ]);

  // Smoothly focus camera when a structure is selected from search or list
  useEffect(() => {
    if (!selectedStructureId) return;
    const found = ANATOMICAL_STRUCTURES.find((s) => s.id === selectedStructureId);
    if (found) {
      controllerRef.current?.focusCamera(
        found.cameraFocus.position,
        found.cameraFocus.target,
      );
      setInspectorOpen(true);
    }
  }, [selectedStructureId]);

  // Keyboard shortcut 'H' to toggle Cinema / Zen mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'h' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setDockCollapsed((c) => !c);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const currentPortal =
    APPROACH_PORTALS.find((p) => p.id === selectedPortalId) ?? APPROACH_PORTALS[0];
  const currentStructure =
    ANATOMICAL_STRUCTURES.find((s) => s.id === selectedStructureId) ?? null;

  const handlePortalSelect = (portalId: PortalId) => {
    const portal = APPROACH_PORTALS.find((p) => p.id === portalId);
    onChangePortal(portalId);
    setNeedleProgress(0);
    setShowEctopicError(false);
    if (portal) {
      onChangeFlexion(portal.recommendedFlexionDeg);
      controllerRef.current?.focusCamera(
        portal.cameraView.position,
        portal.cameraView.target,
      );
    }
  };

  const handleSimulateInjection = () => {
    setNeedleProgress(1);
    controllerRef.current?.triggerInjectionAnimation();
  };

  const handlePathologyChange = (mode: PathologyMode) => {
    onChangePathology(mode);
    if (mode === 'oa_effusion' || mode === 'septic' || mode === 'cppd') {
      setEffusionScale(0.8);
    } else if (mode === 'oa_severe' || mode === 'normal') {
      setEffusionScale(0.15);
    }
  };

  const toggleLayer = (layerId: LayerId) => {
    setVisibleLayers((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  const activePathologyObj =
    PATHOLOGY_OPTIONS.find((p) => p.id === pathologyMode) ?? PATHOLOGY_OPTIONS[0];

  return (
    <section
      aria-label="Interactive 3D Knee Anatomy & Injection Simulator"
      data-state={`${pathologyMode}:${selectedPortalId}:${flexionDeg}`}
      className="relative w-full h-[calc(100vh-98px)] min-h-[540px] overflow-hidden bg-slate-100 dark:bg-slate-950"
    >
      {/* Dedicated Isolated WebGL Canvas Mount */}
      <div
        ref={mountRef}
        data-testid="knee-3d-canvas"
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Minimal Top-Left Spec Strip (solid fill, zero backdrop-blur) */}
      <div className="pointer-events-none absolute top-4 left-4 right-4 sm:right-auto z-10 flex flex-wrap items-center gap-2">
        <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {currentPortal.name}
            </span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="font-mono tabular-nums text-sky-700 dark:text-sky-300 font-medium">
              {currentPortal.pooledAccuracyPct}% accuracy
            </span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
              Flexion {flexionDeg}°
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
            <span>{activePathologyObj.label}</span>
            <span aria-hidden="true">·</span>
            <span>Click any 3D structure to inspect</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setInspectorOpen((o) => !o)}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
          <span>{inspectorOpen ? 'Close Guide' : 'Portal & Anatomy Guide'}</span>
        </button>
      </div>

      {/* Collapsible Clinical Structure & Portal Guide Drawer */}
      {inspectorOpen && (
        <aside
          aria-label="Selected structure and portal clinical guide"
          className="absolute top-18 right-4 z-20 w-[min(370px,calc(100vw-2rem))] max-h-[calc(100%-175px)] overflow-y-auto bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-md"
        >
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-[11px] font-medium text-sky-700 dark:text-sky-400">
                {currentStructure ? currentStructure.category : currentPortal.type}
              </p>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {currentStructure ? currentStructure.name : currentPortal.name}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Bookmark current structure or portal"
                onClick={() => {
                  if (currentStructure) {
                    onToggleBookmark({
                      id: `anatomy:${currentStructure.id}`,
                      kind: 'anatomy',
                      title: currentStructure.name,
                      subtitle: currentStructure.category,
                      targetTab: 'studio',
                      targetId: currentStructure.id,
                    });
                  } else {
                    onToggleBookmark({
                      id: `portal:${currentPortal.id}`,
                      kind: 'portal',
                      title: currentPortal.name,
                      subtitle: `${currentPortal.pooledAccuracyPct}% pooled accuracy`,
                      targetTab: 'studio',
                      targetId: currentPortal.id,
                    });
                  }
                }}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                {isBookmarked(
                  currentStructure
                    ? `anatomy:${currentStructure.id}`
                    : `portal:${currentPortal.id}`,
                ) ? (
                  <BookmarkCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                aria-label="Close guide drawer"
                onClick={() => setInspectorOpen(false)}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {currentStructure ? (
            <div className="space-y-3 pt-3 text-xs">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentStructure.summary}
              </p>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Clinical Findings &amp; Relevance
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {currentStructure.clinicalRelevance}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Palpation Landmark Tip
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {currentStructure.palpationTip}
                </p>
              </div>
              {currentStructure.injectionWarning && (
                <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Injection Safety Warning</span>
                  </div>
                  <p className="mt-1 leading-relaxed">{currentStructure.injectionWarning}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                <span>Ref: {currentStructure.pdfReference}</span>
                <button
                  type="button"
                  onClick={() => onSelectStructure(null)}
                  className="text-sky-600 dark:text-sky-400 font-medium hover:underline cursor-pointer"
                >
                  Show Portal Guide
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-3 text-xs">
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-slate-500">Accuracy</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {currentPortal.accuracyRange}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Depth &amp; Needle</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {currentPortal.depthCm}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Positioning &amp; Entry Site
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {currentPortal.patientPosition}. {currentPortal.entryPoint}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Needle Trajectory
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {currentPortal.trajectory}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Ectopic Hazard
                </h3>
                <p className="text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
                  {currentPortal.ectopicHazard}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                  Quick Structure Focus
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ANATOMICAL_STRUCTURES.slice(0, 6).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSelectStructure(s.id)}
                      className="px-2 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {s.name.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* Unified Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[min(1000px,96vw)] transition-transform duration-200 ${
          dockCollapsed ? 'translate-y-[calc(100%-34px)]' : 'translate-y-0'
        }`}
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setDockCollapsed((c) => !c)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-medium rounded-t-lg bg-white/95 dark:bg-slate-900/95 border border-b-0 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Show 3D Controls (H)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hide Controls (H)</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 sm:p-3 shadow-lg">
          {/* Dock Tabs + Primary Simulate CTA */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full sm:w-auto">
              {(
                [
                  { id: 'portal', label: 'Portals & Needle' },
                  { id: 'layers', label: 'Layers & Explode' },
                  { id: 'pathology', label: 'Findings & Effusion' },
                  { id: 'camera', label: 'Camera & Views' },
                ] as { id: DockTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDockTab(tab.id)}
                  className={`px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer text-center ${
                    dockTab === tab.id
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentPortal.ectopicTargetLocal && (
                <button
                  type="button"
                  onClick={() => {
                    setShowEctopicError((v) => !v);
                    setNeedleProgress(1);
                  }}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showEctopicError
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {showEctopicError ? 'Showing Ectopic Error' : 'Preview Ectopic Error'}
                </button>
              )}

              <button
                type="button"
                onClick={handleSimulateInjection}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Simulate Injection</span>
              </button>
            </div>
          </div>

          {/* Dock Tab Body */}
          <div className="pt-2.5">
            {dockTab === 'portal' && (
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-1">
                  {APPROACH_PORTALS.map((portal) => {
                    const active = portal.id === selectedPortalId;
                    return (
                      <button
                        key={portal.id}
                        type="button"
                        onClick={() => handlePortalSelect(portal.id)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-500 text-sky-800 dark:text-sky-200'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{portal.shortName}</span>
                        <span className="ml-1 font-mono text-[10px] opacity-75 tabular-nums">
                          {portal.pooledAccuracyPct}%
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap flex items-center gap-1.5">
                      <Syringe className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Needle Depth</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.02}
                      value={needleProgress}
                      onChange={(e) => setNeedleProgress(Number(e.target.value))}
                      className="flex-1 accent-sky-600"
                    />
                    <span className="font-mono tabular-nums w-10 text-right text-slate-800 dark:text-slate-200">
                      {Math.round(needleProgress * 100)}%
                    </span>
                  </label>

                  <label className="flex items-center justify-between gap-3">
                    <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      Knee Flexion
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={90}
                      step={5}
                      value={flexionDeg}
                      onChange={(e) => onChangeFlexion(Number(e.target.value))}
                      className="flex-1 accent-sky-600"
                    />
                    <span className="font-mono tabular-nums w-10 text-right text-slate-800 dark:text-slate-200">
                      {flexionDeg}°
                    </span>
                  </label>
                </div>
              </div>
            )}

            {dockTab === 'layers' && (
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {LAYER_LABELS.map((layer) => {
                    const on = visibleLayers[layer.id];
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => toggleLayer(layer.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          on
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {on ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{layer.label}</span>
                      </button>
                    );
                  })}
                </div>

                <label className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Exploded Layers Separation</span>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={explodeAmount}
                    onChange={(e) => setExplodeAmount(Number(e.target.value))}
                    className="flex-1 accent-sky-600"
                  />
                  <span className="font-mono tabular-nums w-10 text-right text-slate-800 dark:text-slate-200">
                    {Math.round(explodeAmount * 100)}%
                  </span>
                </label>
              </div>
            )}

            {dockTab === 'pathology' && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {PATHOLOGY_OPTIONS.map((opt) => {
                    const active = opt.id === pathologyMode;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handlePathologyChange(opt.id)}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-500 text-sky-800 dark:text-sky-200'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <label className="flex items-center gap-3 flex-1 min-w-[220px]">
                    <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      Synovial Effusion Volume
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={effusionScale}
                      onChange={(e) => setEffusionScale(Number(e.target.value))}
                      className="flex-1 accent-sky-600"
                    />
                    <span className="font-mono tabular-nums w-10 text-right text-slate-800 dark:text-slate-200">
                      {Math.round(effusionScale * 60)} mL
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activePathologyObj.summary}
                  </p>
                </div>
              </div>
            )}

            {dockTab === 'camera' && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => controllerRef.current?.focusCamera([0, 0.15, 3.0], [0, -0.05, 0.12])}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Anterior View
                  </button>
                  <button
                    type="button"
                    onClick={() => controllerRef.current?.focusCamera([2.85, 0.2, 0.25], [0, -0.05, 0.1])}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Lateral Sagittal
                  </button>
                  <button
                    type="button"
                    onClick={() => controllerRef.current?.focusCamera([-2.85, 0.2, 0.35], [0, -0.15, 0.1])}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Medial / Anserine
                  </button>
                  <button
                    type="button"
                    onClick={() => controllerRef.current?.focusCamera([0.2, 2.55, 1.4], [0, 0.25, 0.2])}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Superior Pouch
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setExplodeAmount(0);
                    onChangeFlexion(0);
                    setNeedleProgress(0);
                    setShowEctopicError(false);
                    onSelectStructure(null);
                    controllerRef.current?.focusCamera([2.55, 0.45, 3.85], [0.08, 0.06, 0.1]);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset View</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

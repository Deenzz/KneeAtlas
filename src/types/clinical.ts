export type LayerId =
  | 'skin'
  | 'muscles'
  | 'bursae'
  | 'cartilage'
  | 'bones';

export type PathologyMode =
  | 'normal'
  | 'oa_effusion'
  | 'oa_severe'
  | 'septic'
  | 'cppd'
  | 'anserine_bursitis'
  | 'prepatellar_bursitis';

export type PortalId =
  | 'superolateral'
  | 'superomedial'
  | 'lateral_midpatellar'
  | 'medial_midpatellar'
  | 'anterolateral'
  | 'anteromedial'
  | 'anserine_bursa'
  | 'prepatellar_bursa';

export interface AnatomicalStructure {
  id: string;
  name: string;
  latinName?: string;
  layer: LayerId;
  category: 'Bone' | 'Cartilage & Meniscus' | 'Ligament & Tendon' | 'Bursa & Synovium' | 'Danger Zone' | 'Surface Landmark';
  summary: string;
  clinicalRelevance: string;
  palpationTip: string;
  injectionWarning?: string;
  pdfReference: string;
  cameraFocus: {
    position: [number, number, number];
    target: [number, number, number];
  };
  highlightColor: string;
}

export interface ApproachPortal {
  id: PortalId;
  name: string;
  shortName: string;
  type: 'Intra-Articular' | 'Para-Articular (Bursal)';
  patientPosition: string;
  recommendedFlexionDeg: number;
  patellaDisplacement: 'None' | 'Medial glide' | 'Lateral glide';
  accuracyRange: string;
  pooledAccuracyPct: number;
  ultrasoundAccuracyPct?: number;
  needleSpec: string;
  depthCm: string;
  entryPoint: string;
  trajectory: string;
  bestIndications: string[];
  limitations: string[];
  ectopicHazard: string;
  evidenceSource: string;
  entryLocal: [number, number, number];
  targetLocal: [number, number, number];
  ectopicTargetLocal?: [number, number, number];
  cameraView: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export interface CorticosteroidAgent {
  id: string;
  genericName: string;
  tradeName: string;
  solubilityClass: 'Most Soluble' | 'Soluble' | 'Slightly Soluble' | 'Relatively Insoluble' | 'Combination';
  concentrationMgMl: string;
  relativePotency: number;
  kneeDoseMg: string;
  onsetProfile: string;
  durationProfile: string;
  clinicalPearls: string;
}

export interface HyaluronanAgent {
  id: string;
  genericName: string;
  brandName: string;
  sourceType: 'Natural (Avian)' | 'Chemically Cross-Linked' | 'Bacterial Fermentation (Non-Avian)';
  molecularWeightMDa: string;
  concentrationMgMl: number;
  doseVolumeMl: number;
  dosingSchedule: string;
  sairRiskNote: string;
}

export interface SynovialFluidProfile {
  id: string;
  category: string;
  appearance: string;
  clarity: string;
  viscosity: string;
  wbcPerMm3: string;
  pmnPercent: string;
  crystals: string;
  culture: string;
  immediateAction: string;
  badgeTone: 'nominal' | 'caution' | 'warning' | 'critical';
}

export interface ClinicalCase {
  id: string;
  title: string;
  subtitle: string;
  patientProfile: string;
  chiefComplaint: string;
  history: string[];
  physicalExam: {
    inspection: string;
    palpation: string;
    specialTests: string[];
    effusionGrade: 'None / Trace' | 'Small' | 'Moderate' | 'Large Tense';
  };
  imagingAndLabs: string[];
  synovialFluidExpected?: string;
  pathologyMode: PathologyMode;
  recommendedFlexionDeg: number;
  recommendedPortal: PortalId;
  differentialDiagnosis: string[];
  decisionPrompt: {
    question: string;
    options: {
      id: string;
      label: string;
      isCorrect: boolean;
      rationale: string;
    }[];
  };
  treatmentProtocol: {
    firstLineAndAdjuncts: string[];
    injectionPlan: string;
    needleAndPrep: string;
    aftercare: string[];
    contraindicationsChecked: string[];
  };
  pdfCitations: string[];
}

export interface OsceStep {
  id: string;
  stepNumber: number;
  title: string;
  phase: 'Pre-Procedure' | 'Preparation & Landmarks' | 'Aseptic Technique & Injection' | 'Post-Procedure';
  checklistDetail: string;
  criticalSafetyCheck: string;
  commonError: string;
  verificationPrompt: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface QuizQuestion {
  id: string;
  topic: 'Anatomy & Portals' | 'Pharmacology & Dosing' | 'GP Clinical Cases' | 'Safety & Complications';
  difficulty: 'Core' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  sourceRef: string;
}

export type AppTab = 'studio' | 'cases' | 'procedures' | 'protocols' | 'assessment';

export interface BookmarkItem {
  id: string;
  kind: 'anatomy' | 'portal' | 'case' | 'protocol';
  title: string;
  subtitle: string;
  targetTab: AppTab;
  targetId: string;
  createdAt: string;
}

export interface StudyReminder {
  id: string;
  title: string;
  topic: string;
  timeOfDay: string; // HH:MM
  daysOfWeek: number[]; // 0-6
  enabled: boolean;
  lastTriggeredDate?: string;
}

export interface LearningProgress {
  inspectedStructures: string[];
  simulatedPortals: string[];
  completedCases: string[];
  completedOsceSteps: string[];
  quizAnswers: Record<string, { selectedIndex: number; isCorrect: boolean }>;
}

export interface SearchResult {
  id: string;
  kind: 'anatomy' | 'portal' | 'case' | 'protocol' | 'quiz';
  title: string;
  subtitle: string;
  keywords: string;
  targetTab: AppTab;
  targetId: string;
  score: number;
}

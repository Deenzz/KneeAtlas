import { ANATOMICAL_STRUCTURES, APPROACH_PORTALS } from '../data/anatomyData';
import { CLINIC_CASES } from '../data/casesData';
import {
  CORTICOSTEROID_AGENTS,
  HYALURONAN_AGENTS,
  SYNOVIAL_FLUID_PROFILES,
} from '../data/protocolsData';
import { OSCE_STEPS, QUIZ_QUESTIONS } from '../data/assessmentData';
import {
  LearningProgress,
  PortalId,
  QuizQuestion,
  SearchResult,
  StudyReminder,
} from '../types/clinical';

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const s of ANATOMICAL_STRUCTURES) {
    results.push({
      id: `anatomy:${s.id}`,
      kind: 'anatomy',
      title: s.name,
      subtitle: `${s.category} · ${s.latinName ?? s.layer}`,
      keywords: `${s.name} ${s.latinName ?? ''} ${s.summary} ${s.clinicalRelevance} ${s.injectionWarning ?? ''}`.toLowerCase(),
      targetTab: 'studio',
      targetId: s.id,
      score: 0,
    });
  }

  for (const p of APPROACH_PORTALS) {
    results.push({
      id: `portal:${p.id}`,
      kind: 'portal',
      title: p.name,
      subtitle: `${p.type} · ${p.accuracyRange}`,
      keywords: `${p.name} ${p.entryPoint} ${p.trajectory} ${p.bestIndications.join(' ')} ${p.ectopicHazard}`.toLowerCase(),
      targetTab: 'studio',
      targetId: p.id,
      score: 0,
    });
  }

  for (const c of CLINIC_CASES) {
    results.push({
      id: `case:${c.id}`,
      kind: 'case',
      title: c.title,
      subtitle: c.subtitle,
      keywords: `${c.title} ${c.subtitle} ${c.patientProfile} ${c.chiefComplaint} ${c.differentialDiagnosis.join(' ')}`.toLowerCase(),
      targetTab: 'cases',
      targetId: c.id,
      score: 0,
    });
  }

  for (const drug of CORTICOSTEROID_AGENTS) {
    results.push({
      id: `steroid:${drug.id}`,
      kind: 'protocol',
      title: `${drug.genericName} (${drug.tradeName})`,
      subtitle: `Corticosteroid · ${drug.solubilityClass} · ${drug.kneeDoseMg}`,
      keywords: `${drug.genericName} ${drug.tradeName} ${drug.solubilityClass} ${drug.clinicalPearls}`.toLowerCase(),
      targetTab: 'protocols',
      targetId: drug.id,
      score: 0,
    });
  }

  for (const ha of HYALURONAN_AGENTS) {
    results.push({
      id: `ha:${ha.id}`,
      kind: 'protocol',
      title: `${ha.brandName} (${ha.genericName})`,
      subtitle: `Viscosupplement · ${ha.sourceType} · ${ha.dosingSchedule}`,
      keywords: `${ha.brandName} ${ha.genericName} ${ha.sourceType} ${ha.sairRiskNote}`.toLowerCase(),
      targetTab: 'protocols',
      targetId: ha.id,
      score: 0,
    });
  }

  for (const fluid of SYNOVIAL_FLUID_PROFILES) {
    results.push({
      id: `fluid:${fluid.id}`,
      kind: 'protocol',
      title: fluid.category,
      subtitle: `Synovial Fluid · WBC ${fluid.wbcPerMm3} · ${fluid.appearance}`,
      keywords: `${fluid.category} ${fluid.crystals} ${fluid.immediateAction}`.toLowerCase(),
      targetTab: 'protocols',
      targetId: fluid.id,
      score: 0,
    });
  }

  for (const q of QUIZ_QUESTIONS) {
    results.push({
      id: `quiz:${q.id}`,
      kind: 'quiz',
      title: q.question,
      subtitle: `${q.topic} · ${q.difficulty}`,
      keywords: `${q.question} ${q.topic} ${q.rationale}`.toLowerCase(),
      targetTab: 'assessment',
      targetId: q.id,
      score: 0,
    });
  }

  return results;
}

export function searchClinicalContent(
  query: string,
  index: SearchResult[] = buildSearchIndex(),
  limit = 16,
): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return index.slice(0, limit);
  }

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const scored: SearchResult[] = [];

  for (const item of index) {
    const titleLower = item.title.toLowerCase();
    const subtitleLower = item.subtitle.toLowerCase();
    let score = 0;

    let allMatched = true;
    for (const token of tokens) {
      if (titleLower.includes(token)) {
        score += titleLower.startsWith(token) ? 12 : 8;
      } else if (subtitleLower.includes(token)) {
        score += 5;
      } else if (item.keywords.includes(token)) {
        score += 2;
      } else {
        allMatched = false;
        break;
      }
    }

    if (allMatched && score > 0) {
      scored.push({ ...item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.slice(0, limit);
}

export interface PortalRecommendationInput {
  effusionSize: 'none' | 'moderate' | 'large';
  canExtendKnee: boolean;
  suspectedBursitis: 'none' | 'anserine' | 'prepatellar';
  lateralPatellofemoralOA: boolean;
}

export interface PortalRecommendation {
  primaryPortal: PortalId;
  secondaryPortal: PortalId;
  rationale: string;
}

export function recommendKneePortal(
  input: PortalRecommendationInput,
): PortalRecommendation {
  if (input.suspectedBursitis === 'anserine') {
    return {
      primaryPortal: 'anserine_bursa',
      secondaryPortal: 'superolateral',
      rationale:
        'Focal anteromedial pain below the joint line indicates extra-articular pes anserine bursitis; avoid entering the joint cavity unless concurrent effusion is present.',
    };
  }
  if (input.suspectedBursitis === 'prepatellar') {
    return {
      primaryPortal: 'prepatellar_bursa',
      secondaryPortal: 'superolateral',
      rationale:
        'Superficial fluctuant anterior patellar swelling indicates prepatellar bursitis; aspirate superficially first to exclude septic bursitis.',
    };
  }
  if (!input.canExtendKnee) {
    return {
      primaryPortal: 'anterolateral',
      secondaryPortal: 'anteromedial',
      rationale:
        'When the knee cannot fully extend, anterior flexed arthroscopic portals (Anterolateral 71–85% accuracy, 100% Waddell) avoid extensor tension and patellar collision.',
    };
  }
  if (input.effusionSize === 'large' || input.effusionSize === 'moderate') {
    return {
      primaryPortal: 'superolateral',
      secondaryPortal: 'superomedial',
      rationale:
        'With a moderate or large effusion and full extension, the Superolateral portal gives the highest pooled accuracy (91%; up to 100% with ultrasound) and direct access to the suprapatellar pouch.',
    };
  }
  if (input.lateralPatellofemoralOA) {
    return {
      primaryPortal: 'superomedial',
      secondaryPortal: 'medial_midpatellar',
      rationale:
        'In tight lateral patellofemoral OA, medial or superomedial entry avoids a narrowed, painful lateral patellofemoral cleft.',
    };
  }
  return {
    primaryPortal: 'superolateral',
    secondaryPortal: 'anterolateral',
    rationale:
      'For routine extended dry knees, Superolateral (91%) or flexed Anterolateral (85%) avoids the <50% low-volume reliability issues seen with lateral joint-line midpatellar injections.',
  };
}

export function calculateQuizSummary(
  answers: Record<string, { selectedIndex: number; isCorrect: boolean }>,
  questions: QuizQuestion[] = QUIZ_QUESTIONS,
) {
  const totalQuestions = questions.length;
  const answeredIds = Object.keys(answers).filter((id) =>
    questions.some((q) => q.id === id),
  );
  const answeredCount = answeredIds.length;
  const correctCount = answeredIds.filter((id) => answers[id]?.isCorrect).length;
  const accuracyPct =
    answeredCount === 0 ? 0 : Math.round((correctCount / answeredCount) * 100);

  const byTopic: Record<string, { answered: number; correct: number; total: number }> = {};
  for (const q of questions) {
    if (!byTopic[q.topic]) {
      byTopic[q.topic] = { answered: 0, correct: 0, total: 0 };
    }
    byTopic[q.topic].total += 1;
    const ans = answers[q.id];
    if (ans) {
      byTopic[q.topic].answered += 1;
      if (ans.isCorrect) byTopic[q.topic].correct += 1;
    }
  }

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    accuracyPct,
    byTopic,
  };
}

export function calculateOverallMastery(progress: LearningProgress): number {
  const structurePct = Math.min(
    1,
    progress.inspectedStructures.length / Math.max(1, ANATOMICAL_STRUCTURES.length),
  );
  const portalPct = Math.min(
    1,
    progress.simulatedPortals.length / Math.max(1, APPROACH_PORTALS.length),
  );
  const casePct = Math.min(
    1,
    progress.completedCases.length / Math.max(1, CLINIC_CASES.length),
  );
  const oscePct = Math.min(
    1,
    progress.completedOsceSteps.length / Math.max(1, OSCE_STEPS.length),
  );
  const quizSummary = calculateQuizSummary(progress.quizAnswers);
  const quizPct = quizSummary.correctCount / Math.max(1, quizSummary.totalQuestions);

  return Math.round(
    (structurePct * 0.2 +
      portalPct * 0.2 +
      casePct * 0.25 +
      oscePct * 0.15 +
      quizPct * 0.2) *
      100,
  );
}

export function isReminderDue(reminder: StudyReminder, now: Date): boolean {
  if (!reminder.enabled) return false;
  const day = now.getDay();
  if (!reminder.daysOfWeek.includes(day)) return false;

  const todayStr = now.toISOString().slice(0, 10);
  if (reminder.lastTriggeredDate === todayStr) return false;

  const [hhStr, mmStr] = reminder.timeOfDay.split(':');
  const hh = Number(hhStr);
  const mm = Number(mmStr);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = hh * 60 + mm;
  return currentMinutes >= targetMinutes && currentMinutes <= targetMinutes + 59;
}

export function generateReminderIcs(reminder: StudyReminder): string {
  const [hhStr = '09', mmStr = '00'] = reminder.timeOfDay.split(':');
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = hhStr.padStart(2, '0');
  const mm = mmStr.padStart(2, '0');

  const dayTokens = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const byDay = reminder.daysOfWeek
    .map((idx) => dayTokens[idx])
    .filter(Boolean)
    .join(',');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KneeAtlas Clinical//Study Reminder//EN',
    'BEGIN:VEVENT',
    `UID:${reminder.id}@kneeatlas.local`,
    `DTSTART:${y}${m}${d}T${hh}${mm}00`,
    `DURATION:PT20M`,
    byDay ? `RRULE:FREQ=WEEKLY;BYDAY=${byDay}` : 'RRULE:FREQ=DAILY',
    `SUMMARY:KneeAtlas Study — ${reminder.title}`,
    `DESCRIPTION:Focus topic: ${reminder.topic}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSearchIndex,
  calculateOverallMastery,
  calculateQuizSummary,
  generateReminderIcs,
  isReminderDue,
  recommendKneePortal,
  searchClinicalContent,
} from './clinicalLogic';

test('searchClinicalContent locates Hoffa fat pad and corticosteroid queries accurately', () => {
  const index = buildSearchIndex();
  const hoffaResults = searchClinicalContent('Hoffa', index);
  assert.ok(hoffaResults.length > 0);
  assert.equal(hoffaResults[0].targetId, 'hoffa_fat_pad');
  assert.equal(hoffaResults[0].targetTab, 'studio');

  const steroidResults = searchClinicalContent('hexacetonide', index);
  assert.ok(steroidResults.some((r) => r.targetId === 'triamcinolone_hexacetonide'));
});

test('recommendKneePortal routes clinical scenarios to evidence-based portals', () => {
  const largeEffusion = recommendKneePortal({
    effusionSize: 'large',
    canExtendKnee: true,
    suspectedBursitis: 'none',
    lateralPatellofemoralOA: false,
  });
  assert.equal(largeEffusion.primaryPortal, 'superolateral');

  const flexedDry = recommendKneePortal({
    effusionSize: 'none',
    canExtendKnee: false,
    suspectedBursitis: 'none',
    lateralPatellofemoralOA: false,
  });
  assert.equal(flexedDry.primaryPortal, 'anterolateral');

  const anserine = recommendKneePortal({
    effusionSize: 'none',
    canExtendKnee: true,
    suspectedBursitis: 'anserine',
    lateralPatellofemoralOA: false,
  });
  assert.equal(anserine.primaryPortal, 'anserine_bursa');
});

test('calculateQuizSummary and calculateOverallMastery compute accurate scores', () => {
  const summary = calculateQuizSummary({
    q1_pooled_accuracy: { selectedIndex: 1, isCorrect: true },
    q2_ectopic_site: { selectedIndex: 0, isCorrect: false },
  });
  assert.equal(summary.answeredCount, 2);
  assert.equal(summary.correctCount, 1);
  assert.equal(summary.accuracyPct, 50);

  const mastery = calculateOverallMastery({
    inspectedStructures: ['patella', 'hoffa_fat_pad'],
    simulatedPortals: ['superolateral'],
    completedCases: ['case_oa_tense_effusion'],
    completedOsceSteps: ['osce_1_indication'],
    quizAnswers: {
      q1_pooled_accuracy: { selectedIndex: 1, isCorrect: true },
    },
  });
  assert.ok(mastery > 0 && mastery <= 100);
});

test('isReminderDue triggers inside matching weekday and time window and exports ICS', () => {
  const fridayMorning = new Date('2026-11-13T09:15:00');
  const reminder = {
    id: 'rem_1',
    title: 'Review Knee Portals',
    topic: 'Anatomy & Portals',
    timeOfDay: '09:00',
    daysOfWeek: [fridayMorning.getDay()],
    enabled: true,
  };
  assert.equal(isReminderDue(reminder, fridayMorning), true);
  assert.equal(
    isReminderDue(
      { ...reminder, lastTriggeredDate: fridayMorning.toISOString().slice(0, 10) },
      fridayMorning,
    ),
    false,
  );
  const ics = generateReminderIcs(reminder);
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('SUMMARY:KneeAtlas Study — Review Knee Portals'));
});

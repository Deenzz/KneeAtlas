import { ClinicalCase } from '../types/clinical';

export const PHYSICAL_EXAM_SIGNS = [
  {
    id: 'bulge_sign',
    name: 'Bulge Sign (Fluid Wave)',
    detects: 'Small to moderate intra-articular effusion (4–8 mL)',
    technique:
      'With knee extended, milk fluid upward from the medial recess into the suprapatellar pouch. Then stroke downward along the lateral aspect and watch the medial gutter for a fluid bulge.',
    clinicalCorrelation: 'Confirms intra-articular synovitis even before patellar ballottement becomes positive.',
  },
  {
    id: 'patellar_tap',
    name: 'Patellar Tap (Ballottement Sign)',
    detects: 'Moderate to large tense intra-articular effusion',
    technique:
      'Compress the suprapatellar pouch downward with one hand to displace fluid under the patella; with the other hand, push the patella sharply downward against the femur.',
    clinicalCorrelation:
      'A palpable "click" or bounce as the patella strikes the femoral trochlea indicates significant joint effusion — strongest indication for Superolateral arthrocentesis.',
  },
  {
    id: 'joint_line_tenderness',
    name: 'Joint Line vs. Extra-Articular Palpation',
    detects: 'Compartmental OA / Meniscal pathology vs. Pes Anserine or Prepatellar bursitis',
    technique:
      'Flex knee to 90° and palpate the tibiofemoral cleft 1 cm above the tibial plateau, then palpate 3–4 cm distally over the anteromedial tibia (anserine bursa) and superficially over the patella.',
    clinicalCorrelation:
      'Prevents misdiagnosing pes anserine bursitis as refractory medial OA.',
  },
  {
    id: 'crepitus_rom',
    name: 'Crepitus & Extension Limitation',
    detects: 'Articular cartilage loss & flexion contracture',
    technique:
      'Place palm over patella during active flexion/extension; assess full passive extension (0°) vs fixed flexion deformity.',
    clinicalCorrelation:
      'If knee cannot extend fully, switch from Superolateral/Midpatellar portals to the Anterolateral (flexed) portal.',
  },
];

export const CLINIC_CASES: ClinicalCase[] = [
  {
    id: 'case_oa_tense_effusion',
    title: 'Case 1: Symptomatic Knee OA with Large Tense Effusion',
    subtitle: 'Inflammatory OA Flare · Arthrocentesis + Corticosteroid',
    patientProfile: '64-year-old woman · BMI 29 kg/m² · Chronic medial knee pain × 4 yrs, acute swelling × 5 days',
    chiefComplaint: 'Tense, throbbing right knee swelling and difficulty rising from a low chair.',
    history: [
      'Known Kellgren-Lawrence Grade II–III medial compartment osteoarthritis.',
      'Failed acetaminophen 1g TID, topical/oral NSAIDs, and quadriceps strengthening.',
      'No fever, chills, rigors, or overlying skin abrasions.',
    ],
    physicalExam: {
      inspection: 'Marked suprapatellar fullness obliterating peripatellar dimples; no erythema.',
      palpation: 'Warmth mild; positive Patellar Tap (ballottement); medial joint line tenderness.',
      specialTests: ['Positive Patellar Tap', 'Positive Bulge Sign', 'Full extension intact (0°)'],
      effusionGrade: 'Large Tense',
    },
    imagingAndLabs: [
      'Weight-bearing AP/lateral X-ray: Joint space narrowing, marginal osteophytes, no fracture.',
      'Afebrile (36.8°C), normal WBC.',
    ],
    synovialFluidExpected: '35 mL clear straw-colored fluid, high viscosity, WBC 850/mm³ (<25% PMNs), no crystals.',
    pathologyMode: 'oa_effusion',
    recommendedFlexionDeg: 0,
    recommendedPortal: 'superolateral',
    differentialDiagnosis: [
      'Osteoarthritis with reactive synovitis & effusion (Most likely)',
      'CPPD / Pseudogout flare (Confirm with synovial fluid microscopy)',
      'Septic arthritis (Always exclude visually and with fluid analysis if turbid)',
    ],
    decisionPrompt: {
      question: 'Which approach portal and immediate sequence provides the highest pooled accuracy and optimal therapeutic effect?',
      options: [
        {
          id: 'opt_a',
          label: 'Superolateral portal: aspirate effusion completely, then inject corticosteroid via hemostat syringe swap',
          isCorrect: true,
          rationale:
            'Correct! Per Neustadt (2006) and Douglas (2014), a large tense effusion is the strongest indication for prompt arthrocentesis via the Superolateral portal (91% pooled accuracy). Removing excess fluid prevents drug dilution and relieves intra-articular hydrostatic pressure.',
        },
        {
          id: 'opt_b',
          label: 'Anteromedial flexed portal: inject 40 mg steroid directly without aspirating',
          isCorrect: false,
          rationale:
            'Incorrect. Anterior flexed portals are difficult for aspirating large effusions, and injecting into an un-aspirated tense effusion dilutes the steroid and misses diagnostic fluid inspection.',
        },
        {
          id: 'opt_c',
          label: 'Immediate Hylan G-F 20 viscosupplementation without steroid',
          isCorrect: false,
          rationale:
            'Incorrect. Active inflammatory effusion should be aspirated and calmed with corticosteroid first; TeachIM & Neustadt note viscosupplements are indicated after failed CSI in non-effusive OA.',
        },
      ],
    },
    treatmentProtocol: {
      firstLineAndAdjuncts: [
        'Weight optimization, lateral heel/sole shoe wedge for medial OA (61% favorable response, Keating 1993), isometric quad exercises.',
      ],
      injectionPlan:
        'Aspirate to dryness (send sample if any turbidity), keep needle in situ with hemostat, swap syringe to inject 40 mg Triamcinolone hexacetonide (or acetonide/methylprednisolone) + 2–4 mL 1% lidocaine.',
      needleAndPrep: '18–20G 1.5" needle for aspiration + hemostat exchange; chlorhexidine >30s scrub; no-touch technique.',
      aftercare: [
        'Neustadt regimen: Strict relative rest for 24–72 hrs (minimal walking) to delay systemic steroid escape and prevent hypoxic reperfusion injury; cane/crutches for distance walking 2–3 weeks.',
        'Ice 10–15 min TID; observe 10–15 min post-injection.',
      ],
      contraindicationsChecked: ['No infection', 'No hardware', 'No upcoming TKR <3 months'],
    },
    pdfCitations: ['Neustadt 2006 (p. 897, 902, 904, 906)', 'Douglas 2014 (p. 3)', 'TeachIM Checklist'],
  },
  {
    id: 'case_dry_oa_flexion',
    title: 'Case 2: Dry Mild-Moderate Knee OA with Extension Limit',
    subtitle: 'Minimal Fluid · Flexion Contracture · Viscosupplementation / CSI',
    patientProfile: '58-year-old man · Carpenter · Right knee pain × 2 yrs, stiff at 15° flexion',
    chiefComplaint: 'Deep aching pain when climbing stairs and inability to fully straighten the knee.',
    history: [
      'Failed 12 weeks of PT and oral celecoxib; prior CSI gave 4 months of relief 6 months ago.',
      'Cannot tolerate lying flat with knee fully extended due to mild flexion contracture.',
      'No swelling or erythema; no avian allergies.',
    ],
    physicalExam: {
      inspection: 'No visible suprapatellar swelling; mild varus alignment.',
      palpation: 'Dry joint; negative Patellar Tap; medial & patellofemoral crepitus.',
      specialTests: ['Negative Bulge Sign', 'Passive extension lags at 15°', 'Pain on patellar compression'],
      effusionGrade: 'None / Trace',
    },
    imagingAndLabs: ['KL Grade II OA: Mild joint space narrowing, preserved cartilage compartment.'],
    pathologyMode: 'oa_effusion',
    recommendedFlexionDeg: 75,
    recommendedPortal: 'anterolateral',
    differentialDiagnosis: [
      'Dry mild-to-moderate knee OA with hamstring/capsular stiffness',
      'Degenerative meniscal fraying',
    ],
    decisionPrompt: {
      question: 'Which portal is best suited when the knee cannot be fully extended and there is minimal/no effusion?',
      options: [
        {
          id: 'opt_a',
          label: 'Anterolateral (Inferolateral) flexed approach (~75–90°), aimed ~45° toward the femoral notch',
          isCorrect: true,
          rationale:
            'Correct! Douglas (2014) and TeachIM specifically recommend the Anterolateral approach (71–85% accuracy; 100% in Waddell) when the knee cannot be extended and minimal fluid is present. Aiming upward avoids Hoffa’s fat pad.',
        },
        {
          id: 'opt_b',
          label: 'Lateral midpatellar approach with forced full extension',
          isCorrect: false,
          rationale:
            'Incorrect. Forcing extension tenses the quadriceps and narrows the lateral patellofemoral cleft; Wind & Smolinski showed <50% reliability for low-volume lateral joint-line injections.',
        },
        {
          id: 'opt_c',
          label: 'Direct trans-patellar-tendon injection (Cohn & Shapiro)',
          isCorrect: false,
          rationale:
            'Incorrect. Injecting through the patellar tendon risks tendon weakening, Hoffa’s fat pad pain, and ACL injury (Douglas 2014, Dalal 2015).',
        },
      ],
    },
    treatmentProtocol: {
      firstLineAndAdjuncts: [
        'Continue quadriceps/hamstring stretching and joint unloading; eligible for Hyaluronan series (e.g. Orthovisc/Hyalgan weekly × 3–5 or Euflexxa × 3) after CSI trial.',
      ],
      injectionPlan:
        'Anterolateral entry 1 cm lateral to patellar tendon, 1 cm above tibial plateau; direct needle upward/medially 45° toward intercondylar notch to clear Hoffa’s fat pad. Inject Hyaluronan 2 mL (or 40 mg Triamcinolone + 2 mL lidocaine).',
      needleAndPrep: '21–25G 1.5" needle; ethyl chloride spray or lidocaine wheal (especially important in dry knees!).',
      aftercare: ['Avoid high-impact kneeling/stairs for 48 hours; resume progressive PT.'],
      contraindicationsChecked: ['Check avian allergy before rooster-comb hyaluronans', 'Confirm no severe bone-on-bone KL IV'],
    },
    pdfCitations: ['Douglas 2014 (p. 3-4)', 'Neustadt 2006 (p. 904, 908-910)', 'TeachIM Checklist'],
  },
  {
    id: 'case_septic_arthritis',
    title: 'Case 3: Acute Hot, Erythematous Swollen Knee + Fever',
    subtitle: 'Red Flag GP Scenario · Rule Out Septic Arthritis First!',
    patientProfile: '67-year-old man · T2DM · Rapid onset severe knee pain × 24 hours · Temp 38.6°C',
    chiefComplaint: 'Cannot bear weight; excruciating pain even with slight micromotion of the bed.',
    history: [
      'Never had an acute inflammatory monoarthritis like this before (Dalal Slide 8 diagnostic indication).',
      'Had a minor skin laceration on the shin 1 week ago.',
      'Reports chills and malaise since last night.',
    ],
    physicalExam: {
      inspection: 'Markedly swollen, erythematous, shiny tight skin over knee.',
      palpation: 'Intense warmth, severe tenderness, large tense effusion; holds knee at 25° flexion (position of max capsular volume).',
      specialTests: ['Severe pain on 5° passive ROM', 'Positive Patellar Tap (too painful for deep compression)'],
      effusionGrade: 'Large Tense',
    },
    imagingAndLabs: [
      'Vitals: T 38.6°C, HR 104 bpm.',
      'Labs pending: ESR, CRP, Blood Cultures, CBC.',
    ],
    synovialFluidExpected: 'Turbulent/Purulent gray-yellow fluid, very low viscosity, WBC 82,000/mm³ (92% PMNs), Gram-positive cocci in clusters.',
    pathologyMode: 'septic',
    recommendedFlexionDeg: 15,
    recommendedPortal: 'superolateral',
    differentialDiagnosis: [
      'Acute Septic Arthritis (Staphylococcus aureus — Surgical Emergency)',
      'Acute Crystal Arthritis (Gout / CPPD Pseudogout — can mimic sepsis with fever!)',
    ],
    decisionPrompt: {
      question: 'You perform diagnostic arthrocentesis and aspirate cloudy, purulent-appearing fluid. What is the mandatory next step?',
      options: [
        {
          id: 'opt_a',
          label: 'DO NOT inject corticosteroid! Evacuate fluid, send stat Gram stain/culture/cell count/crystals, start IV antibiotics & urgent ortho consult',
          isCorrect: true,
          rationale:
            'Correct! Sepsis/infection is an ABSOLUTE contraindication to intra-articular corticosteroid (Dalal Slide 10, Neustadt p. 902, TeachIM). Even if crystals are suspected, steroids must never be instilled when fluid is purulent or infection is not excluded.',
        },
        {
          id: 'opt_b',
          label: 'Inject 40 mg methylprednisolone immediately to calm the suspected gout flare while awaiting culture',
          isCorrect: false,
          rationale:
            'DANGEROUS ERROR! Instilling corticosteroid into an infected joint suppresses local immunity and accelerates catastrophic cartilage destruction.',
        },
        {
          id: 'opt_c',
          label: 'Apply ice, prescribe oral NSAIDs, and ask patient to return in 3 days',
          isCorrect: false,
          rationale:
            'DANGEROUS ERROR! Untreated septic arthritis destroys articular cartilage within 24–48 hours and risks systemic sepsis.',
        },
      ],
    },
    treatmentProtocol: {
      firstLineAndAdjuncts: [
        'Immediate diagnostic arthrocentesis ("liquid biopsy of joint") before antibiotics if possible.',
        'Urgent hospital transfer for IV antibiotics and arthroscopic/open joint washout.',
      ],
      injectionPlan: 'CONTRAINDICATED: Zero steroid or hyaluronan injection.',
      needleAndPrep: '18G needle via Superolateral (or Anterolateral if locked in flexion) to maximize pus evacuation; avoid passing needle through any overlying cellulitis!',
      aftercare: ['Inpatient orthopedic drainage + culture-directed IV antibiotics.'],
      contraindicationsChecked: ['ABSOLUTE CONTRAINDICATION: Suspected septic arthritis / overlying cellulitis'],
    },
    pdfCitations: ['Dalal 2015 (Slide 7, 8, 10)', 'Neustadt 2006 (p. 901-902)', 'TeachIM Checklist'],
  },
  {
    id: 'case_cppd_pseudogout',
    title: 'Case 4: Acute Pseudogout (CPPD) in Underlying Knee OA',
    subtitle: 'Crystal Synovitis · Chondrocalcinosis · Aspiration + Steroid',
    patientProfile: '74-year-old woman · Known knee OA · Acute painful flare × 36 hours',
    chiefComplaint: 'Sudden flare of knee swelling and stiffness; afebrile, mild warmth.',
    history: [
      '70% of CPPD deposition cases occur alongside chronic OA-like arthritis of the knee (Neustadt p. 908).',
      'No systemic fever, no skin portal of entry, no recent trauma.',
    ],
    physicalExam: {
      inspection: 'Moderate-large effusion, mild warmth, no spreading cellulitis.',
      palpation: 'Diffuse synovial bogginess and joint line tenderness.',
      specialTests: ['Positive Patellar Tap', 'ROM limited 10°–95° due to effusion tension'],
      effusionGrade: 'Moderate',
    },
    imagingAndLabs: [
      'Knee X-ray: Classic linear radiopaque calcifications within the medial and lateral menisci (chondrocalcinosis).',
      'Polarized microscopy of aspirated fluid: Rhomboid-shaped, weakly positively birefringent crystals; Gram stain negative.',
    ],
    synovialFluidExpected: 'Cloudy yellow fluid, low viscosity, WBC 18,500/mm³, rhomboid weakly positively birefringent CPPD crystals.',
    pathologyMode: 'cppd',
    recommendedFlexionDeg: 0,
    recommendedPortal: 'superolateral',
    differentialDiagnosis: [
      'Acute CPPD Crystal Arthritis (Pseudogout)',
      'Osteoarthritis flare',
      'Septic arthritis (always send Gram stain & culture)',
    ],
    decisionPrompt: {
      question: 'Once Gram stain is negative and microscopy confirms CPPD rhomboid crystals, what is the targeted clinic management?',
      options: [
        {
          id: 'opt_a',
          label: 'Thoroughly aspirate the effusion and instill 1–2 mL (20–40 mg) intra-articular corticosteroid suspension',
          isCorrect: true,
          rationale:
            'Correct! Neustadt (p. 908) states arthrocentesis permits diagnostic confirmation (only a few drops needed) and thorough aspiration + 1–2 mL corticosteroid generally suppresses acute CPPD inflammation rapidly.',
        },
        {
          id: 'opt_b',
          label: 'Start weekly Hylan G-F 20 viscosupplementation today',
          isCorrect: false,
          rationale:
            'Incorrect. Viscosupplementation is contraindicated during acute crystal synovitis and can provoke severe inflammatory flare.',
        },
        {
          id: 'opt_c',
          label: 'Inject 10 mg triamcinolone directly into the meniscal calcification',
          isCorrect: false,
          rationale:
            'Incorrect. Never target the meniscus directly; deliver medication into the intra-articular synovial cavity via the suprapatellar pouch.',
        },
      ],
    },
    treatmentProtocol: {
      firstLineAndAdjuncts: ['Screen for secondary metabolic causes of CPPD (hyperparathyroidism, hemochromatosis, hypomagnesemia).'],
      injectionPlan: 'Superolateral arthrocentesis → confirm non-purulent + CPPD crystals → instill 20–40 mg Triamcinolone or Methylprednisolone + lidocaine.',
      needleAndPrep: '20G 1.5" needle; collect EDTA/heparin tube for crystal microscopy + sterile tube for Gram stain/culture.',
      aftercare: ['Relative rest 48–72 hrs, ice, colchicine/NSAID adjunct if no renal contraindication.'],
      contraindicationsChecked: ['Gram stain negative / no overlying skin infection'],
    },
    pdfCitations: ['Neustadt 2006 (p. 901, 908)'],
  },
  {
    id: 'case_anserine_bursitis',
    title: 'Case 5: Anteromedial Knee Pain Below the Joint Line',
    subtitle: 'Pes Anserine Bursitis ("Cavalryman’s Disease") vs. Medial OA',
    patientProfile: '61-year-old woman · BMI 35 kg/m² · Mild medial OA · Abrupt worsening medial pain',
    chiefComplaint: 'Sharp pain on the inner lower knee when climbing stairs or sleeping with knees together.',
    history: [
      'Known mild radiographic knee OA, but pain abruptly increased over 2 weeks.',
      'Previous intra-articular knee injection 4 months ago gave minimal relief for this specific lower medial pain.',
    ],
    physicalExam: {
      inspection: 'No suprapatellar swelling; mild localized fullness 3–4 cm below medial joint line.',
      palpation: 'Point tenderness strictly over anteromedial proximal tibia, medial to tibial tuberosity (insertion of sartorius, gracilis, semitendinosus).',
      specialTests: ['Negative Patellar Tap', 'Negative Bulge Sign', 'Pain reproduced by resisted knee flexion/internal rotation'],
      effusionGrade: 'None / Trace',
    },
    imagingAndLabs: ['X-ray shows mild medial joint space narrowing without acute fracture; effusion absent.'],
    pathologyMode: 'anserine_bursitis',
    recommendedFlexionDeg: 15,
    recommendedPortal: 'anserine_bursa',
    differentialDiagnosis: [
      'Pes Anserine Bursitis (Coexisting with OA in obese female with heavy thighs — Neustadt p. 907)',
      'Medial compartment OA progression',
      'MCL sprain or medial tibial stress fracture',
    ],
    decisionPrompt: {
      question: 'Where should you direct the needle for this patient’s focal tenderness?',
      options: [
        {
          id: 'opt_a',
          label: 'Extra-articular anteromedial approach medial to the tibial tuberosity into the pes anserine bursa (1–2 mL lidocaine + 1–1.5 mL steroid)',
          isCorrect: true,
          rationale:
            'Correct! Neustadt (p. 907, Fig 2) highlights that pes anserine bursitis mimics or coexists with knee OA and responds promptly to targeted extra-articular bursal injection (15–40 mg steroid + lidocaine).',
        },
        {
          id: 'opt_b',
          label: 'Superolateral intra-articular knee injection',
          isCorrect: false,
          rationale:
            'Incorrect. The pes anserine bursa does NOT communicate with the knee joint cavity; an intra-articular injection will miss the inflamed bursa.',
        },
        {
          id: 'opt_c',
          label: 'Inject directly into the substance of the semitendinosus tendon',
          isCorrect: false,
          rationale:
            'Incorrect. Never inject corticosteroid directly into a tendon; advance to bone deep to the conjoined tendon, withdraw 2 mm into the bursa, and inject without resistance.',
        },
      ],
    },
    treatmentProtocol: {
      firstLineAndAdjuncts: ['Hamstring stretching, pillow between knees at night, weight reduction, topical/oral NSAIDs.'],
      injectionPlan: 'Extra-articular Anserine Bursa injection: 1–2 mL 1% lidocaine + 1–1.5 mL (15–40 mg) corticosteroid suspension.',
      needleAndPrep: '20–22G 1.5" needle inserted anteromedially medial to tibial crest; withdraw 1–2 mm off periosteum.',
      aftercare: ['Avoid deep knee bends/stairs 48 hrs; ice 10–15 min TID; watch for subcutaneous skin atrophy.'],
      contraindicationsChecked: ['No cellulitis over medial tibia; rule out stress fracture if night pain severe'],
    },
    pdfCitations: ['Neustadt 2006 (p. 906-907, Fig 2)'],
  },
  {
    id: 'case_prepatellar_bursitis',
    title: 'Case 6: Anterior Fluctuant Swelling Over the Patella',
    subtitle: 'Prepatellar Bursitis ("Housemaid’s / Carpet Cutter’s Knee")',
    patientProfile: '46-year-old flooring installer · Kneels 6 hrs/day · Painless anterior bump × 3 weeks',
    chiefComplaint: 'Soft egg-sized swelling directly over the kneecap; only hurts when kneeling directly on it.',
    history: [
      'Repetitive kneeling trauma on hard surfaces.',
      'Afebrile, no puncture wound, normal walking gait without deep joint locking.',
    ],
    physicalExam: {
      inspection: 'Well-circumscribed superficial fluctuant swelling strictly anterior to the patella.',
      palpation: 'Minimal tenderness except on direct pressure; normal skin temperature.',
      specialTests: ['Full painless knee flexion/extension preserved', 'No intra-articular suprapatellar fullness'],
      effusionGrade: 'None / Trace',
    },
    imagingAndLabs: ['X-ray: Soft tissue swelling anterior to intact patella; normal joint space.'],
    synovialFluidExpected: '5 mL clear serous fluid, WBC < 500/mm³, negative Gram stain.',
    pathologyMode: 'prepatellar_bursitis',
    recommendedFlexionDeg: 0,
    recommendedPortal: 'prepatellar_bursa',
    differentialDiagnosis: [
      'Chronic aseptic Prepatellar Bursitis',
      'Septic Prepatellar Bursitis (must rule out via aspirate inspection/culture)',
      'Intra-articular knee effusion (differentiated by preserved ROM & superficial location)',
    ],
    decisionPrompt: {
      question: 'What is the proper procedural principle for treating chronic aseptic prepatellar bursitis?',
      options: [
        {
          id: 'opt_a',
          label: 'Superficial aspiration of the prepatellar bursa; if clear serous fluid, instill 1–2 mL lidocaine + 10–20 mg steroid and eliminate kneeling pressure',
          isCorrect: true,
          rationale:
            'Correct! Per Neustadt (p. 907), aspiration yields clear serous fluid, followed by low-dose steroid (10–20 mg) + lidocaine, plus eliminating the provoking kneeling trauma.',
        },
        {
          id: 'opt_b',
          label: 'Advance needle deep beneath the patella into the suprapatellar pouch',
          isCorrect: false,
          rationale:
            'Incorrect. The prepatellar bursa is superficial to the patella and separate from the joint space; entering the joint cavity risks seeding superficial bacteria into the knee.',
        },
        {
          id: 'opt_c',
          label: 'Inject 80 mg triamcinolone superficially without aspirating',
          isCorrect: false,
          rationale:
            'Incorrect. High-dose superficial steroid causes severe subcutaneous atrophy and depigmentation, and you must aspirate first to exclude septic bursitis.',
        },
      ],
    },
    treatmentProtocol: {
      firstLineAndAdjuncts: ['Protective gel knee pads, activity modification to stop direct kneeling pressure, compression wrap.'],
      injectionPlan: 'Superficial aspiration → confirm clear serous non-purulent fluid → instill 1–2 mL lidocaine + 10–20 mg corticosteroid; flush needle before withdrawal.',
      needleAndPrep: '18–20G needle parallel to anterior patella; strict aseptic no-touch prep.',
      aftercare: ['Elastic compressive dressing; avoid kneeling × 2 weeks; monitor for recurrent swelling or redness.'],
      contraindicationsChecked: ['Exclude septic bursitis before injecting steroid'],
    },
    pdfCitations: ['Neustadt 2006 (p. 907)'],
  },
  {
    id: 'case_anticoag_diabetes',
    title: 'Case 7: Warfarin Anticoagulation + Type 2 Diabetes',
    subtitle: 'GP Risk Stratification · Relative Contraindications & Counseling',
    patientProfile: '71-year-old man · AFib on Warfarin (INR 2.4) · T2DM (HbA1c 8.9%) · Moderate OA effusion',
    chiefComplaint: 'Painful swollen left knee interfering with sleep; wants steroid injection today.',
    history: [
      'INR checked 2 days ago: 2.4 (therapeutic range 2.0–3.0).',
      'Fasting blood glucose averages 175 mg/dL on metformin and basal insulin.',
      'No bleeding history, no infection.',
    ],
    physicalExam: {
      inspection: 'Moderate suprapatellar effusion, no ecchymosis.',
      palpation: 'Positive bulge sign, mild medial joint line tenderness.',
      specialTests: ['Full extension preserved', 'No warmth or fever'],
      effusionGrade: 'Moderate',
    },
    imagingAndLabs: ['INR 2.4', 'HbA1c 8.9% (suboptimally controlled, not DKA/brittle)'],
    pathologyMode: 'oa_effusion',
    recommendedFlexionDeg: 0,
    recommendedPortal: 'superolateral',
    differentialDiagnosis: ['Symptomatic OA effusion in patient with multiple comorbidities'],
    decisionPrompt: {
      question: 'Based on clinical evidence (Thumboo 1998, Ahmed 2012, Wang 2006), how should you manage Warfarin (INR 2.4) and T2DM?',
      options: [
        {
          id: 'opt_a',
          label: 'Proceed using Superolateral portal with a finer needle (21–22G) & firm hemostasis; counsel patient that blood glucose may rise for up to 5 days',
          isCorrect: true,
          rationale:
            'Correct! Dalal (Slide 10, citing Ahmed 2012) and Neustadt (citing Thumboo 1998) confirm joint aspiration/injection is safe at therapeutic INR without stopping warfarin. Wang (2006) showed steroid-induced hyperglycemia persists up to 5 days in diabetics, requiring monitoring.',
        },
        {
          id: 'opt_b',
          label: 'Hold Warfarin for 5 days without bridging before attempting any knee injection',
          isCorrect: false,
          rationale:
            'Incorrect. Stopping anticoagulation unnecessarily increases thromboembolic stroke risk in AFib; therapeutic INR is safe for knee injection.',
        },
        {
          id: 'opt_c',
          label: 'Reassure patient that local knee steroids stay purely in the joint and never affect blood sugar',
          isCorrect: false,
          rationale:
            'Incorrect. Systemic absorption occurs (Armstrong 1981 showed cortisol suppression up to 7 days) and hyperglycemia persists up to 5 days in diabetics (Wang 2006).',
        },
      ],
    },
    treatmentProtocol: {
      firstLineAndAdjuncts: ['Coordinate glucose monitoring plan for days 1–5; check prothrombin time/INR is therapeutic (<3.0).'],
      injectionPlan: 'Superolateral aspiration + 20–40 mg Triamcinolone hexacetonide (least soluble → minimal systemic spillover!) + 2 mL lidocaine.',
      needleAndPrep: '21–22G 1.5" needle (minimize tissue trauma), apply firm direct pressure with 2×2 gauze for hemostasis.',
      aftercare: [
        'Strict 72-hr rest to delay systemic steroid absorption (Neustadt p. 906).',
        'Check fingerstick glucose 2–4× daily for 5 days.',
      ],
      contraindicationsChecked: ['Confirm INR therapeutic (2.4)', 'Exclude brittle/uncontrolled DKA state'],
    },
    pdfCitations: ['Dalal 2015 (Slide 10, 22)', 'Neustadt 2006 (p. 901, 902, 906)'],
  },
  {
    id: 'case_severe_bone_on_bone',
    title: 'Case 8: Severe "Bone-on-Bone" OA (KL IV) & Frequent Injections',
    subtitle: 'When NOT to Inject · Viscosupplement Failure & Pre-TKR Window',
    patientProfile: '76-year-old man · Severe bilateral knee OA · Had 3 steroid shots in past 9 months',
    chiefComplaint: 'Last steroid shot wore off after 2 weeks; requests another steroid shot or Synvisc today.',
    history: [
      'Already received 3 intra-articular corticosteroid injections in this knee in the past 9 months (most recent 5 weeks ago).',
      'Scheduled for Total Knee Replacement (TKR) evaluation with orthopedics in 8 weeks.',
    ],
    physicalExam: {
      inspection: 'Marked varus deformity, bony enlargement, quadriceps wasting.',
      palpation: 'Dry joint, gross bone-on-bone crepitus, fixed 15° flexion deformity.',
      specialTests: ['Medial-lateral instability on stress testing', 'Severe pain on weight-bearing'],
      effusionGrade: 'None / Trace',
    },
    imagingAndLabs: ['X-ray (KL Grade IV): Complete loss of medial joint space ("bone-on-bone"), large osteophytes, subchondral cysts.'],
    pathologyMode: 'oa_severe',
    recommendedFlexionDeg: 30,
    recommendedPortal: 'anterolateral',
    differentialDiagnosis: ['End-stage Kellgren-Lawrence Grade IV Osteoarthritis'],
    decisionPrompt: {
      question: 'What is the most appropriate evidence-based decision for this patient today?',
      options: [
        {
          id: 'opt_a',
          label: 'Decline steroid & viscosupplement injection; counsel on surgical <3-month window, max 3 injections/yr limit, and low efficacy of hyaluronan in bone-on-bone OA',
          isCorrect: true,
          rationale:
            'Correct! Multiple contraindications apply: (1) Potential TKR <3 months (TeachIM), (2) >3 steroid injections in 1 yr & <8–12 wks since last shot (Dalal/Neustadt), (3) Prior inadequate response <1 mo (TeachIM), and (4) Bone-on-bone OA rarely responds to hyaluronan (Neustadt p. 910).',
        },
        {
          id: 'opt_b',
          label: 'Give a high-dose 80 mg Depo-Medrol injection today to bridge the 8 weeks until TKR',
          isCorrect: false,
          rationale:
            'Incorrect. Injecting steroid <3 months prior to knee replacement increases prosthetic infection risk and exceeds the 2–3 injections/year limit.',
        },
        {
          id: 'opt_c',
          label: 'Start a 5-week course of Sodium Hyaluronate (Supartz)',
          isCorrect: false,
          rationale:
            'Incorrect. Neustadt (p. 910) explicitly notes patients with complete loss of joint space ("bone-on-bone") are unlikely to show significant benefit from hyaluronan.',
        },
      ],
    },
    treatmentProtocol: {
      firstLineAndAdjuncts: ['Walking aids (cane/walker) to deload joint, multimodal oral/topical analgesics, pre-hab isometric quad conditioning.'],
      injectionPlan: 'Defer injection; proceed with orthopedic Total Knee Replacement (TKR) pathway.',
      needleAndPrep: 'N/A — Procedural deferral.',
      aftercare: ['Expedite orthopedic surgical clearance.'],
      contraindicationsChecked: ['Potential surgery <3 months', '>3 injections/year', 'Prior <1 mo CSI benefit', 'Severe KL IV instability'],
    },
    pdfCitations: ['Neustadt 2006 (p. 901, 902, 906, 910)', 'TeachIM Checklist', 'Dalal 2015 (Slide 10, 22)'],
  },
  {
    id: 'case_post_injection_flare',
    title: 'Case 9: Acute Painful Swelling 18 Hours Post-Injection',
    subtitle: 'Post-Injection Flare vs. Hylan SAIR vs. Iatrogenic Septic Arthritis',
    patientProfile: '62-year-old woman · Received cross-linked Hylan G-F 20 (or Triamcinolone) yesterday',
    chiefComplaint: 'Sudden throbbing pain and swelling starting 12 hours after knee injection.',
    history: [
      'Afebrile (37.1°C) vs low-grade subjective warmth.',
      'Received either Triamcinolone acetonide OR second dose of Hylan G-F 20 yesterday.',
    ],
    physicalExam: {
      inspection: 'Moderate recurrent effusion, localized mild erythema/warmth at puncture site.',
      palpation: 'Painful joint distension; able to flex gently 0–80°.',
      specialTests: ['Moderate effusion, no systemic rigors or purulent skin track'],
      effusionGrade: 'Moderate',
    },
    imagingAndLabs: [
      'If Hylan G-F 20: Pseudoseptic SAIR occurs in 2–8% (usually after 2nd/3rd dose), negative culture.',
      'If Steroid: Crystal-induced post-injection synovitis flare occurs in 2–5%, peaks <24 hrs and resolves in 48–72 hrs.',
    ],
    synovialFluidExpected: 'If aspirated: cloudy inflammatory fluid (WBC 10,000–30,000) with NEGATIVE Gram stain and culture (rules out 0.072% septic arthritis).',
    pathologyMode: 'oa_effusion',
    recommendedFlexionDeg: 0,
    recommendedPortal: 'superolateral',
    differentialDiagnosis: [
      'Steroid Ester Crystal Post-Injection Flare (2–5%, subsides in 48–72 hrs)',
      'Severe Acute Inflammatory Reaction / SAIR from cross-linked Hylan G-F 20 (2–8%)',
      'Iatrogenic Septic Arthritis (0.072% — rare, typically presents >48 hrs, but MUST be excluded if tense/febrile)',
    ],
    decisionPrompt: {
      question: 'How do you distinguish and manage an acute post-injection reaction at 18 hours?',
      options: [
        {
          id: 'opt_a',
          label: 'Assess fever/rigors; for mild steroid flare use ice + oral analgesics (resolves 48–72h). If tense/severe or post-Hylan SAIR, aspirate to rule out sepsis before symptom control',
          isCorrect: true,
          rationale:
            'Correct! Neustadt (p. 903, 909) notes mild steroid flares resolve within 48–72 hrs with ice and oral analgesics, whereas severe post-injection synovitis or Hylan SAIR (2–8%) requires aspiration for Gram stain/culture to exclude infection.',
        },
        {
          id: 'opt_b',
          label: 'Immediately inject a double dose of steroid without aspirating',
          isCorrect: false,
          rationale:
            'Incorrect. Never inject more steroid into an acutely inflamed post-injection joint before ruling out iatrogenic infection.',
        },
        {
          id: 'opt_c',
          label: 'Switch from natural Hyalgan to cross-linked Hylan G-F 20 to avoid SAIR',
          isCorrect: false,
          rationale:
            'Incorrect. SAIRs occur specifically with cross-linked Hylan G-F 20 (2–8%) and have NOT been reported with natural hyaluronans (Neustadt p. 909).',
        },
      ],
    },
    treatmentProtocol: {
      firstLineAndAdjuncts: ['Strict rest, ice pack 10–15 min TID, acetaminophen/NSAIDs; discontinue cross-linked hylan if SAIR confirmed.'],
      injectionPlan: 'Aspiration for diagnosis & decompression if severe; switch future viscosupplementation to natural/non-cross-linked hyaluronan.',
      needleAndPrep: '20G 1.5" Superolateral aspiration if tense/suspicious for sepsis.',
      aftercare: ['48-hr follow-up safety net: return immediately if fever >38°C, worsening redness, or pain beyond 72 hrs.'],
      contraindicationsChecked: ['Exclude septic arthritis before any repeat injection'],
    },
    pdfCitations: ['Neustadt 2006 (p. 903, 909)', 'Dalal 2015 (Slide 22)'],
  },
];

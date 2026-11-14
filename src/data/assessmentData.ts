import { OsceStep, QuizQuestion } from '../types/clinical';

export const OSCE_STEPS: OsceStep[] = [
  {
    id: 'osce_1_indication',
    stepNumber: 1,
    title: 'Confirm Clinical Indication',
    phase: 'Pre-Procedure',
    checklistDetail:
      'Verify knee osteoarthritis with insufficient response to PT & NSAIDs, or aseptic inflammatory arthritis / diagnostic effusion evaluation. Confirm viscosupplements are used only for OA after failed CSI.',
    criticalSafetyCheck: 'Ensure diagnostic aspiration is prioritized for any unexplained acute monoarthritis.',
    commonError: 'Offering viscosupplementation to severe KL IV bone-on-bone OA or acute inflammatory effusion.',
    verificationPrompt: {
      question: 'According to the TeachIM Procedure Checklist, when is intra-articular viscosupplementation indicated?',
      options: [
        'As first-line treatment before trying physical therapy or NSAIDs',
        'Only for OA and after a failed response to corticosteroid injection (CSI)',
        'For acute septic arthritis to lubricate the joint',
      ],
      correctIndex: 1,
      explanation: 'Viscosupplements are indicated only for knee OA and only after insufficient response to basic measures and CSI.',
    },
  },
  {
    id: 'osce_2_contraindications',
    stepNumber: 2,
    title: 'Screen Contraindications',
    phase: 'Pre-Procedure',
    checklistDetail:
      'Rule out joint hardware/arthroplasty, overlying skin/joint infection, planned knee surgery within <3 months, prior inadequate response (<1 mo) to CSI, fracture, and uncontrolled diabetes/bleeding.',
    criticalSafetyCheck: 'Overlying cellulitis or prosthetic joint hardware is an absolute contraindication.',
    commonError: 'Injecting a knee scheduled for Total Knee Arthroplasty in 6 weeks.',
    verificationPrompt: {
      question: 'Within how many months of planned knee replacement surgery is an intra-articular steroid injection contraindicated?',
      options: ['< 1 month', '< 3 months', '< 12 months'],
      correctIndex: 1,
      explanation: 'Potential knee surgery in < 3 months is an explicit contraindication due to increased periprosthetic infection risk.',
    },
  },
  {
    id: 'osce_3_consent',
    stepNumber: 3,
    title: 'Obtain Informed Consent',
    phase: 'Pre-Procedure',
    checklistDetail:
      'Explain in simple terms: (1) Procedural process, (2) Risks & mitigation (infection 0.072%, flare 2–5%, skin atrophy 2.4%, hyperglycemia up to 5 days), (3) Potential benefits, (4) Alternatives & risks of not performing.',
    criticalSafetyCheck: 'Verify patient understanding and check name/expiration dates.',
    commonError: 'Omitting post-injection hyperglycemia counseling in diabetic patients.',
    verificationPrompt: {
      question: 'How long can transient hyperglycemia persist in a diabetic patient after a steroid injection?',
      options: ['Up to 6 hours', 'Up to 5 days', 'Up to 6 weeks'],
      correctIndex: 1,
      explanation: 'Wang et al. (2006) in Dalal & Lemenchick showed hyperglycemia persists up to 5 days in diabetic patients.',
    },
  },
  {
    id: 'osce_4_supplies',
    stepNumber: 4,
    title: 'Organize Supplies & Draw-Up Solutions',
    phase: 'Preparation & Landmarks',
    checklistDetail:
      'Gather skin marker, alcohol swabs, 1% lidocaine (5cc), Triamcinolone or Methylprednisolone 40 mg/mL (1cc), 5–10cc syringe, 18–21G drawing needle, 21–25G 1.5" injecting needle, chlorhexidine/povidone-iodine, 2×2 gauze, band-aid. Clean vials and draw ~2–4cc lidocaine + 1cc steroid.',
    criticalSafetyCheck: 'Use separate large-bore needle (18–21G) to draw up; switch to clean needle for injection.',
    commonError: 'Using a 25G needle to aspirate a thick effusion (use 18–20G for aspiration).',
    verificationPrompt: {
      question: 'Which needle gauge is recommended when aspirating synovial fluid vs. performing a routine dry injection?',
      options: [
        '18–20G for aspiration; 21–25G 1.5" for injection',
        '27G insulin needle for both aspiration and injection',
        '14G angiocath for all knee procedures',
      ],
      correctIndex: 0,
      explanation: 'Use 18–20G to aspirate viscous/particulate synovial fluid, and 21–25G 1.5" for injection.',
    },
  },
  {
    id: 'osce_5_positioning',
    stepNumber: 5,
    title: 'Position Patient Properly',
    phase: 'Preparation & Landmarks',
    checklistDetail:
      'Superolateral/Midpatellar: Supine, knee fully extended (or slightly hyperextended), quadriceps relaxed, patella mobile. Anterior (medial/lateral): Sitting upright with foreleg dangling at ~90° flexion.',
    criticalSafetyCheck: 'Confirm quadriceps relaxation by gently rocking the patella side-to-side.',
    commonError: 'Attempting Superolateral/Midpatellar entry while patient contracts thigh extensors.',
    verificationPrompt: {
      question: 'Why must the quadriceps remain completely relaxed during the Superolateral or Midpatellar approach?',
      options: [
        'To increase intra-articular hydrostatic pressure',
        'To keep the patella mobile and prevent narrowing of the patellofemoral space',
        'To expose the pes anserine bursa',
      ],
      correctIndex: 1,
      explanation: 'Quadriceps contraction pulls the patella tightly against the femoral trochlea, blocking needle entry.',
    },
  },
  {
    id: 'osce_6_landmarks',
    stepNumber: 6,
    title: 'Identify & Mark Entry Site',
    phase: 'Preparation & Landmarks',
    checklistDetail:
      'Superolateral: Draw straight lines along superior & lateral patellar margins; mark bisection point. Anterior: Mark inferomedial/lateral patella, patellar tendon, and tibial plateau; mark 1 cm superior to plateau & 1 cm medial/lateral to tendon. Press retracted ballpoint pen tip to indent site.',
    criticalSafetyCheck: 'Instruct patient NOT to move the limb once landmarks are marked.',
    commonError: 'Injecting without marking bony borders, resulting in Hoffa’s fat pad entry.',
    verificationPrompt: {
      question: 'For the Anterolateral portal, where is the entry point relative to the patellar tendon and tibial plateau?',
      options: [
        '1 cm superior to the tibial plateau and 1 cm lateral to the patellar tendon',
        'Directly through the center of the patellar tendon',
        '3 cm inferior to the tibial tuberosity',
      ],
      correctIndex: 0,
      explanation: 'The anterior arthroscopic soft spot is ~1 cm superior to the tibial plateau and ~1 cm lateral/medial to the patellar tendon.',
    },
  },
  {
    id: 'osce_7_timeout',
    stepNumber: 7,
    title: 'Perform Pre-Procedure Timeout',
    phase: 'Aseptic Technique & Injection',
    checklistDetail:
      'Verbally confirm patient name, date of birth (DOB), exact procedure, anatomical location & laterality (Left vs. Right knee), and drug/latex/iodine allergies.',
    criticalSafetyCheck: 'Never skip laterality confirmation.',
    commonError: 'Proceeding directly to prep without confirming side/allergies.',
    verificationPrompt: {
      question: 'What five elements are verified in the pre-procedure Timeout?',
      options: [
        'Name, DOB, procedure, location/laterality, and allergies',
        'Insurance ID, BMI, HbA1c, INR, and shoe size',
        'Vial lot number only',
      ],
      correctIndex: 0,
      explanation: 'TeachIM Checklist specifies confirming Name, DOB, Procedure, Location, and Allergies.',
    },
  },
  {
    id: 'osce_8_prep',
    stepNumber: 8,
    title: 'Sterile Skin Prep & Local Anesthesia',
    phase: 'Aseptic Technique & Injection',
    checklistDetail:
      'Scrub with chlorhexidine using friction for >30 seconds (or povidone-iodine and allow full drying). Maintain sterile site with "no-touch" technique. Optional: ethyl chloride spray 5–10s until skin blanches, or lidocaine wheal.',
    criticalSafetyCheck: 'Do NOT touch the prepped insertion point again with unsterile fingers after antiseptic prep.',
    commonError: 'Injecting through wet povidone-iodine before it dries (reduces bactericidal efficacy).',
    verificationPrompt: {
      question: 'What does the "no-touch" technique require after antiseptic skin preparation?',
      options: [
        'Re-palpating the exact insertion point with a bare finger to double check',
        'Not touching the prepped insertion site at all; rely on prior pen indentation/landmarks',
        'Applying lidocaine ointment after needle withdrawal',
      ],
      correctIndex: 1,
      explanation: 'Once prepped, never re-palpate the marked entry site; the prior retracted-pen indentation guides insertion safely.',
    },
  },
  {
    id: 'osce_9_insertion',
    stepNumber: 9,
    title: 'Needle Insertion & Trajectory',
    phase: 'Aseptic Technique & Injection',
    checklistDetail:
      'Stretch skin taut and insert briskly through skin to depth of 2–4 cm. Superolateral: advance under patella parallel to floor, perpendicular to femur. Anterior: advance parallel to floor directed ~45° toward center of joint/femoral notch.',
    criticalSafetyCheck: 'If bone or cartilage is touched, withdraw 2–3 mm before aspirating or injecting.',
    commonError: 'Inserting too shallowly or flat against tibial plateau, entering Hoffa’s fat pad or meniscus.',
    verificationPrompt: {
      question: 'What is the expected insertion depth for an adult intra-articular knee injection?',
      options: ['0.2–0.5 cm', '2.0–4.0 cm', '8.0–10.0 cm'],
      correctIndex: 1,
      explanation: 'The TeachIM checklist specifies advancing briskly to a depth of 2–4 cm into the joint space.',
    },
  },
  {
    id: 'osce_10_aspirate_inject',
    stepNumber: 10,
    title: 'Aspirate First, Then Inject Smoothly',
    phase: 'Aseptic Technique & Injection',
    checklistDetail:
      'Always attempt aspiration prior to injection (to remove effusion, inspect fluid, and avoid intravascular administration). If aspirating then injecting, grasp needle hub firmly (hemostat clamp), twist off aspiration syringe, attach medication syringe. Never inject against resistance.',
    criticalSafetyCheck: 'Stop immediately if fluid appears purulent/turbid — send for culture and DO NOT inject steroid.',
    commonError: 'Forcing plunger against high resistance (indicates tendon, fat pad, or cartilage placement).',
    verificationPrompt: {
      question: 'Why should you ALWAYS aspirate prior to pushing corticosteroid into the knee?',
      options: [
        'To confirm absence of blood (intravascular placement) and remove/inspect any synovial effusion',
        'To warm up the syringe plunger',
        'To create negative pressure for tendon absorption',
      ],
      correctIndex: 0,
      explanation: 'Pre-injection aspiration detects intravascular needle placement, drains diluting effusion, and screens for septic fluid.',
    },
  },
  {
    id: 'osce_11_extraction',
    stepNumber: 11,
    title: 'Needle Extraction, Hemostasis & Aftercare',
    phase: 'Post-Procedure',
    checklistDetail:
      'Optionally flush needle track with a trace of lidocaine/saline to prevent skin atrophy, withdraw briskly, apply direct pressure with 2×2 gauze until hemostasis, apply band-aid. Observe 10–15 min; provide rest/ice/flare instructions.',
    criticalSafetyCheck: 'Give explicit red-flag return precautions (fever, worsening swelling/pain >48–72 hrs).',
    commonError: 'Allowing steroid suspension to track back to dermis (causes fat atrophy/depigmentation).',
    verificationPrompt: {
      question: 'How can you minimize localized subcutaneous atrophy and skin depigmentation upon needle withdrawal?',
      options: [
        'Leave a small depot of steroid just under the skin',
        'Flush the needle with a small amount of 1% lidocaine or normal saline before removing it',
        'Use a 14G needle',
      ],
      correctIndex: 1,
      explanation: 'Neustadt (p. 903) advises flushing the needle with 1% lidocaine or saline before withdrawal to avoid steroid leakage along the track.',
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1_pooled_accuracy',
    topic: 'Anatomy & Portals',
    difficulty: 'Core',
    question:
      'According to the systematic review by Hermans et al. cited in Douglas (2014), which intra-articular knee approach portal achieves the highest pooled anatomical accuracy?',
    options: [
      'Medial midpatellar (56%)',
      'Superolateral (91%)',
      'Seated Anteromedial (55%)',
      'Trans-patellar tendon (Cohn & Shapiro)',
    ],
    correctIndex: 1,
    rationale:
      'Hermans et al. found the Superolateral approach achieves the highest pooled anatomical accuracy at 91% (95% CI 84–99%), targeting the capacious suprapatellar pouch.',
    sourceRef: 'Douglas 2014, Table 1 & p. 3',
  },
  {
    id: 'q2_ectopic_site',
    topic: 'Anatomy & Portals',
    difficulty: 'Core',
    question:
      'What is the most common ectopic site for missed intra-articular knee injections, characterized by sharp pain during injection?',
    options: [
      'Suprapatellar pouch',
      "Hoffa's infrapatellar fat pad",
      'Pes anserine bursa',
      'Popliteal fossa',
    ],
    correctIndex: 1,
    rationale:
      "Douglas (2014) notes clinical experience and cadaver data show Hoffa's fat pad is the most common ectopic injection site and causes significantly more procedural pain.",
    sourceRef: 'Douglas 2014, p. 4',
  },
  {
    id: 'q3_us_accuracy',
    topic: 'Anatomy & Portals',
    difficulty: 'Intermediate',
    question:
      'According to Berkoff et al. (cited in Douglas 2014), how does ultrasound guidance improve intra-articular knee injection accuracy compared with anatomical landmark guidance?',
    options: [
      'Improves from 56% to 71%',
      'Improves from 77.8% to 95.8% (OR 6.4)',
      'No statistically significant difference',
      'Only improves accuracy in the ankle joint',
    ],
    correctIndex: 1,
    rationale:
      'Berkoff et al. demonstrated ultrasound guidance improves accuracy from 77.8% (anatomical) to 95.8% (p < 0.001, OR 6.4), reaching up to 100% for the superolateral approach (Park et al.).',
    sourceRef: 'Douglas 2014, p. 4',
  },
  {
    id: 'q4_least_soluble_steroid',
    topic: 'Pharmacology & Dosing',
    difficulty: 'Core',
    question:
      'Which injectable corticosteroid preparation is the LEAST water-soluble (2.5× less soluble), providing the longest duration of intra-articular effect and minimal systemic spillover?',
    options: [
      'Dexamethasone sodium phosphate',
      'Betamethasone sodium phosphate',
      'Triamcinolone hexacetonide (Aristospan)',
      'Methylprednisolone acetate (Depo-Medrol)',
    ],
    correctIndex: 2,
    rationale:
      'Neustadt (2006) highlights that Triamcinolone hexacetonide (Aristospan) is 2.5× less water-soluble than other preparations, providing the longest duration and lowest systemic spillover.',
    sourceRef: 'Neustadt 2006, p. 901, 903, 906',
  },
  {
    id: 'q5_sair_hyaluronan',
    topic: 'Pharmacology & Dosing',
    difficulty: 'Intermediate',
    question:
      'A patient develops a Severe Acute Inflammatory Reaction (SAIR / pseudoseptic reaction) after their second viscosupplementation injection. Which preparation is specifically associated with a 2–8% rate of SAIR?',
    options: [
      'Sodium hyaluronate (Hyalgan)',
      'High-molecular-weight natural hyaluronan (Orthovisc)',
      'Chemically cross-linked Hylan G-F 20 (Synvisc)',
      'Bacterial-fermented non-animal hyaluronan (Euflexxa)',
    ],
    correctIndex: 2,
    rationale:
      'SAIR occurs in 2–8% of patients receiving chemically cross-linked Hylan G-F 20 (cross-linked with formaldehyde and vinylsulfone) and has NOT been reported with natural hyaluronans.',
    sourceRef: 'Neustadt 2006, p. 909',
  },
  {
    id: 'q6_avian_allergy',
    topic: 'Pharmacology & Dosing',
    difficulty: 'Core',
    question:
      'Which viscosupplement should be selected for a knee OA patient with a severe allergy to avian/poultry products?',
    options: [
      'Hyalgan (rooster comb extract)',
      'Synvisc (rooster comb extract)',
      'Euflexxa (bacterial fermentation non-animal source)',
      'Supartz (rooster comb extract)',
    ],
    correctIndex: 2,
    rationale:
      'Hyalgan, Supartz, Orthovisc, and Synvisc are extracted from rooster combs, whereas Euflexxa is produced via bacterial fermentation and is safe in avian-allergic patients.',
    sourceRef: 'Neustadt 2006, p. 908-909',
  },
  {
    id: 'q7_anserine_bursa',
    topic: 'GP Clinical Cases',
    difficulty: 'Intermediate',
    question:
      'An obese 62-year-old woman with knee OA complains of abrupt worsening pain and focal tenderness 3 cm below the anteromedial joint line, medial to the tibial tuberosity. What is the diagnosis and target?',
    options: [
      'Prepatellar bursitis — superficial anterior patellar pocket',
      'Pes Anserine bursitis — extra-articular bursa deep to conjoined tendon (sartorius/gracilis/semitendinosus)',
      'Septic arthritis — urgent IV antibiotics',
      'Lateral meniscal cyst — lateral joint line',
    ],
    correctIndex: 1,
    rationale:
      'Pes anserine bursitis ("cavalryman’s disease") classically presents in obese women with OA as localized anteromedial tenderness below the joint line, treated with extra-articular bursal injection.',
    sourceRef: 'Neustadt 2006, p. 907, Fig 2',
  },
  {
    id: 'q8_anticoagulation',
    topic: 'GP Clinical Cases',
    difficulty: 'Intermediate',
    question:
      'A patient taking warfarin for atrial fibrillation presents with a painful knee effusion and an INR of 2.5. What does the evidence (Thumboo 1998; Ahmed 2012) support?',
    options: [
      'Knee arthrocentesis and injection are safe at a therapeutic INR without stopping warfarin',
      'Warfarin is an absolute contraindication; bridge with LMWH for 7 days',
      'Only perform the procedure if INR is < 1.1',
      'Use an 14G needle to finish faster',
    ],
    correctIndex: 0,
    rationale:
      'Both Neustadt (citing Thumboo 1998) and Dalal & Lemenchick (citing Ahmed 2012) note that therapeutic INR is safe for joint aspiration/injection with careful technique and post-procedure compression.',
    sourceRef: 'Dalal & Lemenchick 2015, Slide 10; Neustadt 2006, p. 902',
  },
  {
    id: 'q9_septic_aspirate',
    topic: 'GP Clinical Cases',
    difficulty: 'Core',
    question:
      'During superolateral knee arthrocentesis, you aspirate 30 mL of opaque, gray-yellow purulent fluid. What should you do next?',
    options: [
      'Leave the needle in and inject 40 mg triamcinolone to suppress inflammation',
      'Do NOT inject steroid; send fluid stat for Gram stain, culture, cell count, and arrange urgent antibiotics/washout',
      'Inject 2 mL lidocaine only and discharge home',
      'Re-inject the fluid to preserve joint lubrication',
    ],
    correctIndex: 1,
    rationale:
      'Purulent synovial fluid strongly indicates septic arthritis, an ABSOLUTE contraindication to intra-articular corticosteroid injection.',
    sourceRef: 'Neustadt 2006, p. 901-902; Dalal 2015, Slide 10',
  },
  {
    id: 'q10_bone_on_bone',
    topic: 'GP Clinical Cases',
    difficulty: 'Intermediate',
    question:
      'Which group of knee OA patients is LEAST likely to achieve significant pain relief from intra-articular hyaluronan (viscosupplementation)?',
    options: [
      'Mild-to-moderate KL Grade II OA with preserved joint space',
      'Patients with advanced KL Grade IV "bone-on-bone" complete loss of joint space',
      'Patients who cannot take oral NSAIDs due to GI ulcer risk',
      'Patients with mild patellofemoral OA',
    ],
    correctIndex: 1,
    rationale:
      'Neustadt (p. 910) emphasizes that patients with advanced OA and severe or complete loss of joint space ("bone-on-bone") are unlikely to benefit significantly from hyaluronans.',
    sourceRef: 'Neustadt 2006, p. 910',
  },
  {
    id: 'q11_complications_rate',
    topic: 'Safety & Complications',
    difficulty: 'Core',
    question:
      'In the meta-analysis summarized by Dalal & Lemenchick (2015), what is the overall complication rate of joint/soft-tissue injections and the estimated incidence of iatrogenic infection?',
    options: [
      '25% overall; 1 in 100 infection rate',
      '5.5% overall (most commonly skin atrophy 2.4%); 0.072% infection rate (18 / 250,000)',
      '0.1% overall; 5% infection rate',
      '15% overall; 1 in 50 infection rate',
    ],
    correctIndex: 1,
    rationale:
      'Meta-analysis across 25+ studies showed a 5.5% overall complication rate (skin atrophy 2.4%, depigmentation 0.8%, erythema 0.7%, flushing 0.6%) and an extremely low infection rate of 0.072% (18/250,000).',
    sourceRef: 'Dalal & Lemenchick 2015, Slide 22',
  },
  {
    id: 'q12_injection_frequency',
    topic: 'Safety & Complications',
    difficulty: 'Core',
    question:
      'What is the recommended minimum interval between intra-articular corticosteroid injections in a weight-bearing joint like the knee, and typical annual limit?',
    options: [
      'Every 2 weeks, up to 12 per year',
      'Wait at least 8–12 weeks; rarely more than 2–3 injections per year',
      'Wait 6 months; strictly 1 per lifetime',
      'Wait 48 hours; unlimited as long as pain returns',
    ],
    correctIndex: 1,
    rationale:
      'Neustadt recommends waiting at least 8–12 weeks for weight-bearing joints and rarely exceeding 2–3 injections per year (consistent with Dalal Slide 10: >3/yr is a relative contraindication).',
    sourceRef: 'Neustadt 2006, p. 906; Dalal 2015, Slide 10',
  },
  {
    id: 'q13_post_injection_rest',
    topic: 'Safety & Complications',
    difficulty: 'Intermediate',
    question:
      'Why does Neustadt recommend strict relative rest for 3 days (and crutches/cane for 2–3 weeks) after a knee corticosteroid injection?',
    options: [
      'To encourage bone-on-bone fusion',
      'To delay systemic steroid absorption, prevent hypoxic reperfusion oxidative damage, and avoid overworking the anesthetized joint',
      'Because lidocaine causes permanent paralysis for 72 hours',
      'To keep the band-aid dry for 3 weeks',
    ],
    correctIndex: 1,
    rationale:
      'Exercise raises intra-articular hydrostatic pressure causing hypoxic-reperfusion lipid peroxidation (Blake 1989) and accelerates systemic steroid escape.',
    sourceRef: 'Neustadt 2006, p. 897, 906-907',
  },
  {
    id: 'q14_anesthetic_purpose',
    topic: 'Pharmacology & Dosing',
    difficulty: 'Core',
    question:
      'Beyond immediate pain relief, what are the two other clinical roles of mixing a local anesthetic (e.g., 1% lidocaine) with an intra-articular corticosteroid?',
    options: [
      'Antibiotic sterilization and cartilage regeneration',
      'Diagnostic confirmation of intra-articular pathology & volume dilution/dispersion (reducing skin atrophy)',
      'Permanent nerve ablation and synovial thickening',
      'Increasing steroid crystal size and delaying onset',
    ],
    correctIndex: 1,
    rationale:
      'Dalal & Lemenchick (Slide 20) identify three roles: (1) Analgesia (Na+ channel blockade), (2) Diagnostic confirmation, and (3) Volume distribution/dilution (reduces skin atrophy).',
    sourceRef: 'Dalal & Lemenchick 2015, Slide 20',
  },
  {
    id: 'q15_anterior_flexion_portal',
    topic: 'Anatomy & Portals',
    difficulty: 'Intermediate',
    question:
      'Why should the Cardone & Tallia anterior approach (aiming the needle strictly parallel to the tibial plateau) be used with caution compared with aiming upward toward the femoral notch?',
    options: [
      'It enters the femoral artery',
      'Aiming parallel to the tibial plateau risks needle damage to the anterior horns of the menisci',
      'It requires general anesthesia',
      'It always misses the knee joint by 10 cm',
    ],
    correctIndex: 1,
    rationale:
      'Douglas (2014, p. 4) notes that aiming parallel to the tibial plateau risks meniscal damage, whereas directing upward toward the femoral intercondylar notch cleanly avoids the anterior meniscal horns.',
    sourceRef: 'Douglas 2014, p. 4',
  },
];

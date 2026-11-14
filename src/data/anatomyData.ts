import { AnatomicalStructure, ApproachPortal } from '../types/clinical';

export const ANATOMICAL_STRUCTURES: AnatomicalStructure[] = [
  {
    id: 'suprapatellar_pouch',
    name: 'Suprapatellar Pouch (Bursa)',
    latinName: 'Bursa suprapatellaris',
    layer: 'bursae',
    category: 'Bursa & Synovium',
    summary:
      'Superior extension of the knee synovial cavity lying deep to the quadriceps tendon and anterior to the distal femoral shaft.',
    clinicalRelevance:
      'Communicates freely with the main knee joint in ~85% of adults. Collects large effusions, creating visible suprapatellar fullness and a positive patellar tap/ballottement sign.',
    palpationTip:
      'With knee extended and quadriceps relaxed, compress gently from 5 cm above the patella downward ("milking" the pouch) to push fluid beneath the patella.',
    pdfReference: 'Neustadt 2006 (p. 904, 907); Douglas 2014 (p. 3)',
    cameraFocus: { position: [1.8, 1.35, 2.5], target: [0.0, 0.72, 0.25] },
    highlightColor: '#0ea5e9',
  },
  {
    id: 'patella',
    name: 'Patella',
    latinName: 'Patella (Sesamoid Bone)',
    layer: 'bones',
    category: 'Bone',
    summary:
      'Triangular sesamoid bone embedded in the quadriceps/patellar tendon mechanism, articulating posteriorly with the femoral trochlear groove.',
    clinicalRelevance:
      'Primary bony landmark for 4 of the 6 intra-articular portals (SL, SM, LMP, MMP). Superior, inferior, medial, and lateral poles must be outlined before skin prep.',
    palpationTip:
      'Ensure quadriceps are completely relaxed in full extension so the patella glides medially and laterally with ease.',
    injectionWarning:
      'Accidental needle collision with the superior or posterior patellar chondral surface causes sharp pain and iatrogenic cartilage injury.',
    pdfReference: 'Douglas 2014 (p. 2-3); TeachIM Checklist',
    cameraFocus: { position: [1.3, 0.35, 2.7], target: [0.0, 0.12, 0.45] },
    highlightColor: '#f59e0b',
  },
  {
    id: 'hoffa_fat_pad',
    name: "Hoffa's Infrapatellar Fat Pad",
    latinName: 'Corpus adiposum infrapatellare',
    layer: 'bursae',
    category: 'Danger Zone',
    summary:
      'Intracapsular, extrasynovial vascularized adipose cushion occupying the anterior knee compartment posterior to the patellar tendon and inferior to the patella.',
    clinicalRelevance:
      'CRITICAL HAZARD: The most common ectopic injection site for missed intra-articular knee injections (Douglas 2014). Richly innervated with nociceptive fibers.',
    palpationTip:
      'Felt as a soft, spongy fullness on either side of the patellar tendon when the knee is flexed 30°–90°.',
    injectionWarning:
      'Injecting corticosteroid or fluid into Hoffa’s fat pad causes intense acute pain and therapeutic failure. Advance anterior portals deep and upward (~45°) toward the intercondylar notch to traverse cleanly into the joint cavity.',
    pdfReference: 'Douglas 2014 (p. 4); Neustadt 2006 (p. 904)',
    cameraFocus: { position: [1.5, -0.1, 2.3], target: [0.0, -0.32, 0.38] },
    highlightColor: '#ef4444',
  },
  {
    id: 'femoral_condyles',
    name: 'Medial & Lateral Femoral Condyles',
    latinName: 'Condylus medialis et lateralis femoris',
    layer: 'bones',
    category: 'Bone',
    summary:
      'Rounded distal articular projections of the femur covered by hyaline cartilage, separated anteriorly by the trochlear groove and posteriorly by the intercondylar notch.',
    clinicalRelevance:
      'Articular surface affected by osteoarthritis (osteophytes, subchondral sclerosis, joint space narrowing). Standard 3.8 cm (1.5") needles may be too short in obese patients to clear the synovium overlying the medial femoral condyle.',
    palpationTip:
      'Palpate the condylar margins along the medial and lateral joint lines when the knee is flexed to 90°.',
    pdfReference: 'Neustadt 2006 (p. 898); Douglas 2014 (p. 4)',
    cameraFocus: { position: [2.2, 0.35, 2.1], target: [0.0, 0.15, 0.0] },
    highlightColor: '#eab308',
  },
  {
    id: 'articular_cartilage',
    name: 'Hyaline Articular Cartilage',
    latinName: 'Cartilago articularis',
    layer: 'cartilage',
    category: 'Cartilage & Meniscus',
    summary:
      'Smooth, avascular, aneural load-bearing layer (2–4 mm thick) covering femoral condyles, tibial plateau, and posterior patella.',
    clinicalRelevance:
      'In OA, progresses from microfissures and fibrillations to full-thickness loss ("bone-on-bone"). Viscosupplements perform poorly once complete joint space loss occurs.',
    palpationTip:
      'Not directly palpable; assess via crepitus during flexion/extension and weight-bearing radiographs (Kellgren-Lawrence grade).',
    injectionWarning:
      'If the needle tip touches cartilage during aspiration, withdraw 2–3 mm slightly before aspirating or injecting.',
    pdfReference: 'Neustadt 2006 (p. 898, 904, 910)',
    cameraFocus: { position: [-1.8, 0.15, 2.2], target: [0.0, -0.05, 0.1] },
    highlightColor: '#38bdf8',
  },
  {
    id: 'menisci',
    name: 'Medial & Lateral Menisci',
    latinName: 'Meniscus medialis et lateralis',
    layer: 'cartilage',
    category: 'Cartilage & Meniscus',
    summary:
      'C-shaped fibrocartilage shock absorbers sitting on the medial and lateral tibial plateaus, deepening the articular socket.',
    clinicalRelevance:
      'Horizontal needle insertion strictly parallel to the tibial plateau (Cardone & Tallia approach) risks needle laceration of the anterior meniscal horns. Also the classic site for chondrocalcinosis calcification in CPPD.',
    palpationTip:
      'Palpate the joint line 1 cm above the tibial plateau; focal joint-line tenderness suggests meniscal tear or compartment OA.',
    injectionWarning:
      'Always angle anterior portal needles slightly upward toward the intercondylar notch rather than flat against the tibial plateau.',
    pdfReference: 'Douglas 2014 (p. 4); Neustadt 2006 (p. 908)',
    cameraFocus: { position: [1.9, 0.05, 2.0], target: [0.0, -0.35, 0.08] },
    highlightColor: '#14b8a6',
  },
  {
    id: 'patellar_tendon',
    name: 'Patellar Tendon (Ligament)',
    latinName: 'Ligamentum patellae',
    layer: 'muscles',
    category: 'Ligament & Tendon',
    summary:
      'Strong flat fibrous band extending from the inferior pole of the patella to the tibial tuberosity.',
    clinicalRelevance:
      'Central landmark separating the anteromedial and anterolateral arthroscopic portals (~1 cm medial or lateral to tendon border).',
    palpationTip:
      'Easily visible and taut when the knee is flexed 90° with the lower leg hanging.',
    injectionWarning:
      'NEVER inject corticosteroids directly into weight-bearing tendons (patellar or quadriceps tendon) — absolute contraindication due to tendon weakening and rupture risk.',
    pdfReference: 'Dalal & Lemenchick 2015 (Slide 10, 21); Douglas 2014 (p. 4)',
    cameraFocus: { position: [1.3, -0.25, 2.4], target: [0.0, -0.45, 0.42] },
    highlightColor: '#f97316',
  },
  {
    id: 'tibial_tuberosity',
    name: 'Tibial Tuberosity & Plateau',
    latinName: 'Tuberositas tibiae',
    layer: 'bones',
    category: 'Bone',
    summary:
      'Prominent anterior bony elevation on the proximal tibia serving as the distal insertion of the patellar tendon.',
    clinicalRelevance:
      'Key anchor landmark: Anterior portals sit ~1 cm superior to the tibial plateau; Pes Anserinus bursa sits ~3–5 cm distal and medial to the tibial tuberosity.',
    palpationTip:
      'Trace downward along the patellar tendon in 90° flexion until hitting the firm bony prominence.',
    pdfReference: 'Neustadt 2006 (p. 907, Fig 2); TeachIM Checklist',
    cameraFocus: { position: [1.6, -0.65, 2.3], target: [0.0, -0.82, 0.35] },
    highlightColor: '#eab308',
  },
  {
    id: 'pes_anserinus_bursa',
    name: 'Pes Anserine Bursa & Conjoined Tendon',
    latinName: 'Bursa anserina',
    layer: 'bursae',
    category: 'Bursa & Synovium',
    summary:
      'Extra-articular bursa on the anteromedial proximal tibia just below the joint line, lying between the conjoined tendon (Sartorius, Gracilis, Semitendinosus) and the MCL.',
    clinicalRelevance:
      'Anserine bursitis ("cavalryman’s disease") commonly mimics or coexists with medial knee OA, especially in obese women. Abrupt localized anteromedial pain below the joint line warrants targeted bursal injection rather than intra-articular injection.',
    palpationTip:
      'Palpate 2–5 cm distal to the anteromedial joint line, medial to the tibial tuberosity.',
    pdfReference: 'Neustadt 2006 (p. 907, Fig 2)',
    cameraFocus: { position: [-1.85, -0.7, 2.0], target: [-0.28, -0.9, 0.15] },
    highlightColor: '#10b981',
  },
  {
    id: 'prepatellar_bursa',
    name: 'Prepatellar Bursa',
    latinName: 'Bursa prepatellaris subcutanea',
    layer: 'bursae',
    category: 'Bursa & Synovium',
    summary:
      'Superficial subcutaneous synovial bursa positioned directly anterior to the lower half of the patella and skin.',
    clinicalRelevance:
      'Inflammation ("housemaid’s / nun’s / carpet cutter’s knee") presents as a well-demarcated fluctuant anterior swelling with preserved joint ROM. Treated by superficial aspiration + 10–20 mg steroid (if non-septic).',
    palpationTip:
      'Ballottable superficial fluid pocket directly over the anterior patella; does not push the patella away from the femur.',
    pdfReference: 'Neustadt 2006 (p. 907)',
    cameraFocus: { position: [1.4, 0.25, 2.4], target: [0.0, 0.1, 0.56] },
    highlightColor: '#06b6d4',
  },
  {
    id: 'mcl_lcl',
    name: 'Collateral & Cruciate Ligaments (MCL, LCL, ACL, PCL)',
    latinName: 'Ligamenta collateralia et cruciata',
    layer: 'muscles',
    category: 'Ligament & Tendon',
    summary:
      'Primary static stabilizers of the knee: MCL (broad medial band), LCL (cord-like lateral band), and intra-articular extrasynovial ACL/PCL.',
    clinicalRelevance:
      'MCL lies directly deep to the pes anserine bursa. Trans-patellar-tendon injection (Cohn & Shapiro) risks inadvertent injection into the ACL.',
    palpationTip:
      'Assess valgus/varus stability at 0° and 30° flexion before diagnosing isolated OA.',
    pdfReference: 'Douglas 2014 (p. 4); Neustadt 2006 (p. 907)',
    cameraFocus: { position: [-2.1, 0.05, 1.9], target: [0.0, -0.15, 0.0] },
    highlightColor: '#fb923c',
  },
  {
    id: 'quadriceps_tendon',
    name: 'Quadriceps Tendon & Muscle',
    latinName: 'Tendo musculi quadricipitis femoris',
    layer: 'muscles',
    category: 'Ligament & Tendon',
    summary:
      'Broad flat extensor tendon inserting onto the superior pole of the patella, directly overlying the suprapatellar pouch.',
    clinicalRelevance:
      'Tensing the thigh extensors compresses the patellofemoral cleft and blocks midpatellar needle passage. Instruct patient to relax quadriceps completely before SL/LMP/MMP entry.',
    palpationTip:
      'Verify the patella can be rocked side-to-side easily before inserting the needle.',
    injectionWarning:
      'Keep needle posterior to the quadriceps tendon plane when advancing into the suprapatellar pouch.',
    pdfReference: 'Douglas 2014 (p. 3); TeachIM Checklist',
    cameraFocus: { position: [1.7, 1.0, 2.4], target: [0.0, 0.72, 0.3] },
    highlightColor: '#f97316',
  },
];

export const APPROACH_PORTALS: ApproachPortal[] = [
  {
    id: 'superolateral',
    name: 'Superolateral Approach',
    shortName: 'Superolateral',
    type: 'Intra-Articular',
    patientPosition: 'Supine, knee fully extended (or slightly hyperextended), quadriceps relaxed',
    recommendedFlexionDeg: 0,
    patellaDisplacement: 'None',
    accuracyRange: '91% pooled (95% CI 84–99%); 100% w/ US',
    pooledAccuracyPct: 91,
    ultrasoundAccuracyPct: 100,
    needleSpec: '20–22G (aspiration) or 21–25G (injection), 1.5–2 inch (3.8–5 cm)',
    depthCm: '2.0–4.0 cm',
    entryPoint:
      'Intersection of straight lines drawn along the superior and lateral borders of the patella (~1 cm superior & lateral to superolateral patellar pole).',
    trajectory:
      'Advance needle beneath the undersurface of the patella into the suprapatellar pouch, parallel to the floor and perpendicular to the femoral shaft (~45° inferomedially).',
    bestIndications: [
      'Gold-standard first-line portal for both aspiration & injection (Hermans 2011)',
      'Large or tense suprapatellar effusion (compress opposite side to milk fluid)',
      'Most direct access to the synovial cavity while avoiding Hoffa’s fat pad',
    ],
    limitations: [
      'Collision with the superior pole of patella causes pain if angle is too shallow',
      'Requires patient ability to extend the knee comfortably',
    ],
    ectopicHazard: 'Superior pole patellar cartilage or quadriceps tendon if aimed too anteriorly',
    evidenceSource: 'Douglas 2014 (p. 3); TeachIM Checklist; Dalal 2015 (Slide 34)',
    entryLocal: [0.58, 0.56, 0.36],
    targetLocal: [0.02, 0.65, 0.2],
    ectopicTargetLocal: [0.22, 0.45, 0.44],
    cameraView: { position: [1.9, 1.15, 2.3], target: [0.15, 0.45, 0.2] },
  },
  {
    id: 'superomedial',
    name: 'Superomedial Approach',
    shortName: 'Superomedial',
    type: 'Intra-Articular',
    patientPosition: 'Supine, knee fully extended, quadriceps relaxed',
    recommendedFlexionDeg: 0,
    patellaDisplacement: 'None',
    accuracyRange: '93% (single trial, Wind & Smolinski)',
    pooledAccuracyPct: 93,
    needleSpec: '20–22G, 1.5 inch (3.8 cm)',
    depthCm: '2.0–3.5 cm',
    entryPoint:
      'Junction of superior and medial borders of the patella, ~1 cm superomedial to the patellar pole.',
    trajectory:
      'Direct needle inferolaterally beneath the superior patellar pole into the suprapatellar pouch, parallel to the floor.',
    bestIndications: [
      'Alternative to superolateral when lateral skin has lesions/cellulitis',
      'Low-volume injections where lateral joint line portals show high soft-tissue infiltration',
    ],
    limitations: [
      'Less extensively studied than superolateral (single published trial)',
      'Risk of injuring patellar chondral cartilage if colliding with superomedial pole',
    ],
    ectopicHazard: 'Superomedial patellar articular cartilage or vastus medialis obliquus',
    evidenceSource: 'Douglas 2014 (p. 2-3, Table 1)',
    entryLocal: [-0.58, 0.56, 0.36],
    targetLocal: [-0.02, 0.65, 0.2],
    ectopicTargetLocal: [-0.22, 0.45, 0.44],
    cameraView: { position: [-1.9, 1.15, 2.3], target: [-0.15, 0.45, 0.2] },
  },
  {
    id: 'lateral_midpatellar',
    name: 'Lateral Midpatellar (Retropatellar)',
    shortName: 'Lat. Midpatellar',
    type: 'Intra-Articular',
    patientPosition: 'Supine, knee fully extended, patella pushed medially',
    recommendedFlexionDeg: 0,
    patellaDisplacement: 'Medial glide',
    accuracyRange: '55–93% (76% Esenyal, 93% Jackson, 55–86% Toda)',
    pooledAccuracyPct: 76,
    needleSpec: '20–22G, 1.5–2 inch',
    depthCm: '2.5–3.5 cm',
    entryPoint:
      'Lateral retropatellar space at the mid-patella (or junction of upper and middle thirds of the patella).',
    trajectory:
      'Push patella medially to open the lateral cleft; advance needle horizontally at a 45° angle toward the middle of the medial aspect beneath the patella.',
    bestIndications: [
      'Traditionally most common portal for arthrography and large lateral effusions',
      'Accuracy improves in moderate-to-severe OA when effusion distends the cleft',
    ],
    limitations: [
      'Lateral patellofemoral cleft is narrower and capsule tougher than medial side',
      'Uncomfortable/painful in patellofemoral OA, obese knees, or tense quadriceps',
      'Wind & Smolinski found <50% reliable IA delivery for low-volume injections',
    ],
    ectopicHazard: 'Lateral retinaculum / subcutaneous fat infiltration in dry or tight joints',
    evidenceSource: 'Douglas 2014 (p. 2-3); Dalal 2015 (Slide 31)',
    entryLocal: [0.62, 0.22, 0.34],
    targetLocal: [0.0, 0.18, 0.26],
    ectopicTargetLocal: [0.36, 0.2, 0.38],
    cameraView: { position: [2.2, 0.45, 2.0], target: [0.1, 0.18, 0.25] },
  },
  {
    id: 'medial_midpatellar',
    name: 'Medial Midpatellar (Retropatellar)',
    shortName: 'Med. Midpatellar',
    type: 'Intra-Articular',
    patientPosition: 'Supine, knee fully extended, patella pushed laterally',
    recommendedFlexionDeg: 0,
    patellaDisplacement: 'Lateral glide',
    accuracyRange: '56% (Esenyal) anatomical; 95% w/ US (Park)',
    pooledAccuracyPct: 56,
    ultrasoundAccuracyPct: 95,
    needleSpec: '20G 1.5–2 inch (longer needle needed in obese knees)',
    depthCm: '2.5–4.0 cm',
    entryPoint:
      'Medial parapatellar groove at the midpoint of the medial patellar border (just below horizontal line of superior pole).',
    trajectory:
      'Apply lateral pressure on patella to open the medial space; advance horizontally beneath the patella toward the lateral midpole.',
    bestIndications: [
      'Preferred by many US rheumatologists (wider cleft, softer medial capsule)',
      'Easier access in lateral patellofemoral subluxation or tight lateral patellofemoral OA',
    ],
    limitations: [
      'Lowest blind anatomical accuracy (56% in Esenyal cadaver study)',
      'Standard 3.8 cm needle may be too short to reach synovium in obese patients',
    ],
    ectopicHazard: 'Medial femoral condyle periosteum or medial patellofemoral ligament',
    evidenceSource: 'Neustadt 2006 (p. 904, Fig 1); Douglas 2014 (p. 2); Dalal 2015 (Slide 32)',
    entryLocal: [-0.62, 0.14, 0.34],
    targetLocal: [0.0, 0.14, 0.26],
    ectopicTargetLocal: [-0.34, 0.14, 0.24],
    cameraView: { position: [-2.2, 0.45, 2.0], target: [-0.1, 0.15, 0.25] },
  },
  {
    id: 'anterolateral',
    name: 'Anterolateral (Inferolateral Arthroscopic)',
    shortName: 'Anterolateral',
    type: 'Intra-Articular',
    patientPosition: 'Sitting upright with leg dangling at 90° flexion (or 30–40° flexed on bolster)',
    recommendedFlexionDeg: 75,
    patellaDisplacement: 'None',
    accuracyRange: '71–85% (85% Esenyal, 71% Jackson; 100% Waddell modified)',
    pooledAccuracyPct: 85,
    needleSpec: '21–25G, 1.5 inch (3.8 cm)',
    depthCm: '2.5–4.0 cm',
    entryPoint:
      'Soft spot ~1 cm lateral to the patellar tendon and ~1 cm superior to the lateral tibial plateau, below the inferolateral patellar pole.',
    trajectory:
      'Advance needle parallel to the floor, angled ~45° medially and slightly upward toward the femoral intercondylar notch.',
    bestIndications: [
      'Patient cannot extend knee (flexion contracture or severe pain)',
      'Dry knee or minimal synovial fluid (viscosupplementation / routine CSI)',
      'Minimal patient discomfort; avoids patellofemoral chondral collision',
    ],
    limitations: [
      'Difficult to aspirate synovial fluid through this portal',
      'Must angle upward toward notch to avoid Hoffa’s fat pad and anterior horn of lateral meniscus',
    ],
    ectopicHazard: 'Hoffa’s fat pad (#1 cause of painful missed injection) or lateral meniscus',
    evidenceSource: 'Douglas 2014 (p. 3-4); TeachIM Checklist; Dalal 2015 (Slide 33)',
    entryLocal: [0.34, -0.35, 0.54],
    targetLocal: [0.0, -0.02, 0.08],
    ectopicTargetLocal: [0.06, -0.32, 0.34],
    cameraView: { position: [1.8, 0.15, 2.25], target: [0.05, -0.2, 0.25] },
  },
  {
    id: 'anteromedial',
    name: 'Anteromedial (Inferomedial Arthroscopic)',
    shortName: 'Anteromedial',
    type: 'Intra-Articular',
    patientPosition: 'Sitting upright with knee flexed 90° (or 30° with gentle ankle traction)',
    recommendedFlexionDeg: 75,
    patellaDisplacement: 'None',
    accuracyRange: '55–75% (73% Esenyal, 75% Jackson, 86% modified Waddell)',
    pooledAccuracyPct: 73,
    needleSpec: '21–25G, 1.5 inch (3.8 cm)',
    depthCm: '2.5–4.0 cm',
    entryPoint:
      'Soft depression ~1 cm medial to the patellar tendon and ~1 cm superior to the medial tibial plateau.',
    trajectory:
      'Advance parallel to the floor and ~45° laterally/upward toward the intercondylar femoral notch.',
    bestIndications: [
      'Seated patients with flexion contracture or minimal effusion',
      'Alternative anterior route if lateral skin is scarred or compromised',
    ],
    limitations: [
      'Poor fluid aspiration yield compared to suprapatellar routes',
      'Seated anteromedial approach dropped to 55% in Toda & Tsukimura unless modified with 30° flexion + traction',
    ],
    ectopicHazard: 'Hoffa’s fat pad or medial meniscus anterior horn if aimed too flat',
    evidenceSource: 'Douglas 2014 (p. 3-4, Table 1); TeachIM Checklist',
    entryLocal: [-0.34, -0.35, 0.54],
    targetLocal: [0.0, -0.02, 0.08],
    ectopicTargetLocal: [-0.06, -0.32, 0.34],
    cameraView: { position: [-1.8, 0.15, 2.25], target: [-0.05, -0.2, 0.25] },
  },
  {
    id: 'anserine_bursa',
    name: 'Pes Anserine Bursa Injection',
    shortName: 'Anserine Bursa',
    type: 'Para-Articular (Bursal)',
    patientPosition: 'Supine or slightly flexed (15–30°), external hip rotation exposes anteromedial tibia',
    recommendedFlexionDeg: 15,
    patellaDisplacement: 'None',
    accuracyRange: 'Extra-articular targeted bursal infiltration',
    pooledAccuracyPct: 88,
    needleSpec: '20–22G, 1.5 inch (3.8 cm)',
    depthCm: '1.5–2.5 cm (advance to bone, withdraw 2 mm)',
    entryPoint:
      'Anteromedial proximal tibia just below the knee joint line, 2–5 cm distal and medial to the tibial tuberosity at point of maximal tenderness.',
    trajectory:
      'Enter anteromedially perpendicular/oblique down toward the tibial periosteum deep to the conjoined tendon (sartorius/gracilis/semitendinosus), withdraw 1–2 mm, aspirate, then inject 1–2 mL lidocaine + 1–1.5 mL steroid.',
    bestIndications: [
      'Pes anserine bursitis ("cavalryman’s disease") mimicking or coexisting with knee OA',
      'Localized tenderness & fullness anteromedially below the joint line (common in obese women)',
    ],
    limitations: [
      'Do NOT confuse with intra-articular joint effusion — stay strictly extra-articular below the joint line',
    ],
    ectopicHazard: 'Injecting directly into conjoined tendon or subcutaneous fat (skin atrophy)',
    evidenceSource: 'Neustadt 2006 (p. 907, Fig 2)',
    entryLocal: [-0.55, -0.88, 0.35],
    targetLocal: [-0.27, -0.88, 0.14],
    cameraView: { position: [-1.95, -0.55, 2.0], target: [-0.25, -0.85, 0.15] },
  },
  {
    id: 'prepatellar_bursa',
    name: 'Prepatellar Bursa Aspiration / Injection',
    shortName: 'Prepatellar Bursa',
    type: 'Para-Articular (Bursal)',
    patientPosition: 'Supine, knee extended',
    recommendedFlexionDeg: 0,
    patellaDisplacement: 'None',
    accuracyRange: 'Superficial subcutaneous pocket (palpation-guided)',
    pooledAccuracyPct: 95,
    needleSpec: '18–20G (aspiration) / 22G (injection), 1.0–1.5 inch',
    depthCm: '0.5–1.5 cm (superficial)',
    entryPoint:
      'Lateral or inferolateral margin of the fluctuant prepatellar swelling anterior to the patella.',
    trajectory:
      'Insert nearly parallel to the anterior patellar cortex into the superficial subcutaneous bursa. Aspirate completely first to rule out septic bursitis; inject 1–2 mL lidocaine + 10–20 mg steroid ONLY if fluid is clear/serous and non-infected.',
    bestIndications: [
      'Chronic aseptic prepatellar bursitis ("housemaid’s / nun’s / carpet cutter’s knee")',
    ],
    limitations: [
      'NEVER inject steroids if bursal fluid is purulent/cloudy — septic prepatellar bursitis is common',
      'High risk of subcutaneous fat atrophy/depigmentation if steroid leaks superficially',
    ],
    ectopicHazard: 'Violating the intra-articular capsule unnecessarily or leaving steroid in skin track',
    evidenceSource: 'Neustadt 2006 (p. 907)',
    entryLocal: [0.35, 0.1, 0.65],
    targetLocal: [0.02, 0.1, 0.56],
    cameraView: { position: [1.75, 0.35, 2.1], target: [0.0, 0.12, 0.5] },
  },
];

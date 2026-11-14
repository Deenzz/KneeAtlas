import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { APPROACH_PORTALS } from '../data/anatomyData';
import { LayerId, PathologyMode, PortalId } from '../types/clinical';
import { createProceduralTextures } from './proceduralTextures';

export interface KneeSceneState {
  visibleLayers: Record<LayerId, boolean>;
  explodeAmount: number;
  flexionDeg: number;
  pathologyMode: PathologyMode;
  effusionScale: number; // 0..1
  selectedPortalId: PortalId;
  needleProgress: number; // 0..1
  showEctopicError: boolean;
  selectedStructureId: string | null;
  darkMode: boolean;
}

export interface KneeSceneController {
  updateState: (next: KneeSceneState) => void;
  focusCamera: (position: [number, number, number], target: [number, number, number]) => void;
  triggerInjectionAnimation: () => void;
  dispose: () => void;
}

// Reusable scratch math objects (zero GC in render loop)
const _vecA = new THREE.Vector3();
const _vecB = new THREE.Vector3();
const _vecC = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _mouse = new THREE.Vector2();

function detectSoftwareGl(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function createKneeScene(
  mountEl: HTMLElement,
  initialState: KneeSceneState,
  onSelectStructure: (structureId: string | null) => void,
  onNeedleComplete?: () => void,
): KneeSceneController {
  const isSoftwareGl = detectSoftwareGl();

  const width = Math.max(mountEl.clientWidth, 320);
  const height = Math.max(mountEl.clientHeight, 240);

  const scene = new THREE.Scene();
  const lightBg = new THREE.Color('#eef2f6');
  const darkBg = new THREE.Color('#090f1d');
  scene.background = initialState.darkMode ? darkBg.clone() : lightBg.clone();
  scene.fog = new THREE.FogExp2(initialState.darkMode ? 0x090f1d : 0xeef2f6, 0.055);

  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 45);
  camera.position.set(2.55, 0.45, 3.85);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: isSoftwareGl,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  mountEl.appendChild(renderer.domElement);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  pmremGenerator.dispose();

  // 3-Point Warm/Cool Studio Lighting
  const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x475569, 0.85);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff5e4, 1.75);
  keyLight.position.set(3.2, 4.5, 3.6);
  keyLight.castShadow = !isSoftwareGl;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 14;
  keyLight.shadow.camera.left = -2.5;
  keyLight.shadow.camera.right = 2.5;
  keyLight.shadow.camera.top = 2.5;
  keyLight.shadow.camera.bottom = -2.5;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.95);
  rimLight.position.set(-3.5, 2.2, -3.2);
  scene.add(rimLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !isSoftwareGl;
  controls.dampingFactor = 0.07;
  controls.minDistance = 1.45;
  controls.maxDistance = 6.8;
  controls.maxPolarAngle = Math.PI * 0.82;
  controls.target.set(0.08, 0.06, 0.1);

  const textures = createProceduralTextures(renderer.capabilities.getMaxAnisotropy());

  // Soft Grounding Contact Shadow Plane
  const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: textures.contactShadowMap,
    transparent: true,
    depthWrite: false,
    opacity: 0.5,
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -1.72;
  scene.add(shadowPlane);

  // Subtle Reference Grid Ring beneath specimen
  const ringGeo = new THREE.RingGeometry(1.18, 1.2, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x64748b,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.y = -1.7;
  scene.add(ringMesh);

  // Materials Library (PBR with roughness variance >= 0.25 across adjacent parts)
  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xeae1d0,
    map: textures.boneMap,
    bumpMap: textures.boneBump,
    bumpScale: 0.018,
    roughness: 0.58,
    metalness: 0.04,
  });

  const cartilageMat = new THREE.MeshStandardMaterial({
    color: 0xbae6fd,
    map: textures.cartilageMap,
    roughness: 0.18,
    metalness: 0.08,
  });

  const meniscusMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.42,
    metalness: 0.05,
    transparent: true,
    opacity: 0.9,
  });

  const tendonMat = new THREE.MeshStandardMaterial({
    color: 0xe6dfd3,
    map: textures.tendonMap,
    roughness: 0.5,
    metalness: 0.04,
  });

  const ligamentMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.54,
    metalness: 0.05,
  });

  const synoviumMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    roughness: 0.24,
    metalness: 0.04,
    transparent: true,
    opacity: 0.36,
    depthWrite: false,
  });

  const fatPadMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.72,
    metalness: 0.02,
  });

  const bursaMat = new THREE.MeshStandardMaterial({
    color: 0x059669,
    roughness: 0.3,
    metalness: 0.04,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
  });

  const prepatellarMat = new THREE.MeshStandardMaterial({
    color: 0x0891b2,
    roughness: 0.3,
    metalness: 0.04,
    transparent: true,
    opacity: 0.54,
    depthWrite: false,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xd6a688,
    roughness: 0.72,
    metalness: 0.0,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const osteophyteMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.7,
    metalness: 0.05,
  });

  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xbae6fd,
    emissiveIntensity: 0.35,
    roughness: 0.2,
  });

  // Track interactable meshes & cloned per-structure materials for highlight feedback
  const interactables: THREE.Mesh[] = [];
  const structureMeshes = new Map<string, THREE.Mesh[]>();

  function registerStructureMesh(mesh: THREE.Mesh, structureId: string, cloneMat = true) {
    if (cloneMat && !Array.isArray(mesh.material)) {
      mesh.material = mesh.material.clone();
    }
    mesh.userData.structureId = structureId;
    mesh.userData.baseEmissive =
      (mesh.material as THREE.MeshStandardMaterial).emissive?.getHex() ?? 0x000000;
    mesh.layers.enable(1);
    interactables.push(mesh);
    const list = structureMeshes.get(structureId) ?? [];
    list.push(mesh);
    structureMeshes.set(structureId, list);
  }

  // Root Knee Assembly (elevated slightly so bottom dock never clips tibial landmarks)
  const kneeRoot = new THREE.Group();
  kneeRoot.position.set(0, 0.16, 0);
  scene.add(kneeRoot);

  // Layer Groups
  const femurGroup = new THREE.Group();
  const tibiaPivot = new THREE.Group(); // pivots at knee joint center (0, -0.12, 0) for flexion!
  tibiaPivot.position.set(0, -0.12, 0);
  const patellaGroup = new THREE.Group();
  const cartilageGroup = new THREE.Group();
  const ligamentsGroup = new THREE.Group();
  const bursaeGroup = new THREE.Group();
  const skinGroup = new THREE.Group();
  const pathologyGroup = new THREE.Group();

  kneeRoot.add(femurGroup, tibiaPivot, patellaGroup, cartilageGroup, ligamentsGroup, bursaeGroup, skinGroup, pathologyGroup);

  // --- 1. DISTAL FEMUR (Shaft + Medial/Lateral Condyles + Trochlea) ---
  const femurShaftPts = [
    new THREE.Vector2(0.01, 1.55),
    new THREE.Vector2(0.24, 1.52),
    new THREE.Vector2(0.23, 0.95),
    new THREE.Vector2(0.28, 0.58),
    new THREE.Vector2(0.42, 0.28),
    new THREE.Vector2(0.38, 0.12),
    new THREE.Vector2(0.01, 0.1),
  ];
  const femurShaftGeo = new THREE.LatheGeometry(femurShaftPts, 28);
  const femurShaft = new THREE.Mesh(femurShaftGeo, boneMat);
  femurShaft.castShadow = true;
  femurShaft.receiveShadow = true;
  registerStructureMesh(femurShaft, 'femoral_condyles');
  femurGroup.add(femurShaft);

  const condyleGeo = new THREE.SphereGeometry(0.25, 24, 20);
  const latCondyle = new THREE.Mesh(condyleGeo, boneMat);
  latCondyle.scale.set(0.95, 1.05, 1.32);
  latCondyle.position.set(0.24, 0.08, -0.03);
  latCondyle.castShadow = true;
  registerStructureMesh(latCondyle, 'femoral_condyles');

  const medCondyle = new THREE.Mesh(condyleGeo, boneMat);
  medCondyle.scale.set(0.98, 1.1, 1.35);
  medCondyle.position.set(-0.24, 0.06, -0.02);
  medCondyle.castShadow = true;
  registerStructureMesh(medCondyle, 'femoral_condyles');
  femurGroup.add(latCondyle, medCondyle);

  // --- 2. PROXIMAL TIBIA & FIBULA (inside tibiaPivot for flexion!) ---
  const tibiaPts = [
    new THREE.Vector2(0.01, 0.0),
    new THREE.Vector2(0.46, -0.02),
    new THREE.Vector2(0.44, -0.14),
    new THREE.Vector2(0.32, -0.35),
    new THREE.Vector2(0.22, -0.68),
    new THREE.Vector2(0.2, -1.42),
    new THREE.Vector2(0.01, -1.45),
  ];
  const tibiaGeo = new THREE.LatheGeometry(tibiaPts, 28);
  const tibiaMesh = new THREE.Mesh(tibiaGeo, boneMat);
  tibiaMesh.position.set(0, -0.16, 0);
  tibiaMesh.scale.set(1.05, 1, 0.88);
  tibiaMesh.castShadow = true;
  tibiaMesh.receiveShadow = true;
  registerStructureMesh(tibiaMesh, 'tibial_tuberosity');
  tibiaPivot.add(tibiaMesh);

  // Tibial Tuberosity Prominence
  const tuberosityGeo = new THREE.SphereGeometry(0.14, 18, 16);
  const tuberosityMesh = new THREE.Mesh(tuberosityGeo, boneMat);
  tuberosityMesh.scale.set(0.95, 1.45, 0.78);
  tuberosityMesh.position.set(0, -0.58, 0.34);
  registerStructureMesh(tuberosityMesh, 'tibial_tuberosity');
  tibiaPivot.add(tuberosityMesh);

  // Fibula Head & Shaft (Posterolateral)
  const fibulaHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 14), boneMat);
  fibulaHead.position.set(0.43, -0.34, -0.18);
  const fibulaShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 1.18, 14), boneMat);
  fibulaShaft.position.set(0.44, -0.94, -0.19);
  tibiaPivot.add(fibulaHead, fibulaShaft);

  // --- 3. PATELLA (Sculpted Beveled Sesamoid Bone) ---
  const patellaShape = new THREE.Shape();
  patellaShape.moveTo(0, 0.24);
  patellaShape.bezierCurveTo(0.22, 0.24, 0.27, 0.06, 0.21, -0.12);
  patellaShape.bezierCurveTo(0.14, -0.26, 0.05, -0.3, 0, -0.3);
  patellaShape.bezierCurveTo(-0.05, -0.3, -0.14, -0.26, -0.21, -0.12);
  patellaShape.bezierCurveTo(-0.27, 0.06, -0.22, 0.24, 0, 0.24);
  const patellaGeo = new THREE.ExtrudeGeometry(patellaShape, {
    depth: 0.11,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.04,
    bevelSegments: 4,
  });
  patellaGeo.center();
  const patellaMesh = new THREE.Mesh(patellaGeo, boneMat);
  patellaMesh.castShadow = true;
  registerStructureMesh(patellaMesh, 'patella');
  patellaGroup.add(patellaMesh);
  patellaGroup.position.set(0, 0.14, 0.44);

  // --- 4. HYALINE ARTICULAR CARTILAGE & MENISCI ---
  const femCartGeo = new THREE.SphereGeometry(0.258, 22, 18, 0, Math.PI * 2, Math.PI * 0.36, Math.PI * 0.64);
  const latCart = new THREE.Mesh(femCartGeo, cartilageMat);
  latCart.scale.set(0.95, 1.04, 1.32);
  latCart.position.set(0.24, 0.075, -0.02);
  registerStructureMesh(latCart, 'articular_cartilage');

  const medCart = new THREE.Mesh(femCartGeo, cartilageMat);
  medCart.scale.set(0.98, 1.09, 1.35);
  medCart.position.set(-0.24, 0.055, -0.01);
  registerStructureMesh(medCart, 'articular_cartilage');

  // Trochlear cartilage groove
  const trochCart = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.18, 0.34, 20, 1, false, -Math.PI * 0.35, Math.PI * 0.7), cartilageMat);
  trochCart.rotation.z = Math.PI / 2;
  trochCart.position.set(0, 0.18, 0.22);
  registerStructureMesh(trochCart, 'articular_cartilage');

  // Tibial Plateau Cartilage Pads
  const tibCartGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 20);
  const latTibCart = new THREE.Mesh(tibCartGeo, cartilageMat);
  latTibCart.position.set(0.23, -0.05, -0.01);
  const medTibCart = new THREE.Mesh(tibCartGeo, cartilageMat);
  medTibCart.position.set(-0.23, -0.05, -0.01);
  registerStructureMesh(latTibCart, 'articular_cartilage');
  registerStructureMesh(medTibCart, 'articular_cartilage');
  cartilageGroup.add(latCart, medCart, trochCart);
  tibiaPivot.add(latTibCart, medTibCart);

  // C-Shaped Medial & Lateral Menisci
  const meniscusGeo = new THREE.TorusGeometry(0.185, 0.042, 12, 24, Math.PI * 1.48);
  const medMeniscus = new THREE.Mesh(meniscusGeo, meniscusMat);
  medMeniscus.rotation.x = Math.PI / 2;
  medMeniscus.rotation.z = -Math.PI * 0.74;
  medMeniscus.position.set(-0.24, -0.02, 0.0);
  registerStructureMesh(medMeniscus, 'menisci');

  const latMeniscus = new THREE.Mesh(meniscusGeo, meniscusMat);
  latMeniscus.rotation.x = Math.PI / 2;
  latMeniscus.rotation.z = Math.PI * 0.26;
  latMeniscus.position.set(0.24, -0.02, 0.0);
  registerStructureMesh(latMeniscus, 'menisci');
  tibiaPivot.add(medMeniscus, latMeniscus);

  // --- 5. LIGAMENTS & TENDONS ---
  // Quadriceps Tendon
  const quadTendon = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.72, 0.08), tendonMat);
  quadTendon.position.set(0, 0.72, 0.36);
  quadTendon.rotation.x = -0.1;
  registerStructureMesh(quadTendon, 'quadriceps_tendon');
  ligamentsGroup.add(quadTendon);

  // Patellar Tendon (connects patella inferior pole to tibial tuberosity)
  const patTendonGeo = new THREE.BoxGeometry(0.2, 0.56, 0.075);
  const patTendon = new THREE.Mesh(patTendonGeo, tendonMat);
  patTendon.position.set(0, -0.3, 0.39);
  registerStructureMesh(patTendon, 'patellar_tendon');
  tibiaPivot.add(patTendon);

  // MCL & LCL
  const mclMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.72, 0.16), ligamentMat);
  mclMesh.position.set(-0.46, -0.18, -0.02);
  registerStructureMesh(mclMesh, 'mcl_lcl');

  const lclCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.46, 0.18, -0.06),
    new THREE.Vector3(0.49, -0.08, -0.12),
    new THREE.Vector3(0.44, -0.35, -0.18),
  ]);
  const lclMesh = new THREE.Mesh(new THREE.TubeGeometry(lclCurve, 14, 0.036, 10, false), ligamentMat);
  registerStructureMesh(lclMesh, 'mcl_lcl');

  // ACL & PCL inside notch
  const aclCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.12, 0.14, -0.08),
    new THREE.Vector3(0.0, 0.02, 0.02),
    new THREE.Vector3(-0.04, -0.08, 0.1),
  ]);
  const aclMesh = new THREE.Mesh(new THREE.TubeGeometry(aclCurve, 12, 0.035, 10, false), ligamentMat);
  registerStructureMesh(aclMesh, 'mcl_lcl');
  ligamentsGroup.add(mclMesh, lclMesh, aclMesh);

  // Pes Anserinus Conjoined Tendon (3 converging slips: Sartorius, Gracilis, Semitendinosus)
  const pesGroup = new THREE.Group();
  const slipOffsets = [-0.08, 0.0, 0.08];
  slipOffsets.forEach((zOff, idx) => {
    const slipCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.48, -0.36 + idx * 0.06, -0.22 + zOff),
      new THREE.Vector3(-0.42, -0.68, 0.0 + zOff * 0.5),
      new THREE.Vector3(-0.25, -0.82, 0.2),
    ]);
    const slip = new THREE.Mesh(new THREE.TubeGeometry(slipCurve, 16, 0.024, 8, false), tendonMat);
    registerStructureMesh(slip, 'pes_anserinus_bursa');
    pesGroup.add(slip);
  });
  tibiaPivot.add(pesGroup);

  // --- 6. SYNOVIAL CAVITY, BURSAE & HOFFA'S FAT PAD ---
  // Suprapatellar Pouch & Joint Capsule
  const pouchMesh = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 20), synoviumMat);
  pouchMesh.scale.set(1.05, 1.55, 0.62);
  pouchMesh.position.set(0, 0.66, 0.24);
  pouchMesh.renderOrder = 3;
  registerStructureMesh(pouchMesh, 'suprapatellar_pouch');
  bursaeGroup.add(pouchMesh);

  const jointCapsule = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.44, 0.42, 24, 1, true), synoviumMat);
  jointCapsule.position.set(0, -0.02, 0.02);
  jointCapsule.renderOrder = 3;
  registerStructureMesh(jointCapsule, 'suprapatellar_pouch');
  bursaeGroup.add(jointCapsule);

  // Hoffa's Infrapatellar Fat Pad (Danger Zone)
  const hoffaMesh = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), fatPadMat);
  hoffaMesh.scale.set(1.15, 0.88, 0.68);
  hoffaMesh.position.set(0, -0.24, 0.25);
  registerStructureMesh(hoffaMesh, 'hoffa_fat_pad');
  bursaeGroup.add(hoffaMesh);

  // Prepatellar Bursa (Superficial anterior to patella)
  const prepatellarMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 16), prepatellarMat);
  prepatellarMesh.scale.set(1.1, 1.15, 0.35);
  prepatellarMesh.position.set(0, 0.09, 0.56);
  prepatellarMesh.renderOrder = 4;
  registerStructureMesh(prepatellarMesh, 'prepatellar_bursa');
  bursaeGroup.add(prepatellarMesh);

  // Pes Anserine Bursa (deep to conjoined tendon, superficial to MCL)
  const anserineBursaMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 14), bursaMat);
  anserineBursaMesh.scale.set(0.65, 1.35, 1.1);
  anserineBursaMesh.position.set(-0.32, -0.78, 0.14);
  anserineBursaMesh.renderOrder = 4;
  registerStructureMesh(anserineBursaMesh, 'pes_anserinus_bursa');
  tibiaPivot.add(anserineBursaMesh);

  // --- 7. TRANSLUCENT SKIN ENVELOPE & SURGICAL MARKER LANDMARKS ---
  const skinPoints = [
    new THREE.Vector2(0.56, 1.48),
    new THREE.Vector2(0.58, 0.9),
    new THREE.Vector2(0.62, 0.25),
    new THREE.Vector2(0.59, -0.25),
    new THREE.Vector2(0.54, -0.85),
    new THREE.Vector2(0.49, -1.55),
  ];
  const skinMesh = new THREE.Mesh(new THREE.LatheGeometry(skinPoints, 32), skinMat);
  skinMesh.scale.set(1.04, 1, 0.94);
  skinMesh.renderOrder = 5;
  skinGroup.add(skinMesh);

  // Surgical Ink Ring Around Patella & Superolateral Bisecting Lines
  const inkMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.78 });
  const patInkPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    patInkPts.push(new THREE.Vector3(Math.cos(a) * 0.28, 0.14 + Math.sin(a) * 0.3, 0.55));
  }
  const patInkLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(patInkPts), inkMat);
  skinGroup.add(patInkLine);

  const slLine1 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.0, 0.5, 0.52), new THREE.Vector3(0.62, 0.5, 0.38)]),
    inkMat,
  );
  const slLine2 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.42, 0.0, 0.48), new THREE.Vector3(0.48, 0.62, 0.42)]),
    inkMat,
  );
  skinGroup.add(slLine1, slLine2);

  // --- 8. PATHOLOGY OVERLAYS (Osteophytes & CPPD Crystals) ---
  const osteophytes: THREE.Mesh[] = [];
  const spurPositions: [number, number, number][] = [
    [-0.44, 0.06, 0.14],
    [0.44, 0.07, 0.14],
    [-0.42, -0.14, 0.14],
    [0.42, -0.14, 0.14],
  ];
  spurPositions.forEach((pos) => {
    const spur = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.12, 8), osteophyteMat);
    spur.position.set(pos[0], pos[1], pos[2]);
    spur.rotation.z = pos[0] > 0 ? -Math.PI / 2.2 : Math.PI / 2.2;
    osteophytes.push(spur);
    pathologyGroup.add(spur);
  });

  // CPPD Chondrocalcinosis Punctate Crystal Arc
  const cppdCrystals = new THREE.InstancedMesh(
    new THREE.OctahedronGeometry(0.018, 0),
    crystalMat,
    24,
  );
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 24; i++) {
    const side = i < 12 ? -0.24 : 0.24;
    const angle = ((i % 12) / 11) * Math.PI * 1.2 - Math.PI * 0.6;
    dummy.position.set(side + Math.cos(angle) * 0.17, -0.14, Math.sin(angle) * 0.17);
    dummy.rotation.set(i * 0.5, i * 0.8, 0);
    dummy.updateMatrix();
    cppdCrystals.setMatrixAt(i, dummy.matrix);
  }
  cppdCrystals.instanceMatrix.needsUpdate = true;
  cppdCrystals.computeBoundingSphere();
  pathologyGroup.add(cppdCrystals);

  // --- 9. 3D SYRINGE, NEEDLE & MEDICATION PLUME (inside kneeRoot) ---
  const syringeGroup = new THREE.Group();
  kneeRoot.add(syringeGroup);

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.92,
    roughness: 0.14,
  });
  const hubMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.32,
    metalness: 0.05,
  });
  const barrelMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.syringeBarrelMap,
    transparent: true,
    opacity: 0.78,
    roughness: 0.16,
    metalness: 0.05,
    depthWrite: false,
  });
  const plungerMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.38,
  });

  // Tip is at local origin (0,0,0), barrel extends along +Y
  const needleShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.62, 12), steelMat);
  needleShaft.position.y = 0.31;
  const needleHub = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.022, 0.11, 14), hubMat);
  needleHub.position.y = 0.66;
  const barrelMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.72, 20), barrelMat);
  barrelMesh.position.y = 1.07;
  const barrelFlange = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.16), barrelMat);
  barrelFlange.position.y = 1.43;
  const plungerRod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.56, 12), plungerMat);
  plungerRod.position.y = 1.42;
  const plungerStopper = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.08, 18), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 }));
  plungerStopper.position.y = 1.15;
  const thumbPad = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.025, 18), plungerMat);
  thumbPad.position.y = 1.71;

  syringeGroup.add(needleShaft, needleHub, barrelMesh, barrelFlange, plungerRod, plungerStopper, thumbPad);

  // Medication Dispersion Plume at needle tip (inside kneeRoot space)
  const plumeMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
  });
  const plumeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 16), plumeMat);
  kneeRoot.add(plumeMesh);

  // Portal Entry Indicator Ring (inside kneeRoot space)
  const entryMarker = new THREE.Mesh(
    new THREE.TorusGeometry(0.045, 0.011, 10, 24),
    new THREE.MeshBasicMaterial({ color: 0x0284c7 }),
  );
  kneeRoot.add(entryMarker);

  // Mutable animation & target state
  let currentState: KneeSceneState = { ...initialState };
  let animExplode = initialState.explodeAmount;
  let animFlexion = initialState.flexionDeg;
  let animNeedle = initialState.needleProgress;
  let autoAnimatingNeedle = false;
  let targetCamPos: THREE.Vector3 | null = null;
  let targetCtrlLook: THREE.Vector3 | null = null;

  // Coalesced On-Demand Rendering Loop + Software-WebGL afterDraw
  let frameId = 0;
  let renderBusy = false;
  let renderDirty = false;
  let disposed = false;
  let lastFrameTime = performance.now();

  function afterDraw(cb: () => void) {
    const gl = renderer.getContext() as WebGL2RenderingContext;
    if (!gl || typeof gl.fenceSync !== 'function') {
      frameId = window.setTimeout(cb, 80);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (disposed) {
        if (sync) gl.deleteSync(sync);
        return;
      }
      const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (status === gl.UNSIGNALED) {
        frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        frameId = window.setTimeout(cb, 80);
      }
    };
    frameId = window.setTimeout(poll, 5);
  }

  function applySceneTransforms(dt: number) {
    let needsMoreFrames = false;

    // 1. Exponential damping on Explode & Flexion
    const prevExplode = animExplode;
    animExplode = THREE.MathUtils.damp(animExplode, currentState.explodeAmount, 8, dt);
    if (Math.abs(animExplode - currentState.explodeAmount) > 0.002) needsMoreFrames = true;
    else animExplode = currentState.explodeAmount;

    animFlexion = THREE.MathUtils.damp(animFlexion, currentState.flexionDeg, 8, dt);
    if (Math.abs(animFlexion - currentState.flexionDeg) > 0.15) needsMoreFrames = true;
    else animFlexion = currentState.flexionDeg;

    // 2. Needle injection auto-animation
    if (autoAnimatingNeedle) {
      animNeedle = Math.min(1, animNeedle + dt * 1.15);
      if (animNeedle >= 1) {
        autoAnimatingNeedle = false;
        onNeedleComplete?.();
      } else {
        needsMoreFrames = true;
      }
    } else if (Math.abs(animNeedle - currentState.needleProgress) > 0.003) {
      animNeedle = THREE.MathUtils.damp(animNeedle, currentState.needleProgress, 10, dt);
      needsMoreFrames = true;
    } else {
      animNeedle = currentState.needleProgress;
    }

    // 3. Camera smooth glide preset
    if (targetCamPos && targetCtrlLook) {
      camera.position.lerp(targetCamPos, 1 - Math.exp(-6.5 * dt));
      controls.target.lerp(targetCtrlLook, 1 - Math.exp(-6.5 * dt));
      if (
        camera.position.distanceTo(targetCamPos) < 0.02 &&
        controls.target.distanceTo(targetCtrlLook) < 0.02
      ) {
        targetCamPos = null;
        targetCtrlLook = null;
      } else {
        needsMoreFrames = true;
      }
    }

    // Apply layer visibility
    skinGroup.visible = currentState.visibleLayers.skin;
    ligamentsGroup.visible = currentState.visibleLayers.muscles;
    patTendon.visible = currentState.visibleLayers.muscles;
    pesGroup.visible = currentState.visibleLayers.muscles;
    bursaeGroup.visible = currentState.visibleLayers.bursae;
    anserineBursaMesh.visible = currentState.visibleLayers.bursae;
    cartilageGroup.visible = currentState.visibleLayers.cartilage;
    latTibCart.visible = currentState.visibleLayers.cartilage;
    medTibCart.visible = currentState.visibleLayers.cartilage;
    medMeniscus.visible = currentState.visibleLayers.cartilage;
    latMeniscus.visible = currentState.visibleLayers.cartilage;
    femurGroup.visible = currentState.visibleLayers.bones;
    tibiaMesh.visible = currentState.visibleLayers.bones;
    tuberosityMesh.visible = currentState.visibleLayers.bones;
    fibulaHead.visible = currentState.visibleLayers.bones;
    fibulaShaft.visible = currentState.visibleLayers.bones;
    patellaGroup.visible = currentState.visibleLayers.bones;

    // Apply knee flexion kinematics
    const flexRad = THREE.MathUtils.degToRad(animFlexion);
    tibiaPivot.rotation.x = -flexRad;

    // Patella glides slightly inferiorly and deeper into trochlea as knee flexes, plus LMP/MMP glide
    const portal = APPROACH_PORTALS.find((p) => p.id === currentState.selectedPortalId) ?? APPROACH_PORTALS[0];
    let patellaXOffset = 0;
    if (portal.patellaDisplacement === 'Medial glide') patellaXOffset = -0.09;
    if (portal.patellaDisplacement === 'Lateral glide') patellaXOffset = 0.09;

    const patFlexDrop = Math.sin(flexRad) * 0.16;
    const patFlexBack = Math.sin(flexRad) * 0.12;
    patellaGroup.position.set(
      patellaXOffset,
      0.14 - patFlexDrop,
      0.44 - patFlexBack + animExplode * 0.52,
    );
    patellaGroup.rotation.x = flexRad * 0.42;

    // Apply Exploded View offsets
    skinGroup.position.set(0, 0, animExplode * 0.72);
    ligamentsGroup.position.set(0, 0, animExplode * 0.36);
    bursaeGroup.position.set(0, animExplode * 0.14, animExplode * 0.2);
    cartilageGroup.position.set(0, -animExplode * 0.06, 0);
    femurGroup.position.set(0, animExplode * 0.28, 0);
    tibiaPivot.position.set(0, -0.12 - animExplode * 0.28, 0);

    // Apply Pathology & Effusion Dynamics
    const mode = currentState.pathologyMode;
    const eff = currentState.effusionScale;
    const isSeptic = mode === 'septic';
    const isAnserine = mode === 'anserine_bursitis';
    const isPrepatellar = mode === 'prepatellar_bursitis';
    const isOaSevere = mode === 'oa_severe';
    const isOa = mode === 'oa_effusion' || isOaSevere;
    const isCppd = mode === 'cppd';

    const pouchBoost = 1 + eff * 0.55 + (isSeptic ? 0.35 : 0);
    pouchMesh.scale.set(1.05 * pouchBoost, 1.55 * (1 + eff * 0.25), 0.62 * pouchBoost);
    (pouchMesh.material as THREE.MeshPhysicalMaterial).color.setHex(
      isSeptic ? 0xef4444 : isCppd ? 0xf59e0b : 0x38bdf8,
    );
    (pouchMesh.material as THREE.MeshPhysicalMaterial).opacity = 0.28 + eff * 0.35;

    (jointCapsule.material as THREE.MeshPhysicalMaterial).color.setHex(
      isSeptic ? 0xef4444 : 0x38bdf8,
    );
    (jointCapsule.material as THREE.MeshPhysicalMaterial).opacity = 0.2 + eff * 0.32;

    // Bursae inflammation highlights
    const ansScale = isAnserine ? 1.55 : 1.0;
    anserineBursaMesh.scale.set(0.65 * ansScale, 1.35 * ansScale, 1.1 * ansScale);
    (anserineBursaMesh.material as THREE.MeshPhysicalMaterial).color.setHex(
      isAnserine ? 0xef4444 : 0x10b981,
    );
    (anserineBursaMesh.material as THREE.MeshPhysicalMaterial).opacity = isAnserine ? 0.82 : 0.52;

    const prepScale = isPrepatellar ? 1.6 : 1.0;
    prepatellarMesh.scale.set(1.1 * prepScale, 1.15 * prepScale, 0.35 * (isPrepatellar ? 2.2 : 1.0));
    (prepatellarMesh.material as THREE.MeshPhysicalMaterial).color.setHex(
      isPrepatellar ? 0xef4444 : 0x06b6d4,
    );
    (prepatellarMesh.material as THREE.MeshPhysicalMaterial).opacity = isPrepatellar ? 0.8 : 0.45;

    // Osteophytes & CPPD visibility
    osteophytes.forEach((spur) => {
      spur.visible = isOa;
      spur.scale.setScalar(isOaSevere ? 1.45 : 0.9);
    });
    cppdCrystals.visible = isCppd;

    // Cartilage thinning color cue in Severe OA
    [latCart, medCart, trochCart].forEach((m) => {
      (m.material as THREE.MeshPhysicalMaterial).color.setHex(
        isOaSevere ? 0xfca5a5 : isOa ? 0xfde68a : 0xd9f0fa,
      );
    });

    // Position Syringe & Needle Trajectory for Selected Portal
    _vecA.set(portal.entryLocal[0], portal.entryLocal[1], portal.entryLocal[2]);
    const rawTarget =
      currentState.showEctopicError && portal.ectopicTargetLocal
        ? portal.ectopicTargetLocal
        : portal.targetLocal;
    _vecB.set(rawTarget[0], rawTarget[1], rawTarget[2]);

    // If portal is on the tibiaPivot (flexed anterior portals or anserine), rotate target/entry gently if knee flexed
    if (portal.id === 'anserine_bursa') {
      _vecA.applyAxisAngle(_vecC.set(1, 0, 0), -flexRad);
      _vecB.applyAxisAngle(_vecC.set(1, 0, 0), -flexRad);
    }

    // Direction from target back to entry (needle barrel points along +Y from tip)
    _dir.subVectors(_vecA, _vecB).normalize();
    _quat.setFromUnitVectors(_up, _dir);
    syringeGroup.quaternion.copy(_quat);

    // Retracted start position (outside skin) -> Inserted tip position
    const startPos = _vecC.copy(_vecA).addScaledVector(_dir, 0.28);
    syringeGroup.position.lerpVectors(startPos, _vecB, animNeedle);

    // Plunger depresses during final 35% of injection
    const injectRatio = Math.max(0, (animNeedle - 0.65) / 0.35);
    plungerRod.position.y = 1.42 - injectRatio * 0.3;
    plungerStopper.position.y = 1.15 - injectRatio * 0.3;
    thumbPad.position.y = 1.71 - injectRatio * 0.3;

    // Plume expansion
    if (injectRatio > 0.05) {
      plumeMesh.visible = true;
      plumeMesh.position.copy(_vecB);
      plumeMesh.scale.setScalar(0.35 + injectRatio * 1.15);
      plumeMat.color.setHex(currentState.showEctopicError ? 0xef4444 : 0x38bdf8);
      plumeMat.opacity = Math.sin(injectRatio * Math.PI) * 0.48;
    } else {
      plumeMesh.visible = false;
    }

    // Hub color turns warning red in ectopic mode
    hubMat.color.setHex(currentState.showEctopicError ? 0xdc2626 : 0x0ea5e9);

    // Entry marker ring oriented flush to approach vector
    entryMarker.position.copy(_vecA);
    entryMarker.quaternion.setFromUnitVectors(_vecC.set(0, 0, 1), _dir);
    (entryMarker.material as THREE.MeshBasicMaterial).color.setHex(
      currentState.showEctopicError ? 0xef4444 : 0x0284c7,
    );

    // Structure selection highlight
    structureMeshes.forEach((meshes, structId) => {
      const isSelected = structId === currentState.selectedStructureId;
      for (const m of meshes) {
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && mat.emissive) {
          mat.emissive.setHex(isSelected ? 0x0284c7 : m.userData.baseEmissive ?? 0x000000);
          mat.emissiveIntensity = isSelected ? 0.45 : 0.0;
        }
      }
    });

    // Avoid unused warning
    void prevExplode;
    return needsMoreFrames;
  }

  function requestRender() {
    if (disposed) return;
    if (renderBusy) {
      renderDirty = true;
      return;
    }
    renderBusy = true;
    frameId = requestAnimationFrame(() => {
      if (disposed) return;
      renderDirty = false;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
      lastFrameTime = now;

      const more = applySceneTransforms(dt);
      controls.update();
      renderer.render(scene, camera);

      const done = () => {
        renderBusy = false;
        if (!disposed && (renderDirty || more)) {
          requestRender();
        }
      };

      if (isSoftwareGl) afterDraw(done);
      else done();
    });
  }

  // OrbitControls events
  const onControlsChange = () => requestRender();
  const onControlsStart = () => {
    targetCamPos = null;
    targetCtrlLook = null;
  };
  controls.addEventListener('change', onControlsChange);
  controls.addEventListener('start', onControlsStart);

  // Raycasting click-to-inspect anatomical structures
  const raycaster = new THREE.Raycaster();
  raycaster.layers.set(1);
  let pointerDownPos = { x: 0, y: 0 };

  const onPointerDown = (e: PointerEvent) => {
    pointerDownPos = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: PointerEvent) => {
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    if (dx * dx + dy * dy > 25) return; // ignore orbit drag

    const rect = renderer.domElement.getBoundingClientRect();
    _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(_mouse, camera);
    const hits = raycaster.intersectObjects(interactables, false);
    const visibleHit = hits.find((h) => {
      let obj: THREE.Object3D | null = h.object;
      while (obj) {
        if (!obj.visible) return false;
        obj = obj.parent;
      }
      return true;
    });
    if (visibleHit && visibleHit.object.userData.structureId) {
      onSelectStructure(visibleHit.object.userData.structureId);
    }
  };

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

  // ResizeObserver for crisp responsive viewport (only resize when dimensions actually change)
  let lastW = width;
  let lastH = height;
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.max(Math.round(entry.contentRect.width), 100);
      const h = Math.max(Math.round(entry.contentRect.height), 100);
      if (w === lastW && h === lastH) continue;
      lastW = w;
      lastH = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (isSoftwareGl) {
        applySceneTransforms(0.016);
        controls.update();
        renderer.render(scene, camera);
      } else {
        requestRender();
      }
    }
  });
  ro.observe(mountEl);

  // Initial pre-warm & synchronous first paint
  if (!isSoftwareGl) {
    renderer.compile(scene, camera);
  }
  applySceneTransforms(0.016);
  controls.update();
  renderer.render(scene, camera);
  requestRender();

  return {
    updateState: (next) => {
      const themeChanged = next.darkMode !== currentState.darkMode;
      currentState = { ...next };
      if (themeChanged) {
        scene.background = next.darkMode ? darkBg.clone() : lightBg.clone();
        scene.fog = new THREE.FogExp2(next.darkMode ? 0x090f1d : 0xeef2f6, 0.055);
      }
      requestRender();
    },
    focusCamera: (pos, target) => {
      targetCamPos = new THREE.Vector3(pos[0], pos[1], pos[2]);
      targetCtrlLook = new THREE.Vector3(target[0], target[1], target[2]);
      requestRender();
    },
    triggerInjectionAnimation: () => {
      animNeedle = 0;
      autoAnimatingNeedle = true;
      requestRender();
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      controls.removeEventListener('change', onControlsChange);
      controls.removeEventListener('start', onControlsStart);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      textures.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material.dispose();
        }
      });
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
    },
  };
}

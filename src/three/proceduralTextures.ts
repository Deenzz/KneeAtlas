import * as THREE from 'three';

export interface ProceduralTextureSet {
  boneMap: THREE.CanvasTexture;
  boneBump: THREE.CanvasTexture;
  tendonMap: THREE.CanvasTexture;
  cartilageMap: THREE.CanvasTexture;
  syringeBarrelMap: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  dispose: () => void;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function createProceduralTextures(maxAnisotropy: number): ProceduralTextureSet {
  // 1. Cortical Bone Albedo + Trabecular Micro-Bump
  const [boneCanvas, bCtx] = makeCanvas(256, 256);
  bCtx.fillStyle = '#ece6d8';
  bCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1600; i++) {
    const x = (i * 73) % 256;
    const y = (i * 137) % 256;
    const w = 1 + (i % 3);
    const h = 4 + (i % 10);
    bCtx.fillStyle = i % 2 === 0 ? 'rgba(196, 184, 162, 0.25)' : 'rgba(255, 252, 245, 0.22)';
    bCtx.fillRect(x, y, w, h);
  }
  const boneMap = new THREE.CanvasTexture(boneCanvas);
  boneMap.colorSpace = THREE.SRGBColorSpace;
  boneMap.wrapS = boneMap.wrapT = THREE.RepeatWrapping;
  boneMap.repeat.set(2, 2);
  boneMap.anisotropy = maxAnisotropy;

  const [bumpCanvas, bumpCtx] = makeCanvas(256, 256);
  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1200; i++) {
    const x = (i * 59) % 256;
    const y = (i * 113) % 256;
    bumpCtx.fillStyle = i % 3 === 0 ? '#a0a0a0' : '#656565';
    bumpCtx.fillRect(x, y, 2, 7);
  }
  const boneBump = new THREE.CanvasTexture(bumpCanvas);
  boneBump.wrapS = boneBump.wrapT = THREE.RepeatWrapping;
  boneBump.repeat.set(2, 2);

  // 2. Striated Tendon / Ligament Fiber Texture
  const [tendonCanvas, tCtx] = makeCanvas(256, 256);
  tCtx.fillStyle = '#edeae4';
  tCtx.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 4) {
    tCtx.fillStyle = x % 8 === 0 ? 'rgba(210, 204, 195, 0.45)' : 'rgba(255, 255, 255, 0.35)';
    tCtx.fillRect(x, 0, 2, 256);
  }
  const tendonMap = new THREE.CanvasTexture(tendonCanvas);
  tendonMap.colorSpace = THREE.SRGBColorSpace;
  tendonMap.wrapS = tendonMap.wrapT = THREE.RepeatWrapping;
  tendonMap.repeat.set(3, 1);
  tendonMap.anisotropy = maxAnisotropy;

  // 3. Hyaline Cartilage Pearlescent Texture
  const [cartCanvas, cCtx] = makeCanvas(256, 256);
  const grad = cCtx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#d8eef8');
  grad.addColorStop(0.5, '#e6f4fa');
  grad.addColorStop(1, '#cbe6f4');
  cCtx.fillStyle = grad;
  cCtx.fillRect(0, 0, 256, 256);
  const cartilageMap = new THREE.CanvasTexture(cartCanvas);
  cartilageMap.colorSpace = THREE.SRGBColorSpace;
  cartilageMap.anisotropy = maxAnisotropy;

  // 4. Syringe Barrel Calibration Texture (1–5 mL ticks)
  const [syrCanvas, sCtx] = makeCanvas(256, 256);
  sCtx.clearRect(0, 0, 256, 256);
  sCtx.fillStyle = 'rgba(240, 248, 255, 0.28)';
  sCtx.fillRect(0, 0, 256, 256);
  sCtx.strokeStyle = '#0f172a';
  sCtx.fillStyle = '#0f172a';
  sCtx.font = 'bold 18px monospace';
  for (let i = 1; i <= 5; i++) {
    const y = 225 - i * 38;
    sCtx.lineWidth = 3;
    sCtx.beginPath();
    sCtx.moveTo(40, y);
    sCtx.lineTo(100, y);
    sCtx.stroke();
    sCtx.fillText(`${i}mL`, 112, y + 6);
    if (i < 5) {
      sCtx.lineWidth = 1.5;
      sCtx.beginPath();
      sCtx.moveTo(40, y - 19);
      sCtx.lineTo(75, y - 19);
      sCtx.stroke();
    }
  }
  const syringeBarrelMap = new THREE.CanvasTexture(syrCanvas);
  syringeBarrelMap.colorSpace = THREE.SRGBColorSpace;
  syringeBarrelMap.anisotropy = maxAnisotropy;

  // 5. Soft Radial Contact Shadow Disc
  const [shadCanvas, shCtx] = makeCanvas(256, 256);
  const rGrad = shCtx.createRadialGradient(128, 128, 12, 128, 128, 124);
  rGrad.addColorStop(0, 'rgba(15, 23, 42, 0.42)');
  rGrad.addColorStop(0.55, 'rgba(15, 23, 42, 0.16)');
  rGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  shCtx.fillStyle = rGrad;
  shCtx.fillRect(0, 0, 256, 256);
  const contactShadowMap = new THREE.CanvasTexture(shadCanvas);

  return {
    boneMap,
    boneBump,
    tendonMap,
    cartilageMap,
    syringeBarrelMap,
    contactShadowMap,
    dispose: () => {
      boneMap.dispose();
      boneBump.dispose();
      tendonMap.dispose();
      cartilageMap.dispose();
      syringeBarrelMap.dispose();
      contactShadowMap.dispose();
    },
  };
}

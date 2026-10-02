import * as THREE from "three";
import { unlockAudio, sfx, setFuse, startMusic, stopMusic, isMuted, setMuted } from "./audio.js";

// ---------- Tuning ----------
const GRAVITY = 17; // world units per second squared
const START_LIVES = 3;
const MIN_SLICE_SPEED = 7; // the blade must move at least this fast (world units per second) to cut
const COMBO_WINDOW = 0.25; // cuts this close together count as one swipe
const MAX_STAGE = 7; // each stage is busier and bomb-heavier than the last, up to this one
const STAGE_BREATHER = 2.5; // seconds of calm after a stage's finale
const SPLAT_LIFE = 4;
const TRAIL_LIFE = 0.13;
const BEST_KEY = "fruit-slash-best";

const isTouch = window.matchMedia("(pointer: coarse)").matches;
const clamp = THREE.MathUtils.clamp;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

// ---------- Canvases and scene ----------
// Three layers: the wooden board with juice splats (2D), the fruit (WebGL, transparent), and the
// blade trail (2D) on top.
const boardCanvas = document.getElementById("board");
const board = boardCanvas.getContext("2d");
const trailCanvas = document.getElementById("trail");
const trail = trailCanvas.getContext("2d");
const canvas = document.getElementById("game");
// Multisampled edges are the most expensive thing the game draws. Phones and high-density
// screens have pixels small enough to do without them; ordinary desktop screens keep them.
const smallPixels = isTouch || window.devicePixelRatio >= 2;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !smallPixels, alpha: true, powerPreference: "high-performance" });
// Rendering resolution, in device pixels per CSS pixel. It starts as high as is useful and steps
// down if the device can't keep up (see watchFrameRate).
let pixelRatio = Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2);
renderer.setPixelRatio(pixelRatio);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
camera.position.set(0, 0, 19);
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x5a3a20, 1.5));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
keyLight.position.set(-6, 10, 14);
scene.add(keyLight);

// Half the width and height of what the camera sees at z = 0, where everything flies. Fruit is
// drawn a bit smaller on narrow (portrait) screens.
const view = { halfW: 10, halfH: 10, sizeScale: 1 };
let canvasScale = 1; // 2D canvas pixels per CSS pixel

const tmp = new THREE.Vector3();
// The camera shakes, so bring its matrices up to date rather than trusting the last render's.
function worldToScreen(x, y) {
  camera.updateMatrixWorld();
  tmp.set(x, y, 0).project(camera);
  return { x: ((tmp.x + 1) / 2) * window.innerWidth, y: ((1 - tmp.y) / 2) * window.innerHeight };
}
function screenToWorld(px, py, out = new THREE.Vector3()) {
  camera.updateMatrixWorld();
  tmp.set((px / window.innerWidth) * 2 - 1, -(py / window.innerHeight) * 2 + 1, 0.5).unproject(camera);
  tmp.sub(camera.position).normalize();
  return out.copy(camera.position).addScaledVector(tmp, -camera.position.z / tmp.z);
}

// ---------- The board ----------
let woodCanvas = null;
let boardDirty = true;
const splats = [];

function drawWood(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  const plank = Math.max(110, w / 5);
  const tones = ["#8a5a2e", "#7d5128", "#946236", "#835529"];
  for (let i = 0, x = 0; x < w; i++, x += plank) {
    ctx.fillStyle = tones[i % tones.length];
    ctx.fillRect(x, 0, plank, h);
    ctx.strokeStyle = "rgba(50,28,10,0.18)";
    ctx.lineWidth = 1.5;
    for (let g = 0; g < 14; g++) {
      const gx = x + Math.random() * plank;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      for (let y = 0; y <= h; y += 40) ctx.lineTo(gx + Math.sin(y * 0.01 + g) * 6, y);
      ctx.stroke();
    }
    for (let k = 0; k < 2; k++) {
      ctx.fillStyle = "rgba(60,32,12,0.35)";
      ctx.beginPath();
      ctx.ellipse(x + Math.random() * plank, Math.random() * h, 8 + Math.random() * 10, 5 + Math.random() * 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(30,15,5,0.55)";
    ctx.fillRect(x, 0, 4, h);
  }
  const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
  return c;
}

function addSplat(px, py, radius, color) {
  const blobs = [[0, 0, radius]];
  for (let i = 0; i < 7; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = radius * rand(0.5, 1.3);
    blobs.push([Math.cos(a) * d, Math.sin(a) * d, radius * rand(0.15, 0.4)]);
  }
  splats.push({ x: px, y: py, color, blobs, born: state.time });
  if (splats.length > 24) splats.shift();
  boardDirty = true;
}

// Repainting the whole board is costly on slow phones, and splats fade over seconds, so the board
// is repainted at once when a splat lands but only every BOARD_FADE_STEP seconds while they fade.
const BOARD_FADE_STEP = 0.08;
let boardPaintedAt = -Infinity;

function drawBoard() {
  if (!woodCanvas) return; // no wood until the page has a size
  if (!boardDirty && (!splats.length || state.time - boardPaintedAt < BOARD_FADE_STEP)) return;
  boardPaintedAt = state.time;
  board.setTransform(1, 0, 0, 1, 0, 0);
  board.drawImage(woodCanvas, 0, 0);
  board.setTransform(canvasScale, 0, 0, canvasScale, 0, 0);
  for (let i = splats.length - 1; i >= 0; i--) {
    const s = splats[i];
    const age = state.time - s.born;
    if (age > SPLAT_LIFE) {
      splats.splice(i, 1); // this paint leaves it out
      continue;
    }
    board.globalAlpha = 0.55 * (1 - age / SPLAT_LIFE);
    board.fillStyle = s.color;
    for (const [dx, dy, r] of s.blobs) {
      board.beginPath();
      board.arc(s.x + dx, s.y + dy, r, 0, Math.PI * 2);
      board.fill();
    }
  }
  board.globalAlpha = 1;
  boardDirty = false;
}

// ---------- Fruit ----------
function texture(size, draw) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d"), size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Skins wrap round the fruit (u runs round the middle); flesh is drawn as a disc for the cut face.
const skins = {
  stripes: (base, stripe) => texture(256, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = stripe;
    for (let i = 0; i < 10; i++) {
      const x0 = (i / 10) * s;
      ctx.beginPath();
      for (let y = 0; y <= s; y += 8) ctx.lineTo(x0 + Math.sin(y * 0.08 + i) * 5, y);
      for (let y = s; y >= 0; y -= 8) ctx.lineTo(x0 + 9 + Math.sin(y * 0.08 + i + 1) * 5, y);
      ctx.fill();
    }
  }),
  dimpled: (base, light, dark) => texture(256, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? light : dark;
      ctx.beginPath();
      ctx.arc(Math.random() * s, Math.random() * s, rand(0.8, 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }),
  speckled: (top, bottom, speck) => texture(256, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, 0, s);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = speck;
    for (let i = 0; i < 260; i++) ctx.fillRect(Math.random() * s, Math.random() * s, 1.5, 1.5);
  }),
  fuzzy: (base, fuzz) => texture(256, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = fuzz;
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + rand(-2, 2), y + rand(1, 4));
      ctx.stroke();
    }
  }),
};

const flesh = {
  // rings: [radius as a fraction of the disc, colour] drawn from the outside in.
  rings: (rings, extra) => texture(256, (ctx, s) => {
    const c = s / 2;
    for (const [r, color] of rings) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(c, c, r * c, 0, Math.PI * 2);
      ctx.fill();
    }
    if (extra) extra(ctx, c);
  }),
};

const seedsRing = (count, radius, size, color) => (ctx, c) => {
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand(-0.1, 0.1);
    ctx.save();
    ctx.translate(c + Math.cos(a) * radius * c, c + Math.sin(a) * radius * c);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * c * 1.6, size * c, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

const segments = (count, inner, outer, color) => (ctx, c) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = c * 0.03;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * inner * c, c + Math.sin(a) * inner * c);
    ctx.lineTo(c + Math.cos(a) * outer * c, c + Math.sin(a) * outer * c);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(c, c, inner * c, 0, Math.PI * 2);
  ctx.fill();
};

const FRUITS = [
  {
    name: "watermelon",
    r: 1.3,
    scale: [1.18, 1, 1],
    juice: "#e8364a",
    skin: skins.stripes("#3f9a45", "#1f6327"),
    flesh: flesh.rings([[1, "#2f7a35"], [0.93, "#e9f3d2"], [0.86, "#ee3a4c"]], seedsRing(10, 0.5, 0.05, "#1a1010")),
  },
  {
    name: "orange",
    r: 0.92,
    juice: "#ff9a1f",
    skin: skins.dimpled("#ff8d1c", "rgba(255,190,100,0.6)", "rgba(200,90,10,0.5)"),
    flesh: flesh.rings([[1, "#ff8d1c"], [0.9, "#fff3d6"], [0.84, "#ffab3a"]], segments(10, 0.1, 0.84, "#fff1d0")),
  },
  {
    name: "apple",
    r: 0.88,
    juice: "#f3e3a6",
    stem: true,
    skin: skins.speckled("#e0362e", "#a3171a", "rgba(255,220,120,0.5)"),
    flesh: flesh.rings([[1, "#c62828"], [0.94, "#fbf2cf"]], seedsRing(5, 0.18, 0.06, "#5b3416")),
  },
  {
    name: "lemon",
    r: 0.8,
    scale: [1.28, 0.95, 0.95],
    juice: "#f5df3c",
    skin: skins.dimpled("#f6d834", "rgba(255,240,140,0.6)", "rgba(190,150,20,0.45)"),
    flesh: flesh.rings([[1, "#f6d834"], [0.9, "#fffbe6"], [0.84, "#f9e76a"]], segments(9, 0.1, 0.84, "#fffbe6")),
  },
  {
    name: "kiwi",
    r: 0.78,
    scale: [1.15, 1, 1],
    juice: "#8fd14f",
    skin: skins.fuzzy("#7a5532", "rgba(160,120,70,0.6)"),
    flesh: flesh.rings([[1, "#6b4a2c"], [0.94, "#76c043"], [0.3, "#f2f5c8"]], seedsRing(18, 0.38, 0.035, "#1c1a12")),
  },
  {
    name: "plum",
    r: 0.78,
    juice: "#b8336a",
    skin: skins.speckled("#7b2f8f", "#4c1a5e", "rgba(220,200,240,0.45)"),
    flesh: flesh.rings([[1, "#5c1f6e"], [0.93, "#f4b740"], [0.3, "#8a4a1e"]]),
  },
];
for (const def of FRUITS) {
  def.skinMat = new THREE.MeshStandardMaterial({ map: def.skin, roughness: 0.45 });
  // The flesh glows a little so a cut face never looks grey when it turns away from the light.
  def.fleshMat = new THREE.MeshStandardMaterial({ map: def.flesh, roughness: 0.6, emissive: 0xffffff, emissiveMap: def.flesh, emissiveIntensity: 0.45 });
  def.scaleVec = new THREE.Vector3(...(def.scale || [1, 1, 1]));
}

const sphereGeo = new THREE.SphereGeometry(1, 28, 18);
const halfGeo = new THREE.SphereGeometry(1, 28, 12, 0, Math.PI); // the z >= 0 half of a sphere
const capGeo = new THREE.CircleGeometry(1, 28).rotateY(Math.PI); // closes a half, facing -z
const stemGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.38, 6).translate(0, 1.12, 0);
const leafGeo = new THREE.SphereGeometry(0.22, 8, 6).scale(1, 0.35, 0.6).translate(0.2, 1.15, 0);
const stemMat = new THREE.MeshStandardMaterial({ color: 0x5b3416, roughness: 0.8 });
const leafMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.6 });

function makeFruitMesh(def) {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(sphereGeo, def.skinMat));
  if (def.stem) group.add(new THREE.Mesh(stemGeo, stemMat), new THREE.Mesh(leafGeo, leafMat));
  return group;
}

// Half a fruit: the skin of one hemisphere plus the flesh disc that closes it.
function makeHalf(def, flipped) {
  const group = new THREE.Group();
  const inner = new THREE.Group();
  inner.add(new THREE.Mesh(halfGeo, def.skinMat), new THREE.Mesh(capGeo, def.fleshMat));
  if (flipped) inner.rotation.y = Math.PI;
  inner.scale.copy(def.scaleVec);
  group.add(inner);
  return group;
}

// ---------- Bombs ----------
const bombGeo = new THREE.SphereGeometry(0.85, 24, 16);
const bombMat = new THREE.MeshStandardMaterial({ color: 0x1d1d24, roughness: 0.35, metalness: 0.4 });
// A pulsing red glow behind every bomb, so it reads as danger at a glance.
const haloMat = new THREE.SpriteMaterial({
  map: texture(128, (ctx, size) => {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,60,40,1)");
    g.addColorStop(0.45, "rgba(255,40,30,0.55)");
    g.addColorStop(1, "rgba(255,30,20,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }),
  transparent: true,
  depthWrite: false,
});
const bombCapGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.2, 10).translate(0, 0.86, 0);
const bombCapMat = new THREE.MeshStandardMaterial({ color: 0x8a8a92, roughness: 0.4, metalness: 0.7 });
const fuseGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.42, 5).rotateZ(-0.5).translate(0.1, 1.1, 0);
const fuseMat = new THREE.MeshStandardMaterial({ color: 0x8b6a3e, roughness: 0.9 });
const sparkGeo = new THREE.IcosahedronGeometry(0.16, 0);
const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffd36b });

function makeBombMesh() {
  const group = new THREE.Group();
  const spark = new THREE.Mesh(sparkGeo, sparkMat);
  spark.position.set(0.22, 1.3, 0);
  const halo = new THREE.Sprite(haloMat);
  halo.scale.setScalar(3.4);
  halo.position.z = -1;
  group.add(halo,new THREE.Mesh(bombGeo, bombMat), new THREE.Mesh(bombCapGeo, bombCapMat), new THREE.Mesh(fuseGeo, fuseMat), spark);
  group.userData.spark = spark;
  return group;
}

// ---------- Juice droplets ----------
// One instanced mesh of droplets: a single draw call however many fly. Live droplets are kept
// packed at the front, so each frame only touches the ones in the air.
const MAX_DROPS = 320;
const drops = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.11, 0), new THREE.MeshBasicMaterial({ color: 0xffffff }), MAX_DROPS);
drops.frustumCulled = false;
drops.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
drops.count = 0;
scene.add(drops);
const drop = {
  x: new Float32Array(MAX_DROPS),
  y: new Float32Array(MAX_DROPS),
  vx: new Float32Array(MAX_DROPS),
  vy: new Float32Array(MAX_DROPS),
  life: new Float32Array(MAX_DROPS),
  maxLife: new Float32Array(MAX_DROPS),
  size: new Float32Array(MAX_DROPS),
  count: 0,
};
const dropColor = new THREE.Color();
for (let i = 0; i < MAX_DROPS; i++) drops.setColorAt(i, dropColor.set(0xffffff));

function burst(x, y, color, count, speed, size = 1) {
  dropColor.set(color);
  for (let n = 0; n < count && drop.count < MAX_DROPS; n++) {
    const i = drop.count++;
    const a = Math.random() * Math.PI * 2;
    const v = speed * rand(0.3, 1);
    drop.x[i] = x;
    drop.y[i] = y;
    drop.vx[i] = Math.cos(a) * v;
    drop.vy[i] = Math.sin(a) * v + speed * 0.3;
    drop.maxLife[i] = drop.life[i] = rand(0.35, 0.75);
    drop.size[i] = size * rand(0.6, 1.4);
    drops.setColorAt(i, dropColor);
  }
  drops.instanceColor.needsUpdate = true;
}

// Moves droplet `from` into slot `to`, colour included.
function moveDrop(from, to) {
  for (const k of ["x", "y", "vx", "vy", "life", "maxLife", "size"]) drop[k][to] = drop[k][from];
  drops.setColorAt(to, drops.getColorAt(from, dropColor));
}

function updateDrops(dt) {
  if (!drop.count && !drops.count) return;
  const m = drops.instanceMatrix.array;
  let recoloured = false;
  for (let i = 0; i < drop.count; i++) {
    drop.life[i] -= dt;
    if (drop.life[i] <= 0) {
      // Fill the gap with the last live droplet, then look at this slot again.
      const last = --drop.count;
      if (i < last) {
        moveDrop(last, i);
        recoloured = true;
      }
      i--;
      continue;
    }
    drop.vy[i] -= GRAVITY * 0.8 * dt;
    drop.x[i] += drop.vx[i] * dt;
    drop.y[i] += drop.vy[i] * dt;
    // A droplet is only ever scaled and moved, so write its matrix directly.
    const s = drop.size[i] * (drop.life[i] / drop.maxLife[i]);
    const o = i * 16;
    m[o] = m[o + 5] = m[o + 10] = s;
    m[o + 12] = drop.x[i];
    m[o + 13] = drop.y[i];
    m[o + 14] = 0.5;
  }
  drops.count = drop.count;
  drops.instanceMatrix.needsUpdate = true;
  if (recoloured) drops.instanceColor.needsUpdate = true;
}

// ---------- State ----------
function loadBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be unavailable (private mode); the best score just won't persist.
  }
}

const state = {
  mode: "ready", // ready | playing | paused | exploding | over
  time: 0,
  elapsed: 0,
  score: 0,
  best: loadBest(),
  lives: START_LIVES,
  stage: 0,
  plan: [], // waves left in this stage, ending with its finale
  waveIn: 0.8,
  combo: 0,
  lastCut: -1,
  comboAt: { x: 0, y: 0 },
  shake: 0,
  flash: 0,
  overTimer: 0,
  newBest: false,
};
const flying = []; // whole fruit and bombs in the air
const halves = []; // cut fruit halves falling away
const queue = []; // launches scheduled within the current wave
const soundAt = { toss: -1, slice: -1 }; // when each sound last played, to avoid stacking them

// 0 on stage 1, rising to 1 on MAX_STAGE and staying there.
const stageDifficulty = () => clamp((state.stage - 1) / (MAX_STAGE - 1), 0, 1);

// ---------- Launching ----------
// Everything is thrown up from below the screen in an arc that peaks inside it. Positions are
// fractions of the visible half-width and half-height: x and targetX run from -1 (left edge) to
// 1 (right edge), apex from -1 (bottom) to 1 (top). Free fruit costs no life if it's dropped.
function launch(kind, { x = rand(-0.7, 0.7), apex = rand(0.15, 0.72), targetX = rand(-0.5, 0.5), free = false } = {}) {
  const s = view.sizeScale;
  x *= view.halfW;
  targetX *= view.halfW;
  const y = -view.halfH - 1.6;
  const vy = Math.sqrt(2 * GRAVITY * (apex * view.halfH - y));
  const vx = (targetX - x) / ((vy / GRAVITY) * 1.6);
  let item;
  if (kind === "bomb") {
    const group = makeBombMesh();
    group.scale.setScalar(s);
    item = { kind, group, hitR: 0.8 * s };
  } else {
    const def = pick(FRUITS);
    const group = makeFruitMesh(def);
    group.scale.copy(def.scaleVec).multiplyScalar(def.r * s);
    item = { kind, def, group, hitR: def.r * s * ((def.scaleVec.x + def.scaleVec.y) / 2) };
  }
  item.x = x;
  item.y = y;
  item.vx = vx;
  item.vy = vy;
  item.free = free;
  item.group.position.set(x, y, 0);
  if (kind === "bomb") {
    // Bombs only rock from side to side, so the lit fuse always shows.
    item.wobble = Math.random() * 6;
  } else {
    item.spinAxis = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
    item.spinRate = rand(-3, 3);
    item.group.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
  }
  scene.add(item.group);
  flying.push(item);
  if (state.time - soundAt.toss > 0.06) {
    sfx.toss();
    soundAt.toss = state.time;
  }
  return item;
}

// ---------- Waves and stages ----------
// Queues one throw, `delay` seconds from now.
function throwIn(delay, kind, spec) {
  queue.push({ at: state.time + delay, kind, spec });
}

// Spreads `count` bombs across the middle of the board.
const bombSpots = (count) => Array.from({ length: count }, (_, i) => (count === 1 ? rand(-0.4, 0.4) : -0.55 + (1.1 * i) / (count - 1) + rand(-0.08, 0.08)));

// Each wave pattern queues its throws and returns how long it takes to throw them all.
const WAVES = {
  // A few fruit from anywhere, sometimes with a bomb.
  scatter({ bombs = 0 }) {
    const fruit = 1 + Math.floor(Math.random() * (1.8 + stageDifficulty() * 3));
    const kinds = [...Array(fruit).fill("fruit"), ...Array(bombs).fill("bomb")].sort(() => Math.random() - 0.5);
    let t = 0;
    for (const kind of kinds) {
      throwIn(t, kind);
      t += rand(0.08, 0.22);
    }
    return t;
  },

  // Lots of fruit thrown up together so they bunch near the top, where one long swipe gets them
  // all. Any bombs fly lower and a beat later, so a swipe along the top passes over them.
  volley({ bombs = 0, count, free = false, start = 0 }) {
    const n = count ?? 4 + Math.round(stageDifficulty() * 3 + Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const x = -0.75 + (1.5 * (i + 0.5)) / n + rand(-0.06, 0.06);
      throwIn(start + i * 0.04, "fruit", { x, apex: rand(0.45, 0.8), targetX: x * 0.6, free });
    }
    bombSpots(bombs).forEach((x, i) => throwIn(start + 0.3 + i * 0.05, "bomb", { x, apex: rand(-0.35, 0), targetX: x * 0.6 }));
    return start + 0.45;
  },

  // A line of fruit thrown one after another from one side to the other, to cut in one sweep. A
  // bomb hidden in the line flies lower than the fruit, so sweep over it.
  stream({ bombs = 0 }) {
    const d = stageDifficulty();
    const n = 5 + Math.round(d * 3);
    const dir = Math.random() < 0.5 ? 1 : -1;
    const apex = rand(0.35, 0.65);
    const step = 0.13 - d * 0.03;
    const bombAt = bombs ? 1 + Math.floor(Math.random() * (n - 2)) : -1; // never first or last
    for (let i = 0; i < n; i++) {
      const x = dir * (-0.8 + (1.6 * i) / (n - 1));
      if (i === bombAt) throwIn(i * step, "bomb", { x, apex: apex - 0.6, targetX: x });
      else throwIn(i * step, "fruit", { x, apex, targetX: x });
    }
    return n * step;
  },

  // Fruit thrown in from both sides at once, crossing in the middle.
  crossfire({ bombs = 0 }) {
    const pairs = 2 + Math.round(stageDifficulty() * 2);
    for (let i = 0; i < pairs; i++) {
      const apex = rand(0.25, 0.7);
      throwIn(i * 0.35, "fruit", { x: -0.9, apex, targetX: 0.7 });
      throwIn(i * 0.35 + 0.05, "fruit", { x: 0.9, apex: apex + rand(-0.15, 0.15), targetX: -0.7 });
    }
    bombSpots(bombs).forEach((x, i) => throwIn(0.6 + i * 0.4, "bomb", { x, apex: rand(-0.4, -0.1), targetX: x }));
    return pairs * 0.35;
  },

  // Finale of odd stages: fruit pours in from both sides for a few seconds, with no bombs.
  frenzy() {
    banner("Fruit frenzy!");
    sfx.combo(5);
    const end = 0.9 + 4 + Math.min(state.stage, 6) * 0.5;
    let t = 0.9;
    let side = 1;
    while (t < end) {
      throwIn(t, "fruit", { x: side * rand(0.5, 0.9), apex: rand(0.1, 0.8), targetX: -side * rand(0, 0.6), free: true });
      side = -side;
      t += rand(0.1, 0.18);
    }
    return t;
  },

  // Finale of even stages: big volleys of fruit with a few bombs flying among them.
  storm() {
    banner("Fruit storm!");
    sfx.combo(4);
    const d = stageDifficulty();
    const volleys = 2 + Math.round(d);
    let t = 0.9;
    for (let v = 0; v < volleys; v++) {
      const bombs = 2 + (d > 0.6 && v === volleys - 1 ? 1 : 0);
      WAVES.volley({ count: 7 + Math.round(d * 3), bombs, free: true, start: t });
      t += 1.6 - d * 0.3;
    }
    return t;
  },
};

// A stage is a run of ordinary waves that builds to a finale: a fruit frenzy on odd stages and a
// fruit storm on even ones. Dropped fruit costs no life during a finale, but its bombs still do.
function planStage() {
  const n = state.stage;
  const d = stageDifficulty();
  const types = n === 1 ? ["scatter", "scatter", "volley", "stream"] : ["scatter", "volley", "stream", "crossfire"];
  const plan = [];
  for (let i = 0; i < 5 + Math.min(n, 4); i++) {
    const type = pick(types);
    // Stage 1 eases in: no bombs at all for its first few waves.
    const bombChance = n === 1 ? (i >= 3 ? 0.15 : 0) : 0.2 + d * 0.3;
    const bombs = Math.random() < bombChance ? (d > 0.5 && type !== "stream" && Math.random() < 0.35 ? 2 : 1) : 0;
    plan.push({ type, bombs, gap: 1.6 - d * 0.7 + rand(0, 0.4) });
  }
  plan.push({ type: n % 2 ? "frenzy" : "storm", gap: STAGE_BREATHER });
  return plan;
}

function startStage() {
  state.stage += 1;
  state.plan = planStage();
  banner(`Stage ${state.stage}`);
  if (state.stage > 1) sfx.start();
  state.waveIn = 1.3; // a moment to read the banner
}

function nextWave() {
  if (!state.plan.length) return startStage();
  const wave = state.plan.shift();
  state.waveIn = WAVES[wave.type](wave) + wave.gap;
}

function banner(text) {
  document.querySelectorAll(".banner").forEach((el) => el.remove());
  const el = document.createElement("div");
  el.className = "banner";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1700);
}

// ---------- Slicing ----------
function distanceToSegment(px, py, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  const t = len2 ? clamp(((px - a.x) * dx + (py - a.y) * dy) / len2, 0, 1) : 0;
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
}

const bladeDir = new THREE.Vector3();

// Cuts everything the blade crossed between world points a and b during dt seconds.
function sliceAlong(a, b, dt) {
  if (state.mode !== "playing") return;
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  if (length / Math.max(dt, 1e-3) < MIN_SLICE_SPEED) return;
  bladeDir.set(b.x - a.x, b.y - a.y, 0).normalize();
  // Backwards, since cutting takes fruit out of the list.
  for (let i = flying.length - 1; i >= 0; i--) {
    const item = flying[i];
    if (distanceToSegment(item.x, item.y, a, b) > item.hitR) continue;
    if (item.kind === "bomb") return explode(item);
    cut(item, bladeDir);
  }
}

function removeFlying(item) {
  scene.remove(item.group);
  flying.splice(flying.indexOf(item), 1);
}

function cut(item, dir) {
  removeFlying(item);
  const { def } = item;
  // The halves split along the blade's path and swing open toward the camera to show the flesh.
  const normal = new THREE.Vector3(-dir.y, dir.x, 0);
  const align = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  for (const side of [1, -1]) {
    const group = makeHalf(def, side < 0);
    group.quaternion.copy(align);
    group.scale.setScalar(def.r * view.sizeScale);
    group.position.copy(item.group.position);
    scene.add(group);
    halves.push({
      group,
      x: item.x,
      y: item.y,
      vx: item.vx * 0.6 + normal.x * side * 3.2,
      vy: Math.max(item.vy * 0.5, 0) + normal.y * side * 3.2 + 1.5,
      axis: dir.clone(),
      rate: -side * rand(4, 6),
      tumble: new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize(),
    });
  }
  burst(item.x, item.y, def.juice, 22, 6 * view.sizeScale, view.sizeScale);
  const screen = worldToScreen(item.x, item.y);
  const screenR = Math.abs(worldToScreen(item.x + item.hitR, item.y).x - screen.x);
  addSplat(screen.x, screen.y, screenR * 1.1, def.juice);
  // Many fruit cut in one swipe share one slice sound; stacking them only costs audio work.
  if (state.time - soundAt.slice > 0.04) {
    sfx.slice();
    soundAt.slice = state.time;
  }

  state.score += 1;
  if (state.time - state.lastCut > COMBO_WINDOW) finishCombo();
  state.combo += 1;
  state.lastCut = state.time;
  state.comboAt = screen;
  updateHud();
}

// Three or more fruit in one swipe: bonus points equal to the number cut.
function finishCombo() {
  if (state.combo >= 3) {
    state.score += state.combo;
    popup(`${state.combo} fruit combo! +${state.combo}`, state.comboAt.x, state.comboAt.y);
    sfx.combo(state.combo);
    updateHud();
  }
  state.combo = 0;
}

function popup(text, x, y) {
  const el = document.createElement("div");
  el.className = "combo";
  el.textContent = text;
  el.style.top = `${clamp(y, 80, window.innerHeight - 40)}px`;
  document.body.appendChild(el);
  // Centred on x, but kept whole on screen however wide the text is.
  const half = el.offsetWidth / 2 + 10;
  el.style.left = `${clamp(x, half, Math.max(half, window.innerWidth - half))}px`;
  setTimeout(() => el.remove(), 1200);
}

// ---------- Losing ----------
function explode(bomb) {
  removeFlying(bomb);
  burst(bomb.x, bomb.y, "#2b2b2b", 60, 12, 1.6);
  burst(bomb.x, bomb.y, "#ff9a2e", 50, 10, 1.3);
  state.mode = "exploding";
  state.overTimer = 1.1;
  state.flash = 1;
  state.shake = 1;
  finishCombo();
  sfx.explode();
  stopMusic();
  setFuse(0);
  ui.pause.hidden = true;
}

function miss() {
  state.lives -= 1;
  sfx.miss();
  updateHud();
  if (state.lives <= 0) gameOver();
}

function gameOver() {
  state.mode = "over";
  stopMusic();
  setFuse(0);
  finishCombo();
  if (state.score > state.best) {
    state.best = state.score;
    state.newBest = true;
    saveBest(state.best);
  }
  ui.pause.hidden = true;
  updateHud();
  showOverlay(state.newBest ? "New best!" : "Game over", `Score ${state.score} · Stage ${state.stage}`, "Play again");
  if (state.newBest) sfx.newBest();
  else sfx.gameOver();
}

// ---------- UI ----------
const ui = {
  scores: document.getElementById("scores"),
  score: document.getElementById("score"),
  best: document.getElementById("best"),
  lives: document.getElementById("lives"),
  pause: document.getElementById("pause"),
  sound: document.getElementById("sound"),
  overlay: document.getElementById("overlay"),
  title: document.getElementById("title"),
  message: document.getElementById("message"),
  play: document.getElementById("play"),
  controls: document.getElementById("controls"),
  flash: document.getElementById("flash"),
};

ui.controls.textContent = isTouch
  ? "Swipe across the fruit to slice it."
  : "Hold the mouse button and swipe to slice. P to pause, M to mute.";

function updateHud() {
  ui.score.textContent = state.score;
  ui.best.textContent = state.best;
  [...ui.lives.children].forEach((x, i) => x.classList.toggle("lost", i < START_LIVES - state.lives));
}

function showOverlay(title, message, button) {
  ui.title.textContent = title;
  ui.message.textContent = message;
  ui.play.textContent = button;
  ui.overlay.hidden = false;
}

function clearField() {
  for (const item of flying) scene.remove(item.group);
  for (const h of halves) scene.remove(h.group);
  flying.length = 0;
  halves.length = 0;
  queue.length = 0;
  document.querySelectorAll(".banner").forEach((el) => el.remove());
}

function startGame() {
  unlockAudio();
  clearField();
  Object.assign(state, { mode: "playing", elapsed: 0, score: 0, lives: START_LIVES, stage: 0, plan: [], waveIn: 0.6, combo: 0, lastCut: -1, newBest: false });
  ui.overlay.hidden = true;
  ui.scores.hidden = false;
  ui.lives.hidden = false;
  ui.pause.hidden = false;
  updateHud();
  sfx.start();
  startMusic({ fromTop: true });
}

function togglePause() {
  if (state.mode === "playing") {
    state.mode = "paused";
    stopMusic();
    setFuse(0);
    showOverlay("Paused", `Score ${state.score} · Stage ${state.stage}`, "Resume");
  } else if (state.mode === "paused") {
    state.mode = "playing";
    ui.overlay.hidden = true;
    startMusic();
  }
}

function updateSoundButton() {
  ui.sound.textContent = isMuted() ? "🔇" : "🔊";
  ui.sound.setAttribute("aria-label", isMuted() ? "Unmute" : "Mute");
}

function toggleSound() {
  unlockAudio();
  setMuted(!isMuted());
  updateSoundButton();
}

updateSoundButton();
updateHud();
ui.play.addEventListener("click", () => {
  unlockAudio();
  sfx.click();
  if (state.mode === "paused") togglePause();
  else startGame();
});
ui.pause.addEventListener("click", togglePause);
ui.sound.addEventListener("click", toggleSound);
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.mode === "playing") togglePause();
});
window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  unlockAudio();
  const k = e.key;
  if (k === "m" || k === "M") return toggleSound();
  if (k === "p" || k === "P" || k === "Escape") return togglePause();
  if ((k === " " || k === "Enter") && (state.mode === "ready" || state.mode === "over")) {
    e.preventDefault();
    startGame();
  }
});

// ---------- The blade ----------
// Hold and drag (finger, pen or mouse). Each move cuts along the segment from the last point.
const trailPoints = [];
let blade = null;
let lastSwish = 0;

canvas.addEventListener("pointerdown", (e) => {
  unlockAudio();
  blade = { id: e.pointerId, at: screenToWorld(e.clientX, e.clientY), t: performance.now() / 1000 };
  trailPoints.length = 0;
  trailPoints.push({ x: e.clientX, y: e.clientY, t: state.time });
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch {
    // Some webviews refuse capture; slicing still works while the finger stays on the canvas.
  }
});

canvas.addEventListener("pointermove", (e) => {
  if (!blade || e.pointerId !== blade.id) return;
  const now = performance.now() / 1000;
  const to = screenToWorld(e.clientX, e.clientY);
  const dt = now - blade.t;
  const speed = blade.at.distanceTo(to) / Math.max(dt, 1e-3);
  sliceAlong(blade.at, to, dt);
  if (speed > MIN_SLICE_SPEED * 2 && now - lastSwish > 0.18) {
    sfx.swish();
    lastSwish = now;
  }
  blade.at = to;
  blade.t = now;
  trailPoints.push({ x: e.clientX, y: e.clientY, t: state.time });
});

const endBlade = (e) => {
  if (blade && e.pointerId === blade.id) blade = null;
};
canvas.addEventListener("pointerup", endBlade);
canvas.addEventListener("pointercancel", endBlade);

let trailShown = false;

// The blade: a soft blue glow under a bright core, thickest at the newest end. The glow is a wide,
// faint stroke rather than a canvas shadowBlur, which looks much the same and costs far less.
function drawTrail() {
  while (trailPoints.length && state.time - trailPoints[0].t > TRAIL_LIFE) trailPoints.shift();
  if (trailPoints.length < 2 && !trailShown) return; // nothing on screen, nothing to clear
  trail.setTransform(1, 0, 0, 1, 0, 0);
  trail.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  trailShown = trailPoints.length >= 2;
  if (!trailShown) return;
  trail.setTransform(canvasScale, 0, 0, canvasScale, 0, 0);
  trail.lineCap = "round";
  trail.lineJoin = "round";
  // The glow is one continuous stroke (separate see-through pieces would bead where they overlap),
  // fading in from the tail to the blade.
  const tail = trailPoints[0];
  const head = trailPoints[trailPoints.length - 1];
  const fade = trail.createLinearGradient(tail.x, tail.y, head.x, head.y);
  fade.addColorStop(0, "rgba(170,225,255,0)");
  fade.addColorStop(1, "rgba(170,225,255,0.32)");
  trail.strokeStyle = fade;
  trail.lineWidth = 26;
  trail.beginPath();
  trail.moveTo(tail.x, tail.y);
  for (const p of trailPoints) trail.lineTo(p.x, p.y);
  trail.stroke();
  // The bright core tapers, so it's drawn piece by piece.
  for (let i = 1; i < trailPoints.length; i++) {
    const a = trailPoints[i - 1];
    const b = trailPoints[i];
    const f = i / trailPoints.length;
    trail.strokeStyle = `rgba(255,255,255,${0.35 + f * 0.65})`;
    trail.lineWidth = 1.5 + f * 9;
    trail.beginPath();
    trail.moveTo(a.x, a.y);
    trail.lineTo(b.x, b.y);
    trail.stroke();
  }
}

// ---------- Update ----------
function updateFlying(dt) {
  let bombs = 0;
  // Backwards, since fruit that falls off the board is taken out of the list.
  for (let i = flying.length - 1; i >= 0; i--) {
    const item = flying[i];
    item.vy -= GRAVITY * dt;
    item.x += item.vx * dt;
    item.y += item.vy * dt;
    item.group.position.set(item.x, item.y, 0);
    if (item.kind === "bomb") {
      bombs++;
      item.wobble += dt * 5;
      item.group.rotation.set(0.25, 0, Math.sin(item.wobble) * 0.35);
      item.group.userData.spark.scale.setScalar(0.7 + Math.random() * 0.8);
    } else {
      item.group.rotateOnWorldAxis(item.spinAxis, item.spinRate * dt);
    }
    if (item.y < -view.halfH - 3 && item.vy < 0) {
      removeFlying(item);
      if (item.kind === "fruit" && !item.free && state.mode === "playing") miss();
    }
  }
  setFuse(state.mode === "playing" && bombs ? 1 : 0);
  // Every bomb glows a pulsing red, like it's about to go.
  if (bombs) haloMat.opacity = 0.6 + Math.sin(state.time * 10) * 0.3;
}

function updateHalves(dt) {
  for (let i = halves.length - 1; i >= 0; i--) {
    const h = halves[i];
    h.vy -= GRAVITY * dt;
    h.x += h.vx * dt;
    h.y += h.vy * dt;
    h.group.position.set(h.x, h.y, 0);
    h.group.rotateOnWorldAxis(h.axis, h.rate * dt);
    h.group.rotateOnWorldAxis(h.tumble, 1.2 * dt);
    if (h.y < -view.halfH - 4) {
      scene.remove(h.group);
      halves.splice(i, 1);
    }
  }
}

function update(dt) {
  state.time += dt;
  if (state.mode !== "paused") {
    if (state.mode === "playing") {
      state.elapsed += dt;
      state.waveIn -= dt;
      if (state.waveIn <= 0) nextWave();
    } else if (state.mode === "ready" || state.mode === "over") {
      // Behind the title and game-over cards, keep a little fruit flying for show.
      state.waveIn -= dt;
      if (state.waveIn <= 0) {
        launch("fruit");
        state.waveIn = rand(1.1, 2);
      }
    }
    for (let i = queue.length - 1; i >= 0; i--) {
      if (queue[i].at > state.time) continue;
      if (state.mode === "playing") launch(queue[i].kind, queue[i].spec);
      queue.splice(i, 1);
    }
    updateFlying(dt);
    updateHalves(dt);
    updateDrops(dt);
    if (state.combo && state.time - state.lastCut > COMBO_WINDOW) finishCombo();
    if (state.mode === "exploding") {
      state.overTimer -= dt;
      if (state.overTimer <= 0) gameOver();
    }
  }
  state.flash = Math.max(0, state.flash - dt * 2.5);
  ui.flash.style.opacity = state.flash;
  state.shake = Math.max(0, state.shake - dt * 2);
  camera.position.x = (Math.random() - 0.5) * state.shake * 0.8;
  camera.position.y = (Math.random() - 0.5) * state.shake * 0.8;
  drawBoard();
  drawTrail();
}

// ---------- Layout ----------
function resize(w = window.innerWidth, h = window.innerHeight) {
  if (!w || !h) return; // hidden or not laid out yet: keep the last good size
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  view.halfH = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  view.halfW = view.halfH * camera.aspect;
  view.sizeScale = clamp(view.halfW / 9, 0.62, 1);
  canvasScale = Math.min(window.devicePixelRatio, 1.5);
  const cw = Math.round(w * canvasScale);
  const ch = Math.round(h * canvasScale);
  if (cw === boardCanvas.width && ch === boardCanvas.height && woodCanvas) return;
  // Resizing a canvas wipes it, so repaint the board straight away rather than on the next frame.
  for (const c of [boardCanvas, trailCanvas]) {
    c.width = cw;
    c.height = ch;
  }
  woodCanvas = drawWood(cw, ch);
  boardDirty = true;
  drawBoard();
}

window.addEventListener("resize", () => resize());
document.addEventListener("visibilitychange", () => resize());
resize();

// Opened from the game page's Play button: that was the player's "play", so skip the title card.
// Where the browser holds sound back until a tap inside the game, the first swipe unlocks it.
if (new URLSearchParams(location.search).has("autostart")) startGame();

// The normal loop can be held while a test drives the game frame by frame.
let loopHeld = false;

// Local testing hook: drive the game without relying on animation frames.
if (location.hostname === "localhost") {
  window.fruitSlash = {
    state,
    flying,
    halves,
    queue,
    WAVES,
    planStage,
    startStage,
    nextWave,
    view,
    launch,
    sliceAlong,
    worldToScreen,
    screenToWorld,
    startGame,
    renderer,
    scene,
    camera,
    resize,
    holdLoop: (held) => (loopHeld = held),
    step: (dt) => update(dt),
    render: () => renderer.render(scene, camera),
  };
}

// ---------- Keeping up on slow devices ----------
// If frames keep arriving slower than about 45 a second during play, render fewer pixels: the
// resolution steps down a quarter at a time, to no less than one pixel per CSS pixel.
const frameRate = { avg: 1 / 60, slowFor: 0 };

function watchFrameRate(seconds) {
  if (state.mode !== "playing" || seconds > 0.25) return; // a hidden tab or a pause isn't slowness
  frameRate.avg += (seconds - frameRate.avg) * 0.1;
  frameRate.slowFor = frameRate.avg > 1 / 45 ? frameRate.slowFor + seconds : 0;
  if (frameRate.slowFor > 1.5 && pixelRatio > 1) {
    pixelRatio = Math.max(1, pixelRatio - 0.25);
    renderer.setPixelRatio(pixelRatio);
    frameRate.slowFor = 0;
    frameRate.avg = 1 / 60;
  }
}

// Compile every shader and upload every texture before play, so the first watermelon cut or bomb
// thrown doesn't stall a slow phone for a frame or two.
function warmUp() {
  const warm = new THREE.Group();
  for (const def of FRUITS) warm.add(makeFruitMesh(def), makeHalf(def, false));
  warm.add(makeBombMesh());
  scene.add(warm);
  renderer.compile(scene, camera);
  for (const def of FRUITS) {
    renderer.initTexture(def.skin);
    renderer.initTexture(def.flesh);
  }
  renderer.initTexture(haloMat.map);
  scene.remove(warm);
}
warmUp();

let last = performance.now();
function frame(now) {
  const seconds = (now - last) / 1000;
  last = now;
  if (!loopHeld) {
    watchFrameRate(seconds);
    update(Math.min(seconds, 0.05));
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

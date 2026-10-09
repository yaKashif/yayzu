// Draws Naseeb in 3D with three.js: the jeep, the mountain it climbs (see landscape.js), the sky
// and the country all round (sky.js), what its tires throw up and leave behind, and the forces on
// them. The physics uses three.js's axes, so its positions and orientation go straight in.
import * as THREE from "three";
import { TIRE, CAR, PARTS, WHEELS, SURFACES, MOUNTAIN } from "./physics.js";
import { TIMES, AIR, applyTime, outdoors, drift } from "./atmosphere.js";
import { Landscape } from "./landscape.js";
import { Background } from "./sky.js";
import { Post } from "./post.js";
import { cloudTexture } from "./textures.js";
import { buildBody } from "./body.js";
import { mergeStatic } from "./merge.js";

const R = TIRE.radius;
const RB = TIRE.rimRadius;
const F = TIRE.flangeRadius;
const HALF_WIDTH = TIRE.width / 2;
const TREAD_DEPTH = 0.012;
const TREAD_BLOCKS = 34;
// The default camera: chasing from behind and well above, aimed past the car at the road ahead.
const CHASE = { mode: "chase", yaw: 0, pitch: 0.23, dist: 10.7 };
const CHASE_AHEAD = 5; // metres ahead of the car the chase camera looks
const isTouch = window.matchMedia("(pointer: coarse)").matches;
// Pixels drawn per CSS pixel at most; main.js lowers it while frames run slow (see adaptResolution).
const maxPixelRatio = () => Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2);

// How each surface looks: colours, how glossy it is, what the tire leaves on it and throws up.
const LOOKS = {
  asphalt: { base: "#3e4045", specks: ["#5b5e64", "#2b2c30", "#73767c"], rough: 0.92, bump: 0, mark: [0.08, 0.08, 0.09], chip: "#45474c", throws: "smoke" },
  concrete: { base: "#bcb9b1", specks: ["#a8a59d", "#d3d0c8", "#928f88"], rough: 0.88, bump: 0, mark: [0.16, 0.16, 0.17], chip: "#c4c1b9", throws: "smoke" },
  wet: { base: "#24272c", specks: ["#383c43", "#1b1d21", "#4b5866"], rough: 0.18, bump: 0, mark: [0.05, 0.055, 0.06], chip: "#2f3b4a", throws: "spray" },
  gravel: { base: "#857d71", specks: ["#a69e91", "#6c655b", "#c4bdaf", "#5a544b"], rough: 0.95, bump: 3, mark: [0.27, 0.25, 0.22], chip: "#9a9285", throws: "stones" },
  grass: { base: "#4f8a30", specks: ["#4b872c", "#78b54b", "#3d7225", "#8ec65c"], rough: 0.95, bump: 2, mark: [0.45, 0.62, 0.3], chip: "#5c9739", throws: "grass" },
  sand: { base: "#dcbd87", specks: ["#cfaf78", "#efd7a8", "#c4a26a"], rough: 0.95, bump: 1.2, mark: [0.62, 0.5, 0.32], chip: "#e0c38e", throws: "sand" },
  mud: { base: "#553e2c", specks: ["#473225", "#6e523d", "#3b2a1e"], rough: 0.45, bump: 1.5, mark: [0.16, 0.11, 0.07], chip: "#6b4c36", throws: "mud" },
  snow: { base: "#eef3f8", specks: ["#d9e3ee", "#ffffff", "#c9d7e6"], rough: 0.75, bump: 1, mark: [0.62, 0.68, 0.78], chip: "#e6eef6", throws: "snow" },
  ice: { base: "#b8dcee", specks: ["#d8f0fa", "#a6d2e6", "#ffffff"], rough: 0.06, bump: 0, mark: [0.95, 0.97, 1], chip: "#bfe2f1", throws: "frost" },
  dirt: { base: "#8a6f52", specks: ["#7a6147", "#9c8163", "#6b5440", "#a88d6c"], rough: 0.95, bump: 1.6, mark: [0.34, 0.25, 0.17], chip: "#8a6f52", throws: "dirt" },
  rock: { base: "#8d8a84", specks: ["#7a7771", "#a3a09a", "#68655f", "#b5b2ab"], rough: 0.85, bump: 2, mark: [0.2, 0.2, 0.2], chip: "#8d8a84", throws: "dust" },
  wood: { base: "#6b4a2e", specks: ["#5a3d25", "#7d5838", "#4a311d"], rough: 0.9, bump: 2, mark: [0.25, 0.18, 0.12], chip: "#6b4a2e", throws: "dirt" },
  loose: { base: "#7d6a55", specks: ["#6c5a47", "#8f7c66", "#5b4a3a", "#a3917b"], rough: 0.95, bump: 2, mark: [0.3, 0.23, 0.16], chip: "#7d6a55", throws: "stones" },
  forest: { base: "#3d4a26", specks: ["#4a3a22", "#56632f", "#33401f", "#6b5534", "#2c361a"], rough: 1, bump: 1.5, mark: [0.3, 0.3, 0.2], chip: "#3d4a26", throws: "grass" },
};
export const surfaceColor = (id) => LOOKS[id].chip;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

// ---------- The tire and wheel ----------

const SECTION = R - RB; // the sidewall's height, bead to tread

// The sidewall's face, mapped flat onto both sides of the tire: rubber, a couple of moulded rings,
// and the lettering of a 1970s bias-ply tire.
function sidewallCanvas() {
  const n = 1024;
  const c = makeCanvas(n, n);
  const g = c.getContext("2d");
  const s = n / 2 / R; // pixels a metre
  g.translate(n / 2, n / 2);
  g.fillStyle = "#1c1c20";
  g.fillRect(-n, -n, 2 * n, 2 * n);
  const side = g.createRadialGradient(0, 0, F * s, 0, 0, (R - 0.025) * s);
  side.addColorStop(0, "#2d2d32");
  side.addColorStop(0.55, "#26262a");
  side.addColorStop(1, "#1e1e22");
  g.fillStyle = side;
  g.beginPath();
  g.arc(0, 0, (R - 0.025) * s, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.06)";
  g.lineWidth = 0.002 * s;
  for (const f of [0.25, 0.86]) {
    g.beginPath();
    g.arc(0, 0, (RB + f * SECTION) * s, 0, Math.PI * 2);
    g.stroke();
  }
  const arcText = (text, centre, radius, size, fill, spacing) => {
    g.font = `800 ${size * s}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
    const chars = [...text];
    const widths = chars.map((ch) => g.measureText(ch).width + spacing * s);
    const total = widths.reduce((a, b) => a + b, 0);
    let a = centre - total / (radius * s) / 2;
    g.fillStyle = fill;
    g.textAlign = "center";
    g.textBaseline = "middle";
    chars.forEach((ch, i) => {
      const step = widths[i] / (radius * s);
      g.save();
      g.rotate(a + step / 2);
      g.translate(0, -radius * s);
      g.fillText(ch, 0, 0);
      g.restore();
      a += step;
    });
  };
  const at = RB + 0.55 * SECTION;
  arcText("NASEEB", 0, at, 0.034, "#e9dfcc", 0.006);
  arcText("NASEEB", Math.PI, at, 0.034, "#e9dfcc", 0.006);
  arcText("H78-15  LOAD RANGE C", Math.PI / 2, at, 0.016, "#48484f", 0.002);
  arcText("BIAS PLY  TUBE TYPE", -Math.PI / 2, at, 0.014, "#43434a", 0.002);
  return c;
}

// The tire's cross-section, bead to bead: [radius, across] in metres, revolved round the axle.
// A bias-ply tire's sidewall bulges round to a fairly square shoulder.
function tireProfile() {
  const Rt = R - TREAD_DEPTH;
  const hw = HALF_WIDTH;
  const half = [
    [RB, 0.066],
    [RB + 0.008, 0.074],
    [RB + 0.2 * SECTION, 0.086],
    [RB + 0.4 * SECTION, 0.097],
    [RB + 0.6 * SECTION, hw],
    [RB + 0.78 * SECTION, hw - 0.002],
    [Rt - 0.02, hw - 0.008],
    [Rt - 0.008, hw - 0.016],
    [Rt - 0.002, hw - 0.026],
    [Rt, hw - 0.034],
  ];
  const pts = [];
  for (const [r, x] of half) pts.push(new THREE.Vector2(r, -x));
  for (const [r, x] of half.slice().reverse()) pts.push(new THREE.Vector2(r, x));
  return pts;
}

// A lathe turned so its axis is three.js's x, the axle.
function lathe(points, segments) {
  const geo = new THREE.LatheGeometry(points, segments);
  geo.rotateZ(-Math.PI / 2);
  return geo;
}

function buildWheel(maxAniso) {
  const wheel = new THREE.Group(); // at the hub
  const spinner = new THREE.Group();
  wheel.add(spinner);

  // Tire body, with the sidewall picture projected flat onto both sides.
  const body = lathe(tireProfile(), 128);
  const pos = body.attributes.position;
  const uv = body.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Seen from +x, three.js's +z is to the left, so that side's picture is flipped to read right.
    const u = 0.5 + (x >= 0 ? -z : z) / (2 * R);
    uv.setXY(i, u, 0.5 + y / (2 * R));
  }
  const sideTexture = new THREE.CanvasTexture(sidewallCanvas());
  sideTexture.colorSpace = THREE.SRGBColorSpace;
  sideTexture.anisotropy = maxAniso;
  const rubber = new THREE.MeshStandardMaterial({
    map: sideTexture,
    bumpMap: sideTexture,
    bumpScale: 1.5,
    roughness: 0.82,
    metalness: 0,
    shadowSide: THREE.DoubleSide, // the tire is open on the inside; its shadow shouldn't be
  });
  const tire = new THREE.Mesh(body, rubber);
  tire.name = "tire";
  tire.castShadow = true;
  tire.receiveShadow = true;
  spinner.add(tire);

  // Tread: two staggered rows of chunky blocks either side of a centre groove, and lugs at the
  // shoulders, a period all-terrain pattern.
  const pitch = (Math.PI * 2) / TREAD_BLOCKS;
  const Rt = R - TREAD_DEPTH;
  const tread = new THREE.MeshStandardMaterial({ color: 0x1f1f23, roughness: 0.9 });
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const rows = [
    { lat: -0.03, width: 0.05, offset: 0, yaw: -0.15 },
    { lat: 0.03, width: 0.05, offset: 0.5, yaw: 0.15 },
    { lat: -(HALF_WIDTH - 0.026), width: 0.034, offset: 0.25, yaw: 0 },
    { lat: HALF_WIDTH - 0.026, width: 0.034, offset: 0.75, yaw: 0 },
  ];
  const blockGeo = new THREE.BoxGeometry(1, TREAD_DEPTH + 0.002, Rt * pitch * 0.62);
  const blocks = new THREE.InstancedMesh(blockGeo, tread, TREAD_BLOCKS * rows.length);
  const r = Rt + TREAD_DEPTH / 2 - 0.001;
  let k = 0;
  for (const row of rows) {
    for (let i = 0; i < TREAD_BLOCKS; i++) {
      const a = (i + row.offset) * pitch;
      e.set(a, row.yaw, 0);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(row.lat, r * Math.cos(a), r * Math.sin(a)), q, new THREE.Vector3(row.width, 1, 1));
      blocks.setMatrixAt(k++, m);
    }
  }
  blocks.castShadow = true;
  spinner.add(blocks);

  // The wheel: a pressed-steel 15 x 5.5, painted, its dished centre held by six nuts on a 5.5-inch
  // (139.7 mm) circle, with a small chrome cap.
  const paint = new THREE.MeshStandardMaterial({ color: 0xe6e0d0, metalness: 0.25, roughness: 0.45, side: THREE.DoubleSide });
  const inside = new THREE.MeshStandardMaterial({ color: 0x8c8a84, metalness: 0.4, roughness: 0.6, side: THREE.DoubleSide });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xf2f4f6, metalness: 1, roughness: 0.15 });
  const rimWidth = 0.07; // half of 5.5 inches
  const barrel = [
    [F, -rimWidth - 0.006],
    [F + 0.002, -rimWidth - 0.002],
    [RB + 0.002, -rimWidth + 0.002],
    [RB - 0.006, -rimWidth + 0.016],
    [RB - 0.018, -0.025],
    [RB - 0.018, 0.025],
    [RB - 0.006, rimWidth - 0.016],
    [RB + 0.002, rimWidth - 0.002],
    [F + 0.002, rimWidth + 0.002],
    [F, rimWidth + 0.006],
  ].map(([rr, x]) => new THREE.Vector2(rr, x));
  const rim = new THREE.Mesh(lathe(barrel, 96), inside);
  rim.castShadow = true;
  spinner.add(rim);
  for (const side of [-1, 1]) {
    const lip = new THREE.Mesh(new THREE.TorusGeometry(F - 0.001, 0.004, 10, 96), paint);
    lip.rotation.y = Math.PI / 2;
    lip.position.x = side * (rimWidth + 0.004);
    spinner.add(lip);
  }
  // The centre disc, dished out from the rim to the hub face, on the outside.
  const disc = [
    [RB - 0.018, 0.012],
    [RB - 0.04, 0.016],
    [0.125, 0.03],
    [0.105, 0.045],
    [0.085, 0.048],
    [0.062, 0.048],
    [0.055, 0.04],
  ].map(([rr, x]) => new THREE.Vector2(rr, x));
  const face = new THREE.Mesh(lathe(disc, 96), paint);
  face.castShadow = true;
  spinner.add(face);
  // Ventilation holes in the disc, seen as dark ovals.
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x15161a });
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI * 2) / 6 + Math.PI / 6;
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.018, 20), holeMat);
    hole.scale.set(1, 1.4, 1);
    hole.rotation.order = "YXZ";
    hole.rotation.set(-a, Math.PI / 2, 0);
    const rr = RB - 0.05;
    hole.position.set(0.026, Math.cos(a) * rr, Math.sin(a) * rr);
    spinner.add(hole);
  }
  const nutGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.016, 6).rotateZ(Math.PI / 2);
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI * 2) / 6;
    const nut = new THREE.Mesh(nutGeo, chrome);
    nut.position.set(0.052, Math.cos(a) * 0.0699, Math.sin(a) * 0.0699);
    spinner.add(nut);
  }
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.055, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2.6), chrome);
  cap.rotation.z = -Math.PI / 2;
  cap.position.x = 0.03;
  spinner.add(cap);
  // The inside of the hub and its drum brake, seen through the holes and from the inner side.
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.07, 40).rotateZ(Math.PI / 2), inside);
  drum.position.x = -0.03;
  drum.castShadow = true;
  spinner.add(drum);
  // Valve stem.
  const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.005, 0.034, 10), new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.7 }));
  const va = Math.PI / 6;
  valve.position.set(0.02, Math.cos(va) * (RB - 0.02), Math.sin(va) * (RB - 0.02));
  valve.rotation.x = va;
  valve.rotation.z = -0.5;
  spinner.add(valve);

  // Fast enough, the face blurs into a disc.
  const blur = new THREE.Mesh(
    new THREE.CircleGeometry(RB - 0.02, 64),
    new THREE.MeshStandardMaterial({ color: 0xd8d2c2, metalness: 0.3, roughness: 0.5, transparent: true, opacity: 0, depthWrite: false }),
  );
  blur.name = "blur";
  blur.rotation.y = Math.PI / 2;
  blur.position.x = 0.05;
  wheel.add(blur);

  // The parts that turn with the spinner, joined (the tire apart: it bulges as it's squashed).
  mergeStatic(spinner, new Set([tire]));
  return { wheel, spinner, tire, blur };
}

// ---------- Effects: marks on the ground and things thrown up ----------

const PARTICLES = {
  smoke: { colour: [0.85, 0.85, 0.87], size: [0.07, 0.12], grow: 0.28, life: [1, 1.6], drag: 3, lift: 0.5, alpha: 0.45, soft: 1, max: 70 },
  spray: { colour: [0.78, 0.86, 0.95], size: [0.006, 0.012], grow: 0, life: [0.5, 0.9], drag: 0.6, lift: 0, alpha: 0.85, soft: 0 },
  stones: { colour: [0.5, 0.47, 0.42], size: [0.008, 0.02], grow: 0, life: [1, 1.6], drag: 0.05, lift: 0, alpha: 1, soft: 0 },
  grass: { colour: [0.33, 0.58, 0.22], size: [0.006, 0.014], grow: 0, life: [0.8, 1.4], drag: 2, lift: 0, alpha: 1, soft: 0 },
  sand: { colour: [0.84, 0.72, 0.5], size: [0.004, 0.009], grow: 0, life: [0.6, 1.1], drag: 0.8, lift: 0, alpha: 1, soft: 0 },
  mud: { colour: [0.27, 0.19, 0.13], size: [0.01, 0.022], grow: 0, life: [0.8, 1.4], drag: 0.2, lift: 0, alpha: 1, soft: 0 },
  snow: { colour: [0.96, 0.97, 0.99], size: [0.006, 0.015], grow: 0, life: [0.6, 1.2], drag: 1.2, lift: 0, alpha: 1, soft: 0 },
  frost: { colour: [1, 1, 1], size: [0.004, 0.008], grow: 0, life: [0.3, 0.6], drag: 1.5, lift: 0, alpha: 0.9, soft: 0 },
  dust: { colour: [0.78, 0.7, 0.58], size: [0.06, 0.1], grow: 0.2, life: [0.8, 1.2], drag: 3, lift: 0.15, alpha: 0.3, soft: 1, max: 40 },
  // Dust raised off a dry road by the tires rolling, hanging behind the jeep and drifting up.
  trail: { colour: [0.68, 0.62, 0.54], size: [0.45, 0.75], grow: 0.85, life: [2.4, 4], drag: 1.6, lift: 0.22, alpha: 0.16, soft: 1, max: 140 },
  dirt: { colour: [0.42, 0.32, 0.22], size: [0.006, 0.016], grow: 0, life: [0.8, 1.4], drag: 0.6, lift: 0, alpha: 1, soft: 0 },
};
// Smoke and dust are big and see-through, so every one costs a lot of pixels; they have their own
// smaller limits (max), and a puff is never drawn more than a fifth of the screen across.
const MAX_PARTICLES = 900;
const MAX_MARKS = 700;

class Marks {
  constructor(scene) {
    const geo = new THREE.BufferGeometry();
    this.positions = new Float32Array(MAX_MARKS * 4 * 3);
    this.colours = new Float32Array(MAX_MARKS * 4 * 4);
    const index = new Uint32Array(MAX_MARKS * 6);
    for (let i = 0; i < MAX_MARKS; i++) index.set([i * 4, i * 4 + 2, i * 4 + 1, i * 4 + 1, i * 4 + 2, i * 4 + 3], i * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("color", new THREE.BufferAttribute(this.colours, 4).setUsage(THREE.DynamicDrawUsage));
    const normals = new Float32Array(MAX_MARKS * 4 * 3);
    for (let i = 0; i < MAX_MARKS * 4; i++) normals[i * 3 + 1] = 1;
    geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geo.setIndex(new THREE.BufferAttribute(index, 1));
    geo.setDrawRange(0, 0);
    this.geo = geo;
    this.mesh = new THREE.Mesh(
      geo,
      new THREE.MeshLambertMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      }),
    );
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1;
    scene.add(this.mesh);
    this.list = [];
    this.lastOf = [];
  }

  clear() {
    this.list.length = 0;
    this.lastOf = [];
    this.write();
  }

  // A stretch of ground from (x0, z0) to (x1, z1), a tire's width across. A stretch that carries on
  // from the same tire's last one, and looks the same, just extends it.
  add(tire, x0, z0, x1, z1, rgb, alpha, fade, now) {
    const last = this.lastOf[tire];
    if (
      last &&
      last.rgb === rgb &&
      !last.fade === !fade &&
      Math.abs(last.alpha - alpha) < 0.05 &&
      Math.hypot(last.x1 - x0, last.z1 - z0) < 0.02 &&
      Math.hypot(last.x1 - last.x0, last.z1 - last.z0) < 0.5
    ) {
      last.x1 = x1;
      last.z1 = z1;
      last.born = now;
      last.ys = null;
      return;
    }
    const mark = { x0, z0, x1, z1, rgb, alpha, fade, born: now, ys: null };
    this.list.push(mark);
    this.lastOf[tire] = mark;
    if (this.list.length > MAX_MARKS) this.list.shift();
  }

  write(now = 0, ground) {
    const p = this.positions;
    const c = this.colours;
    const w = HALF_WIDTH * 0.95;
    let n = 0;
    for (const m of this.list) {
      const alpha = m.fade ? m.alpha - (now - m.born) * m.fade : m.alpha;
      const dx = m.x1 - m.x0;
      const dz = m.z1 - m.z0;
      const len = Math.hypot(dx, dz);
      if (alpha <= 0.01 || len < 1e-6) continue;
      const nx = (-dz / len) * w;
      const nz = (dx / len) * w;
      const corners = [m.x0 - nx, m.z0 - nz, m.x0 + nx, m.z0 + nz, m.x1 - nx, m.z1 - nz, m.x1 + nx, m.z1 + nz];
      if (!m.ys) m.ys = [0, 1, 2, 3].map((v) => ground.height(corners[v * 2], corners[v * 2 + 1]) + 0.006);
      for (let v = 0; v < 4; v++) p.set([corners[v * 2], m.ys[v], corners[v * 2 + 1]], n * 12 + v * 3);
      for (let v = 0; v < 4; v++) c.set([m.rgb[0], m.rgb[1], m.rgb[2], alpha], n * 16 + v * 4);
      n++;
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
    this.geo.setDrawRange(0, n * 6);
  }
}

class Particles {
  constructor(scene) {
    this.list = [];
    this.rand = rng(7);
    const geo = new THREE.BufferGeometry();
    this.positions = new Float32Array(MAX_PARTICLES * 3);
    this.colours = new Float32Array(MAX_PARTICLES * 4);
    this.sizes = new Float32Array(MAX_PARTICLES * 2);
    geo.setAttribute("position", new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("tint", new THREE.BufferAttribute(this.colours, 4).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("look", new THREE.BufferAttribute(this.sizes, 2).setUsage(THREE.DynamicDrawUsage));
    geo.setDrawRange(0, 0);
    this.geo = geo;
    this.material = new THREE.ShaderMaterial({
      uniforms: { scale: { value: 800 }, biggest: { value: 200 }, light: { value: new THREE.Color(1, 1, 1) } },
      vertexShader: `
        attribute vec4 tint;
        attribute vec2 look; // size in metres, softness
        uniform float scale;
        uniform float biggest;
        varying vec4 vTint;
        varying float vSoft;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(look.x * scale / -mv.z, 1.5, biggest);
          vTint = tint;
          vSoft = look.y;
        }`,
      fragmentShader: `
        uniform vec3 light;
        varying vec4 vTint;
        varying float vSoft;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          float edge = mix(1.0 - smoothstep(0.38, 0.5, r), 1.0 - smoothstep(0.0, 0.5, r), vSoft);
          if (edge <= 0.0) discard;
          gl_FragColor = vec4(pow(vTint.rgb, vec3(2.2)) * light, vTint.a * edge);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
      transparent: true,
      depthWrite: false,
    });
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 2;
    scene.add(this.points);
  }

  spawn(kind, perSecond, dt, make) {
    let count = perSecond * dt;
    const spec = PARTICLES[kind];
    let alive = spec.max ? this.list.reduce((n, p) => n + (p.kind === kind), 0) : 0;
    while (count > 0 && this.list.length < MAX_PARTICLES && (!spec.max || alive++ < spec.max)) {
      if (count < 1 && this.rand() > count) break;
      count--;
      const p = make(this.rand);
      p.kind = kind;
      p.age = 0;
      p.life = spec.life[0] + this.rand() * (spec.life[1] - spec.life[0]);
      p.size = spec.size[0] + this.rand() * (spec.size[1] - spec.size[0]);
      this.list.push(p);
    }
  }

  update(dt, g, airiness, ground) {
    for (const p of this.list) {
      const spec = PARTICLES[p.kind];
      p.age += dt;
      const drag = spec.drag * airiness;
      p.vx -= p.vx * Math.min(1, drag * dt);
      p.vy -= p.vy * Math.min(1, drag * dt);
      p.vz -= p.vz * Math.min(1, drag * dt);
      p.vy += (spec.lift ? spec.lift * airiness : -g) * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.size += spec.grow * dt;
      if (!spec.lift && (p.floor === undefined || (p.check = (p.check || 0) + 1) % 6 === 0)) p.floor = ground.height(p.x, p.z) + 0.003;
      const floor = spec.lift ? -Infinity : p.floor;
      if (p.y < floor) {
        // Bits that land stay a moment, then go.
        p.y = floor;
        p.vx *= 0.3;
        p.vz *= 0.3;
        p.vy = 0;
      }
    }
    this.list = this.list.filter((p) => p.age < p.life);
    let n = 0;
    for (const p of this.list) {
      const spec = PARTICLES[p.kind];
      const t = p.age / p.life;
      const alpha = spec.soft ? spec.alpha * (1 - t) * Math.min(1, p.age * 6) : spec.alpha * Math.min(1, (1 - t) * 3);
      this.positions.set([p.x, p.y, p.z], n * 3);
      this.colours.set([spec.colour[0], spec.colour[1], spec.colour[2], alpha], n * 4);
      this.sizes.set([p.size, spec.soft], n * 2);
      n++;
    }
    for (const a of ["position", "tint", "look"]) this.geo.attributes[a].needsUpdate = true;
    this.geo.setDrawRange(0, n);
  }
}

// ---------- Force arrows ----------

function makeArrow(colour) {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: colour, depthTest: false, transparent: true, opacity: 0.95 });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 1, 10).translate(0, 0.5, 0), mat);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.04, 14).translate(0, -0.02, 0), mat);
  group.add(shaft, head);
  group.renderOrder = 10;
  shaft.renderOrder = 10;
  head.renderOrder = 10;
  const up = new THREE.Vector3(0, 1, 0);
  const dir = new THREE.Vector3();
  return {
    group,
    // From the point `from` along the vector `v` (metres).
    set(from, v) {
      const len = v.length();
      group.visible = len > 0.004;
      if (!group.visible) return;
      dir.copy(v).divideScalar(len);
      group.position.copy(from);
      group.quaternion.setFromUnitVectors(up, dir);
      shaft.scale.y = Math.max(0.001, len - 0.035);
      head.position.y = len;
    },
  };
}

// ---------- The scene ----------

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.CustomToneMapping; // filmic, then graded (atmosphere.js)
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer = renderer;
    this.maxAniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());

    const scene = new THREE.Scene();
    this.scene = scene;
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.05, 2200);

    // The sky and the country all round, behind everything.
    AIR.cloudMap.value = cloudTexture();
    this.background = new Background(scene);
    // Where the sun is, from the car (set by the time of day).
    this.sunOffset = new THREE.Vector3(-30, 26, 18);

    this.hemi = new THREE.HemisphereLight(0xdfefff, 0x6e8f52, 0.9);
    scene.add(this.hemi);
    const sun = new THREE.DirectionalLight(0xffefd6, 2.9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(isTouch ? 1024 : 2048, isTouch ? 1024 : 2048);
    const sc = sun.shadow.camera;
    sc.left = -12;
    sc.right = 12;
    sc.top = 12;
    sc.bottom = -12;
    sc.near = 0.5;
    sc.far = 120;
    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 3;
    scene.add(sun, sun.target);
    this.sun = sun;

    // The mountain, its road, trees and boulders.
    this.landscape = new Landscape(scene, { maxAniso: this.maxAniso });

    // The car. The body and frame are placed by the sprung mass's centre, their parts in the car's
    // own axes from the middle between the axles at hub height; each axle, with its wheels and
    // springs, is placed where the physics has it.
    this.car = new THREE.Group();
    this.frame = new THREE.Group();
    this.car.add(this.frame);
    scene.add(this.car);
    this.axleGroups = [new THREE.Group(), new THREE.Group()];
    for (const g of this.axleGroups) scene.add(g);
    this.buildFrame();
    // Four tires. The right ones' spokes face right; the left ones are the same tire turned round,
    // so their spokes face left. Each turns on its own and the front ones steer.
    const original = buildWheel(this.maxAniso).wheel;
    const body = buildBody({ maxAniso: this.maxAniso, makeWheel: () => original.clone() });
    this.frame.add(body.group);
    this.steeringWheel = body.steeringWheel;
    this.wheels = WHEELS.map((w, i) => {
      const wheel = i ? original.clone() : original;
      const blur = wheel.getObjectByName("blur");
      blur.material = blur.material.clone(); // each blurs by its own spin
      wheel.rotation.order = "YXZ"; // steer, then spin about the steered axle
      wheel.position.set(w.at[0], 0, 0); // across its axle
      this.axleGroups[w.front ? 0 : 1].add(wheel);
      return { wheel, tire: wheel.getObjectByName("tire"), blur };
    });
    // Everything that never moves against the body, the frame or an axle, joined by material: far
    // fewer things to draw. What turns or stretches stays apart.
    // In the cab, under the roof, the steering wheel's chrome sees little of the sky it would
    // otherwise mirror (the reflections are the open sky's): worn to a satin steel.
    body.steeringWheel.traverse((o) => {
      if (o.isMesh && o.material.metalness > 0.5) {
        o.material = o.material.clone();
        o.material.color.set(0x3c3e40);
        o.material.metalness = 0.25;
        o.material.roughness = 0.55;
      }
    });
    mergeStatic(body.group, new Set([body.steeringWheel]));
    mergeStatic(this.frame, new Set([this.fan, body.group]));
    this.axleGroups.forEach((group, i) => mergeStatic(group, new Set([...(i ? [] : [...this.knuckles, this.tieRod]), ...this.wheels.map((w) => w.wheel)])));

    this.marks = new Marks(scene);
    this.particles = new Particles(scene);
    this.lastPoints = WHEELS.map(() => null);

    this.arrows = {
      weight: makeArrow(0xff7a7a),
      normals: WHEELS.map(() => makeArrow(0x62d2ff)),
      frictions: WHEELS.map(() => makeArrow(0xffd166)),
    };
    for (const a of [...this.arrows.normals, ...this.arrows.frictions]) scene.add(a.group);
    scene.add(this.arrows.weight.group);
    // The hub torque, as an arc round the axle with a head on it.
    const torqueMat = new THREE.MeshBasicMaterial({ color: 0xc59bff, depthTest: false, transparent: true });
    this.torqueArc = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.0055, 8, 48, Math.PI * 1.2), torqueMat);
    this.torqueHead = new THREE.Mesh(new THREE.ConeGeometry(0.017, 0.045, 14), torqueMat);
    this.torqueArc.renderOrder = this.torqueHead.renderOrder = 10;
    this.torque = new THREE.Group();
    this.torque.add(this.torqueArc, this.torqueHead);
    scene.add(this.torque);

    // Camera: chase, driver or orbit (see updateCamera).
    this.view = { ...CHASE };
    this.goal = { ...CHASE };
    this.heading = 0;
    this.lookY = R;
    this.fov = 52;
    this.lastOrbit = -Infinity;
    this.chasePosition = null;
    this.time = null;
    this.high = false;
    this.labelPoints = {};
    this.pixelRatio = maxPixelRatio();
    // Everything lit outdoors: its sunlight shaded by the mountain and the clouds.
    outdoors(scene);
    this.resize();
  }

  setPixelRatio(ratio) {
    this.pixelRatio = ratio;
    this.resize();
  }

  // The time of day: where the sun is and its colour, the sky's, the haze; the ground's shadows
  // and the far pines' pictures in that light; and the reflections, from that sky.
  setTime(name) {
    const t = TIMES[name] || TIMES.afternoon;
    if (this.time === t) return;
    this.time = t;
    applyTime(t);
    this.sunOffset.copy(AIR.sunTo.value).multiplyScalar(45);
    this.sun.color.set(t.sun);
    this.sun.intensity = t.intensity;
    this.hemi.color.set(t.hemiSky);
    this.hemi.groundColor.set(t.hemiGround); // light bounced off the ground
    this.hemi.intensity = t.hemi;
    // The haze (atmosphere.js): fogNear is its density, fogFar how fast it thins with height.
    this.scene.fog = new THREE.Fog(t.haze, t.density, t.thin);
    this.background.setTime(t, this.hemi);
    this.landscape.lightUp();
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const envScene = new THREE.Scene();
    envScene.add(this.background.sky.clone());
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60000, 60000).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x4f4c40 }));
    floor.position.y = -2;
    envScene.add(floor);
    const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(18, 16, 8), new THREE.MeshBasicMaterial({ color: AIR.sunColour.value.clone().multiplyScalar(0.4) }));
    sunDisc.position.copy(AIR.sunTo.value).multiplyScalar(270);
    envScene.add(sunDisc);
    if (this.scene.environment) this.scene.environment.dispose();
    this.scene.environment = pmrem.fromScene(envScene, 0.02, 0.1, 30000).texture;
    // The sky's light comes partly from here, partly from the hemisphere light; together, as much as
    // the sky gives.
    this.scene.environmentIntensity = 0.55;
    pmrem.dispose();
    this.landscape.bakeTrees(this.renderer, { hemi: this.hemi, sun: this.sun, environment: this.scene.environment });
    // What lights the dust and bits thrown up: the sky and some of the sun.
    this.particles.material.uniforms.light.value.copy(this.hemi.color).multiplyScalar(t.hemi * 1.1).add(AIR.sunColour.value.clone().multiplyScalar(0.2));
  }

  // "high": drawn through the post-processing (post.js); "standard": straight to the screen;
  // "auto": high, except on phones and tablets, until frames come too slowly (see main.js).
  setQuality(quality) {
    this.auto = quality === "auto";
    this.high = quality === "high" || (this.auto && !isTouch);
    if (this.high && !this.post) {
      this.post = new Post(this.renderer, this.scene, this.camera, (renderer) => this.drawWorld(renderer));
      this.post.setSize(this.W, this.H, this.renderer.getPixelRatio());
    }
  }

  drawWorld(renderer) {
    renderer.render(this.scene, this.camera);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.maxPixelRatio = maxPixelRatio();
    this.pixelRatio = Math.min(this.pixelRatio, this.maxPixelRatio);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.W = w;
    this.H = h;
    if (this.post) this.post.setSize(w, h, this.pixelRatio);
    this.updatePointScale();
  }

  // How big a particle a metre across looks, for the current height and field of view.
  updatePointScale() {
    const h = this.H * this.renderer.getPixelRatio();
    this.particles.material.uniforms.scale.value = h / (2 * Math.tan((this.camera.fov * Math.PI) / 360));
    this.particles.material.uniforms.biggest.value = 0.2 * h;
  }

  // Drag to look around; the wheel or pinch to come closer or go further.
  orbit(dx, dy) {
    this.goal.yaw -= dx * 0.008;
    this.goal.pitch = Math.min(1.35, Math.max(this.goal.mode === "driver" ? -0.6 : 0.04, this.goal.pitch + dy * 0.006));
    this.lastOrbit = performance.now();
  }
  zoom(factor) {
    this.goal.dist = Math.min(22, Math.max(2.5, this.goal.dist * factor));
  }
  setView(view) {
    Object.assign(this.goal, view);
    this.view.mode = this.goal.mode;
    this.chasePosition = null;
  }

  clearEffects() {
    this.marks.clear();
    this.particles.list.length = 0;
    this.lastPoints = WHEELS.map(() => null);
  }

  // The FJ40's chassis. On the frame (sprung, moving with the body): the ladder frame (two
  // C-channel rails and the cross members joining them), the F six with its radiator, the gearbox
  // and transfer case, fuel tank, battery, the steering box and the spring hangers. On each axle
  // (unsprung, moving with it): the housing and differential, the leaf springs clamped to it, and
  // at the front the Birfield knuckles, steering arms and tie rod. The driveshafts reach between.
  // The boxes are the ones the physics weighs.
  buildFrame() {
    const mat = (color, metalness, roughness) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
    const frame = mat(0x1d2023, 0.5, 0.5); // chassis black
    const steel = mat(0x5d6168, 0.8, 0.4);
    const cast = mat(0x4a4d50, 0.6, 0.6); // cast iron and aluminium housings
    const engineBlue = mat(0x2f4b6e, 0.35, 0.5); // the F six's block
    const chrome = mat(0xe8eaec, 1, 0.2);
    const white = mat(0xddd7ca, 0.3, 0.45); // painted bumper
    const black = mat(0x141517, 0.2, 0.7);
    const spring = mat(0x34383d, 0.7, 0.5);
    const add = (geo, m, x, y, z, parent = this.frame) => {
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const box = (w, h, l) => new THREE.BoxGeometry(w, h, l);
    const halfBase = CAR.wheelbase / 2;
    const [frontAxle, rearAxle] = this.axleGroups;
    const driver = CAR.rightHandDrive ? 1 : -1;

    for (const part of PARTS) {
      const [x, y, z] = part.at;
      const [w, h, l] = part.size;
      if (part.name === "frame rail") {
        // A C-channel: web on the inside, flanges top and bottom.
        const side = Math.sign(x);
        add(box(0.008, h, l), frame, x - side * (w / 2 - 0.004), y, z);
        add(box(w, 0.008, l), frame, x, y + h / 2 - 0.004, z);
        add(box(w, 0.008, l), frame, x, y - h / 2 + 0.004, z);
      } else if (part.name === "cross member" || part.name === "rear cross member") {
        add(box(w, h, l), frame, x, y, z);
      } else if (part.name === "front bumper") {
        add(box(w, h, l), black, x, y, z);
      } else if (part.name === "front axle" || part.name === "rear axle") {
        // Axle tubes, the differential's round housing (the front one offset to the right, as on
        // the FJ40) with its pinion nose toward the transfer case; placed about the axle's middle.
        const front = part.name === "front axle";
        const group = front ? frontAxle : rearAxle;
        add(new THREE.CylinderGeometry(0.04, 0.04, w, 20).rotateZ(Math.PI / 2), cast, 0, y, 0, group);
        const dx = front ? 0.12 : 0;
        add(new THREE.SphereGeometry(0.14, 24, 16), cast, dx, y, 0, group);
        add(new THREE.CylinderGeometry(0.055, 0.07, 0.18, 18).rotateX(Math.PI / 2), cast, dx, y + 0.01, front ? 0.15 : -0.15, group);
        if (front) for (const s of [-1, 1]) add(new THREE.SphereGeometry(0.085, 20, 14), cast, s * (w / 2 + 0.02), y, 0, group);
      } else if (part.name === "engine") {
        // The block, the head and its rocker cover, the oil pan, and the fan and pulley at the front.
        add(box(0.36, 0.38, 0.86), engineBlue, x, y - 0.06, z);
        add(box(0.3, 0.12, 0.84), engineBlue, x + 0.02, y + 0.19, z);
        add(box(0.2, 0.07, 0.8), chrome, x + 0.02, y + 0.28, z);
        add(box(0.3, 0.14, 0.7), black, x, y - 0.31, z + 0.05);
        add(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 20).rotateX(Math.PI / 2), steel, x, y - 0.02, z - 0.45);
        this.fan = add(new THREE.CylinderGeometry(0.2, 0.2, 0.01, 6).rotateX(Math.PI / 2), black, x, y + 0.05, z - 0.52);
        // The air cleaner, a round can on top, and the exhaust manifold down the left.
        add(new THREE.CylinderGeometry(0.15, 0.15, 0.09, 28), black, x - 0.05, y + 0.38, z + 0.05);
        add(box(0.05, 0.06, 0.7), cast, x - 0.21, y + 0.03, z);
      } else if (part.name === "gearbox and transfer case") {
        // Bell housing tapering from the engine, the gearbox, and the transfer case behind it.
        add(new THREE.CylinderGeometry(0.15, 0.2, 0.2, 24).rotateX(Math.PI / 2), cast, x, y + 0.05, z - 0.25);
        add(box(0.22, 0.24, 0.32), cast, x, y + 0.02, z + 0.02);
        add(box(0.34, 0.26, 0.18), cast, x + 0.04, y - 0.04, z + 0.24);
        // Gear lever and the transfer lever beside it, up through the floor.
        add(new THREE.CylinderGeometry(0.008, 0.01, 0.62, 8), chrome, x, y + 0.42, z - 0.02);
        add(new THREE.SphereGeometry(0.025, 12, 8), black, x, y + 0.73, z - 0.02);
        add(new THREE.CylinderGeometry(0.007, 0.008, 0.5, 8), chrome, x + 0.08, y + 0.33, z + 0.22);
        add(new THREE.SphereGeometry(0.02, 12, 8), black, x + 0.08, y + 0.58, z + 0.22);
      } else if (part.name === "radiator") {
        add(box(w, h, l), black, x, y, z);
        add(box(w + 0.04, 0.03, l + 0.02), steel, x, y + h / 2, z);
        add(box(w + 0.04, 0.03, l + 0.02), steel, x, y - h / 2, z);
      } else if (part.name === "fuel tank") {
        add(box(w, h, l), black, x, y, z);
      } else if (part.name === "battery") {
        add(box(w, h, l), black, x, y, z);
        add(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 10), mat(0xc0392b, 0.3, 0.5), x - 0.07, y + h / 2 + 0.01, z);
        add(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 10), black, x + 0.07, y + h / 2 + 0.01, z);
      }
    }

    // Leaf springs: a stack of curved steel leaves clamped to each axle under each frame rail,
    // reaching fore and aft to hangers on the rail.
    const leaves = new THREE.Group();
    for (let k = 0; k < 4; k++) {
      const len = 1.15 - k * 0.2;
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.05, -len / 2), new THREE.Vector3(0, -0.035, 0), new THREE.Vector3(0, 0.05, len / 2));
      const leaf = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.006, 4, false), spring);
      leaf.scale.set(8, 1, 1); // flat and wide
      leaf.position.y = -k * 0.011;
      leaf.castShadow = true;
      leaves.add(leaf);
    }
    for (const [i, z] of [[0, -halfBase], [1, halfBase]]) {
      for (const side of [-1, 1]) {
        const set = leaves.clone();
        set.position.set(side * 0.42, 0.06, 0);
        this.axleGroups[i].add(set);
        add(box(0.06, 0.05, 0.1), steel, side * 0.42, 0.045, 0, this.axleGroups[i]); // U-bolt plate
        for (const end of [-0.56, 0.56]) add(box(0.03, 0.08, 0.03), frame, side * 0.42, 0.09, z + end);
        // The shock absorber, from the axle up to the frame.
        add(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 10), black, side * 0.5, 0.15, 0.12 * (i ? -1 : 1), this.axleGroups[i]);
      }
    }

    // Steering: a knuckle at each end of the front axle turns with its tire; their arms reach back
    // to a tie rod across, which slides as they turn. The steering box sits on the driver's rail.
    const knuckleX = CAR.frontTrack / 2 - 0.13;
    this.knuckles = [-1, 1].map((side) => {
      const knuckle = new THREE.Group();
      knuckle.position.set(side * knuckleX, 0, 0);
      const arm = new THREE.Mesh(box(0.03, 0.03, 0.2), steel);
      arm.position.set(-side * 0.03, -0.05, 0.1);
      arm.castShadow = true;
      knuckle.add(arm);
      frontAxle.add(knuckle);
      return knuckle;
    });
    this.tieRod = add(new THREE.CylinderGeometry(0.014, 0.014, 1, 10).rotateZ(Math.PI / 2), steel, 0, -0.05, 0.2, frontAxle);
    add(box(0.12, 0.12, 0.15), cast, driver * 0.5, 0.12, -halfBase - 0.1);

    // Driveshafts from the transfer case to each differential's nose, turning with the drivetrain.
    // They're stretched between the frame and the axle each frame (see draw).
    const shaft = (from, to) => {
      const group = new THREE.Group();
      const spinner = new THREE.Group();
      group.add(spinner);
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1, 14).rotateX(Math.PI / 2).translate(0, 0, 0.5), steel);
      tube.castShadow = true;
      spinner.add(tube);
      const yokes = [0, 1].map(() => {
        const yoke = new THREE.Mesh(box(0.09, 0.025, 0.05), cast);
        spinner.add(yoke);
        return yoke;
      });
      this.scene.add(group);
      return { group, spinner, tube, yokes, from, to };
    };
    this.shafts = [
      shaft(new THREE.Vector3(0.12, -0.02, 0.18), [0, new THREE.Vector3(0.12, 0.01, 0.24)]),
      shaft(new THREE.Vector3(0.04, -0.02, 0.34), [1, new THREE.Vector3(0, 0.01, -0.24)]),
    ];
  }

  // Everything for one frame. dt is sim time; realDt drives the camera.
  draw(sim, dt, opts) {
    if (!this.time) this.setTime("afternoon");
    const [px, py, pz] = sim.p;
    const rdt = opts.realDt || dt;

    // The body: placed by its centre of mass, its parts offset from that.
    this.car.position.set(px, py, pz);
    this.car.quaternion.set(sim.q[1], sim.q[2], sim.q[3], sim.q[0]);
    this.frame.position.set(-sim.centre[0], -sim.centre[1], -sim.centre[2]);
    this.car.updateMatrixWorld();
    // The axles, each where the physics has it: its middle, its beam across, up from it.
    const basis = new THREE.Matrix4();
    sim.axles.forEach((a, i) => {
      const f = sim.axleFrame(a);
      const beam = new THREE.Vector3(...f.beam);
      const up = new THREE.Vector3(...f.up);
      basis.makeBasis(beam, up, beam.clone().cross(up));
      const group = this.axleGroups[i];
      group.position.set(...f.middle);
      group.quaternion.setFromRotationMatrix(basis);
      group.updateMatrixWorld();
    });
    sim.wheels.forEach((w, i) => {
      const view = this.wheels[i];
      // Turned round on the left, so the spin there is the other way about its own axle.
      view.wheel.rotation.set(w.side > 0 ? -w.angle : w.angle, w.steer + (w.side > 0 ? 0 : Math.PI), 0);
      // Squashed, a tire's sidewalls bulge out a little.
      view.tire.scale.x = 1 + Math.min(0.15, (w.contact.squash / R) * 1.2);
      view.blur.material.opacity = Math.min(0.85, Math.max(0, (Math.abs(w.spin) - 18) / 40));
    });
    // Steering knuckles turn with their tires; the tie rod spans their arms' ends.
    const [fl, fr] = sim.wheels;
    this.knuckles[0].rotation.y = fl.steer;
    this.knuckles[1].rotation.y = fr.steer;
    const armEnd = (k, side) => new THREE.Vector3(-side * 0.03, -0.05, 0.2).applyEuler(k.rotation).add(k.position);
    const a = armEnd(this.knuckles[0], -1);
    const b = armEnd(this.knuckles[1], 1);
    this.tieRod.position.copy(a).add(b).multiplyScalar(0.5);
    this.tieRod.scale.x = a.distanceTo(b);
    this.tieRod.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
    this.steeringWheel.rotation.y = sim.steeringWheel;
    this.fan.rotation.z = sim.engineAngle;
    // Driveshafts, stretched from the transfer case on the frame to each differential.
    for (const s of this.shafts) {
      const from = this.frame.localToWorld(s.from.clone());
      const to = this.axleGroups[s.to[0]].localToWorld(s.to[1].clone());
      const length = from.distanceTo(to);
      s.group.position.copy(from);
      s.group.lookAt(to);
      s.tube.scale.z = length;
      s.yokes[0].position.z = 0.04;
      s.yokes[1].position.z = length - 0.04;
      s.spinner.rotation.z = sim.shaftAngle;
    }

    this.updateEffects(sim, dt);
    this.updateForces(sim, opts.forces);
    this.updateCamera(sim, rdt);
    this.landscape.update(this.camera.position, rdt);
    drift(rdt);

    this.sun.position.set(px + this.sunOffset.x, py + this.sunOffset.y, pz + this.sunOffset.z);
    this.sun.target.position.set(px, py - 0.7, pz);
    this.background.update(this.camera);

    if (this.high) this.post.render();
    else {
      this.renderer.setRenderTarget(null);
      this.drawWorld(this.renderer);
    }
  }

  // The cameras. Chase, like a racing game's: behind and a little above, trailing the car round
  // turns so you see its side, pulling back and widening as it speeds up. Driver: in the driver's
  // seat, looking out over the hood. Orbit: anywhere round the car at a yaw (0 behind), pitch and
  // distance. Dragging looks around; in the chase view it swings back behind after a moment.
  updateCamera(sim, rdt) {
    const ease = 1 - Math.exp(-rdt * 6);
    const mode = this.goal.mode;
    if (mode === "chase" && performance.now() - this.lastOrbit > 1500) {
      this.goal.yaw += (0 - this.goal.yaw) * (1 - Math.exp(-rdt * 2));
      this.goal.pitch += (CHASE.pitch - this.goal.pitch) * (1 - Math.exp(-rdt * 2));
    }
    for (const k of ["yaw", "pitch", "dist"]) this.view[k] += (this.goal[k] - this.view[k]) * ease;
    let turn = sim.heading - this.heading;
    turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    this.heading += turn * (1 - Math.exp(-rdt * (mode === "chase" ? 2.2 : 3)));
    const speed = Math.abs(sim.forwardSpeed);
    const f = sim.forward;
    const [px, py, pz] = sim.p;
    let fov = 45;

    if (mode === "driver") {
      // The driver's eyes, in the car's own axes, and a look ahead turned by any drag.
      const eye = this.frame.localToWorld(new THREE.Vector3(CAR.rightHandDrive ? 0.4 : -0.4, 1.34, 0.28));
      const ahead = this.frame.localToWorld(new THREE.Vector3(0, 0.9, -12)).sub(eye);
      ahead.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.view.yaw).normalize();
      ahead.y += -this.view.pitch * 0.5;
      this.camera.position.copy(eye);
      this.camera.lookAt(eye.clone().add(ahead));
      fov = 68;
      this.chasePosition = null;
    } else {
      const chase = mode === "chase";
      const portrait = this.H > this.W ? Math.min(1.9, (this.H / this.W) ** 0.7) : 1;
      const d = this.view.dist * portrait * (chase ? 1 + Math.min(0.35, speed * 0.01) : 1);
      const yaw = this.heading + this.view.yaw;
      const pitch = this.view.pitch;
      this.lookY += (Math.max(R + 0.3, py) - this.lookY) * ease;
      const lead = chase ? CHASE_AHEAD : 0.6;
      const target = new THREE.Vector3(px + f[0] * lead, this.lookY + (chase ? 0.1 : 0), pz + f[2] * lead);
      const want = new THREE.Vector3(
        target.x + Math.sin(yaw) * Math.cos(pitch) * d,
        target.y + Math.sin(pitch) * d,
        target.z + Math.cos(yaw) * Math.cos(pitch) * d,
      );
      // The chase camera follows a moment behind, on a spring, so it trails the car's lurches.
      if (chase && this.chasePosition && this.chasePosition.distanceTo(want) < 20) {
        this.chasePosition.lerp(want, 1 - Math.exp(-rdt * 9));
      } else this.chasePosition = want.clone();
      const camera = chase ? this.chasePosition : want;
      camera.y = Math.max(camera.y, MOUNTAIN.height(camera.x, camera.z) + 0.6);
      this.camera.position.copy(camera);
      this.camera.lookAt(target);
      fov = chase ? 52 + Math.min(16, speed * 0.6) : 45;
    }
    this.fov += (fov - this.fov) * (1 - Math.exp(-rdt * 3));
    if (Math.abs(this.camera.fov - this.fov) > 0.01) {
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
      this.updatePointScale();
    }
  }

  updateEffects(sim, dt) {
    const airiness = Math.min(1, sim.air / 1.225);
    const P = this.particles;
    const a = sim.ax;
    const travel = Math.hypot(sim.v[0], sim.v[2]);
    sim.wheels.forEach((wheel, i) => {
      const c = wheel.contact;
      const id = c.surface.id;
      const look = LOOKS[id];
      const onGround = c.normal > 0;
      // How fast the tread is sliding over the ground where it touches, any direction.
      const slipSpeed = onGround ? Math.hypot(c.tread[0], c.tread[2]) : 0;
      const load = c.normal / ((sim.mass * sim.g) / 2 || 1);
      const [x, , z] = c.point;
      const groundY = c.ground[1];

      // What the tire leaves along its track. A jump to somewhere else leaves nothing between.
      const last = this.lastPoints[i];
      if (onGround && last && Math.hypot(x - last[0], z - last[1]) < 0.5 && (x !== last[0] || z !== last[1])) {
        let alpha = 0;
        let fade = 0;
        if (id === "asphalt" || id === "concrete") alpha = Math.min(0.6, Math.max(0, slipSpeed - 1.2) * 0.15);
        else if (id === "ice") alpha = Math.min(0.55, Math.max(0, slipSpeed - 0.8) * 0.22);
        else if (id === "wet") {
          alpha = 0.45; // water squeezed out of the track, flowing back in
          fade = 0.15;
        } else alpha = Math.min(0.7, (c.sink / 0.012) * 0.35 + Math.min(1, Math.hypot(c.slip, c.sideSlip)) * 0.25);
        if (alpha > 0.02) this.marks.add(i, last[0], last[1], x, z, look.mark, alpha, fade, sim.time);
      }
      this.lastPoints[i] = [x, z];
      if (!onGround || dt <= 0) return;

      // Dust off a dry road, raised by the rear tires rolling over it, more the faster they go.
      if (i >= 2 && (id === "dirt" || id === "loose") && airiness > 0 && travel > 1.2) {
        P.spawn("trail", (travel - 1.2) * 4.5, dt, (rand) => ({
          x: x - sim.v[0] * 0.04 + (rand() - 0.5) * 0.3,
          y: groundY + 0.2 + rand() * 0.15,
          z: z - sim.v[2] * 0.04 + (rand() - 0.5) * 0.3,
          vx: sim.v[0] * 0.3 + (rand() - 0.5) * 0.9,
          vy: 0.15 + rand() * 0.35,
          vz: sim.v[2] * 0.3 + (rand() - 0.5) * 0.9,
        }));
      }

      // Loose stuff flies off the way the bottom of the tread is moving over the ground.
      const t = c.tread;
      const fling = (rand, up) => {
        const across = (rand() - 0.5) * TIRE.width;
        return {
          x: x + a[0] * across + (rand() - 0.5) * 0.04,
          y: groundY + 0.01,
          z: z + a[2] * across + (rand() - 0.5) * 0.04,
          vx: sim.v[0] * 0.3 + t[0] * (0.3 + rand() * 0.6) + (rand() - 0.5) * 0.4,
          vy: up * (0.3 + rand() * 0.9) + 0.2,
          vz: sim.v[2] * 0.3 + t[2] * (0.3 + rand() * 0.6) + (rand() - 0.5) * 0.4,
        };
      };
      const kind = look.throws;
      if (kind === "smoke") {
        if (slipSpeed > 2.5 && airiness > 0) {
          P.spawn("smoke", (slipSpeed - 2.5) * 16 * Math.min(2, load), dt, (rand) => ({
            x: x + (rand() - 0.5) * 0.12,
            y: groundY + 0.03,
            z: z + (rand() - 0.5) * 0.12,
            vx: t[0] * 0.15,
            vy: 0.1 + rand() * 0.2,
            vz: t[2] * 0.15,
          }));
        }
      } else if (kind === "spray") {
        const rate = slipSpeed * 140 + Math.max(0, travel - 0.4) * 70;
        if (rate > 1) P.spawn("spray", rate, dt, (rand) => fling(rand, 0.4 + slipSpeed * 0.3 + travel * 0.25));
      } else if (kind === "frost") {
        if (slipSpeed > 0.5) P.spawn("frost", slipSpeed * 70, dt, (rand) => fling(rand, 0.3));
      } else if (slipSpeed > 0.25) {
        P.spawn(kind, slipSpeed * 110 * Math.min(2, load), dt, (rand) => fling(rand, 0.3 + slipSpeed * 0.35));
        if ((kind === "sand" || kind === "stones" || kind === "dirt") && airiness > 0) {
          P.spawn("dust", slipSpeed * 8, dt, (rand) => ({ ...fling(rand, 0.2), vx: t[0] * 0.2, vz: t[2] * 0.2 }));
        }
      }
    });
    this.marks.write(sim.time, MOUNTAIN);
    P.update(dt, sim.g, airiness, MOUNTAIN);
  }

  // Arrows for the forces, to one scale: the weight on one tire is 0.8 of a tire's radius long.
  updateForces(sim, show) {
    const a = this.arrows;
    for (const arrow of [a.weight, ...a.normals, ...a.frictions]) arrow.group.visible = show;
    this.torque.visible = show && !!sim.wheelTorque;
    this.labelPoints = {};
    if (!show) return;
    const weight = sim.mass * sim.g;
    const unit = (0.8 * R) / (weight / 4 || 1);
    const cap = 2.6 * R;
    const len = (f) => Math.sign(f) * Math.min(cap, Math.abs(f) * unit);
    const [px, py, pz] = sim.p;

    // The weight to the same scale, so it's as long as the four tires' pushes put together.
    const down = -Math.min(weight * unit, 4 * cap);
    a.weight.set(new THREE.Vector3(px, py, pz), new THREE.Vector3(0, down, 0));
    this.labelPoints.weight = new THREE.Vector3(px, py + down * 0.5, pz);
    sim.wheels.forEach((wheel, i) => {
      const c = wheel.contact;
      // Just outside each tire, so the tire doesn't hide them.
      const out = wheel.side * (HALF_WIDTH + 0.03);
      const at = new THREE.Vector3(c.ground[0] + c.axle[0] * out, c.ground[1] + c.axle[1] * out, c.ground[2] + c.axle[2] * out);
      if (c.normal > 0) {
        const push = len(c.normal);
        const n = new THREE.Vector3(...c.n).multiplyScalar(push);
        a.normals[i].set(at.clone().sub(n), n);
        const f = new THREE.Vector3(...c.friction);
        const size = f.length();
        a.frictions[i].set(at, size > 0 ? f.multiplyScalar(Math.abs(len(size)) / size) : new THREE.Vector3());
        this.labelPoints["tire" + i] = at.clone().addScaledVector(n, -0.5);
      } else {
        a.normals[i].group.visible = false;
        a.frictions[i].group.visible = false;
      }
    });
    if (sim.wheelTorque) {
      // An arc round the rear axle at the differential, turning the way the engine turns the tires.
      const T = sim.wheelTorque;
      const dir = Math.sign(T);
      const sweep = Math.min(1, Math.abs(T) / 6000) * Math.PI * 1.2 + 0.4;
      this.torqueArc.geometry.dispose();
      this.torqueArc.geometry = new THREE.TorusGeometry(0.24, 0.008, 8, 48, sweep);
      const diff = new THREE.Vector3(...sim.axleFrame(sim.axles[1]).middle);
      this.torque.position.copy(diff);
      // The torus lies in its own xy plane; turned to the plane the tires turn in. There, its angle
      // runs from forward (0) up over the top (π/2); spinning forward, the top goes forward, so the
      // angle falls. Centre the arc on the top, head at the end it turns to.
      this.torque.rotation.set(0, sim.heading + Math.PI / 2, 0);
      const start = Math.PI / 2 - sweep / 2;
      this.torqueArc.rotation.set(0, 0, start);
      const end = dir > 0 ? start : start + sweep;
      this.torqueHead.position.set(Math.cos(end) * 0.24, Math.sin(end) * 0.24, 0);
      this.torqueHead.rotation.set(0, 0, end + (dir > 0 ? Math.PI : 0));
      this.labelPoints.torque = diff.clone().add(new THREE.Vector3(0, 0.25, 0));
    }
  }

  // Where a point in the world is on screen, in CSS pixels, or null if behind the camera.
  project(p) {
    const v = p.clone().project(this.camera);
    if (v.z > 1) return null;
    return { x: (v.x * 0.5 + 0.5) * this.W, y: (-v.y * 0.5 + 0.5) * this.H };
  }
}

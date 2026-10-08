import * as THREE from "three";
import { unlockAudio, sfx, setRumble, startMusic, stopMusic, setMusicTempo, isMuted, setMuted } from "./audio.js";

// ---------- Tuning ----------
const LANES = [-2.2, 0, 2.2];
const SLOPE = Math.tan(THREE.MathUtils.degToRad(9)); // how steeply the track climbs toward the mountains
const BOULDER_R = 0.9;
const TRAIN_LENGTH = 4;
const TRAIN_SPACING = 1.55; // centre to centre, a little under one diameter so a train reads as one mass
const SPAWN_Z = -95;
const FIRST_ROW_Z = -70; // where a new run's first boulders already are
const DESPAWN_Z = 16;
// The pace climbs quickly at first and then levels off toward MAX_SPEED, which it never passes:
// about 22 after 10 s, 31 after 30 s, 38 after a minute.
const START_SPEED = 16;
const MAX_SPEED = 44;
const SPEED_TIME = 40; // seconds to cover about two thirds of the climb
// However fast it gets, rows of obstacles are always at least this far apart in time, so there's
// room to react and change trails.
const MIN_ROW_SECONDS = 0.65;
const ATTRACT_SPEED = 12;
const JUMP_HEIGHT = 2.6;
// A jump lasts exactly as long as the boulders take to roll this far, so it feels the same at any
// speed: a single rock is always clearable, and a train is something to land on.
const JUMP_DISTANCE = 16; // a long, floaty jump: about a second in the air at the starting pace
// Forgiving timing for chained moves: a jump pressed this long (seconds) before landing happens
// on landing, and one pressed this soon after a rock rolls out from under the teddy still counts.
const JUMP_BUFFER = 0.25;
const COYOTE_TIME = 0.12;
const TOP_RADIUS = BOULDER_R * 0.85; // the surface the teddy stands on, a little inside the lumps
const FOOT_RADIUS = 0.3;
const STEP_UP = 0.45; // a rock face taller than this in front of the teddy knocks it over
const PASSED_Z = 1.1; // a rock this far past the teddy counts as dodged
// Ducking lasts exactly as long as a jump: as long as the obstacles take to travel JUMP_DISTANCE.
// Like the jump, it feels the same at any speed, and it always covers a gate passing overhead.
const DUCK_DISTANCE = JUMP_DISTANCE;
const STAND_HEIGHT = 1.8;
const DUCK_HEIGHT = 0.95;
const BODY_HALF_WIDTH = 0.35;
const BODY_HALF_DEPTH = 0.3;
// Wooden gates: posts just inside the trail edges, and a board hanging from the top beam down to
// GATE_CLEARANCE, above a ducking teddy but below a standing one.
const GATE_HALF_WIDTH = 0.95;
const GATE_TOP = 3.6; // taller than the top of a jump, so gates can't be jumped
const GATE_CLEARANCE = 1.15;
const GATE_DEPTH = 0.12;
const SWIPE_PX = 28;
const BEST_KEY = "boulder-bear-best";

const groundY = (z) => -z * SLOPE;
const clamp = THREE.MathUtils.clamp;
const isTouch = window.matchMedia("(pointer: coarse)").matches;

// ---------- Renderer, scene, lights ----------
const canvas = document.getElementById("game");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
// The most pixels drawn per CSS pixel. Slower devices step below this on their own to hold their
// frame rate (see adaptResolution).
const MAX_PIXEL_RATIO = Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2);
renderer.setPixelRatio(MAX_PIXEL_RATIO);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
// Neutral tone mapping keeps the bright storybook colours but rolls sunlit snow and fur off
// softly instead of clipping them to white.
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.05;

// The sky at the horizon: the distant mountains fade into it.
const HAZE = 0xc3dbef;
const scene = new THREE.Scene();
scene.background = new THREE.Color(HAZE);
scene.fog = new THREE.FogExp2(HAZE, 0.0035);

const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 800);
const cameraBase = new THREE.Vector3(0, 4.2, 8);

// A warm afternoon sun from the right, a little behind the camera: shadows fall away up the
// valley, and every boulder has a sunlit side and a shaded one.
const SUN_DIR = new THREE.Vector3(0.62, 0.58, 0.52).normalize();
scene.add(new THREE.HemisphereLight(0xd2e5ff, 0x5a7340, 1.15));
const sun = new THREE.DirectionalLight(0xfff0d6, 3.1);
sun.castShadow = true;
const shadowSize = isTouch ? 1024 : 2048;
sun.shadow.mapSize.set(shadowSize, shadowSize);
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
sun.shadow.radius = isTouch ? 2 : 3;
scene.add(sun, sun.target);
// Points the sun at the play area and fits its shadow box tightly around it: the trails from just
// behind the teddy to where boulders come into view, and the trees either side. Anything outside
// gets a shadow baked into the ground instead (see shadeGround).
const SHADOW_BOX = { x: 26, near: 14, far: -72 };
fitShadow();

function fitShadow() {
  const target = new THREE.Vector3(0, groundY(-28), -28);
  sun.target.position.copy(target);
  sun.position.copy(target).addScaledVector(SUN_DIR, 100);
  const cam = sun.shadow.camera;
  cam.position.copy(sun.position);
  cam.lookAt(target);
  cam.updateMatrixWorld();
  const box = new THREE.Box3();
  const p = new THREE.Vector3();
  for (const x of [-SHADOW_BOX.x, SHADOW_BOX.x]) {
    for (const z of [SHADOW_BOX.near, SHADOW_BOX.far]) {
      for (const dy of [-1, 16]) box.expandByPoint(p.set(x, groundY(z) + dy, z).applyMatrix4(cam.matrixWorldInverse));
    }
  }
  Object.assign(cam, { left: box.min.x, right: box.max.x, bottom: box.min.y, top: box.max.y, near: -box.max.z - 15, far: -box.min.z + 5 });
  cam.updateProjectionMatrix();
}

// ---------- Noise ----------
// Smooth value noise on a hashed lattice, in -1..1. It depends only on position, so the valley,
// the mountains and every boulder look the same on every visit.
function hash3(x, y, z) {
  let h = Math.imul(x, 0x27d4eb2d) ^ Math.imul(y, 0x165667b1) ^ Math.imul(z, 0x61c88647);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

const fade = (t) => t * t * (3 - 2 * t);

function vnoise(x, y, z) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = fade(x - xi);
  const v = fade(y - yi);
  const w = fade(z - zi);
  const a = hash3(xi, yi, zi);
  const b = hash3(xi + 1, yi, zi);
  const c = hash3(xi, yi + 1, zi);
  const d = hash3(xi + 1, yi + 1, zi);
  const e = hash3(xi, yi, zi + 1);
  const f = hash3(xi + 1, yi, zi + 1);
  const g = hash3(xi, yi + 1, zi + 1);
  const h = hash3(xi + 1, yi + 1, zi + 1);
  const near = a + (b - a) * u + (c + (d - c) * u - a - (b - a) * u) * v;
  const far = e + (f - e) * u + (g + (h - g) * u - e - (f - e) * u) * v;
  return (near + (far - near) * w) * 2 - 1;
}

// Fractal noise: octaves of finer and fainter detail, in roughly -1..1.
function fbm(x, y, z, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += vnoise(x, y, z) * amp;
    norm += amp;
    x *= 2.03;
    y *= 2.03;
    z *= 2.03;
    amp *= 0.5;
  }
  return sum / norm;
}

// Sharp-crested ridges in 0..1, for mountain ranges.
function ridged(x, z, octaves = 5) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  let weight = 1;
  for (let i = 0; i < octaves; i++) {
    let n = 1 - Math.abs(vnoise(x, i * 7.31 + 0.5, z));
    n *= n * weight;
    weight = clamp(n * 1.8, 0, 1);
    sum += n * amp;
    norm += amp;
    x *= 2.07;
    z *= 2.07;
    amp *= 0.5;
  }
  return sum / norm;
}

// Tiling fractal noise for the clouds: every octave's lattice wraps at the texture's edge.
function cloudNoiseTexture(size = 256) {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = 0;
      let amp = 0.5;
      for (let o = 0; o < 5; o++) {
        const period = 4 << o;
        const fx = (x / size) * period;
        const fy = (y / size) * period;
        const xi = Math.floor(fx);
        const yi = Math.floor(fy);
        const u = fade(fx - xi);
        const v = fade(fy - yi);
        const at = (i, j) => hash3((xi + i) % period, (yi + j) % period, o + 99);
        sum += amp * ((at(0, 0) * (1 - u) + at(1, 0) * u) * (1 - v) + (at(0, 1) * (1 - u) + at(1, 1) * u) * v);
        amp *= 0.5;
      }
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = Math.round((sum / 0.96875) * 255);
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

// ---------- Sky ----------
// A gradient dome on the far plane with soft clouds drifting across it and a warm glow toward
// the sun. It's drawn after the scenery, so only the sky that is actually visible costs anything.
const skyUniforms = {
  uZenith: { value: new THREE.Color(0x2c7ad4) },
  uHorizon: { value: new THREE.Color(0xa6cdee) },
  uSunDir: { value: SUN_DIR },
  uSunColor: { value: new THREE.Color(0xffd9a0) },
  // Like fog, the haze is mixed in after tone mapping, so it's given as the final on-screen colour.
  uHaze: { value: new THREE.Color().setHex(HAZE, THREE.LinearSRGBColorSpace) },
  uClouds: { value: null },
  uTime: { value: 0 },
};

function makeSky() {
  skyUniforms.uClouds.value = cloudNoiseTexture();
  const material = new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = vec4(p.xy, p.w * 0.99999, p.w); // on the far plane, behind everything
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uZenith;
      uniform vec3 uHorizon;
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      uniform vec3 uHaze;
      uniform sampler2D uClouds;
      uniform float uTime;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        float h = clamp(d.y, 0.0, 1.0);
        vec3 col = mix(uHorizon, uZenith, pow(h, 0.5));
        float s = max(dot(d, uSunDir), 0.0);
        col += uSunColor * (pow(s, 3.0) * 0.18 + pow(s, 24.0) * 0.35);
        // Clouds on a flat layer overhead, thinning out toward the horizon. They're brighter on
        // the side facing the sun and grey underneath.
        vec2 uv = d.xz / (d.y + 0.12) * 0.16 + vec2(uTime * 0.0025, uTime * 0.0008);
        float n = texture2D(uClouds, uv).r * 0.65 + texture2D(uClouds, uv * 2.9 + 0.37).r * 0.35;
        float cover = smoothstep(0.5, 0.7, n) * smoothstep(0.03, 0.22, d.y);
        float toward = texture2D(uClouds, uv + uSunDir.xz * 0.025).r * 0.65 + texture2D(uClouds, (uv + uSunDir.xz * 0.025) * 2.9 + 0.37).r * 0.35;
        float lit = clamp(0.62 + (n - toward) * 6.0, 0.0, 1.0);
        vec3 cloud = mix(vec3(0.62, 0.69, 0.8), vec3(1.08, 1.04, 0.98), lit);
        col = mix(col, cloud, cover);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        // Down at the horizon the sky turns into exactly the haze the mountains fade into.
        gl_FragColor.rgb = mix(gl_FragColor.rgb, uHaze, pow(1.0 - h, 9.0));
      }`,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), material);
  sky.frustumCulled = false;
  sky.renderOrder = 1000; // after the scenery, so sky hidden behind it is never shaded
  scene.add(sky);
  return sky;
}

// ---------- World ----------
// Everything below is generated once at startup: canvas textures instead of image files, and
// one instanced draw call per kind of scenery so the frame stays cheap on phones.
const DETAIL = isTouch ? 0.6 : 1; // scales scenery counts down on phones
const rand = mulberry32(7); // fixed seed so the valley looks the same every visit
const pick = (arr) => arr[(rand() * arr.length) | 0];
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// Smooth, cheap pseudo-noise in roughly -1..1.
const noise2 = (x, z) =>
  Math.sin(x * 0.13 + z * 0.05) * 0.5 + Math.sin(x * 0.07 - z * 0.11 + 1.7) * 0.35 + Math.sin(x * 0.31 + z * 0.23) * 0.15;

// The trails run along a flat strip; beyond it the valley sides climb into the mountains.
const FLAT_HALF_WIDTH = 5.5;

// Snow peaks around the head of the valley: [x, z, height, radius]. They stand well back, behind
// a craggy ridge of foothills that closes the valley right behind the spawn point, so boulders
// appear to roll straight off the mountain.
const PEAKS = [
  [0, -235, 40, 100],
  [-85, -220, 33, 66],
  [92, -228, 36, 70],
  [-165, -195, 30, 64],
  [170, -205, 33, 64],
  [-50, -335, 54, 85],
  [65, -355, 60, 95],
  [-205, -310, 45, 85],
  [215, -320, 48, 85],
  [0, -450, 72, 120],
];

// How far the mountains lift the ground above the valley: nothing down by the trails, rising
// behind the head of the valley and out past its sides.
function mountainLift(x, z) {
  const ax = Math.abs(x);
  const mask = Math.max(smoothstep(-84, -122, z), smoothstep(36, 110, ax));
  if (mask === 0) return 0;
  let massif = 0;
  for (const [px, pz, h, r] of PEAKS) {
    const d2 = ((x - px) ** 2 + (z - pz) ** 2) / (r * r);
    if (d2 < 1) massif += h * (1 - d2) ** 2;
  }
  const crags = ridged(x * 0.011 + 3.7, z * 0.011 + 1.3, isTouch ? 5 : 6);
  // The foothills' steep face at the head of the valley is tall enough to hide the biggest
  // boulders until they roll out of it.
  const face = smoothstep(-86, -98, z) * (1 - smoothstep(10, 34, ax)) * 8;
  return mask * (massif * (0.45 + 0.95 * crags) + 3 + 12 * crags) + face;
}

function terrainY(x, z) {
  const side = Math.max(0, Math.abs(x) - FLAT_HALF_WIDTH);
  const bumps = noise2(x, z) * Math.min(1, side * 0.3) * 0.9;
  // The valley sides climb, then level off into high pasture below the ridges.
  const wall = side * 0.25 + side * side * 0.008;
  return groundY(z) + 45 * Math.tanh(wall / 45) + bumps + mountainLift(x, z);
}

// 0..1: how thickly the far slopes are forested. Pines grow on the gentler slopes, in clumps,
// up to a ragged tree line. The valley itself has its own trees (see makeScenery).
function forestAt(x, z, y, ny) {
  const away = Math.max(smoothstep(42, 56, Math.abs(x)), smoothstep(-100, -114, z));
  if (away === 0) return 0;
  const belowTreeLine = 1 - smoothstep(64, 80, y + fbm(x * 0.02, 3.3, z * 0.02, 2) * 18);
  const gentle = smoothstep(0.66, 0.82, ny);
  const clumps = smoothstep(-0.12, 0.18, fbm(x * 0.035 + 7, 2.2, z * 0.035, 3));
  return away * belowTreeLine * gentle * clumps;
}

// Somewhere off the trails, so scenery never sits where the teddy and boulders travel.
function meadowX(minAbs, maxAbs, trailClearance = 0.75) {
  for (;;) {
    const x = (rand() < 0.5 ? -1 : 1) * (minAbs + rand() * (maxAbs - minAbs));
    if (LANES.every((lane) => Math.abs(x - lane) > trailClearance)) return x;
  }
}

function canvasTexture(width, height, draw, repeatX = 1, repeatY = 1) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  draw(c.getContext("2d"), width, height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return tex;
}

// For textures that hold detail rather than colour (brightness, bumps): used as stored.
const dataTexture = (...args) => {
  const tex = canvasTexture(...args);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
};

// Draws a soft blob, repeated across the edges so the texture still tiles.
function softSpot(ctx, w, h, x, y, r, color) {
  for (const dx of [-w, 0, w]) {
    for (const dy of [-h, 0, h]) {
      const cx = x + dx;
      const cy = y + dy;
      if (cx + r < 0 || cx - r > w || cy + r < 0 || cy - r > h) continue;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
  }
}

// Fine detail for the ground, in brightness around white: the colour comes from the terrain's
// vertex colours, so the same texture serves meadow, rock and snow.
function groundDetailTexture() {
  return dataTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = "#e4e6df";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) {
      softSpot(ctx, w, h, rand() * w, rand() * h, 20 + rand() * 60, rand() < 0.5 ? "rgba(255,255,255,0.16)" : "rgba(60,70,40,0.1)");
    }
    const blades = ["#c3cdb0", "#f6f9ee", "#aab894", "#ffffff", "#d3ddc0", "#98a982", "#e9efd8"];
    ctx.lineCap = "round";
    for (let i = 0; i < (w * h) / 12; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const len = 3 + rand() * 7;
      ctx.lineWidth = 1 + rand() * 0.8;
      ctx.strokeStyle = pick(blades);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + (rand() - 0.5) * 3, y - len * 0.6, x + (rand() - 0.5) * 5, y - len);
      ctx.stroke();
    }
    // Clover leaves and tiny daisies.
    for (let i = 0; i < 260; i++) {
      const x = rand() * w;
      const y = rand() * h;
      ctx.fillStyle = "rgba(150,175,120,0.55)";
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.arc(x + Math.cos(k * 2.1) * 2.2, y + Math.sin(k * 2.1) * 2.2, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    for (let i = 0; i < 380; i++) {
      ctx.fillStyle = rand() < 0.7 ? "rgba(255,255,255,0.95)" : "rgba(255,240,170,0.95)";
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h, 1 + rand() * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Three winding, worn hiking trails on a transparent canvas, laid over the meadow. The canvas
// spans TRAIL_STRIP_W across and TRAIL_TILE along the slope; every wobble completes a whole
// number of cycles per tile so the texture repeats without seams.
const TRAIL_STRIP_W = 8;
const TRAIL_TILE = 16;
const TRAIL_START = 20; // the trails run from just behind the camera...
const TRAIL_END = -100; // ...into the foot of the mountain
function trailTexture() {
  return canvasTexture(
    512,
    1024,
    (ctx, w, h) => {
      const px = w / TRAIL_STRIP_W;
      const waves = (y, a, b, c, d) => Math.sin(((Math.PI * 2 * y) / h) * a + b) * c + Math.sin(((Math.PI * 2 * y) / h) * (a + 2) + d) * c * 0.6;
      const trails = LANES.map((lane, i) => ({ cx: (lane + TRAIL_STRIP_W / 2) * px, phase: i * 2.1 }));
      const edgeAt = (t, y) => {
        const center = t.cx + waves(y, 1, t.phase, 5, t.phase * 1.7);
        const half = 0.58 * px + waves(y, 3, t.phase * 0.5, 4, t.phase + 1);
        return [center, half];
      };
      const onTrail = (spread = 1) => {
        const t = pick(trails);
        const y = rand() * h;
        const [c, half] = edgeAt(t, y);
        return [c + (rand() * 2 - 1) * half * spread, y, half];
      };
      // Trampled, yellowed grass along each side, then the bare earth.
      for (const t of trails) {
        for (let y = 0; y < h; y++) {
          const [c, half] = edgeAt(t, y);
          ctx.fillStyle = "rgba(170,160,95,0.3)";
          ctx.fillRect(c - half - 11, y, half * 2 + 22, 1);
          ctx.fillStyle = "rgba(150,128,82,0.55)";
          ctx.fillRect(c - half - 4, y, half * 2 + 8, 1);
          ctx.fillStyle = "#a27f58";
          ctx.fillRect(c - half, y, half * 2, 1);
        }
      }
      // From here on, paint only onto the earth already laid down.
      ctx.globalCompositeOperation = "source-atop";
      for (let i = 0; i < 420; i++) {
        const [x, y] = onTrail(1.1);
        const dark = rand() < 0.5;
        softSpot(ctx, w, h, x, y, 6 + rand() * 20, dark ? "rgba(92,62,36,0.22)" : "rgba(214,190,150,0.22)");
      }
      // Packed earth down the middle where boots go.
      for (const t of trails) {
        for (let y = 0; y < h; y++) {
          const [c, half] = edgeAt(t, y);
          ctx.fillStyle = "rgba(96,66,40,0.16)";
          ctx.fillRect(c - half * 0.45, y, half * 0.9, 1);
        }
      }
      // Grit.
      for (let i = 0; i < 6000; i++) {
        const [x, y] = onTrail();
        ctx.fillStyle = rand() < 0.5 ? "rgba(70,46,26,0.45)" : "rgba(230,212,178,0.55)";
        ctx.fillRect(x, y, 1 + rand() * 2, 1 + rand() * 2);
      }
      // Pebbles and stones, lit from the right with a shadow on the left.
      for (let i = 0; i < 150; i++) {
        const [x, y] = onTrail(0.95);
        const r = 2 + rand() * 4.5;
        const angle = rand() * 3;
        ctx.fillStyle = "rgba(60,40,25,0.45)";
        ctx.beginPath();
        ctx.ellipse(x - r * 0.25, y + r * 0.2, r, r * 0.75, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = pick(["#8f8b86", "#a6a199", "#7b7670", "#b0a796"]);
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.75, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.ellipse(x + r * 0.3, y - r * 0.25, r * 0.45, r * 0.3, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      // Grass creeping over the trail edges.
      ctx.lineCap = "round";
      for (const t of trails) {
        for (let i = 0; i < 700; i++) {
          const y = rand() * h;
          const [c, half] = edgeAt(t, y);
          const x = c + (rand() < 0.5 ? -1 : 1) * (half - 5 + rand() * 13);
          ctx.lineWidth = 1.2 + rand();
          ctx.strokeStyle = pick(["#5f9a3c", "#79b04a", "#4f8a33", "#8cbf58"]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + (rand() - 0.5) * 4, y - 3 - rand() * 6);
          ctx.stroke();
        }
      }
    },
    1,
    (TRAIL_START - TRAIL_END) / TRAIL_TILE
  );
}

// Grid lines from runs of [from, to, step]: dense near the trails, coarse far away.
function gridLines(runs) {
  const lines = [];
  for (const [from, to, step] of runs) {
    const n = Math.max(1, Math.round(Math.abs(to - from) / step));
    for (let i = 0; i < n; i++) lines.push(from + ((to - from) * i) / n);
  }
  lines.push(runs[runs.length - 1][1]);
  return lines;
}

const GROUND = {
  lush: new THREE.Color(0x467f2e),
  bright: new THREE.Color(0x7aab45),
  dry: new THREE.Color(0xb2b25c),
  forest: new THREE.Color(0x2c5528),
  rock: new THREE.Color(0x8e877c),
  darkRock: new THREE.Color(0x5f5953),
  snow: new THREE.Color(0xffffff).multiplyScalar(1.12),
};
const rockTint = new THREE.Color();

function groundColor(x, y, z, ny, forest, c) {
  const patch = fbm(x * 0.045, 0.5, z * 0.045, 3);
  c.copy(GROUND.lush).lerp(GROUND.bright, clamp(0.55 + patch * 1.3, 0, 1));
  c.lerp(GROUND.dry, smoothstep(0.12, 0.42, fbm(x * 0.02 + 40, 1.5, z * 0.02, 2)) * 0.5);
  c.lerp(GROUND.forest, forest * 0.85);
  const lift = mountainLift(x, z);
  if (lift > 0.5) {
    // Bare rock on the steep faces and above the tree line, and snow lying on the gentler
    // slopes up high.
    const alt = y + patch * 14;
    const steep = smoothstep(0.86, 0.6, ny);
    const high = smoothstep(56, 76, alt);
    rockTint.copy(GROUND.rock).lerp(GROUND.darkRock, clamp(0.5 - patch * 2.2, 0, 1));
    c.lerp(rockTint, Math.max(steep, high) * smoothstep(0.5, 6, lift));
    const drifts = smoothstep(-0.25, 0.15, fbm(x * 0.09, 4.4, z * 0.09, 3));
    c.lerp(GROUND.snow, smoothstep(68, 80, alt) * smoothstep(0.5, 0.7, ny) * (0.35 + 0.65 * drifts));
  }
  return c;
}

// Darkens the ground in a soft disc, for ambient occlusion and baked shadows. Set by makeGround.
let shadeGround = () => {};
const forestSpots = []; // ground vertices deep in the far forests, where distant pines go
let groundMesh = null;

// The whole landscape as one mesh: the meadow and trails, the valley sides and the mountains
// beyond, with grass, rock and snow painted on in vertex colours.
function makeGround() {
  const step = isTouch ? 2 : 1;
  const xs = gridLines([
    [-340, -130, 10 * step],
    [-130, -50, 4 * step],
    [-50, -20, 2 * step],
    [-20, 20, step],
    [20, 50, 2 * step],
    [50, 130, 4 * step],
    [130, 340, 10 * step],
  ]);
  const zs = gridLines([
    [20, -90, step],
    [-90, -180, 2 * step],
    [-180, -500, 5 * step],
  ]);
  const cols = xs.length;
  const count = cols * zs.length;
  const position = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  for (let r = 0; r < zs.length; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      position.set([xs[c], terrainY(xs[c], zs[r]), zs[r]], i * 3);
      uv.set([xs[c] / 4, -zs[r] / 4], i * 2);
    }
  }
  const index = [];
  for (let r = 0; r < zs.length - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const a = r * cols + c;
      index.push(a, a + 1, a + cols, a + 1, a + cols + 1, a + cols);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();
  const normal = geo.attributes.normal;
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const [x, y, z] = [position[i * 3], position[i * 3 + 1], position[i * 3 + 2]];
    const forest = forestAt(x, z, y, normal.getY(i));
    if (forest > 0.25) forestSpots.push(i);
    groundColor(x, y, z, normal.getY(i), forest, c).toArray(colors, i * 3);
  }
  const color = new THREE.BufferAttribute(colors, 3);
  geo.setAttribute("color", color);
  groundMesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: groundDetailTexture(), vertexColors: true }));
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  shadeGround = (x0, z0, radius, strength) => {
    const cs = [];
    xs.forEach((x, c) => Math.abs(x - x0) < radius && cs.push(c));
    zs.forEach((z, r) => {
      if (Math.abs(z - z0) >= radius) return;
      for (const c of cs) {
        const d2 = ((xs[c] - x0) ** 2 + (z - z0) ** 2) / (radius * radius);
        if (d2 >= 1) continue;
        const k = 1 - strength * (1 - d2) ** 2;
        const i = (r * cols + c) * 3;
        colors[i] *= k;
        colors[i + 1] *= k;
        colors[i + 2] *= k;
      }
    });
    color.needsUpdate = true;
  };

  // The trails, laid on the flat middle of the slope.
  const trailMap = trailTexture();
  const trails = new THREE.Mesh(
    new THREE.PlaneGeometry(TRAIL_STRIP_W, (TRAIL_START - TRAIL_END) / Math.cos(Math.atan(SLOPE))),
    new THREE.MeshLambertMaterial({ map: trailMap, bumpMap: trailMap, bumpScale: 1.2, transparent: true, depthWrite: false })
  );
  const mid = (TRAIL_START + TRAIL_END) / 2;
  trails.rotation.x = -Math.PI / 2 + Math.atan(SLOPE);
  trails.position.set(0, groundY(mid) + 0.02, mid);
  trails.receiveShadow = true;
  trails.renderOrder = -1; // under the dust, which also skips the depth buffer
  scene.add(trails);
}

// Concatenates non-indexed geometries that share the same attributes into one. Normals are made
// flat, kept as given ("keep"), or smoothed up to a crease angle in degrees.
function mergeGeometries(geos, normals = "flat") {
  const merged = new THREE.BufferGeometry();
  for (const name of Object.keys(geos[0].attributes)) {
    const size = geos[0].attributes[name].itemSize;
    const total = geos.reduce((n, g) => n + g.attributes[name].array.length, 0);
    const out = new Float32Array(total);
    let offset = 0;
    for (const g of geos) {
      out.set(g.attributes[name].array, offset);
      offset += g.attributes[name].array.length;
    }
    merged.setAttribute(name, new THREE.BufferAttribute(out, size));
  }
  if (normals === "flat") merged.computeVertexNormals();
  else if (typeof normals === "number") creasedNormals(merged, normals);
  return merged;
}

// Smooth normals for a non-indexed geometry: each corner averages the faces around it that bend
// less than `crease` degrees from its own, so round surfaces look round and sharp edges stay sharp.
function creasedNormals(geo, crease) {
  const pos = geo.attributes.position;
  const faces = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    faces.push(new THREE.Vector3().subVectors(c, b).cross(a.sub(b)).normalize());
  }
  const corners = new Map();
  for (let i = 0; i < pos.count; i++) {
    const key = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
    if (!corners.has(key)) corners.set(key, []);
    corners.get(key).push(i);
  }
  const limit = Math.cos(THREE.MathUtils.degToRad(crease));
  const normals = new Float32Array(pos.count * 3);
  const sum = new THREE.Vector3();
  for (const list of corners.values()) {
    for (const i of list) {
      const own = faces[(i / 3) | 0];
      sum.set(0, 0, 0);
      for (const j of list) {
        const other = faces[(j / 3) | 0];
        if (own.dot(other) >= limit) sum.add(other);
      }
      sum.normalize().toArray(normals, i * 3);
    }
  }
  geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  return geo;
}

// Paints each triangle of a non-indexed geometry with its own colour.
function colorFaces(geo, colorFor) {
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const a = new THREE.Vector3();
  const centroid = new THREE.Vector3();
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i += 3) {
    centroid.set(0, 0, 0);
    for (let j = 0; j < 3; j++) centroid.add(a.fromBufferAttribute(pos, i + j));
    centroid.divideScalar(3);
    colorFor(centroid, c);
    for (let j = 0; j < 3; j++) c.toArray(colors, (i + j) * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

// Paints every corner of a geometry with a colour worked out from its position.
function colorVertices(geo, colorFor) {
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    colorFor(v.fromBufferAttribute(pos, i), c);
    c.toArray(colors, i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

// Moves every copy of a shared corner the same way, so a non-indexed mesh stays closed.
function jitterVertices(geo, move) {
  const pos = geo.attributes.position;
  const moved = new Map();
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
    if (!moved.has(key)) moved.set(key, move(v.clone()));
    const m = moved.get(key);
    pos.setXYZ(i, m.x, m.y, m.z);
  }
  return geo;
}

// A primitive made ready to merge: no index, no uv, and painted.
function part(geo, colorFor) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  g.deleteAttribute("uv");
  g.deleteAttribute("normal");
  return colorVertices(g, colorFor);
}

// Wind: gusts roll across the valley and bend grass, flowers and trees, the more the higher up
// they are. Done in the vertex shader, so it costs the CPU nothing.
const wind = { value: 0 };
function swaying(material, bend) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = wind;
    shader.uniforms.uBend = { value: bend };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uBend;")
      .replace(
        "#include <project_vertex>",
        /* glsl */ `
        vec4 mvPosition = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
        #endif
        float gust = sin( uTime * 1.7 + mvPosition.x * 0.23 + mvPosition.z * 0.17 ) * 0.7
          + sin( uTime * 4.1 + mvPosition.x * 0.9 - mvPosition.z * 0.7 ) * 0.3;
        mvPosition.xz += vec2( 0.8, 0.45 ) * ( gust + 0.35 ) * uBend * position.y * position.y;
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;`
      );
  };
  return material;
}

// One InstancedMesh per kind of scenery: a single draw call however many there are.
const placer = new THREE.Object3D();
function scatter(geometry, material, count, place, { colors, castShadow = false, receiveShadow = true } = {}) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    placer.position.set(0, 0, 0);
    placer.rotation.set(0, rand() * Math.PI * 2, 0);
    placer.scale.set(1, 1, 1);
    place(placer, i);
    placer.updateMatrix();
    mesh.setMatrixAt(i, placer.matrix);
    if (colors) mesh.setColorAt(i, c.set(pick(colors)).offsetHSL(0, 0, (rand() - 0.5) * 0.08));
  }
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  mesh.frustumCulled = false; // instances span the whole valley
  scene.add(mesh);
  return mesh;
}

// A clump of curved blades, dark at the roots and sunlit at the tips. The normals point straight
// up, so the blades take the same light as the ground they grow from.
function grassGeometry() {
  const r = mulberry32(5);
  const position = [];
  const color = [];
  for (let b = 0; b < 7; b++) {
    const angle = r() * Math.PI * 2;
    const lean = 0.1 + r() * 0.3;
    const height = 0.22 + r() * 0.28;
    const width = 0.04 + r() * 0.03;
    const ox = (r() - 0.5) * 0.24;
    const oz = (r() - 0.5) * 0.24;
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const at = (t, side) => [ox + dx * lean * t * t * height - dz * width * side, height * t, oz + dz * lean * t * t * height + dx * width * side];
    const corners = [at(0, 1), at(0, -1), at(0.55, 0.7), at(0.55, -0.7), at(1, 0)];
    const heights = [0, 0, 0.55, 0.55, 1];
    for (const k of [0, 1, 2, 1, 3, 2, 2, 3, 4]) {
      position.push(...corners[k]);
      const shade = 0.78 + 0.5 * heights[k];
      color.push(shade, shade, shade * (1 - 0.18 * heights[k]));
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(color, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(position.map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
  return geo;
}

// A five-petalled flower on a short stem. Petals are white in the geometry and take their colour
// from the instance; the stem stays green.
function flowerGeometry() {
  const position = [];
  const color = [];
  const add = (points, rgb) => {
    for (const p of points) {
      position.push(...p);
      color.push(...rgb);
    }
  };
  const top = 0.24;
  add([[-0.012, 0, 0], [0.012, 0, 0], [0, top, 0]], [0.25, 0.5, 0.2]);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const tip = [Math.cos(a) * 0.08, top + 0.03, Math.sin(a) * 0.08];
    const left = [Math.cos(a - 0.5) * 0.045, top + 0.01, Math.sin(a - 0.5) * 0.045];
    const right = [Math.cos(a + 0.5) * 0.045, top + 0.01, Math.sin(a + 0.5) * 0.045];
    add([[0, top, 0], left, tip, [0, top, 0], tip, right], [1, 1, 1]);
  }
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    add([[Math.cos(a) * 0.02, top + 0.02, Math.sin(a) * 0.02], [Math.cos(a + 2.1) * 0.02, top + 0.02, Math.sin(a + 2.1) * 0.02], [0, top + 0.035, 0]], [1.3, 1.1, 0.35]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(color, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(position.map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
  return geo;
}

// A pine: a trunk and five tiers of drooping boughs, darker underneath and inside, merged into
// one geometry so each tree is one instance of one draw call.
function pineGeometry() {
  const r = mulberry32(31);
  const bark = new THREE.Color(0x5e3f26);
  const parts = [part(new THREE.CylinderGeometry(0.12, 0.22, 1.6, 7, 1, true).translate(0, 0.8, 0), (_, c) => c.copy(bark))];
  const needles = [new THREE.Color(0x2f6b35), new THREE.Color(0x3a7a3c), new THREE.Color(0x2a5f33)];
  for (let i = 0; i < 5; i++) {
    const radius = 1.5 - i * 0.27;
    const height = 1.35 - i * 0.12;
    const base = 0.75 + i * 0.66;
    const cone = new THREE.ConeGeometry(radius, height, 11, 2).toNonIndexed();
    jitterVertices(cone, (v) => {
      const rim = v.y < -height / 2 + 0.01;
      if (rim && Math.hypot(v.x, v.z) > 0.01) {
        const k = 0.85 + r() * 0.3;
        v.x *= k;
        v.z *= k;
        v.y -= r() * 0.22;
      } else if (v.y < height / 2 - 0.01) {
        v.x *= 1.12; // the middle ring bulges, so each tier droops at its edge
        v.z *= 1.12;
      }
      return v;
    });
    cone.translate(0, base + height / 2, 0);
    const tint = needles[i % needles.length];
    parts.push(
      part(cone, (v, c) => {
        const t = clamp((v.y - base + 0.2) / (height + 0.2), 0, 1);
        c.copy(tint).multiplyScalar((0.62 + 0.5 * t) * (0.84 + 0.05 * i));
      })
    );
  }
  return mergeGeometries(parts, 70);
}

// A round-crowned aspen: a pale trunk and a cluster of lumpy, light green leaf masses.
function leafyTreeGeometry() {
  const parts = [part(new THREE.CylinderGeometry(0.1, 0.18, 2.4, 6, 1, true).translate(0, 1.2, 0), (_, c) => c.setHex(0xd9d4c6))];
  const leaves = new THREE.Color(0x5b8a32);
  for (const [x, y, z, s] of [[0, 2.7, 0, 1.0], [0.6, 2.3, 0.25, 0.75], [-0.55, 2.4, -0.3, 0.8], [0.1, 3.35, -0.05, 0.7], [-0.2, 2.2, 0.55, 0.6]]) {
    const blob = jitterVertices(new THREE.IcosahedronGeometry(s, 1), (v) => v.multiplyScalar(1 + fbm(v.x * 2 + x, v.y * 2, v.z * 2 + z, 2) * 0.35));
    blob.scale(1.1, 0.9, 1.1).translate(x, y, z);
    parts.push(part(blob, (v, c) => c.copy(leaves).multiplyScalar(0.5 + 0.45 * smoothstep(1.6, 3.9, v.y))));
  }
  return mergeGeometries(parts, 70);
}

// A low bush: a few overlapping leafy lumps, darker at the bottom.
function bushGeometry() {
  const parts = [];
  for (const [x, z, s] of [[0, 0, 0.55], [0.4, 0.15, 0.4], [-0.35, -0.1, 0.42]]) {
    const blob = jitterVertices(new THREE.IcosahedronGeometry(s, 1), (v) => v.multiplyScalar(1 + fbm(v.x * 3 + x, v.y * 3, v.z * 3 + z, 2) * 0.3));
    blob.translate(x, s * 0.55, z);
    parts.push(part(blob, (v, c) => c.setScalar(0.5 + 0.55 * smoothstep(0, 0.9, v.y))));
  }
  return mergeGeometries(parts, 70);
}

function makeScenery() {
  const lambert = (opts = {}) => new THREE.MeshLambertMaterial({ color: 0xffffff, ...opts });
  const onMeadow = (o, x, z, sink = 0) => o.position.set(x, terrainY(x, z) - sink, z);
  // Where the sun's shadows fall, for baking them under scenery outside the shadow map.
  const shadowDir = new THREE.Vector2(-SUN_DIR.x, -SUN_DIR.z).normalize();
  const shadowReach = Math.hypot(SUN_DIR.x, SUN_DIR.z) / SUN_DIR.y;
  const inShadowBox = (x, z) => Math.abs(x) < SHADOW_BOX.x - 2 && z < SHADOW_BOX.near && z > SHADOW_BOX.far + 4;
  const bakeShadow = (x, z, height, radius, strength = 0.42) => {
    if (inShadowBox(x, z)) return;
    const reach = height * 0.55 * shadowReach;
    shadeGround(x + shadowDir.x * reach, z + shadowDir.y * reach, radius + height * 0.25, strength);
  };

  // Grass: dense, wind-blown clumps, thickest near the camera and right up to the trail edges.
  scatter(grassGeometry(), swaying(lambert({ vertexColors: true, side: THREE.DoubleSide }), 0.45), isTouch ? 2600 : 7000, (o) => {
    onMeadow(o, meadowX(0, 20, 0.64), 13 - 104 * rand() ** 1.5);
    const s = 0.75 + rand() * 0.6;
    o.scale.set(s, s * (0.7 + rand() * 0.7), s);
  }, { colors: ["#4a842e", "#558f34", "#61993b", "#6fa443", "#7cad4a"], receiveShadow: !isTouch });

  scatter(flowerGeometry(), swaying(lambert({ vertexColors: true, side: THREE.DoubleSide }), 0.5), Math.round(900 * DETAIL), (o) => {
    onMeadow(o, meadowX(0, 16, 0.75), 11 - 92 * rand() ** 1.4);
    o.scale.setScalar(0.8 + rand() * 0.6);
  }, { colors: ["#ffffff", "#fff4c2", "#ffd93d", "#c792ea", "#ff8fab", "#8ecdf7", "#ffffff", "#ffb347"], receiveShadow: false });

  // Pebbles, some right at the trail edges.
  const pebble = new THREE.DodecahedronGeometry(0.1, 0);
  scatter(pebble, lambert({ flatShading: true }), Math.round(650 * DETAIL), (o) => {
    onMeadow(o, meadowX(0, 20, 0.5), 10 - rand() * 105, 0.02);
    const s = 0.6 + rand() * 1.8;
    o.scale.set(s, s * 0.6, s * (0.8 + rand() * 0.4));
  }, { colors: ["#9a958f", "#85817b", "#a9a39b", "#8a7f72"] });

  // Low bushes just outside the outer trails.
  scatter(bushGeometry(), swaying(lambert({ vertexColors: true }), 0.04), Math.round(90 * DETAIL), (o) => {
    const x = (rand() < 0.5 ? -1 : 1) * (3.7 + rand() * 3);
    const z = 10 - rand() * 100;
    onMeadow(o, x, z, 0.1);
    o.scale.set(0.8 + rand() * 0.8, 0.6 + rand() * 0.5, 0.8 + rand() * 0.8);
    shadeGround(x, z, 1.3 * o.scale.x, 0.3);
  }, { colors: ["#4f8f3a", "#5d9d42", "#46803a", "#6aa646"] });

  // Mossy rock outcrops on the valley sides, half sunk into the ground.
  scatter(rockGeometry(101, isTouch ? 1 : 2), stoneMaterial(lambert({ vertexColors: true, color: 0xf0e8dc })), Math.round(70 * DETAIL), (o) => {
    const s = 0.7 + rand() * 2.6;
    const x = meadowX(6.5, 45);
    const z = 8 - rand() * 115;
    onMeadow(o, x, z, s * 0.3);
    o.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    o.scale.set(s * (0.9 + rand() * 0.5), s * (0.6 + rand() * 0.4), s * (0.9 + rand() * 0.5));
    shadeGround(x, z, s * 1.6, 0.35);
    bakeShadow(x, z, s * 1.2, s);
  }, { colors: ["#ffffff", "#e6e1da", "#d8d2c8"], castShadow: true });

  // Pines on the valley sides.
  const pines = Array.from({ length: Math.round(150 * DETAIL) }, () => {
    const x = meadowX(6.2, 42);
    const z = 12 - rand() * 125;
    return { x, y: terrainY(x, z), z, s: 0.8 + rand() * 1.0 };
  });
  scatter(pineGeometry(), swaying(lambert({ vertexColors: true }), 0.004), pines.length, (o, i) => {
    const t = pines[i];
    o.position.set(t.x, t.y - 0.1, t.z);
    o.scale.setScalar(t.s);
    shadeGround(t.x, t.z, 1.9 * t.s, 0.4);
    bakeShadow(t.x, t.z, 4.5 * t.s, 1.2 * t.s);
  }, { colors: ["#ffffff", "#e8f2e4", "#f4f8ec", "#dfe9dc"], castShadow: true });

  // A few aspens among them, for a lighter green.
  scatter(leafyTreeGeometry(), swaying(lambert({ vertexColors: true }), 0.006), Math.round(36 * DETAIL), (o) => {
    const x = meadowX(7, 34);
    const z = 8 - rand() * 100;
    onMeadow(o, x, z, 0.1);
    const s = 0.8 + rand() * 0.6;
    o.scale.setScalar(s);
    shadeGround(x, z, 2 * s, 0.35);
    bakeShadow(x, z, 3.6 * s, 1.3 * s);
  }, { colors: ["#ffffff", "#f4f0d0", "#e6f2d8"], castShadow: true });

  // Distant pines on the forested slopes of the mountains: small and simple, since they're only
  // ever seen far off through the haze.
  const farPine = mergeGeometries(
    [
      part(new THREE.ConeGeometry(0.8, 2.4, 6, 1).translate(0, 1.6, 0), (v, c) => c.setHex(0x2b5a2e).multiplyScalar(0.55 + 0.45 * smoothstep(0.4, 2.8, v.y))),
      part(new THREE.ConeGeometry(0.6, 1.6, 6, 1).translate(0, 2.7, 0), (v, c) => c.setHex(0x2f6432).multiplyScalar(0.6 + 0.4 * smoothstep(1.9, 3.5, v.y))),
    ],
    60
  );
  const farCount = Math.min(forestSpots.length * 3, isTouch ? 1100 : 2600);
  const position = groundMesh.geometry.attributes.position;
  scatter(farPine, lambert({ vertexColors: true }), farCount, (o) => {
    const i = pick(forestSpots);
    const x = position.getX(i) + (rand() - 0.5) * 6;
    const z = position.getZ(i) + (rand() - 0.5) * 6;
    onMeadow(o, x, z, 0.4);
    o.scale.setScalar(1.6 + rand() * 1.8);
  }, { colors: ["#ffffff", "#e3eedd", "#cfdcc8"], receiveShadow: false });

  // Painted trail-marker posts along the outer trails.
  const posts = [];
  for (let z = 4; z > -92; z -= 11) posts.push({ x: (posts.length % 2 ? 1 : -1) * 3.55, z });
  const post = new THREE.CylinderGeometry(0.07, 0.08, 0.9, 6);
  post.translate(0, 0.45, 0);
  scatter(post, lambert({ color: 0x8a6440 }), posts.length, (o, i) => onMeadow(o, posts[i].x, posts[i].z), { castShadow: true });
  const band = new THREE.CylinderGeometry(0.085, 0.085, 0.14, 6);
  band.translate(0, 0.74, 0);
  scatter(band, lambert(), posts.length, (o, i) => onMeadow(o, posts[i].x, posts[i].z), { colors: ["#e8443a", "#f2c230"] });
}

// Birds: every so often a small flock flaps across the sky in the distance.
const birds = [];
const flock = { active: false, wait: 6, dir: 1, speed: 12, x: 0, y: 30, z: -90 };

function makeBirds() {
  // Unaffected by fog, so they stay crisp dark silhouettes against the hazy mountains.
  const mat = new THREE.MeshBasicMaterial({ color: 0x23262f, side: THREE.DoubleSide, fog: false });
  const bodyGeo = new THREE.SphereGeometry(1, 6, 4).scale(0.32, 0.1, 0.1);
  const wingGeo = new THREE.BufferGeometry();
  wingGeo.setAttribute("position", new THREE.Float32BufferAttribute([0.18, 0, 0, -0.16, 0, 0, -0.05, 0, 0.75], 3));
  for (let i = 0; i < 7; i++) {
    const bird = new THREE.Group();
    bird.add(new THREE.Mesh(bodyGeo, mat));
    const wings = [1, -1].map((side) => {
      const wing = new THREE.Mesh(wingGeo, mat);
      wing.scale.z = side; // mirrored for the other side
      bird.add(wing);
      return wing;
    });
    bird.userData = { wings, phase: Math.random() * 6, offset: new THREE.Vector3() };
    bird.scale.setScalar(4);
    bird.visible = false;
    scene.add(bird);
    birds.push(bird);
  }
}

function launchFlock() {
  flock.active = true;
  // In front of the mountains (whose foot is near z = -92) and at a height where, seen from the
  // camera, they cross the pale mountain faces.
  flock.dir = Math.random() < 0.5 ? 1 : -1;
  flock.speed = 14 + Math.random() * 8;
  flock.x = -flock.dir * 170;
  flock.y = 30 + Math.random() * 8;
  flock.z = -70 - Math.random() * 18;
  const count = 3 + Math.floor(Math.random() * 5);
  birds.forEach((bird, i) => {
    bird.visible = i < count;
    // A loose V: each pair a little behind and wider than the one in front.
    const row = Math.ceil(i / 2);
    const side = i % 2 ? 1 : -1;
    bird.userData.offset.set(-flock.dir * row * 3.6 + (Math.random() - 0.5) * 1.5, Math.random() * 1.8, side * row * 3.2);
    bird.position.y = 0; // start at the right height rather than gliding from the last flock's
    bird.rotation.y = flock.dir > 0 ? 0 : Math.PI;
  });
}

function updateBirds(dt, t) {
  if (!flock.active) {
    flock.wait -= dt;
    if (flock.wait <= 0) launchFlock();
    return;
  }
  flock.x += flock.dir * flock.speed * dt;
  for (const bird of birds) {
    if (!bird.visible) continue;
    const { offset, wings, phase } = bird.userData;
    // Keep clear of the valley sides and their trees: over the ridges the flock flies higher,
    // gliding down into the valley as it crosses in front of the mountains.
    const x = flock.x + offset.x;
    const z = flock.z + offset.z;
    const y = Math.max(flock.y, terrainY(x, z) + 10) + offset.y + Math.sin(t * 2 + phase) * 0.8;
    bird.position.y += bird.position.y ? (y - bird.position.y) * (1 - Math.exp(-dt * 3)) : y;
    bird.position.x = x;
    bird.position.z = z;
    const flap = Math.sin(t * 11 + phase) * 0.9;
    wings[0].rotation.x = flap;
    wings[1].rotation.x = -flap;
  }
  if (Math.abs(flock.x) > 180) {
    flock.active = false;
    flock.wait = 8 + Math.random() * 14;
    for (const bird of birds) bird.visible = false;
  }
}

// ---------- Stone ----------
// A tiling stone surface, painted once: mottled granite with mineral grains, hairline cracks and
// rosettes of lichen, and a matching height map so the grains and cracks catch the light.
function stoneTextures(size = isTouch ? 256 : 512) {
  const canvases = [0, 1].map(() => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    return c;
  });
  const [cctx, hctx] = canvases.map((c) => c.getContext("2d"));
  const colorData = cctx.createImageData(size, size);
  const heightData = hctx.createImageData(size, size);
  // Fractal noise that wraps at the texture's edges, in 0..1.
  const tiling = (u, v, seed, base, octaves) => {
    let sum = 0;
    let amp = 0.5;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      const period = base << o;
      const fx = u * period;
      const fy = v * period;
      const xi = Math.floor(fx);
      const yi = Math.floor(fy);
      const a = fade(fx - xi);
      const b = fade(fy - yi);
      const at = (i, j) => hash3((xi + i) % period, (yi + j) % period, seed * 16 + o);
      sum += amp * ((at(0, 0) * (1 - a) + at(1, 0) * a) * (1 - b) + (at(0, 1) * (1 - a) + at(1, 1) * a) * b);
      norm += amp;
      amp *= 0.5;
    }
    return sum / norm;
  };
  const dark = [98, 94, 90];
  const light = [218, 212, 202];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const mottle = smoothstep(0.28, 0.72, tiling(u, v, 1, 4, 5));
      const warmth = tiling(u, v, 2, 2, 2) - 0.5; // some patches rustier, some greyer
      const grain = hash3(x, y, 7) - 0.5;
      const i = (y * size + x) * 4;
      for (let k = 0; k < 3; k++) {
        const tint = warmth * (k === 0 ? 34 : k === 1 ? 10 : -22);
        colorData.data[i + k] = clamp(dark[k] + (light[k] - dark[k]) * mottle + tint + grain * 26, 0, 255);
      }
      heightData.data[i] = heightData.data[i + 1] = heightData.data[i + 2] = clamp(128 + (mottle - 0.5) * 110 + grain * 60, 0, 255);
      colorData.data[i + 3] = heightData.data[i + 3] = 255;
    }
  }
  cctx.putImageData(colorData, 0, 0);
  hctx.putImageData(heightData, 0, 0);
  const k = size / 512; // the details below are sized for a 512 texture
  // Draws the same mark on both canvases (colour, then height), repeated across the edges.
  const mark = (x, y, reach, draw) => {
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        if (x + dx + reach < 0 || x + dx - reach > size || y + dy + reach < 0 || y + dy - reach > size) continue;
        draw(cctx, x + dx, y + dy, false);
        draw(hctx, x + dx, y + dy, true);
      }
    }
  };
  // Mineral grains: black mica, white quartz, pinkish feldspar.
  for (let n = 0; n < 9000 * k * k; n++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = (0.5 + rand() * 1.3) * Math.max(k, 0.6);
    const kind = rand();
    const color = kind < 0.45 ? "rgba(40,36,34,0.55)" : kind < 0.85 ? "rgba(246,242,234,0.6)" : "rgba(205,160,140,0.5)";
    const raise = kind < 0.45 ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.4)";
    mark(x, y, r, (ctx, px, py, isHeight) => {
      ctx.fillStyle = isHeight ? raise : color;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  // Hairline cracks, dark with a pale lip, sunk in the height map.
  for (let n = 0; n < 9; n++) {
    const points = [[rand() * size, rand() * size]];
    let angle = rand() * Math.PI * 2;
    for (let s = 0; s < 14; s++) {
      angle += (rand() - 0.5) * 0.9;
      const [px, py] = points[points.length - 1];
      points.push([px + Math.cos(angle) * 14 * k, py + Math.sin(angle) * 14 * k]);
    }
    const width = (0.8 + rand() * 1.2) * Math.max(k, 0.7);
    mark(points[0][0], points[0][1], 220 * k, (ctx, px, py, isHeight) => {
      const ox = px - points[0][0];
      const oy = py - points[0][1];
      const path = (dx, dy) => {
        ctx.beginPath();
        points.forEach(([x, y], i) => (i ? ctx.lineTo(x + ox + dx, y + oy + dy) : ctx.moveTo(x + ox + dx, y + oy + dy)));
      };
      ctx.lineCap = ctx.lineJoin = "round";
      if (!isHeight) {
        path(1, 1);
        ctx.strokeStyle = "rgba(255,250,240,0.18)";
        ctx.lineWidth = width;
        ctx.stroke();
      }
      path(0, 0);
      ctx.strokeStyle = isHeight ? "rgba(0,0,0,0.8)" : "rgba(52,44,38,0.7)";
      ctx.lineWidth = width;
      ctx.stroke();
    });
  }
  // Lichen: crusty rosettes of overlapping lobes, pale green-grey or orange.
  for (let n = 0; n < 34; n++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = (3 + rand() * 7) * Math.max(k, 0.7);
    const orange = rand() < 0.25;
    const lobes = Array.from({ length: 22 }, () => {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * r;
      return [Math.cos(a) * d, Math.sin(a) * d, (0.12 + rand() * 0.22) * r];
    });
    mark(x, y, r * 1.6, (ctx, px, py, isHeight) => {
      for (const [dx, dy, lr] of lobes) {
        ctx.fillStyle = isHeight ? "rgba(255,255,255,0.25)" : orange ? "rgba(214,150,62,0.6)" : "rgba(196,204,156,0.62)";
        ctx.beginPath();
        ctx.arc(px + dx, py + dy, lr, 0, Math.PI * 2);
        ctx.fill();
        if (!isHeight) {
          ctx.strokeStyle = orange ? "rgba(150,90,30,0.5)" : "rgba(110,120,80,0.5)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });
  }
  const [color, height] = canvases.map((c, i) => {
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = i === 0 ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return tex;
  });
  return { color, height };
}

// Wraps the stone texture onto a rock by projecting it along all three axes of the rock's own
// space and blending by which way the surface faces: no seams or stretching, and it turns with
// the rock as it rolls. `scale` is how many texture tiles per unit, so bigger boulders (drawn
// scaled up) can keep the same grain size.
function stoneMaterial(material, scale = 1) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uStone = { value: stoneMaps.color };
    shader.uniforms.uStoneHeight = { value: stoneMaps.height };
    shader.uniforms.uStoneScale = { value: 0.62 * scale };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vStonePos;\nvarying vec3 vStoneNormal;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvStonePos = position;\nvStoneNormal = normal;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
        uniform sampler2D uStone;
        uniform sampler2D uStoneHeight;
        uniform float uStoneScale;
        varying vec3 vStonePos;
        varying vec3 vStoneNormal;
        vec4 triplanar(sampler2D tex, vec3 p, vec3 w) {
          return texture2D(tex, p.yz) * w.x + texture2D(tex, p.zx) * w.y + texture2D(tex, p.xy) * w.z;
        }
        // Tilts the normal by the slope of the height map across the screen (as three.js's own
        // bump mapping does), so grains stand proud and cracks sink in.
        vec3 stoneBump(vec3 surfPos, vec3 surfNormal, vec2 dHdxy, float facing) {
          vec3 sigmaX = normalize(dFdx(surfPos));
          vec3 sigmaY = normalize(dFdy(surfPos));
          vec3 r1 = cross(sigmaY, surfNormal);
          vec3 r2 = cross(surfNormal, sigmaX);
          float det = dot(sigmaX, r1) * facing;
          vec3 grad = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
          return normalize(abs(det) * surfNormal - grad);
        }`
      )
      .replace(
        "#include <map_fragment>",
        /* glsl */ `#include <map_fragment>
        vec3 stoneW = pow(abs(normalize(vStoneNormal)), vec3(4.0));
        stoneW /= stoneW.x + stoneW.y + stoneW.z;
        vec3 stoneP = vStonePos * uStoneScale;
        diffuseColor.rgb *= triplanar(uStone, stoneP, stoneW).rgb;
        float stoneH = triplanar(uStoneHeight, stoneP, stoneW).r;`
      )
      .replace(
        "#include <normal_fragment_maps>",
        "#include <normal_fragment_maps>\nnormal = stoneBump(-vViewPosition, normal, vec2(dFdx(stoneH), dFdy(stoneH)) * 1.4, faceDirection);"
      )
      .replace(
        "#include <roughnessmap_fragment>",
        "#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor * (0.78 + 0.4 * stoneH), 0.0, 1.0);"
      );
  };
  return material;
}

const stoneMaps = stoneTextures();

const sky = makeSky();
makeGround();
makeScenery();
makeBirds();

// ---------- Teddy ----------
// A box-ish shape with rounded edges, for the backpack: a sphere pushed out toward its corners.
function roundedBoxGeometry(segments = 16) {
  const geo = new THREE.SphereGeometry(1, segments * 1.5, segments);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const round = (v) => Math.sign(v) * Math.abs(v) ** 0.45;
    pos.setXYZ(i, round(pos.getX(i)), round(pos.getY(i)), round(pos.getZ(i)));
  }
  geo.computeVertexNormals();
  return geo;
}

function makeTeddy() {
  const teddy = new THREE.Group();
  // Modelled facing +z, then turned around so it faces the oncoming boulders with its back to
  // the camera. The outer group can still turn it to face the player on the title screen.
  const model = new THREE.Group();
  model.rotation.y = Math.PI;
  teddy.add(model);
  // Short fibres, used for colour and as a bump map so the plush reads as fabric rather than
  // plastic; the sheen adds the soft glow fuzz has where it turns away from the light.
  const fibres = canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 7000; i++) {
      ctx.fillStyle = rand() < 0.55 ? "rgba(110,80,50,0.2)" : "rgba(255,255,255,0.6)";
      ctx.fillRect(rand() * w, rand() * h, 1, 2 + rand() * 4);
    }
  }, 3, 3);
  const plush = (color, sheenColor) =>
    new THREE.MeshPhysicalMaterial({ color, map: fibres, bumpMap: fibres, bumpScale: 0.8, roughness: 0.9, sheen: 1, sheenRoughness: 0.45, sheenColor });
  const fur = plush(0xc4884f, 0xffd1a0);
  const cream = plush(0xf3dab2, 0xfff2de);
  const dark = new THREE.MeshStandardMaterial({ color: 0x1f130c, roughness: 0.2 });
  const ribbon = new THREE.MeshStandardMaterial({ color: 0xd8343f, roughness: 0.5 });
  const glint = new THREE.MeshBasicMaterial({ color: 0xffffff });
  // A little red hiking backpack with a rolled blue sleeping mat: the camera mostly sees the
  // teddy from behind, so this is what the player looks at all game.
  const weave = canvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    for (let i = 0; i < w; i += 2) {
      ctx.fillRect(i, 0, 1, h);
      ctx.fillRect(0, i, w, 1);
    }
  }, 4, 4);
  const packCloth = new THREE.MeshStandardMaterial({ color: 0xd6492c, roughness: 0.8, map: weave, bumpMap: weave, bumpScale: 0.5 });
  const packTrim = new THREE.MeshStandardMaterial({ color: 0x8f2f1d, roughness: 0.8, map: weave });
  const sleepingMat = new THREE.MeshStandardMaterial({ color: 0x3d79bd, roughness: 0.75, map: weave });
  const strap = new THREE.MeshStandardMaterial({ color: 0x4a3222, roughness: 0.65 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xf0c040, roughness: 0.35, metalness: 0.6 });

  const sphere = new THREE.SphereGeometry(1, isTouch ? 20 : 32, isTouch ? 14 : 22);
  const rounded = roundedBoxGeometry(isTouch ? 10 : 16);
  const blob = (mat, [x, y, z], [sx, sy, sz], rotZ = 0, parent = model, geo = sphere) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    m.rotation.z = rotZ;
    m.castShadow = true;
    parent.add(m);
    return m;
  };
  // Limbs hang from pivots at the hip and shoulder so they can swing.
  const pivot = (x, y, z, side) => {
    const p = new THREE.Group();
    p.position.set(x, y, z);
    p.userData.side = side;
    model.add(p);
    return p;
  };
  teddy.userData.baseYaw = 0; // facing the mountain; the title screen turns it round
  teddy.userData.legs = [];
  teddy.userData.arms = [];
  blob(fur, [0, 0.74, 0], [0.48, 0.54, 0.42]); // body
  blob(cream, [0, 0.42, -0.4], [0.13, 0.13, 0.11]); // tail
  blob(cream, [0, 0.7, 0.27], [0.3, 0.34, 0.18]); // belly
  blob(fur, [0, 1.42, 0.02], [0.42, 0.4, 0.38]); // head
  blob(cream, [0, 1.34, 0.33], [0.19, 0.14, 0.12]); // muzzle
  blob(dark, [0, 1.4, 0.44], [0.065, 0.05, 0.045]); // nose
  blob(glint, [0.018, 1.418, 0.478], [0.02, 0.012, 0.008]);
  const smile = new THREE.TorusGeometry(0.034, 0.007, 4, 12, Math.PI);
  for (const s of [-1, 1]) {
    const mouth = blob(dark, [0.034 * s, 1.335, 0.445], [1, 1, 1], Math.PI, model, smile);
    mouth.castShadow = false;
    blob(dark, [0.14 * s, 1.53, 0.35], [0.055, 0.066, 0.035]); // eyes
    blob(glint, [0.14 * s + 0.018, 1.552, 0.381], [0.016, 0.016, 0.008]);
    blob(fur, [0.3 * s, 1.74, -0.02], [0.15, 0.15, 0.08]); // ears
    blob(cream, [0.3 * s, 1.74, 0.04], [0.085, 0.085, 0.04]);
    const shoulder = pivot(0.4 * s, 1.06, 0.06, s);
    blob(fur, [0.07 * s, -0.2, 0], [0.14, 0.27, 0.14], 0.55 * s, shoulder); // arm
    teddy.userData.arms.push(shoulder);
    const hip = pivot(0.24 * s, 0.4, 0.1, s);
    blob(fur, [0, -0.18, 0], [0.18, 0.18, 0.24], 0, hip); // leg
    blob(cream, [0, -0.2, 0.22], [0.12, 0.12, 0.04], 0, hip); // foot pad
    teddy.userData.legs.push(hip);
    blob(ribbon, [0.1 * s, 1.08, 0.33], [0.1, 0.07, 0.05]); // bow tie
  }
  blob(ribbon, [0, 1.08, 0.36], [0.04, 0.04, 0.04]);

  // The backpack, leaning back a little off the teddy's back.
  const pack = new THREE.Group();
  pack.position.set(0, 0.92, -0.34);
  pack.rotation.x = -0.12;
  model.add(pack);
  blob(packCloth, [0, 0, -0.1], [0.23, 0.27, 0.12], 0, pack, rounded); // bag
  blob(packTrim, [0, 0.2, -0.105], [0.236, 0.1, 0.13], 0, pack, rounded); // lid
  blob(packTrim, [0, -0.1, -0.215], [0.15, 0.1, 0.05], 0, pack, rounded); // front pocket
  blob(brass, [0, 0.12, -0.24], [0.035, 0.04, 0.015], 0, pack, rounded); // buckle
  const roll = new THREE.CylinderGeometry(1, 1, 1, isTouch ? 10 : 16);
  blob(sleepingMat, [0, 0.33, -0.1], [0.075, 0.5, 0.075], Math.PI / 2, pack, roll);
  for (const s of [-1, 1]) {
    blob(strap, [0.15 * s, 0.33, -0.1], [0.08, 0.022, 0.08], Math.PI / 2, pack, roll); // ties round the mat
    // Shoulder straps over the top of each shoulder and down the chest.
    const over = blob(strap, [0.22 * s, 1.0, -0.02], [1, 0.75, 1], 0, model, new THREE.TorusGeometry(0.3, 0.025, 5, 16, Math.PI));
    over.rotation.y = Math.PI / 2;
  }
  return teddy;
}

const teddy = makeTeddy();
scene.add(teddy);

// ---------- Boulders ----------
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A boulder: a lumpy, noise-shaped ball with a few flat faces where it split off the mountain,
// darker in its hollows, with patches of moss and lichen and sometimes a pale vein of quartz.
function rockGeometry(seed, detail = isTouch ? 2 : 3) {
  const r = mulberry32(seed);
  const o = [r() * 50, r() * 50, r() * 50];
  const cuts = Array.from({ length: 3 + Math.floor(r() * 3) }, () => ({
    n: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(),
    d: 0.8 + r() * 0.12,
  }));
  const squash = new THREE.Vector3(0.92 + r() * 0.14, 0.9 + r() * 0.14, 0.92 + r() * 0.14);
  const vein = { n: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(), at: (r() - 0.5) * 0.7, show: r() < 0.5 };
  const lumps = (d) => fbm(d.x * 1.5 + o[0], d.y * 1.5 + o[1], d.z * 1.5 + o[2], 4);
  const geo = jitterVertices(new THREE.IcosahedronGeometry(1, detail), (v) => {
    v.normalize();
    v.multiplyScalar(1 + lumps(v) * 0.3).multiply(squash);
    for (const cut of cuts) {
      const d = v.dot(cut.n);
      if (d > cut.d) v.addScaledVector(cut.n, cut.d - d);
    }
    return v.multiplyScalar(BOULDER_R);
  });
  const moss = new THREE.Color(0x6d8a37);
  const quartz = new THREE.Color(0xf4f1e8);
  const u = new THREE.Vector3();
  const d = new THREE.Vector3();
  colorVertices(geo, (p, c) => {
    u.copy(p).divideScalar(BOULDER_R);
    const hollow = smoothstep(0, -0.4, lumps(d.copy(u).normalize()));
    const fresh = cuts.some((cut) => Math.abs(u.dot(cut.n) - cut.d) < 0.01); // a split face, paler
    const grain = fbm(u.x * 6 + o[1], u.y * 6 + o[2], u.z * 6 + o[0], 3);
    c.setScalar((0.92 + grain * 0.25) * (1 - hollow * 0.35) * (fresh ? 1.08 : 1));
    if (!fresh) c.lerp(moss, smoothstep(0.12, 0.34, fbm(u.x * 2.3 + 9, u.y * 2.3 + o[0], u.z * 2.3 + 3, 3)) * 0.55);
    if (vein.show) c.lerp(quartz, (1 - smoothstep(0.03, 0.09, Math.abs(u.dot(vein.n) - vein.at))) * 0.75);
  });
  return creasedNormals(geo, 40);
}

const rockGeos = [11, 23, 37, 41, 59].map((seed) => rockGeometry(seed));
const stone = (color, scale) => stoneMaterial(new THREE.MeshStandardMaterial({ color, roughness: 0.92, vertexColors: true }), scale);
const rockMat = stone(0xf4ede2);
const trainMat = stone(0xcfc6b8);

const obstacles = [];

// Big boulders, which cover more than one trail and are each a step up from the size below:
// - giants: twice the height of a normal boulder, covering two trails. Too tall to jump onto from
//   the ground; it takes a second jump from the top of a normal boulder.
// - colossi: three times the height, covering all three trails. They can only be climbed from the
//   top of a giant, so they always come as the top of a staircase (see spawnStaircaseRow).
const GIANT_R = BOULDER_R * 2;
const GIANT_SPACING = GIANT_R * 2 * 0.92;
// Just under three times: reachable with room to spare from the top of a giant, never from the
// top of a normal boulder.
const COLOSSUS_R = BOULDER_R * 2.9;
const COLOSSUS_SPACING = COLOSSUS_R * 2 * 0.92;
const GIANT_TOP_FACTOR = 0.95; // big boulders are round enough to stand right up on their crests
const GIANT_STEP_GAP = 1.2; // between a step train's last boulder and the giant behind it
const COLOSSUS_STEP_GAP = 1.5; // between the giant's last boulder and the colossus behind it
const giantMat = stone(0xe3d9ca, GIANT_R / BOULDER_R);
const colossusMat = stone(0xd9d6dc, COLOSSUS_R / BOULDER_R);

// A single boulder or a train of them, of any size. However long the train, it's drawn as one
// instanced mesh (one draw call); `meshes` holds a plain transform per boulder for placement and
// collisions. `span` is how many trails it covers (1 normal, 2 giant, 3 colossus), starting from
// `lane`, its leftmost.
function addObstacle(lane, size, z = SPAWN_Z, { span = 1 } = {}) {
  const giant = span > 1;
  const radius = span === 3 ? COLOSSUS_R : span === 2 ? GIANT_R : BOULDER_R;
  const spacing = span === 3 ? COLOSSUS_SPACING : span === 2 ? GIANT_SPACING : TRAIN_SPACING;
  const lanes = Array.from({ length: span }, (_, i) => lane + i);
  const x = lanes.reduce((sum, l) => sum + LANES[l], 0) / span;
  const group = new THREE.Group();
  group.position.x = x;
  const geometry = rockGeos[(Math.random() * rockGeos.length) | 0];
  const material = span === 3 ? colossusMat : giant ? giantMat : size > 1 ? trainMat : rockMat;
  const mesh = new THREE.InstancedMesh(geometry, material, size);
  mesh.castShadow = true;
  mesh.frustumCulled = false; // the boulders move every frame; the mesh bounds would go stale
  group.add(mesh);
  const meshes = [];
  for (let i = 0; i < size; i++) {
    const rock = new THREE.Object3D();
    rock.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    rock.scale.setScalar(radius / BOULDER_R);
    rock.userData.offset = -i * spacing; // trailing rocks sit further up the slope
    meshes.push(rock);
  }
  scene.add(group);
  const o = {
    kind: "rock",
    giant, // any big boulder: a wall unless the teddy comes at it from above
    span,
    lane,
    lanes,
    x,
    radius,
    size,
    z,
    group,
    mesh,
    meshes,
    tailOffset: -(size - 1) * spacing,
    passed: false,
    cleared: false, // giants: the teddy got up over it, so it's a platform rather than a wall
  };
  placeObstacle(o, 0);
  obstacles.push(o);
}

const addGiant = (leftLane, count, z) => addObstacle(leftLane, count, z, { span: 2 });
const addColossus = (count, z) => addObstacle(0, count, z, { span: 3 });

function removeObstacle(o) {
  scene.remove(o.group);
  if (o.mesh) o.mesh.dispose(); // frees the per-train instance buffer on the GPU
}

// ---------- Gates ----------
// A wooden frame sliding down the trail on sled runners, with a plank sign hanging from its top
// beam: too tall to jump over and too low to stand under, so the teddy has to duck.
function signTexture() {
  return canvasTexture(256, 300, (ctx, w, h) => {
    const planks = ["#c08a50", "#b37f47", "#ca9658", "#b8854c"];
    const plankW = w / 4;
    for (let i = 0; i < 4; i++) {
      const x0 = i * plankW;
      ctx.fillStyle = planks[i];
      ctx.fillRect(x0, 0, plankW, h);
      for (let g = 0; g < 10; g++) {
        const x = x0 + 4 + rand() * (plankW - 8);
        ctx.strokeStyle = rand() < 0.7 ? "rgba(90,55,25,0.28)" : "rgba(255,225,180,0.2)";
        ctx.lineWidth = 0.8 + rand() * 1.4;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + 5, h * 0.3, x - 5, h * 0.6, x + 2, h);
        ctx.stroke();
      }
      if (rand() < 0.7) {
        const kx = x0 + 12 + rand() * (plankW - 24);
        const ky = 30 + rand() * h * 0.45;
        ctx.strokeStyle = "rgba(80,45,20,0.5)";
        for (let k = 1; k < 4; k++) {
          ctx.beginPath();
          ctx.ellipse(kx, ky, k * 2.2, k * 4, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(50,28,10,0.7)"; // the gap to the next plank
      ctx.fillRect(x0, 0, 3, h);
      for (const ny of [16, h * 0.6]) {
        ctx.fillStyle = "#4a4440";
        ctx.beginPath();
        ctx.arc(x0 + plankW / 2, ny, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.beginPath();
        ctx.arc(x0 + plankW / 2 - 0.9, ny - 0.9, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Weathered, darker wood toward the edges.
    for (const [y0, y1] of [[0, 26], [h, h - 26]]) {
      const g = ctx.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, "rgba(60,35,15,0.4)");
      g.addColorStop(1, "rgba(60,35,15,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, Math.min(y0, y1), w, 26);
    }
    // Red and white warning stripes along the bottom edge, the paint chipped here and there. No
    // hint about ducking: players work it out.
    const band = h * 0.22;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, h - band, w, band);
    ctx.clip();
    for (let i = 0, x = -band; x < w + band; i++, x += 36) {
      ctx.fillStyle = i % 2 ? "#f2eee4" : "#d33a2f";
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(x + 36, h);
      ctx.lineTo(x + 36 + band, h - band);
      ctx.lineTo(x + band, h - band);
      ctx.fill();
    }
    for (let i = 0; i < 45; i++) {
      ctx.fillStyle = rand() < 0.5 ? "rgba(185,140,90,0.9)" : "rgba(120,80,45,0.6)";
      ctx.beginPath();
      ctx.ellipse(rand() * w, h - rand() * band, 1.5 + rand() * 4, 1 + rand() * 2.5, rand() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(50,28,10,0.7)";
    for (let i = 0; i < 4; i++) ctx.fillRect(i * plankW, h - band, 3, band);
    ctx.restore();
  });
}

// Weathered timber, grain running along its length.
const woodMap = canvasTexture(128, 256, (ctx, w, h) => {
  ctx.fillStyle = "#8d5c30";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 50; i++) {
    const x = rand() * w;
    ctx.strokeStyle = rand() < 0.65 ? "rgba(55,32,14,0.4)" : "rgba(235,200,150,0.22)";
    ctx.lineWidth = 0.6 + rand() * 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 4, h * 0.33, x - 4, h * 0.66, x + 2, h);
    ctx.stroke();
  }
  for (let i = 0; i < 3; i++) {
    const kx = rand() * w;
    const ky = rand() * h;
    ctx.fillStyle = "rgba(55,30,12,0.55)";
    ctx.beginPath();
    ctx.ellipse(kx, ky, 3 + rand() * 3, 6 + rand() * 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
});
const woodMat = new THREE.MeshStandardMaterial({ map: woodMap, bumpMap: woodMap, bumpScale: 1.5, roughness: 0.88 });
const signMap = signTexture();
const boardMat = new THREE.MeshStandardMaterial({ map: signMap, bumpMap: signMap, bumpScale: 1, roughness: 0.85 });
const ropeMat = new THREE.MeshStandardMaterial({ color: 0xc9ad78, roughness: 1 });
const flagMats = [0xe0453a, 0xf2c230].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, side: THREE.DoubleSide }));

// The frame in one geometry: posts on sled runners with braces, a top beam, knobs on the posts
// and little flagpoles above them.
const gateFrameGeo = (() => {
  const flat = (g) => (g.index ? g.toNonIndexed() : g);
  const parts = [new THREE.CylinderGeometry(0.12, 0.12, GATE_HALF_WIDTH * 2 + 0.4, 10).rotateZ(Math.PI / 2).translate(0, GATE_TOP - 0.1, 0)];
  for (const s of [-1, 1]) {
    const x = s * GATE_HALF_WIDTH;
    parts.push(new THREE.CylinderGeometry(0.11, 0.13, GATE_TOP, 10).translate(x, GATE_TOP / 2, 0));
    parts.push(new THREE.BoxGeometry(0.16, 0.1, 1.2).translate(x, 0.05, 0));
    parts.push(new THREE.SphereGeometry(0.14, 10, 6).translate(x, GATE_TOP + 0.04, 0));
    parts.push(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 5).translate(x, GATE_TOP + 0.3, 0));
    for (const f of [-1, 1]) parts.push(new THREE.CylinderGeometry(0.05, 0.05, 0.74, 6).rotateX(-f * 0.74).translate(x, 0.33, f * 0.25));
  }
  return mergeGeometries(parts.map(flat), "keep");
})();
const ropeGeo = mergeGeometries(
  [-1, 1].flatMap((s) =>
    [GATE_TOP - 0.27, GATE_TOP - 0.34].map((y) => new THREE.TorusGeometry(0.14, 0.028, 5, 12).rotateX(Math.PI / 2).translate(s * GATE_HALF_WIDTH, y, 0).toNonIndexed())
  ),
  "keep"
);
const boardHeight = GATE_TOP - 0.25 - GATE_CLEARANCE;
const boardGeo = new THREE.BoxGeometry(GATE_HALF_WIDTH * 2 - 0.2, boardHeight, GATE_DEPTH).translate(0, GATE_CLEARANCE + boardHeight / 2, 0);
const flagGeo = new THREE.BufferGeometry();
flagGeo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0.46, 0.15, 0, 0, 0.3, 0], 3));
flagGeo.computeVertexNormals();

function addGate(lane, z = SPAWN_Z) {
  const group = new THREE.Group();
  const add = (geo, mat) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    group.add(m);
    return m;
  };
  add(gateFrameGeo, woodMat);
  add(ropeGeo, ropeMat);
  add(boardGeo, boardMat);
  // Pennants on top of the posts, flapping in the wind of the gate's slide.
  const flags = [-1, 1].map((s, i) => {
    const flag = add(flagGeo, flagMats[i]);
    flag.position.set(s * GATE_HALF_WIDTH, GATE_TOP + 0.24, 0);
    flag.scale.x = s;
    return flag;
  });
  scene.add(group);
  const o = { kind: "gate", lane, size: 1, z, group, flags, meshes: [], tailOffset: 0, passed: false, rattle: rand() * 6 };
  placeObstacle(o, 0);
  obstacles.push(o);
}

// ---------- Logs ----------
// A log rolling down the trail on its side, end over end. Too low to duck under (it rolls right
// into a ducking teddy) but low enough to jump: jump it or change trails.
const LOG_RADIUS = 0.42;
const LOG_HALF_LENGTH = 0.95;

// Bark furrows run along the log, with patches of moss.
const barkMap = canvasTexture(256, 128, (ctx, w, h) => {
  ctx.fillStyle = "#5f3e27";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 100; i++) {
    const x = rand() * w;
    ctx.strokeStyle = rand() < 0.6 ? "rgba(32,18,8,0.6)" : "rgba(150,112,75,0.45)";
    ctx.lineWidth = 1 + rand() * 3.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 7, h * 0.33, x - 7, h * 0.66, x + 3, h);
    ctx.stroke();
  }
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = "rgba(30,16,6,0.5)";
    ctx.fillRect(rand() * w, rand() * h, 4 + rand() * 10, 1.5);
  }
  for (let i = 0; i < 12; i++) softSpot(ctx, w, h, rand() * w, rand() * h, 8 + rand() * 18, "rgba(104,138,48,0.8)");
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = rand() < 0.5 ? "rgba(140,170,70,0.6)" : "rgba(80,110,40,0.6)";
    ctx.fillRect(rand() * w, rand() * h, 1.5, 1.5);
  }
});
// The sawn ends: growth rings around a dark heart, cracks running out from it, and the bark rim.
const ringsMap = canvasTexture(128, 128, (ctx, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  ctx.fillStyle = "#dcb57f";
  ctx.fillRect(0, 0, w, h);
  softSpot(ctx, w, h, cx, cy, w * 0.3, "rgba(150,95,45,0.55)");
  for (let r = 3; r < w / 2 - 8; r += 3 + rand() * 3) {
    ctx.strokeStyle = `rgba(125,80,40,${0.3 + rand() * 0.35})`;
    ctx.lineWidth = 0.8 + rand();
    ctx.beginPath();
    for (let a = 0; a <= 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      const rr = r * (1 + Math.sin(t * 3 + r) * 0.03);
      ctx.lineTo(cx + Math.cos(t) * rr, cy + Math.sin(t) * rr);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(60,35,15,0.7)";
  for (let i = 0; i < 4; i++) {
    const a = rand() * Math.PI * 2;
    ctx.lineWidth = 1 + rand();
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 4, cy + Math.sin(a) * 4);
    ctx.lineTo(cx + Math.cos(a + 0.1) * (14 + rand() * 30), cy + Math.sin(a + 0.1) * (14 + rand() * 30));
    ctx.stroke();
  }
  ctx.strokeStyle = "#5a3a22";
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.arc(cx, cy, w / 2 - 5, 0, Math.PI * 2);
  ctx.stroke();
});
const barkMat = new THREE.MeshStandardMaterial({ roughness: 1, map: barkMap, bumpMap: barkMap, bumpScale: 2 });
const ringsMat = new THREE.MeshStandardMaterial({ roughness: 0.9, map: ringsMap, bumpMap: ringsMap, bumpScale: 1 });
// Cylinder material groups: side, then the two end caps.
const logGeo = new THREE.CylinderGeometry(LOG_RADIUS, LOG_RADIUS, LOG_HALF_LENGTH * 2, 18).rotateZ(Math.PI / 2);
const logMats = [barkMat, ringsMat, ringsMat];

function addLog(lane, z = SPAWN_Z) {
  const group = new THREE.Group();
  group.position.x = LANES[lane];
  const log = new THREE.Mesh(logGeo, logMats);
  log.castShadow = true;
  log.rotation.x = rand() * Math.PI * 2;
  group.add(log);
  scene.add(group);
  const o = { kind: "log", lane, size: 1, z, group, log, meshes: [], tailOffset: 0, passed: false };
  placeObstacle(o, 0);
  obstacles.push(o);
}

// ---------- Dust ----------
// Puffs of dust where boulders, logs and sled runners churn up the trail, and where the teddy
// lands. They're all one instanced draw call of camera-facing quads, from a recycled pool.
const DUST_MAX = isTouch ? 160 : 360;
const DUST_FIELDS = ["age", "life", "size", "alpha", "angle", "spin", "shade"];
const dust = { count: 0, pos: new Float32Array(DUST_MAX * 3), vel: new Float32Array(DUST_MAX * 3) };
for (const field of DUST_FIELDS) dust[field] = new Float32Array(DUST_MAX);

const dustMesh = (() => {
  const quad = new THREE.PlaneGeometry(1, 1);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = quad.index;
  geo.setAttribute("position", quad.attributes.position);
  geo.setAttribute("uv", quad.attributes.uv);
  geo.setAttribute("offset", new THREE.InstancedBufferAttribute(new Float32Array(DUST_MAX * 3), 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute("look", new THREE.InstancedBufferAttribute(new Float32Array(DUST_MAX * 4), 4).setUsage(THREE.DynamicDrawUsage));
  geo.instanceCount = 0;
  const puff = dataTexture(64, 64, (ctx, w, h) => {
    for (let i = 0; i < 7; i++) {
      const x = w / 2 + (rand() - 0.5) * w * 0.3;
      const y = h / 2 + (rand() - 0.5) * h * 0.3;
      const r = w * (0.18 + rand() * 0.14);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(255,255,255,0.8)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  });
  puff.wrapS = puff.wrapT = THREE.ClampToEdgeWrapping;
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      { map: { value: null }, uLight: { value: new THREE.Color(0xeadcc2) }, uDark: { value: new THREE.Color(0xa08868) } },
    ]),
    vertexShader: /* glsl */ `
      attribute vec3 offset;
      attribute vec4 look; // size, opacity, angle, shade
      varying vec2 vUv;
      varying vec2 vLook;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv;
        vLook = look.yw;
        vec4 mvPosition = modelViewMatrix * vec4(offset, 1.0);
        float c = cos(look.z);
        float s = sin(look.z);
        mvPosition.xy += mat2(c, s, -s, c) * position.xy * look.x;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      uniform vec3 uLight;
      uniform vec3 uDark;
      varying vec2 vUv;
      varying vec2 vLook;
      #include <fog_pars_fragment>
      void main() {
        float a = texture2D(map, vUv).a * vLook.x;
        if (a < 0.004) discard;
        gl_FragColor = vec4(mix(uDark, uLight, vLook.y), a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    fog: true,
  });
  material.uniforms.map.value = puff;
  const mesh = new THREE.Mesh(geo, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 2;
  scene.add(mesh);
  return mesh;
})();

function emitDust(x, y, z, vx, vy, vz, size, life, alpha) {
  if (dust.count >= DUST_MAX) return;
  const i = dust.count++;
  dust.pos[i * 3] = x;
  dust.pos[i * 3 + 1] = y;
  dust.pos[i * 3 + 2] = z;
  dust.vel[i * 3] = vx;
  dust.vel[i * 3 + 1] = vy;
  dust.vel[i * 3 + 2] = vz;
  dust.age[i] = 0;
  dust.life[i] = life;
  dust.size[i] = size;
  dust.alpha[i] = alpha;
  dust.angle[i] = Math.random() * Math.PI * 2;
  dust.spin[i] = (Math.random() - 0.5) * 1.6;
  dust.shade[i] = Math.random();
}

// A ring of dust thrown out from one spot: a landing, or a crash.
function dustBurst(x, y, z, count, power = 1) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = (0.8 + Math.random() * 1.8) * power;
    const vy = 0.3 + Math.random() * 1.1 * power;
    emitDust(x + Math.cos(a) * 0.25, y + 0.15, z + Math.sin(a) * 0.25, Math.cos(a) * v, vy, Math.sin(a) * v, 0.45 + 0.25 * power, 0.55 + Math.random() * 0.5, 0.55);
  }
}

// Dust kicked up behind whatever is rolling or sliding down the trails, more of it the faster
// and the bigger the thing, and only where it's near enough to see.
function kickUpDust(o, dt, speed) {
  const rate = dt * (speed / START_SPEED);
  if (o.kind === "rock") {
    const scale = o.radius / BOULDER_R;
    for (let i = 0; i < o.meshes.length; i += 3) {
      const z = o.meshes[i].position.z;
      if (z < -62 || z > 10 || Math.random() > rate * (i === 0 ? 14 : 5) * scale) continue;
      // Thrown out to either side, where it isn't hidden behind the boulder itself.
      const side = Math.random() < 0.5 ? -1 : 1;
      const x = o.x + side * o.radius * (o.span > 1 ? 0.95 : 0.65) * (0.6 + Math.random() * 0.5);
      const out = side * (0.8 + Math.random() * 1.4) * scale;
      const life = 0.8 + Math.random() * 0.6;
      emitDust(x, groundY(z) + 0.2 * scale, z + (Math.random() - 0.5) * o.radius * 0.6, out, 0.6 + Math.random() * 1.2 * scale, -Math.random(), 0.7 * scale, life, 0.55);
    }
    return;
  }
  if (o.z < -62 || o.z > 10) return;
  if (o.kind === "log" && Math.random() < rate * 8) {
    const side = (Math.random() - 0.5) * LOG_HALF_LENGTH * 2;
    emitDust(LANES[o.lane] + side, groundY(o.z) + 0.2, o.z - LOG_RADIUS * 0.5, side, 0.4 + Math.random() * 0.8, -0.8, 0.6, 0.8, 0.45);
  } else if (o.kind === "gate") {
    for (const s of [-1, 1]) {
      if (Math.random() < rate * 6) emitDust(LANES[o.lane] + s * GATE_HALF_WIDTH, groundY(o.z) + 0.15, o.z - 0.55, s * 0.6, 0.4 + Math.random() * 0.6, -0.6, 0.55, 0.7, 0.45);
    }
  }
}

function killDust(i) {
  const last = --dust.count;
  if (i === last) return;
  for (const field of DUST_FIELDS) dust[field][i] = dust[field][last];
  for (let k = 0; k < 3; k++) {
    dust.pos[i * 3 + k] = dust.pos[last * 3 + k];
    dust.vel[i * 3 + k] = dust.vel[last * 3 + k];
  }
}

function updateDust(dt) {
  const drag = Math.exp(-dt * 2.5);
  for (let i = 0; i < dust.count; i++) {
    dust.age[i] += dt;
    if (dust.age[i] >= dust.life[i]) {
      killDust(i--);
      continue;
    }
    for (let k = i * 3; k < i * 3 + 3; k++) {
      dust.vel[k] *= drag;
      dust.pos[k] += dust.vel[k] * dt;
    }
    dust.vel[i * 3 + 1] += 0.3 * dt; // the dust drifts upward as it spreads
  }
  const { offset, look } = dustMesh.geometry.attributes;
  for (let i = 0; i < dust.count; i++) {
    const t = dust.age[i] / dust.life[i];
    offset.array[i * 3] = dust.pos[i * 3];
    offset.array[i * 3 + 1] = dust.pos[i * 3 + 1];
    offset.array[i * 3 + 2] = dust.pos[i * 3 + 2];
    look.array[i * 4] = dust.size[i] * (1 + 2.2 * Math.sqrt(t));
    look.array[i * 4 + 1] = dust.alpha[i] * Math.min(1, t * 8) * (1 - t) ** 1.5;
    look.array[i * 4 + 2] = dust.angle[i] + dust.spin[i] * dust.age[i];
    look.array[i * 4 + 3] = dust.shade[i];
  }
  for (const [attr, size] of [[offset, 3], [look, 4]]) {
    attr.clearUpdateRanges();
    attr.addUpdateRange(0, Math.max(1, dust.count) * size);
    attr.needsUpdate = true;
  }
  dustMesh.geometry.instanceCount = dust.count;
}

function placeObstacle(o, move) {
  if (o.kind === "log") {
    o.log.position.set(0, groundY(o.z) + LOG_RADIUS, o.z);
    o.log.rotation.x += move / LOG_RADIUS; // rolls toward the camera
    return;
  }
  if (o.kind === "gate") {
    o.group.position.set(LANES[o.lane], groundY(o.z), o.z);
    o.group.rotation.z = Math.sin(o.z * 0.9 + o.rattle) * 0.035; // rattles as it slides
    o.flags.forEach((flag, i) => (flag.rotation.y = Math.sin(o.z * 1.7 + o.rattle + i * 1.3) * 0.5));
    return;
  }
  for (let i = 0; i < o.meshes.length; i++) {
    const m = o.meshes[i];
    const z = o.z + m.userData.offset;
    m.position.set(0, groundY(z) + o.radius, z);
    m.rotation.x += move / o.radius; // roll toward the camera
    m.updateMatrix();
    o.mesh.setMatrixAt(i, m.matrix);
  }
  o.mesh.instanceMatrix.needsUpdate = true;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clearObstacles() {
  for (const o of obstacles) removeObstacle(o);
  obstacles.length = 0;
}

// Most trains are TRAIN_LENGTH boulders; once a run is under way, some are long, Subway Surfers
// style, which also makes for long rides on top.
function trainLength(elapsed) {
  return elapsed > 6 && Math.random() < 0.3 ? 7 + Math.floor(Math.random() * 6) : TRAIN_LENGTH;
}

// The normal boulder trains that lead up onto giants.
const stepTrainLength = () => 12 + Math.floor(Math.random() * 3);

// A giant always comes with a step up: a train of normal boulders either just in front of it in
// one of its two trails (jump on, run along, jump again onto the giant) or alongside it in the
// third trail (ride it and jump across). The third trail always leaves a way around. Returns how
// far the row stretches back from its front.
function spawnGiantRow(z) {
  const left = Math.random() < 0.5 ? 0 : 1; // the giant covers trails left and left + 1
  const free = left === 0 ? 2 : 0;
  // A jump carries the teddy 8 to 12 units past a giant's front before it comes down, so giants
  // come in trains of 4 to 6: long enough to land on and run along (half a second or more on
  // top at the starting pace), not just to hop over.
  const giants = 4 + Math.floor(Math.random() * 3);
  const giantsLength = (giants - 1) * GIANT_SPACING;
  // Step trains are long (12 to 14 boulders) so there's time after landing on one to line up the
  // jump onto the giants.
  const stepSize = stepTrainLength();
  if (Math.random() < 0.6) {
    const stepLane = left + (Math.random() < 0.5 ? 0 : 1);
    addObstacle(stepLane, stepSize, z);
    const giantZ = z - (stepSize - 1) * TRAIN_SPACING - BOULDER_R - GIANT_STEP_GAP - GIANT_R;
    addGiant(left, giants, giantZ);
    return z - giantZ + giantsLength;
  }
  // The giant trails the side train's front, so it's still rolling in when the teddy has landed on
  // the train, with time to jump again and swipe across onto it.
  addObstacle(free, stepSize, z);
  const giantZ = z - 14;
  addGiant(left, giants, giantZ);
  return Math.max((stepSize - 1) * TRAIN_SPACING, z - giantZ + giantsLength);
}

// A colossus covers all three trails, so there's no way around: it always tops a staircase the
// teddy can climb from whichever trail it's in. In front, a giant over two trails with a step train
// just ahead of it in one of them (the front route) and another train alongside it in the third
// trail (the side route). Climb onto a train, then the giant, then the colossus. Returns how far
// the row stretches back from its front.
function spawnStaircaseRow(z) {
  const left = Math.random() < 0.5 ? 0 : 1; // the giant covers trails left and left + 1
  const free = left === 0 ? 2 : 0;
  const stepLane = left + (Math.random() < 0.5 ? 0 : 1);
  const stepSize = stepTrainLength();
  addObstacle(stepLane, stepSize, z);
  const giantZ = z - (stepSize - 1) * TRAIN_SPACING - BOULDER_R - GIANT_STEP_GAP - GIANT_R;
  // Five or six giants, so there's room on top to land and line up the jump to the colossus.
  const giants = 5 + Math.floor(Math.random() * 2);
  addGiant(left, giants, giantZ);
  addObstacle(free, stepTrainLength(), giantZ + 14);
  const colossusZ = giantZ - (giants - 1) * GIANT_SPACING - GIANT_R - COLOSSUS_STEP_GAP - COLOSSUS_R;
  // Three or four colossi: a single one is too short to land on after a full jump.
  const colossi = 3 + Math.floor(Math.random() * 2);
  addColossus(colossi, colossusZ);
  return z - colossusZ + (colossi - 1) * COLOSSUS_SPACING;
}

// Rows normally appear at SPAWN_Z; a row placed nearer (z > SPAWN_Z) shortens the wait for the
// next one by the same amount, so spacing stays fair.
function spawnRow(attract, z = SPAWN_Z) {
  if (attract) {
    // Title and game-over screens: keep the side lanes busy, away from the teddy.
    const lane = Math.random() < 0.5 ? 0 : 2;
    const pick = Math.random();
    if (pick < 0.2) addGate(lane);
    else if (pick < 0.35) addLog(lane);
    else addObstacle(lane, Math.random() < 0.35 ? trainLength(10) : 1);
    state.spawnIn = 16 + Math.random() * 14;
    return;
  }
  const rowGap = () => Math.max(16, state.speed * MIN_ROW_SECONDS) + Math.random() * (8 + state.speed * 0.15);
  // Giants turn up once a run is under way, and colossus staircases a little later.
  const big = Math.random();
  if (state.elapsed > 25 && big < 0.06) {
    const length = spawnStaircaseRow(z);
    state.spawnIn = Math.max(0, length + rowGap() - (z - SPAWN_Z));
    return;
  }
  if (state.elapsed > 12 && big < 0.18) {
    const length = spawnGiantRow(z);
    state.spawnIn = Math.max(0, length + rowGap() - (z - SPAWN_Z));
    return;
  }
  const trainChance = Math.min(0.55, 0.3 + state.elapsed * 0.004);
  // Gates join in after a few seconds and grow more common the longer the run goes; logs turn up
  // now and then from early on.
  const gateChance = state.elapsed > 3 ? Math.min(0.3, 0.12 + state.elapsed * 0.004) : 0;
  const logChance = state.elapsed > 2 ? 0.2 : 0;
  // As the pace climbs, rows get busier: fewer single obstacles, more two- and three-wide rows.
  const difficulty = (state.speed - START_SPEED) / (MAX_SPEED - START_SPEED);
  const r = Math.random();
  const count = r < 0.4 - 0.15 * difficulty ? 1 : r < 0.85 - 0.05 * difficulty ? 2 : 3;
  const lanes = shuffle([0, 1, 2]).slice(0, count);
  let trains = 0;
  let longest = 1;
  for (const lane of lanes) {
    if (Math.random() < gateChance) {
      addGate(lane, z);
      continue;
    }
    if (Math.random() < logChance) {
      addLog(lane, z);
      continue;
    }
    let size = Math.random() < trainChance ? trainLength(state.elapsed) : 1;
    if (size > 1 && count === 3 && trains === 2) size = 1; // a full row always leaves one rock to jump
    if (size > 1) trains++;
    longest = Math.max(longest, size);
    addObstacle(lane, size, z);
  }
  // Every row has a way through (dodge, jump a boulder or log, duck a gate, or land on a train),
  // and the next row comes at least MIN_ROW_SECONDS after this one's tail, so the game never
  // becomes impossible.
  // The gap after a row is at least a jump's length, so the teddy can land and go again.
  const gap = (longest - 1) * TRAIN_SPACING + rowGap();
  state.spawnIn = Math.max(0, gap - (z - SPAWN_Z));
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
  mode: "ready", // ready | playing | paused | crashed | over
  speed: START_SPEED,
  elapsed: 0,
  distance: 0,
  dodged: 0,
  score: 0,
  best: loadBest(),
  spawnIn: 0,
  shake: 0,
  overTimer: 0,
  newBest: false,
  stepTimer: 0,
  stepHigh: false,
};

const PLAYER_START = {
  lane: 1,
  x: 0,
  y: 0,
  vy: 0,
  airborne: false,
  fastFall: false,
  squash: 0,
  knock: null,
  duck: 0, // distance of travel left in the current duck
  duckQueued: false, // pressed down in mid-air: duck on landing
  jumpQueued: 0, // seconds left in which a mid-air jump press fires on landing
  coyote: 0, // seconds left in which a jump still counts after the ground fell away
  duckPose: 0, // 0 standing, 1 fully ducked (visual only)
  standY: 0, // height of whatever the teddy last stood on (for the camera)
  // Cartoon swing on trail changes (visual only): springy lean and twist, and where the
  // current move started and ends.
  lean: 0,
  leanVel: 0,
  twist: 0,
  twistVel: 0,
  swingFrom: 0,
  swingTo: 0,
};
const player = { ...PLAYER_START };

// ---------- UI ----------
const ui = {
  scores: document.getElementById("scores"),
  score: document.getElementById("score"),
  best: document.getElementById("best"),
  pause: document.getElementById("pause"),
  sound: document.getElementById("sound"),
  overlay: document.getElementById("overlay"),
  title: document.getElementById("title"),
  message: document.getElementById("message"),
  play: document.getElementById("play"),
  controls: document.getElementById("controls"),
};

ui.controls.textContent = isTouch
  ? "Swipe left or right to change trails, up to jump, down to duck."
  : "Arrow keys or WASD to move, jump and duck. P to pause, M to mute.";
ui.best.textContent = state.best;

function showOverlay(title, message, button) {
  ui.title.textContent = title;
  ui.message.textContent = message;
  ui.play.textContent = button;
  ui.overlay.hidden = false;
}

let shownScore = -1;
function updateHud() {
  if (state.score !== shownScore) {
    shownScore = state.score;
    ui.score.textContent = state.score;
  }
}

function startGame() {
  unlockAudio();
  Object.assign(state, { mode: "playing", speed: START_SPEED, elapsed: 0, distance: 0, dodged: 0, score: 0 });
  state.shake = 0;
  state.newBest = false;
  Object.assign(player, PLAYER_START);
  // Every run starts on a clear slope, with the first boulders still far up the mountain.
  clearObstacles();
  spawnRow(false, FIRST_ROW_Z);
  teddy.position.set(0, 0, 0);
  teddy.rotation.x = 0; // rotation.y is left alone so the teddy turns round to face the mountain
  teddy.rotation.z = 0;
  teddy.scale.set(1, 1, 1);
  ui.overlay.hidden = true;
  ui.scores.hidden = false;
  ui.pause.hidden = false;
  updateHud();
  sfx.start();
  startMusic({ fromTop: true });
}

function togglePause() {
  if (state.mode === "playing") {
    state.mode = "paused";
    stopMusic();
    setRumble(0);
    showOverlay("Paused", `Score ${state.score}`, "Resume");
  } else if (state.mode === "paused") {
    state.mode = "playing";
    ui.overlay.hidden = true;
    startMusic();
  }
}

function crash() {
  state.mode = "crashed";
  state.shake = 0.6;
  state.overTimer = 0.9;
  const side = player.x > 0.1 ? 1 : player.x < -0.1 ? -1 : Math.random() < 0.5 ? -1 : 1;
  // Knocked backward, tumbling head over heels toward the camera.
  player.knock = { vx: side * 6, vy: 9, vz: 3, spin: 10, landed: false };
  teddy.scale.set(1, 1, 1);
  ui.pause.hidden = true;
  stopMusic();
  sfx.crash();
  dustBurst(player.x, player.y, 0, 22, 1.6);
  if (state.score > state.best) {
    state.best = state.score;
    state.newBest = true;
    saveBest(state.best);
    ui.best.textContent = state.best;
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
ui.play.addEventListener("click", () => {
  unlockAudio();
  sfx.click();
  if (state.mode === "paused") togglePause();
  else if (state.mode === "ready" || state.mode === "over") startGame();
});
ui.pause.addEventListener("click", togglePause);
ui.sound.addEventListener("click", toggleSound);

document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.mode === "playing") togglePause();
});

// ---------- Input ----------
function moveLane(dir) {
  if (state.mode !== "playing") return;
  const lane = clamp(player.lane + dir, 0, 2);
  if (lane === player.lane) return;
  sfx.lane(dir);
  if (!player.airborne && player.y < 0.05) dustBurst(player.x, 0, 0.1, 3, 0.5);
  player.lane = lane;
  // Kick the swing: throw the top of the teddy into the move and twist it toward where it's going.
  player.swingFrom = player.x;
  player.swingTo = LANES[lane];
  player.leanVel -= dir * 10;
  player.twistVel -= dir * 8;
}

// Gravity and launch speed scale with the boulders' speed so a jump always spans JUMP_DISTANCE.
const jumpsPerSecond = () => state.speed / JUMP_DISTANCE;
const gravity = () => 8 * JUMP_HEIGHT * jumpsPerSecond() ** 2;
const jumpVelocity = () => 4 * JUMP_HEIGHT * jumpsPerSecond();

function jump() {
  if (state.mode !== "playing") return;
  if (player.airborne && player.coyote <= 0) {
    // Already in the air: remember the press and jump again the moment the teddy lands.
    player.jumpQueued = JUMP_BUFFER;
    player.duckQueued = false; // the latest press wins
    return;
  }
  player.airborne = true;
  player.vy = jumpVelocity();
  player.fastFall = false;
  player.coyote = 0;
  player.jumpQueued = 0;
  player.duck = 0; // jumping springs out of a duck
  player.duckQueued = false;
  sfx.jump();
}

function startDuck() {
  player.duck = DUCK_DISTANCE;
  player.duckQueued = false;
  sfx.duck();
}

// Down: duck on the ground, or in mid-air drop fast and duck on landing.
function drop() {
  if (state.mode !== "playing") return;
  if (!player.airborne) return startDuck();
  player.vy = Math.min(player.vy, -jumpVelocity() * 0.5);
  player.fastFall = true;
  player.duckQueued = true;
  player.jumpQueued = 0; // the latest press wins
  player.coyote = 0;
  sfx.drop();
}

window.addEventListener("keydown", (e) => {
  const k = e.key;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(k)) e.preventDefault();
  if (e.repeat) return;
  unlockAudio();
  if (k === "m" || k === "M") return toggleSound();
  if (state.mode === "ready" || state.mode === "over") {
    if ([" ", "Enter", "ArrowUp", "w", "W"].includes(k)) startGame();
    return;
  }
  if (k === "p" || k === "P" || k === "Escape") return togglePause();
  if (state.mode === "paused") {
    if (k === " " || k === "Enter") togglePause();
    return;
  }
  if (k === "ArrowLeft" || k === "a" || k === "A") moveLane(-1);
  else if (k === "ArrowRight" || k === "d" || k === "D") moveLane(1);
  else if (k === "ArrowUp" || k === "w" || k === "W" || k === " ") jump();
  else if (k === "ArrowDown" || k === "s" || k === "S") drop();
});

// Subway Surfers style swipes, for fingers, pens and mouse drags alike. A swipe fires as soon
// as it passes the threshold, without waiting for release. The start point then moves to the
// finger, so one drag that changes direction (left, then up) does both, while a long swipe in
// one direction still counts once.
const SWIPE_ACTIONS = { left: () => moveLane(-1), right: () => moveLane(1), up: jump, down: drop };
let swipe = null;

canvas.addEventListener("pointerdown", (e) => {
  unlockAudio();
  swipe = { id: e.pointerId, x: e.clientX, y: e.clientY, last: null };
  try {
    canvas.setPointerCapture(e.pointerId); // keep tracking the swipe if the finger leaves the canvas
  } catch {
    // Some webviews refuse capture; swipes still work while the finger stays on the canvas.
  }
});

canvas.addEventListener("pointermove", (e) => {
  if (!swipe || e.pointerId !== swipe.id) return;
  const dx = e.clientX - swipe.x;
  const dy = e.clientY - swipe.y;
  const threshold = Math.max(SWIPE_PX, Math.min(window.innerWidth, window.innerHeight) * 0.06);
  if (Math.hypot(dx, dy) < threshold) return;
  const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy < 0 ? "up" : "down";
  swipe.x = e.clientX;
  swipe.y = e.clientY;
  if (dir === swipe.last) return;
  swipe.last = dir;
  SWIPE_ACTIONS[dir]();
});

const endSwipe = (e) => {
  if (swipe && e.pointerId === swipe.id) swipe = null;
};
canvas.addEventListener("pointerup", endSwipe);
canvas.addEventListener("pointercancel", endSwipe);

// ---------- Update ----------
// What is under the teddy's feet. `top` is the highest surface overlapping its footprint: the
// ground or the top of a boulder or log, and `topObj` is what it belongs to. `deadly` is the part
// that can knock the teddy over: only the leading rock of a boulder or train, and only while it's
// still rolling in. The rest of a train is just something to land on.
// Giants are walls instead: running into any part of one from below is a hit, unless the teddy is
// up level with its crest (from the top of a normal boulder). Once it has got up over a giant,
// that giant is a platform. `level` is the teddy's height, the higher of this frame's and last.
const surface = { top: 0, deadly: 0, topObj: null };
function surfaceUnderTeddy(level = player.y) {
  surface.top = 0; // ground level at the teddy's spot
  surface.deadly = -Infinity; // the ground itself can never knock the teddy over
  surface.topObj = null;
  for (const o of obstacles) {
    if (o.kind === "log") {
      // A cylinder lying across the trail: its top is a surface, its front face an obstacle.
      if (Math.abs(LANES[o.lane] - player.x) > LOG_HALF_LENGTH + FOOT_RADIUS) continue;
      const dz = Math.max(0, Math.abs(o.z) - FOOT_RADIUS * 0.6);
      if (dz >= LOG_RADIUS) continue;
      const h = groundY(o.z) + LOG_RADIUS + Math.sqrt(LOG_RADIUS * LOG_RADIUS - dz * dz);
      if (h > surface.top) {
        surface.top = h;
        surface.topObj = o;
      }
      if (o.z < 0) surface.deadly = Math.max(surface.deadly, h);
      continue;
    }
    if (o.kind !== "rock") continue;
    const topR = o.radius * (o.giant ? GIANT_TOP_FACTOR : 0.85);
    const dx = Math.max(0, Math.abs(o.x - player.x) - FOOT_RADIUS);
    if (dx >= topR) continue;
    for (let i = 0; i < o.meshes.length; i++) {
      const m = o.meshes[i];
      const dz = Math.max(0, Math.abs(m.position.z) - FOOT_RADIUS * 0.6);
      const d2 = dx * dx + dz * dz;
      if (d2 >= topR * topR) continue;
      const h = m.position.y + Math.sqrt(topR * topR - d2);
      if (h > surface.top) {
        surface.top = h;
        surface.topObj = o;
      }
      if (o.giant) {
        if (o.cleared) continue;
        // Head-on the teddy must already be level with the crest; from the side, nearly so. The
        // crest is measured over the trail the teddy is heading for, so clipping the edge of a
        // giant mid-swipe doesn't count as getting on top.
        const dxTarget = Math.max(0, Math.abs(o.x - LANES[player.lane]) - FOOT_RADIUS);
        const crest = m.position.y + Math.sqrt(Math.max(0, topR * topR - dxTarget * dxTarget));
        const need = i === 0 && m.position.z < 0 ? crest : crest - STEP_UP;
        if (level >= need) o.cleared = true;
        else surface.deadly = Infinity;
      } else if (i === 0 && m.position.z < 0) {
        surface.deadly = Math.max(surface.deadly, h);
      }
    }
  }
  return surface;
}

// Whether a gate passing the teddy hits it: its board unless the teddy ducks under, or its posts
// when the teddy changes trails through a gate as it goes by.
function hitsGate(height) {
  for (const o of obstacles) {
    if (o.kind !== "gate" || Math.abs(o.z) > GATE_DEPTH / 2 + BODY_HALF_DEPTH) continue;
    const dx = Math.abs(player.x - LANES[o.lane]);
    if (Math.abs(dx - GATE_HALF_WIDTH) < 0.13 + BODY_HALF_WIDTH) return true;
    const ground = groundY(o.z);
    if (dx < GATE_HALF_WIDTH && player.y < ground + GATE_TOP && player.y + height > ground + GATE_CLEARANCE) return true;
  }
  return false;
}

function updateObstacles(move) {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    o.z += move;
    placeObstacle(o, move);
    const tailZ = o.z + o.tailOffset;
    if (!o.passed && tailZ > PASSED_Z) {
      o.passed = true;
      // Big boulders score more: a giant counts as 3 boulders, a colossus as 6.
      if (state.mode === "playing") state.dodged += o.size * (o.span === 3 ? 6 : o.span === 2 ? 3 : 1);
    }
    // A train thundering past in the next lane rattles the camera a little; a giant, a lot.
    if (state.mode === "playing" && o.giant && Math.abs(o.z) < o.radius + 0.7) {
      state.shake = Math.max(state.shake, o.span === 3 ? 0.3 : 0.2);
    } else if (state.mode === "playing" && o.size > 1 && o.lane !== player.lane && Math.abs(o.z) < 1) {
      state.shake = Math.max(state.shake, 0.08);
    }
    if (tailZ > DESPAWN_Z) {
      removeObstacle(o);
      obstacles.splice(i, 1);
    }
  }
}

// Returns false when a boulder or gate has knocked the teddy over.
function updatePlayer(dt) {
  player.x += (LANES[player.lane] - player.x) * (1 - Math.exp(-dt * 18));
  const prevY = player.y;
  if (player.airborne) {
    player.vy -= gravity() * (player.fastFall ? 3 : 1) * dt;
    player.y += player.vy * dt;
  }
  if (player.duck > 0) player.duck = Math.max(0, player.duck - state.speed * dt);
  player.jumpQueued = Math.max(0, player.jumpQueued - dt);
  player.coyote = Math.max(0, player.coyote - dt);
  if (hitsGate(player.duck > 0 ? DUCK_HEIGHT : STAND_HEIGHT)) return false;
  const { top: support, deadly, topObj } = surfaceUnderTeddy(Math.max(prevY, player.y));
  // Back on the ground (or on something else), a giant the teddy had climbed is a wall again.
  if (!player.airborne) {
    for (const o of obstacles) if (o.giant && o.cleared && o !== topObj) o.cleared = false;
  }
  // Measured from the higher of this frame's and last frame's height, so a fast fall that
  // overshoots a rock's top in one frame lands on it instead of counting as a hit.
  if (deadly > Math.max(prevY, player.y) + STEP_UP) return false; // ran into an oncoming rock

  if (player.airborne) {
    if (player.y <= support) {
      player.y = support; // never sink into a rock
      if (player.vy <= 0) {
        const impact = -player.vy / jumpVelocity();
        player.squash = clamp(impact, 0, 1);
        const chained = player.jumpQueued > 0;
        if (impact > 0.3 && !chained) support > 0.3 ? sfx.landOnRock() : sfx.land();
        if (impact > 0.3) dustBurst(player.x, support, 0, support > 0.3 ? 4 : 9, 0.7);
        player.vy = 0;
        player.airborne = false;
        player.fastFall = false;
        if (chained) jump();
        else if (player.duckQueued) startDuck();
      }
    }
  } else if (support >= player.y - 0.05) {
    // Ride the bumps along a train, or get lifted onto one when stepping into its side.
    player.y = support;
  } else {
    player.airborne = true; // the rock rolled out from under the teddy
    player.vy = 0;
    player.coyote = COYOTE_TIME;
  }
  return true;
}

function animateTeddy(dt, t) {
  const k = player.knock;
  if (k) {
    k.vy -= 26 * dt;
    teddy.position.x += k.vx * dt;
    teddy.position.y += k.vy * dt;
    teddy.position.z += k.vz * dt;
    if (!k.landed) teddy.rotation.x += k.spin * dt;
    const floor = groundY(teddy.position.z) + (k.landed ? 0.42 : 0);
    if (teddy.position.y < floor) {
      teddy.position.y = floor;
      if (!k.landed) {
        k.landed = true;
        // Unwind the spin so it settles onto its back the short way round.
        const off = THREE.MathUtils.euclideanModulo(teddy.rotation.x - Math.PI / 2 + Math.PI, Math.PI * 2) - Math.PI;
        teddy.rotation.x = Math.PI / 2 + off;
      }
      k.vy = Math.abs(k.vy) * 0.25;
      k.vx *= 0.5;
      k.vz *= 0.5;
      if (k.vy < 1) k.vy = k.vx = k.vz = 0;
    }
    if (k.landed) teddy.rotation.x += (Math.PI / 2 - teddy.rotation.x) * (1 - Math.exp(-dt * 10));
    return;
  }

  player.squash = Math.max(0, player.squash - dt * 5);

  // Cartoon swing on trail changes. moveLane kicks the lean and twist springs; they overshoot
  // and wobble back upright. `swing` rises from 0 to 1 and back over the move, driving a small
  // hop, a sideways stretch and limbs trailing behind.
  springStep(player, "lean", "leanVel", dt);
  springStep(player, "twist", "twistVel", dt);
  const span = player.swingTo - player.swingFrom;
  const progress = span ? clamp((player.x - player.swingFrom) / span, 0, 1) : 1;
  const swing = Math.sin(progress * Math.PI);
  const swingDir = Math.sign(span);
  const hop = player.airborne ? 0 : swing * 0.3;
  teddy.position.set(player.x, player.y + hop, 0);
  teddy.rotation.z = player.lean;
  // On the title screen the teddy turns round to look at the player; in play it faces the mountain.
  const yaw = state.mode === "ready" ? Math.PI + Math.sin(t * 1.3) * 0.25 : 0;
  teddy.userData.baseYaw += (yaw - teddy.userData.baseYaw) * (1 - Math.exp(-dt * 6));
  teddy.rotation.y = teddy.userData.baseYaw + player.twist;
  // Riding a boulder: run in place against the rolling rock and wobble to keep balance.
  // Ducking: squash down and tip forward, arms over the head.
  player.duckPose += ((player.duck > 0 ? 1 : 0) - player.duckPose) * (1 - Math.exp(-dt * 22));
  const riding = !player.airborne && player.y > 0.05;
  const balance = riding ? Math.sin(t * 11) * 0.12 : 0;
  const tipForward = -0.3 * player.duckPose;
  teddy.rotation.x += (balance + tipForward - teddy.rotation.x) * (1 - Math.exp(-dt * 12));

  // Limb poses. Riding: a running stride. Jumping: arms thrown up and knees tucked on the way
  // up, arms spread and legs reaching down on the way down. Standing: arms and legs at rest.
  const stride = riding ? Math.sin(t * 22) * 0.9 : 0;
  const rising = player.airborne && player.vy > 0;
  const armSpread = player.airborne ? (rising ? 2.5 : 1.5) : 0;
  const tuck = player.airborne ? (rising ? -1.1 : -0.35) : 0;
  const ease = 1 - Math.exp(-dt * 18);
  // The model is turned to face the mountain, so +z rotation on a limb swings it toward world -x:
  // during a move to the right (swingDir 1) the limbs trail out to the left.
  const trail = swingDir * swing;
  for (const hip of teddy.userData.legs) {
    const target = riding ? stride * hip.userData.side : tuck;
    hip.rotation.x += (target - hip.rotation.x) * ease;
    hip.rotation.z += (trail * 0.4 - hip.rotation.z) * ease;
  }
  for (const shoulder of teddy.userData.arms) {
    const swingTarget = riding ? -stride * shoulder.userData.side * 0.7 : 0;
    shoulder.rotation.x += (swingTarget - shoulder.rotation.x) * ease;
    const spreadTarget = (armSpread + player.duckPose * 2.2) * shoulder.userData.side + trail * 0.9;
    shoulder.rotation.z += (spreadTarget - shoulder.rotation.z) * ease;
  }

  const breath = Math.sin(t * 3) * 0.02;
  // Stretched on the way up, squashed on landing, and stretched sideways mid-swing.
  const stretch = player.airborne ? clamp(player.vy / jumpVelocity(), -1, 1) * 0.08 : 0;
  const duckSquash = 1 - 0.45 * player.duckPose;
  const duckWiden = 1 + 0.22 * player.duckPose;
  const sy = (1 + breath + stretch - player.squash * 0.25 - swing * 0.06) * duckSquash;
  const sxz = (1 - breath * 0.5 - stretch * 0.5 + player.squash * 0.18) * duckWiden;
  teddy.scale.set(sxz + swing * 0.12, sy, sxz);
}

// Advances an underdamped spring that pulls obj[pos] back to zero, so a kick to obj[vel]
// overshoots and wobbles before settling.
function springStep(obj, pos, vel, dt, stiffness = 140, damping = 7) {
  obj[vel] += (-stiffness * obj[pos] - damping * obj[vel]) * dt;
  obj[pos] += obj[vel] * dt;
}

// 0..1: how loud the boulders' rumble should be, from how many are close and how close.
function rumbleLevel() {
  let level = 0;
  for (const o of obstacles) {
    const closeness = 1 - Math.abs(o.z) / 35;
    if (closeness > 0) level += closeness * (o.giant ? o.span / 2 : o.size > 1 ? 0.6 : 0.3);
  }
  return Math.min(1, level);
}

// Rises when the teddy stands up on big boulders, so it stays in view at the top of a staircase.
// It follows the height the teddy stands at rather than every jump, so jumping doesn't bob it.
let cameraLift = 0;
function updateCamera(dt) {
  camera.position.x += (player.x * 0.45 - camera.position.x) * (1 - Math.exp(-dt * 6));
  if (!player.airborne && !player.knock) player.standY = player.y;
  const liftTarget = Math.max(0, player.standY - 1.2) * 0.8;
  cameraLift += (liftTarget - cameraLift) * (1 - Math.exp(-dt * 2.5));
  const shake = state.shake;
  state.shake = Math.max(0, shake - dt * 1.5);
  camera.position.y = cameraBase.y + cameraLift + (Math.random() - 0.5) * shake;
  camera.position.z = cameraBase.z + (Math.random() - 0.5) * shake * 0.5;
  camera.lookAt(camera.position.x * 0.5, 2.6 + cameraLift * 0.8, -18);
  sky.position.copy(camera.position);
}

function update(dt, t) {
  wind.value = t;
  skyUniforms.uTime.value = t;
  updateBirds(dt, t);
  if (state.mode === "paused") return;

  const attract = state.mode === "ready" || state.mode === "over";
  if (state.mode === "playing") {
    state.elapsed += dt;
    state.speed = MAX_SPEED - (MAX_SPEED - START_SPEED) * Math.exp(-state.elapsed / SPEED_TIME);
    state.distance += state.speed * dt;
    state.score = Math.floor(state.distance * 0.5) + state.dodged * 10;
  }
  const speed = attract ? ATTRACT_SPEED : state.speed;
  const move = speed * dt;

  if (attract || state.mode === "playing") {
    state.spawnIn -= move;
    if (state.spawnIn <= 0) spawnRow(attract);
  }
  updateObstacles(move);
  for (const o of obstacles) kickUpDust(o, dt, speed);
  updateDust(dt);

  if (state.mode === "playing") {
    if (!updatePlayer(dt)) crash();
    updateHud();
    setMusicTempo(112 + (state.speed - START_SPEED) * 1.1);
    // Little footsteps while running along the top of a boulder.
    if (!player.airborne && player.y > 0.05) {
      state.stepTimer -= dt;
      if (state.stepTimer <= 0) {
        state.stepTimer = 0.09;
        state.stepHigh = !state.stepHigh;
        sfx.step(state.stepHigh);
      }
    }
  }
  setRumble(rumbleLevel() * (state.mode === "playing" || state.mode === "crashed" ? 1 : 0.4));

  if (state.mode === "crashed") {
    state.overTimer -= dt;
    if (state.overTimer <= 0) {
      state.mode = "over";
      const rocks = `${state.dodged} rock${state.dodged === 1 ? "" : "s"} dodged`;
      showOverlay(
        state.newBest ? "New best!" : "Squashed!",
        `Score ${state.score} · ${rocks}`,
        "Play again"
      );
      if (state.newBest) sfx.newBest();
    }
  }

  animateTeddy(dt, t);
  updateCamera(dt);
}

// ---------- Layout ----------
// In portrait the camera pulls back and widens so all three lanes stay on screen.
function resize(w = window.innerWidth, h = window.innerHeight) {
  if (!w || !h) return; // hidden or not laid out yet: keep the last good size
  renderer.setSize(w, h, false);
  const aspect = w / h;
  camera.aspect = aspect;
  camera.fov = aspect < 1 ? 70 : 62;
  const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const neededHalfWidth = 3.7; // outer lane edge plus a little margin, at the teddy
  const distance = Math.max(8, neededHalfWidth / (halfTan * aspect));
  cameraBase.set(0, 4.2 + (distance - 8) * 0.35, distance);
  camera.position.copy(cameraBase);
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", () => resize());
document.addEventListener("visibilitychange", () => resize());
resize();

// Draw one frame with every kind of obstacle and the dust in view, so all their shaders are
// compiled now rather than with a stutter the first time each turns up.
addObstacle(0, 2, -30);
addGiant(1, 1, -40);
addGate(1, -20);
addLog(2, -25);
emitDust(0, 1, -10, 0, 0, 0, 0.1, 0.01, 0);
updateDust(0);
renderer.render(scene, camera);
clearObstacles();
state.spawnIn = 0;

// ---------- Frame rate ----------
// Holds the frame rate on slower devices by drawing fewer pixels. Every 45 frames it looks at the
// median frame time: while frames miss 60 fps it steps the resolution down as far as one pixel
// per CSS pixel, and below that only as far as it takes to hold 30 fps. After a long smooth run
// it tries a step back up, and stays put for good if that turns out too slow.
const RESOLUTION_STEP = 0.85;
const resolution = { ratio: MAX_PIXEL_RATIO, ceiling: MAX_PIXEL_RATIO, samples: [], smooth: 0, warmup: 2, raised: false };

function adaptResolution(ms) {
  const r = resolution;
  if (r.warmup > 0) {
    r.warmup -= ms / 1000; // textures uploading and the like: not the steady rate
    return;
  }
  if (ms > 200 || document.hidden) {
    r.samples.length = 0; // a one-off stall or a hidden tab
    return;
  }
  r.samples.push(ms);
  if (r.samples.length < 45) return;
  const median = r.samples.sort((a, b) => a - b)[22];
  r.samples.length = 0;
  let next = r.ratio;
  if (median > 36 && r.ratio > 0.7) next = Math.max(0.7, r.ratio * RESOLUTION_STEP);
  else if (median > 18.5 && r.ratio > 1) next = Math.max(1, r.ratio * RESOLUTION_STEP);
  const raised = r.raised;
  r.raised = false;
  if (next < r.ratio) {
    if (raised) r.ceiling = next; // the last step up was one too many
    r.smooth = 0;
  } else if (median < 17.5 && r.ratio < r.ceiling) {
    if (++r.smooth >= 8) {
      next = Math.min(r.ceiling, r.ratio / RESOLUTION_STEP);
      r.smooth = 0;
      r.raised = true;
    }
  } else {
    r.smooth = 0;
  }
  if (next !== r.ratio) {
    r.ratio = next;
    renderer.setPixelRatio(next);
    resize();
  }
}

// Opened from the game page's Play button: that was the player's "play", so skip the title card.
// Where the browser holds sound back until a tap inside the game, the first move unlocks it.
if (new URLSearchParams(location.search).has("autostart")) startGame();

// The normal loop can be held while a test or recording drives the game frame by frame.
let loopHeld = false;

// Local testing hook: step the simulation without relying on animation frames.
if (location.hostname === "localhost") {
  window.boulderBear = {
    state,
    player,
    obstacles,
    LANES,
    startGame,
    addObstacle,
    addGate,
    addLog,
    addGiant,
    addColossus,
    spawnGiantRow,
    spawnStaircaseRow,
    launchFlock,
    jump,
    drop,
    moveLane,
    surfaceUnderTeddy,
    renderer,
    camera,
    scene,
    resize,
    holdLoop: (held) => (loopHeld = held),
    resolution,
    step: (dt, t = performance.now() / 1000) => update(dt, t),
  };
}

let last = performance.now();
function frame(now) {
  const ms = now - last;
  const dt = Math.min(ms / 1000, 0.05);
  last = now;
  if (!loopHeld) {
    update(dt, now / 1000);
    renderer.render(scene, camera);
    adaptResolution(ms);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const HORIZON = 0xcfe8fb;
const scene = new THREE.Scene();
scene.background = new THREE.Color(HORIZON);
scene.fog = new THREE.Fog(HORIZON, 70, 260);

const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 600);
const cameraBase = new THREE.Vector3(0, 4.2, 8);

scene.add(new THREE.HemisphereLight(0xe4f3ff, 0x5d7f45, 1.2));
const sun = new THREE.DirectionalLight(0xfff4e0, 2.4);
sun.target.position.set(0, 0, -14);
sun.position.set(10, 30, -6);
sun.castShadow = true;
const shadowSize = isTouch ? 1024 : 2048;
sun.shadow.mapSize.set(shadowSize, shadowSize);
Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 34, bottom: -34, near: 1, far: 90 });
sun.shadow.camera.updateProjectionMatrix();
sun.shadow.bias = -0.0005;
scene.add(sun, sun.target);

// ---------- World ----------
// Everything below is generated once at startup: canvas textures instead of image files, and
// one instanced draw call per kind of scenery so the frame stays cheap on phones.
const DETAIL = isTouch ? 0.6 : 1; // scales scenery counts down on phones
const rand = mulberry32(7); // fixed seed so the valley looks the same every visit
const pick = (arr) => arr[(rand() * arr.length) | 0];

// Smooth, cheap pseudo-noise in roughly -1..1.
const noise2 = (x, z) =>
  Math.sin(x * 0.13 + z * 0.05) * 0.5 + Math.sin(x * 0.07 - z * 0.11 + 1.7) * 0.35 + Math.sin(x * 0.31 + z * 0.23) * 0.15;

// The trails run along a flat strip; beyond it the valley sides climb into the mountains.
const FLAT_HALF_WIDTH = 5.5;
function terrainY(x, z) {
  const side = Math.max(0, Math.abs(x) - FLAT_HALF_WIDTH);
  const bumps = noise2(x, z) * Math.min(1, side * 0.3) * 0.9;
  return groundY(z) + side * 0.25 + side * side * 0.008 + bumps;
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

function drawGrass(ctx, w, h, base = true) {
  if (base) {
    ctx.fillStyle = "#7cbc55";
    ctx.fillRect(0, 0, w, h);
  }
  const blades = ["#6aa847", "#8bcb60", "#5c9a3e", "#97d46b", "#74b44e"];
  ctx.lineWidth = 1.5;
  for (let i = 0; i < (w * h) / 35; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const len = 3 + rand() * 5;
    ctx.strokeStyle = pick(blades);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rand() - 0.5) * 3, y - len);
    ctx.stroke();
  }
  for (let i = 0; i < (w * h) / 900; i++) {
    ctx.fillStyle = rand() < 0.6 ? "rgba(255,255,230,0.7)" : "rgba(255,225,90,0.8)";
    ctx.fillRect(rand() * w, rand() * h, 2, 2);
  }
}

// Three winding, worn hiking trails on a transparent canvas, laid over the meadow. The canvas
// spans TRAIL_STRIP_W across and TRAIL_TILE along the slope; every wobble completes a whole
// number of cycles per tile so the texture repeats without seams.
const TRAIL_STRIP_W = 8;
const TRAIL_TILE = 16;
function trailTexture() {
  return canvasTexture(
    512,
    1024,
    (ctx, w, h) => {
      const px = w / TRAIL_STRIP_W;
      const dirt = ["#a07c54", "#9a774f", "#a8845b", "#94714b"];
      const waves = (y, a, b, c, d) => Math.sin(((Math.PI * 2 * y) / h) * a + b) * c + Math.sin(((Math.PI * 2 * y) / h) * (a + 2) + d) * c * 0.6;
      const trails = LANES.map((lane, i) => ({ cx: (lane + TRAIL_STRIP_W / 2) * px, phase: i * 2.1 }));
      const edgeAt = (t, y) => {
        const center = t.cx + waves(y, 1, t.phase, 5, t.phase * 1.7);
        const half = 0.58 * px + waves(y, 3, t.phase * 0.5, 4, t.phase + 1);
        return [center, half];
      };
      for (const t of trails) {
        for (let y = 0; y < h; y++) {
          const [c, half] = edgeAt(t, y);
          ctx.fillStyle = "rgba(190,168,110,0.45)"; // trampled grass at the edges
          ctx.fillRect(c - half - 9, y, half * 2 + 18, 1);
          ctx.fillStyle = pick(dirt);
          ctx.fillRect(c - half, y, half * 2, 1);
          ctx.fillStyle = "rgba(90,62,38,0.22)"; // packed earth where boots go
          ctx.fillRect(c - half * 0.4, y, half * 0.8, 1);
        }
        // Grit, pebbles and stones on the trail.
        for (let i = 0; i < 900; i++) {
          const y = rand() * h;
          const [c, half] = edgeAt(t, y);
          const x = c + (rand() * 2 - 1) * half;
          ctx.fillStyle = rand() < 0.5 ? "rgba(70,48,28,0.45)" : "rgba(220,200,165,0.55)";
          ctx.fillRect(x, y, 1 + rand() * 2.5, 1 + rand() * 2.5);
        }
        for (let i = 0; i < 40; i++) {
          const y = rand() * h;
          const [c, half] = edgeAt(t, y);
          const x = c + (rand() * 2 - 1) * half * 0.9;
          const r = 2 + rand() * 4;
          ctx.fillStyle = pick(["#8d8a86", "#a29e98", "#7a7671"]);
          ctx.beginPath();
          ctx.ellipse(x, y, r, r * 0.75, rand() * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.fillRect(x - r * 0.4, y - r * 0.4, r * 0.5, r * 0.4);
        }
        // Grass creeping over the trail edges.
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 500; i++) {
          const y = rand() * h;
          const [c, half] = edgeAt(t, y);
          const x = c + (rand() < 0.5 ? -1 : 1) * (half - 4 + rand() * 12);
          ctx.strokeStyle = pick(["#6aa847", "#8bcb60", "#5c9a3e"]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + (rand() - 0.5) * 4, y - 3 - rand() * 5);
          ctx.stroke();
        }
      }
    },
    1,
    280 / TRAIL_TILE
  );
}

function makeGround() {
  // The meadow: one mesh, with valley sides and soft light and dark patches in vertex colours.
  const geo = new THREE.PlaneGeometry(160, 280, 80, 140);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, -70);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  const dark = new THREE.Color(0xb9d6a4);
  const light = new THREE.Color(0xffffff);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, terrainY(x, z));
    c.copy(dark).lerp(light, 0.5 + noise2(x * 1.7, z * 1.3) * 0.5);
    c.toArray(colors, i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const grass = canvasTexture(256, 256, (ctx, w, h) => drawGrass(ctx, w, h), 160 / 6, 280 / 6);
  const meadow = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: grass, vertexColors: true }));
  meadow.receiveShadow = true;
  scene.add(meadow);

  // The trails, laid on the flat middle of the slope.
  const trails = new THREE.Mesh(
    new THREE.PlaneGeometry(TRAIL_STRIP_W, 280),
    new THREE.MeshLambertMaterial({ map: trailTexture(), transparent: true, depthWrite: false })
  );
  trails.rotation.x = -Math.PI / 2 + Math.atan(SLOPE);
  trails.position.set(0, groundY(-70) + 0.02, -70);
  trails.receiveShadow = true;
  scene.add(trails);
}

// Concatenates non-indexed geometries that share the same attributes into one.
function mergeGeometries(geos) {
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
  merged.computeVertexNormals();
  return merged;
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

function makeMountains() {
  // [x, z, height, radius]. The centre peak's foot reaches the spawn point, so boulders appear
  // to roll straight off the mountain.
  const peaks = [
    [0, -150, 80, 58],
    [-58, -150, 60, 42],
    [60, -155, 66, 44],
    [-110, -140, 46, 40],
    [112, -145, 50, 40],
    [-32, -205, 95, 55],
    [38, -215, 100, 60],
    [-150, -190, 70, 55],
    [150, -195, 75, 55],
    [0, -250, 120, 70],
  ];
  const rockColors = [0x8d8a96, 0x7f7b86, 0x9a948f, 0x86817a, 0x777480].map((h) => new THREE.Color(h));
  const snow = new THREE.Color(0xf4f8fc);
  const geos = peaks.map(([x, z, h, r]) => {
    const geo = new THREE.ConeGeometry(r, h, 10, 5).toNonIndexed();
    jitterVertices(geo, (v) => {
      const rim = v.y < -h / 2 + 0.01;
      const k = 0.86 + rand() * 0.28;
      v.x *= k;
      v.z *= k;
      if (!rim && v.y < h / 2 - 0.01) v.y += (rand() - 0.5) * h * 0.08;
      return v;
    });
    colorFaces(geo, (centroid, c) => {
      const height = (centroid.y + h / 2) / h; // 0 at the foot, 1 at the tip
      if (height > 0.58 + (rand() - 0.5) * 0.18) c.copy(snow);
      else c.copy(pick(rockColors));
    });
    geo.rotateY(rand() * Math.PI);
    geo.translate(x, groundY(z) - 4 + h / 2, z);
    return geo;
  });
  scene.add(new THREE.Mesh(mergeGeometries(geos), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })));
}

function makeSky() {
  const geo = new THREE.SphereGeometry(500, 24, 12);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const top = new THREE.Color(0x5ea6e6);
  const horizon = new THREE.Color(HORIZON);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    c.copy(horizon).lerp(top, Math.pow(clamp(pos.getY(i) / 500, 0, 1), 0.6));
    c.toArray(colors, i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const sky = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })
  );
  sky.renderOrder = -1;
  scene.add(sky);
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

function tuftGeometry() {
  const blades = [-0.35, 0, 0.35].map((tilt, i) => {
    const g = new THREE.ConeGeometry(0.05, 0.34, 4, 1, true).toNonIndexed(); // no hidden base
    g.translate(0, 0.17, 0);
    g.rotateZ(tilt);
    g.rotateY(i * 2.1);
    return g;
  });
  return mergeGeometries(blades);
}

function makeScenery() {
  const lambert = (opts = {}) => new THREE.MeshLambertMaterial({ color: 0xffffff, ...opts });
  const onMeadow = (o, x, z, sink = 0) => o.position.set(x, terrainY(x, z) - sink, z);

  // Grass tufts and wildflowers between and beside the trails.
  scatter(tuftGeometry(), lambert(), Math.round(1500 * DETAIL), (o) => {
    onMeadow(o, meadowX(0, 18, 0.7), 10 - rand() * 100);
    o.scale.set(0.8 + rand() * 0.8, 0.7 + rand() * 1.1, 0.8 + rand() * 0.8);
  }, { colors: ["#5f9f3f", "#6fb24a", "#4f8c35", "#82c058"], receiveShadow: false });

  const flower = new THREE.IcosahedronGeometry(0.065, 0);
  flower.translate(0, 0.2, 0);
  scatter(flower, lambert(), Math.round(520 * DETAIL), (o) => {
    onMeadow(o, meadowX(0, 16, 0.75), 10 - rand() * 95);
    o.scale.setScalar(0.8 + rand() * 0.7);
  }, { colors: ["#ffffff", "#ffe066", "#c792ea", "#ff8fab", "#8ecdf7"], receiveShadow: false });

  // Pebbles, some right at the trail edges.
  const pebble = new THREE.DodecahedronGeometry(0.1, 0);
  scatter(pebble, lambert({ flatShading: true }), Math.round(650 * DETAIL), (o) => {
    onMeadow(o, meadowX(0, 20, 0.5), 10 - rand() * 105, 0.02);
    const s = 0.6 + rand() * 1.8;
    o.scale.set(s, s * 0.6, s * (0.8 + rand() * 0.4));
  }, { colors: ["#9a958f", "#85817b", "#a9a39b", "#8a7f72"] });

  // Low bushes just outside the outer trails.
  const bush = new THREE.IcosahedronGeometry(0.5, 0);
  scatter(bush, lambert({ flatShading: true }), Math.round(90 * DETAIL), (o) => {
    onMeadow(o, (rand() < 0.5 ? -1 : 1) * (3.7 + rand() * 3), 10 - rand() * 100, 0.15);
    o.scale.set(0.7 + rand() * 0.8, 0.5 + rand() * 0.5, 0.7 + rand() * 0.8);
  }, { colors: ["#4f8f3a", "#5d9d42", "#46803a"] });

  // Rock outcrops on the valley sides.
  const outcrop = new THREE.IcosahedronGeometry(1, 0);
  scatter(outcrop, lambert({ flatShading: true }), Math.round(70 * DETAIL), (o) => {
    const s = 0.6 + rand() * 2.4;
    onMeadow(o, meadowX(6.5, 45), 8 - rand() * 115, s * 0.35);
    o.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    o.scale.set(s * (0.8 + rand() * 0.6), s * (0.6 + rand() * 0.5), s * (0.8 + rand() * 0.6));
  }, { colors: ["#8f8b85", "#7d7973", "#9c968e"], castShadow: true });

  // Pines: trunk and two layers of needles, each layer one instanced mesh.
  const trees = Array.from({ length: Math.round(150 * DETAIL) }, () => {
    const x = meadowX(6.2, 42);
    const z = 12 - rand() * 125;
    return { x, y: terrainY(x, z), z, s: 0.8 + rand() * 1.0, yaw: rand() * Math.PI };
  });
  const treePart = (geometry, color, y, colors) =>
    scatter(geometry, lambert({ color, flatShading: true }), trees.length, (o, i) => {
      const t = trees[i];
      o.position.set(t.x, t.y + y * t.s, t.z);
      o.rotation.y = t.yaw;
      o.scale.setScalar(t.s);
    }, { colors, castShadow: true });
  treePart(new THREE.CylinderGeometry(0.18, 0.25, 1.2, 6), 0x7a5333, 0.6);
  treePart(new THREE.ConeGeometry(1.3, 2.4, 7), 0xffffff, 2.1, ["#3f8f4a", "#367f41", "#4a9a52"]);
  treePart(new THREE.ConeGeometry(0.95, 1.9, 7), 0xffffff, 3.2, ["#3f8f4a", "#367f41", "#4a9a52"]);

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

// Clouds: one instanced mesh of puffs; each frame only their positions are rewritten.
const clouds = [];
let cloudMesh = null;
function makeClouds() {
  for (let i = 0; i < 10; i++) {
    clouds.push({ x: -150 + rand() * 300, y: 60 + rand() * 30, z: -120 - rand() * 100, puffs: [] });
    for (let j = 0; j < 4; j++) {
      clouds[i].puffs.push({ dx: j * 3.2 - 5, dy: rand() * 1.5, dz: rand() * 2, s: 2.5 + rand() * 2 });
    }
  }
  cloudMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshLambertMaterial({ color: 0xffffff }), 40);
  cloudMesh.frustumCulled = false;
  scene.add(cloudMesh);
  updateClouds(0);
}

function updateClouds(dt) {
  let i = 0;
  for (const cloud of clouds) {
    cloud.x += dt * 1.5;
    if (cloud.x > 160) cloud.x = -160;
    for (const p of cloud.puffs) {
      placer.position.set(cloud.x + p.dx * 1.2, cloud.y + p.dy, cloud.z + p.dz);
      placer.rotation.set(0, 0, 0);
      placer.scale.set(p.s, p.s * 0.55, p.s);
      placer.updateMatrix();
      cloudMesh.setMatrixAt(i++, placer.matrix);
    }
  }
  cloudMesh.instanceMatrix.needsUpdate = true;
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

makeSky();
makeGround();
makeMountains();
makeScenery();
makeClouds();
makeBirds();

// ---------- Teddy ----------
function makeTeddy() {
  const teddy = new THREE.Group();
  // Modelled facing +z, then turned around so it faces the oncoming boulders with its back to
  // the camera. The outer group can still turn it to face the player on the title screen.
  const model = new THREE.Group();
  model.rotation.y = Math.PI;
  teddy.add(model);
  // A faint fibre texture so the plush reads as fabric rather than plastic.
  const fibres = canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = rand() < 0.5 ? "rgba(120,90,60,0.18)" : "rgba(255,255,255,0.5)";
      ctx.fillRect(rand() * w, rand() * h, 1, 2 + rand() * 3);
    }
  }, 3, 3);
  const fur = new THREE.MeshStandardMaterial({ color: 0xc58b52, roughness: 1, map: fibres });
  const cream = new THREE.MeshStandardMaterial({ color: 0xf3d9b1, roughness: 1, map: fibres });
  const dark = new THREE.MeshStandardMaterial({ color: 0x26170f, roughness: 0.35 });
  const ribbon = new THREE.MeshStandardMaterial({ color: 0xd93d4a, roughness: 0.6 });
  const sphere = new THREE.SphereGeometry(1, 16, 12);
  const part = (mat, [x, y, z], [sx, sy, sz], rotZ = 0, parent = model) => {
    const m = new THREE.Mesh(sphere, mat);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    m.rotation.z = rotZ;
    m.castShadow = true;
    parent.add(m);
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
  part(fur, [0, 0.74, 0], [0.48, 0.54, 0.42]); // body
  part(cream, [0, 0.42, -0.4], [0.13, 0.13, 0.11]); // tail
  part(cream, [0, 0.7, 0.27], [0.3, 0.34, 0.18]); // belly
  part(fur, [0, 1.42, 0.02], [0.42, 0.4, 0.38]); // head
  part(cream, [0, 1.34, 0.33], [0.19, 0.14, 0.12]); // muzzle
  part(dark, [0, 1.4, 0.44], [0.065, 0.05, 0.045]); // nose
  for (const s of [-1, 1]) {
    part(dark, [0.14 * s, 1.53, 0.35], [0.05, 0.06, 0.03]); // eyes
    part(fur, [0.3 * s, 1.74, -0.02], [0.15, 0.15, 0.08]); // ears
    part(cream, [0.3 * s, 1.74, 0.04], [0.085, 0.085, 0.04]);
    const shoulder = pivot(0.4 * s, 1.06, 0.06, s);
    part(fur, [0.07 * s, -0.2, 0], [0.14, 0.27, 0.14], 0.55 * s, shoulder); // arm
    teddy.userData.arms.push(shoulder);
    const hip = pivot(0.24 * s, 0.4, 0.1, s);
    part(fur, [0, -0.18, 0], [0.18, 0.18, 0.24], 0, hip); // leg
    part(cream, [0, -0.2, 0.22], [0.12, 0.12, 0.04], 0, hip); // foot pad
    teddy.userData.legs.push(hip);
    part(ribbon, [0.1 * s, 1.08, 0.33], [0.1, 0.07, 0.05]); // bow tie
  }
  part(ribbon, [0, 1.08, 0.36], [0.04, 0.04, 0.04]);
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

// A lumpy icosahedron with lighter and darker facets and the odd patch of lichen.
function rockGeometry(seed) {
  const r = mulberry32(seed);
  const geo = jitterVertices(new THREE.IcosahedronGeometry(BOULDER_R, 1), (v) => v.multiplyScalar(0.82 + r() * 0.3));
  const lichen = new THREE.Color(0xc9c98a);
  colorFaces(geo, (_, c) => {
    if (r() < 0.08) c.copy(lichen);
    else c.setScalar(0.78 + r() * 0.3);
  });
  geo.computeVertexNormals();
  return geo;
}

const rockGeos = [11, 23, 37, 41, 59].map(rockGeometry);
const rockMat = new THREE.MeshStandardMaterial({ color: 0xb0a598, roughness: 0.95, flatShading: true, vertexColors: true });
const trainMat = new THREE.MeshStandardMaterial({ color: 0x7d7768, roughness: 0.95, flatShading: true, vertexColors: true });

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
const giantMat = new THREE.MeshStandardMaterial({ color: 0x9a9184, roughness: 0.95, flatShading: true, vertexColors: true });
const colossusMat = new THREE.MeshStandardMaterial({ color: 0x8f8d92, roughness: 0.95, flatShading: true, vertexColors: true });

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
    const planks = ["#c48e52", "#b98448", "#cf9a5c"];
    const plankW = w / 4;
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = planks[i % planks.length];
      ctx.fillRect(i * plankW, 0, plankW, h);
      ctx.strokeStyle = "rgba(90,55,25,0.25)"; // wood grain
      for (let g = 0; g < 7; g++) {
        const x = i * plankW + 6 + rand() * (plankW - 12);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + 4, h * 0.3, x - 4, h * 0.6, x + 2, h);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(70,40,15,0.55)";
      ctx.fillRect(i * plankW, 0, 3, h);
    }
    // Red and white warning stripes along the bottom edge. No hint about ducking: players work
    // it out.
    const band = h * 0.22;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, h - band, w, band);
    ctx.clip();
    for (let i = 0, x = -band; x < w + band; i++, x += 36) {
      ctx.fillStyle = i % 2 ? "#f4f1ea" : "#d8392f";
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(x + 36, h);
      ctx.lineTo(x + 36 + band, h - band);
      ctx.lineTo(x + band, h - band);
      ctx.fill();
    }
    ctx.restore();
  });
}

const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9, flatShading: true });
const boardMat = new THREE.MeshStandardMaterial({ map: signTexture(), roughness: 0.85 });
const postGeo = new THREE.CylinderGeometry(0.11, 0.13, GATE_TOP, 7).translate(0, GATE_TOP / 2, 0);
const beamGeo = new THREE.CylinderGeometry(0.12, 0.12, GATE_HALF_WIDTH * 2 + 0.4, 7)
  .rotateZ(Math.PI / 2)
  .translate(0, GATE_TOP - 0.1, 0);
const boardHeight = GATE_TOP - 0.25 - GATE_CLEARANCE;
const boardGeo = new THREE.BoxGeometry(GATE_HALF_WIDTH * 2 - 0.2, boardHeight, GATE_DEPTH).translate(0, GATE_CLEARANCE + boardHeight / 2, 0);
const runnerGeo = new THREE.BoxGeometry(0.14, 0.1, 1.1).translate(0, 0.05, 0);

function addGate(lane, z = SPAWN_Z) {
  const group = new THREE.Group();
  const add = (geo, mat, x = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.x = x;
    m.castShadow = true;
    group.add(m);
  };
  for (const s of [-1, 1]) {
    add(postGeo, woodMat, s * GATE_HALF_WIDTH);
    add(runnerGeo, woodMat, s * GATE_HALF_WIDTH);
  }
  add(beamGeo, woodMat);
  add(boardGeo, boardMat);
  scene.add(group);
  const o = { kind: "gate", lane, size: 1, z, group, meshes: [], tailOffset: 0, passed: false, rattle: rand() * 6 };
  placeObstacle(o, 0);
  obstacles.push(o);
}

// ---------- Logs ----------
// A log rolling down the trail on its side, end over end. Too low to duck under (it rolls right
// into a ducking teddy) but low enough to jump: jump it or change trails.
const LOG_RADIUS = 0.42;
const LOG_HALF_LENGTH = 0.95;

const barkMat = new THREE.MeshStandardMaterial({
  roughness: 1,
  map: canvasTexture(256, 128, (ctx, w, h) => {
    ctx.fillStyle = "#6b4528";
    ctx.fillRect(0, 0, w, h);
    // Bark furrows run along the log.
    for (let i = 0; i < 70; i++) {
      const x = rand() * w;
      ctx.strokeStyle = rand() < 0.6 ? "rgba(40,24,12,0.55)" : "rgba(150,110,70,0.4)";
      ctx.lineWidth = 1 + rand() * 3;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + 6, h * 0.33, x - 6, h * 0.66, x + 3, h);
      ctx.stroke();
    }
  }),
});
const ringsMat = new THREE.MeshStandardMaterial({
  roughness: 0.9,
  map: canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = "#d8b07a";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(120,80,40,0.55)";
    for (let r = 6; r < w / 2; r += 5 + rand() * 4) {
      ctx.lineWidth = 1 + rand();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = "#6b4528"; // bark rim
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 5, 0, Math.PI * 2);
    ctx.stroke();
  }),
});
// Cylinder material groups: side, then the two end caps.
const logGeo = new THREE.CylinderGeometry(LOG_RADIUS, LOG_RADIUS, LOG_HALF_LENGTH * 2, 12).rotateZ(Math.PI / 2);
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

function placeObstacle(o, move) {
  if (o.kind === "log") {
    o.log.position.set(0, groundY(o.z) + LOG_RADIUS, o.z);
    o.log.rotation.x += move / LOG_RADIUS; // rolls toward the camera
    return;
  }
  if (o.kind === "gate") {
    o.group.position.set(LANES[o.lane], groundY(o.z), o.z);
    o.group.rotation.z = Math.sin(o.z * 0.9 + o.rattle) * 0.035; // rattles as it slides
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
}

function update(dt, t) {
  updateClouds(dt);
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
    step: (dt, t = performance.now() / 1000) => update(dt, t),
  };
}

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (!loopHeld) {
    update(dt, now / 1000);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

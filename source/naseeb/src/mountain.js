// The mountain Naseeb drives up, and the road on it.
//
// The mountain: a steep face, about 38°, rising some 150 m out of a valley to a broad top, ribbed
// with spurs and gullies running up it, roughened at every scale. North (up the mountain) is -z.
//
// The road is laid the way a road builder lays one on a mountainside. Each leg follows the slope
// at a steady climb (10 to 14%), so it bends in round every gully and out round every spur, as
// tight as it has to to hug the mountain, and at the end of a leg it turns back on itself in a
// hairpin and climbs on. Some hairpins are so
// tight that a jeep can't get round in one go and has to back up. The road's height is the
// mountain's along its line, smoothed and kept within 20%; where the mountain is steeper, as it is
// at every hairpin, the mountain is shaped to the road: the road is cut into it, a steep wall a
// metre or three high rising from its inner edge and a steep drop falling from its outer edge,
// then the mountain's own slope beyond, and between two legs the mountain runs smoothly from one to
// the other; further out it eases back into the mountain as it was. The road itself is packed dirt, about 3.2 m wide, wider round the
// hairpins, tilted a little toward the mountain, worn into two ruts, and rough: potholes, humps
// where water has been led across it, stones, fallen logs and branches, narrow places, and
// stretches worn into deep ruts by the jeeps before.
//
// Around it: pines and boulders everywhere but on the road, its cuts and its banks. Nothing marks
// the edge: past it, the mountain just falls away.
//
// The ground's shape is worked out once, on a half-metre grid round the road (the mountain, then
// the road's cuts and banks pressed into it), and read back between the grid points. The road's own
// surface, boulders, and trees (as trunks to hit) are worked out exactly where they're asked for.
import { surfaceById } from "./ground.js";

const STEP = 0.5; // metres between the road's points
const HALF = 1.5; // half the road's width on the legs
const CUT = 2.2; // how steep a cut rises from the road's edge (about 65°)
const FILL = 1.5; // and how steep a drop falls (about 56°)
const ROUND_CUT = 0.3; // the foot of a cut curves up into it over this far, m (just its crease)
const ROUND_FILL = 0.25; // and a drop's lip rounds over this far
const BENCH = 0.35; // how far the road's middle is cut in below the mountain's shape
const REACH = 16; // how far from the road its cuts and banks can reach
const CELL = 0.5; // the ground's grid
const MAX_GRADE = 0.23;
const HAIRPIN_GRADE = 0.14;

const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const smoothIntegral = (t) => (t <= 0 ? 0 : t >= 1 ? t - 0.5 : t * t * t - (t * t * t * t) / 2);
const bump = (r) => (r >= 1 ? 0 : 0.5 + 0.5 * Math.cos(Math.PI * r));

// Lengths, quicker than Math.hypot.
const hyp = (a, b) => Math.sqrt(a * a + b * b);
const hyp3 = (a, b, c) => Math.sqrt(a * a + b * b + c * c);
const lenOf = (v) => {
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  return Math.sqrt(s);
};

// Value noise: smooth, from -1 to 1, about one feature per unit.
function hash(ix, iz) {
  let h = (Math.imul(ix, 374761393) + Math.imul(iz, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function noise(x, z) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx);
  const sz = fz * fz * (3 - 2 * fz);
  const a = hash(ix, iz);
  const b = hash(ix + 1, iz);
  const c = hash(ix, iz + 1);
  const d = hash(ix + 1, iz + 1);
  return (a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz) * 2 - 1;
}
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

// ---------- The mountain ----------

// Shoulders where the hairpins are: the mountain eases to a gentle bench round each one, as road
// builders choose them (filled in once the road is laid).
const benches = [];

// Its big shape, which the road follows: the valley floor, then the face, rounding over to the
// top, and falling away beyond; narrowing to either side; ribbed with spurs and gullies; and the
// hairpins' shoulders.
function shape(x, z) {
  let h = wildShape(x, z);
  for (const b of benches) {
    const dx = x - b.x;
    const dz = z - b.z;
    const r = hyp(dx, dz);
    if (r >= b.reach) continue;
    const w = 1 - smooth((r - b.flat) / (b.reach - b.flat));
    h += (b.h + 0.28 * (dx * b.ux + dz * b.uz) - h) * w;
  }
  return h;
}
function wildShape(x, z) {
  const n = -z; // north of the mountain's foot
  let h = 0.73 * 45 * smoothIntegral((n + 15) / 45) - 0.72 * 55 * smoothIntegral((n - 175) / 55) - 0.6 * 60 * smoothIntegral((n - 300) / 60);
  h *= 1 - 0.65 * smooth((Math.abs(x) - 100) / 140);
  h += 0.05 * n; // the valley falls gently to the south
  const ribs = 7 * Math.sin((2 * Math.PI * (x + 14 * Math.sin(n / 41))) / 72) * smooth((n - 5) / 35) * (1 - smooth((n - 190) / 40));
  return h + ribs + 6 * noise(x / 80 + 11.3, n / 80 + 4.1) + 3 * noise(x / 35 + 7.7, n / 35 + 3.2);
}
// And its roughness, a metre and less.
const rough = (x, z) => 0.9 * noise(x / 11, z / 11) + 0.35 * noise(x / 4.3 + 5.1, z / 4.3 + 1.7) + 0.12 * noise(x / 1.7 + 2.3, z / 1.7 + 9.1);
const natural = (x, z) => shape(x, z) + rough(x, z);
// Which way is uphill, and how steep: the big shape's slope.
function uphill(x, z) {
  const e = 1;
  const gx = (shape(x + e, z) - shape(x - e, z)) / (2 * e);
  const gz = (shape(x, z + e) - shape(x, z - e)) / (2 * e);
  return [gx, gz];
}

// ---------- The road ----------

// Each leg: the way it heads (-1 west, 1 east), where it turns back, its climb; then the hairpin's
// radius at its end (centre line; 3 m is too tight to get round in one go).
const LEGS = [
  { way: -1, turnAt: -58, grade: 0.1, hairpin: 3.0 },
  { way: 1, turnAt: 56, grade: 0.12, hairpin: 5.9 },
  { way: -1, turnAt: -64, grade: 0.13, hairpin: 3.0 },
  { way: 1, turnAt: 60, grade: 0.11, hairpin: 6.0 },
  { way: -1, turnAt: -56, grade: 0.14, hairpin: 3.2 },
  { way: 1, turnAt: 52, grade: 0.12, hairpin: 6.1 },
  { way: -1, turnAt: -60, grade: 0.13, hairpin: 3.0 },
  { way: 1, turnAt: 54, grade: 0.12, hairpin: 5.2 },
  { way: -1, turnAt: -40, grade: 0.11, hairpin: 0 },
];
const MIN_BEND = 7; // the tightest a leg bends, m
const TOP = 150; // where the road gives out onto the top

const rotate = ([x, z], a) => [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)];
const cross2 = (a, b) => a[0] * b[1] - a[1] * b[0];
const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];

// The way a leg wants to head from p: along the mountain, `way` (-1 west, 1 east), climbing at
// `grade` (or straight on where the mountain is gentler than that).
function legWay(p, way, grade) {
  const g = uphill(p[0], p[1]);
  const steep = hyp(g[0], g[1]);
  if (steep <= grade) return [way, 0];
  const up = [g[0] / steep, g[1] / steep];
  let along = [-up[1], up[0]];
  if (along[0] * way < 0) along = [-along[0], -along[1]];
  const s = grade / steep;
  const c = Math.sqrt(1 - s * s);
  return [along[0] * c + up[0] * s, along[1] * c + up[1] * s];
}

function layRoad() {
  const xs = [];
  const zs = [];
  const halves = [];
  const hairpins = [];
  let p = [0, 38];
  let h = [0, -1]; // heading north, up the valley
  const put = (half) => {
    xs.push(p[0]);
    zs.push(p[1]);
    halves.push(half);
  };
  const forward = (half = HALF) => {
    p = [p[0] + h[0] * STEP, p[1] + h[1] * STEP];
    put(half);
  };
  put(HALF);
  // Up the valley until the mountain steepens.
  for (let i = 0; i < 400; i++) {
    const g = uphill(p[0], p[1]);
    if (hyp(g[0], g[1]) > 0.42) break;
    forward();
  }
  for (const [n, leg] of LEGS.entries()) {
    // Along the mountain at the leg's climb, bending as the slope does, until it turns back or
    // reaches the top.
    let top = false;
    for (let guard = 0; guard < 2000; guard++) {
      if (leg.way * (leg.turnAt - p[0]) <= 0) break;
      if ((top = shape(p[0], p[1]) > TOP)) break;
      const want = legWay(p, leg.way, leg.grade);
      const turn = Math.max(-STEP / MIN_BEND, Math.min(STEP / MIN_BEND, Math.atan2(cross2(h, want), dot2(h, want))));
      h = rotate(h, turn);
      forward();
    }
    if (top || !leg.hairpin) break;
    // The hairpin: round toward uphill until heading the way the next leg goes.
    const way = Math.sign(cross2(h, uphill(p[0], p[1]))) || 1;
    const next = LEGS[n + 1];
    const wide = leg.hairpin < 4 ? 2.2 : 2.05;
    const turn = STEP / leg.hairpin;
    hairpins.push({ at: xs.length, radius: leg.hairpin, tight: leg.hairpin < 4 });
    for (let turned = 0; turned < Math.PI * 1.2; turned += turn) {
      const want = legWay(p, next.way, next.grade);
      const off = Math.atan2(cross2(h, want), dot2(h, want));
      if (turned > Math.PI / 2 && Math.abs(off) < turn) {
        h = rotate(h, off);
        break;
      }
      h = rotate(h, way * turn);
      forward(wide);
    }
    for (let i = 0; i < 4; i++) forward(wide);
  }
  // Out onto the top: a little way on, ending in a flat place to turn round.
  for (let i = 0; i < 30; i++) forward();
  const n = xs.length;
  // The width eases in and out round each hairpin, over 6 m either side.
  const half = Float32Array.from(halves);
  for (const pin of hairpins) {
    const end = pin.at + Math.round((Math.PI * pin.radius) / STEP) + 4;
    for (let i = Math.max(0, pin.at - 12); i < Math.min(n, end + 12); i++) {
      const into = i < pin.at ? 1 - (pin.at - i) / 12 : i > end ? 1 - (i - end) / 12 : 1;
      half[i] = Math.max(half[i], HALF + (halves[pin.at] - HALF) * smooth(into));
    }
  }
  for (let i = n - 14; i < n; i++) half[i] = HALF + (7 - HALF) * smooth((i - (n - 14)) / 13);
  return { x: Float32Array.from(xs), z: Float32Array.from(zs), half, hairpins };
}

// Its height: the mountain's along its line, smoothed, kept from climbing more than 20% (12% round
// the hairpins, cut in as benches, as road builders do) or ever going down; split between climbing
// early and climbing late, so where the mountain is too steep the road is built up before and cut
// in after.
function profile(road) {
  const n = road.x.length;
  const ground = new Float64Array(n);
  for (let i = 0; i < n; i++) ground[i] = shape(road.x[i], road.z[i]);
  const average = (a, span) => {
    const out = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      let k = 0;
      for (let j = Math.max(0, i - span); j <= Math.min(n - 1, i + span); j++) {
        s += a[j];
        k++;
      }
      out[i] = s / k;
    }
    return out;
  };
  const target = average(ground, 18).map((h) => h - BENCH);
  const most = new Float64Array(n).fill(MAX_GRADE * STEP);
  for (const pin of road.hairpins) {
    const end = pin.at + Math.round((Math.PI * pin.radius) / STEP);
    for (let i = Math.max(0, pin.at - 4); i < Math.min(n, end + 4); i++) most[i] = HAIRPIN_GRADE * STEP;
  }
  const late = new Float64Array(n);
  late[0] = target[0];
  for (let i = 1; i < n; i++) late[i] = Math.min(late[i - 1] + most[i], Math.max(late[i - 1], target[i]));
  const early = new Float64Array(n);
  early[n - 1] = late[n - 1];
  for (let i = n - 2; i >= 0; i--) early[i] = Math.max(early[i + 1] - most[i + 1], Math.min(early[i + 1], target[i]));
  const mid = new Float64Array(n);
  for (let i = 0; i < n; i++) mid[i] = (late[i] + early[i]) / 2;
  const e = average(mid, 6);
  // The flat place at the top.
  for (let i = n - 14; i < n; i++) e[i] = e[n - 14];
  return Float32Array.from(e);
}

const road = layRoad();
// A shoulder at each hairpin: round the middle of its turn, its own height there, rising gently
// uphill.
for (const pin of road.hairpins) {
  const end = pin.at + Math.round((Math.PI * pin.radius) / STEP);
  const x = (road.x[pin.at] + road.x[end]) / 2;
  const z = (road.z[pin.at] + road.z[end]) / 2;
  const g = uphill(x, z);
  const steep = hyp(g[0], g[1]) || 1;
  benches.push({ x, z, h: wildShape(x, z), ux: g[0] / steep, uz: g[1] / steep, flat: pin.radius + 4, reach: pin.radius + 16 });
}
road.e = profile(road);
road.count = road.x.length;
road.length = (road.count - 1) * STEP;
// Each point's way along the road, and which side the mountain is on (+1: to the right of the
// way it climbs, as a driver going up sees it).
road.hx = new Float32Array(road.count);
road.hz = new Float32Array(road.count);
road.upSide = new Int8Array(road.count);
road.bend = new Float32Array(road.count); // radius of its bend there, m
road.tilt = new Float32Array(road.count); // how much the mountain is to its right (1) or left (-1)
for (let i = 0; i < road.count; i++) {
  const a = Math.max(0, i - 1);
  const b = Math.min(road.count - 1, i + 1);
  const dx = road.x[b] - road.x[a];
  const dz = road.z[b] - road.z[a];
  const l = hyp(dx, dz);
  road.hx[i] = dx / l;
  road.hz[i] = dz / l;
}
for (let i = 0; i < road.count; i++) {
  const g = uphill(road.x[i], road.z[i]);
  // Right of the way it heads: (-hz, hx).
  const across = (-road.hz[i] * g[0] + road.hx[i] * g[1]) / Math.max(1e-6, hyp(g[0], g[1]));
  road.upSide[i] = across > 0 ? 1 : -1;
  road.tilt[i] = across;
  const a = Math.max(0, i - 4);
  const b = Math.min(road.count - 1, i + 4);
  const turn = Math.abs(Math.atan2(cross2([road.hx[a], road.hz[a]], [road.hx[b], road.hz[b]]), dot2([road.hx[a], road.hz[a]], [road.hx[b], road.hz[b]])));
  road.bend[i] = turn > 1e-4 ? ((b - a) * STEP) / turn : 1e4;
}

// What makes the road rough, laid along it once: potholes, humps across it where water is led off,
// stretches rutted deep by the jeeps before (dry now, packed dirt like the rest), and places where
// it narrows.
const roll = rng(4242);
const potholes = [];
const humps = [];
const rutted = [];
// The hairpins and just round them stay clear of all this.
const nearPin = (i) => road.hairpins.some((pin) => i > pin.at - 40 && i < pin.at + Math.round((Math.PI * pin.radius) / STEP) + 40);
for (let s = 10; s < road.length - 20; s += 5 + roll() * 9) {
  const i = Math.round(s / STEP);
  const half = road.half[i];
  potholes.push({ s, lateral: (roll() * 2 - 1) * (half - 0.3), r: 0.3 + roll() * 0.45, depth: 0.06 + roll() * 0.11 });
}
for (let s = 40; s < road.length - 30; s += 45 + roll() * 50) {
  if (nearPin(Math.round(s / STEP))) continue;
  humps.push({ s, height: 0.12 + roll() * 0.08, long: 0.7 + roll() * 0.5, skew: (roll() * 2 - 1) * 0.35 });
}
// Places along the road for `count` things `length` long, clear of the hairpins, at least `gap`
// apart (m).
function spots(count, length, gap) {
  const found = [];
  for (let s = 40 + roll() * 20; s < road.length - 40 - length && found.length < count; s += 6) {
    if (found.length && s - found[found.length - 1] < gap) continue;
    let clear = true;
    for (let t = s; t <= s + length; t += 2) if (nearPin(Math.round(t / STEP))) clear = false;
    if (clear && roll() < 0.35) found.push(s);
  }
  return found;
}
for (const s of spots(3, 40, 160)) rutted.push({ from: s, to: s + 26 + roll() * 14 });
// Its width wanders a little along the legs, opens out where the mountain is gentle (the valley
// floor, the top), and widens into passing places, where one jeep can pull over for another.
for (let i = 0; i < road.count; i++) {
  if (nearPin(i)) continue;
  const g = uphill(road.x[i], road.z[i]);
  const gentle = 1 - smooth((hyp(g[0], g[1]) - 0.2) / 0.35);
  road.half[i] = Math.max(road.half[i], HALF + 0.22 * noise((i * STEP) / 37 + 4.4, 1.9) + 0.75 * gentle);
}
for (const at of spots(5, 20, 90)) {
  const from = Math.round(at / STEP);
  const to = from + Math.round((8 + roll() * 6) / STEP);
  for (let i = from - 8; i <= to + 8; i++) {
    const into = Math.min(1, (i - (from - 8)) / 8, ((to + 8) - i) / 8);
    road.half[i] = Math.max(road.half[i], HALF + (2.6 - HALF) * smooth(into));
  }
}
// Narrow places: stretches where the mountain squeezes the road to 2.6 m.
for (const at of spots(4, 35, 120)) {
  const from = Math.round(at / STEP);
  const to = from + Math.round((20 + roll() * 15) / STEP);
  for (let i = from - 10; i <= to + 10; i++) {
    const into = Math.min(1, (i - (from - 10)) / 10, ((to + 10) - i) / 10);
    road.half[i] = Math.min(road.half[i], HALF - (HALF - 1.3) * smooth(into));
  }
}
const deepRuts = (s) => rutted.find((m) => s > m.from - 3 && s < m.to + 3);
// Each metre of road keeps the potholes and humps near it.
const roughNear = [];
for (const p of potholes) for (let m = Math.floor(p.s - p.r - 1); m <= Math.ceil(p.s + p.r + 1); m++) (roughNear[m] = roughNear[m] || []).push(p);
for (const h of humps) for (let m = Math.floor(h.s - h.long - 2); m <= Math.ceil(h.s + h.long + 2); m++) (roughNear[m] = roughNear[m] || []).push(h);

// The road's surface at road point i (fractional) and `lateral` metres right of its middle: tilted
// toward the mountain, two ruts worn where wheels run (but not round the hairpins, where every
// driver takes a different line; deep where they've been churned), and rough: undulating,
// potholed, humped.
function roadSurface(i, lateral) {
  const k = Math.max(0, Math.min(road.count - 1.001, i));
  const j = Math.floor(k);
  const f = k - j;
  const e = road.e[j] + (road.e[j + 1] - road.e[j]) * f;
  const s = k * STEP;
  // Tilted toward the mountain as much as the mountain is to one side: level at a hairpin's
  // apex, where it's straight ahead.
  const side = road.tilt[j] + (road.tilt[j + 1] - road.tilt[j]) * f;
  const straight = smooth((road.bend[j] - 8) / 20);
  const deep = deepRuts(s);
  const rutDepth = deep ? 0.11 * smooth(Math.min(s - deep.from + 3, deep.to + 3 - s) / 4) : straight * 0.035;
  const ruts = rutDepth * (bump(Math.abs(lateral - 0.72) / 0.26) + bump(Math.abs(lateral + 0.72) / 0.26));
  let h = e - 0.03 * lateral * side - ruts;
  h += 0.07 * noise(s / 3.4, lateral / 2.5 + 40) + 0.035 * noise(s / 1.2 + 9, lateral / 1.2 + 20) + 0.012 * noise(s / 0.37 + 5, lateral / 0.37 + 60);
  for (const f of roughNear[Math.floor(s)] || NO_ROUGH) {
    if (f.depth) h -= f.depth * bump(hyp(s - f.s, lateral - f.lateral) / f.r);
    else h += f.height * bump(Math.abs(s - f.s - lateral * f.skew) / f.long);
  }
  return h;
}
const NO_ROUGH = [];

// ---------- The ground's grid ----------

let minX = Infinity;
let maxX = -Infinity;
let minZ = Infinity;
let maxZ = -Infinity;
for (let i = 0; i < road.count; i++) {
  minX = Math.min(minX, road.x[i]);
  maxX = Math.max(maxX, road.x[i]);
  minZ = Math.min(minZ, road.z[i]);
  maxZ = Math.max(maxZ, road.z[i]);
}
const MARGIN = 70;
const X0 = Math.floor((minX - MARGIN) / 32) * 32;
const Z0 = Math.floor((minZ - MARGIN) / 32) * 32;
const NX = Math.ceil((maxX + MARGIN - X0) / 32) * 64 + 1;
const NZ = Math.ceil((maxZ + MARGIN - Z0) / 32) * 64 + 1;
const heights = new Float32Array(NX * NZ);
const wild = new Float32Array(NX * NZ); // the mountain as it was
const nearest = new Int32Array(NX * NZ).fill(-1); // the road point nearest, on and just off the road
const nearDist = new Float32Array(NX * NZ).fill(1e9);
const kinds = new Uint8Array(NX * NZ);
export const GROUND = { GRASS: 0, ROCK: 1, ROAD: 2, LOOSE: 3, FOREST: 4 };

// How far a cut has risen, or a bank fallen, `off` metres out from the road's edge, at `grade`:
// starting level with the road and curving into its slope over `round`.
const rounded = (off, grade, round) => (off < round ? (grade * off * off) / (2 * round) : grade * (off - round / 2));

{
  const hi = new Float32Array(NX * NZ).fill(Infinity);
  const lo = new Float32Array(NX * NZ).fill(-Infinity);
  // The nearest road point to each grid point within REACH: how far, how high the road is
  // there, and how much that side is the mountain's (1 uphill, -1 the drop).
  const away = new Float32Array(NX * NZ).fill(Infinity);
  const roadE = new Float32Array(NX * NZ);
  const cliff = new Float32Array(NX * NZ); // how steep the mountain is there, 0 gentle to 1 steep
  const upness = new Float32Array(NX * NZ);
  // The mountain as each nearby road point would have it (rising from its edge on the uphill
  // side, falling on the other, at the mountain's slope across the road there), weighted toward
  // the nearest.
  const loft = new Float64Array(NX * NZ);
  const weight = new Float64Array(NX * NZ);
  const slopeOf = new Float32Array(road.count);
  const cliffOf = new Float32Array(road.count);
  const wallOf = new Float32Array(road.count);
  const dropOf = new Float32Array(road.count);
  for (let i = 0; i < road.count; i++) {
    const g = uphill(road.x[i], road.z[i]);
    slopeOf[i] = Math.min(1, hyp(g[0], g[1]));
    // How high the cut wall stands and how far the drop falls, varying along the road.
    // As tall as the mountain's steepness calls for: on gentle ground, none.
    cliffOf[i] = smooth((slopeOf[i] - 0.25) / 0.45);
    wallOf[i] = Math.max(0.05, (1.1 + 2.4 * (0.5 + 0.5 * noise(i * STEP / 23 + 3.3, 7.7))) * cliffOf[i]);
    dropOf[i] = Math.max(0.05, (1.4 + 2.6 * (0.5 + 0.5 * noise(i * STEP / 19 + 8.1, 2.2))) * cliffOf[i]);
  }
  // The mountain beside a road point, `out` metres past its edge: up a steep wall then the slope,
  // or down a steep drop then the slope.
  // Its crest is rounded a little where the wall or drop meets the slope.
  const beside = (i, out, up) => {
    const tall = up ? wallOf[i] : dropOf[i];
    const steep = up ? CUT : FILL;
    const slope = slopeOf[i];
    const round = up ? ROUND_CUT : ROUND_FILL;
    const crest = Math.max(0.02, Math.min(0.8, (tall / steep) * 0.8));
    const a = tall / steep - crest / 2;
    let rise;
    if (out < a) rise = rounded(out, steep, round);
    else if (out < a + crest) {
      const u = out - a;
      rise = rounded(a, steep, round) + steep * u - ((steep - slope) * u * u) / (2 * crest);
    } else rise = rounded(a, steep, round) + steep * crest - ((steep - slope) * crest) / 2 + slope * (out - a - crest);
    return up ? rise : -rise;
  };
  // Each road point presses its cut and bank into the mountain round it.
  const span = Math.ceil(REACH / CELL);
  for (let i = 0; i < road.count; i++) {
    const cx = Math.round((road.x[i] - X0) / CELL);
    const cz = Math.round((road.z[i] - Z0) / CELL);
    const e = road.e[i];
    const w = road.half[i];
    for (let r = Math.max(0, cz - span); r <= Math.min(NZ - 1, cz + span); r++) {
      const dz = Z0 + r * CELL - road.z[i];
      for (let c = Math.max(0, cx - span); c <= Math.min(NX - 1, cx + span); c++) {
        const dx = X0 + c * CELL - road.x[i];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > REACH) continue;
        const k = r * NX + c;
        const off = Math.max(0, dist - w);
        const up = e + rounded(off, CUT, ROUND_CUT);
        const down = e - rounded(off, FILL, ROUND_FILL);
        if (up < hi[k]) hi[k] = up;
        if (down > lo[k]) lo[k] = down;
        {
          const right = -dx * road.hz[i] + dz * road.hx[i];
          const out = Math.max(0, Math.abs(right) - w);
          // Which way this side goes: up where the mountain is on this side, down where it falls;
          // round a hairpin's apex, wherever the mountain itself is higher or lower.
          const side = Math.sign(right) * road.tilt[i];
          const up = Math.abs(road.tilt[i]) > 0.45 ? side > 0 : shape(X0 + c * CELL, Z0 + r * CELL) > e;
          const plane = e + beside(i, out, up);
          const wt = 1 / (dist + 0.5) ** 4;
          loft[k] += plane * wt;
          weight[k] += wt;
        }
        if (dist - w < away[k]) {
          away[k] = dist - w;
          roadE[k] = e;
          cliff[k] = cliffOf[i];
          const right = -dx * road.hz[i] + dz * road.hx[i]; // + to the right of the road
          upness[k] = Math.sign(right) * road.tilt[i];
        }
        if (dist < w + 1.5 && dist < nearDist[k]) {
          nearDist[k] = dist;
          nearest[k] = i;
        }
      }
    }
  }
  for (let r = 0; r < NZ; r++) {
    for (let c = 0; c < NX; c++) {
      const k = r * NX + c;
      const x = X0 + c * CELL;
      const z = Z0 + r * CELL;
      // The ground graded smooth beside the road: its lumps flattened near it; and the mountain
      // shaped to the road.
      const graded = 0.2 + 0.8 * smooth((away[k] - 2) / 10);
      let big = shape(x, z);
      if (weight[k] > 0) big += (loft[k] / weight[k] - big) * (1 - smooth((away[k] - 5) / 11));
      const n = big + rough(x, z) * graded;
      wild[k] = n; // what it would be without the road, for telling cuts and banks
      let h = Math.min(n, hi[k]);
      if (lo[k] > h) h = lo[k];
      // On the mountain's side, never lower than the road: the mountain rises from its edge.
      // (As steep as the cut is there: on gentle ground, just never below the road.)
      if (upness[k] > 0.45 && away[k] < 3) h = Math.max(h, roadE[k] + 0.9 * rounded(Math.max(0, away[k]), CUT * cliff[k], ROUND_CUT));
      // On the drop side, the edge falls away at once, never a lip.
      if (upness[k] < -0.45 && away[k] < 2.5) h = Math.min(h, roadE[k] - 0.9 * rounded(Math.max(0, away[k]), FILL * cliff[k], ROUND_FILL));
      heights[k] = h;
    }
  }
  // Point-sampled on the grid, a steep cut's crest comes out stepped wherever it crosses the grid
  // at an angle. A light smoothing away from the road takes the steps out; the road's edges and
  // the cut's face stay as they are.
  for (let pass = 0; pass < 2; pass++) {
    const was = heights.slice();
    for (let r = 1; r < NZ - 1; r++) {
      for (let c = 1; c < NX - 1; c++) {
        const k = r * NX + c;
        if (away[k] < 0.6) continue;
        const sides = was[k - 1] + was[k + 1] + was[k - NX] + was[k + NX];
        const corners = was[k - NX - 1] + was[k - NX + 1] + was[k + NX - 1] + was[k + NX + 1];
        heights[k] = (4 * was[k] + 2 * sides + corners) / 16;
      }
    }
  }
  // On the road, its own surface; and what the ground is everywhere.
  for (let r = 0; r < NZ; r++) {
    for (let c = 0; c < NX; c++) {
      const k = r * NX + c;
      const x = X0 + c * CELL;
      const z = Z0 + r * CELL;
      const at = onRoad(x, z, nearest[k]);
      if (at) {
        heights[k] = roadSurface(at.i, at.lateral);
        kinds[k] = GROUND.ROAD;
      } else if (Math.abs(heights[k] - wild[k]) > 0.12) kinds[k] = GROUND.LOOSE;
    }
  }
  for (let r = 1; r < NZ - 1; r++) {
    for (let c = 1; c < NX - 1; c++) {
      const k = r * NX + c;
      if (kinds[k]) continue;
      const sx = (heights[k + 1] - heights[k - 1]) / (2 * CELL);
      const sz = (heights[k + NX] - heights[k - NX]) / (2 * CELL);
      const steep = hyp(sx, sz);
      const x = X0 + c * CELL;
      const z = Z0 + r * CELL;
      if (steep > 1.05 + 0.15 * noise(x / 6, z / 6)) kinds[k] = GROUND.ROCK;
      else if (noise(x / 23 + 3, z / 23 + 8) > -0.1) kinds[k] = GROUND.FOREST;
    }
  }
}

// Where a point is on the road, by the road point nearest it (from the grid): how far along
// (fractional point), and how far right of the middle; or null, off it.
function onRoad(x, z, near) {
  if (near < 0) return null;
  let best = null;
  for (let i = Math.max(0, near - 2); i < Math.min(road.count - 1, near + 2); i++) {
    const ax = road.x[i];
    const az = road.z[i];
    const bx = road.x[i + 1] - ax;
    const bz = road.z[i + 1] - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * bx + (z - az) * bz) / (bx * bx + bz * bz)));
    const px = x - ax - bx * t;
    const pz = z - az - bz * t;
    const d = hyp(px, pz);
    if (!best || d < best.d) best = { d, i: i + t, lateral: (px * -bz + pz * bx) / hyp(bx, bz) };
  }
  const half = road.half[Math.round(best.i)];
  return best.d <= half ? best : null;
}

// ---------- Boulders and trees ----------

// Boulders: each the top of an ellipsoid, set into the ground at its middle, turned.
const BOULDER_CELL = 8;
const boulders = [];
const trees = [];
{
  const rand = rng(1970);
  const at = (x, z) => {
    const c = Math.round((x - X0) / CELL);
    const r = Math.round((z - Z0) / CELL);
    return c < 0 || r < 0 || c >= NX || r >= NZ ? -1 : r * NX + c;
  };
  // How near the road (or its cuts and banks) a point is, in grid cells, up to `within`.
  const clearOf = (x, z, within) => {
    const c0 = Math.round((x - X0) / CELL);
    const r0 = Math.round((z - Z0) / CELL);
    for (let r = r0 - within; r <= r0 + within; r++) {
      for (let c = c0 - within; c <= c0 + within; c++) {
        if (c < 0 || r < 0 || c >= NX || r >= NZ) continue;
        const kind = kinds[r * NX + c];
        if (kind === GROUND.ROAD || kind === GROUND.LOOSE) return false;
      }
    }
    return true;
  };
  for (let z = Z0 + 4; z < Z0 + (NZ - 1) * CELL - 4; z += 7) {
    for (let x = X0 + 4; x < X0 + (NX - 1) * CELL - 4; x += 7) {
      const bx = x + (rand() - 0.5) * 6;
      const bz = z + (rand() - 0.5) * 6;
      const k = at(bx, bz);
      if (k < 0) continue;
      const rocky = kinds[k] === GROUND.ROCK;
      if (rand() > (rocky ? 0.75 : 0.22)) continue;
      const r = 0.35 + Math.pow(rand(), 2.2) * 1.6;
      if (!clearOf(bx, bz, Math.ceil((r + 0.6) / CELL))) continue;
      boulders.push({ x: bx, z: bz, rx: r, rz: r * (0.7 + rand() * 0.6), h: r * (0.45 + rand() * 0.4), turn: rand() * Math.PI });
    }
  }
  // Stones on the road itself, to crawl over or round: one every so often, and here and there a
  // cluster of them.
  const stoneAt = (i, lateral, r) => boulders.push({ x: road.x[i] - road.hz[i] * lateral, z: road.z[i] + road.hx[i] * lateral, rx: r, rz: r * (0.75 + rand() * 0.5), h: r * (0.55 + rand() * 0.3), turn: rand() * Math.PI });
  for (let i = 30; i < road.count - 40; i += 16 + Math.floor(rand() * 34)) {
    const half = road.half[i];
    stoneAt(i, (rand() * 2 - 1) * (half - 0.25), 0.14 + Math.pow(rand(), 1.5) * 0.24);
    if (rand() < 0.22) for (let k = 0; k < 3 + rand() * 4; k++) stoneAt(Math.min(road.count - 1, i + Math.floor(rand() * 8)), (rand() * 2 - 1) * (half - 0.2), 0.1 + rand() * 0.22);
  }
  for (const b of boulders) {
    const k = at(b.x, b.z);
    b.base = (k >= 0 ? heights[k] : natural(b.x, b.z)) - 0.2 * b.h;
    b.cos = Math.cos(b.turn);
    b.sin = Math.sin(b.turn);
  }
  // Trees: pines, thick in the forest, thinner on open grass, none on rock, the road, its cuts
  // and banks, or right beside it.
  for (let z = Z0 + 2; z < Z0 + (NZ - 1) * CELL - 2; z += 3.6) {
    for (let x = X0 + 2; x < X0 + (NX - 1) * CELL - 2; x += 3.6) {
      const tx = x + (rand() - 0.5) * 3.2;
      const tz = z + (rand() - 0.5) * 3.2;
      const k = at(tx, tz);
      if (k < 0) continue;
      const kind = kinds[k];
      if (kind === GROUND.ROCK || kind === GROUND.ROAD || kind === GROUND.LOOSE) continue;
      if (rand() > (kind === GROUND.FOREST ? 0.62 : 0.1)) continue;
      if (!clearOf(tx, tz, 5)) continue;
      const tall = 7 + rand() * 13;
      trees.push({ x: tx, z: tz, r: 0.12 + tall * 0.016, height: tall, base: heights[k], shade: rand() });
    }
  }
  // Rocks along the road's sides, off its edge: fallen from the cut above and lying at its foot,
  // or kicked to the verge on the drop side; a few bigger ones further out. Not round the
  // hairpins, where the verge is room to back up into. (A rand of their own, so nothing above
  // moves.)
  const verge = rng(2468);
  const offRoad = (x, z, within) => {
    const c0 = Math.round((x - X0) / CELL);
    const r0 = Math.round((z - Z0) / CELL);
    for (let r = r0 - within; r <= r0 + within; r++) for (let c = c0 - within; c <= c0 + within; c++) if (c >= 0 && r >= 0 && c < NX && r < NZ && kinds[r * NX + c] === GROUND.ROAD) return false;
    return true;
  };
  for (let i = 20; i < road.count - 20; i += 3 + Math.floor(verge() * 6)) {
    if (nearPin(i)) continue;
    for (const side of [-1, 1]) {
      if (verge() < 0.2) continue;
      const r = 0.14 + Math.pow(verge(), 2) * 0.36;
      const lateral = side * (road.half[i] + 0.45 + r + Math.pow(verge(), 1.6) * 3.5);
      const x = road.x[i] - road.hz[i] * lateral;
      const z = road.z[i] + road.hx[i] * lateral;
      const k = at(x, z);
      if (k < 0 || onRoad(x, z, nearestAt(x, z)) || !offRoad(x, z, Math.ceil(r / CELL))) continue;
      const h = r * (0.45 + verge() * 0.35);
      const turn = verge() * Math.PI;
      boulders.push({ x, z, rx: r, rz: r * (0.7 + verge() * 0.6), h, turn, base: heights[k] - 0.2 * h, cos: Math.cos(turn), sin: Math.sin(turn) });
    }
  }
}
// Fallen logs across the road, and branches on it: each lying on the road along a line (its ends
// at the road's height where they cross its edges), of radius r, half as long as `reach`.
const logs = [];
{
  const rand = rng(1971);
  const lay = (i, lateral, angle, reach, r, kind) => {
    const x = road.x[i] - road.hz[i] * lateral;
    const z = road.z[i] + road.hx[i] * lateral;
    // The way the log lies: across the road, turned by `angle`.
    const a = Math.atan2(road.hz[i], road.hx[i]) + Math.PI / 2 + angle;
    const ax = Math.cos(a);
    const az = Math.sin(a);
    const end = (t) => {
      const px = x + ax * t;
      const pz = z + az * t;
      const on = onRoad(px, pz, nearestAt(px, pz));
      return on ? roadSurface(on.i, on.lateral) : null;
    };
    // Its height along it, from where it's on the road at either end.
    let lo = null;
    let hi = null;
    for (let t = -Math.min(reach, 1.6); t <= 0; t += 0.1) if (lo === null) lo = end(t) !== null ? [t, end(t)] : null;
    for (let t = Math.min(reach, 1.6); t >= 0; t -= 0.1) if (hi === null) hi = end(t) !== null ? [t, end(t)] : null;
    if (!lo || !hi || hi[0] - lo[0] < 0.2) return;
    const grade = (hi[1] - lo[1]) / (hi[0] - lo[0]);
    logs.push({ x, z, ax, az, reach, r, kind, base: lo[1] - lo[0] * grade - 0.2 * r, grade, i, lateral, angle });
  };
  for (let s = 160; s < road.length - 40; s += 38 + rand() * 45) {
    const i = Math.round(s / STEP);
    if (nearPin(i)) continue;
    lay(i, (rand() * 2 - 1) * 0.4, (rand() * 2 - 1) * 0.55, 3 + rand() * 1.5, 0.1 + rand() * 0.08, "log");
  }
  // Stones in the wheel tracks either side of each log, left there by drivers as a step up onto
  // it: about half the log's height.
  for (const log of logs) {
    if (log.kind !== "log") continue;
    const i = log.i;
    const cos = Math.cos(log.angle);
    const tan = Math.tan(log.angle);
    for (const track of [-0.72, 0.72]) {
      // Where the log crosses this wheel track, along the road from its middle.
      const crosses = -(track - log.lateral) * tan;
      for (const side of [-1, 1]) {
        const h = log.r * (0.85 + rand() * 0.25);
        const along = crosses + side * (log.r / cos + h * 0.9);
        const x = road.x[i] + road.hx[i] * along - road.hz[i] * track;
        const z = road.z[i] + road.hz[i] * along + road.hx[i] * track;
        const on = onRoad(x, z, nearestAt(x, z));
        if (!on) continue;
        const turn = rand() * Math.PI;
        boulders.push({ x, z, rx: h * 1.7, rz: h * (1.3 + rand() * 0.4), h, turn, base: roadSurface(on.i, on.lateral) - 0.15 * h, cos: Math.cos(turn), sin: Math.sin(turn) });
      }
    }
  }
  for (let s = 20; s < road.length - 20; s += 10 + rand() * 22) {
    const i = Math.round(s / STEP);
    lay(i, (rand() * 2 - 1) * (road.half[i] - 0.4), rand() * Math.PI, 0.5 + rand() * 0.7, 0.03 + rand() * 0.035, "branch");
  }
}
function logTop(log, x, z) {
  const dx = x - log.x;
  const dz = z - log.z;
  const t = dx * log.ax + dz * log.az;
  if (t < -log.reach || t > log.reach) return -Infinity;
  const d = Math.abs(-dx * log.az + dz * log.ax);
  if (d >= log.r) return -Infinity;
  return log.base + log.grade * t + 0.8 * log.r + Math.sqrt(log.r * log.r - d * d);
}

// Each kept in the grid squares it reaches into, so a point need only look at a few.
function grid(list, reach) {
  const gx0 = Math.floor(X0 / BOULDER_CELL) - 2;
  const gz0 = Math.floor(Z0 / BOULDER_CELL) - 2;
  const nx = Math.ceil((NX * CELL) / BOULDER_CELL) + 5;
  const nz = Math.ceil((NZ * CELL) / BOULDER_CELL) + 5;
  const cells = new Array(nx * nz).fill(NONE);
  for (const item of list) {
    const r = reach(item);
    for (let gz = Math.floor((item.z - r) / BOULDER_CELL); gz <= Math.floor((item.z + r) / BOULDER_CELL); gz++) {
      for (let gx = Math.floor((item.x - r) / BOULDER_CELL); gx <= Math.floor((item.x + r) / BOULDER_CELL); gx++) {
        const c = gx - gx0;
        const k = gz - gz0;
        if (c < 0 || k < 0 || c >= nx || k >= nz) continue;
        const at = c * nz + k;
        if (cells[at] === NONE) cells[at] = [];
        cells[at].push(item);
      }
    }
  }
  return (x, z) => {
    const c = Math.floor(x / BOULDER_CELL) - gx0;
    const k = Math.floor(z / BOULDER_CELL) - gz0;
    return c < 0 || k < 0 || c >= nx || k >= nz ? NONE : cells[c * nz + k];
  };
}
const NONE = [];
const bouldersAt = grid(boulders, (b) => Math.max(b.rx, b.rz));
const logsAt = grid(logs, (l) => l.reach + l.r);
const treesAt = grid(trees, (t) => t.r + 2.5);

function boulderTop(b, x, z) {
  const dx = x - b.x;
  const dz = z - b.z;
  const u = (dx * b.cos + dz * b.sin) / b.rx;
  const v = (-dx * b.sin + dz * b.cos) / b.rz;
  const q = 1 - u * u - v * v;
  return q > 0 ? b.base + b.h * Math.sqrt(q) : -Infinity;
}

// ---------- The ground, asked ----------

// The grid's height between its points.
function between(x, z) {
  const fc = (x - X0) / CELL;
  const fr = (z - Z0) / CELL;
  const c = Math.floor(fc);
  const r = Math.floor(fr);
  if (c < 0 || r < 0 || c >= NX - 1 || r >= NZ - 1) return natural(x, z);
  const u = fc - c;
  const v = fr - r;
  const k = r * NX + c;
  const a = heights[k];
  const b = heights[k + 1];
  const d = heights[k + NX];
  const e = heights[k + NX + 1];
  return a + (b - a) * u + (d - a) * v + (a - b - d + e) * u * v;
}
function nearestAt(x, z) {
  const c = Math.round((x - X0) / CELL);
  const r = Math.round((z - Z0) / CELL);
  return c < 0 || r < 0 || c >= NX || r >= NZ ? -1 : nearest[r * NX + c];
}

const SURFACE = {
  [GROUND.GRASS]: surfaceById("grass"),
  [GROUND.FOREST]: surfaceById("grass"),
  [GROUND.ROCK]: surfaceById("rock"),
  [GROUND.ROAD]: surfaceById("dirt"),
  [GROUND.LOOSE]: surfaceById("loose"),
};
const WOOD = surfaceById("wood");

export const MOUNTAIN = {
  road,
  boulders,
  logs,
  trees,
  grid: { x0: X0, z0: Z0, nx: NX, nz: NZ, cell: CELL, heights, kinds },
  natural,
  roadSurface,
  height(x, z) {
    const at = onRoad(x, z, nearestAt(x, z));
    let h = at ? roadSurface(at.i, at.lateral) : between(x, z);
    for (const b of bouldersAt(x, z)) {
      const top = boulderTop(b, x, z);
      if (top > h) h = top;
    }
    for (const l of logsAt(x, z)) {
      const top = logTop(l, x, z);
      if (top > h) h = top;
    }
    return h;
  },
  surface(x, z) {
    const ground = between(x, z);
    for (const l of logsAt(x, z)) if (logTop(l, x, z) > ground) return WOOD;
    for (const b of bouldersAt(x, z)) if (boulderTop(b, x, z) > ground) return SURFACE[GROUND.ROCK];
    const c = Math.round((x - X0) / CELL);
    const r = Math.round((z - Z0) / CELL);
    if (c < 0 || r < 0 || c >= NX || r >= NZ) return SURFACE[GROUND.GRASS];
    return SURFACE[kinds[r * NX + c]];
  },
  // Tree trunks near a point, to hit.
  treesNear: treesAt,
  // Where on the road a point is, if it's on it: how far along (m) and right of the middle.
  onRoad(x, z) {
    const at = onRoad(x, z, nearestAt(x, z));
    return at && { along: at.i * STEP, lateral: at.lateral };
  },
  // A point on the road `along` metres up it: where, how high, and the way it climbs.
  roadAt(along) {
    const i = Math.max(0, Math.min(road.count - 1, Math.round(along / STEP)));
    return { x: road.x[i], z: road.z[i], e: road.e[i], heading: Math.atan2(-road.hx[i], -road.hz[i]) };
  },
  // The places worth jumping to: the bottom, before each hairpin, and the top.
  stops: [
    { name: "Bottom", along: 6 },
    ...road.hairpins.map((pin, i) => ({ name: `Hairpin ${i + 1}`, along: Math.max(6, pin.at * STEP - 22), tight: pin.tight })),
    { name: "Top", along: road.length - 12 },
  ],
};

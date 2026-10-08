// The ground Naseeb drives on: what it's made of, and its shape.
//
// A ground answers two questions about any point on it: how high it is there (metres above the
// level, y up), and what it's made of. Points are given in the world's x (+ to the right looking
// down the track) and z (the track runs away from the start down -z, so "along" it is -z).
//
// Two grounds:
// - STRIP_GROUND: the old flat test track, strips of different surfaces. The physics checks drive
//   on it, since its answers can be worked out by hand.
// - COURSE: the off-road test ground the game is played on, a run of obstacles like those proving
//   grounds build to test four-wheel drives: washboard, logs, an axle twister, rock steps, a hill
//   climb, a side slope, a V-ditch, a mud pit, a rock garden, a sand trap and whoops. Each starts
//   and ends level, so they can follow one another, and the run repeats.

// Pacejka's longitudinal "magic formula", D·sin(C·atan(B·slip)), with D the peak friction and C, B
// chosen so the curve peaks at slipAtPeak and has fallen to the sliding friction at 100% slip.
function slipCurve(peak, slide, slipAtPeak) {
  const ratio = Math.min(slide / peak, 0.98);
  let lo = 1;
  let hi = 2;
  let C = 1.5;
  let B = 1;
  for (let i = 0; i < 50; i++) {
    C = (lo + hi) / 2;
    B = Math.tan(Math.PI / (2 * C)) / slipAtPeak;
    if (Math.sin(C * Math.atan(B)) > ratio) lo = C;
    else hi = C;
  }
  return (slip) => peak * Math.sin(C * Math.atan(B * slip));
}

// Each surface: peak and sliding friction for rubber on it, the slip at which grip peaks (loose
// ground needs the tread to dig in further), how much more than usual the rubber's flexing costs
// (water to push aside, for one), how stiffly the ground itself gives under a tire (N/m;
// Infinity for hard ground), and how much a landing's bounce is damped.
export const SURFACES = [
  { id: "asphalt", name: "Dry asphalt", peak: 1.0, slide: 0.75, slipAtPeak: 0.12, hysteresis: 1, give: Infinity, damping: 0.14 },
  { id: "concrete", name: "Concrete", peak: 0.9, slide: 0.7, slipAtPeak: 0.1, hysteresis: 0.9, give: Infinity, damping: 0.14 },
  { id: "wet", name: "Wet asphalt", peak: 0.6, slide: 0.45, slipAtPeak: 0.09, hysteresis: 1.25, give: Infinity, damping: 0.2 },
  { id: "gravel", name: "Gravel", peak: 0.6, slide: 0.55, slipAtPeak: 0.3, hysteresis: 1, give: 600e3, damping: 0.45 },
  { id: "grass", name: "Grass", peak: 0.5, slide: 0.4, slipAtPeak: 0.2, hysteresis: 1, give: 400e3, damping: 0.6 },
  { id: "sand", name: "Sand", peak: 0.45, slide: 0.42, slipAtPeak: 0.35, hysteresis: 1, give: 60e3, damping: 1 },
  // Deep, wet mud: lugged tires bite into it (so grip peaks late), and sink a few centimetres.
  { id: "mud", name: "Mud", peak: 0.4, slide: 0.3, slipAtPeak: 0.25, hysteresis: 1, give: 120e3, damping: 1.1 },
  { id: "snow", name: "Packed snow", peak: 0.3, slide: 0.2, slipAtPeak: 0.12, hysteresis: 1, give: 90e3, damping: 0.9 },
  { id: "ice", name: "Ice", peak: 0.12, slide: 0.07, slipAtPeak: 0.06, hysteresis: 1, give: Infinity, damping: 0.14 },
  // The course's own: packed dirt, bare rock, and logs.
  { id: "dirt", name: "Packed dirt", peak: 0.75, slide: 0.6, slipAtPeak: 0.15, hysteresis: 1.05, give: 1.2e6, damping: 0.4 },
  { id: "rock", name: "Rock", peak: 0.85, slide: 0.7, slipAtPeak: 0.1, hysteresis: 1, give: Infinity, damping: 0.15 },
  { id: "wood", name: "Logs", peak: 0.65, slide: 0.5, slipAtPeak: 0.1, hysteresis: 1, give: Infinity, damping: 0.2 },
];
for (const s of SURFACES) s.grip = slipCurve(s.peak, s.slide, s.slipAtPeak);
const byId = (id) => SURFACES.find((s) => s.id === id);
export const surfaceById = byId;

// ---------- The flat test track ----------

// Strips, each STRIP metres long and TRACK_HALF either side of the middle, in this order, repeating
// both ways. Each strip has a surface on its left half and its right; mostly the same, except the
// last, where the left tires are on ice and the right on asphalt. Off the track to either side is
// grass.
export const STRIP = 8;
export const TRACK_HALF = 2.2;
export const STRIPS = [
  ...["asphalt", "concrete", "wet", "gravel", "grass", "sand", "mud", "snow", "ice"].map((id) => ({ name: byId(id).name, left: byId(id), right: byId(id) })),
  { name: "Ice | asphalt", left: byId("ice"), right: byId("asphalt") },
];
export const stripIndexAt = (along) => {
  const n = STRIPS.length;
  return ((Math.floor(along / STRIP) % n) + n) % n;
};
export const stripAt = (along) => STRIPS[stripIndexAt(along)];
// The surface at a point: `along` the track (metres from the start) and `across` it (+ is right).
export function surfaceAt(along, across) {
  if (Math.abs(across) > TRACK_HALF) return byId("grass");
  const strip = stripAt(along);
  return across < 0 ? strip.left : strip.right;
}
// Where a strip of the given kind starts, the one nearest `along`, keeping to the right of the
// start so the distances read positive.
export function stripNear(along, index) {
  const n = STRIPS.length;
  const here = Math.floor(along / STRIP);
  let best = null;
  for (let i = Math.max(0, here - n); i <= Math.max(0, here) + n; i++) {
    if ((((i % n) + n) % n) !== index) continue;
    if (best === null || Math.abs(i - here) < Math.abs(best - here)) best = i;
  }
  return best * STRIP;
}
export const STRIP_GROUND = {
  height: () => 0,
  surface: (x, z) => surfaceAt(-z, x),
};

// ---------- The off-road course ----------

// The course is shaped out to SHOULDER either side of the middle; beyond it the field is level.
// Its driving lane is TRACK_HALF either side; past that are grass verges and embankments.
export const SHOULDER = 6.5;
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
// A cosine bump: 1 at r = 0, falling smoothly to 0 at r = 1.
const bump = (r) => (r >= 1 ? 0 : 0.5 + 0.5 * Math.cos(Math.PI * r));
// The integral of smooth(), for ramps with rounded ends.
const smoothIntegral = (t) => (t <= 0 ? 0 : t >= 1 ? t - 0.5 : t * t * t - (t * t * t * t) / 2);
// 0 before a, rising evenly to 1 at b, its ends rounded over w (so the grade comes in gently).
const ramp = (u, a, b, w) => (w * (smoothIntegral((u - a + w / 2) / w) - smoothIntegral((u - b + w / 2) / w))) / (b - a);
// 1 out to `inner` from the middle, falling smoothly to 0 by `outer`.
const across = (x, inner, outer) => 1 - smooth((Math.abs(x) - inner) / (outer - inner));
// A step up of 1 at u = 0: steep (about 75° at its steepest), its edges rounded over a few cm.
const step = (u) => smooth((u + 0.05) / 0.1);

// A pseudo-random sequence, the same every time, for placing the rocks.
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

const DIRT = byId("dirt");
const GRASS = byId("grass");

// Logs lying across the lane, each sunk a fifth of its thickness into the dirt: its middle at u
// along the section, its radius, and the angle it's turned from square across (radians).
const LOGS = [
  { u: 5.5, r: 0.1, angle: 0 },
  { u: 10, r: 0.125, angle: 0 },
  { u: 14.5, r: 0.15, angle: 0 },
  { u: 20, r: 0.125, angle: 0.45 },
];
const LOG_HALF = 2.7; // half a log's length
const logHeight = (log, x, u) => {
  const c = Math.cos(log.angle);
  const s = Math.sin(log.angle);
  const du = u - log.u;
  const along = x * c + du * s; // along the log
  if (Math.abs(along) > LOG_HALF) return 0;
  const d = Math.abs(-x * s + du * c); // out from its axis
  if (d >= log.r) return 0;
  return 0.8 * log.r + Math.sqrt(log.r * log.r - d * d);
};

// The rock garden's boulders: half-buried, each the top of an ellipsoid. x across, u along, its
// half-sizes rx and ru, and h how far it stands up.
const ROCKS = (() => {
  const rand = rng(1970);
  const rocks = [];
  for (let i = 0; i < 26; i++) {
    const h = 0.12 + rand() * 0.22;
    const rx = Math.max(h * 1.3, 0.25 + rand() * 0.3);
    rocks.push({ x: (rand() * 2 - 1) * 1.9, u: 5.5 + rand() * 16.5, h, rx, ru: rx * (0.75 + rand() * 0.5) });
  }
  return rocks.sort((a, b) => a.u - b.u);
})();
const ROCK_REACH = Math.max(...ROCKS.map((r) => r.ru));
const rockHeight = (rock, x, u) => {
  const dx = (x - rock.x) / rock.rx;
  const du = (u - rock.u) / rock.ru;
  const q = 1 - dx * dx - du * du;
  return q > 0 ? rock.h * Math.sqrt(q) : 0;
};

const HILL = 3.0; // metres up the hill climb, at 40%
const SLOPE = Math.tan((25 * Math.PI) / 180); // the side slope, 25°

// The sections, in order. Each has a name, a line for its sign, the surface it mostly looks like,
// its length, its shape (height at x across and u along from its start), and what it's made of
// (surface at x, u; null for dirt in the lane and grass beside it). Logs and rocks are listed for
// drawing, and drawn() is the ground under them.
const SECTIONS = [
  {
    id: "start",
    look: "dirt",
    name: "Test ground",
    note: "Naseeb's proving run",
    length: 16,
    height: () => 0,
  },
  {
    id: "washboard",
    look: "dirt",
    name: "Washboard",
    note: "5 cm ripples, 75 cm apart",
    length: 24,
    height: (x, u) => (u < 4 || u > 19.75 ? 0 : 0.025 * (1 - Math.cos((2 * Math.PI * (u - 4)) / 0.75)) * across(x, TRACK_HALF, TRACK_HALF + 0.6)),
  },
  {
    id: "logs",
    look: "wood",
    name: "Log crossing",
    note: "20, 25 and 30 cm logs",
    length: 26,
    fine: true,
    logs: LOGS,
    drawn: () => 0, // the logs are drawn on the ground
    height: (x, u) => {
      let h = 0;
      for (const log of LOGS) h = Math.max(h, logHeight(log, x, u));
      return h;
    },
    surface: (x, u) => (LOGS.some((log) => logHeight(log, x, u) > 0) ? byId("wood") : null),
  },
  {
    id: "twister",
    look: "dirt",
    name: "Axle twister",
    note: "40 cm mounds, left and right",
    length: 30,
    height: (x, u) => {
      let h = 0;
      for (let i = 0; i < 5; i++) {
        const cx = i % 2 ? 0.85 : -0.85;
        const cu = 7 + i * 4.5;
        h = Math.max(h, 0.4 * bump(Math.hypot((x - cx) / 1.3, (u - cu) / 2.2)));
      }
      return h;
    },
  },
  {
    id: "steps",
    look: "concrete",
    name: "Rock steps",
    note: "Up 25 and 20 cm, down 45 cm",
    length: 26,
    fine: true,
    height: (x, u) => (0.25 * step(u - 7) + 0.2 * step(u - 11) - 0.45 * step(u - 16)) * across(x, TRACK_HALF + 0.2, TRACK_HALF + 0.3),
    surface: (x, u) => (u > 6.9 && u < 16.1 && Math.abs(x) < TRACK_HALF + 0.3 ? byId("concrete") : null),
  },
  {
    id: "hill",
    look: "concrete",
    name: "Hill climb",
    note: "40% up, 40% down",
    length: 40,
    height: (x, u) => {
      const top = HILL * (ramp(u, 6, 13.5, 1.2) - ramp(u, 19.5, 27, 1.2));
      // A raised road, its sides falling away at 45° beyond the lane.
      const out = Math.abs(x) - (TRACK_HALF + 0.3);
      return out <= 0 ? top : Math.max(0, top - out);
    },
    surface: (x, u) => (u > 5.5 && u < 27.5 && Math.abs(x) < TRACK_HALF + 0.3 ? byId("concrete") : null),
  },
  {
    id: "sideslope",
    look: "dirt",
    name: "Side slope",
    note: "25° across",
    length: 36,
    height: (x, u) => {
      const tilt = ramp(u, 5, 10, 1.5) - ramp(u, 26, 31, 1.5);
      if (tilt <= 0) return 0;
      const edge = TRACK_HALF + 0.2;
      const rise = (x2) => tilt * SLOPE * (x2 + TRACK_HALF);
      if (x < -TRACK_HALF) return 0;
      if (x <= edge) return rise(x);
      // Past the high edge, the bank falls away again.
      const top = rise(edge);
      return Math.max(0, top - (x - edge) * 0.9);
    },
  },
  {
    id: "ditch",
    look: "dirt",
    name: "V-ditch",
    note: "55 cm deep, at an angle · low range",
    length: 24,
    height: (x, u) => -0.55 * bump(Math.abs(u - 12 - 0.6 * x) / 1.6) * across(x, 3, 5),
  },
  {
    id: "mud",
    look: "mud",
    name: "Mud pit",
    note: "30 cm deep",
    length: 26,
    height: (x, u) => -0.3 * (ramp(u, 5, 8, 1) - ramp(u, 19, 22, 1)) * across(x, TRACK_HALF + 0.2, TRACK_HALF + 1.2),
    surface: (x, u) => (u > 5.5 && u < 21.5 && Math.abs(x) < TRACK_HALF + 0.6 ? byId("mud") : null),
  },
  {
    id: "rocks",
    look: "rock",
    name: "Rock garden",
    note: "Boulders up to 35 cm",
    length: 28,
    fine: true,
    rocks: ROCKS,
    drawn: () => 0, // the boulders are drawn on the ground
    height: (x, u) => {
      let h = 0;
      for (const rock of ROCKS) {
        if (rock.u - ROCK_REACH > u) break;
        if (Math.abs(rock.u - u) < rock.ru) h = Math.max(h, rockHeight(rock, x, u));
      }
      return h;
    },
    surface: (x, u) => {
      for (const rock of ROCKS) {
        if (rock.u - ROCK_REACH > u) break;
        if (rockHeight(rock, x, u) > 0.005) return byId("rock");
      }
      return null;
    },
  },
  {
    id: "sand",
    look: "sand",
    name: "Sand trap",
    note: "Loose and soft",
    length: 22,
    height: (x, u) => -0.08 * (ramp(u, 4, 6, 1) - ramp(u, 16, 18, 1)) * across(x, TRACK_HALF, TRACK_HALF + 1),
    surface: (x, u) => (u > 4.5 && u < 17.5 && Math.abs(x) < TRACK_HALF + 0.5 ? byId("sand") : null),
  },
  {
    id: "whoops",
    look: "dirt",
    name: "Whoops",
    note: "30 cm rollers, 5 m apart",
    length: 38,
    height: (x, u) => (u < 6 || u > 26 ? 0 : 0.15 * (1 - Math.cos((2 * Math.PI * (u - 6)) / 5)) * across(x, TRACK_HALF + 0.3, TRACK_HALF + 1.3)),
  },
];
let start = 0;
for (const s of SECTIONS) {
  s.start = start;
  start += s.length;
}
const LENGTH = start; // a whole number of 8 m chunks, for drawing

// Which section a point `along` the course is in, and how far into it.
let lastSection = 0;
function locate(along) {
  const a = ((along % LENGTH) + LENGTH) % LENGTH;
  let i = lastSection;
  if (a < SECTIONS[i].start || a >= SECTIONS[i].start + SECTIONS[i].length) {
    i = 0;
    while (i < SECTIONS.length - 1 && a >= SECTIONS[i].start + SECTIONS[i].length) i++;
    lastSection = i;
  }
  return { section: SECTIONS[i], index: i, u: a - SECTIONS[i].start };
}

export const COURSE = {
  sections: SECTIONS,
  length: LENGTH,
  locate,
  height(x, z) {
    if (Math.abs(x) >= SHOULDER) return 0;
    const { section, u } = locate(-z);
    return section.height(x, u);
  },
  surface(x, z) {
    const { section, u } = locate(-z);
    const own = section.surface && section.surface(x, u);
    if (own) return own;
    return Math.abs(x) <= TRACK_HALF + 0.2 ? DIRT : GRASS;
  },
  // Where section `index` starts, the time round nearest `along`.
  sectionNear(along, index) {
    const s = SECTIONS[index];
    const lap = Math.round((along - s.start) / LENGTH);
    return Math.max(0, lap) * LENGTH + s.start;
  },
};

import {
  unlockAudio,
  loadPiano,
  playPiano,
  later,
  cancelLater,
  silence,
  pianoProgress,
  startRecording,
  recordingTick,
  renderRecording,
  sfx,
  isMuted,
  setMuted,
} from "./audio.js";
import { SONGS, songNotes, loadSong } from "./songs.js";

// ---------- Tuning ----------
// Every step is the same width, narrow enough that neighbouring steps, even side by side, never
// touch: how long a note lasts shows in the hop to the next step instead.
const STEP_WIDTH = 0.72;
// How far a step's look reaches from its centre, in step widths: its cloud sideways, its disc of
// light above, and its cloud below.
const STEP_REACH = { side: 0.5, above: 0.2, below: 0.38 };
// The hop from one step to the next, centre to centre, is as long as the wait between their notes,
// at one scale for the whole song, so the steps are spaced exactly like the music: twice the wait,
// twice the hop. The scale is HOP_SPEED world units a second, or more in a song with quick notes,
// so that even they get a hop of HOP_MIN (see hopScale).
const HOP_SPEED = 2;
// A hop leans as low as FLATTEST above level and goes no more than a LANE sideways, so quick notes
// sit side by side, each a little higher, and longer ones climb steeply.
const LANE = 1;
const FLATTEST = (20 * Math.PI) / 180;
// The shortest hop: side by side, a little clear of each other. Any two hops climb further than a
// step reaches above and below, so no two steps ever overlap. There's no longest: a long note or
// rest climbs as far as it lasts, and the camera follows the spark there (see cameraGoal).
const HOP_MIN = (STEP_REACH.side * 2 * STEP_WIDTH + 0.08) / Math.cos(FLATTEST);
const FIRST_RISE = 1.1; // from the starting cloud up to the first step
const HOVER = 0.3; // the wisp floats this far above the step it's on
const ANCHOR = 0.7; // the wisp's step sits this far down the screen
// How far off the beat, in seconds, a note still counts as perfect, great or good. Long notes get
// a little more room. Perfect is very generous: this is a game for relaxing.
const WINDOWS = { perfect: 0.15, great: 0.21, good: 0.3 };
// The beat follows the player's own tempo, the way an accompanist follows a soloist, but stays
// within this range of the song's.
const TEMPO_FOLLOW = 0.3;
const TEMPO_RETURN = 0.08;
const TEMPO_RANGE = [0.8, 1.25];
const MISS_LOCK = 0.12; // seconds of ignored input after a wrong-way hop
// Stars for a song, by the share of its notes played perfectly. Two stars unlock the next song.
const STAR_SHARES = [0.5, 0.8, 1];
const STARS_TO_UNLOCK = 2;
const STARS_KEY = "wiz-o-wisp-stars";
const SONG_KEY = "wiz-o-wisp-song";
const MAX_PARTICLES = 500;
const GRADE_COLORS = { perfect: "#fff4c2", great: "#ffe4d4", good: "#fffaf4", early: "#f1ddff", late: "#f1ddff" };

const isTouch = window.matchMedia("(pointer: coarse)").matches;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const mod = (a, n) => ((a % n) + n) % n;
const ease = (rate, dt) => 1 - Math.exp(-rate * dt); // how far to close a gap this frame

// A small seeded random generator, so background clouds come back the same each time they scroll
// into view.
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Saved progress ----------
function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function store(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Not saved; progress still counts for this visit.
  }
}

const starsBySong = load(STARS_KEY, {}); // song id -> best stars, 0 to 3
const starsFor = (song) => starsBySong[song.id] || 0;
// The first song is always open; each one after opens with enough stars on the one before it.
// For testing on this computer, ?all opens every song.
const OPEN_ALL = location.hostname === "localhost" && new URLSearchParams(location.search).has("all");
const unlocked = (i) =>
  i === 0 || (i > 0 && i < SONGS.length && (OPEN_ALL || starsFor(SONGS[i - 1]) >= STARS_TO_UNLOCK));
// The song last chosen, saved by its id so it survives the list being reordered.
const savedSong = Math.max(0, SONGS.findIndex((song) => song.id === load(SONG_KEY, null)));

// ---------- Canvas and camera ----------
const canvas = document.getElementById("game");
const g = canvas.getContext("2d");
let W = 1;
let H = 1;
let unit = 80; // CSS pixels per world unit at normal zoom
let S = unit; // ...at the camera's current zoom
let pixelRatio = Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2);
let vignette = null;

// World y points up; the camera keeps the wisp's step at ANCHOR down the screen.
const cam = { x: 0, y: 0, zoom: 1 };
const sx = (x) => W / 2 + (x - cam.x) * S;
const sy = (y) => H * ANCHOR - (y - cam.y) * S;

// ---------- Sprites ----------
// Soft shapes are painted once onto small canvases and stamped from then on, which is far cheaper
// than building gradients every frame.
function sprite(w, h, paint) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  paint(c.getContext("2d"), w, h);
  return c;
}

const glows = new Map();
// A round glow in one colour, for drawing with additive ("lighter") blending.
function glow(hue, sat = 100, light = 72) {
  const h = mod(Math.round(hue / 6) * 6, 360);
  const key = h * 100000 + sat * 100 + light;
  let c = glows.get(key);
  if (!c) {
    c = sprite(128, 128, (ctx) => {
      const col = (a) => `hsla(${h},${sat}%,${light}%,${a})`;
      const gr = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, col(1));
      gr.addColorStop(0.22, col(0.55));
      gr.addColorStop(0.55, col(0.15));
      gr.addColorStop(1, col(0));
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, 128, 128);
    });
    glows.set(key, c);
  }
  return c;
}

function drawGlow(img, x, y, size, alpha) {
  if (alpha <= 0.003 || size < 1) return;
  g.globalAlpha = Math.min(1, alpha);
  g.drawImage(img, x - size / 2, y - size / 2, size, size);
}

// A puffy cloud: overlapping soft circles, highest in the middle, lit warm from above and shaded
// rose underneath.
function makeCloud(seed) {
  const r = seeded(seed);
  return sprite(512, 256, (ctx, w, h) => {
    const puffs = 10 + Math.floor(r() * 6);
    for (let i = 0; i < puffs; i++) {
      const u = 0.15 + r() * 0.7;
      const hump = Math.sin(((u - 0.15) / 0.7) * Math.PI);
      const px = w * u;
      const py = h * (0.66 - hump * 0.18 + (r() - 0.5) * 0.1);
      const pr = h * (0.16 + r() * 0.16) * (0.7 + hump * 0.5);
      const gr = ctx.createRadialGradient(px, py, 0, px, py, pr);
      gr.addColorStop(0, "rgba(255,251,246,0.95)");
      gr.addColorStop(0.6, "rgba(255,246,240,0.7)");
      gr.addColorStop(1, "rgba(255,240,236,0)");
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-atop";
    const shade = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.9);
    shade.addColorStop(0, "rgba(255,232,190,0.4)");
    shade.addColorStop(0.5, "rgba(255,225,215,0)");
    shade.addColorStop(1, "rgba(200,120,160,0.5)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, w, h);
  });
}
const clouds = [11, 23, 37, 41, 59].map(makeCloud);

// Feathers a shape's left and right edges.
function featherSides(ctx, w, h) {
  ctx.globalCompositeOperation = "destination-in";
  const across = ctx.createLinearGradient(0, 0, w, 0);
  across.addColorStop(0, "rgba(0,0,0,0)");
  across.addColorStop(0.5, "rgba(0,0,0,1)");
  across.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = across;
  ctx.fillRect(0, 0, w, h);
}

// A ray of light from above: a narrow wedge that widens and fades as it falls.
const raySprite = sprite(64, 512, (ctx, w, h) => {
  const along = ctx.createLinearGradient(0, 0, 0, h);
  along.addColorStop(0, "rgba(255,250,235,1)");
  along.addColorStop(0.45, "rgba(255,240,220,0.4)");
  along.addColorStop(1, "rgba(255,236,215,0)");
  ctx.fillStyle = along;
  ctx.beginPath();
  ctx.moveTo(w * 0.47, 0);
  ctx.lineTo(w * 0.53, 0);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();
  featherSides(ctx, w, h);
});

// The column of light a struck step sends up, brightest at its foot.
const beamSprite = sprite(32, 256, (ctx, w, h) => {
  const up = ctx.createLinearGradient(0, h, 0, 0);
  up.addColorStop(0, "rgba(255,246,225,1)");
  up.addColorStop(0.3, "rgba(255,236,210,0.5)");
  up.addColorStop(1, "rgba(255,230,210,0)");
  ctx.fillStyle = up;
  ctx.fillRect(0, 0, w, h);
  featherSides(ctx, w, h);
});

// The sky over the climb, [top, middle, bottom] from its start to its end: light above, dusk
// below, and brighter the higher the wisp gets.
const SKY = [
  [[255, 214, 172], [226, 140, 152], [90, 58, 118]],
  [[255, 228, 192], [238, 160, 164], [116, 76, 140]],
  [[255, 244, 224], [250, 194, 186], [158, 110, 166]],
];

const CLOUD_LAYERS = [
  { depth: 0.12, size: 1.0, alpha: 0.45, speed: 5, cell: 0.55 },
  { depth: 0.3, size: 0.75, alpha: 0.6, speed: 9, cell: 0.45 },
  { depth: 1.5, size: 1.6, alpha: 0.26, speed: 0, cell: 1.4, front: true },
];

const motes = Array.from({ length: 60 }, () => ({
  x: Math.random(),
  y: Math.random(),
  depth: rand(0.2, 1),
  phase: rand(0, Math.PI * 2),
  size: rand(2, 5),
}));

// ---------- State ----------
const state = {
  mode: "title", // title | playing | paused | outro | done
  songIndex: unlocked(savedSong) ? savedSong : 0,
  song: null, // SONGS[songIndex], set by selectSong
  steps: [],
  cur: -1, // the step the wisp stands on; -1 is the starting cloud
  lastHit: 0, // game time of the last note played
  prevHit: 0, // ...and of the one before it
  spb: 0.65, // seconds per beat, following the player
  streak: 0,
  bestStreak: 0,
  counts: { perfect: 0, great: 0, good: 0, off: 0 },
  wrong: 0,
  lockUntil: 0,
  startedAt: 0,
  endAt: Infinity,
  outro: null,
  energy: 0, // 0..1, grows with the streak: a bigger, brighter wisp
  sky: 0, // 0..1, how far up the sky's colours have climbed
  radiance: 0, // 0..1, the light opening up at the end of a song
  tint: 40, // hue of the light from above, drifting with the harmony
  tintTarget: 40,
  tintAt: Infinity,
  tintNext: 40,
};

const home = { x: 0, y: 0, width: 1.25, hue: 40, cloud: 0, struckAt: -1 };

const wisp = {
  x: 0,
  y: 0, // includes the arc of a hop
  groundY: 0, // the height it's travelling along, without the arc
  fromX: 0,
  fromY: 0,
  toX: 0,
  toY: 0,
  hopStart: -1,
  hopDur: 0.2,
  arc: 0.3,
  vx: 0,
  squash: 0, // + squashed flat on landing, - stretched taking off
  face: 1,
  look: 0,
  bump: null,
  blinkAt: -1,
  nextBlink: 3,
};

const particles = [];
const ripples = [];
const beams = [];
const texts = [];
const zoneFlash = { [-1]: -9, [1]: -9 }; // when each touch pad was last pressed
const halfFlash = { [-1]: -9, [1]: -9 }; // when each half of the screen was last tapped

let pausedAt = 0;
let pausedFor = 0;
// Game time in seconds. It stands still while paused, so the beat picks up where it left off.
// While a demo video is recorded the clock is stepped frame by frame instead (see the localhost
// hook at the end); otherwise it's the real one.
let virtualMs = null;
const clockMs = () => virtualMs ?? performance.now();
const now = () => ((state.mode === "paused" ? pausedAt : clockMs()) - pausedFor) / 1000;

// ---------- The steps ----------
// One step per melody note, a hop from the last as long as the wait between them, and to the side
// like a keyboard: right when the tune climbs, left when it falls. A repeated note drifts toward
// where its pitch sits (low notes on the left, high on the right), or either way at random once
// it's there, so the path traces the shape of the melody.
const PITCH_SPREAD = 2.5; // lanes from the middle to where the highest and lowest notes sit

function buildSteps(song) {
  const { melody } = song;
  if (!melody?.length) return []; // an imported piece still loading
  const lo = Math.min(...melody.map((n) => n.midi));
  const hi = Math.max(...melody.map((n) => n.midi));
  const middle = (lo + hi) / 2;
  const spb = 60 / song.bpm;
  const start = melody[0].beat;
  const waits = melody.slice(1).map((note, i) => (note.beat - melody[i].beat) * spb);
  const scale = hopScale(waits);
  const steps = [];
  let x = 0;
  let y = FIRST_RISE;
  let prev = null;
  melody.forEach((note, i) => {
    const home = ((note.midi - middle) / Math.max(1, (hi - lo) / 2)) * PITCH_SPREAD;
    let dir;
    if (prev && note.midi !== prev.midi) dir = note.midi > prev.midi ? 1 : -1;
    else if (Math.abs(x - home) > 0.5) dir = home > x ? 1 : -1;
    else dir = Math.random() < 0.5 ? -1 : 1;
    if (!prev) x = dir * LANE;
    else {
      const length = Math.max(HOP_MIN, waits[i - 1] * scale);
      const side = Math.min(length * Math.cos(FLATTEST), LANE);
      x += dir * side;
      y += Math.sqrt(length * length - side * side);
    }
    // Low notes glow gold, high ones lilac.
    const height = hi > lo ? (note.midi - lo) / (hi - lo) : 0.5;
    steps.push({
      ...note,
      x,
      y,
      time: (note.beat - start) * spb, // seconds after the first note, at the song's own tempo
      dir,
      hue: mod(42 - height * 112, 360),
      width: STEP_WIDTH,
      cloud: Math.floor(Math.random() * clouds.length),
      accompaniment: [],
      chords: [],
      struckAt: -1,
      glowAt: Infinity,
      grade: null,
    });
    prev = note;
  });
  // Hang each accompaniment note and chord change on the melody note it follows, timed from it.
  const owner = (beat) => {
    let k = 0;
    while (k + 1 < steps.length && steps[k + 1].beat <= beat) k++;
    return steps[k];
  };
  for (const a of song.accompaniment) {
    const step = owner(a.beat);
    step.accompaniment.push({ ...a, offset: a.beat - step.beat });
  }
  for (const c of song.chords) {
    const step = owner(c.beat);
    step.chords.push({ ...c, offset: c.beat - step.beat });
  }
  return steps;
}

// A song's hop length for each second of waiting, in world units: HOP_SPEED, or enough that its
// quick notes still get a hop of HOP_MIN. The quickest fiftieth of the waits are left out, so one
// stray quick note (a grace note, say) doesn't spread out the whole piece; they get HOP_MIN.
function hopScale(waits) {
  const sorted = [...waits].sort((a, b) => a - b);
  if (!sorted.length) return HOP_SPEED;
  return Math.max(HOP_SPEED, HOP_MIN / sorted[Math.floor(sorted.length * 0.02)]);
}

// ---------- The spark ----------
// A spark sets off from the step just played as its note sounds and runs along the path to the
// next step at an even speed, reaching it right when that note is due, as the ring closes on it.
// Every hop is as long as its wait, so the spark runs at one speed all song long.
//
// The path is the one the thread of light traces once the wisp has flown it: a curve from step to
// step through a point a little above the higher one.
function pathPoint(a, b, f) {
  const cx = (a.x + b.x) / 2;
  const cy = Math.max(a.y, b.y) + 0.35;
  const u = 1 - f;
  return { x: u * u * a.x + 2 * u * f * cx + f * f * b.x, y: u * u * a.y + 2 * u * f * cy + f * f * b.y };
}

// Points along the path from `a` to `b` at even distances apart, worked out once per step.
const PATH_POINTS = 24;
function pathFrom(a, b) {
  if (a.path) return a.path;
  const raw = [];
  for (let k = 0; k <= PATH_POINTS * 2; k++) raw.push(pathPoint(a, b, k / (PATH_POINTS * 2)));
  const along = [0];
  for (let k = 1; k < raw.length; k++) along.push(along[k - 1] + Math.hypot(raw[k].x - raw[k - 1].x, raw[k].y - raw[k - 1].y));
  const total = along[along.length - 1];
  const points = [];
  let k = 1;
  for (let n = 0; n <= PATH_POINTS; n++) {
    const want = (n / PATH_POINTS) * total;
    while (k < along.length - 1 && along[k] < want) k++;
    const f = (want - along[k - 1]) / (along[k] - along[k - 1] || 1);
    points.push({ x: lerp(raw[k - 1].x, raw[k].x, f), y: lerp(raw[k - 1].y, raw[k].y, f) });
  }
  return (a.path = points);
}

// Where along the path, `q` (0 to 1) of the way by distance.
function pointAlong(points, q) {
  const at = clamp(q, 0, 1) * PATH_POINTS;
  const k = Math.min(Math.floor(at), PATH_POINTS - 1);
  return { x: lerp(points[k].x, points[k + 1].x, at - k), y: lerp(points[k].y, points[k + 1].y, at - k) };
}

// The spark's run at time `t`: its path, and how far along it is (0 to 1).
function sparkAt(t) {
  if (state.mode !== "playing" || state.cur < 0) return null;
  let i = state.cur;
  let start = state.lastHit;
  let end = expectedNext();
  // An early perfect tap holds its note for the beat, so until then the spark is still on its way
  // to the step the wisp has already hopped to.
  if (t < start && i > 0) {
    i--;
    end = start;
    start = state.prevHit;
  }
  const b = state.steps[i + 1];
  if (!b) return null;
  const points = pathFrom(state.steps[i], b);
  const q = clamp((t - start) / Math.max(0.05, end - start), 0, 1);
  return { points, q, seconds: end - start, ...pointAlong(points, q) };
}

// ---------- The camera ----------
// The camera follows the wisp (or the step it's flying to), leaning partway toward the next step
// so the way ahead is always on show. A next step that would still sit off the screen, or crowded
// against its edge, pulls the camera further, as far as it can go while the wisp stays in view;
// and if either one is actually off the screen, the camera hurries. A step too far away to show
// with the wisp (after a long note or a rest) is left off the screen: the camera rides along with
// the spark instead, keeping it mid-screen, until it reaches the step.
const LEAN = { x: 0.5, y: 0.35 }; // how far toward the next step the camera leans
const FRAME = { top: 0.22, bottom: 0.14, side: 0.12 }; // edges of the screen kept clear, as fractions of it
const RATE = { calm: 3, urgent: 7, ride: 6 }; // how quickly the camera closes on where it's going

function cameraGoal() {
  const next = state.mode === "playing" ? state.steps[state.cur + 1] : null;
  if (!next) return { x: wisp.x, y: wisp.groundY, rate: RATE.calm };
  const at = state.cur < 0 ? { x: wisp.x, y: wisp.groundY } : state.steps[state.cur];
  const goal = { x: at.x + (next.x - at.x) * LEAN.x, y: at.y + (next.y - at.y) * LEAN.y, rate: RATE.calm };
  // Up: the next step no higher than FRAME.top below the top; the wisp no lower than FRAME.bottom.
  const nextOnScreen = next.y - (H * (ANCHOR - FRAME.top)) / unit;
  const wispOnScreen = at.y + (H * (1 - ANCHOR - FRAME.bottom)) / unit;
  goal.y = Math.min(Math.max(goal.y, nextOnScreen), wispOnScreen);
  // Across: both within FRAME.side of the sides.
  const reach = (W * (0.5 - FRAME.side)) / unit;
  goal.x = clamp(goal.x, Math.max(next.x, at.x) - reach, Math.min(next.x, at.x) + reach);
  // Hurry when the next step or the wisp is off the screen right now.
  const off = (x, y) => sx(x) < 0 || sx(x) > W || sy(y) < 0 || sy(y) > H;
  if (off(next.x, next.y) || off(at.x, at.y)) goal.rate = RATE.urgent;
  // Too far apart to show both: once the spark climbs past mid-screen, ride along with it. The
  // camera lags anything moving, so it aims ahead by the spark's speed to keep it right in the middle.
  const spark = nextOnScreen > wispOnScreen && sparkAt(now());
  if (spark) {
    const ahead = pointAlong(spark.points, spark.q + 0.01);
    const climb = spark.q < 1 ? (ahead.y - spark.y) / (0.01 * spark.seconds) : 0;
    goal.y = Math.max(goal.y, spark.y - (H * (ANCHOR - 0.5)) / unit + climb / RATE.ride);
    goal.rate = RATE.ride;
  }
  return goal;
}

// When the next note is due, by the player's tempo so far.
function expectedNext() {
  const cur = state.steps[state.cur];
  const next = state.steps[state.cur + 1];
  if (!cur || !next) return Infinity;
  return state.lastHit + (next.beat - cur.beat) * state.spb;
}

// ---------- Playing ----------
// A touch more weight on each bar's first beat, and a little on its middle.
function accentOf(song, beat) {
  const inBar = mod(beat - song.pickup, song.bar);
  return inBar === 0 ? 0.06 : song.bar % 2 === 0 && inBar === song.bar / 2 ? 0.03 : 0;
}

// `eventTime` is the input event's timestamp, so a tap is judged by when the finger came down even
// if a slow frame held up its handler.
function press(dir, eventTime = performance.now()) {
  stopListening(); // the player has taken over from the recording
  const t = Math.min(now(), (eventTime - pausedFor) / 1000);
  zoneFlash[dir] = t;
  if (state.mode !== "playing" || t < state.lockUntil) return;
  const i = state.cur + 1;
  const step = state.steps[i];
  if (!step) return;
  if (dir === step.dir) strike(i, t);
  else wrongWay(dir, t);
}

function strike(i, t) {
  const step = state.steps[i];
  const prev = state.steps[i - 1];
  let grade = null;
  // When this note belongs in the music. A perfect tap is held to the beat itself, so a run of
  // perfect taps plays the piece in its true tempo however a hair early or late each one was.
  let onTime = t;
  if (prev) {
    const beats = step.beat - prev.beat;
    const due = state.lastHit + beats * state.spb;
    const off = t - due;
    const room = clamp((beats * state.spb) / 0.65, 1, 1.4);
    const a = Math.abs(off);
    if (a <= WINDOWS.perfect * room) grade = "perfect";
    else if (a <= WINDOWS.great * room) grade = "great";
    else if (a <= WINDOWS.good * room) grade = "good";
    else grade = off < 0 ? "early" : "late";
    // Otherwise follow the player's tempo, ignoring pauses and rushes that are clearly not a
    // tempo, and letting no single note pull it far: a steady drift moves it, one stumble doesn't.
    const played = (t - state.lastHit) / beats;
    if (grade === "perfect") onTime = due;
    else if (played > state.spb * 0.6 && played < state.spb * 1.6) {
      const base = 60 / state.song.bpm;
      const heard = clamp(played, state.spb * 0.9, state.spb * 1.1);
      state.spb += (clamp(heard, base * TEMPO_RANGE[0], base * TEMPO_RANGE[1]) - state.spb) * TEMPO_FOLLOW;
      // ...with a gentle pull back toward the song's own tempo, so a player who's always a hair
      // late doesn't slowly drag it all the way down.
      state.spb += (base - state.spb) * TEMPO_RETURN;
    }
  }
  const onBeat = grade !== "early" && grade !== "late";
  state.streak = onBeat ? state.streak + 1 : 0;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  if (grade) state.counts[onBeat ? grade : "off"]++;
  step.grade = grade;

  // The note itself, a touch louder on strong beats and perfect timing.
  const base = step.velocity ?? 0.62 + accentOf(state.song, step.beat); // imported scores carry their own accents
  const velocity = clamp(base + (grade === "perfect" ? 0.06 : 0) + rand(-0.03, 0.03), 0.3, 0.9);
  // Whatever the last note still had to play would now clash, so it goes.
  cancelLater();
  // The note sounds on its beat: an early perfect tap waits for it, a late one plays at once.
  // Everything this note brings with it is timed from the beat too.
  const fromNow = (offset) => Math.max(0, onTime - t + offset * state.spb);
  later(fromNow(0), (at) => {
    playPiano(step.midi, { velocity, hold: step.beats * state.spb + 0.5, at });
    if (grade === "perfect") sfx.shimmer(at);
  });
  for (const a of step.accompaniment) {
    later(fromNow(a.offset), (at) => {
      const hold = a.beats ? a.beats * state.spb + 0.15 : 2 * state.spb + 0.4;
      for (const midi of a.notes) playPiano(midi, { velocity: a.velocity, hold, at });
    });
  }
  for (const c of step.chords) {
    state.tintAt = t + fromNow(c.offset);
    state.tintNext = c.hue;
  }

  step.struckAt = t;
  hop(step, t, prev ? step.beat - prev.beat : 1);
  if (grade) texts.push({ x: step.x, y: step.y, text: grade, color: GRADE_COLORS[grade], start: t });
  state.cur = i;
  state.prevHit = state.lastHit;
  state.lastHit = onTime;
  if (i === state.steps.length - 1) state.endAt = onTime + step.beats * state.spb;
  updateHud();
}

function hop(step, t, beats) {
  const seconds = beats * state.spb;
  Object.assign(wisp, {
    fromX: wisp.x,
    fromY: wisp.groundY,
    toX: step.x,
    toY: step.y,
    hopStart: t,
    hopDur: clamp(0.42 * seconds, 0.12, 0.34),
    arc: 0.2 + 0.18 * clamp(seconds / 0.65, 0.5, 2),
    face: step.dir,
    squash: -0.3,
    bump: null,
  });
}

// The wisp lands: the step rings out in light.
function land(t) {
  const step = state.steps[state.cur];
  if (!step) return;
  wisp.squash = 0.4;
  const perfect = step.grade === "perfect";
  ripples.push({ x: step.x, y: step.y, w: step.width, hue: step.hue, start: t, dur: 1 });
  if (perfect) ripples.push({ x: step.x, y: step.y, w: step.width * 1.4, hue: 46, start: t + 0.08, dur: 1.2 });
  beams.push({ x: step.x, y: step.y, w: step.width, start: t, dur: perfect ? 0.9 : 0.6, strength: perfect ? 1 : 0.6 });
  const count = perfect ? 22 : 12;
  for (let k = 0; k < count; k++) {
    const angle = rand(0.15, 0.85) * Math.PI;
    const speed = rand(0.6, 1.9);
    spawn({
      x: step.x + rand(-0.2, 0.2),
      y: step.y + 0.05,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: rand(0.7, 1.4),
      size: rand(0.04, 0.09),
      hue: Math.random() < 0.5 ? step.hue : 44,
      light: 80,
      alpha: 1,
      drag: 2.6,
      lift: 0.5,
    });
  }
}

// A hop toward the empty side: the wisp leans out, finds nothing, and bobs back.
function wrongWay(dir, t) {
  state.streak = 0;
  state.wrong++;
  state.lockUntil = t + MISS_LOCK;
  wisp.bump = { dir, start: t };
  wisp.face = dir;
  sfx.bump();
  for (let k = 0; k < 6; k++) {
    spawn({
      x: wisp.x + dir * 0.45,
      y: wisp.y + HOVER,
      vx: dir * rand(0.1, 0.5),
      vy: rand(-0.2, 0.3),
      life: rand(0.4, 0.7),
      size: rand(0.04, 0.07),
      hue: 280,
      light: 82,
      alpha: 0.6,
      drag: 3,
      lift: 0,
    });
  }
  updateHud();
}

// After the last note: a rolled chord, and the wisp rises into the light.
function beginOutro(t) {
  state.mode = "outro";
  state.outro = { start: t, fromY: wisp.groundY };
  ui.pause.hidden = true;
  ui.streakPill.hidden = true;
  state.song.ending.forEach((midi, k) => later(k * 0.075, (at) => playPiano(midi, { velocity: 0.38 + k * 0.03, hold: 4.5, at })));
  later(0.35, () => sfx.shimmer());
  // A wave of light runs up the steps behind it.
  const n = state.steps.length;
  state.steps.forEach((s, i) => (s.glowAt = t + 0.2 + (i - n + 12) * 0.06));
}

// The song is done: stars for the share of notes played perfectly (the first note starts the song,
// so it has no timing to judge), and the next song unlocks at two stars.
function finish() {
  state.mode = "done";
  const { counts, steps, bestStreak, song, songIndex } = state;
  const judged = steps.length - 1;
  const share = judged > 0 ? counts.perfect / judged : 1;
  const stars = STAR_SHARES.filter((s) => share >= s).length;
  const hadNext = unlocked(songIndex + 1);
  if (stars > starsFor(song)) {
    starsBySong[song.id] = stars;
    store(STARS_KEY, starsBySong);
  }
  const next = SONGS[songIndex + 1];
  let message = `${counts.perfect} of ${judged} notes perfect (${Math.floor(share * 100)}%), best streak ${bestStreak}.`;
  if (next && unlocked(songIndex + 1)) {
    if (!hadNext) message += ` You unlocked ${next.title}!`;
    showCard({ title: song.title, stars, message, button: `Next: ${next.title}`, again: true, menu: true });
  } else if (next) {
    message += ` Get ${STARS_TO_UNLOCK} stars (${STAR_SHARES[STARS_TO_UNLOCK - 1] * 100}% perfect) to unlock ${next.title}.`;
    showCard({ title: song.title, stars, message, button: "Try again", menu: true });
  } else {
    showCard({ title: song.title, stars, message, button: "Play again", menu: true });
  }
}

// ---------- Effects ----------
function spawn(p) {
  if (particles.length < MAX_PARTICLES) particles.push({ age: 0, ...p });
}

let trailDebt = 0;
// Embers drifting up off the wisp: a few at rest, a stream while it flies.
function emitTrail(dt) {
  const flying = wisp.hopStart >= 0 || state.mode === "outro";
  trailDebt += dt * (flying ? 90 : 14 + state.energy * 26);
  while (trailDebt >= 1) {
    trailDebt--;
    spawn({
      x: wisp.x + rand(-0.06, 0.06),
      y: wisp.y + HOVER + rand(-0.05, 0.08),
      vx: rand(-0.15, 0.15) - wisp.vx * 0.05,
      vy: rand(0.15, 0.5),
      life: rand(0.5, 1) * (flying ? 0.8 : 1),
      size: rand(0.05, 0.1) * (1 + state.energy * 0.6),
      hue: rand(26, 46),
      light: 72,
      alpha: 0.8,
      drag: 1.2,
      lift: 0.2,
    });
  }
}

function updateEffects(dt, t) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.age += dt;
    if (p.age >= p.life) {
      particles[i] = particles[particles.length - 1];
      particles.pop();
      continue;
    }
    const drag = 1 - ease(p.drag, dt);
    p.vx *= drag;
    p.vy = p.vy * drag + p.lift * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
  for (const list of [ripples, beams]) {
    for (let i = list.length - 1; i >= 0; i--) if (t > list[i].start + list[i].dur) list.splice(i, 1);
  }
  for (let i = texts.length - 1; i >= 0; i--) if (t > texts[i].start + 0.9) texts.splice(i, 1);
}

// ---------- Update ----------
function update(dt) {
  if (listening && performance.now() > listening.endsAt) stopListening();
  if (state.mode === "paused") return;
  const t = now();

  // The hop: an arc from wherever the wisp was to the new step, quick to leave and soft to land.
  if (wisp.hopStart >= 0) {
    const u = (t - wisp.hopStart) / wisp.hopDur;
    if (u >= 1) {
      wisp.hopStart = -1;
      wisp.x = wisp.toX;
      wisp.y = wisp.groundY = wisp.toY;
      land(t);
    } else {
      const e = 1 - (1 - u) * (1 - u);
      wisp.x = lerp(wisp.fromX, wisp.toX, e);
      wisp.groundY = lerp(wisp.fromY, wisp.toY, e);
      wisp.y = wisp.groundY + Math.sin(Math.PI * u) * wisp.arc;
    }
  }
  wisp.vx = wisp.hopStart >= 0 ? (wisp.toX - wisp.fromX) / wisp.hopDur : wisp.vx * (1 - ease(6, dt));
  wisp.squash *= 1 - ease(9, dt);
  const engaged = t - state.lastHit < 1.2 || wisp.bump;
  wisp.look = lerp(wisp.look, wisp.face * (engaged ? 1 : 0.3), ease(5, dt));
  if (t > wisp.nextBlink) {
    wisp.blinkAt = t;
    wisp.nextBlink = t + rand(2.4, 5.5);
  }

  if (state.mode === "playing" && t >= state.endAt) beginOutro(t);
  if (state.outro) {
    const u = clamp((t - state.outro.start - 0.4) / 3.2, 0, 1);
    const e = u * u * (3 - 2 * u);
    wisp.y = wisp.groundY = state.outro.fromY + e * 3.2;
    cam.zoom = lerp(1, 0.8, e);
    state.radiance = e;
    if (state.mode === "outro" && t - state.outro.start > 4) finish();
  }
  const goal = cameraGoal();
  cam.x += (goal.x - cam.x) * ease(goal.rate, dt);
  cam.y += (goal.y - cam.y) * ease(goal.rate, dt);

  if (t >= state.tintAt) {
    state.tintTarget = state.tintNext;
    state.tintAt = Infinity;
  }
  state.tint = mod(state.tint + (mod(state.tintTarget - state.tint + 180, 360) - 180) * ease(1.6, dt), 360);
  const progress = state.steps.length ? (state.cur + 1) / state.steps.length : 0;
  state.sky += (progress - state.sky) * ease(0.8, dt);
  state.energy += (Math.min(1, state.streak / 16) - state.energy) * ease(3, dt);

  emitTrail(dt);
  updateEffects(dt, t);
}

// ---------- Drawing ----------
function drawSky() {
  const seg = state.sky * (SKY.length - 1);
  const k = Math.min(Math.floor(seg), SKY.length - 2);
  const f = seg - k;
  const col = (j) => {
    const [a, b] = [SKY[k][j], SKY[k + 1][j]];
    return `rgb(${lerp(a[0], b[0], f) | 0},${lerp(a[1], b[1], f) | 0},${lerp(a[2], b[2], f) | 0})`;
  };
  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, col(0));
  sky.addColorStop(0.5, col(1));
  sky.addColorStop(1, col(2));
  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 1;
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);
}

// The light from above, tinted by the harmony, and its rays.
function drawLight(amb) {
  g.globalCompositeOperation = "lighter";
  drawGlow(glow(state.tint, 100, 78), W / 2, -H * 0.05, Math.max(W, H) * 1.4, 0.5 + state.radiance * 0.4);
  const ox = W / 2 + Math.sin(amb * 0.07) * W * 0.08;
  const oy = -H * 0.12;
  for (let i = 0; i < 7; i++) {
    const angle = (i / 6 - 0.5) * 1.1 + Math.sin(amb * 0.11 + i * 1.7) * 0.05;
    const width = W * (0.1 + 0.02 * ((i * 37) % 5));
    g.globalAlpha = (0.05 + 0.035 * Math.sin(amb * 0.5 + i * 2.1)) * (1 + state.radiance);
    g.save();
    g.translate(ox, oy);
    g.rotate(angle);
    g.drawImage(raySprite, -width / 2, 0, width, H * 1.35);
    g.restore();
  }
}

// Clouds at a few depths, slower the farther away. Each band of sky gets its own clouds from a
// seeded random, so they're the same whenever they scroll back into view.
function drawClouds(front, amb) {
  g.globalCompositeOperation = "source-over";
  CLOUD_LAYERS.forEach((layer, li) => {
    if (!!layer.front !== front) return;
    const cellH = H * layer.cell;
    const oy = cam.y * unit * layer.depth;
    const ox = cam.x * unit * layer.depth;
    const first = Math.floor((oy - (1 - ANCHOR) * H - cellH) / cellH);
    const last = Math.ceil((oy + ANCHOR * H + cellH) / cellH);
    for (let c = first; c <= last; c++) {
      const r = seeded(c * 7919 + li * 104729 + 17);
      const cw = Math.min(W, 900) * layer.size * (0.55 + r() * 0.5);
      const ch = cw / 2;
      const y = H * ANCHOR - (c + r()) * cellH + oy;
      let x;
      if (layer.front) {
        // Near clouds keep to the sides, out of the wisp's way.
        x = (r() < 0.5 ? r() * W * 0.18 : W - r() * W * 0.18) - ox * 0.3;
      } else {
        x = mod(r() * (W + cw) + amb * layer.speed - ox, W + cw) - cw / 2;
      }
      g.globalAlpha = layer.alpha * (0.6 + r() * 0.4);
      g.drawImage(clouds[Math.floor(r() * clouds.length)], x - cw / 2, y - ch / 2, cw, ch);
    }
  });
}

function drawMotes(amb) {
  g.globalCompositeOperation = "lighter";
  const img = glow(40, 100, 85);
  for (const m of motes) {
    const x = mod(m.x * W - cam.x * unit * m.depth * 0.6 + Math.sin(amb * 0.4 + m.phase) * 18, W + 20) - 10;
    const y = mod(m.y * H + cam.y * unit * m.depth * 0.6 - amb * 14 * m.depth, H + 20) - 10;
    const twinkle = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(amb * 1.7 + m.phase * 3), 2);
    drawGlow(img, x, y, m.size * 4 * (0.6 + m.depth * 0.6), 0.5 * twinkle);
  }
}

// The path the wisp has flown, traced in light.
function drawThread() {
  if (state.cur < 0) return;
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(sx(0), sy(0));
  let px = 0;
  let py = 0;
  for (let i = 0; i <= state.cur; i++) {
    const s = state.steps[i];
    g.quadraticCurveTo(sx((px + s.x) / 2), sy(Math.max(py, s.y) + 0.35), sx(s.x), sy(s.y));
    px = s.x;
    py = s.y;
  }
  g.strokeStyle = "rgb(255,214,170)";
  g.globalAlpha = 0.12;
  g.lineWidth = Math.max(4, S * 0.08);
  g.stroke();
  g.globalAlpha = 0.45;
  g.lineWidth = Math.max(1.2, S * 0.02);
  g.stroke();
}

// A step: a disc of light resting on a small cloud. Lit once played; the next one pulses.
function drawPlatform(s, t, lit, isNext) {
  const x = sx(s.x);
  const y = sy(s.y);
  const w = s.width * S;
  let flash = s.struckAt >= 0 ? Math.exp(-(t - s.struckAt) * 4) : 0;
  if (t >= s.glowAt) flash = Math.max(flash, Math.exp(-(t - s.glowAt) * 5));

  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 0.92;
  g.drawImage(clouds[s.cloud], x - w * 0.65, y - w * 0.22, w * 1.3, w * 0.65);

  g.globalCompositeOperation = "lighter";
  const pulse = 0.5 + 0.5 * Math.sin(t * 4);
  const amount = lit ? 0.32 + 0.6 * flash + 0.05 * Math.sin(t * 2 + s.x) : isNext ? 0.2 + 0.14 * pulse : 0.08;
  drawGlow(glow(s.hue, 100, 72), x, y, w * (2.4 + flash * 1.2), amount);

  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 1;
  const ry = w * 0.15;
  g.fillStyle = `hsla(${s.hue},55%,${lit ? 78 : 70}%,0.9)`;
  g.beginPath();
  g.ellipse(x, y + w * 0.05, w / 2, ry, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = lit ? `hsl(${s.hue},100%,${90 + 8 * flash}%)` : `hsla(${s.hue},75%,91%,0.95)`;
  g.beginPath();
  g.ellipse(x, y, w / 2, ry, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = `hsla(${s.hue},100%,${lit ? 82 : 74}%,${lit ? 0.95 : 0.7})`;
  g.lineWidth = Math.max(1.2, w * 0.03);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath();
  g.ellipse(x - w * 0.12, y - ry * 0.25, w * 0.18, ry * 0.32, 0, 0, Math.PI * 2);
  g.fill();
}

// A ring closing in on the next step at an even pace, meeting its edge when the note is due, just
// as the spark gets there.
function drawApproach(s, t) {
  const x = sx(s.x);
  const y = sy(s.y);
  const w = s.width * S;
  let k;
  let alpha;
  if (state.cur < 0) {
    k = 1.25 + 0.12 * Math.sin(t * 3);
    alpha = 0.55;
  } else {
    const due = expectedNext();
    if (t > due) {
      k = 1.08 + 0.06 * Math.sin((t - due) * 5);
      alpha = 0.65 + 0.2 * Math.sin((t - due) * 5);
    } else {
      const q = clamp((t - state.lastHit) / Math.max(0.05, due - state.lastHit), 0, 1);
      k = 1.08 + 1.5 * (1 - q);
      alpha = 0.15 + 0.7 * q;
    }
  }
  g.globalCompositeOperation = "lighter";
  g.globalAlpha = alpha;
  g.strokeStyle = `hsl(${s.hue},100%,86%)`;
  g.lineWidth = Math.max(1.5, w * 0.035);
  g.beginPath();
  g.ellipse(x, y, (w / 2) * k, w * 0.15 * k, 0, 0, Math.PI * 2);
  g.stroke();
}

// The way the spark still has to go: a fine thread of light.
function drawSparkPath(t) {
  const spark = sparkAt(t);
  if (!spark || spark.q >= 1) return;
  const { points, q } = spark;
  g.globalCompositeOperation = "source-over";
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(sx(spark.x), sy(spark.y));
  for (let k = Math.ceil(q * PATH_POINTS); k <= PATH_POINTS; k++) g.lineTo(sx(points[k].x), sy(points[k].y));
  g.globalAlpha = 0.5;
  g.strokeStyle = "#fff6ea";
  g.lineWidth = 1;
  g.stroke();
}

// The spark itself: a tiny wisp, a child of the big one, a bead of light swimming ahead with a
// wavy tail, and swelling gently on the step once it's there and the note is due.
function drawSpark(t) {
  const spark = sparkAt(t);
  if (!spark) return;
  const { points, q } = spark;
  const total = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y) * PATH_POINTS;
  const head = Math.max(3.5, S * 0.06) * (q >= 1 ? 1 + 0.12 * Math.sin(t * 8) : 1);
  const tail = 0.6; // world units
  // The tail's two edges, narrowing to a point, swaying in a wave that runs down it.
  const left = [];
  const right = [];
  for (let k = 0; k <= 14; k++) {
    const f = k / 14;
    const p = pointAlong(points, q - (f * tail) / total);
    const back = pointAlong(points, q - (f * tail + 0.03) / total);
    let nx = back.y - p.y;
    let ny = p.x - back.x;
    const n = Math.hypot(nx, ny) || 1;
    nx /= n;
    ny /= n;
    const wave = Math.sin(t * 10 - f * 6) * 0.07 * f;
    const half = (head / S) * 0.8 * (1 - f);
    left.push([sx(p.x + nx * (wave + half)), sy(p.y + ny * (wave + half))]);
    right.push([sx(p.x + nx * (wave - half)), sy(p.y + ny * (wave - half))]);
  }
  const x = sx(spark.x);
  const y = sy(spark.y);
  g.globalCompositeOperation = "lighter";
  drawGlow(glow(40, 100, 74), x, y, head * 6, 0.7);
  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 0.8;
  g.fillStyle = "hsl(40,100%,82%)";
  g.beginPath();
  g.moveTo(...left[0]);
  for (const p of left) g.lineTo(...p);
  for (const p of right.reverse()) g.lineTo(...p);
  g.closePath();
  g.fill();
  g.globalAlpha = 1;
  g.fillStyle = "hsl(42,100%,84%)";
  g.beginPath();
  g.arc(x, y, head, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fffef8";
  g.beginPath();
  g.arc(x, y, head * 0.55, 0, Math.PI * 2);
  g.fill();
}

function drawSteps(t) {
  const next = state.mode === "playing" || state.mode === "title" ? state.steps[state.cur + 1] : null;
  drawPlatform(home, t, true, false);
  for (let i = 0; i < state.steps.length; i++) {
    const s = state.steps[i];
    const y = sy(s.y);
    if (y < -80 || y > H + 80) continue;
    drawPlatform(s, t, i <= state.cur, s === next);
  }
  if (next && state.mode === "playing") drawApproach(next, t);
}

function drawEffects(t) {
  g.globalCompositeOperation = "lighter";
  for (const b of beams) {
    const u = (t - b.start) / b.dur;
    if (u < 0 || u >= 1) continue;
    const w = b.w * S * (0.45 + u * 0.25);
    const h = S * (1.6 + u * 1.2);
    g.globalAlpha = Math.pow(1 - u, 1.6) * 0.7 * b.strength;
    g.drawImage(beamSprite, sx(b.x) - w / 2, sy(b.y) - h, w, h);
  }
  for (const r of ripples) {
    const u = (t - r.start) / r.dur;
    if (u < 0 || u >= 1) continue;
    const rx = ((r.w * S) / 2) * (1 + u * 1.8);
    g.globalAlpha = Math.pow(1 - u, 2) * 0.9;
    g.strokeStyle = `hsl(${r.hue},100%,84%)`;
    g.lineWidth = Math.max(1, 3 * (1 - u));
    g.beginPath();
    g.ellipse(sx(r.x), sy(r.y), rx, rx * 0.3, 0, 0, Math.PI * 2);
    g.stroke();
  }
}

function drawParticles() {
  g.globalCompositeOperation = "lighter";
  for (const p of particles) {
    const f = p.age / p.life;
    drawGlow(glow(p.hue, 100, p.light), sx(p.x), sy(p.y), p.size * S * 2.4 * (1 - f * 0.4), Math.pow(1 - f, 1.3) * p.alpha);
  }
}

// The wisp: a little flame with a face, glowing brighter the longer the streak.
function drawWisp(t) {
  let ox = 0;
  let oy = 0;
  if (wisp.bump) {
    const u = (t - wisp.bump.start) / 0.32;
    if (u >= 1) wisp.bump = null;
    else {
      ox = wisp.bump.dir * 0.4 * Math.sin(Math.PI * u) * (1 - u * 0.4);
      oy = -0.06 * Math.sin(Math.PI * u);
    }
  }
  const bob = wisp.hopStart >= 0 ? 0 : Math.sin(t * 2.6) * 0.035;
  const x = sx(wisp.x + ox);
  const y = sy(wisp.y + HOVER + bob + oy);
  const r = 0.21 * S;

  g.globalCompositeOperation = "lighter";
  drawGlow(glow(34, 100, 68), x, y - r * 0.4, r * (9 + state.energy * 6), 0.55 + 0.25 * state.energy);
  drawGlow(glow(46, 100, 88), x, y - r * 0.3, r * 3.6, 0.8);

  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 1;
  g.save();
  g.translate(x, y + r);
  g.scale(1 + wisp.squash * 0.3, 1 - wisp.squash * 0.3);
  g.translate(0, -r);
  // The flame's tip flickers and trails behind the way it's flying.
  const lean = clamp(wisp.vx * 0.12, -0.6, 0.6);
  const tipX = (Math.sin(t * 6.3) * 0.14 - lean) * r;
  const tipY = -r * (2.1 + Math.sin(t * 4.1) * 0.12);
  g.beginPath();
  g.moveTo(tipX, tipY);
  g.bezierCurveTo(r * 0.3 + tipX * 0.3, -r * 1.3, r * 1.05, -r * 0.6, r, 0);
  g.arc(0, 0, r, 0, Math.PI);
  g.bezierCurveTo(-r * 1.05, -r * 0.6, -r * 0.3 + tipX * 0.3, -r * 1.3, tipX, tipY);
  g.closePath();
  const body = g.createRadialGradient(0, r * 0.1, 0, 0, -r * 0.2, r * 2);
  body.addColorStop(0, "#fffef6");
  body.addColorStop(0.35, "#fff3cf");
  body.addColorStop(0.7, "#ffd27e");
  body.addColorStop(1, "#ffab5e");
  g.fillStyle = body;
  g.fill();

  // Face: eyes looking the way it's going, blinking now and then, and rosy cheeks.
  const look = wisp.look * r * 0.22;
  const b = (t - wisp.blinkAt) / 0.14;
  const blink = b >= 0 && b < 1 ? Math.sin(Math.PI * b) : 0;
  for (const side of [-1, 1]) {
    const ex = look + side * r * 0.34;
    g.fillStyle = "#6a3b2c";
    g.beginPath();
    g.ellipse(ex, -r * 0.08, r * 0.1, r * 0.15 * (1 - blink * 0.85), 0, 0, Math.PI * 2);
    g.fill();
    if (blink < 0.5) {
      g.fillStyle = "rgba(255,255,255,0.9)";
      g.beginPath();
      g.arc(ex - r * 0.03, -r * 0.14, r * 0.035, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = "rgba(255,130,140,0.35)";
    g.beginPath();
    g.ellipse(look + side * r * 0.55, r * 0.2, r * 0.13, r * 0.07, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

// Arrows beside the wisp pointing to the next step, once the player seems unsure.
function drawHint(t) {
  if (state.mode !== "playing") return;
  const next = state.steps[state.cur + 1];
  if (!next) return;
  const due = expectedNext();
  const unsure = state.cur < 0 ? t - state.startedAt > 0.8 : t > due + Math.max(0.6, due - state.lastHit);
  if (!unsure) return;
  const d = next.dir;
  const size = Math.max(6, S * 0.1);
  const x = sx(wisp.x) + d * S * 0.5;
  const y = sy(wisp.y + HOVER);
  const wave = Math.sin(t * 5);
  g.globalCompositeOperation = "source-over";
  g.lineCap = "round";
  g.lineJoin = "round";
  g.lineWidth = Math.max(2, S * 0.035);
  g.strokeStyle = "#fffaf0";
  for (let k = 0; k < 2; k++) {
    const cx = x + d * k * size * 1.3 + d * wave * size * 0.25;
    g.globalAlpha = (0.55 + 0.35 * wave) * (1 - k * 0.35);
    g.beginPath();
    g.moveTo(cx - d * size * 0.5, y - size);
    g.lineTo(cx + d * size * 0.5, y);
    g.lineTo(cx - d * size * 0.5, y + size);
    g.stroke();
  }
}

function drawTexts(t) {
  g.globalCompositeOperation = "source-over";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `italic 600 ${Math.round(clamp(S * 0.26, 13, 22))}px Georgia, "Times New Roman", serif`;
  for (const tx of texts) {
    const u = (t - tx.start) / 0.9;
    if (u < 0 || u >= 1) continue;
    g.globalAlpha = u < 0.15 ? u / 0.15 : Math.pow(1 - (u - 0.15) / 0.85, 1.5);
    const x = sx(tx.x);
    const y = sy(tx.y + 0.8 + u * 0.4);
    // A soft dark edge keeps the pale words readable against the bright sky.
    g.strokeStyle = "rgba(130,45,85,0.45)";
    g.lineWidth = 3;
    g.lineJoin = "round";
    g.strokeText(tx.text, x, y + 1);
    g.fillStyle = tx.color;
    g.fillText(tx.text, x, y);
  }
}

function drawVignette() {
  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 1 - state.radiance * 0.6;
  g.fillStyle = vignette;
  g.fillRect(0, 0, W, H);
}

// A tap lights up the half of the screen it landed on, and on touch screens a left and a right pad
// in the bottom corners show which half hops which way.
function drawTouchPads(t) {
  if (state.mode !== "playing") return;
  g.globalCompositeOperation = "lighter";
  for (const d of [-1, 1]) {
    const glowFor = 1 - (t - halfFlash[d]) / 0.35;
    if (glowFor <= 0) continue;
    const edge = d < 0 ? 0 : W;
    const wash = g.createLinearGradient(edge, 0, W / 2, 0);
    wash.addColorStop(0, "rgba(255,236,214,0.32)");
    wash.addColorStop(1, "rgba(255,236,214,0)");
    g.globalAlpha = glowFor * glowFor;
    g.fillStyle = wash;
    g.fillRect(d < 0 ? 0 : W / 2, 0, W / 2, H);
  }
  if (!isTouch) return;
  g.globalCompositeOperation = "source-over";
  g.lineCap = "round";
  g.lineJoin = "round";
  for (const d of [-1, 1]) {
    const x = d < 0 ? W * 0.14 : W * 0.86;
    const y = H - 70;
    const pressed = Math.exp(-(t - zoneFlash[d]) * 6);
    g.globalAlpha = 0.16 + 0.3 * pressed;
    g.fillStyle = "#fff6ee";
    g.beginPath();
    g.arc(x, y, 30, 0, Math.PI * 2);
    g.fill();
    g.globalAlpha = 0.6 + 0.4 * pressed;
    g.strokeStyle = "#fff6ee";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(x - d * 5, y - 10);
    g.lineTo(x + d * 6, y);
    g.lineTo(x - d * 5, y + 10);
    g.stroke();
  }
}

function draw() {
  const t = now();
  const amb = clockMs() / 1000; // the sky keeps drifting, even while paused
  S = unit * cam.zoom;
  g.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawSky();
  drawLight(amb);
  drawClouds(false, amb);
  drawMotes(amb);
  drawThread();
  drawSteps(t);
  drawEffects(t);
  drawParticles();
  drawSparkPath(t);
  drawWisp(t);
  drawSpark(t);
  drawHint(t);
  drawClouds(true, amb);
  drawTexts(t);
  drawVignette();
  drawTouchPads(t);
}

// ---------- UI ----------
const ui = {
  overlay: document.getElementById("overlay"),
  title: document.getElementById("title"),
  message: document.getElementById("message"),
  play: document.getElementById("play"),
  controls: document.getElementById("controls"),
  song: document.getElementById("song"),
  streakPill: document.getElementById("streak-pill"),
  streak: document.getElementById("streak"),
  piano: document.getElementById("piano"),
  sound: document.getElementById("sound"),
  pause: document.getElementById("pause"),
  progress: document.getElementById("progress-bar"),
  songCredit: document.getElementById("song-credit"),
  listen: document.getElementById("listen"),
  stars: document.getElementById("stars"),
  songs: document.getElementById("songs"),
  again: document.getElementById("again"),
  menu: document.getElementById("menu"),
};

const WELCOME = ui.message.textContent;
ui.controls.textContent = isTouch
  ? "Tap the right side of the screen to hop right, the left side to hop left."
  : "← → or A D to hop · P to pause · M to mute";

function updateHud() {
  ui.streak.textContent = state.streak;
  ui.streakPill.hidden = state.mode !== "playing" || state.streak < 2;
  ui.progress.style.width = `${(state.steps.length ? (state.cur + 1) / state.steps.length : 0) * 100}%`;
}

function starRow(count, className) {
  const row = document.createElement("span");
  row.className = className;
  row.setAttribute("aria-label", `${count} of 3 stars`);
  for (let i = 0; i < 3; i++) {
    const star = document.createElement("span");
    star.className = i < count ? "on" : "";
    star.textContent = "★";
    star.setAttribute("aria-hidden", "true");
    row.append(star);
  }
  return row;
}

// The card over the game: the song list, a pause, or a finished song's stars.
// Songs from published scores credit them under the card.
function showSongCredit() {
  ui.songCredit.textContent = state.song.credit || "";
  ui.songCredit.hidden = !state.song.credit;
}

function showCard({ title, message, button, stars = null, list = false, again = false, againLabel = "Play again", menu = false }) {
  showSongCredit();
  ui.title.textContent = title;
  ui.message.textContent = message;
  ui.play.textContent = button;
  ui.stars.replaceChildren(...(stars === null ? [] : [starRow(stars, "stars")]));
  ui.stars.hidden = stars === null;
  ui.songs.hidden = !list;
  ui.again.hidden = !again;
  ui.again.textContent = againLabel;
  ui.menu.hidden = !menu;
  ui.overlay.hidden = false;
  if (list) renderSongs();
}

function renderSongs() {
  ui.songs.replaceChildren(
    ...SONGS.map((song, i) => {
      const open = unlocked(i);
      const row = document.createElement("button");
      row.type = "button";
      row.className = `song${i === state.songIndex ? " current" : ""}`;
      row.disabled = !open;
      const number = document.createElement("span");
      number.className = "n";
      number.textContent = i + 1;
      const name = document.createElement("span");
      name.className = "name";
      name.textContent = song.title;
      row.append(number, name);
      if (open) {
        row.append(starRow(starsFor(song), "song-stars"));
      } else {
        const lock = document.createElement("span");
        lock.className = "lock";
        lock.textContent = "🔒";
        lock.setAttribute("aria-hidden", "true");
        row.append(lock);
        row.title = `Get ${STARS_TO_UNLOCK} stars on ${SONGS[i - 1].title} to unlock`;
        row.setAttribute("aria-label", `${song.title}, locked. ${row.title}.`);
      }
      row.addEventListener("click", () => startGame(i));
      return row;
    })
  );
  // Keep the chosen song in view without scrolling the page around the game.
  const current = ui.songs.querySelector(".current");
  if (current) ui.songs.scrollTop = current.offsetTop - (ui.songs.clientHeight - current.offsetHeight) / 2;
}

// The piano pill shows while the current song's recordings are still on their way.
function showPianoStatus() {
  const { done, total } = pianoProgress(songNotes(state.song));
  ui.piano.hidden = done >= total;
  ui.piano.textContent = `Piano ${Math.round((done / Math.max(1, total)) * 100)}%`;
}

// ---------- Listening ----------
// The play button beside the song's name plays the whole song as written, at its own tempo:
// melody, left hand and closing chord. Any tap or hop stops it.
let listening = null; // { endsAt } while the song plays

async function startListening() {
  unlockAudio();
  const { song } = state;
  if (!song.melody) {
    ui.listen.textContent = "…";
    try {
      await loadSong(song);
    } catch {
      updateListenButton();
      return;
    }
    if (state.song !== song) return; // the player moved on while it loaded
  }
  silence();
  const spb = 60 / song.bpm;
  const start = song.melody[0].beat;
  const lead = 0.15; // a breath before the first note
  const at = (beat) => lead + (beat - start) * spb;
  for (const n of song.melody) {
    const velocity = (n.velocity ?? 0.62 + accentOf(song, n.beat)) + 0.02;
    later(at(n.beat), (time) => playPiano(n.midi, { velocity, hold: n.beats * spb + 0.3, at: time }));
  }
  for (const a of song.accompaniment) {
    later(at(a.beat), (time) => {
      const hold = a.beats ? a.beats * spb + 0.15 : 2 * spb + 0.4;
      for (const midi of a.notes) playPiano(midi, { velocity: a.velocity, hold, at: time });
    });
  }
  const last = song.melody[song.melody.length - 1];
  const end = at(last.beat + last.beats);
  song.ending.forEach((midi, k) => later(end + k * 0.075, (time) => playPiano(midi, { velocity: 0.38 + k * 0.03, hold: 3.5, at: time })));
  listening = { endsAt: performance.now() + (end + 2.5) * 1000 };
  updateListenButton();
}

function stopListening() {
  if (!listening) return;
  listening = null;
  silence();
  updateListenButton();
}

function updateListenButton() {
  ui.listen.textContent = listening ? "■" : "▶";
  ui.listen.classList.toggle("playing", !!listening);
  ui.listen.setAttribute("aria-label", listening ? "Stop the song" : "Listen to the song");
}

ui.listen.addEventListener("click", () => (listening ? stopListening() : startListening()));

function selectSong(index) {
  state.songIndex = index;
  state.song = SONGS[index];
  store(SONG_KEY, SONGS[index].id);
}

// A fresh climb: a new random path up the same song. An imported piece that hasn't loaded yet
// gets its steps once it arrives, if it's still the one on show.
function reset() {
  const { song } = state;
  state.steps = buildSteps(song);
  if (!song.melody) {
    loadSong(song)
      .then(() => {
        if (state.song === song && state.mode === "title") reset();
      })
      .catch(() => {});
  }
  Object.assign(state, {
    cur: -1,
    spb: 60 / state.song.bpm,
    streak: 0,
    bestStreak: 0,
    counts: { perfect: 0, great: 0, good: 0, off: 0 },
    wrong: 0,
    lockUntil: 0,
    endAt: Infinity,
    outro: null,
    radiance: 0,
    tintAt: Infinity,
  });
  Object.assign(wisp, { x: 0, y: 0, groundY: 0, hopStart: -1, vx: 0, squash: 0, bump: null });
  Object.assign(cam, { x: 0, y: 0, zoom: 1 });
  particles.length = ripples.length = beams.length = texts.length = 0;
  ui.song.textContent = state.song.title;
}

// Starts a song, first fetching its notes if it's an imported piece that hasn't loaded yet.
async function startGame(index = state.songIndex) {
  if (!unlocked(index)) return;
  unlockAudio();
  const song = SONGS[index];
  if (!song.melody) {
    const label = ui.play.textContent;
    ui.play.textContent = "Loading…";
    try {
      await loadSong(song);
    } catch {
      ui.play.textContent = "Couldn't load. Try again";
      return;
    }
    ui.play.textContent = label;
  }
  stopListening();
  silence(); // the last song's closing chord would ring on into the new one
  if (state.mode === "paused") pausedFor += performance.now() - pausedAt;
  selectSong(index);
  reset();
  loadPiano(songNotes(state.song), showPianoStatus); // in case this song's recordings aren't in yet
  state.mode = "playing";
  state.startedAt = state.lastHit = now();
  ui.overlay.hidden = true;
  ui.pause.hidden = false;
  state.tintTarget = state.song.chords[0].hue;
  sfx.chime();
  showPianoStatus();
  updateHud();
}

// Back to the song list.
function showMenu() {
  stopListening();
  silence();
  if (state.mode === "paused") pausedFor += performance.now() - pausedAt;
  state.mode = "title";
  reset();
  ui.pause.hidden = true;
  showPianoStatus();
  updateHud();
  showCard({ title: "Wiz o Wisp", message: WELCOME, button: "Play", list: true });
}

// What Play (or Space, or Enter) does on each card.
function playButton() {
  if (state.mode === "paused") togglePause();
  else if (state.mode === "done" && unlocked(state.songIndex + 1)) startGame(state.songIndex + 1);
  else startGame(state.songIndex);
}

// On the song list, up and down choose among the open songs.
function chooseSong(step) {
  let i = state.songIndex + step;
  while (i >= 0 && i < SONGS.length && !unlocked(i)) i += step;
  if (i < 0 || i >= SONGS.length) return;
  stopListening();
  selectSong(i);
  reset();
  showPianoStatus();
  renderSongs();
  showSongCredit();
}

function togglePause() {
  if (state.mode === "playing") {
    pausedAt = performance.now();
    state.mode = "paused";
    stopListening();
    cancelLater();
    showCard({
      title: "Paused",
      message: `${state.cur + 1} of ${state.steps.length} notes played.`,
      button: "Resume",
      again: true,
      againLabel: "Restart",
      menu: true,
    });
  } else if (state.mode === "paused") {
    pausedFor += performance.now() - pausedAt;
    state.mode = "playing";
    ui.overlay.hidden = true;
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

ui.play.addEventListener("click", playButton);
ui.again.addEventListener("click", () => startGame(state.songIndex));
ui.menu.addEventListener("click", showMenu);
ui.pause.addEventListener("click", togglePause);
ui.sound.addEventListener("click", toggleSound);
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.mode === "playing") togglePause();
});

window.addEventListener("keydown", (e) => {
  const k = e.key;
  if (k === "ArrowLeft" || k === "ArrowRight" || k === " ") e.preventDefault();
  if (e.repeat) return;
  unlockAudio();
  if (k === "ArrowLeft" || k === "a" || k === "A") return press(-1, e.timeStamp);
  if (k === "ArrowRight" || k === "d" || k === "D") return press(1, e.timeStamp);
  if (k === "m" || k === "M") return toggleSound();
  if (k === "p" || k === "P" || k === "Escape") return togglePause();
  if ((k === "ArrowUp" || k === "ArrowDown") && state.mode === "title") {
    e.preventDefault();
    return chooseSong(k === "ArrowUp" ? -1 : 1);
  }
  // Enter on a focused button already clicks it.
  if ((k === " " || k === "Enter") && e.target.tagName !== "BUTTON" && state.mode !== "playing") playButton();
});

// Tap (or click) anywhere on the right half of the screen to hop right, the left half to hop left.
canvas.addEventListener("pointerdown", (e) => {
  unlockAudio();
  const dir = e.clientX < W / 2 ? -1 : 1;
  halfFlash[dir] = now();
  press(dir, e.timeStamp);
});
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

// ---------- Layout ----------
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (!w || !h) return; // hidden or not laid out yet: keep the last good size
  W = w;
  H = h;
  canvas.width = Math.round(W * pixelRatio);
  canvas.height = Math.round(H * pixelRatio);
  unit = Math.min(W / 6.2, H / 9);
  vignette = g.createRadialGradient(W / 2, H * 0.5, Math.min(W, H) * 0.3, W / 2, H * 0.5, Math.hypot(W, H) * 0.6);
  vignette.addColorStop(0, "rgba(70,30,70,0)");
  vignette.addColorStop(1, "rgba(70,30,70,0.32)");
}

window.addEventListener("resize", resize);
resize();
selectSong(state.songIndex);
reset();
updateSoundButton();
updateHud();
showCard({ title: "Wiz o Wisp", message: WELCOME, button: "Play", list: true });

// The piano recordings load once the game itself has, so they never hold up the first screen:
// the chosen song's first, then every other song's in the background.
function startLoadingPiano() {
  loadPiano(songNotes(state.song), () => {
    showPianoStatus();
    const { done, total } = pianoProgress(songNotes(state.song));
    if (done >= total) loadPiano(SONGS.flatMap(songNotes), showPianoStatus);
  });
}
if (document.readyState === "complete") setTimeout(startLoadingPiano, 100);
else window.addEventListener("load", () => setTimeout(startLoadingPiano, 100));

// Opened from the game page's Play button: that was the player's "play", so skip the title card.
// Where the browser holds sound back until a tap inside the game, the first hop unlocks it.
if (new URLSearchParams(location.search).has("autostart")) startGame(state.songIndex);

// Local testing hook.
if (location.hostname === "localhost") {
  window.wizOWisp = {
    state,
    wisp,
    cam,
    press,
    startGame,
    togglePause,
    now,
    expectedNext,
    buildSteps,
    loadSong,
    cameraGoal,
    sparkAt,
    // Recording a demo video (tools/record-demo.mjs): the game runs on a clock the recorder steps
    // one frame at a time, and its sounds are logged, then rendered offline to match.
    record: {
      start() {
        virtualMs = performance.now();
        startRecording(() => virtualMs / 1000);
      },
      advance(seconds) {
        virtualMs += seconds * 1000;
        recordingTick();
        update(seconds);
        draw();
      },
      clock: () => virtualMs / 1000,
      render: (from, length) => renderRecording(from, length),
    },
    SONGS,
    // Drives one frame by hand, for when animation frames don't run (a hidden window).
    frame: (dt = 1 / 60) => {
      update(dt);
      draw();
    },
  };
}

// ---------- Keeping up on slow devices ----------
// If frames keep arriving slower than about 45 a second, render fewer pixels: the resolution steps
// down a quarter at a time, to no less than one pixel per CSS pixel.
const frameRate = { avg: 1 / 60, slowFor: 0 };

function watchFrameRate(seconds) {
  if (seconds > 0.25) return; // a hidden tab isn't slowness
  frameRate.avg += (seconds - frameRate.avg) * 0.1;
  frameRate.slowFor = frameRate.avg > 1 / 45 ? frameRate.slowFor + seconds : 0;
  if (frameRate.slowFor > 1.5 && pixelRatio > 1) {
    pixelRatio = Math.max(1, pixelRatio - 0.25);
    resize();
    frameRate.slowFor = 0;
    frameRate.avg = 1 / 60;
  }
}

let last = performance.now();
function frame(time) {
  if (virtualMs !== null) return requestAnimationFrame(frame); // a recording steps the game itself
  const seconds = (time - last) / 1000;
  last = time;
  watchFrameRate(seconds);
  update(Math.min(seconds, 0.05));
  draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

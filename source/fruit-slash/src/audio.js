// Sound effects and music, synthesized with the Web Audio API so the game ships no audio files.
// Browsers only allow audio after a user gesture, so nothing plays until unlockAudio() is
// called from a click, key press or touch.

const MUTE_KEY = "fruit-slash-muted";
const MASTER_VOLUME = 0.9;

let ctx = null;
let master = null;
let sfxBus = null;
let musicBus = null;
let noiseBuffer = null;
let fuseGain = null;
let lastFuse = 0;
let muted = loadMuted();

function loadMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function unlockAudio() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER_VOLUME;
    master.connect(ctx.destination);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.8;
    sfxBus.connect(master);
    musicBus = ctx.createGain();
    musicBus.gain.value = 0.26;
    musicBus.connect(master);
    noiseBuffer = makeNoiseBuffer();
    startFuseLoop();
  }
  if (ctx.state === "suspended" && !document.hidden) ctx.resume();
}

export const isMuted = () => muted;

export function setMuted(value) {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    // Not persisted; the setting still applies for this session.
  }
  if (master) master.gain.setTargetAtTime(value ? 0 : MASTER_VOLUME, ctx.currentTime, 0.03);
}

// Silence everything while the tab is in the background.
document.addEventListener("visibilitychange", () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend();
  else ctx.resume();
});

// ---------- Building blocks ----------
const midi = (note) => 440 * Math.pow(2, (note - 69) / 12);

function makeNoiseBuffer() {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function envelope(at, volume, attack, duration) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(volume, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  return g;
}

function tone({ type = "sine", from, to = from, duration, volume = 0.2, attack = 0.005, at, bus = sfxBus }) {
  if (!ctx) return;
  const t = at ?? ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + duration);
  osc.connect(envelope(t, volume, attack, duration)).connect(bus);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

function noise({ duration, volume = 0.2, type = "lowpass", from = 1000, to = from, q = 1, attack = 0.005, at, bus = sfxBus }) {
  if (!ctx) return;
  const t = at ?? ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, t);
  if (to !== from) filter.frequency.exponentialRampToValueAtTime(to, t + duration);
  src.connect(filter).connect(envelope(t, volume, attack, duration)).connect(bus);
  src.start(t, Math.random() * 1.5);
  src.stop(t + duration + 0.02);
}

function pluck(freq, at, volume, bus = musicBus) {
  tone({ type: "triangle", from: freq, duration: 0.35, volume, attack: 0.003, at, bus });
  tone({ from: freq * 2, duration: 0.12, volume: volume * 0.3, attack: 0.002, at, bus });
}

// ---------- Sound effects ----------
export const sfx = {
  // The blade cutting the air.
  swish() {
    noise({ duration: 0.16, volume: 0.13, type: "bandpass", from: 1800, to: 5200, q: 1.5, attack: 0.02 });
  },
  // A juicy cut: a wet crunch with a little squelch.
  slice() {
    if (!ctx) return;
    const t = ctx.currentTime;
    noise({ duration: 0.12, volume: 0.32, type: "bandpass", from: 3200, to: 900, q: 0.9 });
    noise({ duration: 0.22, volume: 0.2, type: "lowpass", from: 900, to: 200, at: t + 0.03 });
    tone({ from: 520 + Math.random() * 120, to: 180, duration: 0.14, volume: 0.1, at: t + 0.02 });
  },
  toss() {
    noise({ duration: 0.18, volume: 0.08, type: "lowpass", from: 300, to: 900, attack: 0.04 });
  },
  miss() {
    tone({ type: "square", from: 160, to: 90, duration: 0.25, volume: 0.1 });
    noise({ duration: 0.2, volume: 0.15, from: 400, to: 120 });
  },
  combo(count) {
    if (!ctx) return;
    const notes = [72, 76, 79, 84, 88];
    for (let i = 0; i < Math.min(count, notes.length); i++) pluck(midi(notes[i]), ctx.currentTime + i * 0.06, 0.16, sfxBus);
  },
  explode() {
    if (!ctx) return;
    const t = ctx.currentTime;
    noise({ duration: 1.2, volume: 0.6, from: 3000, to: 80, attack: 0.002 });
    tone({ from: 120, to: 35, duration: 0.8, volume: 0.45, at: t });
    tone({ type: "square", from: 80, to: 30, duration: 0.5, volume: 0.15, at: t + 0.05 });
  },
  start() {
    if (!ctx) return;
    [69, 72, 76, 81].forEach((n, i) => pluck(midi(n), ctx.currentTime + i * 0.07, 0.16, sfxBus));
  },
  gameOver() {
    if (!ctx) return;
    [76, 72, 69, 64].forEach((n, i) => pluck(midi(n), ctx.currentTime + i * 0.14, 0.15, sfxBus));
  },
  newBest() {
    if (!ctx) return;
    [72, 76, 79, 84, 79, 84].forEach((n, i) => pluck(midi(n), ctx.currentTime + i * 0.09, 0.15, sfxBus));
  },
  click() {
    tone({ type: "triangle", from: 880, duration: 0.05, volume: 0.07 });
  },
};

// A crackling hiss while bombs are on screen; level is 0..1.
function startFuseLoop() {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3500;
  fuseGain = ctx.createGain();
  fuseGain.gain.value = 0;
  src.connect(filter).connect(fuseGain).connect(sfxBus);
  src.start();
}

export function setFuse(level) {
  if (!fuseGain || Math.abs(level - lastFuse) < 0.02) return;
  lastFuse = level;
  fuseGain.gain.setTargetAtTime(level * 0.12, ctx.currentTime, 0.05);
}

// ---------- Music ----------
// A bouncy plucked loop in A minor pentatonic, four bars of eighth notes.
const BARS = [
  { root: 45, melody: [69, null, 72, 74, 76, null, 74, 72] },
  { root: 41, melody: [72, null, 69, 72, 74, null, 72, 69] },
  { root: 43, melody: [67, null, 69, 72, 74, null, 76, 74] },
  { root: 45, melody: [76, 74, 72, null, 69, 72, 69, null] },
];

let musicTimer = null;
let nextNoteTime = 0;
let eighth = 0;
const BPM = 118;

function playEighth(index, at) {
  const bar = BARS[Math.floor(index / 8) % BARS.length];
  const i = index % 8;
  const lead = bar.melody[i];
  if (lead !== null) pluck(midi(lead), at, 0.1);
  if (i === 0 || i === 3 || i === 4 || i === 6) {
    const note = i === 4 ? bar.root + 7 : bar.root;
    tone({ type: "triangle", from: midi(note), duration: 0.2, volume: 0.2, at, bus: musicBus });
  }
  if (i === 0 || i === 4) tone({ from: 110, to: 45, duration: 0.12, volume: 0.3, at, bus: musicBus });
  if (i === 2 || i === 6) noise({ duration: 0.06, volume: 0.06, type: "bandpass", from: 2500, q: 2, at, bus: musicBus });
}

function scheduleMusic() {
  while (nextNoteTime < ctx.currentTime + 0.15) {
    playEighth(eighth, nextNoteTime);
    nextNoteTime += 60 / BPM / 2;
    eighth = (eighth + 1) % (BARS.length * 8);
  }
}

export function startMusic({ fromTop = false } = {}) {
  if (!ctx || musicTimer) return;
  if (fromTop) eighth = 0;
  nextNoteTime = ctx.currentTime + 0.06;
  musicTimer = setInterval(scheduleMusic, 25);
  scheduleMusic();
}

export function stopMusic() {
  clearInterval(musicTimer);
  musicTimer = null;
}

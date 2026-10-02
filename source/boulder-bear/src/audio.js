// Sound effects and music, synthesized with the Web Audio API so the game ships no audio files.
// Browsers only allow audio after a user gesture, so nothing plays until unlockAudio() is
// called from a click, key press or touch.

const MUTE_KEY = "boulder-bear-muted";
const MASTER_VOLUME = 0.9;

let ctx = null;
let master = null;
let sfxBus = null;
let musicBus = null;
let noiseBuffer = null;
let rumbleGain = null;
let lastRumble = 0;
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
    musicBus.gain.value = 0.3;
    musicBus.connect(master);
    noiseBuffer = makeNoiseBuffer();
    startRumbleLoop();
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

// ---------- Sound effects ----------
export const sfx = {
  jump() {
    tone({ type: "square", from: 260, to: 620, duration: 0.16, volume: 0.1 });
    tone({ type: "triangle", from: 520, to: 1040, duration: 0.12, volume: 0.06 });
  },
  land() {
    noise({ duration: 0.09, volume: 0.14, from: 500 });
    tone({ from: 140, to: 70, duration: 0.1, volume: 0.2 });
  },
  landOnRock() {
    tone({ type: "triangle", from: 330, to: 220, duration: 0.08, volume: 0.16 });
    noise({ duration: 0.05, volume: 0.1, type: "bandpass", from: 1800, q: 3 });
  },
  step(high) {
    tone({ type: "triangle", from: high ? 520 : 440, to: high ? 420 : 360, duration: 0.04, volume: 0.05 });
  },
  // A cartoon swoosh: filtered noise that rises then falls, panned across in the direction of
  // the move (dir is -1 for left, 1 for right).
  lane(dir = 0) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const d = 0.26;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 1.6;
    band.frequency.setValueAtTime(400, t);
    band.frequency.exponentialRampToValueAtTime(2400, t + d * 0.45);
    band.frequency.exponentialRampToValueAtTime(700, t + d);
    let chain = src.connect(band).connect(envelope(t, 0.34, d * 0.4, d));
    if (ctx.createStereoPanner) {
      const pan = ctx.createStereoPanner();
      pan.pan.setValueAtTime(-0.5 * dir, t);
      pan.pan.linearRampToValueAtTime(0.7 * dir, t + d);
      chain = chain.connect(pan);
    }
    chain.connect(sfxBus);
    src.start(t, Math.random() * 1.5);
    src.stop(t + d + 0.02);
  },
  // Cartoon duck: a slide-whistle drop and a whoosh down, then a squeaky plush squish and a soft
  // thump as the teddy hits the ground.
  duck() {
    if (!ctx) return;
    const t = ctx.currentTime;
    tone({ type: "triangle", from: 900, to: 260, duration: 0.18, volume: 0.17, attack: 0.01 });
    noise({ duration: 0.16, volume: 0.16, type: "bandpass", from: 1800, to: 400, q: 1.2, attack: 0.02 });
    tone({ from: 1400, to: 1050, duration: 0.08, volume: 0.08, at: t + 0.12 });
    tone({ from: 160, to: 70, duration: 0.12, volume: 0.24, at: t + 0.1 });
  },
  drop() {
    noise({ duration: 0.12, volume: 0.09, type: "bandpass", from: 2200, to: 500, q: 2 });
  },
  crash() {
    noise({ duration: 0.55, volume: 0.45, from: 1400, to: 120 });
    tone({ type: "square", from: 220, to: 55, duration: 0.35, volume: 0.16 });
    tone({ from: 620, to: 160, duration: 0.45, volume: 0.14, at: ctx && ctx.currentTime + 0.08 });
  },
  start() {
    if (!ctx) return;
    [60, 64, 67, 72].forEach((n, i) => musicBox(midi(n), ctx.currentTime + i * 0.07, 0.14, sfxBus));
  },
  newBest() {
    if (!ctx) return;
    [72, 76, 79, 84, 79, 84].forEach((n, i) => musicBox(midi(n), ctx.currentTime + i * 0.09, 0.14, sfxBus));
  },
  click() {
    tone({ type: "triangle", from: 880, duration: 0.05, volume: 0.07 });
  },
};

// Low rumble from the boulders, louder as they close in. level is 0..1.
function startRumbleLoop() {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 260;
  filter.Q.value = 0.7;
  rumbleGain = ctx.createGain();
  rumbleGain.gain.value = 0;
  src.connect(filter).connect(rumbleGain).connect(sfxBus);
  src.start();
}

export function setRumble(level) {
  if (!rumbleGain || Math.abs(level - lastRumble) < 0.02) return;
  lastRumble = level;
  rumbleGain.gain.setTargetAtTime(level * 0.5, ctx.currentTime, 0.08);
}

// ---------- Music ----------
// A cheerful music-box loop: I–vi–IV–V in C, four bars of eighth notes.
function musicBox(freq, at, volume, bus = musicBus) {
  tone({ from: freq, duration: 0.45, volume, attack: 0.004, at, bus });
  tone({ from: freq * 4, duration: 0.12, volume: volume * 0.25, attack: 0.002, at, bus }); // the "tink"
}

const BARS = [
  { root: 48, fifth: 55, melody: [72, null, 76, 79, 76, null, 72, 74] }, // C
  { root: 45, fifth: 52, melody: [72, null, 69, 72, 76, null, 74, 72] }, // Am
  { root: 41, fifth: 48, melody: [69, null, 72, 77, 76, null, 72, 69] }, // F
  { root: 43, fifth: 50, melody: [71, 74, 79, null, 77, 74, 71, null] }, // G
];
const BASS = ["root", null, null, "root", "fifth", null, "octave", null];

let musicTimer = null;
let nextNoteTime = 0;
let eighth = 0;
let bpm = 112;

function playEighth(index, at) {
  const bar = BARS[Math.floor(index / 8) % BARS.length];
  const i = index % 8;
  const lead = bar.melody[i];
  if (lead !== null) musicBox(midi(lead), at, 0.11);

  const bass = BASS[i];
  if (bass) {
    const note = bass === "fifth" ? bar.fifth : bass === "octave" ? bar.root + 12 : bar.root;
    tone({ type: "triangle", from: midi(note), duration: 0.22, volume: 0.22, at, bus: musicBus });
  }

  if (i === 0 || i === 4) tone({ from: 120, to: 45, duration: 0.14, volume: 0.35, at, bus: musicBus }); // kick
  if (i === 2 || i === 6) noise({ duration: 0.1, volume: 0.12, type: "bandpass", from: 1600, q: 1.2, at, bus: musicBus }); // clap
  noise({ duration: 0.03, volume: 0.035, type: "highpass", from: 7000, at, bus: musicBus }); // hi-hat
}

function scheduleMusic() {
  // Schedule slightly ahead of the audio clock so timer jitter never causes gaps.
  while (nextNoteTime < ctx.currentTime + 0.15) {
    playEighth(eighth, nextNoteTime);
    nextNoteTime += 60 / bpm / 2;
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

export function setMusicTempo(value) {
  bpm = value;
}

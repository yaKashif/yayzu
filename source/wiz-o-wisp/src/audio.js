// Sound for Wiz o Wisp, all through the Web Audio API.
//
// The piano is the Salamander Grand Piano (Alexander Holm, CC BY 3.0): one recording every three
// semitones, pitched up or down for the notes in between. The recordings download after the game
// has loaded, and until each one arrives a soft synthesized piano plays its notes instead.
// Everything shares one long, warm reverb.
//
// Browsers only allow audio after a user gesture, so nothing plays until unlockAudio() is called
// from a click, key press or touch.

const MUTE_KEY = "wiz-o-wisp-muted";
const MASTER_VOLUME = 0.9;
const SAMPLE_BASE = "https://tonejs.github.io/audio/salamander/";
const SAMPLE_NAMES = { 0: "C", 3: "Ds", 6: "Fs", 9: "A" }; // recorded every three semitones from A0
const MAX_VOICES = 36;
const LOOKAHEAD = 0.08; // seconds: scheduled notes are handed to the audio clock this far ahead

let ctx = null;
let master = null;
let reverb = null;
let pianoBus = null;
let fxBus = null;
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
    ctx = new AudioCtx({ latencyHint: "interactive" });
    master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER_VOLUME;
    // A gentle limiter: chords ringing into the reverb add up.
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -12;
    limiter.knee.value = 10;
    limiter.ratio.value = 4;
    limiter.attack.value = 0.005;
    limiter.release.value = 0.25;
    master.connect(limiter).connect(ctx.destination);
    reverb = ctx.createConvolver();
    reverb.buffer = makeImpulse(3.6, 2.4);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    reverb.connect(wet).connect(master);
    pianoBus = makeBus(0.85, 0.34);
    fxBus = makeBus(0.5, 0.8);
    for (const sample of samples.values()) decode(sample);
    setInterval(flushScheduled, 25);
  }
  if (ctx.state === "suspended" && !document.hidden) ctx.resume().catch(() => {});
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
  else ctx.resume().catch(() => {});
});

// ---------- Building blocks ----------
const freq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

// A bus is a gain that feeds the mix directly and the reverb through a send.
function makeBus(dryLevel, sendLevel) {
  const input = ctx.createGain();
  const dry = ctx.createGain();
  dry.gain.value = dryLevel;
  input.connect(dry).connect(master);
  const send = ctx.createGain();
  send.gain.value = sendLevel;
  input.connect(send).connect(reverb);
  return input;
}

// A hall made of noise: darkened a little, since high frequencies die first in a real room, and
// fading out over `seconds`.
function makeImpulse(seconds, decay) {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * seconds);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    let dark = 0;
    for (let i = 0; i < length; i++) {
      dark += (Math.random() * 2 - 1 - dark) * 0.3;
      data[i] = dark * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

function tone({ type = "sine", from, to = from, duration, volume, attack = 0.005, at, bus = fxBus }) {
  if (!ctx) return;
  const t = at ?? ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + duration);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(volume, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(env).connect(bus);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

// ---------- The piano ----------
const samples = new Map(); // MIDI note of a recording -> { midi, data, buffer }
const nearestRecording = (midi) => Math.min(108, Math.max(21, 21 + Math.round((midi - 21) / 3) * 3));
const sampleUrl = (midi) => `${SAMPLE_BASE}${SAMPLE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}.mp3`;

// Fetches the recordings the given notes need, in the order the notes are listed, calling
// onProgress as each one arrives. Downloads only; decoding waits for the audio context, which
// waits for the player's first tap or key.
export function loadPiano(notes, onProgress = () => {}) {
  const wanted = [...new Set(notes.map(nearestRecording))].filter((midi) => !samples.has(midi));
  for (const midi of wanted) {
    const sample = { midi, data: null, buffer: null, settled: false };
    samples.set(midi, sample);
    fetch(sampleUrl(midi), { priority: "low" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((data) => {
        sample.data = data;
        if (ctx) decode(sample);
      })
      .catch(() => {
        // Its notes keep the synthesized piano.
      })
      .finally(() => {
        sample.settled = true;
        onProgress();
      });
  }
  onProgress();
}

// How many of the recordings the given notes need have arrived (or failed for good).
export function pianoProgress(notes) {
  const wanted = [...new Set(notes.map(nearestRecording))];
  return { done: wanted.filter((midi) => samples.get(midi)?.settled).length, total: wanted.length };
}

function decode(sample) {
  if (!sample.data) return;
  const data = sample.data;
  sample.data = null;
  ctx
    .decodeAudioData(data)
    .then((buffer) => (sample.buffer = buffer))
    .catch(() => {});
}

// The closest recording that's ready, if one is near enough to pitch.
function recordingFor(midi) {
  for (let d = 0; d <= 6; d++) {
    for (const m of d ? [midi - d, midi + d] : [midi]) {
      const sample = samples.get(m);
      if (sample?.buffer) return sample;
    }
  }
  return null;
}

const voices = [];

// Plays a note now or at audio time `at`. `hold` is how long the key stays down: after it the
// damper falls and the note fades.
export function playPiano(midi, { velocity = 0.7, hold = 1.5, at = 0 } = {}) {
  if (!ctx) return;
  const t = Math.max(at, ctx.currentTime);
  const out = ctx.createGain();
  const level = Math.pow(velocity, 1.3) * 0.95;
  out.gain.setValueAtTime(level, t);
  out.gain.setTargetAtTime(0, t + hold, 0.3);
  const brightness = ctx.createBiquadFilter();
  brightness.type = "lowpass";
  brightness.frequency.value = 1500 + velocity * velocity * 9000; // soft notes are darker, as on a real piano
  brightness.connect(out).connect(pianoBus);
  const end = t + hold + 1.6;

  const recording = recordingFor(midi);
  let sources;
  if (recording) {
    const src = ctx.createBufferSource();
    src.buffer = recording.buffer;
    src.playbackRate.value = Math.pow(2, (midi - recording.midi) / 12);
    src.connect(brightness);
    src.start(t);
    src.stop(end);
    sources = [src];
  } else {
    sources = synthPiano(midi, t, end, brightness);
  }

  const voice = { out, sources };
  sources[0].onended = () => {
    const i = voices.indexOf(voice);
    if (i > -1) voices.splice(i, 1);
  };
  voices.push(voice);
  while (voices.length > MAX_VOICES) {
    const oldest = voices.shift();
    oldest.out.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
    for (const src of oldest.sources) src.stop(ctx.currentTime + 0.2);
  }
}

// A soft, bell-like stand-in for the piano: a few sine partials, the higher ones dying faster.
function synthPiano(midi, t, end, out) {
  const f = freq(midi);
  const sustain = midi < 60 ? 1.5 : 1;
  const partials = [
    [1, 0.42, 2.2],
    [2, 0.16, 0.8],
    [3, 0.06, 0.4],
    [4.02, 0.03, 0.22],
  ];
  return partials.map(([ratio, gain, decay]) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = f * ratio;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(gain, t + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay * sustain);
    osc.connect(env).connect(out);
    osc.start(t);
    osc.stop(end);
    return osc;
  });
}

// ---------- Scheduling ----------
// Notes that belong later in the music (the accompaniment between melody notes) wait here, so a
// player who hops on early can cancel the ones that would now clash.
const scheduled = [];

export function later(delay, fn) {
  if (!ctx) return;
  scheduled.push({ at: ctx.currentTime + delay, fn });
  flushScheduled();
}

export function cancelLater() {
  scheduled.length = 0;
}

function flushScheduled() {
  const horizon = ctx.currentTime + LOOKAHEAD;
  for (let i = 0; i < scheduled.length; ) {
    if (scheduled[i].at <= horizon) {
      const { at, fn } = scheduled.splice(i, 1)[0];
      fn(at);
    } else i++;
  }
}

// Cuts every note still sounding or waiting to sound, with a fade too quick to hear as one but
// slow enough not to click: for starting over.
export function silence() {
  cancelLater();
  if (!ctx) return;
  const t = ctx.currentTime;
  for (const voice of voices) {
    voice.out.gain.setTargetAtTime(0, t, 0.04);
    for (const src of voice.sources) {
      try {
        src.stop(t + 0.25);
      } catch {
        // Already stopped.
      }
    }
  }
  voices.length = 0;
}

// ---------- Sound effects ----------
export const sfx = {
  // Hopping the wrong way: a soft, muffled knock.
  bump() {
    tone({ from: 190, to: 95, duration: 0.2, volume: 0.16, attack: 0.004 });
  },
  // A perfect note: two faint bells far above it.
  shimmer(at = 0) {
    if (!ctx) return;
    const t = Math.max(at, ctx.currentTime);
    tone({ from: freq(96), duration: 0.9, volume: 0.03, attack: 0.002, at: t });
    tone({ from: freq(103), duration: 0.7, volume: 0.022, attack: 0.002, at: t + 0.05 });
  },
  // Starting out: a little rising sparkle.
  chime() {
    if (!ctx) return;
    [84, 88, 91, 96].forEach((n, i) => tone({ from: freq(n), duration: 0.8, volume: 0.035, attack: 0.003, at: ctx.currentTime + i * 0.07 }));
  },
};

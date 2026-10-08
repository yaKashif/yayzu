// Naseeb's sound, made as it plays rather than from recordings, from what the physics is doing.
//
// The engine: a straight six fires a cylinder every third of a turn, so six exhaust pulses every
// two turns of the crank: 40 a second at idle, 200 at the governor. Each pulse is a short puff of
// pressure, a little stronger or weaker and a little early or late cylinder to cylinder, and the
// exhaust pipe and silencer ring with it. More throttle, harder pulses and a brighter sound; off the
// throttle, a softer burble. The tires: a hiss that rises with speed and the hum of the tread
// blocks; a crunch of stones on gravel and dirt, a swish in sand, grass and mud; a squeal when
// they slide on hard ground, a scrabble when they slide on loose; and a thump when one lands hard.
//
// The sound is worked out a sample at a time in an audio worklet, away from the page's own work;
// the game sends it what's happening each frame.

const PROCESSOR = `
const TAU = Math.PI * 2;
// Rings at f, its bandwidth set by q, like a pipe or a panel struck; at f it passes its input
// through at about the same strength, whatever f is.
class Ring {
  constructor(f, q) {
    const w = (TAU * f) / sampleRate;
    const r = Math.exp(-w / (2 * q));
    this.a1 = 2 * r * Math.cos(w);
    this.a2 = -r * r;
    this.g = (1 - r) * 2 * Math.sin(w);
    this.y1 = this.y2 = 0;
  }
  run(x) {
    const y = this.a1 * this.y1 + this.a2 * this.y2 + this.g * x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}
// Smooths: follows its input at a rate set by k (0 to 1 a sample).
class Smooth {
  constructor() {
    this.y = 0;
  }
  run(x, k) {
    this.y += (x - this.y) * k;
    return this.y;
  }
}
const toward = (hz) => 1 - Math.exp((-TAU * hz) / sampleRate);

class NaseebSound extends AudioWorkletProcessor {
  constructor() {
    super();
    this.want = { rpm: 800, load: 0, roll: 0, hard: 0, lug: 0, squeal: 0, scrub: 0, crunch: 0, soft: 0, inside: 0 };
    this.is = { ...this.want };
    this.thump = 0;
    this.port.onmessage = (e) => {
      const { thump, ...rest } = e.data;
      Object.assign(this.want, rest);
      if (thump) this.thump = Math.max(this.thump, thump);
    };
    this.seed = 12345;
    // The engine: where it is in its four strokes (0 to 1), which cylinder fires next, and how
    // each one differs.
    this.cycle = 0;
    this.next = 0;
    this.early = [0, 0.012, -0.008, 0.01, -0.014, 0.006];
    this.strength = [1, 0.92, 1.05, 0.96, 1.03, 0.9];
    this.kick = 0;
    this.puff = [new Smooth(), new Smooth()];
    this.pipes = [new Ring(82, 3), new Ring(165, 4), new Ring(420, 2.5), new Ring(1150, 2)];
    this.bright = [new Smooth(), new Smooth()];
    this.dc = new Smooth();
    this.intake = new Smooth();
    // The tires.
    this.hissLow = new Smooth();
    this.hissHigh = new Smooth();
    this.swish = new Smooth();
    this.stones = [new Ring(2300, 1.6), new Ring(3600, 2.2)];
    this.squealAt = 0;
    this.wobble = 0;
    this.squealGrain = new Smooth();
    this.scrabble = new Ring(1300, 1.2);
    this.lugAt = 0;
    this.thudAt = 0;
    this.thudTone = 0;
    this.thudGrit = 0;
  }
  noise() {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 2147483648 - 1;
  }
  process(inputs, outputs) {
    const left = outputs[0][0];
    const right = outputs[0][1] || left;
    const n = left.length;
    // Follow what the game says over about 40 ms, a block at a time.
    const ease = 1 - Math.exp(-n / (sampleRate * 0.04));
    for (const k in this.want) this.is[k] += (this.want[k] - this.is[k]) * ease;
    const s = this.is;
    const rpm = Math.max(250, s.rpm);
    const load = Math.max(0, Math.min(1, s.load));
    const puffK = 1 / (sampleRate * (0.0016 - 0.0007 * (rpm / 4000))); // a shorter puff when it's revving
    const brightK = toward(260 + rpm * 0.28 + load * 1900 - s.inside * 250);
    const engineLevel = (0.32 + 0.4 * load) * (1 + 0.3 * s.inside);
    if (this.thump) {
      this.thudTone = Math.max(this.thudTone, this.thump);
      this.thudGrit = Math.max(this.thudGrit, this.thump);
      this.thump = 0;
    }
    const toneFade = Math.exp(-1 / (sampleRate * 0.12));
    const gritFade = Math.exp(-1 / (sampleRate * 0.018));
    const stoneRate = (s.crunch * 420) / sampleRate;
    for (let i = 0; i < n; i++) {
      // The engine.
      this.cycle += rpm / 120 / sampleRate;
      if (this.cycle >= (this.next + this.early[this.next]) / 6) {
        this.kick += (0.3 + 0.7 * load) * this.strength[this.next] * (0.93 + 0.14 * (this.noise() * 0.5 + 0.5));
        this.next++;
        if (this.next === 6) {
          this.next = 0;
          this.cycle -= 1;
        }
      }
      const puff = this.puff[1].run(this.puff[0].run(this.kick * 40, puffK), puffK);
      this.kick = 0;
      let engine = puff;
      engine += this.pipes[0].run(puff) * 2.2 + this.pipes[1].run(puff) * 1.4 + this.pipes[2].run(puff) * 0.9 + this.pipes[3].run(puff) * 0.35;
      engine += this.intake.run(this.noise(), 0.3) * (0.03 + 0.12 * load * (rpm / 4000));
      engine = this.bright[1].run(this.bright[0].run(engine, brightK), brightK);
      engine -= this.dc.run(engine, toward(20)); // no steady push on the speaker
      engine = Math.tanh(engine * 7) * engineLevel;

      // The tires: hiss and tread hum with speed.
      const white = this.noise();
      const band = this.hissHigh.run(white, toward(1100)) - this.hissLow.run(white, toward(220));
      let tires = band * s.roll * (0.18 + 0.25 * s.hard);
      this.lugAt += s.lug / sampleRate;
      this.lugAt -= Math.floor(this.lugAt);
      tires += (this.lugAt - 0.5) * s.roll * s.hard * 0.06;
      // Stones and grit cracking under the tread.
      const hit = this.noise() * 0.5 + 0.5 < stoneRate ? (0.4 + 0.6 * (this.noise() * 0.5 + 0.5)) * 3 : 0;
      tires += (this.stones[0].run(hit) + this.stones[1].run(hit * 0.6)) * 0.5;
      // Sand, grass and mud.
      tires += this.swish.run(white, toward(380)) * s.soft * 0.9;
      // Sliding: a squeal on hard ground, a scrabble on loose.
      if (s.squeal > 0.002) {
        this.wobble += (TAU * 7) / sampleRate;
        this.squealAt += (880 + 45 * Math.sin(this.wobble) + 25 * this.noise()) / sampleRate;
        this.squealAt -= Math.floor(this.squealAt);
        const grain = 0.6 + 0.4 * this.squealGrain.run(white, toward(40)) * 4;
        tires += (Math.sin(TAU * this.squealAt) + 0.35 * Math.sin(2 * TAU * this.squealAt)) * grain * s.squeal * 0.22;
      }
      tires += this.scrabble.run(white) * s.scrub * 0.6;
      // A tire landing hard: a boom from the axle and the body's panels, and a crack of grit.
      this.thudAt += 55 / sampleRate;
      this.thudAt -= Math.floor(this.thudAt);
      const thud = Math.sin(TAU * this.thudAt) * this.thudTone * 0.9 + white * this.thudGrit * 0.3;
      this.thudTone *= toneFade;
      this.thudGrit *= gritFade;

      const out = Math.tanh((engine + tires * 1.6 + thud * 0.8) * 0.9) * 0.8;
      left[i] = out;
      right[i] = out;
    }
    return true;
  }
}
registerProcessor("naseeb-sound", NaseebSound);
`;

// How each surface sounds under a tire: hard (hums, squeals), stones (crunch), soft (swish), or
// slick (quiet).
const KIND = {
  asphalt: "hard",
  concrete: "hard",
  wet: "slick",
  gravel: "stones",
  grass: "soft",
  sand: "soft",
  mud: "soft",
  snow: "soft",
  ice: "slick",
  dirt: "stones",
  rock: "hard",
  wood: "hard",
};
const TREAD_PITCH = 0.065; // metres between the tread's blocks
const PEAK_TORQUE = 283;
const clamp = (x) => Math.max(0, Math.min(1, x));

export class Sound {
  constructor() {
    this.on = true;
    this.ready = false;
    this.lastLoads = [0, 0, 0, 0];
  }

  // Starts the sound; call from a tap or key press, so the browser lets it play.
  async start() {
    if (this.context) return;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context || !window.AudioWorkletNode) return;
    this.context = new Context();
    try {
      const url = URL.createObjectURL(new Blob([PROCESSOR], { type: "application/javascript" }));
      await this.context.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);
      this.node = new AudioWorkletNode(this.context, "naseeb-sound", { numberOfInputs: 0, outputChannelCount: [2] });
      this.volume = this.context.createGain();
      this.volume.gain.value = this.on ? 1 : 0;
      this.node.connect(this.volume).connect(this.context.destination);
      this.ready = true;
    } catch {
      this.context = null;
    }
  }

  // Browsers hold sound back until the player does something; any tap or key carries on.
  wake() {
    if (this.context && this.context.state === "suspended" && !this.paused) this.context.resume();
  }

  setOn(on) {
    this.on = on;
    if (this.volume) this.volume.gain.setTargetAtTime(on ? 1 : 0, this.context.currentTime, 0.05);
  }

  // Quiet while the page is hidden.
  pause(paused) {
    this.paused = paused;
    if (!this.context) return;
    if (paused) this.context.suspend();
    else this.context.resume();
  }

  // What the jeep is doing now. rate slows it all down in slow motion.
  update(sim, { inside = false, rate = 1 } = {}) {
    if (!this.ready) return;
    const quarter = (sim.mass * sim.g) / 4;
    let squeal = 0;
    let scrub = 0;
    let hard = 0;
    let stones = 0;
    let soft = 0;
    let thump = 0;
    sim.wheels.forEach((w, i) => {
      const c = w.contact;
      const load = c.normal / quarter;
      // A sudden jump in load: a tire landing, or hitting a log or a step.
      const rise = (load - this.lastLoads[i]) * quarter;
      this.lastLoads[i] = load;
      if (rise > 9000) thump = Math.max(thump, clamp(rise / 45000));
      if (c.normal <= 0) return;
      const kind = KIND[c.surface.id] || "hard";
      const sliding = clamp((Math.hypot(...c.tread) - 0.6) / 3) * Math.min(2, load);
      if (kind === "hard") {
        hard += 0.25;
        squeal += sliding;
      } else if (kind !== "slick") scrub += sliding;
      if (kind === "stones") stones += 0.25;
      if (kind === "soft") soft += 0.25;
    });
    const speed = Math.hypot(sim.v[0], sim.v[2]);
    this.node.port.postMessage({
      rpm: sim.rpm * rate,
      load: clamp(sim.engineTorque / PEAK_TORQUE),
      roll: clamp(speed / 22),
      hard,
      lug: (speed / TREAD_PITCH) * rate,
      squeal: clamp(squeal / 2),
      scrub: clamp(scrub / 2),
      crunch: stones * clamp(speed / 6),
      soft: soft * clamp(speed / 8),
      inside: inside ? 1 : 0,
      thump,
    });
  }
}

import { Sim, DEFAULTS, MOUNTAIN, CAR, ENGINE, GEARS } from "./physics.js";
import { World } from "./scene3d.js";
import { TIME_NAMES } from "./atmosphere.js";
import { Sound } from "./sound.js";

// Saved settings from before the FJ40 don't carry over.
const SETTINGS_KEY = "naseeb-fj40-settings";
const START = 6; // metres up the road the jeep starts
const DROP = 0.1; // metres the car falls when it's put down
const MIN_TAP = 0.15; // seconds: even the quickest tap on the throttle opens it for this long
const BEST_KEY = "naseeb-mountain-best";
const REV_LIMIT = 3700; // in a gear picked by hand, the foot comes off from here: about 3,550 rpm at most

// Camera views: the driver's seat, chase (behind, racing-game style), and two orbits. For the
// orbits yaw 0 is straight behind the car, pitch is up from level, dist in metres.
const VIEWS = [
  { name: "Driver", mode: "driver", yaw: 0, pitch: 0, dist: 10.7 },
  { name: "Chase", mode: "chase", yaw: 0, pitch: 0.23, dist: 10.7 },
  { name: "Side", mode: "orbit", yaw: Math.PI / 2, pitch: 0.12, dist: 7 },
  { name: "High", mode: "orbit", yaw: 0.6, pitch: 1.0, dist: 11 },
];

const $ = (id) => document.getElementById(id);
const ui = {
  canvas: $("game"),
  speed: $("r-speed"),
  gear: $("r-gear"),
  rpm: $("r-rpm"),
  steer: $("r-steer"),
  slip: $("r-slip"),
  state: $("r-state"),
  heading: $("r-heading"),
  moved: $("r-moved"),
  surface: $("r-surface"),
  weight: $("r-weight"),
  normalFront: $("r-normal-front"),
  normalRear: $("r-normal-rear"),
  frictionFront: $("r-friction-front"),
  frictionRear: $("r-friction-rear"),
  rolling: $("r-rolling"),
  drag: $("r-drag"),
  torque: $("r-torque"),
  springsFront: $("r-springs-front"),
  springsRear: $("r-springs-rear"),
  extra: $("extra"),
  more: $("more"),
  sound: $("t-sound"),
  settingsButton: $("t-settings"),
  settings: $("settings"),
  close: $("s-close"),
  defaults: $("s-defaults"),
  climb: $("r-climb"),
  time: $("r-time"),
  lockers: $("r-lockers"),
  lockersLabel: $("r-lockers-label"),
  banner: $("banner"),
  backOnRoad: $("back-on-road"),
  finish: $("finish"),
  finishTime: $("f-time"),
  finishBest: $("f-best"),
  down: $("f-down"),
  again: $("f-again"),
  hint: $("hint"),
  labels: $("labels"),
  overlay: $("overlay"),
  start: $("start"),
  go: $("c-go"),
  brake: $("c-brake"),
  left: $("c-left"),
  right: $("c-right"),
  gears: $("gears"),
  tach: $("tach-bar"),
};

// How it looks: the time of day, and the graphics (left to judge for itself, by default).
const LOOKS = { time: "afternoon", quality: "auto" };

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    // Only what a driver chooses: the drive and the diff locks; and how it looks.
    const s = { ...DEFAULTS, ...LOOKS, drive: saved.drive, lockers: saved.lockers, time: saved.time, quality: saved.quality };
    if (!["4x4", "rear"].includes(s.drive)) s.drive = DEFAULTS.drive;
    if (!["none", "rear", "both"].includes(s.lockers)) s.lockers = DEFAULTS.lockers;
    if (!TIME_NAMES.includes(s.time)) s.time = LOOKS.time;
    if (!["auto", "high", "standard"].includes(s.quality)) s.quality = LOOKS.quality;
    return s;
  } catch {
    return { ...DEFAULTS, ...LOOKS };
  }
}
function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Private windows can refuse storage; the settings just won't be remembered.
  }
}

let settings = loadSettings();
const sim = new Sim(settings);
const world = new World(ui.canvas);
world.setTime(settings.time);
world.setQuality(settings.quality);
// forces: the engineer's view, with the force arrows and every readout a driver wouldn't have.
const view = { forces: false, started: false, preset: 0 };
world.setView(VIEWS[0]);

// ---------- Input ----------
// ▲ is the throttle, ▼ brakes, ◀ ▶ steer; on screen, or the arrow keys and WASD. Space only
// brakes. In the automatic, holding ▼ once stopped puts it in reverse and backs up, ▼ then being
// the throttle and ▲ the brake; holding ▲ once stopped goes back to drive. Gears: 1 to 6 to pick
// one yourself, 0 to hand back to the automatic, R reverse, N neutral. Drag the scene to look
// around; scroll or pinch to come closer.

const keys = { throttle: false, back: false, brake: false, left: false, right: false };
const buttons = { throttle: false, back: false, left: false, right: false };
let tap = 0; // until when (sim time) a quick tap keeps the throttle open
const STOPPED = 0.3; // m/s: slow enough to change between drive and reverse

let backFrom = null; // the gear picked by hand before ▼ backed up
function controls() {
  const ahead = keys.throttle || buttons.throttle || sim.time < tap;
  const back = keys.back || buttons.back;
  const left = keys.left || buttons.left;
  const right = keys.right || buttons.right;
  const steer = left === right ? 0 : left ? 1 : -1;
  let throttle = ahead;
  let brake = keys.brake || back;
  const stopped = Math.abs(sim.forwardSpeed) < STOPPED;
  // A gear picked by hand, put aside while ▼ backs up (see below); gone once anything else
  // changes the gear.
  if (sim.auto || sim.gear !== -1) backFrom = null;
  const backing = sim.gear === -1 && (sim.auto || backFrom !== null);
  if (backing) {
    // Reversing: ▼ drives it back, ▲ brakes, and stopped, ▲ goes back to drive: to the
    // automatic, or to the gear picked by hand.
    if (ahead && stopped && !back) {
      if (sim.auto) sim.autoReverse(false);
      else sim.shift(backFrom);
      backFrom = null;
    }
    throttle = back;
    brake = keys.brake || ahead;
  } else if (back && stopped && !ahead && sim.gear !== -1) {
    // Stopped, ▼ puts it in reverse, in the automatic or in a gear picked by hand alike.
    if (sim.auto) sim.autoReverse(true);
    else {
      backFrom = sim.gear;
      sim.shift(-1);
    }
  }
  // In a gear picked by hand, the driver eases off short of the governor, as anyone would.
  const foot = sim.auto ? 1 : Math.max(0, Math.min(1, (REV_LIMIT - sim.rpm) / 250));
  return { throttle: brake && !(backing && back) ? 0 : throttle ? foot : 0, brake: brake ? 1 : 0, steer };
}

function pressThrottle() {
  tap = sim.time + MIN_TAP;
  ui.hint.classList.add("gone");
}

// The on-screen pedals and steering: held while pressed, wherever the finger slides.
for (const [el, key] of [
  [ui.go, "throttle"],
  [ui.brake, "back"],
  [ui.left, "left"],
  [ui.right, "right"],
]) {
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (!view.started) return;
    buttons[key] = true;
    el.classList.add("held");
    if (key === "throttle") pressThrottle();
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Not every pointer can be captured; a lost release just ends the hold early.
    }
  });
  const release = () => {
    buttons[key] = false;
    el.classList.remove("held");
  };
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) el.addEventListener(type, release);
  el.addEventListener("contextmenu", (e) => e.preventDefault());
}

// The gear selector.
const gearButtons = [
  ["auto", "Auto"],
  [-1, "R"],
  [0, "N"],
  ...GEARS.map((g, i) => [i + 1, g.name]),
].map(([gear, label]) => {
  const b = document.createElement("button");
  b.className = "gear";
  b.textContent = label;
  b.title = gear === "auto" ? "Automatic (0)" : gear === -1 ? "Reverse (R)" : gear === 0 ? "Neutral (N)" : `${GEARS[gear - 1].label} (${gear})`;
  b.addEventListener("click", () => sim.shift(gear));
  ui.gears.append(b);
  return { gear, b };
});

// Dragging the scene looks around; two fingers pinch to zoom.
const pointers = new Map();
let pinch = null;
ui.canvas.addEventListener("pointerdown", (e) => {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinch = Math.hypot(a.x - b.x, a.y - b.y);
  }
  try {
    ui.canvas.setPointerCapture(e.pointerId);
  } catch {
    // As above.
  }
});
ui.canvas.addEventListener("pointermove", (e) => {
  const p = pointers.get(e.pointerId);
  if (!p) return;
  const dx = e.clientX - p.x;
  const dy = e.clientY - p.y;
  p.x = e.clientX;
  p.y = e.clientY;
  if (pointers.size === 2 && pinch) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d > 0) world.zoom(pinch / d);
    pinch = d;
    return;
  }
  world.orbit(dx, dy);
});
for (const type of ["pointerup", "pointercancel"]) {
  ui.canvas.addEventListener(type, (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
  });
}
ui.canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    world.zoom(Math.exp(e.deltaY * 0.0012));
  },
  { passive: false },
);
ui.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

const KEYS = {
  ArrowUp: "throttle",
  KeyW: "throttle",
  ArrowDown: "back",
  KeyS: "back",
  Space: "brake",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
};
window.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
  if (!view.started) {
    if (e.code === "Enter" || e.code === "Space") {
      start();
      e.preventDefault();
    }
    return;
  }
  const key = KEYS[e.code];
  const digit = /^(Digit|Numpad)([0-9])$/.exec(e.code);
  if (key) {
    if (!keys[key] && (key === "throttle" || key === "back")) pressThrottle();
    keys[key] = true;
  } else if (digit) {
    const n = Number(digit[2]);
    if (n === 0) sim.shift("auto");
    else if (n <= GEARS.length) sim.shift(n);
  } else if (e.code === "KeyR") sim.shift(-1);
  else if (e.code === "KeyN") sim.shift(0);
  else if (e.code === "Backspace") drop();
  else if (e.code === "KeyL") cycleLockers();
  else if (e.code === "KeyF") toggleForces();
  else if (e.code === "KeyK") toggleSound();
  else if (e.code === "KeyV") nextView();
  else if (e.code === "Equal" || e.code === "NumpadAdd") world.zoom(1 / 1.15);
  else if (e.code === "Minus" || e.code === "NumpadSubtract") world.zoom(1.15);
  else return;
  e.preventDefault();
});
window.addEventListener("keyup", (e) => {
  const key = KEYS[e.code];
  if (key) keys[key] = false;
});
window.addEventListener("blur", () => {
  for (const k of Object.keys(keys)) keys[k] = buttons[k] = false;
  pointers.clear();
});

// ---------- Buttons ----------

// The run: how far up the road it's been (on the road), when the clock started, whether it's at
// the top.
const road = MOUNTAIN.road;
const run = { along: START, since: null, time: 0, done: false, off: 0, over: 0 };
let best = null;
try {
  best = Number(localStorage.getItem(BEST_KEY)) || null;
} catch {}

// Puts the jeep on the road `along` metres up it, facing up it.
function putOnRoad(along) {
  tap = 0;
  const at = MOUNTAIN.roadAt(along);
  sim.place(at.x, at.z, at.heading, DROP);
}
// Back onto the road where it last was.
function drop() {
  putOnRoad(Math.max(START, run.along - 3));
}
// To one of the road's stops (for testing).
function jumpTo(index) {
  const stop = MOUNTAIN.stops[index];
  if (!stop) return;
  run.along = stop.along;
  putOnRoad(stop.along);
}
function restart() {
  run.along = START;
  run.since = null;
  run.time = 0;
  run.done = false;
  ui.finish.hidden = true;
  putOnRoad(START);
}

let bannerUntil = 0;
function say(text, seconds = 2.5) {
  ui.banner.textContent = text;
  ui.banner.hidden = false;
  bannerUntil = performance.now() + seconds * 1000;
}

const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
const climbed = (along) => road.e[Math.min(road.count - 1, Math.round(along / 0.5))] - road.e[0];

// Each frame: how far up the road it's got, the clock, the top; and if it's gone over the edge or
// rolled, back onto the road.
function followRun(dt) {
  if (!view.started) return;
  const on = MOUNTAIN.onRoad(sim.p[0], sim.p[2]);
  if (on && Math.abs(on.along - run.along) < 30) run.along = on.along;
  if (run.since === null && Math.abs(sim.forwardSpeed) > 0.3) run.since = 0;
  if (run.since !== null && !run.done) run.time += dt;
  run.off = on ? 0 : run.off + dt;
  run.over = sim.overturned ? run.over + dt : 0;
  // Off the road or rolled: a button to put it back on the road, where it left it. Never by
  // itself; the driver may want to try getting back on.
  const stranded = run.over > 1 || run.off > 1.2;
  if (ui.backOnRoad.hidden === stranded) {
    ui.backOnRoad.hidden = !stranded;
    ui.backOnRoad.textContent = run.over > 1 ? "Rolled. Back on the road" : "Back on the road";
  }
  if (!run.done && on && on.along > road.length - 14) {
    run.done = true;
    const fresh = best === null || run.time < best;
    if (fresh) {
      best = run.time;
      try {
        localStorage.setItem(BEST_KEY, String(best));
      } catch {}
    }
    ui.finishTime.textContent = `You made it up in ${clock(run.time)}.`;
    ui.finishBest.textContent = fresh ? "Your best yet." : `Your best: ${clock(best)}.`;
    ui.finish.hidden = false;
  }
  if (bannerUntil && performance.now() > bannerUntil) {
    ui.banner.hidden = true;
    bannerUntil = 0;
  }
}
ui.down.addEventListener("click", () => (ui.finish.hidden = true));
ui.backOnRoad.addEventListener("click", () => {
  run.over = run.off = 0;
  ui.backOnRoad.hidden = true;
  drop();
});
ui.again.addEventListener("click", restart);

// The diff locks, from the dash: none, rear, front and rear.
function cycleLockers() {
  const order = ["none", "rear", "both"];
  settings.lockers = order[(order.indexOf(settings.lockers) + 1) % order.length];
  applySettings();
  say({ none: "Diff locks off", rear: "Rear diff locked", both: "Front and rear diffs locked" }[settings.lockers], 1.6);
}

function toggleForces() {
  view.forces = !view.forces;
  document.body.classList.toggle("engineer-view", view.forces);
}

// Sound: on unless the player turned it off last time.
const sound = new Sound();
const SOUND_KEY = "naseeb-sound";
try {
  sound.on = localStorage.getItem(SOUND_KEY) !== "off";
} catch {}
function showSound() {
  ui.sound.classList.toggle("on", sound.on);
  ui.sound.setAttribute("aria-pressed", sound.on);
}
function toggleSound() {
  sound.setOn(!sound.on);
  showSound();
  try {
    localStorage.setItem(SOUND_KEY, sound.on ? "on" : "off");
  } catch {}
}
showSound();
ui.sound.addEventListener("click", toggleSound);
// Browsers only let sound play once the player has tapped or pressed something.
for (const type of ["pointerdown", "keydown"]) window.addEventListener(type, () => sound.wake(), true);

function nextView() {
  view.preset = (view.preset + 1) % VIEWS.length;
  const v = VIEWS[view.preset];
  world.setView(v);
  say(`${v.name} view`, 1.2);
}

ui.more.addEventListener("click", () => {
  const open = ui.extra.hidden;
  ui.extra.hidden = !open;
  ui.more.textContent = open ? "Less" : "More";
});
if (window.innerWidth < 640) {
  ui.extra.hidden = true;
  ui.more.textContent = "More";
}


// ---------- Settings ----------

const selects = { drive: $("s-drive"), lockers: $("s-lockers"), time: $("s-time"), quality: $("s-quality") };

function showSettings() {
  for (const [key, el] of Object.entries(selects)) el.value = settings[key];
  const locked = settings.lockers !== "none";
  ui.lockers.hidden = ui.lockersLabel.hidden = !locked;
  ui.lockers.textContent = settings.lockers === "both" ? "Front and rear" : "Rear";
}

function applySettings() {
  sim.configure(settings);
  world.setTime(settings.time);
  world.setQuality(settings.quality);
  saveSettings();
  showSettings();
}

for (const [key, el] of Object.entries(selects)) {
  el.addEventListener("change", () => {
    settings[key] = el.value;
    applySettings();
  });
}
ui.defaults.addEventListener("click", () => {
  settings = { ...DEFAULTS, ...LOOKS };
  applySettings();
});
ui.settingsButton.addEventListener("click", () => {
  ui.settings.hidden = !ui.settings.hidden;
  ui.settingsButton.classList.toggle("on", !ui.settings.hidden);
  if (!ui.settings.hidden) showSettings();
});
ui.close.addEventListener("click", () => {
  ui.settings.hidden = true;
  ui.settingsButton.classList.remove("on");
});

// ---------- Readouts ----------

const fmt = (v, digits) => (Math.abs(v) < 0.5 * 10 ** -digits ? 0 : v).toFixed(digits);
const newtons = (f) => `${Math.abs(f) < 10 ? Math.abs(f).toFixed(1) : Math.round(Math.abs(f))} N`;
const n0 = (f) => (Math.abs(f) < 10 ? Math.abs(f).toFixed(1) : String(Math.round(Math.abs(f))));
const grip = (c) => Math.hypot(c.friction[0], c.friction[2]);
const resistance = (c) => c.rollingMoment / c.rollingRadius + c.soilDrag;
const degrees = (rad, left, right) => {
  const deg = (rad * 180) / Math.PI;
  return Math.abs(deg) < 0.5 ? "straight" : `${Math.abs(deg).toFixed(0)}° ${deg > 0 ? left : right}`;
};

// What the tires are doing, the most dramatic of the four.
function stateOf() {
  const cs = sim.wheels.map((w) => w.contact);
  const grounded = cs.filter((c) => c.normal > 0);
  if (sim.overturned) return "Rolled over";
  if (!grounded.length) return "In the air";
  const moving = Math.hypot(sim.v[0], sim.v[2]);
  if (moving < 0.003 && Math.abs(sim.spin) < 0.02 && Math.abs(sim.w[1]) < 0.01 && !sim.wheelTorque) return "At rest";
  if (grounded.some((c) => c.slip > c.surface.slipAtPeak)) return "Wheelspin";
  if (grounded.some((c) => c.slip < -c.surface.slipAtPeak)) return sim.controls.brake ? "Locked" : "Skidding";
  if (grounded.some((c) => Math.abs(c.sideSlip) > c.surface.slipAtPeak)) return "Sliding";
  if (grounded.length < 4) return "Tire up";
  if (sim.controls.brake) return "Braking";
  return sim.wheelTorque > 0 ? "Gripping" : "Rolling";
}


let lastGear = null;
function showReadouts() {
  const [fl, fr, rl, rr] = sim.wheels.map((w) => w.contact);
  const speed = sim.forwardSpeed;
  const arrow = speed > 0.003 ? " ↑" : speed < -0.003 ? " ↓" : "";
  ui.speed.textContent = `${fmt(Math.abs(speed) * 3.6, 0)} km/h${arrow}`;
  const gear = sim.gear >= 1 ? `${sim.auto ? "Auto" : "Manual"} ${sim.gearName} · ${GEARS[sim.gear - 1].label}` : sim.gear === -1 ? (sim.auto ? "Auto R · Reverse" : "Reverse") : "Neutral";
  ui.gear.textContent = gear;
  ui.rpm.textContent = `${Math.round(sim.rpm / 10) * 10} rpm${sim.clutch === "slipping" ? " · clutch slipping" : ""}`;
  ui.tach.style.width = `${Math.min(100, (sim.rpm / ENGINE.governor) * 100)}%`;
  ui.tach.classList.toggle("red", sim.rpm > ENGINE.governor * 0.95);
  ui.steer.textContent = degrees(sim.steer, "left", "right");
  // The bigger slip on each axle, signed.
  const slip = (a, b) => {
    const touching = [a, b].filter((c) => c.normal > 0);
    if (!touching.length) return "–";
    const s = touching.reduce((m, c) => (Math.abs(c.slip) > Math.abs(m) ? c.slip : m), 0);
    return `${fmt(s * 100, 0)}%`;
  };
  ui.slip.textContent = `${slip(fl, fr)} · ${slip(rl, rr)}`;
  const state = stateOf();
  ui.state.textContent = state;
  ui.state.dataset.state = state.toLowerCase().replace(/ /g, "-");
  ui.heading.textContent = degrees(sim.heading, "left", "right");
  ui.moved.textContent = `${sim.moved.toFixed(1)} m`;
  if (!ui.extra.hidden) {
    const names = [...new Set([fl, fr, rl, rr].map((c) => c.surface.name))];
    ui.surface.textContent = names.join(" · ");
    ui.weight.textContent = newtons(sim.mass * sim.g);
    ui.normalFront.textContent = `${n0(fl.normal)} · ${n0(fr.normal)} N`;
    ui.normalRear.textContent = `${n0(rl.normal)} · ${n0(rr.normal)} N`;
    ui.frictionFront.textContent = `${n0(grip(fl))} · ${n0(grip(fr))} N`;
    ui.frictionRear.textContent = `${n0(grip(rl))} · ${n0(grip(rr))} N`;
    ui.rolling.textContent = newtons([fl, fr, rl, rr].reduce((s, c) => s + resistance(c), 0));
    ui.drag.textContent = newtons(sim.drag);
    ui.torque.textContent = `${Math.round(sim.wheelTorque)} N·m`;
    // Spring travel past the static ride height: + squashed, - stretched.
    const mm = (t) => `${t >= 0 ? "+" : ""}${Math.round(t * 1000)}`;
    const [front, rear] = sim.axles;
    ui.springsFront.textContent = `${mm(front.travel[0])} · ${mm(front.travel[1])} mm`;
    ui.springsRear.textContent = `${mm(rear.travel[0])} · ${mm(rear.travel[1])} mm`;
  }
  ui.climb.textContent = `${Math.max(0, Math.round(climbed(run.along)))} of ${Math.round(climbed(road.length))} m`;
  ui.time.textContent = clock(run.time);
  const gearKey = `${sim.auto}${sim.gear}`;
  if (gearKey !== lastGear) {
    lastGear = gearKey;
    for (const { gear, b } of gearButtons) {
      const on = gear === "auto" ? sim.auto : !sim.auto && gear === sim.gear;
      b.classList.toggle("on", on);
      b.classList.toggle("engaged", gear === sim.gear);
    }
  }
}

// Labels for the force arrows, placed where the 3D scene says they are on screen: the weight, the
// drive at the wheels, and at each tire the ground's push and the friction.
const labels = {};
for (const key of ["weight", "torque", "tire0", "tire1", "tire2", "tire3"]) {
  const el = document.createElement("span");
  el.className = "force-label";
  ui.labels.append(el);
  labels[key] = el;
}
labels.weight.style.color = "#ff9a9a";
labels.torque.style.color = "#d8bcff";
function showLabels() {
  for (const [key, el] of Object.entries(labels)) {
    const point = view.forces && world.labelPoints[key];
    const at = point && world.project(point);
    if (!at) {
      el.hidden = true;
      continue;
    }
    el.hidden = false;
    if (key === "weight") el.textContent = `weight ${newtons(sim.mass * sim.g)}`;
    else if (key === "torque") el.textContent = `${Math.abs(Math.round(sim.wheelTorque))} N·m at the wheels`;
    else {
      const c = sim.wheels[Number(key.slice(4))].contact;
      el.innerHTML = `<b style="color:#8fe0ff">${n0(c.normal)}</b> · <b style="color:#ffd98a">${n0(grip(c))}</b> N`;
    }
    el.style.transform = `translate(${Math.round(at.x + 10)}px, ${Math.round(at.y - 9)}px)`;
  }
}

// ---------- Loop ----------

function update(dt) {
  sim.advance(dt, view.started ? controls() : { throttle: 0, brake: 0, steer: 0 });
  followRun(dt);
  world.draw(sim, dt, { forces: view.forces, world: "earth", realDt: dt });
  sound.update(sim, { inside: world.goal.mode === "driver" });
  showReadouts();
  showLabels();
}

// Frames a second, counted over each half second, and the slowest frame in it. When the
// resolution has been lowered to keep up, it says how far.
const fpsEl = $("fps");
const fps = { frames: 0, since: performance.now(), worst: 0 };
function countFrame(now, gap) {
  fps.frames++;
  fps.worst = Math.max(fps.worst, gap);
  const span = now - fps.since;
  if (span < 500) return;
  const rate = (fps.frames * 1000) / span;
  const scale = world.pixelRatio / world.maxPixelRatio;
  fpsEl.textContent = `${Math.round(rate)} fps${scale < 0.99 ? ` · ${Math.round(scale * 100)}% res` : ""}`;
  fpsEl.title = `Slowest frame ${fps.worst.toFixed(1)} ms, drawing ${world.pixelRatio.toFixed(2)} pixels per screen point`;
  fpsEl.className = `fps${rate < 30 ? " bad" : rate < 55 ? " slow" : ""}`;
  fps.frames = 0;
  fps.since = now;
  fps.worst = 0;
}

// Holds the frame rate on slower GPUs by drawing fewer pixels, as Boulder Bear does. Every 45
// frames it looks at the median frame time: while frames miss 60 fps it steps the resolution down
// as far as one pixel per CSS pixel, and below that only as far as it takes to hold 30 fps. After a
// long smooth run it tries a step back up, and stays put for good if that turns out too slow.
const RESOLUTION_STEP = 0.85;
const resolution = { ceiling: world.pixelRatio, samples: [], smooth: 0, warmup: 2, raised: false };

function adaptResolution(ms) {
  const r = resolution;
  const ratio = world.pixelRatio;
  r.ceiling = Math.min(r.ceiling, world.maxPixelRatio);
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
  // Graphics left on auto: the soft shading and glow go first, before any resolution.
  if (world.auto && world.high && median > 20) {
    world.high = false;
    r.warmup = 1;
    return;
  }
  let next = ratio;
  if (median > 36 && ratio > 0.6) next = Math.max(0.6, ratio * RESOLUTION_STEP);
  else if (median > 18.5 && ratio > 1) next = Math.max(1, ratio * RESOLUTION_STEP);
  const raised = r.raised;
  r.raised = false;
  if (next < ratio) {
    if (raised) r.ceiling = next; // the last step up was one too many
    r.smooth = 0;
  } else if (median < 17.5 && ratio < r.ceiling) {
    if (++r.smooth >= 8) {
      next = Math.min(r.ceiling, ratio / RESOLUTION_STEP);
      r.smooth = 0;
      r.raised = true;
    }
  } else {
    r.smooth = 0;
  }
  if (next !== ratio) world.setPixelRatio(next);
}

// At most 60 frames a second, however fast the screen refreshes: on a 120 or 144 Hz screen the
// frames in between are skipped. Each frame drawn books the next a sixtieth of a second on, and
// one comes due a little early (the screen's ticks rarely line up), so the average holds at 60.
const FRAME_MS = 1000 / 60;
let due = 0;

let loopHeld = false;
let last = performance.now();
function frame(now) {
  if (now < due - FRAME_MS * 0.3) {
    requestAnimationFrame(frame);
    return;
  }
  due = Math.max(due + FRAME_MS, now + FRAME_MS * 0.5);
  const gap = now - last;
  const dt = Math.min(0.05, Math.max(0, gap / 1000));
  last = now;
  countFrame(now, gap);
  if (!loopHeld) {
    update(dt);
    adaptResolution(gap);
  }
  requestAnimationFrame(frame);
}

function start() {
  if (view.started) return;
  view.started = true;
  ui.overlay.hidden = true;
  sound.start();
  restart();
}
ui.start.addEventListener("click", start);
window.addEventListener("resize", () => world.resize());
document.addEventListener("visibilitychange", () => {
  resolution.warmup = Math.max(resolution.warmup, 0.5);
  sound.pause(document.hidden);
});

putOnRoad(START);
showSettings();
// Opened from the game page's Play button: that was the player's "play", so skip the title card.
if (new URLSearchParams(location.search).has("autostart")) start();
requestAnimationFrame(frame);

// Local testing hook: drive the game without relying on animation frames.
if (location.hostname === "localhost") {
  window.naseeb = {
    sim,
    world,
    view,
    settings: () => settings,
    start,
    drop,
    jumpTo,
    putOnRoad,
    nextView,
    press: (key, held = true) => (buttons[key] = held),
    holdLoop: (held) => (loopHeld = held),
    step: (dt = 1 / 60, frames = 1) => {
      for (let i = 0; i < frames; i++) update(dt);
    },
  };
}

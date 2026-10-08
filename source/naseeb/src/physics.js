// Naseeb's physics: a 1970 Toyota Land Cruiser FJ40, as closely as published specs allow, on flat
// ground made of strips of different surfaces. A ladder frame on four H78-15 tires, the front two
// steered; the F six, a 3-speed gearbox and a two-speed transfer case driving both axles. SI
// units throughout: metres, kilograms, seconds, newtons, radians.
//
// Coordinates match three.js's: y is up, the track runs away from the start down -z, and +x is to
// the right looking along it. The car's own axes are the same when it's square on the track:
// x to its right, y up, z toward its back.
//
// What's in the model, and why it matters:
// - Gravity pulls the car down; the ground pushes back at each tire through the tire's
//   springiness (and, on soft ground, the ground's own give). That push is the normal force N, so
//   a tire that's pressed harder grips harder, and accelerating, braking and turning move weight
//   between the tires.
// - Grip comes from slip, how fast the tread at the ground is sliding over it, forward or sideways.
//   Friction climbs steeply with a little slip, peaks (static grip), then falls toward the sliding
//   value: the tire's slip curve, Pacejka's "magic formula", fitted to each surface. The force is
//   that fraction of N, against the slip. Sideways slip is what turns the car when it's steered.
// - The chassis is one rigid body. The tires' spins are tied together by the drivetrain: each
//   driven axle's differential turns at the driveshaft's speed (in four-wheel drive, front and
//   rear the same), and an open differential lets its two tires turn faster and slower than that
//   by the same amount; a locked one doesn't. A torque at a tire works on both: the driveshaft
//   (with the engine's flywheel behind it, through the gearing) and the difference. Whatever
//   twists a tire twists the chassis back the other way, so the nose lifts under power and dives
//   under braking.
// - The drivetrain: the engine's torque from its curve, through the gearbox, the transfer case and
//   the axle ratio, with the engine's flywheel felt through the gearing; an automatic clutch that
//   slips to pull away and opens when the engine would stall; engine braking off the throttle; a
//   governor at 4,000 rpm. In four-wheel drive the transfer case locks the front and rear
//   driveshafts together (part-time, no centre differential, like the FJ40's). Each axle has a
//   differential: open, it gives both tires the same torque and lets them turn at different
//   speeds (so a tire on ice gets all the spin); locked, they turn together.
// - Drum brakes on all four tires, more at the front.
// - Steering follows Ackermann geometry: the inside front tire turns more, so both roll round the
//   same centre.
// - Rolling resistance: rubber that flexes at the contact patch and doesn't fully spring back is a
//   moment against a tire's spin; soft ground pressed down ahead of a tire is a drag on it.
// - Air drag on the whole car, as an FJ40 with its body (the body isn't drawn yet, but its mass
//   and its drag are in).
// Left out for now: suspension (the tires are the only springs), slopes and bumps, the gyroscopic
// pull of the spinning tires on the chassis, steering self-aligning torque, tire heat and wear.

const INCH = 0.0254;

// H78-15: a bias-ply tire about 8 inches (205 mm) across, its sidewall 78% as tall as that, on a
// 15 x 5.5 steel wheel. That makes it 27.6 inches across the outside.
export const TIRE = {
  width: 0.205,
  rimRadius: 7.5 * INCH, // where the tire's bead sits on the rim
  flangeRadius: 7.5 * INCH + 0.016, // the rim's lip, just outside the bead
  radius: 7.5 * INCH + 0.205 * 0.78,
  tireMass: 13, // rubber, cords and beads
  rimMass: 9, // a pressed-steel 15 x 5.5 wheel
};
const R = TIRE.radius;
const RB = TIRE.rimRadius;

export const CAR = {
  name: "1970 Toyota Land Cruiser FJ40",
  wheelbase: 2.285,
  frontTrack: 1.405, // between the tires' centres across an axle
  rearTrack: 1.4,
  // Full lock at the middle of the front axle. Not published that we could find: this gives an
  // outside front tire a 5.3 m turning radius, about right for the FJ40.
  maxSteer: (29 * Math.PI) / 180,
  steerRate: 1.2, // rad/s the steering turns at most (a heavy, unassisted box)
  dragArea: 0.65 * 2.6, // Cd times frontal area: a brick with a windscreen
};
const HALF_BASE = CAR.wheelbase / 2;

// The engine: Toyota's F, a 3.9-litre (3878 cc) overhead-valve straight six. Torque at the
// flywheel in N·m by rpm, through 283 N·m (209 lb·ft) at 2,000 rpm and 125 hp at 3,600; past
// the governor at 4,000 there's no more.
export const ENGINE = {
  name: "Toyota F, 3.9 L straight six",
  curve: [
    [600, 215],
    [1000, 250],
    [1500, 275],
    [2000, 283],
    [2500, 280],
    [3000, 268],
    [3600, 247],
    [4000, 225],
  ],
  idle: 650,
  governor: 4000,
  slipRpm: 1600, // where the automatic clutch holds the engine while it slips to pull away
  engageRpm: 1000, // below this from the wheels' side, the clutch slips (or opens, off the throttle)
  flywheel: 0.3, // kg·m², crank, flywheel and clutch
  efficiency: 0.85, // gearbox, transfer case and axles together
};

// Gearing: the 3-speed (2.76, 1.70, 1.00; reverse 3.67) through the transfer case, high (1.00) or
// low (2.31), to 4.11 axles. Its three gears in two ranges make six forward ratios; in order:
export const GEARS = [
  { name: "1", label: "Low 1st", ratio: 2.76 * 2.31 },
  { name: "2", label: "Low 2nd", ratio: 1.7 * 2.31 },
  { name: "3", label: "High 1st", ratio: 2.76 },
  { name: "4", label: "Low 3rd", ratio: 2.31 },
  { name: "5", label: "High 2nd", ratio: 1.7 },
  { name: "6", label: "High 3rd", ratio: 1.0 },
];
export const REVERSE = { name: "R", label: "Reverse", ratio: -3.67 };
export const AXLE_RATIO = 4.11;
// The automatic: up a gear past UP_RPM on the throttle, down below DOWN_RPM; each change opens
// the clutch for SHIFT_TIME.
const UP_RPM = 3400;
const DOWN_RPM = 1300;
const SHIFT_TIME = 0.3;

// Drum brakes, 290 mm: the most torque each can put on its tire, front and rear.
export const BRAKES = { front: 1400, rear: 1000 };

// What's on the frame besides the tires, as boxes: mass (kg), centre and size (m) in the car's own
// axes, measured from the middle between the axles at hub height. The physics weighs all of them;
// the scene draws the ones marked `drawn`. Most masses are estimates that add up to the FJ40's
// 1,480 kg kerb weight with the engine forward, about 57% on the front tires.
export const PARTS = [
  { name: "frame rail", mass: 45, at: [-0.42, 0.12, -0.15], size: [0.06, 0.15, 3.5], drawn: true },
  { name: "frame rail", mass: 45, at: [0.42, 0.12, -0.15], size: [0.06, 0.15, 3.5], drawn: true },
  ...[-1.75, -1.1, -0.2, 0.6, 1.5].map((z) => ({ name: "cross member", mass: 6, at: [0, 0.12, z], size: [0.84, 0.08, 0.06], drawn: true })),
  { name: "front bumper", mass: 15, at: [0, 0.12, -1.85], size: [1.6, 0.15, 0.1], drawn: true },
  { name: "rear cross member", mass: 10, at: [0, 0.12, 1.7], size: [1.2, 0.12, 0.08], drawn: true },
  { name: "front axle", mass: 130, at: [0, 0, -HALF_BASE], size: [CAR.frontTrack - 0.2, 0.1, 0.1], drawn: true },
  { name: "rear axle", mass: 110, at: [0, 0, HALF_BASE], size: [CAR.rearTrack - 0.2, 0.09, 0.09], drawn: true },
  { name: "engine", mass: 270, at: [0, 0.3, -0.75], size: [0.5, 0.65, 0.95], drawn: true },
  { name: "gearbox and transfer case", mass: 95, at: [0, 0.12, 0], size: [0.35, 0.35, 0.65], drawn: true },
  { name: "radiator", mass: 28, at: [0, 0.45, -1.45], size: [0.7, 0.6, 0.1], drawn: true },
  { name: "fuel tank", mass: 57, at: [-0.3, 0.25, 0.25], size: [0.5, 0.25, 0.6], drawn: true },
  { name: "battery", mass: 20, at: [0.45, 0.45, -1.2], size: [0.25, 0.22, 0.17], drawn: true },
  { name: "body, top and seats", mass: 487, at: [0, 0.75, 0.15], size: [1.6, 1.1, 3.4], drawn: false },
  { name: "exhaust, steering and the rest", mass: 50, at: [0, 0.25, -0.2], size: [0.8, 0.3, 2.0], drawn: false },
];

export const WHEELS = [
  { name: "front left", side: -1, front: true, at: [-CAR.frontTrack / 2, 0, -HALF_BASE] },
  { name: "front right", side: 1, front: true, at: [CAR.frontTrack / 2, 0, -HALF_BASE] },
  { name: "rear left", side: -1, front: false, at: [-CAR.rearTrack / 2, 0, HALF_BASE] },
  { name: "rear right", side: 1, front: false, at: [CAR.rearTrack / 2, 0, HALF_BASE] },
];

// Moment of inertia per kilogram, about the axle. About half the tire's mass is tread and plies
// riding at the outside; the rest is sidewalls and beads, a ring down to the rim. A steel wheel's
// mass is mostly its rim near the bead seat; the rest is its centre disc.
const TIRE_GYRATION2 = 0.55 * (R - 0.015) ** 2 + (0.45 * (R * R + RB * RB)) / 2;
const RIM_GYRATION2 = 0.65 * (RB - 0.01) ** 2 + 0.35 * 0.5 * (RB - 0.03) ** 2;

export const DEFAULTS = {
  weight: TIRE.tireMass + TIRE.rimMass, // kg, each tire and its wheel
  pressure: 1.8, // bar above the air outside (26 psi)
  drive: "4x4", // "4x4": both axles, locked together; "rear": rear only
  lockers: "none", // differential locks: "none", "rear" or "both"
  world: "earth",
};

export const WORLDS = {
  earth: { name: "Earth", g: 9.81, air: 1.225 },
  mars: { name: "Mars", g: 3.71, air: 0.02 },
  moon: { name: "Moon", g: 1.62, air: 0 },
  jupiter: { name: "Jupiter", g: 24.79, air: 0.16 },
};

// Each surface: peak and sliding friction for rubber on it, the slip at which grip peaks (loose
// ground needs the tread to dig in further), how much more than usual the rubber's flexing costs
// (water to push aside, for one), how stiffly the ground itself gives under a tire (N/m;
// Infinity for hard ground), and how much a landing's bounce is damped.
export const SURFACES = [
  { id: "asphalt", name: "Dry asphalt", peak: 1.0, slide: 0.75, slipAtPeak: 0.12, hysteresis: 1, give: Infinity, damping: 0.14 },
  { id: "concrete", name: "Concrete", peak: 0.9, slide: 0.7, slipAtPeak: 0.1, hysteresis: 0.9, give: Infinity, damping: 0.14 },
  { id: "wet", name: "Wet asphalt", peak: 0.6, slide: 0.45, slipAtPeak: 0.09, hysteresis: 1.25, give: Infinity, damping: 0.2 },
  { id: "gravel", name: "Gravel", peak: 0.6, slide: 0.55, slipAtPeak: 0.3, hysteresis: 1, give: 600e3, damping: 0.45 },
  { id: "grass", name: "Grass", peak: 0.5, slide: 0.4, slipAtPeak: 0.2, hysteresis: 1, give: 150e3, damping: 0.6 },
  { id: "sand", name: "Sand", peak: 0.45, slide: 0.42, slipAtPeak: 0.35, hysteresis: 1, give: 60e3, damping: 1 },
  { id: "mud", name: "Mud", peak: 0.3, slide: 0.22, slipAtPeak: 0.2, hysteresis: 1, give: 45e3, damping: 1.1 },
  { id: "snow", name: "Packed snow", peak: 0.3, slide: 0.2, slipAtPeak: 0.12, hysteresis: 1, give: 90e3, damping: 0.9 },
  { id: "ice", name: "Ice", peak: 0.12, slide: 0.07, slipAtPeak: 0.06, hysteresis: 1, give: Infinity, damping: 0.14 },
];
for (const s of SURFACES) s.grip = slipCurve(s.peak, s.slide, s.slipAtPeak);
const byId = (id) => SURFACES.find((s) => s.id === id);

// The ground is strips, each STRIP metres long and TRACK_HALF either side of the middle, in this
// order, repeating both ways. Each strip has a surface on its left half and its right; mostly the
// same, except the last, where the left tires are on ice and the right on asphalt. Off the track
// to either side is grass.
export const STRIP = 8;
export const TRACK_HALF = 2.2;
export const STRIPS = [
  ...SURFACES.map((s) => ({ name: s.name, left: s, right: s })),
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

// The engine's torque at an rpm, from its curve; nothing past the governor.
export function engineTorque(rpm) {
  const c = ENGINE.curve;
  if (rpm > ENGINE.governor) return 0;
  if (rpm <= c[0][0]) return c[0][1];
  for (let i = 1; i < c.length; i++) {
    if (rpm <= c[i][0]) {
      const [r0, t0] = c[i - 1];
      const [r1, t1] = c[i];
      return t0 + ((t1 - t0) * (rpm - r0)) / (r1 - r0);
    }
  }
  return c[c.length - 1][1];
}
// What it takes to turn the engine over with the throttle shut: its friction and pumping.
const engineDrag = (rpm) => 25 + 0.012 * rpm;
const RPM = 60 / (2 * Math.PI);

export const STEP = 1 / 4000; // seconds per physics step
const MAX_STEPS = 400; // a long stall is dropped rather than caught up
// Below this speed slip is measured against it instead, so grip stays well defined at a standstill.
const CREEP_SPEED = 0.25;
const SPIN_CM = 0.05; // air's drag on a spinning tread, as a moment coefficient
const GRIP_PASSES = 8;

// Small vector helpers on [x, y, z] arrays.
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]);
  return l > 0 ? mul(a, 1 / l) : [0, 0, 0];
};

export class Sim {
  // options are for checking the model: rolling and air resistance can be switched off.
  constructor(settings = DEFAULTS, options = {}) {
    this.options = { rolling: true, air: true, ...options };
    this.time = 0; // never reset, so anything timed by it carries on through a reset
    this.wheels = WHEELS.map((w) => ({ ...w, spin: 0, angle: 0, steer: 0, contact: null }));
    this.modes = [];
    this.auto = true; // the automatic picks the gear
    this.gear = 1; // 1 to 6, 0 for neutral, -1 for reverse
    this.shifting = 0; // seconds left with the clutch open for a gear change
    this.controls = { throttle: 0, brake: 0, steer: 0 };
    this.shaftAngle = 0; // how far the driveshafts have turned, for drawing them
    this.engineAngle = 0; // and the engine's fan
    this.configure(settings);
    this.reset(4, 0.1);
  }

  configure(settings) {
    const scale = settings.weight / DEFAULTS.weight;
    const world = WORLDS[settings.world] || WORLDS.earth;
    this.settings = { ...settings };
    const m = settings.weight; // one tire and its wheel
    const spin = scale * (TIRE.tireMass * TIRE_GYRATION2 + TIRE.rimMass * RIM_GYRATION2);
    // About a diameter, a tire is half as hard to turn as about its axle, plus its width.
    const across = 0.5 * spin + (m * TIRE.width ** 2) / 12;
    this.wheelMass = m;
    this.wheelInertia = spin;

    // Mass, centre of mass, and how hard the chassis is to turn about each of its own axes (the
    // car is near enough the same either side, so these are its principal axes). A tire's turning
    // about its own axle belongs to its spin, not the chassis.
    const bodies = [
      ...PARTS.map((p) => ({ mass: p.mass, at: p.at, own: boxInertia(p.mass, p.size) })),
      ...WHEELS.map((w) => ({ mass: m, at: w.at, own: [0, across, across] })),
    ];
    this.mass = bodies.reduce((s, b) => s + b.mass, 0);
    this.centre = mul(bodies.reduce((s, b) => add(s, mul(b.at, b.mass)), [0, 0, 0]), 1 / this.mass);
    this.inertia = [0, 0, 0];
    for (const b of bodies) {
      const [dx, dy, dz] = sub(b.at, this.centre);
      this.inertia[0] += b.mass * (dy * dy + dz * dz) + b.own[0];
      this.inertia[1] += b.mass * (dx * dx + dz * dz) + b.own[1];
      this.inertia[2] += b.mass * (dx * dx + dy * dy) + b.own[2];
    }
    for (const w of this.wheels) w.from = sub(w.at, this.centre); // hub, from the centre of mass

    // The tires' spins, as the drivetrain ties them. Each mode is a way things can turn: the
    // driveshaft (the driven axles' differentials, with everything turning with them), an open
    // differential's difference between its two tires, or a free tire on its own. A tire's spin is
    // the sum of the modes it's linked to: left = driveshaft + difference, right = driveshaft -
    // difference. Two tires each of inertia I give a driveshaft 2I, and a difference 2I too.
    const [fl, fr, rl, rr] = this.wheels;
    const old = this.wheels.map((w) => w.spin);
    this.fourByFour = settings.drive !== "rear";
    this.axles = [
      { name: "front", wheels: [fl, fr], locked: settings.lockers === "both", driven: this.fourByFour, brake: BRAKES.front },
      { name: "rear", wheels: [rl, rr], locked: settings.lockers !== "none", driven: true, brake: BRAKES.rear },
    ];
    this.modes = [];
    const mode = (inertia, name) => {
      const m = { name, base: inertia, inertia, spin: 0 };
      this.modes.push(m);
      return m;
    };
    this.driveshaft = mode(0, "driveshaft");
    for (const axle of this.axles) {
      const [left, right] = axle.wheels;
      if (axle.driven) {
        this.driveshaft.base += 2 * spin;
        if (axle.locked) left.links = right.links = [[this.driveshaft, 1]];
        else {
          const diff = mode(2 * spin, `${axle.name} differential`);
          left.links = [[this.driveshaft, 1], [diff, 1]];
          right.links = [[this.driveshaft, 1], [diff, -1]];
        }
      } else if (axle.locked) {
        const both = mode(2 * spin, `${axle.name} axle`);
        left.links = right.links = [[both, 1]];
      } else for (const w of axle.wheels) w.links = [[mode(spin, w.name), 1]];
    }
    // Keep the tires turning as they were through a change of set-up.
    for (const m of this.modes) {
      const linked = this.wheels.filter((w) => w.links.some(([lm]) => lm === m));
      if (m === this.driveshaft) m.spin = linked.reduce((s, w) => s + old[this.wheels.indexOf(w)], 0) / linked.length;
      else if (m.name.endsWith("differential")) m.spin = (old[this.wheels.indexOf(linked[0])] - old[this.wheels.indexOf(linked[1])]) / 2;
      else m.spin = linked.reduce((s, w) => s + old[this.wheels.indexOf(w)], 0) / linked.length;
    }
    this.refreshSpins();
    this.allSpinInertia = 4 * spin;

    this.pressureBar = settings.pressure;
    // How stiffly a tire squashes: mostly the air inside, some the carcass itself.
    this.kTire = 60e3 + 1000 * settings.pressure * 100;
    this.g = world.g;
    this.air = this.options.air ? world.air : 0;
  }

  // Puts the car `along` metres down the track, square across it, dropped from `height`, still.
  reset(along, height = 0) {
    const sag = (this.mass * this.g) / 4 / this.kTire; // tires squashed under its weight
    this.p = [0, R - sag + this.centre[1] + height, -along];
    this.v = [0, 0, 0];
    this.q = [1, 0, 0, 0]; // orientation as a quaternion [w, x, y, z]
    this.L = [0, 0, 0]; // the chassis's angular momentum
    for (const m of this.modes) m.spin = 0;
    for (const w of this.wheels) w.steer = 0;
    this.refreshSpins();
    this.steer = 0; // at the middle of the front axle, positive to the left
    if (this.auto) this.gear = 1;
    this.shifting = 0;
    this.rpm = ENGINE.idle;
    this.clutch = "open";
    this.acc = 0;
    this.moved = 0; // how far the car has travelled
    this.engineTorque = 0;
    this.wheelTorque = 0;
    this.drag = 0;
    this.update();
    for (const w of this.wheels) w.contact = this.contactOf(w);
  }

  // The gear lever. 1 to 6 picks that gear and takes over from the automatic; "auto" hands back;
  // 0 is neutral and -1 reverse.
  shift(gear) {
    if (gear === "auto") {
      this.auto = true;
      if (this.gear < 1) this.setGear(1);
      return;
    }
    this.auto = false;
    this.setGear(gear);
  }

  setGear(gear) {
    if (gear === this.gear) return;
    this.gear = gear;
    this.shifting = SHIFT_TIME;
  }

  get gearRatio() {
    if (this.gear === -1) return REVERSE.ratio * AXLE_RATIO;
    if (this.gear === 0) return 0;
    return GEARS[this.gear - 1].ratio * AXLE_RATIO;
  }

  get gearName() {
    if (this.gear === -1) return "R";
    if (this.gear === 0) return "N";
    return GEARS[this.gear - 1].name;
  }

  // controls: { throttle 0..1, brake 0..1, steer -1 (right) to 1 (left) }.
  advance(dt, controls) {
    if (controls) this.controls = controls;
    this.acc += dt;
    let n = 0;
    while (this.acc >= STEP && n < MAX_STEPS) {
      this.step(STEP);
      this.acc -= STEP;
      n++;
    }
    if (n === MAX_STEPS) this.acc = 0;
  }

  // The chassis's axes in the world, from its orientation, and its angular velocity from its
  // angular momentum.
  update() {
    const [w, x, y, z] = this.q;
    this.ax = [1 - 2 * (y * y + z * z), 2 * (x * y + w * z), 2 * (x * z - w * y)];
    this.ay = [2 * (x * y - w * z), 1 - 2 * (x * x + z * z), 2 * (y * z + w * x)];
    this.az = [2 * (x * z + w * y), 2 * (y * z - w * x), 1 - 2 * (x * x + y * y)];
    this.w = this.inverseInertia(this.L);
  }

  toWorld(b) {
    return [
      this.ax[0] * b[0] + this.ay[0] * b[1] + this.az[0] * b[2],
      this.ax[1] * b[0] + this.ay[1] * b[1] + this.az[1] * b[2],
      this.ax[2] * b[0] + this.ay[2] * b[1] + this.az[2] * b[2],
    ];
  }

  // The chassis's inverse inertia applied to a world vector: into its axes, divided, and back.
  inverseInertia(v) {
    return this.toWorld([dot(this.ax, v) / this.inertia[0], dot(this.ay, v) / this.inertia[1], dot(this.az, v) / this.inertia[2]]);
  }

  // Each tire's spin from the modes it's linked to, and how much an angular push on it changes it.
  refreshSpins() {
    for (const w of this.wheels) {
      w.spin = w.links.reduce((s, [m, sign]) => s + sign * m.spin, 0);
      w.give = w.links.reduce((s, [m]) => s + 1 / m.inertia, 0);
    }
  }
  // Turns a tire with an angular impulse (forward positive), through its links.
  turnWheel(wheel, impulse) {
    for (const [m, sign] of wheel.links) m.spin += (sign * impulse) / m.inertia;
  }
  // Every tire turning at the same rate, as when rolling straight.
  spinAll(spin) {
    for (const m of this.modes) m.spin = m.name.endsWith("differential") ? 0 : spin;
    this.refreshSpins();
  }
  // How fast an axle's differential turns: the average of its two tires.
  carrier(axle) {
    return (axle.wheels[0].spin + axle.wheels[1].spin) / 2;
  }

  // Forward spin of the driven tires on average, and the car's forward speed and heading.
  get spin() {
    return this.driveshaft.spin;
  }
  get forward() {
    return norm([-this.az[0], 0, -this.az[2]]);
  }
  get heading() {
    const f = this.forward;
    return Math.atan2(-f[0], -f[2]);
  }
  get forwardSpeed() {
    return dot(this.v, this.forward);
  }
  get along() {
    return -this.p[2];
  }

  // Where a tire touches the ground and how hard the ground pushes back.
  contactOf(wheel) {
    const s = wheel.steer;
    const axle = this.toWorld([Math.cos(s), 0, -Math.sin(s)]); // the tire's axle, pointing right
    const turn = mul(axle, -1); // forward spin is a turn about this
    const centre = add(this.p, this.toWorld(wheel.from));
    // The lowest point of the tire's circle: straight down, kept within the tire's own plane.
    const down = norm([axle[1] * axle[0], axle[1] * axle[1] - 1, axle[1] * axle[2]]);
    const lowest = add(centre, mul(down, R));
    const ground = [lowest[0], 0, lowest[2]];
    const surface = surfaceAt(-ground[2], ground[0]);
    const k = surface.give === Infinity ? this.kTire : 1 / (1 / this.kTire + 1 / surface.give);
    const damping = 2 * surface.damping * Math.sqrt((k * this.mass) / 4);
    const sinking = add(this.v, cross(this.w, sub(ground, this.p)))[1];
    const press = -lowest[1];
    const normal = press > 0 ? Math.max(0, k * press - damping * sinking) : 0;
    const squash = normal / this.kTire;
    // A squashed tire's tread band hardly stretches, so it rolls as if only a third of the squash
    // smaller. The tire grips and is turned there: a rigid wheel of that radius.
    const rollingRadius = R - squash / 3;
    const point = add(centre, mul(down, rollingRadius));
    const r = sub(point, this.p);
    const rho = sub(point, centre);
    const velocity = this.treadVelocity(r, rho, turn, wheel.spin);
    return {
      wheel,
      surface,
      axle,
      turn,
      forward: norm([axle[2], 0, -axle[0]]),
      side: norm([axle[0], 0, axle[2]]),
      centre,
      point,
      ground, // where the tire meets the ground
      r,
      rho,
      normal,
      squash, // how far the tire itself is squashed
      sink: surface.give === Infinity ? 0 : normal / surface.give, // how far it sinks in
      rollingRadius,
      friction: [0, 0, 0],
      impulse: [0, 0, 0],
      limit: 0,
      slip: 0,
      sideSlip: 0,
      slipSpeed: 0,
      tread: velocity,
      crr: 0,
      rollingMoment: 0,
      soilDrag: 0,
    };
  }

  // The ground speed of the tread where it touches: the chassis's motion there plus the tire's spin.
  treadVelocity(r, rho, turn, spin) {
    return add(add(this.v, cross(this.w, r)), mul(cross(turn, rho), spin));
  }

  // A push at a tire's contact patch: it moves the whole car, turns the chassis, and turns the
  // tire on its axle (the part of its moment about the axle goes into the spin, not the chassis).
  push(c, impulse) {
    const twist = dot(cross(c.rho, impulse), c.turn);
    this.v = add(this.v, mul(impulse, 1 / this.mass));
    this.L = add(this.L, sub(cross(c.r, impulse), mul(c.turn, twist)));
    this.turnWheel(c.wheel, twist);
    this.refreshSpins();
  }

  // How much a unit push at a contact patch along d changes the tread's speed that way.
  inverseMassAt(c, d) {
    const twist = dot(cross(c.rho, d), c.turn);
    const dw = this.inverseInertia(sub(cross(c.r, d), mul(c.turn, twist)));
    return 1 / this.mass + dot(d, cross(dw, c.r)) + twist * twist * c.wheel.give;
  }

  // The same at a hub, where a push moves the chassis but doesn't turn the tire.
  inverseMassAtHub(r, d) {
    return 1 / this.mass + dot(d, cross(this.inverseInertia(cross(r, d)), r));
  }

  // The engine, gearbox, clutch and transfer case: the torque they put on the driven axles this
  // step (forward positive), and the flywheel's inertia they add to them while the clutch is in.
  drivetrain(h) {
    const { throttle } = this.controls;
    const carrier = this.driveshaft.spin;
    const ratio = this.gearRatio;

    // The automatic picks a forward gear by engine speed, once each change has gone through.
    if (this.shifting > 0) this.shifting = Math.max(0, this.shifting - h);
    if (this.auto && this.gear >= 1 && this.shifting === 0) {
      const rpm = carrier * ratio * RPM;
      if (throttle > 0 && rpm > UP_RPM && this.gear < GEARS.length) this.setGear(this.gear + 1);
      else if (rpm < DOWN_RPM && this.gear > 1) this.setGear(this.gear - 1);
    }

    let engine = 0; // torque at the flywheel
    let flywheel = 0; // the flywheel's inertia as the driven axles feel it, in all
    const fromWheels = carrier * ratio * RPM; // what the engine would turn at with the clutch in
    if (ratio === 0 || this.shifting > 0) {
      this.clutch = "open";
      this.rpm += ((throttle ? 3000 : ENGINE.idle) - this.rpm) * Math.min(1, h * 4);
    } else if (fromWheels >= ENGINE.engageRpm) {
      this.clutch = "in";
      this.rpm = fromWheels;
      engine = throttle > 0 ? throttle * engineTorque(this.rpm) : -engineDrag(this.rpm);
      flywheel = ENGINE.flywheel * ratio * ratio;
    } else if (throttle > 0) {
      // Pulling away: the clutch slips, holding the engine near its torque, and passes it on.
      this.clutch = "slipping";
      this.rpm += (ENGINE.slipRpm - this.rpm) * Math.min(1, h * 8);
      engine = throttle * engineTorque(this.rpm);
    } else {
      this.clutch = "open";
      this.rpm += (ENGINE.idle - this.rpm) * Math.min(1, h * 4);
    }
    this.engineTorque = engine;
    // Through the gears: more torque, less speed, less what the gears lose.
    const atWheels = engine * ratio * (engine > 0 ? ENGINE.efficiency : 1 / ENGINE.efficiency);
    this.wheelTorque = atWheels;
    this.driveshaft.inertia = this.driveshaft.base + flywheel;
    this.refreshSpins();
    return atWheels;
  }

  step(h) {
    const m = this.mass;
    const { brake, steer } = this.controls;

    // Steering: toward where the wheel is turned, at the steering's rate, the front tires set by
    // Ackermann geometry so both roll round the same centre, on the rear axle's line, a wheelbase
    // / tan(steer) to the side (positive: left). The inside tire is nearer it, so it turns more.
    const goal = Math.max(-1, Math.min(1, steer)) * CAR.maxSteer;
    const most = CAR.steerRate * h;
    this.steer += Math.max(-most, Math.min(most, goal - this.steer));
    const [fl, fr] = this.wheels;
    if (Math.abs(this.steer) < 1e-9) fl.steer = fr.steer = 0;
    else {
      const radius = CAR.wheelbase / Math.tan(this.steer);
      fl.steer = Math.atan(CAR.wheelbase / (radius - CAR.frontTrack / 2));
      fr.steer = Math.atan(CAR.wheelbase / (radius + CAR.frontTrack / 2));
    }

    const contacts = this.wheels.map((w) => (w.contact = this.contactOf(w)));

    // Gravity, the ground's push and air drag.
    const speed = Math.hypot(...this.v);
    const dragPerSpeed = 0.5 * this.air * CAR.dragArea * speed;
    this.drag = dragPerSpeed * speed;
    let force = [-dragPerSpeed * this.v[0], -m * this.g - dragPerSpeed * this.v[1], -dragPerSpeed * this.v[2]];
    let torque = [0, 0, 0];
    for (const c of contacts) {
      force = add(force, [0, c.normal, 0]);
      torque = add(torque, cross(c.r, [0, c.normal, 0]));
    }
    // The drivetrain turns the driven tires and, pushing off the chassis, twists it back.
    const atWheels = this.drivetrain(h);
    this.driveshaft.spin += (atWheels * h) / this.driveshaft.inertia;
    torque = add(torque, mul(this.ax, atWheels));
    // Air drag on each spinning tire.
    for (const w of this.wheels) this.turnWheel(w, -0.5 * this.air * SPIN_CM * R ** 5 * w.spin * Math.abs(w.spin) * h);
    this.refreshSpins();
    this.v = add(this.v, mul(force, h / m));
    this.L = add(this.L, mul(torque, h));
    this.w = this.inverseInertia(this.L);

    // Grip at each tire: the friction its slip calls for, against the slip, but never more than it
    // takes to stop the slip this step, which real grip never overshoots. All the tires are solved
    // together from the same state, a few passes over, so none goes first and a car going
    // straight stays straight. In four-wheel drive, each pass also keeps the front and rear
    // driveshafts turning together.
    const touching = contacts.filter((c) => c.normal > 0);
    for (const c of touching) {
      const tread = this.treadVelocity(c.r, c.rho, c.turn, c.wheel.spin);
      const hub = add(this.v, cross(this.w, sub(c.centre, this.p)));
      const along = dot(tread, c.forward);
      const across = dot(tread, c.side);
      const travel = dot(hub, c.forward);
      const treadSpeed = travel - along; // how fast the tread runs round, as a ground speed
      const ref = Math.max(Math.abs(travel), Math.abs(treadSpeed), CREEP_SPEED);
      c.slip = -along / ref; // positive: wheelspin; negative: skidding
      c.sideSlip = across / ref;
      c.slipSpeed = -along;
      c.tread = tread;
      c.limit = c.surface.grip(Math.hypot(along, across) / ref) * c.normal * h;
    }
    // Brakes and rolling resistance slow each tire's spin, never reversing it, so a braked tire at
    // a standstill is held: the rubber's own loss (more at low pressure and high speed, an
    // empirical fit for car tires) is a moment against the spin.
    const kmh = Math.abs(this.forwardSpeed) * 3.6;
    for (const c of contacts) {
      c.crr = this.options.rolling ? c.surface.hysteresis * (0.005 + (0.01 + 0.0095 * (kmh / 100) ** 2) / this.pressureBar) : 0;
      c.rollingMoment = c.crr * c.normal * c.rollingRadius;
    }
    const slowing = this.wheels.map((w) => {
      const axle = this.axles.find((a) => a.wheels.includes(w));
      const brakes = brake * axle.brake;
      return { wheel: w, brakes, limit: (brakes + w.contact.rollingMoment) * h, impulse: 0 };
    });
    const active = slowing.filter((s) => s.limit > 0);
    const relax = 1 / Math.max(1, touching.length + active.length);
    for (let pass = 0; pass < GRIP_PASSES; pass++) {
      const changes = touching.map((c) => {
        const tread = this.treadVelocity(c.r, c.rho, c.turn, c.wheel.spin);
        const slipSpeed = Math.hypot(tread[0], tread[2]);
        let want = c.impulse;
        if (slipSpeed > 1e-12) {
          const dir = [-tread[0] / slipSpeed, 0, -tread[2] / slipSpeed];
          want = add(c.impulse, mul(dir, (relax * slipSpeed) / this.inverseMassAt(c, dir)));
        }
        const size = Math.hypot(want[0], want[2]);
        if (size > c.limit) want = mul(want, c.limit / size);
        return sub(want, c.impulse);
      });
      const turns = active.map((s) => {
        const want = Math.max(-s.limit, Math.min(s.limit, s.impulse - (relax * s.wheel.spin) / s.wheel.give));
        return want - s.impulse;
      });
      touching.forEach((c, i) => {
        c.impulse = add(c.impulse, changes[i]);
        this.push(c, changes[i]);
      });
      active.forEach((s, i) => {
        s.impulse += turns[i];
        this.turnWheel(s.wheel, turns[i]);
      });
      this.refreshSpins();
      this.w = this.inverseInertia(this.L);
    }
    for (const c of touching) c.friction = mul(c.impulse, 1 / h);
    // What the brakes put on the tires, the chassis takes back (forward positive on a tire).
    const braking = active.reduce((sum, s) => sum + (s.impulse * s.brakes) / (s.limit / h || 1), 0);
    if (braking) this.L = add(this.L, mul(this.ax, braking));
    this.w = this.inverseInertia(this.L);
    // Pressing soft ground down ahead of a tire drags that tire back: for a tire that sinks z,
    // about sqrt(z / diameter) of its load, at its hub, against its travel. It never pushes back.
    for (const c of contacts) {
      if (!this.options.rolling || c.sink <= 0) continue;
      const share = Math.sqrt(c.sink / (2 * R));
      c.crr += share;
      c.soilDrag = share * c.normal;
      const r = sub(c.centre, this.p);
      const moving = add(this.v, cross(this.w, r));
      const s = Math.hypot(moving[0], moving[2]);
      if (s < 1e-9) continue;
      const dir = [-moving[0] / s, 0, -moving[2] / s];
      const impulse = mul(dir, Math.min(c.soilDrag * h, s / this.inverseMassAtHub(r, dir)));
      this.v = add(this.v, mul(impulse, 1 / m));
      this.L = add(this.L, cross(r, impulse));
      this.w = this.inverseInertia(this.L);
    }

    // Move and turn.
    this.p = add(this.p, mul(this.v, h));
    const [qw, qx, qy, qz] = this.q;
    const [wx, wy, wz] = this.w;
    const half = h / 2;
    const q = [
      qw + half * (-wx * qx - wy * qy - wz * qz),
      qx + half * (wx * qw + wy * qz - wz * qy),
      qy + half * (wy * qw + wz * qx - wx * qz),
      qz + half * (wz * qw + wx * qy - wy * qx),
    ];
    const ql = Math.hypot(...q);
    this.q = q.map((v) => v / ql);
    this.update();
    for (const w of this.wheels) w.angle += w.spin * h;
    this.shaftAngle += this.driveshaft.spin * AXLE_RATIO * h;
    this.engineAngle += (this.rpm / RPM) * h;

    this.time += h;
    this.moved += Math.hypot(this.v[0], this.v[2]) * h;
  }

  // The rear tires' share of the weight at rest.
  get rearShare() {
    return (this.centre[2] + HALF_BASE) / CAR.wheelbase;
  }

  energy() {
    const spins = this.modes.reduce((s, m) => s + 0.5 * m.inertia * m.spin * m.spin, 0);
    return 0.5 * this.mass * dot(this.v, this.v) + 0.5 * dot(this.w, this.L) + spins + this.mass * this.g * this.p[1];
  }
}

// A solid box's moments of inertia about its own centre, along its sides.
function boxInertia(m, [x, y, z]) {
  return [(m * (y * y + z * z)) / 12, (m * (x * x + z * z)) / 12, (m * (x * x + y * y)) / 12];
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

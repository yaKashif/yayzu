// Naseeb's physics: Naseeb's jeep, a 1970 Toyota Land Cruiser FJ40 as closely as published specs
// allow, on the mountain in mountain.js (or the flat strips of surfaces in ground.js the checks
// use). A ladder frame on four H78-15 tires, the front two steered; the F six, a 3-speed
// gearbox and a two-speed transfer case driving both axles. SI units throughout: metres,
// kilograms, seconds, newtons, radians.
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
// - Leaf springs: the frame and body (the sprung mass) ride on four leaf springs, one under each
//   frame rail at each axle, with a shock absorber beside each. Each axle (the unsprung mass: its
//   housing, brakes, wheels and tires) is its own body that rises, falls and tilts under the frame:
//   the tires push it up, the springs and shocks push back between it and the frame. Bump stops
//   and droop limits end the travel, and the leaves rubbing on each other add a little friction.
//   So the body rolls in turns, squats when it pulls away, dives when it brakes, and an axle
//   articulates over uneven grip and load.
// - The frame and body are one rigid body. The tires' spins are tied together by the drivetrain: each
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
// - Air drag on the whole car.
// - Ground of any shape: a tire touches it where it comes nearest the hub, so on a slope the
//   ground pushes back square to the slope and grip acts along it, and a tire meeting a log or a
//   step is pushed back and up off its edge. The chassis can touch down too: the bumpers, the
//   frame rails, the transfer case and the differentials scrape on whatever they hit, and rolling
//   over, the body and roof. Its bumpers and sides hit tree trunks.
// Left out for now: the leaf springs' wind-up under torque, the gyroscopic pull of the spinning
// tires on the chassis, steering self-aligning torque, tire heat and wear, more than one point of
// contact per tire.

import { SURFACES, STRIP, TRACK_HALF, STRIPS, stripIndexAt, stripAt, surfaceAt, stripNear, STRIP_GROUND } from "./ground.js";
import { MOUNTAIN } from "./mountain.js";
export { SURFACES, STRIP, TRACK_HALF, STRIPS, stripIndexAt, stripAt, surfaceAt, stripNear, STRIP_GROUND, MOUNTAIN };

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
  // A 1970s bias-ply tire grips less than a modern radial: about 0.85 of the surface's friction
  // (so near 0.8 g on dry asphalt, where a radial would manage 1).
  grip: 0.85,
};
const R = TIRE.radius;
const RB = TIRE.rimRadius;

export const CAR = {
  name: "Naseeb's jeep",
  wheelbase: 2.285,
  frontTrack: 1.405, // between the tires' centres across an axle
  rearTrack: 1.4,
  // Full lock at the middle of the front axle. Not published that we could find: this gives an
  // outside front tire a 5.3 m turning radius, about right for the FJ40.
  maxSteer: (29 * Math.PI) / 180,
  // How fast the front tires turn (rad/s), at a person's pace on a heavy unassisted wheel: a press
  // starts slowly (the steering wheel at about 340°/s), held it speeds up after a moment (to about
  // 630°/s), and the next press starts slow again. Let go and they straighten only while the car
  // rolls, as the caster pulls them, faster the faster it goes (full speed from `centreAt` m/s);
  // standing still, they stay where they were left.
  steerRate: { slow: 0.3, fast: 0.55, after: 0.3, ramp: 1.2, centre: 0.6, centreAt: 5 },
  // The throttle the same way: a press opens it to `start`, holding it opens it the rest of the
  // way over `ramp` seconds after `after`; let go, it closes in `release` seconds.
  throttleRamp: { start: 0.25, after: 0.3, ramp: 1.5, release: 0.7 },
  steeringRatio: 20, // turns of the steering wheel to the front tires' (recirculating ball)
  rightHandDrive: true, // as in Pakistan, Japan and Australia
  dragArea: 0.65 * 2.6, // Cd times frontal area: a brick with a windscreen
};
const HALF_BASE = CAR.wheelbase / 2;

// The engine: Toyota's F, a 3.9-litre (3878 cc) overhead-valve straight six. Torque at the
// flywheel in N·m by rpm, through 283 N·m (209 lb·ft) at 2,000 rpm and 125 hp at 3,600; past
// the governor at 4,000 there's no more.
export const ENGINE = {
  name: "3.9 L straight six",
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
  // The automatic clutch takes up from `biteFrom` rpm and grips fully by `biteFull`, like a
  // driver letting a clutch out: a gentle start pulls away near 1,700 rpm, a hard one near 2,000.
  biteFrom: 1200,
  biteFull: 2200,
  // A part-open throttle lets in only so much air, so the engine makes less of its torque the
  // faster it turns: the share is the throttle's opening (to the power 1.3, as a butterfly
  // valve's area grows) times this rpm over the engine's. Wide open it's all of it.
  throttleFlow: 4500,
  engageRpm: 900, // below this from the wheels' side, the clutch lets go rather than stall the engine
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
// The automatic drives as an FJ40 driver would on the road, in high range: High 1st, 2nd and 3rd
// (gears 3, 5 and 6). Low range is there to pick by hand. It changes up past UP_RPM on the
// throttle and down below DOWN_RPM; each change opens the clutch for SHIFT_TIME.
const AUTO_GEARS = [3, 5, 6];
const UP_RPM = 3400;
const DOWN_RPM = 1300;
const SHIFT_TIME = 0.3;
// The most torque the automatic clutch can pass, fully biting, N·m.
const CLUTCH_TORQUE = 420;

// Drum brakes, 290 mm: the most torque each can put on its tire, front and rear.
export const BRAKES = { front: 1400, rear: 1000 };

// Everything on the car besides the tires, as boxes: mass (kg), centre and size (m) in the car's
// own axes, measured from the middle between the axles at hub height. Parts marked `axle` are
// unsprung, part of that axle; the rest ride on the springs. The masses are estimates that add up
// to the FJ40's 1,480 kg kerb weight, about 57% on the front tires. The scene draws the frame and
// running gear from these boxes, and the body from its own model, where these sit. Bumper to
// bumperettes it is 3.84 m long, the FJ40's published length: 0.70 m ahead of the front axle and
// 0.86 m behind the rear (the split is estimated; only the total is published).
export const PARTS = [
  { name: "frame rail", mass: 42, at: [-0.42, 0.12, -0.12], size: [0.06, 0.15, 3.42] },
  { name: "frame rail", mass: 42, at: [0.42, 0.12, -0.12], size: [0.06, 0.15, 3.42] },
  ...[-1.7, -1.1, -0.2, 0.6, 1.5].map((z) => ({ name: "cross member", mass: 6, at: [0, 0.12, z], size: [0.84, 0.08, 0.06] })),
  { name: "front bumper", mass: 15, at: [0, 0.12, -1.79], size: [1.6, 0.15, 0.1] },
  { name: "rear cross member", mass: 10, at: [0, 0.12, 1.66], size: [1.2, 0.12, 0.08] },
  { name: "engine", mass: 260, at: [0, 0.3, -0.75], size: [0.5, 0.65, 0.95] },
  { name: "gearbox and transfer case", mass: 95, at: [0, 0.12, 0], size: [0.35, 0.35, 0.65] },
  { name: "radiator", mass: 28, at: [0, 0.45, -1.4], size: [0.7, 0.6, 0.1] },
  // Under the driver's seat, on the right.
  { name: "fuel tank", mass: 50, at: [0.3, 0.25, 0.25], size: [0.5, 0.25, 0.6] },
  { name: "battery", mass: 20, at: [-0.45, 0.45, -1.2], size: [0.25, 0.22, 0.17] },
  { name: "exhaust, steering and the rest", mass: 40, at: [0, 0.25, -0.2], size: [0.8, 0.3, 2.0] },
  // Each leaf spring is half on the frame and half on its axle.
  ...[-1, 1].flatMap((z) => [-1, 1].map((x) => ({ name: "leaf spring", mass: 7, at: [x * 0.42, 0.06, z * HALF_BASE], size: [0.07, 0.04, 1.15] }))),
  ...[-1, 1].flatMap((z) => [-1, 1].map((x) => ({ name: "leaf spring", mass: 7, at: [x * 0.42, 0.03, z * HALF_BASE], size: [0.07, 0.04, 1.15], axle: z < 0 ? "front" : "rear" }))),
  // The body: steel tub, front fenders, hood and grille, cowl and windscreen, doors, a steel
  // hardtop, seats, and the spare wheel on the back.
  { name: "body tub", mass: 145, at: [0, 0.5, 1.05], size: [1.6, 0.6, 1.9] },
  { name: "front clip", mass: 95, at: [0, 0.62, -1.12], size: [1.66, 0.6, 1.14] },
  { name: "cowl, dash and windscreen", mass: 55, at: [0, 0.85, -0.5], size: [1.5, 0.8, 0.3] },
  { name: "doors", mass: 50, at: [0, 0.55, -0.1], size: [1.66, 0.6, 0.85] },
  { name: "hardtop", mass: 60, at: [0, 1.4, 0.75], size: [1.6, 0.6, 2.5] },
  { name: "seats", mass: 35, at: [0, 0.45, 0.05], size: [1.2, 0.5, 0.5] },
  { name: "spare wheel", mass: 27, at: [0, 0.65, 2.05], size: [0.2, 0.7, 0.7] },
  { name: "rear bumperettes", mass: 10, at: [0, 0.12, 1.96], size: [1.5, 0.1, 0.1] },
  // The axles: banjo housings with their differentials, shafts, hubs and drum brakes; at the front
  // the Birfield knuckles too.
  { name: "front axle", mass: 125, at: [0, 0, -HALF_BASE], size: [CAR.frontTrack - 0.2, 0.1, 0.1], axle: "front" },
  { name: "rear axle", mass: 105, at: [0, 0, HALF_BASE], size: [CAR.rearTrack - 0.2, 0.09, 0.09], axle: "rear" },
];

// The leaf springs and shocks at each axle: the spring rate at each spring (N/m), where the
// springs and shocks sit across the axle (m from the middle), the shocks' damping (N·s/m; less in
// bump, more in rebound), and the travel from the static ride height to the bump stops and to
// full droop. Stock rates aren't published; these are a firm truck's, the rear stiffer because it
// carries the load (FJ40 springs run about 200 to 400 lb/in).
//
// Body roll comes from the springs resisting the body tilting over the axles. Up-and-down, a pair
// of springs only 0.84 m apart (under the frame rails) resists that weakly: rate × spacing² / 2.
// But tilting the body over a solid axle also twists each leaf pack along its length, which
// resists it too (`twist`, N·m/rad per axle). Worked from the steel: a pack of 63.5 x 7 mm leaves
// twisting over the 0.55 m either side of the axle gives about 20 kN·m/rad an axle; the rubber eye
// bushings give some of that back, so 15. The
// roll centre (m above the ground) is where each axle's springs hold it sideways, about the spring
// eyes: a sideways push at the tires reaches the body there, and the rest of its leverage tips the
// axle, moving load straight across to the outside tire. Between the leaves, friction (about 5 to
// 10% of the load on an old spring) holds the springs still until the forces clearly beat it, so
// the body settles firmly rather than easing back past level.
export const SUSPENSION = {
  front: { rate: 40e3, seat: 0.42, shock: 0.5, damping: 4200, bump: 0.08, droop: 0.11, rollCentre: 0.47, twist: 15e3 },
  rear: { rate: 48e3, seat: 0.42, shock: 0.5, damping: 3800, bump: 0.09, droop: 0.12, rollCentre: 0.5, twist: 15e3 },
  bumpShare: 0.45, // of the damping, going up
  reboundShare: 1.55, // and coming back down
  stop: 400e3, // the bump stops and droop limits, N/m
  leafFriction: 180, // N of friction between a spring's leaves
  frictionSpeed: 0.005, // m/s over which that friction builds up: it grips almost at once
};

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
// The engine's torque at a pedal opening and rpm: its share of the full-throttle curve (what air
// the throttle lets in), less friction and pumping for the rest.
export function engineAt(pedal, rpm) {
  const share = pedal > 0 ? Math.min(1, (pedal ** 1.3 * ENGINE.throttleFlow) / Math.max(rpm, 600)) : 0;
  return share * engineTorque(rpm) - (1 - share) * engineDrag(rpm);
}
const RPM = 60 / (2 * Math.PI);

export const STEP = 1 / 4000; // seconds per physics step
const MAX_STEPS = 400; // a long stall is dropped rather than caught up
// Below this speed slip is measured against it instead, so grip stays well defined at a standstill.
const CREEP_SPEED = 0.25;
const SPIN_CM = 0.05; // air's drag on a spinning tread, as a moment coefficient
const GRIP_PASSES = 8;

// Where the chassis can touch the ground, in the car's own axes from the middle between the axles
// at hub height: under the front bumper and the rear bumperettes, along the frame rails, and the
// transfer case's belly. All ride on the springs. Each axle's differential hangs DIFF_DROP below
// its middle, DIFF_OFFSET to the right.
const SKIDS = [
  ...[-0.75, 0, 0.75].map((x) => [x, 0.05, -1.82]),
  ...[-0.7, 0.7].map((x) => [x, 0.07, 1.98]),
  ...[-1.4, -0.5, 0.4, 1.4].flatMap((z) => [-0.42, 0.42].map((x) => [x, 0.045, z])),
  [0, -0.06, 0.1],
  // Rolling over: the fenders, the tub's top corners, the roof's corners.
  ...[-0.84, 0.84].flatMap((x) => [
    [x, 0.72, -1.68],
    [x, 0.86, 0.3],
    [x, 0.86, 1.9],
    [x, 1.6, -0.55],
    [x, 1.6, 1.85],
  ]),
  [0, 0.84, -1.7],
];
// The body's outline, seen from above, for hitting trees: the front bumper, the sides, the back;
// each from one point to another (car axes, as above).
const SIDES = [
  [[-0.82, 0.12, -1.84], [0.82, 0.12, -1.84]],
  [[-0.84, 0.6, -1.8], [-0.84, 0.6, 1.96]],
  [[0.84, 0.6, -1.8], [0.84, 0.6, 1.96]],
  [[-0.8, 0.5, 1.98], [0.8, 0.5, 1.98]],
];
const TRUNK_STIFFNESS = 1.5e6;
const TRUNK_DAMPING = 30e3;
const TRUNK_FRICTION = 0.4;
const DIFF_DROP = 0.14; // the FJ40's 21 cm of clearance under the differentials
const DIFF_OFFSET = 0.1;
const SKID_STIFFNESS = 2e6; // steel against the ground, N/m
const SKID_DAMPING = 30e3;
const SKID_FRICTION = 0.45;
const MAX_SPIN = 15; // rad/s
const MAX_AXLE = 25; // m/s, and per second of slope

// Lengths, quicker than Math.hypot.
const hyp = (a, b) => Math.sqrt(a * a + b * b);
const hyp3 = (a, b, c) => Math.sqrt(a * a + b * b + c * c);
const lenOf = (v) => {
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  return Math.sqrt(s);
};

// Small vector helpers on [x, y, z] arrays.
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => {
  const l = hyp3(a[0], a[1], a[2]);
  return l > 0 ? mul(a, 1 / l) : [0, 0, 0];
};

export class Sim {
  // options are for checking the model: rolling and air resistance can be switched off.
  // options.ground is the ground to drive on: the mountain, unless the checks want the flat strips.
  constructor(settings = DEFAULTS, options = {}) {
    this.options = { rolling: true, air: true, ...options };
    this.ground = this.options.ground || MOUNTAIN;
    this.time = 0; // never reset, so anything timed by it carries on through a reset
    this.wheels = WHEELS.map((w) => ({ ...w, spin: 0, angle: 0, steer: 0, contact: null }));
    this.modes = [];
    this.auto = true; // the automatic picks the gear
    this.gear = AUTO_GEARS[0]; // 1 to 6, 0 for neutral, -1 for reverse
    this.shifting = 0; // seconds left with the clutch open for a gear change
    this.controls = { throttle: 0, brake: 0, steer: 0 };
    this.axles = [];
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

    // The sprung body (frame, body and everything on the springs): its mass, centre of mass, and
    // how hard it is to turn about each of its own axes (the car is near enough the same either
    // side, so these are its principal axes). The axles (with their wheels) are unsprung: they ride
    // up and down and tilt on their own, but go along with the body, so they count toward its
    // mass going along and its inertia turning (yaw).
    const sprung = PARTS.filter((p) => !p.axle).map((p) => ({ mass: p.mass, at: p.at, own: boxInertia(p.mass, p.size) }));
    this.sprungMass = sprung.reduce((s, b) => s + b.mass, 0);
    this.centre = mul(sprung.reduce((s, b) => add(s, mul(b.at, b.mass)), [0, 0, 0]), 1 / this.sprungMass);
    this.inertia = [0, 0, 0];
    for (const b of sprung) {
      const [dx, dy, dz] = sub(b.at, this.centre);
      this.inertia[0] += b.mass * (dy * dy + dz * dz) + b.own[0];
      this.inertia[1] += b.mass * (dx * dx + dz * dz) + b.own[1];
      this.inertia[2] += b.mass * (dx * dx + dy * dy) + b.own[2];
    }
    const oldAxles = this.axles;
    const [fl, fr, rl, rr] = this.wheels;
    this.axles = ["front", "rear"].map((name, i) => {
      const wheels = i ? [rl, rr] : [fl, fr];
      const set = SUSPENSION[name];
      const z = (i ? 1 : -1) * HALF_BASE;
      const parts = [
        ...PARTS.filter((p) => p.axle === name).map((p) => ({ mass: p.mass, at: p.at, own: boxInertia(p.mass, p.size) })),
        ...wheels.map((w) => ({ mass: m, at: w.at, own: [0, across, across] })),
      ];
      const mass = parts.reduce((sum, b) => sum + b.mass, 0);
      // Tilting about its middle, across (roll), and its share of the car's turning (yaw).
      let roll = 0;
      for (const b of parts) {
        roll += b.mass * (b.at[0] ** 2 + b.at[1] ** 2) + b.own[2];
        const [dx, , dz] = sub(b.at, this.centre);
        this.inertia[1] += b.mass * (dx * dx + dz * dz) + b.own[1];
      }
      const old = oldAxles[i] || {};
      return {
        name,
        wheels,
        track: Math.abs(wheels[1].at[0] - wheels[0].at[0]),
        mass,
        roll,
        // From the body's centre of mass to the middle of the axle at its static ride height.
        attach: sub([0, 0, z], this.centre),
        ...set,
        // Where it is: height of its middle, tilt (rise across, per metre, to the right), and
        // their rates. Kept through a change of set-up.
        y: old.y ?? 0,
        vy: old.vy ?? 0,
        slope: old.slope ?? 0,
        vslope: old.vslope ?? 0,
        travel: [0, 0], // spring compression past static, left and right, for the readouts
        load: [0, 0],
      };
    });
    for (const w of this.wheels) {
      w.axle = this.axles[w.front ? 0 : 1];
      w.offset = w.at[0]; // across the axle, from its middle
    }
    const unsprung = this.axles.reduce((sum, a) => sum + a.mass, 0);
    this.mass = this.sprungMass + unsprung;
    // The springs carry the sprung weight at the static ride height, shared front and rear by where
    // its centre of mass is.
    const frontShare = (HALF_BASE - this.centre[2]) / CAR.wheelbase;
    const sprungWeight = this.sprungMass * (WORLDS[settings.world] || WORLDS.earth).g;
    this.axles[0].preload = (sprungWeight * frontShare) / 2 / this.axles[0].rate;
    this.axles[1].preload = (sprungWeight * (1 - frontShare)) / 2 / this.axles[1].rate;
    // A push along the ground at a contact patch also has to speed up the axles, which go along
    // at hub height, not the body's centre of mass: as if the push acted this much higher.
    this.raise = (unsprung / this.mass) * this.centre[1];
    // Across, a tire's push splits by mass: the body's share reaches it at the roll centre; the
    // axles' share just moves the axles, at hub height, and never leans the body.
    this.sprungShare = this.sprungMass / this.mass;
    this.bodyHeight = R + this.centre[1]; // the body's centre of mass above the ground, at rest
    // The whole car's centre of mass, at rest.
    const all = [...PARTS.map((p) => ({ mass: p.mass, at: p.at })), ...WHEELS.map((w) => ({ mass: m, at: w.at }))];
    this.totalCentre = mul(all.reduce((sum, b) => add(sum, mul(b.at, b.mass)), [0, 0, 0]), 1 / this.mass);

    // The tires' spins, as the drivetrain ties them. Each mode is a way things can turn: the
    // driveshaft (the driven axles' differentials, with everything turning with them), an open
    // differential's difference between its two tires, or a free tire on its own. A tire's spin is
    // the sum of the modes it's linked to: left = driveshaft + difference, right = driveshaft -
    // difference. Two tires each of inertia I give a driveshaft 2I, and a difference 2I too.
    const old = this.wheels.map((w) => w.spin);
    this.fourByFour = settings.drive !== "rear";
    Object.assign(this.axles[0], { locked: settings.lockers === "both", driven: this.fourByFour, brake: BRAKES.front });
    Object.assign(this.axles[1], { locked: settings.lockers !== "none", driven: true, brake: BRAKES.rear });
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

  // Puts the car `along` metres down the flat track, square across it (for the checks).
  reset(along, height = 0) {
    this.place(0, -along, 0, height);
  }

  // Puts the car with its centre of mass over (x, z), facing `heading` (0 north, up -z; positive
  // turned left), sat on the slope of the ground under its tires, `height` above it, still.
  place(x, z, heading = 0, height = 0) {
    const sag = (this.mass * this.g) / 4 / this.kTire; // tires squashed under its weight
    const cos = Math.cos(heading);
    const sin = Math.sin(heading);
    // A point in the car's own axes (level, from its centre of mass) on the ground.
    const world = (lx, lz) => [x + lx * cos + lz * sin, z - lx * sin + lz * cos];
    const at = (w, ahead = 0) => world(w.at[0] - this.centre[0], w.at[2] - this.centre[2] - ahead);
    // The ground under each tire, and the slope that makes along the car and across it; then high
    // enough to clear anything near a tire that stands up off that slope, a log or a stone.
    const under = WHEELS.map((w) => this.ground.height(...at(w)));
    const [fl, fr, rl, rr] = under;
    const grade = ((fl + fr - rl - rr) / 2) / CAR.wheelbase; // rise per metre ahead
    let clear = 0;
    WHEELS.forEach((w, i) => {
      for (const ahead of [-0.3, -0.15, 0.15, 0.3]) clear = Math.max(clear, this.ground.height(...at(w, ahead)) - (under[i] + ahead * grade));
    });
    height += clear;
    const pitch = Math.atan(grade); // nose up
    const roll = Math.atan(((fr + rr) / 2 - (fl + rl) / 2) / CAR.frontTrack); // right side up
    const half = (a) => [Math.cos(a / 2), Math.sin(a / 2)];
    const [pc, ps] = half(pitch);
    const [rc, rs] = half(roll);
    const [yc, ys] = half(heading);
    // Pitched about x, then rolled about the car's z, then turned about the world's up.
    const [w2, x2, y2, z2] = [pc * rc, ps * rc, -ps * rs, pc * rs];
    this.q = [yc * w2 - ys * y2, yc * x2 + ys * z2, yc * y2 + ys * w2, yc * z2 - ys * x2];
    this.v = [0, 0, 0];
    this.L = [0, 0, 0]; // the body's angular momentum
    this.p = [x, 0, z];
    this.update();
    // The middle between the axles at hub height, its tires' squash above the ground's slope where
    // it ends up (tipping it about its centre of mass moves it a little).
    const fromMiddle = this.toWorld(this.centre);
    const level = world(-this.centre[0], -this.centre[2]);
    const dx = x - fromMiddle[0] - level[0];
    const dz = z - fromMiddle[2] - level[1];
    const ground = (fl + fr + rl + rr) / 4 + Math.tan(pitch) * (-dx * sin - dz * cos) + Math.tan(roll) * (dx * cos - dz * sin);
    const middle = ground + (R - sag) / Math.cos(pitch) / Math.cos(roll) + height;
    this.p = [x, middle + fromMiddle[1], z];
    this.update();
    for (const a of this.axles) {
      a.y = this.p[1] + this.toWorld(a.attach)[1];
      a.slope = Math.tan(roll);
      a.vy = a.vslope = 0;
    }
    for (const m of this.modes) m.spin = 0;
    for (const w of this.wheels) w.steer = 0;
    this.refreshSpins();
    this.steer = 0; // at the middle of the front axle, positive to the left
    this.steerHeld = 0; // how long the steering's been held one way
    this.steerWay = 0;
    if (this.auto) this.gear = AUTO_GEARS[0];
    this.pedal = 0; // how far the throttle is open
    this.throttleHeld = 0;
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
      if (!AUTO_GEARS.includes(this.gear)) this.setGear(AUTO_GEARS[0]);
      return;
    }
    this.auto = false;
    this.setGear(gear);
  }

  // The automatic's reverse: into R (or back to drive) without leaving the automatic.
  autoReverse(on) {
    this.auto = true;
    this.setGear(on ? -1 : AUTO_GEARS[0]);
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

  // How steeply the body's own across slopes, right side up: tan of its roll, capped.
  get bodySlope() {
    return Math.max(-2, Math.min(2, this.ax[1] / hyp(this.ax[0], this.ax[2])));
  }

  // On its side or its roof: over 70° from upright.
  get overturned() {
    return this.ay[1] < 0.34;
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

  // An axle in the world: its middle (under the body where it's attached, at its own height),
  // its beam's direction across (tilted by its own slope), and which way is up from it.
  axleFrame(a) {
    const at = add(this.p, this.toWorld(a.attach));
    const across = norm([this.ax[0], 0, this.ax[2]]);
    const beam = norm(add(across, [0, a.slope, 0]));
    const up = norm(cross(beam, this.forward));
    return { at, middle: [at[0], a.y, at[2]], beam, up };
  }

  // Where the ground comes nearest a hub, looking along `heading` (level, the way the tire rolls):
  // that point, how far it is from the hub, and the way from it to the hub. On level ground it's
  // straight under the hub; on a climb, a little up the slope; meeting a log or a step, on its
  // edge, so the ground pushes back as well as up.
  touch(centre, heading) {
    const g = this.ground;
    const span = R * 0.95;
    const n = 20;
    const gap = (2 * span) / n;
    const at = (s) => {
      const x = centre[0] + heading[0] * s;
      const z = centre[2] + heading[2] * s;
      const h = g.height(x, z);
      const up = centre[1] - h;
      return { s, x, z, h, up, d2: s * s + up * up };
    };
    const samples = [];
    let best = 0;
    for (let i = 0; i <= n; i++) {
      samples.push(at(-span + i * gap));
      if (samples[i].d2 < samples[best].d2) best = i;
    }
    let near = samples[best];
    // Between samples: where a parabola through the nearest three bottoms out.
    if (best > 0 && best < n) {
      const [a, b, c] = [samples[best - 1].d2, near.d2, samples[best + 1].d2];
      const curve = a - 2 * b + c;
      if (curve > 1e-12) {
        const between = at(near.s + (0.5 * gap * (a - c)) / curve);
        if (between.d2 < near.d2) near = between;
      }
    }
    const ground = [near.x, near.h, near.z];
    // Buried to its middle (only in a crash): pushed straight up.
    if (near.up < 0.02) return { ground, distance: near.up, normal: [0, 1, 0] };
    const distance = Math.sqrt(near.d2);
    return { ground, distance, normal: [(-heading[0] * near.s) / distance, near.up / distance, (-heading[2] * near.s) / distance] };
  }

  // Where a tire touches the ground and how hard the ground pushes back.
  contactOf(wheel) {
    const s = wheel.steer;
    const frame = this.axleFrame(wheel.axle);
    // The tire's axle, pointing right: the beam, turned about the kingpin by the steering.
    const axle = add(mul(frame.beam, Math.cos(s)), mul(cross(frame.up, frame.beam), Math.sin(s)));
    const turn = mul(axle, -1); // forward spin is a turn about this
    const centre = add(frame.middle, mul(frame.beam, wheel.offset));
    const heading = norm([axle[2], 0, -axle[0]]); // the way it rolls, level
    const level = norm([axle[0], 0, axle[2]]); // across it, level
    const { ground, distance, normal: inPlane } = this.touch(centre, heading);
    // The ground pushes back from there toward the hub, tilted further by any slope across the
    // tire, measured over its width. On a plane, that's square to the plane.
    const g = this.ground;
    const half = TIRE.width / 2;
    const rise = g.height(ground[0] + level[0] * half, ground[2] + level[2] * half) - g.height(ground[0] - level[0] * half, ground[2] - level[2] * half);
    const tilt = Math.max(-1.5, Math.min(1.5, rise / (2 * half)));
    const n = norm(sub(inPlane, mul(level, tilt * inPlane[1])));
    const press = (R - distance) * dot(n, inPlane);
    const surface = g.surface(ground[0], ground[2]);
    const k = surface.give === Infinity ? this.kTire : 1 / (1 / this.kTire + 1 / surface.give);
    const damping = 2 * surface.damping * Math.sqrt((k * this.mass) / 4);
    // How fast the hub is pulling away from the ground: it goes along with the body, and up and
    // down with its axle.
    const hub = add(this.v, cross(this.w, sub(centre, this.p)));
    hub[1] = wheel.axle.vy + wheel.axle.vslope * wheel.offset;
    const normal = press > 0 ? Math.max(0, k * press - damping * dot(hub, n)) : 0;
    const squash = normal / this.kTire;
    // A squashed tire's tread band hardly stretches, so it rolls as if only a third of the squash
    // smaller. The tire grips and is turned there: a rigid wheel of that radius.
    const rollingRadius = R - squash / 3;
    const point = sub(centre, mul(n, rollingRadius));
    // How far the hub is above where the tire touches, along the body's up: R on level ground.
    const drop = dot(sub(centre, point), this.ay);
    // A push along the car here acts on the body as if `raise` higher (see configure); a push
    // across it, at the axle's roll centre.
    const r = add(sub(point, this.p), mul(this.ay, this.raise));
    // Across: the body's share of the push at the roll centre, the axles' share at the body's own
    // height (turning the car, but not leaning it), so in all as if at this height above the ground.
    const across = this.sprungShare * wheel.axle.rollCentre + (1 - this.sprungShare) * this.bodyHeight;
    const rAcross = add(sub(point, this.p), mul(this.ay, across - R + drop));
    const lateral = norm([this.ax[0], 0, this.ax[2]]);
    const rho = sub(point, centre);
    // The way the tire rolls and across it, along the ground.
    const forward = norm(sub(heading, mul(n, dot(heading, n))));
    const contact = {
      wheel,
      surface,
      axle,
      turn,
      n, // the way the ground pushes back
      forward,
      side: norm(cross(forward, n)),
      centre,
      point,
      ground, // where the tire meets the ground
      press, // how far the tire and the ground are pressed together
      across: dot(sub(ground, frame.middle), frame.beam), // from the axle's middle
      r,
      rAcross,
      // A push through the hub: the same, from the hub's height.
      rHub: add(sub(centre, this.p), mul(this.ay, this.raise)),
      rAcrossHub: add(sub(centre, this.p), mul(this.ay, across - R)),
      // How much a push across, here or at the hub, tips the axle (see push).
      lever: this.sprungShare * (wheel.axle.rollCentre - R + drop) + (1 - this.sprungShare) * drop,
      leverHub: this.sprungShare * (wheel.axle.rollCentre - R),
      lateral,
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
      tread: [0, 0, 0],
      crr: 0,
      rollingMoment: 0,
      soilDrag: 0,
    };
    contact.tread = this.treadVelocity(contact, wheel.spin);
    return contact;
  }

  // The speed of the tread where it touches: the body's motion there (its turning felt along the
  // car at r, across it at the roll centre) plus the tire's spin; up and down, its axle's.
  treadVelocity(c, spin) {
    const along = cross(this.w, c.r);
    const across = cross(this.w, c.rAcross);
    const turning = add(along, mul(c.lateral, dot(across, c.lateral) - dot(along, c.lateral)));
    const rolling = mul(cross(c.turn, c.rho), spin);
    const v = add(add(this.v, turning), rolling);
    const axle = c.wheel.axle;
    v[1] = axle.vy + axle.vslope * c.across + rolling[1];
    return v;
  }

  // The body's share of an impulse's moment: its level part along the car at r, across at the
  // roll centre, less what turns the tire on its axle. (Its up-and-down part goes to the axle.)
  moment(c, impulse) {
    const flat = [impulse[0], 0, impulse[2]];
    const across = mul(c.lateral, dot(flat, c.lateral));
    const along = sub(flat, across);
    const twist = dot(cross(c.rho, flat), c.turn);
    return sub(add(cross(c.r, along), cross(c.rAcross, across)), mul(c.turn, twist));
  }

  // A push at a tire's contact patch: along the ground it moves the whole car and turns the
  // chassis; up and down it moves the tire's axle; and the part of its moment about the axle turns
  // the tire. The push across, at the ground rather than where it's passed on, tips the axle: the
  // body's share up at the roll centre, the axles' own share at hub height.
  push(c, impulse) {
    const twist = dot(cross(c.rho, impulse), c.turn);
    this.v = add(this.v, mul([impulse[0], 0, impulse[2]], 1 / this.mass));
    this.L = add(this.L, this.moment(c, impulse));
    const axle = c.wheel.axle;
    axle.vslope += (c.lever * dot(impulse, c.lateral) + impulse[1] * c.across) / axle.roll;
    axle.vy += impulse[1] / axle.mass;
    this.turnWheel(c.wheel, twist);
    this.refreshSpins();
  }

  // A push through a tire's hub, along the ground (the part of the ground's push that isn't up,
  // off a slope or an edge): it moves the whole car and turns the chassis, but not the tire.
  shove(c, impulse) {
    const across = mul(c.lateral, dot(impulse, c.lateral));
    const along = sub(impulse, across);
    this.v = add(this.v, mul(impulse, 1 / this.mass));
    this.L = add(this.L, add(cross(c.rHub, along), cross(c.rAcrossHub, across)));
    const axle = c.wheel.axle;
    axle.vslope += (c.leverHub * dot(impulse, c.lateral)) / axle.roll;
  }

  // How much a unit push at a contact patch along d changes the tread's speed that way.
  inverseMassAt(c, d) {
    const twist = dot(cross(c.rho, d), c.turn);
    const dw = this.inverseInertia(this.moment(c, d));
    const flat = [d[0], 0, d[2]];
    const across = mul(c.lateral, dot(flat, c.lateral));
    const along = sub(flat, across);
    const axle = c.wheel.axle;
    const lift = d[1] * d[1] * (1 / axle.mass + (c.across * c.across) / axle.roll);
    return dot(flat, flat) / this.mass + dot(along, cross(dw, c.r)) + dot(across, cross(dw, c.rAcross)) + lift + twist * twist * c.wheel.give;
  }

  // The same at a hub, where a push moves the chassis but doesn't turn the tire.
  inverseMassAtHub(r, d) {
    return 1 / this.mass + dot(d, cross(this.inverseInertia(cross(r, d)), r));
  }

  // The chassis touching down: wherever a point under it (see SKIDS) is into the ground, the
  // ground pushes it back out, square to the ground there, and it scrapes along.
  scrape(h) {
    const g = this.ground;
    const e = 0.03;
    const force = (at, moving) => {
      const into = g.height(at[0], at[2]) - at[1];
      if (into <= 0) return null;
      const slopeX = (g.height(at[0] + e, at[2]) - g.height(at[0] - e, at[2])) / (2 * e);
      const slopeZ = (g.height(at[0], at[2] + e) - g.height(at[0], at[2] - e)) / (2 * e);
      const n = norm([-slopeX, 1, -slopeZ]);
      const push = Math.max(0, SKID_STIFFNESS * into * n[1] - SKID_DAMPING * dot(moving, n));
      const slide = sub(moving, mul(n, dot(moving, n)));
      const speed = lenOf(slide);
      return add(mul(n, push), mul(slide, (-SKID_FRICTION * push) / Math.max(speed, 0.1)));
    };
    for (const local of SKIDS) {
      const r = this.toWorld(sub(local, this.centre));
      const f = force(add(this.p, r), add(this.v, cross(this.w, r)));
      if (!f) continue;
      const J = mul(f, h);
      this.v = add(this.v, [J[0] / this.mass, J[1] / this.sprungMass, J[2] / this.mass]);
      this.L = add(this.L, cross(r, J));
    }
    // Tree trunks: wherever the body's outline reaches into one, the trunk pushes it back out,
    // and it scrapes along.
    const trees = g.treesNear ? g.treesNear(this.p[0], this.p[2]) : [];
    if (trees.length) {
      const ends = SIDES.map(([a, b]) => [this.toWorld(sub(a, this.centre)), this.toWorld(sub(b, this.centre))]);
      for (const t of trees) {
        if (hyp(t.x - this.p[0], t.z - this.p[2]) > 2.6 + t.r) continue;
        for (const [a, b] of ends) {
          // The point of this edge nearest the trunk, seen from above.
          const ax = this.p[0] + a[0];
          const az = this.p[2] + a[2];
          const ex = b[0] - a[0];
          const ez = b[2] - a[2];
          const f = Math.max(0, Math.min(1, ((t.x - ax) * ex + (t.z - az) * ez) / (ex * ex + ez * ez)));
          const r = add(a, mul(sub(b, a), f));
          const nx = this.p[0] + r[0] - t.x;
          const nz = this.p[2] + r[2] - t.z;
          const d = hyp(nx, nz);
          const y = this.p[1] + r[1];
          if (d >= t.r || d < 1e-6 || y < t.base - 0.3 || y > t.base + t.height) continue;
          const n = [nx / d, 0, nz / d];
          const moving = add(this.v, cross(this.w, r));
          const push = Math.max(0, TRUNK_STIFFNESS * (t.r - d) - TRUNK_DAMPING * dot(moving, n));
          const slide = sub(moving, mul(n, dot(moving, n)));
          const J = mul(add(mul(n, push), mul(slide, (-TRUNK_FRICTION * push) / Math.max(lenOf(slide), 0.1))), h);
          this.v = add(this.v, [J[0] / this.mass, J[1] / this.sprungMass, J[2] / this.mass]);
          this.L = add(this.L, cross(r, J));
        }
      }
    }
    for (const a of this.axles) {
      const frame = this.axleFrame(a);
      const at = sub(add(frame.middle, mul(frame.beam, DIFF_OFFSET)), mul(frame.up, DIFF_DROP));
      const r = sub(at, this.p);
      const moving = add(this.v, cross(this.w, r));
      moving[1] = a.vy + a.vslope * DIFF_OFFSET;
      const f = force(at, moving);
      if (!f) continue;
      const J = mul(f, h);
      this.v = add(this.v, [J[0] / this.mass, 0, J[2] / this.mass]);
      this.L = add(this.L, cross(add(r, mul(this.ay, this.raise)), [J[0], 0, J[2]]));
      a.vy += J[1] / a.mass;
      a.vslope += (J[1] * DIFF_OFFSET) / a.roll;
    }
    this.w = this.inverseInertia(this.L);
  }

  // The engine, gearbox, clutch and transfer case: the torque they put on the driven axles this
  // step (forward positive), and the flywheel's inertia they add to them while the clutch is in.
  drivetrain(h) {
    // The pedal: opens gently, further the longer it's held, and closes quickly when let go.
    const press = Math.max(0, Math.min(1, this.controls.throttle));
    const ramp = CAR.throttleRamp;
    if (press > 0) {
      this.throttleHeld += h;
      const open = ramp.start + (1 - ramp.start) * Math.min(1, Math.max(0, (this.throttleHeld - ramp.after) / ramp.ramp));
      this.pedal = Math.min(press, Math.max(this.pedal, open));
    } else {
      this.throttleHeld = 0;
      this.pedal = Math.max(0, this.pedal - h / ramp.release);
    }
    const throttle = this.pedal;
    const carrier = this.driveshaft.spin;
    const ratio = this.gearRatio;

    // The automatic picks a forward gear by engine speed, once each change has gone through.
    if (this.shifting > 0) this.shifting = Math.max(0, this.shifting - h);
    if (this.auto && this.gear >= 1 && this.shifting === 0) {
      const rpm = carrier * ratio * RPM;
      const at = AUTO_GEARS.indexOf(this.gear);
      if (at < 0) this.setGear(AUTO_GEARS[0]);
      else if (throttle > 0 && rpm > UP_RPM && at < AUTO_GEARS.length - 1) this.setGear(AUTO_GEARS[at + 1]);
      else if (rpm < DOWN_RPM && at > 0) this.setGear(AUTO_GEARS[at - 1]);
    }

    // The engine's own torque: the throttle's share of its curve, less its friction and pumping
    // for the rest; and an idle control that keeps it turning over at idle.
    const rpm = this.rpm;
    let engine = engineAt(throttle, rpm);
    if (rpm < ENGINE.idle + 150) engine = Math.max(engine, engineDrag(rpm) + (ENGINE.idle + 150 - rpm) * 0.4);
    let flywheel = 0; // the flywheel's inertia as the driven axles feel it, while the clutch is in
    let clutch = 0; // the torque the clutch passes from the engine to the gearbox
    const fromWheels = carrier * ratio * RPM; // the engine's speed if the clutch were in
    const spin = (torque) => (this.rpm = Math.max(0, this.rpm + ((torque / ENGINE.flywheel) * h) * RPM));

    if (ratio === 0) {
      this.clutch = "open";
      spin(engine);
    } else if (this.shifting > 0) {
      // Changing gear: the clutch is out and the engine comes to the new gear's speed.
      this.clutch = "open";
      this.rpm += (Math.max(ENGINE.idle, fromWheels) - this.rpm) * Math.min(1, h * 12);
    } else if (this.clutch === "in" && fromWheels >= ENGINE.engageRpm) {
      // In gear with the clutch in: the engine turns with the wheels, its flywheel felt through
      // the gearing.
      this.rpm = fromWheels;
      clutch = engine;
      flywheel = ENGINE.flywheel * ratio * ratio;
    } else {
      // The automatic clutch: it grips harder the faster the engine turns (only with the
      // throttle open), pulling the engine and the gearbox toward the same speed. When they meet,
      // it locks.
      const bite = Math.min(1, Math.max(0, (rpm - ENGINE.biteFrom) / (ENGINE.biteFull - ENGINE.biteFrom))) ** 2;
      const grip = throttle > 0 ? CLUTCH_TORQUE * bite : 0;
      const gap = rpm - Math.max(0, fromWheels);
      if (grip > 0 && Math.abs(gap) < 25 && fromWheels >= ENGINE.engageRpm) {
        this.clutch = "in";
        this.rpm = fromWheels;
        clutch = engine;
        flywheel = ENGINE.flywheel * ratio * ratio;
      } else {
        this.clutch = grip > 0 ? "slipping" : "open";
        clutch = Math.sign(gap) * grip;
        spin(engine - clutch);
      }
    }
    this.engineTorque = engine;
    // Through the gears: more torque, less speed, less what the gears lose.
    const atWheels = clutch * ratio * (clutch > 0 ? ENGINE.efficiency : 1 / ENGINE.efficiency);
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
    const way = Math.sign(steer);
    this.steerHeld = way !== 0 && way === this.steerWay ? this.steerHeld + h : 0;
    this.steerWay = way;
    const rate = CAR.steerRate;
    const ramp = Math.min(1, Math.max(0, (this.steerHeld - rate.after) / rate.ramp));
    const rolling = Math.min(1, Math.abs(this.forwardSpeed) / rate.centreAt);
    const turning = way === 0 ? rate.centre * rolling : rate.slow + (rate.fast - rate.slow) * ramp;
    const most = turning * h;
    this.steer += Math.max(-most, Math.min(most, goal - this.steer));
    const [fl, fr] = this.wheels;
    if (Math.abs(this.steer) < 1e-9) fl.steer = fr.steer = 0;
    else {
      const radius = CAR.wheelbase / Math.tan(this.steer);
      fl.steer = Math.atan(CAR.wheelbase / (radius - CAR.frontTrack / 2));
      fr.steer = Math.atan(CAR.wheelbase / (radius + CAR.frontTrack / 2));
    }

    const contacts = this.wheels.map((w) => (w.contact = this.contactOf(w)));

    // Gravity and air drag on the body; the springs and shocks between it and the axles; the
    // ground pushing up on the axles through the tires.
    const speed = lenOf(this.v);
    const dragPerSpeed = 0.5 * this.air * CAR.dragArea * speed;
    this.drag = dragPerSpeed * speed;
    let force = [-dragPerSpeed * this.v[0], -this.sprungMass * this.g - dragPerSpeed * this.v[1], -dragPerSpeed * this.v[2]];
    let torque = [0, 0, 0];
    for (const a of this.axles) {
      const frame = this.axleFrame(a);
      let lift = -a.mass * this.g;
      let tilt = 0;
      // The springs and shocks, left and right. Each pushes the body up and the axle down by how
      // far it's squashed past where it carries its share of the body at rest.
      for (const [k, side] of [[0, -1], [1, 1]]) {
        const push = (x, part) => {
          const onBody = add(frame.at, mul(this.ax, x));
          const bodyRise = dot(add(this.v, cross(this.w, sub(onBody, this.p))), [0, 1, 0]);
          const squash = a.y + a.slope * x - onBody[1]; // past the static ride height
          const rate = a.vy + a.vslope * x - bodyRise;
          return { x, onBody, squash, rate, f: part(squash, rate) };
        };
        const spring = push(side * a.seat, (squash, rate) => {
          let f = a.rate * (a.preload + squash) + SUSPENSION.leafFriction * Math.tanh(rate / SUSPENSION.frictionSpeed);
          if (squash > a.bump) f += SUSPENSION.stop * (squash - a.bump);
          if (squash < -a.droop) f -= SUSPENSION.stop * (-a.droop - squash);
          return f;
        });
        const shock = push(side * a.shock, (squash, rate) => a.damping * rate * (rate > 0 ? SUSPENSION.bumpShare : SUSPENSION.reboundShare));
        for (const { x, onBody, f } of [spring, shock]) {
          force = add(force, [0, f, 0]);
          torque = add(torque, cross(sub(onBody, this.p), [0, f, 0]));
          lift -= f;
          tilt -= f * x;
        }
        a.travel[k] = spring.squash;
        a.load[k] = spring.f;
      }
      // The leaf packs twisting as the axle tilts against the body: a moment back on both.
      const bodySlope = this.bodySlope;
      const twist = a.twist * (a.slope - bodySlope);
      tilt -= twist;
      torque = add(torque, mul(this.az, twist * (1 + bodySlope * bodySlope)));
      for (const w of a.wheels) {
        const c = w.contact;
        lift += c.normal * c.n[1];
        tilt += c.normal * c.n[1] * c.across;
        // Off a slope, or the edge of a log or a step, the ground pushes along as well as up. That
        // part goes through the hub: it moves the car and turns it, but doesn't turn the tire.
        if (c.normal > 0 && (c.n[0] || c.n[2])) this.shove(c, [c.normal * c.n[0] * h, 0, c.normal * c.n[2] * h]);
      }
      a.vy += (lift / a.mass) * h;
      a.vslope += (tilt / a.roll) * h;
    }
    this.scrape(h);
    // The drivetrain turns the driven tires and, pushing off the chassis, twists it back.
    const atWheels = this.drivetrain(h);
    this.driveshaft.spin += (atWheels * h) / this.driveshaft.inertia;
    torque = add(torque, mul(this.ax, atWheels));
    // Air drag on each spinning tire.
    for (const w of this.wheels) this.turnWheel(w, -0.5 * this.air * SPIN_CM * R ** 5 * w.spin * Math.abs(w.spin) * h);
    this.refreshSpins();
    // Up and down, only the body moves on the springs; along the ground, the whole car goes.
    this.v = add(this.v, [(force[0] / m) * h, (force[1] / this.sprungMass) * h, (force[2] / m) * h]);
    this.L = add(this.L, mul(torque, h));
    this.w = this.inverseInertia(this.L);

    // Grip at each tire: the friction its slip calls for, against the slip, but never more than it
    // takes to stop the slip this step, which real grip never overshoots. All the tires are solved
    // together from the same state, a few passes over, so none goes first and a car going
    // straight stays straight. In four-wheel drive, each pass also keeps the front and rear
    // driveshafts turning together.
    const touching = contacts.filter((c) => c.normal > 0);
    for (const c of touching) {
      const tread = this.treadVelocity(c, c.wheel.spin);
      const hub = add(this.v, cross(this.w, sub(c.centre, this.p)));
      hub[1] = c.wheel.axle.vy + c.wheel.axle.vslope * c.across;
      const along = dot(tread, c.forward);
      const across = dot(tread, c.side);
      const travel = dot(hub, c.forward);
      const treadSpeed = travel - along; // how fast the tread runs round, as a ground speed
      const ref = Math.max(Math.abs(travel), Math.abs(treadSpeed), CREEP_SPEED);
      c.slip = -along / ref; // positive: wheelspin; negative: skidding
      c.sideSlip = across / ref;
      c.slipSpeed = -along;
      c.tread = tread;
      // Rolling, grip builds up along the slip curve. Barely moving, a tire holds by flexing its
      // tread rather than sliding, so it grips up to its peak at once: it can stand on a slope.
      const slip = hyp(along, across) / ref;
      const still = ref === CREEP_SPEED && slip < c.surface.slipAtPeak;
      c.limit = (still ? c.surface.peak : c.surface.grip(slip)) * TIRE.grip * c.normal * h;
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
    // Start from where the last step ended up, within this step's limits, so the passes only
    // correct what has changed. Otherwise the tread pushing a braked tire round and the brakes
    // holding it never quite settle, and a car parked on a slope creeps down it.
    for (const c of touching) {
      const last = c.wheel.lastGrip;
      if (!last) continue;
      let start = sub(last, mul(c.n, dot(last, c.n))); // along this ground
      const size = lenOf(start);
      if (size > c.limit) start = mul(start, c.limit / size);
      c.impulse = start;
      this.push(c, start);
    }
    for (const s of active) {
      s.impulse = Math.max(-s.limit, Math.min(s.limit, s.wheel.lastBrake || 0));
      this.turnWheel(s.wheel, s.impulse);
    }
    this.refreshSpins();
    this.w = this.inverseInertia(this.L);
    for (let pass = 0; pass < GRIP_PASSES; pass++) {
      const changes = touching.map((c) => {
        const tread = this.treadVelocity(c, c.wheel.spin);
        const slide = sub(tread, mul(c.n, dot(tread, c.n))); // along the ground
        const slipSpeed = lenOf(slide);
        let want = c.impulse;
        if (slipSpeed > 1e-12) {
          const dir = mul(slide, -1 / slipSpeed);
          want = add(c.impulse, mul(dir, (relax * slipSpeed) / this.inverseMassAt(c, dir)));
        }
        const size = lenOf(want);
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
    for (const w of this.wheels) {
      w.lastGrip = w.contact.normal > 0 ? w.contact.impulse : null;
      w.lastBrake = active.find((s) => s.wheel === w)?.impulse || 0;
    }
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
      const s = hyp(moving[0], moving[2]);
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
    const ql = lenOf(q);
    this.q = q.map((v) => v / ql);
    this.update();
    for (const a of this.axles) {
      a.y += a.vy * h;
      a.slope += a.vslope * h;
    }
    for (const w of this.wheels) w.angle += w.spin * h;
    this.shaftAngle += this.driveshaft.spin * AXLE_RATIO * h;
    this.engineAngle += (this.rpm / RPM) * h;

    this.time += h;
    this.moved += hyp(this.v[0], this.v[2]) * h;
    const spinning = lenOf(this.w);
    if (spinning > MAX_SPIN) {
      this.L = mul(this.L, MAX_SPIN / spinning);
      this.w = this.inverseInertia(this.L);
    }
    for (const a of this.axles) {
      a.vy = Math.max(-MAX_AXLE, Math.min(MAX_AXLE, a.vy));
      a.vslope = Math.max(-MAX_AXLE, Math.min(MAX_AXLE, a.vslope));
    }
  }

  // The rear tires' share of the weight at rest.
  get rearShare() {
    return (this.totalCentre[2] + HALF_BASE) / CAR.wheelbase;
  }

  // The steering wheel's turn, from the front tires'.
  get steeringWheel() {
    return this.steer * CAR.steeringRatio;
  }

  energy() {
    const spins = this.modes.reduce((s, m) => s + 0.5 * m.inertia * m.spin * m.spin, 0);
    let e = 0.5 * this.mass * (this.v[0] ** 2 + this.v[2] ** 2) + 0.5 * this.sprungMass * this.v[1] ** 2;
    e += 0.5 * dot(this.w, this.L) + spins + this.sprungMass * this.g * this.p[1];
    for (const a of this.axles) {
      e += 0.5 * a.mass * a.vy ** 2 + 0.5 * a.roll * a.vslope ** 2 + a.mass * this.g * a.y;
      const frame = this.axleFrame(a);
      e += 0.5 * a.twist * (a.slope - this.bodySlope) ** 2;
      for (const side of [-1, 1]) {
        const x = side * a.seat;
        const squash = a.y + a.slope * x - add(frame.at, mul(this.ax, x))[1];
        e += 0.5 * a.rate * (a.preload + squash) ** 2;
        if (squash > a.bump) e += 0.5 * SUSPENSION.stop * (squash - a.bump) ** 2;
        if (squash < -a.droop) e += 0.5 * SUSPENSION.stop * (-a.droop - squash) ** 2;
      }
      for (const w of a.wheels) {
        const c = this.contactOf(w);
        const k = c.surface.give === Infinity ? this.kTire : 1 / (1 / this.kTire + 1 / c.surface.give);
        if (c.press > 0) e += 0.5 * k * c.press * c.press;
      }
    }
    return e;
  }
}

// A solid box's moments of inertia about its own centre, along its sides.
function boxInertia(m, [x, y, z]) {
  return [(m * (y * y + z * z)) / 12, (m * (x * x + z * z)) / 12, (m * (x * x + y * y)) / 12];
}


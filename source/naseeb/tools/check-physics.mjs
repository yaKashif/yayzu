// Checks the FJ40 model against results worked out by hand from the same physics.
// Usage: node tools/check-physics.mjs
import { Sim, STRIPS, STRIP, STRIP_GROUND, TIRE, CAR, ENGINE, GEARS, AXLE_RATIO, SUSPENSION, DEFAULTS, STEP } from "../src/physics.js";

const R = TIRE.radius;
// The car with its rear tires just onto a strip, so all four are on it and a test has the rest of
// the strip to run in. (Its position is its centre of mass, about half a wheelbase ahead.)
const at = (name) => STRIPS.findIndex((s) => s.name === name) * STRIP + CAR.wheelbase / 2 + 0.3;
let failed = 0;
function check(name, got, want, tolerance) {
  const ok = Math.abs(got - want) <= Math.abs(want) * tolerance;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${got.toPrecision(5)} (expected ${want.toPrecision(5)}, ±${tolerance * 100}%)`);
}
function below(name, got, limit) {
  const ok = Math.abs(got) <= limit;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${got.toExponential(2)} (at most ${limit})`);
}
function truth(name, ok, detail = "") {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? `: ${detail}` : ""}`);
}
const run = (sim, seconds, controls = {}) => {
  sim.controls = { throttle: 0, brake: 0, steer: 0, ...controls };
  for (let t = 0; t < seconds; t += STEP) sim.step(STEP);
};
const settle = (sim) => {
  run(sim, 1.5);
  sim.v = [0, 0, 0];
  sim.L = [0, 0, 0];
  sim.update();
  run(sim, 1);
};
const make = (settings = {}, options = {}) => new Sim({ ...DEFAULTS, ...settings }, { ground: STRIP_GROUND, ...options });

{
  const sim = make();
  console.log(`${CAR.name}: ${sim.mass.toFixed(0)} kg (${sim.sprungMass.toFixed(0)} on the springs), centre of mass ${((R + sim.totalCentre[1]) * 100).toFixed(0)} cm up, ${(100 - sim.rearShare * 100).toFixed(0)}% on the front tires`);
}

// 1. At rest the tires carry the weight, split front to back by where the centre of mass is.
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0.05);
  settle(sim);
  const [fl, fr, rl, rr] = sim.wheels.map((w) => w.contact.normal);
  check("all four loads add up to m·g", fl + fr + rl + rr, sim.mass * sim.g, 0.001);
  check("rear tires' share of the weight", (rl + rr) / (sim.mass * sim.g), sim.rearShare, 0.005);
}

// 2. Driven straight, on even ground, it goes straight: four-wheel drive and rear only. (Only
//    nearly: the fuel tank under the driver's seat puts the centre of mass a few mm left.)
for (const drive of ["4x4", "rear"]) {
  const sim = make({ drive });
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  run(sim, 2, { throttle: 1 });
  below(`straight launch, ${drive}: heading (rad)`, sim.heading, 2e-3);
  below(`straight launch, ${drive}: sideways drift (m)`, sim.p[0], 0.01);
}

// 3. With the clutch in, the engine turns at the wheels' speed times the gearing.
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  sim.shift(3);
  run(sim, 4, { throttle: 1 });
  const want = sim.spin * GEARS[2].ratio * AXLE_RATIO * (60 / (2 * Math.PI));
  truth("clutch in after pulling away", sim.clutch === "in", sim.clutch);
  check("engine rpm = wheel speed × gearing", sim.rpm, want, 1e-3);
}

// 4. In four-wheel drive the front and rear driveshafts turn together, even with the rear on ice.
{
  const sim = make();
  sim.reset(at("Ice"), 0);
  settle(sim);
  run(sim, 1.5, { throttle: 1 });
  const [front, rear] = sim.axles;
  check("4x4 on ice: front driveshaft speed = rear", sim.carrier(front), sim.carrier(rear), 0.002);
}

// 5. Held in a gear, the governor stops the engine at 4,000 rpm, so the car tops out at
//    4,000 rpm / gearing × tire radius. Low 1st, on asphalt:
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  sim.shift(1);
  run(sim, 2.5, { throttle: 1 }); // at the governor in about a second, still on the asphalt
  const want = ((ENGINE.governor * 2 * Math.PI) / 60 / (GEARS[0].ratio * AXLE_RATIO)) * sim.wheels[2].contact.rollingRadius;
  check("top speed in Low 1st, against the governor (m/s)", sim.forwardSpeed, want, 0.02);
}

// 6. The automatic works up through high range: High 1st, 2nd, 3rd.
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  truth("automatic: starts in High 1st", sim.gear === 3, `gear ${sim.gear}`);
  run(sim, 9, { throttle: 1 });
  truth("automatic: into High 3rd within 9 s of holding the throttle", sim.gear === 6, `gear ${sim.gear}, ${(sim.forwardSpeed * 3.6).toFixed(0)} km/h, ${sim.rpm.toFixed(0)} rpm`);
}
// 6a. Pulling away, the clutch takes up as the engine revs: a 25% press holds it near 1,700 rpm,
//     a full one near 2,000.
for (const [pedal, near] of [[0.25, 1700], [1, 2000]]) {
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  sim.throttleHeld = 0;
  run(sim, 0.5, { throttle: pedal });
  sim.pedal = pedal;
  for (let t = 0; t < 0.3; t += STEP) {
    sim.pedal = pedal;
    sim.controls = { throttle: pedal, brake: 0, steer: 0 };
    sim.step(STEP);
  }
  check(`pulling away at ${pedal * 100}% throttle, the clutch slipping: engine rpm`, sim.rpm, near, 0.12);
}
// 6b. The throttle opens gently and further the longer it's held.
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  const opening = [];
  for (const s of [0.1, 0.5, 1.0, 2.0]) {
    run(sim, s - (opening.length ? [0.1, 0.5, 1.0, 2.0][opening.length - 1] : 0), { throttle: 1 });
    opening.push(sim.pedal);
  }
  truth("throttle opens 25% at once, all the way after ~2 s", Math.abs(opening[0] - 0.25) < 0.01 && opening[1] < 0.5 && opening[3] > 0.99, opening.map((o) => `${Math.round(o * 100)}%`).join(" → "));
}

// 7. Braking hard from 7.5 m/s on asphalt (short enough to stop on the strip), out of gear: the
//    drums lock the tires, so it stops in about v² / 2μg, μ between the bias-ply tires' sliding
//    and peak grip.
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  sim.shift(0);
  sim.v = [0, 0, -7.5];
  sim.spinAll(7.5 / R);
  const z0 = sim.p[2];
  for (let t = 0; t < 6 && sim.forwardSpeed > 0.01; t += STEP) {
    sim.controls = { throttle: 0, brake: 1, steer: 0 };
    sim.step(STEP);
  }
  const distance = sim.p[2] - z0 < 0 ? z0 - sim.p[2] : sim.p[2] - z0;
  const most = (7.5 * 7.5) / (2 * 0.75 * TIRE.grip * 9.81);
  const least = (7.5 * 7.5) / (2 * 1.0 * TIRE.grip * 9.81);
  truth("stopping distance from 7.5 m/s", distance > least * 0.95 && distance < most * 1.1, `${distance.toFixed(1)} m (between ${least.toFixed(1)} and ${most.toFixed(1)})`);
}

// 8. Coasting out of gear, it slows at (rolling moments / r + drag) / (m + I / r²).
{
  const sim = make({ drive: "rear" });
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  sim.shift(0);
  sim.v = [0, 0, -5];
  sim.spinAll(5 / R);
  run(sim, 0.5);
  const cs = sim.wheels.map((w) => w.contact);
  const r = cs[0].rollingRadius;
  const resist = cs.reduce((s, c) => s + c.rollingMoment / r, 0) + sim.drag;
  const want = -resist / (sim.mass + sim.allSpinInertia / (r * r));
  const v0 = sim.forwardSpeed;
  run(sim, 0.3);
  check("coasting deceleration on asphalt", (sim.forwardSpeed - v0) / 0.3, want, 0.04);
}

// 9. Steered and crawling in rear drive, it follows the circle its geometry draws: tan(steer)/L.
{
  const sim = make({ drive: "rear" });
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  run(sim, 1.5, { steer: 0.6 }); // turn the wheels first
  let turned = 0;
  let travelled = 0;
  for (let t = 0; t < 4; t += STEP) {
    sim.controls = { throttle: sim.forwardSpeed < 0.8 ? 0.3 : 0, brake: 0, steer: 0.6 };
    sim.step(STEP);
    if (t > 1.5) {
      turned += sim.w[1] * STEP;
      travelled += sim.forwardSpeed * STEP;
    }
  }
  check("crawling turn, rear drive: curvature (1/m)", turned / travelled, Math.tan(sim.steer) / CAR.wheelbase, 0.05);
  const [fl, fr] = sim.wheels;
  truth("Ackermann: the inside front tire turns more", fl.steer > fr.steer, `${((fl.steer * 180) / Math.PI).toFixed(1)}° vs ${((fr.steer * 180) / Math.PI).toFixed(1)}°`);
}

// 10. Coasting through a turn out of gear, the car's energy only ever goes down.
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0.02);
  sim.shift(0);
  sim.v = [0, 0, -4];
  sim.spinAll(4 / R);
  run(sim, 0.3);
  let last = sim.energy();
  let worst = 0;
  sim.controls = { throttle: 0, brake: 0, steer: 0.5 };
  for (let t = 0; t < 2; t += STEP) {
    sim.step(STEP);
    const e = sim.energy();
    worst = Math.max(worst, e - last);
    last = Math.min(last, e);
  }
  truth("energy never rises without the engine", worst < 1, `worst rise ${worst.toExponential(2)} J of ${last.toFixed(0)} J`);
}

// 11. Ice under the left tires, asphalt under the right. With open differentials, each gives its
//     asphalt tire no more torque than its ice tire can take, so the ice tires spin. With both
//     locked, the asphalt side drives and the car turns toward the ice.
{
  const sim = make();
  sim.reset(at("Ice | asphalt"), 0);
  settle(sim);
  run(sim, 1, { throttle: 1 });
  const [fl, fr, rl, rr] = sim.wheels;
  truth("split grip, open: the ice tires spin", rl.spin > 2 * Math.abs(rr.spin) && fl.spin > 2 * Math.abs(fr.spin), `ice ${rl.spin.toFixed(1)}, asphalt ${rr.spin.toFixed(1)} rad/s`);
}
{
  const sim = make({ lockers: "both" });
  sim.reset(at("Ice | asphalt"), 0);
  settle(sim);
  sim.shift(1); // Low 1st, as you would on a slippery start
  run(sim, 2, { throttle: 1 });
  truth("split grip, both locked: turns toward the ice", sim.heading > 0.002, `heading ${((sim.heading * 180) / Math.PI).toFixed(1)}° left`);
}

// 12. The suspension. At rest the springs sit near their static ride height.
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  const most = Math.max(...sim.axles.flatMap((a) => a.travel.map(Math.abs)));
  truth("at rest, springs near their static height", most < 0.004, `${(most * 1000).toFixed(1)} mm at most`);
}
// 13. Let go 4 cm low, the body comes back up firmly: quickly, and without bouncing past where it
//     sits (the shocks and the leaves' friction see to that), stopping within the friction's band.
{
  const sim = make({}, { air: false });
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  sim.p[1] -= 0.04;
  let k = 0;
  for (const a of sim.axles) k += 2 / (1 / a.rate + 1 / sim.kTire);
  const rest = sim.p[1] + 0.04;
  const band = (4 * SUSPENSION.leafFriction) / k; // where the leaves' friction can hold it
  let back = 0;
  let high = -Infinity;
  for (let t = 0; t < 1.5; t += STEP) {
    sim.step(STEP);
    if (!back && sim.p[1] > rest - band - 0.003) back = t;
    high = Math.max(high, sim.p[1] - rest);
  }
  truth("pushed down 4 cm, back within 0.4 s", back > 0 && back < 0.4, `${back.toFixed(2)} s`);
  truth("and no bounce past where it sits", high < 0.005, `${(high * 1000).toFixed(1)} mm above`);
}
// 14. Pulling away the body squats at the back; braking it dives at the front; turning left it
//     leans out, to the right.
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  sim.shift(1); // Low 1st, the throttle held: a strong pull
  run(sim, 1.6, { throttle: 1 });
  const [front, rear] = sim.axles;
  const squat = (rear.travel[0] + rear.travel[1]) / 2 - (front.travel[0] + front.travel[1]) / 2;
  truth("pulling away hard, the back squats", squat > 0.004, `rear ${(squat * 1000).toFixed(1)} mm more squashed than front`);
}
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  sim.shift(0);
  sim.v = [0, 0, -10];
  sim.spinAll(10 / R);
  run(sim, 0.4, { brake: 1 });
  const [front, rear] = sim.axles;
  const dive = (front.travel[0] + front.travel[1]) / 2 - (rear.travel[0] + rear.travel[1]) / 2;
  truth("braking, the front dives", dive > 0.005, `front ${(dive * 1000).toFixed(1)} mm more squashed than rear`);
}
// 15. Body roll in a steady turn, against the hand-worked figure: the sprung weight times the
//     sideways g times its centre of mass's height over the roll axis, over the roll stiffness
//     (the springs, rate × spacing² / 2 each pair, plus the leaves' twist, in series with the
//     tires). Then, steering straightened, the body comes back to level firmly, without rocking
//     past it.
{
  const sim = make({ drive: "rear" }, { air: false });
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  sim.shift(5); // High 2nd, the throttle held a little to keep about 7 m/s
  sim.v = [0, 0, -7];
  sim.spinAll(7 / R);
  let lean = 0;
  let g = 0;
  for (let t = 0; t < 3; t += STEP) {
    sim.controls = { throttle: sim.forwardSpeed < 7 ? 1 : 0, brake: 0, steer: 0.3 };
    sim.step(STEP);
    if (t > 2.5) {
      lean += (Math.asin(sim.ax[1]) * STEP) / 0.5;
      g += (Math.abs(sim.forwardSpeed * sim.w[1]) / sim.g) * (STEP / 0.5);
    }
  }
  const leanDeg = (lean * 180) / Math.PI;
  const rollAxis = (sim.axles[0].rollCentre + sim.axles[1].rollCentre) / 2 - R; // above the hub line
  const arm = sim.centre[1] - rollAxis;
  // The tires lean on whatever's under them: on soft ground, its give in series with theirs.
  let springs = 0;
  let tires = 0;
  for (const a of sim.axles) {
    springs += 2 * a.rate * a.seat ** 2 + a.twist;
    for (const w of a.wheels) {
      const give = w.contact.surface.give;
      const k = give === Infinity ? sim.kTire : 1 / (1 / sim.kTire + 1 / give);
      tires += k * (a.track / 2) ** 2;
    }
  }
  // The body leans on the springs by its own moment (leaning, its weight shifts outward and adds
  // to it: less stiffness by m·g·arm); the axles lean on the tires by the whole car's.
  const onSprings = (sim.sprungMass * sim.g * g * arm) / (springs - sim.sprungMass * sim.g * arm);
  const onTires = (sim.mass * sim.g * g * (R + sim.totalCentre[1])) / tires;
  const want = onSprings + onTires;
  truth(`steady turn at ${g.toFixed(2)} g: leans right`, leanDeg < 0, `${leanDeg.toFixed(1)}°, ${(-leanDeg / g).toFixed(1)}° per g, on ${sim.wheels.map((w) => w.contact.surface.id).join("/")}`);
  // The leaves' friction can hold the body anywhere within its band of the frictionless lean.
  const band = (4 * SUSPENSION.leafFriction * 0.42) / (springs - sim.sprungMass * sim.g * arm);
  const off = Math.abs(-lean - want);
  truth("steady turn: body roll as worked out, within the leaves' friction band", off < 0.25 * want + band, `${((-lean * 180) / Math.PI).toFixed(2)}° against ${((want * 180) / Math.PI).toFixed(2)}° ± ${((band * 180) / Math.PI).toFixed(2)}°`);
  // Straighten up and watch it come back.
  const start = -lean;
  let past = 0;
  for (let t = 0; t < 2; t += STEP) {
    sim.controls = { throttle: 0, brake: 0, steer: 0 };
    sim.step(STEP);
    past = Math.max(past, Math.asin(sim.ax[1])); // leaning the other way, to the left
  }
  truth("straightened, it settles without rocking far past level", past < 0.2 * start, `overshoot ${((past * 180) / Math.PI).toFixed(2)}° after ${((start * 180) / Math.PI).toFixed(1)}°`);
}

if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log("All physics checks passed");

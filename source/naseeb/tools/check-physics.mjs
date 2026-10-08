// Checks the FJ40 model against results worked out by hand from the same physics.
// Usage: node tools/check-physics.mjs
import { Sim, STRIPS, STRIP, TIRE, CAR, ENGINE, GEARS, AXLE_RATIO, DEFAULTS, STEP } from "../src/physics.js";

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
const make = (settings = {}, options = {}) => new Sim({ ...DEFAULTS, ...settings }, options);

{
  const sim = make();
  console.log(`${CAR.name}: ${sim.mass.toFixed(0)} kg, centre of mass ${((R + sim.centre[1]) * 100).toFixed(0)} cm up, ${(100 - sim.rearShare * 100).toFixed(0)}% on the front tires`);
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
  run(sim, 3, { throttle: 1 });
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

// 6. The automatic works up through the gears.
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  run(sim, 7, { throttle: 1 });
  truth("automatic: up to at least 4th in 7 s of full throttle", sim.gear >= 4, `gear ${sim.gear}, ${sim.forwardSpeed.toFixed(1)} m/s, ${sim.rpm.toFixed(0)} rpm`);
}

// 7. Braking hard from 15 m/s on asphalt, out of gear: the drums lock the tires, so it stops in
//    about v² / 2μg, μ somewhere between sliding (0.75) and peak (1.0) grip.
{
  const sim = make();
  sim.reset(at("Dry asphalt"), 0);
  settle(sim);
  sim.shift(0);
  sim.v = [0, 0, -15];
  sim.spinAll(15 / R);
  const z0 = sim.p[2];
  for (let t = 0; t < 6 && sim.forwardSpeed > 0.01; t += STEP) {
    sim.controls = { throttle: 0, brake: 1, steer: 0 };
    sim.step(STEP);
  }
  const distance = sim.p[2] - z0 < 0 ? z0 - sim.p[2] : sim.p[2] - z0;
  const most = (15 * 15) / (2 * 0.75 * 9.81);
  const least = (15 * 15) / (2 * 1.0 * 9.81);
  truth("stopping distance from 15 m/s", distance > least * 0.95 && distance < most * 1.1, `${distance.toFixed(1)} m (between ${least.toFixed(1)} and ${most.toFixed(1)})`);
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
  const spring = () => sim.wheels.reduce((s, w) => s + 0.5 * sim.kTire * Math.max(0, R - w.contact.centre[1]) ** 2, 0);
  run(sim, 0.3);
  let last = sim.energy() + spring();
  let worst = 0;
  sim.controls = { throttle: 0, brake: 0, steer: 0.5 };
  for (let t = 0; t < 2; t += STEP) {
    sim.step(STEP);
    const e = sim.energy() + spring();
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
  run(sim, 1, { throttle: 1 });
  truth("split grip, both locked: turns toward the ice", sim.heading > 0.002, `heading ${((sim.heading * 180) / Math.PI).toFixed(1)}° left`);
}

if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log("All physics checks passed");

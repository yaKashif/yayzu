// The jeep's body, an FJ40's, built from simple shapes in the car's own axes (x to its right, y up
// from the hub line, z toward its back; the axles at z = ±wheelbase/2): a steel tub with flared
// rear arches and its rear corners rounded, flat-topped front fenders round the front wheels, a
// crowned hood, the grille with round headlights, an upright windscreen with its wipers hung from
// the top, two doors on outside hinges with vent windows, a ribbed steel hardtop with curved glass
// wrapping round its rounded back corners, a tailgate with the spare wheel, and inside, a dash, two
// seats and the steering wheel (right-hand drive). Painted metallic army green, rusting and dirty
// (see paint.js). The physics weighs the same panels in PARTS.
import * as THREE from "three";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import { CAR } from "./physics.js";
import { weatheredPaint } from "./paint.js";

const HALF_BASE = CAR.wheelbase / 2;
const ARCH = 0.47; // wheel arch radius, round each axle's hub line

// The body's lines.
const FRONT = -1.72; // the front panel
const COWL = -0.6; // where the hood and fenders meet the windscreen and doors
const DOOR_BACK = 0.35;
const TAIL = 1.92; // the tailgate
const SILL = 0.22; // bottom of the body sides
const BELT = 0.86; // top of the doors and tub
const FENDER_TOP = 0.72;
const HOOD_TOP = 0.84;
const ROOF = 1.6;
const SIDE = 0.8; // body sides, either side of the middle
const FLARE = 0.84; // out to the fender and arch flares
const HOOD_EDGE = 0.5;
const HOOD_CROWN = 0.045; // how much higher the hood is down its middle than at its edges
const CORNER = 0.18; // the radius the tub and hardtop are rounded to at the back corners
const BACK_PILLAR = 0.12; // the hardtop's back, between the corner glass and the back window

export function buildBody({ maxAniso, makeWheel, rightHand = CAR.rightHandDrive }) {
  const body = new THREE.Group();
  const mat = (color, roughness = 0.4, metalness = 0.1, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const paint = weatheredPaint({ color: 0x4f5b2c, halfBase: HALF_BASE, arch: ARCH, side: SIDE, tail: TAIL, dripRail: ROOF - 0.07 }); // metallic army green
  const white = paint; // the hardtop, the same green
  const cream = mat(0xe6e0d0, 0.4, 0.25); // the bar across the top of the grille
  const black = mat(0x18191b, 0.7, 0.1);
  const trim = mat(0x2a2c2f, 0.55, 0.3);
  const chrome = mat(0xf2f4f6, 0.12, 1);
  const glass = new THREE.MeshStandardMaterial({ color: 0x9fb8c8, roughness: 0.05, metalness: 0.4, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide });
  const lens = mat(0xfff6dd, 0.15, 0.2, { emissive: 0x403a2a });
  const amber = mat(0xf0a020, 0.25, 0.1, { emissive: 0x3a2200 });
  const red = mat(0xc0281e, 0.3, 0.1, { emissive: 0x300805 });
  const seatMat = mat(0x2c2a28, 0.85, 0);
  const add = (geo, m, x, y, z, parent = body, shadow = true) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = shadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const box = (w, h, l) => new THREE.BoxGeometry(w, h, l);
  // Shading smooth across curves but still sharp at edges.
  const smooth = (geo) => toCreasedNormals(geo, Math.PI / 5);
  // An upright piece: an outline seen from above, drawn in (x, z), run up from bottom to top.
  const upright = (shape, bottom, top, m, parent = body) => {
    const geo = new THREE.ExtrudeGeometry(shape, { depth: top - bottom, bevelEnabled: false, curveSegments: 4 });
    geo.rotateX(Math.PI / 2); // the outline's y is the car's z; the run goes down from 0
    geo.translate(0, top, 0);
    return add(smooth(geo), m, 0, 0, 0, parent);
  };
  // The body's outline round a rear corner, seen from above, `out` beyond its skin: from `sideRun`
  // ahead of where the corner starts, round it, and `backRun` across the back.
  const cornerLine = (side, out, sideRun = 0, backRun = 0) => {
    const r = CORNER + out;
    const points = [];
    if (sideRun > 0) points.push(new THREE.Vector2(side * (SIDE + out), TAIL - CORNER - sideRun));
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * (Math.PI / 2);
      points.push(new THREE.Vector2(side * (SIDE - CORNER + r * Math.cos(a)), TAIL - CORNER + r * Math.sin(a)));
    }
    if (backRun > 0) points.push(new THREE.Vector2(side * (SIDE - CORNER - backRun), TAIL + out));
    return points;
  };
  // A band round a rear corner, from `inner` to `outer` beyond the skin.
  const cornerBand = (side, inner, outer, sideRun, backRun) =>
    new THREE.Shape([...cornerLine(side, outer, sideRun, backRun), ...cornerLine(side, inner, sideRun, backRun).reverse()]);
  // The whole body seen from above, `out` beyond its skin, from `front` back: square at the front,
  // its rear corners rounded.
  const plan = (out, front) => {
    const run = TAIL - CORNER - front;
    const right = cornerLine(1, out, run, SIDE - CORNER);
    const left = cornerLine(-1, out, run, SIDE - CORNER).reverse();
    return new THREE.Shape([...right, ...left.slice(1)]);
  };
  // A sheet of glass following a line seen from above, from bottom to top.
  const ribbon = (points, bottom, top) => {
    const position = [];
    const index = [];
    points.forEach((pt, i) => {
      position.push(pt.x, bottom, pt.y, pt.x, top, pt.y);
      if (i) index.push(2 * i - 2, 2 * i, 2 * i - 1, 2 * i - 1, 2 * i, 2 * i + 1);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
    geo.setIndex(index);
    geo.computeVertexNormals();
    return geo;
  };
  // A flat panel in the car's side plane, from a profile drawn in (z, y), `thick` across, its outer
  // face at x.
  const sidePanel = (shape, x, thick, m) => {
    const geo = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false, curveSegments: 24 });
    geo.rotateY(-Math.PI / 2); // shape x → car z, extrusion → car -x
    const mesh = add(geo, m, x > 0 ? x : x + thick, 0, 0);
    return mesh;
  };
  // A side outline running from `from` to `to` along the bottom at `bottom`, cut up round a wheel
  // arch at `axleZ`.
  const archedBottom = (shape, from, to, bottom, axleZ) => {
    const dz = Math.sqrt(ARCH * ARCH - bottom * bottom);
    const a0 = Math.atan2(bottom, dz);
    // Along the bottom toward the arch, round over the wheel, and on.
    if (from < to) {
      shape.lineTo(axleZ - dz, bottom);
      shape.absarc(axleZ, 0, ARCH, Math.PI - a0, a0, true);
      shape.lineTo(to, bottom);
    } else {
      shape.lineTo(axleZ + dz, bottom);
      shape.absarc(axleZ, 0, ARCH, a0, Math.PI - a0, false);
      shape.lineTo(to, bottom);
    }
  };

  for (const side of [-1, 1]) {
    // Front fender: the outer side, cut round the front wheel, and its flat top.
    const fender = new THREE.Shape();
    fender.moveTo(COWL, SILL);
    archedBottom(fender, COWL, FRONT + 0.02, SILL, -HALF_BASE);
    fender.lineTo(FRONT + 0.02, FENDER_TOP);
    fender.lineTo(COWL, FENDER_TOP);
    fender.closePath();
    sidePanel(fender, side * FLARE, 0.025, paint);
    // The inner fender wall beside the engine bay, cut round the wheel the same way.
    const inner = new THREE.Shape();
    inner.moveTo(COWL, 0.3);
    archedBottom(inner, COWL, FRONT + 0.02, 0.3, -HALF_BASE);
    inner.lineTo(FRONT + 0.02, FENDER_TOP);
    inner.lineTo(COWL, FENDER_TOP);
    inner.closePath();
    sidePanel(inner, side * HOOD_EDGE, 0.015, trim);
    add(box(FLARE - HOOD_EDGE, 0.025, COWL - FRONT - 0.02), paint, side * (FLARE + HOOD_EDGE) / 2, FENDER_TOP, (COWL + FRONT) / 2 + 0.01);
    // A turn signal on the fender's front corner, as on the FJ40.
    add(box(0.12, 0.05, 0.05), amber, side * 0.72, FENDER_TOP + 0.03, FRONT + 0.06);
    // A lip round the front arch.
    const frontLip = new THREE.EllipseCurve(-HALF_BASE, 0, ARCH + 0.03, ARCH + 0.03, 0.45, Math.PI - 0.45, false);
    const lipPoints = frontLip.getPoints(24).map((pt) => new THREE.Vector3(side * (FLARE + 0.012), pt.y, pt.x));
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lipPoints), 24, 0.022, 6, false), paint, 0, 0, 0);

    // The tub side behind the door, cut round the rear wheel, with a flare round the arch.
    const tub = new THREE.Shape();
    tub.moveTo(DOOR_BACK, SILL);
    archedBottom(tub, DOOR_BACK, TAIL - CORNER, SILL, HALF_BASE);
    tub.lineTo(TAIL - CORNER, BELT);
    tub.lineTo(DOOR_BACK, BELT);
    tub.closePath();
    sidePanel(tub, side * SIDE, 0.025, paint);
    upright(cornerBand(side, -0.025, 0, 0, 0), SILL, BELT, paint);
    const flareCurve = new THREE.EllipseCurve(HALF_BASE, 0, ARCH + 0.03, ARCH + 0.03, 0.42, Math.PI - 0.42, false);
    const flarePoints = flareCurve.getPoints(24).map((p) => new THREE.Vector3(side * (SIDE + 0.02), p.y, p.x));
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(flarePoints), 24, 0.035, 6, false), paint, 0, 0, 0);
    // The fuel cap on the driver's side, filling the tank under the seat.
    if (side === (rightHand ? 1 : -1)) add(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 20).rotateZ(Math.PI / 2), chrome, side * (SIDE + 0.02), 0.58, DOOR_BACK + 0.25);
    // Tail lights, on the back just inside the rounded corners.
    add(box(0.07, 0.16, 0.02), red, side * (SIDE - CORNER - 0.06), 0.62, TAIL + 0.008);

    // The door, its window frame up to the roof, and the glass.
    add(box(0.035, BELT - SILL, DOOR_BACK - COWL - 0.03), paint, side * (SIDE + 0.005), (BELT + SILL) / 2, (DOOR_BACK + COWL) / 2);
    add(box(0.05, 0.02, 0.1), chrome, side * (SIDE + 0.03), BELT - 0.12, DOOR_BACK - 0.14); // handle
    // The hinges, outside at the door's front edge, as the FJ40's are.
    for (const y of [0.36, 0.74]) add(box(0.04, 0.09, 0.05), black, side * (SIDE + 0.03), y, COWL + 0.03);
    // A crease along the body sides, along the door and back over the tub, round the corner.
    add(box(0.012, 0.025, DOOR_BACK - COWL - 0.1), paint, side * (SIDE + 0.028), 0.62, (DOOR_BACK + COWL) / 2 + 0.04);
    upright(cornerBand(side, 0, 0.01, TAIL - CORNER - DOOR_BACK, 0), 0.6075, 0.6325, paint);
    const winTop = ROOF - 0.07;
    // The vent window at the front of the door glass.
    add(box(0.025, winTop - BELT - 0.02, 0.025), black, side * (SIDE - 0.005), (winTop + BELT) / 2, COWL + 0.32);
    for (const z of [COWL + 0.12, DOOR_BACK - 0.03]) add(box(0.03, winTop - BELT, 0.035), white, side * (SIDE - 0.01), (winTop + BELT) / 2, z);
    add(new THREE.PlaneGeometry(DOOR_BACK - COWL - 0.18, winTop - BELT - 0.02).rotateY(Math.PI / 2), glass, side * (SIDE - 0.01), (winTop + BELT) / 2, (DOOR_BACK + COWL) / 2 + 0.045, body, false);
    // A mirror on the door.
    add(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 6).rotateZ(Math.PI / 2), chrome, side * (SIDE + 0.08), BELT + 0.04, COWL + 0.18);
    add(new THREE.CylinderGeometry(0.06, 0.06, 0.025, 20).rotateX(Math.PI / 2), trim, side * (SIDE + 0.16), BELT + 0.04, COWL + 0.18);

    // Hardtop sides: a long window, then the corner window, its glass wrapping round the back
    // corner. A rail along the bottom and a strip along the top run round with it.
    upright(cornerBand(side, -0.03, 0.005, TAIL - CORNER - DOOR_BACK, SIDE - CORNER), BELT, BELT + 0.045, white);
    upright(cornerBand(side, -0.03, 0.005, TAIL - CORNER - DOOR_BACK, 0.08), winTop - 0.02, ROOF - 0.06, white);
    add(box(0.03, winTop - BELT, 0.06), white, side * (SIDE - 0.01), (winTop + BELT) / 2, DOOR_BACK + 0.04);
    add(box(0.03, winTop - BELT, 0.08), white, side * (SIDE - 0.01), (winTop + BELT) / 2, 1.42);
    add(new THREE.PlaneGeometry(1.42 - DOOR_BACK - 0.13, winTop - BELT - 0.04).rotateY(Math.PI / 2), glass, side * (SIDE - 0.012), (winTop + BELT) / 2, (1.42 + DOOR_BACK) / 2 + 0.005, body, false);
    add(ribbon(cornerLine(side, -0.014, TAIL - CORNER - 1.46, 0.08), BELT + 0.045, winTop - 0.02), glass, 0, 0, 0, body, false);
  }

  // The front: grille panel framing the black grille, with the headlights either side and a plain
  // cream bar across the top.
  const grilleW = 0.82;
  add(box(grilleW, 0.09, 0.03), cream, 0, 0.75, FRONT - 0.005);
  add(box(grilleW, 0.4, 0.02), black, 0, 0.5, FRONT + 0.01);
  for (let i = 0; i < 9; i++) add(box(0.012, 0.38, 0.02), chrome, -grilleW / 2 + 0.06 + (i * (grilleW - 0.12)) / 8, 0.5, FRONT - 0.005);
  add(box(grilleW, 0.025, 0.03), chrome, 0, 0.29, FRONT - 0.005);
  for (const side of [-1, 1]) {
    // The panel outboard of the grille, and the round headlight in it.
    const w = FLARE - grilleW / 2;
    add(box(w, FENDER_TOP - 0.2, 0.03), paint, side * (grilleW / 2 + w / 2), (FENDER_TOP + 0.2) / 2, FRONT);
    add(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 32).rotateX(Math.PI / 2), chrome, side * 0.63, 0.56, FRONT - 0.02);
    add(new THREE.SphereGeometry(0.085, 24, 12, 0, Math.PI * 2, 0, Math.PI / 3).rotateX(-Math.PI / 2), lens, side * 0.63, 0.56, FRONT - 0.03, body, false);
    add(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16).rotateX(Math.PI / 2), amber, side * 0.63, 0.36, FRONT - 0.02);
  }
  // The hood: crowned across, rolled down at its sides to skirts that meet the fenders and at its
  // front over the grille; its two pressed ridges, and the catches on its sides.
  const crown = (x) => HOOD_TOP - HOOD_CROWN * (x / HOOD_EDGE) ** 2;
  // The hood's top across, edge to edge, its outer `roll` rounded down, `inset` in from the skin.
  const hoodLine = (inset, roll) => {
    const edge = HOOD_EDGE - inset;
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const x = edge * Math.sin(((i / 40) * 2 - 1) * (Math.PI / 2)); // closer together at the edges
      const into = Math.max(0, Math.abs(x) - (edge - roll)) / roll;
      points.push(new THREE.Vector2(x, crown(x) - inset - roll * (1 - Math.sqrt(Math.max(0, 1 - into * into)))));
    }
    return points;
  };
  const skin = 0.02;
  const hoodShape = new THREE.Shape([
    new THREE.Vector2(-HOOD_EDGE, FENDER_TOP),
    ...hoodLine(0, 0.035),
    new THREE.Vector2(HOOD_EDGE, FENDER_TOP),
    new THREE.Vector2(HOOD_EDGE - skin, FENDER_TOP),
    ...hoodLine(skin, 0.035 - skin).reverse(),
    new THREE.Vector2(-HOOD_EDGE + skin, FENDER_TOP),
  ]);
  const hoodGeo = new THREE.ExtrudeGeometry(hoodShape, { depth: COWL - FRONT + 0.02, steps: 24, bevelEnabled: false });
  const hoodPos = hoodGeo.attributes.position;
  for (let i = 0; i < hoodPos.count; i++) {
    const into = hoodPos.getZ(i) / 0.12; // the front edge rolls down over its first 12 cm
    if (into < 1) hoodPos.setY(i, hoodPos.getY(i) - 0.03 * (1 - into) ** 2);
  }
  add(smooth(hoodGeo), paint, 0, 0, FRONT - 0.02);
  for (const side of [-1, 1]) {
    const x = side * 0.16;
    const ridge = add(box(0.05, 0.012, COWL - FRONT - 0.18), paint, x, crown(x) + 0.004, (COWL + FRONT) / 2 + 0.04);
    ridge.rotation.z = Math.atan((-2 * HOOD_CROWN * x) / HOOD_EDGE ** 2);
    add(box(0.02, 0.05, 0.06), chrome, side * (HOOD_EDGE + 0.012), FENDER_TOP + 0.025, FRONT + 0.12);
  }
  // The cowl, and the windscreen: an upright frame on the cowl, glass, two wipers.
  add(box(2 * SIDE, BELT - FENDER_TOP + 0.04, 0.12), paint, 0, (BELT + FENDER_TOP) / 2, COWL + 0.04);
  const screen = new THREE.Group();
  screen.position.set(0, BELT, COWL + 0.06);
  screen.rotation.x = -0.12; // a little rake
  body.add(screen);
  const sh = ROOF - BELT - 0.06;
  for (const x of [-SIDE + 0.03, SIDE - 0.03]) add(box(0.05, sh, 0.05), paint, x, sh / 2, 0, screen);
  add(box(2 * SIDE, 0.05, 0.05), paint, 0, sh, 0, screen);
  add(box(2 * SIDE, 0.04, 0.05), paint, 0, 0.02, 0, screen);
  add(new THREE.PlaneGeometry(2 * SIDE - 0.1, sh - 0.08), glass, 0, sh / 2 + 0.01, 0, screen, false);
  // The FJ40's wipers hang from the top of the frame.
  for (const x of [-0.4, 0.35]) {
    const wiper = add(box(0.012, 0.36, 0.012), black, x, sh - 0.2, -0.035, screen);
    wiper.rotation.z = 0.18;
  }

  // The hardtop: the roof, its back corners rounded like the tub's; the back between the corner
  // windows, framing the back window; and the drip rails, round the corners.
  upright(plan(0.01, COWL + 0.045), ROOF - 0.06, ROOF, white);
  const backWide = 2 * (SIDE - CORNER - 0.08);
  const backTop = ROOF - 0.06;
  add(box(backWide, 1.0 - BELT - 0.045, 0.03), white, 0, (1.0 + BELT + 0.045) / 2, TAIL - 0.015);
  add(box(backWide, backTop - 1.44, 0.03), white, 0, (backTop + 1.44) / 2, TAIL - 0.015);
  for (const side of [-1, 1]) add(box(BACK_PILLAR, 0.44, 0.03), white, side * (backWide / 2 - BACK_PILLAR / 2), 1.22, TAIL - 0.015);
  add(new THREE.PlaneGeometry(backWide - 2 * BACK_PILLAR, 0.44), glass, 0, 1.22, TAIL - 0.012, body, false);
  for (const side of [-1, 1]) upright(cornerBand(side, 0.005, 0.025, TAIL - CORNER - COWL, 0), ROOF - 0.08, ROOF - 0.06, white);
  // Pressed ribs along the roof.
  for (let i = -2; i <= 2; i++) add(box(0.05, 0.012, TAIL - COWL - 0.3), white, i * 0.28, ROOF + 0.004, (TAIL + COWL) / 2 + 0.1);

  // The tailgate, its hinges, and the spare wheel on the back.
  add(box(2 * (SIDE - CORNER), BELT - SILL, 0.025), paint, 0, (BELT + SILL) / 2, TAIL - 0.0125);
  for (const x of [-0.5, 0.5]) add(box(0.006, BELT - SILL - 0.05, 0.004), black, x, (BELT + SILL) / 2, TAIL + 0.001, body, false);
  for (const x of [-0.4, 0.4]) add(box(0.1, 0.03, 0.03), chrome, x, BELT - 0.05, TAIL + 0.012);
  if (makeWheel) {
    const spare = makeWheel();
    spare.rotation.y = -Math.PI / 2; // face out the back
    spare.position.set(0.25, 0.6, TAIL + 0.13);
    body.add(spare);
  }

  // Floor and the bulkhead behind the engine.
  upright(plan(-0.015, COWL), SILL + 0.005, SILL + 0.035, trim);
  add(box(2 * HOOD_EDGE, BELT - 0.3, 0.02), trim, 0, (BELT + 0.3) / 2, COWL - 0.02);

  // Inside: the dash with its gauges, the steering wheel on its column, and two seats.
  const driver = rightHand ? 1 : -1;
  add(box(2 * SIDE - 0.05, 0.16, 0.14), paint, 0, BELT - 0.1, COWL + 0.16);
  add(box(2 * SIDE - 0.05, 0.03, 0.18), black, 0, BELT - 0.01, COWL + 0.17);
  for (const dx of [-0.1, 0.1]) {
    add(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 24).rotateX(Math.PI / 2), black, driver * 0.38 + dx, BELT - 0.1, COWL + 0.235);
    add(new THREE.TorusGeometry(0.055, 0.006, 6, 24), chrome, driver * 0.38 + dx, BELT - 0.1, COWL + 0.245);
  }
  const column = new THREE.Group();
  column.position.set(driver * 0.38, BELT - 0.06, COWL + 0.2);
  column.rotation.x = 0.75; // leaning back toward the driver
  body.add(column);
  add(new THREE.CylinderGeometry(0.022, 0.026, 0.42, 12), trim, 0, 0.21, 0, column);
  const steeringWheel = new THREE.Group();
  steeringWheel.position.y = 0.42;
  column.add(steeringWheel);
  const rim = add(new THREE.TorusGeometry(0.2, 0.013, 10, 40), black, 0, 0, 0, steeringWheel);
  rim.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) {
    const spoke = add(box(0.2, 0.01, 0.025), chrome, 0, 0, 0, steeringWheel);
    spoke.geometry.translate(0.1, 0, 0);
    spoke.rotation.y = Math.PI / 2 + (i * Math.PI * 2) / 3;
  }
  add(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 20), chrome, 0, 0.01, 0, steeringWheel);
  for (const side of [-1, 1]) {
    const seat = new THREE.Group();
    seat.position.set(side * 0.4, SILL + 0.05, 0.12);
    body.add(seat);
    add(box(0.48, 0.12, 0.48), seatMat, 0, 0.2, 0, seat);
    const back = add(box(0.48, 0.55, 0.1), seatMat, 0, 0.5, 0.24, seat);
    back.rotation.x = -0.12;
  }
  // A grab handle on the dash for the passenger.
  add(new THREE.TorusGeometry(0.07, 0.008, 6, 16, Math.PI), chrome, -driver * 0.4, BELT + 0.02, COWL + 0.2);

  // Rear bumperettes.
  for (const side of [-1, 1]) upright(cornerBand(side, 0, 0.08, 0.06, 0.16), 0.07, 0.17, black);
  // Tow hooks on the front bumper.
  for (const side of [-1, 1]) {
    const hook = add(new THREE.TorusGeometry(0.035, 0.012, 8, 16, Math.PI * 1.3), black, side * 0.42, 0.06, FRONT - 0.08);
    hook.rotation.y = Math.PI / 2;
  }

  // Every painted panel is baked into the body's own axes, so the weathering, worked out from where
  // a point is on the body, lines up across them all.
  body.updateMatrixWorld(true);
  const painted = [];
  body.traverse((o) => o.isMesh && o.material === paint && painted.push(o));
  for (const mesh of painted) {
    mesh.geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0, 0, 0);
    mesh.scale.set(1, 1, 1);
    body.add(mesh);
  }

  return { group: body, steeringWheel };
}

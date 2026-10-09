// What's far off: the sky, with its clouds and the sun, and the country all round out to the
// horizon: the valley floor, then range after range of mountains, forested low down, bare rock
// above, snow on the high ones, two great massifs standing over the rest, each lit by the sun and
// shadowed by the ridges between, pale with haze.
//
// They're drawn last, as if at the far end of the depth buffer, so only what nothing nearer covers
// is shaded: the sky first, then the ranges ring by ring from the horizon inward, the nearer over
// the further.
import * as THREE from "three";
import { MOUNTAIN } from "./mountain.js";
import { AIR, CLOUDS_GLSL, HAZE_GLSL, CLOUD_BASE } from "./atmosphere.js";

const { x0: X0, z0: Z0, nx: NX, nz: NZ, cell: CELL } = MOUNTAIN.grid;
const CX = X0 + ((NX - 1) * CELL) / 2;
const CZ = Z0 + ((NZ - 1) * CELL) / 2;
const INNER = 700; // m from the middle: the ring starts here, under the near ground
const OUTER = 7500; // and reaches the horizon here
const AROUND = 768; // segments round
const RINGS = 128; // and out, further apart the further out
const SKY = 20000; // the sky dome's radius

const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

// Gradient noise, -1 to 1.
const PERM = new Uint8Array(512);
{
  let s = 1234567;
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}
const GRADS = Array.from({ length: 16 }, (_, i) => [Math.cos((i / 16) * Math.PI * 2), Math.sin((i / 16) * Math.PI * 2)]);
function perlin(x, z) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const g = (i, j, dx, dz) => {
    const v = GRADS[PERM[(PERM[(ix + i) & 255] + iz + j) & 255] & 15];
    return v[0] * dx + v[1] * dz;
  };
  const u = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
  const w = fz * fz * fz * (fz * (fz * 6 - 15) + 10);
  const a = g(0, 0, fx, fz) + (g(1, 0, fx - 1, fz) - g(0, 0, fx, fz)) * u;
  const b = g(0, 1, fx, fz - 1) + (g(1, 1, fx - 1, fz - 1) - g(0, 1, fx, fz - 1)) * u;
  return (a + (b - a) * w) * 1.4;
}
// Ridged noise: sharp crests where the noise crosses zero, the finer octaves only on the ridges, as
// on a mountain range worn by ice and water. About 0 to 1.
function ridged(x, z) {
  let sum = 0;
  let amp = 1;
  let weight = 1;
  let norm = 0;
  for (let o = 0; o < 8; o++) {
    let n = 1 - Math.abs(perlin(x, z));
    n *= n;
    sum += n * amp * weight;
    norm += amp;
    weight = Math.min(1, n * 1.7);
    const nx = x * 1.6 - z * 1.2 + 3.1;
    z = x * 1.2 + z * 1.6 + 7.7;
    x = nx;
    amp *= 0.47;
  }
  return sum / norm;
}

// The two great massifs: where, how high, how broad.
const MASSIFS = [
  { x: CX + 2700, z: CZ + 2900, h: 1750, r: 900 },
  { x: CX - 3400, z: CZ - 2500, h: 1350, r: 800 },
];

// The country's height: near the middle, the mountain the road climbs, as the near ground has it;
// easing to the valley floors; and from a kilometre and a half out, the ranges rising.
export function farHeight(x, z) {
  const dx = x - CX;
  const dz = z - CZ;
  const r = Math.sqrt(dx * dx + dz * dz);
  const floor = -70 + 35 * perlin(x / 1100 + 3.3, z / 1100 + 8.1);
  let h = floor;
  if (r < 1600) {
    const blend = smooth((r - 1000) / 600);
    const near = MOUNTAIN.natural(x, z);
    h = near * (1 - blend) + Math.max(-260, Math.min(20, near)) * blend * 0.4 + floor * blend * 0.6;
  }
  const a = Math.atan2(dz, dx);
  const rise = smooth((r - 1350) / 1900);
  if (rise > 0) {
    const amp = 820 + 380 * Math.sin(a * 3 + 1.1) + 220 * Math.sin(a * 7 + 0.4);
    h += rise * amp * Math.max(0, ridged(x / 1700, z / 1700) - 0.12) * 1.6;
  }
  for (const m of MASSIFS) {
    const d2 = ((x - m.x) ** 2 + (z - m.z) ** 2) / (m.r * m.r);
    if (d2 < 9) h += m.h * Math.exp(-d2 * 0.9) * (0.55 + 0.75 * ridged(x / 900 + 11, z / 900 + 5));
  }
  return h;
}

// Heights on a square grid over all of it, for the sun's shadows and the normals.
const SPAN = OUTER + 600;
const GSTEP = 50;
const GN = Math.round((2 * SPAN) / GSTEP) + 1;
let gridHeights = null;
function heights() {
  if (gridHeights) return gridHeights;
  gridHeights = new Float32Array(GN * GN);
  for (let j = 0; j < GN; j++) for (let i = 0; i < GN; i++) gridHeights[j * GN + i] = farHeight(CX - SPAN + i * GSTEP, CZ - SPAN + j * GSTEP);
  return gridHeights;
}
function gridAt(x, z) {
  const g = heights();
  const fx = Math.max(0, Math.min(GN - 1.001, (x - CX + SPAN) / GSTEP));
  const fz = Math.max(0, Math.min(GN - 1.001, (z - CZ + SPAN) / GSTEP));
  const i = Math.floor(fx);
  const j = Math.floor(fz);
  const u = fx - i;
  const v = fz - j;
  const k = j * GN + i;
  return (g[k] * (1 - u) + g[k + 1] * u) * (1 - v) + (g[k + GN] * (1 - u) + g[k + GN + 1] * u) * v;
}

const SKY_FRAGMENT = /* glsl */ `
uniform vec3 zenith;
uniform vec3 horizon;
uniform vec3 sunColour;
uniform vec3 hazeColour;
varying vec3 vDir;
${CLOUDS_GLSL}
uniform vec3 sunTo;
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  float mu = max(dot(d, sunTo), 0.0);
  // The sky: deep overhead, paling to the horizon, brighter round the sun.
  vec3 sky = mix(horizon, zenith, pow(clamp(h, 0.0, 1.0), 0.42));
  sky += sunColour * (0.02 * pow(mu, 4.0) + 0.06 * pow(mu, 40.0));
  // Low down, the haze over the far distance, as the ground's haze fades into (see atmosphere.js).
  vec3 tint = hazeColour + sunColour * (0.025 * pow(mu, 5.0) + 0.05 * pow(mu, 24.0));
  sky = mix(sky, tint, exp(-max(h, 0.0) * 11.0));
  // The sun.
  sky += sunColour * smoothstep(0.99986, 0.99994, mu) * 9.0;
  // Clouds on their layer, lit from the sun's side, shaded where they're thick toward it.
  if (h > 0.004) {
    float t = (${CLOUD_BASE.toFixed(1)} - cameraPosition.y) / h;
    vec2 p = cameraPosition.xz + d.xz * t;
    float c = cloudsAt(p);
    if (c > 0.0) {
      vec2 toSun = sunTo.xz / max(length(sunTo.xz), 0.01);
      float toward = cloudsAt(p + toSun * 420.0);
      float lit = clamp(1.0 - toward * 0.8 + (1.0 - c) * 0.35, 0.12, 1.0);
      vec3 shade = mix(zenith, hazeColour, 0.6) * 0.62;
      vec3 bright = sunColour * 0.3 + hazeColour * 0.7;
      vec3 cloud = mix(shade, bright, lit);
      cloud += sunColour * 0.12 * pow(mu, 10.0) * (1.0 - c);
      cloud = mix(cloud, tint, 1.0 - exp(-t / 42000.0));
      sky = mix(sky, cloud, c * smoothstep(0.004, 0.06, h));
    }
  }
  gl_FragColor = vec4(sky, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const RANGE_VERTEX = /* glsl */ `
attribute float sun;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vSun;
void main() {
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  vNormal = normal;
  vSun = sun;
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
  gl_Position.z = gl_Position.w; // at the far end of the depth
}`;
const RANGE_FRAGMENT = /* glsl */ `
#include <common>
uniform vec3 sunTo;
uniform vec3 sunColour;
uniform vec3 hazeColour;
uniform float hazeDensity;
uniform float hazeThin;
uniform vec3 hemiSky;
uniform vec3 hemiGround;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vSun;
${CLOUDS_GLSL}
${HAZE_GLSL}
void main() {
  // The surface's own facets, a little, so the crags read.
  vec3 face = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  if (face.y < 0.0) face = -face;
  vec3 n = normalize(mix(normalize(vNormal), face, 0.4));
  float y = vWorld.y;
  float steep = 1.0 - n.y;
  float wander = texture2D(cloudMap, vWorld.xz / 1300.0 + 0.21).r - 0.5;
  float fine = texture2D(cloudMap, vWorld.xz / 140.0 + 0.53).r;
  // Forest low down where it isn't too steep; meadow and scree up to the rock; snow high up, where
  // it can lie, more of it on the shaded northern slopes and in the gullies.
  float treeLine = 430.0 + wander * 260.0;
  float forest = (1.0 - smoothstep(treeLine - 50.0, treeLine + 50.0, y)) * (1.0 - smoothstep(0.32, 0.5, steep));
  float green = (1.0 - smoothstep(treeLine + 30.0, treeLine + 260.0, y)) * (1.0 - smoothstep(0.25, 0.45, steep));
  float snowLine = 760.0 + wander * 380.0 + n.z * 150.0;
  float snow = smoothstep(snowLine - 30.0, snowLine + 50.0, y) * (1.0 - smoothstep(0.5, 0.72, steep + (fine - 0.5) * 0.4));
  float grain = texture2D(cloudMap, vWorld.xz / 37.0 + vec2(0.0, y / 90.0)).r;
  vec3 rock = mix(vec3(0.12, 0.11, 0.1), vec3(0.28, 0.25, 0.22), fine * 0.6 + grain * 0.4);
  vec3 albedo = mix(rock, vec3(0.13, 0.135, 0.07) * (0.8 + 0.4 * fine), green);
  albedo = mix(albedo, vec3(0.03, 0.05, 0.028) * (0.75 + 0.5 * fine), forest);
  albedo = mix(albedo, vec3(0.8, 0.83, 0.88), snow);
  // Lit by the sun where the ridges and clouds let it through, and by the sky.
  float through = vSun * (1.0 - 0.72 * cloudsAt(vWorld.xz + sunTo.xz * ((${CLOUD_BASE.toFixed(1)} - y) / max(sunTo.y, 0.06))));
  vec3 light = sunColour * max(dot(n, sunTo), 0.0) * through + mix(hemiGround, hemiSky, n.y * 0.5 + 0.5) * 3.0;
  vec3 colour = albedo * RECIPROCAL_PI * light;
  // The haze, as on the near ground.
  vec3 ray = vWorld - cameraPosition;
  float dist = length(ray);
  float mu = max(dot(ray / dist, sunTo), 0.0);
  vec3 tint = hazeColour + sunColour * (0.025 * pow(mu, 5.0) + 0.05 * pow(mu, 24.0));
  colour = mix(colour, tint, hazeOf(dist, cameraPosition.y, ray.y, hazeDensity, hazeThin));
  gl_FragColor = vec4(colour, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export class Background {
  constructor(scene) {
    this.scene = scene;
    this.skyUniforms = {
      zenith: { value: new THREE.Color() },
      horizon: { value: new THREE.Color() },
      cloudMap: AIR.cloudMap,
      cloudShift: AIR.cloudShift,
      cloudCover: AIR.cloudCover,
      sunTo: AIR.sunTo,
      sunColour: AIR.sunColour,
      hazeColour: AIR.hazeColour,
    };
    this.sky = new THREE.Mesh(
      new THREE.SphereGeometry(SKY, 48, 24),
      new THREE.ShaderMaterial({
        uniforms: this.skyUniforms,
        side: THREE.BackSide,
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        vertexShader: `varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position.z = gl_Position.w; // at the far end of the depth
}`,
        fragmentShader: SKY_FRAGMENT,
      }),
    );
    this.sky.renderOrder = 1000; // after everything near, then the ranges over it
    this.sky.frustumCulled = false;
    this.scene.add(this.sky);
    this.hemi = { sky: { value: new THREE.Color() }, ground: { value: new THREE.Color() } };
    this.buildRange();
  }

  buildRange() {
    const count = (AROUND + 1) * RINGS;
    const position = new Float32Array(count * 3);
    const normal = new Float32Array(count * 3);
    this.rangeSun = new Float32Array(count).fill(1);
    const grow = Math.pow(OUTER / INNER, 1 / (RINGS - 1));
    for (let r = 0; r < RINGS; r++) {
      const radius = INNER * Math.pow(grow, r);
      for (let a = 0; a <= AROUND; a++) {
        const angle = (a / AROUND) * Math.PI * 2;
        const x = CX + Math.cos(angle) * radius;
        const z = CZ + Math.sin(angle) * radius;
        const k = r * (AROUND + 1) + a;
        // Past the last ring it drops away under the horizon.
        const y = r === RINGS - 1 ? -600 : farHeight(x, z);
        position.set([x, y, z], k * 3);
        const e = GSTEP;
        const nx = gridAt(x - e, z) - gridAt(x + e, z);
        const nz = gridAt(x, z - e) - gridAt(x, z + e);
        const len = Math.hypot(nx, 2 * e, nz);
        normal.set([nx / len, (2 * e) / len, nz / len], k * 3);
      }
    }
    const index = new Uint32Array(AROUND * (RINGS - 1) * 6);
    let n = 0;
    // From the horizon in, so a nearer ridge is drawn over a further one.
    for (let r = RINGS - 2; r >= 0; r--) {
      for (let a = 0; a < AROUND; a++) {
        const k = r * (AROUND + 1) + a;
        const o = k + AROUND + 1;
        index.set([k, k + 1, o, k + 1, o + 1, o], n);
        n += 6;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
    geo.setAttribute("sun", new THREE.BufferAttribute(this.rangeSun, 1));
    geo.setIndex(new THREE.BufferAttribute(index, 1));
    geo.computeBoundingSphere();
    this.range = new THREE.Mesh(
      geo,
      new THREE.ShaderMaterial({
        uniforms: {
          ...AIR,
          hemiSky: this.hemi.sky,
          hemiGround: this.hemi.ground,
        },
        vertexShader: RANGE_VERTEX,
        fragmentShader: RANGE_FRAGMENT,
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
      }),
    );
    this.range.frustumCulled = false;
    this.range.renderOrder = 1001;
    this.scene.add(this.range);
  }

  // Which of the ranges' points the sun reaches: marching toward it over the heights, is any ridge
  // above its line? Soft at the edge, as the sun is a disc.
  shadeRange() {
    const sun = AIR.sunTo.value;
    const flat = Math.hypot(sun.x, sun.z);
    const pos = this.range.geometry.attributes.position.array;
    const lit = this.rangeSun;
    if (flat < 1e-3) {
      lit.fill(1);
    } else {
      const dx = sun.x / flat;
      const dz = sun.z / flat;
      const rise = sun.y / flat;
      for (let k = 0; k < lit.length; k++) {
        const x = pos[k * 3];
        const y = pos[k * 3 + 1] + 4;
        const z = pos[k * 3 + 2];
        let most = -1;
        for (let s = 40; s < 9000; s *= 1.14) most = Math.max(most, (gridAt(x + dx * s, z + dz * s) - y) / s);
        lit[k] = smooth((rise - most) / 0.05 + 0.5);
      }
    }
    this.range.geometry.attributes.sun.needsUpdate = true;
  }

  setTime(t, hemi) {
    this.skyUniforms.zenith.value.set(t.zenith);
    this.skyUniforms.horizon.value.set(t.horizon);
    this.hemi.sky.value.copy(hemi.color).multiplyScalar(hemi.intensity);
    this.hemi.ground.value.copy(hemi.groundColor).multiplyScalar(hemi.intensity);
    this.shadeRange();
  }

  // Each frame: the sky round the camera.
  update(camera) {
    this.sky.position.copy(camera.position);
  }
}

// Draws the mountain (see mountain.js): its ground, textured by what it is (grass, forest floor,
// rock where it's steep, bare earth on the road's cuts and banks), with its bumps lit and its
// hollows shaded; the road, packed dirt with its ruts, its edges fading into the verge; pines,
// boulders and, round the jeep, tufts of grass stirring in the wind. (The mountains far off and
// the sky are sky.js's.)
//
// The ground near the car is drawn from the same half-metre grid the physics reads, in 32 m
// tiles, finer the nearer they are; past them, one coarse mesh out a kilometre fills in, cut away
// where the tiles are so it never shows through them. Pines near the car are drawn branch by
// branch; further off, as pictures of the same pine, taken from all round in the same light.
//
// Where the mountain hides the sun from the ground is worked out once for the time of day (see
// lightUp) and kept as two maps every outdoor shader reads (atmosphere.js).
import * as THREE from "three";
import { MOUNTAIN, GROUND } from "./mountain.js";
import { makeTextures } from "./textures.js";
import { AIR, CLOUDS_GLSL, SUNLIGHT_GLSL, HAZE_GLSL } from "./atmosphere.js";

const TILE = 32;
const NEAR = 190; // tiles out to here; the coarse mesh beyond
const FAR = 900; // the coarse mesh's reach from the mountain's middle
const BUCKET = 48; // trees and boulders are drawn in blocks this size, so blocks out of view aren't
const DETAIL = 95; // pines in blocks nearer than this are drawn branch by branch
const BOULDERS_SEEN = 260; // boulders in blocks further than this aren't drawn
const VERGE = { block: 64, seen: 100 }; // the road's plants and pebbles: in blocks this size, drawn nearer than this (further, they cost far more than they show)
const GRASS = { count: 5000, size: 52 }; // tufts round the camera, in a square this wide
const SUN_FAR = 1300; // m from the middle the far sunlight map reaches
const SUN_FAR_STEP = 8;
// The far pines' pictures: this many round, each this many pixels; the pine they're taken of is
// this wide for its height.
const VIEWS = 8;
const VIEW_W = 96;
const VIEW_H = 256;
const BAKE_WIDE = 0.31;
const VIEW_ASPECT = VIEW_W / VIEW_H;

const { x0: X0, z0: Z0, nx: NX, nz: NZ, cell: CELL, heights: HEIGHTS, kinds: KINDS } = MOUNTAIN.grid;
const GRID_X1 = X0 + (NX - 1) * CELL;
const GRID_Z1 = Z0 + (NZ - 1) * CELL;
const CENTRE_X = (X0 + GRID_X1) / 2;
const CENTRE_Z = (Z0 + GRID_Z1) / 2;

// How much of each texture a point gets: grass, earth, rock, forest floor.
const SPLAT = {
  [GROUND.GRASS]: [1, 0, 0, 0],
  [GROUND.ROAD]: [0, 1, 0, 0],
  [GROUND.LOOSE]: [0, 1, 0, 0],
  [GROUND.ROCK]: [0, 0, 1, 0],
  [GROUND.FOREST]: [0, 0, 0, 1],
};

// Off the grid, what the mountain would be: rock where it's steep, else forest or grass.
function wildSplat(x, z, steep) {
  if (steep > 1.05) return SPLAT[GROUND.ROCK];
  const forest = Math.sin(x / 37 + Math.sin(z / 53) * 2) * Math.sin(z / 41 + Math.cos(x / 61) * 2);
  return forest > -0.2 ? SPLAT[GROUND.FOREST] : SPLAT[GROUND.GRASS];
}
// Leaves, needles and blades are seen from both sides, lit the same either way: not as a solid's
// back, facing away from the light.
const FOLIAGE = "#include <normal_fragment_begin>\nnormal = normalize( vNormal );\nnonPerturbedNormal = normal;";
function foliage(material, key) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace("#include <normal_fragment_begin>", FOLIAGE);
  };
  material.customProgramCacheKey = () => key;
  return material;
}

const kindAt = (x, z) => {
  const c = Math.round((x - X0) / CELL);
  const r = Math.round((z - Z0) / CELL);
  return c >= 0 && r >= 0 && c < NX && r < NZ ? KINDS[r * NX + c] : -1;
};
// The ground's height between the grid's points, as the physics has it (the grid, not its rocks).
const groundAt = (x, z) => {
  const fx = (x - X0) / CELL;
  const fz = (z - Z0) / CELL;
  if (fx < 0 || fz < 0 || fx >= NX - 1 || fz >= NZ - 1) return MOUNTAIN.natural(x, z);
  const i = fx | 0;
  const j = fz | 0;
  const u = fx - i;
  const v = fz - j;
  const k = j * NX + i;
  return (HEIGHTS[k] * (1 - u) + HEIGHTS[k + 1] * u) * (1 - v) + (HEIGHTS[k + NX] * (1 - u) + HEIGHTS[k + NX + 1] * u) * v;
};
const gridHeight = (x, z) => {
  const c = Math.round((x - X0) / CELL);
  const r = Math.round((z - Z0) / CELL);
  if (c >= 0 && r >= 0 && c < NX && r < NZ) return HEIGHTS[r * NX + c];
  return MOUNTAIN.natural(x, z);
};

// A texture laid over a big area repeats, and the eye finds the repeat. So each look at one is
// shifted by an amount that changes from patch to patch of ground, two neighbouring shifts
// blended where the patches meet (after Inigo Quilez's fix for texture repetition): no two
// stretches alike. And over it, the macro variation: the ground a little lighter or darker,
// drier or greener, in patches tens of metres across. tileNoise is soft noise (the clouds').
const UNTILED_GLSL = `
uniform sampler2D tileNoise;
vec3 worldDx;
vec3 worldDy;
void patches(vec2 uv, out vec2 a, out vec2 b, out float t) {
  float l = textureLod(tileNoise, uv * 0.04, 0.0).r * 9.0;
  float i = floor(l);
  t = smoothstep(0.3, 0.7, l - i);
  a = uv + sin(vec2(3.0, 7.0) * i) * 4.3;
  b = uv + sin(vec2(3.0, 7.0) * (i + 1.0)) * 4.3;
}
vec4 untiled(sampler2D m, vec2 uv, vec2 dx, vec2 dy) {
  vec2 a;
  vec2 b;
  float t;
  patches(uv, a, b, t);
  return mix(textureGrad(m, a, dx, dy), textureGrad(m, b, dx, dy), t);
}
vec3 macro(vec2 p) {
  float m = texture2D(tileNoise, p / 70.0).r * 0.65 + texture2D(tileNoise, p / 17.0 + 0.3).r * 0.35;
  return (0.45 + 1.1 * m) * mix(vec3(1.05, 1.0, 0.9), vec3(0.95, 1.0, 1.05), texture2D(tileNoise, p / 43.0 + 0.7).r);
}
`;

// The ground's shader: four textures blended by each point's share of them, seen from above, but
// earth and rock wrapped round from the sides too so cliffs and cut banks aren't smeared; their
// normal maps bending the light the same way; each texture untiled, with a second, turned look at
// the grass, and the macro variation over all; and each point's shading from the hollows round it.
const GROUND_COMMON = `
uniform sampler2D grassMap;
uniform sampler2D grassNormal;
uniform sampler2D earthMap;
uniform sampler2D earthNormal;
uniform sampler2D rockMap;
uniform sampler2D rockNormal;
uniform sampler2D forestMap;
uniform sampler2D forestNormal;
uniform vec3 viewFrom;
varying vec4 vSplat;
varying float vShade;
varying vec3 vWorld;
varying vec3 vWorldNormal;
${UNTILED_GLSL}
// Earth or rock wrapped round from the three sides it can be seen from (so cliffs and cut banks
// aren't smeared), each side untiled: its colour; and, near, how its bumps bend the light, looked
// at in the same patches so they line up with the colour.
vec3 wrapBend;
vec3 wrapped(sampler2D m, sampler2D nm, float k, vec3 w, bool bumps) {
  vec3 c = vec3(0.0);
  vec2 a;
  vec2 b;
  float t;
  wrapBend = vec3(0.0);
  if (w.x > 0.02) {
    vec2 dx = worldDx.zy * k, dy = worldDy.zy * k;
    patches(vWorld.zy * k, a, b, t);
    c += mix(textureGrad(m, a, dx, dy).rgb, textureGrad(m, b, dx, dy).rgb, t) * w.x;
    if (bumps) {
      vec2 n = mix(textureGrad(nm, a, dx, dy).xy, textureGrad(nm, b, dx, dy).xy, t) * 2.0 - 1.0;
      wrapBend += vec3(0.0, n.y, n.x) * w.x;
    }
  }
  if (w.y > 0.02) {
    vec2 dx = worldDx.xz * k, dy = worldDy.xz * k;
    patches(vWorld.xz * k, a, b, t);
    c += mix(textureGrad(m, a, dx, dy).rgb, textureGrad(m, b, dx, dy).rgb, t) * w.y;
    if (bumps) {
      vec2 n = mix(textureGrad(nm, a, dx, dy).xy, textureGrad(nm, b, dx, dy).xy, t) * 2.0 - 1.0;
      wrapBend += vec3(n.x, 0.0, n.y) * w.y;
    }
  }
  if (w.z > 0.02) {
    vec2 dx = worldDx.xy * k, dy = worldDy.xy * k;
    patches(vWorld.xy * k, a, b, t);
    c += mix(textureGrad(m, a, dx, dy).rgb, textureGrad(m, b, dx, dy).rgb, t) * w.z;
    if (bumps) {
      vec2 n = mix(textureGrad(nm, a, dx, dy).xy, textureGrad(nm, b, dx, dy).xy, t) * 2.0 - 1.0;
      wrapBend += vec3(n.x, n.y, 0.0) * w.z;
    }
  }
  return c;
}
`;

export class Landscape {
  constructor(scene, { maxAniso }) {
    this.scene = scene;
    this.tex = makeTextures(maxAniso);
    this.time = 0;
    this.uniforms = [];
    this.ground = this.groundMaterial(false);
    this.distant = this.groundMaterial(true);
    this.tiles = new Map(); // "lod:tx:tz" → mesh
    this.shown = new Set();
    this.buildFar();
    this.buildRoad();
    this.buildTrees();
    this.buildBoulders();
    this.buildGrass();
    this.buildVerges();
  }

  // How much of the sun reaches the ground, for the time of day: from each point, march toward the
  // sun; if the ground anywhere along the way rises above the line to it, it's in shadow (softly at
  // the edge, the sun being a disc). On the grid every metre; round it every 8 m out to 1.3 km.
  lightUp() {
    const sun = AIR.sunTo.value;
    const flat = Math.hypot(sun.x, sun.z);
    const dx = flat > 1e-3 ? sun.x / flat : 0;
    const dz = flat > 1e-3 ? sun.z / flat : 0;
    const rise = flat > 1e-3 ? sun.y / flat : 1e3;
    const FN = Math.round((2 * SUN_FAR) / SUN_FAR_STEP) + 1;
    const FX0 = CENTRE_X - SUN_FAR;
    const FZ0 = CENTRE_Z - SUN_FAR;
    if (!this.farHeights) {
      this.farHeights = new Float32Array(FN * FN);
      for (let j = 0; j < FN; j++) for (let i = 0; i < FN; i++) this.farHeights[j * FN + i] = gridHeight(FX0 + i * SUN_FAR_STEP, FZ0 + j * SUN_FAR_STEP);
    }
    const far = this.farHeights;
    const farAt = (x, z) => {
      const fx = Math.max(0, Math.min(FN - 1.001, (x - FX0) / SUN_FAR_STEP));
      const fz = Math.max(0, Math.min(FN - 1.001, (z - FZ0) / SUN_FAR_STEP));
      const i = fx | 0;
      const j = fz | 0;
      const u = fx - i;
      const v = fz - j;
      const k = j * FN + i;
      return (far[k] * (1 - u) + far[k + 1] * u) * (1 - v) + (far[k + FN] * (1 - u) + far[k + FN + 1] * u) * v;
    };
    const heightAt = (x, z) => {
      const fx = (x - X0) / CELL;
      const fz = (z - Z0) / CELL;
      if (fx < 0 || fz < 0 || fx >= NX - 1 || fz >= NZ - 1) return farAt(x, z);
      const i = fx | 0;
      const j = fz | 0;
      const u = fx - i;
      const v = fz - j;
      const k = j * NX + i;
      return (HEIGHTS[k] * (1 - u) + HEIGHTS[k + 1] * u) * (1 - v) + (HEIGHTS[k + NX] * (1 - u) + HEIGHTS[k + NX + 1] * u) * v;
    };
    const lit = (x, z, h, first, grow) => {
      let most = -1e3;
      for (let s = first; s < SUN_FAR * 1.2; s *= grow) {
        const m = (heightAt(x + dx * s, z + dz * s) - h) / s;
        if (m > most) most = m;
      }
      const t = (rise - most) / 0.06 + 0.5;
      return t <= 0 ? 0 : t >= 1 ? 255 : Math.round(255 * t * t * (3 - 2 * t));
    };
    const map = (w, d, x0, z0, step, first, grow) => {
      const data = new Uint8Array(w * d);
      for (let j = 0; j < d; j++) {
        for (let i = 0; i < w; i++) {
          const x = x0 + i * step;
          const z = z0 + j * step;
          data[j * w + i] = lit(x, z, heightAt(x, z) + 0.12, first, grow);
        }
      }
      // Blurred a little, so a shadow's edge running across the map's rows doesn't come out stepped.
      const blurred = new Uint8Array(w * d);
      for (let pass = 0; pass < 2; pass++) {
        const from = pass ? blurred : data;
        const to = pass ? data : blurred;
        for (let j = 0; j < d; j++) {
          for (let i = 0; i < w; i++) {
            let sum = 0;
            for (let o = -2; o <= 2; o++) {
              const ii = pass ? i : Math.min(w - 1, Math.max(0, i + o));
              const jj = pass ? Math.min(d - 1, Math.max(0, j + o)) : j;
              sum += from[jj * w + ii] * [1, 4, 6, 4, 1][o + 2];
            }
            to[j * w + i] = sum / 16;
          }
        }
      }
      const t = new THREE.DataTexture(data, w, d, THREE.RedFormat);
      t.magFilter = t.minFilter = THREE.LinearFilter;
      t.unpackAlignment = 1;
      t.needsUpdate = true;
      return t;
    };
    const nw = (NX - 1) / 2 + 1;
    const nd = (NZ - 1) / 2 + 1;
    for (const key of ["sunNear", "sunFar"]) AIR[key].value.dispose();
    AIR.sunNear.value = map(nw, nd, X0, Z0, 1, 0.6, 1.2);
    AIR.sunNearBox.value.set(X0 - 0.5, Z0 - 0.5, 1 / nw, 1 / nd);
    AIR.sunFar.value = map(FN, FN, FX0, FZ0, SUN_FAR_STEP, SUN_FAR_STEP, 1.18);
    AIR.sunFarBox.value.set(FX0 - SUN_FAR_STEP / 2, FZ0 - SUN_FAR_STEP / 2, 1 / (FN * SUN_FAR_STEP), 1 / (FN * SUN_FAR_STEP));
  }

  groundMaterial(far) {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.96, metalness: 0 });
    const t = this.tex;
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, {
        grassMap: { value: t.grass.map },
        grassNormal: { value: t.grass.normal },
        earthMap: { value: t.earth.map },
        earthNormal: { value: t.earth.normal },
        rockMap: { value: t.rock.map },
        rockNormal: { value: t.rock.normal },
        forestMap: { value: t.forest.map },
        forestNormal: { value: t.forest.normal },
        viewFrom: { value: new THREE.Vector3() },
        tileNoise: AIR.cloudMap,
      });
      this.uniforms.push(shader.uniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec4 splat;\nattribute float shade;\nvarying vec4 vSplat;\nvarying float vShade;\nvarying vec3 vWorld;\nvarying vec3 vWorldNormal;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSplat = splat;\nvShade = shade;\nvWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWorldNormal = normalize(mat3(modelMatrix) * objectNormal);");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\n" + GROUND_COMMON)
        .replace("#include <map_fragment>", `${far ? "if (distance(vWorld.xz, viewFrom.xz) < " + (NEAR - 25).toFixed(1) + ") discard;" : ""}
vec4 share = vSplat / max(1e-3, vSplat.x + vSplat.y + vSplat.z + vSplat.w);
vec3 side = pow(abs(normalize(vWorldNormal)), vec3(4.0));
side /= side.x + side.y + side.z;
vec2 top = vWorld.xz;
float far = distance(vWorld.xz, viewFrom.xz);
worldDx = dFdx(vWorld);
worldDy = dFdy(vWorld);
bool bumps = far < 60.0;
vec3 grassColour = untiled(grassMap, top * 0.5, worldDx.xz * 0.5, worldDy.xz * 0.5).rgb;
if (far < 90.0) grassColour = mix(grassColour, texture2D(grassMap, mat2(0.8, 0.6, -0.6, 0.8) * top * 0.17).rgb, 0.4);
vec3 ground = grassColour * share.x;
vec3 earthBend = vec3(0.0);
vec3 rockBend = vec3(0.0);
if (share.y > 0.01) {
  ground += wrapped(earthMap, earthNormal, 0.7, side, bumps) * share.y;
  earthBend = wrapBend;
}
if (share.z > 0.01) {
  ground += wrapped(rockMap, rockNormal, 0.32, side, bumps) * share.z;
  rockBend = wrapBend;
}
// Forest seen from afar is its canopy, not its floor.
ground += mix(untiled(forestMap, top * 0.4, worldDx.xz * 0.4, worldDy.xz * 0.4).rgb, vec3(0.05, 0.075, 0.035) * (0.8 + 0.5 * texture2D(grassMap, top * 0.05).g), smoothstep(70.0, 260.0, far)) * share.w;
ground *= macro(top) * vShade;
diffuseColor.rgb *= ground * 1.3;`)
        .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
if (far < 60.0) {
  vec3 bend = vec3(texture2D(grassNormal, top * 0.5).x * 2.0 - 1.0, 0.0, texture2D(grassNormal, top * 0.5).y * 2.0 - 1.0) * share.x;
  bend += earthBend * share.y + rockBend * share.z * 1.3;
  vec2 needles = texture2D(forestNormal, top * 0.4).xy * 2.0 - 1.0;
  bend += vec3(needles.x, 0.0, needles.y) * share.w;
  vec3 world = normalize(normalize(vWorldNormal) + bend * 0.9);
  normal = normalize((viewMatrix * vec4(world, 0.0)).xyz);
}`);
    };
    m.customProgramCacheKey = () => (far ? "landscape-far" : "landscape");
    return m;
  }

  // How open to the sky a point is, from how high the ground rises round it: hollows, the foot of
  // a cut and the inside of a hairpin darker.
  shadeAt(x, z, h) {
    let blocked = 0;
    for (let a = 0; a < 8; a++) {
      const dx = Math.cos((a / 8) * Math.PI * 2);
      const dz = Math.sin((a / 8) * Math.PI * 2);
      let most = 0;
      for (const d of [1.2, 3, 7]) most = Math.max(most, (gridHeight(x + dx * d, z + dz * d) - h) / d);
      blocked += Math.max(0, Math.sin(Math.atan(most)));
    }
    return 1 - 0.55 * (blocked / 8);
  }

  // Each tile: the grid's points (every `step` cells), with normals from its neighbours, each
  // point's share of the textures smoothed over its neighbours, and its shading. Off the grid, the
  // mountain as it would be. Round its edges a skirt hangs 1.5 m down, so tiles of different
  // fineness never leave a crack between them.
  tile(lod, tx, tz) {
    const key = `${lod}:${tx}:${tz}`;
    if (this.tiles.has(key)) return this.tiles.get(key);
    const step = [1, 2, 4, 8][lod] * CELL;
    const n = Math.round(TILE / step);
    const x0 = tx * TILE;
    const z0 = tz * TILE;
    const count = (n + 1) * (n + 1) + 4 * (n + 1);
    const position = new Float32Array(count * 3);
    const normal = new Float32Array(count * 3);
    const splat = new Float32Array(count * 4);
    const shade = new Float32Array(count);
    for (let r = 0; r <= n; r++) {
      for (let c = 0; c <= n; c++) {
        const i = r * (n + 1) + c;
        const x = x0 + c * step;
        const z = z0 + r * step;
        const h = gridHeight(x, z) - (kindAt(x, z) === GROUND.ROAD ? 0.18 : 0);
        // The slope, averaged across as well as along (a Sobel filter, at least a metre each way): a
        // steep bank crossing the half-metre grid at a slant steps from cell to cell, and lit by a
        // low sun, slope worked out from neighbours alone would show every step as a rib.
        const d = Math.max(step, 1);
        const across = (fx, fz) => gridHeight(x + fx, z + fz);
        const sx = (across(d, -d) - across(-d, -d) + 2 * (across(d, 0) - across(-d, 0)) + across(d, d) - across(-d, d)) / (8 * d);
        const sz = (across(-d, d) - across(-d, -d) + 2 * (across(0, d) - across(0, -d)) + across(d, d) - across(d, -d)) / (8 * d);
        const nn = new THREE.Vector3(-sx, 1, -sz).normalize();
        position.set([x, h, z], i * 3);
        normal.set([nn.x, nn.y, nn.z], i * 3);
        const sum = [0, 0, 0, 0];
        const reach = Math.max(1, step / CELL / 2);
        const steep = Math.hypot(sx, sz);
        for (const [dx, dz] of [[0, 0], [-reach, 0], [reach, 0], [0, -reach], [0, reach]]) {
          const k = kindAt(x + dx * CELL, z + dz * CELL);
          let s = k >= 0 ? SPLAT[k] : wildSplat(x, z, steep);
          if (k === GROUND.LOOSE && steep > 1.1) s = steep > 1.6 ? [0, 0.25, 0.75, 0] : [0, 0.6, 0.4, 0];
          for (let j = 0; j < 4; j++) sum[j] += s[j];
        }
        splat.set(sum.map((v) => v / 5), i * 4);
        shade[i] = lod < 3 ? this.shadeAt(x, z, h) : 0.85;
      }
    }
    // Each cell split along whichever diagonal follows the ground better, so steep banks crossing
    // the grid at an angle don't come out sawtoothed.
    const index = [];
    const y = (i) => position[i * 3 + 1];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const i = r * (n + 1) + c;
        if (Math.abs(y(i) - y(i + n + 2)) <= Math.abs(y(i + 1) - y(i + n + 1))) index.push(i, i + n + 2, i + 1, i, i + n + 1, i + n + 2);
        else index.push(i, i + n + 1, i + 1, i + 1, i + n + 1, i + n + 2);
      }
    }
    const edges = [(k) => k, (k) => n * (n + 1) + k, (k) => k * (n + 1), (k) => k * (n + 1) + n];
    let next = (n + 1) * (n + 1);
    for (const edge of edges) {
      const first = next;
      for (let k = 0; k <= n; k++) {
        const top = edge(k);
        position.set([position[top * 3], position[top * 3 + 1] - 1.5, position[top * 3 + 2]], next * 3);
        normal.set(normal.subarray(top * 3, top * 3 + 3), next * 3);
        splat.set(splat.subarray(top * 4, top * 4 + 4), next * 4);
        shade[next] = shade[top];
        if (k) index.push(edge(k - 1), edge(k), first + k - 1, edge(k), first + k, first + k - 1, edge(k - 1), first + k - 1, edge(k), edge(k), first + k - 1, first + k);
        next++;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
    geo.setAttribute("splat", new THREE.BufferAttribute(splat, 4));
    geo.setAttribute("shade", new THREE.BufferAttribute(shade, 1));
    geo.setIndex(index);
    geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, this.ground);
    mesh.receiveShadow = true;
    mesh.visible = false;
    this.scene.add(mesh);
    this.tiles.set(key, mesh);
    return mesh;
  }

  // The coarse ground out to the horizon, every 8 m.
  buildFar() {
    const step = 8;
    const n = Math.round((2 * FAR) / step);
    const x0 = CENTRE_X - FAR;
    const z0 = CENTRE_Z - FAR;
    const position = new Float32Array((n + 1) * (n + 1) * 3);
    const splat = new Float32Array((n + 1) * (n + 1) * 4);
    const shade = new Float32Array((n + 1) * (n + 1)).fill(0.85);
    for (let r = 0; r <= n; r++) {
      for (let c = 0; c <= n; c++) {
        const x = x0 + c * step;
        const z = z0 + r * step;
        const i = r * (n + 1) + c;
        position.set([x, gridHeight(x, z) - 0.6, z], i * 3);
        const sx = (MOUNTAIN.natural(x + 4, z) - MOUNTAIN.natural(x - 4, z)) / 8;
        const sz = (MOUNTAIN.natural(x, z + 4) - MOUNTAIN.natural(x, z - 4)) / 8;
        splat.set(wildSplat(x, z, Math.hypot(sx, sz)), i * 4);
      }
    }
    const index = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const i = r * (n + 1) + c;
        index.push(i, i + n + 1, i + 1, i + 1, i + n + 1, i + n + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("splat", new THREE.BufferAttribute(splat, 4));
    geo.setAttribute("shade", new THREE.BufferAttribute(shade, 1));
    geo.setIndex(index);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, this.distant);
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  // The road: a strip along it every 25 cm, its surface exactly the physics's (ruts, potholes,
  // humps). It's the same earth as the banks it's cut through, packed and worn: darker in the ruts,
  // looser between, with stones; weeds creep in from the verges and, where few drive, up the hump
  // between the ruts. Past each edge it carries on a little over the verge, fading out raggedly.
  buildRoad() {
    const road = MOUNTAIN.road;
    const out = 0.3;
    const across = 17;
    const rows = (road.count - 1) * 2 + 1;
    const position = new Float32Array(rows * across * 3);
    const uv = new Float32Array(rows * across * 2);
    const colour = new Float32Array(rows * across * 4);
    const side = new Float32Array(rows * across);
    const shade = new Float32Array(rows * across);
    for (let row = 0; row < rows; row++) {
      const fi = row / 2;
      const i = Math.floor(fi);
      const f = fi - i;
      const j = Math.min(road.count - 1, i + 1);
      const cx = road.x[i] + (road.x[j] - road.x[i]) * f;
      const cz = road.z[i] + (road.z[j] - road.z[i]) * f;
      const hx = road.hx[i] + (road.hx[j] - road.hx[i]) * f;
      const hz = road.hz[i] + (road.hz[j] - road.hz[i]) * f;
      const half = road.half[i] + (road.half[j] - road.half[i]) * f;
      for (let a = 0; a < across; a++) {
        const t = (a / (across - 1)) * 2 - 1;
        const edge = a === 0 || a === across - 1;
        const lateral = edge ? Math.sign(t) * (half + out) : (t * half * (across - 1)) / (across - 3);
        const lat = Math.max(-half, Math.min(half, lateral));
        const x = cx - hz * lateral;
        const z = cz + hx * lateral;
        const k = row * across + a;
        const y = edge ? MOUNTAIN.height(x, z) + 0.03 : MOUNTAIN.roadSurface(fi, lat) + 0.012;
        position.set([x, y, z], k * 3);
        uv.set([lateral / 3 + 0.5, (fi * 0.5) / 3], k * 2);
        colour.set([1, 1, 1, edge ? 0 : 1], k * 4);
        side[k] = lateral / half;
        shade[k] = this.shadeAt(x, z, y);
      }
    }
    const index = [];
    for (let row = 0; row < rows - 1; row++) {
      for (let a = 0; a < across - 1; a++) {
        const k = row * across + a;
        index.push(k, k + 1, k + across, k + 1, k + across + 1, k + across);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    geo.setAttribute("color", new THREE.BufferAttribute(colour, 4));
    geo.setAttribute("side", new THREE.BufferAttribute(side, 1));
    geo.setAttribute("shade", new THREE.BufferAttribute(shade, 1));
    geo.setIndex(index);
    geo.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      map: this.tex.track.map,
      normalMap: this.tex.track.normal,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughness: 0.94,
      vertexColors: true,
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -4,
    });
    const t = this.tex;
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, {
        earthMap: { value: t.earth.map },
        grassMap: { value: t.grass.map },
        tileNoise: AIR.cloudMap,
      });
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>
attribute float side;
attribute float shade;
varying float vSide;
varying float vRoadShade;
varying vec3 vRoadWorld;`)
        .replace("#include <begin_vertex>", `#include <begin_vertex>
vSide = side;
vRoadShade = shade;
vRoadWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `#include <common>
uniform sampler2D earthMap;
uniform sampler2D grassMap;
${UNTILED_GLSL}
varying float vSide;
varying float vRoadShade;
varying vec3 vRoadWorld;`)
        .replace(
          "#include <map_fragment>",
          `vec2 top = vRoadWorld.xz;
worldDx = dFdx(vRoadWorld);
worldDy = dFdy(vRoadWorld);
vec3 worn = texture2D(map, vMapUv).rgb * 2.0;
vec3 earth = untiled(earthMap, top * 0.7, worldDx.xz * 0.7, worldDy.xz * 0.7).rgb;
vec3 grass = untiled(grassMap, top * 0.5, worldDx.xz * 0.5, worldDy.xz * 0.5).rgb;
float patchy = texture2D(tileNoise, top / 7.0).r - 0.5;
float along = texture2D(tileNoise, vec2(vMapUv.y * 3.0 / 160.0, 0.5)).r;
float verge = smoothstep(0.7, 1.05, abs(vSide) + patchy * 0.55);
float hump = (1.0 - smoothstep(0.1, 0.24, abs(vSide) + patchy * 0.2)) * smoothstep(0.52, 0.62, along + patchy * 0.25);
vec3 ground = mix(earth * worn * 1.06, grass, max(verge, hump) * 0.85);
ground *= macro(top) * vRoadShade;
diffuseColor.rgb *= ground * 1.3;
diffuseColor.a *= 1.0 - smoothstep(0.86, 1.12, abs(vSide) + patchy * 0.3);`,
        );
    };
    material.customProgramCacheKey = () => "road";
    const mesh = new THREE.Mesh(geo, material);
    mesh.receiveShadow = true;
    mesh.renderOrder = 1;
    this.scene.add(mesh);
    this.buildLogs();
  }

  // Fallen logs across the road and branches on it, where the physics has them: bark, and pale
  // cut ends on the logs; a couple of twigs off each branch.
  buildLogs() {
    const bark = new THREE.MeshStandardMaterial({ map: this.tex.bark.map, normalMap: this.tex.bark.normal, roughness: 0.95 });
    const end = new THREE.MeshStandardMaterial({ color: 0xc9a675, roughness: 0.85 });
    const sides = [];
    const ends = [];
    const placed = (geo, position, quaternion) => geo.applyMatrix4(new THREE.Matrix4().compose(position, quaternion, new THREE.Vector3(1, 1, 1)));
    for (const log of MOUNTAIN.logs) {
      const length = log.reach * 2;
      // Its axis along (ax, grade, az), its middle where the physics puts it.
      const along = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(log.ax, log.grade, log.az).normalize());
      const middle = new THREE.Vector3(log.x, log.base + 0.8 * log.r, log.z);
      const cylinder = new THREE.CylinderGeometry(log.r, log.r * 1.05, length, log.kind === "log" ? 14 : 6, 1, log.kind !== "log");
      if (log.kind === "log") {
        // The side, and the two cut ends apart.
        const side = cylinder.toNonIndexed();
        const groups = cylinder.groups;
        const pick = (g) => {
          const part = new THREE.BufferGeometry();
          for (const name of ["position", "normal", "uv"]) {
            const a = side.attributes[name];
            part.setAttribute(name, new THREE.BufferAttribute(a.array.slice(g.start * a.itemSize, (g.start + g.count) * a.itemSize), a.itemSize));
          }
          return part;
        };
        sides.push(placed(pick(groups[0]), middle, along));
        for (const g of groups.slice(1)) ends.push(placed(pick(g), middle, along));
      } else {
        sides.push(placed(cylinder.toNonIndexed(), middle, along));
        for (const t of [-0.3, 0.25]) {
          const twig = new THREE.CylinderGeometry(log.r * 0.35, log.r * 0.5, 0.35 + log.r * 4, 5, 1, true).toNonIndexed();
          const turn = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.9 * Math.sign(t), Math.atan2(log.ax, log.az), 0.6));
          sides.push(placed(twig, new THREE.Vector3(log.x + log.ax * t * length, middle.y + log.grade * t * length, log.z + log.az * t * length), turn));
        }
      }
    }
    const merge = (parts) => {
      const out = new THREE.BufferGeometry();
      for (const name of ["position", "normal", "uv"]) {
        const size = parts[0].attributes[name].itemSize;
        const all = new Float32Array(parts.reduce((n, p) => n + p.attributes[name].array.length, 0));
        let at = 0;
        for (const p of parts) {
          all.set(p.attributes[name].array, at);
          at += p.attributes[name].array.length;
        }
        out.setAttribute(name, new THREE.BufferAttribute(all, size));
      }
      return out;
    };
    for (const [parts, material] of [[sides, bark], [ends, end]]) {
      if (!parts.length) continue;
      const mesh = new THREE.Mesh(merge(parts), material);
      mesh.castShadow = mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
  }

  // Pines. Near: a trunk and whorls of drooping branches, each branch two cards of needled twigs
  // in a V, lit as if the crown were round. Far: a picture of the same pine, turned to face the
  // camera, from the side the camera's on (see bakeTrees). In blocks, the near or far kind shown by
  // distance; the ones round the road are the ones the physics knows, and more on the slopes beyond
  // are just to look at.
  buildTrees() {
    const trunkGeo = new THREE.CylinderGeometry(0.7, 1, 1, 7).translate(0, 0.5, 0);
    const cardGeo = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0);
    const branchGeo = (() => {
      const pos = [];
      const uvs = [];
      const nor = [];
      const quad = (a, b, c, d) => {
        // a, b at the trunk; c, d at the tip.
        for (const [p, u, v] of [[a, 0, 0], [b, 1, 0], [c, 0, 1], [b, 1, 0], [d, 1, 1], [c, 0, 1]]) {
          pos.push(...p);
          uvs.push(u, v);
          const n = new THREE.Vector3(p[0], p[1] - 0.5, p[2]).normalize();
          nor.push(n.x, n.y * 0.6 + 0.4, n.z);
        }
      };
      const layers = 8;
      for (let l = 0; l < layers; l++) {
        const t = l / (layers - 1);
        const y = 0.16 + t * 0.74;
        const reach = 0.38 * (1 - t) + 0.07;
        const droop = 0.07 + 0.07 * (1 - t);
        const branches = 8;
        for (let b = 0; b < branches; b++) {
          const a = (b / branches) * Math.PI * 2 + l * 2.4;
          const dx = Math.cos(a);
          const dz = Math.sin(a);
          const width = reach * 1.05;
          const tip = [dx * reach, y - droop, dz * reach];
          for (const tilt of [-0.7, 0.7]) {
            // The card's width across the branch, tilted up or down about it.
            const wx = -dz * Math.cos(tilt) * (width / 2);
            const wy = Math.sin(tilt) * (width / 2);
            const wz = dx * Math.cos(tilt) * (width / 2);
            quad([wx * 0.3, y + wy * 0.3, wz * 0.3], [-wx * 0.3, y - wy * 0.3, -wz * 0.3], [tip[0] + wx, tip[1] + wy, tip[2] + wz], [tip[0] - wx, tip[1] - wy, tip[2] - wz]);
          }
        }
      }
      // The leader at the top.
      for (const a of [0, Math.PI / 2]) {
        const dx = Math.cos(a) * 0.05;
        const dz = Math.sin(a) * 0.05;
        quad([dx, 0.82, dz], [-dx, 0.82, -dz], [dx, 1.0, dz], [-dx, 1.0, -dz]);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      return g;
    })();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4d3a2a, roughness: 1, map: this.tex.rock.map });
    const needleMat = foliage(new THREE.MeshStandardMaterial({ map: this.tex.twig, alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.9 }), "needles");
    this.pine = { trunkGeo, branchGeo, trunkMat, needleMat };
    this.pictures = {
      ambient: { value: null },
      sun: { value: null },
      detail: { value: DETAIL },
      ...AIR,
    };
    const views = VIEWS.toFixed(1);
    const cardMat = new THREE.ShaderMaterial({
      uniforms: this.pictures,
      vertexShader: `
#include <common>
varying vec2 vUv0;
varying vec2 vUv1;
varying float vBlend;
varying vec3 vTint;
varying vec3 vWorld;
attribute vec2 block;
uniform float detail;
void main() {
  vec3 base = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  // A pine in a block near enough to be drawn branch by branch isn't drawn as a picture: its
  // corners all go to one point, so there's nothing to draw.
  if (distance(cameraPosition.xz, block) < detail) {
    vWorld = base;
    gl_Position = projectionMatrix * viewMatrix * vec4(base, 1.0);
    return;
  }
  float wide = length(instanceMatrix[0].xyz);
  float tall = length(instanceMatrix[1].xyz);
  vec2 toCamera = normalize(cameraPosition.xz - base.xz);
  float f = mod(atan(toCamera.x, toCamera.y) / (2.0 * PI) * ${views} + ${views}, ${views});
  float k0 = floor(f);
  float k1 = mod(k0 + 1.0, ${views});
  vBlend = f - k0;
  float u = position.x + 0.5;
  vUv0 = vec2((k0 + u) / ${views}, position.y);
  vUv1 = vec2((k1 + u) / ${views}, position.y);
  vec3 right = vec3(toCamera.y, 0.0, -toCamera.x);
  vWorld = base + right * position.x * ${(VIEW_ASPECT * 1.04).toFixed(4)} * wide / ${BAKE_WIDE.toFixed(3)} + vec3(0.0, (position.y * 1.04 - 0.02) * tall, 0.0);
  vTint = vec3(1.0);
  #ifdef USE_INSTANCING_COLOR
    vTint = instanceColor;
  #endif
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}`,
      fragmentShader: `
#include <common>
uniform sampler2D ambient;
uniform sampler2D sun;
uniform vec3 sunColour;
uniform vec3 hazeColour;
uniform float hazeDensity;
uniform float hazeThin;
varying vec2 vUv0;
varying vec2 vUv1;
varying float vBlend;
varying vec3 vTint;
varying vec3 vWorld;
${CLOUDS_GLSL}
${SUNLIGHT_GLSL}
${HAZE_GLSL}
void main() {
  vec4 a = mix(texture2D(ambient, vUv0), texture2D(ambient, vUv1), vBlend);
  if (a.a < 0.5) discard;
  vec3 s = mix(texture2D(sun, vUv0), texture2D(sun, vUv1), vBlend).rgb;
  vec3 colour = (a.rgb + s * sunlightAt(vWorld)) / a.a * vTint;
  vec3 ray = vWorld - cameraPosition;
  float dist = length(ray);
  float mu = max(dot(ray / dist, sunTo), 0.0);
  vec3 tint = hazeColour + sunColour * (0.025 * pow(mu, 5.0) + 0.05 * pow(mu, 24.0));
  colour = mix(colour, tint, hazeOf(dist, cameraPosition.y, ray.y, hazeDensity, hazeThin));
  gl_FragColor = vec4(colour, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,
    });
    const all = MOUNTAIN.trees.slice();
    let seed = 99;
    const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
    for (let i = 0; i < 11000; i++) {
      const x = CENTRE_X + (rand() * 2 - 1) * FAR * 0.85;
      const z = CENTRE_Z + (rand() * 2 - 1) * FAR * 0.85;
      if (x > X0 - 4 && x < GRID_X1 + 4 && z > Z0 - 4 && z < GRID_Z1 + 4) continue;
      const sx = (MOUNTAIN.natural(x + 3, z) - MOUNTAIN.natural(x - 3, z)) / 6;
      const sz = (MOUNTAIN.natural(x, z + 3) - MOUNTAIN.natural(x, z - 3)) / 6;
      if (wildSplat(x, z, Math.hypot(sx, sz)) !== SPLAT[GROUND.FOREST] && rand() > 0.15) continue;
      const tall = 7 + rand() * 13;
      all.push({ x, z, r: 0.12 + tall * 0.016, height: tall, base: MOUNTAIN.natural(x, z), shade: rand() });
    }
    const buckets = new Map();
    for (const t of all) {
      const key = `${Math.floor(t.x / BUCKET)}:${Math.floor(t.z / BUCKET)}`;
      if (!buckets.has(key)) buckets.set(key, { x: (Math.floor(t.x / BUCKET) + 0.5) * BUCKET, z: (Math.floor(t.z / BUCKET) + 0.5) * BUCKET, list: [] });
      buckets.get(key).list.push(t);
    }
    this.treeBlocks = [];
    const cards = new THREE.InstancedMesh(cardGeo, cardMat, all.length);
    const blockOf = new Float32Array(all.length * 2);
    let card = 0;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const colour = new THREE.Color();
    const up = new THREE.Vector3(0, 1, 0);
    for (const block of buckets.values()) {
      const { list } = block;
      const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, list.length);
      const near = new THREE.InstancedMesh(branchGeo, needleMat, list.length);
      list.forEach((t, i) => {
        q.setFromAxisAngle(up, t.shade * 6.28);
        m.compose(new THREE.Vector3(t.x, t.base - 0.3, t.z), q, new THREE.Vector3(t.r, t.height * 0.75, t.r));
        trunks.setMatrixAt(i, m);
        const wide = t.height * (0.27 + t.shade * 0.08);
        m.compose(new THREE.Vector3(t.x, t.base, t.z), q, new THREE.Vector3(wide, t.height, wide));
        cards.setMatrixAt(card, m);
        near.setMatrixAt(i, m);
        colour.setHSL(0.25 + t.shade * 0.06, 0.25, 0.75 + t.shade * 0.25);
        cards.setColorAt(card, colour);
        near.setColorAt(i, colour);
        blockOf.set([block.x, block.z], card * 2);
        card++;
      });
      for (const mesh of [trunks, near]) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
      for (const mesh of [trunks, near]) {
        mesh.computeBoundingSphere();
        this.scene.add(mesh);
      }
      near.visible = trunks.visible = false;
      this.treeBlocks.push({ x: block.x, z: block.z, near, trunks });
    }
    cardGeo.setAttribute("block", new THREE.InstancedBufferAttribute(blockOf, 2));
    cards.frustumCulled = false; // they're everywhere; and too cheap to be worth culling
    this.scene.add(cards);
    this.cards = cards;
  }

  // Boulders: lumpy stones, each the shape the physics gives it, set into the ground.
  buildBoulders() {
    const geo = new THREE.IcosahedronGeometry(1, 3);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const lump = 1 + 0.06 * Math.sin(v.x * 5.1 + v.z * 3.3) * Math.cos(v.y * 4.7 - v.x * 2.1) + 0.03 * Math.sin(v.x * 13 + v.y * 11);
      pos.setXYZ(i, v.x * lump, v.y < -0.3 ? -0.3 - (v.y + 0.3) * 0.2 : v.y * lump * (v.y > 0.6 ? 0.92 : 1), v.z * lump);
    }
    geo.computeVertexNormals();
    const stone = new THREE.MeshStandardMaterial({ map: this.tex.rock.map, normalMap: this.tex.rock.normal, roughness: 0.88, color: 0xc4beb4 });
    const buckets = new Map();
    for (const b of MOUNTAIN.boulders) {
      const key = `${Math.floor(b.x / BUCKET)}:${Math.floor(b.z / BUCKET)}`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(b);
    }
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    this.boulderBlocks = [];
    for (const [key, list] of buckets) {
      const [bx, bz] = key.split(":").map(Number);
      const mesh = new THREE.InstancedMesh(geo, stone, list.length);
      this.boulderBlocks.push({ mesh, x: (bx + 0.5) * BUCKET, z: (bz + 0.5) * BUCKET });
      list.forEach((b, i) => {
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -b.turn);
        m.compose(new THREE.Vector3(b.x, b.base, b.z), q, new THREE.Vector3(b.rx, b.h, b.rz));
        mesh.setMatrixAt(i, m);
      });
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.computeBoundingSphere();
      this.scene.add(mesh);
    }
  }

  // The road's sides, thick with growth: bushes, ferns, grass in seed with flowers, and pebbles,
  // densest at the edge and thinning away from it, up the foot of a cut and down the bank. Only to
  // look at: the rocks a tire can hit are the physics's boulders, drawn with the others. Each kind
  // is one instanced mesh per block, and only the blocks near the camera are drawn.
  buildVerges() {
    // Cards crossing at the middle, from the ground up, their normals leaning out from the middle
    // and up, so the plant is lit as a mound rather than as flat cards.
    const crossed = (count, tilt = 0) => {
      const pos = [];
      const uvs = [];
      const nor = [];
      for (let c = 0; c < count; c++) {
        const a = (c / count) * Math.PI;
        const dx = Math.cos(a) * 0.5;
        const dz = Math.sin(a) * 0.5;
        const lean = c % 2 ? tilt : -tilt;
        const corners = [
          [-dx, 0, -dz, 0, 0],
          [dx, 0, dz, 1, 0],
          [-dx - dz * lean, 1, -dz + dx * lean, 0, 1],
          [dx - dz * lean, 1, dz + dx * lean, 1, 1],
        ];
        for (const k of [0, 1, 2, 1, 3, 2]) {
          const [x, y, z, u, v] = corners[k];
          pos.push(x, y, z);
          uvs.push(u, v);
          const n = new THREE.Vector3(x, 0.45 + y * 0.6, z).normalize();
          nor.push(n.x, n.y, n.z);
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      return g;
    };
    // A fern: fronds springing from the middle, arching out and up all round.
    const fronds = (count) => {
      const pos = [];
      const uvs = [];
      const nor = [];
      for (let c = 0; c < count; c++) {
        const a = (c / count) * Math.PI * 2 + (c % 2) * 0.4;
        const d = [Math.cos(a), Math.sin(a)];
        const p = [-d[1], d[0]];
        const reach = 0.7 + (c % 3) * 0.12;
        const corners = [
          [-p[0] * 0.08, 0, -p[1] * 0.08, 0, 0],
          [p[0] * 0.08, 0, p[1] * 0.08, 1, 0],
          [d[0] * reach - p[0] * 0.28, 0.55, d[1] * reach - p[1] * 0.28, 0, 1],
          [d[0] * reach + p[0] * 0.28, 0.55, d[1] * reach + p[1] * 0.28, 1, 1],
        ];
        for (const k of [0, 1, 2, 1, 3, 2]) {
          const [x, y, z, u, v] = corners[k];
          pos.push(x, y, z);
          uvs.push(u, v);
          const n = new THREE.Vector3(d[0] * 0.5, 1, d[1] * 0.5).normalize();
          nor.push(n.x, n.y, n.z);
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      return g;
    };
    const pebbleGeo = new THREE.IcosahedronGeometry(1, 1);
    {
      const p = pebbleGeo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(p, i);
        const lump = 1 + 0.12 * Math.sin(v.x * 4.1 + v.z * 2.3) * Math.cos(v.y * 3.7);
        p.setXYZ(i, v.x * lump, Math.max(-0.25, v.y) * lump, v.z * lump);
      }
      pebbleGeo.computeVertexNormals();
    }
    const wind = this.wind;
    const plant = (map, key, bend) => {
      const m = new THREE.MeshStandardMaterial({ map, alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.9 });
      m.onBeforeCompile = (shader) => {
        shader.uniforms.wind = wind;
        shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nuniform float wind;").replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
float sway = sin(wind * 1.3 + instanceMatrix[3].x * 0.6 + instanceMatrix[3].z * 0.4) + 0.4 * sin(wind * 2.9 + instanceMatrix[3].z * 1.7);
transformed.x += sway * ${bend.toFixed(3)} * uv.y * uv.y;
transformed.z += sway * ${(bend * 0.6).toFixed(3)} * uv.y * uv.y;`,
        );
        shader.fragmentShader = shader.fragmentShader.replace("#include <normal_fragment_begin>", FOLIAGE);
      };
      m.customProgramCacheKey = () => key;
      return m;
    };
    const kinds = [
      { name: "bush", geo: crossed(4, 0.15), material: plant(this.tex.shrub, "verge-bush", 0.03), shadow: true },
      { name: "fern", geo: fronds(7), material: plant(this.tex.fern, "verge-fern", 0.06), shadow: false },
      { name: "flowers", geo: crossed(3, 0.1), material: plant(this.tex.flowers, "verge-flowers", 0.08), shadow: false },
      { name: "pebble", geo: pebbleGeo, material: new THREE.MeshStandardMaterial({ map: this.tex.rock.map, normalMap: this.tex.rock.normal, roughness: 0.9, color: 0xb8b1a6 }), shadow: false },
    ];
    const road = MOUNTAIN.road;
    let seed = 31;
    const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
    const blocks = new Map();
    const put = (kind, x, z, matrix, colour) => {
      const key = `${Math.floor(x / VERGE.block)}:${Math.floor(z / VERGE.block)}`;
      if (!blocks.has(key)) blocks.set(key, { x: (Math.floor(x / VERGE.block) + 0.5) * VERGE.block, z: (Math.floor(z / VERGE.block) + 0.5) * VERGE.block, lists: kinds.map(() => []) });
      blocks.get(key).lists[kind].push({ matrix: matrix.clone(), colour: colour.clone() });
    };
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const colour = new THREE.Color();
    for (let i = 0; i < road.count; i += 1 + Math.floor(rand() * 2)) {
      for (const side of [-1, 1]) {
        for (let n = 0; n < 5; n++) {
          // Mostly right at the edge, some further off, to seven metres.
          const lateral = side * (road.half[i] + 0.12 + Math.pow(rand(), 1.9) * 7);
          const along = (rand() - 0.5) * 0.5;
          const x = road.x[i] - road.hz[i] * lateral + road.hx[i] * along;
          const z = road.z[i] + road.hx[i] * lateral + road.hz[i] * along;
          if (kindAt(x, z) === GROUND.ROAD || MOUNTAIN.onRoad(x, z)) continue;
          const y = groundAt(x, z);
          const steep = Math.hypot(groundAt(x + 0.5, z) - groundAt(x - 0.5, z), groundAt(x, z + 0.5) - groundAt(x, z - 0.5));
          const roll = rand();
          // On the face of a cut only ferns and grass cling, and not many.
          if (steep > 1.4 && (roll < 0.28 || rand() < 0.85)) continue;
          q.setFromAxisAngle(up, rand() * Math.PI * 2);
          if (roll < 0.28) {
            const wide = 0.7 + rand() * 0.9;
            m.compose(new THREE.Vector3(x, y - 0.06, z), q, new THREE.Vector3(wide, wide * (0.7 + rand() * 0.35), wide));
            colour.setHSL(0.24 + rand() * 0.07, 0.25 + rand() * 0.2, 0.72 + rand() * 0.28);
            put(0, x, z, m, colour);
          } else if (roll < 0.52) {
            const size = 0.4 + rand() * 0.45;
            m.compose(new THREE.Vector3(x, y - 0.03, z), q, new THREE.Vector3(size, size, size));
            colour.setHSL(0.22 + rand() * 0.06, 0.3, 0.75 + rand() * 0.25);
            put(1, x, z, m, colour);
          } else if (roll < 0.86) {
            const size = 0.4 + rand() * 0.45;
            m.compose(new THREE.Vector3(x, y - 0.03, z), q, new THREE.Vector3(size * 1.2, size, size * 1.2));
            colour.setHSL(0.15 + rand() * 0.1, 0.25, 0.8 + rand() * 0.2);
            put(2, x, z, m, colour);
          } else {
            // A scatter of pebbles.
            for (let p = 0; p < 3 + rand() * 5; p++) {
              const px = x + (rand() - 0.5) * 1.2;
              const pz = z + (rand() - 0.5) * 1.2;
              if (kindAt(px, pz) === GROUND.ROAD) continue;
              const r = 0.03 + Math.pow(rand(), 2) * 0.1;
              q.setFromAxisAngle(up, rand() * Math.PI * 2);
              m.compose(new THREE.Vector3(px, groundAt(px, pz) - r * 0.25, pz), q, new THREE.Vector3(r * (1 + rand() * 0.5), r * (0.45 + rand() * 0.3), r));
              colour.setScalar(0.75 + rand() * 0.35);
              put(3, px, pz, m, colour);
            }
          }
        }
      }
    }
    this.vergeBlocks = [];
    for (const block of blocks.values()) {
      const meshes = [];
      block.lists.forEach((list, k) => {
        if (!list.length) return;
        const kind = kinds[k];
        const mesh = new THREE.InstancedMesh(kind.geo, kind.material, list.length);
        list.forEach((p, i) => {
          mesh.setMatrixAt(i, p.matrix);
          mesh.setColorAt(i, p.colour);
        });
        mesh.castShadow = kind.shadow;
        mesh.receiveShadow = true;
        mesh.computeBoundingSphere();
        mesh.visible = false;
        this.scene.add(mesh);
        meshes.push(mesh);
      });
      this.vergeBlocks.push({ x: block.x, z: block.z, meshes });
    }
  }

  // Tufts of grass round the camera, on grass only: a fixed scatter laid over the ground, the
  // part of it round the camera placed (so tufts stay put as it moves), stirring in the wind.
  buildGrass() {
    const blade = new THREE.PlaneGeometry(0.6, 0.42).translate(0, 0.21, 0);
    const crossed = new THREE.BufferGeometry();
    const parts = [blade, blade.clone().rotateY(Math.PI / 2), blade.clone().rotateY(Math.PI / 4)];
    const pos = [];
    const uvs = [];
    for (const p of parts) {
      const g = p.toNonIndexed();
      pos.push(...g.attributes.position.array);
      uvs.push(...g.attributes.uv.array);
    }
    crossed.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    crossed.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    crossed.setAttribute("normal", new THREE.Float32BufferAttribute(pos.map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
    const material = new THREE.MeshStandardMaterial({ map: this.tex.tuft, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 1, color: 0x969c84 });
    const wind = { value: 0 };
    material.onBeforeCompile = (shader) => {
      shader.uniforms.wind = wind;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float wind;")
        .replace("#include <begin_vertex>", `#include <begin_vertex>
float sway = sin(wind * 1.7 + instanceMatrix[3].x * 0.7 + instanceMatrix[3].z * 0.5) + 0.5 * sin(wind * 3.1 + instanceMatrix[3].x * 1.9);
transformed.x += sway * 0.05 * uv.y;
transformed.z += sway * 0.03 * uv.y;`);
      shader.fragmentShader = shader.fragmentShader.replace("#include <normal_fragment_begin>", FOLIAGE);
    };
    this.wind = wind;
    this.grass = new THREE.InstancedMesh(crossed, material, GRASS.count);
    this.grass.receiveShadow = true;
    this.grass.frustumCulled = false;
    this.scene.add(this.grass);
    let seed = 5;
    const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
    this.scatter = Array.from({ length: GRASS.count }, () => ({ x: rand() * GRASS.size, z: rand() * GRASS.size, s: 0.7 + rand() * 0.7, a: rand() * 6.28, keep: rand() }));
    this.grassAt = null;
  }

  placeGrass(camera) {
    const S = GRASS.size;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const zero = new THREE.Matrix4().makeScale(0, 0, 0);
    this.scatter.forEach((p, i) => {
      const x = camera.x - S / 2 + ((((p.x - (camera.x - S / 2)) % S) + S) % S);
      const z = camera.z - S / 2 + ((((p.z - (camera.z - S / 2)) % S) + S) % S);
      const k = kindAt(x, z);
      const ok = (k === GROUND.GRASS && p.keep < 0.7) || (k === GROUND.FOREST && p.keep < 0.12) || (k < 0 && p.keep < 0.4);
      if (!ok) {
        this.grass.setMatrixAt(i, zero);
        return;
      }
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), p.a);
      m.compose(new THREE.Vector3(x, gridHeight(x, z) - 0.03, z), q, new THREE.Vector3(p.s, p.s, p.s));
      this.grass.setMatrixAt(i, m);
    });
    this.grass.instanceMatrix.needsUpdate = true;
  }

  // The far pines' pictures: the near pine, taken from all round at its own height, in the time of
  // day's light, twice: once by the sky's light alone, once by the sun's alone, so the sun's share
  // can still be shaded by the mountain and the clouds where each pine stands.
  bakeTrees(renderer, { hemi, sun, environment }) {
    const width = VIEW_W * VIEWS;
    if (!this.baked) {
      this.baked = [0, 1].map(
        () =>
          new THREE.WebGLRenderTarget(width, VIEW_H, {
            type: THREE.HalfFloatType,
            minFilter: THREE.LinearMipmapLinearFilter,
            magFilter: THREE.LinearFilter,
            generateMipmaps: true,
          }),
      );
      this.pictures.ambient.value = this.baked[0].texture;
      this.pictures.sun.value = this.baked[1].texture;
    }
    const { trunkGeo, branchGeo, trunkMat, needleMat } = this.pine;
    const scene = new THREE.Scene();
    const pine = new THREE.Mesh(branchGeo, foliage(new THREE.MeshStandardMaterial({ map: needleMat.map, alphaTest: needleMat.alphaTest, side: THREE.DoubleSide, roughness: needleMat.roughness }), "needles-bake"));
    pine.scale.set(BAKE_WIDE, 1, BAKE_WIDE);
    const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({ color: trunkMat.color, roughness: 1, map: trunkMat.map }));
    trunk.scale.set(0.025, 0.75, 0.025);
    trunk.position.y = -0.02;
    for (const m of [pine, trunk]) m.castShadow = m.receiveShadow = true;
    const sky = new THREE.HemisphereLight(hemi.color, hemi.groundColor, hemi.intensity);
    const light = new THREE.DirectionalLight(sun.color, sun.intensity);
    light.position.copy(AIR.sunTo.value).multiplyScalar(3).add(new THREE.Vector3(0, 0.5, 0));
    light.target.position.set(0, 0.5, 0);
    light.castShadow = true;
    Object.assign(light.shadow.camera, { left: -0.7, right: 0.7, top: 0.7, bottom: -0.7, near: 0.5, far: 6 });
    light.shadow.mapSize.set(512, 512);
    light.shadow.bias = -0.002;
    scene.add(pine, trunk, sky, light, light.target);
    const half = (VIEW_ASPECT * 1.04) / 2;
    const camera = new THREE.OrthographicCamera(-half, half, 0.52, -0.52, 0.1, 10);
    const clear = renderer.getClearColor(new THREE.Color());
    const clearAlpha = renderer.getClearAlpha();
    renderer.setClearColor(0x000000, 0);
    this.baked.forEach((target, pass) => {
      sky.visible = pass === 0;
      scene.environment = pass === 0 ? environment : null;
      light.intensity = pass === 1 ? sun.intensity : 0;
      renderer.setRenderTarget(target);
      target.scissorTest = false;
      renderer.clear();
      target.scissorTest = true;
      for (let k = 0; k < VIEWS; k++) {
        const a = (k / VIEWS) * Math.PI * 2;
        camera.position.set(Math.sin(a) * 5, 0.5, Math.cos(a) * 5);
        camera.lookAt(0, 0.5, 0);
        target.viewport.set(k * VIEW_W, 0, VIEW_W, VIEW_H);
        target.scissor.set(k * VIEW_W, 0, VIEW_W, VIEW_H);
        renderer.render(scene, camera);
      }
      target.scissorTest = false;
    });
    renderer.setRenderTarget(null);
    renderer.setClearColor(clear, clearAlpha);
    light.shadow.dispose();
    for (const m of [pine.material, trunk.material]) m.dispose();
  }

  // Each frame: the tiles round the camera, each as fine as its distance needs; the pines near or
  // far; the grass round it; the wind.
  update(camera, dt = 1 / 60) {
    this.time += dt;
    this.wind.value = this.time;
    for (const u of this.uniforms) u.viewFrom.value.copy(camera);
    const shown = new Set();
    const reach = Math.ceil(NEAR / TILE);
    const cx = Math.floor(camera.x / TILE);
    const cz = Math.floor(camera.z / TILE);
    for (let tz = cz - reach; tz <= cz + reach; tz++) {
      for (let tx = cx - reach; tx <= cx + reach; tx++) {
        const d = Math.hypot((tx + 0.5) * TILE - camera.x, (tz + 0.5) * TILE - camera.z);
        if (d > NEAR) continue;
        const onGrid = tx * TILE >= X0 && (tx + 1) * TILE <= GRID_X1 && tz * TILE >= Z0 && (tz + 1) * TILE <= GRID_Z1;
        const lod = !onGrid ? 3 : d < 60 ? 0 : d < 120 ? 1 : 2;
        const mesh = this.tile(lod, tx, tz);
        mesh.visible = true;
        shown.add(mesh);
      }
    }
    for (const mesh of this.shown) if (!shown.has(mesh)) mesh.visible = false;
    this.shown = shown;
    for (const b of this.treeBlocks) {
      const near = Math.hypot(b.x - camera.x, b.z - camera.z) < DETAIL;
      b.near.visible = near;
      b.trunks.visible = near;
    }
    // The road's plants and pebbles near the camera.
    for (const b of this.vergeBlocks) {
      const seen = Math.hypot(b.x - camera.x, b.z - camera.z) < VERGE.seen;
      for (const mesh of b.meshes) mesh.visible = seen;
    }
    // Boulders far off are too small to see.
    for (const b of this.boulderBlocks) b.mesh.visible = Math.hypot(b.x - camera.x, b.z - camera.z) < BOULDERS_SEEN;
    if (!this.grassAt || Math.hypot(camera.x - this.grassAt.x, camera.z - this.grassAt.z) > 2) {
      this.grassAt = camera.clone();
      this.placeGrass(camera);
    }
  }
}

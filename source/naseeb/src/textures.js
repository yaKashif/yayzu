// Textures for the mountain, made when the game starts rather than downloaded: each a colour map
// and, from the same surface's heights, a normal map so light catches its bumps. All tile without
// a seam. Grass, bare earth, rock, the forest floor, the dirt road, pine needles on a twig, a
// tuft of grass, and the plants along the road: a bush, a fern, grass in seed with flowers.
import * as THREE from "three";

// A pseudo-random sequence, the same every time.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Value noise that wraps every `period` units, so textures made from it tile.
function tilingNoise(seed) {
  const perm = new Uint8Array(512);
  const rand = rng(seed);
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];
  const value = new Float32Array(256);
  for (let i = 0; i < 256; i++) value[i] = rand();
  const at = (x, y, period) => value[perm[(perm[((x % period) + period) % period] + (((y % period) + period) % period)) & 255]];
  return (x, y, period) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const a = at(ix, iy, period);
    const b = at(ix + 1, iy, period);
    const c = at(ix, iy + 1, period);
    const d = at(ix + 1, iy + 1, period);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  };
}

// A surface: its size in pixels, a height at each pixel (0 to 1), and a colour at each.
class Surface {
  constructor(size, seed) {
    this.size = size;
    this.height = new Float32Array(size * size);
    this.rgb = new Float32Array(size * size * 3);
    this.rand = rng(seed);
    this.noise = tilingNoise(seed);
  }
  // Fractal noise over the tile, `cells` features across at the coarsest, wrapping.
  fbm(x, y, cells, octaves = 5) {
    let s = 0;
    let a = 0.5;
    let f = cells;
    let total = 0;
    for (let o = 0; o < octaves; o++) {
      s += a * this.noise((x / this.size) * f, (y / this.size) * f, f);
      total += a;
      a *= 0.5;
      f *= 2;
    }
    return s / total;
  }
  fill(fn) {
    const n = this.size;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const i = y * n + x;
        const [r, g, b, h] = fn(x, y);
        this.rgb[i * 3] = r;
        this.rgb[i * 3 + 1] = g;
        this.rgb[i * 3 + 2] = b;
        this.height[i] = h;
      }
    }
  }
  // Something round dabbed on, wrapping round the edges: colour blended in by `alpha` at its
  // middle, fading out, and raised by `raise`.
  dab(cx, cy, rx, ry, angle, colour, alpha, raise) {
    const n = this.size;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const reach = Math.ceil(Math.max(rx, ry)) + 1;
    for (let dy = -reach; dy <= reach; dy++) {
      for (let dx = -reach; dx <= reach; dx++) {
        const u = (dx * c + dy * s) / rx;
        const v = (-dx * s + dy * c) / ry;
        const q = u * u + v * v;
        if (q >= 1) continue;
        const x = (((Math.round(cx) + dx) % n) + n) % n;
        const y = (((Math.round(cy) + dy) % n) + n) % n;
        const i = y * n + x;
        const w = alpha * (1 - q * q);
        this.rgb[i * 3] += (colour[0] - this.rgb[i * 3]) * w;
        this.rgb[i * 3 + 1] += (colour[1] - this.rgb[i * 3 + 1]) * w;
        this.rgb[i * 3 + 2] += (colour[2] - this.rgb[i * 3 + 2]) * w;
        this.height[i] = Math.max(this.height[i], this.height[i] * (1 - w) + raise * Math.sqrt(1 - q));
      }
    }
  }
  // A thin stroke from (x, y) heading `angle` for `length`, `width` wide.
  stroke(x, y, angle, length, width, colour, alpha, raise) {
    const steps = Math.ceil(length);
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      this.dab(x + Math.cos(angle) * length * t, y + Math.sin(angle) * length * t, width, width, 0, colour, alpha * (1 - t * 0.5), raise * (1 - t * 0.4));
    }
  }
  // The colour map and the normal map, as textures.
  textures(strength, maxAniso) {
    const n = this.size;
    const colour = document.createElement("canvas");
    colour.width = colour.height = n;
    const cg = colour.getContext("2d");
    const ci = cg.createImageData(n, n);
    const normal = document.createElement("canvas");
    normal.width = normal.height = n;
    const ng = normal.getContext("2d");
    const ni = ng.createImageData(n, n);
    const h = this.height;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const i = y * n + x;
        ci.data[i * 4] = Math.max(0, Math.min(255, this.rgb[i * 3] * 255));
        ci.data[i * 4 + 1] = Math.max(0, Math.min(255, this.rgb[i * 3 + 1] * 255));
        ci.data[i * 4 + 2] = Math.max(0, Math.min(255, this.rgb[i * 3 + 2] * 255));
        ci.data[i * 4 + 3] = 255;
        const l = h[y * n + ((x - 1 + n) % n)];
        const r = h[y * n + ((x + 1) % n)];
        const u = h[((y - 1 + n) % n) * n + x];
        const d = h[((y + 1) % n) * n + x];
        const nx = (l - r) * strength;
        const ny = (u - d) * strength;
        const len = Math.hypot(nx, ny, 1);
        ni.data[i * 4] = (nx / len) * 127.5 + 127.5;
        ni.data[i * 4 + 1] = (-ny / len) * 127.5 + 127.5;
        ni.data[i * 4 + 2] = (1 / len) * 127.5 + 127.5;
        ni.data[i * 4 + 3] = 255;
      }
    }
    cg.putImageData(ci, 0, 0);
    ng.putImageData(ni, 0, 0);
    const make = (canvas, srgb) => {
      const t = new THREE.CanvasTexture(canvas);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = maxAniso;
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    return { map: make(colour, true), normal: make(normal, false), canvas: colour };
  }
}

const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const hex = (s) => [parseInt(s.slice(1, 3), 16) / 255, parseInt(s.slice(3, 5), 16) / 255, parseInt(s.slice(5, 7), 16) / 255];

// Mountain grass, two metres square: a mottled sward of blades, greener and yellower in patches,
// clover-dark in the gaps.
function grass(size, maxAniso) {
  const s = new Surface(size, 11);
  const deep = hex("#33441f");
  const mid = hex("#58693a");
  const dry = hex("#8e8752");
  s.fill((x, y) => {
    const patch = s.fbm(x, y, 4);
    const fine = s.fbm(x, y, 32, 3);
    const c = mix3(mix3(deep, mid, fine), dry, Math.max(0, patch - 0.55) * 1.6);
    return [...c, fine * 0.4];
  });
  const blades = ["#5f7a3a", "#6f8a44", "#46602c", "#8a9a58", "#a09a62", "#3d5426"].map(hex);
  for (let i = 0; i < size * size * 0.035; i++) {
    const x = s.rand() * size;
    const y = s.rand() * size;
    const c = blades[(s.rand() * blades.length) | 0];
    s.stroke(x, y, s.rand() * Math.PI * 2, 3 + s.rand() * 7, 0.7, c, 0.75, 0.6 + s.rand() * 0.4);
  }
  return s.textures(2.5, maxAniso);
}

// Bare earth: brown, with grit and pebbles, a little stony.
function earth(size, maxAniso) {
  const s = new Surface(size, 23);
  const dark = hex("#4b3e31");
  const light = hex("#8a7a67");
  s.fill((x, y) => {
    const n = s.fbm(x, y, 6);
    const grit = s.fbm(x, y, 64, 2);
    const c = mix3(dark, light, n * 0.8 + grit * 0.25);
    return [...c, n * 0.5 + grit * 0.2];
  });
  const stones = ["#7f766a", "#6a6156", "#8f8576", "#5f574d", "#776a5b"].map(hex);
  for (let i = 0; i < size * size * 0.0035; i++) {
    const r = 0.8 + Math.pow(s.rand(), 3) * 4;
    s.dab(s.rand() * size, s.rand() * size, r * (0.8 + s.rand() * 0.6), r, s.rand() * 3, stones[(s.rand() * stones.length) | 0], 0.55, 0.5 + r * 0.04);
  }
  return s.textures(3, maxAniso);
}

// Rock: grey, a little warm, in bands, cracked, with lichen.
function rock(size, maxAniso) {
  const s = new Surface(size, 37);
  const dark = hex("#4c4a47");
  const light = hex("#9b968c");
  const warm = hex("#8a7a66");
  s.fill((x, y) => {
    const band = Math.sin((y / size) * Math.PI * 2 * 5 + s.fbm(x, y, 4) * 6) * 0.5 + 0.5;
    const n = s.fbm(x, y, 8);
    const c = mix3(mix3(dark, light, n), warm, band * 0.35);
    // Cracks: where noise crosses a value, a thin dark line.
    const crack = Math.max(0, 1 - Math.abs(s.fbm(x + 300, y + 100, 9, 4) - 0.5) / 0.004) * (0.4 + 0.6 * s.fbm(x + 50, y + 70, 3, 2));
    const fine = s.fbm(x, y, 48, 2);
    return [c[0] * (1 - crack * 0.22) * (0.9 + fine * 0.2), c[1] * (1 - crack * 0.22) * (0.9 + fine * 0.2), c[2] * (1 - crack * 0.22) * (0.9 + fine * 0.2), n * 0.6 + band * 0.25 + fine * 0.15 - crack * 0.15];
  });
  const lichen = ["#9a9a52", "#7f8a4a", "#c2b878", "#6d6f63"].map(hex);
  for (let i = 0; i < size * size * 0.0005; i++) {
    const r = 1.5 + s.rand() * 5;
    s.dab(s.rand() * size, s.rand() * size, r, r * (0.6 + s.rand() * 0.5), s.rand() * 3, lichen[(s.rand() * lichen.length) | 0], 0.3, 0);
  }
  return s.textures(4, maxAniso);
}

// The forest floor: pine needles, browns and rusts, with moss between and the odd cone.
function forest(size, maxAniso) {
  const s = new Surface(size, 41);
  const base = hex("#3a2c1d");
  const moss = hex("#3f5426");
  s.fill((x, y) => {
    const m = s.fbm(x, y, 5);
    const c = mix3(base, moss, Math.max(0, m - 0.45) * 2);
    return [...c, m * 0.3];
  });
  const needles = ["#7a5531", "#8f6a3e", "#5e4126", "#a37a48", "#6b6a3a"].map(hex);
  for (let i = 0; i < size * size * 0.03; i++) {
    s.stroke(s.rand() * size, s.rand() * size, s.rand() * Math.PI * 2, 4 + s.rand() * 8, 0.55, needles[(s.rand() * needles.length) | 0], 0.85, 0.5);
  }
  for (let i = 0; i < size * size * 0.0002; i++) {
    s.dab(s.rand() * size, s.rand() * size, 4, 6, s.rand() * 3, hex("#5a3a20"), 0.95, 1);
  }
  return s.textures(2.5, maxAniso);
}

// The road, 3 m across and 3 m along, in shades about a middle grey: packed dirt, two ruts worn
// smooth and darker where the wheels run, with tread marks; between and beside them a hump of
// loose stuff and stones. The road's shader multiplies the earth by it (twice it, so grey is the
// earth as it is). The road's middle is u = 0.5.
function track(size, maxAniso) {
  const s = new Surface(size, 53);
  const n = s.size;
  const rutAt = [0.5 - 0.72 / 3, 0.5 + 0.72 / 3];
  const packed = [0.5, 0.5, 0.5];
  const dark = [0.37, 0.365, 0.36];
  const loose = [0.56, 0.55, 0.54];
  s.fill((x, y) => {
    const u = x / n;
    const grain = s.fbm(x, y, 16, 3);
    const big = s.fbm(x, y, 3);
    let rut = 0;
    for (const r of rutAt) rut = Math.max(rut, Math.max(0, 1 - Math.abs(u - r) / 0.075));
    rut = rut * rut * (3 - 2 * rut);
    let c = mix3(packed, loose, Math.max(0, grain - 0.4) * 1.2 + (1 - rut) * 0.25);
    c = mix3(c, dark, rut * 0.55 * (0.7 + big * 0.6));
    // Tread marks across the ruts.
    const tread = rut > 0.4 && Math.sin((y / n) * Math.PI * 2 * 90 + Math.sin(u * 40) * 0.4) > 0.55 ? 0.08 : 0;
    return [c[0] * (1 - tread), c[1] * (1 - tread), c[2] * (1 - tread), 0.55 - rut * 0.35 + grain * 0.15 - tread];
  });
  const stones = [[0.6, 0.6, 0.6], [0.5, 0.5, 0.51], [0.66, 0.65, 0.63], [0.42, 0.42, 0.42], [0.56, 0.55, 0.53]];
  for (let i = 0; i < n * n * 0.0035; i++) {
    const x = s.rand() * n;
    const u = x / n;
    const inRut = rutAt.some((r) => Math.abs(u - r) < 0.06);
    if (inRut && s.rand() < 0.85) continue;
    const r = 1 + Math.pow(s.rand(), 2.5) * 6;
    s.dab(x, s.rand() * n, r * 1.2, r, s.rand() * 3, stones[(s.rand() * stones.length) | 0], 0.8, 0.7 + r * 0.03);
  }
  const t = s.textures(3.5, maxAniso);
  t.map.colorSpace = THREE.NoColorSpace; // a multiplier, not a colour
  return t;
}

// Pine bark, wrapped round a log: deep furrows along it, plates between, greyed and mossy.
function bark(size, maxAniso) {
  const s = new Surface(size, 67);
  const dark = hex("#2e2219");
  const plate = hex("#6b5442");
  const grey = hex("#7d746a");
  s.fill((x, y) => {
    // Furrows run along the log (v): ridged noise stretched that way.
    const ridge = 1 - Math.abs(s.fbm(x * 4, y * 0.5, 6, 3) * 2 - 1);
    const n = s.fbm(x, y, 8, 3);
    const c = mix3(mix3(dark, plate, ridge), grey, Math.max(0, n - 0.55) * 1.5);
    return [...c, ridge * 0.8 + n * 0.2];
  });
  for (let i = 0; i < size * size * 0.0008; i++) s.dab(s.rand() * size, s.rand() * size, 5 + s.rand() * 8, 3 + s.rand() * 5, s.rand() * 3, hex("#4a5a2a"), 0.6, 0);
  return s.textures(4, maxAniso);
}

// A pine twig: needles either side of a stem, on clear (for branches made of cards).
function twig(size, maxAniso) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  const rand = rng(61);
  const greens = ["#2c4a24", "#36592b", "#24401f", "#40662f", "#1e351a"];
  // A few side shoots off the main stem, each fringed with needles.
  const shoot = (x0, y0, x1, y1, len) => {
    g.strokeStyle = "#4a3624";
    g.lineWidth = size * 0.012;
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
    const steps = 40;
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      const ang = Math.atan2(y1 - y0, x1 - x0);
      for (const side of [-1, 1]) {
        const a = ang + side * (0.9 + rand() * 0.4) - 0.2;
        const l = len * (0.5 + 0.5 * Math.sin(t * Math.PI)) * (0.7 + rand() * 0.5);
        g.strokeStyle = greens[(rand() * greens.length) | 0];
        g.lineWidth = size * 0.006;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
        g.stroke();
      }
    }
  };
  shoot(size * 0.5, size * 0.98, size * 0.5, size * 0.04, size * 0.12);
  for (let i = 0; i < 7; i++) {
    const y = size * (0.25 + i * 0.1);
    const side = i % 2 ? 1 : -1;
    shoot(size * 0.5, y, size * (0.5 + side * 0.32), y - size * 0.12, size * 0.07);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}

// A tuft of grass on clear: blades fanning up from the bottom.
function tuft(size, maxAniso) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  const rand = rng(71);
  const greens = ["#56702f", "#66803a", "#425a26", "#7d9150", "#93935c", "#5a7032"];
  for (let i = 0; i < 90; i++) {
    const x = size * (0.15 + rand() * 0.7);
    const lean = (rand() - 0.5) * size * 0.5;
    const top = size * (0.05 + rand() * 0.55);
    g.strokeStyle = greens[(rand() * greens.length) | 0];
    g.lineWidth = size * (0.008 + rand() * 0.01);
    g.beginPath();
    g.moveTo(x, size);
    g.quadraticCurveTo(x + lean * 0.3, size * 0.6, x + lean, top);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}

// A clear canvas texture of something drawn with `draw(g, size, rand)`.
function drawn(size, seed, maxAniso, draw) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  draw(g, size, rng(seed));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}

// A leafy bush seen side on: twiggy stems up from the bottom, a mound of small leaves over them,
// darker inside and low down, lighter on top.
function shrub(size, maxAniso) {
  return drawn(size, 83, maxAniso, (g, n, rand) => {
    g.strokeStyle = "#4a3a26";
    for (let i = 0; i < 14; i++) {
      g.lineWidth = n * (0.006 + rand() * 0.006);
      g.beginPath();
      const x = n * (0.4 + rand() * 0.2);
      g.moveTo(x, n);
      g.quadraticCurveTo(x + (rand() - 0.5) * n * 0.3, n * 0.7, n * (0.1 + rand() * 0.8), n * (0.2 + rand() * 0.5));
      g.stroke();
    }
    const greens = ["#2f4a22", "#3b5a28", "#466a2f", "#55783a", "#2a3f1e", "#647f3f"];
    for (let i = 0; i < 1400; i++) {
      // Within a mound: wide low down, rounded on top.
      const a = rand() * Math.PI;
      const r = Math.sqrt(rand());
      const x = n * (0.5 + Math.cos(a) * r * 0.46);
      const y = n * (0.98 - Math.sin(a) * r * 0.86);
      const up = 1 - y / n;
      g.fillStyle = greens[Math.min(greens.length - 1, Math.floor(rand() * 3 + up * 3.2))];
      g.save();
      g.translate(x, y);
      g.rotate(rand() * Math.PI);
      g.beginPath();
      g.ellipse(0, 0, n * 0.016, n * 0.008, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  });
}

// A fern: one frond arching up and over, leaflets either side shrinking toward its tip.
function fern(size, maxAniso) {
  return drawn(size, 89, maxAniso, (g, n, rand) => {
    const greens = ["#3e6328", "#4b7330", "#58803a", "#36561f"];
    const point = (t) => [n * (0.5 + 0.28 * t * t), n * (1 - 0.92 * t + 0.25 * t * t)];
    g.strokeStyle = "#4b5e2a";
    g.lineWidth = n * 0.008;
    g.beginPath();
    for (let t = 0; t <= 1; t += 0.02) {
      const [x, y] = point(t);
      if (t === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
    for (let t = 0.12; t < 0.98; t += 0.035) {
      const [x, y] = point(t);
      const length = n * 0.2 * Math.sin(Math.PI * Math.min(1, (t - 0.05) * 1.05)) * (1.1 - t * 0.5);
      for (const side of [-1, 1]) {
        g.strokeStyle = greens[Math.floor(rand() * greens.length)];
        g.lineWidth = n * (0.018 - t * 0.01);
        g.beginPath();
        g.moveTo(x, y);
        g.quadraticCurveTo(x + side * length * 0.6, y - length * 0.1, x + side * length, y + length * 0.15);
        g.stroke();
      }
    }
  });
}

// Tall grass in seed, with wild flowers: yellow, white and purple heads on thin stems.
function flowers(size, maxAniso) {
  return drawn(size, 97, maxAniso, (g, n, rand) => {
    const greens = ["#5d7a34", "#6e8a3e", "#4d6a2c", "#8a9452", "#9c9a5a"];
    for (let i = 0; i < 70; i++) {
      const x = n * (0.1 + rand() * 0.8);
      const lean = (rand() - 0.5) * n * 0.35;
      const top = n * (0.05 + rand() * 0.5);
      g.strokeStyle = greens[Math.floor(rand() * greens.length)];
      g.lineWidth = n * (0.006 + rand() * 0.007);
      g.beginPath();
      g.moveTo(x, n);
      g.quadraticCurveTo(x + lean * 0.3, n * 0.6, x + lean, top);
      g.stroke();
    }
    const heads = ["#e8c840", "#f2efe0", "#a080c8", "#e8c840", "#d9a23a", "#f2efe0"];
    for (let i = 0; i < 26; i++) {
      const x = n * (0.12 + rand() * 0.76);
      const y = n * (0.08 + rand() * 0.45);
      g.strokeStyle = "#5b7432";
      g.lineWidth = n * 0.005;
      g.beginPath();
      g.moveTo(x + (rand() - 0.5) * n * 0.08, n);
      g.lineTo(x, y);
      g.stroke();
      g.fillStyle = heads[Math.floor(rand() * heads.length)];
      for (let p = 0; p < 6; p++) {
        g.beginPath();
        g.arc(x + (rand() - 0.5) * n * 0.025, y + (rand() - 0.5) * n * 0.025, n * (0.008 + rand() * 0.008), 0, Math.PI * 2);
        g.fill();
      }
    }
  });
}

// Fractal noise for the clouds, tiling: one channel, 0 to 1.
export function cloudTexture(size = 256) {
  const s = new Surface(size, 97);
  const data = new Uint8Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Billowed a little: round tops, sharper gaps.
      const v = s.fbm(x, y, 4, 6);
      data[y * size + x] = Math.max(0, Math.min(255, (v * 1.15 - 0.06) * 255));
    }
  }
  const t = new THREE.DataTexture(data, size, size, THREE.RedFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.unpackAlignment = 1;
  t.needsUpdate = true;
  return t;
}

export function makeTextures(maxAniso) {
  return {
    grass: grass(512, maxAniso),
    earth: earth(512, maxAniso),
    rock: rock(512, maxAniso),
    forest: forest(512, maxAniso),
    track: track(512, maxAniso),
    bark: bark(256, maxAniso),
    twig: twig(256, maxAniso),
    tuft: tuft(256, maxAniso),
    shrub: shrub(256, maxAniso),
    fern: fern(256, maxAniso),
    flowers: flowers(256, maxAniso),
  };
}

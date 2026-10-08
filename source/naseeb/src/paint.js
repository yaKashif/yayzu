// The jeep's paint, weathered: metallic green under a clear coat, rusting through low down, round
// the wheel arches and along the drip rails, chipped here and there, and dirty, thickest low down,
// sprayed behind the wheels and across the back, with dust settled on the flat tops. Rust and dirt
// are matt and don't reflect; the paint is glossy and does. Everything is worked out in the shader
// from where a point is on the body (in the body's own axes, in metres: x right, y up from the hub
// line, z toward the back), so it lines up across every panel whatever its shape. The pits of the
// rust and the grain of the dirt bend the light like a normal map, but only the paint's clear coat
// stays smooth.
import * as THREE from "three";

export function weatheredPaint({ color, halfBase, arch, side, tail, dripRail }) {
  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.32,
    metalness: 0.55,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vBodyPos;\nvarying vec3 vBodyNormal;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvBodyPos = position;\nvBodyNormal = normal;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>
varying vec3 vBodyPos;
varying vec3 vBodyNormal;
float wearHash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float wearNoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(wearHash(i), wearHash(i + vec3(1.0, 0.0, 0.0)), f.x),
                 mix(wearHash(i + vec3(0.0, 1.0, 0.0)), wearHash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(wearHash(i + vec3(0.0, 0.0, 1.0)), wearHash(i + vec3(1.0, 0.0, 1.0)), f.x),
                 mix(wearHash(i + vec3(0.0, 1.0, 1.0)), wearHash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
float wearFbm(vec3 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * wearNoise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return s / 0.9375;
}`)
      .replace("#include <color_fragment>", `#include <color_fragment>
vec3 bp = vBodyPos;
vec3 bn = normalize(vBodyNormal);
// Where rust starts: low on the body, round the wheel arches, along the drip rails.
float low = 1.0 - smoothstep(0.22, 0.5, bp.y);
float archGap = min(abs(length(vec2(bp.z - ${halfBase.toFixed(4)}, bp.y)) - ${arch.toFixed(3)}),
                    abs(length(vec2(bp.z + ${halfBase.toFixed(4)}, bp.y)) - ${arch.toFixed(3)}));
float nearArch = (1.0 - smoothstep(0.0, 0.11, archGap)) * step(${(side - 0.12).toFixed(3)}, abs(bp.x));
float drip = (1.0 - smoothstep(0.0, 0.04, abs(bp.y - ${dripRail.toFixed(3)}))) * step(${(side - 0.04).toFixed(3)}, abs(bp.x));
float rustField = wearFbm(bp * 6.0) + 0.45 * clamp(low + nearArch * 0.8 + drip * 0.7, 0.0, 1.0);
float rust = smoothstep(0.8, 0.85, rustField);
// Chips, anywhere, small.
rust = max(rust, smoothstep(0.86, 0.9, wearFbm(bp * 15.0 + 5.3)));
// Round each patch, the paint is blistered and faded.
float blister = smoothstep(0.73, 0.8, rustField) * (1.0 - rust);
// Dirt: thick low down, sprayed up behind each wheel and across the back, streaked where it ran
// down, and dust on whatever faces up.
float spray = 0.0;
for (int k = -1; k <= 1; k += 2) {
  float behind = bp.z - float(k) * ${halfBase.toFixed(4)};
  spray += smoothstep(0.1, 0.45, behind) * (1.0 - smoothstep(0.5, 1.2, behind)) * (1.0 - smoothstep(0.35, 0.95, bp.y));
}
float back = smoothstep(${(tail - 0.35).toFixed(3)}, ${tail.toFixed(3)}, bp.z) * (1.0 - smoothstep(0.3, 1.25, bp.y));
float lowDirt = 1.0 - smoothstep(0.12, 0.7, bp.y);
float streaks = wearNoise(bp * vec3(28.0, 1.6, 28.0));
float dust = smoothstep(0.55, 0.95, bn.y);
float dirtField = (lowDirt * 0.75 + spray * 0.6 + back * 0.55) * (0.55 + 0.7 * wearFbm(bp * vec3(7.0, 2.5, 7.0)))
  + (1.0 - smoothstep(0.2, 0.86, bp.y)) * streaks * 0.35;
float dirt = smoothstep(0.38, 0.85, dirtField);
dirt = max(dirt, dust * 0.25 * smoothstep(0.3, 0.8, wearFbm(bp * 3.0 + 2.0)));
vec3 rustColour = mix(vec3(0.075, 0.022, 0.009), vec3(0.3, 0.078, 0.018), wearNoise(bp * 26.0));
vec3 dirtColour = mix(vec3(0.1, 0.066, 0.036), vec3(0.27, 0.2, 0.12), smoothstep(0.2, 0.75, wearFbm(bp * 4.0 + 9.0)));
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.85, 0.78, 0.6), blister * 0.6);
diffuseColor.rgb = mix(diffuseColor.rgb, rustColour, rust);
diffuseColor.rgb = mix(diffuseColor.rgb, dirtColour, dirt * 0.85);
float glossy = (1.0 - rust) * (1.0 - dirt * 0.9) * (1.0 - blister * 0.5);`)
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor + 0.05 * (wearNoise(bp * 90.0) - 0.5), 0.6, blister);
roughnessFactor = mix(roughnessFactor, 0.92, max(rust, dirt));`)
      .replace("#include <metalnessmap_fragment>", `#include <metalnessmap_fragment>
metalnessFactor *= (1.0 - rust) * (1.0 - dirt);`)
      .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
{
  // Rust pits and dirt grain as a height, in metres, bending the normal as a bump map would; faded
  // out with distance, where they'd only shimmer.
  float h = rust * 0.003 * wearFbm(bp * 40.0) + blister * 0.0015 * wearNoise(bp * 34.0) + dirt * 0.0012 * wearNoise(bp * 70.0);
  h *= 1.0 - smoothstep(4.0, 14.0, length(vViewPosition));
  vec3 sx = dFdx(-vViewPosition);
  vec3 sy = dFdy(-vViewPosition);
  vec3 r1 = cross(sy, normal);
  vec3 r2 = cross(normal, sx);
  float det = dot(sx, r1) * faceDirection;
  vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  normal = normalize(abs(det) * normal - grad);
}`)
      .replace("#include <lights_physical_fragment>", `#include <lights_physical_fragment>
#ifdef USE_CLEARCOAT
material.clearcoat *= glossy;
#endif`);
  };
  return material;
}

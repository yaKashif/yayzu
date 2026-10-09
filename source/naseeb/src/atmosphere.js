// The air and the light: the time of day (where the sun is, its colour and the sky's), the clouds
// drifting over, the haze that pales the distance, and the sunlight on everything outdoors, cut off
// where a ridge stands between it and the sun and dimmed as a cloud's shadow passes.
//
// Everything lit (the ground, trees, rocks, the jeep) is patched once (see outdoors()) so its
// direct sunlight goes through sunlightAt(); the haze replaces three.js's fog for all of it; and a
// gentle colour grade rides on the tone mapping.
import * as THREE from "three";

// Where the sun is: its bearing from the south (+z), toward the east (+x), and its height, in
// radians. The mountain's face looks south over the valley.
export const TIMES = {
  morning: {
    name: "Morning",
    azimuth: 1.15,
    elevation: 0.3,
    sun: "#ffe6c8",
    intensity: 2.9,
    zenith: "#3f7fcf",
    horizon: "#dce6ec",
    haze: "#ccd9e3",
    density: 0.0003, // the haze at the valley floor, per metre
    thin: 300, // m: how quickly it thins with height (morning mist sits low)
    hemiSky: "#bdd2ea",
    hemiGround: "#6a6347",
    hemi: 0.75,
    clouds: 0.54,
  },
  afternoon: {
    name: "Afternoon",
    azimuth: -0.95,
    elevation: 0.48,
    sun: "#ffe2bc",
    intensity: 3.1,
    zenith: "#3474c4",
    horizon: "#bfd3e6",
    haze: "#bccfe0",
    density: 0.00026,
    thin: 430,
    hemiSky: "#b9cee6",
    hemiGround: "#6b6446",
    hemi: 0.7,
    clouds: 0.5,
  },
  evening: {
    name: "Evening",
    azimuth: -1.42,
    elevation: 0.13,
    sun: "#ffb46e",
    intensity: 2.8,
    zenith: "#30599a",
    horizon: "#eec4a2",
    haze: "#b7b3c2",
    density: 0.00022,
    thin: 420,
    hemiSky: "#a6b6d6",
    hemiGround: "#5f4e3b",
    hemi: 0.62,
    clouds: 0.52,
  },
};
export const TIME_NAMES = Object.keys(TIMES);

export const CLOUD_BASE = 2600; // m, the height the clouds drift at
const WIND = new THREE.Vector2(9, 4); // m/s, how the clouds drift

export const sunDirection = (t) => new THREE.Vector3(Math.cos(t.elevation) * Math.sin(t.azimuth), Math.sin(t.elevation), Math.cos(t.elevation) * Math.cos(t.azimuth));

const white = () => {
  const t = new THREE.DataTexture(new Uint8Array([255]), 1, 1, THREE.RedFormat);
  t.needsUpdate = true;
  return t;
};

// What every outdoor shader shares, so a change here reaches them all.
export const AIR = {
  cloudMap: { value: null },
  cloudShift: { value: new THREE.Vector2() },
  cloudCover: { value: 0.56 },
  sunNear: { value: white() },
  sunNearBox: { value: new THREE.Vector4(0, 0, 1, 1) }, // x0, z0, 1/width, 1/depth
  sunFar: { value: white() },
  sunFarBox: { value: new THREE.Vector4(0, 0, 1, 1) },
  sunTo: { value: new THREE.Vector3(0, 1, 0) },
  sunColour: { value: new THREE.Color() }, // times its intensity
  hazeColour: { value: new THREE.Color() },
  hazeDensity: { value: 0.001 },
  hazeThin: { value: 400 },
};

// The clouds' density over the ground, 0 to 1, at a point on their layer; and how much of the
// sun gets through to a point outdoors: none where the mountain hides it, less under a cloud.
export const CLOUDS_GLSL = /* glsl */ `
uniform sampler2D cloudMap;
uniform vec2 cloudShift;
uniform float cloudCover;
float cloudsAt(vec2 p) {
  p += cloudShift;
  float d = texture2D(cloudMap, p * (1.0 / 5600.0)).r * 0.58 + texture2D(cloudMap, p * (1.0 / 1900.0) + 0.37).r * 0.29 + texture2D(cloudMap, p * (1.0 / 610.0) + 0.71).r * 0.13;
  return smoothstep(cloudCover, cloudCover + 0.2, d);
}
`;
export const SUNLIGHT_GLSL = /* glsl */ `
uniform sampler2D sunNear;
uniform vec4 sunNearBox;
uniform sampler2D sunFar;
uniform vec4 sunFarBox;
uniform vec3 sunTo;
float sunlightAt(vec3 p) {
  vec2 n = (p.xz - sunNearBox.xy) * sunNearBox.zw;
  float s = n.x > 0.0 && n.y > 0.0 && n.x < 1.0 && n.y < 1.0 ? texture2D(sunNear, n).r : texture2D(sunFar, (p.xz - sunFarBox.xy) * sunFarBox.zw).r;
  vec2 c = p.xz + sunTo.xz * ((${CLOUD_BASE.toFixed(1)} - p.y) / max(sunTo.y, 0.06));
  c += cloudShift;
  float d = texture2D(cloudMap, c * (1.0 / 5600.0)).r * 0.58 + texture2D(cloudMap, c * (1.0 / 1900.0) + 0.37).r * 0.29 + 0.065;
  return s * (1.0 - 0.72 * smoothstep(cloudCover, cloudCover + 0.2, d));
}
`;
// Haze: denser low down, thinning with height, so the valley floor a kilometre off is pale and a
// peak's top three kilometres off still stands clear. Along a ray from the camera (at camY) a
// distance dist, rising rise: the fraction of what's there that the haze hides.
export const HAZE_GLSL = /* glsl */ `
float hazeOf(float dist, float camY, float rise, float density, float thin) {
  float r = rise / thin;
  float along = abs(r) > 0.01 ? (1.0 - exp(-r)) / r : 1.0 - 0.5 * r;
  return 1.0 - exp(-density * dist * exp(-camY / thin) * along);
}
`;

// three.js's fog, replaced by the haze for everything with fog on: fogColor is the haze's colour,
// fogNear its density and fogFar how fast it thins (see World.setTime). Lit things also see the
// sun through it, the haze brighter and warmer toward the sun.
THREE.ShaderChunk.fog_pars_vertex = `
#ifdef USE_FOG
  varying float vFogDepth;
  varying vec3 vFogView;
#endif
`;
THREE.ShaderChunk.fog_vertex = `
#ifdef USE_FOG
  vFogDepth = - mvPosition.z;
  vFogView = mvPosition.xyz;
#endif
`;
THREE.ShaderChunk.fog_pars_fragment = `
#ifdef USE_FOG
  uniform vec3 fogColor;
  varying float vFogDepth;
  varying vec3 vFogView;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
  ${HAZE_GLSL}
#endif
`;
// The haze goes on before the tone mapping, in linear light as the sky's and far ranges' does, so
// it's the same drawn straight to the screen or through the post-processing. (three.js's fog comes
// after, by when the colour is the screen's; and its fog colour then is too, so it's taken back.)
THREE.ShaderChunk.fog_fragment = `
#if defined( USE_FOG ) && defined( FOG_EXP2 )
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth ) );
#endif
`;
THREE.ShaderChunk.tonemapping_fragment =
  `
#if defined( USE_FOG ) && ! defined( FOG_EXP2 )
  vec3 fogTint = linearToOutputTexel( vec4( 0.5 ) ).r > 0.6 ? sRGBTransferEOTF( vec4( fogColor, 1.0 ) ).rgb : fogColor;
  #if defined( OUTDOOR_LIGHTS ) && NUM_DIR_LIGHTS > 0
    float fogMu = max( dot( normalize( vFogView ), directionalLights[ 0 ].direction ), 0.0 );
    fogTint += directionalLights[ 0 ].color * ( 0.025 * pow( fogMu, 5.0 ) + 0.05 * pow( fogMu, 24.0 ) );
  #endif
  float fogRise = dot( viewMatrix[ 1 ].xyz, vFogView );
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogTint, hazeOf( length( vFogView ), cameraPosition.y, fogRise, fogNear, fogFar ) );
#endif
` + THREE.ShaderChunk.tonemapping_fragment;
THREE.ShaderChunk.lights_pars_begin = "#define OUTDOOR_LIGHTS\n" + THREE.ShaderChunk.lights_pars_begin;

// The grade, on top of the filmic curve: a little more contrast and warmth in the light, a touch
// of blue in the shadows. Used as three.js's custom tone mapping, so it applies the same with or
// without the post-processing (see post.js).
THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
  "vec3 CustomToneMapping( vec3 color ) { return color; }",
  `vec3 CustomToneMapping( vec3 color ) {
  color = ACESFilmicToneMapping( color );
  vec3 g = pow( max( color, 0.0 ), vec3( 1.0 / 2.2 ) );
  g = mix( g, g * g * ( 3.0 - 2.0 * g ), 0.12 );
  float l = dot( g, vec3( 0.2126, 0.7152, 0.0722 ) );
  g = mix( vec3( l ), g, 1.05 );
  g += vec3( 0.018, 0.006, -0.016 ) * smoothstep( 0.35, 0.9, l ) + vec3( -0.008, -0.002, 0.012 ) * ( 1.0 - smoothstep( 0.0, 0.35, l ) );
  return pow( saturate( g ), vec3( 2.2 ) );
}`,
);

// Patches a lit material so the sun reaching it goes through sunlightAt(), at its own point.
const OUTDOOR_VERTEX = "varying vec3 vOutdoor;";
const OUTDOOR_FRAGMENT = "varying vec3 vOutdoor;\n" + CLOUDS_GLSL + SUNLIGHT_GLSL;
export function outdoorPatch(shader) {
  Object.assign(shader.uniforms, AIR);
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", "#include <common>\n" + OUTDOOR_VERTEX)
    .replace("#include <project_vertex>", "#include <project_vertex>\nvOutdoor = cameraPosition + ( vec4( mvPosition.xyz, 0.0 ) * viewMatrix ).xyz;");
  shader.fragmentShader = shader.fragmentShader
    .replace("#include <common>", "#include <common>\n" + OUTDOOR_FRAGMENT)
    .replace("#include <aomap_fragment>", "float outdoorSun = sunlightAt( vOutdoor );\nreflectedLight.directDiffuse *= outdoorSun;\nreflectedLight.directSpecular *= outdoorSun;\n#include <aomap_fragment>");
}

// Every lit material in the scene, patched once.
export function outdoors(scene) {
  scene.traverse((o) => {
    for (const m of Array.isArray(o.material) ? o.material : o.material ? [o.material] : []) {
      if (m.outdoors || !(m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial)) continue;
      m.outdoors = true;
      const before = m.onBeforeCompile;
      const key = m.customProgramCacheKey();
      m.onBeforeCompile = (shader, renderer) => {
        before.call(m, shader, renderer);
        outdoorPatch(shader);
      };
      m.customProgramCacheKey = () => key + "|outdoors";
      m.needsUpdate = true;
    }
  });
}

// Each frame: the clouds carried on by the wind.
export function drift(dt) {
  AIR.cloudShift.value.addScaledVector(WIND, dt);
}

// Puts a time of day's colours and sun into the shared uniforms.
export function applyTime(t) {
  AIR.sunTo.value.copy(sunDirection(t));
  AIR.sunColour.value.set(t.sun).multiplyScalar(t.intensity);
  AIR.hazeColour.value.set(t.haze);
  AIR.hazeDensity.value = t.density;
  AIR.hazeThin.value = t.thin;
  AIR.cloudCover.value = t.clouds;
}

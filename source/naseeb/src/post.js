// The "High" graphics: the world drawn off screen, then shaded where things crowd close together
// (ambient occlusion: under the jeep, in the creases of the banks, round stones and logs), a soft
// glow round the sun and anything as bright, and the colour grade (atmosphere.js) on the way out.
// "Standard" draws straight to the screen, graded the same, without the first two.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { CopyShader } from "three/addons/shaders/CopyShader.js";

const AO_NEAR = 30; // m: the occlusion full strength out to here,
const AO_FAR = 70; // gone by here (further off it's only the depth buffer's noise)

// The sky and far ranges, then the world over them, into a target of its own (multisampled, with
// its depth kept for the occlusion), then copied on.
class WorldPass extends Pass {
  constructor(draw) {
    super();
    this.draw = draw;
    this.target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4, depthTexture: new THREE.DepthTexture(1, 1) });
    this.copy = new FullScreenQuad(new THREE.ShaderMaterial({ uniforms: THREE.UniformsUtils.clone(CopyShader.uniforms), vertexShader: CopyShader.vertexShader, fragmentShader: CopyShader.fragmentShader }));
    this.copy.material.uniforms.tDiffuse.value = this.target.texture;
  }
  setSize(width, height) {
    this.target.setSize(width, height);
  }
  render(renderer, writeBuffer) {
    renderer.setRenderTarget(this.target);
    this.draw(renderer);
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.copy.render(renderer);
  }
  dispose() {
    this.target.dispose();
    this.copy.dispose();
  }
}

// The occlusion laid over the world, near the camera only.
class ShadePass extends Pass {
  constructor(ao, depth, camera) {
    super();
    this.camera = camera;
    this.quad = new FullScreenQuad(
      new THREE.ShaderMaterial({
        uniforms: { tDiffuse: { value: null }, tAO: { value: ao }, tDepth: { value: depth }, near: { value: 0.1 }, far: { value: 1000 } },
        vertexShader: CopyShader.vertexShader,
        fragmentShader: /* glsl */ `
#include <packing>
uniform sampler2D tDiffuse;
uniform sampler2D tAO;
uniform sampler2D tDepth;
uniform float near;
uniform float far;
varying vec2 vUv;
void main() {
  vec4 colour = texture2D(tDiffuse, vUv);
  float d = texture2D(tDepth, vUv).x;
  float distance = -perspectiveDepthToViewZ(d, near, far);
  float ao = texture2D(tAO, vUv).r;
  colour.rgb *= mix(1.0, ao, 0.9 * (1.0 - smoothstep(${AO_NEAR.toFixed(1)}, ${AO_FAR.toFixed(1)}, distance)));
  gl_FragColor = colour;
}`,
      }),
    );
  }
  render(renderer, writeBuffer, readBuffer) {
    const u = this.quad.material.uniforms;
    u.tDiffuse.value = readBuffer.texture;
    u.near.value = this.camera.near;
    u.far.value = this.camera.far;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);
  }
}

export class Post {
  constructor(renderer, scene, camera, draw) {
    this.renderer = renderer;
    this.composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }));
    this.world = new WorldPass(draw);
    this.composer.addPass(this.world);
    // The occlusion at half the resolution, from the world's own depth (given after it's made: given
    // it at the start, three.js's pass trips over a target it then doesn't have). It only works it
    // out; ShadePass lays it on.
    const ao = new GTAOPass(scene, camera, 1, 1);
    ao.setGBuffer(this.world.target.depthTexture);
    ao.updateGtaoMaterial({ radius: 0.9, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 8, distanceFallOff: 1, screenSpaceRadius: false });
    ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 8 });
    ao.output = GTAOPass.OUTPUT.Off;
    ao.needsSwap = false;
    const setSize = ao.setSize.bind(ao);
    ao.setSize = (w, h) => setSize(Math.max(1, Math.round(w / 2)), Math.max(1, Math.round(h / 2)));
    this.ao = ao;
    this.composer.addPass(ao);
    this.composer.addPass(new ShadePass(ao.pdRenderTarget.texture, this.world.target.depthTexture, camera));
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), 0.22, 0.55, 2.2));
    this.composer.addPass(new OutputPass());
  }
  setSize(width, height, pixelRatio) {
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(width, height);
  }
  render() {
    this.composer.render();
  }
}

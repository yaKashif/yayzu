// Fewer things to draw: the parts under a group that never move against it, and share a material,
// joined into one mesh in the group's own axes. Each mesh is a draw call, twice over with its
// shadow, and the jeep is made of hundreds of small parts; joined, it's a few dozen.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Joins the meshes under root by material. Anything in `keep`, and everything under it, is left as
// it is (the parts that turn or stretch).
export function mergeStatic(root, keep = new Set()) {
  root.updateMatrixWorld(true);
  const toRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const sets = new Map();
  const visit = (o) => {
    if (keep.has(o)) return;
    for (const child of o.children) visit(child);
    if (o === root || !o.isMesh || o.isInstancedMesh || Array.isArray(o.material) || o.children.length) return;
    const key = [o.material.uuid, o.castShadow, o.receiveShadow, o.renderOrder, o.visible, o.name].join("|");
    if (!sets.has(key)) sets.set(key, []);
    sets.get(key).push(o);
  };
  visit(root);
  for (const meshes of sets.values()) {
    if (meshes.length < 2) continue;
    const parts = meshes.map((mesh) => {
      const m = new THREE.Matrix4().multiplyMatrices(toRoot, mesh.matrixWorld);
      let g = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
      for (const name of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(name)) g.deleteAttribute(name);
      if (!g.attributes.normal) g.computeVertexNormals();
      if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      g.morphAttributes = {};
      g.clearGroups();
      g.applyMatrix4(m);
      // A mirrored part's triangles turn the other way round once it's baked in: turn them back.
      if (m.determinant() < 0) {
        for (const a of Object.values(g.attributes)) {
          for (let t = 0; t < a.count; t += 3) {
            for (let c = 0; c < a.itemSize; c++) {
              const b = a.getComponent(t + 1, c);
              a.setComponent(t + 1, c, a.getComponent(t + 2, c));
              a.setComponent(t + 2, c, b);
            }
          }
        }
      }
      return g;
    });
    const first = meshes[0];
    const joined = new THREE.Mesh(mergeGeometries(parts), first.material);
    joined.castShadow = first.castShadow;
    joined.receiveShadow = first.receiveShadow;
    joined.renderOrder = first.renderOrder;
    joined.name = first.name;
    for (const mesh of meshes) mesh.removeFromParent();
    root.add(joined);
  }
}

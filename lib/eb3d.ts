/* Low-poly nuclear plant for the EB hero. A cylindrical containment
   building capped by a hemisphere dome, two hyperbolic cooling towers, and
   a turbine hall — flat-shaded with clean per-face vertex-colour paneling
   (structured banding, low noise). Returns an evenly sampled surface point
   cloud (dust-morph targets) and the tower-top steam anchors. */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

export type ReactorBuild = {
  group: THREE.Group;
  meshes: THREE.Mesh[];
  targets: Float32Array;
  count: number;
  radius: number;
  height: number;
  towerTops: { x: number; y: number; z: number }[];
  dispose: () => void;
};

type RGB = [number, number, number];
type Shade = (cx: number, cy: number, cz: number) => number;

// Bake a flat per-face colour into a geometry (chunky PS2 paneling). Returns a
// non-indexed geometry with a `color` attribute; pair with a vertexColors +
// flatShading material.
function facet(geo: THREE.BufferGeometry, base: RGB, shade: Shade) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const pos = g.attributes.position as THREE.BufferAttribute;
  const faces = pos.count / 3;
  const col = new Float32Array(pos.count * 3);
  for (let f = 0; f < faces; f++) {
    const i = f * 3;
    const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
    const cy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
    const cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
    const s = shade(cx, cy, cz);
    for (let k = 0; k < 3; k++) {
      col[(i + k) * 3] = Math.min(1, base[0] * s);
      col[(i + k) * 3 + 1] = Math.min(1, base[1] * s);
      col[(i + k) * 3 + 2] = Math.min(1, base[2] * s);
    }
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return g;
}

// hyperbolic cooling-tower silhouette as a lathe profile
function towerProfile(h: number, rBase: number): THREE.Vector2[] {
  const rWaist = rBase * 0.56;
  const rTop = rBase * 0.78;
  const waistT = 0.68;
  const A = (rWaist - rBase - (rTop - rBase) * waistT) / (waistT * waistT - waistT);
  const B = rTop - rBase - A;
  const pts: THREE.Vector2[] = [];
  const N = 12;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    pts.push(new THREE.Vector2(Math.max(0.04, A * t * t + B * t + rBase), t * h));
  }
  return pts;
}

export function buildReactor(): ReactorBuild {
  const group = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const sampleGeos: THREE.BufferGeometry[] = [];
  const R = (a: number, b: number) => a + Math.random() * (b - a);

  const CONCRETE: RGB = [0.82, 0.8, 0.75];
  const TOWER: RGB = [0.8, 0.78, 0.73];
  const STEEL: RGB = [0.53, 0.56, 0.61];
  const FOUND: RGB = [0.4, 0.42, 0.46];

  const paneled = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const litMat = new THREE.MeshBasicMaterial({ color: 0xffbe5c });
  const offMat = new THREE.MeshBasicMaterial({ color: 0x262b33 });

  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, sample = true) => {
    const m = new THREE.Mesh(geo, mat);
    group.add(m);
    meshes.push(m);
    if (sample) sampleGeos.push(geo);
  };

  // ---- dimensions ----
  const cR = 1.4; // containment radius
  const cH = 2.05; // containment cylinder height
  const domeH = cR; // hemisphere
  const towerH = 3.0;
  const towerR = 0.82;
  const towerX = 3.25;
  const towerZ = 0.15;

  // ---- foundation slab ----
  add(
    facet(
      new THREE.CylinderGeometry(towerX + towerR + 0.5, towerX + towerR + 0.75, 0.42, 28, 1).translate(0, 0.1, 0),
      FOUND,
      () => 0.55 + R(-0.05, 0.05)
    ),
    paneled
  );

  // ---- containment building: cylinder + hemisphere dome ----
  add(
    facet(
      new THREE.CylinderGeometry(cR, cR * 1.03, cH, 22, 1).translate(0, cH / 2, 0),
      CONCRETE,
      (cx, cy, cz) => 0.9 + Math.sin(Math.atan2(cz, cx) * 11) * 0.03 + R(-0.02, 0.02)
    ),
    paneled
  );
  const domeGeo = new THREE.SphereGeometry(cR, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.5);
  domeGeo.translate(0, cH, 0);
  add(
    facet(domeGeo, CONCRETE, (cx, cy) => 0.86 + ((cy - cH) / domeH) * 0.14 + R(-0.025, 0.025)),
    paneled
  );
  // ring lip where the dome meets the cylinder
  add(
    facet(
      new THREE.CylinderGeometry(cR * 1.05, cR * 1.05, 0.13, 22, 1).translate(0, cH, 0),
      STEEL,
      () => 0.7 + R(-0.04, 0.04)
    ),
    paneled,
    false
  );

  // ---- two hyperbolic cooling towers (ribbed) + dark rim caps ----
  const towerTops: { x: number; y: number; z: number }[] = [];
  for (const sx of [-1, 1]) {
    add(
      facet(
        new THREE.LatheGeometry(towerProfile(towerH, towerR), 14).translate(sx * towerX, 0, towerZ),
        TOWER,
        (cx, cy) => 0.82 + (Math.sin(cy * 8) * 0.5 + 0.5) * 0.1 + R(-0.03, 0.03)
      ),
      paneled
    );
    add(
      facet(
        new THREE.CylinderGeometry(towerR * 0.76, towerR * 0.8, 0.16, 14, 1, true).translate(sx * towerX, towerH - 0.06, towerZ),
        STEEL,
        () => 0.4 + R(-0.03, 0.03)
      ),
      paneled,
      false
    );
    towerTops.push({ x: sx * towerX, y: towerH, z: towerZ });
  }

  // ---- turbine hall: a long low building in front ----
  add(
    facet(
      new THREE.BoxGeometry(3.4, 0.95, 1.5).translate(0, 0.55, 2.55),
      STEEL,
      (cx, cy) => 0.88 + (cy > 0.9 ? 0.06 : 0) + R(-0.03, 0.03)
    ),
    paneled
  );
  // a couple of vent stacks on the turbine hall
  for (const vx of [-1, 1]) {
    add(
      facet(
        new THREE.CylinderGeometry(0.11, 0.13, 0.7, 8).translate(vx * 1.1, 1.35, 2.55),
        STEEL,
        () => 0.65 + R(-0.04, 0.04)
      ),
      paneled,
      false
    );
  }

  // ---- emissive windows ----
  const windows: [number, number, number, number][] = []; // x,y,z,rotY
  // two rows around the containment cylinder
  for (const wy of [cH * 0.42, cH * 0.72]) {
    const n = 16;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      windows.push([Math.cos(a) * cR * 1.02, wy, Math.sin(a) * cR * 1.02, -a]);
    }
  }
  // a strip along the turbine hall front
  for (let i = -3; i <= 3; i++) {
    windows.push([i * 0.42, 0.58, 2.55 + 0.76, 0]);
  }
  for (const [x, y, z, ry] of windows) {
    const box = new THREE.BoxGeometry(0.12, 0.22, 0.06);
    box.rotateY(ry);
    box.translate(x, y, z);
    add(box, Math.random() < 0.66 ? litMat : offMat, false);
  }

  // ---- sample the structural surface for the dust-morph targets ----
  const merged = mergeGeometries(sampleGeos, false);
  const count = 3400;
  const targets = new Float32Array(count * 3);
  if (merged) {
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(merged)).build();
    const p = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      sampler.sample(p);
      targets[i * 3] = p.x;
      targets[i * 3 + 1] = p.y;
      targets[i * 3 + 2] = p.z;
    }
    merged.dispose();
  }

  const radius = towerX + towerR + 0.8;
  const height = cH + domeH;

  const dispose = () => {
    for (const m of meshes) m.geometry.dispose();
    paneled.dispose();
    litMat.dispose();
    offMat.dispose();
  };

  return { group, meshes, targets, count, radius, height, towerTops, dispose };
}

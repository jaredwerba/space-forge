/* Low-poly (PS2-era) 3D reactor for the EB hero. Flat-shaded faceted
   geometry with per-face vertex-colour paneling/banding (the chunky
   PS2 texture look), a foundation slab, a ring of emissive windows, and
   two hyperbolic cooling towers. Returns an evenly sampled surface point
   cloud (dust morph targets) and the tower-top anchors (steam emitters). */

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

// Bake a flat per-face colour into a geometry → chunky PS2 paneling. Returns a
// non-indexed geometry with a `color` attribute; pair with a material that has
// { vertexColors: true, flatShading: true }.
function facet(geo: THREE.BufferGeometry, base: RGB, shade: (cy: number) => number) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const pos = g.attributes.position as THREE.BufferAttribute;
  const faces = pos.count / 3;
  const col = new Float32Array(pos.count * 3);
  for (let f = 0; f < faces; f++) {
    const i = f * 3;
    const cy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
    const s = shade(cy);
    for (let k = 0; k < 3; k++) {
      col[(i + k) * 3] = base[0] * s;
      col[(i + k) * 3 + 1] = base[1] * s;
      col[(i + k) * 3 + 2] = base[2] * s;
    }
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return g;
}

// hyperbolic cooling-tower silhouette as a lathe profile (few points = faceted)
function towerProfile(h: number, rBase: number): THREE.Vector2[] {
  const rWaist = rBase * 0.58;
  const rTop = rBase * 0.82;
  const waistT = 0.66;
  const A = (rWaist - rBase - (rTop - rBase) * waistT) / (waistT * waistT - waistT);
  const B = rTop - rBase - A;
  const pts: THREE.Vector2[] = [];
  const N = 9;
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

  const STONE: RGB = [0.82, 0.77, 0.67];
  const STEEL: RGB = [0.55, 0.58, 0.63];
  const paneled = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const litMat = new THREE.MeshBasicMaterial({ color: 0xffb24a });
  const offMat = new THREE.MeshBasicMaterial({ color: 0x23272f });

  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, sample = true) => {
    const m = new THREE.Mesh(geo, mat);
    group.add(m);
    meshes.push(m);
    if (sample) sampleGeos.push(geo);
  };

  const drumH = 0.7;
  const drumR = 1.95;
  const DR = 2.25;
  const domeScaleY = 0.82;
  const towerH = 2.45;
  const towerR = 0.62;
  const towerX = 3.05;

  // foundation slab
  add(
    facet(
      new THREE.CylinderGeometry(towerX + towerR + 0.5, towerX + towerR + 0.7, 0.4, 22, 1).translate(0, 0.12, 0),
      STEEL,
      () => 0.5 + R(-0.05, 0.05)
    ),
    paneled
  );

  // drum (steel, faint per-panel variation)
  add(
    facet(
      new THREE.CylinderGeometry(drumR, drumR * 1.04, drumH, 16, 1).translate(0, drumH / 2, 0),
      STEEL,
      () => 0.82 + R(-0.08, 0.08)
    ),
    paneled
  );

  // squashed faceted dome — paneled, brighter toward the crown
  const domeGeo = new THREE.SphereGeometry(DR, 14, 7, 0, Math.PI * 2, 0, Math.PI * 0.5);
  domeGeo.scale(1, domeScaleY, 1);
  domeGeo.translate(0, drumH, 0);
  add(
    facet(domeGeo, STONE, (cy) => {
      const frac = (cy - drumH) / (DR * domeScaleY);
      return 0.82 + frac * 0.16 + R(-0.07, 0.07);
    }),
    paneled
  );

  // two hyperbolic cooling towers (ribbed banding) + dark open rim caps
  const towerTops: { x: number; y: number; z: number }[] = [];
  for (const sx of [-1, 1]) {
    add(
      facet(
        new THREE.LatheGeometry(towerProfile(towerH, towerR), 9).translate(sx * towerX, 0, 0),
        STONE,
        (cy) => 0.78 + (Math.sin(cy * 7) * 0.5 + 0.5) * 0.16 + R(-0.05, 0.05)
      ),
      paneled
    );
    add(
      facet(
        new THREE.CylinderGeometry(towerR * 0.8, towerR * 0.84, 0.14, 9, 1, true).translate(sx * towerX, towerH - 0.05, 0),
        STEEL,
        () => 0.42 + R(-0.04, 0.04)
      ),
      paneled,
      false
    );
    towerTops.push({ x: sx * towerX, y: towerH, z: 0 });
  }

  // a row of pipe arches across the front of the drum
  for (let i = -2; i <= 2; i++) {
    add(
      facet(
        new THREE.TorusGeometry(0.34, 0.085, 5, 9, Math.PI).translate(i * 0.78, 0.18, drumR * 0.94),
        STEEL,
        () => 0.7 + R(-0.06, 0.06)
      ),
      paneled
    );
  }

  // emissive windows ringing the drum (most lit, some dark) — the "power" glow
  const winN = 18;
  for (let i = 0; i < winN; i++) {
    const a = (i / winN) * Math.PI * 2;
    const box = new THREE.BoxGeometry(0.14, 0.3, 0.07);
    box.rotateY(-a);
    box.translate(Math.cos(a) * drumR * 1.02, drumH * 0.52, Math.sin(a) * drumR * 1.02);
    add(box, Math.random() < 0.62 ? litMat : offMat, false);
  }

  // ---- sample the structural surface for the dust-morph targets ----
  const merged = mergeGeometries(sampleGeos, false);
  const count = 3200;
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

  const radius = towerX + towerR + 0.7;
  const height = drumH + DR * domeScaleY;

  const dispose = () => {
    for (const m of meshes) m.geometry.dispose();
    paneled.dispose();
    litMat.dispose();
    offMat.dispose();
  };

  return { group, meshes, targets, count, radius, height, towerTops, dispose };
}

/* Low-poly (PS2-era) 3D reactor for the EB hero. Flat-shaded faceted
   geometry — a squashed geodesic dome on a drum, flanked by two
   hyperbolic cooling towers — plus an evenly sampled point cloud of its
   surface so the scroll-driven dust can morph from a scattered cloud
   into the solid model. Built in plain three.js (no R3F). */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

export type ReactorBuild = {
  group: THREE.Group;
  meshes: THREE.Mesh[];
  targets: Float32Array; // sampled surface points (dust morph targets)
  count: number;
  radius: number; // footprint radius
  height: number; // tallest point
  dispose: () => void;
};

// hyperbolic cooling-tower silhouette as a lathe profile (few points = faceted)
function towerProfile(h: number, rBase: number): THREE.Vector2[] {
  const rWaist = rBase * 0.58;
  const rTop = rBase * 0.82;
  const waistT = 0.66;
  const A = (rWaist - rBase - (rTop - rBase) * waistT) / (waistT * waistT - waistT);
  const B = rTop - rBase - A;
  const pts: THREE.Vector2[] = [];
  const N = 8;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const r = A * t * t + B * t + rBase;
    pts.push(new THREE.Vector2(Math.max(0.04, r), t * h));
  }
  return pts;
}

export function buildReactor(): ReactorBuild {
  const group = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const geos: THREE.BufferGeometry[] = []; // baked copies for sampling

  const stone = new THREE.MeshLambertMaterial({ color: 0xcabfa8, flatShading: true });
  const stoneDark = new THREE.MeshLambertMaterial({ color: 0x9c927e, flatShading: true });
  const steel = new THREE.MeshLambertMaterial({ color: 0x8a8f99, flatShading: true });

  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.updateMatrix();
    group.add(m);
    meshes.push(m);
    const baked = geo.clone();
    baked.applyMatrix4(m.matrix);
    geos.push(baked);
  };

  // ---- drum base ----
  const drumH = 0.7;
  const drumR = 1.95;
  add(new THREE.CylinderGeometry(drumR, drumR * 1.04, drumH, 16, 1), steel, 0, drumH / 2, 0);

  // ---- squashed faceted dome on the drum ----
  const DR = 2.25;
  const domeGeo = new THREE.SphereGeometry(DR, 14, 7, 0, Math.PI * 2, 0, Math.PI * 0.5);
  domeGeo.scale(1, 0.82, 1);
  add(domeGeo, stone, 0, drumH, 0);

  // ---- two hyperbolic cooling towers ----
  const towerH = 2.45;
  const towerR = 0.62;
  const towerX = 3.05;
  for (const sx of [-1, 1]) {
    const lathe = new THREE.LatheGeometry(towerProfile(towerH, towerR), 9);
    add(lathe, sx < 0 ? stone : stoneDark, sx * towerX, 0, 0);
    // dark open rim cap
    const rim = new THREE.CylinderGeometry(towerR * 0.78, towerR * 0.82, 0.12, 9, 1, true);
    add(rim, steel, sx * towerX, towerH - 0.05, 0);
  }

  // ---- a low row of pipe arches across the front of the drum ----
  for (let i = -2; i <= 2; i++) {
    const arch = new THREE.TorusGeometry(0.34, 0.085, 5, 9, Math.PI);
    const m = new THREE.Mesh(arch, steel);
    m.position.set(i * 0.78, 0.18, drumR * 0.94);
    m.rotation.z = 0;
    m.updateMatrix();
    group.add(m);
    meshes.push(m);
    const baked = arch.clone();
    baked.applyMatrix4(m.matrix);
    geos.push(baked);
  }

  // ---- sample the whole surface for the dust-morph targets ----
  const merged = mergeGeometries(geos, false);
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

  const radius = towerX + towerR + 0.4;
  const height = drumH + DR * 0.82;

  const dispose = () => {
    for (const m of meshes) m.geometry.dispose();
    stone.dispose();
    stoneDark.dispose();
    steel.dispose();
  };

  return { group, meshes, targets, count, radius, height, dispose };
}

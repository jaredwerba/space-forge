/* Cinematic fission plant for the EB hero. Smooth high-segment geometry with
   physically-based materials — rough lunar concrete, brushed steel, emissive
   window/beacon glass that reads under HDR bloom. Returns an evenly sampled
   surface point cloud (dust-morph targets) and the tower-top steam anchors. */

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

// hyperbolic cooling-tower silhouette as a lathe profile
function towerProfile(h: number, rBase: number): THREE.Vector2[] {
  const rWaist = rBase * 0.56;
  const rTop = rBase * 0.78;
  const waistT = 0.68;
  const A = (rWaist - rBase - (rTop - rBase) * waistT) / (waistT * waistT - waistT);
  const B = rTop - rBase - A;
  const pts: THREE.Vector2[] = [];
  const N = 24;
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

  // ---- PBR materials ----
  const concrete = new THREE.MeshStandardMaterial({
    color: 0xd9d5cc,
    roughness: 0.85,
    metalness: 0.04,
  });
  const concreteDark = new THREE.MeshStandardMaterial({
    color: 0xb2aea5,
    roughness: 0.92,
    metalness: 0.03,
  });
  const steel = new THREE.MeshStandardMaterial({
    color: 0x9aa1ac,
    roughness: 0.36,
    metalness: 0.85,
  });
  const steelDark = new THREE.MeshStandardMaterial({
    color: 0x565d68,
    roughness: 0.5,
    metalness: 0.8,
  });
  const clad = new THREE.MeshStandardMaterial({
    color: 0x7f8791,
    roughness: 0.46,
    metalness: 0.7,
  });
  const glowWin = new THREE.MeshStandardMaterial({
    color: 0x201a12,
    emissive: 0xffa63f,
    emissiveIntensity: 2.6,
    roughness: 0.4,
  });
  const darkWin = new THREE.MeshStandardMaterial({
    color: 0x151a21,
    roughness: 0.28,
    metalness: 0.6,
  });
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0x1a0f08,
    emissive: 0xff4d1a,
    emissiveIntensity: 3.4,
    roughness: 0.5,
  });
  const mats = [concrete, concreteDark, steel, steelDark, clad, glowWin, darkWin, beaconMat];

  // Each piece gets its own cloned material (so it can glow sinter-hot as it
  // emerges), an assembly stage (0 = first out of the ground .. 9 = last),
  // and a sink depth (how far below the surface it starts).
  const MAX_STAGE = 9;
  const add = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    sample = true,
    stage = 0
  ) => {
    geo.computeBoundingBox();
    const own = (mat as THREE.MeshStandardMaterial).clone();
    const m = new THREE.Mesh(geo, own);
    m.userData.ord = stage / MAX_STAGE;
    m.userData.sink = (geo.boundingBox ? geo.boundingBox.max.y : 1) + 0.08;
    m.userData.glow = own.emissiveIntensity > 0 ? own.emissiveIntensity : 0;
    m.userData.isEmissive = own.emissiveIntensity > 0;
    if (m.userData.isEmissive) {
      own.emissiveIntensity = 0; // lights come on in the deploy phase
    } else {
      own.emissive.setHex(0xff5c1e); // sinter heat while emerging
      own.emissiveIntensity = 0;
    }
    group.add(m);
    meshes.push(m);
    if (sample) sampleGeos.push(geo);
  };

  // ---- dimensions ----
  const cR = 1.4;
  const cH = 2.05;
  const domeH = cR;
  const towerH = 3.0;
  const towerR = 0.82;
  const towerX = 3.25;
  const towerZ = 0.15;

  // ---- foundation slab ----
  add(
    new THREE.CylinderGeometry(towerX + towerR + 0.5, towerX + towerR + 0.75, 0.42, 64, 1).translate(0, 0.1, 0),
    concreteDark,
    true,
    0
  );

  // ---- containment: cylinder + hemisphere dome + steel lip ----
  add(new THREE.CylinderGeometry(cR, cR * 1.03, cH, 64, 1).translate(0, cH / 2, 0), concrete, true, 1);
  add(
    new THREE.SphereGeometry(cR, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5).translate(0, cH, 0),
    concrete,
    true,
    2
  );
  add(
    new THREE.CylinderGeometry(cR * 1.05, cR * 1.05, 0.13, 64, 1).translate(0, cH, 0),
    steel,
    false,
    3
  );
  // vertical buttress ribs (between the window columns)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 16;
    const rib = new THREE.BoxGeometry(0.1, cH, 0.16);
    rib.translate(0, cH / 2, cR);
    rib.rotateY(-a);
    add(rib, concreteDark, false, 3);
  }
  // antenna mast + beacon on the dome apex
  add(
    new THREE.CylinderGeometry(0.02, 0.05, 0.85, 16).translate(0, cH + domeH + 0.4, 0),
    steel,
    false,
    8
  );
  add(new THREE.SphereGeometry(0.06, 16, 12).translate(0, cH + domeH + 0.86, 0), beaconMat, false, 9);

  // ---- cooling towers: smooth lathe + rim cap + skirt + feed pipe ----
  const towerTops: { x: number; y: number; z: number }[] = [];
  for (const sx of [-1, 1]) {
    add(
      new THREE.LatheGeometry(towerProfile(towerH, towerR), 64).translate(sx * towerX, 0, towerZ),
      concrete,
      true,
      4
    );
    add(
      new THREE.CylinderGeometry(towerR * 0.76, towerR * 0.8, 0.16, 48, 1, true).translate(sx * towerX, towerH - 0.06, towerZ),
      steelDark,
      false,
      5
    );
    add(
      new THREE.CylinderGeometry(towerR * 1.06, towerR * 1.2, 0.24, 48).translate(sx * towerX, 0.12, towerZ),
      concreteDark,
      false,
      4
    );
    const span = towerX - cR - 0.3;
    const pipe = new THREE.CylinderGeometry(0.09, 0.09, span, 24);
    pipe.rotateZ(Math.PI / 2);
    pipe.translate(sx * (cR + 0.15 + span / 2), 0.52, towerZ * 0.5);
    add(pipe, steel, true, 5);
    for (const f of [0.35, 0.72]) {
      add(
        new THREE.CylinderGeometry(0.05, 0.06, 0.5, 12).translate(sx * (cR + 0.15 + span * f), 0.26, towerZ * 0.5),
        steel,
        false,
        5
      );
    }
    towerTops.push({ x: sx * towerX, y: towerH, z: towerZ });
  }

  // ---- turbine hall + rooftop ridge + door + vent stacks ----
  add(new THREE.BoxGeometry(3.4, 0.95, 1.5).translate(0, 0.55, 2.55), clad, true, 6);
  add(new THREE.BoxGeometry(2.9, 0.12, 0.46).translate(0, 1.08, 2.55), steel, false, 6);
  add(new THREE.BoxGeometry(0.34, 0.5, 0.05).translate(0.95, 0.27, 3.31), darkWin, false, 7);
  for (const vx of [-1, 1]) {
    add(
      new THREE.CylinderGeometry(0.11, 0.13, 0.7, 20).translate(vx * 1.1, 1.35, 2.55),
      steel,
      false,
      7
    );
  }
  // steam lines from the containment into the hall
  for (const px of [-0.5, 0.5]) {
    const line = new THREE.CylinderGeometry(0.1, 0.1, 1.3, 24);
    line.rotateX(Math.PI / 2);
    line.translate(px, 0.44, cR + 0.6);
    add(line, steel, true, 7);
  }
  // auxiliary block
  add(new THREE.BoxGeometry(1.0, 0.6, 0.9).translate(-2.05, 0.35, 2.1), clad, true, 6);

  // ---- perimeter light posts ----
  const postRing = towerX + towerR - 0.1;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4;
    const px = Math.cos(a) * postRing;
    const pz = Math.sin(a) * postRing;
    add(new THREE.CylinderGeometry(0.03, 0.045, 0.55, 10).translate(px, 0.58, pz), steel, false, 8);
    add(new THREE.SphereGeometry(0.055, 12, 8).translate(px, 0.9, pz), glowWin, false, 9);
  }

  // ---- emissive windows ----
  const windows: [number, number, number, number][] = [];
  for (const wy of [cH * 0.42, cH * 0.72]) {
    const n = 16;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      windows.push([Math.cos(a) * cR * 1.02, wy, Math.sin(a) * cR * 1.02, -a]);
    }
  }
  for (let i = -3; i <= 3; i++) {
    windows.push([i * 0.42, 0.58, 3.31, 0]);
  }
  for (const [x, y, z, ry] of windows) {
    const box = new THREE.BoxGeometry(0.12, 0.22, 0.06);
    box.rotateY(ry);
    box.translate(x, y, z);
    add(box, Math.random() < 0.66 ? glowWin : darkWin, false, 9);
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
    for (const m of meshes) {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
    for (const mat of mats) mat.dispose();
  };

  return { group, meshes, targets, count, radius, height, towerTops, dispose };
}

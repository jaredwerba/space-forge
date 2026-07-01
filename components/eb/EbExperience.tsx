"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";
import { useEbStore } from "@/lib/ebStore";
import { buildReactor } from "@/lib/eb3d";

const beats = [
  {
    n: "01",
    k: "The silence",
    h: "The Moon runs on nothing until it runs on fission.",
    p: "Fourteen-day nights. No atmosphere. Solar dies at dusk. Every habitat, every machine, every step forward waits on one thing — continuous power on the surface.",
  },
  {
    n: "02",
    k: "The cut",
    h: "Mobile autonomous lasers fuse dust into structure.",
    p: "No crew. No imported steel. A swarm traverses the regolith, beneficiates the metal already in it, and sinters it in place — layer by layer, through the lunar night.",
  },
  {
    n: "03",
    k: "The shell",
    h: "A reactor shell grown around a 28-kilogram core.",
    p: "KRUSTY proved the reactor; the gap was never the physics, it was the mass. We print the heavy part on site — shielding, containment, radiators. Core from Earth, everything else from the Moon.",
  },
];

const gallery = [
  {
    src: "/brand/lunar-site.jpg",
    w: 1600,
    h: 800,
    cap: "Reference site — autonomous assembly",
    loc: "Mare Tranquillitatis",
  },
  {
    src: "/brand/regolith.jpg",
    w: 1200,
    h: 805,
    cap: "Feedstock — mare regolith",
    loc: "40%+ Fe · Ti · Al",
  },
];

const cred: [string, string[]][] = [
  ["Proven ground", ["NASA KRUSTY — 2018", "DLR · LZH regolith sintering", "NASA reauthorization — 2026"]],
  ["Flight path", ["Blue Origin · Blue Moon MK1", "Surface window — 2027", "New Glenn — 7 m fairing"]],
  ["The process", ["Extract", "Process", "Sinter", "Deploy"]],
];

/* split into per-char spans, grouped by word so words never break
   mid-character — words wrap as whole units, chars animate individually. */
function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  const chars: HTMLElement[] = [];
  const words = text.split(" ");
  words.forEach((word, wi) => {
    const wspan = document.createElement("span");
    wspan.className = "eb-word";
    for (const ch of word) {
      const s = document.createElement("span");
      s.className = "eb-char";
      s.textContent = ch;
      wspan.appendChild(s);
      chars.push(s);
    }
    el.appendChild(wspan);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
  el.setAttribute("aria-label", text);
  return chars;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

export default function EbExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  // GSAP-driven dust->reactor transform (build = dust flying to the surface,
  // solid = dust hardening into the mesh). Read by the canvas each frame.
  const morphRef = useRef({ build: 0, solid: 0 });
  const [copied, setCopied] = useState(false);

  // ---- smooth scroll + scroll-linked scenes ----
  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    root.classList.add("eb-js");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onScroll = () => {
      const limit = lenis.limit || 1;
      const p = Math.min(1, Math.max(0, lenis.scroll / limit));
      const pct = `${(p * 100).toFixed(2)}%`;
      if (beamRef.current) beamRef.current.style.width = pct;
      if (tipRef.current) tipRef.current.style.left = pct;
      if (numRef.current) numRef.current.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`;
    };
    lenis.on("scroll", onScroll);
    onScroll();

    const ctx = gsap.context(() => {
      const l1 = line1Ref.current ? splitChars(line1Ref.current) : [];
      const l2 = line2Ref.current ? splitChars(line2Ref.current) : [];

      // pixel headline — each glyph flickers and pops in from the dust
      const heroChars = [...l1, ...l2];
      if (reduce) {
        gsap.set(heroChars, { opacity: 1 });
      } else {
        gsap.set(heroChars, {
          opacity: 0,
          scale: 0.4,
          transformOrigin: "50% 100%",
        });
        gsap.to(heroChars, {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: "steps(5)",
          delay: 0.25,
          stagger: { amount: 1.1, from: "random" },
        });
      }

      // lead line — floats in space, then the laser shatters it into dust.
      // Chars' opacity is owned by the scrub shatter; the container handles
      // the load fade so the two never fight over the same property.
      const leadChars = leadRef.current ? splitChars(leadRef.current) : [];
      gsap.set(leadChars, { opacity: 1 });
      if (!reduce) {
        gsap.fromTo(
          footRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8, ease: "none", delay: 0.9 }
        );
      }

      // hero scrub timeline — scroll drives the canvas progress + text drift
      const hero = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => useEbStore.getState().setProgress(self.progress),
        },
      });
      hero
        .to(line1Ref.current, { yPercent: -26, autoAlpha: 0.16, ease: "none" }, 0.4)
        .to(line2Ref.current, { yPercent: -12, ease: "none" }, 0.48)
        // dust->reactor transform, GSAP-driven: every dust mote flies onto the
        // reactor surface (build), then hardens into the solid model (solid)
        .to(morphRef.current, { build: 1, ease: "power2.out", duration: 0.2 }, 0.5)
        .to(morphRef.current, { solid: 1, ease: "power1.inOut", duration: 0.14 }, 0.71);

      // NOTE: the lead doesn't shatter here — the canvas layer dissolves it
      // into real regolith dust as the laser beam crosses each glyph.

      // section headlines — char reveal on scroll
      root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        const chars = splitChars(el);
        gsap.to(chars, {
          opacity: 1,
          duration: 0.4,
          ease: "none",
          stagger: { amount: 0.4, from: "random" },
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });

      // generic reveals
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    }, root);

    // reduced motion: drop the smooth-scroll engine, and drive the progress
    // bar from native scroll (otherwise it would freeze at 0%)
    let onNativeScroll: (() => void) | null = null;
    if (reduce) {
      gsap.ticker.remove(tick);
      lenis.destroy();
      onNativeScroll = () => {
        const limit = document.documentElement.scrollHeight - window.innerHeight || 1;
        const p = Math.min(1, Math.max(0, window.scrollY / limit));
        const pct = `${(p * 100).toFixed(2)}%`;
        if (beamRef.current) beamRef.current.style.width = pct;
        if (tipRef.current) tipRef.current.style.left = pct;
        if (numRef.current)
          numRef.current.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`;
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      onNativeScroll();
    }

    // expose store + lenis for debugging / scene tuning
    (window as unknown as { __eb?: typeof useEbStore }).__eb = useEbStore;
    (window as unknown as { __ebLenis?: Lenis }).__ebLenis = lenis;

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      if (onNativeScroll) window.removeEventListener("scroll", onNativeScroll);
      lenis.destroy();
      root.classList.remove("eb-js");
    };
  }, []);

  // ---- hero scene: a PS2-era low-poly 3D world (three.js). Scroll drives a
  //      laser down through the floating lead (which dissolves to dust); the
  //      dust then assembles into a flat-shaded reactor under a fogged sky ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setClearColor(0x06070e, 1);
    const SCALE = 0.55; // chunky, PS2-grade internal resolution

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x06070e, 16, 44);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 140);

    // flat low-poly lighting — warm key upper-left, cool fill + rim
    const key = new THREE.DirectionalLight(0xfff1e0, 2.3);
    key.position.set(-5, 7, 4);
    const fill = new THREE.AmbientLight(0x3a4458, 1.2);
    const rim = new THREE.DirectionalLight(0x47526e, 0.7);
    rim.position.set(5, 2, -5);
    scene.add(key, fill, rim);

    // ---- reactor model + dust-morph targets ----
    const { group: reactor, meshes, targets, count, radius, height, towerTops, dispose } =
      buildReactor();
    for (const m of meshes) {
      const mat = m.material as THREE.Material;
      mat.transparent = true;
      mat.opacity = 0;
    }
    scene.add(reactor);

    // dust cloud (child of the reactor so it shares the slow turntable spin)
    const cur = new Float32Array(count * 3);
    const home = new Float32Array(count * 3);
    const delay = new Float32Array(count); // per-mote stagger for the assembly
    const DELAY_MAX = 0.4;
    // dust starts as a flat layer on the ground — kicked up by the strike
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = Math.sqrt(Math.random()) * radius * 1.05;
      home[i * 3] = Math.cos(a) * rr;
      home[i * 3 + 1] = Math.random() * 0.5;
      home[i * 3 + 2] = Math.sin(a) * rr;
      cur[i * 3] = home[i * 3];
      cur[i * 3 + 1] = home[i * 3 + 1];
      cur[i * 3 + 2] = home[i * 3 + 2];
      delay[i] = Math.random() * DELAY_MAX;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(cur, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xb3a98f,
      size: 0.12,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    reactor.add(dust);

    // ---- low-poly cratered moon ground ----
    const groundGeo = new THREE.PlaneGeometry(92, 92, 52, 52);
    groundGeo.rotateX(-Math.PI / 2);
    const gp = groundGeo.attributes.position as THREE.BufferAttribute;
    // scattered craters (kept clear of the centre where the plant sits)
    const craters = Array.from({ length: 18 }, () => {
      const a = Math.random() * Math.PI * 2;
      const rr = 7 + Math.random() * 34;
      return {
        cx: Math.cos(a) * rr,
        cz: Math.sin(a) * rr,
        r: 1.5 + Math.random() * 4.6,
        depth: 0.35 + Math.random() * 1.1,
      };
    });
    const gcol = new Float32Array(gp.count * 3);
    for (let i = 0; i < gp.count; i++) {
      const x = gp.getX(i);
      const z = gp.getZ(i);
      // rolling dunes + finer secondary noise
      let h =
        Math.sin(x * 0.21) * Math.cos(z * 0.19) * 0.32 +
        Math.sin(x * 0.55 + 1.7) * Math.cos(z * 0.48) * 0.13 +
        Math.sin(x * 1.3) * Math.cos(z * 1.1 + 0.6) * 0.05;
      for (const c of craters) {
        const dd = Math.hypot(x - c.cx, z - c.cz) / c.r;
        if (dd < 1.3) {
          h += c.depth * (-Math.exp(-dd * dd * 3) + Math.exp(-((dd - 0.92) * (dd - 0.92)) * 22) * 0.55);
        }
      }
      gp.setY(i, h - 0.05);
      // colour by height + broad mottling + fine grain (darker pits, lit crests)
      const hn = Math.max(0, Math.min(1, 0.5 + h * 0.6));
      const mott = 0.5 + 0.5 * Math.sin(x * 0.13 + z * 0.1) * Math.cos(x * 0.07 - z * 0.11);
      const s = 0.6 + hn * 0.42 + mott * 0.12 + (Math.random() - 0.5) * 0.13;
      gcol[i * 3] = 0.56 * s;
      gcol[i * 3 + 1] = 0.575 * s;
      gcol[i * 3 + 2] = 0.61 * s;
    }
    groundGeo.setAttribute("color", new THREE.BufferAttribute(gcol, 3));
    groundGeo.computeVertexNormals();
    const ground = new THREE.Mesh(
      groundGeo,
      new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })
    );
    scene.add(ground);

    // ---- starfield: many stars, each sparkling on its own phase ----
    const starN = 1600;
    const starPos = new Float32Array(starN * 3);
    const starPhase = new Float32Array(starN);
    const starSize = new Float32Array(starN);
    for (let i = 0; i < starN; i++) {
      const rr = 46 + Math.random() * 36;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = rr * Math.sin(ph) * Math.cos(th);
      starPos[i * 3 + 1] = Math.abs(rr * Math.cos(ph)) * 0.9 + 2;
      starPos[i * 3 + 2] = rr * Math.sin(ph) * Math.sin(th);
      starPhase[i] = Math.random() * Math.PI * 2;
      starSize[i] = 0.6 + Math.random() * Math.random() * 2.6;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("aPhase", new THREE.BufferAttribute(starPhase, 1));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(starSize, 1));
    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aPhase;
        attribute float aSize;
        uniform float uTime;
        varying float vB;
        void main() {
          vB = 0.3 + 0.7 * pow(0.5 + 0.5 * sin(uTime * 2.4 + aPhase), 2.0);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (230.0 / -mv.z) * (0.6 + 0.8 * vB);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying float vB;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.04, d) * vB;
          gl_FragColor = vec4(vec3(0.85, 0.9, 1.0), a);
        }`,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ---- shooting star: a faint streak crossing the far sky as you scroll ----
    const shootMat = new THREE.MeshBasicMaterial({
      color: 0xcfe0ff,
      transparent: true,
      opacity: 0,
      fog: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const shoot = new THREE.Mesh(new THREE.BoxGeometry(5, 0.06, 0.06), shootMat);
    shoot.rotation.z = -0.42;
    scene.add(shoot);

    // ---- laser beam ----
    const beamCoreMat = new THREE.MeshBasicMaterial({ color: 0xffd9a0, fog: false });
    const beamCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 1, 6),
      beamCoreMat
    );
    const beamGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff5a05,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });
    const beamGlow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 1, 8),
      beamGlowMat
    );
    const beam = new THREE.Group();
    beam.add(beamGlow, beamCore);
    scene.add(beam);
    const tipLight = new THREE.PointLight(0xff7a1a, 0, 16, 2);
    scene.add(tipLight);
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0xffe7be,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });
    const flare = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6), flareMat);
    scene.add(flare);

    // ---- lead-glyph dissolve into 3D dust ----
    type LeadMote = { x: number; y: number; z: number; vx: number; vy: number; age: number; max: number };
    type LeadBit = { el: HTMLElement; gx: number; gy: number; done: boolean };
    const MOTE_MAX = 380;
    const motePos = new Float32Array(MOTE_MAX * 3);
    const moteState: LeadMote[] = [];
    let motePrevLen = 0;
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
    moteGeo.setDrawRange(0, 0);
    const moteMat = new THREE.PointsMaterial({
      color: 0xc6b99c,
      size: 0.14,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const moteCloud = new THREE.Points(moteGeo, moteMat);
    scene.add(moteCloud);

    // ---- cooling-tower steam (drifts up once the reactor is running) ----
    type Steam = { x: number; y: number; z: number; vx: number; vy: number; vz: number; age: number; max: number };
    const STEAM_MAX = 280;
    const steamPos = new Float32Array(STEAM_MAX * 3);
    const steamState: Steam[] = [];
    let steamPrevLen = 0;
    const steamGeo = new THREE.BufferGeometry();
    steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));
    steamGeo.setDrawRange(0, 0);
    const steamMat = new THREE.PointsMaterial({
      color: 0xdfe3ea,
      size: 0.42,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const steamCloud = new THREE.Points(steamGeo, steamMat);
    scene.add(steamCloud);

    let leadBits: LeadBit[] = [];
    const measureLead = () => {
      const sr = stage.getBoundingClientRect();
      const prev = new Map(leadBits.map((b) => [b.el, b.done]));
      leadBits = Array.from(
        stage.querySelectorAll<HTMLElement>(".eb-hero-foot .eb-char")
      ).map((el) => {
        const b = el.getBoundingClientRect();
        return {
          el,
          gx: b.left - sr.left + b.width / 2,
          gy: b.top - sr.top + b.height / 2,
          done: prev.get(el) ?? false, // keep dissolve state across re-measure
        };
      });
      // CSS forces .eb-char opacity:1 !important under reduced motion, so hide
      // with priority
      if (reduce) {
        leadBits.forEach((b) => b.el.style.setProperty("opacity", "0", "important"));
      }
    };

    const tmpV = new THREE.Vector3();
    const tmpW = new THREE.Vector3();
    const screenToWorld = (sx: number, sy: number, depth: number) => {
      tmpV.set((sx / w) * 2 - 1, -((sy / h) * 2 - 1), 0.5);
      tmpV.unproject(camera);
      tmpV.sub(camera.position).normalize();
      return tmpW.copy(camera.position).add(tmpV.multiplyScalar(depth));
    };

    let w = 0;
    let h = 0;
    const resize = () => {
      const r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return; // avoid NaN projection on a 0x0 stage
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(Math.round(w * SCALE * dpr), Math.round(h * SCALE * dpr), false);
      camera.aspect = w / h;
      const vh = (camera.fov * Math.PI) / 180;
      const distH = (height * 0.6 + 1.2) / Math.tan(vh / 2);
      const hHalf = Math.atan(Math.tan(vh / 2) * camera.aspect);
      const distW = (radius + 0.7) / Math.tan(hHalf);
      camera.userData.dist = Math.max(distH, distW);
      camera.updateProjectionMatrix();
      measureLead();
    };
    resize();
    if (document.fonts?.ready) document.fonts.ready.then(measureLead);
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    let raf = 0;
    let last = 0;
    // laser fires in at 45° from the upper-left corner toward the strike point
    const UP = new THREE.Vector3(0, 1, 0);
    const laserSrc = new THREE.Vector3(-height * 3.2, height * 3.2, 0);
    const strike = new THREE.Vector3(0, 0, 0);
    const tmpTip = new THREE.Vector3();
    const tmpDir = new THREE.Vector3();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 18) return;
      last = now;
      const p = reduce ? 0.92 : Math.min(1, Math.max(0, useEbStore.getState().progress));
      const descend = Math.min(1, p / 0.5);
      // GSAP drives the dust->reactor transform; scene orbits after it hardens
      const build = reduce ? 1 : morphRef.current.build;
      const solid = reduce ? 1 : morphRef.current.solid;
      const sceneSpin = Math.min(1, Math.max(0, (p - 0.84) / 0.16));

      // camera — settles into a 3/4 view during the build, then ORBITS the
      // whole scene a full turn as you keep scrolling (the scene rotates)
      const dist = (camera.userData.dist as number) || 16;
      const cp = Math.min(p, 0.84) / 0.84;
      const orb = -0.5 + cp * 0.32 + sceneSpin * Math.PI * 2;
      camera.position.set(
        Math.sin(orb) * dist,
        height * (1.02 - cp * 0.14),
        Math.cos(orb) * dist
      );
      camera.lookAt(0, height * 0.82, 0);
      camera.updateMatrixWorld();

      // the reactor holds a fixed orientation; the camera orbit turns the scene.
      // The solid mesh fades in UNDER the dust (full by solid 0.55) so it reads
      // as the dust hardening into the model, not a crossfade.
      reactor.rotation.y = 0;
      const meshOp = Math.min(1, solid / 0.55);
      for (const m of meshes) (m.material as THREE.Material).opacity = meshOp;

      // dust — erupts at the strike (p~0.5); each mote flies onto its surface
      // target (staggered), then dissolves once the mesh has hardened under it
      const airborne = smooth(Math.min(1, Math.max(0, (p - 0.5) / 0.06)));
      const dustFade = Math.min(1, Math.max(0, (1 - solid) / 0.45));
      dustMat.opacity = 0.9 * airborne * dustFade;
      dust.visible = dustMat.opacity > 0.02;
      if (dust.visible) {
        const span = 1 - DELAY_MAX;
        for (let i = 0; i < count; i++) {
          const k = i * 3;
          const pb = smooth(Math.min(1, Math.max(0, (build - delay[i]) / span)));
          const j = (1 - pb) * 0.3;
          cur[k] = lerp(home[k], targets[k], pb) + (Math.random() - 0.5) * j;
          cur[k + 1] = lerp(home[k + 1], targets[k + 1], pb) + (Math.random() - 0.5) * j;
          cur[k + 2] = lerp(home[k + 2], targets[k + 2], pb) + (Math.random() - 0.5) * j;
        }
        dustGeo.attributes.position.needsUpdate = true;
      }

      // laser — fires in at 45° from the upper-left corner down to the strike
      if (descend < 1) {
        tmpTip.copy(laserSrc).lerp(strike, descend); // leading (bright) end
        tmpDir.subVectors(tmpTip, laserSrc);
        const len = Math.max(0.01, tmpDir.length());
        beam.position.copy(laserSrc).addScaledVector(tmpDir, 0.5);
        beam.quaternion.setFromUnitVectors(UP, tmpDir.normalize());
        beam.scale.set(1, len, 1);
        beam.visible = true;
        const flick = 0.85 + Math.random() * 0.15;
        beamCoreMat.opacity = flick;
        flare.position.copy(tmpTip);
        flareMat.opacity = 0.9 * flick;
        flare.scale.setScalar(0.7 + Math.random() * 0.3);
        tipLight.position.copy(tmpTip);
        tipLight.intensity = 3.2 * flick;
      } else {
        beam.visible = false;
        // ground impact flash — the strike that kicks the dust into the air.
        // (only reachable for p>=0.5 since descend>=1, but clamp defensively)
        const impact = Math.min(1, Math.max(0, 1 - (p - 0.5) / 0.09));
        if (impact > 0.01) {
          flare.position.set(0, 0.3, 0);
          flareMat.opacity = impact * 0.95;
          flare.scale.setScalar(1 + impact * 1.8);
          tipLight.position.set(0, 0.7, 0);
          tipLight.intensity = impact * 4.5;
        } else {
          flareMat.opacity = 0;
          tipLight.intensity = 0;
        }
      }

      // lead dissolve — the beam tip's screen-Y crosses each glyph -> dust
      if (!reduce && leadBits.length) {
        tmpV.copy(laserSrc).lerp(strike, descend).project(camera);
        const beamScreenY = (-tmpV.y * 0.5 + 0.5) * h;
        const band = 26;
        for (const bit of leadBits) {
          const d = beamScreenY - bit.gy;
          if (!bit.done && d >= 0) {
            bit.done = true;
            const wp = screenToWorld(bit.gx, bit.gy, dist * 0.7);
            for (let n = 0; n < 4 && moteState.length < MOTE_MAX; n++) {
              moteState.push({
                x: wp.x + (Math.random() - 0.5) * 0.3,
                y: wp.y + (Math.random() - 0.5) * 0.3,
                z: wp.z + (Math.random() - 0.5) * 0.3,
                vx: (Math.random() - 0.5) * 0.05,
                vy: 0.02 + Math.random() * 0.03,
                age: 0,
                max: 60 + Math.random() * 50,
              });
            }
          } else if (bit.done && d < -band) {
            bit.done = false;
          }
          bit.el.style.opacity = String(d < 0 ? 1 : d < band ? 1 - d / band : 0);
        }
      }

      // update + upload the lead dust motes
      for (let i = moteState.length - 1; i >= 0; i--) {
        const mo = moteState[i];
        mo.age++;
        if (mo.age > mo.max) {
          moteState.splice(i, 1);
          continue;
        }
        mo.vy -= 0.0016;
        mo.x += mo.vx;
        mo.y += mo.vy;
      }
      // only re-upload the mote buffer when there are motes (or to clear once)
      if (moteState.length || motePrevLen) {
        for (let i = 0; i < moteState.length; i++) {
          const mo = moteState[i];
          motePos[i * 3] = mo.x;
          motePos[i * 3 + 1] = mo.y;
          motePos[i * 3 + 2] = mo.z;
        }
        moteGeo.setDrawRange(0, moteState.length);
        moteGeo.attributes.position.needsUpdate = true;
        motePrevLen = moteState.length;
      }

      // shooting star — only once the reactor is rendered; periodic faint streak
      if (solid > 0.85) {
        const cyc = (now * 0.00012) % 1; // ~8.3s period
        const sp = cyc < 0.22 ? cyc / 0.22 : -1; // streak across ~1.8s
        if (sp >= 0) {
          shoot.visible = true;
          // path kept mostly on-screen in the upper sky
          shoot.position.set(-18 + sp * 36, 15 - sp * 7, -34);
          shootMat.opacity = Math.sin(sp * Math.PI) * 0.6 * solid;
        } else {
          shoot.visible = false;
        }
      } else {
        shoot.visible = false;
        shootMat.opacity = 0;
      }

      // cooling-tower steam — emits from the (rotating) tower tops once running
      if (solid > 0.6) {
        const cos = Math.cos(reactor.rotation.y);
        const sin = Math.sin(reactor.rotation.y);
        for (const t of towerTops) {
          if (Math.random() < 0.5 * solid && steamState.length < STEAM_MAX) {
            steamState.push({
              x: t.x * cos + t.z * sin + (Math.random() - 0.5) * 0.3,
              y: t.y - 0.1,
              z: -t.x * sin + t.z * cos + (Math.random() - 0.5) * 0.3,
              vx: (Math.random() - 0.5) * 0.012,
              vy: 0.018 + Math.random() * 0.022,
              vz: (Math.random() - 0.5) * 0.012,
              age: 0,
              max: 70 + Math.random() * 70,
            });
          }
        }
      }
      for (let i = steamState.length - 1; i >= 0; i--) {
        const st = steamState[i];
        st.age++;
        if (st.age > st.max) {
          steamState.splice(i, 1);
          continue;
        }
        st.vy *= 0.99;
        st.x += st.vx;
        st.y += st.vy;
        st.z += st.vz;
      }
      if (steamState.length || steamPrevLen) {
        for (let i = 0; i < steamState.length; i++) {
          const st = steamState[i];
          steamPos[i * 3] = st.x;
          steamPos[i * 3 + 1] = st.y;
          steamPos[i * 3 + 2] = st.z;
        }
        steamGeo.setDrawRange(0, steamState.length);
        steamGeo.attributes.position.needsUpdate = true;
        steamPrevLen = steamState.length;
      }
      steamMat.opacity = 0.5 * solid;

      // per-star sparkle
      starMat.uniforms.uTime.value = now * 0.001;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      dispose();
      dustGeo.dispose();
      dustMat.dispose();
      moteGeo.dispose();
      moteMat.dispose();
      steamGeo.dispose();
      steamMat.dispose();
      groundGeo.dispose();
      (ground.material as THREE.Material).dispose();
      starGeo.dispose();
      starMat.dispose();
      shoot.geometry.dispose();
      shootMat.dispose();
      beamCore.geometry.dispose();
      beamCoreMat.dispose();
      beamGlow.geometry.dispose();
      beamGlowMat.dispose();
      flare.geometry.dispose();
      flareMat.dispose();
      renderer.dispose();
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@lunarforgespace.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <div ref={rootRef} className="eb-root">
      {/* header */}
      <header className="eb-head fixed inset-x-0 top-0 z-[60]">
        <div className="eb-wrap flex items-center justify-between py-4 sm:py-5">
          <a href="#top" className="eb-mono text-[0.72rem] font-semibold tracking-[0.2em]">
            LUNARFORGE
          </a>
          <nav className="eb-mono flex items-center gap-4 text-[0.6rem] tracking-[0.16em] sm:gap-5 sm:text-[0.62rem]">
            <span className="hidden opacity-70 sm:inline">Field Log · EB</span>
            <Link href="/neo" className="transition-opacity hover:opacity-60">
              Neo
            </Link>
            <Link href="/" className="transition-opacity hover:opacity-60">
              V.01
            </Link>
          </nav>
        </div>
      </header>

      {/* progress — laser beam */}
      <div className="eb-progress" aria-hidden>
        <div ref={beamRef} className="eb-progress-beam" />
        <div ref={tipRef} className="eb-progress-tip" />
      </div>
      <div ref={numRef} className="eb-progress-num" aria-hidden>
        00%
      </div>

      <main id="top">
        {/* ===== hero — sticky scroll-scrubbed scene ===== */}
        <section ref={trackRef} className="eb-hero-track">
          <div ref={stageRef} className="eb-hero-stage">
            <canvas ref={canvasRef} className="eb-hero-canvas" aria-hidden />
            <div className="eb-hero-inner eb-wrap text-center">
              <p className="eb-label" data-reveal>
                LunarForge — Field Log 01
              </p>
              <h1 className="eb-display mx-auto mt-5 text-[clamp(1.9rem,8vw,4.8rem)]">
                <span ref={line1Ref} className="block">
                  Where dust
                </span>
                <span ref={line2Ref} className="eb-accent block">
                  becomes power
                </span>
              </h1>
            </div>

            <div ref={footRef} className="eb-hero-foot eb-wrap">
              <p
                ref={leadRef}
                className="eb-lead eb-lead-strong mx-auto max-w-[42ch] text-center"
              >
                A field record of building the first reactor housing on the Moon —
                from regolith, by laser.
              </p>
            </div>
          </div>
        </section>

        {/* ===== mission statement ===== */}
        <section className="py-[16vh]">
          <div className="eb-wrap">
            <p className="eb-label mb-7" data-reveal>
              Statement
            </p>
            <h2
              className="eb-display max-w-[18ch] text-[clamp(1.9rem,6.4vw,6rem)] leading-[0.96]"
              data-split
            >
              We don&apos;t ship the housing. We sinter it from the dust under the
              lander.
            </h2>
          </div>
        </section>

        {/* ===== sequence ===== */}
        {beats.map((b) => (
          <section key={b.n} className="border-t border-[var(--line)] py-[13vh]">
            <div className="eb-wrap grid gap-y-7 md:grid-cols-[7rem_1fr] md:gap-x-14">
              <div data-reveal>
                <div className="eb-display text-4xl text-[var(--orange)] sm:text-5xl">
                  {b.n}
                </div>
                <div className="eb-label mt-3">{b.k}</div>
              </div>
              <div>
                <h3
                  className="eb-display max-w-[20ch] text-[clamp(1.65rem,5vw,4.2rem)] leading-[1]"
                  data-split
                >
                  {b.h}
                </h3>
                <p className="eb-lead mt-7 max-w-[46ch]" data-reveal>
                  {b.p}
                </p>
              </div>
            </div>
          </section>
        ))}

        {/* ===== gallery ===== */}
        <section className="border-t border-[var(--line)] py-[12vh]">
          <div className="eb-wrap">
            <p className="eb-label" data-reveal>
              From the surface
            </p>
            <h2
              className="eb-display mt-5 max-w-[16ch] text-[clamp(1.7rem,5vw,4rem)]"
              data-split
            >
              The cut, the dust, the shell.
            </h2>
            <div className="mt-12 flex flex-col gap-12 sm:gap-16">
              {gallery.map((g) => (
                <figure key={g.src} data-reveal>
                  <div className="eb-figure">
                    <Image
                      src={g.src}
                      alt={g.cap}
                      width={g.w}
                      height={g.h}
                      sizes="(max-width: 1280px) 100vw, 1200px"
                    />
                  </div>
                  <figcaption className="eb-figcap eb-mono text-[0.58rem] text-[var(--soft)] sm:text-[0.62rem]">
                    <span>{g.cap}</span>
                    <span>{g.loc}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ===== credentials ===== */}
        <section className="border-t border-[var(--line)] py-[12vh]">
          <div className="eb-wrap">
            <p className="eb-label" data-reveal>
              Built on proven ground
            </p>
            <div className="eb-cred mt-9" data-reveal>
              {cred.map(([k, items]) => (
                <div key={k} className="eb-cred-row">
                  <div className="eb-mono text-[0.68rem]">{k}</div>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {items.map((it) => (
                      <li key={it} className="text-[clamp(1rem,2.4vw,1.6rem)] font-medium">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== cta footer ===== */}
        <section className="border-t border-[var(--line)] py-[16vh]">
          <div className="eb-wrap">
            <p className="eb-label" data-reveal>
              The ask
            </p>
            <h2
              className="eb-display mt-6 text-[clamp(2.2rem,8.6vw,9rem)] leading-[0.92]"
              data-split
            >
              Launch the core. We build the rest.
            </h2>
            <div
              className="mt-12 flex flex-col gap-8 border-t border-[var(--line)] pt-7 sm:flex-row sm:items-end sm:justify-between"
              data-reveal
            >
              <button
                type="button"
                onClick={copyEmail}
                className={`eb-copy ${copied ? "is-copied" : ""}`}
              >
                <span className="text-[clamp(1.1rem,4.4vw,2rem)] font-semibold">
                  hello@lunarforgespace.com
                </span>
                <span className="label">{copied ? "Copied" : "Tap to copy"}</span>
              </button>
              <div className="flex items-center gap-6">
                <a href="#top" className="eb-flink">
                  Back to top
                </a>
                <Link href="/neo" className="eb-flink">
                  Neo
                </Link>
              </div>
            </div>
            <p className="eb-label mt-14">
              © 2026 LunarForge — Field Log · All figures illustrative
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

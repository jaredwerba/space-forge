"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEbStore } from "@/lib/ebStore";
import { buildPlant } from "@/lib/ebPlant";

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
  const beamRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
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

      // full headline — assembles from dust on load
      gsap.to([...l1, ...l2], {
        opacity: 1,
        duration: 0.5,
        ease: "none",
        delay: 0.3,
        stagger: { amount: 0.8, from: "random" },
      });

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
        .to(footRef.current, { autoAlpha: 0, y: -14, ease: "none" }, 0.18)
        .to(line1Ref.current, { yPercent: -26, autoAlpha: 0.16, ease: "none" }, 0.4)
        .to(line2Ref.current, { yPercent: -12, ease: "none" }, 0.48);

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

    if (reduce) lenis.destroy();

    // expose store + lenis for debugging / scene tuning
    (window as unknown as { __eb?: typeof useEbStore }).__eb = useEbStore;
    (window as unknown as { __ebLenis?: Lenis }).__ebLenis = lenis;

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      root.classList.remove("eb-js");
    };
  }, []);

  // ---- hero canvas: a laser descends with scroll, strikes the moon
  //      surface, and the dust forms into the reactor dome from the cut ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cell = 9;
    type RGB = [number, number, number];
    type Particle = { hx: number; hy: number; tx: number; ty: number; s: number; c: RGB };
    type Amb = { x: number; y: number; vx: number; vy: number };
    type Puff = { x: number; y: number; vx: number; vy: number; age: number; max: number; r: number; c: RGB };
    let particles: Particle[] = [];
    let amb: Amb[] = [];
    let surf: [number, number][] = [];
    let towers: { x: number; topY: number; r: number }[] = [];
    let puffs: Puff[] = [];
    let cx = 0;
    let surfaceY = 0;
    const rnd = (n: number) => Math.random() * n;
    const DUST: RGB = [120, 114, 100];
    const STEAM: RGB[] = [
      [150, 156, 160],
      [172, 178, 182],
      [134, 140, 145],
    ];

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = stage.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cx = w / 2;
      surfaceY = Math.round(h * 0.79);

      // build the detailed nuclear plant; each block becomes a dust particle
      const plant = buildPlant(cx, surfaceY, w, h);
      cell = plant.big;
      towers = plant.towers;
      particles = plant.blocks.map((b) => ({
        hx: rnd(w),
        hy: rnd(surfaceY),
        tx: b.x,
        ty: b.y,
        s: b.s,
        c: b.c,
      }));
      puffs = [];

      const ambCount = Math.min(110, Math.round((w * surfaceY) / 14000));
      amb = Array.from({ length: ambCount }, () => ({
        x: rnd(w),
        y: rnd(surfaceY),
        vx: (Math.random() - 0.5) * 0.22,
        vy: -0.04 - Math.random() * 0.16,
      }));

      // moon regolith band below the horizon
      surf = [];
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil((h - surfaceY) / cell);
      for (let ry = 0; ry < rows; ry++) {
        for (let rx = 0; rx < cols; rx++) {
          if (Math.random() < 0.6 - ry * 0.14) surf.push([rx * cell, surfaceY + 3 + ry * cell]);
        }
      }
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(stage);

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      useEbStore.getState().setPointer(x, y, x >= 0 && y >= 0 && x <= 1 && y <= 1);
    };
    if (finePointer) window.addEventListener("pointermove", onMove);

    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return;
      last = now;
      const s = useEbStore.getState();
      const p = reduce ? 0.9 : Math.min(1, Math.max(0, s.progress));
      ctx.clearRect(0, 0, w, h);

      // beam descends to the ground (0 -> 0.5); the plant assembles and the
      // beam sinks straight into the ground (0.5 -> 0.9)
      const descendBot = Math.min(1, p / 0.5);
      const ae = smooth(Math.min(1, Math.max(0, (p - 0.5) / 0.4)));
      const sink = ae;
      const beamBotY = surfaceY * descendBot;
      const beamTopY = surfaceY * sink;

      // moon surface — horizon + regolith
      ctx.fillStyle = "rgba(24,22,15,0.8)";
      ctx.fillRect(0, surfaceY, w, 2);
      ctx.fillStyle = "rgba(70,66,55,0.45)";
      for (const [sx, sy] of surf) ctx.fillRect(sx, sy, cell - 1, cell - 1);

      // ambient sky dust, consumed as the plant forms
      const ambA = (1 - ae) * 0.42;
      if (ambA > 0.02) {
        for (const a of amb) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.y < -cell) {
            a.y = surfaceY;
            a.x = rnd(w);
          }
          if (a.x < -cell) a.x = w + cell;
          if (a.x > w + cell) a.x = -cell;
          let dx = a.x;
          let dy = a.y;
          if (finePointer && s.pointer) {
            const ddx = a.x - s.px * w;
            const ddy = a.y - s.py * h;
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 < 16000) {
              const f = (1 - d2 / 16000) * 22 * (1 - ae);
              const d = Math.sqrt(d2) || 1;
              dx += (ddx / d) * f;
              dy += (ddy / d) * f;
            }
          }
          ctx.fillStyle = `rgba(120,114,100,${ambA})`;
          ctx.fillRect(Math.round(dx), Math.round(dy), cell - 2, cell - 2);
        }
      }

      // particles assembling into the plant — gray dust -> shaded blocks
      for (const pt of particles) {
        let x = lerp(pt.hx, pt.tx, ae);
        let y = lerp(pt.hy, pt.ty, ae);
        if (ae < 0.97) {
          const j = (1 - ae) * cell * 0.7;
          x += (Math.random() - 0.5) * j;
          y += (Math.random() - 0.5) * j;
        }
        if (finePointer && s.pointer && ae < 0.45) {
          const ddx = x - s.px * w;
          const ddy = y - s.py * h;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < 13000) {
            const f = (1 - d2 / 13000) * 20 * (1 - ae);
            const dd = Math.sqrt(d2) || 1;
            x += (ddx / dd) * f;
            y += (ddy / dd) * f;
          }
        }
        const cr = Math.round(lerp(DUST[0], pt.c[0], ae));
        const cg = Math.round(lerp(DUST[1], pt.c[1], ae));
        const cb = Math.round(lerp(DUST[2], pt.c[2], ae));
        const sz = Math.ceil(lerp(Math.max(2, cell * 0.5), pt.s, ae));
        const a = 0.42 + ae * 0.55;
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
        ctx.fillRect(Math.round(x), Math.round(y), sz, sz);
      }

      // laser — descends to the ground, then sinks into it (no fade/up)
      if (p > 0.01 && beamBotY - beamTopY > 1) {
        const flick = Math.random() > 0.12 ? 1 : 0.3;
        ctx.fillStyle = `rgba(255,90,5,${0.92 * flick})`;
        for (let yy = beamTopY; yy < beamBotY; yy += cell) {
          ctx.fillRect(Math.round(cx) - 1, Math.round(yy), 2, cell - 1);
        }
        ctx.fillStyle = `rgba(255,150,50,${flick})`;
        ctx.fillRect(Math.round(cx) - cell / 2, Math.round(beamBotY) - cell / 2, cell, cell);
        if (descendBot >= 1 && sink < 0.85) {
          ctx.fillStyle = "rgba(216,194,160,0.85)";
          for (let i = 0; i < 4; i++) {
            const ox = Math.round(cx + (Math.random() - 0.5) * cell * 4);
            const oy = Math.round(surfaceY - Math.random() * cell * 2.5);
            ctx.fillRect(ox, oy, cell - 2, cell - 2);
          }
        }
      }

      // animated steam billowing from each tower top once the plant stands
      if (ae > 0.8) {
        const intensity = (ae - 0.8) / 0.2;
        for (const tw of towers) {
          if (Math.random() < 0.5 * intensity) {
            puffs.push({
              x: tw.x + (Math.random() - 0.5) * tw.r * 1.3,
              y: tw.topY - cell,
              vx: (Math.random() - 0.5) * 0.5,
              vy: -(0.5 + Math.random() * 0.7),
              age: 0,
              max: 70 + Math.random() * 60,
              r: cell * (1 + Math.random() * 1.4),
              c: STEAM[Math.floor(Math.random() * STEAM.length)],
            });
          }
        }
      }
      for (let i = puffs.length - 1; i >= 0; i--) {
        const pf = puffs[i];
        pf.age++;
        if (pf.age > pf.max) {
          puffs.splice(i, 1);
          continue;
        }
        pf.x += pf.vx;
        pf.y += pf.vy;
        pf.vy *= 0.99;
        pf.r += 0.16;
        const lifeA = (1 - pf.age / pf.max) * 0.5;
        ctx.fillStyle = `rgba(${pf.c[0]},${pf.c[1]},${pf.c[2]},${lifeA})`;
        const rr = Math.round(pf.r);
        ctx.fillRect(Math.round(pf.x - rr / 2), Math.round(pf.y - rr / 2), rr, rr);
      }
      if (puffs.length > 200) puffs.splice(0, puffs.length - 200);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (finePointer) window.removeEventListener("pointermove", onMove);
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
              <h1 className="eb-display mx-auto mt-5 text-[clamp(2.6rem,11vw,6.5rem)]">
                <span ref={line1Ref} className="block">
                  Where dust
                </span>
                <span ref={line2Ref} className="eb-accent block">
                  becomes power
                </span>
              </h1>
            </div>

            <div ref={footRef} className="eb-hero-foot eb-wrap">
              <p className="eb-lead eb-lead-strong mx-auto max-w-[42ch] text-center">
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

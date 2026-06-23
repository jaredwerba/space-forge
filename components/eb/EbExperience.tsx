"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

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

function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  const chars: HTMLElement[] = [];
  for (const ch of text) {
    if (ch === " ") {
      const sp = document.createElement("span");
      sp.className = "eb-char-space";
      sp.setAttribute("aria-hidden", "true");
      el.appendChild(sp);
      continue;
    }
    const s = document.createElement("span");
    s.className = "eb-char";
    s.textContent = ch;
    el.appendChild(s);
    chars.push(s);
  }
  el.setAttribute("aria-label", text);
  return chars;
}

export default function EbExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // ---- smooth scroll + scroll-driven reveals ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("eb-js");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // scroll progress
    const onScroll = () => {
      const limit = lenis.limit || 1;
      const p = Math.min(1, Math.max(0, lenis.scroll / limit));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      if (numRef.current) numRef.current.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`;
    };
    lenis.on("scroll", onScroll);
    onScroll();

    const ctx = gsap.context(() => {
      // hero headline — animate in on load
      root.querySelectorAll<HTMLElement>("[data-hero]").forEach((el, i) => {
        const chars = splitChars(el);
        gsap.to(chars, {
          opacity: 1,
          duration: 0.5,
          ease: "none",
          delay: 0.25 + i * 0.18,
          stagger: { amount: 0.5, from: "random" },
        });
      });

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

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      root.classList.remove("eb-js");
    };
  }, []);

  // ---- hero cursor pixel-grain ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cell = 9;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = hero.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    const trail: { x: number; y: number; t: number }[] = [];
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      trail.push({ x, y, t: performance.now() });
      if (trail.length > 70) trail.shift();
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    let last = 0;
    const maxAge = 640;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return;
      last = now;
      ctx.clearRect(0, 0, w, h);
      // subtle animated pixel grain
      ctx.fillStyle = "rgba(24,22,15,0.30)";
      const count = Math.floor(((w * h) / (cell * cell)) * 0.03);
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * (w / cell)) * cell;
        const y = Math.floor(Math.random() * (h / cell)) * cell;
        ctx.fillRect(x, y, cell - 1, cell - 1);
      }
      // orange cursor trail — pixelated, no glow
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        const age = now - p.t;
        if (age > maxAge) {
          trail.splice(i, 1);
          continue;
        }
        const a = 1 - age / maxAge;
        const gx = Math.floor(p.x / cell) * cell;
        const gy = Math.floor(p.y / cell) * cell;
        ctx.fillStyle = `rgba(255,90,5,${a * 0.95})`;
        ctx.fillRect(gx, gy, cell - 1, cell - 1);
        ctx.fillStyle = `rgba(255,90,5,${a * 0.4})`;
        ctx.fillRect(gx - cell, gy, cell - 1, cell - 1);
        ctx.fillRect(gx + cell, gy, cell - 1, cell - 1);
        ctx.fillRect(gx, gy - cell, cell - 1, cell - 1);
        ctx.fillRect(gx, gy + cell, cell - 1, cell - 1);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
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
        <div className="eb-wrap flex items-center justify-between py-5">
          <a href="#top" className="eb-mono text-[0.72rem] font-semibold tracking-[0.2em]">
            LUNARFORGE
          </a>
          <nav className="eb-mono flex items-center gap-5 text-[0.62rem] tracking-[0.18em]">
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

      {/* progress */}
      <div ref={progressRef} className="eb-progress" aria-hidden />
      <div ref={numRef} className="eb-progress-num" aria-hidden>
        00%
      </div>

      <main id="top">
        {/* ===== hero ===== */}
        <section ref={heroRef} className="eb-hero">
          <canvas ref={canvasRef} className="eb-hero-canvas" aria-hidden />
          <div className="eb-hero-inner eb-wrap">
            <p className="eb-label" data-reveal>
              LunarForge — Field Log 01
            </p>
            <h1 className="eb-display mt-7 text-[clamp(3rem,12vw,11rem)]">
              <span data-hero className="block">
                Where dust
              </span>
              <span data-hero className="eb-accent block">
                becomes power
              </span>
            </h1>
            <div className="mt-9 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="eb-lead" data-reveal>
                A field record of building the first reactor housing on the Moon —
                from regolith, by laser, before anyone arrives.
              </p>
              <div className="eb-scrollcue eb-label" data-reveal>
                <span>Scroll</span>
                <span className="bar" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== mission statement ===== */}
        <section className="py-[18vh]">
          <div className="eb-wrap">
            <p className="eb-label mb-8" data-reveal>
              Statement
            </p>
            <h2
              className="eb-display max-w-[18ch] text-[clamp(2rem,6.5vw,6rem)] leading-[0.95]"
              data-split
            >
              We don&apos;t ship the housing. We sinter it from the dust under the
              lander.
            </h2>
          </div>
        </section>

        {/* ===== sequence ===== */}
        {beats.map((b) => (
          <section key={b.n} className="border-t border-[var(--line)] py-[16vh]">
            <div className="eb-wrap grid gap-y-10 md:grid-cols-[8rem_1fr] md:gap-x-16">
              <div data-reveal>
                <div className="eb-display text-5xl text-[var(--orange)]">{b.n}</div>
                <div className="eb-label mt-3">{b.k}</div>
              </div>
              <div>
                <h3
                  className="eb-display max-w-[20ch] text-[clamp(1.8rem,5vw,4.2rem)] leading-[0.98]"
                  data-split
                >
                  {b.h}
                </h3>
                <p className="eb-lead mt-8 max-w-[46ch]" data-reveal>
                  {b.p}
                </p>
              </div>
            </div>
          </section>
        ))}

        {/* ===== gallery ===== */}
        <section className="border-t border-[var(--line)] py-[14vh]">
          <div className="eb-wrap">
            <p className="eb-label" data-reveal>
              From the surface
            </p>
            <h2
              className="eb-display mt-6 max-w-[16ch] text-[clamp(1.8rem,5vw,4rem)]"
              data-split
            >
              The cut, the dust, the shell.
            </h2>
            <div className="mt-14 flex flex-col gap-16">
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
                  <figcaption className="eb-figcap eb-mono text-[0.62rem] text-[var(--soft)]">
                    <span>{g.cap}</span>
                    <span>{g.loc}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ===== credentials ===== */}
        <section className="border-t border-[var(--line)] py-[14vh]">
          <div className="eb-wrap">
            <p className="eb-label" data-reveal>
              Built on proven ground
            </p>
            <div className="eb-cred mt-10" data-reveal>
              {cred.map(([k, items]) => (
                <div key={k} className="eb-cred-row">
                  <div className="eb-mono text-[0.7rem]">{k}</div>
                  <ul className="flex flex-wrap gap-x-8 gap-y-2">
                    {items.map((it) => (
                      <li key={it} className="text-[clamp(1rem,2.2vw,1.6rem)] font-medium">
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
        <section className="border-t border-[var(--line)] py-[18vh]">
          <div className="eb-wrap">
            <p className="eb-label" data-reveal>
              The ask
            </p>
            <h2
              className="eb-display mt-7 text-[clamp(2.4rem,9vw,9rem)] leading-[0.9]"
              data-split
            >
              Launch the core.
              <br />
              <span className="eb-accent">We build the rest.</span>
            </h2>
            <div
              className="mt-16 flex flex-col gap-10 border-t border-[var(--line)] pt-8 sm:flex-row sm:items-end sm:justify-between"
              data-reveal
            >
              <button
                type="button"
                onClick={copyEmail}
                className={`eb-copy ${copied ? "is-copied" : ""}`}
              >
                <span className="text-[clamp(1.2rem,3vw,2rem)] font-semibold">
                  hello@lunarforgespace.com
                </span>
                <span className="label">{copied ? "Copied" : "Click to copy"}</span>
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
            <p className="eb-label mt-16">
              © 2026 LunarForge — Field Log · All figures illustrative
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

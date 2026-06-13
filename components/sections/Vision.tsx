import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { mulberry32 } from "@/lib/prng";

const rand = mulberry32(1969);

const VSTARS = Array.from({ length: 26 }, () => ({
  x: Math.round(rand() * 12000) / 10,
  y: Math.round(rand() * 1500) / 10,
  r: Math.round((rand() * 0.9 + 0.3) * 100) / 100,
  delay: Math.round(rand() * 40) / 10,
}));

const milestones = [
  {
    year: "2018",
    text: "NASA's KRUSTY validates the architecture: 10 kW of fission from a 28 kg core",
  },
  {
    year: "2026",
    text: "DLR & LZH-proven regolith sintering productized into a mobile unit; NASA reauthorization funds surface nuclear",
  },
  {
    year: "2027",
    text: "Sintering prototype rides Blue Origin's Blue Moon MK1 — first end-to-end demonstration on the surface",
  },
  {
    year: "2029",
    text: "All four classes of reactor infrastructure produced in place around a landed core",
  },
  {
    year: "2030s",
    text: "Surface fission at scale — baseload power for the lunar economy",
  },
];

function ReactorScene() {
  return (
    <svg
      viewBox="0 0 1200 300"
      className="w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="vsShield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3d9e4" />
          <stop offset="1" stopColor="#737b8c" />
        </linearGradient>
        <radialGradient id="vsCore" cx="0.5" cy="1" r="1">
          <stop offset="0" stopColor="#ffb24d" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#ff7a29" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ff7a29" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vsLight">
          <stop offset="0" stopColor="#ff9a4d" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ff9a4d" stopOpacity="0" />
        </radialGradient>
        <filter id="vsGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1200" height="300" fill="#06070f" />
      {VSTARS.map((s, i) => (
        <circle
          key={i}
          className="star"
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#cfd8ea"
          style={{ animationDelay: `-${s.delay}s` }}
        />
      ))}

      {/* ground */}
      <rect x="0" y="248" width="1200" height="52" fill="#10121a" />
      <line x1="0" y1="248" x2="1200" y2="248" stroke="#2a2d38" strokeWidth="1.5" />

      {/* reactor dome, complete and humming */}
      <ellipse cx="340" cy="252" rx="210" ry="42" fill="url(#vsLight)" />
      <path d="M 250 248 A 90 78 0 0 1 430 248 Z" fill="url(#vsCore)" />
      <path
        d="M 240 248 A 100 86 0 0 1 440 248"
        fill="none"
        stroke="url(#vsShield)"
        strokeWidth="8"
        strokeDasharray="30 6"
      />
      <path
        d="M 270 248 A 70 60 0 0 1 410 248"
        fill="none"
        stroke="#4a5160"
        strokeWidth="5"
        strokeDasharray="20 5"
        opacity="0.85"
      />
      <path
        className="laser-beam"
        d="M 247 230 A 100 86 0 0 1 340 162"
        fill="none"
        stroke="#ff7a29"
        strokeWidth="2"
        filter="url(#vsGlow)"
      />
      <circle className="blink" cx="340" cy="160" r="3" fill="#ffb24d" filter="url(#vsGlow)" />

      {/* transmission line to the base */}
      {[540, 700, 860].map((x) => (
        <g key={x}>
          <line x1={x} y1={248} x2={x} y2={196} stroke="#3a3f4c" strokeWidth="3" />
          <line
            x1={x - 14}
            y1={200}
            x2={x + 14}
            y2={200}
            stroke="#3a3f4c"
            strokeWidth="2.5"
          />
        </g>
      ))}
      <g
        fill="none"
        stroke="#5ee6ff"
        strokeOpacity="0.4"
        strokeWidth="1.4"
        className="laser-beam"
        style={{ animationDelay: "-1.5s" }}
      >
        <path d="M 340 170 C 420 200, 480 196, 540 199" />
        <path d="M 540 199 C 590 212, 650 212, 700 199" />
        <path d="M 700 199 C 750 212, 810 212, 860 199" />
        <path d="M 860 199 C 910 216, 950 220, 988 224" />
      </g>

      {/* habitat modules */}
      <rect x="960" y="218" width="90" height="30" rx="8" fill="#1a1e29" stroke="#3a3f4c" />
      <rect x="1052" y="226" width="54" height="22" rx="7" fill="#1a1e29" stroke="#3a3f4c" />
      <path d="M 980 218 A 26 20 0 0 1 1032 218" fill="#1a1e29" stroke="#3a3f4c" />
      {[
        { x: 975, y: 230, d: "-0.4s" },
        { x: 992, y: 230, d: "-1.1s" },
        { x: 1009, y: 230, d: "-1.9s" },
        { x: 1026, y: 230, d: "-0.7s" },
        { x: 1062, y: 234, d: "-1.5s" },
        { x: 1078, y: 234, d: "-2.3s" },
      ].map((w, i) => (
        <rect
          key={i}
          className="blink"
          x={w.x}
          y={w.y}
          width="7"
          height="5"
          rx="1"
          fill="#5ee6ff"
          opacity="0.85"
          style={{ animationDelay: w.d }}
        />
      ))}
    </svg>
  );
}

export default function Vision() {
  return (
    <section id="vision" className="relative scroll-mt-20 overflow-hidden py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,122,41,0.06),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          index="05"
          label="Vision"
          title={
            <>
              A reactor housed by{" "}
              <span className="ember-text">the world it powers.</span>
            </>
          }
          lead="A sintering prototype on the Moon as early as 2027 — a real surface demonstration in 18 months, not a roadmap to a roadmap. Then the four classes of reactor infrastructure, produced in place around a landed core. No new rocket, no new reactor, no new physics. We integrate — and surface fission powers humanity's permanent return to the Moon."
        />

        <Reveal delay={150}>
          <div className="panel mt-12 overflow-hidden">
            <ReactorScene />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ol className="mt-14 grid md:grid-cols-5">
            {milestones.map((m) => (
              <li
                key={m.year}
                className="relative border-l border-white/10 pb-10 pl-6 last:pb-0 md:border-l-0 md:border-t md:px-4 md:pb-0 md:pt-7"
              >
                <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-ember shadow-[0_0_10px_rgba(255,122,41,0.8)] md:-top-[5px] md:left-4" />
                <div className="font-mono text-xs tracking-[0.2em] text-ember-bright">
                  {m.year}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted md:mt-3">
                  {m.text}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-20 flex flex-col items-center gap-5 text-center">
            <p className="font-display text-2xl font-bold leading-snug tracking-tight md:text-3xl">
              <span className="metal-text">Launch the core.</span>
              <br />
              <span className="ember-glow">
                <span className="ember-text">We build the rest.</span>
              </span>
            </p>
            <a href="mailto:hello@lunarforgespace.com" className="btn btn-primary mt-2">
              Follow the Build
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

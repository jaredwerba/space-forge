import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Barcode,
  Chevrons,
  DitherBar,
  PixelDrone,
  PixelFlag,
  PixelFlower,
  StripedMoon,
} from "@/components/neo/marks";
import { DroneBlueprint, TerraformDiagram } from "@/components/neo/diagrams";
import "./neo.css";

export const metadata: Metadata = {
  title: "SpaceForge — NEO-IND / An American Industrial Revival",
  description:
    "Drones shoot lasers. Lasers charge moon dust. Dust becomes the building around a fission reactor. SpaceForge NEO — heavy industry for the new space age.",
};

const ink = "border-[var(--neo-ink)]";

export default function NeoPage() {
  return (
    <div className="neo-root min-h-screen">
      {/* ====== top operational bar ====== */}
      <header className="neo-mono text-[10px] text-[var(--neo-steel)]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-8 gap-y-1 px-4 py-3">
          <span>UNIT ID SF-NEO-02 — CONTINUOUS OPERATIONAL CONTROL</span>
          <span className="hidden lg:inline">
            INTERNAL SYSTEMS NODE / CLEARANCE REQUIRED
          </span>
          <span className="inline-flex items-center gap-3">
            <span className="neo-blink text-[var(--neo-orange)]">■</span>
            FIELD OPERATION: ACTIVE — SECTOR LUNA
            <Link href="/" className="neo-link px-1">
              [V.01]
            </Link>
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-4 pb-8">
        {/* ====== PLATE 01 — index card ====== */}
        <section className="neo-plate neo-grain p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
            <div className="neo-striped-num select-none text-[clamp(8rem,24vw,19rem)]">
              02
            </div>
            <div className="flex flex-col justify-between gap-8">
              <div className="flex flex-wrap items-start justify-between gap-8">
                <div>
                  <p className="neo-display text-3xl md:text-4xl">
                    SpaceForge
                    <br />
                    Lunar Works
                  </p>
                  <p className="neo-mono mt-4 text-[10px]">
                    Forward thinkers&nbsp;&nbsp;■ ■ ■
                  </p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <PixelFlower size={64} />
                  <p className="neo-mono text-[10px] tracking-[0.35em]">
                    23421-L002
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-8">
                <p className={`neo-mono border-2 ${ink} px-5 py-3 text-xl font-semibold`}>
                  [&nbsp;FWD&nbsp;]
                </p>
                <p className="neo-display text-right text-4xl md:text-6xl">
                  American
                  <br />
                  Dynamism
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="neo-bar neo-mono text-[11px]">Moon Lab</span>
            <span className="neo-mono text-[11px]">{"//////////"}</span>
            <span className="neo-bar neo-mono text-[11px]">
              Build the impossible
            </span>
            <span className="neo-bar neo-mono text-[11px]">
              Built to optimize human potential
            </span>
            <span className="neo-mono text-[11px]">USA</span>
            <span className="neo-display ml-auto text-4xl md:text-5xl">
              FORGE
            </span>
          </div>
        </section>

        {/* ====== PLATE 02 — laboratory masthead ====== */}
        <section className="neo-plate neo-plate--mint neo-grain p-6 md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <p className="neo-mono text-[11px] leading-relaxed">
              COMMON PRACTICE
              <br />
              FUTURE WORK
            </p>
            <div className="flex items-center gap-3">
              <PixelFlag width={34} />
              <span className="neo-bar neo-pixel px-2 py-1 text-sm">AI</span>
            </div>
          </div>
          <div className="mt-10 flex items-start justify-between gap-6">
            <span className="neo-bar neo-display px-6 py-2 text-xl tracking-tight">
              LUNA
            </span>
            <span className="neo-mono text-sm">TM</span>
          </div>
          <h1 className="neo-display mt-4 text-[clamp(2.5rem,9.5vw,7.5rem)]">
            Dust Laboratory
          </h1>
          <div className={`mt-8 grid gap-6 border-t-2 ${ink} pt-5 md:grid-cols-[1.2fr_1fr_auto_auto]`}>
            <div>
              <p className="neo-mono text-[11px] font-semibold">AI PLAYGROUND</p>
              <p className="neo-mono mt-3 max-w-xs text-[10px] leading-relaxed normal-case">
                Dust Laboratory operates at the intersection of autonomous
                laser swarms and applied fission engineering. Our research
                focuses on regolith capture, in-situ metallurgy, and printed
                reactor architecture.
              </p>
            </div>
            <div className="neo-mono text-[11px]">
              <p>{"/////////////"}</p>
              <p className="neo-display mt-2 text-4xl">2026</p>
            </div>
            <div className="neo-mono text-[11px]">
              <p>V 2.0</p>
              <p className="mt-2">UTILITY</p>
            </div>
            <Barcode height={34} label="021-928-SF" />
          </div>
        </section>

        {/* ====== PLATE 03 — America Going Nuclear ====== */}
        <section className="neo-plate neo-grain p-6 md:p-10">
          <div className="neo-stamp neo-mono right-6 top-6 hidden text-[10px] leading-tight md:block">
            REINDUSTRIALIZE
            <br />
            ■ OFF WORLD ■
          </div>
          <p className="neo-mono text-[10px]">U.S.A.</p>
          <div className="mt-6 grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="neo-display text-5xl text-[var(--neo-orange)] md:text-6xl">
                America
                <br />
                Going
                <br />
                Nuclear
              </p>
              <p className="neo-mono mt-6 max-w-sm text-[10px] leading-relaxed normal-case">
                The advanced systems unit operates at the edge of lunar
                engineering. This division develops, tests, and hardens
                next-generation reactor systems designed for long-term grid
                stability, rapid deployment, and uncompromising safety —
                printed from the Moon itself.
              </p>
              <div className="neo-mono mt-8 space-y-1 text-[10px]">
                <p>NUCLEAR ENERGY SYSTEMS</p>
                <p>SERIAL: SF-02</p>
                <p>CLEARANCE: GRID CRITICAL</p>
                <p>MADE FOR CONTINUOUS OPERATION</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-5">
              <StripedMoon size={300} className="max-w-full" />
              <p className="neo-mono text-[10px] tracking-[0.5em]">
                SPACEFORGE ®
              </p>
            </div>
          </div>
          <div className="neo-rule my-9" />
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="neo-display text-4xl md:text-6xl">
                Grid scale.
                <br />
                Moon ready.
              </p>
              <p className="neo-mono mt-5 text-[11px]">
                SYSTEM STATUS:
                <br />
                <span className="neo-bar mt-1 inline-block">
                  AMERICA GOING NUCLEAR — OFF WORLD
                </span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-5">
              <Chevrons count={4} height={46} className="text-[var(--neo-orange)]" />
              <p className="neo-mono text-right text-[10px] leading-relaxed">
                CLASSIFICATION: NATIONAL IMPORTANCE
                <br />
                FUNCTION: BASELOAD POWER
                <br />
                DEPENDENCY: CRITICAL
              </p>
            </div>
          </div>
        </section>

        {/* ====== PLATE 04 — marquee ====== */}
        <section className="neo-plate neo-plate--ink neo-marquee py-3" aria-hidden="true">
          <div className="neo-marquee-track neo-mono text-[12px]">
            {[0, 1].map((k) => (
              <span key={k} className="flex items-center">
                {[
                  "AMERICA GOING NUCLEAR",
                  "FROM DUST TO FISSION",
                  "DRONES · LASERS · MOON DUST · REACTOR",
                  "DESIGNING FOR THE NEW INDUSTRIAL AGE",
                  "MADE IN USA — DEPLOYED ON LUNA",
                ].map((t) => (
                  <span key={t} className="flex items-center">
                    <span className="px-5">{t}</span>
                    <span className="text-[var(--neo-orange)]">{"///"}</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </section>

        {/* ====== PLATE 05 — DR-01 specs ====== */}
        <section className="neo-plate neo-plate--yellow neo-grain">
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            <div className={`relative border-b-2 md:border-b-0 md:border-r-2 ${ink} p-6 md:p-8`}>
              <p className="neo-mono text-[10px]">
                DR-01 DUSTWORKS
                <br />
                AUTONOMOUS LASER DRONE UNIT
              </p>
              <DroneBlueprint className="mx-auto mt-4 w-full max-w-[440px]" />
              <p className="neo-mono mt-4 text-[10px]">
                FIELD OPS READY
                <br />
                MADE IN USA
              </p>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <h2 className="neo-display text-6xl md:text-7xl">Specs</h2>
                <Barcode height={28} />
              </div>
              {[
                {
                  h: "LASER ARRAY",
                  rows: [
                    "PHASED FIBER EMITTER: 12 KW",
                    "MELT-POOL SPECTROMETRY LOCK",
                    "SINTER RATE: 40 KG PER HOUR",
                    "COLD START CAPABILITY: MINUS 180 C",
                  ],
                },
                {
                  h: "DUST WORKS",
                  rows: [
                    "ELECTROSTATIC REGOLITH CHARGING",
                    "CAPTURE FIELD RADIUS: 6 M",
                    "COURSE DEPOSITION: 8 MM LAYERS",
                    "DUST STORM TOLERANCE: TOTAL",
                  ],
                },
                {
                  h: "COMMUNICATIONS",
                  rows: [
                    "ENCRYPTED MESH NETWORK",
                    "QUANTUM RESISTANT PROTOCOL",
                    "RANGE: 28 KM LINE OF SIGHT",
                    "LOW BANDWIDTH FALLBACK LINK",
                  ],
                },
              ].map((g) => (
                <div key={g.h} className="mt-6">
                  <p className="neo-bar neo-mono block w-full text-[11px] font-semibold">
                    {g.h}
                  </p>
                  <ul className="neo-mono mt-3 space-y-1.5 text-[11px]">
                    {g.rows.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== PLATE 06 — site overview (industrial revival) ====== */}
        <section className="neo-plate neo-grain">
          <div className="grid md:grid-cols-[56px_1.04fr_1.16fr]">
            <div className={`flex items-center justify-between gap-4 border-b-2 bg-[var(--neo-orange)] p-3 md:flex-col md:border-b-0 md:border-r-2 ${ink}`}>
              <span className="neo-mono neo-vert hidden py-2 text-[12px] font-semibold tracking-[0.3em] md:block">
                Site Overview
              </span>
              <span className="neo-mono text-[12px] font-semibold md:hidden">
                Site Overview
              </span>
              <ArrowUpRight size={30} />
            </div>

            <div className={`border-b-2 md:border-b-0 md:border-r-2 ${ink}`}>
              <div className={`neo-mono flex justify-between border-b-2 ${ink} p-4 text-[10px]`}>
                <span>SF-NEO TERRAFORM SITE</span>
                <span>P1 → NEO</span>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="neo-display text-4xl md:text-5xl">
                  An American{" "}
                  <span className="align-super text-base md:text-xl">®</span>
                  <br />
                  Industrial Revival
                </h2>
                <p className="neo-mono mt-5 text-[10.5px] leading-relaxed normal-case">
                  NEO is an adaptive terraforming system engineered for
                  automated reactor construction. Drones shoot lasers. Lasers
                  charge moon dust. Dust becomes the building. Built for
                  speed, precision, and uptime, NEO prints the structure
                  around the core to eliminate launch mass and increase
                  autonomy across the site.
                </p>
              </div>
              <div className={`grid grid-cols-2 border-t-2 ${ink}`}>
                <div className={`border-r-2 ${ink} p-5`}>
                  <p className="neo-mono text-[9px]">PRECISION ENGINEERED</p>
                  <p className="neo-display mt-2 text-3xl">Dust</p>
                  <p className="neo-mono mt-3 text-[10px] leading-relaxed normal-case">
                    A laser-charged regolith stream built for precise,
                    high-throughput deposition.
                  </p>
                </div>
                <div className="p-5">
                  <p className="neo-mono text-[9px]">REACTOR READY</p>
                  <p className="neo-display mt-2 text-3xl">Shell</p>
                  <p className="neo-mono mt-3 text-[10px] leading-relaxed normal-case">
                    Printed shielding that fits the core with zero imported
                    structure. Core from Earth, nothing else.
                  </p>
                </div>
              </div>
              <div className={`border-t-2 ${ink}`}>
                <div className="neo-mono grid w-full grid-cols-[84px_1fr_1fr] gap-2 bg-[var(--neo-ink)] px-4 py-2 text-[10px] font-semibold text-[var(--neo-paper)]">
                  <span />
                  <span>SPEC</span>
                  <span>OUTPUT</span>
                </div>
                {[
                  ["POWER", "100 KWE FISSION CORE", "CONTINUOUS DUTY"],
                  ["SWARM", "24 DR-01 UNITS", "ROUND-THE-CLOCK PRINT"],
                  ["LAYER", "8 MM REGOLITH COURSE", "1.2 M WALL PER WEEK"],
                  ["SHIELD", "4 M PRINTED SHELL", "RADIATION SAFE"],
                  ["PRECISION", "±0.5 MM REPEATABILITY", "TIGHT TOLERANCES"],
                  ["UPLINK", "LASER MESH NETWORK", "EARTH READY LINK"],
                ].map(([a, b, c], i, arr) => (
                  <div
                    key={a}
                    className={`neo-mono grid grid-cols-[84px_1fr_1fr] gap-2 px-4 py-2.5 text-[10px] ${
                      i < arr.length - 1 ? `border-b ${ink}` : ""
                    }`}
                  >
                    <span className="font-semibold">{a}</span>
                    <span>{b}</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={`neo-mono flex justify-between border-b-2 ${ink} p-4 text-[10px]`}>
                <span>NEO / SYSTEMS FOR PRODUCTION</span>
                <span>SERIAL NO. 001</span>
              </div>
              <div className="p-5 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <p className="neo-display text-2xl md:text-3xl">
                    Print-and-Power
                    <br />
                    Reactor Shell
                  </p>
                  <p className="neo-mono text-right text-[9px] leading-relaxed">
                    REAL-TIME AI CONTROL
                    <br />
                    MODULE FOR DYNAMIC
                    <br />
                    SWARM ADJUSTMENTS
                  </p>
                </div>
                <TerraformDiagram className="mt-5 w-full" />
                <div className="mt-5 flex items-end justify-between gap-4">
                  <DitherBar cols={46} rows={5} className="h-6 w-44" />
                  <p className="neo-display text-right text-xl md:text-2xl">
                    Self-Building
                    <br />
                    Failsafe Shell
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== PLATE 07 — registry grid ====== */}
        <section className={`neo-cellgrid grid-cols-12 border-2 ${ink}`}>
          <div className="neo-cell col-span-12 md:col-span-9">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className={`inline-flex items-center gap-4 border-2 ${ink} p-3`}>
                <PixelDrone size={52} />
                <div>
                  <p className="neo-display text-2xl">SF-IND</p>
                  <p className="neo-mono mt-1 text-[8.5px] font-semibold">
                    MACHINES FOR A STRONGER AMERICA
                    <br />
                    NEW YORK, NEW YORK —— U.S.A.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="neo-display text-3xl">SF-IND</p>
                <p className="neo-mono mt-1 text-[10px]">
                  SPACEFORGE MACHINES INC.
                  <br />
                  INDUSTRIAL SYSTEMS DIVISION
                </p>
                <p className="neo-bar neo-mono mt-2 inline-block text-[9px]">
                  SF-MFG-01
                </p>
              </div>
            </div>
          </div>
          <div className="neo-cell col-span-12 flex items-center justify-between gap-3 md:col-span-3">
            <div className="neo-mono text-[10px]">
              <p className="flex items-center gap-2">
                NY, NY <PixelFlag width={26} /> U.S.A.
              </p>
              <p className="mt-2">UNIT ID: SF-FU-01</p>
              <p>STATUS: ACTIVE</p>
              <p>CLEARANCE: LEVEL 3</p>
              <p>LOCATION: OFF WORLD</p>
            </div>
            <span className="neo-mono neo-vert text-[10px] tracking-[0.4em]">
              021-928
            </span>
          </div>
          <div className="neo-cell col-span-12 md:col-span-7">
            <p className="neo-mono text-[12px] font-semibold leading-relaxed">
              INSPIRED BY HARD WORK AND
              <br />
              DEDICATION TO THE CRAFT.
            </p>
          </div>
          <div className="neo-cell col-span-12 flex items-center md:col-span-5">
            <p className="neo-display text-2xl">
              Core Concepts <span className="align-super text-sm">®</span>
            </p>
          </div>
          <div className="neo-cell col-span-12 md:col-span-7">
            <p className="neo-mono text-[11px]">
              {"//////////////"} — SEA OF TRANQUILITY
              <br />
              HEAD QUARTERS — 2
            </p>
          </div>
          <div className="neo-cell col-span-12 flex items-center md:col-span-5">
            <p className="neo-mono text-[11px] font-semibold">
              CONFIDENTIAL - FIELD TESTING IN PROGRESS
            </p>
          </div>
          <div className="neo-cell neo-cell--ink col-span-12 flex items-center md:col-span-4">
            <p className="neo-pixel text-2xl">AI-OPS</p>
          </div>
          <div className="neo-cell col-span-12 flex items-center justify-between gap-4 md:col-span-8">
            <p className="neo-display text-xl md:text-2xl">
              EXPERIMENTAL
              <br />
              LABORATORY
            </p>
            <PixelFlower size={46} />
          </div>
        </section>

        {/* ====== PLATE 08 — swarm asset card ====== */}
        <section className="neo-plate neo-plate--ink neo-grain p-6 md:p-10">
          <div className="flex flex-wrap justify-between gap-10">
            <div>
              <p className="neo-mono text-[10px] text-[var(--neo-steel)]">
                D1-SP-0 <span className="ml-8">REV 2.6</span>
              </p>
              <h2 className="neo-pixel mt-4 text-[clamp(2rem,6vw,4rem)] leading-none">
                DR-01 SWARM
              </h2>
              <p className="neo-mono mt-3 text-[11px]">
                LOW GRAVITY STRATEGIC FABRICATOR
              </p>
              <p className="neo-mono mt-3 inline-block bg-[var(--neo-paper)] px-2 py-1 text-[10px] text-[var(--neo-ink)]">
                OPERATES IN PERMANENT VACUUM — ONE SIXTH G
              </p>
              <p className="neo-mono mt-5 text-[10px] text-[var(--neo-steel)]">
                PROPERTY OF{" "}
                <span className="border border-[var(--neo-paper)] px-2 py-0.5 text-[var(--neo-paper)]">
                  USA-GOV
                </span>{" "}
                FEDERAL ASSET
              </p>
            </div>
            <div className="flex flex-col items-end gap-4">
              <p className="neo-display text-2xl">
                LZ/SWM <span className="align-super text-xs">®</span>
              </p>
              <div className="border-2 border-[var(--neo-paper)] p-4 text-center">
                <PixelDrone size={76} />
                <p className="neo-pixel mt-3 text-[10px]">[SINTER_SYS]</p>
                <p className="neo-mono mt-1 text-[9px]">FIRST LIGHT</p>
              </div>
            </div>
          </div>
          <div className="my-8 h-4 w-full">
            <DitherBar cols={120} rows={4} className="h-full w-full" />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="neo-pixel text-2xl md:text-3xl">
                National Property
              </p>
              <p className="neo-mono mt-3 text-[10px] text-[var(--neo-steel)]">
                CTRL-ACCESS / RESTRICTED {">>>"}
                <br />
                USA — UNAUTHORIZED USE PROHIBITED
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="neo-pixel text-lg leading-tight">
                  HARD
                  <br />
                  VACUUM
                </p>
              </div>
              <Chevrons count={3} height={30} className="text-[var(--neo-orange)]" />
              <div className="border-2 border-[var(--neo-paper)] px-4 py-2 text-center">
                <p className="neo-display text-3xl">D1</p>
                <p className="neo-mono mt-1 text-[8px]">
                  SWARM ACTIVE SERVICE
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ====== footer ====== */}
      <footer className="neo-mono border-t border-[#3a3a3a] text-[10px] text-[var(--neo-steel)]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-5">
          <span>© 2026 SPACEFORGE LLC — ALL WORK IS OUR OWN</span>
          <span className="hidden md:inline">
            DESIGNING FOR THE NEW INDUSTRIAL AGE
          </span>
          <span className="inline-flex items-center gap-4">
            STATUS: DEPLOYED IN SECTOR — LUNA
            <Link href="/" className="neo-link px-1">
              [VERSION 01]
            </Link>
          </span>
        </div>
        <p className="mx-auto w-full max-w-[1180px] px-4 pb-5 text-[9px] opacity-70">
          SPACEFORGE IS A THEORETICAL CONCEPT COMPANY. ALL SPECIFICATIONS,
          DATES, AND FIGURES ARE ILLUSTRATIVE.
        </p>
      </footer>
    </div>
  );
}

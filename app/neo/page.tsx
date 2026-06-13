import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Chevrons, PixelFlag, PixelMoon } from "@/components/neo/marks";
import { TerraformDiagram } from "@/components/neo/diagrams";
import { UnitWireframe } from "@/components/neo/wireframe";
import "./neo.css";

export const metadata: Metadata = {
  title: "LunarForge — Build the Reactor Housing on the Moon",
  description:
    "Mobile autonomous laser sintering. Lunar regolith fused into the structural and thermal infrastructure that makes surface fission possible. Launch the core — we build the rest.",
};

const ink = "border-[var(--neo-ink)]";

const navLinks = [
  { href: "#problem", label: "Problem" },
  { href: "#system", label: "System" },
  { href: "#build", label: "Build" },
  { href: "#path", label: "Path" },
];

function SectionHead({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <p className="neo-mono text-[11px] text-[var(--neo-gray)]">
        <span className="font-semibold text-[var(--neo-orange)]">{num}</span>{" "}
        / {label}
      </p>
      <p
        aria-hidden
        className="neo-mono hidden text-[11px] tracking-[0.7em] text-[var(--neo-gray)] sm:block"
      >
        ++++++
      </p>
    </div>
  );
}

export default function NeoPage() {
  return (
    <div className="neo-root min-h-screen">
      {/* ====== header ====== */}
      <header className="neo-dark sticky top-0 z-50 border-b border-[var(--neo-ink)]">
        <div className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-6 px-6 py-3.5">
          <div className="flex items-center gap-7">
            <nav className="neo-mono hidden gap-7 text-[11px] text-[var(--neo-gray)] md:flex">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="transition-colors hover:text-[var(--neo-paper)]"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <span className="neo-mono flex items-center gap-2 text-[10px] text-[var(--neo-gray)] md:hidden">
              <PixelFlag width={22} /> U.S.A.
            </span>
          </div>
          <div className="flex items-center gap-5">
            <div className="neo-mono hidden items-center gap-4 text-[10px] text-[var(--neo-gray)] md:flex">
              <span className="flex items-center gap-2">
                <PixelFlag width={22} /> U.S.A.
              </span>
              <Link href="/" className="neo-link px-1">
                [V.01]
              </Link>
            </div>
            <a href="#top" className="flex items-center">
              <span className="neo-mono text-[13px] font-semibold tracking-[0.18em] text-[var(--neo-paper)]">
                LUNARFORGE <span className="align-super text-[8px]">®</span>
              </span>
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-[1140px] px-6">
        {/* ====== hero ====== */}
        <section className="flex flex-col items-center pb-20 pt-20 text-center md:pt-28">
          <p className="neo-mono text-[11px] text-[var(--neo-gray)]">
            LUNAR SURFACE INFRASTRUCTURE — FUELING THE FUTURE
          </p>
          <div className="mt-8 w-[210px] md:w-[270px]">
            <PixelMoon className="w-full" />
          </div>
          <h1 className="neo-display mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)]">
            Build the reactor housing{" "}
            <span className="text-[var(--neo-orange)]">on the Moon.</span>
          </h1>
          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-[var(--neo-gray)]">
            Mobile autonomous laser sintering. Lunar regolith fused into the
            structural and thermal infrastructure that makes surface fission
            possible.
          </p>
          <p className="neo-mono mt-7 text-[11px] font-semibold text-[var(--neo-orange)]">
            AMERICA GOING NUCLEAR — OFF WORLD
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#problem" className="neo-btn neo-btn--solid">
              Read the mission
            </a>
            <a href="mailto:hello@lunarforgespace.com" className="neo-btn">
              Follow the build →
            </a>
          </div>
        </section>

        {/* stats strip */}
        <section className={`grid grid-cols-2 border-y-2 ${ink} md:grid-cols-4`}>
          {[
            ["28 kg", "Actual reactor core"],
            ["$1M+", "Per kilogram to the surface"],
            ["40%+", "Of regolith is Fe · Ti · Al"],
            ["2027", "First surface demonstration"],
          ].map(([v, l], i) => (
            <div
              key={v}
              className={`px-5 py-6 ${i > 0 ? `border-l ${ink}/20 md:border-l` : ""} ${
                i === 2 ? `max-md:border-l-0` : ""
              }`}
            >
              <div className="neo-display text-3xl md:text-4xl">{v}</div>
              <div className="neo-mono mt-2 text-[10px] text-[var(--neo-gray)]">
                {l}
              </div>
            </div>
          ))}
        </section>

        {/* establishing render — black band */}
        <section className="neo-bleed neo-dark mt-14">
          <figure className="mx-auto max-w-[1280px] px-6 py-12">
            <div className="neo-mono mb-4 flex justify-between text-[10px] text-[var(--neo-gray)]">
              <span>REFERENCE SITE / AUTONOMOUS ASSEMBLY</span>
              <span className="hidden sm:inline">MARE TRANQUILLITATIS</span>
            </div>
            <Image
              src="/brand/lunar-site.jpg"
              alt="Autonomous reactor housing being assembled on the lunar surface, with a lander descending and Earth on the horizon"
              width={1600}
              height={800}
              className="block w-full"
              sizes="(max-width: 1280px) 100vw, 1232px"
            />
            <figcaption className="neo-mono mt-4 flex justify-between text-[10px] text-[var(--neo-gray)]">
              <span>CORE LANDED FROM EARTH</span>
              <span>HOUSING SINTERED FROM REGOLITH</span>
            </figcaption>
          </figure>
        </section>

        {/* ====== 01 problem ====== */}
        <section id="problem" className="scroll-mt-20 pt-24">
          <SectionHead num="01" label="The Problem" />
          <h2 className="neo-display mt-6 max-w-3xl text-4xl md:text-6xl">
            The lunar economy runs on{" "}
            <span className="text-[var(--neo-orange)]">fission.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--neo-gray)]">
            The Moon has 14-day nights, no atmosphere, and energy demands that
            solar cannot meet. Habitats, ISRU, propellant production, and
            continuous operations all require kilowatt to megawatt-class
            baseload power. Surface fission is the only credible answer — and
            every other lunar venture depends on it.
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              {
                v: "$1M+/kg",
                t: "Surface delivery cost",
                d: "Every kilogram launched, transferred, and landed on the Moon costs north of $1M. Mass is the constraint that defines the architecture.",
              },
              {
                v: "1,000s kg",
                t: "Reactor support hardware",
                d: "Shielding, containment vessels, heat exchangers, and structural housings dominate the mass budget of any surface fission system.",
              },
              {
                v: "28 kg",
                t: "Actual reactor core",
                d: "NASA's KRUSTY proved a 10 kW fission reactor runs on a 28 kg uranium core. The core is small. Everything around it is heavy.",
              },
            ].map((s) => (
              <div key={s.v} className={`border-t-2 ${ink} pt-5`}>
                <div className="neo-display text-3xl">{s.v}</div>
                <div className="neo-mono mt-2 text-[10px] font-semibold">
                  {s.t}
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--neo-gray)]">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ====== 02 insight ====== */}
        {/* ====== 02 insight — black band ====== */}
        <section className="neo-bleed neo-dark mt-24">
          <div className="mx-auto max-w-[1140px] px-6 py-20">
            <SectionHead num="02" label="The Insight" />
            <h2 className="neo-display mt-6 max-w-4xl text-4xl md:text-6xl">
              Launch what you have to launch.{" "}
              <span className="text-[var(--neo-orange)]">
                Build everything else where you need it.
              </span>
            </h2>
            <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
              <div>
                <p className="max-w-xl text-[15px] leading-relaxed text-[var(--neo-gray)]">
                  The Moon&apos;s regolith is 40%+ iron, titanium, and aluminum
                  by mass — the exact metals fission infrastructure requires.
                </p>
                <p className="neo-display mt-8 border-l-4 border-[var(--neo-orange)] pl-5 text-xl leading-snug md:text-2xl">
                  We don&apos;t ship the housing. We sinter it from the dust
                  under the lander.
                </p>
              </div>
              <figure className={`border ${ink}`}>
                <Image
                  src="/brand/regolith.jpg"
                  alt="Close-up of lunar mare regolith — fine dark dust and angular aggregate"
                  width={1200}
                  height={805}
                  className="block w-full"
                  sizes="(max-width: 768px) 100vw, 560px"
                />
                <figcaption className={`neo-mono flex justify-between border-t ${ink} px-4 py-3 text-[10px] text-[var(--neo-gray)]`}>
                  <span>FEEDSTOCK — MARE REGOLITH</span>
                  <span>40%+ FE·TI·AL</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ====== 03 system ====== */}
        <section id="system" className="scroll-mt-20 pt-24">
          <SectionHead num="03" label="The System" />
          <h2 className="neo-display mt-6 text-4xl md:text-6xl">
            Mobile autonomous laser sintering.
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--neo-gray)]">
            A single mobile system extracts metals from regolith and fuses
            them into structural and thermal hardware on the surface, in
            place, without crew.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {[
              {
                n: "01 · Extract",
                t: "Beneficiate regolith",
                d: "The mobile system traverses the surface, separating iron, titanium, and aluminum from raw lunar regolith.",
              },
              {
                n: "02 · Process",
                t: "Feedstock prep",
                d: "Metals are sized, sorted, and conditioned into a powder feedstock suitable for laser sintering at scale.",
              },
              {
                n: "03 · Sinter",
                t: "Laser fusion",
                d: "Layer-by-layer sintering builds dense structural components directly on the lunar surface.",
              },
              {
                n: "04 · Deploy",
                t: "Assemble in place",
                d: "Shielding, containment, and thermal hardware are produced on-site around the launched reactor core.",
              },
            ].map((s) => (
              <div key={s.n} className={`border-t-2 ${ink} pt-5`}>
                <p className="neo-mono text-[10px] font-semibold text-[var(--neo-orange)]">
                  {s.n}
                </p>
                <h3 className="neo-display mt-2 text-xl">{s.t}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--neo-gray)]">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
          <figure className={`mt-14 border ${ink}`}>
            <div className={`neo-mono flex justify-between border-b ${ink} px-4 py-3 text-[10px] text-[var(--neo-gray)]`}>
              <span>MS-01 / MOBILE SINTERING UNIT</span>
              <span className="text-[var(--neo-orange)] sm:hidden">SWIPE →</span>
              <span className="hidden sm:inline">SERIAL NO. 001</span>
            </div>
            <div className="overflow-x-auto">
              <UnitWireframe className="w-full min-w-[760px] p-4 md:min-w-0 md:p-6" />
            </div>
            <figcaption className={`neo-mono flex justify-between border-t ${ink} px-4 py-3 text-[10px] text-[var(--neo-gray)]`}>
              <span>FIG. 01 — SIDE ELEVATION</span>
              <span className="hidden sm:inline">SCALE 1:40 — ALL DIMENSIONS NOMINAL</span>
            </figcaption>
          </figure>
          <figure className={`mt-8 border ${ink}`}>
            <div className="overflow-x-auto">
              <TerraformDiagram className="w-full min-w-[560px] p-4 md:min-w-0 md:p-6" />
            </div>
            <figcaption className={`neo-mono flex justify-between border-t ${ink} px-4 py-3 text-[10px] text-[var(--neo-gray)]`}>
              <span>FIG. 02 — SINTERING SITE, SECTION A-A</span>
              <span className="hidden sm:inline">AUTONOMOUS · CREWLESS · CONTINUOUS</span>
            </figcaption>
          </figure>
        </section>

        {/* ====== 04 what we build ====== */}
        <section id="build" className="scroll-mt-20 pt-24">
          <SectionHead num="04" label="What We Build" />
          <h2 className="neo-display mt-6 max-w-3xl text-4xl md:text-6xl">
            Launch the core.{" "}
            <span className="text-[var(--neo-orange)]">Build the rest there.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--neo-gray)]">
            The 28 kg uranium core launches from Earth. Everything around it —
            the four classes of fission infrastructure below — we sinter on
            the surface from lunar regolith.
          </p>
          <div className="neo-cellgrid mt-12 sm:grid-cols-2">
            {[
              {
                t: "Radiation shielding",
                d: "High-density structures around the reactor core, sintered from iron-rich regolith.",
              },
              {
                t: "Containment vessels",
                d: "Pressure-rated housings using titanium-aluminum alloys extracted in situ.",
              },
              {
                t: "Stirling engine housings",
                d: "Precision thermal-cycle components matched to KRUSTY-class reactor outputs.",
              },
              {
                t: "Heat management hardware",
                d: "Radiators, heat exchangers, and thermal pathways for sustained kW-class operation.",
              },
            ].map((c, i) => (
              <div key={c.t} className="neo-cell md:p-7">
                <p className="neo-mono text-[10px] text-[var(--neo-gray)]">
                  CLASS {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="neo-display mt-2 text-2xl">{c.t}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--neo-gray)]">
                  {c.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ====== 05 proof ====== */}
        <section className="pt-24">
          <SectionHead num="05" label="Why This Works" />
          <h2 className="neo-display mt-6 max-w-3xl text-4xl md:text-6xl">
            The science is done.{" "}
            <span className="text-[var(--neo-orange)]">
              The execution is the moat.
            </span>
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-8">
            <div className={`border-t-2 ${ink} pt-5`}>
              <p className="neo-mono text-[10px] font-semibold text-[var(--neo-orange)]">
                Validated lineage
              </p>
              <h3 className="neo-display mt-2 text-2xl">
                Built on DLR &amp; LZH research
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--neo-gray)]">
                Laser sintering of lunar regolith simulants has been
                demonstrated in flight-relevant conditions by the German
                Aerospace Center (DLR) and Laser Zentrum Hannover (LZH). We
                are productizing what the labs have already proven.
              </p>
            </div>
            <div className={`border-t-2 ${ink} pt-5`}>
              <p className="neo-mono text-[10px] font-semibold text-[var(--neo-orange)]">
                Reactor lineage
              </p>
              <h3 className="neo-display mt-2 text-2xl">
                NASA KRUSTY: 10 kW on a 28 kg core
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--neo-gray)]">
                Surface fission is not theoretical. KRUSTY validated the full
                reactor architecture in 2018. The remaining gap is
                mass-efficient infrastructure delivered on the surface — which
                is what we build.
              </p>
            </div>
          </div>

          <h3 className="neo-display mt-20 max-w-3xl text-3xl md:text-4xl">
            Surface power is funded.{" "}
            <span className="text-[var(--neo-orange)]">
              Surface manufacturing is the gap.
            </span>
          </h3>
          <div className="mt-8">
            {[
              {
                y: "FY27",
                t: "NASA budget proposal",
                d: "$675M+ allocated to space nuclear — Mars technology with fission as a major focus, radioisotope power systems, and surface integration.",
              },
              {
                y: "2026",
                t: "NASA Reauthorization Act",
                d: "Three amendments specifically boosting space nuclear priorities. Bipartisan congressional support.",
              },
              {
                y: "2018",
                t: "KRUSTY validated",
                d: "NASA proved a 10 kW fission reactor runs on a 28 kg core. The power source is solved. Everything around it is not.",
              },
            ].map((r) => (
              <div
                key={r.y}
                className={`grid gap-2 border-t ${ink}/40 py-5 md:grid-cols-[110px_240px_1fr] md:gap-8`}
              >
                <div className="neo-display text-xl text-[var(--neo-orange)]">
                  {r.y}
                </div>
                <div className="neo-mono pt-1 text-[11px] font-semibold">
                  {r.t}
                </div>
                <p className="text-[13px] leading-relaxed text-[var(--neo-gray)]">
                  {r.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ====== 06 flight path ====== */}
        <section id="path" className="scroll-mt-20 pt-24">
          <SectionHead num="06" label="Flight Path" />
          <h2 className="neo-display mt-6 max-w-3xl text-4xl md:text-6xl">
            Prototype on the Moon as early as{" "}
            <span className="text-[var(--neo-orange)]">2027.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--neo-gray)]">
            A real surface demonstration in 18 months. Not a roadmap to a
            roadmap.
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-8">
            <div className={`border-t-2 ${ink} pt-5`}>
              <p className="neo-mono text-[10px] font-semibold text-[var(--neo-orange)]">
                Target surface window
              </p>
              <div className="neo-display mt-2 text-7xl md:text-8xl">2027</div>
              <h3 className="neo-display mt-4 text-2xl">
                Sintering prototype delivered to the lunar surface
              </h3>
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-[var(--neo-gray)]">
                Compact mobile sintering unit, ride-share class payload,
                autonomous beneficiation and sintering on regolith in situ.
                The first end-to-end demonstration of the system on the Moon.
              </p>
              <Chevrons count={4} height={34} className="mt-8 text-[var(--neo-orange)]" />
            </div>
            <div className="flex flex-col gap-1px">
              <div className="neo-cellgrid">
                <div className="neo-cell md:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="neo-display text-xl">
                      Blue Origin · Blue Moon MK1
                    </h3>
                    <span className="neo-bar neo-mono text-[9px]">
                      Launch partner
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--neo-gray)]">
                    MK1 is a single-launch, autonomous cargo lander on New
                    Glenn. Pathfinder mission flying this year; later serials
                    open to commercial payloads — our manifest target.
                  </p>
                  <div className={`mt-5 grid grid-cols-3 border-t ${ink}/40 pt-4`}>
                    {[
                      ["3 t", "Payload capacity"],
                      ["2027", "Surface window"],
                      ["7 m", "New Glenn fairing"],
                    ].map(([v, l]) => (
                      <div key={l}>
                        <div className="neo-display text-xl">{v}</div>
                        <div className="neo-mono mt-1 text-[9px] text-[var(--neo-gray)]">
                          {l}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="neo-cell md:p-7">
                  <p className="neo-mono text-[10px] font-semibold">
                    Why this de-risks the bet
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--neo-gray)]">
                    Funded reactor demand, commercial lander cadence, and
                    validated science align in the same 18-month window. We
                    don&apos;t need a new rocket, a new reactor, or a new
                    physics result. We integrate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== contact ====== */}
        <section className={`mt-24 border-t-2 ${ink} pb-10 pt-20 text-center`}>
          <p className="neo-mono text-[11px] text-[var(--neo-gray)]">
            GET IN TOUCH
          </p>
          <h2 className="neo-display mx-auto mt-5 max-w-3xl text-4xl md:text-6xl">
            Launch the core.{" "}
            <span className="text-[var(--neo-orange)]">
              We build the rest.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--neo-gray)]">
            Building the surface infrastructure that makes lunar fission
            possible. For partnership and technical inquiries, reach the team
            directly.
          </p>
          <a
            href="mailto:hello@lunarforgespace.com"
            className="neo-btn neo-btn--solid mt-9"
          >
            hello@lunarforgespace.com →
          </a>
          <div className="neo-mono mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-x-10 gap-y-2 text-[10px] text-[var(--neo-gray)]">
            <span>STATUS: TECHNICAL VALIDATION</span>
            <span>SECTOR: SPACE · NUCLEAR</span>
            <span>FIRST DEMO: 2027</span>
          </div>
        </section>
      </main>

      {/* ghost strip */}
      <div aria-hidden className="overflow-hidden">
        <div className="mx-auto w-full max-w-[1140px] px-6">
          <p className="neo-ghost -mb-6 text-[clamp(4rem,11vw,9.5rem)]">
            Built to power the Moon
          </p>
          <p className="neo-mono pb-6 text-[11px] font-semibold text-[var(--neo-orange)]">
            Built for the new industrial era
          </p>
        </div>
      </div>

      {/* ====== footer ====== */}
      <footer className={`neo-dark border-t-2 ${ink}`}>
        <div className="flex justify-center px-6 pb-10 pt-14">
          <span className="neo-logo-glow inline-flex p-6">
            <Image
              src="/brand/logo-full.png"
              alt="LunarForge"
              width={760}
              height={514}
              className="h-auto w-[230px] md:w-[300px]"
            />
          </span>
        </div>
        <div className="mx-auto grid w-full max-w-[1140px] gap-8 border-t border-[var(--neo-ink)] px-6 py-10 md:grid-cols-3">
          <div>
            <p className="neo-mono text-[12px] font-semibold tracking-[0.18em]">
              LUNARFORGE <span className="align-super text-[8px]">®</span>
            </p>
            <p className="neo-mono mt-2 text-[10px] leading-relaxed text-[var(--neo-gray)]">
              BUILD THE REACTOR HOUSING
              <br />
              ON THE MOON.
            </p>
          </div>
          <div className="neo-mono space-y-1 text-[10px] text-[var(--neo-gray)]">
            <p>NUCLEAR ENERGY SYSTEMS</p>
            <p>SERIAL: LF-01</p>
            <p>CLEARANCE: GRID CRITICAL</p>
            <p>MADE FOR CONTINUOUS OPERATION</p>
          </div>
          <div className="neo-mono space-y-2 text-[10px] text-[var(--neo-gray)] md:text-right">
            <p>
              <a href="mailto:hello@lunarforgespace.com" className="neo-link px-1">
                HELLO@LUNARFORGESPACE.COM
              </a>
            </p>
            <p>
              <Link href="/" className="neo-link px-1">
                [VERSION 01 — CINEMATIC]
              </Link>
            </p>
          </div>
        </div>
        <div className={`border-t ${ink}/30`}>
          <p className="neo-mono mx-auto w-full max-w-[1140px] px-6 py-4 text-[9px] text-[var(--neo-gray)]">
            © 2026 LUNARFORGE — A THEORETICAL CONCEPT COMPANY. ALL
            SPECIFICATIONS, DATES, AND FIGURES ARE ILLUSTRATIVE.
          </p>
        </div>
      </footer>
    </div>
  );
}

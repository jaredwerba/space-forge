import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const specs: [string, string][] = [
  ["Dry mass", "740 kg"],
  ["Laser head", "12 kW fiber array"],
  ["Autonomy", "48 h unsupervised"],
  ["Haul capacity", "1.4 t per sortie"],
  ["Fleet per site", "12 units"],
];

const netFeatures = [
  "24 mast-mounted emitters triangulate on a single melt pool",
  "Closed-loop control at 10 kHz — reading melt-pool spectra in real time",
  "Swarm scheduler balances mining, refining, and forging across the fleet",
  "Trained on a million simulated melts before the first real one",
];

function RoverIllustration() {
  return (
    <svg viewBox="0 0 340 170" className="w-full" aria-hidden="true">
      <defs>
        <linearGradient id="techMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9dde6" />
          <stop offset="0.5" stopColor="#9aa1b0" />
          <stop offset="1" stopColor="#62687a" />
        </linearGradient>
        <radialGradient id="techMelt">
          <stop offset="0" stopColor="#fff7e0" />
          <stop offset="0.3" stopColor="#ffc46b" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff7a29" stopOpacity="0" />
        </radialGradient>
        <filter id="techGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line x1="10" y1="150" x2="330" y2="150" stroke="#3a3f4c" strokeWidth="2" />
      <g transform="translate(60 118) scale(1.6)">
        {[0, 24, 48].map((cx) => (
          <g key={cx}>
            <circle
              cx={cx}
              cy={18}
              r={8}
              fill="#11131a"
              stroke="#4a5160"
              strokeWidth={2.5}
            />
            <circle cx={cx} cy={18} r={1.8} fill="#6b7382" />
          </g>
        ))}
        <rect x={-12} y={0} width={72} height={13} rx={4} fill="url(#techMetal)" />
        <rect
          x={-4}
          y={-12}
          width={32}
          height={14}
          rx={2}
          fill="#272c38"
          stroke="#4a5160"
          strokeWidth={1}
        />
        <rect x={38} y={-22} width={4} height={24} fill="#818899" />
        <rect
          x={30}
          y={-32}
          width={20}
          height={11}
          rx={3}
          fill="#232838"
          stroke="#5e6577"
          strokeWidth={1}
        />
        <line x1={2} y1={-12} x2={-5} y2={-24} stroke="#818899" strokeWidth={1.4} />
        <circle cx={-5} cy={-24} r={1.4} fill="#5ee6ff" opacity={0.8} />
        <circle className="blink" cx={-8} cy={4} r={2} fill="#5ee6ff" />
      </g>
      <g className="laser-beam" filter="url(#techGlow)">
        <line
          x1="124"
          y1="72"
          x2="252"
          y2="146"
          stroke="#5ee6ff"
          strokeOpacity="0.3"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="124"
          y1="72"
          x2="252"
          y2="146"
          stroke="#dffaff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <circle cx="252" cy="146" r="18" fill="url(#techMelt)" className="melt" />
      <circle cx="252" cy="146" r="2.6" fill="#fff8e8" filter="url(#techGlow)" />
      <circle
        className="ember-p"
        cx="248"
        cy="142"
        r="1.8"
        fill="#ffc46b"
        style={{ animationDelay: "-0.8s" }}
      />
      <circle
        className="ember-p"
        cx="257"
        cy="143"
        r="1.4"
        fill="#ffc46b"
        style={{ animationDelay: "-2.2s" }}
      />
    </svg>
  );
}

function MeshIllustration() {
  const nodes: [number, number][] = [
    [30, 30],
    [100, 16],
    [180, 24],
    [258, 14],
    [308, 52],
    [36, 96],
    [300, 110],
  ];
  return (
    <svg viewBox="0 0 340 170" className="w-full" aria-hidden="true">
      <defs>
        <radialGradient id="techMelt2">
          <stop offset="0" stopColor="#fff7e0" />
          <stop offset="0.3" stopColor="#ffc46b" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff7a29" stopOpacity="0" />
        </radialGradient>
        <filter id="techGlow2" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line x1="10" y1="150" x2="330" y2="150" stroke="#3a3f4c" strokeWidth="2" />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <line
            className="mesh-line"
            x1={x}
            y1={y}
            x2={170}
            y2={124}
            stroke="#5ee6ff"
            strokeOpacity="0.5"
            strokeWidth="1.1"
            style={{ animationDelay: `-${i * 0.3}s` }}
          />
          <circle cx={x} cy={y} r="3.2" fill="#aab2c4" />
          <circle cx={x} cy={y} r="6.5" fill="none" stroke="#5ee6ff" strokeOpacity="0.35" />
        </g>
      ))}
      <circle cx="170" cy="124" r="26" fill="url(#techMelt2)" className="melt" />
      <circle cx="170" cy="124" r="3" fill="#fff8e8" filter="url(#techGlow2)" />
    </svg>
  );
}

export default function Technology() {
  return (
    <section id="technology" className="relative scroll-mt-20 overflow-hidden py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-44 top-24 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(94,230,255,0.06),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          index="03"
          label="Technology"
          title={
            <>
              A fleet of rovers.{" "}
              <span className="ember-text">A mesh of light.</span>
            </>
          }
          lead="Two machines do all of it: the PROPS rover that mines, hauls, and positions — and an AI-coordinated laser network that turns photons into a factory with no walls."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="panel h-full p-7">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-steel-dim">
                Hardware / PROPS-7
              </p>
              <h3 className="font-display mt-3 text-2xl font-bold">
                The PROPS Rover
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Photonic Regolith Operations &amp; Processing System. PROPS does
                every physical job on site — excavation, hopper runs, optics
                positioning, tool changes. Lose one, and the swarm reroutes
                around it.
              </p>
              <div className="mt-5">
                <RoverIllustration />
              </div>
              <dl className="mt-5 divide-y divide-white/[0.06] border-t border-white/[0.06]">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2.5">
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-steel-dim">
                      {k}
                    </dt>
                    <dd className="font-display text-sm font-bold text-steel-bright">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={120} className="h-full">
            <div className="panel h-full p-7">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-steel-dim">
                Software / ForgeOS
              </p>
              <h3 className="font-display mt-3 text-2xl font-bold">
                The AI Laser Network
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Dozens of emitters acting as one tool. ForgeOS aims every beam,
                reads every melt pool, and runs the site as a single machine —
                no operators, no shifts, no downtime.
              </p>
              <div className="mt-5">
                <MeshIllustration />
              </div>
              <ul className="mt-5 space-y-3">
                {netFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-laser shadow-[0_0_8px_rgba(94,230,255,0.8)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="panel mt-8 overflow-hidden p-8 md:p-12">
            <p className="label-mono">Design principle</p>
            <h3 className="font-display mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              <span className="metal-text">Core from Earth.</span>{" "}
              <span className="ember-text">Everything else from the Moon.</span>
            </h3>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div>
                <div className="flex items-baseline justify-between">
                  <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-ember-bright">
                    From Earth
                  </h4>
                  <span className="font-display text-2xl font-bold text-ember-bright">
                    5%
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-[5%] rounded-full bg-[linear-gradient(90deg,#ffb24d,#ff5a05)]" />
                </div>
                <ul className="mt-5 space-y-2.5">
                  {[
                    "Sealed fission core & fuel",
                    "Control avionics & instrumentation",
                    "Precision optics & sensor seeds",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ember" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-laser">
                    From the Moon
                  </h4>
                  <span className="font-display text-2xl font-bold text-laser">
                    95%
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-[95%] rounded-full bg-[linear-gradient(90deg,#5ee6ff,#aab2c4)]" />
                </div>
                <ul className="mt-5 space-y-2.5">
                  {[
                    "Radiation shielding — sintered regolith & iron",
                    "Containment & structural frames — titanium",
                    "Heat radiators — aluminum",
                    "Foundations, anchors & roads — cast regolith",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-laser" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-10 border-l-2 border-ember pl-4 text-sm italic text-steel">
              The only part we launch is the part physics says we must.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const stats = [
  {
    value: "$1M+",
    label: "per kilogram launched, transferred, and landed on the Moon",
  },
  {
    value: "1,000s kg",
    label: "of shielding, containment, and thermal hardware per reactor",
  },
  {
    value: "28 kg",
    label: "the actual KRUSTY-class core — the only part that has to fly",
  },
  {
    value: "40%+",
    label: "of mare regolith is iron, titanium, and aluminum by mass",
  },
];

const reasons = [
  {
    title: "The core is small",
    body: "Everything around it is heavy. Shielding and structural housings dominate the mass budget of any surface fission system — and they're exactly the parts a forge can make. Only the core and its electronics fly.",
  },
  {
    title: "Delete the manifest",
    body: "Mass is the constraint that defines the architecture. At a million dollars per landed kilogram, thousands of kilograms of housing that never launch is the entire business case — the forge pays for itself on the first shield ring.",
  },
  {
    title: "Surface power is funded",
    body: "NASA's FY27 proposal puts $675M+ into space nuclear, with bipartisan reauthorization behind it. The reactors are coming. Surface manufacturing is the gap — and that is what we close.",
  },
];

export default function Why() {
  return (
    <section id="why" className="relative scroll-mt-20 overflow-hidden py-28">
      <div aria-hidden className="bg-grid absolute inset-0" />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          index="04"
          label="Why It Matters"
          title={
            <>
              The economics of{" "}
              <span className="metal-text">not launching steel.</span>
            </>
          }
          lead="Launch cost is the tax on everything in space. In-situ sintering deletes that tax for the heaviest parts of the heaviest machine the lunar economy depends on."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.value} delay={i * 90} className="h-full">
              <div className="panel h-full p-6">
                <div className="font-display text-4xl font-bold tracking-tight">
                  <span className="metal-text">{s.value}</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 120} className="h-full">
              <div className="panel h-full p-7">
                <h3 className="font-display text-lg font-bold">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {r.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="font-display mt-16 text-center text-2xl font-bold tracking-tight md:text-3xl">
            <span className="metal-text">The science is done.</span>{" "}
            <span className="ember-text">The execution is the moat.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

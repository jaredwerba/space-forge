import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const stats = [
  {
    value: "60 t",
    label: "of structure & shielding forged per reactor — none of it launched",
  },
  {
    value: "95%",
    label: "of launch mass deleted vs. an Earth-built reactor",
  },
  {
    value: "100×",
    label: "lower cost per shielded kilowatt at production scale",
  },
  {
    value: "14 days",
    label: "of lunar night crossed at full power, every month",
  },
];

const reasons = [
  {
    title: "Weight savings",
    body: "Shielding is dumb mass — tens of tons of it. It's the last thing that should ride a rocket and the first thing a forge should make. Only the core and its electronics fly.",
  },
  {
    title: "Cost reduction",
    body: "Surface delivery runs roughly a million dollars per kilogram today. Every kilogram forged on-site is a kilogram off the manifest — the forge pays for itself on the first shield ring.",
  },
  {
    title: "The pathway",
    body: "Power-rich bases beget industry: propellant plants, habitats, science at scale. And regolith is everywhere. What we prove on the Moon travels to Mars — and beyond.",
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
          lead="Launch cost is the tax on everything in space. In-situ forging deletes that tax for the heaviest parts of the heaviest machine humanity needs up there."
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
            <span className="metal-text">Learn on the Moon.</span>{" "}
            <span className="ember-text">Repeat on Mars.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

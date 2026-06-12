import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const pillars = [
  {
    title: "In-situ first",
    body: "If the Moon can make it, we don't launch it. Shielding, structure, radiators, and foundations are forged from regolith within walking distance of the reactor site.",
  },
  {
    title: "Energy before everything",
    body: "Habitats, science, mining, and propellant plants all wait on one thing: continuous power. A fission core that runs through the 14-day lunar night unlocks all of it.",
  },
  {
    title: "Built to outlast",
    body: "No weather. No oxygen. No shortcuts. Components are engineered for decades of vacuum, radiation, and 300°C thermal swings — and replaced by forging new ones.",
  },
];

export default function Mission() {
  return (
    <section id="mission" className="relative scroll-mt-20 overflow-hidden py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-44 top-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,122,41,0.07),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          index="01"
          label="Mission"
          title={
            <>
              Power is the first industry{" "}
              <span className="ember-text">of the Moon.</span>
            </>
          }
          lead="Every plan for a permanent lunar presence breaks in the same place: energy. Solar fields go dark for two weeks at a time. Batteries scale by the ton. A shielded fission reactor solves it — but launching hundreds of tons of steel from Earth is a non-starter. So we don't. SpaceForge exists to enable sustainable lunar energy by manufacturing reactor components in-situ, from the dust already underfoot."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 120} className="h-full">
              <div className="panel h-full p-7">
                <div className="font-mono text-[0.68rem] tracking-[0.25em] text-steel-dim">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display mt-4 text-xl font-bold">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

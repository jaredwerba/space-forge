import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const pillars = [
  {
    title: "The core is small",
    body: "NASA's KRUSTY proved a 10 kW fission reactor runs on a 28 kg core. Everything around it is heavy — shielding, containment vessels, heat exchangers, and structural housings dominate the mass budget. That mass should never ride a rocket.",
  },
  {
    title: "Launch what you have to launch",
    body: "Build everything else where you need it. The dust under the lander is 40%+ iron, titanium, and aluminum by mass — the exact metals fission infrastructure requires. We don't ship the housing. We sinter it.",
  },
  {
    title: "The execution is the moat",
    body: "The science is done. DLR and Laser Zentrum Hannover proved regolith laser sintering in flight-relevant conditions; KRUSTY validated the reactor in 2018. LunarForge productizes what the labs have already proven.",
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
              The lunar economy{" "}
              <span className="ember-text">runs on fission.</span>
            </>
          }
          lead="The Moon has 14-day nights, no atmosphere, and energy demands that solar cannot meet. Habitats, science, propellant production, and continuous operations all wait on kilowatt-to-megawatt baseload power — and every kilogram of a reactor's housing costs north of a million dollars to land. LunarForge's mission: build the reactor housing on the Moon, from the Moon, so surface fission can power everything else."
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

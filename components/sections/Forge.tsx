import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

type StepIconKind = "excavate" | "sort" | "extract" | "refine" | "forge";

const steps: {
  num: string;
  title: string;
  icon: StepIconKind;
  body: string;
  out: string[];
}[] = [
  {
    num: "01",
    title: "Excavate",
    icon: "excavate",
    body: "PROPS rovers strip-mine the top half-meter of ilmenite-rich mare soil — no blasting, no consumables, just buckets and patience.",
    out: ["Raw regolith"],
  },
  {
    num: "02",
    title: "Sort",
    icon: "sort",
    body: "Electrostatic and magnetic separation split every scoop by mineral. AI vision grades each batch before it reaches a furnace.",
    out: ["Ilmenite", "Anorthite", "Iron fines"],
  },
  {
    num: "03",
    title: "Extract",
    icon: "extract",
    body: "Multi-process metallurgy: molten regolith electrolysis pulls iron and silicon, hydrogen reduction frees titanium from ilmenite, and a carbothermal loop strips aluminum from anorthite.",
    out: ["Fe", "Ti", "Al", "O₂"],
  },
  {
    num: "04",
    title: "Refine",
    icon: "refine",
    body: "Laser remelting in hard vacuum — the cleanest foundry conditions in the solar system — alloys raw metal into certified feedstock.",
    out: ["Wire", "Plate", "Powder"],
  },
  {
    num: "05",
    title: "Forge",
    icon: "forge",
    body: "The laser network sinters and welds, layer by layer, through day and night. Structures too big to launch are grown in place instead.",
    out: ["Shield rings", "Trusses", "Radiators"],
  },
];

function StepIcon({ kind }: { kind: StepIconKind }) {
  const paths: Record<StepIconKind, React.ReactNode> = {
    excavate: (
      <>
        <path d="M4 20h16" />
        <path d="M6.5 9.5 12 5l3.5 3-4 5.5z" />
        <path d="M13 12l5 6" />
      </>
    ),
    sort: (
      <>
        <path d="M7 3.5v6a5 5 0 0 0 10 0v-6" />
        <path d="M7 3.5h3.4M13.6 3.5H17" />
        <path d="M9 17.5v2M12 18.5v2M15 17.5v2" />
      </>
    ),
    extract: (
      <>
        <path d="M5.5 4.5h13l-1.8 10.5a4.2 4.2 0 0 1-4.1 3.5h-1.2a4.2 4.2 0 0 1-4.1-3.5z" />
        <path d="M9 8.5c1.8 1 4.2 1 6 0" />
      </>
    ),
    refine: (
      <>
        <path d="M8.5 8.5h7l3.2 7H5.3z" />
        <path d="M9.5 12h5" />
        <path d="M12 3.5v2.5" />
      </>
    ),
    forge: (
      <>
        <path d="M9 3.5h6v4.8L12 11.5 9 8.3z" />
        <path d="M12 11.5v6" strokeDasharray="2.5 2" />
        <path d="M9 20.5h6" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[kind]}
    </svg>
  );
}

export default function Forge() {
  return (
    <section id="forge" className="relative scroll-mt-20 overflow-hidden py-28">
      <div aria-hidden className="bg-grid absolute inset-0" />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          index="02"
          label="The Space Forge"
          title={
            <>
              From gray dust to{" "}
              <span className="metal-text">gleaming metal.</span>
            </>
          }
          lead="The Space Forge lands as cargo and unfolds into an industrial site. Regolith goes in one end; certified structural metal comes out the other. Five stages, one continuous process — running through the lunar day and the lunar night."
        />
        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-1/2 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(94,230,255,0.35),rgba(255,122,41,0.35),transparent)] lg:block"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 90} className="h-full">
                <div className="panel h-full p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.65rem] tracking-[0.22em] text-steel-dim">
                      {s.num}
                    </span>
                    <span className="text-laser">
                      <StepIcon kind={s.icon} />
                    </span>
                  </div>
                  <h3 className="font-display mt-4 text-lg font-bold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {s.body}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.out.map((o) => (
                      <span key={o} className="chip">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={200}>
          <div className="panel mt-8 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:gap-6">
            <span className="shrink-0 font-mono text-xs uppercase tracking-[0.25em] text-laser">
              Byproduct
            </span>
            <p className="text-sm leading-relaxed text-muted">
              Metal is only half the yield: every tonne of refined structure
              liberates roughly 400&nbsp;kg of oxygen — breathable air and
              oxidizer, banked for the base that follows.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

type StepIconKind = "extract" | "process" | "sinter" | "deploy";

const steps: {
  num: string;
  label: string;
  title: string;
  icon: StepIconKind;
  body: string;
  out: string[];
}[] = [
  {
    num: "01",
    label: "Extract",
    title: "Beneficiate regolith",
    icon: "extract",
    body: "The mobile system traverses the surface, separating iron, titanium, and aluminum from raw lunar regolith — no blasting, no consumables.",
    out: ["Fe", "Ti", "Al"],
  },
  {
    num: "02",
    label: "Process",
    title: "Feedstock prep",
    icon: "process",
    body: "Metals are sized, sorted, and conditioned into a powder feedstock suitable for laser sintering at scale.",
    out: ["Powder", "Wire"],
  },
  {
    num: "03",
    label: "Sinter",
    title: "Laser fusion",
    icon: "sinter",
    body: "Layer-by-layer sintering builds dense structural and thermal components directly on the lunar surface, in hard vacuum.",
    out: ["Plate", "Rings", "Trusses"],
  },
  {
    num: "04",
    label: "Deploy",
    title: "Assemble in place",
    icon: "deploy",
    body: "Shielding, containment, and thermal hardware are produced on-site, around the launched reactor core — no crew required.",
    out: ["Reactor housing"],
  },
];

function StepIcon({ kind }: { kind: StepIconKind }) {
  const paths: Record<StepIconKind, React.ReactNode> = {
    extract: (
      <>
        <path d="M4 20h16" />
        <path d="M6.5 9.5 12 5l3.5 3-4 5.5z" />
        <path d="M13 12l5 6" />
      </>
    ),
    process: (
      <>
        <path d="M7 3.5v6a5 5 0 0 0 10 0v-6" />
        <path d="M7 3.5h3.4M13.6 3.5H17" />
        <path d="M9 17.5v2M12 18.5v2M15 17.5v2" />
      </>
    ),
    sinter: (
      <>
        <path d="M9 3.5h6v4.8L12 11.5 9 8.3z" />
        <path d="M12 11.5v6" strokeDasharray="2.5 2" />
        <path d="M9 20.5h6" />
      </>
    ),
    deploy: (
      <>
        <path d="M5 20.5h14" />
        <path d="M7 20.5a5 5 0 0 1 10 0" />
        <path d="M12 3.5v4M12 9.5v2" />
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
          label="The Lunar Forge"
          title={
            <>
              Mobile autonomous{" "}
              <span className="metal-text">laser sintering.</span>
            </>
          }
          lead="A single mobile system extracts metals from regolith and fuses them into structural and thermal hardware on the surface, in place, without crew. Raw dust goes in one end; reactor housing comes out the other."
        />
        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-1/2 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(94,230,255,0.35),rgba(255,122,41,0.35),transparent)] lg:block"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 90} className="h-full">
                <div className="panel h-full p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.65rem] tracking-[0.22em] text-steel-dim">
                      {s.num} · {s.label.toUpperCase()}
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
              Validated
            </span>
            <p className="text-sm leading-relaxed text-muted">
              Laser sintering of lunar regolith simulants has been demonstrated
              in flight-relevant conditions by the German Aerospace Center
              (DLR) and Laser Zentrum Hannover (LZH). We are productizing what
              the labs have already proven.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

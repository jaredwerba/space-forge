import HeroScene from "@/components/HeroScene";
import Reveal from "@/components/Reveal";

const stats = [
  { value: "28 kg", label: "The actual reactor core" },
  { value: "$1M+", label: "Per kilogram to the surface" },
  { value: "40%+", label: "Of regolith is Fe · Ti · Al" },
  { value: "2027", label: "First demo on the Moon" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0">
        <HeroScene />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,5,10,0.88)_0%,rgba(4,5,10,0.45)_42%,transparent_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(to_top,#05060c,transparent)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-28 pb-10">
        <Reveal>
          <p className="label-mono mb-5">
            Lunar surface infrastructure — est. 2026
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-display max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="metal-text">Building Power on the Moon —</span>{" "}
            <span className="ember-glow">
              <span className="ember-text">From Dust to Fission.</span>
            </span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            LunarForge turns regolith into iron, titanium, and aluminum
            structures using AI-powered lasers. Launch the core — we build the
            rest.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#forge" className="btn btn-primary">
              Explore the Forge
            </a>
            <a href="#why" className="btn btn-ghost">
              Why the Moon
            </a>
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-9">
        <Reveal delay={480}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#070910]/85 px-5 py-4 backdrop-blur-sm">
                <div className="font-display text-xl font-bold text-steel-bright sm:text-2xl">
                  {s.value}
                </div>
                <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

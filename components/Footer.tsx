import LogoMark from "./LogoMark";

const links = [
  { href: "#mission", label: "Mission" },
  { href: "#forge", label: "The Lunar Forge" },
  { href: "#technology", label: "Technology" },
  { href: "#why", label: "Why It Matters" },
  { href: "#vision", label: "Vision" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#04050a]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <a href="#top" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-sm font-bold tracking-[0.22em] text-steel-bright">
              LUNAR<span className="ember-text">FORGE</span>
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Building power on the Moon — from dust to fission. Launch the
            core; the housing is sintered in-situ from lunar regolith.
          </p>
        </div>
        <div>
          <p className="mb-4 font-mono text-[0.62rem] font-medium uppercase tracking-[0.3em] text-steel-dim">
            Sections
          </p>
          <ul className="space-y-2.5 text-sm text-muted">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-mono text-[0.62rem] font-medium uppercase tracking-[0.3em] text-steel-dim">
            Contact
          </p>
          <a
            href="mailto:hello@lunarforgespace.com"
            className="text-sm text-laser transition-colors hover:text-white"
          >
            hello@lunarforgespace.com
          </a>
          <p className="mt-6 text-xs leading-relaxed text-steel-dim">
            LunarForge is a theoretical concept company. All specifications,
            dates, and figures on this site are illustrative.
          </p>
        </div>
      </div>
      <div className="border-t border-white/[0.06] px-6 py-5">
        <p className="mx-auto max-w-6xl font-mono text-[0.65rem] uppercase tracking-[0.2em] text-steel-dim">
          © 2026 LunarForge — Launch the core. We build the rest.
        </p>
      </div>
    </footer>
  );
}

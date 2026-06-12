import LogoMark from "./LogoMark";

const links = [
  { href: "#mission", label: "Mission" },
  { href: "#forge", label: "The Forge" },
  { href: "#technology", label: "Technology" },
  { href: "#why", label: "Why It Matters" },
  { href: "#vision", label: "Vision" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#05060c]/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-sm font-bold tracking-[0.22em] text-steel-bright">
            SPACE<span className="ember-text">FORGE</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#vision"
          className="btn btn-primary btn-sm hidden sm:inline-flex"
        >
          Follow the Build
        </a>
      </div>
    </header>
  );
}

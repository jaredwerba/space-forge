# LunarForge — Building Power on the Moon

Landing page for **LunarForge**, a theoretical space infrastructure company building
the housing for the first operational fission reactor on the Moon — radiation
shielding, containment vessels, Stirling housings, and radiators sintered in-situ
from lunar regolith by mobile autonomous lasers.

> *Launch the core. We build the rest.*

**LunarForge is a fictional concept.** All specifications, dates, and figures are illustrative.
Two design directions live side by side: the cinematic v1 at `/` and the
brasshands-inspired NEO-industrial version at `/neo`.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, fully static output)
- [Tailwind CSS v4](https://tailwindcss.com) + custom design system in `app/globals.css`
- Hand-built animated SVG scenes (laser rovers, melt pools, starfields) — no image assets
- TypeScript

## Development

```bash
npm install
npm run dev      # development server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Structure

```
app/
  layout.tsx            # fonts (Space Grotesk / Inter / IBM Plex Mono), metadata
  page.tsx              # section assembly
  globals.css           # design tokens, panels, buttons, keyframe animations
components/
  HeroScene.tsx         # animated Moon-surface SVG: rovers, lasers, reactor dome
  Nav.tsx / Footer.tsx / Reveal.tsx / SectionHeading.tsx / LogoMark.tsx
  sections/             # Hero, Mission, Forge, Technology, Why, Vision
lib/
  prng.ts               # deterministic PRNG for SSR-safe starfields
```

## Deployment

Hosted on [Vercel](https://vercel.com) (project: `space-forge`). Changes are tracked
on GitHub; deploys go to Vercel.

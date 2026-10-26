# Dzenan Kusi - Engineering Portfolio

Bilingual (EN/DE) engineering portfolio: embedded systems, Industrial IoT, infrastructure, monitoring and research IT.
Static Next.js site with interactive SVG demos, hosted on GitHub Pages at <https://dzenan29.github.io/portfolio/>.

> Before publishing, go through **[VERIFICATION.md](VERIFICATION.md)** - it lists every statement that still needs your confirmation.

## Stack

- **Next.js 16** (App Router, `output: "export"`) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS 4** with design tokens in `src/app/globals.css` (dark first, full light theme)
- Hand-written **SVG** for all diagrams and charts - no chart, animation or 3D libraries
- Own lightweight i18n (typed dictionaries) - works with static hosting, no middleware
- **Vitest** for logic and content checks, **Playwright** for user journeys
- Fonts: Geist / Geist Mono, self-hosted at build time via `next/font`

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /en/ or /de/
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Static export to `out/` (+ `scripts/postbuild.mjs`) |
| `npm start` | Serves `out/` on http://localhost:4173 |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint |
| `npm test` | Unit tests (gauge math, alert logic, health check, content integrity, i18n) |
| `npm run test:e2e` | Playwright against `out/` (build first). Uses the installed Microsoft Edge; set `PW_CHANNEL=chromium` after `npx playwright install chromium` elsewhere |
| `npm run check` | typecheck + lint + unit tests + build |
| `node scripts/og-image.mjs` | Regenerates `public/og.png` (social preview) |
| `node scripts/screenshots.mjs <url> <dir> /en/ /de/lab/` | Full-page screenshots (`WIDTHS=1440,390 THEME=light`) |

## Project structure

```
src/
  app/
    [locale]/            all pages: home, projects, projects/[slug], expertise, about, experience, lab, contact
    (root)/              "/" - picks EN/DE (stored choice → browser language → EN)
    global-not-found.tsx 404 page
    sitemap.ts robots.ts
    globals.css          design tokens, motifs (grid, ticks), motion with reduced-motion guards
  components/
    hero/                SignalFlowVisualization (interactive sensor → alert chain)
    home/                homepage sections (domains, featured work, end-to-end, infrastructure …)
    lab/                 InteractiveGauge, SimulatedSensorDashboard, InfrastructureTopology, AvailabilityFlow
    projects/            cards, filterable explorer, depth toggle
    diagrams/            ArchitectureDiagram, Sparkline
    layout/              header, footer, language + theme switcher
  content/               ALL FACTS LIVE HERE - see below
  i18n/                  locales, routing helpers, dictionaries (en.ts is the source of truth, de.ts is typed against it)
  lib/                   pure logic: gauge.ts, alerts.ts, healthcheck.ts, contact.ts, projects.ts, metadata.ts
tests/unit, tests/e2e
scripts/                 postbuild, local static server, OG image, screenshots
```

## Editing content

Content is separated from presentation. You normally only touch `src/content/`:

| File | Contains |
| --- | --- |
| `site.ts` | Name, location, email, GitHub, LinkedIn, CV link. Set a value to `null` to hide it everywhere. |
| `projects.ts` | Project inventory (case studies, capabilities, in-development, planned). |
| `experience.ts` | Positions, education, languages. |
| `expertise.ts` | Homepage domains and the expertise page (with evidence level per technology). |
| `narrative.ts` | About text, principles, the SENSE → OPERATE pipeline, process steps. |

Every text is `{ en: "...", de: "..." }`. TypeScript fails the build if a language is missing.

### Adding a project

1. Add an object to `projects` in `src/content/projects.ts` with a unique `slug`.
2. Choose `tier` (`flagship` = full case study and homepage candidate, `supporting`, `capability`) and an honest `status`:
   `completed` · `operational` · `in-development` · `planned` · `verification-required`.
3. Set `publish: true` only when the text is cleared for the public. `verification-required` entries are never shown.
4. Optional sections render only when present: `challenge`, `approach`, `architecture`, `implementation`, `demo`, `challenges`, `outcomes`, `images`, `related`.
   Mark stages/blocks that do not exist yet with `planned: true`.
5. `featured: true` puts it on the homepage (first six; the first gets the large card).
6. Run `npm test` - it checks slugs, links between projects, bilingual text and that no private IPs, internal domains or excluded names slipped in.

Planned or in-development work is automatically kept out of the flagship section.

### Replacing images

Put files in `public/` and reference them as `/file.webp` in `images` (width/height required to avoid layout shift).
Prefer WebP, ~1000-1600 px wide. Only use photos/screenshots you're allowed to publish - no internal hostnames, IPs, logs or colleagues.

### Languages

UI strings: `src/i18n/dictionaries/en.ts` and `de.ts`. Add a key to `en.ts` first - `de.ts` will not compile until it has the same key, and a unit test double-checks completeness.
Adding a third language: extend `locales` in `src/i18n/config.ts`, add a dictionary and add the new key to every `{ en, de }` object.

Routes are identical in both languages (`/en/projects/…`, `/de/projects/…`) so switching language always lands on the equivalent page without server rewrites.

## Contact form

The site is static, so there is **no** built-in mail backend - and no fake form. By default the contact page lists direct channels only.
To enable the form, create a free form endpoint (e.g. [Formspree](https://formspree.io)) and set `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` (locally in `.env.local`, in CI as repository variable `CONTACT_FORM_ENDPOINT`).
The form validates input, has a honeypot against bots, only reports success after the service confirms delivery, and never contains secrets.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` runs on every push to `master`: typecheck → lint → unit tests → build with `NEXT_PUBLIC_BASE_PATH=/portfolio` → publish `out/` to the `gh-pages` branch, which GitHub Pages already serves.

- Custom domain later? Set `NEXT_PUBLIC_BASE_PATH=""` and `NEXT_PUBLIC_SITE_URL=https://your-domain` in the workflow and add a `public/CNAME`.
- Any other static host (Netlify, Vercel, Cloudflare Pages, nginx): `npm run build` and upload `out/`.
- `scripts/postbuild.mjs` adds `.nojekyll` (otherwise GitHub Pages hides `_next/`) and flattens Next.js segment-prefetch files so client navigation works without rewrites.

## Quality notes

- **Accessibility:** semantic landmarks, skip link, visible focus, keyboard-operable demos, status never conveyed by color alone, text alternatives for diagrams, `prefers-reduced-motion` respected (no particles or reveal animations).
- **Performance:** static HTML, no runtime third-party requests, fonts self-hosted, images with fixed dimensions, small client components only where interaction needs them. No Lighthouse score is claimed here - measure with `npx lighthouse https://dzenan29.github.io/portfolio/en/`.
- **Privacy:** no trackers, no cookies. All live-looking values are generated in the browser and labeled as simulated.

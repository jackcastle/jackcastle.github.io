# Portfolio Site — Design Spec

**Owner:** Giacomo Castello
**Date:** 2026-04-20
**Status:** approved (spec only — implementation plan lives in a separate `plan.md`)
**Target URL:** `https://jackcastle.github.io/`
**Repository:** `jackcastle.github.io` (GitHub Pages user site, publishes at domain root)

---

## 1. Goals & constraints

Personal portfolio site for a senior advertising/martech manager with a hybrid performance-marketing + data-engineering profile. Supports job search, establishes online presence, hosts a downloadable CV, and serves as a pointer to three showcase projects.

**Hard constraints:**
- Zero external cost (GitHub Pages + default `*.github.io` subdomain; no custom domain in v1).
- English only (Italian can come later).
- Lighthouse ≥ 95 across Performance, Accessibility, Best Practices, SEO.
- WCAG 2.1 AA as baseline.
- No tracking/analytics in v1.
- No external services with billing risk.

**Out of scope (v1):** blog/CMS, multi-language, newsletter, analytics, user-facing animations beyond the signature reveal-on-load, custom domain.

---

## 2. Design inventory (source of truth)

The visual design was produced in Claude Design and exported as a bundle to `design-source/github-page/`. The bundle contains:

- `README.md` — handoff notes (read the chat, then `index.html`).
- `chats/chat1.md` — the conversation that produced the design; the final direction is "first draft" (showy terminal — ASCII banner, traffic lights, heatmap, typed prompts, rainbow tokens) after user reverted an earlier "dial it back" attempt.
- `project/index.html` — shell page loading React 18 + Babel Standalone from CDN + two `.jsx` variants.
- `project/styles.css` — ~350 lines of hand-written CSS, heavy use of CSS custom properties and `color-mix()`.
- `project/variant-shell.jsx` — V1: terminal / `~/cv` aesthetic.
- `project/variant-man.jsx` — V2: Unix man-page aesthetic with sidebar TOC + syntax-highlighted tokens.
- `project/cv-data.js` — parsed CV data (name, summary with `<strong>` emphasis preserved, 6 stats, 7 competencies, 3 experience entries, 3 projects, 6 stack groups, education, certifications, languages, soft skills).
- `project/uploads/Giacomo_Castello_CV_Corporate.pdf` — the CV file to surface as a download.

**Aesthetic:** terminal / monospace / developer-flavored. Two selectable variants in the prototype; this spec retires V1/V2 runtime toggling (see §4).

**Palette — dark (default):**

| Token | Value |
|---|---|
| `--bg` / `--bg-1` / `--bg-2` / `--bg-3` | `#0a0d10` / `#0d1117` / `#151a21` / `#1c232c` |
| `--border` / `--border-soft` | `#222b35` / `#1a2028` |
| `--fg` / `--fg-dim` / `--fg-muted` / `--fg-hi` | `#c9d1d9` / `#8b949e` / `#6e7781` / `#f0f6fc` |
| `--accent` / `--accent-2` / `--accent-d` | `#7ee787` / `#56d364` / `#2ea043` |
| `--amber` / `--ember` / `--cyan` / `--violet` / `--red` | `#e3b341` / `#f78166` / `#79c0ff` / `#d2a8ff` / `#ff7b72` |
| `--scan` (scanline overlay) | `rgba(126, 231, 135, 0.03)` |

**Palette — light:**

| Token | Value |
|---|---|
| `--bg` / `--bg-1` / `--bg-2` / `--bg-3` | `#f6f3ec` / `#efe9db` / `#e6dfce` / `#d9cfb8` |
| `--border` / `--border-soft` | `#b8ac8e` / `#cfc2a2` |
| `--fg` / `--fg-dim` / `--fg-muted` / `--fg-hi` | `#1a1a1a` / `#5a5447` / `#7a7360` / `#000` |
| `--accent` / `--accent-2` / `--accent-d` | `#2d7a38` / `#1f5a28` / `#163d1c` |
| `--amber` / `--ember` / `--cyan` / `--violet` / `--red` | `#8a5a10` / `#b2401a` / `#0a5b8a` / `#6c3ab1` / `#b91c1c` |
| `--scan` | `rgba(0, 0, 0, 0.02)` |

**Typography:** JetBrains Mono (display) + IBM Plex Mono (body). Font toggle from the prototype is retired. Base 14px, body line-height 1.55, shell screen line-height 1.65, `font-feature-settings: "liga" 1, "calt" 1`.

**Layout:** `.stage` max-width 1240px, centered, 20px padding. Sticky top bar with blurred background. Single `@media (max-width: 900px)` breakpoint collapses:
- `.sh-stats` 6-col → 2-col
- `.mn-metric-grid` 6-col → 2-col
- `.sh-two-col` → single col
- `.sh-stack-row` / `.mn-stack-row` → stacked
- `.sh-ls-row` → stacked
- `.mn-job` → single col, no timeline rail, periods left-aligned
- `.mn-root` → sidebar drops above content

**Effects:** fixed scanline overlay (`repeating-linear-gradient`, `mix-blend-mode: overlay`, opacity 0.7 dark / 0.4 light); radial background gradient accenting top; drop shadow on shell/man containers; blinking caret (`@keyframes blink`); `.sh-reveal` staggered fade-up.

**Interactions in source:**
- Variant toggle (shell ↔ man).
- Theme toggle (dark ↔ light).
- Font toggle (5 monospace choices).
- Tweaks panel (iframe-host `postMessage` integration — Claude-Design harness only, strip in production).
- Live clock in topbar (ticks every second — drop in production).
- Typed prompts with blinking caret.
- Reveal-on-load: each section fades up on a staggered timeout.
- Man-page scrollspy: active TOC entry tracks scroll position.

**Responsive:** mobile-first inherited from source. Single breakpoint (900px). No separate tablet style — natural fluid scale between.

**Accessibility in source:** ASCII pre-blocks marked `aria-hidden`, heatmap has `aria-label`. Everything else leans on semantic defaults; will need hardening (real h1/h2/h3 hierarchy, focus styles, reduced-motion gating).

---

## 3. Site map

| Route | Purpose | Aesthetic |
|---|---|---|
| `/` | Home — full single-page CV in shell variant | Shell |
| `/projects/css-attribution-exposure/` | Case study 1 | Man page |
| `/projects/ai-feed-enrichment/` | Case study 2 | Man page |
| `/projects/mta-data-lake/` | Case study 3 | Man page |
| `/cv/Giacomo_Castello_CV_Corporate.pdf` | Direct download | — |
| `/404` | Not found | Shell (minimal) |

No separate About or Contact pages — both are sections of `/`.

---

## 4. Architecture decisions

1. **Hybrid layout model (approved option C).** Home is a complete shell-variant CV that functions as hero + about + projects overview + contact on one scroll. Three project detail pages in the man-page aesthetic house deep case-study content (problem → approach → stack → outcome). V1/V2 runtime toggle is retired: shell for home, man for projects.
2. **Theme toggle preserved** (dark default, light available). Theme choice persists in `localStorage`.
3. **Font toggle removed.** Locked to JetBrains Mono (display) + IBM Plex Mono (body).
4. **Reveal-on-load: session-gated + reduced-motion-aware.** First visit plays the staggered reveal; subsequent visits in the same tab/session render instantly. `prefers-reduced-motion: reduce` always renders instantly.
5. **No client-side framework runtime.** React/Babel CDN from source is replaced with Astro components (static HTML at build) plus tiny TS islands for the handful of interactive bits.
6. **Tokens in CSS vars + Tailwind v4 `@theme`.** Layout/spacing utilities come from Tailwind; tokens and the CSS that uses `color-mix()` / pseudo-element overlays stay in hand-written CSS.
7. **Content collection for projects.** MDX under `src/content/projects/`, typed schema, one dynamic route.

---

## 5. Project structure

```
jackcastle.github.io/
├── .github/workflows/deploy.yml
├── .gitignore                      # includes design-source/, dist/, node_modules/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── README.md
├── public/
│   ├── cv/Giacomo_Castello_CV_Corporate.pdf
│   ├── favicon.svg
│   ├── og-image.png                # added in phase 6
│   └── robots.txt
├── design-source/                  # exported Claude Design bundle (reference; gitignored)
│   └── github-page/...
├── docs/
│   └── superpowers/specs/2026-04-20-portfolio-site-design.md   # this file
└── src/
    ├── layouts/
    │   ├── BaseLayout.astro        # <html>, <head>, topbar, theme init inline script
    │   └── ManPageLayout.astro     # man-page chrome + sidebar TOC
    ├── components/
    │   ├── TopBar.astro
    │   ├── ThemeToggle.astro
    │   ├── shell/
    │   │   ├── ShellWindow.astro
    │   │   ├── Prompt.astro
    │   │   ├── MOTD.astro
    │   │   ├── IdentityBlock.astro
    │   │   ├── StatsGrid.astro
    │   │   ├── Heatmap.astro
    │   │   ├── CompetenciesLs.astro
    │   │   ├── ExperienceLog.astro
    │   │   ├── ProjectCard.astro
    │   │   ├── StackRows.astro
    │   │   └── ContactPanel.astro
    │   └── man/
    │       ├── Sidebar.astro
    │       ├── TocLink.astro
    │       ├── Lineify.astro
    │       └── TokenHighlight.astro
    ├── content/
    │   ├── config.ts
    │   └── projects/
    │       ├── css-attribution-exposure.mdx
    │       ├── ai-feed-enrichment.mdx
    │       └── mta-data-lake.mdx
    ├── data/cv.ts
    ├── scripts/
    │   ├── theme-init.ts           # inline in <head> — no FOUC
    │   ├── theme-toggle.ts
    │   ├── reveal.ts
    │   └── scrollspy.ts
    ├── styles/global.css           # @theme + tokens + design CSS
    └── pages/
        ├── index.astro
        ├── 404.astro
        └── projects/[...slug].astro
```

---

## 6. Tech choices

| Dependency | Version target | Role |
|---|---|---|
| `astro` | 5.x | Static site builder |
| `@astrojs/mdx` | latest | Case-study content |
| `@astrojs/sitemap` | latest | `/sitemap-index.xml` |
| `tailwindcss` | 4.x | Utility CSS |
| `@tailwindcss/vite` | 4.x | Tailwind v4 Vite plugin |
| `@fontsource-variable/jetbrains-mono` | latest | Self-host display font |
| `@fontsource/ibm-plex-mono` | latest | Self-host body font (weights 400, 500, 600, 700) |
| `typescript` | 5.x | Type safety |

**Explicitly not used:** React / Vue / Svelte / Preact integrations, Google Fonts CDN, MDX syntax-highlight libs (tokens are regex-driven, same approach as source), CMS tooling.

**Scaffold:** `npm create astro@latest` → minimal template → add integrations. No pre-built portfolio template — they impose opinions we'd undo.

---

## 7. Design porting strategy

**Tailwind v4 `@theme` block** defines font-family tokens referencing the CSS variables. Layout / spacing / flex / grid use Tailwind utilities.

**CSS custom properties** hold all colors. Theme swap = `html[data-theme="light"]` overrides. Tailwind color utilities reference the vars via Tailwind v4's `@theme` (e.g. `--color-accent: var(--accent)`).

**Things that stay in hand-written CSS** because Tailwind expresses them poorly or not at all:
- Scanline overlay (fixed pseudo-element with `mix-blend-mode`).
- Radial background gradient on body.
- `color-mix(in oklab, ...)` uses (accent-tinted borders, transparent chip backgrounds).
- Blinking caret keyframes, reveal keyframes, staggered reveal classes.
- Terminal chrome (traffic-light dots, ASCII art styling).
- Man-page line-block layout (42px gutter + border-right + `user-select: none`).

**Typography loading:**
- `@fontsource-variable/jetbrains-mono` and `@fontsource/ibm-plex-mono` imported once in `global.css` with `font-display: swap` (Fontsource default).
- No preconnect / no external font fetch.

**Vanilla JS from source:**
- Clock in topbar → **dropped**.
- Variant toggle → **removed** (home is shell, projects are man).
- Font toggle → **removed**.
- Tweaks panel + `postMessage` → **removed** (Claude-Design harness only).
- Typed prompt animation → **reimplemented in pure CSS** (`@keyframes steps()` char reveal + caret blink). If CSS-only proves awkward, fall back to a 20-line TS helper.
- Reveal fade-up → **reimplemented** as a session-gated, motion-aware TS island that walks `[data-reveal-delay]` elements.
- Theme toggle → **reimplemented** as two tiny scripts: `theme-init.ts` inline in `<head>` (no FOUC), `theme-toggle.ts` for the button click.
- Man-page scrollspy → **reimplemented** with `IntersectionObserver`.
- Heatmap → **static at build** (deterministic seed already in source; same values baked into the generated HTML).

---

## 8. Page-by-page content outline

### Home (`/`) — shell variant

Order preserved from source. Each section kicks off with an animated prompt + blinking caret, then reveals the output.

1. **MOTD** — ASCII banner (`GIACOMO`), last-login line, load-avg joke (`2.4M, 50+, 13x`).
2. **`$ whoami`** → Identity block. ASCII avatar + name + role + subrole (`Global E-commerce`) + location / mode / email / phone + inline tags (`uid=1990`, `groups=remote,eu`, `shell=/bin/zsh`, `license=B`).
3. **`$ cat summary.md`** → Executive summary (~80 words, `<strong>` on €2.4M, 8 platforms, 50+ markets, +38% YoY, €41M→€57M, co-leading the marketing function, 5 direct reports).
4. **`$ ./stats --blended`** → 6 stat cards (`€2.4M` paid_media_peak, `8` ad_platforms, `50+` markets, `+38%` yoy_revenue_growth, `~13x` blended_roas, `5` direct_reports) + activity heatmap.
5. **`$ ls core_competencies/`** → 7 `drwxr-xr-x`-style rows.
6. **`$ git log --oneline experience`** → 3 jobs (Giglio.com 2021–present, Giambrone & Partners 2018–2021, Previous Company 2015–2018) with commit-hash badges, bullets with `<strong>` emphasis preserved.
7. **`$ find projects/ ...`** → 3 project cards. **Each card links to its detail page** (source prototype didn't link — this is the multi-page bridge). Star badges: `FR·DE`, `+4pts ROAS`, `designed`.
8. **`$ stack --all`** → 6 stack rows with chips.
9. **`$ cat education.txt certifications.txt`** → 2-col: education + languages | certifications + soft skills.
10. **`$ contact --print`** → email (mailto), phone, location/mode, `available upon request` refs line.
11. **Trailing blinking prompt.**

CV PDF download is a topbar button (not inline, to keep the flow clean).

### Project detail pages — man variant

Layout: left sidebar (fixed on desktop, stacked on mobile) with `CASTELLO(1) · General Commands Manual`, card with title/role/metadata, TOC with scrollspy, footer with build date.

Man-page body structure per project:

1. **`NAME`** — `project-slug — one-line pitch`.
2. **`SYNOPSIS`** — fake CLI signature (`castello --markets 50+ ...`-style tokenized line).
3. **`DESCRIPTION`** — 2–3 paragraphs, plain prose, token-highlighted.
4. **`PROBLEM`** — the business context and what hurt.
5. **`APPROACH`** — what you built, phrased as steps.
6. **`STACK`** — chip rows grouped (Data, Infra, Code, Models).
7. **`OUTCOME`** — measured results, A/B config, validation method.
8. **`SEE ALSO`** — link back to `/` and to GitHub/LinkedIn.

Home "Selected Projects" card excerpt + project page detail both pull from the MDX file (excerpt from frontmatter, body rendered on detail page).

### 404

Minimal shell window. One prompt: `$ find .`, output: `find: '.': no such file or directory`. Link back to `/`.

---

## 9. Project case studies — content structure

Proposed approach: **MDX content collection** (decision 7 in §4). Each project is one `.mdx` file.

**Frontmatter schema:**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),         // "css-attribution-exposure"
    displayName: z.string(),   // "CSS Attribution Exposure"
    subtitle: z.string(),      // "BigQuery investigation · FR+DE"
    period: z.string(),        // "2024"
    lang: z.string(),          // "BigQuery"
    stack: z.array(z.string()),
    stars: z.string(),         // "FR·DE" | "+4pts ROAS" | "designed"
    excerpt: z.string(),       // home card blurb
    order: z.number(),
  }),
});

export const collections = { projects };
```

**MDX body convention** (not schema-enforced): `## Problem` → `## Approach` → `## Stack` → `## Outcome` → `## See also`. MDX lets us interleave prose with `<Lineify>` / `<TokenHighlight>` components and code blocks (SQL, Python).

**Route:** `src/pages/projects/[...slug].astro` reads the collection, renders `ManPageLayout`, pipes the MDX body through.

---

## 10. Deployment pipeline

**Workflow** (`.github/workflows/deploy.yml`):

- Triggers: `push` to `main`, manual `workflow_dispatch`.
- Permissions: `contents: read`, `pages: write`, `id-token: write`.
- Concurrency: one in-flight deploy; cancel superseded runs.
- Job `build`: ubuntu-latest, Node 20, `npm ci`, `npx astro build`, `actions/upload-pages-artifact@v3`.
- Job `deploy`: `actions/deploy-pages@v4`, depends on `build`.
- Uses `withastro/action@v3` to centralize the above.

**Repository settings:**
- Settings → Pages → **Source: GitHub Actions** (not the legacy branch-based Pages).
- No secrets or env vars required.
- No CNAME file in v1.

---

## 11. Development milestones

| Phase | Scope | Rough effort |
|---|---|---|
| 1 — Skeleton & pipeline | Astro init, Tailwind v4, fonts, token CSS, BaseLayout, TopBar, ThemeToggle, deploy workflow. Site live (empty shell window) at `jackcastle.github.io`. | ~4h |
| 2 — Shell variant static | All shell components, home page renders full content, matches source visually (no animation yet). CV data typed and imported. | ~6h |
| 3 — Reveal + polish | Session-gated + motion-aware reveal, CSS typed prompts, heatmap, ASCII banner, contrast sweep. | ~3h |
| 4 — Man-page + project scaffolding | ManPageLayout, sidebar + scrollspy, TokenHighlight, Lineify, content collection schema, 3 MDX stubs, `[...slug].astro`. | ~5h |
| 5 — Case study content | Write 3 real case studies, home ↔ project linking, breadcrumb, 404. | ~3h |
| 6 — Lighthouse / SEO / a11y | Meta tags, OG image, sitemap, robots.txt, axe scan, Lighthouse ≥95 across all four axes. | ~2h |

Each phase ends with a commit; every commit deploys to `jackcastle.github.io`.

---

## 12. Accessibility, performance, SEO

**Accessibility**
- `<html lang="en">`.
- Real heading hierarchy: one `<h1>` per page; sectioned content uses `<section>` + nested `<h2>` / `<h3>`. Terminal-style dividers stay visual (not substitutes for headings).
- ASCII banner + avatar → `aria-hidden="true"`.
- All controls native `<button>` / `<a>`; visible focus indicators (accent-colored 2px outline).
- `prefers-reduced-motion: reduce` → instant render, no typed-prompt animation.
- Color contrast: dark theme passes AA on accent green. Light theme combinations (muted fg on paper bg) verified in phase 6 with axe + manual check.
- Theme toggle: `aria-label="Toggle theme"`, `aria-pressed` reflects current state.

**Performance**
- No client-side framework runtime.
- Self-hosted fonts, subset where possible (Fontsource defaults).
- No external requests (no Google Fonts, no CDN scripts, no analytics).
- CSS ships under 10KB after Tailwind purge (target).
- Total JS ships under 5KB for home (theme-init + theme-toggle + reveal).
- Images: no raster on home; SVG favicon; OG card is a 1200×630 PNG (one-off).

**SEO**
- Per-page `<title>` + `<meta name="description">`.
- OpenGraph + Twitter card tags on all pages.
- `sitemap-index.xml` via `@astrojs/sitemap`.
- `robots.txt` allow-all (no preview env to hide).
- Canonical URL per page.
- No structured data in v1 (could add `Person` schema in v1.1).

---

## 13. Open questions (to resolve during implementation)

1. **CV update.** The bundle PDF is the "updated one for now" per user. Confirmation: if a newer file lands before launch, swap in `public/cv/` and keep filename stable.
2. **Photo.** ASCII avatar only, or replace with a real photo on the man-page sidebar? Defaulting to ASCII-only.
3. **OG preview image.** Generate a 1200×630 rendered-shell screenshot, or upload a hand-crafted one? Defaulting to screenshot-style at phase 6.
4. **"Available upon request" refs line.** Keep the terminal joke or drop it? Defaulting to keep.
5. **Future CNAME.** Domain plans (`castello.dev`?) can be added post-launch via `public/CNAME`.
6. **Italian version.** Confirmed out of scope for v1.
7. **`design-source/` commit?** Gitignored by default (local reference only). Committing bloats repo with a 120KB prototype we won't maintain. Default: gitignore.

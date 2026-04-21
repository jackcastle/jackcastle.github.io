# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy `jackcastle.github.io` — a personal portfolio site for Giacomo Castello with a terminal-aesthetic home page and three Unix man-page-style project case studies.

**Architecture:** Astro 5 static site deployed to GitHub Pages. Home page is a single-scroll shell-variant CV; three project detail pages use a man-page layout. Tokens in CSS variables; Tailwind v4 `@theme` consumes them. No client-side framework runtime — three tiny TS islands handle theme toggle, staggered reveal-on-load, and scrollspy.

**Tech Stack:** Astro 5, TypeScript, Tailwind v4, MDX, `@astrojs/sitemap`, `@fontsource-variable/jetbrains-mono`, `@fontsource/ibm-plex-mono`. GitHub Actions via `withastro/action@v3` + `actions/deploy-pages@v4`.

**Spec reference:** `docs/superpowers/specs/2026-04-20-portfolio-site-design.md`.

**Testing strategy:** this is a static portfolio with no business logic that warrants unit tests. Verification per task is `astro check` (types) and `astro build` (build success). Phase 3 and 6 include manual browser verification checkpoints and axe/Lighthouse runs. No Vitest/Playwright — would be overbuilding for v1 scope.

**Platform note:** user is on Windows with bash (Git Bash). All commands below use Unix syntax (forward slashes, `&&`, single quotes). Paths use forward slashes inside commands.

---

## Phase 1 — Skeleton & deploy pipeline

Goal: empty Astro site with the correct config, Tailwind v4, tokens, fonts, topbar + theme toggle, and a working GitHub Actions deploy. End of phase: `https://jackcastle.github.io/` returns a page with the topbar and a visible "shell window" frame (no content inside yet).

### Task 1.1: Initialize Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `src/env.d.ts`, `public/favicon.svg`, `.gitignore` (already exists — extend)
- Modify: root (empty repo)

- [ ] **Step 1: Confirm empty working tree**

```bash
git status
```

Expected: `.gitignore` and `docs/superpowers/specs/...md` already committed; working tree clean.

- [ ] **Step 2: Initialize Astro with the minimal template**

Run the Astro scaffolder non-interactively with the minimal template, TypeScript strict, skipping git init (already a repo), skipping installation:

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-git --install --skip-houston --yes
```

If the scaffolder refuses because the directory isn't empty, run with `--force`:

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-git --install --skip-houston --yes --force
```

Expected: creates `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `src/assets/`, `public/favicon.svg`, `node_modules/`, `package-lock.json`.

- [ ] **Step 3: Verify it builds**

```bash
npx astro check && npx astro build
```

Expected: build succeeds, `dist/` is created with `index.html`.

- [ ] **Step 4: Delete scaffolder boilerplate we won't use**

Remove the placeholder `src/assets/` directory and its contents:

```bash
rm -rf src/assets
```

- [ ] **Step 5: Replace `src/pages/index.astro` with a blank placeholder**

Overwrite `src/pages/index.astro`:

```astro
---
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Giacomo Castello</title>
  </head>
  <body>
    <p>scaffolded</p>
  </body>
</html>
```

- [ ] **Step 6: Verify build still passes**

```bash
npx astro build
```

Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/ public/ .gitignore
git commit -m "chore: scaffold astro project with minimal template"
```

### Task 1.2: Add integrations + font packages

**Files:**
- Modify: `package.json`, `astro.config.mjs`

- [ ] **Step 1: Install dependencies**

```bash
npm install --save-exact \
  @astrojs/mdx \
  @astrojs/sitemap \
  tailwindcss@next \
  @tailwindcss/vite@next \
  @fontsource-variable/jetbrains-mono \
  @fontsource/ibm-plex-mono
```

Expected: installs succeed; `package.json` updated; `package-lock.json` updated.

- [ ] **Step 2: Update `astro.config.mjs`**

Replace the file's contents with:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://jackcastle.github.io',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://jackcastle.github.io/sitemap-index.xml
```

- [ ] **Step 4: Verify build**

```bash
npx astro build
```

Expected: build succeeds; `dist/sitemap-index.xml` exists.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs public/robots.txt
git commit -m "chore: add mdx, sitemap, tailwind v4, fontsource integrations"
```

### Task 1.3: Global styles and design tokens

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/global.css`** with tokens ported directly from the design source

```css
@import "tailwindcss";
@import "@fontsource-variable/jetbrains-mono";
@import "@fontsource/ibm-plex-mono/400.css";
@import "@fontsource/ibm-plex-mono/500.css";
@import "@fontsource/ibm-plex-mono/600.css";
@import "@fontsource/ibm-plex-mono/700.css";

@theme {
  --font-display: 'JetBrains Mono Variable', 'Menlo', monospace;
  --font-body: 'IBM Plex Mono', 'Menlo', monospace;
  --breakpoint-md: 900px;
}

:root {
  --font-display: 'JetBrains Mono Variable', 'Menlo', monospace;
  --font-body: 'IBM Plex Mono', 'Menlo', monospace;

  --bg: #0a0d10;
  --bg-1: #0d1117;
  --bg-2: #151a21;
  --bg-3: #1c232c;
  --border: #222b35;
  --border-soft: #1a2028;
  --fg: #c9d1d9;
  --fg-dim: #8b949e;
  --fg-muted: #6e7781;
  --fg-hi: #f0f6fc;

  --accent: #7ee787;
  --accent-2: #56d364;
  --accent-d: #2ea043;

  --amber: #e3b341;
  --ember: #f78166;
  --cyan: #79c0ff;
  --violet: #d2a8ff;
  --red: #ff7b72;

  --scan: rgba(126, 231, 135, 0.03);
}

[data-theme="light"] {
  --bg: #f6f3ec;
  --bg-1: #efe9db;
  --bg-2: #e6dfce;
  --bg-3: #d9cfb8;
  --border: #b8ac8e;
  --border-soft: #cfc2a2;
  --fg: #1a1a1a;
  --fg-dim: #5a5447;
  --fg-muted: #7a7360;
  --fg-hi: #000;

  --accent: #2d7a38;
  --accent-2: #1f5a28;
  --accent-d: #163d1c;

  --amber: #8a5a10;
  --ember: #b2401a;
  --cyan: #0a5b8a;
  --violet: #6c3ab1;
  --red: #b91c1c;

  --scan: rgba(0, 0, 0, 0.02);
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "liga" 1, "calt" 1;
}

body {
  background: radial-gradient(ellipse at top, color-mix(in oklab, var(--bg-1), var(--accent) 4%) 0%, var(--bg) 60%);
  min-height: 100vh;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(to bottom, var(--scan) 0, var(--scan) 1px, transparent 1px, transparent 3px);
  mix-blend-mode: overlay;
  z-index: 1;
  opacity: 0.7;
}

[data-theme="light"] body::before { opacity: 0.4; }

a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px dashed color-mix(in oklab, var(--accent), transparent 60%);
}
a:hover { color: var(--fg-hi); border-bottom-color: currentColor; }

.dim { color: var(--fg-dim); }
strong { color: var(--fg-hi); font-weight: 600; }

.stage {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 2;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Verify build**

```bash
npx astro build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add design tokens, theme vars, and tailwind v4 config"
```

### Task 1.4: Base layout + theme init

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/scripts/theme-init.ts`

- [ ] **Step 1: Create `src/scripts/theme-init.ts`**

```ts
// Runs inline in <head> to set theme before paint and prevent FOUC.
// Reads localStorage, falls back to dark.
(function () {
  try {
    const stored = localStorage.getItem('theme');
    const theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = 'dark';
  }
})();
```

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import themeInit from '../scripts/theme-init.ts?raw';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  canonicalPath?: string;
}

const {
  title,
  description = 'Giacomo Castello — Senior Advertising & Martech Manager. Performance marketing, data engineering, and AI automation for global e-commerce.',
  ogImage = '/og-image.png',
  canonicalPath,
} = Astro.props;

const site = Astro.site ?? new URL('https://jackcastle.github.io');
const canonical = new URL(canonicalPath ?? Astro.url.pathname, site).toString();
const ogImageUrl = new URL(ogImage, site).toString();
---
<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImageUrl} />
    <meta name="twitter:card" content="summary_large_image" />

    <script is:inline set:html={themeInit}></script>
  </head>
  <body>
    <slot name="topbar" />
    <main class="stage">
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 3: Update `src/pages/index.astro` to use the layout**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Giacomo Castello — Senior Advertising & Martech Manager">
  <p>hello from base layout</p>
</BaseLayout>
```

- [ ] **Step 4: Verify**

```bash
npx astro check && npx astro build
```

Expected: no type errors; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/layouts src/scripts src/pages/index.astro
git commit -m "feat: add base layout with SEO meta and no-FOUC theme init"
```

### Task 1.5: TopBar + ThemeToggle

**Files:**
- Create: `src/components/TopBar.astro`, `src/components/ThemeToggle.astro`, `src/scripts/theme-toggle.ts`

- [ ] **Step 1: Create `src/scripts/theme-toggle.ts`**

```ts
const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
if (btn) {
  btn.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    btn.dataset.theme = next;
    btn.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
    btn.textContent = next === 'dark' ? '☾' : '☀';
    try { localStorage.setItem('theme', next); } catch {}
  });
}
```

- [ ] **Step 2: Create `src/components/ThemeToggle.astro`**

```astro
---
---
<button
  type="button"
  class="tb-ico"
  data-theme-toggle
  aria-label="Toggle color theme"
  aria-pressed="false"
>☾</button>

<script>
  import '../scripts/theme-toggle.ts';
</script>

<style>
  .tb-ico {
    appearance: none;
    border: 1px solid var(--border);
    background: var(--bg-2);
    color: var(--fg-dim);
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: grid;
    place-items: center;
    transition: all 0.15s ease;
  }
  .tb-ico:hover { color: var(--fg); border-color: var(--accent); }
</style>
```

- [ ] **Step 3: Create `src/components/TopBar.astro`**

```astro
---
import ThemeToggle from './ThemeToggle.astro';

interface Props {
  path: string;
  cvHref?: string;
}

const { path, cvHref = '/cv/Giacomo_Castello_CV_Corporate.pdf' } = Astro.props;
---
<header class="topbar">
  <a class="tb-brand" href="/">
    <span class="tb-brand-dot" aria-hidden="true"></span>
    <span>Giacomo Castello</span>
  </a>
  <div class="tb-path">/ <b>{path}</b></div>
  <div class="tb-grow"></div>
  <a class="tb-cv" href={cvHref} download>Download CV</a>
  <ThemeToggle />
</header>

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 18px;
    background: color-mix(in oklab, var(--bg-1), transparent 5%);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }
  .tb-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--fg-hi);
    text-decoration: none;
    border: none;
  }
  .tb-brand:hover { color: var(--accent); }
  .tb-brand-dot {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: var(--accent);
    box-shadow: 0 0 12px color-mix(in oklab, var(--accent), transparent 50%);
  }
  .tb-path { color: var(--fg-dim); font-family: var(--font-display); font-size: 13px; }
  .tb-path b { color: var(--fg); font-weight: 500; }
  .tb-grow { flex: 1; }
  .tb-cv {
    font-family: var(--font-display);
    font-size: 12px;
    padding: 6px 12px;
    border: 1px solid color-mix(in oklab, var(--accent), transparent 50%);
    border-radius: 6px;
    color: var(--accent);
    background: color-mix(in oklab, var(--accent), transparent 92%);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .tb-cv:hover { background: color-mix(in oklab, var(--accent), transparent 80%); }

  @media (max-width: 900px) {
    .tb-path { display: none; }
  }
</style>
```

- [ ] **Step 4: Wire TopBar into index.astro**

Replace `src/pages/index.astro` contents:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TopBar from '../components/TopBar.astro';
---
<BaseLayout title="Giacomo Castello — Senior Advertising & Martech Manager">
  <TopBar slot="topbar" path="~/cv" />
  <p>hello from topbar</p>
</BaseLayout>
```

- [ ] **Step 5: Manual verify locally**

```bash
npx astro dev
```

Open `http://localhost:4321/` in a browser. Expected: topbar visible with "Giacomo Castello" on the left, "/ ~/cv" next to it, "Download CV" button and moon icon on the right. Click the moon → theme flips to light (warm paper background); refresh → theme persists.

Stop dev server (Ctrl+C).

- [ ] **Step 6: Commit**

```bash
git add src/components src/scripts/theme-toggle.ts src/pages/index.astro
git commit -m "feat: add topbar with brand, CV download, and theme toggle"
```

### Task 1.6: Deploy workflow + Pages setup

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `public/cv/Giacomo_Castello_CV_Corporate.pdf`

- [ ] **Step 1: Copy the CV PDF into `public/cv/`**

```bash
mkdir -p public/cv
cp "design-source/github-page/project/uploads/Giacomo_Castello_CV_Corporate.pdf" public/cv/
```

Expected: file exists at `public/cv/Giacomo_Castello_CV_Corporate.pdf`.

- [ ] **Step 2: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build site
        uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Commit + push**

```bash
git add .github/workflows/deploy.yml public/cv
git commit -m "ci: add github pages deploy workflow and seed cv pdf"
git push -u origin main
```

- [ ] **Step 4: Enable Pages (manual, one-time)**

On github.com → repo Settings → Pages → set **Source: GitHub Actions**.

- [ ] **Step 5: Verify deploy**

On github.com → Actions tab → watch the "Deploy to GitHub Pages" workflow. Expected: succeeds within ~2 min. Then visit `https://jackcastle.github.io/` in a browser. Expected: see the topbar + "hello from topbar".

Also verify the CV link works: `https://jackcastle.github.io/cv/Giacomo_Castello_CV_Corporate.pdf` should download.

---

## Phase 2 — Shell variant (static home page)

Goal: full home page content rendered, visually matches the source shell variant, no reveal animation yet. End of phase: `/` shows the complete CV in the terminal window.

### Task 2.1: CV data

**Files:**
- Create: `src/data/cv.ts`

- [ ] **Step 1: Create `src/data/cv.ts`** — typed port of `design-source/github-page/project/cv-data.js`

```ts
export interface CvStat { label: string; value: string; }
export interface CvCompetency { k: string; v: string; }
export interface CvExperience {
  title: string;
  company: string;
  period: string;
  location: string;
  context: string;
  bullets: string[]; // may contain <strong> — rendered via set:html
}
export interface CvProject {
  name: string;
  lang: string;
  desc: string;
  stars: string;
  slug: string; // links to /projects/<slug>/
}
export interface CvStackGroup { group: string; items: string[]; }
export interface CvEducation { title: string; org: string; }
export interface CvLanguage { name: string; level: string; }

export interface CvData {
  name: string;
  handle: string;
  role: string;
  subrole: string;
  location: string;
  mode: string;
  email: string;
  phone: string;
  linkedin: string;
  born: number;
  license: string;
  summary: string; // contains <strong>
  stats: CvStat[];
  competencies: CvCompetency[];
  experience: CvExperience[];
  projects: CvProject[];
  stack: CvStackGroup[];
  education: CvEducation[];
  certifications: string[];
  languages: CvLanguage[];
  softSkills: string[];
}

export const cv: CvData = {
  name: 'Giacomo Castello',
  handle: 'giacomocastello',
  role: 'Senior Performance Marketing & Martech Manager',
  subrole: 'Global E-commerce',
  location: 'Palermo, IT',
  mode: 'Remote-first',
  email: 'castello.giacomo.90@gmail.com',
  phone: '+39 388 4740108',
  linkedin: 'https://www.linkedin.com/in/giacomocastello/',
  born: 1990,
  license: 'B',

  summary: `<strong>Senior Digital & Martech Manager</strong> leading global performance marketing for high-end fashion e-commerce. Over the past four years has <strong>scaled paid media from €1.0M to a €2.4M peak</strong> across <strong>8 ad platforms</strong> and <strong>50+ international markets</strong>, contributing to <strong>+38% YoY revenue growth (€41M → €57M)</strong> in the first year on the role. Combines strategic media leadership, cross-functional stakeholder management and hands-on technical execution to deliver measurable P&L impact. Currently <strong>co-leading the marketing function</strong> alongside the Deputy CEO, managing <strong>5 direct reports</strong> and working directly with CEO and CTO on strategic initiatives.`,

  stats: [
    { label: 'paid_media_peak', value: '€2.4M' },
    { label: 'ad_platforms', value: '8' },
    { label: 'markets', value: '50+' },
    { label: 'yoy_revenue_growth', value: '+38%' },
    { label: 'blended_roas', value: '~13x' },
    { label: 'direct_reports', value: '5' },
  ],

  competencies: [
    { k: 'Global Performance & Media', v: 'Full-funnel orchestration across AMER / EMEA / APAC; pacing on ROAS, GMV and contribution margin.' },
    { k: 'E-commerce & Product Logic', v: 'Assortment strategy, pricing windows, promo calendar, feed quality; media–merchandising loop.' },
    { k: 'Leadership & Stakeholders', v: 'Cross-functional team direction; alignment with C-level, IT/BI and external partners.' },
    { k: 'Martech & Data Architecture', v: 'GA4, GTM client + Server-Side GTM, BigQuery, GCP; ETL / API pipelines and data activation.' },
    { k: 'Measurement & Privacy', v: 'Event taxonomy, Consent Mode v2, server-side tagging, QA frameworks and data reliability.' },
    { k: 'Attribution & Experimentation', v: 'MTA, incrementality testing, light MMM, rapid test-and-learn frameworks.' },
    { k: 'AI & Automation', v: 'Asset generation, analysis and ops workflows powered by Python, Apps Script and API integrations.' },
  ],

  experience: [
    {
      title: 'Senior Advertising & Martech Manager',
      company: 'Giglio.com S.p.A.',
      period: '2021 — Present',
      location: 'Palermo / Remote',
      context: 'High-end fashion e-commerce, listed on Euronext Growth Milan.',
      bullets: [
        'Leads the Digital Marketing Unit and <strong>co-leads the marketing function</strong> alongside the Deputy CEO; manages <strong>5 direct reports</strong> across performance, analytics and martech.',
        '<strong>Scaled annual paid media spend from €1.0M to a €2.4M peak</strong> in 2023, currently steering €1.9M+ across <strong>8 platforms</strong> (Google, Meta, TikTok, Pinterest, Microsoft Ads, Criteo, Rakuten, affiliate networks) and <strong>50+ international markets</strong> — up from 15 markets at start.',
        'Contributed to <strong>+38% YoY revenue growth</strong> in the first year on the role (FY21 → FY22, ~€41M → ~€57M) through media mix overhaul, full-funnel orchestration and feed strategy redesign.',
        'Sustains a <strong>blended ROAS of ~13x</strong> through tight pacing, incrementality testing, and continuous creative-audience iteration on premium fashion catalog.',
        'Drives experimentation and decisioning across channels via <strong>incrementality tests, MTA analysis</strong> and structured inputs on media mix, creative and assortment.',
        'Migrated the tracking stack to a <strong>server-side GTM architecture on GA4</strong>, recovering <strong>~30% of conversions</strong> previously lost to ITP, ad-blockers and consent gaps.',
        'Owns the full data pipeline (GA4, sGTM, BigQuery, GCP) and API-based activations for near real-time reporting and optimization, with <strong>end-to-end autonomy</strong> on setup, QA and troubleshooting — no external agency dependency.',
        'Built an <strong>AI-powered feed enrichment pipeline</strong> (GPT-4 + custom prompts) that auto-generates localized titles and descriptions; first production rollout on the DE market processed ~250k size variants and <strong>lifted ROAS from 14.4x to 18.4x (+4 points)</strong>, validated via A/B test at 99% confidence.',
        'Engineered <strong>Apps Script and BigQuery automations</strong> that eliminated hours of weekly manual work and shifted recurring operations (bid changes, budget reallocations, reporting refreshes) to off-hours scheduled jobs.',
      ],
    },
    {
      title: 'Digital Advertising & Martech Lead',
      company: 'Giambrone & Partners',
      period: '2018 — 2021',
      location: 'Palermo / Remote',
      context: 'International law firm — Legal vertical.',
      bullets: [
        'Defined multi-country performance strategy with focus on lead quality and compliance.',
        'Implemented the martech stack (GA / GTM / CRM), measurement by practice area and qualification funnels.',
        'Rationalized media spend, ran test-and-learn programs and produced executive reporting.',
      ],
    },
    {
      title: 'Digital Advertising Lead',
      company: 'Previous Company',
      period: '2015 — 2018',
      location: 'Italy',
      context: '',
      bullets: [
        'Managed paid media operations across Google, Meta and Programmatic with ROAS-based logics and budget / bid automation.',
        'Built dashboards and reporting processes anchored to business KPIs.',
      ],
    },
  ],

  projects: [
    {
      name: 'css-attribution-exposure',
      lang: 'BigQuery',
      desc: 'Designed and deployed a production BigQuery query joining GA4 export and Google Ads Data Transfer tables to detect GCLID mismatches and identify sessions attributable to third-party Comparison Shopping Services active in key European markets. Quantified their conversion contribution and informed bidding and exclusion strategies in FR and DE.',
      stars: 'FR·DE',
      slug: 'css-attribution-exposure',
    },
    {
      name: 'ai-feed-enrichment',
      lang: 'GPT-4 + Merchant Center',
      desc: 'LLM-based pipeline that auto-generates localized product titles and descriptions from catalog data. First production rollout on the DE market processed ~250k size variants; A/B test validated the AI-generated variant at 99% confidence, lifting ROAS from 14.4x → 18.4x (+4 points). Pipeline designed for rollout across multiple markets and languages.',
      stars: '+4pts ROAS',
      slug: 'ai-feed-enrichment',
    },
    {
      name: 'mta-data-lake',
      lang: 'BigQuery architecture',
      desc: 'Unified attribution architecture on BigQuery consolidating GA4, Google Ads, Meta, TikTok and other paid platforms into a single event-level data model. Framework supports custom attribution windows, incrementality overlays and channel-level contribution analysis, enabling media mix decisions beyond platform-reported ROAS.',
      stars: 'designed',
      slug: 'mta-data-lake',
    },
  ],

  stack: [
    { group: 'Ads & Retail Media', items: ['Google Ads', 'Meta', 'TikTok', 'Pinterest', 'Microsoft Ads', 'Criteo', 'Rakuten', 'Affiliate networks'] },
    { group: 'E-commerce Ops', items: ['Merchant Center', 'Feed management', 'Catalog enrichment', 'Product taxonomy'] },
    { group: 'Analytics & Data', items: ['GA4', 'GTM (client + server-side)', 'BigQuery', 'Looker Studio', 'GCP'] },
    { group: 'Privacy & Governance', items: ['Consent Mode v2', 'Server-side tagging', 'Data QA', 'Naming conventions'] },
    { group: 'Dev & Automation', items: ['Python', 'Apps Script', 'REST APIs', 'ETL', 'GPT-4', 'Gemini', 'Claude'] },
    { group: 'Experimentation', items: ['A/B & holdout testing', 'Uplift / incrementality', 'North-star metrics', 'Guardrails'] },
  ],

  education: [
    { title: 'Computer Science Coursework', org: 'University of Palermo (UniPA)' },
    { title: 'Scientific High School Diploma', org: '' },
  ],

  certifications: [
    'Google Ads — Search, Display, Shopping & Measurement',
    'Meta Buying Professional',
    'GA4 & BigQuery Advanced',
    'Python for Marketing Automation',
    'Google Cloud Platform Fundamentals',
  ],

  languages: [
    { name: 'Italian', level: 'native' },
    { name: 'English', level: 'C1 — professional working proficiency' },
  ],

  softSkills: [
    'Cross-Functional Leadership',
    'Stakeholder Management',
    'Data-Driven Decision Making',
    'Strategic Problem Solving',
    'Team Mentoring',
    'Business Acumen',
  ],
};
```

- [ ] **Step 2: Verify types**

```bash
npx astro check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/cv.ts
git commit -m "feat: add typed cv data module"
```

### Task 2.2: ShellWindow container + shell CSS

**Files:**
- Create: `src/components/shell/ShellWindow.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<section class="sh-root">
  <header class="sh-chrome">
    <div class="sh-chrome-dots" aria-hidden="true">
      <span class="d d-r"></span><span class="d d-y"></span><span class="d d-g"></span>
    </div>
    <div class="sh-chrome-title">{title}</div>
    <div class="sh-chrome-spacer"></div>
  </header>
  <div class="sh-screen">
    <slot />
  </div>
</section>

<style>
  .sh-root {
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    box-shadow:
      0 1px 0 color-mix(in oklab, var(--fg-hi), transparent 92%) inset,
      0 40px 80px -20px rgba(0, 0, 0, 0.5);
  }
  .sh-chrome {
    display: flex;
    align-items: center;
    padding: 9px 14px;
    background: linear-gradient(180deg, var(--bg-2), var(--bg-1));
    border-bottom: 1px solid var(--border);
    font-family: var(--font-display);
    font-size: 11.5px;
    color: var(--fg-dim);
  }
  .sh-chrome-dots { display: flex; gap: 6px; width: 70px; }
  .sh-chrome-dots .d { width: 12px; height: 12px; border-radius: 50%; display: block; }
  .d-r { background: #ff5f57; }
  .d-y { background: #febc2e; }
  .d-g { background: #28c840; }
  .sh-chrome-title { flex: 1; text-align: center; letter-spacing: 0.02em; }
  .sh-chrome-spacer { width: 70px; }
  .sh-screen { padding: 22px 28px 60px; font-size: 13.5px; line-height: 1.65; min-height: 70vh; }
</style>
```

- [ ] **Step 2: Wire into index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TopBar from '../components/TopBar.astro';
import ShellWindow from '../components/shell/ShellWindow.astro';
---
<BaseLayout title="Giacomo Castello — Senior Advertising & Martech Manager">
  <TopBar slot="topbar" path="~/cv" />
  <ShellWindow title="giacomo_castello — -bash — 132×60">
    <p class="dim">content coming in next tasks</p>
  </ShellWindow>
</BaseLayout>
```

- [ ] **Step 3: Verify**

```bash
npx astro build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/shell/ShellWindow.astro src/pages/index.astro
git commit -m "feat: add shell window chrome container"
```

### Task 2.3: Prompt + static-prompt lines

**Files:**
- Create: `src/components/shell/Prompt.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  cmd: string;
  caret?: boolean;
  blink?: boolean;
}
const { cmd, caret = false, blink = false } = Astro.props;
---
<div class="sh-prompt">
  <span class="sh-user">giacomo</span>
  <span class="sh-at">@</span>
  <span class="sh-host">palermo</span>
  <span class="sh-sep">:</span>
  <span class="sh-path">~/cv</span>
  <span class="sh-dollar">$ </span>
  <span class="sh-cmd">{cmd}</span>
  {caret && <span class={`sh-caret ${blink ? 'blink' : ''}`}>▍</span>}
</div>

<style>
  .sh-prompt { margin: 18px 0 6px; font-family: var(--font-display); }
  .sh-user { color: var(--accent); font-weight: 600; }
  .sh-at, .sh-sep, .sh-dollar { color: var(--fg-dim); }
  .sh-host { color: var(--cyan); font-weight: 600; }
  .sh-path { color: var(--violet); }
  .sh-cmd { color: var(--fg-hi); }
  .sh-caret { color: var(--accent); }
  .sh-caret.blink { animation: blink 1s step-end infinite; }
  @keyframes blink { 50% { opacity: 0; } }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shell/Prompt.astro
git commit -m "feat: add shell prompt component"
```

### Task 2.4: MOTD (banner + meta)

**Files:**
- Create: `src/components/shell/MOTD.astro`

- [ ] **Step 1: Create the component**

```astro
---
const banner = `   ▄████  ██▓ ▄▄▄       ▄████▄   ▒█████   ███▄ ▄███▓  ▒█████
  ██▒ ▀█▒▓██▒▒████▄    ▒██▀ ▀█  ▒██▒  ██▒▓██▒▀█▀ ██▒ ▒██▒  ██▒
 ▒██░▄▄▄░▒██▒▒██  ▀█▄  ▒▓█    ▄ ▒██░  ██▒▓██    ▓██░ ▒██░  ██▒
 ░▓█  ██▓░██░░██▄▄▄▄██ ▒▓▓▄ ▄██▒▒██   ██░▒██    ▒██  ▒██   ██░
 ░▒▓███▀▒░██░ ▓█   ▓██▒▒ ▓███▀ ░░ ████▓▒░▒██▒   ░██▒ ░ ████▓▒░
  ░▒   ▒ ░▓   ▒▒   ▓▒█░░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒░   ░  ░ ░ ▒░▒░▒░
   ░   ░  ▒ ░  ▒   ▒▒ ░  ░  ▒     ░ ▒ ▒░ ░  ░      ░   ░ ▒ ▒░
 ░ ░   ░  ▒ ░  ░   ▒   ░        ░ ░ ░ ▒  ░      ░    ░ ░ ░ ▒
       ░  ░        ░  ░░ ░          ░ ░         ░        ░ ░`;
---
<div class="sh-motd">
  <pre class="sh-ascii" aria-hidden="true">{banner}</pre>
  <div class="sh-motd-meta">
    <span>Last login: ttys002 · uptime: 10y 4mo</span>
    <span class="sh-motd-sep">│</span>
    <span>load avg: 2.4M, 50+, 13x</span>
  </div>
</div>

<style>
  .sh-motd { margin-bottom: 18px; }
  .sh-ascii {
    color: var(--accent);
    font-size: 9px;
    line-height: 1.1;
    margin: 0 0 8px;
    opacity: 0.85;
    text-shadow: 0 0 8px color-mix(in oklab, var(--accent), transparent 60%);
    overflow: hidden;
  }
  .sh-motd-meta {
    color: var(--fg-dim);
    font-size: 11.5px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .sh-motd-sep { color: var(--border); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shell/MOTD.astro
git commit -m "feat: add MOTD banner component"
```

### Task 2.5: IdentityBlock (`$ whoami` output)

**Files:**
- Create: `src/components/shell/IdentityBlock.astro`

- [ ] **Step 1: Create the component**

```astro
---
import type { CvData } from '../../data/cv';
interface Props { cv: CvData; }
const { cv } = Astro.props;

const avatar = ` ┌───────────┐
 │ ▓▓▓▓▓▓▓▓▓ │
 │ ▓  ▀ ▀  ▓ │
 │ ▓   ◡   ▓ │
 │ ▓▓▓▓▓▓▓▓▓ │
 └───────────┘`;
---
<div class="sh-id-row">
  <pre class="sh-avatar" aria-hidden="true">{avatar}</pre>
  <div class="sh-id-info">
    <div class="sh-id-name">{cv.name}</div>
    <div class="sh-id-role">{cv.role} · <span class="dim">{cv.subrole}</span></div>
    <div class="sh-id-meta">
      <span>📍 {cv.location}</span>
      <span>◐ {cv.mode}</span>
      <span><a href={`mailto:${cv.email}`}>{cv.email}</a></span>
      <span>{cv.phone}</span>
      <span><a href={cv.linkedin} target="_blank" rel="noopener">LinkedIn</a></span>
    </div>
    <div class="sh-id-tags">
      <span class="tag">uid={cv.born}</span>
      <span class="tag">groups=remote,eu</span>
      <span class="tag">shell=/bin/zsh</span>
      <span class="tag">license={cv.license}</span>
    </div>
  </div>
</div>

<style>
  .sh-id-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 20px;
    align-items: start;
    padding: 10px 0;
  }
  .sh-avatar { margin: 0; color: var(--accent); font-size: 9px; line-height: 1.15; }
  .sh-id-name {
    font-family: var(--font-display);
    font-size: 22px;
    color: var(--fg-hi);
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .sh-id-role { color: var(--fg); margin: 2px 0 10px; }
  .sh-id-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    color: var(--fg-dim);
    font-size: 12.5px;
  }
  .sh-id-tags { margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap; }
  .tag {
    font-size: 10.5px;
    letter-spacing: 0.03em;
    color: var(--accent);
    border: 1px solid color-mix(in oklab, var(--accent), transparent 60%);
    background: color-mix(in oklab, var(--accent), transparent 92%);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: var(--font-display);
  }
  @media (max-width: 900px) {
    .sh-id-row { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shell/IdentityBlock.astro
git commit -m "feat: add shell identity block"
```

### Task 2.6: Summary + StatsGrid

**Files:**
- Create: `src/components/shell/StatsGrid.astro`

- [ ] **Step 1: Create the component**

```astro
---
import type { CvData } from '../../data/cv';
interface Props { cv: CvData; }
const { cv } = Astro.props;
---
<div class="sh-stats">
  {cv.stats.map((s) => (
    <div class="sh-stat">
      <div class="sh-stat-v">{s.value}</div>
      <div class="sh-stat-k">{s.label}</div>
    </div>
  ))}
</div>

<style>
  .sh-stats {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    margin: 4px 0 12px;
  }
  .sh-stat {
    border: 1px solid var(--border);
    background: color-mix(in oklab, var(--bg-2), transparent 30%);
    padding: 10px 12px;
    border-radius: 6px;
  }
  .sh-stat-v {
    font-family: var(--font-display);
    font-size: 20px;
    color: var(--accent);
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .sh-stat-k {
    font-size: 10.5px;
    color: var(--fg-dim);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-top: 3px;
  }
  @media (max-width: 900px) {
    .sh-stats { grid-template-columns: repeat(2, 1fr); }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shell/StatsGrid.astro
git commit -m "feat: add stats grid"
```

### Task 2.7: Static Heatmap

**Files:**
- Create: `src/components/shell/Heatmap.astro`

- [ ] **Step 1: Create the component**

Use the deterministic seed from the source (seed=42) to compute the heatmap cells at build time and render them as static HTML.

```astro
---
const weeks = 26;
const days = 7;
let seed = 42;
const rnd = (): number => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

const cells: number[] = [];
for (let w = 0; w < weeks; w++) {
  for (let d = 0; d < days; d++) {
    const r = rnd();
    const boost = d > 0 && d < 6 ? 0.3 : 0;
    const v = Math.min(4, Math.floor((r + boost) * 5));
    cells.push(v);
  }
}
---
<div class="sh-heat" aria-label="activity heatmap (decorative)">
  {Array.from({ length: weeks }).map((_, w) => (
    <div class="sh-heat-col">
      {Array.from({ length: days }).map((_, d) => (
        <div class={`sh-heat-cell lv-${cells[w * days + d]}`}></div>
      ))}
    </div>
  ))}
</div>

<style>
  .sh-heat { display: flex; gap: 3px; padding: 4px 0 6px; }
  .sh-heat-col { display: flex; flex-direction: column; gap: 3px; }
  .sh-heat-cell {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background: color-mix(in oklab, var(--bg-2), var(--fg) 4%);
    border: 1px solid var(--border-soft);
  }
  .sh-heat-cell.lv-1 {
    background: color-mix(in oklab, var(--accent), transparent 80%);
    border-color: color-mix(in oklab, var(--accent), transparent 70%);
  }
  .sh-heat-cell.lv-2 {
    background: color-mix(in oklab, var(--accent), transparent 60%);
    border-color: color-mix(in oklab, var(--accent), transparent 50%);
  }
  .sh-heat-cell.lv-3 {
    background: color-mix(in oklab, var(--accent), transparent 35%);
    border-color: color-mix(in oklab, var(--accent), transparent 30%);
  }
  .sh-heat-cell.lv-4 {
    background: var(--accent);
    border-color: var(--accent-2);
    box-shadow: 0 0 6px color-mix(in oklab, var(--accent), transparent 60%);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shell/Heatmap.astro
git commit -m "feat: add static activity heatmap"
```

### Task 2.8: Divider + Competencies (`$ ls core_competencies/`)

**Files:**
- Create: `src/components/shell/Divider.astro`, `src/components/shell/CompetenciesLs.astro`

- [ ] **Step 1: Create `Divider.astro`**

```astro
---
interface Props { label?: string; char?: string; }
const { label = '', char = '─' } = Astro.props;
---
<div class="sh-div">
  <span>{char.repeat(4)}</span>
  {label && <span class="sh-div-label"> {label} </span>}
  <span class="sh-div-fill" aria-hidden="true">{char.repeat(120)}</span>
</div>

<style>
  .sh-div {
    color: var(--border);
    margin: 12px 0 6px;
    font-family: var(--font-display);
    font-size: 11px;
    overflow: hidden;
    white-space: nowrap;
  }
  .sh-div-label { color: var(--fg-dim); }
  .sh-div-fill { color: var(--border); }
</style>
```

- [ ] **Step 2: Create `CompetenciesLs.astro`**

```astro
---
import type { CvData } from '../../data/cv';
interface Props { cv: CvData; }
const { cv } = Astro.props;
const slug = (s: string) => s.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
---
<div class="sh-ls">
  {cv.competencies.map((c) => (
    <div class="sh-ls-row">
      <span class="sh-ls-perm">drwxr-xr-x</span>
      <span class="sh-ls-size">{String(c.v.length).padStart(4, '0')}</span>
      <span class="sh-ls-name">{slug(c.k)}/</span>
      <span class="sh-ls-desc">{c.v}</span>
    </div>
  ))}
</div>

<style>
  .sh-ls { font-family: var(--font-display); font-size: 12.5px; }
  .sh-ls-row {
    display: grid;
    grid-template-columns: 100px 50px 240px 1fr;
    gap: 12px;
    padding: 2px 0;
    align-items: baseline;
  }
  .sh-ls-perm { color: var(--fg-muted); }
  .sh-ls-size { color: var(--amber); text-align: right; }
  .sh-ls-name { color: var(--cyan); }
  .sh-ls-desc { color: var(--fg); font-family: var(--font-body); }
  @media (max-width: 900px) {
    .sh-ls-row { grid-template-columns: 1fr; gap: 2px; }
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/shell/Divider.astro src/components/shell/CompetenciesLs.astro
git commit -m "feat: add divider and competencies ls view"
```

### Task 2.9: ExperienceLog (`$ git log`)

**Files:**
- Create: `src/components/shell/ExperienceLog.astro`

- [ ] **Step 1: Create the component**

```astro
---
import type { CvData } from '../../data/cv';
interface Props { cv: CvData; }
const { cv } = Astro.props;

const commit = (i: number) => `0x${(0xa1b2c + i * 0x1111).toString(16)}`;
---
<div class="sh-log">
  {cv.experience.map((e, i) => (
    <article class="sh-job">
      <header class="sh-job-head">
        <span class="sh-commit">{commit(i)}</span>
        <span class="sh-job-title">{e.title}</span>
        <span class="sh-arrow">→</span>
        <span class="sh-job-co">{e.company}</span>
        <span class="sh-job-period">[{e.period}]</span>
      </header>
      <div class="sh-job-sub">
        <span>{e.location}</span>
        {e.context && (
          <>
            <span class="sh-sep-dot">·</span>
            <span class="dim">{e.context}</span>
          </>
        )}
      </div>
      <ul class="sh-bullets">
        {e.bullets.map((b) => (
          <li>
            <span class="sh-bullet-mark">▸</span>
            <span set:html={b}></span>
          </li>
        ))}
      </ul>
    </article>
  ))}
</div>

<style>
  .sh-job {
    margin: 12px 0 18px;
    padding-left: 16px;
    border-left: 2px solid var(--border);
  }
  .sh-job-head {
    display: flex;
    gap: 10px;
    align-items: baseline;
    flex-wrap: wrap;
    font-family: var(--font-display);
  }
  .sh-commit { color: var(--amber); font-size: 12px; }
  .sh-job-title { color: var(--fg-hi); font-weight: 600; }
  .sh-arrow { color: var(--fg-dim); }
  .sh-job-co { color: var(--accent); font-weight: 600; }
  .sh-job-period { color: var(--fg-dim); margin-left: auto; font-size: 12px; }
  .sh-job-sub {
    color: var(--fg-dim);
    font-size: 12px;
    margin: 2px 0 8px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .sh-sep-dot { color: var(--border); }
  .sh-bullets { list-style: none; margin: 0; padding: 0; }
  .sh-bullets li {
    display: flex;
    gap: 10px;
    padding: 3px 0;
    max-width: 95ch;
  }
  .sh-bullet-mark { color: var(--accent); flex-shrink: 0; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shell/ExperienceLog.astro
git commit -m "feat: add experience log (git log style)"
```

### Task 2.10: ProjectCards

**Files:**
- Create: `src/components/shell/ProjectCards.astro`

- [ ] **Step 1: Create the component** — cards that link to `/projects/<slug>/`

```astro
---
import type { CvData } from '../../data/cv';
interface Props { cv: CvData; }
const { cv } = Astro.props;
---
<div class="sh-proj-grid">
  {cv.projects.map((p) => (
    <a class="sh-proj" href={`/projects/${p.slug}/`}>
      <div class="sh-proj-head">
        <span class="sh-proj-icon">❯</span>
        <span class="sh-proj-name">{p.name}</span>
        <span class="sh-proj-star">★ {p.stars}</span>
      </div>
      <div class="sh-proj-lang"><span class="sh-dot"></span> {p.lang}</div>
      <div class="sh-proj-desc">{p.desc}</div>
    </a>
  ))}
</div>

<style>
  .sh-proj-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }
  .sh-proj {
    display: block;
    border: 1px solid var(--border);
    background: color-mix(in oklab, var(--bg-2), transparent 40%);
    border-radius: 6px;
    padding: 14px;
    transition: border-color 0.2s, transform 0.2s;
    text-decoration: none;
    color: inherit;
  }
  .sh-proj:hover { border-color: var(--accent); transform: translateY(-1px); }
  .sh-proj-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-family: var(--font-display);
  }
  .sh-proj-icon { color: var(--accent); }
  .sh-proj-name { color: var(--cyan); font-weight: 600; }
  .sh-proj-star { margin-left: auto; color: var(--amber); font-size: 11.5px; }
  .sh-proj-lang {
    font-size: 11.5px;
    color: var(--fg-dim);
    margin: 4px 0 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sh-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--violet);
    display: inline-block;
  }
  .sh-proj-desc { font-size: 12.5px; color: var(--fg); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shell/ProjectCards.astro
git commit -m "feat: add project cards linking to detail pages"
```

### Task 2.11: StackRows + education/certs split

**Files:**
- Create: `src/components/shell/StackRows.astro`, `src/components/shell/EducationCerts.astro`

- [ ] **Step 1: Create `StackRows.astro`**

```astro
---
import type { CvData } from '../../data/cv';
interface Props { cv: CvData; }
const { cv } = Astro.props;
const slug = (s: string) => s.toLowerCase().replace(/ /g, '_');
---
<div class="sh-stack">
  {cv.stack.map((s) => (
    <div class="sh-stack-row">
      <div class="sh-stack-k">{slug(s.group)}</div>
      <div class="sh-stack-v">
        {s.items.map((it) => <span class="sh-chip">{it}</span>)}
      </div>
    </div>
  ))}
</div>

<style>
  .sh-stack { display: grid; gap: 6px; }
  .sh-stack-row {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 16px;
    padding: 4px 0;
    border-bottom: 1px dashed var(--border-soft);
  }
  .sh-stack-row:last-child { border-bottom: 0; }
  .sh-stack-k {
    color: var(--amber);
    font-family: var(--font-display);
    font-size: 12px;
  }
  .sh-stack-v { display: flex; flex-wrap: wrap; gap: 6px; }
  .sh-chip {
    font-family: var(--font-display);
    font-size: 11.5px;
    color: var(--fg);
    background: var(--bg-2);
    border: 1px solid var(--border);
    padding: 2px 8px;
    border-radius: 3px;
  }
  .sh-chip.alt {
    color: var(--violet);
    border-color: color-mix(in oklab, var(--violet), transparent 70%);
    background: color-mix(in oklab, var(--violet), transparent 92%);
  }
  @media (max-width: 900px) {
    .sh-stack-row { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Create `EducationCerts.astro`**

```astro
---
import type { CvData } from '../../data/cv';
interface Props { cv: CvData; }
const { cv } = Astro.props;
---
<div class="sh-two-col">
  <div>
    <h3 class="sh-md-head">## education</h3>
    {cv.education.map((e) => (
      <div class="sh-edu">
        <span class="sh-edu-title">{e.title}</span>
        {e.org && <div class="sh-edu-org">{e.org}</div>}
      </div>
    ))}
    <h3 class="sh-md-head mt">## languages</h3>
    {cv.languages.map((l) => (
      <div class="sh-lang">
        <span class="sh-lang-name">{l.name}</span>
        <span class="sh-lang-level">{l.level}</span>
      </div>
    ))}
  </div>
  <div>
    <h3 class="sh-md-head">## certifications</h3>
    <ul class="sh-certs">
      {cv.certifications.map((c) => (
        <li>
          <span class="sh-cert-mark">[x]</span>
          <span>{c}</span>
        </li>
      ))}
    </ul>
    <h3 class="sh-md-head mt">## soft_skills</h3>
    <div class="sh-soft">
      {cv.softSkills.map((s) => <span class="sh-chip alt">{s}</span>)}
    </div>
  </div>
</div>

<style>
  .sh-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
  .sh-md-head {
    color: var(--ember);
    font-family: var(--font-display);
    font-weight: 600;
    margin: 0 0 6px;
    letter-spacing: 0.02em;
    font-size: inherit;
  }
  .sh-md-head.mt { margin-top: 18px; }
  .sh-edu { margin-bottom: 6px; }
  .sh-edu-title { color: var(--fg-hi); font-family: var(--font-display); }
  .sh-edu-org { color: var(--fg-dim); font-size: 12px; }
  .sh-lang { display: flex; gap: 10px; align-items: baseline; }
  .sh-lang-name {
    color: var(--cyan);
    font-family: var(--font-display);
    min-width: 80px;
  }
  .sh-lang-level { color: var(--fg-dim); font-size: 12px; }
  .sh-certs { list-style: none; padding: 0; margin: 0; }
  .sh-certs li { display: flex; gap: 8px; padding: 2px 0; }
  .sh-cert-mark { color: var(--accent); font-family: var(--font-display); }
  .sh-soft { display: flex; flex-wrap: wrap; gap: 6px; }
  .sh-chip.alt {
    font-family: var(--font-display);
    font-size: 11.5px;
    color: var(--violet);
    border: 1px solid color-mix(in oklab, var(--violet), transparent 70%);
    background: color-mix(in oklab, var(--violet), transparent 92%);
    padding: 2px 8px;
    border-radius: 3px;
  }
  @media (max-width: 900px) {
    .sh-two-col { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/shell/StackRows.astro src/components/shell/EducationCerts.astro
git commit -m "feat: add stack rows and education/certs split"
```

### Task 2.12: ContactPanel

**Files:**
- Create: `src/components/shell/ContactPanel.astro`

- [ ] **Step 1: Create the component**

```astro
---
import type { CvData } from '../../data/cv';
interface Props { cv: CvData; }
const { cv } = Astro.props;
---
<div class="sh-contact">
  <div class="sh-contact-row">
    <span class="sh-contact-k">email </span>
    <span class="sh-contact-v"><a href={`mailto:${cv.email}`}>{cv.email}</a></span>
  </div>
  <div class="sh-contact-row">
    <span class="sh-contact-k">phone </span>
    <span class="sh-contact-v">{cv.phone}</span>
  </div>
  <div class="sh-contact-row">
    <span class="sh-contact-k">where </span>
    <span class="sh-contact-v">{cv.location} · {cv.mode}</span>
  </div>
  <div class="sh-contact-row">
    <span class="sh-contact-k">refs  </span>
    <span class="sh-contact-v dim">available upon request</span>
  </div>
</div>

<style>
  .sh-contact { font-family: var(--font-display); }
  .sh-contact-row {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 10px;
    padding: 2px 0;
  }
  .sh-contact-k { color: var(--amber); }
  .sh-contact-v { color: var(--fg); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shell/ContactPanel.astro
git commit -m "feat: add contact panel"
```

### Task 2.13: Compose the full home page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace `src/pages/index.astro`** with the composed home

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TopBar from '../components/TopBar.astro';
import ShellWindow from '../components/shell/ShellWindow.astro';
import MOTD from '../components/shell/MOTD.astro';
import Prompt from '../components/shell/Prompt.astro';
import IdentityBlock from '../components/shell/IdentityBlock.astro';
import StatsGrid from '../components/shell/StatsGrid.astro';
import Heatmap from '../components/shell/Heatmap.astro';
import Divider from '../components/shell/Divider.astro';
import CompetenciesLs from '../components/shell/CompetenciesLs.astro';
import ExperienceLog from '../components/shell/ExperienceLog.astro';
import ProjectCards from '../components/shell/ProjectCards.astro';
import StackRows from '../components/shell/StackRows.astro';
import EducationCerts from '../components/shell/EducationCerts.astro';
import ContactPanel from '../components/shell/ContactPanel.astro';
import { cv } from '../data/cv';

const title = `${cv.name} — ${cv.role}`;
---
<BaseLayout title={title}>
  <TopBar slot="topbar" path="~/cv" />
  <ShellWindow title={`${cv.name.toLowerCase().replace(' ', '_')} — -bash — 132×60`}>
    <MOTD />

    <Prompt cmd="whoami" />
    <div class="sh-out">
      <IdentityBlock cv={cv} />
    </div>

    <Prompt cmd="cat summary.md" />
    <div class="sh-out">
      <h2 class="sh-md-head"># executive_summary</h2>
      <p class="sh-summary" set:html={cv.summary}></p>
    </div>

    <Prompt cmd="./stats --blended" />
    <div class="sh-out">
      <StatsGrid cv={cv} />
      <Divider label="activity: last 6 months" />
      <Heatmap />
    </div>

    <Prompt cmd="ls core_competencies/" />
    <div class="sh-out">
      <CompetenciesLs cv={cv} />
    </div>

    <Prompt cmd="git log --oneline experience" />
    <div class="sh-out">
      <ExperienceLog cv={cv} />
    </div>

    <Prompt cmd="find projects/ -name '*.sql' -o -name '*.py'" />
    <div class="sh-out">
      <ProjectCards cv={cv} />
    </div>

    <Prompt cmd="stack --all" />
    <div class="sh-out">
      <StackRows cv={cv} />
    </div>

    <Prompt cmd="cat education.txt certifications.txt" />
    <div class="sh-out">
      <EducationCerts cv={cv} />
    </div>

    <Prompt cmd="contact --print" />
    <div class="sh-out">
      <ContactPanel cv={cv} />
    </div>

    <Prompt cmd="" caret={true} blink={true} />
  </ShellWindow>
</BaseLayout>

<style>
  .sh-out { padding: 2px 0; margin-bottom: 4px; }
  .sh-md-head {
    color: var(--ember);
    font-family: var(--font-display);
    font-weight: 600;
    margin: 0 0 6px;
    letter-spacing: 0.02em;
    font-size: inherit;
  }
  .sh-summary { margin: 0; color: var(--fg); max-width: 86ch; }
</style>
```

- [ ] **Step 2: Verify build and types**

```bash
npx astro check && npx astro build
```

Expected: no errors; `dist/index.html` contains all the content.

- [ ] **Step 3: Manual browser check**

```bash
npx astro dev
```

Open `http://localhost:4321/`. Verify:
- All sections render with correct styling.
- Links on project cards resolve to `/projects/<slug>/` (they 404 for now — that's fine).
- Theme toggle flips between dark and light; text remains readable in both.
- Mobile view (DevTools ≤900px): stats collapse to 2 cols, ls rows stack, education/certs stack.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: compose full shell variant home page"
```

---

## Phase 3 — Reveal animation + polish

Goal: first-visit gets the staggered reveal; second visit in the same session loads instantly. `prefers-reduced-motion` always bypasses.

### Task 3.1: Reveal script

**Files:**
- Create: `src/scripts/reveal.ts`

- [ ] **Step 1: Create the script**

```ts
// Runs on first visit in a session, unless prefers-reduced-motion.
// Walks [data-reveal] elements and fades them in on a staggered schedule.

const REVEALED_KEY = 'cv:revealed';
const STAGGER_MS = 700;

const shouldSkip = (): boolean => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  try { return sessionStorage.getItem(REVEALED_KEY) === '1'; } catch { return false; }
};

const revealInstant = (els: NodeListOf<HTMLElement>): void => {
  els.forEach((el) => el.classList.add('in'));
};

const revealStaggered = (els: NodeListOf<HTMLElement>): void => {
  els.forEach((el, i) => {
    const delay = i * STAGGER_MS;
    window.setTimeout(() => el.classList.add('in'), delay);
  });
  try { sessionStorage.setItem(REVEALED_KEY, '1'); } catch {}
};

const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (els.length > 0) {
  if (shouldSkip()) revealInstant(els);
  else revealStaggered(els);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scripts/reveal.ts
git commit -m "feat: add session-gated reveal script"
```

### Task 3.2: Reveal CSS + script inclusion

**Files:**
- Modify: `src/styles/global.css`, `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Append reveal styles to `src/styles/global.css`**

Add at the end of the file:

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
[data-reveal].in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 2: Include the reveal script in `BaseLayout.astro`**

Add inside `<body>`, after the `<main>` closing tag (before end of body), an Astro `<script>` block:

```astro
    <main class="stage">
      <slot />
    </main>
    <script>
      import '../scripts/reveal.ts';
    </script>
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: wire reveal styles and script into base layout"
```

### Task 3.3: Mark shell sections as revealable

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Wrap each `<Prompt ...>` + following `<div class="sh-out">...</div>` pair in a `<div data-reveal>` container**

Update `src/pages/index.astro` so each of the nine prompt/output blocks looks like:

```astro
<div data-reveal>
  <Prompt cmd="whoami" />
  <div class="sh-out">
    <IdentityBlock cv={cv} />
  </div>
</div>
```

Also wrap the MOTD in a `<div data-reveal>` as the first block, and wrap the trailing blinking prompt in a final `<div data-reveal>` block. Order matters — the order in the DOM is the order they reveal.

- [ ] **Step 2: Manual browser check**

```bash
npx astro dev
```

- First load: should see sections fade up one after another.
- Refresh (same tab): instant render.
- DevTools → Application → Session Storage → clear `cv:revealed` → refresh → stagger plays again.
- DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce` → refresh → instant.

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wrap home sections with data-reveal for staggered load"
```

### Task 3.4: CSS-only typed prompts (optional polish)

**Files:**
- Modify: `src/components/shell/Prompt.astro`

- [ ] **Step 1: Add typing animation option**

Update `Prompt.astro` to accept a `typed?: boolean` prop that applies a CSS char-reveal animation on the `.sh-cmd` span using `steps()`.

Replace the file:

```astro
---
interface Props {
  cmd: string;
  caret?: boolean;
  blink?: boolean;
  typed?: boolean;
}
const { cmd, caret = false, blink = false, typed = false } = Astro.props;
const width = `${cmd.length}ch`;
---
<div class="sh-prompt">
  <span class="sh-user">giacomo</span>
  <span class="sh-at">@</span>
  <span class="sh-host">palermo</span>
  <span class="sh-sep">:</span>
  <span class="sh-path">~/cv</span>
  <span class="sh-dollar">$ </span>
  <span class={`sh-cmd ${typed ? 'typed' : ''}`} style={typed ? `--w:${width}; --steps:${cmd.length}` : undefined}>{cmd}</span>
  {caret && <span class={`sh-caret ${blink ? 'blink' : ''}`}>▍</span>}
</div>

<style>
  .sh-prompt { margin: 18px 0 6px; font-family: var(--font-display); }
  .sh-user { color: var(--accent); font-weight: 600; }
  .sh-at, .sh-sep, .sh-dollar { color: var(--fg-dim); }
  .sh-host { color: var(--cyan); font-weight: 600; }
  .sh-path { color: var(--violet); }
  .sh-cmd { color: var(--fg-hi); }
  .sh-cmd.typed {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    width: var(--w, auto);
    animation: typing 0.6s steps(var(--steps, 10)) 1 both;
  }
  @keyframes typing { from { width: 0; } to { width: var(--w, auto); } }
  @media (prefers-reduced-motion: reduce) {
    .sh-cmd.typed { animation: none; width: auto; }
  }
  .sh-caret { color: var(--accent); }
  .sh-caret.blink { animation: blink 1s step-end infinite; }
  @keyframes blink { 50% { opacity: 0; } }
</style>
```

Leave `src/pages/index.astro` alone (prompts stay non-typed by default — the reveal animation is the primary effect and typing-on-top feels busy). The `typed` prop is available if wanted later.

- [ ] **Step 2: Build**

```bash
npx astro build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/shell/Prompt.astro
git commit -m "feat: add optional CSS-only typed prompt animation"
```

### Task 3.5: Contrast sweep (manual)

**Files:**
- Possibly modify: `src/styles/global.css`

- [ ] **Step 1: Manual audit**

```bash
npx astro dev
```

For both themes (dark, light):
- Check `.sh-motd-meta` / `.dim` (fg-dim on bg-1): must meet WCAG AA (4.5:1) for body text. If not, slightly brighten `--fg-dim` in the offending theme.
- Check `.sh-ls-perm` (fg-muted on bg-1): target ≥3:1 for supplementary text.
- Check chips in both themes.
- Check link color contrast.

Use DevTools → Lighthouse → Accessibility audit, or a browser extension like axe DevTools. Note any failures.

- [ ] **Step 2: If fixes needed, adjust tokens in `src/styles/global.css`**

Only tweak `--fg-dim` / `--fg-muted` / `--border` values — do not touch `--accent` or backgrounds.

- [ ] **Step 3: Commit any adjustments (skip if none)**

```bash
git add src/styles/global.css
git commit -m "fix: nudge dim/muted tokens to meet WCAG AA"
```

---

## Phase 4 — Man-page layout + project scaffolding

Goal: three project routes that render with the man-page chrome, sidebar TOC, scrollspy, and MDX bodies. Placeholder content OK — real content in phase 5.

### Task 4.1: Content collection

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Create the collection config**

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    displayName: z.string(),
    subtitle: z.string(),
    period: z.string(),
    lang: z.string(),
    stack: z.array(z.string()),
    stars: z.string(),
    excerpt: z.string(),
    order: z.number(),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: add projects content collection schema"
```

### Task 4.2: Man-page components — TokenHighlight + Lineify

**Files:**
- Create: `src/components/man/TokenHighlight.astro`, `src/components/man/Lineify.astro`

- [ ] **Step 1: Create `TokenHighlight.astro`**

Takes a `text` prop and returns a string with `<span>` tags wrapping recognized tokens (money, percentages, multipliers, keywords). Uses the same regex as the source.

```astro
---
interface Props { text: string; }
const { text } = Astro.props;

const re = /(€[\d.,]+[MK]?|\+?\d+(?:\.\d+)?%|\d+(?:\.\d+)?x|~?\d+(?:\.\d+)?k?|FY\d{2}|C1|B2B|ROAS|GMV|GA4|GTM|BigQuery|GCP|AMER|EMEA|APAC|ITP|sGTM|DE|FR|MTA|MMM|GPT-4|LLM|CRM|P&L|CEO|CTO)/g;

type Part = { type: 'text'; value: string } | { type: 'tok'; cls: string; value: string };

const classify = (tok: string): string => {
  if (tok.startsWith('€')) return 'tok-money';
  if (tok.endsWith('%')) return 'tok-pct';
  if (/x$/.test(tok) && /\d/.test(tok)) return 'tok-mult';
  if (/^(ROAS|GMV|GA4|GTM|BigQuery|GCP|AMER|EMEA|APAC|ITP|sGTM|MTA|MMM|GPT-4|LLM|CRM|P&L|CEO|CTO)$/.test(tok)) return 'tok-kw';
  if (/^(DE|FR|FY\d{2}|C1|B2B)$/.test(tok)) return 'tok-const';
  return 'tok-num';
};

const parts: Part[] = [];
let last = 0;
let m: RegExpExecArray | null;
while ((m = re.exec(text)) !== null) {
  if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) });
  parts.push({ type: 'tok', cls: classify(m[0]), value: m[0] });
  last = m.index + m[0].length;
}
if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
---
{parts.map((p) => p.type === 'text' ? p.value : <span class={p.cls}>{p.value}</span>)}

<style is:global>
  .tok-num { color: var(--violet); }
  .tok-money { color: var(--accent); font-weight: 600; }
  .tok-pct { color: var(--ember); font-weight: 600; }
  .tok-mult { color: var(--accent-2); font-weight: 600; }
  .tok-kw { color: var(--cyan); }
  .tok-const { color: var(--amber); }
</style>
```

- [ ] **Step 2: Create `Lineify.astro`**

Wraps slot children into numbered lines (each line gets a 3-digit line number gutter).

```astro
---
interface Props { start?: number; }
const { start = 1 } = Astro.props;
---
<div class="mn-lineblock">
  <slot />
</div>

<style>
  .mn-lineblock {
    background: var(--bg);
    border: 1px solid var(--border-soft);
    border-radius: 6px;
    padding: 6px 0;
    font-family: var(--font-display);
    font-size: 12.5px;
  }
  .mn-lineblock :global(.mn-line) {
    display: grid;
    grid-template-columns: 42px 1fr;
    padding: 1px 0;
  }
  .mn-lineblock :global(.mn-ln) {
    color: var(--fg-muted);
    text-align: right;
    padding-right: 10px;
    border-right: 1px solid var(--border-soft);
    user-select: none;
  }
  .mn-lineblock :global(.mn-line-body) { padding-left: 14px; }
</style>
```

Because `slot` content needs per-child line numbering that is non-trivial with Astro slots, the MDX authors will emit `<div class="mn-line"><span class="mn-ln">001</span><div class="mn-line-body">...</div></div>` blocks explicitly. Alternative: build a wrapper in the `[...slug].astro` renderer that walks children. For v1, the explicit approach keeps complexity out of the component — document it in the MDX stub in Task 4.5.

- [ ] **Step 3: Commit**

```bash
git add src/components/man/TokenHighlight.astro src/components/man/Lineify.astro
git commit -m "feat: add man-page token highlight and lineify components"
```

### Task 4.3: Man-page Sidebar + scrollspy

**Files:**
- Create: `src/components/man/Sidebar.astro`, `src/scripts/scrollspy.ts`

- [ ] **Step 1: Create `src/scripts/scrollspy.ts`**

```ts
// Active-section tracking for the man-page TOC.
// Uses IntersectionObserver on section headings.

const links = document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]');
if (links.length > 0) {
  const byId = new Map<string, HTMLAnchorElement>();
  links.forEach((a) => {
    const id = a.getAttribute('href')?.replace(/^#/, '');
    if (id) byId.set(id, a);
  });

  const setActive = (id: string): void => {
    links.forEach((a) => a.classList.remove('on'));
    byId.get(id)?.classList.add('on');
  };

  const sections = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length > 0) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    setActive(sections[0].id);
  }
}
```

- [ ] **Step 2: Create `src/components/man/Sidebar.astro`**

```astro
---
import type { CvData } from '../../data/cv';

interface TocEntry { id: string; label: string; }
interface Props {
  cv: CvData;
  toc: TocEntry[];
  manPageId: string; // e.g., "CASTELLO(1)"
  version?: string;  // e.g., "v4.1 · 2026"
}
const { cv, toc, manPageId, version = 'v4.1 · 2026' } = Astro.props;
const buildDate = new Date().toISOString().slice(0, 10);
---
<aside class="mn-aside">
  <div class="mn-aside-head">
    <div class="mn-logo">
      <span class="mn-logo-dot" aria-hidden="true"></span>
      <span class="mn-logo-txt">{manPageId}</span>
    </div>
    <div class="mn-aside-sub">General Commands Manual</div>
  </div>

  <div class="mn-aside-card">
    <span class="mn-badge">{version}</span>
    <div class="mn-aside-name">{cv.name}</div>
    <div class="mn-aside-role">{cv.role}</div>
    <div class="mn-aside-meta">
      <div><span class="mn-k">where</span> {cv.location}</div>
      <div><span class="mn-k">mode </span> {cv.mode}</div>
      <div><span class="mn-k">mail </span> <a href={`mailto:${cv.email}`}>{cv.email}</a></div>
      <div><span class="mn-k">tel  </span> {cv.phone}</div>
    </div>
  </div>

  <nav class="mn-toc" aria-label="Section navigation">
    <div class="mn-toc-title">CONTENTS</div>
    {toc.map((s) => (
      <a href={`#${s.id}`} class="mn-toc-a" data-toc-link>
        <span class="mn-toc-bullet">§</span>
        <span>{s.label}</span>
      </a>
    ))}
  </nav>

  <div class="mn-aside-foot">
    <div class="mn-foot-row">
      <span>Ⓒ 2026</span>
      <span class="mn-foot-dot">·</span>
      <span>BUILT {buildDate}</span>
    </div>
    <div class="mn-foot-row dim">page 1 of 1</div>
  </div>
</aside>

<script>
  import '../../scripts/scrollspy.ts';
</script>

<style>
  .mn-aside {
    background: var(--bg);
    border-right: 1px solid var(--border);
    padding: 20px 18px;
    overflow-y: auto;
    font-size: 12.5px;
  }
  .mn-aside-head { margin-bottom: 16px; }
  .mn-logo { display: flex; align-items: center; gap: 8px; }
  .mn-logo-dot {
    width: 10px;
    height: 10px;
    background: var(--accent);
    border-radius: 2px;
    box-shadow: 0 0 8px color-mix(in oklab, var(--accent), transparent 50%);
  }
  .mn-logo-txt {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--fg-hi);
    letter-spacing: 0.05em;
    font-size: 13px;
  }
  .mn-aside-sub {
    color: var(--fg-muted);
    font-size: 10.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 3px;
    margin-left: 18px;
  }
  .mn-aside-card {
    margin: 16px 0 18px;
    padding: 14px;
    border: 1px solid var(--border);
    background: var(--bg-2);
    border-radius: 6px;
    position: relative;
  }
  .mn-badge {
    position: absolute;
    top: -8px;
    right: 10px;
    background: var(--accent);
    color: var(--bg);
    font-family: var(--font-display);
    font-size: 9.5px;
    font-weight: 700;
    padding: 2px 6px;
    letter-spacing: 0.06em;
    border-radius: 3px;
  }
  .mn-aside-name {
    font-family: var(--font-display);
    font-size: 15px;
    color: var(--fg-hi);
    font-weight: 600;
  }
  .mn-aside-role { color: var(--fg-dim); font-size: 11.5px; margin: 3px 0 10px; }
  .mn-aside-meta {
    display: grid;
    gap: 4px;
    font-size: 11.5px;
    font-family: var(--font-display);
  }
  .mn-k { color: var(--fg-muted); display: inline-block; min-width: 48px; }
  .mn-toc-title {
    font-family: var(--font-display);
    font-size: 10.5px;
    letter-spacing: 0.08em;
    color: var(--fg-muted);
    text-transform: uppercase;
    margin: 0 0 8px;
    padding-left: 2px;
  }
  .mn-toc { display: grid; gap: 1px; margin-bottom: 20px; }
  .mn-toc-a {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 5px 8px;
    border-radius: 3px;
    color: var(--fg-dim);
    border: 0;
    text-decoration: none;
    font-family: var(--font-display);
    font-size: 11.5px;
    letter-spacing: 0.04em;
    transition: all 0.12s ease;
  }
  .mn-toc-a:hover { color: var(--fg); background: var(--bg-2); }
  .mn-toc-a.on {
    color: var(--accent);
    background: color-mix(in oklab, var(--accent), transparent 88%);
  }
  .mn-toc-bullet { color: var(--fg-muted); }
  .mn-toc-a.on .mn-toc-bullet { color: var(--accent); }
  .mn-aside-foot {
    border-top: 1px solid var(--border-soft);
    padding-top: 10px;
    font-family: var(--font-display);
    font-size: 10.5px;
    color: var(--fg-muted);
  }
  .mn-foot-row { display: flex; gap: 6px; }
  .mn-foot-dot { color: var(--border); }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/man src/scripts/scrollspy.ts
git commit -m "feat: add man-page sidebar with scrollspy toc"
```

### Task 4.4: ManPageLayout + dynamic route

**Files:**
- Create: `src/layouts/ManPageLayout.astro`, `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Create `src/layouts/ManPageLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import TopBar from '../components/TopBar.astro';
import Sidebar from '../components/man/Sidebar.astro';
import { cv } from '../data/cv';

interface TocEntry { id: string; label: string; }
interface Props {
  title: string;
  description?: string;
  manPageId: string;
  toc: TocEntry[];
  topbarPath: string;
}
const { title, description, manPageId, toc, topbarPath } = Astro.props;
---
<BaseLayout title={title} description={description}>
  <TopBar slot="topbar" path={topbarPath} />
  <div class="mn-root">
    <Sidebar cv={cv} toc={toc} manPageId={manPageId} />
    <main class="mn-scroll">
      <div class="mn-man-head">
        <span>{manPageId}</span>
        <span class="dim">General Commands Manual</span>
        <span>{manPageId}</span>
      </div>
      <slot />
      <div class="mn-man-foot">
        <span>palermo</span>
        <span class="dim">{new Date().toISOString().slice(0, 10)}</span>
        <span>{manPageId}</span>
      </div>
    </main>
  </div>
</BaseLayout>

<style>
  .mn-root {
    display: grid;
    grid-template-columns: 280px 1fr;
    height: calc(100vh - 80px);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--bg-1);
    box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.5);
  }
  .mn-scroll { overflow-y: auto; padding: 30px 44px 80px; }
  .mn-man-head,
  .mn-man-foot {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    font-family: var(--font-display);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--fg-muted);
  }
  .mn-man-head {
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 22px;
  }
  .mn-man-foot {
    padding-top: 14px;
    border-top: 1px solid var(--border);
    margin-top: 22px;
  }
  .mn-man-head > *:nth-child(2),
  .mn-man-foot > *:nth-child(2) { text-align: center; }
  .mn-man-head > *:nth-child(3),
  .mn-man-foot > *:nth-child(3) { text-align: right; }

  :global(.mn-sec) { margin-bottom: 34px; scroll-margin-top: 20px; }
  :global(.mn-h) {
    font-family: var(--font-display);
    font-size: 13px;
    letter-spacing: 0.1em;
    color: var(--fg-hi);
    margin: 0 0 12px;
    font-weight: 700;
    padding-bottom: 4px;
    border-bottom: 1px dashed var(--border);
  }
  :global(.mn-h3) {
    font-family: var(--font-display);
    font-size: 11.5px;
    letter-spacing: 0.08em;
    color: var(--fg-dim);
    margin: 18px 0 8px;
    font-weight: 600;
  }
  :global(.mn-p) { margin: 0 0 8px; max-width: 82ch; color: var(--fg); }
  :global(.mn-cmd) { color: var(--accent); font-weight: 600; }
  :global(.mn-flag) { color: var(--amber); }
  :global(.mn-codeblock) {
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 14px 18px;
    border-radius: 6px;
    font-family: var(--font-display);
    font-size: 12.5px;
    color: var(--fg);
    margin: 0;
    overflow-x: auto;
  }
  :global(.mn-chip) {
    font-family: var(--font-display);
    font-size: 11px;
    color: var(--fg);
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 3px;
  }
  :global(.mn-stack) { display: grid; gap: 8px; }
  :global(.mn-stack-row) {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 14px;
    padding: 6px 0;
    border-bottom: 1px dashed var(--border-soft);
  }
  :global(.mn-stack-row:last-child) { border-bottom: 0; }
  :global(.mn-stack-k) {
    color: var(--amber);
    font-family: var(--font-display);
    font-size: 12px;
    letter-spacing: 0.02em;
  }
  :global(.mn-stack-v) { display: flex; flex-wrap: wrap; gap: 6px; }

  @media (max-width: 900px) {
    .mn-root {
      grid-template-columns: 1fr;
      height: auto;
    }
    :global(.mn-aside) {
      border-right: 0 !important;
      border-bottom: 1px solid var(--border);
    }
    :global(.mn-stack-row) { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Create `src/pages/projects/[...slug].astro`**

```astro
---
import type { GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import ManPageLayout from '../../layouts/ManPageLayout.astro';

export const getStaticPaths = (async () => {
  const projects = await getCollection('projects');
  return projects.map((p) => ({
    params: { slug: p.slug },
    props: { project: p },
  }));
}) satisfies GetStaticPaths;

const { project } = Astro.props;
const { Content, headings } = await project.render();

const toc = [
  { id: 'name', label: 'NAME' },
  { id: 'synopsis', label: 'SYNOPSIS' },
  { id: 'problem', label: 'PROBLEM' },
  { id: 'approach', label: 'APPROACH' },
  { id: 'stack', label: 'STACK' },
  { id: 'outcome', label: 'OUTCOME' },
  { id: 'see-also', label: 'SEE ALSO' },
];

const pageTitle = `${project.data.displayName} — ${project.data.subtitle}`;
---
<ManPageLayout
  title={pageTitle}
  description={project.data.excerpt}
  manPageId={`${project.slug.toUpperCase().replace(/-/g, '_')}(1)`}
  toc={toc}
  topbarPath={`projects/${project.slug}`}
>
  <Content />
</ManPageLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/ManPageLayout.astro src/pages/projects/[...slug].astro
git commit -m "feat: add man-page layout and dynamic project route"
```

### Task 4.5: Three MDX stubs

**Files:**
- Create: `src/content/projects/css-attribution-exposure.mdx`, `src/content/projects/ai-feed-enrichment.mdx`, `src/content/projects/mta-data-lake.mdx`

- [ ] **Step 1: Create `src/content/projects/css-attribution-exposure.mdx`**

```mdx
---
title: 'css-attribution-exposure'
displayName: 'CSS Attribution Exposure'
subtitle: 'BigQuery investigation · FR·DE'
period: '2024'
lang: 'BigQuery'
stack: ['BigQuery', 'GA4', 'Google Ads Data Transfer', 'GCLID']
stars: 'FR·DE'
excerpt: 'Production BigQuery query joining GA4 export and Google Ads Data Transfer to detect GCLID mismatches and quantify the conversion contribution of third-party Comparison Shopping Services in FR and DE.'
order: 1
---

import TokenHighlight from '../../components/man/TokenHighlight.astro';

<section id="name" class="mn-sec">
  <h2 class="mn-h">NAME</h2>
  <div class="mn-lineblock">
    <div class="mn-line">
      <span class="mn-ln">001</span>
      <div class="mn-line-body">
        <span class="mn-cmd">css-attribution-exposure</span> — BigQuery investigation exposing CSS-driven conversions attributed to Google Ads.
      </div>
    </div>
  </div>
</section>

<section id="synopsis" class="mn-sec">
  <h2 class="mn-h">SYNOPSIS</h2>
  <div class="mn-lineblock">
    <div class="mn-line">
      <span class="mn-ln">001</span>
      <div class="mn-line-body">
        <span class="mn-cmd">bq query</span> <span class="mn-flag">--markets</span> <TokenHighlight text="DE FR" /> <span class="mn-flag">--join</span> ga4 × ads-data-transfer
      </div>
    </div>
  </div>
</section>

<section id="problem" class="mn-sec">
  <h2 class="mn-h">PROBLEM</h2>
  <p class="mn-p">
    <TokenHighlight text="Google Ads auction insights hinted that a non-trivial share of impressions and clicks in DE and FR were being intermediated by third-party Comparison Shopping Services (CSS). Google Ads reporting alone cannot distinguish CSS-driven performance from direct inventory — yet bidding, budget, and exclusion decisions rely on that signal. We needed an event-level join to quantify exposure and inform mitigation." />
  </p>
</section>

<section id="approach" class="mn-sec">
  <h2 class="mn-h">APPROACH</h2>
  <p class="mn-p">
    <TokenHighlight text="Built a production BigQuery query joining the GA4 export (sessions with gclid + page referrer) with the Google Ads Data Transfer ClickStats tables (criterion-level auction metadata). The join surfaces GCLID mismatches where the ad account's attribution differs from session-level referrer evidence — the signature of CSS-intermediated traffic." />
  </p>
  <p class="mn-p">
    Output: per-market CSS-exposure rate, conversion contribution delta, and impacted campaign × keyword list. Fed directly into the bidding review in each market.
  </p>
</section>

<section id="stack" class="mn-sec">
  <h2 class="mn-h">STACK</h2>
  <div class="mn-stack">
    <div class="mn-stack-row">
      <div class="mn-stack-k">data</div>
      <div class="mn-stack-v">
        <span class="mn-chip">GA4 BigQuery export</span>
        <span class="mn-chip">Ads Data Transfer</span>
        <span class="mn-chip">GCLID join</span>
      </div>
    </div>
    <div class="mn-stack-row">
      <div class="mn-stack-k">engine</div>
      <div class="mn-stack-v">
        <span class="mn-chip">BigQuery SQL</span>
        <span class="mn-chip">scheduled queries</span>
      </div>
    </div>
    <div class="mn-stack-row">
      <div class="mn-stack-k">activation</div>
      <div class="mn-stack-v">
        <span class="mn-chip">Looker Studio</span>
        <span class="mn-chip">bidding review</span>
      </div>
    </div>
  </div>
</section>

<section id="outcome" class="mn-sec">
  <h2 class="mn-h">OUTCOME</h2>
  <p class="mn-p">
    <TokenHighlight text="Quantified CSS exposure at the campaign × keyword level in DE and FR. Informed bidding adjustments and exclusion strategy against specific CSS partners; protected margin on the most-intermediated inventory and stabilized reported ROAS against exogenous CSS pressure." />
  </p>
</section>

<section id="see-also" class="mn-sec">
  <h2 class="mn-h">SEE ALSO</h2>
  <p class="mn-p dim">
    <a href="/">/~/cv</a> · <a href="/projects/ai-feed-enrichment/">ai-feed-enrichment(1)</a> · <a href="/projects/mta-data-lake/">mta-data-lake(1)</a>
  </p>
</section>
```

- [ ] **Step 2: Create `src/content/projects/ai-feed-enrichment.mdx`**

```mdx
---
title: 'ai-feed-enrichment'
displayName: 'AI Feed Enrichment'
subtitle: 'GPT-4 + Merchant Center pipeline'
period: '2024'
lang: 'GPT-4 + Merchant Center'
stack: ['GPT-4', 'Python', 'Merchant Center', 'Apps Script', 'BigQuery']
stars: '+4pts ROAS'
excerpt: 'LLM-based pipeline auto-generating localized product titles and descriptions from catalog data. Validated via A/B test at 99% confidence — lifted ROAS from 14.4x to 18.4x on the DE market.'
order: 2
---

import TokenHighlight from '../../components/man/TokenHighlight.astro';

<section id="name" class="mn-sec">
  <h2 class="mn-h">NAME</h2>
  <div class="mn-lineblock">
    <div class="mn-line">
      <span class="mn-ln">001</span>
      <div class="mn-line-body">
        <span class="mn-cmd">ai-feed-enrichment</span> — production GPT-4 pipeline for localized product title/description generation.
      </div>
    </div>
  </div>
</section>

<section id="synopsis" class="mn-sec">
  <h2 class="mn-h">SYNOPSIS</h2>
  <div class="mn-lineblock">
    <div class="mn-line">
      <span class="mn-ln">001</span>
      <div class="mn-line-body">
        <span class="mn-cmd">enrich</span> <span class="mn-flag">--market</span> <TokenHighlight text="DE" /> <span class="mn-flag">--model</span> <TokenHighlight text="GPT-4" /> <span class="mn-flag">--variants</span> ~250k
      </div>
    </div>
  </div>
</section>

<section id="problem" class="mn-sec">
  <h2 class="mn-h">PROBLEM</h2>
  <p class="mn-p">
    <TokenHighlight text="High-end fashion catalog with ~250k size variants on the DE market; product titles and descriptions were literal translations with low keyword density, weak locale-specific phrasing, and no uplift signal. Merchandising bandwidth for manual rewrite was zero. The feed quality ceiling was throttling Shopping campaign performance." />
  </p>
</section>

<section id="approach" class="mn-sec">
  <h2 class="mn-h">APPROACH</h2>
  <p class="mn-p">
    <TokenHighlight text="Built an LLM pipeline that pulls catalog + attribute data from the source, calls GPT-4 with market-specific prompts tuned for premium fashion vocabulary, and pushes the enriched titles/descriptions back to Merchant Center. Output validated against a per-SKU quality rubric before publication." />
  </p>
  <p class="mn-p">
    A/B design: <TokenHighlight text="50/50 hold-out by product_id hash across the full catalog in DE. ROAS measured at 99% confidence across a full business cycle. Clean incrementality read with no contamination since variants are disjoint." />
  </p>
</section>

<section id="stack" class="mn-sec">
  <h2 class="mn-h">STACK</h2>
  <div class="mn-stack">
    <div class="mn-stack-row">
      <div class="mn-stack-k">model</div>
      <div class="mn-stack-v">
        <span class="mn-chip">GPT-4</span>
        <span class="mn-chip">custom prompts (DE)</span>
      </div>
    </div>
    <div class="mn-stack-row">
      <div class="mn-stack-k">runtime</div>
      <div class="mn-stack-v">
        <span class="mn-chip">Python</span>
        <span class="mn-chip">Apps Script</span>
        <span class="mn-chip">Merchant Center API</span>
      </div>
    </div>
    <div class="mn-stack-row">
      <div class="mn-stack-k">measurement</div>
      <div class="mn-stack-v">
        <span class="mn-chip">A/B (product_id hash)</span>
        <span class="mn-chip">GA4</span>
        <span class="mn-chip">BigQuery</span>
      </div>
    </div>
  </div>
</section>

<section id="outcome" class="mn-sec">
  <h2 class="mn-h">OUTCOME</h2>
  <p class="mn-p">
    <TokenHighlight text="ROAS lifted from 14.4x to 18.4x (+4 points) on the DE market at 99% confidence. Pipeline designed for rollout across additional markets and languages; priority queue keyed by margin × volume." />
  </p>
</section>

<section id="see-also" class="mn-sec">
  <h2 class="mn-h">SEE ALSO</h2>
  <p class="mn-p dim">
    <a href="/">/~/cv</a> · <a href="/projects/css-attribution-exposure/">css-attribution-exposure(1)</a> · <a href="/projects/mta-data-lake/">mta-data-lake(1)</a>
  </p>
</section>
```

- [ ] **Step 3: Create `src/content/projects/mta-data-lake.mdx`**

```mdx
---
title: 'mta-data-lake'
displayName: 'MTA Data Lake'
subtitle: 'BigQuery architecture for unified attribution'
period: '2024'
lang: 'BigQuery architecture'
stack: ['BigQuery', 'GA4', 'Google Ads', 'Meta', 'TikTok']
stars: 'designed'
excerpt: 'Unified attribution architecture on BigQuery consolidating GA4, Google Ads, Meta, TikTok and other platforms into a single event-level model. Supports custom windows, incrementality overlays, and channel-level contribution beyond platform ROAS.'
order: 3
---

import TokenHighlight from '../../components/man/TokenHighlight.astro';

<section id="name" class="mn-sec">
  <h2 class="mn-h">NAME</h2>
  <div class="mn-lineblock">
    <div class="mn-line">
      <span class="mn-ln">001</span>
      <div class="mn-line-body">
        <span class="mn-cmd">mta-data-lake</span> — BigQuery attribution architecture spanning all paid channels.
      </div>
    </div>
  </div>
</section>

<section id="synopsis" class="mn-sec">
  <h2 class="mn-h">SYNOPSIS</h2>
  <div class="mn-lineblock">
    <div class="mn-line">
      <span class="mn-ln">001</span>
      <div class="mn-line-body">
        <span class="mn-cmd">bq build</span> <span class="mn-flag">--sources</span> <TokenHighlight text="GA4 Ads Meta TikTok" /> <span class="mn-flag">--model</span> event-level-unified
      </div>
    </div>
  </div>
</section>

<section id="problem" class="mn-sec">
  <h2 class="mn-h">PROBLEM</h2>
  <p class="mn-p">
    <TokenHighlight text="Platform-reported ROAS double-counts conversions across channels and uses each platform's own attribution window. Media mix decisions made on that signal over-credit last-click channels and under-credit upper-funnel investment. We needed a single source of truth at the event level to reason about channel contribution and run holdout/incrementality overlays." />
  </p>
</section>

<section id="approach" class="mn-sec">
  <h2 class="mn-h">APPROACH</h2>
  <p class="mn-p">
    <TokenHighlight text="Designed a BigQuery lakehouse architecture consolidating GA4 export, Google Ads Data Transfer, Meta Marketing API, TikTok Ads API, and other platform feeds into a normalized event-level schema. Windows are configurable per analysis. Incrementality results (from GeoLift / holdouts) overlay as adjustment factors. Output surfaces via Looker Studio for media planning and executive reporting." />
  </p>
</section>

<section id="stack" class="mn-sec">
  <h2 class="mn-h">STACK</h2>
  <div class="mn-stack">
    <div class="mn-stack-row">
      <div class="mn-stack-k">sources</div>
      <div class="mn-stack-v">
        <span class="mn-chip">GA4 export</span>
        <span class="mn-chip">Google Ads DT</span>
        <span class="mn-chip">Meta API</span>
        <span class="mn-chip">TikTok API</span>
      </div>
    </div>
    <div class="mn-stack-row">
      <div class="mn-stack-k">layer</div>
      <div class="mn-stack-v">
        <span class="mn-chip">BigQuery</span>
        <span class="mn-chip">normalized event schema</span>
        <span class="mn-chip">configurable windows</span>
      </div>
    </div>
    <div class="mn-stack-row">
      <div class="mn-stack-k">overlays</div>
      <div class="mn-stack-v">
        <span class="mn-chip">incrementality</span>
        <span class="mn-chip">GeoLift</span>
        <span class="mn-chip">holdouts</span>
      </div>
    </div>
  </div>
</section>

<section id="outcome" class="mn-sec">
  <h2 class="mn-h">OUTCOME</h2>
  <p class="mn-p">
    <TokenHighlight text="Architecture designed and specified for implementation. Unblocks media-mix decisions that go beyond platform-reported ROAS and enables rigorous incrementality overlays at the channel level." />
  </p>
</section>

<section id="see-also" class="mn-sec">
  <h2 class="mn-h">SEE ALSO</h2>
  <p class="mn-p dim">
    <a href="/">/~/cv</a> · <a href="/projects/css-attribution-exposure/">css-attribution-exposure(1)</a> · <a href="/projects/ai-feed-enrichment/">ai-feed-enrichment(1)</a>
  </p>
</section>
```

- [ ] **Step 4: Build and verify**

```bash
npx astro check && npx astro build
```

Expected: build produces `dist/projects/css-attribution-exposure/index.html` and the other two.

- [ ] **Step 5: Manual browser check**

```bash
npx astro dev
```

Visit `http://localhost:4321/projects/ai-feed-enrichment/`. Verify:
- Sidebar renders with `AI_FEED_ENRICHMENT(1)` title, identity card, TOC.
- Scrolling changes the active TOC entry.
- TokenHighlight colors appear on `GPT-4`, `DE`, `14.4x → 18.4x`, etc.
- Layout collapses to stacked on narrow viewport.

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/content/projects
git commit -m "feat: add three project mdx case studies"
```

---

## Phase 5 — 404 and polish content

Goal: 404 page exists; cross-links work end-to-end; content reads well.

### Task 5.1: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create the page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TopBar from '../components/TopBar.astro';
import ShellWindow from '../components/shell/ShellWindow.astro';
import Prompt from '../components/shell/Prompt.astro';
---
<BaseLayout title="404 — not found">
  <TopBar slot="topbar" path="~/404" />
  <ShellWindow title="404 — -bash — 132×60">
    <Prompt cmd="find ." />
    <div class="sh-out">
      <p><span class="dim">find: '.': no such file or directory</span></p>
      <p>try <a href="/">~/cv</a> instead.</p>
    </div>
    <Prompt cmd="" caret={true} blink={true} />
  </ShellWindow>
</BaseLayout>

<style>
  .sh-out { padding: 2px 0; margin-bottom: 4px; }
</style>
```

- [ ] **Step 2: Build + verify**

```bash
npx astro build
```

Expected: `dist/404.html` exists.

- [ ] **Step 3: Manual check**

```bash
npx astro dev
```

Visit any non-existent path (e.g., `http://localhost:4321/zzz`). Expected: the 404 page renders.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add terminal-themed 404 page"
```

### Task 5.2: End-to-end cross-link check

- [ ] **Step 1: Verify navigation paths**

```bash
npx astro dev
```

Click through:
1. Home `/` → click "Download CV" → PDF downloads from `/cv/Giacomo_Castello_CV_Corporate.pdf`.
2. Home → click a project card → lands on project detail page.
3. Project page → SEE ALSO `/~/cv` link → back to home.
4. Project page → other project in SEE ALSO → navigates.
5. Home → `mailto:` link → opens mail client.
6. Home → LinkedIn → opens profile in new tab.
7. Type a bad path → 404 renders → link back to home works.

- [ ] **Step 2: Fix anything broken, commit if changes**

```bash
git status
```

If no changes, skip. Otherwise:

```bash
git add -p
git commit -m "fix: cross-link or content fixes from e2e walkthrough"
```

---

## Phase 6 — Lighthouse / SEO / accessibility pass

Goal: Lighthouse ≥95 across Performance, Accessibility, Best Practices, SEO for both home and a project page.

### Task 6.1: OpenGraph image

**Files:**
- Create: `public/og-image.png`

- [ ] **Step 1: Generate a screenshot**

```bash
npx astro dev
```

In a browser at `http://localhost:4321/`, use DevTools device mode to set viewport to exactly **1200×630**, take a full-screenshot (not the viewport — the *node* screenshot rooted at `.sh-root` padded in the stage), save as PNG. Or use a manual screenshot tool; crop to 1200×630.

Save to `public/og-image.png`.

Stop dev server.

- [ ] **Step 2: Verify build**

```bash
npx astro build
```

- [ ] **Step 3: Commit**

```bash
git add public/og-image.png
git commit -m "feat: add og preview image"
```

### Task 6.2: Sitemap + robots verification

- [ ] **Step 1: Build and inspect sitemap**

```bash
npx astro build
cat dist/sitemap-index.xml
```

Expected: contains `https://jackcastle.github.io/sitemap-0.xml`.

```bash
cat dist/sitemap-0.xml
```

Expected: lists `/`, `/projects/css-attribution-exposure/`, `/projects/ai-feed-enrichment/`, `/projects/mta-data-lake/`, `/404/`.

- [ ] **Step 2: Verify robots.txt**

```bash
cat dist/robots.txt
```

Expected: contains `Sitemap: https://jackcastle.github.io/sitemap-index.xml`.

- [ ] **Step 3: Commit if any updates to config**

(If nothing changed, skip.)

### Task 6.3: Lighthouse + axe run

- [ ] **Step 1: Run Lighthouse locally**

```bash
npx astro build
npx astro preview &
```

(Or visit the deployed `https://jackcastle.github.io/` once the pipeline runs.)

In Chrome DevTools → Lighthouse → Run on **Desktop** + **Mobile**, both categories all four. Run on `/` and on `/projects/ai-feed-enrichment/`.

Stop preview when done.

- [ ] **Step 2: Record scores**

Target: each axis ≥95 on both pages, both form factors. If any axis falls below, note the findings.

- [ ] **Step 3: Typical fixes if needed**

Common issues and fixes:
- **Contrast** failures: nudge `--fg-dim` / `--fg-muted` as in Task 3.5.
- **Tap target size** on mobile: expand TOC link padding to ≥44px.
- **`<html>` has no `lang`**: already set in BaseLayout.
- **Missing `meta description`**: already set.
- **Missing favicon**: verify `public/favicon.svg` exists; if not, create a simple one (green 16×16 square SVG).
- **Unused CSS**: Tailwind v4 purges unused classes automatically. If stats show bloat, check we're not importing full Fontsource `.css` with weights we don't use.
- **Layout shift** from fonts: ensure `@fontsource` imports include `font-display: swap` (default).

Fix in the appropriate file, rebuild, re-run Lighthouse.

- [ ] **Step 4: Commit any fixes**

```bash
git add -p
git commit -m "fix: address lighthouse findings"
```

### Task 6.4: Favicon

**Files:**
- Create or replace: `public/favicon.svg`

- [ ] **Step 1: Verify favicon exists**

```bash
ls -la public/favicon.svg
```

If it's the Astro scaffolder's default, replace with a simple branded favicon. Create `public/favicon.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <rect width="16" height="16" fill="#0d1117"/>
  <rect x="2" y="2" width="4" height="4" fill="#7ee787"/>
  <text x="8" y="12" font-family="monospace" font-size="9" fill="#c9d1d9" font-weight="600">c</text>
</svg>
```

- [ ] **Step 2: Build and commit**

```bash
npx astro build
git add public/favicon.svg
git commit -m "feat: add branded terminal favicon"
```

### Task 6.5: README for the repo

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write a short README**

```markdown
# jackcastle.github.io

Personal portfolio for Giacomo Castello.

- **Live:** https://jackcastle.github.io/
- **Stack:** Astro 5, TypeScript, Tailwind v4, MDX
- **Deploy:** GitHub Actions → GitHub Pages (push to `main`)

## Local dev

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

## Structure

- `src/pages/index.astro` — home (shell variant CV)
- `src/pages/projects/[...slug].astro` — dynamic project route
- `src/content/projects/*.mdx` — project case studies
- `src/components/shell/` — terminal-aesthetic components
- `src/components/man/` — man-page aesthetic components
- `src/data/cv.ts` — CV data (typed)
- `src/styles/global.css` — tokens + base styles
- `docs/superpowers/specs/` — design spec
- `docs/superpowers/plans/` — implementation plans
```

- [ ] **Step 2: Commit + push final**

```bash
git add README.md
git commit -m "docs: add repo readme"
git push
```

- [ ] **Step 3: Final deploy verification**

Watch the Actions run, then visit:
- `https://jackcastle.github.io/`
- `https://jackcastle.github.io/projects/ai-feed-enrichment/`
- `https://jackcastle.github.io/cv/Giacomo_Castello_CV_Corporate.pdf`
- `https://jackcastle.github.io/sitemap-index.xml`

All four must return 200 with correct content.

---

## Self-review

**Spec coverage:**

| Spec section | Covered by |
|---|---|
| §3 Site map (home, 3 projects, CV pdf, 404) | Tasks 1.5–1.6, 2.13, 4.4–4.5, 5.1 |
| §4 Architecture decisions (option C, theme toggle, no font toggle, reveal gating, Tailwind + CSS) | Tasks 1.3–1.5, 3.1–3.3 |
| §5 Project structure | Whole plan (each file mapped) |
| §6 Tech choices | Task 1.2 |
| §7 Design porting strategy | Tasks 1.3, 2.2–2.12, 3.4, 4.2–4.4 |
| §8 Page-by-page content outline | Task 2.13 (home composition); 4.5 (project MDX) |
| §9 Project case studies schema | Tasks 4.1 + 4.5 |
| §10 Deployment pipeline | Task 1.6 |
| §11 Milestones (6 phases) | Phases 1–6 of the plan |
| §12 Accessibility / performance / SEO | Tasks 3.5, 6.1–6.5 |
| §13 Open questions | Surfaced as manual decisions inside specific tasks (photo ASCII-only default, refs line kept, OG screenshot default) |

**Placeholder scan:** no TBDs, no "add appropriate X", no "similar to Task N" — every code block is complete.

**Type consistency:**
- `CvData` / `CvProject` / etc. defined in Task 2.1; consumed by Tasks 2.5–2.12, 4.4 with matching field names (`cv.projects[i].slug`, `cv.stats[i].label`, etc.).
- TOC entry shape `{ id: string; label: string }` used consistently in `Sidebar.astro` and `[...slug].astro`.
- Theme values `'dark' | 'light'` consistent across `theme-init.ts` and `theme-toggle.ts`.
- Props `{ cv: CvData }` uniform across all shell components.

No gaps found.

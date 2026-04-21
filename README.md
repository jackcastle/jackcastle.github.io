# jackcastle.github.io

Personal portfolio for Giacomo Castello.

- **Live:** https://jackcastle.github.io/
- **Stack:** Astro 6, TypeScript, Tailwind v4, MDX
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
- `src/pages/404.astro` — terminal-themed 404
- `src/content/projects/*.mdx` — project case studies
- `src/components/shell/` — terminal-aesthetic components
- `src/components/man/` — man-page aesthetic components
- `src/data/cv.ts` — CV data (typed)
- `src/styles/global.css` — tokens + base styles
- `docs/superpowers/specs/` — design spec
- `docs/superpowers/plans/` — implementation plans

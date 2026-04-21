// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://jackcastle.github.io',
  integrations: [mdx(), sitemap()],
  vite: {
    // @ts-expect-error Astro v6 nests its own Vite install; @tailwindcss/vite types resolve against the top-level Vite, which disagrees on DevEnvironment. Remove once Astro + Tailwind align Vite peers.
    plugins: [tailwindcss()],
  },
});

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
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

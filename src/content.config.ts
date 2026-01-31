// 1. Import utilities from `astro:content`
import { defineCollection } from "astro:content";

// 2. Import loader(s)
import { glob, file } from "astro/loaders";

// 3. Import Zod
import { z } from "astro/zod";

// 4. Define your collection(s)
const learnings = defineCollection({
  loader: glob({
    pattern: [
      "learning/*.md",
      "learning/endeavour/*.md",
      "learning/utils/*.md",
      "learning/raspberry/*.md",
      "!README.md",
    ],
    base: "./src/content/learnings",
  }),

  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    date: z.date(),
    draft: z.boolean().default(false),
  }),
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { learnings };

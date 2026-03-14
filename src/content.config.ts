import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Schema for local MDX files
const localContentSchema = z.object({
  title: z.string(),
  publishedAt: z.string(),
  summary: z.string(),
  image: z.string().optional(),
});

// Blog collection
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: localContentSchema,
});

// Projects collection
const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: localContentSchema,
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};

import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        publishedAt: z.string(),
        summary: z.string(),
        image: z.string().optional(),
    }),
});

const projectsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        publishedAt: z.string(),
        summary: z.string(),
        image: z.string().optional(),
    }),
});

export const collections = {
    blog: blogCollection,
    projects: projectsCollection,
};

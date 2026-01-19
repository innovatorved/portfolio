import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Check if Notion is configured
const notionConfigured = Boolean(
    import.meta.env.NOTION_TOKEN &&
    import.meta.env.NOTION_BLOG_DB_ID &&
    import.meta.env.NOTION_PROJECTS_DB_ID
);

// Schema for local MDX files
const localContentSchema = z.object({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string(),
    image: z.string().optional(),
});

// Dynamic loader for Notion
async function getNotionConfig(databaseEnvVar: string) {
    if (!notionConfigured) {
        return null;
    }
    const { notionLoader } = await import('notion-astro-loader');
    const { notionPageSchema, transformedPropertySchema } = await import('notion-astro-loader/schemas');

    return {
        loader: notionLoader({
            auth: import.meta.env.NOTION_TOKEN,
            database_id: import.meta.env[databaseEnvVar],
            filter: {
                property: 'Status',
                select: { equals: 'Published' }
            }
        }),
        schema: notionPageSchema({
            properties: z.object({
                Name: transformedPropertySchema.title,
                Slug: transformedPropertySchema.rich_text,
                Summary: transformedPropertySchema.rich_text,
                PublishedAt: transformedPropertySchema.date.optional(),
                Image: transformedPropertySchema.url.optional(),
            }),
        }),
    };
}

// Get Notion configs if available
const blogNotionConfig = notionConfigured ? await getNotionConfig('NOTION_BLOG_DB_ID') : null;
const projectsNotionConfig = notionConfigured ? await getNotionConfig('NOTION_PROJECTS_DB_ID') : null;

// Blog collection
const blogCollection = blogNotionConfig
    ? defineCollection({
        loader: blogNotionConfig.loader,
        schema: blogNotionConfig.schema,
    })
    : defineCollection({
        loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
        schema: localContentSchema,
    });

// Projects collection
const projectsCollection = projectsNotionConfig
    ? defineCollection({
        loader: projectsNotionConfig.loader,
        schema: projectsNotionConfig.schema,
    })
    : defineCollection({
        loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
        schema: localContentSchema,
    });

export const collections = {
    blog: blogCollection,
    projects: projectsCollection,
};

// Log which mode we're using
if (!notionConfigured) {
    console.log('⚠️ Notion not configured - using local MDX files');
    console.log('   Set NOTION_TOKEN, NOTION_BLOG_DB_ID, NOTION_PROJECTS_DB_ID in .env to use Notion');
}

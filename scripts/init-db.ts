
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { getAllPosts, getPostById } from '../src/lib/notion'; // Fetch from Notion - ensure this handles process.env
import { posts } from '../src/lib/schema';
import { sql } from 'drizzle-orm';

import { pgTable, text, timestamp, integer, unique } from 'drizzle-orm/pg-core';

// Define schema locally for script if import fails or to ensure direct control during init
// But better to use the shared schema if possible.
// For the purpose of "init-db", we primarily need to push the schema (or let Drizzle Kit handle it usually, but we are doing it manually here via sql or just inserts).
// Let's rely on `postgres` raw for table creation if we don't have migrations set up, OR use Drizzle to insert.
// Since Drizzle kit is for migrations, here we just want to Seed. ideally Drizzle Kit `push` should create tables.
// But let's keep the manual table creation for robustness if Drizzle Kit isn't configured for a specific migration folder yet.
// Actually, let's use the `src/lib/schema` definitions to drive inserts.

if (!process.env.DATABASE_URI) {
    throw new Error('DATABASE_URI is missing');
}

const connectionString = process.env.DATABASE_URI;
const client = postgres(connectionString, { prepare: false, ssl: 'require' });
const db = drizzle(client);

async function initDB() {
    console.log('Initializing Database...');

    // 1. Create Table (manual DDL for now to ensure exact schema matches Drizzle definition expectations)
    // We could use `drizzle-kit push` but inside a script `sql` is easier for single table.
    console.log('Creating/Verifying table...');
    await client`
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            slug TEXT NOT NULL,
            title TEXT NOT NULL,
            summary TEXT,
            content TEXT,
            published_at TIMESTAMP WITH TIME ZONE,
            status TEXT DEFAULT 'Draft',
            image TEXT,
            type TEXT NOT NULL,
            version INTEGER DEFAULT 1,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT unique_slug_type UNIQUE (slug, type)
        );
    `;

    // 2. Fetch from Notion
    if (!process.env.NOTION_BLOG_DB_ID || !process.env.NOTION_PROJECTS_DB_ID || !process.env.NOTION_TOKEN) {
        throw new Error('Missing Notion Database IDs or Token in .env');
    }

    const formatUUID = (id: string) => {
        if (id.length === 36) return id;
        if (id.length !== 32) return id;
        return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(16, 4)}-${id.substr(20)}`;
    };

    const blogDbId = formatUUID(process.env.NOTION_BLOG_DB_ID);
    const projectsDbId = formatUUID(process.env.NOTION_PROJECTS_DB_ID);

    console.log('Fetching Blog Posts list from Notion...');
    const blogPostsList = await getAllPosts(blogDbId);
    console.log(`Found ${blogPostsList.length} blog posts. Fetching content for each...`);

    for (const partialPost of blogPostsList) {
        console.log(`Syncing blog: ${partialPost.title}`);
        const post = await getPostById(partialPost.id);

        if (!post) {
            console.error(`Failed to fetch content for ${partialPost.title}`);
            continue;
        }

        await db.insert(posts).values({
            id: post.id,
            slug: post.slug,
            title: post.title,
            summary: post.summary,
            content: post.content || '',
            publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
            status: post.status,
            image: post.image,
            type: 'blog',
            version: 1,
            updatedAt: new Date()
        }).onConflictDoUpdate({
            target: posts.id,
            set: {
                slug: post.slug,
                title: post.title,
                summary: post.summary,
                content: post.content || '',
                publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
                status: post.status,
                image: post.image,
                type: 'blog',
                updatedAt: new Date()
            }
        });
    }

    console.log('Fetching Projects list from Notion...');
    const projectsList = await getAllPosts(projectsDbId);
    console.log(`Found ${projectsList.length} projects. Fetching content for each...`);

    for (const partialProject of projectsList) {
        console.log(`Syncing project: ${partialProject.title}`);
        const project = await getPostById(partialProject.id);

        if (!project) {
            console.error(`Failed to fetch content for ${partialProject.title}`);
            continue;
        }

        await db.insert(posts).values({
            id: project.id,
            slug: project.slug,
            title: project.title,
            summary: project.summary,
            content: project.content || '',
            publishedAt: project.publishedAt ? new Date(project.publishedAt) : undefined,
            status: project.status,
            image: project.image,
            type: 'project',
            version: 1,
            updatedAt: new Date()
        }).onConflictDoUpdate({
            target: posts.id,
            set: {
                slug: project.slug,
                title: project.title,
                summary: project.summary,
                content: project.content || '',
                publishedAt: project.publishedAt ? new Date(project.publishedAt) : undefined,
                status: project.status,
                image: project.image,
                type: 'project',
                updatedAt: new Date()
            }
        });
    }

    console.log('Done!');
    process.exit(0);
}

initDB().catch((err) => {
    console.error(err);
    process.exit(1);
});

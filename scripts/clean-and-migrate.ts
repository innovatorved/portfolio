#!/usr/bin/env bun

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { posts } from '../src/lib/schema';
import { getAllPosts, getPostById } from '../src/lib/notion';

// Configuration from environment
const BLOG_DB_ID = process.env.NOTION_BLOG_DB_ID;
const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DB_ID;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const URL = process.env.TURSO_CONNECTION_URL;
const AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!BLOG_DB_ID || !PROJECTS_DB_ID || !NOTION_TOKEN || !URL) {
    console.error('❌ Missing required environment variables');
    console.error('Required: NOTION_BLOG_DB_ID, NOTION_PROJECTS_DB_ID, NOTION_TOKEN, TURSO_CONNECTION_URL');
    process.exit(1);
}

// Notion API Helper
async function notionRequest(endpoint: string, method: string, body?: any) {
    const url = `https://api.notion.com/v1/${endpoint}`;
    const options: any = {
        method,
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Notion API Error ${response.status}: ${text}`);
    }

    return response.json();
}

/**
 * Format Notion ID to UUID format
 */
function formatUUID(id: string): string {
    if (id.length === 36) return id;
    if (id.length !== 32) return id;
    return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(16, 4)}-${id.substr(20)}`;
}

/**
 * Archive all pages in a Notion database
 */
async function clearNotionDatabase(dbId: string, dbName: string) {
    console.log(`\n🗑️  Clearing ${dbName} database...`);

    const formattedDbId = formatUUID(dbId);
    let hasMore = true;
    let cursor: string | undefined = undefined;
    let totalArchived = 0;

    while (hasMore) {
        const response: any = await notionRequest(`databases/${formattedDbId}/query`, 'POST', {
            start_cursor: cursor
        });

        const pages = response.results || [];
        console.log(`   Found ${pages.length} pages to archive...`);

        for (const page of pages) {
            try {
                await notionRequest(`pages/${page.id}`, 'PATCH', { archived: true });
                totalArchived++;
                console.log(`   ✓ Archived page ${totalArchived}`);
                // Rate limiting
                await new Promise(r => setTimeout(r, 100));
            } catch (error) {
                console.error(`   ✗ Failed to archive page:`, error);
            }
        }

        hasMore = response.has_more;
        cursor = response.next_cursor;
    }

    console.log(`✅ Archived ${totalArchived} pages from ${dbName}`);
}

/**
 * Clear Turso database
 */
async function clearTursoDatabase() {
    console.log('\n🗑️  Clearing Turso database...');

    const client = createClient({ url: URL!, authToken: AUTH_TOKEN });
    const db = drizzle(client);

    try {
        const result = await client.execute('DELETE FROM posts');
        console.log(`✅ Deleted ${result.rowsAffected} rows from posts table`);
    } catch (error) {
        console.error('❌ Error clearing Turso:', error);
        throw error;
    }
}

/**
 * Run the migration script
 */
async function runMigration() {
    console.log('\n📦 Running migration from MDX to Notion...');

    // Import and run the existing migrate.ts script
    const { default: migrate } = await import('./migrate');
    // The migrate.ts exports a main() function that we can call
    // But since it has a main() call at the end, we might need to run it as a subprocess

    // For now, let's just inform the user to check the output
    console.log('Migration script will run next...');
}

/**
 * Sync Notion to Turso
 */
async function syncNotionToTurso() {
    console.log('\n🔄 Syncing Notion to Turso...');

    const client = createClient({ url: URL!, authToken: AUTH_TOKEN });
    const db = drizzle(client);

    try {
        const blogDbId = formatUUID(BLOG_DB_ID!);
        const projectsDbId = formatUUID(PROJECTS_DB_ID!);

        // Sync Blog Posts
        console.log('📝 Syncing blog posts...');
        const blogPostsList = await getAllPosts(blogDbId);
        console.log(`   Found ${blogPostsList.length} blog posts`);

        for (const partialPost of blogPostsList) {
            console.log(`   Syncing blog: ${partialPost.title}`);
            const post = await getPostById(partialPost.id);

            if (!post) {
                console.error(`   ✗ Failed to fetch content for ${partialPost.title}`);
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
                    updatedAt: new Date()
                }
            });

            // Rate limiting
            await new Promise(r => setTimeout(r, 100));
        }

        // Sync Projects
        console.log('📂 Syncing projects...');
        const projectsList = await getAllPosts(projectsDbId);
        console.log(`   Found ${projectsList.length} projects`);

        for (const partialProject of projectsList) {
            console.log(`   Syncing project: ${partialProject.title}`);
            const project = await getPostById(partialProject.id);

            if (!project) {
                console.error(`   ✗ Failed to fetch content for ${partialProject.title}`);
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
                    updatedAt: new Date()
                }
            });

            // Rate limiting
            await new Promise(r => setTimeout(r, 100));
        }

        console.log('✅ Database sync complete!');
    } catch (error) {
        console.error('❌ Error syncing to Turso:', error);
        throw error;
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('🚀 Starting Clean and Complete Migration Process');
    console.log('='.repeat(60));

    try {
        // Step 1: Clear Notion Databases
        console.log('\n📍 STEP 1: Clearing Notion Databases');
        await clearNotionDatabase(BLOG_DB_ID!, 'Blog');
        await clearNotionDatabase(PROJECTS_DB_ID!, 'Projects');

        // Step 2: Clear Turso Database
        console.log('\n📍 STEP 2: Clearing Turso Database');
        await clearTursoDatabase();

        // Step 3: Wait a bit for Notion to settle
        console.log('\n⏳ Waiting 3 seconds for Notion to settle...');
        await new Promise(r => setTimeout(r, 3000));

        // Step 4: Inform user to run migration
        console.log('\n📍 STEP 3: Migrate MDX to Notion');
        console.log('✅ Databases cleared successfully!');
        console.log('\n' + '='.repeat(60));
        console.log('🎯 Next Steps:');
        console.log('   1. Run: bun scripts/migrate.ts');
        console.log('      (This will migrate all MDX files to Notion)');
        console.log('   2. After migration completes, run this script with --sync-only flag');
        console.log('      to sync Notion to Turso');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Check if we should only sync
const args = process.argv.slice(2);
if (args.includes('--sync-only')) {
    console.log('🚀 Running Sync Only Mode');
    console.log('='.repeat(60));
    syncNotionToTurso()
        .then(() => {
            console.log('\n✅ All done!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Sync failed:', error);
            process.exit(1);
        });
} else {
    main();
}

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { posts, type Post } from './schema';
import { eq, and, desc } from 'drizzle-orm';

const url = import.meta.env.TURSO_CONNECTION_URL || process.env.TURSO_CONNECTION_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

if (!url) {
    throw new Error('TURSO_CONNECTION_URL environment variable is not set');
}

const client = createClient({ url, authToken });
const db = drizzle(client);

// Type definition for DBPost to match schema inference or extend if needed
export type DBPost = Post;

export async function getPostBySlug(slug: string, type: 'blog' | 'project'): Promise<DBPost | undefined> {
    const results = await db.select()
        .from(posts)
        .where(and(eq(posts.slug, slug), eq(posts.type, type), eq(posts.status, 'Published')))
        .limit(1);

    return results[0];
}

export async function upsertPost(post: DBPost) {
    return await db.insert(posts).values(post).onConflictDoUpdate({
        target: posts.id,
        set: {
            slug: post.slug,
            title: post.title,
            summary: post.summary,
            content: post.content,
            publishedAt: post.publishedAt,
            status: post.status,
            image: post.image,
            type: post.type,
            version: post.version,
            updatedAt: new Date(),
        }
    });
}

export async function getAllPosts(type: 'blog' | 'project'): Promise<DBPost[]> {
    return await db.select()
        .from(posts)
        .where(
            and(
                eq(posts.type, type),
                eq(posts.status, 'Published')
            )
        )
        .orderBy(desc(posts.publishedAt));
}

export default db;

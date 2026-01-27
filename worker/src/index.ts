import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { createClient } from '@libsql/client';

export interface Env {
    NOTION_TOKEN: string;
    TURSO_CONNECTION_URL: string;
    TURSO_AUTH_TOKEN: string;
    NOTION_DATABASE_ID_BLOG: string;
    NOTION_DATABASE_ID_PROJECTS: string;
    WEBHOOK_SECRET?: string;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // We only handle GET requests triggered by the Notion Button
        if (request.method !== 'GET') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const secret = url.searchParams.get('secret');
        const pageId = url.searchParams.get('pageId');
        const typeStr = url.searchParams.get('type');

        // 1. Validate Secret
        if (!env.WEBHOOK_SECRET || secret !== env.WEBHOOK_SECRET) {
            return new Response('Unauthorized: Invalid Secret', { status: 401 });
        }

        if (!pageId) {
            return new Response('Missing pageId', { status: 400 });
        }

        let type: 'blog' | 'project' = 'blog';
        if (typeStr === 'project') type = 'project';

        try {
            // 2. Init Clients
            const notion = new Client({
                auth: env.NOTION_TOKEN,
                fetch: fetch.bind(globalThis)
            });
            const n2m = new NotionToMarkdown({ notionClient: notion });

            // Connect to Turso
            const client = createClient({
                url: env.TURSO_CONNECTION_URL,
                authToken: env.TURSO_AUTH_TOKEN
            });

            // 3. Fetch Page & Content
            const page = await notion.pages.retrieve({ page_id: pageId }) as any;
            const mdblocks = await n2m.pageToMarkdown(pageId);
            const mdString = n2m.toMarkdownString(mdblocks);
            const content = mdString.parent || '';

            // Extract properties
            const slug = page.properties.Slug?.rich_text[0]?.plain_text || page.id;
            const title = page.properties.Name?.title[0]?.plain_text || 'Untitled';
            const summary = page.properties.Summary?.rich_text[0]?.plain_text || '';
            const publishedAt = page.properties.PublishedAt?.date?.start ? new Date(page.properties.PublishedAt.date.start).getTime() : Date.now();
            const status = page.properties.Status?.select?.name || 'Draft';
            const image = page.properties.Image?.url || null;

            // 4. Upsert to Turso - handle unique constraint on (slug, type)
            const contentLength = content.length;
            console.log(`Syncing: ${slug} (${type}), content: ${contentLength} chars`);

            try {
                // First, delete any existing row with same slug+type but different id
                // (handles case where page ID changed in Notion)
                const deleteResult = await client.execute({
                    sql: 'DELETE FROM posts WHERE slug = ? AND type = ? AND id != ?',
                    args: [slug, type, page.id]
                });

                console.log(`Deleted ${deleteResult.rowsAffected} old row(s)`);

                // Then upsert based on id
                await client.execute({
                    sql: `
                        INSERT INTO posts (id, slug, title, summary, content, published_at, status, image, type, version, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT (id) 
                        DO UPDATE SET 
                            slug = excluded.slug,
                            title = excluded.title,
                            summary = excluded.summary,
                            content = excluded.content,
                            published_at = excluded.published_at,
                            status = excluded.status,
                            image = excluded.image,
                            type = excluded.type,
                            version = version + 1,
                            updated_at = excluded.updated_at
                    `,
                    args: [
                        page.id,
                        slug,
                        title,
                        summary,
                        content,
                        publishedAt,
                        status,
                        image,
                        type,
                        1,
                        Date.now()
                    ]
                });
                console.log('✅ DB sync successful');
            } catch (dbErr: any) {
                // Detailed error logging
                console.error('DB Error:', dbErr);
                const errorInfo: any = {
                    message: dbErr.message || String(dbErr),
                    name: dbErr.name,
                    code: dbErr.code,
                    contentLength,
                };
                throw new Error(`DB error: ${JSON.stringify(errorInfo, null, 2)}`);
            }

            // 5. Return Success Response
            return Response.json({
                success: true,
                message: 'Synced to Database',
                data: {
                    id: page.id,
                    title,
                    slug,
                    type,
                    status
                }
            });

        } catch (error: any) {
            console.error('Worker error:', error);
            return Response.json({
                success: false,
                error: error.message,
                stack: error.stack
            }, { status: 500 });
        }
    }
};

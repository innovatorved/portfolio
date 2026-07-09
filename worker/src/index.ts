import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { createClient } from '@libsql/client';
import { cacheMediaToR2, rewriteContentMediaUrls, type MediaEnv } from './media';

export interface Env extends MediaEnv {
    NOTION_TOKEN: string;
    TURSO_CONNECTION_URL: string;
    TURSO_AUTH_TOKEN: string;
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

        // 1. Validate Secret (guards both media serving and content sync)
        if (!env.WEBHOOK_SECRET || secret !== env.WEBHOOK_SECRET) {
            return new Response('Unauthorized: Invalid Secret', { status: 401 });
        }

        // Media serving: GET /media/<key>?secret=... streams the R2 object.
        // Used by the Astro build to download cached media into local /assets.
        if (url.pathname.startsWith('/media/')) {
            // Key comes only from the URL path and is used as an R2 object lookup
            // (storage key, not a filesystem path), so no path-traversal risk.
            const key = decodeURIComponent(url.pathname.slice(1));
            const object = await env.MEDIA_BUCKET.get(key);
            if (!object) {
                return new Response('Not Found', { status: 404 });
            }
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', object.httpEtag);
            headers.set('cache-control', 'public, max-age=31536000, immutable');
            return new Response(object.body, { headers });
        }

        const pageId = url.searchParams.get('pageId');
        const typeStr = url.searchParams.get('type');

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
            const rawImage = page.properties.Image?.url || null;

            // Cache cover image and inline content media to R2 while Notion URLs are still valid
            const image = await cacheMediaToR2(rawImage, env);
            const cachedContent = await rewriteContentMediaUrls(content, env);

            // 4. Upsert to Turso - handle unique constraint on (slug, type)
            const contentLength = cachedContent?.length ?? 0;
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
                        cachedContent,
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

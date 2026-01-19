import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
    auth: import.meta.env?.NOTION_TOKEN || process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

n2m.setCustomTransformer('video', async (block) => {
    const { video } = block as any;
    if (video?.type === 'external') {
        return `<video controls src="${video.external.url}" style="width: 100%; max-width: 100%; height: auto; border-radius: 8px;"></video>`;
    }
    if (video?.type === 'file') {
        return `<video controls src="${video.file.url}" style="width: 100%; max-width: 100%; height: auto; border-radius: 8px;"></video>`;
    }
    return '';
});

export interface Post {
    id: string;
    slug: string;
    title: string;
    summary: string;
    publishedAt: string;
    status: 'Published' | 'Draft';
    image?: string;
    content?: string; // Markdown content
}

export const getPostBySlug = async (slug: string, dbId: string): Promise<Post | null> => {
    // We use getAllPosts logic implicitly via finding by slug, but here we can query directly
    console.log(`Querying database for slug: ${slug}`);

    // @ts-ignore
    const response = await (notion.databases as any).query({
        database_id: dbId,
        filter: {
            property: 'Slug',
            rich_text: {
                equals: slug,
            },
        },
    });

    if (response.results.length === 0) {
        return null;
    }

    const page = response.results[0] as any;
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    return {
        id: page.id,
        slug: page.properties.Slug.rich_text[0]?.plain_text || '',
        title: page.properties.Name.title[0]?.plain_text || '',
        summary: page.properties.Summary?.rich_text[0]?.plain_text || '',
        publishedAt: page.properties.PublishedAt?.date?.start || '',
        status: page.properties.Status?.select?.name || 'Draft',
        image: page.properties.Image?.url || null,
        content: mdString.parent,
    };
};

export const getPostById = async (pageId: string): Promise<Post | null> => {
    try {
        const page = await notion.pages.retrieve({ page_id: pageId }) as any;
        const mdblocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdblocks);

        return {
            id: page.id,
            slug: page.properties.Slug.rich_text[0]?.plain_text || '',
            title: page.properties.Name.title[0]?.plain_text || '',
            summary: page.properties.Summary?.rich_text[0]?.plain_text || '',
            publishedAt: page.properties.PublishedAt?.date?.start || '',
            status: page.properties.Status?.select?.name || 'Draft',
            image: page.properties.Image?.url || null,
            content: mdString.parent,
        };
    } catch (error) {
        console.error("Error fetching page by ID:", error);
        return null;
    }
};

export const getAllPosts = async (dbId: string): Promise<Post[]> => {
    console.log(`getAllPosts calling DB: ${dbId}`);

    try {
        await notion.databases.retrieve({ database_id: dbId });
        console.log('Database retrieved successfully');
    } catch (e: any) {
        console.error('Retrieve failed:', e.message);
    }

    // Fallback to fetch because client.request is being fussy about the URL
    const response = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${import.meta.env?.NOTION_TOKEN || process.env.NOTION_TOKEN}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28', // Use pinned version or verify what client uses
        },
        body: JSON.stringify({
            filter: {
                property: 'Status',
                select: {
                    equals: 'Published'
                }
            },
            sorts: [
                {
                    property: 'PublishedAt',
                    direction: 'descending'
                }
            ]
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Notion API Error: ${response.status} ${err}`);
    }

    const data = await response.json() as any;

    return data.results.map((page: any) => ({
        id: page.id,
        slug: page.properties.Slug.rich_text[0]?.plain_text || page.id,
        title: page.properties.Name.title[0]?.plain_text || 'Untitled',
        summary: page.properties.Summary?.rich_text[0]?.plain_text || '',
        publishedAt: page.properties.PublishedAt?.date?.start || new Date().toISOString(),
        status: page.properties.Status?.select?.name || 'Draft',
        image: page.properties.Image?.url || null,
        content: '',
    }));
}

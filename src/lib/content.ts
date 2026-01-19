/**
 * Content helpers for normalizing data from both local MDX and Notion sources
 */

interface NormalizedPost {
    id: string;
    slug: string;
    title: string;
    summary: string;
    publishedAt: string;
    image?: string;
    rawData: any;
}

/**
 * Check if content is from Notion (has properties object)
 */
function isNotionContent(data: any): boolean {
    return data && typeof data === 'object' && 'properties' in data;
}

/**
 * Normalize a blog or project post from either local MDX or Notion format
 */
export function normalizePost(post: any): NormalizedPost {
    const data = post.data;

    if (isNotionContent(data)) {
        // Notion format - extract from properties
        const props = data.properties;

        // Handle PublishedAt - can be string, Date object, or { start: string }
        let publishedAt: string;
        const pubDate = props.PublishedAt;
        if (!pubDate) {
            publishedAt = new Date().toISOString().split('T')[0];
        } else if (typeof pubDate === 'string') {
            publishedAt = pubDate;
        } else if (pubDate instanceof Date) {
            publishedAt = pubDate.toISOString().split('T')[0];
        } else if (typeof pubDate === 'object' && 'start' in pubDate) {
            publishedAt = pubDate.start;
        } else {
            publishedAt = new Date().toISOString().split('T')[0];
        }

        return {
            id: post.id,
            slug: props.Slug || post.id,
            title: props.Name || 'Untitled',
            summary: props.Summary || '',
            publishedAt,
            image: props.Image || undefined,
            rawData: data,
        };
    } else {
        // Local MDX format - use directly
        return {
            id: post.id,
            slug: post.id.replace(/\.mdx$/, ''),
            title: data.title,
            summary: data.summary,
            publishedAt: data.publishedAt,
            image: data.image,
            rawData: data,
        };
    }
}

/**
 * Get normalized posts sorted by date
 */
export function normalizePosts(posts: any[]): NormalizedPost[] {
    return posts
        .map(normalizePost)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

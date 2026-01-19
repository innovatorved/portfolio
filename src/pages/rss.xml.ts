import rss from '@astrojs/rss';
import { getAllPosts } from '@/lib/db';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
    const posts = await getAllPosts('blog');
    const projects = await getAllPosts('project');

    // Combine blog posts and projects
    const blogItems = posts.map((post) => ({
        title: post.title,
        pubDate: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        description: post.summary || '',
        link: `/blog/${post.slug}/`,
    }));

    const projectItems = projects.map((project) => ({
        title: project.title,
        pubDate: project.publishedAt ? new Date(project.publishedAt) : new Date(),
        description: project.summary || '',
        link: `/projects/${project.slug}/`,
    }));

    const allItems = [...blogItems, ...projectItems].sort(
        (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
    );

    const response = await rss({
        title: 'Ved Gupta Portfolio',
        description: 'Blog posts and projects by Ved Gupta on Cloud, AI, and Web Development',
        site: context.site!,
        items: allItems,
        customData: `<language>en-us</language>`,
    });

    // Add ISR-like caching
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600');

    return response;
}

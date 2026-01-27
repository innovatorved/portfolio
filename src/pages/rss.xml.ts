import rss from '@astrojs/rss';
import { getAllPosts } from '@/lib/db';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
    const posts = await getAllPosts('blog');
    const projects = await getAllPosts('project');

    // Combine blog posts and projects with categories
    const blogItems = posts.map((post) => ({
        title: post.title,
        pubDate: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        description: post.summary || '',
        link: `/blog/${post.slug}`,
        // Add categories/tags for better feed organization
        categories: ['blog', 'technology'],
        // Include content for full-text feeds
        content: post.summary || '',
        author: 'Ved Gupta',
    }));

    const projectItems = projects.map((project) => ({
        title: project.title,
        pubDate: project.publishedAt ? new Date(project.publishedAt) : new Date(),
        description: project.summary || '',
        link: `/projects/${project.slug}`,
        categories: ['project', 'portfolio'],
        content: project.summary || '',
        author: 'Ved Gupta',
    }));

    const allItems = [...blogItems, ...projectItems].sort(
        (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
    );

    const response = await rss({
        // Channel metadata
        title: 'Ved Gupta Portfolio',
        description: 'Blog posts and projects by Ved Gupta on Cloud, AI, and Web Development',
        site: context.site!,
        items: allItems,
        // Note: No stylesheet - shows raw XML in browser
        // Add stylesheet: '/rss/styles.xsl' for styled browser view
        // Match site's trailing slash configuration
        trailingSlash: false,
        // Additional channel customization
        customData: `
            <language>en-us</language>
            <copyright>© ${new Date().getFullYear()} Ved Gupta</copyright>
            <managingEditor>me@vedgupta.in (Ved Gupta)</managingEditor>
            <webMaster>me@vedgupta.in (Ved Gupta)</webMaster>
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            <generator>Astro v5</generator>
        `,
    });

    // Add ISR-like caching
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600');

    return response;
}

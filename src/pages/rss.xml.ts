import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
    const posts = await getCollection('blog');
    const projects = await getCollection('projects');

    // Combine blog posts and projects
    const blogItems = posts.map((post) => ({
        title: post.data.title,
        pubDate: new Date(post.data.publishedAt),
        description: post.data.summary || '',
        link: `/blog/${post.slug}/`,
    }));

    const projectItems = projects.map((project) => ({
        title: project.data.title,
        pubDate: new Date(project.data.publishedAt),
        description: project.data.summary || '',
        link: `/projects/${project.slug}/`,
    }));

    const allItems = [...blogItems, ...projectItems].sort(
        (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
    );

    return rss({
        title: 'Ved Gupta Portfolio',
        description: 'Blog posts and projects by Ved Gupta on Cloud, AI, and Web Development',
        site: context.site!,
        items: allItems,
        customData: `<language>en-us</language>`,
    });
}

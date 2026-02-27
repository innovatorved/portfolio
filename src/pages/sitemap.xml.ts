import { getAllPosts } from '@/lib/db';
import type { APIContext } from 'astro';

// Static pages with their priorities
const STATIC_PAGES = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: 'about', priority: 0.9, changefreq: 'monthly' },
  { path: 'blog', priority: 0.9, changefreq: 'daily' },
  { path: 'projects', priority: 0.9, changefreq: 'weekly' },
  { path: 'certifications', priority: 0.8, changefreq: 'monthly' },
] as const;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0];
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export async function GET(context: APIContext) {
  const posts = await getAllPosts('blog');
  const projects = await getAllPosts('project');

  const siteUrl = context.site?.toString().replace(/\/$/, '') || 'https://vedgupta.in';

  // Generate URL entries
  const staticEntries = STATIC_PAGES.map(
    (page) => `
  <url>
    <loc>${escapeXml(siteUrl)}/${escapeXml(page.path)}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  ).join('');

  const blogEntries = posts.map(
    (post) => `
  <url>
    <loc>${escapeXml(siteUrl)}/blog/${escapeXml(post.slug)}</loc>
    <lastmod>${formatDate(post.updatedAt || post.publishedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  ).join('');

  const projectEntries = projects.map(
    (project) => `
  <url>
    <loc>${escapeXml(siteUrl)}/projects/${escapeXml(project.slug)}</loc>
    <lastmod>${formatDate(project.updatedAt || project.publishedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  ).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${staticEntries}${blogEntries}${projectEntries}
</urlset>`;

  return new Response(sitemap.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // ISR-like caching: cache for 1 hour, stale for 1 hour
      // 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=3600',
    },
  });
}


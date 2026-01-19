import { getAllPosts } from '@/lib/db';

export async function GET({ site }: { site: URL }) {
  const posts = await getAllPosts('blog');
  const projects = await getAllPosts('project');

  const pages = [
    '',
    'blog',
    'projects',
    'about',
    'certifications'
  ];

  const siteUrl = site.toString().replace(/\/$/, '');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map((page) => `
  <url>
    <loc>${siteUrl}/${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
  ${posts.map((post) => `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
  ${projects.map((project) => `
  <url>
    <loc>${siteUrl}/projects/${project.slug}</loc>
    <lastmod>${project.updatedAt ? new Date(project.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      // ISR-like caching: cache for 1 hour, stale for 1 hour
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=3600'
    }
  });
}

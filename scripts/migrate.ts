
import fs from 'node:fs';
import path from 'node:path';
import { markdownToBlocks } from '@tryfabric/martian';
import { UTApi } from 'uploadthing/server';

// Configuration
const BLOG_DIR = './src/content/blog';
const PROJECTS_DIR = './src/content/projects';
const PUBLIC_DIR = './public'; // Used for resolving absolute paths from MDX if they start with /
const BLOG_DB_ID = process.env.NOTION_BLOG_DB_ID;
const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DB_ID;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN;

if (!BLOG_DB_ID || !PROJECTS_DB_ID || !NOTION_TOKEN) {
    console.error('Missing DB IDs or Token in environment');
    process.exit(1);
}

// Initialize UploadThing
const utapi = UPLOADTHING_TOKEN ? new UTApi({ token: UPLOADTHING_TOKEN }) : null;

// Cache for uploaded assets to prevent duplicates
// Map<LocalPath, RemoteUrl>
const globalAssetCache = new Map<string, string>();


// Notion API Helper
async function notionRequest(endpoint: string, method: string, body?: any) {
    const url = `https://api.notion.com/v1/${endpoint}`;
    const options: any = {
        method,
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Notion API Error ${response.status}: ${text}`);
    }

    return response.json();
}

/**
 * Upload an asset to UploadThing and return the URL
 */
async function uploadAsset(assetPath: string): Promise<string | null> {
    if (!utapi) {
        console.warn('⚠️ UPLOADTHING_TOKEN not set, skipping upload for:', assetPath);
        return null;
    }

    // Resolve path
    // If it starts with /static or /, it's likely relative to public folder
    let localPath = assetPath;
    if (assetPath.startsWith('/')) {
        localPath = path.join(PUBLIC_DIR, assetPath);
    } else {
        // If relative, we might need context of where the MDX file is.
        // For now, assume unique filenames or standard structure or just try to find it?
        // Actually, most astro projects use /public for static assets referenced as /image.png
        // If it's ./image.png, it's relative to file. 
        // Let's assume standard /public paths for now as seen in User's example: /static/images/...
        localPath = path.join(PUBLIC_DIR, assetPath);
    }

    if (globalAssetCache.has(localPath)) {
        console.log(`⚡ Using cached upload for: ${assetPath}`);
        return globalAssetCache.get(localPath)!;
    }

    if (!fs.existsSync(localPath)) {
        // Try without leading slash or relative to current dir just in case
        if (fs.existsSync(assetPath)) {
            localPath = assetPath;
        } else {
            console.warn(`⚠️ Asset not found locally: ${localPath}`);
            return null;
        }
    }

    try {
        console.log(`Uploading ${assetPath}...`);
        const fileBuffer = fs.readFileSync(localPath);
        const file = new File([fileBuffer as any], path.basename(assetPath));
        const response = await utapi.uploadFiles([file]);

        // Fix for deprecated 'url' warning - strictly use ufsUrl
        const data: any = response[0]?.data;
        const uploadedUrl = data?.ufsUrl;

        if (uploadedUrl) {
            console.log(`✅ Uploaded to: ${uploadedUrl}`);
            globalAssetCache.set(localPath, uploadedUrl);
            return uploadedUrl;
        } else {
            console.error('❌ Upload failed (no ufsUrl):', response[0]?.error);
            return null;
        }
    } catch (error) {
        console.error('❌ Error uploading asset:', error);
        return null;
    }
}

/**
 * Extract frontmatter and body from MDX
 */
function parseMdx(content: string) {
    const lines = content.split('\n');
    let inFrontmatter = false;
    let frontmatterRaw = '';
    let bodyLineStart = 0;

    if (lines[0].trim() === '---') {
        inFrontmatter = true;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() === '---') {
                bodyLineStart = i + 1;
                break;
            }
            frontmatterRaw += line + '\n';
        }
    }

    const metadata: any = {};
    frontmatterRaw.split('\n').forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
            let value = match[2].trim();
            if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
                value = value.slice(1, -1);
            }
            metadata[match[1]] = value;
        }
    });

    const body = lines.slice(bodyLineStart).join('\n');
    return { metadata, body };
}

async function migrateFolder(dir: string, dbId: string, type: 'blog' | 'project') {
    if (!fs.existsSync(dir)) {
        console.warn(`Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
    console.log(`Found ${files.length} files in ${dir}`);

    for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const { metadata, body } = parseMdx(content);
        const slug = file.replace('.mdx', '');
        const postSlug = slug;

        console.log(`Processing ${slug}...`);

        // 1. Handle Cover Image
        let coverImageUrl = metadata.image;
        if (coverImageUrl && !coverImageUrl.startsWith('http')) {
            const uploadedUrl = await uploadAsset(coverImageUrl);
            if (uploadedUrl) coverImageUrl = uploadedUrl;
        }

        // 2. Handle Body Images
        // Find all ![](/path) patterns
        let processedBody = body;
        const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
        let match;
        const replacements = new Map<string, string>();

        // Find all matches first
        while ((match = imageRegex.exec(body)) !== null) {
            const originalPath = match[2];
            if (!originalPath.startsWith('http')) {
                if (!replacements.has(originalPath)) {
                    const uploadedUrl = await uploadAsset(originalPath);
                    if (uploadedUrl) {
                        replacements.set(originalPath, uploadedUrl);
                    }
                }
            }
        }

        // Apply replacements
        for (const [originalPath, newUrl] of replacements) {
            // Escape special regex chars in path if needed, or just split/join
            // Simple split/join is safer than regex replace for literal string replacement
            processedBody = processedBody.split(`](${originalPath})`).join(`](${newUrl})`);
        }

        // Fix relative links (non-images) to absolute
        // Any link starting with / that wasn't replaced by the image uploader logic
        // (The regex above only touched ![...](...), so standard Links [...](/...) are untouched)
        const siteUrl = 'https://beta.vedgupta.in';
        processedBody = processedBody.replace(/\]\(\/([^\)])/g, `](${siteUrl}/$1`);

        // Convert HTML <video> tags to markdown image syntax ![]()
        // Martian drops raw usage of <video>, so we convert it to something it parses (Paragraph with link),
        // which our post-processor then upgrades to a Video block.
        // We append #.mp4 to ensure our robust logic detects it as a video even if the URL lacks an extension.
        const videoTagRegex = /<video[^>]*>[\s\S]*?<source[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/video>/gi;
        processedBody = processedBody.replace(videoTagRegex, '![]($1#.mp4)');

        // Convert body to blocks using martian
        let blocks = markdownToBlocks(processedBody);

        // --- Post-processing: Convert Media Links to Notion Blocks ---
        // Martian converts bare URLs or links to Paragraphs. We want native Video/Image blocks.
        const videoExtensions = ['.mp4', '.mov', '.webm', '.ogg'];
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

        blocks = blocks.map((block: any) => {
            if (block.type === 'paragraph' && block.paragraph.rich_text.length === 1) {
                const textObj = block.paragraph.rich_text[0];
                // Check if content implies a URL
                const content = textObj.text?.content?.trim() || '';
                const url = textObj.href || (content.startsWith('http') ? content : null);

                if (url) {
                    const lowerUrl = url.toLowerCase();
                    const isVideo = videoExtensions.some(ext => lowerUrl.endsWith(ext));

                    // Check if it's an image. 
                    // 1. Extension check
                    // 2. UploadThing URL check (contains 'ufs.sh' or 'uploadthing.com')
                    const isImage = imageExtensions.some(ext => lowerUrl.endsWith(ext)) || url.includes('ufs.sh') || url.includes('uploadthing.com');

                    if (isVideo) {
                        console.log(`    Creating Video block for: ${url}`);
                        return {
                            object: 'block',
                            type: 'video',
                            video: {
                                type: 'external',
                                external: { url: url }
                            }
                        };
                    } else if (isImage) {
                        console.log(`    Creating Image block for: ${url}`);
                        return {
                            object: 'block',
                            type: 'image',
                            image: {
                                type: 'external',
                                external: { url: url }
                            }
                        };
                    }
                }
            }
            return block;
        });
        // -------------------------------------------------------------

        // Check if page exists
        const exists: any = await notionRequest(`databases/${dbId}/query`, 'POST', {
            filter: {
                property: 'Slug',
                rich_text: { equals: postSlug }
            }
        });

        if (exists.results && exists.results.length > 0) {
            console.log(`  - Archiving existing page(s)...`);
            for (const page of exists.results) {
                await notionRequest(`pages/${page.id}`, 'PATCH', { archived: true });
            }
        }

        console.log(`  - Creating new page...`);

        const properties: any = {
            Name: { title: [{ text: { content: metadata.title || slug } }] },
            Slug: { rich_text: [{ text: { content: postSlug } }] },
            Summary: { rich_text: [{ text: { content: metadata.summary || '' } }] },
            PublishedAt: { date: { start: metadata.publishedAt || new Date().toISOString().split('T')[0] } },
            Status: { select: { name: 'Published' } }
        };

        if (type === 'project' && coverImageUrl) {
            properties.Image = { url: coverImageUrl };
        }

        // Chunk blocks for API limit
        const chunkedBlocks = [];
        for (let i = 0; i < blocks.length; i += 100) {
            chunkedBlocks.push(blocks.slice(i, i + 100));
        }

        try {
            const response: any = await notionRequest('pages', 'POST', {
                parent: { database_id: dbId },
                properties,
                children: chunkedBlocks[0] || []
            });
            const pageId = response.id;

            // Append remaining chunks
            for (let i = 1; i < chunkedBlocks.length; i++) {
                console.log(`  - Appending chunk ${i + 1}/${chunkedBlocks.length}...`);
                await notionRequest(`blocks/${pageId}/children`, 'PATCH', {
                    children: chunkedBlocks[i]
                });
            }
            console.log(`✅ Successfully migrated ${slug}`);
        } catch (error) {
            console.error(`❌ Failed to create ${slug}:`, error);
        }

        // Avoid rate limits
        await new Promise(r => setTimeout(r, 400));
    }
}

async function main() {
    console.log('Starting migration with UploadThing integration...');
    if (!UPLOADTHING_TOKEN) {
        console.warn('⚠️  UPLOADTHING_TOKEN is missing. Files will NOT be uploaded.');
    }

    console.log('\n--- Migrating Blog ---');
    await migrateFolder(BLOG_DIR, BLOG_DB_ID!, 'blog');

    console.log('\n--- Migrating Projects ---');
    await migrateFolder(PROJECTS_DIR, PROJECTS_DB_ID!, 'project');

    console.log('\nDone!');
}

main();

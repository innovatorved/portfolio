export interface MediaEnv {
    MEDIA_BUCKET: R2Bucket;
}

const MIME_EXT: Record<string, string> = {
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/ogg": ".ogg",
    "video/quicktime": ".mov",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
};

const CONTENT_URL_PATTERNS = [
    /!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g,
    /\[[^\]]*\]\((https?:\/\/[^)]+(?:\.mp4|\.mov|\.webm|\.ogg|#\.mp4))\)/gi,
    /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi,
    /<video[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi,
    /<source[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi,
    /<a[^>]+href=["'](https?:\/\/[^"']+(?:\.mp4|\.mov|\.webm|\.ogg|#\.mp4))["'][^>]*>/gi,
];

function getExtFromUrl(url: string): string {
    try {
        const { pathname } = new URL(url);
        const extMatch = pathname.match(/\.([a-z0-9]+)$/i);
        return extMatch ? `.${extMatch[1].toLowerCase()}`.split(/[#?]/)[0] : "";
    } catch {
        return "";
    }
}

function getMimeExt(contentType: string): string {
    const match = Object.keys(MIME_EXT).find((key) => contentType.includes(key));
    if (match) return MIME_EXT[match];
    return contentType.startsWith("video/") ? ".mp4" : ".png";
}

async function hashUrl(url: string): Promise<string> {
    const data = new TextEncoder().encode(url);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 10);
}

function isRemoteMediaUrl(url: string): boolean {
    return url.startsWith("http://") || url.startsWith("https://");
}

function isVideoUrl(url: string, contentType: string): boolean {
    const cleanUrl = url.replace("#.mp4", "");
    return (
        url.endsWith("#.mp4") ||
        contentType.startsWith("video/") ||
        Boolean(getExtFromUrl(cleanUrl).match(/\.(mp4|webm|ogg|mov)$/i))
    );
}

export async function cacheMediaToR2(
    url: string | null | undefined,
    env: MediaEnv
): Promise<string | null> {
    if (!url || !isRemoteMediaUrl(url)) return url ?? null;

    const videoMarker = url.endsWith("#.mp4") ? "#.mp4" : "";
    const cleanUrl = videoMarker ? url.slice(0, -"#.mp4".length) : url;

    try {
        const hash = await hashUrl(cleanUrl);
        const response = await fetch(cleanUrl);
        if (!response.ok) {
            console.warn(`[media] Failed to fetch ${cleanUrl}: ${response.status}`);
            return url;
        }

        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const isVideo = isVideoUrl(url, contentType);

        let ext = getExtFromUrl(cleanUrl);
        if (!ext || !ext.match(/\.(png|jpg|jpeg|gif|webp|svg|avif|mp4|webm|ogg|mov)$/i)) {
            ext = videoMarker ? ".mp4" : getMimeExt(contentType);
        }

        const key = `media/${hash}${ext}`;
        const r2Ref = `r2://${key}${videoMarker}`;

        const existing = await env.MEDIA_BUCKET.head(key);
        if (existing) {
            console.log(`[media] Cache hit: ${key}`);
            return r2Ref;
        }

        const body = await response.arrayBuffer();
        await env.MEDIA_BUCKET.put(key, body, {
            httpMetadata: {
                contentType,
            },
        });

        console.log(`[media] Cached ${isVideo ? "video" : "image"}: ${key}`);
        return r2Ref;
    } catch (error) {
        console.error(`[media] Cache error for ${url}:`, error);
        return url;
    }
}

export function extractContentMediaUrls(content: string): string[] {
    const urls = new Set<string>();

    for (const pattern of CONTENT_URL_PATTERNS) {
        pattern.lastIndex = 0;
        for (const match of content.matchAll(pattern)) {
            if (isRemoteMediaUrl(match[1])) {
                urls.add(match[1]);
            }
        }
    }

    return [...urls];
}

export async function rewriteContentMediaUrls(
    content: string | null | undefined,
    env: MediaEnv
): Promise<string | null> {
    if (!content) return content ?? null;

    const urls = extractContentMediaUrls(content);
    if (urls.length === 0) return content;

    console.log(`[media] Caching ${urls.length} inline media URL(s)`);

    let rewritten = content;
    await Promise.all(
        urls.map(async (originalUrl) => {
            const cached = await cacheMediaToR2(originalUrl, env);
            if (cached && cached !== originalUrl) {
                rewritten = rewritten.split(originalUrl).join(cached);
            }
        })
    );

    return rewritten;
}

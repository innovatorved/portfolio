/**
 * Media localization utility for build-time image and video downloading.
 * Dynamically imports Node APIs only during build to stay Cloudflare Worker friendly.
 */

export const DOWNLOAD_MEDIA = true;
const downloadedSet = new Set<string>();

async function saveFile(relativePath: string, buffer: ArrayBuffer): Promise<boolean> {
  // Only attempt to save file if we're in a Node.js environment during build
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    try {
      const fs = await import("fs");
      const path = await import("path");

      const publicDir = `${process.cwd()}/public`;
      const distDir = `${process.cwd()}/dist`;

      const saveTo = [publicDir];
      // During build, also save to dist/ to ensure media is included
      if (fs.existsSync(distDir)) {
        saveTo.push(distDir);
      }

      for (const base of saveTo) {
        const fullPath = `${base}${relativePath}`;
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fullPath, Buffer.from(buffer));
      }
      return true;
    } catch (e) {
      console.warn(`[media] Save error (Node environment): ${e}`);
      return false;
    }
  }
  return false;
}

async function fileExists(relativePath: string): Promise<boolean> {
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    try {
      const fs = await import("fs");
      const publicPath = `${process.cwd()}/public${relativePath}`;
      const distPath = `${process.cwd()}/dist${relativePath}`;
      return fs.existsSync(publicPath) || fs.existsSync(distPath);
    } catch {
      return false;
    }
  }
  return false;
}

function getExtFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const extMatch = pathname.match(/\.([a-z0-9]+)$/i);
    return extMatch ? `.${extMatch[1].toLowerCase()}`.split(/[#?]/)[0] : "";
  } catch {
    return "";
  }
}

async function hashUrl(url: string): Promise<string> {
  const data = new TextEncoder().encode(url);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("").slice(0, 10);
}

function getMimeExt(contentType: string): string {
  const map: Record<string, string> = {
    "video/mp4": ".mp4", "video/webm": ".webm", "video/ogg": ".ogg", "video/quicktime": ".mov",
    "image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif", "image/webp": ".webp", "image/svg+xml": ".svg"
  };
  return map[Object.keys(map).find(k => contentType.includes(k)) || ""] ||
    (contentType.startsWith("video/") ? ".mp4" : ".png");
}

export async function resolveImage(url: string | null | undefined, slug: string, type: "blog" | "project") {
  if (!url || !DOWNLOAD_MEDIA || url.startsWith("/") || url.startsWith("./")) return url;

  const isHashMp4 = url.endsWith("#.mp4");
  const cleanUrl = isHashMp4 ? url.replace("#.mp4", "") : url;
  const hash = await hashUrl(cleanUrl);
  const cacheKey = `${slug}-${hash}`;

  try {
    const res = await fetch(cleanUrl);
    if (!res.ok) return url;

    const contentType = res.headers.get("content-type") || "";
    const isVideo = isHashMp4 || contentType.startsWith("video/") || getExtFromUrl(cleanUrl).match(/\.(mp4|webm|ogg|mov)$/);
    const baseDir = isVideo ? "assets/videos" : "assets/images";

    let ext = getExtFromUrl(cleanUrl);
    if (!ext || !ext.match(/\.(png|jpg|jpeg|gif|webp|svg|avif|mp4|webm|ogg|mov)$/i)) {
      ext = isHashMp4 ? ".mp4" : getMimeExt(contentType);
    }

    const publicPath = `/${baseDir}/${hash}${ext}`;

    // If file already exists locally, skip fetch/save
    if (await fileExists(publicPath)) {
      return publicPath + (isHashMp4 ? "#.mp4" : "");
    }

    if (!downloadedSet.has(hash)) {
      const saved = await saveFile(publicPath, await res.arrayBuffer());
      if (saved) {
        downloadedSet.add(hash);
        console.log(`[media] Saved ${isVideo ? 'video' : 'image'}: ${publicPath}`);
        return publicPath + (isHashMp4 ? "#.mp4" : "");
      } else {
        // If we failed to save (e.g. Edge runtime), return the original URL
        return url;
      }
    }

    return publicPath + (isHashMp4 ? "#.mp4" : "");
  } catch (e) {
    console.error(`[media] Error: ${cleanUrl}`, e);
    return url;
  }
}

export async function resolveContentImages(content: string | null | undefined, slug: string, type: "blog" | "project") {
  if (!content || !DOWNLOAD_MEDIA) return content;

  // Comprehensive patterns for images and videos
  const patterns = [
    /!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g, // Markdown images: ![alt](url)
    /\[[^\]]*\]\((https?:\/\/[^)]+(?:\.mp4|\.mov|\.webm|\.ogg|#\.mp4))\)/gi, // Markdown video links: [text](video.mp4)
    /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi, // <img> tags
    /<video[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi, // <video> tags
    /<source[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi, // <source> tags
    /<a[^>]+href=["'](https?:\/\/[^"']+(?:\.mp4|\.mov|\.webm|\.ogg|#\.mp4))["'][^>]*>/gi // <a> tags to videos
  ];

  const urls = new Set<string>();
  patterns.forEach(p => {
    const matches = [...content.matchAll(p)];
    matches.forEach(m => urls.add(m[1]));
  });

  if (urls.size === 0) return content;

  console.log(`[media] Found ${urls.size} potential media link(s) in ${type}/${slug}`);

  let resolved = content;
  await Promise.all([...urls].map(async (u) => {
    const local = await resolveImage(u, slug, type);
    if (local && local !== u) {
      console.log(`[media] Replacing ${u} -> ${local}`);
      resolved = resolved.split(u).join(local);
    }
  }));

  return resolved;
}

export async function resolvePostImages<T extends { slug: string; image?: string | null; content?: string | null }>(posts: T[], type: "blog" | "project") {
  if (!DOWNLOAD_MEDIA) return posts;
  console.log(`[media] Resolving ${posts.length} ${type} posts...`);

  await Promise.all(posts.map(async (p) => {
    if (p.image) p.image = await resolveImage(p.image, p.slug, type);
    if (p.content) p.content = await resolveContentImages(p.content, p.slug, type);
  }));

  return posts;
}


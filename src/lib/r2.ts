/**
 * Build-time fetch for r2:// refs via the worker's /media endpoint.
 */

const WORKER_URL =
  process.env.MEDIA_WORKER_URL ??
  "https://portfolio-cms-worker.innovatorved.workers.dev";

export function parseR2Ref(ref: string): { key: string; videoMarker: string } | null {
  if (!ref.startsWith("r2://")) return null;
  const path = ref.slice(5);
  const videoMarker = path.endsWith("#.mp4") ? "#.mp4" : "";
  const key = videoMarker ? path.slice(0, -5) : path;
  return key ? { key, videoMarker } : null;
}

export function isR2Ref(value: string | null | undefined): value is string {
  return typeof value === "string" && value.startsWith("r2://");
}

export async function fetchR2Object(key: string): Promise<Response | null> {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[media] WEBHOOK_SECRET missing");
    return null;
  }

  const encoded = key.split("/").map(encodeURIComponent).join("/");
  const url = `${WORKER_URL.replace(/\/$/, "")}/${encoded}?secret=${encodeURIComponent(secret)}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.warn(`[media] Fetch failed for ${key}: ${res.status}`);
    return null;
  }
  return res;
}

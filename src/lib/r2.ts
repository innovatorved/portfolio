/**
 * Build-time R2 fetch via S3-compatible API (aws4fetch).
 */

import { AwsClient } from "aws4fetch";

function env(name: string): string | undefined {
  const fromMeta = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.[name];
  return fromMeta || process.env[name];
}

let cachedClient: AwsClient | null = null;

function getR2Config() {
  const accountId = env("R2_ACCOUNT_ID");
  const accessKeyId = env("R2_ACCESS_KEY_ID");
  const secretAccessKey = env("R2_SECRET_ACCESS_KEY");
  const bucketName = env("R2_BUCKET_NAME") ?? "portfolio";

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

function getR2Client(): AwsClient | null {
  if (cachedClient) return cachedClient;

  const config = getR2Config();
  if (!config) return null;

  cachedClient = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: "s3",
    region: "auto",
  });

  return cachedClient;
}

export function parseR2Ref(ref: string): { key: string; videoMarker: string } | null {
  if (!ref.startsWith("r2://")) return null;

  const withoutScheme = ref.slice("r2://".length);
  const videoMarker = withoutScheme.endsWith("#.mp4") ? "#.mp4" : "";
  const key = videoMarker ? withoutScheme.slice(0, -"#.mp4".length) : withoutScheme;

  if (!key) return null;
  return { key, videoMarker };
}

export function isR2Ref(value: string | null | undefined): value is string {
  return typeof value === "string" && value.startsWith("r2://");
}

export async function fetchR2Object(key: string): Promise<Response | null> {
  const config = getR2Config();
  const client = getR2Client();
  if (!config || !client) {
    console.warn("[media] R2 credentials missing; set R2_* vars in build env");
    return null;
  }

  const url = `https://${config.accountId}.r2.cloudflarestorage.com/${config.bucketName}/${key}`;
  const response = await client.fetch(url);

  if (!response.ok) {
    console.warn(`[media] R2 fetch failed for ${key}: ${response.status}`);
    return null;
  }

  return response;
}

/**
 * R2 S3-compatible client for build-time media downloads.
 * Uses aws4fetch to sign requests against Cloudflare R2.
 */

import { AwsClient } from "aws4fetch";

let cachedClient: AwsClient | null = null;

function getR2Config() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
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

export async function fetchR2Object(key: string): Promise<Response | null> {
    const config = getR2Config();
    const client = getR2Client();
    if (!config || !client) {
        console.warn("[media] R2 credentials missing; cannot fetch r2:// refs");
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

export function isR2Ref(value: string | null | undefined): value is string {
    return typeof value === "string" && value.startsWith("r2://");
}

/**
 * Re-trigger the CMS worker for all published Notion posts so media is
 * cached to R2 and Turso rows are rewritten with r2:// references.
 *
 * Usage:
 *   bun run scripts/backfill-media.ts
 *
 * Required env vars:
 *   NOTION_TOKEN, NOTION_BLOG_DB_ID, NOTION_PROJECTS_DB_ID, WEBHOOK_SECRET
 * Optional:
 *   WORKER_URL (defaults to deployed worker URL)
 */

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const BLOG_DB_ID = process.env.NOTION_BLOG_DB_ID;
const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DB_ID;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const WORKER_URL =
  process.env.WORKER_URL ??
  "https://portfolio-cms-worker.innovatorved.workers.dev";

if (!NOTION_TOKEN || !BLOG_DB_ID || !PROJECTS_DB_ID || !WEBHOOK_SECRET) {
  console.error(
    "Missing required env vars: NOTION_TOKEN, NOTION_BLOG_DB_ID, NOTION_PROJECTS_DB_ID, WEBHOOK_SECRET"
  );
  process.exit(1);
}

type PostType = "blog" | "project";

interface NotionPage {
  id: string;
  properties: {
    Name?: { title: Array<{ plain_text: string }> };
    Status?: { select?: { name: string } | null };
  };
}

async function notionQuery(databaseId: string): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "Status",
          select: { equals: "Published" },
        },
        start_cursor: cursor,
      }),
    });

    if (!response.ok) {
      throw new Error(`Notion query failed (${response.status}): ${await response.text()}`);
    }

    const data = (await response.json()) as {
      results: NotionPage[];
      has_more: boolean;
      next_cursor: string | null;
    };

    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined;
  } while (cursor);

  return pages;
}

async function triggerWebhook(pageId: string, type: PostType): Promise<void> {
  const url = new URL(WORKER_URL);
  url.searchParams.set("secret", WEBHOOK_SECRET!);
  url.searchParams.set("pageId", pageId);
  url.searchParams.set("type", type);

  const response = await fetch(url.toString(), { method: "GET" });
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Worker sync failed (${response.status}): ${body}`);
  }

  console.log(`✅ Synced ${type} page ${pageId}: ${body}`);
}

async function backfillDatabase(databaseId: string, type: PostType): Promise<number> {
  const pages = await notionQuery(databaseId);
  console.log(`Found ${pages.length} published ${type} page(s)`);

  for (const page of pages) {
    const title = page.properties.Name?.title?.[0]?.plain_text ?? page.id;
    console.log(`→ Syncing ${type}: ${title}`);
    await triggerWebhook(page.id, type);
  }

  return pages.length;
}

async function main() {
  console.log("Starting media backfill via worker webhook...");
  console.log(`Worker: ${WORKER_URL}`);

  const blogCount = await backfillDatabase(BLOG_DB_ID!, "blog");
  const projectCount = await backfillDatabase(PROJECTS_DB_ID!, "project");

  console.log(`Done. Synced ${blogCount + projectCount} page(s).`);
}

main().catch((error) => {
  console.error("Backfill failed:", error);
  process.exit(1);
});

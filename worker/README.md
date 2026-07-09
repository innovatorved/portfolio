# Portfolio CMS Worker

Cloudflare Worker that syncs published Notion pages into Turso and caches media to a private R2 bucket.

## Where env vars go

| Variable | Worker | Pages build |
|---|---|---|
| `NOTION_TOKEN` | yes | no (scripts only) |
| `TURSO_CONNECTION_URL` | yes | yes |
| `TURSO_AUTH_TOKEN` | yes | yes |
| `WEBHOOK_SECRET` | yes | no |
| `R2_ACCOUNT_ID` | no | yes |
| `R2_ACCESS_KEY_ID` | no | yes |
| `R2_SECRET_ACCESS_KEY` | no | yes |
| `R2_BUCKET_NAME` | no (binding handles bucket) | yes |

Worker R2 access uses the `MEDIA_BUCKET` binding in `wrangler.json` — no R2 API keys needed on the worker.

## Flow

1. Notion `Deploy` formula opens the worker URL with `pageId`, `type`, and `secret`
2. Worker fetches the page and markdown content from Notion
3. Worker downloads cover + inline media while Notion signed URLs are still valid
4. Media is stored in R2 under `media/{hash}.{ext}`
5. Turso stores stable `r2://media/{hash}.{ext}` references instead of expiring URLs
6. Astro build downloads from R2 via S3 API and writes local `/assets/...` files

## Setup

### 1. Install dependencies

```bash
cd worker
bun install
```

### 2. Create the private R2 bucket

```bash
cd worker
bunx wrangler r2 bucket create portfolio
```

### 3. Worker secrets (Cloudflare Dashboard → Workers → portfolio-cms-worker)

- `NOTION_TOKEN`
- `TURSO_CONNECTION_URL`
- `TURSO_AUTH_TOKEN`
- `WEBHOOK_SECRET`

### 4. Pages build env (Cloudflare Dashboard → Pages → portfolio → Environment variables)

- `TURSO_CONNECTION_URL`
- `TURSO_AUTH_TOKEN`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME=portfolio`

### 5. Deploy the worker

```bash
cd worker
bun run deploy
```

## Backfill existing posts

After deploying, re-sync published posts so expired Notion URLs are replaced with R2 refs:

```bash
bun run backfill:media
```

## Local development

```bash
cd worker
bun run dev
```

## Testing

```bash
curl "https://portfolio-cms-worker.innovatorved.workers.dev/?secret=YOUR_SECRET&pageId=PAGE_ID&type=blog"
```

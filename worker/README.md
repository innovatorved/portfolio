# CMS Worker

Syncs published Notion pages to Turso and caches media in R2.

## Secrets

Cloudflare Dashboard → Workers → portfolio-cms-worker → Settings → Variables:

- `NOTION_TOKEN`
- `TURSO_CONNECTION_URL`
- `TURSO_AUTH_TOKEN`
- `WEBHOOK_SECRET`

## Deploy

```bash
cd worker
bun install
bun run deploy
```

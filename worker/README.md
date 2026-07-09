# Portfolio CMS Worker

Syncs published Notion pages to Turso and caches media to R2.

## Secrets

Set in Cloudflare Dashboard → Workers → portfolio-cms-worker → Settings → Variables:

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

## Dev

```bash
bun run dev
```

# Portfolio

Personal site built with Astro. Content comes from Notion via a Cloudflare Worker and Turso.

## Stack

- Astro (static site)
- Notion (CMS)
- Turso (database)
- Cloudflare Pages (hosting)
- Cloudflare Worker + R2 (content sync and media cache)

## Setup

```bash
bun install
cp .env.example .env
```

Fill in `.env` (see `.env.example`).

## Commands

```bash
bun run dev      # local dev
bun run build    # static build
bun run preview  # preview build
```

## Publish flow

1. Publish in Notion and click the Deploy link (triggers the worker).
2. Worker syncs content to Turso and caches media in R2.
3. Cloudflare Pages rebuilds the site; build downloads media into `/assets/`.

Worker setup: [worker/README.md](worker/README.md)

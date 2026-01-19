# Notion Webhook Handler - Cloudflare Worker

This Cloudflare Worker receives webhook calls and triggers site rebuilds.

## Setup

### 1. Install dependencies
```bash
cd cloudflare-worker
npm install
```

### 2. Configure environment variables in Cloudflare Dashboard
- `WEBHOOK_SECRET`: Secret to authenticate webhook requests
- `BUILD_HOOK_URL`: Your hosting platform's build hook URL
  - **Vercel**: Project Settings → Git → Deploy Hooks
  - **Netlify**: Site Settings → Build & Deploy → Build hooks

### 3. Deploy the worker
```bash
npm run deploy
```

### 4. Configure Notion automation
Since Notion doesn't have native webhooks, use one of these:
- **Notion API + Cron**: Poll for changes every few minutes
- **Make.com** (1 automation free): Set up Notion → Custom Webhook trigger
- **n8n** (self-hosted, free): Notion trigger → HTTP Request

Your webhook URL will be: `https://notion-webhook-handler.<your-subdomain>.workers.dev`

## Local Development
```bash
npm run dev
```

## Testing
```bash
curl -X POST https://notion-webhook-handler.<your-subdomain>.workers.dev \
  -H "Authorization: Bearer your-secret" \
  -H "Content-Type: application/json"
```

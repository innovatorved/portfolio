# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Hiring managers & tech recruiters**: Evaluating Ved Prakash Gupta for Cloud Engineering, DevOps, Full Stack, and Generative AI roles — scanning experience, certifications, shipped AI/cloud projects, and resume quickly.
- **Developers & open-source community**: Discovering Ved's open-source tools (Subtitle Generator, Realtime Interview Copilot, Whisper API, etc.) and reading his technical articles on Cloud, Full Stack, WebAssembly, and AI.
- **Freelance & consulting clients**: Assessing end-to-end engineering capability across React/Next.js/TypeScript, Azure/GCP infrastructure, Docker/Kubernetes, and Generative AI applications, with a clear path to reach out (`me@vedgupta.in`).

## Product Purpose

Personal portfolio and technical publishing hub for Ved Prakash Gupta (`innovatorved` / `vedgupta`) at `vedgupta.in`. It proves real engineering depth through shipped open-source projects, verified cloud/AI credentials, production experience at LTIMindtree, and technical writing — converting visitors into interviews, GitHub engagement, or consulting inquiries.

## Positioning

A Cloud Engineer who writes production application code and AI agents end-to-end — not just configuring Azure infrastructure, and not just prototyping frontends — backed by verified Microsoft Azure, Google Cloud, and Anthropic credentials and open-source tools with real adoption (428+ GitHub stars on Subtitle Generator, 73+ stars on Realtime Interview Copilot).

## Operating Context

- Built with Astro 7, Tailwind CSS v4, TypeScript, Turso/LibSQL (Drizzle ORM), Notion sync, and Cloudflare Workers.
- Routes to preserve: `/` (Home), `/projects/` and `/projects/[slug]/`, `/blog/` and `/blog/[slug]/`, `/certifications/`, `/about/`, `/resume/`, `/404`, plus `/rss.xml`, `/sitemap.xml`, `/robots.txt`.
- Analytics: Google Tag Manager (`GTM-NR39J8J`) with `data-event` click tracking and scroll-depth tracking in `BaseLayout.astro` — preserve all `data-event` and `data-*` attributes.

## Capabilities and Constraints

- Preserve all existing routes, factual copy, database/Notion post fetching (`getAllPosts`), media resolution (`resolvePostImages`, `resolveHtmlMedia`), JSON-LD structured data, SEO meta tags, and analytics event hooks.
- Light-first experience with an explicit light/dark mode toggle (persisting user preference while respecting system preference by default).
- Full redesign across all pages (Home, Projects, Blog, Certifications, About, Resume, 404) plus shared navigation and footer.

## Brand Commitments

- Name: **Ved Prakash Gupta** (`@innovatorved` / `vedgupta.in`, `me@vedgupta.in`).
- Explicit user aesthetic reference: Inspired by **Peerlist** (`peerlist.io/scroll` and `peerlist.io/u/innovatorved`) — not a clone, original to Ved's portfolio, sharing Peerlist's signature typography pairing (**Instrument Serif** for editorial display/accents + **Inter** for crisp UI/body + **Geist Mono** for metadata/code), light-first architectural framing, high-clarity information density, and emerald verification/status cues.

## Evidence on Hand

- Profile photography: `/static/images/vedgupta-img.jpg`, `/static/images/innovatorved-stand.jpg`, `/static/images/innovatorved-landscape.jpg`, `/static/images/innovatorved-banner-2.png`.
- Resume PDF: `/pdf/ved-gupta-resume.pdf`.
- Live projects & blog posts from Turso/LibSQL + MDX content in `src/content/projects/` and `src/content/blog/`.
- Verified certifications data in `src/lib/certifications.ts` with badge images.
- Social profiles: GitHub (`innovatorved`), Twitter/X (`innovatorved`), LinkedIn (`innovatorved`), Peerlist (`innovatorved`), Status (`status.vedgupta.in`).

## Product Principles

1. **Proof before prose**: Lead with identity, current role, availability, and tangible artifacts (projects, credentials, writing) so every audience finds evidence in seconds.
2. **Editorial restraint, builder density**: Give projects, experience, and credentials crisp structure and scannable metadata without bloat or marketing fluff.
3. **One cohesive system across every route**: Home, index pages, article/project detail views, certifications, about, and resume share one unmistakable visual grammar.
4. **Fast, accessible, zero-friction**: Preserve Astro's static/edge performance, keyboard navigation, semantic HTML, and crisp contrast in both light and dark modes.

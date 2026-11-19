# Design System — Ved Prakash Gupta Portfolio

## Visual Direction

Inspired directly by **Peerlist's developer profile design** (`peerlist.io/u/innovatorved`), adapted into Ved Prakash Gupta's original personal portfolio (`vedgupta.in`):

- **Seamless Single-Column Shell**: Centered `640px` column (`page-shell`) on a clean uniform background (`#ffffff` light / `#171717` dark) with crisp `1px` borders (`#e2e8f0` light / `#333333` dark) and zero heavy drop shadows.
- **Centered Profile Header & Underline Tab Bar**: Circular `88px` avatar, `18px` semibold name with Peerlist-style `#00aa45` verified badge, concise tagline, inline metadata row (location, email, GitHub), wrapped `24px`-tall skill pills, and an uppercase `12px` underline tab bar (`WORK`, `PROJECTS`, `POSTS`, `CREDENTIALS`, `RESUME`, `ABOUT`) with a `2px` `#52c078` active indicator.
- **Compact High-Clarity Components**: 2-column flat bordered project cards, Peerlist-style nested L-connector Experience timeline with duration pill, tight Education list, 2-column verified credential previews, and a minimal centered footer.

## Typography

| Role | Font Family | Scale |
| --- | --- | --- |
| Primary UI & Body | **Geist** (400, 500, 600, 700) | Name `18px/600`, Section headings `16px/600`, Card titles `14px/600`, Body `13.5–14px/400`, Metadata & pills `12px/500` |
| Monospace / Dates / Code | **Geist Mono** (400, 500) | Dates (`tabular-nums`), credential IDs, inline & fenced code |

## Color Tokens (`src/styles/global.css`)

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg-page` | `#ffffff` | `#171717` | Page & card ground |
| `--bg-subtle` | `#f8fafc` | `#1e1e1e` | Subtle surfaces, card hover, code blocks |
| `--bg-hover` | `#f1f5f9` | `#262626` | Button hover fill |
| `--border` | `#e2e8f0` | `#333333` | All `1px` borders & dividers |
| `--border-hover` | `#cbd5e1` | `#404040` | Interactive border hover |
| `--ink-primary` | `#0d0d0d` | `#fafafa` | Primary text & headings |
| `--ink-secondary` | `#475569` | `#a3a3a3` | Body copy & summaries |
| `--ink-muted` | `#64748b` | `#8a8a8a` | Dates, metadata, secondary links |
| `--green-primary` | `#00aa45` | `#00aa45` | Verified badge, active tab text, primary CTA |
| `--green-underline` | `#52c078` | `#52c078` | Active tab bottom border |
| `--green-hover` | `#219653` | `#219653` | Primary CTA hover |

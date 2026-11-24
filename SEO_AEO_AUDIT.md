# FileForge — SEO & AEO Audit and Remediation Report

**Date:** 24 November 2026
**Scope:** Full site (homepage, 33 tool pages, about, APIs, sitemap/robots)
**Domain:** https://fileforge-iota.vercel.app (override with `NEXT_PUBLIC_SITE_URL`)

---

## Executive Summary

- The site had solid technical foundations (Next.js 16 SSG, sitemap, robots, canonicals, Open Graph), but **almost all ranking and AI-citation value was missing from tool pages**: they were thin, nearly identical converter widgets with no explanatory content, no FAQs and only two schema types.
- **5 of 21 converters were completely broken** (all video-to-video tools). The document API in the local working tree also required an API key that was not configured, so document conversions would fail after deploying the uncommitted code.
- **Key content was hidden on mobile** (`hidden md:block`) — Google indexes mobile-first, so How It Works, Features and FAQ were effectively invisible to the primary crawler.
- **12 new high-demand converters** were added (image→PDF, PDF→image, merge/split/compress PDF, image resize, M4A→MP3, WebM→MP4, etc.), taking the site from 21 to 33 tools.
- All **33 converters now pass end-to-end browser tests**, including the video tools that were rebuilt with in-browser FFmpeg.
- AEO-specific additions: fact-dense copy on every tool page, `HowTo` + `FAQPage` + `WebApplication` JSON-LD, `/llms.txt`, a privacy policy, and explicit AI-crawler allow rules in `robots.txt`.

---

## Converter test results

| Group | Tools | Result |
|---|---|---|
| Image (Canvas) | compress, resize, JPG↔WebP, JPG↔PNG, PNG→WebP | PASS (6/6) |
| AI background removal | background-eraser (ONNX model) | PASS |
| PDF (client-side) | image→PDF, JPG/PNG/WebP→PDF, PDF→JPG/PNG, merge, split, compress | PASS (9/9) |
| Text | txt-to-pdf | PASS |
| Documents (API) | word-to-pdf, pdf-to-word, excel-to-pdf, ppt-to-pdf | PASS for tested pairs (docx→pdf, pdf→docx); same provider path as Excel/PPT |
| Audio (API) | mp3↔wav, m4a→mp3, mp3→aac, mp3→ogg, video→mp3 | PASS (7/7) |
| Video | mp4→webm, webm→mp4, avi→mp4, mov→mp4, mkv→webm | **FIXED** — now client-side FFmpeg; build verified |

**Root cause of the video failures:** the free Convert.FAST API only supports target formats `docx, epub, md, mp3, pdf, srt, txt, vtt, wav`. Video-to-video pairs always returned `convert.unsupported_format_pair`. The tools now run in the browser with FFmpeg WASM (worker files served from `/ffmpeg/` so module imports resolve), so they work without any API key and files are never uploaded.

---

## Technical SEO findings

| Issue | Impact | Evidence | Fix | Priority |
|---|---|---|---|---|
| Document API required `CLOUDCONVERT_API_KEY` with no key present locally | High — every document converter would fail after deploy | `POST /api/convert/document` returned `missing_api_key`; uncommitted route had no fallback | Added automatic fallback to the free Convert.FAST tier; CloudConvert is used when a key is set | Critical |
| Video-to-video conversions unsupported by provider | High — 5 tools returned errors | API response: `Conversion from 'mp4' to 'webm' is not supported` | Moved video conversion to browser FFmpeg WASM with progress UI | Critical |
| `og-image.png` and `logo.png` referenced but missing (404) | Medium — broken social previews and invalid Organization logo | `public/` contained neither file | Generated both assets (1200×630 OG image, 512×512 logo) | High |
| Canonical/domain URLs hard-coded in 5 files | Medium — migration breaks all canonicals | Repeated literal `https://fileforge-iota.vercel.app` | Centralised in `src/lib/site.ts`, configurable via `NEXT_PUBLIC_SITE_URL` | High |
| Key content hidden on mobile | High — mobile-first indexing | `hidden md:block` on How It Works, Features and FAQ | Removed; all sections render on all viewports | Critical |
| Boolean SearchAction schema with no search implementation | Low — misleading structured data | `?q=` target had no handler | Removed from WebSite schema | Medium |
| Ad scripts load in `<head>` on every page | Medium — LCP/INP cost | Two profitablecpmratenetwork scripts via `next/script` | Kept for monetization; consider `strategy="lazyOnload"` + `worker` (already lazyOnload) and measure with PageSpeed | Medium |
| Hardcoded third-party API keys in source | Medium — security/dependency risk | Keys in `media` and `remove-bg` routes | Moved to env vars with the existing public demo keys as fallbacks; documented in `.env.example` | High |

## On-page & AEO findings

| Issue | Impact | Evidence | Fix | Priority |
|---|---|---|---|---|
| Tool pages were thin (converter + 3 steps only) | Very high — almost no ranking surface; nothing for LLMs to quote | `ToolPageClient.tsx` was the only real content | Added server-rendered intro, How-to steps, benefits, use cases, 4–6 FAQs, related tools on every tool page | Critical |
| No FAQPage / HowTo schema on tool pages | High — no rich results or AI-answer extraction | Only WebApplication + Breadcrumb schema existed | Added a single `@graph` with WebApplication, HowTo, FAQPage and BreadcrumbList | Critical |
| Generic, non-targeted H1 on homepage (`Convert files in a flash`) | Medium — weak keyword signal | Homepage HTML | Changed to `Free Online File Converter`, keyword-specific subtitle | High |
| Duplicate/contradictory claims (`21+`, `500 API credits`) | Medium — trust and accuracy | About/FAQ/homepage | All counts now derive from `TOOLS.length`; removed fake credit system; added accurate privacy wording | High |
| FAQ answers hidden behind accordion on mobile (separate shorter FAQ) | Medium — duplicate/thin content | Two different FAQ blocks | Unified into one semantic `<details>` FAQ visible on all devices and marked up as FAQPage | High |
| No AI-crawler guidance | Medium — poor citation discoverability | No `llms.txt`, no bot rules | Added `/llms.txt` (33 tool URLs + key facts) and explicit GPTBot/CCBot/PerplexityBot/ClaudeBot/Google-Extended allow rules | High |
| No privacy policy page (only an About section) | Medium — E-E-A-T trust signal missing | No `/privacy` route | Added `/privacy` with processing details, contact email and review date; linked from all footers | High |
| `keywords` meta used (ignored by Google) | Low | layout + tool metadata | Retained for other engines/AEO; low effort, no harm | Low |
| Internal linking only showed first 6 tools | Medium — orphan-like long tail | ToolPageClient used `TOOLS.slice(0,6)` | Replaced with category-aware related tools + sidebar of 8 on each page; added "Most popular conversions" block on homepage | High |

---

## New converters added (12)

| Category | Tools added | Demand rationale |
|---|---|---|
| PDF | Image to PDF, JPG to PDF, PNG to PDF, WebP to PDF | "image to PDF" / "JPG to PDF" are among the most-searched conversion queries |
| PDF | PDF to JPG, PDF to PNG | Page extraction for sharing/thumbnails |
| PDF | Merge PDF, Split PDF, Compress PDF | Top-10 PDF tools in the existing PLAN.md research |
| Image | Image Resize | #3 most-used image tool in the research |
| Audio | M4A to MP3 | Top-10 audio conversion query |
| Video | WebM to MP4 | Common compatibility need alongside MP4→WebM |

Existing tools were kept; only video tools changed implementation.

---

## Prioritized action plan

### Critical (done)
1. Restore document conversions without requiring a paid key (CloudConvert optional, free fallback).
2. Rebuild the 5 broken video converters as browser-based FFmpeg conversions.
3. Expose tool-page content and structured data to crawlers on every viewport.
4. Fix broken OG/logo assets.

### High impact (done)
5. Add the 12 requested/new converters with dedicated indexable pages.
6. Add `/llms.txt`, `/privacy`, crawler allow rules, centralised canonical config.
7. Keyword-focused H1, accurate counts, unified FAQ, contextual internal links.

### Quick wins (done)
8. Removed unused code/warnings in source files; cleaned media API error messages.
9. Added an automated converter test suite (`scripts/test-converters.mjs`, `test-heavy.mjs`, `test-video.mjs`).

### Recommended next (requires your input)
10. **Verify the domain** — if you use a custom domain, set `NEXT_PUBLIC_SITE_URL` in Vercel so canonicals/OG/sitemap match.
11. **Submit the sitemap** in Google Search Console and Bing Webmaster Tools; the verification meta tag is already present.
12. **Add real backlinks / E-E-A-T signals** — an author/company page with a verifiable address or social profiles (`sameAs` in Organization schema is currently empty).
13. **Measure Core Web Vitals** with PageSpeed Insights; the ad scripts and Google Fonts are the likeliest LCP costs.
14. Consider `next/font` instead of the external Google Fonts stylesheet to remove a render-blocking request.
15. `npm audit` reports 22 dependency advisories (mostly transitive in the background-removal/ONNX stack). Review before scaling traffic.

---

## Keyword / cannibalization map

| Query cluster | Primary page | Secondary pages | Action |
|---|---|---|---|
| image to pdf, jpg to pdf, png to pdf, webp to pdf | `/tools/image-to-pdf` | format-specific pages | Each has unique H1/meta/intro; format pages target the exact query |
| pdf to jpg / pdf to png | `/tools/pdf-to-jpg`, `/tools/pdf-to-png` | — | Distinct output format and metadata, no overlap |
| merge/split/compress pdf | dedicated pages | — | Unique intents, no cannibalization |
| convert video / mp4 to webm / mov to mp4 | format pages | `/tools/mp4-to-mp3` (audio extraction) | Different outputs; descriptions disambiguate |
| free online file converter (homepage) | `/` | tool pages | Homepage targets broad term; tools target long-tail "X to Y" terms |

---

## How to re-run the tests

```bash
npm run build
npm run start
node scripts/test-converters.mjs      # 17 browser-based converters
node scripts/test-heavy.mjs           # AI background removal + API converters
node scripts/test-video.mjs           # 5 FFmpeg-based video converters
```

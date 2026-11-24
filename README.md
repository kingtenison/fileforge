# FileForge

Free online file converter built with Next.js 16, React 19 and Tailwind CSS 4. 33 conversion tools across images, PDF, documents, video and audio. Most conversions run in the browser, so files are never uploaded.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Optional environment variables are documented in `.env.example`. Copy it to `.env.local`. The site works without any keys: document/audio conversions use a free public fallback provider, and CloudConvert is used automatically when `CLOUDCONVERT_API_KEY` is set.

## Conversion engines

| Category | Engine |
|---|---|
| Images (compress, resize, format conversion, background removal) | Canvas + on-device ONNX model |
| PDF (image→PDF, PDF→image, merge, split, compress) | jsPDF, PDF.js, pdf-lib |
| Text → PDF | jsPDF |
| Video → video | FFmpeg WASM (engine downloaded from CDN on first use) |
| Documents (Word, Excel, PPT, PDF↔Word) | CloudConvert (if configured) or free Convert.FAST fallback |
| Audio (MP3/WAV/M4A/AAC/OGG, video→MP3) | Convert.FAST |

Max file size: 50MB per file.

## Testing converters

With the app running:

```bash
node scripts/test-converters.mjs   # browser-based converters (requires local Chrome/Edge)
node scripts/test-heavy.mjs        # background removal + API-backed converters
node scripts/test-video.mjs        # FFmpeg video converters
```

`CHROME_PATH` can override the Chrome executable used by the tests.

## SEO / AEO

- See `SEO_AEO_AUDIT.md` for the full audit and remediation report.
- `public/llms.txt` lists all tools for LLM crawlers.
- Canonical URLs, Open Graph and the sitemap use `NEXT_PUBLIC_SITE_URL` (set it in production if the domain changes).

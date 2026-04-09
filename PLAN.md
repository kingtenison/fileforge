# File Converter Website Plan
## Next.js + Node.js + TailwindCSS with AdSterra Monetization

---

## Goal
Build a file conversion website using free APIs, monetized with AdSterra ads, targeting 1000+ monthly visits.

---

## Research: Most Popular Online Converters (2025-2026)

### Top PDF Tools (36% of all usage)
- **PDF Compress** - #2 most used (1,710 uses/30 days)
- **PDF Split** - #8 most used, #1 in downloads (7,830 downloads/30 days)
- **PDF Merge** - #9 most used (611 uses/30 days)
- **PDF to Word** - Highly searched
- **Word to PDF** - Most common document conversion

### Top Image Tools (33% of all usage)
- **Image Compress** - #1 most used (1,929 uses/30 days)
- **Image Resize** - #3 most used (1,501 uses/30 days)
- **Image Convert** - #4 most used (1,008 uses/30 days)
- **JPG ↔ WebP** - Extremely popular (WebP is now dominant format)
- **HEIC to JPG** - Top 10 (Apple device compatibility)
- **PNG ↔ WebP** - Popular

### Top Video/Audio Tools (17% of all usage)
- **M4A to MP3** - #6 most used (697 uses/30 days)
- **Video to MP3** - #13 most used (507 uses/30 days)
- **MP4 conversions** - 67% of all video processing

### Most Popular Converters (Traffic/Trust Based)
1. **CloudConvert** - 29.76M visits/mo, best API, 200+ formats
2. **Convertio** - 21.09M visits/mo, 300+ formats
3. **Zamzar** - 1200+ formats, oldest (since 2006)
4. **Online-Convert.com** - 9.77M visits/mo, 8,698 conversion combos
5. **AhaConvert** - Fast, 300+ formats, modern UI

---

## Recommended Converters to Build (Prioritized)

### Tier 1: High Demand + Good Free APIs (Build First)
1. **PDF Compress** - #2 tool, free APIs available
2. **JPG ↔ PNG** - #4 tool, many free options
3. **JPG ↔ WebP** - Top 10, huge demand
4. **Word to PDF** - Essential for docs
5. **PDF to Word** - Essential for docs
6. **Image Compress** - #1 tool!

### Tier 2: Medium Demand (Add Later)
7. PDF Split / Merge
8. PNG ↔ WebP
9. M4A to MP3
10. Image Resize
11. HEIC to JPG (Apple users)
12. Word ↔ DOCX

### Tier 3: Expand Later
13. Video to MP3
14. Excel to PDF
15. Document conversions (EPUB, MOBI, etc.)

---

## Free API Options (For 1000 visits/mo)

| API | Free Tier | Limitations | Best For |
|-----|------------|-------------|----------|
| **Doc Converter Pro** | 1,000/mo | 2/sec rate limit | Word↔PDF |
| **ConvertHub** | 50 calls | None | DOCX→PDF |
| **CloudConvert** | 25 min/mo | Time-based | Any format |
| **ConvertAPI** | 250 conversions | Small | PDF tools |
| **FreeConvert** | Limited | Verify | General |

### Image Conversion APIs
- **Cloudinary** - Free tier includes transformations
- **Picresize** - Free image API
- **ezgif** - Free GIF/image tools API

### Video/Audio APIs
- **CloudConvert** - Best for audio/video
- **APIFY** - Has free tiers for various converters

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Node.js API routes (Next.js API or separate)
- **Styling**: TailwindCSS
- **UI**: Clean, ad-friendly layout (AdSterra zones)
- **State**: React hooks / Zustand for simple state
- **Deployment**: Vercel (free tier good for this)

---

## AdSterra Integration

### Ad Formats for File Converter Sites
1. **Native Ads** - Between conversion tools
2. **Banner Ads** - 300x250, 728x90 in sidebar/header
3. **Interstitial** - Between conversions (high CPC)
4. **Pop-under** - Lower CPC but good for volume

### Placement Strategy
- Header: 728x90 banner
- Tool cards: 300x250 between rows
- Before download: Interstitial (best converting)
- Footer: 300x250

### Estimated Earnings (1000 visits)
- Display ads: ~$5-20/mo (depends on CPM)
- Interstitials: +$10-30/mo
- Pop-unders: +$5-15/mo
- **Total**: ~$20-65/mo possible

---

## Implementation Phases

### Phase 1: MVP (Weeks 1-2)
- Landing page with tool grid
- 3-5 core converters (PDF Compress, JPG↔PNG, Word↔PDF)
- AdSterra integration
- Simple upload → convert → download flow

### Phase 2: Expand (Weeks 3-4)
- Add 5-10 more converters
- Add file size validation
- Better loading states

### Phase 3: Scale (Weeks 5-6)
- More tools, better UI
- SEO optimization
- Analytics tracking

---

## Clarifying Questions

1. **File size limits** - What max file size for free users? (10MB, 50MB, 100MB?)
2. **Exact converters** - Which 5-10 converters should be in MVP?
3. **Ad placement** - Preferred ad formats (interstitial acceptable?)
4. **Branding** - Do you have a name for the site?

---

## Finalized Plan

### Site Name
**FileForge** - Simple, memorable, implies file transformation

### MVP: Top 5 Converters (Based on Popularity)
1. **Image Compress** - #1 most used (1,929 uses/30 days)
2. **JPG to WebP** - Top 10, massive demand as WebP dominates
3. **PDF Compress** - #2 most used (1,710 uses/30 days)
4. **Word to PDF** - Essential document converter
5. **WebP to JPG** - Reverse of #2, for compatibility

### Secondary Tools (v1.1)
- PNG to JPG
- JPG to PNG
- PDF to Word
- PNG to WebP
- M4A to MP3
- Image Resize

### File Handling
- **Max file size**: 10MB (per user request)
- **Auto-delete**: 10 minutes after conversion (for privacy/storage)
- **Storage**: Temporary local storage or in-memory for conversion

### AdSterra Integration (Per User Approval)
- **Interstitial ads** - Between conversion steps (high CPC)
- **Pop-under ads** - Background ads for volume
- **Banner ads** - 300x250 sidebar, 728x90 header
- **Placement**: Before download, between tools, header/footer

### Estimated Earnings (1,000 visits)
- Display ads: ~$5-20/mo
- Interstitials: ~$10-30/mo
- Pop-unders: ~$5-15/mo
- **Total**: ~$20-65/mo potential

---

### Technical Architecture

```
FileForge/
├── app/
│   ├── page.tsx (Landing page with tool grid)
│   ├── layout.tsx (AdSterra + global styles)
│   ├── api/
│   │   └── convert/[type]/route.ts (API routes per converter)
│   └── tools/
│       ├── image-compress/page.tsx
│       ├── jpg-to-webp/page.tsx
│       ├── pdf-compress/page.tsx
│       ├── word-to-pdf/page.tsx
│       └── webp-to-jpg/page.tsx
├── components/
│   ├── FileUploader.tsx
│   ├── ConverterCard.tsx
│   ├── AdSterraBanner.tsx
│   └── ConvertButton.tsx
├── lib/
│   └── conversion-apis.ts (API client functions)
├── tailwind.config.ts
└── package.json
```

### API Strategy
- **Doc Converter Pro**: Word↔PDF (1,000 free/mo, 2/sec limit)
- **CloudConvert**: Backup/additional formats (25 min free)
- **Image conversion**: Use client-side or simple APIs

### Conversion Flow
1. User lands on home → sees tool grid with ads
2. Selects tool → uploads file (max 10MB)
3. Server processes via free API
4. Result returned, download available
5. File auto-deleted after 10 minutes
6. Ad shown before/between conversions

---

### Implementation Timeline

**Week 1**: Setup + Core Infrastructure
- Next.js + TailwindCSS setup
- AdSterra SDK integration
- File upload component
- API route structure

**Week 2**: MVP Converters
- Image Compress
- JPG ↔ WebP
- PDF Compress
- Word → PDF
- WebP → JPG

**Week 3-4**: Polish + Expansion
- Add 5+ more converters
- File cleanup cron job
- SEO optimization
- Analytics

---

Ready for implementation.
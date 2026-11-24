import type { Tool, ToolEngine, ToolSeo } from './types';

export const toolColors: Record<string, { light: string; dark: string; gradient: string }> = {
  purple: { light: 'rgba(139, 92, 246, 0.3)', dark: '#7c3aed', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  orange: { light: 'rgba(249, 115, 22, 0.3)', dark: '#ea580c', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
  pink: { light: 'rgba(236, 72, 153, 0.3)', dark: '#db2777', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
  cyan: { light: 'rgba(6, 182, 212, 0.3)', dark: '#0891b2', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  green: { light: 'rgba(16, 185, 129, 0.3)', dark: '#059669', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  blue: { light: 'rgba(59, 130, 246, 0.3)', dark: '#2563eb', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  red: { light: 'rgba(239, 68, 68, 0.3)', dark: '#dc2626', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  yellow: { light: 'rgba(234, 179, 8, 0.3)', dark: '#ca8a04', gradient: 'linear-gradient(135deg, #eab308, #ca8a04)' },
  emerald: { light: 'rgba(16, 185, 129, 0.3)', dark: '#059669', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  violet: { light: 'rgba(139, 92, 246, 0.3)', dark: '#7c3aed', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  indigo: { light: 'rgba(99, 102, 241, 0.3)', dark: '#4f46e5', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  teal: { light: 'rgba(20, 184, 166, 0.3)', dark: '#0d9488', gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
};

const IMAGE = '/api/convert';
const DOCUMENT = '/api/convert/document';
const MEDIA = '/api/convert/media';

export const TOOLS: Tool[] = [
  // ── Image Converters (8) ──────────────────────────────────────────────
  {
    id: 'image-compress', name: 'Image Compress', label: 'Squeeze',
    description: 'Reduce image file size by up to 80% while maintaining visual quality. Supports JPG, PNG, WebP, and GIF with adjustable compression levels — processed entirely in your browser.',
    icon: 'compress', inputFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'], outputFormat: 'jpg',
    category: 'image', apiEndpoint: IMAGE, color: 'purple', engine: 'image', option: 'quality', popular: true,
  },
  {
    id: 'image-resize', name: 'Image Resize', label: 'Resize',
    description: 'Resize images to exact pixel dimensions for social media, websites, and apps. Enter a custom width and height — fast, private, and processed in your browser.',
    icon: 'image-resize', inputFormats: ['jpg', 'jpeg', 'png', 'webp'], outputFormat: 'jpg',
    category: 'image', apiEndpoint: IMAGE, color: 'teal', engine: 'image-resize', option: 'dimensions', popular: true,
  },
  {
    id: 'jpg-to-webp', name: 'JPG to WebP', label: 'Compress',
    description: 'Convert JPG images to WebP format for 25-34% smaller file sizes with identical quality. Ideal for web optimization and faster page loads. No server upload needed.',
    icon: 'jpg-webp', inputFormats: ['jpg', 'jpeg'], outputFormat: 'webp',
    category: 'image', apiEndpoint: IMAGE, color: 'orange', engine: 'image', popular: true,
  },
  {
    id: 'webp-to-jpg', name: 'WebP to JPG', label: 'Expand',
    description: "Convert WebP images to universally compatible JPG format. Perfect for sharing on platforms that don't support WebP or for editing in legacy software. Browser-based, zero uploads.",
    icon: 'webp-jpg', inputFormats: ['webp'], outputFormat: 'jpg',
    category: 'image', apiEndpoint: IMAGE, color: 'pink', engine: 'image', popular: true,
  },
  {
    id: 'png-to-jpg', name: 'PNG to JPG', label: 'Transform',
    description: 'Convert PNG images to JPG with adjustable quality settings. Reduces file size significantly by removing transparency. All processing happens locally in your browser.',
    icon: 'png-jpg', inputFormats: ['png'], outputFormat: 'jpg',
    category: 'image', apiEndpoint: IMAGE, color: 'cyan', engine: 'image', option: 'quality',
  },
  {
    id: 'jpg-to-png', name: 'JPG to PNG', label: 'Convert',
    description: 'Convert JPG images to PNG format with lossless quality and transparency support. Perfect for graphics, logos, and images that need alpha channels. Client-side processing.',
    icon: 'jpg-png', inputFormats: ['jpg', 'jpeg'], outputFormat: 'png',
    category: 'image', apiEndpoint: IMAGE, color: 'green', engine: 'image',
  },
  {
    id: 'png-to-webp', name: 'PNG to WebP', label: 'Optimize',
    description: 'Convert PNG to WebP for modern web optimization. Achieve smaller file sizes with superior compression while retaining lossless quality. Zero server uploads.',
    icon: 'png-webp', inputFormats: ['png'], outputFormat: 'webp',
    category: 'image', apiEndpoint: IMAGE, color: 'blue', engine: 'image',
  },
  {
    id: 'background-eraser', name: 'Background Eraser', label: 'Remove',
    description: 'Remove backgrounds from images automatically using AI-powered detection. Outputs transparent PNG files. Works with JPG, PNG, and WebP — processed entirely in your browser for total privacy.',
    icon: 'eraser', inputFormats: ['jpg', 'jpeg', 'png', 'webp'], outputFormat: 'png',
    category: 'image', apiEndpoint: '/api/remove-bg', color: 'violet', engine: 'remove-bg', popular: true,
  },

  // ── PDF Converters (9) — new, high-demand tools ──────────────────────
  {
    id: 'image-to-pdf', name: 'Image to PDF', label: 'Combine',
    description: 'Convert one or more JPG, PNG, WebP or GIF images into a single PDF document. Add photos in any order, then download a clean PDF — all in your browser.',
    icon: 'image-pdf', inputFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'], outputFormat: 'pdf',
    category: 'pdf', apiEndpoint: IMAGE, color: 'red', engine: 'images-to-pdf', multiFile: true, popular: true,
    seo: {
      title: 'Image to PDF Converter — Convert JPG, PNG & WebP to PDF',
      description: 'Convert images to PDF free and instantly. Combine multiple JPG, PNG or WebP photos into one PDF in your browser. No upload, no watermark, no signup.',
      intro: 'FileForge turns your images into a single PDF without uploading them. Add JPG, PNG, WebP or GIF files (up to 50MB each), reorder them, and download a ready-to-share PDF. Conversion runs locally with the Canvas API and pdf-lib, so your photos never leave your device.',
      useCases: ['Scanning phone photos into one PDF document', 'Creating a photo album or portfolio PDF', 'Attaching several screenshots to one email', 'Building a printable image packet'],
      faqs: [
        { question: 'Can I combine multiple images into one PDF?', answer: 'Yes. Add as many JPG, PNG, WebP or GIF files as you need and they become pages in a single PDF, in the order you selected them.' },
        { question: 'Will my images lose quality?', answer: 'PNG and WebP images are embedded losslessly. JPG images are embedded at their original quality, so the PDF matches the source image.' },
      ],
    },
  },
  {
    id: 'jpg-to-pdf', name: 'JPG to PDF', label: 'Convert',
    description: 'Turn one or more JPG photos into a PDF document instantly. Free, private, browser-based, and no watermark.',
    icon: 'image-pdf', inputFormats: ['jpg', 'jpeg'], outputFormat: 'pdf',
    category: 'pdf', apiEndpoint: IMAGE, color: 'orange', engine: 'images-to-pdf', multiFile: true, popular: true,
  },
  {
    id: 'png-to-pdf', name: 'PNG to PDF', label: 'Convert',
    description: 'Convert PNG images to a PDF file while keeping lossless quality and transparency. Works with multiple images in one browser-based conversion.',
    icon: 'image-pdf', inputFormats: ['png'], outputFormat: 'pdf',
    category: 'pdf', apiEndpoint: IMAGE, color: 'blue', engine: 'images-to-pdf', multiFile: true,
  },
  {
    id: 'webp-to-pdf', name: 'WebP to PDF', label: 'Convert',
    description: 'Convert WebP images into a universally readable PDF document. Combine multiple WebP files into one PDF, privately in your browser.',
    icon: 'image-pdf', inputFormats: ['webp'], outputFormat: 'pdf',
    category: 'pdf', apiEndpoint: IMAGE, color: 'orange', engine: 'images-to-pdf', multiFile: true,
  },
  {
    id: 'pdf-to-jpg', name: 'PDF to JPG', label: 'Extract',
    description: 'Extract any page from a PDF and save it as a high-quality JPG image. Choose the page number, convert locally, and download instantly.',
    icon: 'pdf-image', inputFormats: ['pdf'], outputFormat: 'jpg',
    category: 'pdf', apiEndpoint: IMAGE, color: 'pink', engine: 'pdf-to-image', option: 'page', popular: true,
    seo: {
      description: 'Convert a PDF page to JPG for free. Pick a page number and export it as a high-quality image — no watermark, no upload, no signup required.',
      intro: 'FileForge renders a selected PDF page to a JPG image directly in your browser using PDF.js. Enter the page number, convert, and download. Your PDF is never uploaded, and there is no watermark on the result.',
      useCases: ['Sharing a single PDF page as an image', 'Making a thumbnail from a document', 'Extracting a chart or diagram from a report'],
    },
  },
  {
    id: 'pdf-to-png', name: 'PDF to PNG', label: 'Extract',
    description: 'Export a PDF page as a lossless PNG image. Ideal for screenshots, presentations, and graphics that need crisp detail.',
    icon: 'pdf-image', inputFormats: ['pdf'], outputFormat: 'png',
    category: 'pdf', apiEndpoint: IMAGE, color: 'cyan', engine: 'pdf-to-image', option: 'page', popular: true,
  },
  {
    id: 'pdf-merge', name: 'Merge PDF', label: 'Combine',
    description: 'Combine multiple PDF files into one document in a single click. Preserve page order and quality — entirely in your browser.',
    icon: 'pdf-merge', inputFormats: ['pdf'], outputFormat: 'pdf',
    category: 'pdf', apiEndpoint: IMAGE, color: 'indigo', engine: 'pdf-merge', multiFile: true, popular: true,
    seo: {
      description: 'Merge PDF files into one document for free. Combine as many PDFs as you like, keep their original quality, and download instantly. No upload, no signup.',
      intro: 'FileForge merges PDF files client-side with pdf-lib. Add two or more PDFs, and every page is appended in order to one output document. Nothing is uploaded, so confidential files stay on your device.',
      useCases: ['Joining scanned contract pages', 'Combining invoices into one statement', 'Assembling a multi-document application', 'Merging chapters of an ebook'],
    },
  },
  {
    id: 'pdf-split', name: 'Split PDF', label: 'Extract',
    description: 'Extract selected pages from a PDF into a new file. Enter a page number or range such as 1-3 and download only what you need.',
    icon: 'pdf-split', inputFormats: ['pdf'], outputFormat: 'pdf',
    category: 'pdf', apiEndpoint: IMAGE, color: 'violet', engine: 'pdf-split', option: 'pages', popular: true,
    seo: {
      description: 'Split a PDF online for free. Extract one page or a page range into a new PDF file, locally in your browser. No upload, no watermark, no signup.',
      intro: 'FileForge splits PDFs locally. Upload a PDF, enter a page number or range like "1-3" or "4,7-9", and download a new PDF containing only those pages. The source document is never uploaded.',
      useCases: ['Sending only relevant pages of a contract', 'Extracting a chapter from a manual', 'Separating scanned pages', 'Sharing one page of a large report'],
    },
  },
  {
    id: 'pdf-compress', name: 'Compress PDF', label: 'Shrink',
    description: 'Reduce PDF file size by rebuilding object streams and removing redundant data. Fast, private, browser-based PDF optimization.',
    icon: 'pdf-compress', inputFormats: ['pdf'], outputFormat: 'pdf',
    category: 'pdf', apiEndpoint: IMAGE, color: 'green', engine: 'pdf-compress', popular: true,
    seo: {
      description: 'Compress a PDF for free in your browser. Reduce file size by optimizing object streams and structure, with no upload and no watermark.',
      intro: 'FileForge rewrites your PDF with compressed object streams and a leaner internal structure, which often reduces file size without changing the visible pages. Processing happens locally, so your document is never uploaded.',
      useCases: ['Meeting an email attachment size limit', 'Uploading a PDF to a form with a file cap', 'Speeding up downloads on a website'],
      faqs: [
        { question: 'How much smaller will my PDF be?', answer: 'It depends on the file. PDFs that were saved without object streams usually shrink the most; already-optimized PDFs may change very little.' },
      ],
    },
  },

  // ── Document Converters (5) ───────────────────────────────────────────
  {
    id: 'word-to-pdf', name: 'Word to PDF', label: 'Export',
    description: 'Convert Word documents (DOC, DOCX) to PDF format with preserved formatting, fonts, and layout. Secure conversion with automatic file deletion after processing.',
    icon: 'word-pdf', inputFormats: ['doc', 'docx'], outputFormat: 'pdf',
    category: 'document', apiEndpoint: DOCUMENT, color: 'blue', engine: 'document', popular: true,
  },
  {
    id: 'pdf-to-word', name: 'PDF to Word', label: 'Extract',
    description: 'Convert PDF documents to fully editable Word files (DOCX). Preserves text, images, tables, and formatting for easy modification.',
    icon: 'pdf-word', inputFormats: ['pdf'], outputFormat: 'docx',
    category: 'document', apiEndpoint: DOCUMENT, color: 'indigo', engine: 'document', popular: true,
  },
  {
    id: 'excel-to-pdf', name: 'Excel to PDF', label: 'Table',
    description: 'Convert Excel spreadsheets (XLS, XLSX) to PDF documents with accurate table formatting, charts, and cell styling.',
    icon: 'excel-pdf', inputFormats: ['xls', 'xlsx'], outputFormat: 'pdf',
    category: 'document', apiEndpoint: DOCUMENT, color: 'green', engine: 'document',
  },
  {
    id: 'ppt-to-pdf', name: 'PPT to PDF', label: 'Slide',
    description: 'Convert PowerPoint presentations (PPT, PPTX) to PDF format while preserving slide layouts, images, and graphics as static pages.',
    icon: 'ppt-pdf', inputFormats: ['ppt', 'pptx'], outputFormat: 'pdf',
    category: 'document', apiEndpoint: DOCUMENT, color: 'red', engine: 'document',
  },
  {
    id: 'txt-to-pdf', name: 'Text to PDF', label: 'Write',
    description: 'Convert plain text files to a clean, readable PDF document with automatic page breaks. Runs in your browser — no upload needed.',
    icon: 'txt-pdf', inputFormats: ['txt'], outputFormat: 'pdf',
    category: 'document', apiEndpoint: DOCUMENT, color: 'teal', engine: 'text-to-pdf',
  },

  // ── Video Converters (5) ──────────────────────────────────────────────
  {
    id: 'mp4-to-webm', name: 'MP4 to WebM', label: 'Stream',
    description: 'Convert MP4 videos to WebM format for smaller, streaming-friendly files. WebM offers better compression for web playback.',
    icon: 'mp4-webm', inputFormats: ['mp4'], outputFormat: 'webm',
    category: 'video', apiEndpoint: MEDIA, color: 'cyan', engine: 'media',
  },
  {
    id: 'webm-to-mp4', name: 'WebM to MP4', label: 'Compatibility',
    description: 'Convert WebM videos to MP4 (H.264) for maximum compatibility with phones, social platforms, and video editors.',
    icon: 'video-convert', inputFormats: ['webm'], outputFormat: 'mp4',
    category: 'video', apiEndpoint: MEDIA, color: 'cyan', engine: 'media',
  },
  {
    id: 'avi-to-mp4', name: 'AVI to MP4', label: 'Modernize',
    description: 'Convert legacy AVI video files to modern MP4 format with H.264 encoding. Better compression, wider compatibility, and smaller file sizes.',
    icon: 'video-convert', inputFormats: ['avi'], outputFormat: 'mp4',
    category: 'video', apiEndpoint: MEDIA, color: 'orange', engine: 'media',
  },
  {
    id: 'mov-to-mp4', name: 'MOV to MP4', label: 'Convert',
    description: 'Convert Apple QuickTime MOV files to universally compatible MP4 format. Maintains video quality while improving compatibility across all devices.',
    icon: 'video-convert', inputFormats: ['mov'], outputFormat: 'mp4',
    category: 'video', apiEndpoint: MEDIA, color: 'pink', engine: 'media',
  },
  {
    id: 'mkv-to-webm', name: 'MKV to WebM', label: 'Streamline',
    description: 'Convert MKV Matroska video files to WebM format optimized for web streaming. Reduces file size while maintaining quality.',
    icon: 'video-convert', inputFormats: ['mkv'], outputFormat: 'webm',
    category: 'video', apiEndpoint: MEDIA, color: 'violet', engine: 'media',
  },

  // ── Audio Converters (6) ──────────────────────────────────────────────
  {
    id: 'mp3-to-wav', name: 'MP3 to WAV', label: 'Quality',
    description: 'Convert compressed MP3 audio to uncompressed WAV format for maximum audio quality. Ideal for audio editing, mastering, and production.',
    icon: 'audio-convert', inputFormats: ['mp3'], outputFormat: 'wav',
    category: 'audio', apiEndpoint: MEDIA, color: 'green', engine: 'media',
  },
  {
    id: 'wav-to-mp3', name: 'WAV to MP3', label: 'Compact',
    description: 'Convert uncompressed WAV audio files to space-saving MP3 format with configurable bitrate. Reduces file size by up to 90%.',
    icon: 'audio-convert', inputFormats: ['wav'], outputFormat: 'mp3',
    category: 'audio', apiEndpoint: MEDIA, color: 'blue', engine: 'media',
  },
  {
    id: 'm4a-to-mp3', name: 'M4A to MP3', label: 'Universal',
    description: 'Convert Apple M4A audio to MP3 for universal playback on any device, car stereo, or music app.',
    icon: 'audio-convert', inputFormats: ['m4a'], outputFormat: 'mp3',
    category: 'audio', apiEndpoint: MEDIA, color: 'amber', engine: 'media', popular: true,
  },
  {
    id: 'mp3-to-aac', name: 'MP3 to AAC', label: 'Upgrade',
    description: 'Convert MP3 audio to AAC format for better sound quality at equivalent bitrates. AAC is the standard for Apple Music, YouTube, and streaming.',
    icon: 'audio-convert', inputFormats: ['mp3'], outputFormat: 'aac',
    category: 'audio', apiEndpoint: MEDIA, color: 'fuchsia', engine: 'media',
  },
  {
    id: 'mp3-to-ogg', name: 'MP3 to OGG', label: 'Open',
    description: 'Convert MP3 audio to free and open OGG Vorbis format. No licensing fees and wide support in open-source media players and games.',
    icon: 'audio-convert', inputFormats: ['mp3'], outputFormat: 'ogg',
    category: 'audio', apiEndpoint: MEDIA, color: 'amber', engine: 'media',
  },
  {
    id: 'mp4-to-mp3', name: 'Video to MP3', label: 'Extract',
    description: 'Extract audio tracks from video files (MP4, AVI, MOV, MKV, WebM) and save as high-quality MP3. Perfect for music, podcasts, or lectures.',
    icon: 'video-mp3', inputFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm'], outputFormat: 'mp3',
    category: 'audio', apiEndpoint: MEDIA, color: 'rose', engine: 'media', popular: true,
  },
];

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getToolsByCategory(category: Tool['category']): Tool[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getPopularTools(limit: number = 8): Tool[] {
  return TOOLS.filter((tool) => tool.popular).slice(0, limit);
}

export function getRelatedTools(tool: Tool, limit: number = 6): Tool[] {
  const sameCategory = TOOLS.filter((t) => t.id !== tool.id && t.category === tool.category);
  const popularOthers = TOOLS.filter((t) => t.id !== tool.id && t.popular && t.category !== tool.category);
  return [...sameCategory, ...popularOthers].slice(0, limit);
}

const CLIENT_ENGINES: ToolEngine[] = ['image', 'remove-bg', 'images-to-pdf', 'pdf-to-image', 'pdf-merge', 'pdf-split', 'pdf-compress', 'image-resize', 'text-to-pdf'];

export function isClientSide(tool: Tool): boolean {
  return CLIENT_ENGINES.includes(tool.engine);
}

const USE_CASES: Record<string, string[]> = {
  'image-compress': ['Uploading photos to websites with size limits', 'Speeding up page loads', 'Freeing up storage on your phone'],
  'jpg-to-webp': ['Web optimization and Core Web Vitals', 'Product images for e-commerce', 'Faster-loading blog posts'],
  'webp-to-jpg': ['Sharing on platforms that reject WebP', 'Editing in older design software', 'Emailing images to clients'],
  'png-to-jpg': ['Reducing photo file sizes', 'Preparing images for social media', 'Converting screenshots for documents'],
  'jpg-to-png': ['Logos and graphics needing transparency', 'Print-ready artwork', 'Images for further editing'],
  'png-to-webp': ['Modern website assets', 'Smaller app bundles', 'Progressive web apps'],
  'image-resize': ['Social media post dimensions', 'Website thumbnails', 'Passport and ID photo sizing'],
  'background-eraser': ['Product photos', 'Profile pictures', 'Design and marketing assets'],
  'pdf-to-word': ['Editing scanned contracts', 'Reusing report text', 'Updating forms and templates'],
  'pdf-compress': ['Email attachment size limits', 'Upload portals with file caps', 'Faster document sharing'],
  'txt-to-pdf': ['Turning notes into shareable documents', 'Creating simple invoices', 'Printing plain-text files'],
  'word-to-pdf': ['Sending finalized documents', 'Job applications', 'Sharing reports that should not be edited'],
  'excel-to-pdf': ['Sharing spreadsheets read-only', 'Printing tables and charts', 'Attaching financial reports'],
  'ppt-to-pdf': ['Distributing presentations', 'Printing slide decks', 'Sharing on devices without PowerPoint'],
  'mp4-to-mp3': ['Saving podcasts and lectures', 'Extracting music from videos', 'Listening offline'],
  'm4a-to-mp3': ['Playing Apple Music files on any device', 'Car stereos and older mp3 players', 'Editing audio in software that only reads MP3'],
};

/**
 * Builds fact-dense, tool-specific copy used for on-page content and
 * FAQPage / HowTo structured data. Curated copy in `tool.seo` wins.
 */
export function getToolSeo(tool: Tool): ToolSeo {
  const from = tool.inputFormats.map((f) => f.toUpperCase()).join('/');
  const to = tool.outputFormat.toUpperCase();
  const exts = tool.inputFormats.map((f) => `.${f}`).join(', ');
  const local = isClientSide(tool) || tool.category === 'video';
  const multi = Boolean(tool.multiFile);
  const categoryName = tool.category.charAt(0).toUpperCase() + tool.category.slice(1);

  const defaults: ToolSeo = {
    title: `${tool.name} — Free Online ${from} to ${to} Converter`,
    description: `${tool.description} Free, fast, and private — no signup required. Max file size 50MB. ${local ? 'Processed in your browser.' : 'Powered by a secure conversion API.'}`,
    keywords: [tool.name.toLowerCase(), `${tool.inputFormats[0]} to ${tool.outputFormat}`, `${to.toLowerCase()} converter`, 'free online converter', `${categoryName.toLowerCase()} converter`],
    intro: `FileForge's ${tool.name} tool converts ${from} files to ${to} for free, with no account or watermark. Accepted inputs are ${exts}, up to 50MB per file. ${local ? 'The conversion runs locally in your browser using web standards, so your files are never uploaded.' : 'Files are sent over HTTPS to our conversion provider and are not stored by FileForge.'}`,
    steps: [
      { name: multi ? 'Add your files' : 'Add your file', text: `Select ${exts} files (up to 50MB each${multi ? ', as many as you need' : ''}). You can also drag and drop.` },
      { name: 'Convert', text: local ? 'FileForge processes the file in your browser — nothing is uploaded.' : 'FileForge sends the file through a secure conversion API and returns the result.' },
      { name: 'Download', text: `Your ${to} file is ready immediately, with no watermark and no signup.` },
    ],
    benefits: [
      { title: 'Free and unlimited', text: `Convert ${from} to ${to} as often as you like — no subscription, no trial, and no credit card.` },
      { title: local ? 'Private by design' : 'Secure processing', text: local ? 'Your files stay on your device. Image and PDF conversions use browser APIs, not a server.' : 'Files are transferred over HTTPS and are not retained by FileForge after conversion.' },
      { title: 'No software to install', text: 'FileForge works in any modern browser on Windows, macOS, Linux, Android, and iOS.' },
      { title: 'No watermarks', text: `The downloaded ${to} file is clean and ready to use personally or commercially.` },
    ],
    faqs: [
      { question: `Is ${tool.name} really free?`, answer: `Yes. FileForge's ${tool.name} tool is free to use with no registration, subscription, or hidden fees.` },
      { question: `What is the maximum file size?`, answer: `Each file can be up to 50MB. For the best experience, keep total upload sizes reasonable.` },
      { question: `Are my files uploaded or stored?`, answer: local ? `No. ${tool.name} runs entirely in your browser, so your files never leave your device.` : 'Files are sent over HTTPS to our conversion provider. FileForge does not store your files after conversion.' },
      { question: `Which formats does ${tool.name} support?`, answer: `Input: ${exts}. Output: .${tool.outputFormat}.` },
    ],
    useCases: USE_CASES[tool.id] || [`Converting ${from} files for everyday use`, `Preparing ${to} files for sharing`, `Working without installing desktop software`],
  };

  return {
    ...defaults,
    ...tool.seo,
    keywords: tool.seo?.keywords || defaults.keywords,
    steps: tool.seo?.steps || defaults.steps,
    benefits: tool.seo?.benefits || defaults.benefits,
    faqs: tool.seo?.faqs ? [...tool.seo.faqs, ...defaults.faqs].slice(0, 6) : defaults.faqs,
    useCases: tool.seo?.useCases || defaults.useCases,
  };
}

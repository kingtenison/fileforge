import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import { TOOLS } from '@/lib/tools';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About FileForge',
  description:
    'Learn about FileForge — a free online file converter built for speed, privacy, and simplicity. Convert images, documents, video, and audio files without signup.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About FileForge — Free Online File Converter',
    description:
      'Learn about FileForge — a free online file converter built for speed, privacy, and simplicity.',
  },
};

const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About FileForge',
  description: `FileForge is a free online file converter with ${TOOLS.length} tools for images, PDFs, documents, video, and audio. Built for speed, privacy, and simplicity.`,
  url: siteUrl('/about'),
  lastReviewed: '2026-11-24',
  mainEntity: {
    '@type': 'Organization',
    name: 'FileForge',
    url: siteUrl(),
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutPageSchema} />
      <div className="min-h-screen bg-[#f8f6f3] grid-mesh-bg relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="ambient-orb ambient-orb-1 top-[-5%] left-[-5%]" />
          <div className="ambient-orb ambient-orb-2 top-[40%] right-[-8%]" />
          <div className="ambient-orb ambient-orb-3 bottom-[-5%] left-[20%]" />
        </div>

        <header>
          <div className="px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
            <Link href="/" className="font-heading font-bold text-xl text-gradient-super tracking-tight">
              FileForge
            </Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              &larr; Home
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-16 relative">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-gray-400">
              <li>
                <Link href="/" className="hover:text-gray-700 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">&rsaquo;</li>
              <li className="text-gray-600 font-medium">About</li>
            </ol>
          </nav>

          <article>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About FileForge</h1>

            <div className="prose prose-gray max-w-none">
              <section className="mb-10">
                <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">What is FileForge?</h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  FileForge is a free online file converter that helps you transform images, documents, video, and audio files between popular formats.
                  No registration required. No hidden fees. Just open your browser and start converting.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Our tool supports {TOOLS.length} conversions across five categories:
                </p>
                <ul className="list-disc list-inside text-gray-500 leading-relaxed mt-2 space-y-1">
                  <li><strong>Images:</strong> JPG, PNG, WebP, GIF — with compression, resizing and background removal</li>
                  <li><strong>PDF:</strong> Image to PDF, PDF to image, merge, split and compress</li>
                  <li><strong>Documents:</strong> Word, Excel, PowerPoint, PDF, and plain text</li>
                  <li><strong>Video:</strong> MP4, AVI, MOV, MKV, WebM</li>
                  <li><strong>Audio:</strong> MP3, WAV, AAC, OGG, FLAC</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">Privacy First</h2>
                <p className="text-gray-500 leading-relaxed">
                  Your privacy is our priority. All image conversions happen entirely in your browser using client-side JavaScript —
                  your files are never uploaded to any server. For document, video, and audio conversions, we use enterprise-grade
                  secure APIs that automatically delete your files after processing. We never store, read, or share your files.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">Free Forever</h2>
                <p className="text-gray-500 leading-relaxed">
                  FileForge is completely free to use. There are no premium tiers, no subscriptions, and no usage limits on the
                  browser-based image, PDF and text tools. Document, video and audio conversions are processed by third-party APIs
                  and are offered free within fair-use limits.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">How It Works</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-heading font-bold bg-cyan-50 text-cyan-600">1</span>
                      <div>
                        <div className="font-medium text-gray-800">Choose a Converter</div>
                        <div className="text-sm text-gray-500">Pick from {TOOLS.length} tools organized by category.</div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-heading font-bold bg-purple-50 text-purple-600">2</span>
                      <div>
                        <div className="font-medium text-gray-800">Upload Your File</div>
                        <div className="text-sm text-gray-500">Drag &amp; drop or click to browse. Max 50MB.</div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-heading font-bold bg-pink-50 text-pink-600">3</span>
                      <div>
                        <div className="font-medium text-gray-800">Download Your File</div>
                        <div className="text-sm text-gray-500">Get your converted file instantly.</div>
                      </div>
                    </li>
                  </ol>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">Technology</h2>
                <p className="text-gray-500 leading-relaxed">
                  FileForge is built with Next.js and React, deployed on Vercel for global edge performance.
                  Image and PDF processing uses the HTML Canvas API, PDF.js and pdf-lib for client-side conversion.
                  Video conversion runs locally with FFmpeg WebAssembly. Document and audio processing uses third-party APIs for reliable, high-quality output.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">Contact</h2>
                <p className="text-gray-500 leading-relaxed">
                  Have questions, feedback, or need support? Reach out to us at{' '}
                  <a href="mailto:support@fileforge.app" className="text-cyan-600 hover:underline">
                    support@fileforge.app
                  </a>.
                </p>
              </section>
            </div>
          </article>
        </main>

        <footer className="border-t border-gray-200/60 mt-8">
          <div className="px-4 sm:px-6 lg:px-10 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
              <div>
                <Link href="/" className="font-heading font-bold text-base text-gradient-super">FileForge</Link>
                <p className="text-xs text-gray-400 mt-1">Free Online File Converter</p>
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-400">
                <Link href="/about" className="hover:text-gray-700 transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy</Link>
                <Link href="/#faq" className="hover:text-gray-700 transition-colors">FAQ</Link>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} FileForge</p>
                <a
                  href="https://odarastudios.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs text-gray-300 hover:text-gray-600 transition-colors md:justify-end"
                  aria-label="Built by Odara Studios"
                >
                  <Image src="/odara-mark.png" alt="" width={18} height={18} className="h-4 w-4 object-contain" />
                  <span>Built by [=ØDARA=] STUDIOS</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

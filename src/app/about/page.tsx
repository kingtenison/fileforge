import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About FileForge',
  description:
    'Learn about FileForge — a free online file converter built for speed, privacy, and simplicity. Convert images, documents, video, and audio files without signup.',
  alternates: {
    canonical: 'https://fileforge-iota.vercel.app/about',
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
  description:
    'FileForge is a free online file converter for images, documents, video, and audio. Built for speed, privacy, and simplicity.',
  url: 'https://fileforge-iota.vercel.app/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'FileForge',
    url: 'https://fileforge-iota.vercel.app',
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
                  Our tool supports 21+ conversion types across four categories:
                </p>
                <ul className="list-disc list-inside text-gray-500 leading-relaxed mt-2 space-y-1">
                  <li><strong>Images:</strong> JPG, PNG, WebP, GIF — with compression and background removal</li>
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
                  FileForge is completely free to use. There are no premium tiers, no subscriptions, and no usage limits on image
                  converters (since they run in your browser). Document, video, and audio converters use API credits — you start
                  with 500 free credits that never expire.
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
                        <div className="text-sm text-gray-500">Pick from 21+ tools organized by category.</div>
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
                  Image processing uses the HTML Canvas API and WebAssembly for client-side conversion.
                  Document, video, and audio processing leverages third-party APIs for reliable, high-quality output.
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
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy — How FileForge Handles Your Files',
  description: 'FileForge processes images and PDFs locally in your browser. Other conversions are sent over HTTPS to third-party providers and are not stored by FileForge. Read our full privacy policy.',
  alternates: { canonical: '/privacy' },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'FileForge Privacy Policy',
  url: siteUrl('/privacy'),
  description: 'How FileForge handles files, data, cookies and advertising.',
  lastReviewed: '2026-11-24',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f3] grid-mesh-bg relative overflow-hidden">
      <JsonLd data={schema} />
      <header className="px-4 sm:px-6 lg:px-10 py-4 max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-xl text-gradient-super">FileForge</Link>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">&larr; All tools</Link>
      </header>
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-14 relative">
        <article className="prose prose-gray max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-xs text-gray-400 mb-10">Last updated: 24 November 2026</p>

          <section className="mb-9">
            <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">The short version</h2>
            <p className="text-gray-600 leading-relaxed">
              FileForge does not ask you to create an account and does not keep copies of your files. Image, PDF, text and video conversions run locally in your browser (video uses an FFmpeg engine downloaded on first use). Document and audio conversions are sent over HTTPS to a conversion provider and are not stored by FileForge after the response is returned.
            </p>
          </section>

          <section className="mb-9">
            <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">Files you convert</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Browser-based tools — including image conversion, image compression, image resize, background removal, image to PDF, PDF to image, merge PDF, split PDF, compress PDF and text to PDF — use browser APIs such as Canvas, PDF.js and pdf-lib. The file bytes stay on your device and are never transmitted to our server.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Word, Excel, PowerPoint, PDF-to-Word and audio conversions require a server-side conversion service. Your file is uploaded over HTTPS, processed, and returned to your browser. FileForge does not persist the file in its own database or storage. Video conversions run locally with FFmpeg WASM and are never uploaded.
            </p>
          </section>

          <section className="mb-9">
            <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">Analytics and advertising</h2>
            <p className="text-gray-600 leading-relaxed">
              We use Vercel Analytics for aggregate, privacy-friendly traffic statistics and third-party advertising scripts to keep the tools free. Those providers may set cookies or use browser storage according to their own policies. We do not sell your personal information.
            </p>
          </section>

          <section className="mb-9">
            <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">Children</h2>
            <p className="text-gray-600 leading-relaxed">FileForge is not directed at children under 13, and we do not knowingly collect personal information from them.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-gray-800 mb-3">Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Questions about this policy can be sent to{' '}
              <a href="mailto:support@fileforge.app" className="text-cyan-600 hover:underline">support@fileforge.app</a>.
            </p>
          </section>
        </article>
      </main>
      <footer className="border-t border-gray-200/60 mt-10 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} FileForge · <Link href="/" className="hover:text-gray-700">All tools</Link>
      </footer>
    </div>
  );
}

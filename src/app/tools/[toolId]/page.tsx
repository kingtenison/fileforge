import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getToolById, getToolSeo, getRelatedTools, isClientSide, TOOLS } from '@/lib/tools';
import { siteUrl } from '@/lib/site';
import JsonLd from '@/components/JsonLd';
import ToolPageClient from './ToolPageClient';

interface PageProps {
  params: Promise<{ toolId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { toolId } = await params;
  const tool = getToolById(toolId);
  if (!tool) return { title: 'Tool Not Found', robots: { index: false, follow: false } };

  const seo = getToolSeo(tool);
  const url = siteUrl(`/tools/${tool.id}`);
  const canonicalPath = `/tools/${tool.id}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      type: 'website',
      siteName: 'FileForge',
      images: [{ url: siteUrl('/og-image.png'), width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [siteUrl('/og-image.png')],
    },
  };
}

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ toolId: tool.id }));
}

export default async function ToolPage({ params }: PageProps) {
  const { toolId } = await params;
  const tool = getToolById(toolId);
  if (!tool) notFound();

  const seo = getToolSeo(tool);
  const url = siteUrl(`/tools/${tool.id}`);
  const local = isClientSide(tool) || tool.category === 'video';
  const related = getRelatedTools(tool, 8);
  const categoryLabel = tool.category.charAt(0).toUpperCase() + tool.category.slice(1);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${url}#app`,
        name: tool.name,
        url,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any (web browser)',
        description: seo.description,
        dateModified: '2026-11-24',
        browserRequirements: 'Requires JavaScript. Works in modern browsers.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: [tool.description, ...seo.benefits.map((b) => b.title)],
        producer: { '@type': 'Organization', name: 'FileForge', url: siteUrl() },
      },
      {
        '@type': 'HowTo',
        name: `How to ${tool.name}`,
        description: seo.intro,
        totalTime: 'PT1M',
        step: seo.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: seo.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl() },
          { '@type': 'ListItem', position: 2, name: `${categoryLabel} Converters`, item: siteUrl(`/#${tool.category}-tools`) },
          { '@type': 'ListItem', position: 3, name: tool.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] grid-mesh-bg relative overflow-hidden">
      <JsonLd data={schema} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1 top-[-5%] left-[-5%]" />
        <div className="ambient-orb ambient-orb-2 top-[40%] right-[-8%]" />
      </div>

      <header>
        <div className="px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="font-heading font-bold text-xl text-gradient-super tracking-tight">FileForge</Link>
          <nav className="flex items-center gap-5 text-sm" aria-label="Main navigation">
            <Link href="/#image-tools" className="text-gray-500 hover:text-gray-800 transition-colors">Tools</Link>
            <Link href="/about" className="text-gray-500 hover:text-gray-800 transition-colors">About</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
            <li aria-hidden="true">&rsaquo;</li>
            <li><Link href={`/#${tool.category}-tools`} className="hover:text-gray-700">{categoryLabel} Converters</Link></li>
            <li aria-hidden="true">&rsaquo;</li>
            <li className="text-gray-600 font-medium" aria-current="page">{tool.name}</li>
          </ol>
        </nav>

        <article>
          <header className="mb-8">
            <h1 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              {tool.name} — Convert {tool.inputFormats.map((f) => f.toUpperCase()).join('/')} to {tool.outputFormat.toUpperCase()} Free
            </h1>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{seo.intro}</p>
            <div className="flex flex-wrap gap-2 mt-4 text-xs" aria-label="Tool facts">
              <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600">{local ? 'Runs in your browser' : 'Secure API processing'}</span>
              <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600">50MB max per file</span>
              <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600">No watermark</span>
            </div>
          </header>

          <ToolPageClient tool={tool} />

          <section className="mt-14" aria-labelledby="how-to-heading">
            <h2 id="how-to-heading" className="font-heading font-semibold text-xl md:text-2xl text-gray-900 mb-5">
              How to {tool.name.toLowerCase()}
            </h2>
            <ol className="space-y-4">
              {seo.steps.map((step, i) => (
                <li key={step.name} className="flex gap-4 rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 font-heading font-bold text-sm flex items-center justify-center" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-gray-800 mb-1">{step.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14" aria-labelledby="benefits-heading">
            <h2 id="benefits-heading" className="font-heading font-semibold text-xl md:text-2xl text-gray-900 mb-5">
              Why use FileForge for {tool.name.toLowerCase()}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {seo.benefits.map((benefit) => (
                <div key={benefit.title} className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
                  <h3 className="font-heading font-semibold text-sm text-gray-800 mb-1.5">{benefit.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{benefit.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14" aria-labelledby="uses-heading">
            <h2 id="uses-heading" className="font-heading font-semibold text-xl md:text-2xl text-gray-900 mb-4">Common uses</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 leading-relaxed bg-white rounded-xl border border-gray-200 p-5">
              {seo.useCases.map((use) => <li key={use}>{use}</li>)}
            </ul>
          </section>

          <section className="mt-14" id="faq" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-heading font-semibold text-xl md:text-2xl text-gray-900 mb-5">
              Frequently asked questions about {tool.name.toLowerCase()}
            </h2>
            <div className="space-y-3">
              {seo.faqs.map((faq) => (
                <details key={faq.question} className="group rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
                  <summary className="font-heading font-semibold text-sm text-gray-800 cursor-pointer list-none flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-gray-400 group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                  </summary>
                  <p className="text-sm text-gray-500 leading-relaxed mt-3">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-14" aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-heading font-semibold text-xl md:text-2xl text-gray-900 mb-5">More converters</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {related.map((t) => (
                <Link key={t.id} href={`/tools/${t.id}`} className="rounded-xl bg-white border border-gray-200 p-4 hover:border-cyan-300 transition-colors shadow-sm">
                  <div className="font-medium text-sm text-gray-800">{t.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{t.inputFormats[0].toUpperCase()} → {t.outputFormat.toUpperCase()}</div>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <footer className="border-t border-gray-200/60 mt-12">
        <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="font-heading font-bold text-base text-gradient-super">FileForge</Link>
          <nav className="flex items-center gap-5 text-xs text-gray-500" aria-label="Footer navigation">
            <Link href="/" className="hover:text-gray-800">All tools</Link>
            <Link href="/about" className="hover:text-gray-800">About</Link>
            <Link href="/privacy" className="hover:text-gray-800">Privacy</Link>
          </nav>
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} FileForge</p>
            <a
              href="https://odarastudios.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-gray-600 transition-colors"
              aria-label="Built by Odara Studios"
            >
              <Image src="/odara-mark.png" alt="" width={18} height={18} className="h-4 w-4 object-contain" />
              <span>Built by [=ØDARA=] STUDIOS</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

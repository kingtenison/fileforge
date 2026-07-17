import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolById, TOOLS } from '@/lib/tools';
import ToolPageClient from './ToolPageClient';

interface PageProps {
  params: Promise<{ toolId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { toolId } = await params;
  const tool = getToolById(toolId);

  if (!tool) {
    return { title: 'Tool Not Found' };
  }

  const inputList = tool.inputFormats.map((f) => f.toUpperCase()).join(', ');
  const title = `${tool.name} — Convert ${inputList} to ${tool.outputFormat.toUpperCase()} Online`;
  const description = `${tool.description} Free, fast, and private — no signup required. Max file size 50MB. ${tool.category === 'image' ? 'Processed in your browser.' : 'Powered by secure APIs.'}`;

  return {
    title,
    description,
    keywords: [
      tool.name.toLowerCase(),
      `${tool.inputFormats[0]} to ${tool.outputFormat}`,
      `${tool.outputFormat} converter`,
      'free online converter',
      'file converter',
      tool.category + ' converter',
    ],
    openGraph: {
      title: `${tool.name} — FileForge`,
      description,
      url: `https://fileforge-iota.vercel.app/tools/${tool.id}`,
      type: 'website',
      siteName: 'FileForge',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} — FileForge`,
      description,
    },
    alternates: {
      canonical: `https://fileforge-iota.vercel.app/tools/${tool.id}`,
    },
  };
}

export function generateStaticParams() {
  return TOOLS.map((tool) => ({
    toolId: tool.id,
  }));
}

export default async function ToolPage({ params }: PageProps) {
  const { toolId } = await params;
  const tool = getToolById(toolId);

  if (!tool) {
    notFound();
  }

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: `https://fileforge-iota.vercel.app/tools/${tool.id}`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    description: tool.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://fileforge-iota.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.category.charAt(0).toUpperCase() + tool.category.slice(1) + ' Converters',
        item: `https://fileforge-iota.vercel.app/#${tool.category}-tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `https://fileforge-iota.vercel.app/tools/${tool.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ToolPageClient tool={tool} />
    </>
  );
}

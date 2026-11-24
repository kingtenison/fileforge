import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import CursorGlow from '@/components/CursorGlow';
import JsonLd from '@/components/JsonLd';
import { SITE_NAME, SITE_TAGLINE, SITE_URL, siteUrl } from '@/lib/site';
import { TOOLS } from '@/lib/tools';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Free Online File Converter for Images, PDF, Video & Audio`,
    template: '%s | FileForge',
  },
  description:
    `Free online file converter with ${TOOLS.length} tools for images, PDFs, documents, video and audio. Convert JPG to PDF, merge PDFs, compress images, extract MP3 from video and more. No signup, no watermarks.`,
  keywords: [
    'file converter', 'free file converter', 'online file converter',
    'image to PDF', 'JPG to PDF', 'PNG to JPG', 'JPG to WebP', 'WebP to JPG',
    'PDF to JPG', 'merge PDF', 'split PDF', 'compress PDF', 'PDF to Word',
    'Word to PDF', 'Excel to PDF', 'image compressor', 'image resize',
    'background remover', 'video to MP3', 'M4A to MP3', 'free online tools',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: `Convert images, PDFs, documents, video and audio online for free. ${TOOLS.length} tools, no signup required.`,
    images: [{ url: siteUrl('/og-image.png'), width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: `Convert images, PDFs, documents, video and audio online for free. ${TOOLS.length} tools, no signup required.`,
    images: [siteUrl('/og-image.png')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: '/' },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: siteUrl('/logo.png'),
  description: `${SITE_TAGLINE} — ${TOOLS.length} free conversion tools for images, PDFs, documents, video and audio.`,
  email: 'support@fileforge.app',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@fileforge.app',
    availableLanguage: ['English'],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}#organization` },
  inLanguage: 'en-US',
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (web browser)',
  url: SITE_URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: `${SITE_TAGLINE} with ${TOOLS.length} browser-based and API-powered conversion tools.`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://pl29108204.profitablecpmratenetwork.com/32/fc/de/32fcde0219dfe1139b9e8dc5f18dadb9.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://pl29108206.profitablecpmratenetwork.com/0e/e5/9f/0ee59fa065a40934a5cc3ba7d7d6d2ae.js"
          strategy="lazyOnload"
        />
        <meta name="google-site-verification" content="CxIVpjfT7x3AdeJ4Cp-Xn13Q5BI8dUnilbrD48ocbnU" />
      </head>
      <body>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={softwareSchema} />
        <CursorGlow />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

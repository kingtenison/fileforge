import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://fileforge-iota.vercel.app"),
  title: {
    default: "FileForge — Free Online File Converter | Images, Documents, Video & Audio",
    template: "%s | FileForge",
  },
  description:
    "Convert images, documents, video, and audio files online for free. 21+ converters including JPG to WebP, Word to PDF, MP4 to MP3. No signup required — images processed in your browser for total privacy.",
  keywords: [
    "file converter",
    "online converter",
    "free file converter",
    "JPG to WebP",
    "Word to PDF",
    "PNG to JPG",
    "MP4 to MP3",
    "image compressor",
    "background remover",
    "PDF to Word",
    "Excel to PDF",
    "free online tools",
  ],
  authors: [{ name: "FileForge" }],
  creator: "FileForge",
  publisher: "FileForge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fileforge-iota.vercel.app",
    siteName: "FileForge",
    title: "FileForge — Free Online File Converter",
    description:
      "Convert images, documents, video, and audio files online for free. 21+ converters with no signup required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FileForge — Free Online File Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FileForge — Free Online File Converter",
    description:
      "Convert images, documents, video, and audio files online for free. 21+ converters with no signup required.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://fileforge-iota.vercel.app",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FileForge",
  url: "https://fileforge-iota.vercel.app",
  logo: "https://fileforge-iota.vercel.app/logo.png",
  description:
    "Free online file converter for images, documents, video, and audio. 21+ tools with no signup required.",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FileForge",
  url: "https://fileforge-iota.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://fileforge-iota.vercel.app/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FileForge",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web Browser",
  url: "https://fileforge-iota.vercel.app",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online file converter for images, documents, video, and audio with 21+ conversion tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

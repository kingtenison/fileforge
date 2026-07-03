import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "FileForge - Free Online File Converter",
  description: "Convert files online for free.",
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
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <Script src="https://pl29108204.profitablecpmratenetwork.com/32/fc/de/32fcde0219dfe1139b9e8dc5f18dadb9.js" strategy="afterInteractive" />
        <Script src="https://pl29108206.profitablecpmratenetwork.com/0e/e5/9f/0ee59fa065a40934a5cc3ba7d7d6d2ae.js" strategy="afterInteractive" />
      </head>
      <body>
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}

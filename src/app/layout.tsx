import type { Metadata } from "next";
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
        <script src="https://pl29108204.profitablecpmratenetwork.com/32/fc/de/32fcde0219dfe1139b9e8dc5f18dadb9.js"></script>
        <script src="https://pl29108206.profitablecpmratenetwork.com/0e/e5/9f/0ee59fa065a40934a5cc3ba7d7d6d2ae.js"></script>
      </head>
      <body>
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}

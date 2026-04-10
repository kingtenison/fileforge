'use client';

import { TOOLS, getToolsByCategory } from '@/lib/tools';
import Link from 'next/link';

const imageGradients = [
  'card-vibrant-cyan',
  'card-vibrant-purple', 
  'card-vibrant-pink',
  'card-vibrant-orange',
  'card-vibrant-green',
  'card-vibrant-blue',
];

const imageGlows = [
  'glow-cyan',
  'glow-purple', 
  'glow-pink',
  'glow-cyan',
  'glow-cyan',
  'glow-cyan',
];

const documentGradients = [
  'card-vibrant-blue',
  'card-vibrant-purple',
  'card-vibrant-orange',
  'card-vibrant-green',
  'card-vibrant-pink',
  'card-vibrant-cyan',
];

const documentGlows = [
  'glow-cyan',
  'glow-purple',
  'glow-cyan',
  'glow-cyan',
  'glow-pink',
  'glow-cyan',
];

// Custom SVG Icons
const Icons = {
  ImageSection: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>
  ),
  DocumentSection: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  Upload: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Download: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Fast: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 21 21 10 12 10 13 2"/>
    </svg>
  ),
  Private: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  NoSignup: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Device: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12" y2="18"/>
    </svg>
  ),
  Free: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Formats: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
};

export default function Home() {
  const imageTools = getToolsByCategory('image');
  const documentTools = getToolsByCategory('document');
  const pdfTools = getToolsByCategory('pdf');
  const allDocumentTools = [...documentTools, ...pdfTools];

  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-mesh-bg relative overflow-hidden">
      {/* Floating blur particles */}
      <div className="particle-blur-1 top-[10%] left-[5%]"></div>
      <div className="particle-blur-2 top-[30%] right-[10%]"></div>
      <div className="particle-blur-3 bottom-[20%] left-[20%]"></div>
      <div className="particle-blur-4 bottom-[10%] right-[5%]"></div>

      {/* Header */}
      <header className="sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gradient-super">FileForge</Link>
          <nav className="flex items-center gap-4 md:gap-6 text-sm text-gray-400">
            <Link href="#image-tools" className="hover:text-white transition-colors">Images</Link>
            <Link href="#document-tools" className="hover:text-white transition-colors">Documents</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors hidden md:block">How It Works</Link>
            <Link href="#faq" className="hover:text-white transition-colors hidden md:block">FAQ</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16 animate-fadeIn">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-5">Convert files <span className="text-gradient-super">instantly</span></h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-lg mx-auto">Fast, free file conversion. Your files never leave your device for image converters. Secure document processing with leading APIs.</p>
          
          {/* Stats - Desktop only */}
          <div className="hidden md:flex items-center justify-center gap-8 mt-10">
            {[
              { num: '12', label: 'Converters', color: 'text-cyan-400', icon: <Icons.Formats /> },
              { num: '10MB', label: 'Max File Size', color: 'text-purple-400', icon: <Icons.Device /> },
              { num: '100%', label: 'Free Forever', color: 'text-pink-400', icon: <Icons.Free /> },
              { num: '500', label: 'API Credits', color: 'text-green-400', icon: <Icons.Fast /> },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 text-center">
                <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.num}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ad Banner */}
        <div className="mb-12 md:mb-16">
          <div className="min-h-[50px] flex items-center justify-center">
            <iframe 
              src="https://www.profitablecpmratenetwork.com/jpu5xippg?key=6338972fc5b07b3a0c19b8ac58a4142e" 
              width="728" 
              height="90" 
              frameBorder="0"
              scrolling="no"
              title="Advertisement"
            />
          </div>
          <script src="https://pl29108204.profitablecpmratenetwork.com/32/fc/de/32fcde0219dfe1139b9e8dc5f18dadb9.js"></script>
        </div>

        {/* Image Converters Section */}
        <div id="image-tools" className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <Icons.ImageSection />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-medium text-gray-400">Image Converters</h2>
              <p className="text-xs text-gray-500">Convert & compress images directly in your browser</p>
            </div>
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full ml-auto">Client-side</span>
          </div>
          
          {/* Mobile: 2x2 grid */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {imageTools.map((tool, index) => (
              <Link 
                key={tool.id} 
                href={`/tools/${tool.id}`}
                className={`${imageGradients[index % imageGradients.length]} ${imageGlows[index % imageGlows.length]} p-4 rounded-2xl hover-lift`}
              >
                <div className="font-semibold text-sm mb-2">{tool.name}</div>
                <div className="text-xs text-gray-300">
                  {tool.inputFormats[0].toUpperCase()} → {tool.outputFormat.toUpperCase()}
                </div>
              </Link>
            ))}
          </div>
          
          {/* Desktop: 3x2 grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
            {imageTools.map((tool, index) => (
              <Link 
                key={tool.id} 
                href={`/tools/${tool.id}`}
                className={`${imageGradients[index % imageGradients.length]} ${imageGlows[index % imageGlows.length]} group p-5 rounded-2xl hover-lift animate-fadeIn`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg mb-1">{tool.name}</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">
                      {tool.inputFormats[0].toUpperCase()} → {tool.outputFormat.toUpperCase()}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                    →
                  </div>
                </div>
                <p className="text-sm text-gray-300 hidden lg:block">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Document Converters Section */}
        <div id="document-tools" className="mb-12 md:mb-20">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Icons.DocumentSection />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-medium text-gray-400">Document Converters</h2>
              <p className="text-xs text-gray-500">Convert Word, Excel, PowerPoint, PDF & more</p>
            </div>
            <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full ml-auto">API Powered</span>
          </div>
          
          {/* Mobile: 2x2 grid */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {allDocumentTools.map((tool, index) => (
              <Link 
                key={tool.id} 
                href={`/tools/${tool.id}`}
                className={`${documentGradients[index % documentGradients.length]} ${documentGlows[index % documentGlows.length]} p-4 rounded-2xl hover-lift`}
              >
                <div className="font-semibold text-sm mb-2">{tool.name}</div>
                <div className="text-xs text-gray-300">
                  {tool.inputFormats[0].toUpperCase()} → {tool.outputFormat.toUpperCase()}
                </div>
              </Link>
            ))}
          </div>
          
          {/* Desktop: 3x2 grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
            {allDocumentTools.map((tool, index) => (
              <Link 
                key={tool.id} 
                href={`/tools/${tool.id}`}
                className={`${documentGradients[index % documentGradients.length]} ${documentGlows[index % documentGlows.length]} group p-5 rounded-2xl hover-lift animate-fadeIn`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg mb-1">{tool.name}</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">
                      {tool.inputFormats[0].toUpperCase()} → {tool.outputFormat.toUpperCase()}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                    →
                  </div>
                </div>
                <p className="text-sm text-gray-300 hidden lg:block">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works - Segmented Text Block */}
        <div id="how-it-works" className="hidden md:block mb-20 -mx-4 md:-mx-6 px-4 md:px-6 py-16 bg-white/5">
          <h2 className="text-xl font-medium text-gray-400 mb-8 text-center">How It Works</h2>
          <div className="max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-medium text-white mb-1">Choose Your Converter</div>
                    <div className="text-sm text-gray-400">Select from 12+ available converters for images or documents. Browse by category or search for the format you need.</div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-medium text-white mb-1">Upload Your File</div>
                    <div className="text-sm text-gray-400">Drag and drop your file or click to browse. Maximum file size is 10MB. For images, processing happens instantly in your browser.</div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-medium text-white mb-1">Automatic Conversion</div>
                    <div className="text-sm text-gray-400">Image conversions complete in milliseconds. Document conversions are processed through secure APIs and typically take a few seconds.</div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <div className="font-medium text-white mb-1">Download Converted File</div>
                    <div className="text-sm text-gray-400">Your converted file is ready instantly. Click download to save it to your device. No registration or waiting required.</div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Why Use FileForge - Segmented Paragraph */}
        <div id="features" className="hidden md:block mb-20 -mx-4 md:-mx-6 px-4 md:px-6 py-16 bg-white/5">
          <h2 className="text-xl font-medium text-gray-400 mb-8 text-center">Why Use FileForge?</h2>
          <div className="max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-gray-300 leading-relaxed space-y-4">
                <span><span className="text-cyan-400 font-medium">Lightning Fast Performance:</span> Image conversions happen instantly in your browser with zero server delay. Document conversions use fast, reliable APIs that process files in seconds.</span>
                <span><span className="text-purple-400 font-medium">100% Private & Secure:</span> Your image files never leave your device - all processing happens locally in your browser. Document conversions use enterprise-grade secure APIs that automatically delete files after processing.</span>
                <span><span className="text-pink-400 font-medium">No Registration Required:</span> Use all converters instantly without creating an account. No email, no password, no signup process. Just open and convert.</span>
                <span><span className="text-orange-400 font-medium">Works On Every Device:</span> Access FileForge from desktop, tablet, or mobile. Responsive design ensures a perfect experience on any screen size.</span>
                <span><span className="text-green-400 font-medium">Completely Free Forever:</span> No hidden fees, no subscriptions, no premium tiers. Image converters are unlimited. Document converters include 500 free API credits that never expire.</span>
                <span><span className="text-blue-400 font-medium">12+ Format Support:</span> Convert between JPG, PNG, WebP, GIF, PDF, DOCX, XLSX, PPTX, TXT, and more. All major formats supported with high-quality output.</span>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ - Desktop */}
        <div id="faq" className="hidden md:block mb-12 -mx-4 md:-mx-6 px-4 md:px-6 py-16 bg-white/5">
          <h2 className="text-xl font-medium text-gray-400 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-5xl mx-auto space-y-4">
            {[
              { q: 'Is FileForge really free?', a: 'Yes! FileForge is completely free to use. No registration, no subscription, no hidden fees. Ever.' },
              { q: 'Are my files secure?', a: 'Absolutely. Image conversions happen entirely in your browser - your files never leave your device. Document conversions use secure, enterprise-grade APIs that automatically delete files after processing.' },
              { q: 'What is the file size limit?', a: 'The maximum file size is 10MB per conversion. This ensures fast processing for everyone.' },
              { q: 'What image formats are supported?', a: 'We support JPG, PNG, WebP, and GIF for image conversions. This includes converting between any of these formats plus compression.' },
              { q: 'What document formats are supported?', a: 'We support Word (DOC, DOCX), Excel (XLS, XLSX), PowerPoint (PPT, PPTX), PDF, and plain text (TXT).' },
              { q: 'Do I need to create an account?', a: 'No! You can use all converters instantly without any registration. Just upload your file and convert.' },
              { q: 'How do document converters work?', a: 'Document converters use the Convert.FAST API - a fast, secure conversion service. Files are processed on their servers and automatically deleted after conversion.' },
              { q: 'How many conversions can I do?', a: 'Image converters are unlimited (client-side). Document converters have 500 free API credits that never expire - enough for thousands of conversions per month.' },
            ].map((faq, i) => (
              <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10 hover-lift">
                <div className="font-medium mb-2">{faq.q}</div>
                <div className="text-sm text-gray-400">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile FAQ */}
        <div id="faq" className="md:hidden mb-12">
          <h2 className="text-lg font-medium text-gray-400 mb-6">Frequently Asked</h2>
          <div className="space-y-3">
            {[
              { q: 'Is it really free?', a: 'Yes! No registration needed.' },
              { q: 'File size limit?', a: 'Maximum 10MB per file.' },
              { q: 'Are files secure?', a: 'Yes - images stay on your device, documents use secure APIs.' },
              { q: 'How many conversions?', a: 'Unlimited for images, 500/mo API credits for docs.' },
            ].map((faq, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="font-medium text-sm mb-1">{faq.q}</div>
                <div className="text-xs text-gray-400">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 text-center text-sm text-gray-500">
          <p className="mb-2">© {new Date().getFullYear()} FileForge - Free Online File Converter</p>
          <p className="text-xs">All rights reserved. Built by Built by =[ØVĒRKĪLL]= TECHNOLOGIES</p>
        </div>
      </footer>
    </div>
  );
}
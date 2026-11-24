'use client';

import { useState, useEffect } from 'react';
import { getPopularTools, getToolsByCategory, TOOLS } from '@/lib/tools';
import { ToolIcons } from '@/lib/tool-icons';
import { getToolStyle } from '@/lib/tool-colors';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import AdBanner from '@/components/AdBanner';

/* ─── Shared UI Icons ─── */
const UI = {
  Bolt: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  ),
  Lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  Image: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
  ),
  Document: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
  ),
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
  ),
  Download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
  ),
  Sparkle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
  ),
  ChevronRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
  ),
  Speed: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M6 12a6 6 0 0 1 6-6" /><circle cx="12" cy="12" r="10" /></svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
  Globe: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
  ),
  Heart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
  ),
  Layers: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
  ),
  Video: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
  ),
  Audio: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
  ),
};

const cardDelay = (i: number) => Math.min(i * 0.02, 0.5);

/* ─── Tool Card ─── */
function ToolCard({ tool, index }: { tool: (typeof TOOLS)[number]; index: number }) {
  const c = getToolStyle(tool.id);
  const IconComponent = ToolIcons[tool.icon];
  return (
    <Link href={`/tools/${tool.id}`}
      className={`glass-card glass-card-glow ${c.cardClass} group rounded-2xl p-4 md:p-6 animate-fadeInUp`}
      style={{ animationDelay: `${cardDelay(index)}s`, opacity: 0, animationFillMode: 'forwards' }}
      aria-label={`${tool.name} — Convert ${tool.inputFormats[0].toUpperCase()} to ${tool.outputFormat.toUpperCase()}`}
    >
      <div className="flex items-start justify-between mb-3 md:mb-5">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{ background: `linear-gradient(135deg, ${c.primary}20, ${c.primary}08)`, color: c.primary }}>
          {IconComponent ? <IconComponent /> : <span className="text-lg" aria-hidden="true">{tool.icon}</span>}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-heading font-semibold tracking-wider">
          <span className="text-gray-400">{tool.inputFormats[0].toUpperCase()}</span>
          <span className="text-gray-300" aria-hidden="true">&rarr;</span>
          <span style={{ color: c.primary }}>{tool.outputFormat.toUpperCase()}</span>
        </div>
      </div>
      <h3 className="font-heading font-semibold text-xs md:text-base mb-1.5 text-gray-800 group-hover:text-gray-900 transition-colors">{tool.name}</h3>
      <p className="hidden lg:block text-xs md:text-sm text-gray-400 group-hover:text-gray-500 transition-colors leading-relaxed">{tool.description}</p>
      <div className="absolute bottom-4 right-4 w-7 h-7 rounded-lg items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 hidden md:flex"
        style={{ background: `linear-gradient(135deg, ${c.primary}20, ${c.primary}08)`, color: c.primary }}
        aria-hidden="true">
        <UI.ChevronRight />
      </div>
    </Link>
  );
}

/* ─── Sparks ─── */
const sparkColors = ['rgba(6,182,212,0.5)', 'rgba(139,92,246,0.5)', 'rgba(236,72,153,0.5)', 'rgba(249,115,22,0.5)'];

function generateParticles() {
  return Array.from({ length: 15 }, (_, i) => ({
    left: `${5 + Math.random() * 90}%`, top: `${55 + Math.random() * 40}%`,
    background: sparkColors[i % sparkColors.length],
    animationDelay: `${i * 0.6}s`, animationDuration: `${6 + Math.random() * 8}s`,
    width: `${2 + Math.random() * 2.5}px`, height: `${2 + Math.random() * 2.5}px`,
  }));
}

function Sparks() {
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles> | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(generateParticles());
  }, []);
  if (!particles) return null;
  return <div className="spark-container" aria-hidden="true">{particles.map((p, i) => <div key={i} className="spark" style={p} />)}</div>;
}

/* ─── Stat Pill ─── */
function StatPill({ value, label, color, icon }: { value: string; label: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="stat-card flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"><span className={color}>{icon}</span></div>
      <div>
        <div className={`font-heading font-bold text-xl ${color}`}>{value}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
}

/* ─── Step ─── */
function Step({ number, title, description, isLast }: { number: number; title: string; description: string; isLast: boolean }) {
  const stepColors = ['#0e9aa7', '#7c3aed', '#db2777', '#059669'];
  const color = stepColors[number - 1];
  return (
    <div className="relative flex gap-5 pb-8 group">
      {!isLast && <div className="step-connector" aria-hidden="true" />}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-heading font-bold transition-transform duration-300 group-hover:scale-110 timeline-glow"
          style={{ background: `linear-gradient(135deg, ${color}12, ${color}06)`, color, border: `1px solid ${color}15`, '--glow-color': `${color}20` } as React.CSSProperties}>
          {number}
        </div>
      </div>
      <div className="pt-1.5">
        <div className="font-heading font-semibold text-sm text-gray-800 mb-0.5">{title}</div>
        <div className="text-xs md:text-sm text-gray-500 leading-relaxed">{description}</div>
      </div>
    </div>
  );
}

/* ─── FAQ Data ─── */
const faqData = [
  { question: 'Is FileForge really free?', answer: 'Yes. Every converter is free, with no signup, subscription, or hidden fees. Image and PDF tools run in your browser, so there is no per-use cost.' },
  { question: 'Are my files secure?', answer: 'Images, PDFs, text and video conversions run entirely in your browser — your files never leave your device. Word, Excel, PowerPoint and audio conversions are sent over HTTPS to our conversion provider and are not stored by FileForge.' },
  { question: 'What is the file size limit?', answer: 'The maximum size is 50MB per file. For browser-based tools, very large files may take a little longer to process.' },
  { question: 'What formats are supported?', answer: `FileForge supports ${TOOLS.length} conversions across images (JPG, PNG, WebP, GIF), PDFs (image to PDF, PDF to image, merge, split, compress), documents (Word, Excel, PowerPoint, PDF, TXT), video (MP4, WebM, AVI, MOV, MKV) and audio (MP3, WAV, M4A, AAC, OGG).` },
  { question: 'Do I need to create an account?', answer: 'No. You can use all converters instantly without registration. Just choose a tool, add your file, convert, and download.' },
  { question: 'Can I convert multiple files at once?', answer: 'Yes for Image to PDF, Merge PDF and other multi-file tools — add as many files as you need and they are processed together.' },
  { question: 'Do converted files have watermarks?', answer: 'Never. Every download is clean and ready for personal or commercial use.' },
];

const CATEGORY_SECTIONS: {
  id: string; title: string; subtitle: string; badge: string; badgeClass: string; color: string; icon: React.ReactNode;
  category: (typeof TOOLS)[number]['category'];
}[] = [
  { id: 'image-tools', title: 'Image Converters', subtitle: 'Convert, compress & resize directly in your browser', badge: 'Client-side', badgeClass: 'badge-green', color: '#0e9aa7', icon: <UI.Image />, category: 'image' },
  { id: 'pdf-tools', title: 'PDF Converters', subtitle: 'Image to PDF, merge, split, compress & extract pages', badge: 'Client-side', badgeClass: 'badge-green', color: '#dc2626', icon: <UI.Document />, category: 'pdf' },
  { id: 'document-tools', title: 'Document Converters', subtitle: 'Word, Excel, PowerPoint, PDF & plain text', badge: 'API Powered', badgeClass: 'badge-cyan', color: '#7c3aed', icon: <UI.Document />, category: 'document' },
  { id: 'video-tools', title: 'Video Converters', subtitle: 'MP4, WebM, AVI, MOV, MKV — converted in your browser', badge: 'In your browser', badgeClass: 'badge-green', color: '#0e9aa7', icon: <UI.Video />, category: 'video' },
  { id: 'audio-tools', title: 'Audio Converters', subtitle: 'MP3, WAV, M4A, AAC, OGG & video-to-MP3', badge: 'API Powered', badgeClass: 'badge-cyan', color: '#db2777', icon: <UI.Audio />, category: 'audio' },
];

/* ─── Main Page ─── */
export default function Home() {
  const popular = getPopularTools(10);
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to convert files with FileForge`,
    description: `Convert any file in three simple steps using FileForge's ${TOOLS.length} free online converters.`,
    step: [
      { '@type': 'HowToStep', name: 'Choose a converter', text: `Pick from ${TOOLS.length} tools organized by category — images, PDF, documents, video and audio.` },
      { '@type': 'HowToStep', name: 'Add your file', text: 'Drag and drop your file or click to browse. Max 50MB. Image and PDF files stay on your device.' },
      { '@type': 'HowToStep', name: 'Convert and download', text: 'Conversion completes in seconds. Download the result immediately — no account, no watermark.' },
    ],
  };

  return (
    <div className="min-h-screen bg-forge grid-mesh-bg noise-overlay relative overflow-hidden">
      <JsonLd data={faqPageSchema} />
      <JsonLd data={howToSchema} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1 top-[-5%] left-[-5%]" />
        <div className="ambient-orb ambient-orb-2 top-[40%] right-[-8%]" />
        <div className="ambient-orb ambient-orb-3 bottom-[-5%] left-[20%]" />
      </div>
      <Sparks />

      <header className="sticky top-0 z-50 bg-forge/80 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="font-heading font-bold text-xl text-gradient-super tracking-tight">FileForge</Link>
          <nav className="flex items-center gap-4 md:gap-7 text-xs md:text-sm" aria-label="Main navigation">
            <Link href="#image-tools" className="text-gray-500 hover:text-gray-800 transition-colors font-medium">Images</Link>
            <Link href="#pdf-tools" className="text-gray-500 hover:text-gray-800 transition-colors font-medium">PDF</Link>
            <Link href="#document-tools" className="text-gray-500 hover:text-gray-800 transition-colors font-medium hidden sm:block">Documents</Link>
            <Link href="#video-tools" className="text-gray-500 hover:text-gray-800 transition-colors font-medium hidden md:block">Video</Link>
            <Link href="#audio-tools" className="text-gray-500 hover:text-gray-800 transition-colors font-medium hidden md:block">Audio</Link>
            <Link href="#faq" className="text-gray-500 hover:text-gray-800 transition-colors font-medium hidden lg:block">FAQ</Link>
          </nav>
        </div>
      </header>

      {/* ═══ Hero ═══ */}
      <section className="pt-12 md:pt-24 pb-8 md:pb-10 text-center relative px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200/60 text-xs font-heading font-semibold text-gray-500 tracking-wider uppercase mb-6 shadow-sm animate-fadeInUp" style={{ opacity: 0, animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <UI.Sparkle /> Free &bull; No Signup &bull; Private
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl leading-tight mb-5 text-gray-900 animate-fadeInUp" style={{ opacity: 0, animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Free Online <span className="text-gradient-super">File Converter</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10 animate-fadeInUp" style={{ opacity: 0, animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Convert images, PDFs, documents, video and audio in seconds. {TOOLS.length} free tools — JPG to PDF, image compress, PDF merge, MP4 to MP3 and more. No signup, no watermarks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ opacity: 0, animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <Link href="#image-tools" className="btn-glow px-8 py-3.5 rounded-xl text-base inline-flex items-center gap-2">
              <UI.Download /> Start Converting
            </Link>
            <Link href="#how-it-works" className="px-8 py-3.5 rounded-xl text-base inline-flex items-center gap-2 border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all bg-white shadow-sm">
              How It Works
            </Link>
          </div>
          <div className="flex items-center justify-center gap-4 mt-12 md:mt-14 flex-wrap" aria-label="FileForge at a glance">
            <StatPill value={String(TOOLS.length)} label="Converters" color="text-cyan-600" icon={<UI.Grid />} />
            <StatPill value="50MB" label="Max File Size" color="text-purple-600" icon={<UI.Bolt />} />
            <StatPill value="100%" label="Free Forever" color="text-pink-600" icon={<UI.Lock />} />
            <StatPill value="0" label="Signups Needed" color="text-emerald-600" icon={<UI.User />} />
          </div>
        </div>
      </section>

      <AdBanner />

      {/* ═══ Tool categories ═══ */}
      {CATEGORY_SECTIONS.map((section, sectionIndex) => {
        const tools = getToolsByCategory(section.category);
        let runningIndex = 0;
        return (
          <section key={section.id} id={section.id} className="mb-12 md:mb-20 px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-4 md:mb-6 max-w-7xl mx-auto">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-gray-100" style={{ color: section.color }}>
                {section.icon}
              </div>
              <div className="min-w-0">
                <h2 className="font-heading font-semibold text-base md:text-lg text-gray-800">{section.title}</h2>
                <p className="text-xs md:text-sm text-gray-500 truncate">{section.subtitle}</p>
              </div>
              <span className={`badge ${section.badgeClass} ml-auto flex-shrink-0`}>{section.badge}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 max-w-7xl mx-auto">
              {tools.map((tool) => {
                const index = runningIndex++;
                return <ToolCard key={tool.id} tool={tool} index={index + sectionIndex * 4} />;
              })}
            </div>
          </section>
        );
      })}

      {/* ═══ Popular conversions — internal linking + long-tail keywords ═══ */}
      <section className="mb-16 md:mb-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-5xl mx-auto rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
          <h2 className="font-heading font-semibold text-lg md:text-xl text-gray-900 mb-2">Most popular conversions</h2>
          <p className="text-sm text-gray-500 mb-6">Fast, free, and private — pick the tool you need.</p>
          <div className="flex flex-wrap gap-2">
            {popular.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`}
                className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-300 text-xs md:text-sm text-gray-700 hover:text-cyan-700 transition-colors font-medium">
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section id="how-it-works" className="mb-16 md:mb-24 section-highlight px-4 sm:px-6 lg:px-10 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold tracking-wider uppercase mb-4" style={{ background: 'rgba(6,182,212,0.08)', color: '#0e9aa7' }}>How It Works</span>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-gray-900 mb-3">From upload to download in seconds</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">No complicated setup. No accounts. Just three simple steps to convert any file.</p>
          </div>
          <div className="section-card p-6 md:p-10">
            <div className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-200 via-purple-200 to-pink-200 rounded-full" aria-hidden="true" />
              <Step number={1} title="Choose your converter" description={`Browse ${TOOLS.length} converters organized by category — images, PDF, documents, video and audio.`} isLast={false} />
              <Step number={2} title="Add your file" description="Drag and drop or click to browse. Max 50MB. Images and PDFs stay on your device — zero uploads." isLast={false} />
              <Step number={3} title="Download instantly" description="Your converted file is ready immediately. No registration, no waiting, no hidden fees." isLast={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Why FileForge ═══ */}
      <section id="features" className="mb-16 md:mb-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold tracking-wider uppercase mb-4" style={{ background: 'rgba(139,92,246,0.08)', color: '#7c3aed' }}>Why FileForge</span>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-gray-900 mb-3">Built different. Built better.</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">Every feature designed for speed, privacy, and absolute simplicity.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[
              { icon: <UI.Speed />, title: 'Lightning Fast', desc: 'Image and PDF conversions happen instantly in your browser — zero server delay.', color: '#0e9aa7' },
              { icon: <UI.Shield />, title: 'Private by Default', desc: 'Your images and PDFs never leave your device. Other files use secure API processing.', color: '#7c3aed' },
              { icon: <UI.User />, title: 'No Registration', desc: 'No account, email, or password. Just open and convert.', color: '#db2777' },
              { icon: <UI.Globe />, title: 'Works Everywhere', desc: 'Desktop, tablet, or mobile — a responsive design that fits any screen.', color: '#d97706' },
              { icon: <UI.Heart />, title: 'Free Forever', desc: 'No subscriptions or premium tiers. Unlimited browser-based conversions.', color: '#059669' },
              { icon: <UI.Layers />, title: `${TOOLS.length} Tools`, desc: 'Images, PDFs, documents, video and audio — every format you need in one place.', color: '#2563eb' },
            ].map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 md:p-7 animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center mb-4 feature-icon-ring" style={{ background: `${f.color}08`, color: f.color, border: `1px solid ${f.color}15` }}>
                  {f.icon}
                </div>
                <h3 className="font-heading font-semibold text-sm text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="mb-20 md:mb-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold tracking-wider uppercase mb-4" style={{ background: 'rgba(244,63,94,0.08)', color: '#e11d48' }}>FAQ</span>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">Everything you need to know about FileForge.</p>
          </div>
          <div className="space-y-3">
            {faqData.map((faq) => (
              <details key={faq.question} className="group rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
                <summary className="font-heading font-semibold text-xs md:text-sm text-gray-800 cursor-pointer list-none flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg" aria-hidden="true">+</span>
                </summary>
                <p className="text-sm text-gray-500 leading-relaxed mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200/60 mt-8">
        <div className="px-4 sm:px-6 lg:px-10 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 max-w-6xl mx-auto">
            <div>
              <Link href="/" className="font-heading font-bold text-base text-gradient-super">FileForge</Link>
              <p className="text-xs text-gray-400 mt-1">Free Online File Converter</p>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-gray-500" aria-label="Footer navigation">
              <Link href="/about" className="hover:text-gray-800">About</Link>
              <Link href="/privacy" className="hover:text-gray-800">Privacy</Link>
              <Link href="#faq" className="hover:text-gray-800">FAQ</Link>
            </nav>
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} FileForge</p>
              <p className="text-xs text-gray-300 mt-0.5">Built by =[&Ouml;V&Eacute;RK&Iacute;LL]= TECHNOLOGIES</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

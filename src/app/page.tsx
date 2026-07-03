'use client';

import { useState, useEffect } from 'react';
import { getToolsByCategory } from '@/lib/tools';
import { ToolIcons } from '@/lib/tool-icons';
import Link from 'next/link';

/* ─── Shared UI Icons ─── */
const UI = {
  Bolt: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Image: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  Document: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Arrow: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Speed: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M6 12a6 6 0 0 1 6-6" /><circle cx="12" cy="12" r="10" />
    </svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Zap: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Globe: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Heart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Layers: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Video: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
  Audio: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  ),
};

/* ─── Tool colors ─── */
interface ToolColor { glow: string; accent: string; cardClass: string; }
const toolColors: Record<string, ToolColor> = {
  'image-compress':   { glow: 'rgba(34,211,238,0.25)',  accent: '#0e9aa7',  cardClass: 'card-cyan' },
  'jpg-to-webp':      { glow: 'rgba(249,115,22,0.25)',  accent: '#d97706',  cardClass: 'card-orange' },
  'webp-to-jpg':      { glow: 'rgba(244,114,182,0.25)',  accent: '#db2777',  cardClass: 'card-pink' },
  'png-to-jpg':       { glow: 'rgba(167,139,250,0.25)',  accent: '#7c3aed',  cardClass: 'card-violet' },
  'jpg-to-png':       { glow: 'rgba(52,211,153,0.25)',   accent: '#059669',  cardClass: 'card-green' },
  'png-to-webp':      { glow: 'rgba(96,165,250,0.25)',   accent: '#2563eb',  cardClass: 'card-blue' },
  'background-eraser':{ glow: 'rgba(217,70,239,0.25)',   accent: '#c026d3',  cardClass: 'card-fuchsia' },
  'word-to-pdf':      { glow: 'rgba(129,140,248,0.25)',  accent: '#6366f1',  cardClass: 'card-indigo' },
  'pdf-to-word':      { glow: 'rgba(245,158,11,0.25)',   accent: '#d97706',  cardClass: 'card-amber' },
  'excel-to-pdf':     { glow: 'rgba(16,185,129,0.25)',   accent: '#059669',  cardClass: 'card-emerald' },
  'ppt-to-pdf':       { glow: 'rgba(244,63,94,0.25)',    accent: '#e11d48',  cardClass: 'card-rose' },
  'txt-to-pdf':       { glow: 'rgba(20,184,166,0.25)',   accent: '#0d9488',  cardClass: 'card-teal' },
  // Video converters
  'mp4-to-webm':      { glow: 'rgba(34,211,238,0.25)',  accent: '#0e9aa7',  cardClass: 'card-cyan' },
  'avi-to-mp4':       { glow: 'rgba(249,115,22,0.25)',  accent: '#d97706',  cardClass: 'card-orange' },
  'mov-to-mp4':       { glow: 'rgba(244,114,182,0.25)', accent: '#db2777',  cardClass: 'card-pink' },
  'mkv-to-webm':      { glow: 'rgba(167,139,250,0.25)', accent: '#7c3aed',  cardClass: 'card-violet' },
  // Audio converters
  'mp3-to-wav':       { glow: 'rgba(52,211,153,0.25)',  accent: '#059669',  cardClass: 'card-green' },
  'wav-to-mp3':       { glow: 'rgba(96,165,250,0.25)',  accent: '#2563eb',  cardClass: 'card-blue' },
  'mp3-to-aac':       { glow: 'rgba(217,70,239,0.25)',  accent: '#c026d3',  cardClass: 'card-fuchsia' },
  'mp3-to-ogg':       { glow: 'rgba(245,158,11,0.25)',  accent: '#d97706',  cardClass: 'card-amber' },
  'mp4-to-mp3':       { glow: 'rgba(244,63,94,0.25)',   accent: '#e11d48',  cardClass: 'card-rose' },
};

const cardDelay = (i: number) => i * 0.06;

/* ─── Tool Card ─── */
function ToolCard({ tool, index }: { tool: { id: string; name: string; icon: string; inputFormats: string[]; outputFormat: string; description: string }; index: number }) {
  const c = toolColors[tool.id] || toolColors['image-compress'];
  const IconComponent = ToolIcons[tool.icon];
  return (
    <Link href={`/tools/${tool.id}`}
      className={`glass-card glass-card-glow ${c.cardClass} group rounded-2xl p-5 md:p-6 animate-fadeInUp`}
      style={{ animationDelay: `${cardDelay(index)}s`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4 md:mb-5">
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{ background: `linear-gradient(135deg, ${c.accent}12, ${c.accent}06)`, color: c.accent }}>
          {IconComponent ? <IconComponent /> : <span className="text-lg">{tool.icon}</span>}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-heading font-semibold tracking-wider">
          <span className="text-gray-400">{tool.inputFormats[0].toUpperCase()}</span>
          <span className="text-gray-300">→</span>
          <span style={{ color: c.accent }}>{tool.outputFormat.toUpperCase()}</span>
        </div>
      </div>
      <h3 className="font-heading font-semibold text-sm md:text-base mb-1.5 text-gray-800 group-hover:text-gray-900 transition-colors">{tool.name}</h3>
      <p className="hidden sm:block text-xs md:text-sm text-gray-400 group-hover:text-gray-500 transition-colors leading-relaxed">{tool.description}</p>
      <div className="absolute bottom-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
        style={{ background: `linear-gradient(135deg, ${c.accent}20, ${c.accent}08)`, color: c.accent }}>
        <UI.ChevronRight />
      </div>
    </Link>
  );
}

/* ─── Sparks ─── */
function Sparks() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  const sparkColors = ['rgba(6,182,212,0.5)', 'rgba(139,92,246,0.5)', 'rgba(236,72,153,0.5)', 'rgba(249,115,22,0.5)'];
  const particles = Array.from({ length: 15 }, (_, i) => ({
    left: `${5 + Math.random() * 90}%`, top: `${55 + Math.random() * 40}%`,
    background: sparkColors[i % sparkColors.length],
    animationDelay: `${i * 0.6}s`, animationDuration: `${6 + Math.random() * 8}s`,
    width: `${2 + Math.random() * 2.5}px`, height: `${2 + Math.random() * 2.5}px`,
  }));
  return (<div className="spark-container">{particles.map((p, i) => (<div key={i} className="spark" style={p} />))}</div>);
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

/* ─── FAQ Item (with accordion toggle) ─── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="faq-item rounded-xl p-5 border bg-white transition-all duration-300"
      style={{ borderColor: open ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.05)' }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="font-heading font-semibold text-sm text-gray-800">{question}</div>
        <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${open ? 'rotate-45' : ''}`}
          style={{ background: 'rgba(0,0,0,0.04)', color: open ? '#e11d48' : '#9ca3af' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </div>
      </div>
      <div className={`faq-answer ${open ? 'open' : ''}`}>
        <p className="text-sm text-gray-500 leading-relaxed pt-3">{answer}</p>
      </div>
    </div>
  );
}

/* ─── Step (How It Works) ─── */
function Step({ number, title, description, isLast }: { number: number; title: string; description: string; isLast: boolean }) {
  const stepColors = ['#0e9aa7', '#7c3aed', '#db2777', '#059669'];
  const color = stepColors[number - 1];
  return (
    <div className="relative flex gap-5 pb-8 group">
      {!isLast && <div className="step-connector" />}
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

/* ─── Main Page ─── */
export default function Home() {
  const imageTools = getToolsByCategory('image');
  const documentTools = getToolsByCategory('document');
  const videoTools = getToolsByCategory('video');
  const audioTools = getToolsByCategory('audio');

  return (
    <div className="min-h-screen bg-forge grid-mesh-bg noise-overlay relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="ambient-orb ambient-orb-1 top-[-5%] left-[-5%]" />
        <div className="ambient-orb ambient-orb-2 top-[40%] right-[-8%]" />
        <div className="ambient-orb ambient-orb-3 bottom-[-5%] left-[20%]" />
      </div>

      <Sparks />

      {/* ═══ Header ═══ */}
      <header className="sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-xl text-gradient-super tracking-tight">FileForge</Link>
          <nav className="flex items-center gap-5 md:gap-8 text-sm">
            <Link href="#image-tools" className="text-gray-500 hover:text-gray-800 transition-colors font-medium">Images</Link>
            <Link href="#document-tools" className="text-gray-500 hover:text-gray-800 transition-colors font-medium">Documents</Link>
            <Link href="#video-tools" className="text-gray-500 hover:text-gray-800 transition-colors font-medium hidden md:block">Video</Link>
            <Link href="#audio-tools" className="text-gray-500 hover:text-gray-800 transition-colors font-medium hidden md:block">Audio</Link>
            <Link href="#how-it-works" className="text-gray-500 hover:text-gray-800 transition-colors font-medium hidden lg:block">How It Works</Link>
            <Link href="#faq" className="text-gray-500 hover:text-gray-800 transition-colors font-medium hidden lg:block">FAQ</Link>
          </nav>
        </div>
      </header>

      {/* ═══ Hero ═══ */}
      <section className="pt-16 md:pt-28 pb-8 md:pb-12 text-center relative px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200/60 text-xs font-heading font-semibold text-gray-500 tracking-wider uppercase mb-6 shadow-sm animate-fadeInUp" style={{ opacity: 0, animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <UI.Sparkle /> Free • No Signup • Private
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl leading-tight mb-5 text-gray-900 animate-fadeInUp" style={{ opacity: 0, animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Convert files <br className="md:hidden" />
            <span className="text-gradient-super">in a flash</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10 animate-fadeInUp" style={{ opacity: 0, animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Fast, free file conversion at your fingertips. Images processed entirely in your browser — zero uploads. Documents handled through secure APIs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ opacity: 0, animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <Link href="#image-tools" className="btn-glow px-8 py-3.5 rounded-xl text-base inline-flex items-center gap-2">
              <UI.Download /> Start Converting
            </Link>
            <Link href="#how-it-works" className="px-8 py-3.5 rounded-xl text-base inline-flex items-center gap-2 border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all bg-white shadow-sm">
              How It Works
            </Link>
          </div>
          {/* Stats */}
          <div className="hidden md:flex items-center justify-center gap-4 mt-14 animate-fadeInUp flex-wrap" style={{ opacity: 0, animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <StatPill value="21" label="Converters" color="text-cyan-600" icon={<UI.Grid />} />
            <StatPill value="10MB" label="Max File Size" color="text-purple-600" icon={<UI.Bolt />} />
            <StatPill value="100%" label="Free Forever" color="text-pink-600" icon={<UI.Lock />} />
            <StatPill value="500" label="API Credits" color="text-emerald-600" icon={<UI.User />} />
          </div>
          <div className="flex md:hidden items-center justify-center gap-3 mt-10 animate-fadeInUp flex-wrap" style={{ opacity: 0, animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <span className="text-sm text-gray-400">21 Converters</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-400">10MB Max</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-400">Free Forever</span>
          </div>
        </div>
      </section>

      {/* ═══ Ad ═══ */}
      <div className="mb-10 md:mb-14 flex justify-center px-4 sm:px-6 lg:px-10">
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white max-w-[728px] w-full shadow-sm">
          <iframe src="https://www.profitablecpmratenetwork.com/jpu5xippg?key=6338972fc5b07b3a0c19b8ac58a4142e" width="728" height="90" frameBorder="0" scrolling="no" title="Advertisement" className="mx-auto" />
        </div>
      </div>

      {/* ═══ Image Converters ═══ */}
      <section id="image-tools" className="mb-12 md:mb-20 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-gray-100" style={{ color: '#0e9aa7' }}>
            <UI.Image />
          </div>
          <div className="min-w-0">
            <h2 className="font-heading font-semibold text-base md:text-lg text-gray-800">Image Converters</h2>
            <p className="text-xs md:text-sm text-gray-400 truncate">Convert &amp; compress directly in your browser</p>
          </div>
          <span className="badge badge-green ml-auto flex-shrink-0">Client-side</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
          {imageTools.map((tool, i) => (<ToolCard key={tool.id} tool={tool} index={i} />))}
        </div>
      </section>

      <hr className="divider-gradient mb-12 md:mb-20" />

      {/* ═══ Document Converters ═══ */}
      <section id="document-tools" className="mb-12 md:mb-20 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-gray-100" style={{ color: '#7c3aed' }}>
            <UI.Document />
          </div>
          <div className="min-w-0">
            <h2 className="font-heading font-semibold text-base md:text-lg text-gray-800">Document Converters</h2>
            <p className="text-xs md:text-sm text-gray-400 truncate">Word, Excel, PPT, PDF &amp; more</p>            </div>
            <span className="badge badge-cyan ml-auto flex-shrink-0">API Powered</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
            {documentTools.map((tool, i) => (<ToolCard key={tool.id} tool={tool} index={i + imageTools.length} />))}
          </div>
        </section>

      <hr className="divider-gradient mb-12 md:mb-20" />

      {/* ═══ Video Converters ═══ */}
      <section id="video-tools" className="mb-12 md:mb-20 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-gray-100" style={{ color: '#0e9aa7' }}>
            <UI.Video />
          </div>
          <div className="min-w-0">
            <h2 className="font-heading font-semibold text-base md:text-lg text-gray-800">Video Converters</h2>
            <p className="text-xs md:text-sm text-gray-400 truncate">MP4, AVI, MOV, MKV, WebM &amp; more</p>
          </div>
          <span className="badge badge-cyan ml-auto flex-shrink-0">API Powered</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
          {videoTools.map((tool, i) => (<ToolCard key={tool.id} tool={tool} index={i + imageTools.length + documentTools.length} />))}
        </div>
      </section>

      <hr className="divider-gradient mb-12 md:mb-20" />

      {/* ═══ Audio Converters ═══ */}
      <section id="audio-tools" className="mb-12 md:mb-20 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-gray-100" style={{ color: '#db2777' }}>
            <UI.Audio />
          </div>
          <div className="min-w-0">
            <h2 className="font-heading font-semibold text-base md:text-lg text-gray-800">Audio Converters</h2>
            <p className="text-xs md:text-sm text-gray-400 truncate">MP3, WAV, AAC, OGG, FLAC &amp; more</p>
          </div>
          <span className="badge badge-cyan ml-auto flex-shrink-0">API Powered</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
          {audioTools.map((tool, i) => (<ToolCard key={tool.id} tool={tool} index={i + imageTools.length + documentTools.length + videoTools.length} />))}
        </div>
      </section>

      {/* ═══ How It Works (redesigned) ═══ */}
      <section id="how-it-works" className="hidden md:block mb-24 section-highlight px-4 sm:px-6 lg:px-10 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold tracking-wider uppercase mb-4"
              style={{ background: 'rgba(6,182,212,0.08)', color: '#0e9aa7' }}>How It Works</span>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-gray-900 mb-3">From upload to download in seconds</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              No complicated setup. No accounts. Just three simple steps to convert any file.
            </p>
          </div>

          <div className="section-card p-8 md:p-10">
            {/* Timeline visual */}
            <div className="relative">
              {/* Connecting line behind */}
              <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-200 via-purple-200 to-pink-200 rounded-full" />

              <Step number={1} title="Choose Your Converter" description="Browse our 11+ converters organized by category — images or documents. Pick the one that matches your file format." isLast={false} />
              <Step number={2} title="Upload Your File" description="Drag &amp; drop your file or click to browse. Max 10MB. Image files stay on your device — zero uploads." isLast={false} />
              <Step number={3} title="Automatic Conversion" description="Our engine processes images in milliseconds. Documents go through secure APIs and are auto-deleted after conversion." isLast={false} />
              <Step number={4} title="Download Instantly" description="Your converted file is ready immediately. No registration, no waiting, no hidden fees. Just download and go." isLast={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Why FileForge (redesigned) ═══ */}
      <section id="features" className="hidden md:block mb-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold tracking-wider uppercase mb-4"
              style={{ background: 'rgba(139,92,246,0.08)', color: '#7c3aed' }}>Why FileForge</span>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-gray-900 mb-3">Built different. Built better.</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Every feature designed for speed, privacy, and absolute simplicity.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <UI.Speed />, title: 'Lightning Fast', desc: 'Image conversions happen instantly in your browser — zero server delay.', color: '#0e9aa7' },
              { icon: <UI.Shield />, title: '100% Private', desc: 'Your images never leave your device. Documents use enterprise-grade secure APIs.', color: '#7c3aed' },
              { icon: <UI.User />, title: 'No Registration', desc: 'No account, no email, no password. Just open and convert. That\'s it.', color: '#db2777' },
              { icon: <UI.Globe />, title: 'Works Everywhere', desc: 'Desktop, tablet, or mobile. Responsive design that fits any screen perfectly.', color: '#d97706' },
              { icon: <UI.Heart />, title: 'Free Forever', desc: 'No subscriptions, no premium tiers. Unlimited image conversions. 500 API credits.', color: '#059669' },
              { icon: <UI.Layers />, title: '20+ Formats', desc: 'Images, documents, video &amp; audio — every format you need in one place.', color: '#2563eb' },
            ].map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 md:p-7 animate-fadeInUp" style={{ animationDelay: `${i * 0.06}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 feature-icon-ring" style={{ background: `${f.color}08`, color: f.color, border: `1px solid ${f.color}15` as string }}>
                  {f.icon}
                </div>
                <h3 className="font-heading font-semibold text-sm text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ (redesigned with accordion) ═══ */}
      <section id="faq" className="hidden md:block mb-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold tracking-wider uppercase mb-4"
              style={{ background: 'rgba(244,63,94,0.08)', color: '#e11d48' }}>FAQ</span>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Everything you need to know about FileForge.
            </p>
          </div>

          <div className="space-y-3">
            <FaqItem question="Is FileForge really free?" answer="Yes! FileForge is completely free to use. No registration, no subscription, no hidden fees. Ever." />
            <FaqItem question="Are my files secure?" answer="Absolutely. Image conversions happen entirely in your browser — your files never leave your device. Document conversions use enterprise-grade secure APIs that auto-delete files after processing." />
            <FaqItem question="What is the file size limit?" answer="The maximum file size is 10MB per conversion. This ensures fast processing for everyone." />
            <FaqItem question="What formats are supported?" answer="Images: JPG, PNG, WebP, GIF. Documents: Word (DOC/DOCX), Excel (XLS/XLSX), PowerPoint (PPT/PPTX), PDF, plain text (TXT). Video: MP4, AVI, MOV, MKV, WebM. Audio: MP3, WAV, AAC, OGG, FLAC." />
            <FaqItem question="Do I need to create an account?" answer="No! You can use all converters instantly without any registration. Just upload your file and convert." />
            <FaqItem question="How many conversions can I do?" answer="Image converters are unlimited (client-side processing). Document converters include 500 free API credits that never expire." />
          </div>
        </div>
      </section>

      {/* ═══ Mobile FAQ ═══ */}
      <section className="md:hidden mb-12 px-4 sm:px-6">
        <h2 className="font-heading font-semibold text-base text-gray-600 mb-4">Frequently Asked</h2>
        <div className="space-y-2">
          {[
            { q: 'Is it really free?', a: 'Yes! No registration needed.' },
            { q: 'File size limit?', a: 'Maximum 10MB per file.' },
            { q: 'Are files secure?', a: 'Yes — images stay on your device, documents use secure APIs.' },
            { q: 'How many conversions?', a: 'Unlimited for images, 500 API credits for docs.' },
          ].map((faq, i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="font-heading font-semibold text-xs text-gray-700 mb-1">{faq.q}</div>
              <div className="text-xs text-gray-400">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-gray-200/60 mt-8">
        <div className="px-4 sm:px-6 lg:px-10 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
            <div>
              <Link href="/" className="font-heading font-bold text-base text-gradient-super">FileForge</Link>
              <p className="text-xs text-gray-400 mt-1">Free Online File Converter</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} FileForge</p>
              <p className="text-xs text-gray-300 mt-0.5">Built by =[ØVĒRKĪLL]= TECHNOLOGIES</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

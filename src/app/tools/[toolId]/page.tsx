'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToolById, TOOLS } from '@/lib/tools';
import FileUploader from '@/components/FileUploader';
import { compressImageClientSide, convertImageClientSide, downloadFile } from '@/lib/conversion';
import { MAX_FILE_SIZE } from '@/lib/api-config';

interface PageProps {
  params: Promise<{ toolId: string }>;
}

type ConversionStatus = 'idle' | 'converting' | 'success' | 'error';

const toolColors: Record<string, { primary: string; secondary: string; gradient: string; glow: string }> = {
  // Image converters
  'image-compress': { primary: '#22d3ee', secondary: '#3b82f6', gradient: 'from-cyan-400 to-blue-500', glow: 'rgba(34,211,238,0.5)' },
  'jpg-to-webp': { primary: '#fb923c', secondary: '#facc15', gradient: 'from-orange-400 to-yellow-400', glow: 'rgba(251,146,60,0.5)' },
  'webp-to-jpg': { primary: '#f472b6', secondary: '#f87171', gradient: 'from-pink-400 to-red-400', glow: 'rgba(244,114,182,0.5)' },
  'png-to-jpg': { primary: '#a78bfa', secondary: '#c084fc', gradient: 'from-violet-400 to-purple-400', glow: 'rgba(167,139,250,0.5)' },
  'jpg-to-png': { primary: '#34d399', secondary: '#2dd4bf', gradient: 'from-emerald-400 to-teal-400', glow: 'rgba(52,211,153,0.5)' },
  'png-to-webp': { primary: '#60a5fa', secondary: '#818cf8', gradient: 'from-blue-400 to-indigo-400', glow: 'rgba(96,165,250,0.5)' },
  // Document converters
  'word-to-pdf': { primary: '#60a5fa', secondary: '#818cf8', gradient: 'from-blue-400 to-indigo-400', glow: 'rgba(96,165,250,0.5)' },
  'pdf-to-word': { primary: '#818cf8', secondary: '#a78bfa', gradient: 'from-indigo-400 to-violet-400', glow: 'rgba(129,140,248,0.5)' },
  'pdf-compress': { primary: '#fb923c', secondary: '#f97316', gradient: 'from-orange-400 to-red-500', glow: 'rgba(251,146,60,0.5)' },
  'excel-to-pdf': { primary: '#34d399', secondary: '#10b981', gradient: 'from-emerald-400 to-green-500', glow: 'rgba(52,211,153,0.5)' },
  'ppt-to-pdf': { primary: '#f87171', secondary: '#ef4444', gradient: 'from-red-400 to-red-600', glow: 'rgba(248,113,113,0.5)' },
  'txt-to-pdf': { primary: '#2dd4bf', secondary: '#14b8a6', gradient: 'from-teal-400 to-cyan-500', glow: 'rgba(45,212,191,0.5)' },
};

export default function ToolPage({ params: paramsPromise }: PageProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const tool = getToolById(params.toolId);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [result, setResult] = useState<{ url: string; fileName: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const colors = tool ? (toolColors[tool.id] || toolColors['image-compress']) : toolColors['image-compress'];
  
  useEffect(() => {
    if (tool === undefined) {
      router.replace('/');
    }
  }, [tool, router]);
  
  if (tool === undefined) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">Loading...</div>;
  }
  
  const handleConvert = async () => {
    if (!file) return;
    
    setStatus('converting');
    setError(null);
    
    try {
      let outputBlob: Blob | null = null;
      let outputExtension = tool.outputFormat;
      
      // Image converters (client-side)
      if (tool.category === 'image') {
        if (tool.id === 'image-compress') {
          const res = await compressImageClientSide(file, 0.8);
          if (res.success && res.outputBlob) {
            outputBlob = res.outputBlob;
            outputExtension = res.outputExtension || 'jpg';
          } else {
            throw new Error(res.error || 'Compression failed');
          }
        } else {
          const res = await convertImageClientSide(file, tool.outputFormat as 'jpg' | 'png' | 'webp', 0.9);
          if (res.success && res.outputBlob) {
            outputBlob = res.outputBlob;
            outputExtension = res.outputExtension || tool.outputFormat;
          } else {
            throw new Error(res.error || 'Conversion failed');
          }
        }
      } 
      // Document converters (API)
      else if (tool.category === 'document' || tool.category === 'pdf') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversion', tool.id);
        formData.append('outputFormat', tool.outputFormat);
        
        const response = await fetch('/api/convert/document', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Conversion failed');
        }
        
        // Use the converted file from API
        outputBlob = await fetch(data.url).then(r => r.blob());
        outputExtension = tool.outputFormat;
      }
      
      if (outputBlob) {
        const url = URL.createObjectURL(outputBlob);
        const fileName = file.name.replace(/\.[^/.]+$/, '') + '.' + outputExtension;
        setResult({ url, fileName });
        setStatus('success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  };
  
  const handleDownload = () => {
    if (result) {
      downloadFile(result.url, result.fileName);
    }
  };
  
  const handleNewConversion = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
    setError(null);
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-mesh-bg relative overflow-hidden">
      {/* Floating blur particles */}
      <div className="particle-blur-1 top-[10%] left-[5%]"></div>
      <div className="particle-blur-2 top-[30%] right-[10%]"></div>
      <div className="particle-blur-3 bottom-[20%] left-[20%]"></div>
      <div className="particle-blur-4 bottom-[10%] right-[5%]"></div>

      {/* Gradient accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full opacity-50 blur-[100px]" 
          style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }} 
        />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-[#0a0a0f]/80 relative">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gradient-super">FileForge</Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">← All Tools</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-16 relative">
        {/* Tool Info Card */}
        <div className="mb-8 animate-fadeIn">
          <div 
            className="p-6 md:p-8 rounded-2xl border hover-lift"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)`,
              borderColor: `${colors.primary}40`,
              boxShadow: `0 0 50px ${colors.glow}30`
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl text-white animate-float"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 10px 30px ${colors.glow}40` }}
              >
                {tool.icon}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{tool.name}</h1>
                <div className="text-sm font-medium" style={{ color: colors.primary }}>{tool.label}</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm md:text-lg leading-relaxed">{tool.description}</p>
            
            {/* Format info - Desktop */}
            <div className="hidden md:flex items-center gap-6 mt-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Input</div>
                <div className="font-medium text-white">{tool.inputFormats.map(f => f.toUpperCase()).join(', ')}</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Output</div>
                <div className="font-medium" style={{ color: colors.primary }}>{tool.outputFormat.toUpperCase()}</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Max Size</div>
                <div className="font-medium text-white">10MB</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Upload/Convert Area */}
        {status === 'idle' && (
          <div className="mb-6 animate-fadeIn">
            <FileUploader
              onFileSelect={setFile}
              acceptedTypes={tool.inputFormats}
              maxSize={MAX_FILE_SIZE}
              color={colors.primary}
            />
            
            {file && (
              <button
                onClick={handleConvert}
                className="w-full mt-6 py-4 rounded-xl font-semibold text-lg text-white btn-vibrant btn-bounce"
                style={{ boxShadow: `0 10px 30px ${colors.glow}40` }}
              >
                Convert Now
              </button>
            )}
          </div>
        )}
        
        {/* Converting */}
        {status === 'converting' && (
          <div className="text-center py-12 animate-scaleIn">
            <div 
              className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 0 40px ${colors.glow}50` }}
            >
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
            <div className="text-xl font-medium mb-2">Converting...</div>
            <div className="text-sm text-gray-500">This usually takes just a few seconds</div>
          </div>
        )}
        
        {/* Success */}
        {status === 'success' && result && (
          <div className="text-center py-10 animate-scaleIn">
            <div 
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 0 50px ${colors.glow}60` }}
            >
              <span className="text-3xl text-white">✓</span>
            </div>
            <div className="text-2xl font-bold mb-2">Complete!</div>
            <div className="text-gray-400 mb-8">Your file is ready to download</div>
            
            <button
              onClick={handleDownload}
              className="w-full py-4 rounded-xl font-semibold text-lg text-white btn-vibrant btn-bounce mb-4"
              style={{ boxShadow: `0 10px 30px ${colors.glow}40` }}
            >
              Download {result.fileName}
            </button>
            <button
              onClick={handleNewConversion}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Convert Another File
            </button>
          </div>
        )}
        
        {/* Error */}
        {status === 'error' && (
          <div className="text-center py-10 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl text-red-400">!</span>
            </div>
            <div className="text-xl font-medium mb-2">Something went wrong</div>
            <div className="text-red-400 mb-6">{error}</div>
            <button
              onClick={handleNewConversion}
              className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors btn-bounce"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Info - Desktop only */}
        <div className="hidden md:block mt-12 p-6 rounded-xl bg-white/5 border border-white/10 hover-lift">
          <h3 className="font-medium mb-4">How it works</h3>
          <div className="grid grid-cols-3 gap-6 text-sm text-gray-400">
            <div>
              <div className="font-medium mb-1" style={{ color: colors.primary }}>1. Upload</div>
              <div>Select your file (max 10MB)</div>
            </div>
            <div>
              <div className="font-medium mb-1" style={{ color: colors.primary }}>2. Convert</div>
              <div>Processing happens securely</div>
            </div>
            <div>
              <div className="font-medium mb-1" style={{ color: colors.primary }}>3. Download</div>
              <div>Get your converted file instantly</div>
            </div>
          </div>
        </div>
        
        {/* Related Tools */}
        <div className="mt-12 md:mt-16">
          <h3 className="text-lg font-medium text-gray-400 mb-4 md:mb-6">Other Converters</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TOOLS.filter(t => t.id !== tool.id).slice(0, 6).map((t) => {
              const tColors = toolColors[t.id] || toolColors['image-compress'];
              return (
                <Link
                  key={t.id}
                  href={`/tools/${t.id}`}
                  className="p-4 rounded-xl border hover-lift transition-all"
                  style={{ 
                    background: `linear-gradient(135deg, ${tColors.primary}15, ${tColors.secondary}08)`,
                    borderColor: `${tColors.primary}30`
                  }}
                >
                  <div className="font-medium text-sm mb-1">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.inputFormats[0].toUpperCase()} → {t.outputFormat.toUpperCase()}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
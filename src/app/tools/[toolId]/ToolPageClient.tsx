'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getRelatedTools, isClientSide } from '@/lib/tools';
import { ToolIcons } from '@/lib/tool-icons';
import FileUploader from '@/components/FileUploader';
import AdBanner from '@/components/AdBanner';
import { convertToolClientSide, convertVideoClientSide, downloadFile } from '@/lib/conversion';
import { getToolStyle } from '@/lib/tool-colors';
import { MAX_FILE_SIZE } from '@/lib/api-config';
import type { Tool } from '@/lib/types';

type ConversionStatus = 'idle' | 'converting' | 'success' | 'error';

const DEFAULT_OPTIONS: Record<string, string | number> = {
  quality: 0.8,
  width: 1200,
  height: 630,
  page: 1,
  pages: '1',
};

function OptionControl({ tool, values, onChange, color }: {
  tool: Tool;
  values: Record<string, string | number>;
  onChange: (key: string, value: string | number) => void;
  color: string;
}) {
  if (!tool.option) return null;

  if (tool.option === 'quality') {
    return (
      <div className="mt-5 rounded-xl bg-white border border-gray-200 p-4">
        <label htmlFor="quality" className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
          <span>Output quality</span>
          <span className="font-heading font-semibold" style={{ color }}>{Math.round(Number(values.quality) * 100)}%</span>
        </label>
        <input
          id="quality" type="range" min="0.3" max="1" step="0.05"
          value={Number(values.quality)}
          onChange={(e) => onChange('quality', Number(e.target.value))}
          className="w-full accent-cyan-600"
        />
        <p className="text-xs text-gray-400 mt-1">Lower quality creates a smaller file.</p>
      </div>
    );
  }

  if (tool.option === 'dimensions') {
    return (
      <div className="mt-5 rounded-xl bg-white border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Target size in pixels</div>
        <div className="flex items-center gap-3">
          <label className="flex-1 text-xs text-gray-400" htmlFor="resize-width">
            Width
            <input id="resize-width" type="number" min="1" max="10000" value={Number(values.width)}
              onChange={(e) => onChange('width', Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800" />
          </label>
          <span className="text-gray-300 pt-5" aria-hidden="true">×</span>
          <label className="flex-1 text-xs text-gray-400" htmlFor="resize-height">
            Height
            <input id="resize-height" type="number" min="1" max="10000" value={Number(values.height)}
              onChange={(e) => onChange('height', Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800" />
          </label>
        </div>
        <p className="text-xs text-gray-400 mt-2">Tip: 1080 × 1080 for Instagram, 1200 × 630 for link previews.</p>
      </div>
    );
  }

  if (tool.option === 'page' || tool.option === 'pages') {
    const isRange = tool.option === 'pages';
    return (
      <div className="mt-5 rounded-xl bg-white border border-gray-200 p-4">
        <label htmlFor="page-input" className="block text-sm font-medium text-gray-700 mb-2">
          {isRange ? 'Pages to keep' : 'Page number to convert'}
        </label>
        <input
          id="page-input"
          type={isRange ? 'text' : 'number'}
          min={isRange ? undefined : 1}
          value={String(values[isRange ? 'pages' : 'page'])}
          onChange={(e) => onChange(isRange ? 'pages' : 'page', isRange ? e.target.value : Number(e.target.value))}
          placeholder={isRange ? 'e.g. 1-3 or 2,5,7-9' : '1'}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800"
        />
        <p className="text-xs text-gray-400 mt-2">
          {isRange ? 'Use a page number, a range, or several separated by commas.' : 'Enter 1 for the first page of the PDF.'}
        </p>
      </div>
    );
  }

  return null;
}

export default function ToolPageClient({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, string | number>>(DEFAULT_OPTIONS);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; fileName: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const colors = getToolStyle(tool.id);

  const updateOption = (key: string, value: string | number) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleConvert = async () => {
    if (!files.length) return;
    setStatus('converting');
    setProgress(0);
    setError(null);

    try {
      let outputBlob: Blob | null = null;
      let outputExtension = tool.outputFormat;

      if (tool.category === 'video') {
        const res = await convertVideoClientSide(
          files[0],
          tool.outputFormat as 'webm' | 'mp4',
          setProgress,
        );
        if (!res.success || !res.outputBlob) {
          throw new Error(res.error || 'Video conversion failed');
        }
        outputBlob = res.outputBlob;
        outputExtension = res.outputExtension || tool.outputFormat;
      } else if (isClientSide(tool)) {
        const res = await convertToolClientSide(tool, files, options);
        if (!res.success || !res.outputBlob) {
          throw new Error(res.error || 'Conversion failed');
        }
        outputBlob = res.outputBlob;
        outputExtension = res.outputExtension || tool.outputFormat;
      } else {
        const apiEndpoint = tool.engine === 'media' ? '/api/convert/media' : '/api/convert/document';
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('conversion', tool.id);
        formData.append('outputFormat', tool.outputFormat);

        const response = await fetch(apiEndpoint, { method: 'POST', body: formData });
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Conversion failed');

        const binaryString = atob(data.fileContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        outputBlob = new Blob([bytes], { type: data.mimeType || 'application/octet-stream' });
        outputExtension = tool.outputFormat;
      }

      if (outputBlob) {
        const url = URL.createObjectURL(outputBlob);
        const baseName = files[0].name.replace(/\.[^/.]+$/, '');
        const fileName = `${baseName}.${outputExtension}`;
        setResult({ url, fileName });
        setStatus('success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStatus('error');
    }
  };

  const handleNewConversion = () => {
    if (result) URL.revokeObjectURL(result.url);
    setFiles([]);
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  const IconComponent = ToolIcons[tool.icon];
  const related = getRelatedTools(tool, 6);

  return (
    <>
      <div className="mb-6">
        <div
          className="p-5 md:p-6 rounded-2xl border hover-lift"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)`,
            borderColor: `${colors.primary}40`,
          }}
        >
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-white"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
              aria-hidden="true"
            >
              {IconComponent ? <IconComponent /> : <span className="text-xl">{tool.icon}</span>}
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: colors.primary }}>{tool.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {tool.inputFormats.map((f) => f.toUpperCase()).join(', ')} → {tool.outputFormat.toUpperCase()}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
        </div>
      </div>

      <AdBanner />

      {status === 'idle' && (
        <div className="mb-6">
          <FileUploader
            onFileSelect={setFiles}
            acceptedTypes={tool.inputFormats}
            maxSize={MAX_FILE_SIZE}
            color={colors.primary}
            multiple={Boolean(tool.multiFile)}
          />
          <OptionControl tool={tool} values={options} onChange={updateOption} color={colors.primary} />
          {files.length > 0 && (
            <button
              type="button"
              onClick={handleConvert}
              className="w-full mt-6 py-4 rounded-xl font-semibold text-lg text-white btn-vibrant btn-bounce"
              style={{ boxShadow: `0 10px 30px ${colors.glow}40` }}
            >
              Convert {tool.multiFile && files.length > 1 ? `${files.length} Files` : 'Now'}
            </button>
          )}
        </div>
      )}

      {status === 'converting' && (
        <div className="text-center py-12 animate-scaleIn" role="status" aria-live="polite">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
          >
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <div className="text-xl font-medium text-gray-800 mb-2">Converting...</div>
          <div className="text-sm text-gray-400">
            {tool.category === 'video'
              ? progress > 0
                ? `Encoding video — ${Math.round(progress * 100)}%`
                : 'Loading the video engine (first use downloads ~30MB, then it is cached)…'
              : 'This usually takes just a few seconds'}
          </div>
        </div>
      )}

      {status === 'success' && result && (
        <div className="text-center py-10 animate-scaleIn" role="status" aria-live="polite">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
          >
            <span className="text-3xl text-white" aria-hidden="true">&#10003;</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">Complete!</div>
          <div className="text-gray-500 mb-8">Your file is ready to download</div>
          <button
            type="button"
            onClick={() => downloadFile(result.url, result.fileName)}
            className="w-full py-4 rounded-xl font-semibold text-lg text-white btn-vibrant btn-bounce mb-4"
          >
            Download {result.fileName}
          </button>
          <button type="button" onClick={handleNewConversion} className="text-gray-400 hover:text-gray-800 transition-colors">
            Convert Another File
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-10 animate-fadeIn" role="alert">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl text-red-500" aria-hidden="true">!</span>
          </div>
          <div className="text-xl font-heading font-semibold text-gray-800 mb-2">Something went wrong</div>
          <div className="text-red-500 mb-6">{error}</div>
          <button
            type="button"
            onClick={handleNewConversion}
            className="px-8 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all shadow-sm text-gray-600 hover:text-gray-800"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="mt-10 md:mt-14">
        <h2 className="font-heading font-semibold text-base text-gray-800 mb-4">Related converters</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {related.map((t) => (
            <Link
              key={t.id}
              href={`/tools/${t.id}`}
              className="p-4 rounded-xl border bg-white transition-all hover-lift"
              style={{ borderColor: `${getToolStyle(t.id).primary}30` }}
            >
              <div className="font-medium text-sm text-gray-800 mb-1">{t.name}</div>
              <div className="text-xs text-gray-400">
                {t.inputFormats[0].toUpperCase()} &rarr; {t.outputFormat.toUpperCase()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

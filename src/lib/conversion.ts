import { removeBackground } from '@imgly/background-removal';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import type { ConversionOutput, Tool } from './types';

export function downloadFile(url: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getMimeType(format: string): string {
  switch (format.toLowerCase()) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    case 'gif': return 'image/gif';
    default: return 'image/jpeg';
  }
}

function getExtension(format: string): string {
  switch (format.toLowerCase()) {
    case 'jpeg': return 'jpg';
    case 'jpg':
    case 'png':
    case 'webp':
    case 'gif': return format.toLowerCase();
    default: return 'jpg';
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not open "${file.name}". Make sure it is a valid image.`));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), mimeType, quality));
}

function blobOutput(blob: Blob | null, extension: string, failure: string): ConversionOutput {
  if (!blob) return { success: false, error: failure };
  return { success: true, outputBlob: blob, outputExtension: extension };
}

export async function compressImageClientSide(file: File, quality: number = 0.8): Promise<ConversionOutput> {
  try {
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
    return blobOutput(await canvasToBlob(canvas, 'image/jpeg', quality), 'jpg', 'Compression failed — no image data was produced');
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Compression failed' };
  }
}

export async function convertImageClientSide(
  file: File,
  outputFormat: 'jpg' | 'png' | 'webp',
  quality: number = 0.9,
): Promise<ConversionOutput> {
  try {
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (outputFormat === 'jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
    }
    const blob = await canvasToBlob(canvas, getMimeType(outputFormat), quality);
    return blobOutput(blob, getExtension(outputFormat), 'Conversion failed — no image data was produced');
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Conversion failed' };
  }
}

export async function resizeImageClientSide(file: File, width: number, height: number): Promise<ConversionOutput> {
  try {
    if (!width || !height || width < 1 || height < 1 || width > 10000 || height > 10000) {
      return { success: false, error: 'Enter a width and height between 1 and 10000 pixels' };
    }
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const ext = getExtension(file.name.split('.').pop() || 'jpg');
      if (ext === 'jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);
    }
    const ext = getExtension(file.name.split('.').pop() || 'jpg');
    const mime = getMimeType(ext);
    return blobOutput(await canvasToBlob(canvas, mime, 0.92), ext, 'Resize failed — no image data was produced');
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Resize failed' };
  }
}

export async function imagesToPdfClientSide(files: File[]): Promise<ConversionOutput> {
  try {
    if (!files.length) return { success: false, error: 'Add at least one image' };
    const { jsPDF } = await import('jspdf');
    let doc: InstanceType<typeof jsPDF> | null = null;

    for (const file of files) {
      const img = await loadImage(file);
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return { success: false, error: 'Your browser does not support canvas' };
      const inputExt = getExtension(file.name.split('.').pop() || 'jpg');
      // JPEG source stays JPEG; PNG/WebP are re-encoded losslessly as PNG.
      const pdfImageFormat = inputExt === 'jpg' ? 'JPEG' : 'PNG';
      if (pdfImageFormat === 'JPEG') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(pdfImageFormat === 'JPEG' ? 'image/jpeg' : 'image/png', 0.92);
      const orientation: 'portrait' | 'landscape' = width >= height ? 'landscape' : 'portrait';

      if (!doc) {
        doc = new jsPDF({ unit: 'px', format: [width, height], orientation, compress: true });
      } else {
        doc.addPage([width, height], orientation);
      }
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.addImage(dataUrl, pdfImageFormat, 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    }

    if (!doc) return { success: false, error: 'Add at least one image' };
    const blob = doc.output('blob');
    return { success: true, outputBlob: blob, outputExtension: 'pdf' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Could not create the PDF' };
  }
}

export async function pdfToImageClientSide(
  file: File,
  outputFormat: 'jpg' | 'png',
  pageNumber: number = 1,
): Promise<ConversionOutput> {
  try {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data }).promise;
    try {
      const page = await pdf.getPage(Math.min(Math.max(pageNumber, 1), pdf.numPages));
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) return { success: false, error: 'Your browser does not support canvas' };
      if (outputFormat === 'jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      const mime = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
      return blobOutput(await canvasToBlob(canvas, mime, 0.94), outputFormat, 'Could not render the PDF page');
    } finally {
      await pdf.cleanup();
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Could not read the PDF' };
  }
}

export async function mergePdfsClientSide(files: File[]): Promise<ConversionOutput> {
  try {
    if (files.length < 2) return { success: false, error: 'Add at least two PDF files to merge' };
    const { PDFDocument } = await import('pdf-lib');
    const merged = await PDFDocument.create();
    for (const file of files) {
      const source = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()), { ignoreEncryption: true });
      const pages = await merged.copyPages(source, source.getPageIndices());
      pages.forEach((page) => merged.addPage(page));
    }
    const bytes = await merged.save({ useObjectStreams: true });
    return { success: true, outputBlob: new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }), outputExtension: 'pdf' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Could not merge the PDFs' };
  }
}

export function parsePageRanges(input: string, totalPages: number): number[] {
  const pages = new Set<number>();
  for (const part of input.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const range = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
        if (i >= 1 && i <= totalPages) pages.add(i);
      }
    } else if (/^\d+$/.test(trimmed)) {
      const page = Number(trimmed);
      if (page >= 1 && page <= totalPages) pages.add(page);
    }
  }
  return [...pages].sort((a, b) => a - b);
}

export async function splitPdfClientSide(file: File, rangeInput: string): Promise<ConversionOutput> {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const source = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()), { ignoreEncryption: true });
    const pages = parsePageRanges(rangeInput || '1', source.getPageCount());
    if (!pages.length) {
      return { success: false, error: `No valid pages found. Use a number or range between 1 and ${source.getPageCount()}` };
    }
    const output = await PDFDocument.create();
    for (const pageIndex of pages) {
      const [copied] = await output.copyPages(source, [pageIndex - 1]);
      output.addPage(copied);
    }
    const bytes = await output.save({ useObjectStreams: true });
    return { success: true, outputBlob: new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }), outputExtension: 'pdf' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Could not split the PDF' };
  }
}

export async function compressPdfClientSide(file: File): Promise<ConversionOutput> {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()), { ignoreEncryption: true });
    const bytes = await doc.save({ useObjectStreams: true, updateFieldAppearances: false });
    return { success: true, outputBlob: new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }), outputExtension: 'pdf' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Could not optimize the PDF' };
  }
}

export async function textToPdfClientSide(file: File): Promise<ConversionOutput> {
  try {
    const text = await file.text();
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;
    doc.setFont('courier', 'normal');
    doc.setFontSize(11);
    for (const paragraph of text.split(/\r?\n/)) {
      const lines = paragraph.length ? doc.splitTextToSize(paragraph, maxWidth) : [''];
      for (const line of lines) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 15;
      }
    }
    return { success: true, outputBlob: doc.output('blob'), outputExtension: 'pdf' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Could not create the PDF' };
  }
}

/**
 * Video-to-video conversion runs in the browser with FFmpeg (WASM).
 * The conversion engine is loaded from a CDN on first use (~30MB), then cached
 * by the browser. No upload and no API key are required.
 */
export async function convertVideoClientSide(
  file: File,
  outputFormat: 'webm' | 'mp4',
  onProgress?: (fraction: number) => void,
): Promise<ConversionOutput> {
  try {
    const ffmpeg = new FFmpeg();
    if (onProgress) {
      ffmpeg.on('progress', ({ progress }) => {
        if (Number.isFinite(progress)) onProgress(Math.min(1, Math.max(0, progress)));
      });
    }

    const coreBase = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm';
    const [coreURL, wasmURL] = await Promise.all([
      toBlobURL(`${coreBase}/ffmpeg-core.js`, 'text/javascript'),
      toBlobURL(`${coreBase}/ffmpeg-core.wasm`, 'application/wasm'),
    ]);
    // The worker is served from our own origin so its relative ES imports resolve.
    const workerURL = new URL('/ffmpeg/worker.js', window.location.origin).href;
    await ffmpeg.load({ classWorkerURL: workerURL, coreURL, wasmURL });

    const inputName = `input.${getExtension(file.name.split('.').pop() || 'mp4')}`;
    const outputName = `output.${outputFormat}`;
    await ffmpeg.writeFile(inputName, new Uint8Array(await file.arrayBuffer()));

    const encoderArgs = outputFormat === 'webm'
      ? ['-c:v', 'libvpx', '-b:v', '1M', '-c:a', 'libopus']
      : ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac', '-movflags', '+faststart'];
    const exitCode = await ffmpeg.exec(['-i', inputName, ...encoderArgs, '-y', outputName]);
    if (exitCode !== 0) throw new Error(`Video conversion failed (code ${exitCode})`);

    const data = await ffmpeg.readFile(outputName);
    ffmpeg.terminate();
    if (!(data instanceof Uint8Array) || data.length === 0) {
      return { success: false, error: 'No converted video was produced' };
    }
    return {
      success: true,
      outputBlob: new Blob([new Uint8Array(data)], { type: outputFormat === 'webm' ? 'video/webm' : 'video/mp4' }),
      outputExtension: outputFormat,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Video conversion error:', error);
    return { success: false, error: message || 'Video conversion failed' };
  }
}

export async function removeBackgroundClientSide(file: File): Promise<ConversionOutput> {
  try {
    const blob = await removeBackground(file, {
      progress: (key: string, current: number, total: number) => {
        if (typeof console !== 'undefined' && current === total) {
          console.debug(`Background removal: ${key} complete`);
        }
      },
    });
    return { success: true, outputBlob: blob, outputExtension: 'png' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Background removal failed' };
  }
}

/** Dispatches a tool to its in-browser conversion engine. */
export async function convertToolClientSide(
  tool: Tool,
  files: File[],
  options: Record<string, string | number> = {},
): Promise<ConversionOutput> {
  const file = files[0];
  switch (tool.engine) {
    case 'image':
      if (!file) return { success: false, error: 'Add an image first' };
      return tool.id === 'image-compress'
        ? compressImageClientSide(file, Number(options.quality) || 0.8)
        : convertImageClientSide(file, tool.outputFormat as 'jpg' | 'png' | 'webp', Number(options.quality) || 0.9);
    case 'remove-bg':
      if (!file) return { success: false, error: 'Add an image first' };
      return removeBackgroundClientSide(file);
    case 'image-resize':
      if (!file) return { success: false, error: 'Add an image first' };
      return resizeImageClientSide(file, Number(options.width), Number(options.height));
    case 'images-to-pdf':
      return imagesToPdfClientSide(files);
    case 'pdf-to-image':
      if (!file) return { success: false, error: 'Add a PDF first' };
      return pdfToImageClientSide(file, tool.outputFormat as 'jpg' | 'png', Number(options.page) || 1);
    case 'pdf-merge':
      return mergePdfsClientSide(files);
    case 'pdf-split':
      if (!file) return { success: false, error: 'Add a PDF first' };
      return splitPdfClientSide(file, String(options.pages ?? '1'));
    case 'pdf-compress':
      if (!file) return { success: false, error: 'Add a PDF first' };
      return compressPdfClientSide(file);
    case 'text-to-pdf':
      if (!file) return { success: false, error: 'Add a text file first' };
      return textToPdfClientSide(file);
    default:
      return { success: false, error: 'This tool uses server-side conversion' };
  }
}

import { NextRequest, NextResponse } from 'next/server';

/**
 * Audio/video conversions.
 * Set CONVERT_FAST_API_KEY in .env.local for your own key. The bundled key is
 * the public demo key used by the free tier so the site works out of the box.
 */
const CONVERT_FAST_API_KEY = process.env.CONVERT_FAST_API_KEY
  || 'fast_prod_JSKJCHXLCU2ILS4NBYTL3D5FLJ5ZMZXVDXFVPWSFSZVJT5WX3VSA====';
const CONVERT_FAST_BASE_URL = 'https://api.tools.fast';

const mimeTypes: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  aac: 'audio/aac',
  flac: 'audio/flac',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
};

async function submitConversionJob(file: File, targetFormat: string): Promise<string> {
  const apiFormData = new FormData();
  apiFormData.append('file', file);
  apiFormData.append('targetFormat', targetFormat);

  const response = await fetch(`${CONVERT_FAST_BASE_URL}/convert`, {
    method: 'POST',
    headers: { 'X-Fast-Api-Key': CONVERT_FAST_API_KEY },
    body: apiFormData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Convert.FAST submit error:', errorText);
    let message = `Conversion service rejected the request (${response.status})`;
    try {
      const json = JSON.parse(errorText);
      message = json.detail || json.error?.message || json.error || message;
    } catch { /* non-JSON error body */ }
    throw new Error(message);
  }

  const result = await response.json();
  if (!result.id) throw new Error('No job ID returned from the conversion service');
  return result.id;
}

async function pollJobUntilComplete(jobId: string, maxWaitMs: number = 60000): Promise<void> {
  const startTime = Date.now();
  const pollInterval = 1000;

  while (Date.now() - startTime < maxWaitMs) {
    const response = await fetch(`${CONVERT_FAST_BASE_URL}/convert/job/${jobId}`, {
      headers: { 'X-Fast-Api-Key': CONVERT_FAST_API_KEY },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Convert.FAST poll error:', errorText);
      throw new Error(`Could not check conversion status (${response.status})`);
    }

    const result = await response.json();
    const status = String(result.status || '').toLowerCase();

    if (status === 'succeeded') return;
    if (status === 'failed' || status === 'canceled' || status === 'error') {
      throw new Error(result.error || `Conversion ${status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error('Conversion timed out. Please try a smaller file.');
}

async function downloadConvertedFile(jobId: string): Promise<ArrayBuffer> {
  const response = await fetch(`${CONVERT_FAST_BASE_URL}/convert/job/${jobId}/download`, {
    headers: { 'X-Fast-Api-Key': CONVERT_FAST_API_KEY },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Convert.FAST download error:', errorText);
    throw new Error(`Download failed with status ${response.status}`);
  }

  return response.arrayBuffer();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const explicitTarget = formData.get('outputFormat') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File exceeds the 50MB limit' }, { status: 413 });
    }

    const targetFormat = (explicitTarget || '').toLowerCase();

    if (!targetFormat) {
      return NextResponse.json(
        { success: false, error: 'No target format specified' },
        { status: 400 },
      );
    }

    const jobId = await submitConversionJob(file, targetFormat);
    await pollJobUntilComplete(jobId);
    const outputBuffer = await downloadConvertedFile(jobId);

    const base64 = Buffer.from(outputBuffer).toString('base64');
    const outputFileName = file.name.replace(/\.[^/.]+$/, '') + '.' + targetFormat;

    return NextResponse.json({
      success: true,
      fileContent: base64,
      fileName: outputFileName,
      mimeType: mimeTypes[targetFormat] || 'application/octet-stream',
    });
  } catch (error) {
    console.error('Media conversion error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Media Converter API (Convert.FAST)',
    status: 'active',
    conversions: [
      'mp3→wav', 'wav→mp3', 'm4a→mp3', 'aac→mp3', 'flac→mp3', 'ogg→mp3',
      'mp4→mp3', 'avi→mp3', 'mov→mp3', 'mkv→mp3', 'webm→mp3',
    ],
    note: 'Video-to-video conversions run client-side with FFmpeg WASM and do not use this endpoint.',
  });
}

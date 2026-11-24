import { NextRequest, NextResponse } from 'next/server';

/**
 * Document conversions.
 * CloudConvert is used when CLOUDCONVERT_API_KEY is configured; otherwise the
 * free Convert.FAST tier handles the formats it supports. Plain text → PDF is
 * handled client-side and does not need an API key.
 */
const CLOUDCONVERT_API_KEY = process.env.CLOUDCONVERT_API_KEY || '';
const CLOUDCONVERT_BASE_URL = 'https://api.cloudconvert.com/v2';
const CLOUDCONVERT_SANDBOX = process.env.CLOUDCONVERT_SANDBOX === 'true';
const CONVERT_FAST_API_KEY = process.env.CONVERT_FAST_API_KEY
  || 'fast_prod_JSKJCHXLCU2ILS4NBYTL3D5FLJ5ZMZXVDXFVPWSFSZVJT5WX3VSA====';
const CONVERT_FAST_BASE_URL = 'https://api.tools.fast';

const formatMapping: Record<string, string> = {
  doc: 'pdf',
  docx: 'pdf',
  pdf: 'docx',
  xls: 'pdf',
  xlsx: 'pdf',
  ppt: 'pdf',
  pptx: 'pdf',
};

const mimeTypes: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function getApiBase(): string {
  return CLOUDCONVERT_SANDBOX ? 'https://sandbox.api.cloudconvert.com/v2' : CLOUDCONVERT_BASE_URL;
}

// ── CloudConvert provider ──────────────────────────────────────────────
async function createJob(inputFormat: string, outputFormat: string): Promise<{ jobId: string; uploadUrl: string }> {
  const response = await fetch(`${getApiBase()}/jobs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tasks: {
        'import-file': { operation: 'import/upload' },
        'convert-file': {
          operation: 'convert',
          input: 'import-file',
          input_format: inputFormat,
          output_format: outputFormat,
        },
        'export-file': { operation: 'export/url', input: 'convert-file' },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('CloudConvert create job error:', errorText);
    throw new Error(`Could not start conversion (${response.status})`);
  }

  const job = await response.json();
  const importTask = job.data?.tasks?.find((t: { operation: string }) => t.operation === 'import/upload');
  const uploadUrl = importTask?.result?.upload_url;
  if (!uploadUrl) throw new Error('The conversion service did not return an upload URL');
  return { jobId: job.data.id, uploadUrl };
}

async function uploadFile(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  });
  if (!response.ok) throw new Error(`File upload failed (${response.status})`);
}

async function waitForJob(jobId: string, maxWaitMs: number = 120000): Promise<string> {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    const response = await fetch(`${getApiBase()}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${CLOUDCONVERT_API_KEY}` },
    });
    if (!response.ok) throw new Error(`Could not check conversion status (${response.status})`);

    const job = await response.json();
    const status = job.data?.status;
    if (status === 'finished') {
      const exportTask = job.data?.tasks?.find((t: { operation: string }) => t.operation === 'export/url');
      const file = exportTask?.result?.files?.[0];
      if (!file?.url) throw new Error('No converted file was returned');
      return file.url;
    }
    if (status === 'error') {
      const failed = job.data?.tasks?.find((t: { status: string }) => t.status === 'error');
      throw new Error(failed?.message || 'Conversion failed');
    }
    if (status === 'canceled') throw new Error('Conversion was canceled');
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error('Conversion timed out. Try a smaller file.');
}

async function downloadUrl(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed (${response.status})`);
  return response.arrayBuffer();
}

// ── Convert.FAST fallback provider ─────────────────────────────────────
async function convertFast(file: File, targetFormat: string): Promise<ArrayBuffer> {
  const apiFormData = new FormData();
  apiFormData.append('file', file);
  apiFormData.append('targetFormat', targetFormat);

  const submit = await fetch(`${CONVERT_FAST_BASE_URL}/convert`, {
    method: 'POST',
    headers: { 'X-Fast-Api-Key': CONVERT_FAST_API_KEY },
    body: apiFormData,
  });

  if (!submit.ok) {
    const text = await submit.text();
    let message = `Conversion service rejected the file (${submit.status})`;
    try {
      const json = JSON.parse(text);
      message = json.detail || json.error?.message || json.error || message;
    } catch { /* non-JSON error body */ }
    throw new Error(message);
  }

  const { id } = await submit.json();
  if (!id) throw new Error('No job ID returned from the conversion service');

  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    const statusResponse = await fetch(`${CONVERT_FAST_BASE_URL}/convert/job/${id}`, {
      headers: { 'X-Fast-Api-Key': CONVERT_FAST_API_KEY },
    });
    if (!statusResponse.ok) throw new Error(`Could not check conversion status (${statusResponse.status})`);
    const result = await statusResponse.json();
    const status = String(result.status || '').toLowerCase();
    if (status === 'succeeded') {
      const download = await fetch(`${CONVERT_FAST_BASE_URL}/convert/job/${id}/download`, {
        headers: { 'X-Fast-Api-Key': CONVERT_FAST_API_KEY },
      });
      if (!download.ok) throw new Error(`Download failed (${download.status})`);
      return download.arrayBuffer();
    }
    if (['failed', 'canceled', 'error'].includes(status)) {
      throw new Error(result.error || `Conversion ${status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error('Conversion timed out. Try a smaller file.');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const explicitTarget = (formData.get('outputFormat') as string | null)?.toLowerCase();

    if (!file) return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File exceeds the 50MB limit' }, { status: 413 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const targetFormat = explicitTarget || formatMapping[ext];

    if (!targetFormat || !mimeTypes[targetFormat]) {
      return NextResponse.json({ success: false, error: 'Unsupported file format' }, { status: 400 });
    }
    if (!Object.values(formatMapping).includes(targetFormat)) {
      return NextResponse.json({ success: false, error: `Cannot convert .${ext} to .${targetFormat}` }, { status: 400 });
    }

    let outputBuffer: ArrayBuffer;
    const provider = CLOUDCONVERT_API_KEY ? 'cloudconvert' : 'convertfast';

    if (provider === 'cloudconvert') {
      const { jobId, uploadUrl } = await createJob(ext, targetFormat);
      await uploadFile(uploadUrl, file);
      const url = await waitForJob(jobId);
      outputBuffer = await downloadUrl(url);
    } else {
      outputBuffer = await convertFast(file, targetFormat);
    }

    const base64 = Buffer.from(outputBuffer).toString('base64');
    return NextResponse.json({
      success: true,
      fileContent: base64,
      fileName: file.name.replace(/\.[^/.]+$/, '') + '.' + targetFormat,
      mimeType: mimeTypes[targetFormat] || 'application/octet-stream',
      provider,
    });
  } catch (error) {
    console.error('Document conversion error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Conversion failed' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Document Converter API',
    status: CLOUDCONVERT_API_KEY ? 'active (CloudConvert)' : 'active (Convert.FAST free tier)',
    conversions: ['doc→pdf', 'docx→pdf', 'pdf→docx', 'xls→pdf', 'xlsx→pdf', 'ppt→pdf', 'pptx→pdf'],
    note: 'TXT to PDF runs client-side and does not use this endpoint.',
  });
}

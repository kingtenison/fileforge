import { NextRequest, NextResponse } from 'next/server';

const CONVERT_FAST_API_KEY = 'fast_prod_JSKJCHXLCU2ILS4NBYTL3D5FLJ5ZMZXVDXFVPWSFSZVJT5WX3VSA====';
const CONVERT_FAST_BASE_URL = 'https://api.tools.fast';

const formatMapping: Record<string, string> = {
  // Video
  'mp4': 'webm',
  'avi': 'mp4',
  'mov': 'mp4',
  'mkv': 'webm',
  'webm': 'mp4',
  // Audio
  'mp3': 'wav',
  'wav': 'mp3',
  'aac': 'mp3',
  'flac': 'mp3',
  'ogg': 'mp3',
  'm4a': 'mp3',
  'wma': 'mp3',
};

const mimeTypes: Record<string, string> = {
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'mp3': 'audio/mpeg',
  'wav': 'audio/wav',
  'aac': 'audio/aac',
  'flac': 'audio/flac',
  'ogg': 'audio/ogg',
  'm4a': 'audio/mp4',
};

async function submitConversionJob(file: File, targetFormat: string): Promise<string> {
  const apiFormData = new FormData();
  apiFormData.append('file', file);
  apiFormData.append('targetFormat', targetFormat);

  const response = await fetch(`${CONVERT_FAST_BASE_URL}/convert`, {
    method: 'POST',
    headers: {
      'X-Fast-Api-Key': CONVERT_FAST_API_KEY,
    },
    body: apiFormData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Convert.FAST submit error:', errorText);
    throw new Error(`Submit failed with status ${response.status}`);
  }

  const result = await response.json();

  if (!result.id) {
    throw new Error('No job ID returned from conversion API');
  }

  return result.id;
}

async function pollJobUntilComplete(jobId: string, maxWaitMs: number = 30000): Promise<void> {
  const startTime = Date.now();
  const pollInterval = 1000;

  while (Date.now() - startTime < maxWaitMs) {
    const response = await fetch(`${CONVERT_FAST_BASE_URL}/convert/job/${jobId}`, {
      headers: {
        'X-Fast-Api-Key': CONVERT_FAST_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Convert.FAST poll error:', errorText);
      throw new Error(`Poll failed with status ${response.status}`);
    }

    const result = await response.json();
    const status = result.status?.toLowerCase();

    if (status === 'succeeded') {
      return;
    }

    if (status === 'failed' || status === 'canceled') {
      throw new Error(result.error || `Job ${status}`);
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('Conversion timed out');
}

async function downloadConvertedFile(jobId: string): Promise<ArrayBuffer> {
  const response = await fetch(`${CONVERT_FAST_BASE_URL}/convert/job/${jobId}/download`, {
    headers: {
      'X-Fast-Api-Key': CONVERT_FAST_API_KEY,
    },
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
    const file = formData.get('file') as File;
    const explicitTarget = formData.get('outputFormat') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    // Use explicit outputFormat from the tool if provided, fall back to extension mapping
    const targetFormat = explicitTarget || formatMapping[ext];

    if (!targetFormat) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file format for conversion' },
        { status: 400 }
      );
    }

    // Step 1: Submit the conversion job
    const jobId = await submitConversionJob(file, targetFormat);

    // Step 2: Poll until the job completes
    await pollJobUntilComplete(jobId);

    // Step 3: Download the converted file
    const outputBuffer = await downloadConvertedFile(jobId);

    const base64 = Buffer.from(outputBuffer).toString('base64');
    const outputFileName = file.name.replace(/\.[^/.]+$/, '') + '.' + targetFormat;
    const mimeType = mimeTypes[targetFormat] || 'application/octet-stream';

    return NextResponse.json({
      success: true,
      fileContent: base64,
      fileName: outputFileName,
      mimeType,
    });

  } catch (error) {
    console.error('Media conversion error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Media Converter API (Convert.FAST)',
    status: 'active',
    conversions: [
      'mp4→webm', 'avi→mp4', 'mov→mp4', 'mkv→webm', 'webm→mp4',
      'mp3→wav', 'wav→mp3', 'aac→mp3', 'flac→mp3', 'ogg→mp3', 'm4a→mp3', 'wma→mp3',
    ]
  });
}

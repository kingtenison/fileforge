import { NextRequest, NextResponse } from 'next/server';

const REMOVE_BG_API_KEY = 'dJ2hGKJxPoYxXxzvbiQZauyF2';
const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/remove';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];

    if (!supportedFormats.includes(ext)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file format. Use JPG, PNG, or WebP.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const apiFormData = new FormData();
    apiFormData.append('image_file', new Blob([fileBuffer]), file.name);
    apiFormData.append('format', 'auto');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(REMOVE_BG_API_URL, {
        method: 'POST',
        headers: {
          'X-Api-Key': REMOVE_BG_API_KEY,
        },
        body: apiFormData,
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { success: false, error: 'Background removal service timed out. Please try again later.' },
          { status: 504 }
        );
      }
      console.error('Remove.bg connection error:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Background removal service is currently unavailable. Please try again later.' },
        { status: 503 }
      );
    }
    clearTimeout(timeout);

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      let errorMsg = 'Background removal failed';

      if (contentType.includes('application/json')) {
        const errorJson = await response.json();
        console.error('Remove.bg error:', errorJson);
        errorMsg = errorJson.errors?.[0]?.title || errorMsg;
      } else {
        const errorText = await response.text();
        console.error('Remove.bg error:', errorText);
      }
      throw new Error(errorMsg);
    }

    const outputBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(outputBuffer).toString('base64');
    const outputFileName = file.name.replace(/\.[^/.]+$/, '') + '_no_bg.png';

    return NextResponse.json({
      success: true,
      fileContent: base64,
      fileName: outputFileName,
      mimeType: 'image/png',
    });

  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove background. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Background Removal API',
    status: 'active',
    tool: 'background-eraser',
  });
}

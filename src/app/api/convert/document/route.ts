import { NextRequest, NextResponse } from 'next/server';

const CONVERT_FAST_API_KEY = 'fast_prod_JSKJCHXLCU2ILS4NBYTL3D5FLJ5ZMZXVDXFVPWSFSZVJT5WX3VSA====';
const CONVERT_FAST_API_URL = 'https://api.tools.fast/v1/convert';

const formatMapping: Record<string, string> = {
  // Word to PDF
  'doc': 'pdf',
  'docx': 'pdf',
  // PDF to Word
  'pdf': 'docx',
  // Excel to PDF
  'xls': 'pdf',
  'xlsx': 'pdf',
  // PPT to PDF
  'ppt': 'pdf',
  'pptx': 'pdf',
  // Text to PDF
  'txt': 'pdf',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const conversion = formData.get('conversion') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const targetFormat = formatMapping[ext];
    
    if (!targetFormat) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file format for conversion' },
        { status: 400 }
      );
    }
    
    // Convert file to base64 for API
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    // Call Convert.FAST API
    const response = await fetch(CONVERT_FAST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Fast-Api-Key': CONVERT_FAST_API_KEY,
      },
      body: JSON.stringify({
        file: {
          content: base64,
          name: file.name,
        },
        targetFormat: targetFormat,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Convert.FAST error:', errorText);
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.file && result.file.content) {
      // Convert base64 back to binary
      const outputBuffer = Buffer.from(result.file.content, 'base64');
      const outputBlob = new Blob([outputBuffer], { 
        type: targetFormat === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      const outputUrl = URL.createObjectURL(outputBlob);
      const outputFileName = file.name.replace(/\.[^/.]+$/, '') + '.' + targetFormat;
      
      return NextResponse.json({
        success: true,
        url: outputUrl,
        fileName: outputFileName,
      });
    }
    
    throw new Error('No converted file returned from API');
    
  } catch (error) {
    console.error('Document conversion error:', error);
    return NextResponse.json(
      { success: false, error: 'Conversion failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Document Converter API (Convert.FAST)',
    status: 'active',
    conversions: [
      'doc→pdf', 'docx→pdf', 'pdf→docx', 'xls→pdf', 'xlsx→pdf', 'ppt→pdf', 'pptx→pdf', 'txt→pdf'
    ]
  });
}
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { success: false, error: 'This endpoint is not in use. Use /api/convert/document for document conversions.' },
    { status: 400 }
  );
}

export async function GET() {
  return NextResponse.json(
    { message: 'File conversion API' },
    { status: 200 }
  );
}

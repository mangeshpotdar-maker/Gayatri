import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL query parameter is required' }, { status: 400 });
    }

    const qrSvg = await QRCode.toString(url, {
      type: 'svg',
      color: {
        dark: '#4A2E18', // Warm artist earthy dark brown
        light: '#FFFFFF'
      },
      margin: 2
    });

    return new Response(qrSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

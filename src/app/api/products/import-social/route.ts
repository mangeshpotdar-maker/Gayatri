import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid WhatsApp or Instagram URL is required' }, { status: 400 });
    }

    let extractedTitle = '';
    let extractedPrice: number | null = null;
    let extractedImages: string[] = [];
    let extractedDescription = '';

    // Check if input is a raw WhatsApp text message paste (e.g. "Check out this Lippan Art on WhatsApp catalog: ₹2,500 https://wa.me/p/123456")
    const priceInRawText = url.match(/(?:₹|Rs\.?|INR)\s*([0-9,]+)/i);
    if (priceInRawText && priceInRawText[1]) {
      const parsed = parseFloat(priceInRawText[1].replace(/,/g, ''));
      if (!isNaN(parsed)) extractedPrice = parsed;
    }

    // Attempt to fetch open graph tags from the target link
    const httpUrlMatch = url.match(/(https?:\/\/[^\s]+)/g);
    const targetUrl = httpUrlMatch ? httpUrlMatch[0] : url;

    try {
      if (targetUrl.startsWith('http')) {
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        });

        if (response.ok) {
          const html = await response.text();

          // Extract og:image
          const ogImages = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/gi);
          if (ogImages) {
            for (const match of ogImages) {
              const contentMatch = match.match(/content=["']([^"']+)["']/i);
              if (contentMatch && contentMatch[1]) {
                extractedImages.push(contentMatch[1]);
              }
            }
          }

          // Extract og:title
          const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
          if (ogTitleMatch && ogTitleMatch[1]) {
            extractedTitle = ogTitleMatch[1].replace(/ - Instagram| on Instagram| \| WhatsApp/gi, '').trim();
          }

          // Extract og:description
          const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
          if (ogDescMatch && ogDescMatch[1]) {
            extractedDescription = ogDescMatch[1].trim();
          }

          // Extract Price via regex in text/description (e.g. ₹2500, ₹ 1999, Rs 1500, INR 3000)
          if (!extractedPrice) {
            const textToSearch = `${extractedTitle} ${extractedDescription} ${html.slice(0, 10000)}`;
            const priceMatch = textToSearch.match(/(?:₹|Rs\.?|INR)\s*([0-9,]+)/i) || textToSearch.match(/price[:\s]*([0-9,]+)/i);
            if (priceMatch && priceMatch[1]) {
              const parsed = parseFloat(priceMatch[1].replace(/,/g, ''));
              if (!isNaN(parsed) && parsed > 0) {
                extractedPrice = parsed;
              }
            }
          }
        }
      }
    } catch (fetchErr) {
      console.warn('Network fetch error during social import:', fetchErr);
    }

    // Fallback defaults if site blocks scraping
    if (extractedImages.length === 0) {
      extractedImages.push('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800');
    }

    return NextResponse.json({
      success: true,
      data: {
        title: extractedTitle || 'Imported Social Artwork',
        price: extractedPrice || 1999,
        images: extractedImages,
        description: extractedDescription || 'Imported from social media post.'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

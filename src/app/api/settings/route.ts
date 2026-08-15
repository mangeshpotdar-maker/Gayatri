import { NextResponse } from 'next/server';
import { getStoreSettings, getHomepageSections } from '@/lib/services';
import { getDb } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const settings = getStoreSettings();
    const homepage = getHomepageSections();
    const publicSettings = {
      store_name: settings.store_name,
      artist_name: settings.artist_name,
      tagline: settings.tagline,
      bio: settings.bio,
      craft_philosophy: settings.craft_philosophy,
      artist_photo: settings.artist_photo,
      logo: settings.logo,
      email: settings.email,
      phone: settings.phone,
      whatsapp_number: settings.whatsapp_number,
      address: settings.address,
      instagram_url: settings.instagram_url,
      currency_symbol: settings.currency_symbol,
      flat_shipping_rate: settings.flat_shipping_rate,
      free_shipping_threshold: settings.free_shipping_threshold,
      tax_enabled: settings.tax_enabled,
      tax_percentage: settings.tax_percentage,
      tax_inclusive: settings.tax_inclusive,
      razorpay_key_id: settings.razorpay_key_id
    };
    return NextResponse.json({ settings: publicSettings, homepage });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 401 });
    }

    const db = getDb();
    const body = await request.json();

    if (body.settings) {
      db.prepare(`
        UPDATE store_settings
        SET store_name = ?, artist_name = ?, tagline = ?, bio = ?, craft_philosophy = ?, artist_photo = ?,
            email = ?, phone = ?, whatsapp_number = ?, address = ?, instagram_url = ?, currency_symbol = ?,
            flat_shipping_rate = ?, free_shipping_threshold = ?, tax_enabled = ?, tax_percentage = ?, tax_inclusive = ?,
            razorpay_key_id = ?, razorpay_key_secret = ?, razorpay_webhook_secret = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `).run(
        body.settings.store_name,
        body.settings.artist_name,
        body.settings.tagline,
        body.settings.bio,
        body.settings.craft_philosophy,
        body.settings.artist_photo,
        body.settings.email,
        body.settings.phone,
        body.settings.whatsapp_number,
        body.settings.address,
        body.settings.instagram_url,
        body.settings.currency_symbol,
        body.settings.flat_shipping_rate,
        body.settings.free_shipping_threshold,
        body.settings.tax_enabled ? 1 : 0,
        body.settings.tax_percentage,
        body.settings.tax_inclusive ? 1 : 0,
        body.settings.razorpay_key_id,
        body.settings.razorpay_key_secret,
        body.settings.razorpay_webhook_secret
      );
    }

    if (body.homepage) {
      db.prepare(`
        UPDATE homepage_sections
        SET hero_title = ?, hero_subtitle = ?, hero_cta_text = ?, hero_cta_link = ?, hero_image = ?,
            why_handmade_title = ?, why_handmade_content = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `).run(
        body.homepage.hero_title,
        body.homepage.hero_subtitle,
        body.homepage.hero_cta_text,
        body.homepage.hero_cta_link,
        body.homepage.hero_image,
        body.homepage.why_handmade_title,
        body.homepage.why_handmade_content
      );
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

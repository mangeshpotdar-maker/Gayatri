import { NextResponse } from 'next/server';
import { getProducts, getProductBySlug } from '@/lib/services';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const product = getProductBySlug(slug);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    const category_id = searchParams.get('category_id') || undefined;
    const category_slug = searchParams.get('category_slug') || undefined;
    const search = searchParams.get('search') || undefined;
    const is_featured = searchParams.get('is_featured') === 'true';
    const is_new = searchParams.get('is_new') === 'true';
    const is_bestseller = searchParams.get('is_bestseller') === 'true';
    const is_sale = searchParams.get('is_sale') === 'true';
    const is_active_only = searchParams.get('is_active_only') !== 'false';
    const sort_by = searchParams.get('sort_by') || undefined;
    const min_price = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined;
    const max_price = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const products = getProducts({
      category_id,
      category_slug,
      search,
      is_featured,
      is_new,
      is_bestseller,
      is_sale,
      is_active_only,
      sort_by,
      min_price,
      max_price,
      limit
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();

    const {
      name, slug, sku, category_id, description, short_description, price, sale_price, cost_price,
      stock, min_stock_alert, dimensions, weight, material, color, is_handmade, is_made_to_order,
      production_time_days, shipping_info, is_featured, is_new, is_bestseller, is_limited_edition, is_active,
      seo_title, seo_description, images
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Product name and price are required' }, { status: 400 });
    }

    const prodId = `prod-${Date.now()}`;
    const cleanSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const finalSku = sku || `SKU-${Date.now().toString().slice(-6)}`;

    db.transaction(() => {
      db.prepare(`
        INSERT INTO products (
          id, name, slug, sku, category_id, description, short_description, price, sale_price, cost_price,
          stock, min_stock_alert, dimensions, weight, material, color, is_handmade, is_made_to_order,
          production_time_days, shipping_info, is_featured, is_new, is_bestseller, is_limited_edition, is_active,
          seo_title, seo_description
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?
        )
      `).run(
        prodId, name.trim(), cleanSlug, finalSku, category_id || null, description || null, short_description || null,
        Number(price), sale_price ? Number(sale_price) : null, cost_price ? Number(cost_price) : null,
        Number(stock || 0), Number(min_stock_alert || 2), dimensions || null, weight || null, material || null, color || null,
        is_handmade !== false ? 1 : 0, is_made_to_order ? 1 : 0,
        Number(production_time_days || 0), shipping_info || 'Ships within 24-48 hours',
        is_featured ? 1 : 0, is_new ? 1 : 0, is_bestseller ? 1 : 0, is_limited_edition ? 1 : 0, is_active !== false ? 1 : 0,
        seo_title || name, seo_description || short_description || description
      );

      if (images && Array.isArray(images) && images.length > 0) {
        const imgStmt = db.prepare('INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)');
        images.forEach((imgUrl: string, idx: number) => {
          if (imgUrl.trim()) {
            imgStmt.run(`${prodId}-img-${idx + 1}`, prodId, imgUrl.trim(), idx);
          }
        });
      }
    })();

    return NextResponse.json({ success: true, product_id: prodId, slug: cleanSlug });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();

    const {
      id, name, slug, sku, category_id, description, short_description, price, sale_price, cost_price,
      stock, min_stock_alert, dimensions, weight, material, color, is_handmade, is_made_to_order,
      production_time_days, shipping_info, is_featured, is_new, is_bestseller, is_limited_edition, is_active,
      seo_title, seo_description, images
    } = body;

    if (!id || !name || price === undefined) {
      return NextResponse.json({ error: 'Product ID, name and price are required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    db.transaction(() => {
      db.prepare(`
        UPDATE products SET
          name = ?, slug = ?, sku = ?, category_id = ?, description = ?, short_description = ?,
          price = ?, sale_price = ?, cost_price = ?, stock = ?, min_stock_alert = ?,
          dimensions = ?, weight = ?, material = ?, color = ?, is_handmade = ?, is_made_to_order = ?,
          production_time_days = ?, shipping_info = ?, is_featured = ?, is_new = ?, is_bestseller = ?,
          is_limited_edition = ?, is_active = ?, seo_title = ?, seo_description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        name.trim(), cleanSlug, sku || null, category_id || null, description || null, short_description || null,
        Number(price), sale_price ? Number(sale_price) : null, cost_price ? Number(cost_price) : null,
        Number(stock || 0), Number(min_stock_alert || 2), dimensions || null, weight || null, material || null, color || null,
        is_handmade ? 1 : 0, is_made_to_order ? 1 : 0,
        Number(production_time_days || 0), shipping_info || null,
        is_featured ? 1 : 0, is_new ? 1 : 0, is_bestseller ? 1 : 0, is_limited_edition ? 1 : 0, is_active ? 1 : 0,
        seo_title || null, seo_description || null, id
      );

      if (images && Array.isArray(images)) {
        db.prepare('DELETE FROM product_images WHERE product_id = ?').run(id);
        const imgStmt = db.prepare('INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)');
        images.forEach((imgUrl: string, idx: number) => {
          if (imgUrl.trim()) {
            imgStmt.run(`${id}-img-${Date.now()}-${idx + 1}`, id, imgUrl.trim(), idx);
          }
        });
      }
    })();

    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

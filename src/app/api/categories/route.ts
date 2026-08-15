import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/services';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';
    const categories = getAllCategories(includeHidden);
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { name, slug, description, image_url, display_order } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Category name and slug are required' }, { status: 400 });
    }

    const id = `cat-${Date.now()}`;
    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-0-]/g, '-').replace(/-+/g, '-');

    db.prepare(`
      INSERT INTO categories (id, name, slug, description, image_url, display_order, is_hidden)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `).run(id, name.trim(), cleanSlug, description || null, image_url || null, display_order || 0);

    return NextResponse.json({ success: true, category: { id, name, slug: cleanSlug } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, name, slug, description, image_url, display_order, is_hidden } = body;

    if (!id || !name || !slug) {
      return NextResponse.json({ error: 'Category ID, name and slug are required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-0-]/g, '-').replace(/-+/g, '-');

    db.prepare(`
      UPDATE categories
      SET name = ?, slug = ?, description = ?, image_url = ?, display_order = ?, is_hidden = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name.trim(), cleanSlug, description || null, image_url || null, display_order || 0, is_hidden ? 1 : 0, id);

    return NextResponse.json({ success: true, message: 'Category updated successfully' });
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
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

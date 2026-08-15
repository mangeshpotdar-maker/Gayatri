import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');

    if (product_id) {
      const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? AND is_approved = 1 ORDER BY created_at DESC').all(product_id);
      return NextResponse.json({ reviews });
    }

    // Admin view - list all reviews
    const reviews = db.prepare(`
      SELECT r.*, p.name as product_name
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `).all();

    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { product_id, customer_name, customer_email, rating, comment } = body;

    if (!product_id || !customer_name || !customer_email || !rating || !comment) {
      return NextResponse.json({ error: 'All fields are required to submit a review' }, { status: 400 });
    }

    const reviewId = `rev-${Date.now()}`;
    db.prepare(`
      INSERT INTO reviews (id, product_id, customer_name, customer_email, rating, comment, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(reviewId, product_id, customer_name.trim(), customer_email.trim(), Number(rating), comment.trim());

    return NextResponse.json({ success: true, message: 'Thank you! Your review has been published.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, is_approved } = body;

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    db.prepare('UPDATE reviews SET is_approved = ? WHERE id = ?').run(is_approved ? 1 : 0, id);
    return NextResponse.json({ success: true, message: 'Review approval status updated' });
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
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

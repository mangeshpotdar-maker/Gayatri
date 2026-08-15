import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
    const discounts = db.prepare('SELECT * FROM discounts ORDER BY created_at DESC').all();
    return NextResponse.json({ coupons, discounts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { code, type, value, min_order_value, max_discount, usage_limit, per_customer_limit, is_active } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json({ error: 'Coupon code, type and discount value are required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const id = `coup-${Date.now()}`;

    db.prepare(`
      INSERT INTO coupons (
        id, code, type, value, min_order_value, max_discount, usage_limit, per_customer_limit, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, cleanCode, type, Number(value), Number(min_order_value || 0),
      max_discount ? Number(max_discount) : null, Number(usage_limit || 100),
      Number(per_customer_limit || 1), is_active !== false ? 1 : 0
    );

    return NextResponse.json({ success: true, coupon_id: id, code: cleanCode });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, code, type, value, min_order_value, max_discount, usage_limit, per_customer_limit, is_active } = body;

    if (!id || !code || !type || value === undefined) {
      return NextResponse.json({ error: 'Coupon ID, code, type and value are required' }, { status: 400 });
    }

    db.prepare(`
      UPDATE coupons SET
        code = ?, type = ?, value = ?, min_order_value = ?, max_discount = ?,
        usage_limit = ?, per_customer_limit = ?, is_active = ?
      WHERE id = ?
    `).run(
      code.trim().toUpperCase(), type, Number(value), Number(min_order_value || 0),
      max_discount ? Number(max_discount) : null, Number(usage_limit || 100),
      Number(per_customer_limit || 1), is_active ? 1 : 0, id
    );

    return NextResponse.json({ success: true, message: 'Coupon updated successfully' });
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
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
    }

    db.prepare('DELETE FROM coupons WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

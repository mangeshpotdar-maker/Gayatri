import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (id) {
      const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(id, id) as any;
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return NextResponse.json({ order, items });
    }

    if (email) {
      const orders = db.prepare('SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC').all(email.trim());
      return NextResponse.json({ orders });
    }

    // Admin list all orders
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { order_id, status, payment_status, notes } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    db.prepare(`
      UPDATE orders
      SET status = COALESCE(?, status),
          payment_status = COALESCE(?, payment_status),
          notes = COALESCE(?, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status || null, payment_status || null, notes || null, order_id);

    return NextResponse.json({ success: true, message: 'Order status updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { calculateCartTotals } from '@/lib/services';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();

    const { customer_name, customer_email, customer_phone, shipping_address, items, coupon_code, notes } = body;

    if (!customer_name || !customer_email || !customer_phone || !shipping_address) {
      return NextResponse.json({ error: 'Customer contact and shipping address details are required.' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items cannot be empty.' }, { status: 400 });
    }

    // Verify stock and calculate canonical totals server-side
    const totals = calculateCartTotals({ items, coupon_code });

    for (const item of totals.items) {
      if (!item.stock_available) {
        return NextResponse.json({
          error: `Item "${item.product.name}" does not have sufficient stock available.`
        }, { status: 400 });
      }
    }

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `KKA-${Math.floor(100000 + Math.random() * 900000)}`;
    const razorpayOrderId = `order_${crypto.randomBytes(12).toString('hex')}`;

    db.transaction(() => {
      // Create Order in DB
      db.prepare(`
        INSERT INTO orders (
          id, order_number, customer_name, customer_email, customer_phone, shipping_address_json,
          subtotal, discount_amount, coupon_code, shipping_charge, tax_amount, total_amount,
          payment_status, payment_method, razorpay_order_id, status, notes
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          'Pending', 'Razorpay', ?, 'Payment Pending', ?
        )
      `).run(
        orderId, orderNumber, customer_name.trim(), customer_email.trim(), customer_phone.trim(),
        JSON.stringify(shipping_address), totals.subtotal, totals.coupon_discount,
        totals.applied_coupon ? totals.applied_coupon.code : null, totals.shipping_charge,
        totals.tax_amount, totals.final_total, razorpayOrderId, notes || null
      );

      // Insert Order Items
      const itemStmt = db.prepare(`
        INSERT INTO order_items (id, order_id, product_id, product_name, sku, price, quantity, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of totals.items) {
        itemStmt.run(
          `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          orderId,
          item.product.id,
          item.product.name,
          item.product.sku,
          item.unit_price,
          item.quantity,
          item.total_price
        );
      }
    })();

    const settings = db.prepare('SELECT razorpay_key_id FROM store_settings WHERE id = 1').get() as { razorpay_key_id: string };

    return NextResponse.json({
      success: true,
      order_id: orderId,
      order_number: orderNumber,
      razorpay_order_id: razorpayOrderId,
      amount: Math.round(totals.final_total * 100), // in paise for Razorpay
      currency: 'INR',
      key_id: settings ? settings.razorpay_key_id : 'rzp_test_sampleKey123',
      totals
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();

    const { order_id, razorpay_payment_id, razorpay_order_id, razorpay_signature, simulate_success } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(order_id) as any;
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.payment_status === 'Confirmed') {
      return NextResponse.json({ success: true, message: 'Order payment is already verified', order });
    }

    const settings = db.prepare('SELECT razorpay_key_secret FROM store_settings WHERE id = 1').get() as { razorpay_key_secret: string };
    const secret = settings ? settings.razorpay_key_secret : (process.env.RAZORPAY_KEY_SECRET || 'sampleSecretKey456');

    let isSignatureValid = false;

    // Simulation check: allowed if explicitly enabled or during development testing mode
    const isSimulationAllowed = process.env.ALLOW_SIMULATED_PAYMENTS === 'true' || process.env.NODE_ENV === 'development';

    if (simulate_success && isSimulationAllowed) {
      isSignatureValid = true;
    } else if (razorpay_signature && razorpay_signature.startsWith('sig_sim_') && isSimulationAllowed) {
      isSignatureValid = true;
    } else if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      isSignatureValid = (generatedSignature === razorpay_signature);
    }

    if (!isSignatureValid) {
      db.prepare("UPDATE orders SET payment_status = 'Failed', status = 'Payment Pending' WHERE id = ?").run(order_id);
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    const paymentId = razorpay_payment_id || `pay_sim_${Date.now()}`;
    const signature = razorpay_signature || `sig_sim_${Date.now()}`;

    // Execute atomic update for payment confirmation & stock deduction
    db.transaction(() => {
      db.prepare(`
        UPDATE orders
        SET payment_status = 'Confirmed',
            status = 'Payment Confirmed',
            razorpay_payment_id = ?,
            razorpay_signature = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(paymentId, signature, order_id);

      // Decrement inventory for order items
      const items = db.prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?').all(order_id) as Array<{ product_id: string; quantity: number }>;
      const stockStmt = db.prepare(`
        UPDATE products
        SET stock = MAX(0, stock - ?)
        WHERE id = ? AND is_made_to_order = 0
      `);

      for (const item of items) {
        stockStmt.run(item.quantity, item.product_id);
      }

      // Increment coupon usage count if coupon applied
      if (order.coupon_code) {
        db.prepare('UPDATE coupons SET usage_count = usage_count + 1 WHERE UPPER(code) = UPPER(?)').run(order.coupon_code);
      }
    })();

    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(order_id);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      order: updatedOrder
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { calculateCartTotals } from '@/lib/services';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, coupon_code } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        subtotal: 0,
        coupon_discount: 0,
        subtotalAfterDiscount: 0,
        shipping_charge: 0,
        tax_amount: 0,
        final_total: 0,
        items: []
      });
    }

    const result = calculateCartTotals({ items, coupon_code });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

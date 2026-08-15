import { calculateCartTotals } from '../src/lib/services';
import { getDb } from '../src/lib/db';
import { seedDatabase } from '../src/lib/seed';

describe('E-Commerce Business Logic Test Suite', () => {
  beforeAll(() => {
    seedDatabase();
  });

  test('Prompt Test Case: ₹1,000 product with 10% coupon and ₹100 flat shipping = ₹1,000 final total', () => {
    const db = getDb();

    // Setup test product
    db.prepare(`
      INSERT OR REPLACE INTO products (id, name, slug, price, stock, is_active)
      VALUES ('test-p1000', 'Test Painting ₹1000', 'test-p1000', 1000, 10, 1)
    `).run();

    // Setup test coupon (10% off)
    db.prepare(`
      INSERT OR REPLACE INTO coupons (id, code, type, value, min_order_value, is_active)
      VALUES ('test-c10', 'TEST10', 'percentage', 10, 0, 1)
    `).run();

    // Force flat shipping rate to 100 and free shipping threshold to 5000
    db.prepare(`
      UPDATE store_settings SET flat_shipping_rate = 100, free_shipping_threshold = 5000 WHERE id = 1
    `).run();

    const result = calculateCartTotals({
      items: [{ product_id: 'test-p1000', quantity: 1 }],
      coupon_code: 'TEST10'
    });

    expect(result.subtotal).toBe(1000);
    expect(result.coupon_discount).toBe(100); // 10% of 1000 = 100
    expect(result.subtotalAfterDiscount).toBe(900);
    expect(result.shipping_charge).toBe(100);
    expect(result.final_total).toBe(1000); // 1000 - 100 + 100 = 1000
  });

  test('Prevents coupon usage if subtotal is below minimum order requirement', () => {
    const result = calculateCartTotals({
      items: [{ product_id: 'test-p1000', quantity: 1 }],
      coupon_code: 'ARTIST200' // requires ₹1,500 min order
    });

    expect(result.coupon_error).toBeDefined();
    expect(result.coupon_discount).toBe(0);
  });

  test('Correctly calculates free shipping when subtotal exceeds threshold', () => {
    const db = getDb();
    db.prepare(`
      UPDATE store_settings SET flat_shipping_rate = 100, free_shipping_threshold = 2000 WHERE id = 1
    `).run();

    const result = calculateCartTotals({
      items: [{ product_id: 'prod-canvas-1', quantity: 1 }] // ₹2,999
    });

    expect(result.shipping_charge).toBe(0);
  });
});

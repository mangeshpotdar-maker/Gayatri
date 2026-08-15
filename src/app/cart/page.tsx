'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [cartCalculation, setCartCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      setCartCalculation(null);
      return;
    }

    setLoading(true);
    fetch('/api/cart/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        coupon_code: couponCode
      })
    })
      .then((r) => r.json())
      .then((data) => setCartCalculation(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [items, couponCode]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 w-full">
        <div className="border-b border-amber-900/10 pb-4">
          <h1 className="font-serif text-3xl font-semibold text-stone-900">Your Shopping Cart</h1>
          <p className="text-xs text-stone-600 mt-1">Review your selected handmade artworks before proceeding to checkout.</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-amber-900/10 rounded-2xl p-16 text-center space-y-4 shadow-sm">
            <ShoppingBag className="w-16 h-16 text-amber-700/40 mx-auto" />
            <h2 className="font-serif text-2xl text-stone-800">Your cart is waiting for something handmade.</h2>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Explore our Lippan art mirrors, golden horizon canvas paintings, and soy candles.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#C85A32] hover:bg-amber-800 text-white px-8 py-3 rounded-xl font-medium text-sm transition shadow-md"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items Table */}
            <div className="lg:col-span-8 bg-white border border-amber-900/10 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <span className="font-serif font-medium text-stone-900 text-base">Handmade Items ({items.length})</span>
                <button onClick={clearCart} className="text-xs text-rose-600 hover:underline">
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {items.map((item) => {
                  const effectivePrice = item.sale_price !== null && item.sale_price < item.price ? item.sale_price : item.price;
                  return (
                    <div key={item.product_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl border border-amber-900/10 shrink-0"
                        />
                        <div className="space-y-1">
                          <Link href={`/product/${item.slug}`} className="font-serif font-medium text-stone-900 hover:text-amber-800 transition text-sm">
                            {item.name}
                          </Link>
                          <p className="text-xs font-mono text-[#C85A32] font-bold">
                            ₹{effectivePrice.toLocaleString('en-IN')}
                          </p>
                          {item.is_made_to_order && (
                            <span className="inline-block text-[10px] text-amber-900 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded">
                              Made to Order
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        {/* Quantity */}
                        <div className="flex items-center border border-stone-200 bg-stone-50 rounded-lg">
                          <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-2 text-stone-600 hover:text-stone-900">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold font-mono text-stone-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-2 text-stone-600 hover:text-stone-900">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-stone-900 text-sm">
                          ₹{(effectivePrice * item.quantity).toLocaleString('en-IN')}
                        </span>

                        <button onClick={() => removeFromCart(item.product_id)} className="p-2 text-stone-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary & Coupon Card */}
            <div className="lg:col-span-4 bg-white border border-amber-900/10 rounded-2xl p-6 space-y-6 sticky top-24 shadow-sm">
              <h3 className="font-serif font-medium text-stone-900 text-lg border-b border-stone-100 pb-3">Order Summary</h3>

              {/* Coupon Form */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#C85A32]" /> Apply Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 bg-stone-50 text-stone-900 placeholder-stone-400 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-600 uppercase"
                  />
                  <button
                    onClick={() => {}}
                    className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg text-xs font-medium transition"
                  >
                    Apply
                  </button>
                </div>
                {cartCalculation?.coupon_error && (
                  <p className="text-[11px] text-rose-600">{cartCalculation.coupon_error}</p>
                )}
                {cartCalculation?.applied_coupon && (
                  <p className="text-[11px] text-emerald-700 font-bold">
                    ✓ Coupon "{cartCalculation.applied_coupon.code}" applied successfully!
                  </p>
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 text-xs border-t border-stone-100 pt-4 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-900 font-bold">
                    ₹{cartCalculation ? cartCalculation.subtotal.toLocaleString('en-IN') : 0}
                  </span>
                </div>

                {cartCalculation?.coupon_discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span className="font-mono font-bold">
                      - ₹{cartCalculation.coupon_discount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-stone-900">
                    {cartCalculation?.shipping_charge === 0 ? 'FREE' : `₹${cartCalculation?.shipping_charge}`}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-stone-100 text-base font-serif font-bold text-stone-900">
                  <span>Payable Total</span>
                  <span className="font-mono text-[#C85A32]">
                    ₹{cartCalculation ? Math.round(cartCalculation.final_total).toLocaleString('en-IN') : 0}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-[#C85A32] hover:bg-amber-800 text-white py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Safe & Verified Indian Checkout</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

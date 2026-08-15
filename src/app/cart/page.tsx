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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div className="border-b border-amber-900/30 pb-4">
          <h1 className="font-serif text-3xl font-semibold text-amber-100">Your Shopping Cart</h1>
          <p className="text-xs text-stone-400 mt-1">Review your selected handmade artworks before proceeding to checkout.</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-16 text-center space-y-4">
            <ShoppingBag className="w-16 h-16 text-stone-600 mx-auto" />
            <h2 className="font-serif text-2xl text-amber-200">Your cart is waiting for something handmade.</h2>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Explore our Lippan art mirrors, golden horizon canvas paintings, and soy candles.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-amber-700 hover:bg-amber-600 text-amber-50 px-8 py-3 rounded-xl font-medium text-sm transition shadow-lg"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items Table */}
            <div className="lg:col-span-8 bg-stone-900/60 border border-stone-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                <span className="font-serif font-medium text-amber-200 text-base">Handmade Items ({items.length})</span>
                <button onClick={clearCart} className="text-xs text-red-400 hover:underline">
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-stone-800">
                {items.map((item) => {
                  const effectivePrice = item.sale_price !== null && item.sale_price < item.price ? item.sale_price : item.price;
                  return (
                    <div key={item.product_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl border border-amber-900/30 shrink-0"
                        />
                        <div className="space-y-1">
                          <Link href={`/product/${item.slug}`} className="font-serif font-medium text-amber-100 hover:text-amber-300 transition text-sm">
                            {item.name}
                          </Link>
                          <p className="text-xs font-mono text-amber-300">
                            ₹{effectivePrice.toLocaleString('en-IN')}
                          </p>
                          {item.is_made_to_order && (
                            <span className="inline-block text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                              Made to Order
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        {/* Quantity */}
                        <div className="flex items-center border border-stone-800 bg-stone-950 rounded-lg">
                          <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-2 text-stone-400 hover:text-amber-300">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold font-mono text-amber-100">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-2 text-stone-400 hover:text-amber-300">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-amber-200 text-sm">
                          ₹{(effectivePrice * item.quantity).toLocaleString('en-IN')}
                        </span>

                        <button onClick={() => removeFromCart(item.product_id)} className="p-2 text-stone-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary & Coupon Card */}
            <div className="lg:col-span-4 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6 sticky top-24">
              <h3 className="font-serif font-medium text-amber-200 text-lg border-b border-stone-800 pb-3">Order Summary</h3>

              {/* Coupon Form */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Apply Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 bg-stone-950 text-amber-100 placeholder-stone-500 border border-stone-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-600 uppercase"
                  />
                  <button
                    onClick={() => {}}
                    className="bg-amber-800 hover:bg-amber-700 text-amber-100 px-4 py-2 rounded-lg text-xs font-medium transition"
                  >
                    Apply
                  </button>
                </div>
                {cartCalculation?.coupon_error && (
                  <p className="text-[11px] text-red-400">{cartCalculation.coupon_error}</p>
                )}
                {cartCalculation?.applied_coupon && (
                  <p className="text-[11px] text-emerald-400 font-bold">
                    ✓ Coupon "{cartCalculation.applied_coupon.code}" applied successfully!
                  </p>
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 text-xs border-t border-stone-800 pt-4 text-stone-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-amber-100 font-bold">
                    ₹{cartCalculation ? cartCalculation.subtotal.toLocaleString('en-IN') : 0}
                  </span>
                </div>

                {cartCalculation?.coupon_discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount</span>
                    <span className="font-mono font-bold">
                      - ₹{cartCalculation.coupon_discount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-amber-100">
                    {cartCalculation?.shipping_charge === 0 ? 'FREE' : `₹${cartCalculation?.shipping_charge}`}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-stone-800 text-base font-serif font-bold text-amber-100">
                  <span>Payable Total</span>
                  <span className="font-mono text-amber-200">
                    ₹{cartCalculation ? Math.round(cartCalculation.final_total).toLocaleString('en-IN') : 0}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-amber-700 hover:bg-amber-600 text-amber-50 py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/80 transition"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
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

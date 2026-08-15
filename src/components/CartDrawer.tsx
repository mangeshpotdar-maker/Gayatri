'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, isCartDrawerOpen, setIsCartDrawerOpen, removeFromCart, updateQuantity, totalItemsCount } = useCart();

  if (!isCartDrawerOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const effectivePrice = item.sale_price !== null && item.sale_price < item.price ? item.sale_price : item.price;
    return acc + effectivePrice * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-0" onClick={() => setIsCartDrawerOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-amber-900/40 text-stone-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 bg-stone-950 border-b border-amber-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-serif font-medium text-amber-100">Your Cart</h2>
              <span className="text-xs bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                {totalItemsCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 text-stone-400 hover:text-amber-400 transition"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
                <p className="font-serif text-amber-200 text-lg">Your cart is waiting for something handmade.</p>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Explore our handcrafted canvas paintings, Lippan art panels, and scented wax candles.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-block bg-amber-700 hover:bg-amber-600 text-amber-50 px-6 py-2.5 rounded-lg text-sm font-medium transition mt-2"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const effectivePrice = item.sale_price !== null && item.sale_price < item.price ? item.sale_price : item.price;
                return (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-4 p-3 bg-stone-950/60 border border-stone-800 rounded-lg group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md border border-amber-900/30"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setIsCartDrawerOpen(false)}
                        className="font-medium text-sm text-stone-200 hover:text-amber-400 truncate block"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-amber-300/80 font-mono mt-0.5">
                        ₹{effectivePrice.toLocaleString('en-IN')}
                        {item.sale_price !== null && item.sale_price < item.price && (
                          <span className="line-through text-stone-500 ml-1.5 text-[10px]">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {item.is_made_to_order && (
                        <span className="inline-block text-[10px] text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded mt-1">
                          Made to Order
                        </span>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 text-stone-400 hover:text-amber-300 bg-stone-800 rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-amber-100 px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 text-stone-400 hover:text-amber-300 bg-stone-800 rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-1.5 text-stone-500 hover:text-red-400 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout Button */}
          {items.length > 0 && (
            <div className="p-6 bg-stone-950 border-t border-amber-900/30 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400">Subtotal</span>
                <span className="text-lg font-serif font-bold text-amber-200 font-mono">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Taxes and shipping calculated during checkout.</p>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full bg-amber-700 hover:bg-amber-600 text-amber-50 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-amber-950/50"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full block text-center py-2 text-xs text-stone-400 hover:text-amber-300 transition"
                >
                  View Full Cart & Apply Coupons
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

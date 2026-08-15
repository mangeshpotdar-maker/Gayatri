'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ShoppingBag, MessageCircle, Truck, MapPin } from 'lucide-react';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.order) setOrderData(d);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12 text-amber-200 font-serif">
          Verifying order receipt...
        </div>
        <Footer />
      </div>
    );
  }

  if (!orderData || !orderData.order) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto text-center py-20 px-4 space-y-4">
          <h2 className="font-serif text-2xl text-amber-200">Order not found</h2>
          <Link href="/shop" className="inline-block bg-amber-800 text-amber-100 px-6 py-2 rounded-lg text-xs font-medium">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { order, items } = orderData;
  const address = JSON.parse(order.shipping_address_json || '{}');
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(`Hello! I would like to check status for Order ${order.order_number}.`)}`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="bg-stone-900/80 border border-amber-800/50 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-950 border border-emerald-700/50 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-amber-400">Order Confirmed</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-amber-100">
            Thank you for supporting handmade art!
          </h1>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            Your payment of <strong className="text-amber-200 font-mono">₹{order.total_amount.toLocaleString('en-IN')}</strong> was verified successfully. Order ID: <strong className="text-amber-300">{order.order_number}</strong>
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Studio
            </a>
            <Link
              href="/shop"
              className="bg-amber-800 hover:bg-amber-700 text-amber-100 px-5 py-2.5 rounded-lg text-xs font-medium transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Purchased Items */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-medium text-amber-200 text-base border-b border-stone-800 pb-3">
              Purchased Artworks
            </h3>
            <div className="space-y-3">
              {items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-xs border-b border-stone-800/40 pb-2">
                  <div>
                    <p className="font-medium text-stone-200">{item.product_name}</p>
                    <p className="text-[10px] text-stone-500">Qty: {item.quantity} x ₹{item.price}</p>
                  </div>
                  <span className="font-mono text-amber-200 font-bold">₹{item.total}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 text-xs space-y-1 text-stone-400">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">₹{order.subtotal}</span></div>
              {order.discount_amount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span className="font-mono">- ₹{order.discount_amount}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span className="font-mono">₹{order.shipping_charge}</span></div>
              <div className="flex justify-between pt-2 font-serif font-bold text-amber-100 text-sm border-t border-stone-800">
                <span>Total Paid</span>
                <span className="font-mono text-amber-300">₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-medium text-amber-200 text-base border-b border-stone-800 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" /> Dispatch & Shipping Address
            </h3>
            <div className="text-xs text-stone-300 space-y-1.5 leading-relaxed">
              <p className="font-bold text-amber-100 text-sm">{order.customer_name}</p>
              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>{address.city}, {address.state} - {address.pincode}</p>
              <p className="pt-2 text-stone-400">Phone: {order.customer_phone}</p>
              <p className="text-stone-400">Email: {order.customer_email}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

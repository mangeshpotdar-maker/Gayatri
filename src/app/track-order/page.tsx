'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Search, Package, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(query.trim())}`).then((r) => r.json());
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.order) {
        setOrder(res.order);
        setItems(res.items || []);
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-semibold">
            Order Status Tracking
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-amber-100">
            Track Your Handmade Journey
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto">
            Enter your Order Number (e.g. KKA-123456) or Order ID to check real-time crafting and shipping status.
          </p>
        </div>

        {/* Tracking Input Card */}
        <form onSubmit={handleTrack} className="bg-stone-900/80 border border-amber-900/40 p-6 rounded-2xl max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. KKA-123456 or ord-17234..."
            className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-700 hover:bg-amber-600 text-amber-50 px-6 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl text-center max-w-md mx-auto flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details Banner */}
        {order && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-2">
              <div>
                <span className="text-xs text-stone-400">Order Number:</span>
                <h3 className="font-serif text-2xl font-bold text-amber-200">{order.order_number}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Status:</span>
                <span className="bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Status Pipeline Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
              <div className={`p-3 rounded-xl border ${['Payment Confirmed', 'Processing', 'Ready to Ship', 'Shipped', 'Delivered'].includes(order.status) ? 'bg-amber-950/60 border-amber-700 text-amber-200' : 'bg-stone-950 border-stone-800 text-stone-600'}`}>
                <Clock className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <span className="font-bold block">1. Confirmed</span>
              </div>
              <div className={`p-3 rounded-xl border ${['Processing', 'Ready to Ship', 'Shipped', 'Delivered'].includes(order.status) ? 'bg-amber-950/60 border-amber-700 text-amber-200' : 'bg-stone-950 border-stone-800 text-stone-600'}`}>
                <Package className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <span className="font-bold block">2. Crafting</span>
              </div>
              <div className={`p-3 rounded-xl border ${['Ready to Ship', 'Shipped', 'Delivered'].includes(order.status) ? 'bg-amber-950/60 border-amber-700 text-amber-200' : 'bg-stone-950 border-stone-800 text-stone-600'}`}>
                <Truck className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <span className="font-bold block">3. Dispatched</span>
              </div>
              <div className={`p-3 rounded-xl border ${['Delivered'].includes(order.status) ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200' : 'bg-stone-950 border-stone-800 text-stone-600'}`}>
                <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <span className="font-bold block">4. Delivered</span>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-stone-800 pt-4 space-y-2">
              <h4 className="font-serif text-sm font-medium text-amber-200">Ordered Products</h4>
              {items.map((i) => (
                <div key={i.id} className="flex justify-between items-center text-xs py-1 border-b border-stone-800/40">
                  <span>{i.product_name} (x{i.quantity})</span>
                  <span className="font-mono font-bold text-amber-300">₹{i.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

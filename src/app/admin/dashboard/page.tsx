'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { IndianRupee, ShoppingBag, AlertTriangle, TrendingUp, Package, ArrowRight, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordRes, prodRes] = await Promise.all([
          fetch('/api/orders').then((r) => r.json()),
          fetch('/api/products?is_active_only=false').then((r) => r.json())
        ]);

        if (ordRes.orders) setOrders(ordRes.orders);
        if (prodRes.products) setProducts(prodRes.products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalSales = orders
    .filter((o) => o.payment_status === 'Confirmed')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const pendingOrders = orders.filter((o) => o.status === 'Payment Confirmed' || o.status === 'Processing');
  const lowStockProducts = products.filter((p) => p.stock <= p.min_stock_alert && p.is_made_to_order === 0);

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="border-b border-amber-900/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-amber-100">Owner Business Overview</h1>
            <p className="text-xs text-stone-400 mt-1">Live sales analytics, pending orders, and inventory status.</p>
          </div>
          <Link
            href="/admin/products"
            className="bg-amber-700 hover:bg-amber-600 text-amber-50 px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
          >
            + Add New Artwork
          </Link>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-stone-900/80 border border-amber-900/30 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Confirmed Sales</span>
              <IndianRupee className="w-5 h-5" />
            </div>
            <p className="font-serif text-3xl font-bold text-amber-200 font-mono">
              ₹{totalSales.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-stone-500">Gross revenue from verified orders</p>
          </div>

          <div className="p-6 bg-stone-900/80 border border-amber-900/30 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Orders</span>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="font-serif text-3xl font-bold text-amber-200 font-mono">
              {orders.length}
            </p>
            <p className="text-[11px] text-stone-500">{pendingOrders.length} orders require processing</p>
          </div>

          <div className="p-6 bg-stone-900/80 border border-amber-900/30 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Low Stock Alerts</span>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <p className="font-serif text-3xl font-bold text-amber-200 font-mono">
              {lowStockProducts.length}
            </p>
            <p className="text-[11px] text-stone-500">Ready-to-ship items needing restock</p>
          </div>

          <div className="p-6 bg-stone-900/80 border border-amber-900/30 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Artworks</span>
              <Package className="w-5 h-5" />
            </div>
            <p className="font-serif text-3xl font-bold text-amber-200 font-mono">
              {products.length}
            </p>
            <p className="text-[11px] text-stone-500">Active catalog items</p>
          </div>
        </div>

        {/* Low Stock Banner Alert */}
        {lowStockProducts.length > 0 && (
          <div className="p-4 bg-amber-950/60 border border-amber-800/60 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-200">Attention: Low Stock Warning</p>
                <p className="text-[11px] text-stone-400">
                  {lowStockProducts.map((p) => p.name).join(', ')} currently have stock at or below alert limit.
                </p>
              </div>
            </div>
            <Link
              href="/admin/inventory"
              className="bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs px-4 py-2 rounded-lg font-medium shrink-0 transition"
            >
              Update Stock
            </Link>
          </div>
        )}

        {/* Recent Orders Table */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-stone-800 pb-3">
            <h3 className="font-serif font-medium text-amber-200 text-base">Recent Customer Orders</h3>
            <Link href="/admin/orders" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
              Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-amber-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-800/40 transition">
                    <td className="p-3 font-mono font-bold text-amber-200">{ord.order_number}</td>
                    <td className="p-3">{ord.customer_name}</td>
                    <td className="p-3 font-mono font-bold text-amber-100">₹{ord.total_amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ord.payment_status === 'Confirmed' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-stone-300">{ord.status}</td>
                    <td className="p-3 text-stone-500">{new Date(ord.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

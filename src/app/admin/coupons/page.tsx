'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Tag, Trash2, X } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(500);
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState(100);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coupons').then((r) => r.json());
      if (res.coupons) setCoupons(res.coupons);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        type,
        value: Number(value),
        min_order_value: Number(minOrderValue),
        max_discount: maxDiscount ? Number(maxDiscount) : null,
        usage_limit: Number(usageLimit),
        is_active: true
      })
    });

    setIsFormOpen(false);
    setCode('');
    loadCoupons();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to disable/delete this coupon?')) return;
    await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
    loadCoupons();
  };

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/30 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-amber-100">Coupon & Discount Engine</h1>
            <p className="text-xs text-stone-400 mt-1">Create percentage or flat ₹ discount coupons with order limits.</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-amber-700 hover:bg-amber-600 text-amber-50 px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>

        {/* Coupons List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div key={c.id} className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-3 relative">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xl font-bold text-amber-200 tracking-wider block">{c.code}</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                  </span>
                </div>
                <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-stone-400 space-y-1 border-t border-stone-800 pt-3">
                <p>Min Order Required: <strong className="text-amber-100 font-mono">₹{c.min_order_value}</strong></p>
                {c.max_discount && <p>Max Discount Cap: <strong className="text-amber-100 font-mono">₹{c.max_discount}</strong></p>}
                <p>Used: <strong className="text-amber-100">{c.usage_count} / {c.usage_limit}</strong></p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="bg-stone-900 border border-amber-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h2 className="font-serif text-lg font-semibold text-amber-100">Create New Coupon</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-stone-400 hover:text-amber-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE20"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-200"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-amber-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Total Usage Limit</label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

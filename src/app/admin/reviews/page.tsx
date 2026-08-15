'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Star, Check, EyeOff, Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews').then((r) => r.json());
      if (res.reviews) setReviews(res.reviews);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (reviewId: string, currentApproved: boolean) => {
    await fetch('/api/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: reviewId, is_approved: !currentApproved })
    });
    loadReviews();
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
    loadReviews();
  };

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="border-b border-amber-900/30 pb-4">
          <h1 className="font-serif text-3xl font-semibold text-amber-100">Customer Reviews Moderation</h1>
          <p className="text-xs text-stone-400 mt-1">Approve, hide or remove customer feedback and product ratings.</p>
        </div>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-100 text-sm">{r.customer_name}</span>
                  <span className="text-[10px] text-stone-500 font-mono">({r.customer_email})</span>
                  <span className="text-xs text-amber-400 font-bold">• Item: {r.product_name}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 italic">"{r.comment}"</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleApprove(r.id, Boolean(r.is_approved))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    r.is_approved ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" /> {r.is_approved ? 'Approved' : 'Hidden'}
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 text-red-400 hover:bg-red-950/40 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { AlertTriangle, Boxes, Plus, Minus } from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?is_active_only=false').then((r) => r.json());
      if (res.products) setProducts(res.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = async (product: any, newStock: number) => {
    if (newStock < 0) return;
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, stock: newStock })
    });
    loadProducts();
  };

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="border-b border-amber-900/30 pb-4">
          <h1 className="font-serif text-3xl font-semibold text-amber-100">Inventory & Stock Control</h1>
          <p className="text-xs text-stone-400 mt-1">Monitor real-time inventory levels and adjust stock for ready-to-ship products.</p>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-amber-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Product Ref</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Low Alert Threshold</th>
                  <th className="p-4">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-800/40 transition">
                    <td className="p-4 font-bold text-amber-100">{p.name}</td>
                    <td className="p-4 font-mono text-stone-400">{p.sku || 'N/A'}</td>
                    <td className="p-4">
                      {p.is_made_to_order ? (
                        <span className="text-amber-300 bg-amber-950 px-2 py-0.5 rounded text-[10px]">
                          Made to Order
                        </span>
                      ) : (
                        <span className="text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded text-[10px]">
                          Ready to Ship
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-sm text-amber-200">
                      {p.is_made_to_order ? '∞' : p.stock}
                    </td>
                    <td className="p-4 font-mono text-stone-400">
                      {p.is_made_to_order ? '-' : p.min_stock_alert}
                    </td>
                    <td className="p-4">
                      {!p.is_made_to_order && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStockChange(p, p.stock - 1)}
                            className="p-1 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono font-bold w-8 text-center">{p.stock}</span>
                          <button
                            onClick={() => handleStockChange(p, p.stock + 1)}
                            className="p-1 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
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

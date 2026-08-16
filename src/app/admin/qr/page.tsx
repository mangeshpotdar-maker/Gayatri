'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { QrCode, Download, ExternalLink, Printer } from 'lucide-react';

export default function AdminQRCenterPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductSlug, setSelectedProductSlug] = useState('');
  const [qrType, setQrType] = useState<'store' | 'product' | 'payment'>('store');
  const [storeUrl, setStoreUrl] = useState('http://localhost:3000');
  const [paymentUpi, setPaymentUpi] = useState('9284724914@okbizaxis');
  const [paymentAmount, setPaymentAmount] = useState('1000');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStoreUrl(window.location.origin);
    }

    fetch('/api/products?is_active_only=false')
      .then((r) => r.json())
      .then((d) => {
        if (d.products) {
          setProducts(d.products);
          if (d.products.length > 0) setSelectedProductSlug(d.products[0].slug);
        }
      });
  }, []);

  const targetUrl = qrType === 'store'
    ? storeUrl
    : qrType === 'product'
    ? `${storeUrl}/product/${selectedProductSlug}`
    : `upi://pay?pa=${encodeURIComponent(paymentUpi)}&pn=Gayatris%20Creations&am=${paymentAmount}&cu=INR`;

  const qrImageUrl = `/api/qr?url=${encodeURIComponent(targetUrl)}`;

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="border-b border-amber-900/30 pb-4">
          <h1 className="font-serif text-3xl font-semibold text-amber-100">QR Code Center</h1>
          <p className="text-xs text-stone-400 mt-1">Generate high-resolution QR codes for art exhibitions, craft fairs, business cards & product stands.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 text-xs">
            <h2 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">Select QR Target</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-stone-400 mb-2 font-semibold">QR Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setQrType('store')}
                    className={`py-3 rounded-xl font-bold transition border text-[11px] ${
                      qrType === 'store' ? 'bg-amber-800 text-amber-100 border-amber-600' : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    Store Homepage
                  </button>
                  <button
                    onClick={() => setQrType('product')}
                    className={`py-3 rounded-xl font-bold transition border text-[11px] ${
                      qrType === 'product' ? 'bg-amber-800 text-amber-100 border-amber-600' : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    Artwork Page
                  </button>
                  <button
                    onClick={() => setQrType('payment')}
                    className={`py-3 rounded-xl font-bold transition border text-[11px] ${
                      qrType === 'payment' ? 'bg-amber-800 text-amber-100 border-amber-600' : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    GPay Payment QR
                  </button>
                </div>
              </div>

              {qrType === 'payment' && (
                <div className="space-y-3 bg-stone-950 border border-stone-800 p-3 rounded-xl">
                  <div>
                    <label className="block text-stone-400 mb-1">GPay UPI VPA</label>
                    <input
                      type="text"
                      value={paymentUpi}
                      onChange={(e) => setPaymentUpi(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 text-emerald-400 font-bold rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Preset Amount (₹ Optional)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 text-amber-200 font-bold rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              )}

              {qrType === 'product' && (
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Select Artwork</label>
                  <select
                    value={selectedProductSlug}
                    onChange={(e) => setSelectedProductSlug(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 text-amber-200 rounded-xl p-3"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.slug}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl font-mono text-stone-400">
                <span className="block text-[10px] text-stone-500 uppercase">Target URL:</span>
                <span className="text-amber-300 break-all">{targetUrl}</span>
              </div>
            </div>
          </div>

          {/* QR Preview Card */}
          <div className="lg:col-span-6 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
            <h2 className="font-serif text-lg font-bold text-amber-200">QR Code Preview</h2>

            <div className="bg-white p-6 rounded-2xl inline-block border-4 border-amber-800 shadow-xl">
              <img src={qrImageUrl} alt="Generated QR" className="w-56 h-56 mx-auto" />
              <p className="text-[11px] font-serif font-bold text-stone-800 mt-2">KalaKriti Arts Studio</p>
            </div>

            <div className="flex justify-center gap-4">
              <a
                href={qrImageUrl}
                download={`kalakriti_qr_${qrType}.svg`}
                className="bg-amber-700 hover:bg-amber-600 text-amber-50 px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" /> Download SVG Vector
              </a>
              <button
                onClick={() => window.print()}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Display Card
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

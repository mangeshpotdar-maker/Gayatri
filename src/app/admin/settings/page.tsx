'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    store_name: '',
    artist_name: '',
    tagline: '',
    studio_badge: '',
    studio_location: '',
    bio: '',
    craft_philosophy: '',
    artist_photo: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    address: '',
    instagram_url: '',
    currency_symbol: '₹',
    flat_shipping_rate: 100,
    free_shipping_threshold: 1999,
    tax_enabled: false,
    tax_percentage: 18,
    tax_inclusive: true,
    razorpay_key_id: '',
    razorpay_key_secret: '',
    razorpay_webhook_secret: '',
    payment_upi_id: 'soniyapandit-1@okicici',
    payment_upi_mobile: '9284724914'
  });
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings })
    });
    setSavedMsg('Store settings updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="border-b border-amber-900/30 pb-4">
          <h1 className="font-serif text-3xl font-semibold text-amber-100">Store Settings & Configurations</h1>
          <p className="text-xs text-stone-400 mt-1">Configure artist info, WhatsApp, GST/Tax, shipping rules and Razorpay payment credentials.</p>
        </div>

        {savedMsg && (
          <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-3xl text-xs">
          {/* Store & Artist Branding */}
          <h2 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">1. Store Branding & Artist Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1">Store / Studio Name</label>
              <input
                type="text"
                value={settings.store_name || ''}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-100"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Artist / Maker Name</label>
              <input
                type="text"
                value={settings.artist_name || ''}
                onChange={(e) => setSettings({ ...settings, artist_name: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-100"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Studio Badge Title</label>
              <input
                type="text"
                value={settings.studio_badge || ''}
                onChange={(e) => setSettings({ ...settings, studio_badge: e.target.value })}
                placeholder="e.g. 100% Authentic Handcraft"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Studio Location Subtitle</label>
              <input
                type="text"
                value={settings.studio_location || ''}
                onChange={(e) => setSettings({ ...settings, studio_location: e.target.value })}
                placeholder="e.g. Jaipur, Rajasthan Studio"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-200 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-400 mb-1">Artist Biography / Story</label>
              <textarea
                rows={3}
                value={settings.bio || ''}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-400 mb-1">Craft Philosophy</label>
              <input
                type="text"
                value={settings.craft_philosophy || ''}
                onChange={(e) => setSettings({ ...settings, craft_philosophy: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-400 mb-1">Artist Photo URL</label>
              <input
                type="text"
                value={settings.artist_photo || ''}
                onChange={(e) => setSettings({ ...settings, artist_photo: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-stone-300"
              />
            </div>
          </div>

          {/* Contact & WhatsApp */}
          <h2 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2 pt-2">2. Contact & WhatsApp Integration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1">WhatsApp Mobile Number (e.g. 919876543210)</label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Studio Email</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.instagram_url || ''}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-400 mb-1">Physical Studio Address</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>
          </div>

          {/* Shipping & GST Tax */}
          <h2 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2 pt-2">3. Shipping & GST Tax Architecture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1">Flat Indian Shipping Rate (₹)</label>
              <input
                type="number"
                value={settings.flat_shipping_rate ?? 0}
                onChange={(e) => setSettings({ ...settings, flat_shipping_rate: Number(e.target.value) })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-amber-200"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Free Shipping Order Threshold (₹)</label>
              <input
                type="number"
                value={settings.free_shipping_threshold ?? 0}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-amber-200"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">GST Tax Percentage (%)</label>
              <input
                type="number"
                value={settings.tax_percentage ?? 0}
                onChange={(e) => setSettings({ ...settings, tax_percentage: Number(e.target.value) })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-stone-300">
                <input
                  type="checkbox"
                  checked={Boolean(settings.tax_enabled)}
                  onChange={(e) => setSettings({ ...settings, tax_enabled: e.target.checked })}
                  className="accent-amber-600 rounded"
                />
                <span>Enable Tax/GST Calculation</span>
              </label>
            </div>
          </div>

          {/* Studio Payment Receiving UPI QR */}
          <h2 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2 pt-2">4. Studio Payment Receiving UPI QR (Google Pay / GPay)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1">GPay UPI VPA / Address *</label>
              <input
                type="text"
                value={settings.payment_upi_id || 'soniyapandit-1@okicici'}
                onChange={(e) => setSettings({ ...settings, payment_upi_id: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">GPay Mobile Number *</label>
              <input
                type="text"
                value={settings.payment_upi_mobile || '9284724914'}
                onChange={(e) => setSettings({ ...settings, payment_upi_mobile: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-amber-200 font-bold"
              />
            </div>
          </div>

          {/* Payment Gateway Credentials */}
          <h2 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2 pt-2">5. Razorpay Payment Gateway Keys</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={settings.razorpay_key_id || ''}
                onChange={(e) => setSettings({ ...settings, razorpay_key_id: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-amber-200"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Razorpay Key Secret</label>
              <input
                type="password"
                value={settings.razorpay_key_secret || ''}
                onChange={(e) => setSettings({ ...settings, razorpay_key_secret: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-amber-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-600 text-amber-50 py-3.5 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save All Studio Settings
          </button>
        </form>
      </main>
    </div>
  );
}

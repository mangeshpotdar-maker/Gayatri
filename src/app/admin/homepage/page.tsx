'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Home, Save, CheckCircle2 } from 'lucide-react';

export default function AdminHomepageCMSPage() {
  const [homepage, setHomepage] = useState<any>({
    hero_title: '',
    hero_subtitle: '',
    hero_cta_text: 'Explore Collection',
    hero_cta_link: '/shop',
    hero_image: '',
    why_handmade_title: '',
    why_handmade_content: ''
  });
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.homepage) setHomepage(d.homepage);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homepage })
    });
    setSavedMsg('Homepage banner and content updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="border-b border-amber-900/30 pb-4">
          <h1 className="font-serif text-3xl font-semibold text-amber-100">Homepage Content CMS</h1>
          <p className="text-xs text-stone-400 mt-1">Edit hero banner title, background image, taglines and promotional sections.</p>
        </div>

        {savedMsg && (
          <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-2xl text-xs">
          <h2 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">Hero Section Banner</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-stone-400 mb-1">Main Hero Title</label>
              <input
                type="text"
                value={homepage.hero_title}
                onChange={(e) => setHomepage({ ...homepage, hero_title: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-100"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={homepage.hero_subtitle}
                onChange={(e) => setHomepage({ ...homepage, hero_subtitle: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Hero Background Image URL</label>
              <input
                type="text"
                value={homepage.hero_image}
                onChange={(e) => setHomepage({ ...homepage, hero_image: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-stone-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={homepage.hero_cta_text}
                  onChange={(e) => setHomepage({ ...homepage, hero_cta_text: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-200"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">CTA Destination Link</label>
                <input
                  type="text"
                  value={homepage.hero_cta_link}
                  onChange={(e) => setHomepage({ ...homepage, hero_cta_link: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono"
                />
              </div>
            </div>
          </div>

          <h2 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2 pt-4">Why Choose Handmade Section</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-stone-400 mb-1">Section Title</label>
              <input
                type="text"
                value={homepage.why_handmade_title}
                onChange={(e) => setHomepage({ ...homepage, why_handmade_title: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-100"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Section Paragraph</label>
              <textarea
                rows={3}
                value={homepage.why_handmade_content}
                onChange={(e) => setHomepage({ ...homepage, why_handmade_content: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-600 text-amber-50 py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Homepage Content
          </button>
        </form>
      </main>
    </div>
  );
}

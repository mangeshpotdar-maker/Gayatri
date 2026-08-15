'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Mail, MapPin, Phone, Share2, Heart } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState<any>({
    store_name: 'KalaKriti Arts Studio',
    artist_name: 'Ananya Sharma',
    email: 'ananya@kalakritiarts.in',
    phone: '+91 98765 43210',
    whatsapp_number: '919876543210',
    address: 'Studio 12, Craft Village, Jaipur, Rajasthan 302001',
    instagram_url: 'https://instagram.com/kalakriti_arts'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(console.error);
  }, []);

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('Hello ' + settings.artist_name + '! I am contacting from your website.')}`;

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-amber-900/40 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Store & Artist */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-800 flex items-center justify-center text-amber-200 font-serif font-bold text-base">
                K
              </span>
              <span className="font-serif text-xl font-semibold text-amber-100 tracking-wide">
                {settings.store_name}
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed">
              Single-artisan boutique studio creating authentic handmade Lippan art, canvas paintings, scented soy candles, resin art and MDF home decor in Jaipur, Rajasthan.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 border border-emerald-700/50 px-4 py-2 rounded-lg text-xs font-medium transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Studio Direct
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-amber-200 text-sm tracking-wide">Shop Collection</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/canvas-paintings" className="hover:text-amber-400 transition">
                  Canvas Paintings
                </Link>
              </li>
              <li>
                <Link href="/category/mdf-art-products" className="hover:text-amber-400 transition">
                  MDF Art Products
                </Link>
              </li>
              <li>
                <Link href="/category/lippan-art" className="hover:text-amber-400 transition">
                  Lippan Mirror Art
                </Link>
              </li>
              <li>
                <Link href="/category/scented-wax-candles" className="hover:text-amber-400 transition">
                  Scented Wax Candles
                </Link>
              </li>
              <li>
                <Link href="/category/resin-art-products" className="hover:text-amber-400 transition">
                  Resin Art Creations
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-amber-200 text-sm tracking-wide">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-amber-400 transition">
                  Track Order Status
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-amber-400 transition">
                  Shipping & Packaging Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-400 transition">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Contact */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-amber-200 text-sm tracking-wide">Artisan Studio Contact</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.email}</span>
              </li>
              <li className="flex items-center gap-2 pt-1">
                <Share2 className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 underline"
                >
                  Follow on Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.store_name}. All rights reserved.</p>
          <p className="flex items-center gap-1 text-stone-400">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> in Jaipur, India
          </p>
        </div>
      </div>
    </footer>
  );
}

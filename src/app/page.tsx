'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { Sparkles, Heart, ShieldCheck, Truck, ArrowRight, Star, Award } from 'lucide-react';

export default function HomePage() {
  const [settings, setSettings] = useState<any>(null);
  const [homepage, setHomepage] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, catRes, featRes, newRes, bestRes] = await Promise.all([
          fetch('/api/settings').then((r) => r.json()),
          fetch('/api/categories').then((r) => r.json()),
          fetch('/api/products?is_featured=true&limit=4').then((r) => r.json()),
          fetch('/api/products?is_new=true&limit=4').then((r) => r.json()),
          fetch('/api/products?is_bestseller=true&limit=4').then((r) => r.json())
        ]);

        if (settingsRes.settings) setSettings(settingsRes.settings);
        if (settingsRes.homepage) setHomepage(settingsRes.homepage);
        if (catRes.categories) setCategories(catRes.categories);
        if (featRes.products) setFeaturedProducts(featRes.products);
        if (newRes.products) setNewArrivals(newRes.products);
        if (bestRes.products) setBestSellers(bestRes.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-stone-950">
          <div className="absolute inset-0 z-0">
            <img
              src={homepage?.hero_image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1600'}
              alt="Handmade Art Banner"
              className="w-full h-full object-cover opacity-35 filter saturate-120"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 py-20">
            <div className="inline-flex items-center gap-2 bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs px-4 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings?.tagline || 'Handmade Indian Heritage & Contemporary Crafts'}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold text-amber-100 tracking-tight leading-tight">
              {homepage?.hero_title || 'Exquisite Handmade Art from Jaipur'}
            </h1>

            <p className="text-base sm:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
              {homepage?.hero_subtitle || 'Discover authentic Canvas Paintings, Lippan Art, Scented Wax Candles, Resin Decor & MDF Crafts.'}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={homepage?.hero_cta_link || '/shop'}
                className="w-full sm:w-auto bg-amber-700 hover:bg-amber-600 text-amber-50 px-8 py-3.5 rounded-xl font-medium text-base shadow-xl shadow-amber-950/80 flex items-center justify-center gap-2 transition"
              >
                {homepage?.hero_cta_text || 'Explore Collection'} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/category/lippan-art"
                className="w-full sm:w-auto bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-800/40 px-8 py-3.5 rounded-xl font-medium text-base backdrop-blur-md transition"
              >
                Shop Lippan Art
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURED CATEGORIES SECTION */}
        <section className="py-16 sm:py-24 bg-stone-900/40 border-y border-amber-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Artisan Collections</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-amber-100">Explore Craft Categories</h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
                Each category represents traditional Indian heritage fused with modern artistic design.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative rounded-xl overflow-hidden aspect-3/4 border border-stone-800 hover:border-amber-600/60 transition shadow-lg"
                >
                  <img
                    src={cat.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-4 text-center space-y-1">
                    <h3 className="font-serif font-semibold text-amber-100 text-sm sm:text-base group-hover:text-amber-300 transition">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-amber-400/90 font-mono">
                      {cat.product_count || 3} Pieces
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        {featuredProducts.length > 0 && (
          <section className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Handpicked</span>
                  <h2 className="font-serif text-3xl font-semibold text-amber-100">Featured Masterpieces</h2>
                </div>
                <Link
                  href="/shop?is_featured=true"
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                >
                  View All Featured <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ABOUT THE ARTIST */}
        <section className="py-16 sm:py-24 bg-stone-900/60 border-y border-amber-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative">
                <div className="aspect-4/5 rounded-2xl overflow-hidden border border-amber-800/40 shadow-2xl">
                  <img
                    src={settings?.artist_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800'}
                    alt={settings?.artist_name || 'Ananya Sharma'}
                    className="w-full h-full object-cover filter saturate-105"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-stone-950 border border-amber-700/50 p-4 rounded-xl shadow-xl hidden sm:block">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-amber-200">100% Authentic Handcraft</p>
                      <p className="text-[10px] text-stone-400">Jaipur, Rajasthan Studio</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">About the Studio</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-amber-100">
                  Meet the Artisan — {settings?.artist_name || 'Ananya Sharma'}
                </h2>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
                  {settings?.bio || 'Ananya Sharma is an artisan based in Jaipur, India. She merges centuries-old heritage crafts like Lippan Kaam with modern resin art and textured canvas paintings.'}
                </p>
                <div className="p-6 bg-stone-950/80 border-l-4 border-amber-600 rounded-r-xl space-y-2">
                  <h4 className="font-serif font-medium text-amber-200 text-sm">Craft Philosophy</h4>
                  <p className="text-xs sm:text-sm text-stone-400 italic">
                    "{settings?.craft_philosophy || 'Each creation is crafted by hand using eco-friendly and sustainably sourced Indian materials.'}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY HANDMADE */}
        <section className="py-16 sm:py-20 bg-stone-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-3xl font-semibold text-amber-100">
                {homepage?.why_handmade_title || 'Why Choose Handmade Crafts?'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
                {homepage?.why_handmade_content || 'Every single piece is lovingly handcrafted using premium quality non-toxic materials.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-stone-900/50 border border-stone-800 rounded-xl space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-400 mx-auto">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-medium text-amber-100 text-base">Made with Love & Soul</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Unlike mass-produced factory decor, every stroke of clay and brush carries singular artistic intention and human warmth.
                </p>
              </div>

              <div className="p-6 bg-stone-900/50 border border-stone-800 rounded-xl space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-400 mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-medium text-amber-100 text-base">Non-Toxic & Premium</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Food-safe epoxy resins, organic soy waxes, and eco-friendly pigments ensure long-lasting beauty and home safety.
                </p>
              </div>

              <div className="p-6 bg-stone-900/50 border border-stone-800 rounded-xl space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-400 mx-auto">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-medium text-amber-100 text-base">Shatterproof Indian Shipping</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Reinforced multi-layer protective packaging guarantees fragile mirror Lippan panels and candles arrive in pristine condition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        {newArrivals.length > 0 && (
          <section className="py-16 sm:py-24 bg-stone-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Fresh Off The Workbench</span>
                  <h2 className="font-serif text-3xl font-semibold text-amber-100">New Arrivals</h2>
                </div>
                <Link
                  href="/shop?is_new=true"
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                >
                  Browse New Items <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TESTIMONIALS */}
        <section className="py-16 sm:py-24 bg-stone-900/70 border-t border-amber-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Customer Reviews</span>
              <h2 className="font-serif text-3xl font-semibold text-amber-100">Loved Across India</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 italic">
                  "The Kutch Lippan Mirror panel looks even more stunning in person! The packaging was so safe, not a single mirror chip was damaged."
                </p>
                <div>
                  <p className="text-xs font-bold text-amber-200">Pooja Deshmukh</p>
                  <p className="text-[10px] text-stone-500">Mumbai, Maharashtra</p>
                </div>
              </div>

              <div className="p-6 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 italic">
                  "Ordered the Royal Jasmine Soy Candle for my mother's birthday. The scent filled the entire living room gently. Highly recommended!"
                </p>
                <div>
                  <p className="text-xs font-bold text-amber-200">Vikram Malhotra</p>
                  <p className="text-[10px] text-stone-500">Bengaluru, Karnataka</p>
                </div>
              </div>

              <div className="p-6 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 italic">
                  "The Ocean Wave resin teak wood platter is a showstopper whenever we host dinner. Pure craftsmanship by Ananya ji."
                </p>
                <div>
                  <p className="text-xs font-bold text-amber-200">Ritu Singhania</p>
                  <p className="text-[10px] text-stone-500">New Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

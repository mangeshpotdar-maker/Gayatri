'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        if (d.products) {
          setProducts(d.products.filter((p: any) => wishlistIds.includes(p.id)));
        }
      })
      .finally(() => setLoading(false));
  }, [wishlistIds]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div className="border-b border-amber-900/30 pb-4">
          <h1 className="font-serif text-3xl font-semibold text-amber-100 flex items-center gap-2">
            <Heart className="w-7 h-7 text-amber-500 fill-amber-500" /> Saved Pieces ({wishlistIds.length})
          </h1>
          <p className="text-xs text-stone-400 mt-1">Save pieces you love for later purchase.</p>
        </div>

        {wishlistIds.length === 0 ? (
          <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-16 text-center space-y-4">
            <Heart className="w-16 h-16 text-stone-600 mx-auto" />
            <h2 className="font-serif text-2xl text-amber-200">Save pieces you love.</h2>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Click the heart icon on any artwork to keep track of your favorite handmade creations.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-amber-700 hover:bg-amber-600 text-amber-50 px-8 py-3 rounded-xl font-medium text-sm transition shadow-lg"
            >
              Explore Collection
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-amber-300 font-serif">Loading saved items...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

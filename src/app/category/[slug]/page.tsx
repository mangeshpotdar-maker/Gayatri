'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import Link from 'next/link';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      try {
        const catRes = await fetch(`/api/categories`).then((r) => r.json());
        const match = catRes.categories?.find((c: any) => c.slug === slug);
        setCategory(match || null);

        const prodRes = await fetch(`/api/products?category_slug=${slug}`).then((r) => r.json());
        if (prodRes.products) setProducts(prodRes.products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
  }, [slug]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        {/* Category Hero */}
        <section className="relative py-16 bg-stone-900 border-b border-amber-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="text-xs text-amber-400 font-mono">
              <Link href="/" className="hover:underline">Home</Link> / <Link href="/shop" className="hover:underline">Categories</Link> / <span className="text-stone-300 font-bold">{category?.name || slug}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-amber-100">
              {category?.name || 'Category'}
            </h1>
            {category?.description && (
              <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12 text-amber-300">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-12 text-center space-y-4">
              <p className="font-serif text-lg text-amber-200">No products available in this category yet.</p>
              <Link
                href="/shop"
                className="inline-block bg-amber-800 hover:bg-amber-700 text-amber-100 px-6 py-2.5 rounded-lg text-xs font-medium transition"
              >
                Browse All Collections
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

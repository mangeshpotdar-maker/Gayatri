'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceMax, setPriceMax] = useState<number>(6000);
  const [filterFeatured, setFilterFeatured] = useState(searchParams.get('is_featured') === 'true');
  const [filterNew, setFilterNew] = useState(searchParams.get('is_new') === 'true');
  const [filterBestseller, setFilterBestseller] = useState(searchParams.get('is_bestseller') === 'true');

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) setCategories(d.categories);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category_slug', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sort_by', sortBy);
    if (priceMax) params.set('max_price', priceMax.toString());
    if (filterFeatured) params.set('is_featured', 'true');
    if (filterNew) params.set('is_new', 'true');
    if (filterBestseller) params.set('is_bestseller', 'true');

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.products) setProducts(d.products);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, sortBy, priceMax, filterFeatured, filterNew, filterBestseller]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('newest');
    setPriceMax(6000);
    setFilterFeatured(false);
    setFilterNew(false);
    setFilterBestseller(false);
    router.push('/shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-amber-200/80 pb-6 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-amber-950">
          Handmade Art Collection
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Discover original paintings, clay mirror panels, aromatherapy candles and resin art.
        </p>
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 bg-amber-100/80 hover:bg-amber-200 text-amber-950 px-3 py-2 rounded-lg text-xs font-bold"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          <span className="text-xs text-stone-600 font-mono">
            Showing {products.length} Items
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-700">
            <SlidersHorizontal className="w-4 h-4 text-amber-800" />
            <span className="font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-amber-200 text-stone-900 px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-700 text-xs font-medium"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters Desktop */}
        <aside
          className={`${
            isMobileFilterOpen ? 'block' : 'hidden'
          } lg:block bg-white border border-amber-200/80 p-6 rounded-2xl space-y-6 sticky top-24 shadow-xs`}
        >
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <h3 className="font-serif font-bold text-amber-950 text-base">Filter Collection</h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-amber-800 hover:underline flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Search Item
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, material, SKU..."
                className="w-full bg-stone-50 text-stone-900 placeholder-stone-400 border border-amber-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-700"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Category
            </label>
            <div className="space-y-1 text-xs font-medium">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-1.5 rounded transition ${
                  selectedCategory === '' ? 'bg-amber-100 text-amber-950 font-bold' : 'text-stone-600 hover:text-amber-900'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded transition ${
                    selectedCategory === cat.slug ? 'bg-amber-100 text-amber-950 font-bold' : 'text-stone-600 hover:text-amber-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-wider text-amber-900">
                Max Price
              </label>
              <span className="font-mono text-amber-950 font-bold">₹{priceMax.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="6000"
              step="250"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-amber-800 bg-amber-100 cursor-pointer"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-amber-200/80 text-xs text-stone-700 font-medium">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.checked)}
                className="accent-amber-800 rounded"
              />
              <span>Featured Pieces</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterNew}
                onChange={(e) => setFilterNew(e.target.checked)}
                className="accent-amber-800 rounded"
              />
              <span>New Arrivals</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterBestseller}
                onChange={(e) => setFilterBestseller(e.target.checked)}
                className="accent-amber-800 rounded"
              />
              <span>Bestsellers</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-amber-100/40 rounded-2xl h-72 border border-amber-200" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-amber-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
              <p className="font-serif text-xl text-amber-950">No matching handmade products found.</p>
              <p className="text-xs text-stone-600">Try adjusting your filters or resetting the search term.</p>
              <button
                onClick={resetFilters}
                className="bg-amber-800 hover:bg-amber-700 text-amber-50 px-6 py-2 rounded-lg text-xs font-bold transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-amber-900">Loading catalog...</div>}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

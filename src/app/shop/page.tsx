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
      <div className="border-b border-amber-900/30 pb-6 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-amber-100">
          Handmade Art Collection
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          Discover original paintings, clay mirror panels, aromatherapy candles and resin art.
        </p>
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900/80 p-4 rounded-xl border border-stone-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 px-3 py-2 rounded-lg text-xs font-medium"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          <span className="text-xs text-stone-400 font-mono">
            Showing {products.length} Items
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-950 border border-stone-800 text-amber-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-600 text-xs"
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
          } lg:block bg-stone-900/90 border border-stone-800 p-6 rounded-xl space-y-6 sticky top-24`}
        >
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-serif font-medium text-amber-200 text-base">Filter Collection</h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-300/80">
              Search Item
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, material, SKU..."
                className="w-full bg-stone-950 text-amber-100 placeholder-stone-500 border border-stone-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-600"
              />
              <Search className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-300/80">
              Category
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-1.5 rounded transition ${
                  selectedCategory === '' ? 'bg-amber-900/60 text-amber-200 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded transition ${
                    selectedCategory === cat.slug ? 'bg-amber-900/60 text-amber-200 font-bold' : 'text-stone-400 hover:text-stone-200'
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
              <label className="font-semibold uppercase tracking-wider text-amber-300/80">
                Max Price
              </label>
              <span className="font-mono text-amber-200">₹{priceMax.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="6000"
              step="250"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-amber-600 bg-stone-950 cursor-pointer"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-stone-800 text-xs text-stone-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.checked)}
                className="accent-amber-600 rounded"
              />
              <span>Featured Pieces</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterNew}
                onChange={(e) => setFilterNew(e.target.checked)}
                className="accent-amber-600 rounded"
              />
              <span>New Arrivals</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterBestseller}
                onChange={(e) => setFilterBestseller(e.target.checked)}
                className="accent-amber-600 rounded"
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
                <div key={i} className="bg-stone-900 rounded-xl h-72 border border-stone-800" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-12 text-center space-y-4">
              <p className="font-serif text-xl text-amber-200">No matching handmade products found.</p>
              <p className="text-xs text-stone-400">Try adjusting your filters or resetting the search term.</p>
              <button
                onClick={resetFilters}
                className="bg-amber-800 hover:bg-amber-700 text-amber-100 px-6 py-2 rounded-lg text-xs font-medium transition"
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-amber-200">Loading catalog...</div>}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

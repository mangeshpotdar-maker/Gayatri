'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FestivalBanner from './FestivalBanner';
import { ShoppingBag, Heart, Search, Menu, X, MessageCircle, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const router = useRouter();
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlistIds } = useWishlist();

  const [settings, setSettings] = useState<any>({
    store_name: 'KalaKriti Arts Studio',
    whatsapp_number: '919876543210'
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(console.error);

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('Hello! I am browsing ' + settings.store_name + ' and have a query.')}`;

  return (
    <header className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-md text-stone-900 border-b border-amber-200/80 shadow-xs">
      {/* Dynamic Indian Festival Greetings Banner */}
      <FestivalBanner />

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-amber-800"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-full bg-amber-800 flex items-center justify-center text-amber-50 font-serif font-bold text-lg group-hover:scale-105 transition shadow-xs">
              K
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-amber-950 group-hover:text-amber-800 transition">
                {settings.store_name}
              </span>
              <span className="text-[10px] text-stone-600 tracking-widest uppercase font-sans flex items-center gap-1">
                <span>Handmade Boutique</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-800">
          <Link href="/" className="hover:text-amber-800 transition py-1 border-b-2 border-transparent hover:border-amber-800">
            Home
          </Link>
          <Link href="/shop" className="hover:text-amber-800 transition py-1 border-b-2 border-transparent hover:border-amber-800">
            Shop All
          </Link>

          {/* Dynamic Categories Dropdown */}
          <div className="relative group py-1">
            <button className="flex items-center gap-1 hover:text-amber-800 transition">
              Categories
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-white border border-amber-200 rounded-lg shadow-lg py-2 z-50">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-2 text-xs text-stone-700 hover:bg-amber-100/60 hover:text-amber-900 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/track-order" className="hover:text-amber-800 transition py-1 border-b-2 border-transparent hover:border-amber-800">
            Track Order
          </Link>
        </nav>

        {/* Right Action Icons & Live Green Dot Admin Indicator */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-stone-700 hover:text-amber-800 transition rounded-full hover:bg-amber-100/60"
            aria-label="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/wishlist"
            className="p-2 text-stone-700 hover:text-amber-800 transition rounded-full hover:bg-amber-100/60 relative"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1 right-1 bg-amber-800 text-amber-50 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="p-2 text-stone-700 hover:text-amber-800 transition rounded-full hover:bg-amber-100/60 relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-1 bg-emerald-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Admin Live Online Green Dot Status Button */}
          <Link
            href="/admin/login"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-3.5 py-1.5 rounded-full border border-amber-300 transition shadow-2xs"
            title="Studio Owner Available Online"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Studio Admin</span>
          </Link>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="bg-amber-100/50 border-t border-amber-200/80 py-3 px-4 transition-all">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by painting, Lippan art, scented candles, resin..."
              className="w-full bg-white text-stone-900 placeholder-stone-400 border border-amber-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-700"
              autoFocus
            />
            <button
              type="submit"
              className="bg-amber-800 hover:bg-amber-700 text-amber-50 px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-amber-50 border-t border-amber-200 px-6 py-6 space-y-4">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-800 hover:text-amber-800"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-800 hover:text-amber-800"
          >
            Shop All Collection
          </Link>

          <div className="pt-2 border-t border-amber-200">
            <span className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-2 block">
              Categories
            </span>
            <div className="space-y-2 pl-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-800 py-1"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200 space-y-3">
            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-stone-700 hover:text-amber-800"
            >
              Track Order Status
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-emerald-700 font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Chat on WhatsApp (Artist Online)</span>
            </a>
            <Link
              href="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-xs text-amber-950 font-bold bg-amber-200 px-4 py-2 rounded border border-amber-300 text-center"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Owner / Admin Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

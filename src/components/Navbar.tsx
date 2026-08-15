'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-amber-50 border-b border-amber-900/30 shadow-md">
      {/* Top Banner */}
      <div className="bg-amber-950 text-amber-200 text-xs py-1.5 px-4 text-center tracking-wide font-light flex justify-between items-center max-w-7xl mx-auto">
        <span>✨ Free express shipping on orders over ₹1,999 across India</span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1 hover:text-emerald-400 transition"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Studio
        </a>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-stone-300 hover:text-amber-400"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-full bg-amber-800/60 border border-amber-500/30 flex items-center justify-center text-amber-300 font-serif font-bold text-lg group-hover:scale-105 transition">
              K
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-amber-100 group-hover:text-amber-400 transition">
                {settings.store_name}
              </span>
              <span className="text-[10px] text-amber-300/70 tracking-widest uppercase font-sans">Handmade Boutique</span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-200">
          <Link href="/" className="hover:text-amber-400 transition py-1 border-b-2 border-transparent hover:border-amber-400">
            Home
          </Link>
          <Link href="/shop" className="hover:text-amber-400 transition py-1 border-b-2 border-transparent hover:border-amber-400">
            Shop All
          </Link>

          {/* Dynamic Categories Dropdown */}
          <div className="relative group py-1">
            <button className="flex items-center gap-1 hover:text-amber-400 transition">
              Categories
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-stone-950 border border-amber-900/40 rounded-lg shadow-xl py-2 z-50">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-2 text-xs text-stone-300 hover:bg-amber-900/30 hover:text-amber-300 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/track-order" className="hover:text-amber-400 transition py-1 border-b-2 border-transparent hover:border-amber-400">
            Track Order
          </Link>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-stone-300 hover:text-amber-400 transition rounded-full hover:bg-stone-800/50"
            aria-label="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="p-2 text-stone-300 hover:text-amber-400 transition rounded-full hover:bg-stone-800/50 relative"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1 right-1 bg-amber-600 text-amber-100 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="p-2 text-stone-300 hover:text-amber-400 transition rounded-full hover:bg-stone-800/50 relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Admin Login Shortcut */}
          <Link
            href="/admin/login"
            className="hidden sm:flex items-center gap-1 text-xs text-amber-300/80 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/60 px-3 py-1.5 rounded-full border border-amber-800/50 transition"
          >
            <User className="w-3.5 h-3.5" /> Studio Admin
          </Link>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="bg-stone-950 border-t border-amber-900/30 py-3 px-4 transition-all">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by painting, Lippan art, scented candles, resin..."
              className="w-full bg-stone-900 text-amber-100 placeholder-stone-400 border border-amber-800/40 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-600 text-amber-50 px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-stone-950 border-t border-amber-900/30 px-6 py-6 space-y-4">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-200 hover:text-amber-400"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-200 hover:text-amber-400"
          >
            Shop All Collection
          </Link>

          <div className="pt-2 border-t border-stone-800">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2 block">
              Categories
            </span>
            <div className="space-y-2 pl-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm text-stone-300 hover:text-amber-300 py-1"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-stone-800 space-y-3">
            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-stone-300 hover:text-amber-400"
            >
              Track Order Status
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-emerald-400 font-medium"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
            <Link
              href="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs text-amber-300 bg-amber-950/80 px-4 py-2 rounded border border-amber-800/60 text-center"
            >
              Owner / Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

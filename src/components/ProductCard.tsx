'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isDiscounted = product.sale_price !== null && product.sale_price < product.price;
  const effectivePrice = isDiscounted ? product.sale_price : product.price;
  const discountPercent = isDiscounted ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;
  const isWishlisted = isInWishlist(product.id);
  const image = product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="group bg-stone-900/80 border border-stone-800 hover:border-amber-700/50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-950">
        <Link href={`/product/${product.slug}`}>
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.is_limited_edition === 1 && (
            <span className="bg-amber-900/90 text-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs uppercase tracking-wider">
              Limited Edition
            </span>
          )}
          {product.is_bestseller === 1 && (
            <span className="bg-emerald-950/90 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs uppercase tracking-wider">
              Bestseller
            </span>
          )}
          {product.is_made_to_order === 1 && (
            <span className="bg-stone-900/90 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
              Made to Order ({product.production_time_days || 5} days)
            </span>
          )}
          {product.stock > 0 && product.stock <= product.min_stock_alert && product.is_made_to_order === 0 && (
            <span className="bg-red-950/90 text-red-200 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
              Only {product.stock} Left
            </span>
          )}
          {product.stock === 0 && product.is_made_to_order === 0 && (
            <span className="bg-stone-900/90 text-stone-400 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition ${
            isWishlisted ? 'bg-amber-900/80 text-amber-400' : 'bg-black/40 text-stone-300 hover:text-amber-400'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[11px] text-amber-400/80 uppercase tracking-widest font-sans block">
            {product.category_name || 'Handmade Craft'}
          </span>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif font-medium text-stone-100 hover:text-amber-300 transition text-base line-clamp-2 mt-0.5">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating summary */}
        <div className="flex items-center gap-1.5 text-xs text-amber-400">
          <div className="flex items-center">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-bold">{Number(product.avg_rating || 5).toFixed(1)}</span>
          </div>
          <span className="text-stone-500 text-[11px]">({product.review_count || 1} reviews)</span>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-serif font-bold text-amber-200 font-mono">
                ₹{Number(effectivePrice).toLocaleString('en-IN')}
              </span>
              {isDiscounted && (
                <span className="text-xs line-through text-stone-500 font-mono">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {isDiscounted && (
              <span className="text-[10px] text-emerald-400 font-semibold">{discountPercent}% OFF</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0 && product.is_made_to_order === 0}
            className={`p-2.5 rounded-lg flex items-center gap-1 text-xs font-medium transition ${
              product.stock === 0 && product.is_made_to_order === 0
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                : 'bg-amber-800/80 hover:bg-amber-700 text-amber-100 shadow-md hover:shadow-amber-900/30'
            }`}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

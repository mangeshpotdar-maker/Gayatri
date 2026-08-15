'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag, Star, QrCode, MessageCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Review Form state
  const [revName, setRevName] = useState('');
  const [revEmail, setRevEmail] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revMsg, setRevMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, setRes] = await Promise.all([
          fetch(`/api/products?slug=${slug}`).then((r) => r.json()),
          fetch('/api/settings').then((r) => r.json())
        ]);

        if (prodRes.product) {
          const prod = prodRes.product;
          setProduct(prod);
          setSelectedImage(prod.images && prod.images.length > 0 ? prod.images[0] : '');

          // Fetch related products in same category
          if (prod.category_id) {
            const relRes = await fetch(`/api/products?category_id=${prod.category_id}&limit=4`).then((r) => r.json());
            if (relRes.products) {
              setRelatedProducts(relRes.products.filter((p: any) => p.id !== prod.id));
            }
          }

          // Fetch customer reviews
          const revRes = await fetch(`/api/reviews?product_id=${prod.id}`).then((r) => r.json());
          if (revRes.reviews) setReviews(revRes.reviews);
        }

        if (setRes.settings) setSettings(setRes.settings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revEmail || !revComment) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          customer_name: revName,
          customer_email: revEmail,
          rating: revRating,
          comment: revComment
        })
      }).then((r) => r.json());

      if (res.success) {
        setRevMsg('Thank you! Your review has been published.');
        setRevName('');
        setRevEmail('');
        setRevComment('');
        // Refresh reviews
        const revRes = await fetch(`/api/reviews?product_id=${product.id}`).then((r) => r.json());
        if (revRes.reviews) setReviews(revRes.reviews);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12 text-amber-200 font-serif">
          Loading handcrafted piece details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-2xl mx-auto text-center py-20 px-4 space-y-4">
          <h2 className="font-serif text-2xl text-amber-200">Handmade item not found.</h2>
          <Link href="/shop" className="inline-block bg-amber-800 text-amber-100 px-6 py-2.5 rounded-lg text-sm font-medium">
            Return to Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isDiscounted = product.sale_price !== null && product.sale_price < product.price;
  const effectivePrice = isDiscounted ? product.sale_price : product.price;
  const discountPercent = isDiscounted ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;
  const isWishlisted = isInWishlist(product.id);

  const productUrl = typeof window !== 'undefined' ? window.location.href : `https://kalakritiarts.in/product/${product.slug}`;
  const whatsappQueryUrl = `https://wa.me/${settings?.whatsapp_number || '919876543210'}?text=${encodeURIComponent(`Hello! I have a question about "${product.name}" (SKU: ${product.sku || 'N/A'}): ${productUrl}`)}`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb */}
        <div className="text-xs text-amber-400 font-mono flex items-center gap-2">
          <Link href="/" className="hover:underline">Home</Link> /
          <Link href="/shop" className="hover:underline">Shop</Link> /
          <Link href={`/category/${product.category_slug}`} className="hover:underline">{product.category_name}</Link> /
          <span className="text-stone-300 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Top Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 border border-amber-900/40 shadow-2xl">
              <img
                src={selectedImage || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="absolute bottom-3 right-3 bg-stone-950/90 hover:bg-amber-950 text-amber-300 p-2 rounded-lg border border-amber-700/50 flex items-center gap-1.5 text-xs font-mono shadow-md backdrop-blur-md transition"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Product QR</span>
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      selectedImage === img ? 'border-amber-500 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Info (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-mono">
                {product.category_name} • SKU: {product.sku || 'N/A'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-amber-100 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-amber-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 font-bold text-amber-200">
                    {Number(product.avg_rating || 5).toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-stone-500">| {reviews.length} Customer Reviews</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-xl flex items-baseline justify-between">
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-serif font-bold text-amber-200 font-mono">
                    ₹{Number(effectivePrice).toLocaleString('en-IN')}
                  </span>
                  {isDiscounted && (
                    <span className="text-lg line-through text-stone-500 font-mono">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400">Inclusive of all local taxes. Shipping calculated at checkout.</p>
              </div>

              {isDiscounted && (
                <span className="bg-emerald-950 border border-emerald-700/50 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Stock / Availability Banner */}
            <div className="space-y-2">
              {product.is_made_to_order === 1 ? (
                <div className="p-3 bg-amber-950/60 border border-amber-800/50 rounded-lg flex items-center gap-2 text-amber-300 text-xs">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Made to Order — Individually crafted and shipped in {product.production_time_days || '5-7'} days.</span>
                </div>
              ) : product.stock > 0 ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-lg flex items-center gap-2 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Ready to Ship — {product.stock <= product.min_stock_alert ? `Only ${product.stock} pieces remaining in stock!` : 'In stock & ready to dispatch in 24 hours.'}</span>
                </div>
              ) : (
                <div className="p-3 bg-red-950/60 border border-red-800/50 rounded-lg flex items-center gap-2 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Sold Out — Contact artist via WhatsApp for custom order requests.</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              {product.short_description || product.description}
            </p>

            {/* Purchase Action Controls */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity selector */}
                <div className="flex items-center border border-stone-800 bg-stone-900 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-400 hover:text-amber-300 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-mono font-bold text-amber-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-400 hover:text-amber-300 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock === 0 && product.is_made_to_order === 0}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition shadow-xl ${
                    product.stock === 0 && product.is_made_to_order === 0
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      : 'bg-amber-700 hover:bg-amber-600 text-amber-50 shadow-amber-950/80'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 border rounded-xl transition ${
                    isWishlisted ? 'bg-amber-900/60 border-amber-600 text-amber-400' : 'border-stone-800 text-stone-400 hover:text-amber-300 bg-stone-900'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-amber-400' : ''}`} />
                </button>
              </div>

              {/* Direct WhatsApp Query button */}
              <a
                href={whatsappQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" /> Ask Artist About This Product on WhatsApp
              </a>
            </div>

            {/* Product Specifications */}
            <div className="border-t border-stone-800 pt-6 space-y-3 text-xs text-stone-300">
              <h3 className="font-serif font-medium text-amber-200 text-sm">Product Specifications</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-stone-950/60 p-4 rounded-xl border border-stone-800/80">
                <div><span className="text-stone-500">Dimensions:</span> <span className="font-medium">{product.dimensions || 'Standard'}</span></div>
                <div><span className="text-stone-500">Weight:</span> <span className="font-medium">{product.weight || 'N/A'}</span></div>
                <div><span className="text-stone-500">Material:</span> <span className="font-medium">{product.material || 'Artisan Materials'}</span></div>
                <div><span className="text-stone-500">Color:</span> <span className="font-medium">{product.color || 'Multicolor'}</span></div>
                <div><span className="text-stone-500">Handmade Status:</span> <span className="font-medium">{product.is_handmade ? '100% Handcrafted' : 'Hand Finished'}</span></div>
                <div><span className="text-stone-500">Shipping Info:</span> <span className="font-medium">{product.shipping_info}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-amber-100">Creation Details & Artwork Story</h2>
          <p className="text-sm text-stone-300 leading-relaxed font-light whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <h2 className="font-serif text-2xl font-semibold text-amber-100">Customer Reviews ({reviews.length})</h2>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
              <span className="font-bold text-lg text-amber-200">{Number(product.avg_rating || 5).toFixed(1)}</span>
              <span className="text-xs text-stone-500 ml-1">out of 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Review List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No customer reviews yet. Be the first to leave a review!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-amber-200">{rev.customer_name}</span>
                      <span className="text-[10px] text-stone-500">{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Review Submission Form */}
            <div className="lg:col-span-5 bg-stone-950 p-6 rounded-xl border border-stone-800 space-y-4">
              <h3 className="font-serif font-medium text-amber-200 text-sm">Write a Customer Review</h3>
              {revMsg && <p className="text-xs text-emerald-400 font-semibold bg-emerald-950 p-2.5 rounded">{revMsg}</p>}

              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="e.g. Priyanshu Mehta"
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={revEmail}
                    onChange={(e) => setRevEmail(e.target.value)}
                    placeholder="e.g. priyanshu@example.com"
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Rating</label>
                  <select
                    value={revRating}
                    onChange={(e) => setRevRating(Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-amber-300 focus:outline-none focus:border-amber-600"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terrible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Your Feedback</label>
                  <textarea
                    required
                    rows={3}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="How was the craftsmanship, color accuracy, and packaging?"
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-800 hover:bg-amber-700 text-amber-100 py-2.5 rounded font-medium transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Dynamic Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <h2 className="font-serif text-2xl font-semibold text-amber-100">More Handcrafted Pieces</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Product QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="bg-stone-900 border border-amber-900/50 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-amber-100 text-lg">Scan Product QR</h3>
            <p className="text-xs text-stone-400">Scan to open this exact handmade artwork on any smartphone device.</p>

            <div className="bg-white p-4 rounded-xl inline-block border-2 border-amber-800">
              <img src={`/api/qr?url=${encodeURIComponent(productUrl)}`} alt="Product QR" className="w-48 h-48 mx-auto" />
            </div>

            <p className="text-[11px] text-amber-400 font-mono truncate">{product.name}</p>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 py-2 rounded-lg text-xs font-medium transition"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

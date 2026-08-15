'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, QrCode, Search, Image as ImageIcon, X } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<string>('');
  const [costPrice, setCostPrice] = useState<string>('');
  const [stock, setStock] = useState<number>(5);
  const [minStockAlert, setMinStockAlert] = useState<number>(2);
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [isHandmade, setIsHandmade] = useState(true);
  const [isMadeToOrder, setIsMadeToOrder] = useState(false);
  const [productionTimeDays, setProductionTimeDays] = useState(0);
  const [shippingInfo, setShippingInfo] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isLimitedEdition, setIsLimitedEdition] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  // QR Modal
  const [qrProduct, setQrProduct] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?is_active_only=false').then((r) => r.json()),
        fetch('/api/categories?includeHidden=true').then((r) => r.json())
      ]);
      if (prodRes.products) setProducts(prodRes.products);
      if (catRes.categories) setCategories(catRes.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (prod: any = null) => {
    if (prod) {
      setEditId(prod.id);
      setName(prod.name);
      setSlug(prod.slug);
      setSku(prod.sku || '');
      setCategoryId(prod.category_id || '');
      setPrice(prod.price);
      setSalePrice(prod.sale_price !== null ? String(prod.sale_price) : '');
      setCostPrice(prod.cost_price !== null ? String(prod.cost_price) : '');
      setStock(prod.stock);
      setMinStockAlert(prod.min_stock_alert);
      setDescription(prod.description || '');
      setShortDescription(prod.short_description || '');
      setDimensions(prod.dimensions || '');
      setWeight(prod.weight || '');
      setMaterial(prod.material || '');
      setColor(prod.color || '');
      setIsHandmade(Boolean(prod.is_handmade));
      setIsMadeToOrder(Boolean(prod.is_made_to_order));
      setProductionTimeDays(prod.production_time_days || 0);
      setShippingInfo(prod.shipping_info || '');
      setIsFeatured(Boolean(prod.is_featured));
      setIsNew(Boolean(prod.is_new));
      setIsBestseller(Boolean(prod.is_bestseller));
      setIsLimitedEdition(Boolean(prod.is_limited_edition));
      setIsActive(Boolean(prod.is_active));
      setImageUrls(prod.images && prod.images.length > 0 ? prod.images : ['']);
    } else {
      setEditId(null);
      setName('');
      setSlug('');
      setSku(`SKU-${Date.now().toString().slice(-6)}`);
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setPrice(1500);
      setSalePrice('');
      setCostPrice('');
      setStock(5);
      setMinStockAlert(2);
      setDescription('');
      setShortDescription('');
      setDimensions('');
      setWeight('');
      setMaterial('');
      setColor('');
      setIsHandmade(true);
      setIsMadeToOrder(false);
      setProductionTimeDays(0);
      setShippingInfo('Ships within 24-48 hours across India');
      setIsFeatured(false);
      setIsNew(true);
      setIsBestseller(false);
      setIsLimitedEdition(false);
      setIsActive(true);
      setImageUrls(['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800']);
    }
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editId,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      sku,
      category_id: categoryId,
      price: Number(price),
      sale_price: salePrice ? Number(salePrice) : null,
      cost_price: costPrice ? Number(costPrice) : null,
      stock: Number(stock),
      min_stock_alert: Number(minStockAlert),
      description,
      short_description: shortDescription,
      dimensions,
      weight,
      material,
      color,
      is_handmade: isHandmade,
      is_made_to_order: isMadeToOrder,
      production_time_days: Number(productionTimeDays),
      shipping_info: shippingInfo,
      is_featured: isFeatured,
      is_new: isNew,
      is_bestseller: isBestseller,
      is_limited_edition: isLimitedEdition,
      is_active: isActive,
      images: imageUrls.filter((url) => url.trim() !== '')
    };

    const method = editId ? 'PUT' : 'POST';
    await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setIsFormOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/30 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-amber-100">Product Management</h1>
            <p className="text-xs text-stone-400 mt-1">Manage single-artisan inventory, pricing, images and QR codes.</p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="bg-amber-700 hover:bg-amber-600 text-amber-50 px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <tbody className="divide-y divide-stone-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-800/40 transition">
                    <td className="p-4 w-16">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'}
                        alt=""
                        className="w-12 h-12 object-cover rounded-lg border border-amber-900/30"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-serif font-medium text-amber-100 text-sm">{p.name}</p>
                      <p className="text-[10px] text-stone-500 font-mono">SKU: {p.sku || 'N/A'} • Category: {p.category_name}</p>
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-200">
                      ₹{p.price}
                      {p.sale_price && <span className="text-[10px] text-emerald-400 block">Sale: ₹{p.sale_price}</span>}
                    </td>
                    <td className="p-4">
                      {p.is_made_to_order ? (
                        <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px]">
                          Made to Order ({p.production_time_days} days)
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.stock > p.min_stock_alert ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
                          Stock: {p.stock}
                        </span>
                      )}
                    </td>
                    <td className="p-4 space-x-2 text-right">
                      <button
                        onClick={() => setQrProduct(p)}
                        className="p-2 text-amber-400 hover:bg-stone-800 rounded-lg transition"
                        title="Generate Product QR"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenForm(p)}
                        className="p-2 text-stone-300 hover:text-amber-300 hover:bg-stone-800 rounded-lg transition"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-400 hover:bg-red-950/40 rounded-lg transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Product Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-stone-900 border border-amber-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h2 className="font-serif text-xl font-semibold text-amber-100">
                {editId ? 'Edit Artwork' : 'Add New Artwork'}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-stone-400 hover:text-amber-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-200"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-amber-200"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Sale Price (₹ Optional)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono text-amber-200"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Type *</label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="mto"
                        checked={!isMadeToOrder}
                        onChange={() => setIsMadeToOrder(false)}
                      />
                      <span>Ready-to-Ship</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="mto"
                        checked={isMadeToOrder}
                        onChange={() => setIsMadeToOrder(true)}
                      />
                      <span>Made to Order</span>
                    </label>
                  </div>
                </div>

                {!isMadeToOrder ? (
                  <div>
                    <label className="block text-stone-400 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-stone-400 mb-1">Production Time (Days)</label>
                    <input
                      type="number"
                      value={productionTimeDays}
                      onChange={(e) => setProductionTimeDays(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 font-mono"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 mb-1">Image URLs (One per line)</label>
                  <textarea
                    rows={3}
                    value={imageUrls.join('\n')}
                    onChange={(e) => setImageUrls(e.target.value.split('\n'))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="bg-stone-900 border border-amber-800 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <h3 className="font-serif font-bold text-amber-100 text-lg">Product QR Code</h3>
            <p className="text-xs text-stone-400">Scan or print this QR for exhibitions and catalogues.</p>
            <div className="bg-white p-4 rounded-xl inline-block border-2 border-amber-800">
              <img
                src={`/api/qr?url=${encodeURIComponent(`http://localhost:3000/product/${qrProduct.slug}`)}`}
                alt=""
                className="w-48 h-48 mx-auto"
              />
            </div>
            <p className="text-[11px] text-amber-300 font-mono truncate">{qrProduct.name}</p>
            <button onClick={() => setQrProduct(null)} className="w-full bg-stone-800 text-stone-200 py-2 rounded-lg text-xs">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

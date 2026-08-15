'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, Eye, EyeOff, Layers, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories?includeHidden=true').then((r) => r.json());
      if (res.categories) setCategories(res.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (cat: any = null) => {
    if (cat) {
      setEditId(cat.id);
      setName(cat.name);
      setSlug(cat.slug);
      setDescription(cat.description || '');
      setImageUrl(cat.image_url || '');
      setDisplayOrder(cat.display_order || 1);
      setIsHidden(Boolean(cat.is_hidden));
    } else {
      setEditId(null);
      setName('');
      setSlug('');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800');
      setDisplayOrder(categories.length + 1);
      setIsHidden(false);
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editId,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description,
      image_url: imageUrl,
      display_order: Number(displayOrder),
      is_hidden: isHidden
    };

    const method = editId ? 'PUT' : 'POST';
    await fetch('/api/categories', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setIsFormOpen(false);
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Products in this category will remain available.')) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    loadCategories();
  };

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/30 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-amber-100">Category Management</h1>
            <p className="text-xs text-stone-400 mt-1">
              Add, rename, reorder or hide craft categories. New categories instantly reflect on storefront.
            </p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="bg-amber-700 hover:bg-amber-600 text-amber-50 px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div key={c.id} className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden p-4 space-y-3 flex gap-4 items-center">
              <img
                src={c.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'}
                alt=""
                className="w-20 h-20 object-cover rounded-xl border border-amber-900/30 shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-amber-100 text-base truncate">{c.name}</h3>
                  {c.is_hidden === 1 && (
                    <span className="bg-stone-950 text-stone-500 border border-stone-800 text-[10px] px-1.5 py-0.5 rounded">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 line-clamp-2">{c.description || 'No description'}</p>
                <span className="text-[10px] text-amber-400 font-mono">
                  {c.product_count || 0} Products • Order: #{c.display_order}
                </span>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleOpenForm(c)}
                  className="p-2 text-stone-300 hover:text-amber-300 bg-stone-950 rounded-lg border border-stone-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 text-red-400 hover:bg-red-950/40 bg-stone-950 rounded-lg border border-stone-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="bg-stone-900 border border-amber-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h2 className="font-serif text-lg font-semibold text-amber-100">
                {editId ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-stone-400 hover:text-amber-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Terracotta Art"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Category Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-200 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                    <input
                      type="checkbox"
                      checked={isHidden}
                      onChange={(e) => setIsHidden(e.target.checked)}
                      className="accent-amber-600 rounded"
                    />
                    <span>Hide Category</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

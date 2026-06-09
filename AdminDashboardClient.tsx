// src/components/AdminDashboardClient.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Dish = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
  available: boolean;
  category: string;
};

const CATEGORIES = ['Main', 'Sides', 'Drinks', 'Specials'];

const EMPTY_FORM = {
  name: '',
  price: '',
  description: '',
  category: 'Main',
  available: true,
  imageUrl: '',
};

export default function AdminDashboardClient({
  initialDishes,
}: {
  initialDishes: Dish[];
}) {
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Dish name is required.';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = 'Enter a valid price (UGX).';
    return e;
  }

  function openAddForm() {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setEditId(null);
    setErrors({});
    setShowForm(true);
    setTimeout(() => document.getElementById('form-name')?.focus(), 100);
  }

  function openEditForm(dish: Dish) {
    setForm({
      name: dish.name,
      price: String(dish.price),
      description: dish.description,
      category: dish.category,
      available: dish.available,
      imageUrl: dish.imageUrl ?? '',
    });
    setImageFile(null);
    setImagePreview(dish.imageUrl ?? '');
    setEditId(dish.id);
    setErrors({});
    setShowForm(true);
    setTimeout(() => document.getElementById('form-name')?.focus(), 100);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image must be under 5MB.' }));
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      let imageUrl = form.imageUrl;

      // Upload image if a new file was selected
      if (imageFile) {
        const fd = new FormData();
        fd.append('file', imageFile);
        const uploadRes = await fetch('/api/dishes/upload', {
          method: 'POST',
          body: fd,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        category: form.category,
        available: form.available,
        imageUrl: imageUrl || null,
      };

      let res: Response;
      if (editId !== null) {
        res = await fetch(`/api/dishes/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/dishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const d = await res.json();
        setErrors({ general: d.error || 'Failed to save. Try again.' });
        return;
      }

      const saved: Dish = await res.json();

      if (editId !== null) {
        setDishes((prev) => prev.map((d) => (d.id === editId ? saved : d)));
        showToast('✅ Dish updated!');
      } else {
        setDishes((prev) => [...prev, saved]);
        showToast('✅ Dish added!');
      }

      setShowForm(false);
      router.refresh();
    } catch {
      setErrors({ general: 'Network error. Check your connection.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/dishes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDishes((prev) => prev.filter((d) => d.id !== id));
        setConfirmDelete(null);
        showToast('🗑️ Dish deleted.');
        router.refresh();
      }
    } catch {
      showToast('Failed to delete. Try again.');
    }
  }

  async function toggleAvailable(dish: Dish) {
    try {
      const res = await fetch(`/api/dishes/${dish.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dish, available: !dish.available }),
      });
      if (res.ok) {
        const updated: Dish = await res.json();
        setDishes((prev) => prev.map((d) => (d.id === dish.id ? updated : d)));
        showToast(updated.available ? '✅ Now available' : '⏸️ Marked unavailable');
      }
    } catch {
      showToast('Failed to update. Try again.');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const filtered =
    filterCat === 'All' ? dishes : dishes.filter((d) => d.category === filterCat);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white
                        text-sm font-medium px-5 py-3 rounded-full shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="bg-[#D32F2F] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
          <div>
            <span className="font-bold text-sm" style={{ fontFamily: 'Oswald, serif' }}>
              🍗 MIKANDO ADMIN
            </span>
            <span className="ml-2 text-xs text-white/70 hidden sm:inline">
              {dishes.length} dishes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-white/80 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20
                         transition-colors"
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="text-white/80 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20
                         transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Top controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-semibold rounded-full transition-colors
                  ${
                    filterCat === cat
                      ? 'bg-[#D32F2F] text-white'
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
              >
                {cat}{' '}
                <span className="opacity-70 text-xs">
                  ({cat === 'All' ? dishes.length : dishes.filter((d) => d.category === cat).length})
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={openAddForm}
            className="flex-shrink-0 bg-[#D32F2F] text-white font-bold px-5 py-3 rounded-xl
                       active:bg-[#B71C1C] transition-colors text-sm"
          >
            + Add New Dish
          </button>
        </div>

        {/* Dishes list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🍗</p>
            <p>No dishes yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((dish) => (
              <div
                key={dish.id}
                className={`bg-white rounded-2xl border p-4 flex items-start gap-3 shadow-sm
                  ${!dish.available ? 'opacity-60' : ''}`}
              >
                {/* Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {dish.imageUrl ? (
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                      🍗
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight">{dish.name}</p>
                      <p className="text-[#D32F2F] font-semibold text-sm">
                        UGX {dish.price.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full
                        ${dish.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {dish.available ? 'On Menu' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{dish.description}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                      {dish.category}
                    </span>
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openEditForm(dish)}
                      className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg
                                 text-gray-700 active:bg-gray-100 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => toggleAvailable(dish)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors
                        ${
                          dish.available
                            ? 'border border-orange-200 text-orange-600 active:bg-orange-50'
                            : 'border border-green-200 text-green-600 active:bg-green-50'
                        }`}
                    >
                      {dish.available ? '⏸ Hide' : '▶ Show'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(dish.id)}
                      className="px-3 py-1.5 text-xs font-semibold border border-red-200 rounded-lg
                                 text-red-600 active:bg-red-50 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── ADD / EDIT FORM MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl
                        max-h-[95vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100
                            rounded-t-3xl sm:rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Oswald, serif' }}>
                  {editId !== null ? 'EDIT DISH' : 'ADD NEW DISH'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 text-xl p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {errors.general && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl flex gap-2">
                  <span>⚠️</span>
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="form-label" htmlFor="form-name">
                  Dish Name *
                </label>
                <input
                  id="form-name"
                  type="text"
                  className={`form-input ${errors.name ? 'border-red-400' : ''}`}
                  placeholder="e.g. Chips Chicken"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Price + Category row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label" htmlFor="form-price">
                    Price (UGX) *
                  </label>
                  <input
                    id="form-price"
                    type="number"
                    inputMode="numeric"
                    className={`form-input ${errors.price ? 'border-red-400' : ''}`}
                    placeholder="12000"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="form-category">
                    Category
                  </label>
                  <select
                    id="form-category"
                    className="form-input"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label" htmlFor="form-desc">
                  Description
                </label>
                <textarea
                  id="form-desc"
                  rows={3}
                  className="form-input resize-none"
                  placeholder="Describe the dish..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="form-label">Dish Photo</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center
                             cursor-pointer active:border-[#D32F2F] transition-colors"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                    </div>
                  ) : (
                    <div className="py-4">
                      <p className="text-3xl mb-2">📷</p>
                      <p className="text-gray-500 text-sm">Tap to upload photo</p>
                      <p className="text-gray-400 text-xs mt-1">Max 5MB · JPG, PNG</p>
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setForm((f) => ({ ...f, imageUrl: '' }));
                    }}
                    className="text-xs text-red-500 mt-1"
                  >
                    Remove photo
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              </div>

              {/* Available toggle */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="font-semibold text-sm text-gray-900">Show on menu</p>
                  <p className="text-xs text-gray-500">Visible to customers</p>
                </div>
                <button
                  onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
                  className={`relative w-12 h-6 rounded-full transition-colors
                    ${form.available ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                                transition-transform ${form.available ? 'translate-x-6' : ''}`}
                  />
                </button>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-[#D32F2F] text-white font-bold text-lg rounded-xl
                           active:bg-[#B71C1C] transition-colors disabled:opacity-60
                           flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="spinner" />
                    Saving...
                  </>
                ) : editId !== null ? (
                  'Save Changes'
                ) : (
                  'Add Dish'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <p className="text-4xl text-center mb-3">🗑️</p>
            <h3 className="font-bold text-lg text-center text-gray-900 mb-2">Delete this dish?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              This will remove it from your menu. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold
                           active:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold
                           active:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

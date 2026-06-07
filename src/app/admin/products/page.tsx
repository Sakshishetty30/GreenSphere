"use client";

import React, { useState } from "react";
import { useApp, Product } from "@/context/AppContext";
import { Plus, Edit2, Trash2, X, Sparkles, FolderPlus, FileEdit } from "lucide-react";

export default function AdminProductsPage() {
  const { products, addAdminProduct, updateAdminProduct, deleteAdminProduct } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditProduct, setCurrentEditProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    price: 99.00,
    category: "Rare Plants",
    description: "",
    details: "",
    sunlight: "Medium Indirect",
    water: "Every 7 Days",
    temperature: "18°C - 26°C",
    difficulty: "Easy" as Product["difficulty"],
    size: "Medium" as Product["size"],
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800",
    glowColor: "rgba(163, 255, 18, 0.35)",
    variants: ["Ceramic Glass Pod", "Biopolymer Planter"]
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAdminProduct({
      name: formData.name,
      scientificName: formData.scientificName,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      details: formData.details,
      sunlight: formData.sunlight,
      water: formData.water,
      temperature: formData.temperature,
      difficulty: formData.difficulty,
      size: formData.size,
      stock: Number(formData.stock),
      imageUrl: formData.imageUrl,
      glowColor: formData.glowColor,
      variants: formData.variants
    });
    setShowAddModal(false);
    resetForm();
  };

  const handleEditClick = (p: Product) => {
    setCurrentEditProduct(p);
    setFormData({
      name: p.name,
      scientificName: p.scientificName,
      price: p.price,
      category: p.category,
      description: p.description,
      details: p.details || "",
      sunlight: p.sunlight,
      water: p.water,
      temperature: p.temperature,
      difficulty: p.difficulty,
      size: p.size,
      stock: p.stock,
      imageUrl: p.imageUrl,
      glowColor: p.glowColor || "rgba(163, 255, 18, 0.35)",
      variants: p.variants
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditProduct) return;

    updateAdminProduct(currentEditProduct.id, {
      name: formData.name,
      scientificName: formData.scientificName,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      details: formData.details,
      sunlight: formData.sunlight,
      water: formData.water,
      temperature: formData.temperature,
      difficulty: formData.difficulty,
      size: formData.size,
      stock: Number(formData.stock),
      imageUrl: formData.imageUrl,
      glowColor: formData.glowColor,
      variants: formData.variants
    });
    setShowEditModal(false);
    setCurrentEditProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      scientificName: "",
      price: 99.00,
      category: "Rare Plants",
      description: "",
      details: "",
      sunlight: "Medium Indirect",
      water: "Every 7 Days",
      temperature: "18°C - 26°C",
      difficulty: "Easy",
      size: "Medium",
      stock: 10,
      imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800",
      glowColor: "rgba(163, 255, 18, 0.35)",
      variants: ["Ceramic Glass Pod", "Biopolymer Planter"]
    });
  };

  const categories = ["Rare Plants", "Bonsai", "Air Purifying", "Succulents", "Indoor Plants"];

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-border-subtle/50 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-txt-white tracking-tight">Inventory Management</h1>
          <p className="text-xs text-txt-muted font-mono uppercase tracking-wider text-accent-neon">Stock control & specifications portal</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 text-xs font-bold bg-accent-neon text-bg-deep rounded-xl hover:bg-accent-lime transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.25)]"
        >
          <Plus className="w-4 h-4" /> Add Product Node
        </button>
      </div>

      {/* Products table */}
      <div className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-border-subtle text-txt-muted uppercase text-[9px] tracking-wider">
                <th className="py-2.5 pl-3">Specimen Strain</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5 text-right">Price</th>
                <th className="py-2.5 text-right">Inventory Stock</th>
                <th className="py-2.5 text-right">Telemetry Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-txt-gray">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-bg-sec-dark/40">
                  <td className="py-3 pl-3 flex gap-3 items-center min-w-0">
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-txt-white block truncate">{p.name}</span>
                      <span className="text-[10px] text-txt-muted italic truncate block">{p.scientificName}</span>
                    </div>
                  </td>
                  <td className="py-3">{p.category}</td>
                  <td className="py-3 text-right text-accent-neon font-bold">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="py-3 text-right font-bold">{p.stock} units</td>
                  <td className="py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-1.5 rounded-lg border border-border-subtle hover:border-accent-neon hover:text-accent-neon transition-colors"
                        title="Edit Specimen Specifications"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAdminProduct(p.id)}
                        className="p-1.5 rounded-lg border border-border-subtle hover:border-red-400 hover:text-red-400 transition-colors"
                        title="Delete Specimen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODALS SKELETON FORM */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 bg-bg-deep/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full glass-card border border-border-subtle bg-bg-sec-dark p-6 rounded-2xl shadow-2xl space-y-6 text-left relative my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-txt-white flex items-center gap-1.5">
                {showAddModal ? <FolderPlus className="w-4.5 h-4.5 text-accent-neon" /> : <FileEdit className="w-4.5 h-4.5 text-accent-neon" />}
                {showAddModal ? "Register New Biological Specimen" : "Edit Specimen Specifications"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setCurrentEditProduct(null);
                }}
                className="p-1 rounded hover:bg-bg-sec-light text-txt-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Specimen Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Verdant Nexus V12"
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Scientific Hybrid Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.scientificName}
                    onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                    placeholder="Monstera Hybrid-V12"
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Acquisition Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Category Classification
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-bg-deep text-txt-gray"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Stock Inventory Limit
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  SaaS Short Slogan / Description
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A genetically stabilized Monstera boasting bio-luminescent neon variegation."
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  Full Technical details
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Provide botanical characteristics, carbon scrub ratios, sensor specs..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              {/* Care specifications */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Sunlight Parameter
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sunlight}
                    onChange={(e) => setFormData({ ...formData, sunlight: e.target.value })}
                    placeholder="Filtered Bright Indirect"
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Hydration Frequency
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.water}
                    onChange={(e) => setFormData({ ...formData, water: e.target.value })}
                    placeholder="Every 7 Days"
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Thermal Bounds
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="18°C - 28°C"
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Care Difficulty Index
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-bg-deep text-txt-gray"
                  >
                    <option value="Easy">Easy Care</option>
                    <option value="Medium">Medium Care</option>
                    <option value="Hard">Hard Care</option>
                    <option value="Expert">Expert Cultivation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Acquisition Vector Image URL
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono"
                  />
                </div>
              </div>

              {/* SEO parameters (Mocked) */}
              <div className="p-3 rounded-xl border border-border-subtle bg-bg-deep space-y-1">
                <span className="text-[9px] font-mono text-accent-neon uppercase tracking-wider">🧬 Admin SEO Indexing</span>
                <p className="text-[10px] text-txt-muted leading-relaxed">
                  SEO meta description & key tags will automatically index into the sitemap dynamically when changes synchronize.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(163,255,18,0.2)]"
              >
                Sync Specs to Ledger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

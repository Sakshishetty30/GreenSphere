"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Search, Heart, ShoppingCart, SlidersHorizontal, Eye, Star, X } from "lucide-react";
import Link from "next/link";

function SearchProductsContent() {
  const { products, addToCart, wishlist, toggleWishlist } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search and Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [size, setSize] = useState("All");
  const [sort, setSort] = useState("rating"); // rating, price-asc, price-desc
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>({});

  const getProductQty = (id: string) => cardQuantities[id] || 1;
  const setProductQty = (id: string, qty: number) => {
    setCardQuantities(prev => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  // Sync with search URL param
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearch(query);
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
    const diff = searchParams.get("difficulty");
    if (diff) setDifficulty(diff);
  }, [searchParams]);

  // Clean URL search when search input is cleared
  const handleSearchChange = (val: string) => {
    setSearch(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.replace(`/products?${params.toString()}`);
  };

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || p.category === category;
    const matchesDifficulty = difficulty === "All" || p.difficulty === difficulty;
    const matchesSize = size === "All" || p.size === size;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesSize;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return b.rating - a.rating; // default: high ratings
  });

  const categories = ["All", "Rare Plants", "Bonsai", "Air Purifying", "Succulents", "Indoor Plants"];
  const difficulties = ["All", "Easy", "Medium", "Hard", "Expert"];
  const sizes = ["All", "Small", "Medium", "Large", "Huge"];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
      {/* Header Title */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl font-extrabold text-txt-white tracking-tight">Botanical Inventory</h1>
        <p className="text-xs text-txt-muted">
          Purchase premium bio-sensory specimens engineered for modern architectural spaces.
        </p>
      </div>

      {/* Top Search and Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search biological catalog..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
          />
          <Search className="w-4.5 h-4.5 text-txt-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden px-4 py-2.5 rounded-xl border border-border-subtle bg-bg-sec-dark text-xs font-semibold text-txt-white flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 text-xs rounded-xl border border-border-subtle bg-bg-sec-dark text-txt-gray focus:outline-none focus:border-accent-neon font-semibold cursor-pointer"
          >
            <option value="rating">Sort: High Rating</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* LEFT COLUMN: FILTERS (DESKTOP) */}
        <aside className="hidden md:block space-y-6 text-left border-r border-border-subtle/50 pr-6">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <span className="text-xs font-bold text-txt-white font-mono uppercase tracking-wider">Tele-Filters</span>
            <button
              onClick={() => {
                setCategory("All");
                setDifficulty("All");
                setSize("All");
                handleSearchChange("");
              }}
              className="text-[10px] text-accent-neon hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-txt-muted font-mono tracking-wider">Classifications</h4>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs text-left py-1 px-2.5 rounded-lg transition-colors font-medium cursor-pointer ${
                    category === cat
                      ? "text-accent-neon bg-accent-neon/5 font-semibold"
                      : "text-txt-muted hover:text-txt-white hover:bg-bg-sec-dark"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-txt-muted font-mono tracking-wider">Care Telemetry</h4>
            <div className="flex flex-col gap-1.5">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`text-xs text-left py-1 px-2.5 rounded-lg transition-colors font-medium cursor-pointer ${
                    difficulty === diff
                      ? "text-accent-neon bg-accent-neon/5 font-semibold"
                      : "text-txt-muted hover:text-txt-white hover:bg-bg-sec-dark"
                  }`}
                >
                  {diff} Care
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-txt-muted font-mono tracking-wider">Growth Size</h4>
            <div className="flex flex-col gap-1.5">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSize(sz)}
                  className={`text-xs text-left py-1 px-2.5 rounded-lg transition-colors font-medium cursor-pointer ${
                    size === sz
                      ? "text-accent-neon bg-accent-neon/5 font-semibold"
                      : "text-txt-muted hover:text-txt-white hover:bg-bg-sec-dark"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MOBILE FILTERS MODAL */}
        {showFiltersMobile && (
          <div className="fixed inset-0 z-50 bg-bg-deep/90 backdrop-blur-md p-6 flex flex-col justify-between md:hidden">
            <div className="space-y-6 overflow-y-auto pr-2">
              <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
                <span className="text-sm font-bold text-txt-white font-mono uppercase tracking-wider">Tele-Filters</span>
                <button onClick={() => setShowFiltersMobile(false)} className="p-1 rounded bg-bg-sec-dark text-txt-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Classifications */}
              <div className="space-y-2 text-left">
                <h4 className="text-[10px] uppercase font-bold text-accent-neon font-mono tracking-wider">Classifications</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        category === cat
                          ? "bg-accent-neon border-accent-neon text-bg-deep font-semibold"
                          : "border-border-subtle text-txt-muted bg-bg-sec-dark"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-2 text-left">
                <h4 className="text-[10px] uppercase font-bold text-accent-neon font-mono tracking-wider">Care Telemetry</h4>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        difficulty === diff
                          ? "bg-accent-neon border-accent-neon text-bg-deep font-semibold"
                          : "border-border-subtle text-txt-muted bg-bg-sec-dark"
                      }`}
                    >
                      {diff} Care
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="space-y-2 text-left">
                <h4 className="text-[10px] uppercase font-bold text-accent-neon font-mono tracking-wider">Growth Size</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSize(sz)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        size === sz
                          ? "bg-accent-neon border-accent-neon text-bg-deep font-semibold"
                          : "border-border-subtle text-txt-muted bg-bg-sec-dark"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFiltersMobile(false)}
              className="w-full py-3 mt-4 text-xs font-bold bg-accent-neon text-bg-deep rounded-xl"
            >
              Apply Filter Ratios
            </button>
          </div>
        )}

        {/* RIGHT COLUMN: PRODUCT GRID */}
        <main className="md:col-span-3 space-y-8">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 border border-border-subtle/50 rounded-2xl glass-card space-y-4">
              <span className="text-3xl">🏜️</span>
              <h3 className="text-sm font-semibold text-txt-white">No Specimen Matches</h3>
              <p className="text-xs text-txt-muted max-w-xs mx-auto">
                We couldn't find matching biological strains. Reset filters or modify your queries.
              </p>
              <button
                onClick={() => {
                  setCategory("All");
                  setDifficulty("All");
                  setSize("All");
                  handleSearchChange("");
                }}
                className="px-4 py-2 text-xs font-bold bg-accent-neon text-bg-deep rounded-xl hover:bg-accent-lime"
              >
                Reset Configuration
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((p) => {
                const isWish = wishlist.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card glass-card-hover overflow-hidden flex flex-col group text-left"
                  >
                    {/* Image block */}
                    <div className="relative aspect-square w-full bg-bg-deep overflow-hidden">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-2 rounded-xl bg-bg-deep/80 hover:bg-bg-deep border border-border-subtle hover:border-accent-neon text-txt-muted hover:text-accent-neon transition-colors cursor-pointer"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWish ? "fill-accent-neon text-accent-neon" : ""}`} />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-bg-deep/80 border border-border-subtle text-[9px] font-mono text-accent-neon uppercase">
                        {p.difficulty} Care
                      </div>
                      {p.stock === 0 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded border border-red-400 z-10 shadow-lg">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Info block */}
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-txt-muted font-mono uppercase">{p.category}</span>
                          <span className="text-xs font-bold text-accent-neon font-mono">₹{p.price.toLocaleString("en-IN")}</span>
                        </div>
                        <Link href={`/products/${p.id}`} className="block">
                          <h3 className="text-sm font-semibold text-txt-white hover:text-accent-neon transition-colors truncate">
                            {p.name}
                          </h3>
                        </Link>
                        <p className="text-[11px] text-txt-muted font-mono italic truncate">{p.scientificName}</p>
                      </div>

                      {/* Ratings */}
                      <div className="flex items-center gap-1">
                        <div className="flex text-accent-neon">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(p.rating) ? "fill-accent-neon" : "opacity-30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-txt-muted font-mono">({p.reviewsCount})</span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex gap-2 items-center justify-between pb-1 font-mono text-[10px]">
                        <span className="text-txt-muted uppercase font-bold">Qty</span>
                        <div className="flex items-center rounded-lg border border-border-subtle bg-bg-deep overflow-hidden h-7">
                          <button
                            onClick={() => setProductQty(p.id, getProductQty(p.id) - 1)}
                            className="px-2.5 h-full hover:bg-bg-sec-light text-txt-muted hover:text-txt-white text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-txt-white">{getProductQty(p.id)}</span>
                          <button
                            onClick={() => setProductQty(p.id, getProductQty(p.id) + 1)}
                            className="px-2.5 h-full hover:bg-bg-sec-light text-txt-muted hover:text-txt-white text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${p.id}`}
                          className="p-2.5 rounded-xl border border-border-subtle hover:border-accent-neon/30 bg-bg-sec-dark hover:bg-bg-sec-light text-txt-muted hover:text-txt-white transition-colors flex items-center justify-center"
                          title="Quick View Specimen"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {p.stock > 0 ? (
                          <button
                            onClick={() => {
                              addToCart(p, getProductQty(p.id), p.variants[0]);
                              router.push("/checkout");
                            }}
                            className="flex-grow py-2 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(163,255,18,0.15)]"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Buy Now
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`Alert: ${p.name} is out of stock. We will notify you when it is back in stock!`)}
                            className="flex-grow py-2 text-xs font-bold rounded-xl bg-bg-sec-light text-txt-muted border border-border-subtle hover:text-white hover:border-red-500/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Notify Me
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-xs font-mono text-txt-muted">Syncing Botanical Registry...</div>}>
      <SearchProductsContent />
    </Suspense>
  );
}

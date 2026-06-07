"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Heart, ShoppingCart, Trash2, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { wishlist, products, addToCart, toggleWishlist } = useApp();
  const router = useRouter();
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>({});

  const getProductQty = (id: string) => cardQuantities[id] || 1;
  const setProductQty = (id: string, qty: number) => {
    setCardQuantities(prev => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  // Items to recommend if wishlist is empty
  const recommendations = products.slice(0, 3);

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-border-subtle/50">
        <h1 className="text-2xl font-extrabold text-txt-white tracking-tight flex items-center gap-2">
          <Heart className="w-6.5 h-6.5 text-accent-neon fill-accent-neon" /> Saved Wishlist Strains
        </h1>
        <p className="text-xs text-txt-muted">Review biological specimens you have earmarked for future integration.</p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="space-y-10">
          <div className="text-center py-16 border border-border-subtle/50 rounded-2xl glass-card space-y-4">
            <span className="text-3xl">🤍</span>
            <h3 className="text-sm font-semibold text-txt-white">Wishlist registry empty</h3>
            <p className="text-xs text-txt-muted max-w-sm mx-auto">
              You haven't tagged any botanical strains. Browse the boutique to start saving specimens.
            </p>
            <Link
              href="/products"
              className="inline-block px-5 py-2.5 bg-accent-neon text-bg-deep rounded-xl text-xs font-bold shadow-[0_0_12px_rgba(163,255,18,0.2)]"
            >
              Access Boutique
            </Link>
          </div>

          {/* Quick Recommendations */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-accent-neon">
              Trending Cultivation Strains
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-4 flex flex-col justify-between text-left space-y-4"
                >
                  <img src={p.imageUrl} alt={p.name} className="w-full aspect-video object-cover rounded-xl border border-border-subtle" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-txt-white truncate">{p.name}</h4>
                    <p className="text-[10px] text-txt-muted font-mono italic truncate">{p.scientificName}</p>
                    <span className="text-xs font-bold text-accent-neon font-mono">₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                  <Link
                    href={`/products/${p.id}`}
                    className="w-full py-2 text-center text-[10px] font-bold rounded-lg bg-bg-sec-light border border-border-subtle hover:border-accent-neon text-txt-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card overflow-hidden flex flex-col group"
            >
              {/* Image */}
              <div className="relative aspect-video w-full bg-bg-deep overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-bg-deep/80 hover:bg-bg-deep border border-border-subtle hover:border-red-400 text-accent-neon hover:text-red-400 transition-colors cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-txt-muted font-mono uppercase">{p.category}</span>
                    <span className="text-xs font-bold text-accent-neon font-mono">₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                  <Link href={`/products/${p.id}`} className="font-bold text-xs text-txt-white hover:text-accent-neon block truncate">
                    {p.name}
                  </Link>
                  <p className="text-[10px] text-txt-muted font-mono italic truncate">{p.scientificName}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex text-accent-neon">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-accent-neon" />
                    ))}
                  </div>
                  <span className="text-[9px] text-txt-muted font-mono">({p.reviewsCount})</span>
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

                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/products/${p.id}`}
                    className="px-3.5 py-2 text-center text-xs font-semibold rounded-xl border border-border-subtle bg-bg-sec-dark hover:bg-bg-sec-light text-txt-gray transition-colors flex items-center justify-center"
                  >
                    View Specs
                  </Link>
                  <button
                    onClick={() => {
                      addToCart(p, getProductQty(p.id), p.variants[0]);
                      router.push("/checkout");
                    }}
                    className="flex-grow py-2 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

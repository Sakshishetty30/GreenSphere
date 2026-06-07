"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp, Product } from "@/context/AppContext";
import { 
  Heart, ShoppingCart, Star, ArrowLeft, Sun, Droplet, 
  Thermometer, ShieldAlert, Sparkles, RefreshCcw, Compass,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart, wishlist, toggleWishlist } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");
  const [is360Mode, setIs360Mode] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0); // 360 simulator angle
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const found = products.find(p => p.id === id);
      if (found) {
        setProduct(found);
        setSelectedVariant(found.variants[0]);
      }
    }
  }, [id, products]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 text-center space-y-4">
        <span className="text-3xl">🔍</span>
        <h3 className="text-sm font-semibold text-txt-white">Specimen Node Not Found</h3>
        <p className="text-xs text-txt-muted">The requested biological node signature could not be verified.</p>
        <Link href="/products" className="inline-block px-4 py-2 bg-accent-neon text-bg-deep rounded-xl text-xs font-semibold">
          Return to Boutique
        </Link>
      </div>
    );
  }

  const isWish = wishlist.includes(product.id);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  // Drag interaction for 360 preview
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!is360Mode) return;
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !is360Mode) return;
    const diffX = e.clientX - startX;
    setRotationAngle(prev => (prev + diffX * 0.5 + 360) % 360);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Pre-coded mock reviews
  const mockReviews = [
    { name: "Astrid Finch", rating: 5, date: "2026-04-12", comment: "Outstanding variegation. Arrived in a heated nitrogen pod, roots were perfectly hydrated. Telemetry synced instantly." },
    { name: "Barton W.", rating: 4, date: "2026-03-29", comment: "Beautiful specimen. Requires slightly more micro-mist than standard calatheas, but the color cycling is spectacular." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
      {/* Back Button */}
      <div className="text-left">
        <button
          onClick={() => router.back()}
          className="text-xs text-txt-muted hover:text-accent-neon transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </button>
      </div>

      {/* Main product configuration block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Gallery & 360 rotation simulator */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`relative aspect-square w-full rounded-3xl border border-border-subtle overflow-hidden flex items-center justify-center p-6 bg-bg-sec-dark/40 glass-card shadow-2xl select-none ${
              is360Mode ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            {/* Ambient Glow */}
            <div 
              className="absolute inset-20 rounded-full blur-[80px] opacity-40 pointer-events-none" 
              style={{ backgroundColor: product.glowColor || "rgba(163, 255, 18, 0.4)" }}
            />

            {/* Product image (simulated angle change using CSS scale / rotate / translate) */}
            <img
              src={product.imageUrl}
              alt={product.name}
              draggable={false}
              className="w-full h-full object-cover rounded-2xl opacity-90 transition-transform duration-100"
              style={{
                transform: is360Mode 
                  ? `rotate(${rotationAngle}deg) scale(${1 + Math.sin((rotationAngle * Math.PI) / 180) * 0.05})`
                  : "none"
              }}
            />

            {/* Compass / Angle status overlay in 360 mode */}
            {is360Mode && (
              <div className="absolute top-4 left-4 bg-bg-deep/80 border border-border-subtle p-2 rounded-xl text-left font-mono text-[9px] text-accent-neon pointer-events-none space-y-1">
                <div className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> <span>360° TELEMETRY</span>
                </div>
                <div>Angle: {Math.round(rotationAngle)}°</div>
              </div>
            )}

            {/* Toggle 360 Preview Mode */}
            <button
              onClick={() => {
                setIs360Mode(!is360Mode);
                setRotationAngle(0);
              }}
              className={`absolute bottom-4 right-4 px-3.5 py-2 text-[10px] uppercase font-bold font-mono tracking-wider rounded-xl border flex items-center gap-1.5 cursor-pointer transition-all ${
                is360Mode
                  ? "bg-accent-neon text-bg-deep border-accent-neon shadow-[0_0_12px_rgba(163,255,18,0.3)]"
                  : "bg-bg-deep/80 border-border-subtle text-txt-muted hover:text-txt-white"
              }`}
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${isDragging ? "animate-spin" : ""}`} />
              {is360Mode ? "Standard Specimen" : "360° Spin"}
            </button>
          </div>
          {is360Mode && (
            <p className="text-[10px] text-txt-muted font-mono text-center">
              Drag left/right over the specimen to rotate vector coordinates.
            </p>
          )}
        </div>

        {/* RIGHT COLUMN: Custom specs & Add-to-cart */}
        <div className="lg:col-span-6 text-left space-y-8 flex flex-col justify-center">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-accent-neon font-mono uppercase tracking-widest bg-accent-neon/5 px-2.5 py-0.5 rounded border border-accent-neon/15">
                {product.category} Specimen
              </span>
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex text-accent-neon">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 fill-accent-neon`} />
                  ))}
                </div>
                <span className="text-[11px] text-txt-muted font-mono">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-txt-white tracking-tight leading-tight">{product.name}</h1>
            <p className="text-xs text-txt-muted italic font-mono">{product.scientificName}</p>
          </div>

          <div className="text-2xl font-black text-accent-neon font-mono flex items-center gap-3">
            ₹{product.price.toLocaleString("en-IN")}
            {product.stock === 0 && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-md border border-red-500/30 uppercase tracking-wider font-bold">Out of Stock</span>
            )}
          </div>

          <p className="text-xs text-txt-muted leading-relaxed">
            {product.description}
          </p>

          {/* Form Actions */}
          <div className="space-y-4 pt-4 border-t border-border-subtle">
            {/* Variant Select */}
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                Acquisition Vessel Pod
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-subtle bg-bg-sec-dark text-txt-white focus:outline-none focus:border-accent-neon font-semibold flex items-center justify-between cursor-pointer transition-all duration-300"
              >
                <span>{selectedVariant}</span>
                <ChevronDown 
                  className={`w-4 h-4 text-accent-neon transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`} 
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 z-30 rounded-xl border border-border-subtle bg-bg-deep/95 backdrop-blur-xl shadow-2xl overflow-hidden py-1">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        setSelectedVariant(v);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                        selectedVariant === v
                          ? "bg-accent-neon/15 text-accent-neon"
                          : "text-txt-gray hover:bg-bg-sec-light hover:text-txt-white"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity Selector & Purchase buttons */}
            <div className="flex gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  Qty
                </label>
                <div className={`flex items-center rounded-xl border border-border-subtle bg-bg-sec-dark overflow-hidden h-[42px] ${product.stock === 0 ? 'opacity-50' : ''}`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock === 0}
                    className="px-3 h-full hover:bg-bg-sec-light text-txt-muted hover:text-txt-white text-xs font-bold disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-txt-white">{product.stock === 0 ? 0 : quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock === 0}
                    className="px-3 h-full hover:bg-bg-sec-light text-txt-muted hover:text-txt-white text-xs font-bold disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Purchase button */}
              {product.stock > 0 ? (
                <button
                  onClick={() => {
                    addToCart(product, quantity, selectedVariant);
                    router.push("/checkout");
                  }}
                  className="flex-grow py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(163,255,18,0.2)] h-[42px]"
                >
                  <ShoppingCart className="w-4 h-4" /> Buy Now
                </button>
              ) : (
                <button 
                  onClick={() => alert(`Alert: ${product.name} is out of stock. We will notify you when it is back in stock!`)}
                  className="flex-grow py-3 text-xs font-bold rounded-xl bg-bg-sec-light border border-border-subtle text-txt-muted hover:text-white hover:border-red-500/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer h-[42px]"
                >
                  Notify Me
                </button>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-3 rounded-xl border border-border-subtle hover:border-accent-neon/30 bg-bg-sec-dark hover:bg-bg-sec-light text-txt-muted hover:text-accent-neon transition-colors h-[42px] cursor-pointer"
              >
                <Heart className={`w-4.5 h-4.5 ${isWish ? "fill-accent-neon text-accent-neon" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs segment: Specs, Care requirements, Reviews */}
      <div className="space-y-6 pt-8 border-t border-border-subtle">
        <div className="flex border-b border-border-subtle gap-6">
          {["specifications", "care-instructions", "cultivator-reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-bold uppercase tracking-wider font-mono cursor-pointer transition-colors relative ${
                activeTab === tab ? "text-accent-neon" : "text-txt-muted hover:text-txt-white"
              }`}
            >
              {tab.replace("-", " ")}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-neon shadow-[0_0_8px_#A3FF12]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="glass-card border border-border-subtle p-6 rounded-2xl text-left bg-bg-sec-dark/20 leading-relaxed text-xs">
          {activeTab === "specifications" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-txt-muted block">Difficulty Index</span>
                <span className="text-txt-white font-bold">{product.difficulty}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-txt-muted block">Estimated Size</span>
                <span className="text-txt-white font-bold">{product.size}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-txt-muted block">Available Pod Inventory</span>
                <span className="text-txt-white font-bold">{product.stock} Strains</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-txt-muted block">Bioluminescent State</span>
                <span className="text-accent-green font-bold">Stable Active</span>
              </div>
            </div>
          )}

          {activeTab === "care-instructions" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3 items-start p-4 rounded-xl bg-bg-sec-dark/50 border border-border-subtle">
                <Sun className="w-5 h-5 text-accent-neon mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-bold text-txt-white font-mono text-[11px] uppercase">Sunlight Requirements</h4>
                  <p className="text-txt-muted text-[11px]">{product.sunlight}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 rounded-xl bg-bg-sec-dark/50 border border-border-subtle">
                <Droplet className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-bold text-txt-white font-mono text-[11px] uppercase">Hydration Schedule</h4>
                  <p className="text-txt-muted text-[11px]">{product.water}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 rounded-xl bg-bg-sec-dark/50 border border-border-subtle">
                <Thermometer className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-bold text-txt-white font-mono text-[11px] uppercase">Thermal Guidelines</h4>
                  <p className="text-txt-muted text-[11px]">{product.temperature}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cultivator-reviews" && (
            <div className="space-y-4">
              {mockReviews.map((rev, idx) => (
                <div key={idx} className="border-b border-border-subtle pb-3 last:border-0 last:pb-0 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-txt-white">{rev.name}</span>
                      <div className="flex text-accent-neon">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-accent-neon" />
                        ))}
                      </div>
                    </div>
                    <span className="text-txt-muted font-mono">{rev.date}</span>
                  </div>
                  <p className="text-txt-muted text-[11px] leading-relaxed">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-accent-neon">Related Biological Strains</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div key={p.id} className="rounded-xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-3 flex gap-4 items-center">
                <img src={p.imageUrl} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-grow">
                  <Link href={`/products/${p.id}`} className="block truncate font-semibold text-xs text-txt-white hover:text-accent-neon">
                    {p.name}
                  </Link>
                  <p className="text-[10px] text-txt-muted truncate italic font-mono">{p.scientificName}</p>
                  <span className="text-[10px] text-accent-neon font-mono block mt-1">₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

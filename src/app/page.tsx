"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { 
  ArrowRight, Heart, ShoppingCart, 
  Search, Droplets, Leaf, ShieldCheck, Sun
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { products, addToCart, wishlist, toggleWishlist } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Indoor Plants");

  const categories = ["Indoor Plants", "Outdoor Plants", "Air Purifying Plants", "Decorative Plants"];

  const filteredProducts = activeCategory === "All" 
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeCategory).slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-24 pb-20 bg-bg-deep text-txt-white">
      {/* 1. HERO SECTION WITH NATURE BACKGROUND */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=2000" 
            alt="Nature Background" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center pt-20">
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3 text-left space-y-8 relative z-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-sans font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.2)] animate-in fade-in zoom-in-95 duration-700">
              Bring Nature <br />
              <span className="text-[#DCECB2] drop-shadow-[0_0_15px_rgba(220,236,178,0.3)]">Closer to Your Home</span>
            </h1>
            
            <p className="text-base md:text-lg text-white font-medium max-w-2xl font-sans drop-shadow-[0_2px_12px_rgba(255,255,255,0.3)] animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150 fill-mode-both">
              Discover indoor plants, outdoor plants, bonsai, rare plants, succulents, and air-purifying greenery delivered directly to your doorstep.
            </p>

            {/* CTAs */}
            <div className="flex flex-col md:flex-row items-center gap-4 mt-8 w-full md:w-auto">
              {/* Primary CTA */}
              <Link 
                href="/products" 
                style={{ transition: "all 0.3s ease" }}
                className="w-full md:w-auto text-center px-[32px] py-[16px] rounded-[16px] bg-[#6B8E23] text-[#FFFFFF] font-semibold hover:bg-[#5A781D] hover:-translate-y-[2px] shadow-[0px_6px_16px_rgba(107,142,35,0.25)] animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-both"
              >
                Buy Now
              </Link>
              
              {/* Secondary CTA */}
              <Link 
                href="/login" 
                style={{ transition: "all 0.3s ease" }}
                className="w-full md:w-auto text-center px-[32px] py-[16px] rounded-[16px] bg-[#DCECB2] text-[#234F1E] font-semibold border border-[#C9DEA0] hover:bg-[#CFE39D] hover:-translate-y-[2px] shadow-[0px_6px_16px_rgba(107,142,35,0.1)] animate-in slide-in-from-bottom-4 fade-in duration-500 delay-400 fill-mode-both"
              >
                Login
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 animate-in fade-in duration-700 delay-700 fill-mode-both">
              <span className="flex items-center gap-2 text-sm font-medium text-white/90 drop-shadow-md">
                100+ Plant Varieties
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-white/90 drop-shadow-md">
                Pan India Delivery
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-white/90 drop-shadow-md">
                5000+ Happy Customers
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-white/90 drop-shadow-md">
                Expert Plant Care Support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section id="categories" className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { name: "Indoor Plants", count: "120+ items", img: "/images/peace_lily.png" },
            { name: "Outdoor Plants", count: "80+ items", img: "/images/rose_plant.png" },
            { name: "Air Purifying", count: "45+ items", img: "/images/snake_plant.png" },
            { name: "Decorative", count: "30+ items", img: "/images/bonsai_tree.png" },
          ].map((cat, i) => (
            <Link href={`/products?category=${encodeURIComponent(cat.name)}`} key={i} className="group rounded-3xl overflow-hidden relative h-48 md:h-64 shadow-lg flex items-end">
               <img src={cat.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.name} />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
               <div className="relative p-6 w-full text-white">
                 <h3 className="text-xl font-bold font-sans">{cat.name}</h3>
                 <p className="text-xs text-gray-200 mt-1">{cat.count}</p>
               </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS GRID */}
      <section id="shop" className="max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-txt-white font-sans">Shop Our Collection</h2>
          <p className="text-sm text-txt-gray max-w-xl mx-auto">
            Explore our curated selection of beautiful plants designed to elevate your space.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all cursor-pointer border ${
                activeCategory === cat
                  ? "bg-accent-green text-white border-accent-green shadow-md"
                  : "bg-white border-border-subtle text-txt-gray hover:text-txt-white hover:border-accent-green/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {filteredProducts.map((p) => {
            const isWish = wishlist.includes(p.id);
            return (
              <div
                key={p.id}
                className="rounded-3xl bg-gradient-to-br from-white to-accent-lime/10 border border-border-subtle shadow-[0_8px_30px_rgba(0,0,0,0.04)] glass-card-hover transition-all overflow-hidden flex flex-col group p-4"
              >
                {/* Image block */}
                <div className="relative aspect-square w-full rounded-2xl bg-bg-medium overflow-hidden mb-4">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-100 hover:border-accent-green text-gray-400 hover:text-accent-green transition-all shadow-sm cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isWish ? "fill-accent-green text-accent-green" : ""}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1">
                     {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(p.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                     ))}
                  </div>
                </div>

                {/* Info block */}
                <div className="flex flex-col flex-grow text-left justify-between px-1">
                  <div>
                    <Link href={`/products/${p.id}`} className="block">
                      <h3 className="text-lg font-bold text-txt-white hover:text-accent-green transition-colors font-sans">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-txt-gray mt-1 flex items-center gap-1.5 font-sans italic">
                      {p.scientificName}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-xl font-bold text-accent-green font-sans">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => {
                        addToCart(p, 1, p.variants[0]);
                      }}
                      className="w-10 h-10 rounded-full bg-accent-green text-white hover:bg-accent-lime transition-all flex items-center justify-center shadow-md cursor-pointer group-hover:scale-110"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center pt-8">
           <Link href="/products" className="px-8 py-3 rounded-full border-2 border-accent-green text-accent-green font-bold hover:bg-accent-green hover:text-white transition-all">
              View All Plants
           </Link>
        </div>
      </section>

      {/* 4. ECO-FRIENDLY LIFESTYLE HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
         <div className="rounded-[40px] bg-accent-green text-white p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
            
            <div className="md:w-1/2 space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans">
                Embrace an Eco-Friendly Lifestyle
              </h2>
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                GreenSphere is more than a nursery; it's a movement towards a greener, healthier planet. Every plant you nurture brings us one step closer to environmental harmony.
              </p>
              
              <div className="space-y-4 pt-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
                    <span className="font-bold">100% Organic Soil & Fertilizers</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Leaf className="w-5 h-5" /></div>
                    <span className="font-bold">Eco-friendly Packaging</span>
                 </div>
              </div>
            </div>
            
            <div className="md:w-1/2 relative z-10 w-full h-80 rounded-3xl overflow-hidden shadow-lg border-4 border-white/20">
               <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
            </div>
         </div>
      </section>

    </div>
  );
}

// Simple star icon since we didn't import it at the top to save space
function Star(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

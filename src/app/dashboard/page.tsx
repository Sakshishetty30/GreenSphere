"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { 
  CloudSun, Droplets, Calendar, 
  ArrowRight, Thermometer, Sun, Package 
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, garden, orders, products } = useApp();

  // Dashboard calculations
  const activeGardenNodes = garden.length;
  const recentOrdersCount = orders.filter(o => o.status === "Processing" || o.status === "Shipped").length;
  
  // Custom mock weather
  const mockWeather = {
    temp: "24°C",
    humidity: "55%",
    light: "Bright Indirect",
    status: "Sunny"
  };

  // AI Recommendation engine: recommend based on category of plants owned, or a popular trending product
  const getRecommendation = () => {
    if (products.length === 0) return null;
    return products[2] || products[0] || null;
  };

  const recommendedProduct = getRecommendation();

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto px-4 md:px-8">
      
      {/* 1. Welcome Card & Weather Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Welcome */}
        <div className="md:col-span-2 rounded-3xl border border-border-subtle bg-bg-sec-dark p-8 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/10 blur-2xl pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-txt-white leading-tight font-mono">
              Welcome back, {user?.name}
            </h2>
            <p className="text-sm text-txt-gray max-w-md leading-relaxed">
              Your indoor garden is thriving. Check your care schedule below to ensure your plants stay healthy and hydrated.
            </p>
          </div>
          
          <div className="flex gap-8 text-sm pt-6 text-txt-gray relative z-10">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-txt-muted block mb-1">My Plants</span>
              <span className="font-bold text-accent-green text-lg">{activeGardenNodes}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-txt-muted block mb-1">Active Orders</span>
              <span className="font-bold text-txt-white text-lg">{recentOrdersCount}</span>
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="rounded-3xl border border-border-subtle bg-bg-sec-dark p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-txt-white font-mono">Home Environment</h3>
              <p className="text-[11px] text-txt-gray mt-1">{mockWeather.status}</p>
            </div>
            <CloudSun className="w-6 h-6 text-accent-green" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-txt-white font-medium">{mockWeather.temp}</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-txt-white font-medium">{mockWeather.humidity}</span>
            </div>
            <div className="col-span-2 flex items-center gap-2 border-t border-border-subtle/50 pt-3 mt-1">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span className="text-txt-white font-medium">{mockWeather.light}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Reminders Timeline */}
        <div className="lg:col-span-7 p-8 rounded-3xl border border-border-subtle bg-bg-sec-dark flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
             <h3 className="text-base font-bold text-txt-white font-mono">
               Care Schedule
             </h3>
             <span className="text-[10px] text-accent-green font-bold uppercase tracking-wider bg-accent-green/10 px-3 py-1 rounded-full">Today</span>
          </div>

          <div className="flex-grow space-y-4">
            {garden.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                 <p className="text-sm text-txt-gray">You don't have any plants in your care tracker yet.</p>
                 <Link href="/products" className="inline-block px-5 py-2 rounded-full bg-bg-sec-light text-xs font-bold hover:text-accent-green transition-colors">Browse Plants</Link>
              </div>
            ) : (
              garden.slice(0, 4).map((plant) => (
                <div key={plant.id} className="flex gap-4 items-center p-3 rounded-2xl bg-bg-deep/50 border border-border-subtle hover:border-accent-green/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-bg-sec-dark overflow-hidden flex-shrink-0">
                     <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-txt-white truncate text-sm">{plant.name}</p>
                    <p className="text-[11px] text-txt-gray truncate">{plant.species}</p>
                  </div>
                  <div className="text-right">
                     <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded block mb-1">Needs Water</span>
                     <button className="text-[10px] font-bold text-txt-white hover:text-accent-green transition-colors">Mark as Done</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI recommendations & Recent Orders */}
        <div className="lg:col-span-5 space-y-8">
          {/* AI Recommendations */}
          {recommendedProduct && (
            <div className="p-6 rounded-3xl border border-border-subtle bg-bg-sec-dark/50 flex flex-col justify-between text-left space-y-5 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                 <img src={recommendedProduct.imageUrl} className="w-48 h-48 object-cover" />
              </div>
              <div className="relative z-10">
                 <h4 className="text-sm font-bold text-txt-white font-mono">Recommended for you</h4>
                 <p className="text-xs text-txt-gray mt-1">Based on your space</p>
              </div>

              <div className="flex gap-4 items-center relative z-10">
                <img src={recommendedProduct.imageUrl} alt={recommendedProduct.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-lg" />
                <div className="min-w-0 flex-grow text-sm">
                  <Link href={`/products/${recommendedProduct.id}`} className="font-bold text-txt-white hover:text-accent-green truncate block font-mono">
                    {recommendedProduct.name}
                  </Link>
                  <span className="text-xs text-accent-green font-bold block mt-1">₹{recommendedProduct.price.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Link
                href={`/products/${recommendedProduct.id}`}
                className="w-full py-2.5 text-center text-xs font-bold rounded-full bg-bg-sec-light border border-border-subtle hover:border-accent-green text-txt-white transition-all relative z-10"
              >
                View Details
              </Link>
            </div>
          )}

          {/* Order tracking preview */}
          <div className="p-6 rounded-3xl border border-border-subtle bg-bg-sec-dark flex flex-col justify-between text-left space-y-4">
            <h3 className="text-sm font-bold text-txt-white font-mono flex items-center gap-2">
              <Package className="w-4 h-4 text-accent-green" /> Recent Orders
            </h3>

            <div className="flex-grow space-y-3">
              {orders.length === 0 ? (
                <p className="text-xs text-txt-gray">No recent orders.</p>
              ) : (
                orders.slice(0, 2).map((order) => (
                  <div key={order.id} className="p-3 rounded-xl bg-bg-deep border border-border-subtle/80 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-txt-gray block">Order #{order.id.slice(-6)}</span>
                      <p className="font-bold text-txt-white">₹{order.total.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                        order.status === "Processing" ? "bg-accent-green/15 text-accent-green" : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

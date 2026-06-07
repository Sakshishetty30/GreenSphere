"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { 
  IndianRupee, ShoppingBag, Users, FolderOpen, 
  ArrowUpRight, Activity, Calendar, Compass 
} from "lucide-react";
import { AreaChart, BarChart } from "@/components/ui/Charts";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { orders, users, products } = useApp();

  // Metrics Calculations
  const totalRevenue = orders.reduce((acc, o) => o.status !== "Cancelled" ? acc + o.total : acc, 0) + 1245000; // Add base mock sales (scaled for INR)
  const salesVolume = orders.filter(o => o.status !== "Cancelled").length + 48;
  const registeredUsersCount = users.length + 112; // Base mock users
  const totalInventoryStock = products.reduce((acc, p) => acc + p.stock, 0);

  // Sales Trends Data
  const salesTrendData = [
    { label: "Jan", value: 340000 },
    { label: "Feb", value: 410000 },
    { label: "Mar", value: 580000 },
    { label: "Apr", value: 720000 },
    { label: "May", value: 890000 },
    { label: "Jun", value: 1140000 },
    { label: "Jul", value: totalRevenue }
  ];

  // User growth data
  const userGrowthData = [
    { label: "Week 1", value: 12 },
    { label: "Week 2", value: 18 },
    { label: "Week 3", value: 32 },
    { label: "Week 4", value: 45 },
    { label: "Week 5", value: 72 },
    { label: "Week 6", value: 98 },
    { label: "Week 7", value: registeredUsersCount }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-border-subtle/50 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-txt-white tracking-tight">Sales Administration Console</h1>
          <p className="text-xs text-txt-muted font-mono uppercase tracking-wider text-accent-neon">GreenSphere Telemetry Ledger</p>
        </div>
        <span className="text-xs text-txt-muted font-mono bg-bg-sec-dark px-3 py-1.5 rounded-xl border border-border-subtle">
          Real-time Sync Node
        </span>
      </div>

      {/* Grid of metrics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-bg-sec-dark flex flex-col justify-between min-h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-txt-muted font-mono tracking-wider">Revenue Settlement</span>
            <IndianRupee className="w-4 h-4 text-accent-neon" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-txt-white font-mono">₹{totalRevenue.toLocaleString("en-IN")}</h3>
            <span className="text-[9px] text-accent-green font-mono">▲ 14.2% Growth Ratio</span>
          </div>
        </div>

        {/* Sales Volume */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-bg-sec-dark flex flex-col justify-between min-h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-txt-muted font-mono tracking-wider">Specimen Dispatched</span>
            <ShoppingBag className="w-4 h-4 text-accent-neon" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-txt-white font-mono">{salesVolume} Units</h3>
            <span className="text-[9px] text-accent-green font-mono">▲ 8.4% Conversion</span>
          </div>
        </div>

        {/* Users */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-bg-sec-dark flex flex-col justify-between min-h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-txt-muted font-mono tracking-wider">Cultivator Nodes</span>
            <Users className="w-4 h-4 text-accent-neon" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-txt-white font-mono">{registeredUsersCount} Nodes</h3>
            <span className="text-[9px] text-accent-green font-mono">▲ 11.2% Sync rate</span>
          </div>
        </div>

        {/* Inventory */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-bg-sec-dark flex flex-col justify-between min-h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-txt-muted font-mono tracking-wider">Inventory Stock</span>
            <FolderOpen className="w-4 h-4 text-accent-neon" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-txt-white font-mono">{totalInventoryStock} Items</h3>
            <span className="text-[9px] text-accent-lime font-mono">● Stock Stable</span>
          </div>
        </div>

      </div>

      {/* Charts segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales area chart */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
            <div>
              <h3 className="text-xs font-bold text-txt-white font-mono uppercase tracking-wider">Gross Sales Ledgers</h3>
              <p className="text-[9px] text-txt-muted">Historical revenue chart over 7 months</p>
            </div>
            <Activity className="w-4.5 h-4.5 text-accent-neon" />
          </div>
          <AreaChart data={salesTrendData} height={200} />
        </div>

        {/* User growth bar chart */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
            <div>
              <h3 className="text-xs font-bold text-txt-white font-mono uppercase tracking-wider">User Node Activations</h3>
              <p className="text-[9px] text-txt-muted">Growth telemetry over 7 weeks</p>
            </div>
            <Calendar className="w-4.5 h-4.5 text-accent-neon" />
          </div>
          <BarChart data={userGrowthData} height={200} />
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-5 rounded-2xl border border-border-subtle bg-bg-sec-dark space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
          <h3 className="text-xs font-bold text-txt-white font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4.5 h-4.5 text-accent-neon" /> Recent Logistics Transactions
          </h3>
          <Link href="/admin/orders" className="text-[10px] text-accent-neon hover:text-accent-lime font-bold flex items-center gap-0.5">
            Review Shipments <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-border-subtle text-txt-muted uppercase text-[9px] tracking-wider">
                <th className="py-2.5">Registry ID</th>
                <th className="py-2.5">Cultivator Name</th>
                <th className="py-2.5 text-right">Settlement Total</th>
                <th className="py-2.5 text-right">Logistics Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-txt-gray">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-txt-muted italic">No active order records found.</td>
                </tr>
              ) : (
                orders.slice(0, 3).map((order) => (
                  <tr key={order.id} className="hover:bg-bg-sec-dark/50">
                    <td className="py-3 text-txt-white font-bold">{order.id}</td>
                    <td className="py-3">{order.address.fullName}</td>
                    <td className="py-3 text-right text-accent-neon font-bold">₹{order.total.toLocaleString("en-IN")}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                        order.status === "Processing" 
                          ? "bg-accent-neon/15 border border-accent-neon/30 text-accent-neon" 
                          : "bg-blue-500/10 border border-blue-400/20 text-blue-400"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

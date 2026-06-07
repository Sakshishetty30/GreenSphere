"use client";

import React from "react";
import { AreaChart, BarChart } from "@/components/ui/Charts";
import { BarChart3, TrendingUp, Zap, HelpCircle } from "lucide-react";

export default function AdminAnalyticsPage() {
  // Conversion metrics
  const conversionStats = [
    { label: "Checkouts Clicked", value: "3.24%", desc: "Direct sales funnel success" },
    { label: "Bioluminescent Traffic", value: "1,248", desc: "Daily unique node requests" },
    { label: "Bounce Index", value: "28.5%", desc: "Telemetry session retention" },
    { label: "Telemetry Load Speed", value: "0.24s", desc: "Optimal Vercel node times" }
  ];

  // Mock revenue chart
  const salesReports = [
    { month: "Jan", revenue: 320000, itemsSold: 12, growth: "▲ 4.2%" },
    { month: "Feb", revenue: 410000, itemsSold: 18, growth: "▲ 8.1%" },
    { month: "Mar", revenue: 580000, itemsSold: 25, growth: "▲ 12.0%" },
    { month: "Apr", revenue: 720000, itemsSold: 32, growth: "▲ 15.4%" },
    { month: "May", revenue: 890000, itemsSold: 38, growth: "▲ 18.2%" },
    { month: "Jun", revenue: 1140000, itemsSold: 44, growth: "▲ 22.5%" }
  ];

  const carbonOffsetData = [
    { label: "Jan", value: 120 },
    { label: "Feb", value: 180 },
    { label: "Mar", value: 240 },
    { label: "Apr", value: 310 },
    { label: "May", value: 450 },
    { label: "Jun", value: 580 },
    { label: "Jul", value: 680 }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-border-subtle/50">
        <h1 className="text-2xl font-extrabold text-txt-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6.5 h-6.5 text-accent-neon" /> Multi-Dimensional Analytics
        </h1>
        <p className="text-xs text-txt-muted">Review environmental offset statistics, checkouts metrics, and Vercel fleet speeds.</p>
      </div>

      {/* Conversion stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {conversionStats.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-border-subtle bg-bg-sec-dark flex flex-col justify-between min-h-[100px]">
            <div className="flex justify-between items-start text-txt-muted font-mono text-[9px] uppercase">
              <span>{stat.label}</span>
              <TrendingUp className="w-3.5 h-3.5 text-accent-neon" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-txt-white font-mono">{stat.value}</h3>
              <p className="text-[9px] text-txt-muted">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Carbon Offset Area Chart */}
      <div className="p-5 rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
          <div>
            <h3 className="text-xs font-bold text-txt-white font-mono uppercase tracking-wider">Carbon Offset Ledger</h3>
            <p className="text-[9px] text-txt-muted">Decarbonization offset kilograms tracking monthly progress</p>
          </div>
          <Zap className="w-4.5 h-4.5 text-accent-neon" />
        </div>
        <AreaChart data={carbonOffsetData} height={200} />
      </div>

      {/* Sales reports ledger */}
      <div className="p-5 rounded-2xl border border-border-subtle bg-bg-sec-dark space-y-4">
        <h3 className="text-xs font-bold text-txt-white font-mono uppercase tracking-wider pb-2 border-b border-border-subtle">
          Monthly Settlement Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-border-subtle text-txt-muted uppercase text-[9px] tracking-wider">
                <th className="py-2">Log Period</th>
                <th className="py-2 text-right">Acquisition Yields</th>
                <th className="py-2 text-right">Items Shipped</th>
                <th className="py-2 text-right">Telemetry Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-txt-gray">
              {salesReports.map((rep, idx) => (
                <tr key={idx} className="hover:bg-bg-sec-dark/50">
                  <td className="py-2.5 text-txt-white font-bold">{rep.month} 2026</td>
                  <td className="py-2.5 text-right font-bold text-accent-neon">₹{rep.revenue.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 text-right">{rep.itemsSold} Specimen</td>
                  <td className="py-2.5 text-right text-accent-green font-bold">{rep.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

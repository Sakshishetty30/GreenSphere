"use client";

import React, { useState } from "react";
import { useApp, Order } from "@/context/AppContext";
import { Compass, FileText, ArrowLeftRight, Check, AlertCircle, HelpCircle } from "lucide-react";

export default function UserOrdersPage() {
  const { orders, updateOrderStatus, addNotification } = useApp();
  const [activeOrderReturn, setActiveOrderReturn] = useState<string | null>(null);

  const handleInvoiceDownload = (orderId: string) => {
    addNotification(
      "Invoice Synchronized",
      `Invoice for registry ID ${orderId} has been formatted. Download complete.`,
      "success"
    );
    alert(`Downloading Invoice_${orderId}.pdf (Simulated)`);
  };

  const handleRequestReturn = (orderId: string) => {
    updateOrderStatus(orderId, "Cancelled");
    addNotification(
      "Return Requested",
      `Biological return protocols initialized for order registry ${orderId}.`,
      "warning"
    );
    setActiveOrderReturn(null);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-border-subtle/50">
        <h1 className="text-2xl font-extrabold text-txt-white tracking-tight">Order Logistics Registry</h1>
        <p className="text-xs text-txt-muted">Track vector shipping status and manage specimen acquisitions.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-border-subtle/50 rounded-2xl glass-card space-y-4">
          <span className="text-3xl">📦</span>
          <h3 className="text-sm font-semibold text-txt-white">Logistics registry clear</h3>
          <p className="text-xs text-txt-muted max-w-sm mx-auto">
            You have not initialized any transactions. Explore our shop boutique to buy specimen nodes.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-border-subtle bg-bg-sec-dark/40 glass-card overflow-hidden"
            >
              {/* Top Banner details */}
              <div className="px-5 py-4 border-b border-border-subtle bg-bg-sec-dark flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
                <div className="flex gap-6">
                  <div>
                    <span className="text-[10px] text-txt-muted block uppercase">Date Initiated</span>
                    <span className="text-txt-white">{new Date(order.date).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-txt-muted block uppercase">Registry ID</span>
                    <span className="text-txt-white font-bold">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-txt-muted block uppercase">Total Cost</span>
                    <span className="text-accent-neon font-bold">₹{order.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                    order.status === "Processing" 
                      ? "bg-accent-neon/15 border border-accent-neon/30 text-accent-neon" 
                      : order.status === "Shipped"
                      ? "bg-blue-500/10 border border-blue-400/20 text-blue-400"
                      : order.status === "Delivered"
                      ? "bg-accent-green/10 border border-accent-green/20 text-accent-green"
                      : "bg-red-500/10 border border-red-400/20 text-red-400"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="p-5 space-y-4 text-xs">
                <div className="divide-y divide-border-subtle/50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex gap-4 items-center min-w-0">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-txt-white truncate">{item.product.name}</h4>
                          <span className="text-[10px] text-txt-muted font-mono">{item.variant}</span>
                        </div>
                      </div>
                      <div className="text-right font-mono flex-shrink-0">
                        <span className="text-txt-white font-bold">Qty {item.quantity}</span>
                        <p className="text-[10px] text-txt-muted">₹{item.product.price.toLocaleString("en-IN")} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bar tracking status */}
                {order.status !== "Cancelled" && (
                  <div className="pt-4 border-t border-border-subtle/50 space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider font-mono text-txt-muted">Shipping Telemetry:</h5>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono relative">
                      <div className="absolute top-1/2 left-[16.6%] right-[16.6%] h-0.5 bg-bg-deep -translate-y-1/2 z-0" />
                      <div className={`absolute top-1/2 left-[16.6%] h-0.5 bg-accent-neon -translate-y-1/2 z-0 transition-all ${
                        order.status === "Shipped" ? "w-1/3" : order.status === "Delivered" ? "w-2/3" : "w-0"
                      }`} />

                      <div className="z-10 flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          order.status === "Processing" || order.status === "Shipped" || order.status === "Delivered"
                            ? "bg-accent-neon border-accent-neon text-bg-deep" : "border-border-subtle bg-bg-deep"
                        }`}>
                          ✓
                        </div>
                        <span className="mt-1 font-semibold text-txt-white">Processing</span>
                      </div>

                      <div className="z-10 flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          order.status === "Shipped" || order.status === "Delivered"
                            ? "bg-accent-neon border-accent-neon text-bg-deep" : "border-border-subtle bg-bg-deep"
                        }`}>
                          ✈
                        </div>
                        <span className={`mt-1 ${order.status === "Shipped" || order.status === "Delivered" ? "text-txt-white font-semibold" : "text-txt-muted"}`}>
                          Shipped
                        </span>
                      </div>

                      <div className="z-10 flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          order.status === "Delivered"
                            ? "bg-accent-neon border-accent-neon text-bg-deep" : "border-border-subtle bg-bg-deep"
                        }`}>
                          🏡
                        </div>
                        <span className={`mt-1 ${order.status === "Delivered" ? "text-txt-white font-semibold" : "text-txt-muted"}`}>
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Operations links */}
                <div className="flex justify-between items-center pt-4 border-t border-border-subtle/50">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleInvoiceDownload(order.id)}
                      className="px-3.5 py-2 rounded-xl bg-bg-sec-dark border border-border-subtle hover:border-accent-neon/30 text-txt-gray transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                    >
                      <FileText className="w-4.5 h-4.5" /> Download Ledger PDF
                    </button>
                    {order.status !== "Cancelled" && (
                      <button
                        onClick={() => setActiveOrderReturn(activeOrderReturn === order.id ? null : order.id)}
                        className="px-3.5 py-2 rounded-xl bg-bg-sec-dark border border-border-subtle hover:border-red-400/30 text-txt-muted hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                      >
                        <ArrowLeftRight className="w-4.5 h-4.5" /> Request Return Node
                      </button>
                    )}
                  </div>
                </div>

                {activeOrderReturn === order.id && (
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-3 mt-4 text-left animate-pulse-subtle">
                    <p className="font-bold text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Initialize Biological Return?
                    </p>
                    <p className="text-txt-muted leading-relaxed">
                      This will halt carrier shipping logistics and initiate return labeling protocols. Specimen status will transition to Cancelled/Refunded.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleRequestReturn(order.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-txt-white font-bold cursor-pointer"
                      >
                        Confirm Return
                      </button>
                      <button
                        onClick={() => setActiveOrderReturn(null)}
                        className="px-3.5 py-1.5 rounded-lg bg-bg-sec-dark border border-border-subtle text-txt-gray font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

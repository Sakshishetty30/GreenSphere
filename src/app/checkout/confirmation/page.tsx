"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, ArrowRight, Activity, Calendar } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("gs_latest_order_id");
    if (saved) {
      setOrderId(saved);
      // Clean up latest order ID so refreshing doesn't cause issues, but keep it for reference
    } else {
      router.push("/products");
    }
  }, [router]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-8">
      {/* Immersive success panel */}
      <div className="relative rounded-3xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-8 shadow-2xl space-y-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-accent-neon/5 blur-xl pointer-events-none" />
        
        {/* Animated Check */}
        <div className="w-16 h-16 rounded-full bg-accent-neon/15 border border-accent-neon/30 flex items-center justify-center text-accent-neon mx-auto shadow-[0_0_20px_rgba(163,255,18,0.2)] animate-pulse-subtle">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono text-accent-neon uppercase tracking-wider bg-accent-neon/5 px-2.5 py-0.5 rounded border border-accent-neon/15">
            Decarbonization Cleared
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-txt-white">Acquisition Synced!</h2>
          <p className="text-xs text-txt-muted leading-relaxed">
            Your transaction was approved. The carrier has dispatched a climate-controlled transport bio-pod.
          </p>
        </div>

        {/* Telemetry metadata */}
        <div className="p-4 rounded-xl border border-border-subtle bg-bg-deep font-mono text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-txt-muted">Log Registry:</span>
            <span className="text-txt-white font-bold">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-txt-muted">Telemetry Status:</span>
            <span className="text-accent-green font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" /> Pending Sync
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-txt-muted">Est. Coordinates Arrival:</span>
            <span className="text-txt-white font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3" /> 2 - 3 Days
            </span>
          </div>
        </div>

        {/* Interactive garden prompt */}
        <div className="p-3.5 rounded-xl border border-accent-neon/10 bg-accent-neon/5 text-[10px] text-txt-muted leading-relaxed text-left flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-accent-neon flex-shrink-0" />
          <span>
            <strong>Botanical Portals Synced:</strong> Your newly acquired specimens have been automatically mapped into your <strong>My Garden</strong> dashboard for real-time watering tracking!
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/dashboard"
            className="w-full py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)]"
          >
            Manage Digital Garden Portal <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/orders"
            className="w-full py-2.5 text-xs font-semibold rounded-xl border border-border-subtle hover:border-accent-neon/30 bg-bg-deep/50 hover:bg-bg-sec-light text-txt-white transition-all"
          >
            Track Order Logistics
          </Link>
        </div>
      </div>
    </div>
  );
}

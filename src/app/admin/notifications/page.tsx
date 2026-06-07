"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Megaphone, Sparkles, Send, BellRing, BellCheck } from "lucide-react";

export default function AdminNotificationsPage() {
  const { addNotification } = useApp();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "success" | "alert">("info");
  const [sending, setSending] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setSending(true);
    setTimeout(() => {
      addNotification(title, message, type);
      setSending(false);
      setTitle("");
      setMessage("");
      alert("Telemetry alert broadcast dispatched successfully!");
    }, 800);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-border-subtle/50">
        <h1 className="text-2xl font-extrabold text-txt-white tracking-tight flex items-center gap-2">
          <Megaphone className="w-6.5 h-6.5 text-accent-neon" /> Telemetry Campaigns Dispatch
        </h1>
        <p className="text-xs text-txt-muted">Broadcast global system notifications and push alerts directly to cultivator nodes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-7 rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-txt-white pb-3 border-b border-border-subtle flex items-center gap-2">
            <BellRing className="w-4.5 h-4.5 text-accent-neon" /> Broadcast Telemetry
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                Alert Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Rare Strain Drop: Nebula Philodendron"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                System Alert Classification
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border-subtle bg-bg-deep text-txt-gray cursor-pointer"
              >
                <option value="info">System Info (Blue)</option>
                <option value="success">Success Synced (Green)</option>
                <option value="warning">Watering Warning (Lime)</option>
                <option value="alert">Security Alert (Red)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                Broadcast message
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A specialized phototrophic vector shipment has arrived. Refresh sitemaps to verify catalog availability..."
                rows={4}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sending ? "Transmitting Alert Grid..." : "Dispatch Broadcast"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Dispatch instructions */}
        <div className="lg:col-span-5 rounded-2xl border border-border-subtle bg-bg-sec-dark/50 p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-txt-white pb-3 border-b border-border-subtle flex items-center gap-2">
            <BellCheck className="w-4.5 h-4.5 text-accent-neon" /> Live Sync Ratios
          </h3>
          <div className="space-y-3 leading-relaxed text-xs text-txt-muted font-sans">
            <p>
              By sending a telemetry dispatch here, you update the global notification store synced to the Navbar bubble in real time.
            </p>
            <div className="p-3 rounded-xl border border-accent-neon/10 bg-accent-neon/5 text-[10px] leading-relaxed text-txt-muted space-y-1 font-mono">
              <p className="font-bold text-accent-neon uppercase tracking-wide">💡 Interactive Tip:</p>
              <p>Type out an alert message, click Dispatch, and then notice the green indicator blink on your top right Bell icon! You can click the Bell to view your broadcast live.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

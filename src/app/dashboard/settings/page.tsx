"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Settings, Shield, Bell, User, Paintbrush, ArrowRight } from "lucide-react";

export default function UserSettingsPage() {
  const { user, addNotification } = useApp();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "+1 (555) 019-2834",
    address: user?.address || "742 Cyber Plaza, Neo City, NY"
  });

  const [settings, setSettings] = useState({
    notifyWatering: true,
    notifyLogistics: true,
    notifyPromotions: false,
    themeGlow: true
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: ""
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification("Profile Settings", "Profile parameters updated successfully.", "success");
    alert("Profile settings synchronized (Simulated).");
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      alert("Verification matching failure. Passwords must be identical.");
      return;
    }
    addNotification("Credentials Modified", "New security access passcode synchronized.", "success");
    alert("Passcode updated successfully.");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-border-subtle/50">
        <h1 className="text-2xl font-extrabold text-txt-white tracking-tight flex items-center gap-2">
          <Settings className="w-6.5 h-6.5 text-accent-neon" /> Profile Settings Node
        </h1>
        <p className="text-xs text-txt-muted">Manage profile vectors, notification alert channels, and passcode keys.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Profile & Security */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Edit */}
          <form
            onSubmit={handleProfileSave}
            className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-txt-white pb-3 border-b border-border-subtle flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-accent-neon" /> Profile Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  Full Cultivator Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  Logistics Phone
                </label>
                <input
                  type="text"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                Logistics Delivery Address
              </label>
              <input
                type="text"
                required
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)]"
            >
              Sync Profile Node
            </button>
          </form>

          {/* Security passcode */}
          <form
            onSubmit={handleSecuritySave}
            className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-txt-white pb-3 border-b border-border-subtle flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-accent-neon" /> Passcode Keys
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                Current Passcode
              </label>
              <input
                type="password"
                required
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  New Secure Passcode
                </label>
                <input
                  type="password"
                  required
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  Confirm Passcode
                </label>
                <input
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)]"
            >
              Update Security Ledger
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Settings Toggles & Aesthetics */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Notifications Toggles */}
          <div className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-txt-white pb-3 border-b border-border-subtle flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-accent-neon" /> Channel Sync
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-txt-white block">Watering Alerts</span>
                  <span className="text-[9px] text-txt-muted">Reminders for hydration</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyWatering}
                  onChange={(e) => setSettings({ ...settings, notifyWatering: e.target.checked })}
                  className="w-4 h-4 rounded text-accent-neon focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-txt-white block">Logistics Updates</span>
                  <span className="text-[9px] text-txt-muted">Shipping progress notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyLogistics}
                  onChange={(e) => setSettings({ ...settings, notifyLogistics: e.target.checked })}
                  className="w-4 h-4 rounded text-accent-neon focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-txt-white block">Dispatch Campaigns</span>
                  <span className="text-[9px] text-txt-muted">Promotional rare strain drops</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyPromotions}
                  onChange={(e) => setSettings({ ...settings, notifyPromotions: e.target.checked })}
                  className="w-4 h-4 rounded text-accent-neon focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Aesthetics */}
          <div className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-txt-white pb-3 border-b border-border-subtle flex items-center gap-2">
              <Paintbrush className="w-4.5 h-4.5 text-accent-neon" /> UI Aesthetics
            </h3>

            <div className="flex justify-between items-center font-mono text-xs">
              <div>
                <span className="text-txt-white block">Chlorophyll Glow</span>
                <span className="text-[9px] text-txt-muted">Enable neon-green accent shadows</span>
              </div>
              <input
                type="checkbox"
                checked={settings.themeGlow}
                onChange={(e) => {
                  setSettings({ ...settings, themeGlow: e.target.checked });
                  addNotification("Theme Adjusted", "Accent glows synced dynamically.", "info");
                }}
                className="w-4 h-4 rounded text-accent-neon focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

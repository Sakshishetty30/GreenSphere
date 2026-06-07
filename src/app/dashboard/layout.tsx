"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  LayoutDashboard, Leaf, ShoppingBag, Heart, Bell, 
  Settings, LogOut, ShieldAlert, Sparkles, UserCheck 
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, login } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  // If user is not logged in, show access gateway blocker with an auto-login option
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="rounded-3xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-8 shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-full bg-accent-neon/10 border border-accent-neon/20 flex items-center justify-center text-accent-neon mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-txt-white">Authentication Sync Required</h2>
            <p className="text-xs text-txt-muted leading-relaxed">
              Access to the digital garden telemetry panel requires connecting an active cultivator node.
            </p>
          </div>

          <button
            onClick={() => login("nova@greensphere.ai", "default")}
            className="w-full py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)]"
          >
            <UserCheck className="w-4 h-4" /> Autofill Demo Account
          </button>
          
          <div className="text-xs text-txt-muted">
            Or access the login page directly at{" "}
            <Link href="/login" className="text-accent-neon hover:underline font-bold">
              Gateway Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { name: "Grid Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Garden Portal", href: "/dashboard/my-garden", icon: Leaf },
    { name: "Order Logistics", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Saved Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { name: "Real-time Alerts", href: "/dashboard/notifications", icon: Bell },
    { name: "Profile Node Specs", href: "/dashboard/settings", icon: Settings }
  ];

  const handleLogout = () => {
    // Context handles the logout state
    router.push("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-3 rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-4 space-y-6 text-left">
        <div className="px-3 py-2 border-b border-border-subtle/50 pb-4 mb-2 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-accent-neon/10 border border-accent-neon/20 flex items-center justify-center text-accent-neon font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-xs font-bold text-txt-white truncate max-w-[150px]">{user.name}</h4>
            <p className="text-[10px] text-txt-muted truncate max-w-[150px] font-mono">{user.email}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-accent-neon text-bg-deep shadow-[0_0_12px_rgba(163,255,18,0.15)]"
                    : "text-txt-muted hover:text-txt-white hover:bg-bg-sec-light"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border-subtle/50 pt-4 mt-4">
          <Link
            href="/"
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/5 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Disconnect Session</span>
          </Link>
        </div>
      </aside>

      {/* Main content grid area */}
      <main className="lg:col-span-9 space-y-6">
        {children}
      </main>
    </div>
  );
}

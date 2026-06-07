"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Bell, Info, ShieldAlert, CheckCircle2, AlertTriangle, Check } from "lucide-react";

export default function UserNotificationsPage() {
  const { notifications, markNotificationsAsRead } = useApp();

  useEffect(() => {
    // Proactively mark all notifications as read when entering this page
    markNotificationsAsRead();
  }, []);

  const getIcon = (type: string) => {
    if (type === "success") return <CheckCircle2 className="w-5 h-5 text-accent-green" />;
    if (type === "warning") return <AlertTriangle className="w-5 h-5 text-accent-lime" />;
    if (type === "alert") return <ShieldAlert className="w-5 h-5 text-red-400" />;
    return <Info className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-border-subtle/50 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-txt-white tracking-tight flex items-center gap-2">
            <Bell className="w-6.5 h-6.5 text-accent-neon" /> Real-time System Alerts
          </h1>
          <p className="text-xs text-txt-muted">Review environmental diagnostics warnings and logistical sync events.</p>
        </div>
        <span className="text-[10px] text-accent-neon font-mono uppercase tracking-wider bg-accent-neon/5 border border-accent-neon/15 px-2.5 py-1 rounded">
          Telem-Alerts Online
        </span>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 border border-border-subtle/50 rounded-2xl glass-card space-y-4">
            <span className="text-3xl">📭</span>
            <h3 className="text-sm font-semibold text-txt-white">Alert logs clear</h3>
            <p className="text-xs text-txt-muted">Your biological sensors have reported no anomalies.</p>
          </div>
        ) : (
          notifications.map((note) => (
            <div
              key={note.id}
              className={`rounded-2xl border border-border-subtle p-5 flex gap-4 items-start ${
                !note.read ? "bg-accent-neon/5 border-accent-neon/20 shadow-[0_0_12px_rgba(163,255,18,0.02)]" : "bg-bg-sec-dark/40 glass-card"
              }`}
            >
              <div className="p-2 rounded-xl bg-bg-sec-dark border border-border-subtle flex-shrink-0">
                {getIcon(note.type)}
              </div>
              <div className="space-y-1.5 flex-grow text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-txt-white">{note.title}</h4>
                  <span className="text-[9px] text-txt-muted font-mono">
                    {new Date(note.date).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: '2-digit' })}
                  </span>
                </div>
                <p className="text-txt-muted leading-relaxed">{note.message}</p>
                {!note.read && (
                  <span className="inline-flex items-center gap-1 text-[8px] font-mono text-accent-neon bg-accent-neon/5 px-2 py-0.5 rounded border border-accent-neon/15">
                    ● UNREAD EVENT
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Users, ShieldAlert, Check, X, Skull } from "lucide-react";

export default function AdminUsersPage() {
  const { users, toggleUserBan, user: loggedInAdmin } = useApp();

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-border-subtle/50">
        <h1 className="text-2xl font-extrabold text-txt-white tracking-tight">Cultivator Moderation Roster</h1>
        <p className="text-xs text-txt-muted font-mono uppercase tracking-wider text-accent-neon">Registered nodes & node access limits</p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-border-subtle text-txt-muted uppercase text-[9px] tracking-wider">
                <th className="py-2.5 pl-3">Node User</th>
                <th className="py-2.5">Date Synced</th>
                <th className="py-2.5">System Role</th>
                <th className="py-2.5 text-right">Access Status</th>
                <th className="py-2.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-txt-gray">
              {users.map((u) => {
                const isSelf = u.id === loggedInAdmin?.id;
                return (
                  <tr key={u.id} className="hover:bg-bg-sec-dark/40">
                    <td className="py-4 pl-3">
                      <div>
                        <span className="font-bold text-txt-white block">{u.name}</span>
                        <span className="text-[10px] text-txt-muted block">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {new Date(u.joinDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                        u.role === "admin" ? "bg-accent-neon/10 border border-accent-neon/20 text-accent-neon" : "bg-bg-deep border border-border-subtle text-txt-muted"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {u.isBanned ? (
                        <span className="text-red-400 font-bold flex items-center justify-end gap-1 text-[10px]">
                          <Skull className="w-3.5 h-3.5" /> BANNED
                        </span>
                      ) : (
                        <span className="text-accent-green font-bold flex items-center justify-end gap-1 text-[10px]">
                          <Check className="w-3.5 h-3.5" /> ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {isSelf ? (
                        <span className="text-[10px] text-txt-muted italic">Self (Protected)</span>
                      ) : (
                        <button
                          onClick={() => toggleUserBan(u.id)}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            u.isBanned
                              ? "border-accent-green/30 bg-accent-green/5 text-accent-green hover:bg-accent-green hover:text-bg-deep"
                              : "border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-txt-white"
                          }`}
                        >
                          {u.isBanned ? "Pardon Node" : "Ban Node"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

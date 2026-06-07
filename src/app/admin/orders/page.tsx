"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Truck, Calendar, DollarSign, ArrowUpRight } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
    } catch (e) {
      alert("Failed to update status");
      fetchOrders(); // Revert on failure
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-txt-muted">Loading Admin Analytics...</div>;
  }

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-border-subtle/50">
        <h1 className="text-2xl font-extrabold text-txt-white tracking-tight">Shipment Logistics Administration</h1>
        <p className="text-xs text-txt-muted font-mono uppercase tracking-wider text-accent-neon">Shipment routing & carrier statuses</p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-xs text-txt-muted italic">No logistics transactions filed.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-border-subtle text-txt-muted uppercase text-[9px] tracking-wider">
                  <th className="py-2.5 pl-3">Registry ID</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Cultivator Client</th>
                  <th className="py-2.5">Destination Node</th>
                  <th className="py-2.5 text-right">Acquisitions Total</th>
                  <th className="py-2.5 text-right">Carrier Route Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-txt-gray">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-bg-sec-dark/40">
                    <td className="py-4 pl-3 font-bold text-txt-white">{order.id}</td>
                    <td className="py-4">{new Date(order.date).toLocaleDateString('en-GB')}</td>
                    <td className="py-4">
                      <div>
                        <span className="font-bold block text-txt-white">{order.address.fullName}</span>
                        <span className="text-[10px] text-txt-muted block">{order.address.email}</span>
                      </div>
                    </td>
                    <td className="py-4 truncate max-w-[150px]" title={order.address.street}>
                      {order.address.city}, {order.address.zipCode}
                    </td>
                    <td className="py-4 text-right text-accent-neon font-bold">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e)}
                        className="px-2.5 py-1.5 rounded-lg border border-border-subtle bg-bg-deep text-[10px] text-txt-gray font-semibold focus:outline-none focus:border-accent-neon cursor-pointer"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled / Refunded</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

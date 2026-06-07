"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShoppingCart, Trash2, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutCartPage() {
  const { cart, removeFromCart, updateCartQuantity, user } = useApp();
  const router = useRouter();

  // Address State
  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: ""
  });

  // Pre-fill address if user is logged in
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
        phone: user.phone || "",
        street: user.address || ""
      }));
    }
  }, [user]);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 75;
  const totalCost = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Save address details in localStorage temporarily to pass to the payment step
    localStorage.setItem("gs_temp_address", JSON.stringify(address));
    router.push("/checkout/payment");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
      {/* Title */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl font-extrabold text-txt-white tracking-tight flex items-center gap-2">
          <ShoppingCart className="text-accent-neon w-8 h-8" /> Shopping Registry
        </h1>
        <p className="text-xs text-txt-muted">Verify specimen acquisition logs and input shipping coordinates.</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 border border-border-subtle/50 rounded-2xl glass-card space-y-6">
          <span className="text-4xl">🛒</span>
          <h3 className="text-sm font-semibold text-txt-white">Shopping registry empty</h3>
          <p className="text-xs text-txt-muted">You have not queued any biological specimens for acquisition.</p>
          <Link
            href="/products"
            className="inline-block px-5 py-3 bg-accent-neon text-bg-deep rounded-xl text-xs font-bold shadow-[0_0_12px_rgba(163,255,18,0.2)]"
          >
            Access Products Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Cart list & Address Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Cart list */}
            <div className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-txt-white pb-3 border-b border-border-subtle text-left">
                Acquisition Strains Queue
              </h3>
              
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.variant}`}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle/50 last:border-0 last:pb-0 text-left"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover border border-border-subtle flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-txt-white truncate hover:text-accent-neon">
                          <Link href={`/products/${item.product.id}`}>{item.product.name}</Link>
                        </h4>
                        <p className="text-[10px] text-txt-muted italic font-mono truncate">{item.product.scientificName}</p>
                        <span className="inline-block mt-1 text-[9px] bg-bg-sec-light text-txt-gray px-2 py-0.5 rounded font-mono">
                          {item.variant}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Quantity */}
                      <div className="flex items-center rounded-lg border border-border-subtle bg-bg-sec-dark overflow-hidden h-[34px]">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.variant, item.quantity - 1)}
                          className="px-2.5 h-full hover:bg-bg-sec-light text-txt-muted text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-txt-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.variant, item.quantity + 1)}
                          className="px-2.5 h-full hover:bg-bg-sec-light text-txt-muted text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right font-mono min-w-[70px]">
                        <p className="text-xs font-bold text-txt-white">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                        <span className="text-[9px] text-txt-muted">₹{item.product.price.toLocaleString("en-IN")} each</span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.variant)}
                        className="p-2 text-txt-muted hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Form */}
            <form
              onSubmit={handleProceedToPayment}
              className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 space-y-4 text-left"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-txt-white pb-3 border-b border-border-subtle flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-neon" /> Delivery Coordinates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={address.fullName}
                    onChange={handleInputChange}
                    placeholder="Nova Sterling"
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Node Notification Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={address.email}
                    onChange={handleInputChange}
                    placeholder="nova@greensphere.ai"
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Street & Unit Coordinates
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={address.street}
                    onChange={handleInputChange}
                    placeholder="742 Cyber Plaza, Floor 14"
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Logistics Contact Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={address.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    City / Dome Node
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={address.city}
                    onChange={handleInputChange}
                    placeholder="Neo City"
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Zip Code / Route Key
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={address.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-3 justify-between">
                <Link
                  href="/products"
                  className="px-4 py-2.5 rounded-xl border border-border-subtle bg-bg-sec-dark hover:bg-bg-sec-light text-xs font-semibold text-txt-gray transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)]"
                >
                  Proceed to Payment <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Totals Summary Panel */}
          <div className="lg:col-span-4 rounded-2xl border border-border-subtle bg-bg-sec-dark/40 glass-card p-5 space-y-6 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-txt-white pb-3 border-b border-border-subtle">
              Acquisition Summary
            </h3>

            <div className="space-y-3 font-mono text-xs text-txt-gray">
              <div className="flex justify-between">
                <span className="text-txt-muted">Item Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-muted">Bio-Pod Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-accent-neon font-sans italic">
                  Tip: Add ₹{(1500 - subtotal).toLocaleString("en-IN")} more for free secure thermal shipping!
                </p>
              )}
              <div className="border-t border-border-subtle/50 pt-3 flex justify-between text-sm font-bold text-txt-white">
                <span>Total Telemetry Cost</span>
                <span className="text-accent-neon">₹{totalCost.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-accent-neon/10 bg-accent-neon/5 text-[10px] leading-relaxed text-txt-muted space-y-1">
              <p className="font-bold text-accent-neon uppercase tracking-wide">📦 Thermal Air Pod Delivery</p>
              <p>Strains are shipped in hermetically sealed pods with live battery telemetry sensors tracking sunlight & moisture during shipment.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

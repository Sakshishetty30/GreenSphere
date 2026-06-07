"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ShieldCheck, Key, Lock, ArrowRight, ArrowLeft, RefreshCw, Eye, EyeOff } from "lucide-react";
import { sendPasswordResetOTP, verifyResetOTP, resetPassword } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!email) return;

    setLoading(true);
    
    const formData = new FormData();
    formData.append("email", email);
    const result = await sendPasswordResetOTP(formData);
    
    setLoading(false);

    if (result.success) {
      setSuccessMsg("Reset code sent successfully.");
      setStep(2);
    } else {
      setError(result.error || "Failed to send reset code.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);
    const result = await verifyResetOTP(formData);

    setLoading(false);

    if (result.success) {
      setStep(3);
    } else {
      setError(result.error || "Invalid or expired OTP.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (newPassword.length < 6) {
      setError("Password length must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords must be identical.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);
    formData.append("password", newPassword);
    formData.append("confirmPassword", confirmPassword);

    const result = await resetPassword(formData);

    setLoading(false);

    if (result.success) {
      setStep(4);
    } else {
      setError(result.error || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-card border border-border-subtle p-8 rounded-3xl shadow-2xl space-y-6 text-left relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent-neon/5 blur-xl pointer-events-none" />

        {step === 1 && (
          /* Step 1: Email Input */
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-txt-white flex items-center gap-2">
                <Key className="w-6 h-6 text-accent-neon" /> Recover Keys
              </h2>
              <p className="text-xs text-txt-muted">
                Enter your registered node email to receive a recovery passkey code.
              </p>
            </div>

            {error && <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs">{error}</div>}

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  Registered Email Node
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cultivator@greensphere.ai"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
                  />
                  <Mail className="w-4 h-4 text-txt-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)] disabled:opacity-50"
              >
                {loading ? "Transmitting Code..." : "Transmit Passkey Code"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          /* Step 2: OTP Input */
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-txt-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-accent-neon" /> Verify Node Code
              </h2>
              <p className="text-xs text-txt-muted">
                A 6-digit security code was dispatched to <strong className="text-txt-white">{email}</strong>. Enter it below to unlock the credential node.
              </p>
            </div>

            {error && <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs">{error}</div>}
            {successMsg && <div className="p-3 rounded-xl bg-accent-lime/5 border border-accent-lime/20 text-accent-lime text-xs">{successMsg}</div>}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  6-Digit Security Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 py-2.5 text-center text-sm rounded-xl glass-input font-mono tracking-widest"
                />
                <p className="text-[9px] text-txt-muted font-mono text-center pt-1">
                  Did not receive code?{" "}
                  <button type="button" onClick={() => handleRequestOtp()} disabled={loading} className="text-accent-neon hover:underline disabled:opacity-50">
                    Resend Code
                  </button>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-border-subtle bg-bg-sec-dark hover:bg-bg-sec-light text-xs font-semibold text-txt-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-grow py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)] disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : "Unlock Node"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          /* Step 3: Reset Password Input */
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-txt-white flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-accent-neon" /> Reset Credentials
              </h2>
              <p className="text-xs text-txt-muted">
                Input your new secure passcode credential to re-encrypt your cultivator node.
              </p>
            </div>

            {error && <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs">{error}</div>}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  New Secure Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl glass-input"
                  />
                  <Lock className="w-4 h-4 text-txt-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-txt-muted hover:text-txt-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  Confirm Passcode
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl glass-input"
                  />
                  <Lock className="w-4 h-4 text-txt-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-txt-muted hover:text-txt-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)] disabled:opacity-50"
              >
                {loading ? "Re-encrypting Node..." : "Sync New Passcode"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 4 && (
          /* Step 4: Success confirmation */
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-accent-neon/15 border border-accent-neon/30 flex items-center justify-center text-accent-neon mx-auto shadow-[0_0_20px_rgba(163,255,18,0.2)]">
              ✔
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-txt-white">Passcode Synced</h2>
              <p className="text-xs text-txt-muted leading-relaxed">
                Your credentials have been successfully updated. The decryption ledger has been synchronized.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)]"
            >
              Access Login Gateway
            </Link>
          </div>
        )}

        {step < 4 && (
          <div className="pt-2 text-center">
            <Link href="/login" className="text-xs text-txt-muted hover:text-accent-neon transition-colors font-medium">
              Return to gateway login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

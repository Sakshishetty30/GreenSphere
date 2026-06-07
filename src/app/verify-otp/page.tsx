"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, KeyRound, RefreshCw, CheckCircle2 } from "lucide-react";
import { verifyRegistrationOTP, resendOTP } from "@/actions/auth";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);

    const result = await verifyRegistrationOTP(formData);

    setLoading(false);

    if (result.success) {
      setSuccess("Account verified successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(result.error || "Verification failed.");
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResending(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("purpose", "registration");

    const result = await resendOTP(formData);

    setResending(false);

    if (result.success) {
      setSuccess("A new OTP has been sent to your email.");
    } else {
      setError(result.error || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-[60vh] max-w-md mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-8">
      <div className="space-y-3">
        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-semibold tracking-wider text-accent-neon bg-accent-neon/5 border border-accent-neon/15 px-2.5 py-0.5 rounded">
          <Sparkles className="w-3.5 h-3.5" /> Security Protocol
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-txt-white">Verify Your Email</h2>
        <p className="text-xs text-txt-muted">
          We've sent a 6-digit verification code to <strong>{email}</strong>.
          It will expire in 5 minutes.
        </p>
      </div>

      {error && (
        <div className="w-full p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs flex items-center gap-2 text-left">
          ⚠️ <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="w-full p-3 rounded-xl border border-accent-lime/20 bg-accent-lime/5 text-accent-lime text-xs flex items-center gap-2 text-left">
          <CheckCircle2 className="w-4 h-4" /> <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-1 text-left">
          <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
            6-Digit OTP Code
          </label>
          <div className="relative">
            <input
              type="text"
              name="otp"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 rounded-xl glass-input"
            />
            <KeyRound className="w-4 h-4 text-txt-muted absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !!success}
          className="w-full py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(163,255,18,0.2)] disabled:opacity-70"
        >
          {loading ? "Verifying..." : "Verify Account"}
        </button>
      </form>

      <button
        onClick={handleResend}
        disabled={resending || !!success}
        className="text-xs text-txt-muted hover:text-txt-white transition-colors flex items-center gap-1 disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
        {resending ? "Sending..." : "Didn't receive a code? Resend OTP"}
      </button>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}

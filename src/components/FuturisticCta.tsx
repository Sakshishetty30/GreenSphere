"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FuturisticCta() {
  // Generate 15 particles with random layouts
  const particles = Array.from({ length: 15 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 relative">
      {/* Container with deep black and forest green gradient, border, vignette */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative rounded-3xl border border-border-subtle bg-gradient-to-b from-[#0A1810] to-[#040805] p-10 md:p-20 overflow-hidden text-center shadow-2xl flex flex-col items-center justify-center min-h-[400px] group"
      >
        {/* Subtle animated SVG fractal noise overlay */}
        <div 
          className="absolute inset-0 opacity-[0.025] bg-repeat pointer-events-none z-10" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
          }} 
        />

        {/* Cinematic ambient green glow overlays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full bg-accent-neon/5 blur-[120px] pointer-events-none -z-10 animate-pulse-subtle" />
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-accent-green/5 blur-[80px] pointer-events-none -z-10" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-accent-lime/5 blur-[80px] pointer-events-none -z-10" />

        {/* Floating botanical shadow overlays */}
        <div className="absolute -left-10 -bottom-10 w-56 h-56 opacity-[0.06] blur-[6px] pointer-events-none select-none -z-10 rotate-12 transition-transform duration-1000 group-hover:rotate-6">
          <img 
            src="https://images.unsplash.com/photo-1508558936510-0af1e3cccbab?auto=format&fit=crop&q=80&w=400" 
            alt="botanical leaf shadow left" 
            className="w-full h-full object-cover grayscale invert"
          />
        </div>
        <div className="absolute -right-10 -top-10 w-56 h-56 opacity-[0.06] blur-[6px] pointer-events-none select-none -z-10 -rotate-12 transition-transform duration-1000 group-hover:-rotate-6">
          <img 
            src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=400" 
            alt="botanical leaf shadow right" 
            className="w-full h-full object-cover grayscale invert"
          />
        </div>

        {/* Floating bioluminescent particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {mounted && particles.map((_, idx) => {
            const size = Math.random() * 4 + 2; // 2px to 6px
            const left = Math.random() * 100;
            const duration = Math.random() * 8 + 6; // 6s to 14s
            const delay = Math.random() * 5;
            return (
              <motion.span
                key={idx}
                className="absolute rounded-full bg-accent-neon/25"
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  bottom: "-10px",
                }}
                animate={{
                  y: ["0px", "-450px"],
                  x: ["0px", `${Math.random() * 50 - 25}px`],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: "linear",
                }}
              />
            );
          })}
        </div>

        {/* Content Block */}
        <div className="max-w-3xl mx-auto space-y-6 z-20">
          {/* Header */}
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-txt-white tracking-tight leading-[1.1]"
          >
            Grow Smarter with <br />
            <span className="bg-gradient-to-r from-accent-neon via-accent-lime to-accent-green bg-clip-text text-transparent text-glow-neon">
              GreenSphere
            </span>
          </motion.h2>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-xs sm:text-sm text-txt-muted/80 max-w-2xl mx-auto leading-relaxed"
          >
            Discover premium plants, AI-powered care, and immersive gardening experiences designed for modern living.
          </motion.p>

          {/* CTA Button Wrapper with Glow Pulse */}
          <motion.div 
            variants={itemVariants}
            className="pt-6 relative inline-block"
          >
            {/* Soft background glow pulse */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-accent-neon/25 blur-lg"
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <Link
              href="/register"
              className="relative inline-flex items-center gap-2.5 px-8 py-4 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-accent-neon via-accent-lime to-accent-green text-bg-deep shadow-[0_0_20px_rgba(163,255,18,0.25)] hover:shadow-[0_0_30px_rgba(163,255,18,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-mono group overflow-hidden"
            >
              {/* Button shine animation */}
              <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              
              <span>Start Your Green Journey</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

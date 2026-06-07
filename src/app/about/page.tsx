import React from "react";
import { Leaf, Users, Globe, Shield, Sprout, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-bg-deep relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-accent-neon/10 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-accent-lime/20 rounded-full blur-[100px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-accent-green/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Hero Section */}
        <section className="text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 animate-float-medium">
            <Sprout className="w-5 h-5 text-accent-neon" />
            <span className="text-sm font-semibold text-txt-gray uppercase tracking-widest">Our Story</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-sans font-bold text-txt-white mb-6 tracking-tight">
            Cultivating <span className="text-accent-neon text-glow-neon">Nature's</span> Beauty
          </h1>
          <p className="text-lg md:text-xl text-txt-gray max-w-2xl mx-auto leading-relaxed">
            Welcome to GreenSphere, where our passion for botany meets modern living. We believe that every space deserves a touch of vibrant green, fostering tranquility and joy in your daily life.
          </p>
        </section>

        {/* Vision & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16">
          <div className="glass-card p-10 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent-neon/10 rounded-full blur-[40px] group-hover:bg-accent-neon/20 transition-all duration-500" />
            <Leaf className="w-12 h-12 text-accent-neon mb-6" />
            <h2 className="text-2xl font-bold text-txt-white mb-4">Our Mission</h2>
            <p className="text-txt-gray leading-relaxed">
              To bring the healing and aesthetic power of plants to every home. We curate healthy, vibrant plant specimens and provide the knowledge needed to help them thrive in any environment.
            </p>
          </div>
          
          <div className="glass-card p-10 relative overflow-hidden group">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-accent-lime/10 rounded-full blur-[40px] group-hover:bg-accent-lime/20 transition-all duration-500" />
            <Globe className="w-12 h-12 text-accent-lime mb-6" />
            <h2 className="text-2xl font-bold text-txt-white mb-4">Sustainability First</h2>
            <p className="text-txt-gray leading-relaxed">
              We are committed to eco-friendly practices. From sustainable sourcing to biodegradable packaging, every step we take ensures we give back to the earth as much as we take from it.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold text-txt-white mb-12">The GreenSphere Difference</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8 text-accent-green" />,
                title: "Quality Guarantee",
                desc: "Every plant is hand-selected and inspected for health before it reaches your door."
              },
              {
                icon: <Users className="w-8 h-8 text-accent-neon" />,
                title: "Expert Support",
                desc: "Our botanists are always available to help you care for your green companions."
              },
              {
                icon: <Heart className="w-8 h-8 text-red-400" />,
                title: "Grown with Love",
                desc: "We don't just sell plants; we nurture them with the utmost care and attention."
              }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card glass-card-hover p-8 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-bg-sec-light border border-border-subtle flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-txt-white mb-3">{feature.title}</h3>
                <p className="text-sm text-txt-gray">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 mb-10">
          <div className="glass-card p-12 text-center bg-gradient-to-br from-bg-sec-light to-bg-medium relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
            <h2 className="text-3xl md:text-4xl font-bold text-txt-white mb-6 relative z-10">Ready to build your indoor oasis?</h2>
            <p className="text-txt-gray mb-8 max-w-xl mx-auto relative z-10">
              Explore our curated collection of beautiful, air-purifying plants tailored for spaces of all sizes.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-accent-green text-bg-deep font-bold hover:bg-accent-neon hover:shadow-[0_0_20px_rgba(107,142,35,0.4)] transition-all transform hover:-translate-y-1 relative z-10"
            >
              Shop the Collection
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    global: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I care for my new plant?",
      a: "Every plant comes with a detailed care guide. You can also use our interactive Care Guide tool to get localized tips based on your live weather conditions."
    },
    {
      q: "Do you deliver pan-India?",
      a: "Yes! We deliver across India securely. Plants are specially packaged to survive transit up to 7 days safely."
    },
    {
      q: "What is your return/refund policy?",
      a: "If your plant arrives dead or severely damaged, contact us within 24 hours with photos. We will process a full refund or send a free replacement."
    },
    {
      q: "How does 'My Garden' work?",
      a: "The My Garden feature allows you to digitally track your purchased plants, receive watering reminders, and get proactive weather alerts to protect them from extreme conditions."
    }
  ];

  const validate = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", subject: "", message: "", global: "" };

    if (!formData.name) {
      newErrors.name = "Please enter your name";
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Please enter your email";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!formData.subject) {
      newErrors.subject = "Please enter a subject";
      isValid = false;
    }

    if (!formData.message) {
      newErrors.message = "Please enter your message";
      isValid = false;
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must contain at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: "", email: "", subject: "", message: "", global: "" });

    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to send message");
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
    } catch (err: any) {
      setErrors(prev => ({ ...prev, global: err.message || "Unable to send message. Please try again later." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [e.target.name]: "", global: "" }));
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-bg-deep relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-full h-[40vh] bg-gradient-to-bl from-accent-neon/10 to-transparent pointer-events-none" />
      <div className="absolute top-40 left-0 w-72 h-72 bg-accent-lime/20 rounded-full blur-[120px] pointer-events-none animate-pulse-subtle" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <section className="text-center py-16">
          <h1 className="text-5xl md:text-6xl font-sans font-bold text-txt-white mb-4 tracking-tight">
            Let's <span className="text-accent-neon text-glow-neon">Connect</span>
          </h1>
          <p className="text-lg text-txt-gray max-w-2xl mx-auto">
            Have a question about plant care, a recent order, or just want to say hi? We'd love to hear from you.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Contact Information */}
          <div className="space-y-6 lg:col-span-1">
            <div className="glass-card p-8 h-full bg-bg-sec-light/50">
              <h2 className="text-2xl font-bold text-txt-white mb-8">Contact Info</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-bg-sec-dark border border-border-subtle flex items-center justify-center group-hover:border-accent-neon/50 group-hover:shadow-[0_0_15px_rgba(107,142,35,0.2)] transition-all">
                    <Mail className="w-5 h-5 text-accent-neon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-txt-white mb-1">Email Us</h3>
                    <p className="text-sm text-txt-gray hover:text-accent-neon cursor-pointer transition-colors">info@greensphere.in</p>
                    <p className="text-sm text-txt-gray hover:text-accent-neon cursor-pointer transition-colors">support@greensphere.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-bg-sec-dark border border-border-subtle flex items-center justify-center group-hover:border-accent-neon/50 group-hover:shadow-[0_0_15px_rgba(107,142,35,0.2)] transition-all">
                    <Phone className="w-5 h-5 text-accent-neon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-txt-white mb-1">Call Us</h3>
                    <p className="text-sm text-txt-gray hover:text-accent-neon cursor-pointer transition-colors">+91 98765 43210</p>
                    <p className="text-xs text-txt-muted mt-1">Mon - Sat, 10am - 7pm IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-bg-sec-dark border border-border-subtle flex items-center justify-center group-hover:border-accent-neon/50 group-hover:shadow-[0_0_15px_rgba(107,142,35,0.2)] transition-all">
                    <MapPin className="w-5 h-5 text-accent-neon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-txt-white mb-1">Visit Us</h3>
                    <p className="text-sm text-txt-gray leading-relaxed mb-4">
                      GreenSphere HQ<br />
                      Udyambag<br />
                      Belagavi, Karnataka 590008<br />
                      India
                    </p>
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-border-subtle opacity-80 group-hover:opacity-100 transition-opacity">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30713.882806297653!2d74.46077319999999!3d15.8239031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf66b2a7590d97%3A0xc859b48c48a8eb6e!2sUdyambag%2C%20Belagavi%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1717755866164!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 md:p-12 relative overflow-hidden h-full">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-6 h-6 text-accent-neon" />
                <h2 className="text-2xl font-bold text-txt-white">Send a Message</h2>
              </div>

              {isSuccess ? (
                <div className="py-16 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-accent-neon/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-accent-neon" />
                  </div>
                  <h3 className="text-2xl font-bold text-accent-neon mb-2">✅ Message Sent Successfully</h3>
                  <p className="text-txt-white">Thank you for contacting GreenSphere.</p>
                  <p className="text-txt-gray mt-2">Our team will respond within 24-48 hours.</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 px-6 py-2 bg-bg-sec-dark border border-border-subtle rounded-xl text-txt-white hover:text-accent-neon transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  {errors.global && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                      <span className="text-lg">❌</span>
                      <div>
                        <p className="font-bold">Unable to send message</p>
                        <p>{errors.global}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-txt-white ml-1">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-5 py-3 rounded-xl glass-input ${errors.name ? 'border-red-500/50' : ''}`}
                      />
                      {errors.name && <p className="text-red-400 text-xs ml-1">❌ {errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-txt-white ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full px-5 py-3 rounded-xl glass-input ${errors.email ? 'border-red-500/50' : ''}`}
                      />
                      {errors.email && <p className="text-red-400 text-xs ml-1">❌ {errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-txt-white ml-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className={`w-full px-5 py-3 rounded-xl glass-input ${errors.subject ? 'border-red-500/50' : ''}`}
                    />
                    {errors.subject && <p className="text-red-400 text-xs ml-1">❌ {errors.subject}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-txt-white ml-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your inquiry..."
                      rows={5}
                      className={`w-full px-5 py-3 rounded-xl glass-input resize-none ${errors.message ? 'border-red-500/50' : ''}`}
                    />
                    {errors.message && <p className="text-red-400 text-xs ml-1">❌ {errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-accent-green text-bg-deep font-bold hover:bg-accent-neon transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(107,142,35,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-bg-deep border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-txt-white mb-2">Frequently Asked Questions</h2>
            <p className="text-txt-gray">Quick answers to common questions</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-card bg-bg-sec-light/50 overflow-hidden cursor-pointer transition-all"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="px-6 py-4 flex items-center justify-between">
                  <h3 className="font-semibold text-txt-white">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-accent-neon transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </div>
                <div 
                  className={`px-6 transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-sm text-txt-gray leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

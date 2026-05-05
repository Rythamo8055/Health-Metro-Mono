"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopLogo from "@/components/TopLogo";

const contactMethods = [
  {
    id: "contact-phone",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Call Us",
    value: "+91 XXXXX XXXXX",
    sub: "Mon – Sat, 8am – 8pm",
  },
  {
    id: "contact-email",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: "Email",
    value: "hello@healthmetro.in",
    sub: "We reply within 24 hours",
  },
  {
    id: "contact-location",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Visit Us",
    value: "Health Metro Centre",
    sub: "Find a centre near you",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, wire this to your backend / form service
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopLogo />
      <Header />
      <main className="flex-grow">

        {/* Hero */}
        <section className="relative pt-36 pb-16 px-6 overflow-hidden bg-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-[140px]" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary rounded-full blur-[140px]" />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-semibold mb-8">
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Book an Appointment
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary leading-tight mb-6 tracking-tight">
              Let's Get Your <span className="text-secondary">Health on Track</span>
            </h1>
            <p className="text-lg text-foreground opacity-70 max-w-xl mx-auto">
              Fill in your details below and our team will get back to you within hours to confirm your appointment.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {contactMethods.map((m) => (
              <div key={m.id} id={m.id} className="flex gap-4 items-start p-6 bg-surface rounded-2xl border border-primary/10">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  {m.icon}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">{m.label}</div>
                  <div className="font-bold text-foreground">{m.value}</div>
                  <div className="text-sm text-foreground opacity-50 mt-1">{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="py-16 px-6 bg-surface">
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-primary mb-4">We&apos;ll be in touch!</h2>
                <p className="text-foreground opacity-70 mb-8 text-lg">
                  Thank you for reaching out. Our team will contact you shortly to confirm your appointment.
                </p>
                <Link href="/" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all inline-block">
                  Back to Home
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Book Your Appointment</h2>
                  <p className="text-foreground opacity-60">We&apos;ll confirm within hours.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl border border-primary/10 shadow-sm p-8 md:p-12">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-bold text-foreground mb-2">Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl border border-primary/15 bg-surface text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-bold text-foreground mb-2">Mobile Number *</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl border border-primary/15 bg-surface text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-service" className="block text-sm font-bold text-foreground mb-2">Service Needed</label>
                    <select
                      id="contact-service"
                      value={form.service}
                      onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl border border-primary/15 bg-surface text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    >
                      <option value="">Select a service…</option>
                      <option value="home-collection">Home Sample Collection</option>
                      <option value="diagnostic-test">Diagnostic / Pathology Test</option>
                      <option value="doctor-consultation">Doctor Consultation</option>
                      <option value="health-records">Health Records</option>
                      <option value="nri-care">NRI Care – HM Rely</option>
                      <option value="other">Other / Not sure</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-bold text-foreground mb-2">Message (optional)</label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      placeholder="Any specific tests, preferred time, or questions…"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl border border-primary/15 bg-surface text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                    />
                  </div>

                  <button
                    id="contact-submit"
                    type="submit"
                    className="w-full py-5 bg-secondary text-white rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-secondary/20"
                  >
                    Book Appointment →
                  </button>

                  <p className="text-center text-xs text-foreground opacity-40 mt-4">
                    We respect your privacy. Your details are never shared with third parties.
                  </p>
                </form>
              </>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

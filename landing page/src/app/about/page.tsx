import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopLogo from "@/components/TopLogo";

export const metadata: Metadata = {
  title: "About Health Metro | Connecting Health Globally",
  description: "Learn about Health Metro — our mission to make diagnostics and healthcare services affordable and accessible for every patient, every family, everywhere.",
};

const milestones = [
  { year: "2022", label: "Founded", desc: "Health Metro was built with one goal — make diagnostics accessible to everyone." },
  { year: "2023", label: "Network Built", desc: "Launched our franchise network across major cities with trained collection specialists." },
  { year: "2024", label: "Digital Launch", desc: "Introduced our online booking system and digital health records platform." },
  { year: "2025", label: "Growing", desc: "Expanding to new cities with more services, more doctors, more reach." },
];

const values = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Patient First",
    desc: "Every decision starts with what's best for the patient. Affordable prices, no hidden costs.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Fast & Reliable",
    desc: "Sample collection at your home, digital reports delivered quickly, no unnecessary waiting.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Trusted & Safe",
    desc: "NABL-accredited labs, trained professionals, and secured digital records you can trust.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "For Everyone",
    desc: "Designed for seniors, families, NRIs, and working professionals — healthcare that fits your life.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopLogo />
      <Header />
      <main className="flex-grow">

        {/* Hero */}
        <section className="relative pt-36 pb-24 px-6 overflow-hidden bg-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-[140px]" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary rounded-full blur-[140px]" />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Our Story
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary leading-tight mb-8 tracking-tight">
              Healthcare for <span className="text-secondary">Every Indian</span>
            </h1>
            <p className="text-xl text-foreground opacity-80 leading-relaxed max-w-2xl mx-auto">
              Health Metro was built because we believed that quality diagnostics and healthcare
              should not be a privilege. It should be simple, affordable, and accessible — 
              at your doorstep, at a centre near you, or through a doctor you trust.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 px-6 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">What We Stand For</h2>
              <p className="text-lg text-foreground opacity-70">The principles behind every service we offer.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-3xl p-8 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    {v.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{v.title}</h3>
                  <p className="text-foreground opacity-60 leading-relaxed text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Our Journey</h2>
              <p className="text-lg text-foreground opacity-70">Building trust, one city at a time.</p>
            </div>
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-primary/10" />
              <div className="space-y-12">
                {milestones.map((m, i) => (
                  <div key={m.year} className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`md:w-1/2 pl-14 md:pl-0 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                      <div className="bg-white rounded-2xl border border-primary/10 p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="text-secondary font-black text-sm uppercase tracking-widest mb-2">{m.year} — {m.label}</div>
                        <p className="text-foreground opacity-70 leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-6 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-md" />
                    <div className="md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-primary text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to get started?</h2>
            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              Book an appointment, get your tests done at home, and receive results digitally.
              Healthcare made easy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-5 bg-secondary text-white rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/20 text-center"
              >
                Book Appointment
              </Link>
              <Link
                href="/"
                className="px-8 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all text-center"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

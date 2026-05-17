"use client";

import { useModal } from "@/context/ModalContext";

const values = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Patient First",
    desc: "Every decision starts with what's best for the patient. Affordable prices, no hidden costs.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Fast & Reliable",
    desc: "Home collection at your doorstep. Digital reports delivered quickly. No unnecessary waiting.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Trusted & Safe",
    desc: "NABL-accredited labs, trained professionals, and secured digital records you can trust.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "For Everyone",
    desc: "Designed for seniors, families, NRIs, and working professionals — healthcare that fits your life.",
    color: "bg-secondary/10 text-secondary",
  },
];

export default function About() {
  const { openModal } = useModal();
  return (
    <section id="about" className="bg-white scroll-mt-24">

      {/* Mission Banner */}
      <div className="py-24 px-6 border-b border-primary/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              About Health Metro
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-primary leading-tight mb-6 tracking-tight">
              Healthcare for <span className="text-secondary">Every Indian</span>
            </h2>
            <p className="text-lg text-foreground opacity-70 leading-relaxed mb-6">
              Health Metro was built because we believed that quality diagnostics and healthcare
              should not be a privilege. It should be simple, affordable, and accessible —
              at your doorstep, at a centre near you, or through a doctor you trust.
            </p>
            <p className="text-base text-foreground opacity-60 leading-relaxed mb-10">
              We connect patients with certified labs, trained professionals, and specialist doctors
              — all through a single platform designed for the Indian family.
            </p>

          </div>

          {/* Right: stats */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { stat: "6+", label: "Services", sub: "All in one platform" },
              { stat: "100%", label: "Digital", sub: "Reports & records online" },
              { stat: "NRI", label: "Care Ready", sub: "Manage from anywhere" },
              { stat: "NABL", label: "Certified Labs", sub: "Trusted diagnostics" },
            ].map((s) => (
              <div key={s.label} className="bg-surface rounded-3xl border border-primary/10 p-6 text-center hover:border-primary/30 hover:shadow-md transition-all">
                <div className="text-3xl md:text-4xl font-black text-primary mb-1">{s.stat}</div>
                <div className="text-sm font-bold text-foreground mb-1">{s.label}</div>
                <div className="text-xs text-foreground opacity-50">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 px-6 bg-surface border-b border-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-3">What We Stand For</h3>
            <p className="text-foreground opacity-60">The principles behind every service we offer.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-3xl p-7 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${v.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {v.icon}
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">{v.title}</h4>
                <p className="text-foreground opacity-60 leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { useModal } from "@/context/ModalContext";

const services = [
  {
    id: "hm-move",
    name: "HM MOVE – Diagnostics",
    title: "Specialty Diagnostics & Precision Health Access",
    description: "HM Move is an advanced diagnostics gateway designed for those who seek more than routine testing. Engineered for precision, it delivers deep clinical intelligence and early risk detection.",
    icon: "/icons/hm_move.png",
    color: "bg-transparent",
    accent: "border-primary/20 hover:border-primary/50",
    badge: "bg-primary text-white",
    features: [
      "Curated access to specialty diagnostic ecosystems",
      "Integrated metabolomics & multi-omics",
      "Early detection with predictive intelligence",
      "Global network of accredited partners",
    ],
    href: "/products/hm-move",
    span: "md:col-span-2",
  },
  {
    id: "hm-easy",
    name: "HM EASY – Home Collection",
    title: "Doorstep Sample Collection",
    description: "HM Easy redefines convenience by delivering professional, discreet, and clinically precise sample collection services directly to your home—ensuring comfort without compromise.",
    icon: "/icons/hm_easy.png",
    color: "bg-transparent",
    accent: "border-secondary/20 hover:border-secondary/50",
    badge: "bg-secondary text-white",
    features: [
      "Certified phlebotomy professionals",
      "Flexible scheduling tailored to you",
      "Strict hygiene & clinical safety standards",
      "Reliable & timely sample handling",
    ],
    href: "/products/hm-easy",
    span: "md:col-span-1",
  },
  {
    id: "metabolomics",
    name: "Metabolomics",
    title: "Biochemical Health Signals",
    description: "A sophisticated exploration of your body's biochemical activity—revealing health signals at the fundamental, cellular level.",
    iconNode: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M20 12h2" /><path d="M2 12h2" />
      </svg>
    ),
    color: "bg-primary/10 text-primary",
    accent: "border-primary/20 hover:border-primary/50",
    badge: "bg-primary text-white",
    features: [
      "Identifies disease signals early",
      "Advanced cellular intelligence",
      "Uncovers subtle imbalances",
      "Proactive health strategies",
    ],
    href: "/products/metabolomics",
  },
  {
    id: "multi-omics",
    name: "Multi-Omics Solutions",
    title: "Complete View of Health",
    description: "A unified approach combining genomics, proteomics, and metabolomics for an intelligent view of human health.",
    iconNode: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: "bg-secondary/10 text-secondary",
    accent: "border-secondary/20 hover:border-secondary/50",
    badge: "bg-secondary text-white",
    features: [
      "Biological data integration",
      "Precision medicine at systems level",
      "Genetic & protein marker correlation",
      "Enhanced clinical insights",
    ],
    href: "/products/multi-omics",
  },
  {
    id: "genomics",
    name: "Genomics",
    title: "Genetic Blueprint Insights",
    description: "A refined understanding of your genetic blueprint—unlocking insights into inherited risks and health trajectories.",
    iconNode: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.7 7a3.5 3.5 0 1 1 5.1 4.8L8 14.1l-1.8-2.3L4.7 7Z" /><path d="M19.3 17a3.5 3.5 0 1 1-5.1-4.8L16 9.9l1.8 2.3L19.3 17Z" /><path d="M9.8 11.8 14.2 8.2" /><path d="M14.2 12.2 9.8 15.8" />
      </svg>
    ),
    color: "bg-primary/10 text-primary",
    accent: "border-primary/20 hover:border-primary/50",
    badge: "bg-primary text-white",
    features: [
      "Advanced genetic risk analysis",
      "Hereditary condition identification",
      "Long-term health forecasting",
      "Personalized healthcare planning",
    ],
    href: "/products/genomics",
  },
  {
    id: "hm-trust",
    name: "HM TRUST – Doctor Visits",
    title: "Medical Care at Your Doorstep",
    description: "HM Trust brings clinical excellence to your home, offering access to experienced doctors for personalized, attentive medical care.",
    icon: "/icons/hm_trust.png",
    color: "bg-transparent",
    accent: "border-primary/20 hover:border-primary/50",
    badge: "bg-primary text-white",
    features: [
      "Doctor-at-home consultations",
      "Comprehensive physical evaluation",
      "Personalized prescriptions",
      "Ongoing care coordination",
    ],
    href: "/products/hm-trust",
  },
  {
    id: "hm-rely",
    name: "HM RELY – NRI Care",
    title: "Management for Families",
    description: "A refined healthcare experience for NRIs—ensuring loved ones in India receive consistent, high-quality care with transparency.",
    icon: "/icons/hm_rely.png",
    color: "bg-transparent",
    accent: "border-secondary/20 hover:border-secondary/50",
    badge: "bg-secondary text-white",
    features: [
      "End-to-end family healthcare",
      "Integrated diagnostics & visits",
      "Real-time structured reporting",
      "Dedicated care coordination",
    ],
    href: "/products/hm-rely",
  },
];

export default function Features() {
  const { openModal } = useModal();

  const renderCard = (service: typeof services[0]) => (
    <div
      key={service.id}
      id={service.id}
      onClick={() => openModal("product", service.id)}
      className="group bg-white rounded-2xl border border-border p-6 transition-all duration-300 cursor-pointer hover:border-border/80 hover:shadow-md hover:bg-surface flex flex-col justify-between"
    >
      <div>
        {/* Bigger horizontal brand logo container */}
        <div className="h-10 md:h-12 mb-5 transition-all duration-300 group-hover:scale-[1.03] relative flex items-center justify-start">
          {service.icon ? (
            <Image src={service.icon} alt={service.name} width={180} height={45} className="h-full w-auto object-contain object-left" />
          ) : (
            <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center text-primary`}>
              {(service as any).iconNode}
            </div>
          )}
        </div>
        
        {/* Title & Description */}
        <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-foreground/60 leading-snug text-sm mb-6 line-clamp-3">
          {service.description}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/50 transition-all group-hover:text-primary">
        Learn more
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );

  return (
    <section id="services" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Our Services
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Everything You Need, <span className="text-primary">In One Place</span>
          </h2>
          <p className="text-lg text-foreground opacity-60 max-w-2xl mx-auto">
            A unified health ecosystem—from specialty diagnostics to personalized home care—engineered for precision and transparency.
          </p>
        </div>

        {/* Row 1: HM MOVE and HM EASY (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {services.slice(0, 2).map(renderCard)}
        </div>

        {/* Row 2: Advanced Diagnostics (3 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {services.slice(2, 5).map(renderCard)}
        </div>

        {/* Row 3: HM TRUST and HM RELY (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.slice(5).map(renderCard)}
        </div>

      </div>
    </section>
  );
}



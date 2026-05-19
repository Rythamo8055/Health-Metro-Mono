"use client";

import Link from "next/link";
import Image from "next/image";
import { useModal } from "@/context/ModalContext";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const { openModal } = useModal();
  const [isInView, setIsInView] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the footer is visible
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="relative overflow-hidden bg-white py-24 px-6 flex items-center min-h-[400px]"
    >
      {/* Dynamic expanding background element */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary transition-all duration-[1400ms] cubic-bezier(0.16, 1, 0.3, 1) pointer-events-none z-0 ${
          isInView 
            ? "w-full h-full rounded-none opacity-100 scale-100" 
            : "w-[92%] md:w-[85%] h-[88%] rounded-[3.5rem] max-w-7xl opacity-100 scale-95"
        }`}
      />

      <div className={`w-full max-w-7xl mx-auto relative z-10 transition-all duration-[1000ms] delay-[400ms] ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-white">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt="Health Metro Logo" width={200} height={60} className="h-14 w-auto brightness-0 invert" />
            </div>
            <p className="text-white/70 max-w-sm leading-relaxed text-base">
              Affordable, accessible diagnostics and healthcare services — delivered at
              home, at our centres, or through a trusted doctor referral.
            </p>
          </div>

          {/* Company nav */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-sm tracking-widest text-secondary">Company</h4>
            <ul className="space-y-4 text-white/70 text-base md:text-lg">
              <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link href="#about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><button onClick={() => openModal("contact")} className="hover:text-secondary transition-colors">Contact</button></li>
            </ul>
          </div>

          {/* Services nav */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-sm tracking-widest text-secondary">Services</h4>
            <ul className="space-y-4 text-white/70 text-base md:text-lg">
              <li><button onClick={() => openModal("product", "hm-move")} className="hover:text-secondary transition-colors">HM Move – Diagnostics</button></li>
              <li><button onClick={() => openModal("product", "hm-easy")} className="hover:text-secondary transition-colors">HM Easy – Home Collection</button></li>
              <li><button onClick={() => openModal("product", "hm-trust")} className="hover:text-secondary transition-colors">HM Trust – Consultation</button></li>
              <li><button onClick={() => openModal("product", "hm-rely")} className="hover:text-secondary transition-colors">HM Rely – NRI Care</button></li>
              <li><button onClick={() => openModal("product", "hm-ohr")} className="hover:text-secondary transition-colors">HM OHR – Health Records</button></li>
              <li><button onClick={() => openModal("product", "hm-clin")} className="hover:text-secondary transition-colors">HM Clin – Clinical Research</button></li>
            </ul>
          </div>

        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white">
          <div className="flex gap-8 text-base font-medium text-white/50">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <div className="text-base text-white/30 font-bold">
            © 2026 Health Metro. Connecting Health Globally.
          </div>
        </div>
      </div>
    </footer>
  );
}

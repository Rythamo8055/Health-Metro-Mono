"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModal } from "@/context/ModalContext";
import { 
  Menu, 
  X, 
  ChevronDown, 
  MapPin, 
  Activity, 
  Stethoscope, 
  HeartHandshake, 
  ClipboardList, 
  Layers, 
  Target, 
  Dna,
  ArrowRight,
  Home as HomeIcon,
  Sparkles
} from "lucide-react";

// Service / Product mapping for drop-downs
const coreServices = [
  {
    name: "HM MOVE – Diagnostics",
    description: "Specialty diagnostics & precision health",
    slug: "hm-move",
    icon: Activity
  },
  {
    name: "HM EASY – Home Collection",
    description: "Doorstep professional sample collection",
    slug: "hm-easy",
    icon: HomeIcon
  },
  {
    name: "HM TRUST – Doctor Visits",
    description: "Attentive clinical care at your home",
    slug: "hm-trust",
    icon: Stethoscope
  },
  {
    name: "HM RELY – NRI Care",
    description: "Healthcare management for families in India",
    slug: "hm-rely",
    icon: HeartHandshake
  },
  {
    name: "HM OHR – Health Records",
    description: "Secure digital medical record platform",
    slug: "hm-ohr",
    icon: ClipboardList
  }
];

const advancedDiagnostics = [
  {
    name: "Genomics",
    description: "Predictive blueprint forecasting",
    slug: "genomics",
    icon: Dna
  },
  {
    name: "Metabolomics",
    description: "Biochemical cellular activity signals",
    slug: "metabolomics",
    icon: Target
  },
  {
    name: "Multi-Omics Solutions",
    description: "Integrated biological system mapping",
    slug: "multi-omics",
    icon: Layers
  }
];

const citiesList = [
  { name: "London", slug: "london" },
  { name: "Dubai", slug: "dubai" },
  { name: "New York", slug: "new-york" },
  { name: "Singapore", slug: "singapore" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Berlin", slug: "berlin" },
  { name: "Bangkok", slug: "bangkok" },
  { name: "Sydney", slug: "sydney" },
  { name: "Toronto", slug: "toronto" },
  { name: "Tokyo", slug: "tokyo" }
];

export default function TopLogo() {
  const pathname = usePathname();
  const { openModal } = useModal();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<"services" | "cities" | null>(null);

  // Monitor scroll for shadow triggers
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page transition
  useEffect(() => {
    setIsMobileOpen(false);
    setActiveAccordion(null);
  }, [pathname]);

  const toggleAccordion = (name: "services" | "cities") => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };



  return (
    <>
      {/* Main Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b flex items-center ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-primary/5 shadow-md h-16 md:h-20"
            : "bg-white/80 backdrop-blur-xl border-primary/5 h-20 md:h-24"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between w-full h-full">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl py-0.5"
            aria-label="Health Metro Homepage"
          >
            <Image
              src="/logo.png"
              alt="Health Metro"
              width={300}
              height={100}
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? "h-[40px] md:h-[58px]" : "h-[54px] md:h-[78px]"
              }`}
              priority
            />
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 h-full" aria-label="Primary Navigation">
            {/* Home */}
            <Link
              href="/"
              className={`flex items-center h-full font-semibold text-[15px] transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-foreground/80"
              }`}
            >
              Home
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              className={`flex items-center h-full font-semibold text-[15px] transition-colors hover:text-primary ${
                pathname === "/about" ? "text-primary" : "text-foreground/80"
              }`}
            >
              About Us
            </Link>

            {/* Services Dropdown */}
            <div className="relative group h-full flex items-center">
              <button
                className={`flex items-center gap-1 h-full font-semibold text-[15px] cursor-pointer transition-colors hover:text-primary ${
                  pathname.startsWith("/products") ? "text-primary" : "text-foreground/80"
                }`}
                aria-haspopup="true"
              >
                Services
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              {/* Services Dropdown Panel */}
              <div className="absolute top-[85%] left-1/2 -translate-x-[40%] w-[680px] mt-2 bg-white border border-primary/10 rounded-[2rem] shadow-[0_20px_50px_rgba(2,116,115,0.12)] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 p-8 grid grid-cols-2 gap-8">
                {/* Core Doorstep Services */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Core Doorstep Care
                  </h3>
                  <div className="space-y-1">
                    {coreServices.map((service) => {
                      return (
                        <Link
                          key={service.slug}
                          href={`/products/${service.slug}`}
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-primary/5 transition-all group/item"
                        >
                          <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 mt-0.5 relative flex items-center justify-center bg-primary/5 group-hover/item:scale-110 transition-all duration-300">
                            <Image
                              src={`/icons/${service.slug}.png`}
                              alt={service.name}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain absolute transition-all duration-300 group-hover/item:scale-95 group-hover/item:opacity-0"
                            />
                            <Image
                              src={`/icons/${service.slug}-fill.png`}
                              alt={service.name}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain absolute opacity-0 transition-all duration-300 group-hover/item:scale-105 group-hover/item:opacity-100"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-foreground group-hover/item:text-primary transition-colors">
                              {service.name}
                            </div>
                            <div className="text-[11px] text-foreground/50 font-medium leading-normal mt-0.5">
                              {service.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Advanced Diagnostics */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-secondary mb-4 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Advanced Diagnostics
                  </h3>
                  <div className="space-y-1">
                    {advancedDiagnostics.map((service) => {
                      const Icon = service.icon;
                      return (
                        <Link
                          key={service.slug}
                          href={`/products/${service.slug}`}
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-secondary/5 transition-all group/item"
                        >
                          <div className="p-2 rounded-xl bg-secondary/5 text-secondary group-hover/item:bg-secondary group-hover/item:text-white transition-colors mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-foreground group-hover/item:text-secondary transition-colors">
                              {service.name}
                            </div>
                            <div className="text-[11px] text-foreground/50 font-medium leading-normal mt-0.5">
                              {service.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Cities Dropdown */}
            <div className="relative group h-full flex items-center">
              <button
                className={`flex items-center gap-1 h-full font-semibold text-[15px] cursor-pointer transition-colors hover:text-primary ${
                  pathname.startsWith("/cities") ? "text-primary" : "text-foreground/80"
                }`}
                aria-haspopup="true"
              >
                Cities
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Cities Panel */}
              <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-[420px] mt-2 bg-white border border-primary/10 rounded-[2rem] shadow-[0_20px_50px_rgba(2,116,115,0.12)] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3 px-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Our Global Hubs
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {citiesList.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/cities/${city.slug}`}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-all text-[13px] font-bold text-foreground/80 hover:text-primary group/city"
                    >
                      <MapPin className="w-3.5 h-3.5 text-primary/30 group-hover/city:text-primary group-hover/city:scale-110 transition-all" />
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Us */}
            <Link
              href="/contact"
              className={`flex items-center h-full font-semibold text-[15px] transition-colors hover:text-primary ${
                pathname === "/contact" ? "text-primary" : "text-foreground/80"
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Area (Mobile Hamburger) */}
          <div className="flex lg:hidden items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="flex items-center justify-center p-2 rounded-xl border border-primary/10 bg-white/50 hover:bg-white text-primary transition-all focus:outline-none"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-x-0 bottom-0 bg-white z-40 lg:hidden flex flex-col justify-between overflow-y-auto transition-all duration-300 border-t border-primary/5 ${
          scrolled ? "top-16" : "top-20"
        } ${
          isMobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Mobile Navigation Content */}
        <div className="px-6 py-8 space-y-6">
          <nav className="flex flex-col gap-4" aria-label="Mobile Navigation">
            {/* Home */}
            <Link
              href="/"
              className={`font-bold text-lg py-2 transition-colors border-b border-surface ${
                pathname === "/" ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>

            {/* About */}
            <Link
              href="/about"
              className={`font-bold text-lg py-2 transition-colors border-b border-surface ${
                pathname === "/about" ? "text-primary" : "text-foreground"
              }`}
            >
              About Us
            </Link>

            {/* Services Accordion */}
            <div className="border-b border-surface py-2">
              <button
                onClick={() => toggleAccordion("services")}
                className="flex items-center justify-between w-full font-bold text-lg text-left"
              >
                Services
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    activeAccordion === "services" ? "rotate-180 text-primary" : "text-foreground/50"
                  }`}
                />
              </button>
              
              {activeAccordion === "services" && (
                <div className="mt-4 pl-3 space-y-5 animate-in fade-in slide-in-from-top-3 duration-200">
                  {/* Core Services */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-primary mb-3">
                      Core Doorstep Care
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {coreServices.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/products/${service.slug}`}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-primary/5 hover:border-primary/20 transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 relative flex items-center justify-center bg-primary/5 transition-all">
                            <Image
                              src={`/icons/${service.slug}.png`}
                              alt={service.name}
                              width={20}
                              height={20}
                              className="w-5 h-5 object-contain absolute transition-all duration-300 group-hover:opacity-0"
                            />
                            <Image
                              src={`/icons/${service.slug}-fill.png`}
                              alt={service.name}
                              width={20}
                              height={20}
                              className="w-5 h-5 object-contain absolute opacity-0 transition-all duration-300 group-hover:opacity-100"
                            />
                          </div>
                          <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{service.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Diagnostics */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-secondary mb-3">
                      Advanced Diagnostics
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {advancedDiagnostics.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/products/${service.slug}`}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-primary/5 hover:border-secondary/20 transition-all"
                        >
                          <div className="p-1.5 rounded-lg bg-secondary/5 text-secondary">
                            <service.icon className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-sm text-foreground">{service.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cities Accordion */}
            <div className="border-b border-surface py-2">
              <button
                onClick={() => toggleAccordion("cities")}
                className="flex items-center justify-between w-full font-bold text-lg text-left"
              >
                Cities
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    activeAccordion === "cities" ? "rotate-180 text-primary" : "text-foreground/50"
                  }`}
                />
              </button>

              {activeAccordion === "cities" && (
                <div className="mt-4 pl-3 animate-in fade-in slide-in-from-top-3 duration-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-primary mb-3">
                    Our Global Hubs
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {citiesList.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/cities/${city.slug}`}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-primary/5 hover:border-primary/20 text-xs font-bold text-foreground"
                      >
                        <MapPin className="w-3.5 h-3.5 text-primary/60" />
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <Link
              href="/contact"
              className={`font-bold text-lg py-2 transition-colors ${
                pathname === "/contact" ? "text-primary" : "text-foreground"
              }`}
            >
              Contact Us
            </Link>
          </nav>
        </div>

      </div>
    </>
  );
}

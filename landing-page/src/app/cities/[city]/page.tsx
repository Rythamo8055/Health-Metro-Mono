import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import cities from "@/data/cities.json";
import TopLogo from "@/components/TopLogo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Activity, MapPin, ShieldCheck, Globe } from "lucide-react";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) return {};

  return {
    title: `Health Metro in ${cityData.city} | Global Healthcare Connectivity`,
    description: `Experience world-class healthcare coordination in ${cityData.city}. ${cityData.highlight} Trusted by top hospitals in ${cityData.country}.`,
    openGraph: {
      title: `Health Metro in ${cityData.city}`,
      description: `Seamless healthcare connectivity for ${cityData.city}.`,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const cityData = cities.find((c) => c.slug === city);

  if (!cityData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopLogo />
      <Header />
      
      <main className="flex-grow pt-32 pb-48">
        <section className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-medium mb-8">
            <MapPin className="w-4 h-4" />
            <span>Health Metro Global Network: {cityData.city}, {cityData.country}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8 text-primary">
            Connecting Health in <br />
            <span className="text-secondary">{cityData.city}</span>
          </h1>

          <p className="text-xl text-foreground opacity-90 leading-relaxed mb-12 max-w-2xl">
            {cityData.highlight} Health Metro provides the digital infrastructure 
            necessary for seamless medical data exchange and coordination between 
            {cityData.city} and the rest of the world.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 bg-surface border border-primary/10 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">Local Reliability</h3>
              <p className="text-muted-foreground">
                99.9% uptime specifically optimized for {cityData.city}'s healthcare nodes.
              </p>
            </div>
            <div className="p-8 bg-surface border border-primary/10 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">Global Access</h3>
              <p className="text-muted-foreground">
                Instant connectivity to 330+ other cities directly from {cityData.city}.
              </p>
            </div>
          </div>

          <div className="bg-primary rounded-[3rem] p-8 md:p-16 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Trusted by Providers in {cityData.city}
              </h2>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-90">
                {cityData.hospitals.map((hospital) => (
                  <div key={hospital} className="px-6 py-3 bg-white/10 rounded-full text-sm font-bold backdrop-blur-sm">
                    {hospital}
                  </div>
                ))}
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 rounded-full blur-[100px]" />
          </div>

          <div className="mt-20 text-center">
            <button className="px-8 py-5 bg-secondary text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-secondary/20">
              Launch {cityData.city} Portal
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

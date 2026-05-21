"use client";

import Link from "next/link";
import RotatingText from "./RotatingText";

export default function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 text-foreground">
          <span className="text-secondary">Connecting Health</span> <br className="md:hidden" />
          <span className="inline-block md:inline mt-2 md:mt-0">
            <RotatingText
              texts={['Globally.', 'Reliably.', 'Everywhere.', 'Seamlessly.']}
              mainClassName="text-primary overflow-hidden py-1 md:py-2 px-2"
              staggerFrom="last"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-120%", opacity: 0 }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2500}
              splitBy="characters"
              auto
              loop
            />
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/80 leading-relaxed mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-medium">
          Affordable, accessible diagnostic and healthcare services — delivered at home,
          at a centre near you, or through a trusted doctor referral.
        </p>

        <div className="flex justify-center items-center animate-fade-in-up mt-8">
          <Link
            href="#about"
            id="hero-cta-about"
            className="px-8 py-5 bg-white text-foreground border border-foreground/20 rounded-2xl font-bold text-lg hover:bg-secondary hover:text-white hover:border-secondary transition-all text-center shadow-sm hover:shadow-[0_8px_20px_rgba(217,114,52,0.25)] hover:scale-[1.02] active:scale-[0.98]"
          >
            About Health Metro
          </Link>
        </div>
      </div>
    </section>
  );
}

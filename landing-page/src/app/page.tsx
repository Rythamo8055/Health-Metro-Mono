import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Features from "@/components/Features";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import TopLogo from "@/components/TopLogo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopLogo />
      <Header />
      <main id="main-content" className="flex-grow">
        <Hero />
        <Testimonials />
        <Features />
        <About />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

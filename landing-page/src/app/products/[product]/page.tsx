import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import products from "@/data/products.json";
import TopLogo from "@/components/TopLogo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Activity, Home, Stethoscope, HeartHandshake, ClipboardList, Microscope, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
  params: Promise<{ product: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    product: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await params;
  const productData = products.find((p) => p.slug === product);
  if (!productData) return {};

  return {
    title: `${productData.name} | ${productData.title} | HealthMetro`,
    description: productData.description,
    openGraph: {
      title: `${productData.name} | ${productData.title}`,
      description: productData.description,
    },
  };
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Activity": return <Activity className="w-12 h-12" />;
    case "Home": return <Home className="w-12 h-12" />;
    case "Stethoscope": return <Stethoscope className="w-12 h-12" />;
    case "HeartHandshake": return <HeartHandshake className="w-12 h-12" />;
    case "ClipboardList": return <ClipboardList className="w-12 h-12" />;
    case "Microscope": return <Microscope className="w-12 h-12" />;
    default: return <Activity className="w-12 h-12" />;
  }
};

export default async function ProductPage({ params }: Props) {
  const { product } = await params;
  const productData = products.find((p) => p.slug === product);

  if (!productData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopLogo />
      <Header />
      
      <main className="flex-grow pt-32 pb-48">
        <section className="max-w-5xl mx-auto px-6">
          
          {/* Hero Section */}
          <div className="text-center mb-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-8 shadow-sm">
              {getIcon(productData.icon)}
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-6 tracking-widest uppercase">
              {productData.name}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8 text-primary">
              {productData.title}
            </h1>
            <p className="text-xl text-foreground opacity-90 leading-relaxed max-w-2xl">
              {productData.description}
            </p>
          </div>

          {/* Features & Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {/* Features */}
            <div className="bg-surface border border-primary/10 rounded-[2.5rem] p-10 shadow-sm">
              <h3 className="text-2xl font-bold mb-8 text-primary">Key Features</h3>
              <ul className="space-y-6">
                {productData.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="mt-1 bg-secondary/20 text-secondary rounded-full p-1 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-lg text-muted-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Journey Flow */}
            <div className="bg-primary rounded-[2.5rem] p-10 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
              <h3 className="text-2xl font-bold mb-8 relative z-10">User Journey</h3>
              <div className="space-y-6 relative z-10">
                {productData.flow.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-lg font-medium opacity-90">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">Ready to experience {productData.name}?</h2>
            <button className="px-10 py-5 bg-secondary text-white rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/20 inline-flex items-center gap-3">
              Explore Services <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}

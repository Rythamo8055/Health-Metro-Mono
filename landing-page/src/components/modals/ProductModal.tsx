"use client";

import Image from "next/image";
import { useModal } from "@/context/ModalContext";
import products from "@/data/products.json";

export default function ProductModal() {
  const { data: productId, closeModal, openModal } = useModal();
  
  const product = products.find(p => p.id === productId);

  if (!product) return null;

  return (
    <div className="p-6 md:p-8 flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
            <Image 
              src={`/icons/${product.id}.png`}
              alt={product.name}
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
              {product.name}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight">
              {product.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Content Scrollable Area */}
      <div className="flex-grow overflow-y-auto pr-2 pb-20 custom-scrollbar">
        <p className="text-foreground opacity-70 leading-relaxed mb-8 text-sm md:text-base">
          {product.description}
        </p>

        {/* Features */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Key Features</h3>
          <ul className="space-y-3">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-foreground opacity-80">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Flow */}
        <div>
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">How it works</h3>
          <div className="relative border-l-2 border-primary/20 ml-2.5 space-y-4 pb-4">
            {product.flow.slice(0, 5).map((step, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary" />
                <p className="text-sm text-foreground opacity-80">{step}</p>
              </div>
            ))}
            {product.flow.length > 5 && (
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-surface border-2 border-primary/30" />
                <p className="text-xs text-foreground opacity-50 italic">...and more steps</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-primary/5">
        <button
          onClick={() => openModal("contact")}
          className="w-full py-4 bg-secondary text-white rounded-xl font-bold text-base hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-secondary/20"
        >
          Book {product.name} Now →
        </button>
      </div>
    </div>
  );
}

"use client";

import CircularGallery from "./CircularGallery";

// High-quality medical and wellness images from Unsplash
const galleryItems = [
  { image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80", text: "Home Collection" },
  { image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80", text: "Lab Reports" },
  { image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80", text: "Doctor Consult" },
  { image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=800&q=80", text: "Health Records" },
  { image: "https://images.unsplash.com/photo-1581579205702-c6e151c92174?auto=format&fit=crop&w=800&q=80", text: "NRI Care" },
  { image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80", text: "Diagnostics" },
  { image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80", text: "Pathology" },
  { image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80", text: "Wellness" },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-0 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-4 text-primary tracking-tighter">
          Trusted by Thousands
        </h2>
        <p className="text-xl text-foreground opacity-70 max-w-2xl mx-auto font-medium">
          Scroll through our services — drag or swipe to explore.
        </p>
      </div>

      {/* CircularGallery — full-width, no horizontal padding */}
      <div style={{ height: "600px", position: "relative" }}>
        <CircularGallery
          items={galleryItems}
          bend={1}
          textColor="#0f172a"
          font="bold 44px system-ui, sans-serif"
          borderRadius={0.05}
          scrollSpeed={2}
          scrollEase={0.05}
        />
      </div>
    </section>
  );
}

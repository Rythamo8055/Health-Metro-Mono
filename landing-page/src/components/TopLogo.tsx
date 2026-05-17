"use client";
import Image from 'next/image';
import Link from 'next/link';

export default function TopLogo() {
  return (
    <div className="fixed top-0 left-0 w-full z-40 pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center md:justify-start">
        <Link 
          href="/"
          className="pointer-events-auto bg-white/80 backdrop-blur-xl rounded-2xl border border-primary/10 px-6 py-3 shadow-md hover:shadow-lg transition-all"
        >
          <Image
            src="/logo.png"
            alt="Health Metro"
            width={180}
            height={90}
            className="h-12 md:h-14 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </div>
  );
}

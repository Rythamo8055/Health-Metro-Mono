import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Health Metro | Connecting Health Globally",
  description: "Experience world-class healthcare connectivity with Health Metro. Connecting 330+ cities worldwide with ultra-reliable digital infrastructure for medical tourism, emergency records, and global health coordination.",
  keywords: [
    "healthcare connectivity", 
    "health metro", 
    "medical tourism", 
    "global health coordination", 
    "digital health infrastructure",
    "emergency medical records",
    "international healthcare"
  ],
  authors: [{ name: "Health Metro Team" }],
  metadataBase: new URL("https://healthmetro.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Health Metro | Connecting Health Globally",
    description: "World-class healthcare connectivity for everyone, everywhere. 330+ cities, 99.9% uptime.",
    type: "website",
    url: "/",
    siteName: "Health Metro",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Health Metro | Connecting Health Globally",
    description: "World-class healthcare connectivity for everyone, everywhere.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

const medicalOrgSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "Health Metro",
  "url": "https://healthmetro.com",
  "logo": "https://healthmetro.com/logo.png",
  "description": "Connecting Health Globally — the world's platform for international healthcare connectivity and medical coordination.",
  "sameAs": [
    "https://twitter.com/healthmetro",
    "https://linkedin.com/company/healthmetro",
    "https://en.wikipedia.org/wiki/Health_Metro"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "telephone": "+1-800-HEALTH",
    "availableLanguage": "English"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Health Metro HQ",
    "addressLocality": "Global",
    "addressCountry": "Global"
  }
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Health Metro",
  "url": "https://healthmetro.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://healthmetro.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you offer Home Sample Collection?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our HM EASY service provides secure and hygienic home sample collection by certified phlebotomists. You can select your preferred time slot, and the samples will be processed at NABL-accredited partner labs."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to get my reports?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most routine diagnostic reports are generated within 24 to 48 hours. Once ready, they are automatically uploaded to your HM OHR (Digital Health Records) account, where you can view, download, or share them securely."
      }
    },
    {
      "@type": "Question",
      "name": "I am an NRI. Can I book tests or doctor visits for my parents in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. With our HM RELY service, you can create a profile for your parents, book tests or doctor consultations for them anywhere in India, and receive real-time notifications and access to their health records from abroad."
      }
    },
    {
      "@type": "Question",
      "name": "Are your doctors available for online consultations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our HM TRUST service connects you with verified specialists for both online video consultations and Doctor-at-Home visits. You will also receive digital prescriptions directly in your app."
      }
    },
    {
      "@type": "Question",
      "name": "Are my medical records secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Security is our highest priority. The HM OHR system uses end-to-end encryption to store your family's health history safely. Only authorized users and your consulting doctors can access your data."
      }
    }
  ]
};

const schemas = [medicalOrgSchema, webSiteSchema, faqSchema];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {/* Skip to main content — visible only on keyboard focus */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-5 focus:py-3 focus:bg-primary focus:text-white focus:rounded-xl focus:font-bold focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doctor Registration | Health Metro Partner Network",
  description: "Join the Health Metro Partner Network. Elite doctor onboarding, secure payouts, and global patient coordination for verified medical professionals.",
  keywords: [
    "doctor registration",
    "medical partner network",
    "health metro doctor onboarding",
    "telemedicine platform for doctors",
    "secure doctor payouts",
    "verified medical professionals",
  ],
  metadataBase: new URL("https://healthmetro-forms-mono.vercel.app"),
  openGraph: {
    title: "Join Health Metro | Doctor Registration",
    description: "Grow your practice with the modern clinical partner network.",
    url: "/",
    siteName: "Health Metro",
    images: [{ url: "/medical-technical.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doctor Registration | Health Metro",
    description: "Elite doctor onboarding for global healthcare coordination.",
    images: ["/medical-technical.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      "name": "Health Metro",
      "alternateName": "Health Metro Partner Network",
      "url": "https://healthmetro-forms-mono.vercel.app",
      "logo": "https://healthmetro-forms-mono.vercel.app/logo.png",
      "description": "The world's most secure and fast doctor onboarding platform for the Health Metro medical network.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Health Metro Registration",
      "url": "https://healthmetro-forms-mono.vercel.app",
    }
  ];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

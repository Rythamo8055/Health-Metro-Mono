import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Health Metro',
  description: 'Health Metro Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
// CI/CD Trigger
// CI/CD Trigger v2
// CI/CD Trigger v3
// CI/CD Trigger v4
// CI/CD Final Fix - correct project IDs

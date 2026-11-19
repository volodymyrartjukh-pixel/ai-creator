import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Beloved – Romantic Gifts',
  description: 'Discover curated romantic gifts for the one you love.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

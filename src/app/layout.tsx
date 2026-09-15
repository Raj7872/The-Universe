import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['100', '200', '300'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Our Universe — A Birthday Story',
  description: 'A cinematic interactive universe, made for you.',
  keywords: ['birthday', 'interactive', '3d', 'universe', 'cinematic', 'personal'],
  openGraph: {
    title: 'Our Universe — A Birthday Story',
    description: 'A cinematic interactive universe, made for you.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#04050f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}

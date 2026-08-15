import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import BackgroundMusic from '@/components/BackgroundMusic';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'KalaKriti Arts Studio | Handmade Indian Crafts & Boutique',
  description: 'Single-artisan boutique store selling original Canvas Paintings, Lippan Mirror Art, Scented Soy Wax Candles, Resin Decor & Hand-Painted MDF Crafts in India.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-stone-50 text-stone-900 antialiased font-sans selection:bg-amber-800 selection:text-amber-100">
        <CartProvider>
          <WishlistProvider>
            {children}
            <BackgroundMusic />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

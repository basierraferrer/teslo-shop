import type { Metadata } from 'next';
import { inter } from '@/config/fonts';

import './globals.css';
import { Providers } from '@/components';

export const metadata: Metadata = {
  title: {
    template: '%s - Teslo | Shop',
    default: 'Home - Teslo | Shop',
  },
  description: 'Una tienda virtual de productos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers clientId={process.env.NEXT_PAYPAL_PUBLIC_ID ?? ''}>{children}</Providers>
      </body>
    </html>
  );
}

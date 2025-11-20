import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Website & Webshop Builder',
  description: 'Build websites and online shops with modular blocks',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

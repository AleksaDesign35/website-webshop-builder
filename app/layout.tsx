import type { Metadata } from 'next';
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
      <body>{children}</body>
    </html>
  );
}

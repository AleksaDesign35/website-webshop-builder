'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/dashboard/header';
import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Hide header in block editor mode, but keep compact sidebar
  const isBlockEditor =
    pathname?.includes('/pages/') && pathname?.includes('/sites/');

  if (isBlockEditor) {
    // Block editor mode - no header, but compact sidebar for navigation
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar compact />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

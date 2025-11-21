import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Page',
  description: 'Published page preview',
};

// Minimal layout for live pages - overrides root layout to skip Providers
// This reduces JavaScript bundle size significantly
export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return children directly without Providers wrapper
  // This prevents React Query, Toaster, and DevTools from loading
  return <>{children}</>;
}


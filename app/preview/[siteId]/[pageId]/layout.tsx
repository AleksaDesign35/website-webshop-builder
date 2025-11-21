import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preview',
  description: 'Page preview',
};

// Minimal layout for preview - overrides root layout to skip Providers
// This reduces JavaScript bundle size significantly
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return children directly without Providers wrapper
  // This prevents React Query, Toaster, and DevTools from loading
  return <>{children}</>;
}

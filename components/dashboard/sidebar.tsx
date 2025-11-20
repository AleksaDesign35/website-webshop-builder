'use client';

import { FileText, Home, Layout, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Sites', href: '/dashboard/sites', icon: FileText },
  { name: 'Templates', href: '/dashboard/templates', icon: Sparkles },
  { name: 'Blocks', href: '/dashboard/blocks', icon: Layout },
];

export function Sidebar() {
  const pathname = usePathname();

  const isSettingsActive = pathname === '/dashboard/settings';

  return (
    <div className="flex h-full w-64 flex-col border-border border-r bg-card">
      <nav className="flex-1 space-y-1 p-4 pt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              href={item.href}
              key={item.name}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-border border-t p-4">
        <Link
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors',
            isSettingsActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
          href="/dashboard/settings"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </div>
  );
}

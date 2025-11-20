'use client';

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Layout,
  Settings,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Sites', href: '/dashboard/sites', icon: FileText },
  { name: 'Templates', href: '/dashboard/templates', icon: Sparkles },
  { name: 'Blocks', href: '/dashboard/blocks', icon: Layout },
];

interface SidebarProps {
  compact?: boolean;
}

export function Sidebar({ compact: forceCompact = false }: SidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Load preference from localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('sidebar-expanded');
    if (saved !== null) {
      setIsExpanded(saved === 'true');
    }
  }, []);

  // Save preference to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('sidebar-expanded', String(isExpanded));
    }
  }, [isExpanded, isMounted]);

  const isSettingsActive = pathname === '/dashboard/settings';

  // If forceCompact is true (block editor mode), always show compact
  const isCompact = forceCompact || !isExpanded;

  if (forceCompact) {
    // Always compact in block editor mode
    return (
      <div className="flex h-full w-16 flex-col border-border border-r bg-card">
        <nav className="flex-1 space-y-1 p-2 pt-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                className={cn(
                  'flex items-center justify-center rounded-lg p-3 font-medium text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                href={item.href}
                key={item.name}
                title={item.name}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>
        <div className="border-border border-t p-2">
          <Link
            className={cn(
              'flex items-center justify-center rounded-lg p-3 font-medium text-sm transition-colors',
              isSettingsActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
            href="/dashboard/settings"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-border border-r bg-card transition-all duration-300',
        isCompact ? 'w-16' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <div className="-right-3 absolute top-4 z-10">
        <Button
          className="h-6 w-6 rounded-full border-2 border-border bg-card p-0 shadow-md hover:bg-accent"
          onClick={() => setIsExpanded(!isExpanded)}
          size="icon"
          variant="ghost"
        >
          {isCompact ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

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
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                isCompact && 'justify-center'
              )}
              href={item.href}
              key={item.name}
              title={isCompact ? item.name : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCompact && <span>{item.name}</span>}
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
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            isCompact && 'justify-center'
          )}
          href="/dashboard/settings"
          title={isCompact ? 'Settings' : undefined}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCompact && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
}

'use client';

import { Bell, LogOut, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-border border-b bg-card px-6">
      <div className="flex items-center">
        <Link className="font-bold text-primary text-xl" href="/dashboard">
          Builder
        </Link>
      </div>

      <div className="-translate-x-1/2 absolute left-1/2">
        <div className="relative w-64">
          <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="h-8 w-full rounded-md border border-input bg-background pr-2.5 pl-8 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Search sites, pages..."
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleLogout} title="Sign out">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

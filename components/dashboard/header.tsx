import { Bell, Search, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-border border-b bg-card px-6">
      {/* Logo/Naziv sajta - levo */}
      <div className="flex items-center">
        <Link className="font-bold text-[#3aff7a] text-xl" href="/dashboard">
          Builder
        </Link>
      </div>

      {/* Search - sredina */}
      <div className="-translate-x-1/2 absolute left-1/2">
        <div className="relative w-64">
          <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="h-8 w-full rounded-md border border-input bg-background pr-2.5 pl-8 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3aff7a]/20"
            placeholder="Search sites, pages..."
            type="search"
          />
        </div>
      </div>

      {/* Actions - desno */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

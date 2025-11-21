'use client';

import { Search, User, Heart, ShoppingCart, Globe } from 'lucide-react';
import type { SiteThemeSettings } from '@/components/dashboard/site-settings';

interface Header1Props {
  theme?: SiteThemeSettings;
  logoUrl?: string | null;
  siteName?: string;
}

export function Header1({ theme, logoUrl, siteName }: Header1Props) {
  const primaryColor = theme?.primaryColor || '#3b82f6';
  const textColor = theme?.textColor || '#1e293b';
  const fontFamily = theme?.fontFamily || 'system-ui';

  return (
    <header
      className="w-full border-b"
      style={{
        backgroundColor: theme?.backgroundColor || '#ffffff',
        color: textColor,
        fontFamily,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName || 'Logo'} className="h-10" />
          ) : (
            <span className="text-xl font-bold" style={{ color: primaryColor }}>
              {siteName || 'Logo'}
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: textColor }}
          >
            Elektronika i tehnologija
          </a>
          <a
            href="#"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: textColor }}
          >
            Graditeljstvo
          </a>
          <a
            href="#"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: textColor }}
          >
            Alati
          </a>
          <a
            href="#"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: textColor }}
          >
            Dom i hobi
          </a>
          <a
            href="#"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: textColor }}
          >
            Uredski pribor i oprema
          </a>
          <a
            href="#"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: textColor }}
          >
            Zdravlje i njega
          </a>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 transition-colors hover:opacity-80"
            style={{ color: textColor }}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 transition-colors hover:opacity-80"
            style={{ color: textColor }}
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative p-2 transition-colors hover:opacity-80"
            style={{ color: textColor }}
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative p-2 transition-colors hover:opacity-80"
            style={{ color: textColor }}
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span
              className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              3
            </span>
          </button>
          <button
            type="button"
            className="p-2 transition-colors hover:opacity-80"
            style={{ color: textColor }}
            aria-label="Language"
          >
            <Globe className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}


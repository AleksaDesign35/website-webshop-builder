'use client';

import { Search, User, Heart, ShoppingCart } from 'lucide-react';
import type { SiteThemeSettings } from '@/components/dashboard/site-settings';

interface Header2Props {
  theme?: SiteThemeSettings;
  logoUrl?: string | null;
  siteName?: string;
}

export function Header2({ theme, logoUrl, siteName }: Header2Props) {
  const primaryColor = theme?.primaryColor || '#3b82f6';
  const textColor = theme?.textColor || '#1e293b';
  const fontFamily = theme?.fontFamily || 'system-ui';

  return (
    <header
      className="w-full"
      style={{
        backgroundColor: theme?.backgroundColor || '#ffffff',
        color: textColor,
        fontFamily,
      }}
    >
      {/* Top bar */}
      <div className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:opacity-80" style={{ color: textColor }}>
              Akcije
            </a>
            <a href="#" className="hover:opacity-80" style={{ color: textColor }}>
              Novo u ponudi
            </a>
            <a href="#" className="hover:opacity-80" style={{ color: textColor }}>
              Sniženja
            </a>
            <a href="#" className="hover:opacity-80" style={{ color: textColor }}>
              Brandovi
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: textColor }}>
              Uz kod GH10 ostvarite 10% POPUSTA na sve artikle.
            </span>
            <select
              className="border-none bg-transparent text-xs"
              style={{ color: textColor }}
            >
              <option>Hrvatski</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b">
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

          {/* Search */}
          <div className="flex flex-1 items-center justify-center px-8">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                placeholder="Pretražite trgovinu..."
                className="w-full rounded-lg border px-4 py-2 pl-10"
                style={{
                  borderColor: primaryColor,
                  color: textColor,
                }}
              />
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: textColor }}
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
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
              className="p-2 transition-colors hover:opacity-80"
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
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div
        className="w-full"
        style={{ backgroundColor: primaryColor, color: '#ffffff' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-3">
          <a href="#" className="text-sm font-medium hover:opacity-80">
            Elektronika i tehnologija
          </a>
          <a href="#" className="text-sm font-medium hover:opacity-80">
            Graditeljstvo
          </a>
          <a href="#" className="text-sm font-medium hover:opacity-80">
            Alati
          </a>
          <a href="#" className="text-sm font-medium hover:opacity-80">
            Dom i hobi
          </a>
          <a href="#" className="text-sm font-medium hover:opacity-80">
            Uredski pribor i oprema
          </a>
          <a href="#" className="text-sm font-medium hover:opacity-80">
            Zdravlje i njega
          </a>
        </div>
      </div>
    </header>
  );
}


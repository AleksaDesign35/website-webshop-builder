'use client';

import type { SiteThemeSettings } from '@/components/dashboard/site-settings';

interface Footer2Props {
  theme?: SiteThemeSettings;
  siteName?: string;
}

export function Footer2({ theme, siteName }: Footer2Props) {
  const primaryColor = theme?.primaryColor || '#3b82f6';
  const textColor = theme?.textColor || '#1e293b';
  const fontFamily = theme?.fontFamily || 'system-ui';

  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: primaryColor,
        color: '#ffffff',
        fontFamily,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold">{siteName || 'Company'}</h3>
            <p className="mb-4 text-sm leading-relaxed opacity-90">
              Vaša pouzdana destinacija za sve što vam treba. Kvalitet,
              pouzdanost i odlična usluga.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                aria-label="Facebook"
              >
                <span className="text-sm">f</span>
              </a>
              <a
                href="#"
                className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                aria-label="Instagram"
              >
                <span className="text-sm">ig</span>
              </a>
              <a
                href="#"
                className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                aria-label="Twitter"
              >
                <span className="text-sm">t</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">Informacije</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:opacity-80">
                  O nama
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80">
                  Kontakt
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80">
                  Dostava i plaćanje
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80">
                  Povrat i reklamacija
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80">
                  Uvjeti korištenja
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 font-semibold">Newsletter</h4>
            <p className="mb-4 text-sm opacity-90">
              Prijavite se za najnovije ponude i akcije
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Vaša email adresa"
                className="w-full rounded-lg border-0 px-4 py-2 text-gray-900"
                required
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-white px-4 py-2 font-semibold transition-colors hover:opacity-90"
                style={{ color: primaryColor }}
              >
                Prijavi se
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm opacity-90">
              © {new Date().getFullYear()} {siteName || 'Company'}. Sva prava
              zadržana.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:opacity-80">
                Politika privatnosti
              </a>
              <a href="#" className="hover:opacity-80">
                Uvjeti korištenja
              </a>
              <a href="#" className="hover:opacity-80">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


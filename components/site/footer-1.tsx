'use client';

import type { SiteThemeSettings } from '@/components/dashboard/site-settings';

interface Footer1Props {
  theme?: SiteThemeSettings;
  siteName?: string;
}

export function Footer1({ theme, siteName }: Footer1Props) {
  const primaryColor = theme?.primaryColor || '#3b82f6';
  const textColor = theme?.textColor || '#1e293b';
  const backgroundColor = theme?.backgroundColor || '#ffffff';
  const fontFamily = theme?.fontFamily || 'system-ui';

  return (
    <footer
      className="w-full border-t"
      style={{
        backgroundColor,
        color: textColor,
        fontFamily,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3
              className="mb-4 font-semibold text-lg"
              style={{ color: primaryColor }}
            >
              O nama
            </h3>
            <p className="text-sm leading-relaxed opacity-80">
              {siteName || 'Vaša kompanija'} - kvalitet i pouzdanost u svakoj
              ponudi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="mb-4 font-semibold text-lg"
              style={{ color: primaryColor }}
            >
              Brzi linkovi
            </h3>
            <ul className="space-y-2 text-sm">
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
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3
              className="mb-4 font-semibold text-lg"
              style={{ color: primaryColor }}
            >
              Korisnička podrška
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:opacity-80">
                  Pomoć
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80">
                  Dostava
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80">
                  Povrat
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80">
                  Reklamacija
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="mb-4 font-semibold text-lg"
              style={{ color: primaryColor }}
            >
              Kontakt
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="opacity-80">Email: info@example.com</li>
              <li className="opacity-80">Tel: +386 1 5564 859</li>
              <li className="opacity-80">Radno vrijeme: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 border-t pt-8 text-center text-sm"
          style={{ borderColor: primaryColor + '20' }}
        >
          <p className="opacity-80">
            © {new Date().getFullYear()} {siteName || 'Company'}. Sva prava
            zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
}


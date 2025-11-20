# Konfiguracija Projekta - ChabolitWeb

Ovaj fajl sadrži sve konfiguracije projekta koje možete kopirati u novi projekat.

## 1. biome.jsonc

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",
  "extends": ["ultracite"],
  "files": {
    "includes": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
  },
  "linter": {
    "rules": {
      "performance": {
        "noNamespaceImport": "warn"
      }
    }
  }
}
```

## 2. package.json

```json
{
  "name": "chabolitweb",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "NODE_OPTIONS='--inspect' next dev --turbopack",
    "dev:debug": "NODE_OPTIONS='--inspect' next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "ultracite lint",
    "format": "ultracite format"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.1",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@radix-ui/react-visually-hidden": "^1.2.3",
    "@tanstack/react-query": "^5.85.5",
    "@tanstack/react-query-devtools": "^5.85.5",
    "@tanstack/react-table": "^8.21.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.540.0",
    "next": "15.4.6",
    "next-themes": "^0.4.6",
    "react": "19.1.0",
    "react-day-picker": "^9.9.0",
    "react-dom": "19.1.0",
    "react-hook-form": "^7.62.0",
    "react-resizable-panels": "^3.0.4",
    "recharts": "2.15.4",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1",
    "vaul": "^1.1.2",
    "zod": "^4.0.17",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@biomejs/biome": "2.2.0",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20.19.12",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.7",
    "typescript": "^5",
    "ultracite": "5.2.3"
  },
  "packageManager": "pnpm@10.6.5+sha512.cdf928fca20832cd59ec53826492b7dc25dc524d4370b6b4adbf65803d32efaa6c1c88147c0ae4e8d579a6c9eec715757b50d4fa35eea179d868eada4ed043af"
}
```

## 3. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    },
    "strictNullChecks": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 4. next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://dev-api.mmfans.rs',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

## 5. components.json (shadcn/ui konfiguracija)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## 6. postcss.config.mjs

```javascript
const config = {
  plugins: ['@tailwindcss/postcss'],
};

export default config;
```

## 7. commitlint.config.js

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat[new]:',
        'feat[upd]:',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
  },
};
```

## 8. .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
.idea

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*
!.env.example

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

## 9. app/globals.css (Tailwind CSS konfiguracija)

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}
.dark {
  --background: oklch(0.20 0 0);
  --foreground: oklch(0.98 0 0);
  --card: oklch(0.25 0 0);
  --card-foreground: oklch(0.98 0 0);
  --popover: oklch(0.25 0 0);
  --popover-foreground: oklch(0.98 0 0);
  --primary: oklch(0.94 0 0);
  --primary-foreground: oklch(0.22 0 0);
  --secondary: oklch(0.32 0 0);
  --secondary-foreground: oklch(0.98 0 0);
  --muted: oklch(0.32 0 0);
  --muted-foreground: oklch(0.74 0 0);
  --accent: oklch(0.32 0 0);
  --accent-foreground: oklch(0.98 0 0);
  --destructive: oklch(0.74 0.191 22.216);
  --border: oklch(1 0 0 / 15%);
  --input: oklch(1 0 0 / 20%);
  --ring: oklch(0.60 0 0);
  --chart-1: oklch(0.52 0.243 264.376);
  --chart-2: oklch(0.72 0.17 162.48);
  --chart-3: oklch(0.80 0.188 70.08);
  --chart-4: oklch(0.66 0.265 303.9);
  --chart-5: oklch(0.68 0.246 16.439);
  --sidebar: oklch(0.25 0 0);
  --sidebar-foreground: oklch(0.98 0 0);
  --sidebar-primary: oklch(0.52 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.98 0 0);
  --sidebar-accent: oklch(0.32 0 0);
  --sidebar-accent-foreground: oklch(0.98 0 0);
  --sidebar-border: oklch(1 0 0 / 15%);
  --sidebar-ring: oklch(0.60 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 10. middleware.ts (opciono - za autentifikaciju)

```typescript
/** biome-ignore-all lint/suspicious/noConsole: required for debugging middleware authentication flow */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];
const AUTH_ROUTES = ['/login'];

// Function to validate token directly with the backend API
async function validateToken(
  token: string,
  userUuid: string
): Promise<boolean> {
  try {
    // Validate token by calling any endpoint that requires authentication
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://dev-api.mmfans.rs'}/api/organization/getAll`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playerUuid: userUuid }),
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Get token and user UUID from cookies or headers
  const token =
    request.cookies.get('auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  const userUuid = request.cookies.get('user_uuid')?.value;

  // If accessing a protected route
  if (isProtectedRoute) {
    const missingToken = !token;
    const missingUserUuid = !userUuid;

    if (missingToken || missingUserUuid) {
      // No token or user UUID - redirect to login with the current URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', 'protected');
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate token with backend (we know both token and userUuid exist here)
    const isValidToken = await validateToken(token, userUuid);

    if (!isValidToken) {
      // Invalid/expired token - redirect to login with session expired message
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('expired', 'true');
      loginUrl.searchParams.set('redirect', pathname);

      const response = NextResponse.redirect(loginUrl);

      // Clear the invalid token and user UUID
      response.cookies.delete('auth_token');
      response.cookies.delete('user_uuid');

      return response;
    }
  }

  // If accessing auth routes while authenticated, redirect to dashboard
  if (isAuthRoute && token && userUuid) {
    const isValidToken = await validateToken(token, userUuid);

    if (isValidToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Clear invalid token and user UUID
    const response = NextResponse.next();
    response.cookies.delete('auth_token');
    response.cookies.delete('user_uuid');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

## Instalacija i Setup

### Koraci za postavljanje novog projekta:

1. **Kreirajte novi Next.js projekat:**
   ```bash
   npx create-next-app@latest
   ```

2. **Kopirajte sve konfiguracije iz ovog fajla** u odgovarajuće fajlove u novom projektu.

3. **Instalirajte dependencies:**
   ```bash
   pnpm install
   ```

4. **Inicijalizujte Ultracite:**
   ```bash
   npx ultracite init
   ```

5. **Instalirajte commitlint:**
   ```bash
   pnpm add -D @commitlint/cli @commitlint/config-conventional
   ```

## Napomene

- **Ultracite**: Projekat koristi Ultracite za linting i formatting. Proverite da li je `ultracite` package instaliran.
- **Package Manager**: Projekat koristi `pnpm`. Možete promeniti u `npm` ili `yarn` ako želite.
- **API URL**: Promenite `NEXT_PUBLIC_API_BASE_URL` u `next.config.ts` prema vašem backend API-ju.
- **Middleware**: `middleware.ts` je specifičan za ovaj projekat i možda neće biti potreban u novom projektu.
- **Tailwind CSS v4**: Projekat koristi Tailwind CSS v4 sa novom `@theme` sintaksom.

## Ključne karakteristike konfiguracije

- ✅ **TypeScript** sa striktnim tipovima
- ✅ **Biome/Ultracite** za linting i formatting
- ✅ **Tailwind CSS v4** sa custom theme varijablama
- ✅ **shadcn/ui** komponente
- ✅ **React Query** za state management
- ✅ **Zustand** za globalni state
- ✅ **React Hook Form + Zod** za validaciju
- ✅ **Commitlint** za konvencionalne commit poruke
- ✅ **Next.js 15** sa Turbopack


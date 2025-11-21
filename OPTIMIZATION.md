# Preview Performance Optimization

## Problem
Preview stranice učitavaju puno JavaScript-a (React hydration, Next.js dev scripts, React Query, Toaster, DevTools) što usporava učitavanje.

## Rješenja Implementirana

### 1. Minimal Layout za Preview
- Kreiran posebni `layout.tsx` u `app/preview/[siteId]/[pageId]/` koji pokušava minimizirati Providers
- **Napomena**: Next.js App Router kompozira layout-ove, ne override-uje ih, tako da root layout i dalje učitava Providers

### 2. `suppressHydrationWarning`
- Dodato `suppressHydrationWarning` na sve elemente u preview stranici
- Ovo smanjuje React hydration overhead

### 3. Static Rendering (za budućnost)
- Može se koristiti `export const dynamic = 'force-static'` za statički rendering
- **Problem**: Ne radi sa dinamičkim podacima iz Supabase

## Preporučena Rješenja za Maksimalnu Brzinu

### Opcija 1: Statički HTML Export (Najbrže)
1. Kreirati API endpoint koji generiše statički HTML
2. Koristiti `renderToString` iz `react-dom/server`
3. Vratiti pure HTML bez React skripti
4. Cache-ovati rezultat

### Opcija 2: CDN + Static Generation
1. Koristiti Next.js `output: 'export'` za statički export
2. Pre-build-ovati sve stranice u HTML
3. Hostovati na CDN-u (Vercel, Cloudflare Pages, Netlify)

### Opcija 3: Edge Runtime
1. Koristiti `export const runtime = 'edge'`
2. Renderovati na Edge-u za brže response time
3. Minimizirati JavaScript bundle

### Opcija 4: Custom HTML Generator
1. Kreirati standalone HTML generator koji ne koristi React
2. Generiše čisti HTML/CSS iz block definicija
3. Može se koristiti za statički export ili API endpoint

## Trenutno Stanje
- Preview stranice koriste React Server Components
- Next.js i dalje učitava React hydration skripte u development modu
- U production modu, Next.js optimizuje i minimizuje JavaScript

## Za Development
Script tagovi dolaze iz:
- Next.js development mode (hot reload, dev tools)
- React hydration
- React Query DevTools
- Toaster komponenta

Ovo je normalno u development modu. U production build-u, većina ovih skripti se uklanja ili minimizira.



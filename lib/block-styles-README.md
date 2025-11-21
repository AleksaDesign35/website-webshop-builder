# Block Styles System

Sistem za generisanje čistog, optimizovanog HTML-a i CSS-a za blokove. Osigurava konzistentan, light-weight output sa maksimalnom performansom.

## Pristup

1. **Tailwind klase gdje je moguće** - Koristi utility klase umjesto inline styles za bolje performanse
2. **Optimizovani inline styles** - Za dinamičke vrijednosti koje ne mogu biti Tailwind klase
3. **Čist HTML output** - Konzistentno formatiranje i minimizacija nepotrebnih atributa

## Funkcije

### `mapToTailwindClass(type, value)`

Mapira uobičajene vrijednosti na Tailwind utility klase.

```typescript
mapToTailwindClass('textAlign', 'center') // 'text-center'
mapToTailwindClass('padding', 16) // 'p-4'
mapToTailwindClass('gap', 24) // 'gap-6'
```

### `optimizePadding(padding)`

Optimizuje padding objekat koristeći Tailwind klase gdje je moguće.

```typescript
const { classes, styles } = optimizePadding({
  top: 16,
  bottom: 16,
  left: 20,
  right: 20,
});
// classes: ['py-4', 'px-5']
// styles: {}
```

### `optimizeInlineStyles(styles)`

Optimizuje inline styles uklanjanjem undefined/null vrijednosti i konzistentnim formatiranjem.

```typescript
const styles = optimizeInlineStyles({
  backgroundColor: '#ffffff',
  fontSize: 16,
  paddingTop: undefined, // bit će uklonjeno
});
// { backgroundColor: '#ffffff', 'font-size': '16px' }
```

## Kako koristiti u blokovima

### Primjer: Hero Section

```tsx
import { mapToTailwindClass, optimizePadding, optimizeInlineStyles } from '@/lib/block-styles';

export function Renderer({ params, blockId }: BlockRendererProps) {
  const data = parseParams(params);
  
  // Optimizuj padding - koristi Tailwind klase gdje je moguće
  const paddingOptimized = optimizePadding(data.padding);
  
  // Koristi Tailwind klase za alignment
  const alignmentClass = mapToTailwindClass('textAlign', data.alignment);
  
  // Kombinuj klase
  const sectionClasses = [
    'relative',
    'w-full',
    ...paddingOptimized.classes,
  ].filter(Boolean).join(' ');
  
  // Optimizuj inline styles
  const sectionStyles = optimizeInlineStyles({
    backgroundColor: data.backgroundColor,
    ...paddingOptimized.styles,
  });

  return (
    <section className={sectionClasses} style={sectionStyles}>
      {/* content */}
    </section>
  );
}
```

## Prednosti

1. **Brže učitavanje** - Tailwind klase su optimizovane i keširane od strane browsera
2. **Manji HTML** - Manje inline styles znači manji HTML fajl
3. **Konzistentnost** - Svi blokovi koriste isti pristup
4. **Lakše održavanje** - Centralizovane helper funkcije

## Best Practices

1. **Uvijek koristi Tailwind klase gdje je moguće** - Za uobičajene vrijednosti
2. **Koristi `optimizeInlineStyles`** - Za dinamičke vrijednosti
3. **Kombinuj pristupe** - Tailwind klase + optimizovani inline styles
4. **Izbjegavaj direktne inline styles** - Koristi helper funkcije


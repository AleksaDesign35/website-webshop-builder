import type React from 'react';

/**
 * Block Styles Utilities
 * 
 * Helper functions for generating clean, optimized CSS and Tailwind classes
 * for blocks. This ensures consistent, lightweight HTML output.
 */

/**
 * Generates CSS custom properties (CSS variables) from block parameters
 * This allows dynamic styling without inline styles, keeping HTML clean
 * Returns a React.CSSProperties object with CSS variables
 */
export function generateBlockCSSVars(
  prefix: string,
  styles: Record<string, string | number | undefined>
): React.CSSProperties {
  const vars: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(styles)) {
    if (value !== undefined && value !== null) {
      // Convert camelCase to kebab-case for CSS variable names
      const cssKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      const varName = `--${prefix}-${cssKey}`;
      
      // Handle numeric values (add px for spacing, etc.)
      if (typeof value === 'number') {
        vars[varName] = `${value}px`;
      } else {
        vars[varName] = String(value);
      }
    }
  }
  
  return vars as React.CSSProperties;
}

/**
 * Optimizes inline styles by removing undefined/null values
 * and ensuring consistent formatting for clean HTML output
 */
export function optimizeInlineStyles(
  styles: Record<string, string | number | undefined | null>
): React.CSSProperties {
  const optimized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(styles)) {
    if (value !== undefined && value !== null && value !== '') {
      // Keep camelCase for React inline styles (React expects camelCase, not kebab-case)
      const cssKey = key;
      
      // Handle numeric values - add px for spacing properties
      if (typeof value === 'number') {
        const spacingProps = ['padding', 'margin', 'top', 'bottom', 'left', 'right', 'width', 'height', 'gap'];
        const isSpacing = spacingProps.some(prop => cssKey.toLowerCase().includes(prop));
        optimized[cssKey] = isSpacing ? `${value}px` : String(value);
      } else {
        optimized[cssKey] = String(value);
      }
    }
  }
  
  return optimized as React.CSSProperties;
}

/**
 * Maps common values to Tailwind utility classes
 * Returns the Tailwind class if available, otherwise returns undefined
 * This helps generate cleaner HTML by using utility classes instead of inline styles
 */
export function mapToTailwindClass(
  type: 'padding' | 'margin' | 'textAlign' | 'fontSize' | 'fontWeight' | 'color' | 'gap',
  value: string | number
): string | undefined {
  switch (type) {
    case 'textAlign':
      if (value === 'left') return 'text-left';
      if (value === 'center') return 'text-center';
      if (value === 'right') return 'text-right';
      return undefined;
      
    case 'fontWeight':
      if (value === 'normal' || value === 400) return 'font-normal';
      if (value === 'medium' || value === 500) return 'font-medium';
      if (value === 'semibold' || value === 600) return 'font-semibold';
      if (value === 'bold' || value === 700) return 'font-bold';
      return undefined;
      
    case 'padding':
      // Map common padding values to Tailwind classes
      if (typeof value === 'number') {
        const paddingMap: Record<number, string> = {
          0: 'p-0',
          4: 'p-1',
          8: 'p-2',
          12: 'p-3',
          16: 'p-4',
          20: 'p-5',
          24: 'p-6',
          32: 'p-8',
          40: 'p-10',
          48: 'p-12',
          64: 'p-16',
          80: 'p-20',
        };
        return paddingMap[value];
      }
      return undefined;
      
    case 'gap':
      if (typeof value === 'number') {
        const gapMap: Record<number, string> = {
          4: 'gap-1',
          8: 'gap-2',
          12: 'gap-3',
          16: 'gap-4',
          20: 'gap-5',
          24: 'gap-6',
          32: 'gap-8',
          40: 'gap-10',
          48: 'gap-12',
        };
        return gapMap[value];
      }
      return undefined;
      
    default:
      return undefined;
  }
}

/**
 * Maps padding object to Tailwind classes where possible
 * Returns an object with Tailwind classes and inline styles
 */
export function optimizePadding(
  padding: { top: number; bottom: number; left: number; right: number }
): { classes: string[]; styles: React.CSSProperties } {
  const classes: string[] = [];
  const styles: Record<string, string> = {};
  
  // Check if all padding values are the same
  if (padding.top === padding.bottom && padding.bottom === padding.left && padding.left === padding.right) {
    const twClass = mapToTailwindClass('padding', padding.top);
    if (twClass) {
      classes.push(twClass);
      return { classes, styles: {} };
    }
  }
  
  // Check vertical padding
  if (padding.top === padding.bottom) {
    const twClass = mapToTailwindClass('padding', padding.top);
    if (twClass) {
      classes.push(twClass.replace('p-', 'py-'));
    } else {
      styles.paddingTop = `${padding.top}px`;
      styles.paddingBottom = `${padding.bottom}px`;
    }
  } else {
    const topClass = mapToTailwindClass('padding', padding.top);
    const bottomClass = mapToTailwindClass('padding', padding.bottom);
    if (topClass) classes.push(topClass.replace('p-', 'pt-'));
    else styles.paddingTop = `${padding.top}px`;
    if (bottomClass) classes.push(bottomClass.replace('p-', 'pb-'));
    else styles.paddingBottom = `${padding.bottom}px`;
  }
  
  // Check horizontal padding
  if (padding.left === padding.right) {
    const twClass = mapToTailwindClass('padding', padding.left);
    if (twClass) {
      classes.push(twClass.replace('p-', 'px-'));
    } else {
      styles.paddingLeft = `${padding.left}px`;
      styles.paddingRight = `${padding.right}px`;
    }
  } else {
    const leftClass = mapToTailwindClass('padding', padding.left);
    const rightClass = mapToTailwindClass('padding', padding.right);
    if (leftClass) classes.push(leftClass.replace('p-', 'pl-'));
    else styles.paddingLeft = `${padding.left}px`;
    if (rightClass) classes.push(rightClass.replace('p-', 'pr-'));
    else styles.paddingRight = `${padding.right}px`;
  }
  
  return { classes, styles: styles as React.CSSProperties };
}

/**
 * Generates optimized className string with Tailwind classes
 * Falls back to CSS variables for dynamic values
 */
export function generateBlockClasses(
  baseClasses: string[],
  dynamicStyles: {
    textAlign?: 'left' | 'center' | 'right';
    padding?: number;
    [key: string]: unknown;
  }
): string {
  const classes: string[] = [...baseClasses];
  
  // Try to use Tailwind classes first
  if (dynamicStyles.textAlign) {
    const twClass = mapToTailwindClass('textAlign', dynamicStyles.textAlign);
    if (twClass) {
      classes.push(twClass);
    }
  }
  
  if (dynamicStyles.padding && typeof dynamicStyles.padding === 'number') {
    const twClass = mapToTailwindClass('padding', dynamicStyles.padding);
    if (twClass) {
      classes.push(twClass);
    }
  }
  
  return classes.filter(Boolean).join(' ');
}

/**
 * Helper to determine if a value should use CSS variable or Tailwind class
 * Returns 'tailwind' if a Tailwind class exists, 'css-var' otherwise
 */
export function getStyleStrategy(
  type: 'padding' | 'margin' | 'textAlign' | 'color',
  value: string | number
): 'tailwind' | 'css-var' {
  const twClass = mapToTailwindClass(type, value);
  return twClass ? 'tailwind' : 'css-var';
}


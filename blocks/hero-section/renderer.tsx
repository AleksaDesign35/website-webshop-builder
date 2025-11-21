import type { BlockRendererProps } from '../types';
import { type HeroSectionParams, schema } from './schema';
import { optimizeInlineStyles } from '@/lib/block-styles';

export function Renderer({ params, blockId }: BlockRendererProps) {
  // Use safeParse to handle invalid or incomplete params gracefully
  const parseResult = schema.safeParse(params);
  const data = parseResult.success
    ? parseResult.data
    : (schema.parse({}) as HeroSectionParams);

  // Section is full-width with background
  // Responsive design - automatically handles all screen sizes
  const sectionClasses = 'relative w-full overflow-hidden';
  
  // Content container - responsive with proper max-width
  const contentClasses = [
    'relative',
    'z-10',
    'mx-auto',
    'max-w-6xl',
    'w-full',
    'px-4',
    'sm:px-6',
    'lg:px-8',
    'text-center', // Always center-aligned for hero sections
  ].filter(Boolean).join(' ');

  // Section styles - margin for spacing between blocks
  const sectionStyles = optimizeInlineStyles({
    marginTop: data.marginTop > 0 ? `${data.marginTop}px` : undefined,
    marginBottom: data.marginBottom > 0 ? `${data.marginBottom}px` : undefined,
  });

  // Content styles - padding only if enabled
  const contentStyles = optimizeInlineStyles({
    paddingTop: data.enablePadding ? `${data.paddingTop}px` : undefined,
    paddingBottom: data.enablePadding ? `${data.paddingBottom}px` : undefined,
  });

  return (
    <section
      className={sectionClasses}
      data-block-id={blockId}
      style={sectionStyles}
    >
      {/* Background image with overlay */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${data.backgroundImage})`,
            filter: 'brightness(0.4)', // Dark overlay for better text contrast
          }}
        />
      )}
      
      {/* Content */}
      <div className={contentClasses} style={contentStyles}>
        {data.headline && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90 sm:mb-4 sm:text-base">
            {data.headline}
          </p>
        )}
        {data.title && (
          <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            {data.title}
          </h1>
        )}
        {data.description && (
          <p className="mb-6 text-base leading-relaxed text-white/90 sm:mb-8 sm:text-lg md:text-xl">
            {data.description}
          </p>
        )}
        {data.ctaText && (
          <a
            className="inline-block rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg sm:px-8 sm:py-4 sm:text-lg"
            href={data.ctaLink || '#'}
          >
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}

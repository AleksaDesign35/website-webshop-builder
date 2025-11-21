import type { BlockRendererProps } from '../types';
import { type Hero3Params, schema } from './schema';
import { optimizeInlineStyles } from '@/lib/block-styles';

export function Renderer({ params, blockId }: BlockRendererProps) {
  const parseResult = schema.safeParse(params);
  const data = parseResult.success
    ? parseResult.data
    : (schema.parse({}) as Hero3Params);

  const sectionStyles = optimizeInlineStyles({
    marginTop: data.marginTop > 0 ? `${data.marginTop}px` : undefined,
    marginBottom: data.marginBottom > 0 ? `${data.marginBottom}px` : undefined,
  });

  const contentStyles = optimizeInlineStyles({
    paddingTop: data.enablePadding ? `${data.paddingTop}px` : undefined,
    paddingBottom: data.enablePadding ? `${data.paddingBottom}px` : undefined,
  });

  return (
    <section
      className="relative w-full bg-gray-50 overflow-hidden"
      data-block-id={blockId}
      style={sectionStyles}
    >
      {/* Gradient Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-green-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-green-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-green-100/20 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center" style={contentStyles}>
        {data.tagline && (
          <div className="mb-6 inline-block rounded-lg border border-gray-300 px-4 py-2">
            <p className="text-sm font-medium text-gray-700">{data.tagline}</p>
          </div>
        )}
        
        {data.title && (
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            {data.title.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < data.title!.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
        )}
        
        {data.description && (
          <p className="mb-8 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {data.description}
          </p>
        )}
        
        {data.ctaText && (
          <a
            href={data.ctaLink || '#'}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg"
          >
            {data.ctaText}
            <span>→</span>
          </a>
        )}
      </div>
    </section>
  );
}



import type { BlockRendererProps } from '../types';
import { type Hero2Params, schema } from './schema';
import { optimizeInlineStyles } from '@/lib/block-styles';

export function Renderer({ params, blockId }: BlockRendererProps) {
  const parseResult = schema.safeParse(params);
  const data = parseResult.success
    ? parseResult.data
    : (schema.parse({}) as Hero2Params);

  const sectionStyles = optimizeInlineStyles({
    marginTop: data.marginTop > 0 ? `${data.marginTop}px` : undefined,
    marginBottom: data.marginBottom > 0 ? `${data.marginBottom}px` : undefined,
  });

  const contentStyles = optimizeInlineStyles({
    paddingTop: data.enablePadding ? `${data.paddingTop}px` : undefined,
    paddingBottom: data.enablePadding ? `${data.paddingBottom}px` : undefined,
  });

  const logos = data.logos ? data.logos.split(',').map(l => l.trim()).filter(Boolean) : [];

  // Split title into two parts for color styling
  const titleParts = data.title?.split('your work.') || [];
  const titlePart1 = titleParts[0] || '';
  const titlePart2 = titleParts[1] ? 'your work.' : '';

  return (
    <section
      className="relative w-full bg-white"
      data-block-id={blockId}
      style={sectionStyles}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={contentStyles}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            {data.title && (
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="text-teal-600">{titlePart1}</span>
                <span className="text-pink-600">{titlePart2}</span>
              </h1>
            )}
            {data.description && (
              <p className="mb-8 text-lg text-gray-600 leading-relaxed">
                {data.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 mb-8">
              {data.ctaText && (
                <a
                  href={data.ctaLink || '#'}
                  className="inline-block rounded-lg bg-pink-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-pink-700 hover:shadow-lg"
                >
                  {data.ctaText}
                </a>
              )}
              {data.ctaText2 && (
                <a
                  href={data.ctaLink2 || '#'}
                  className="inline-block rounded-lg bg-gray-100 px-6 py-3 text-base font-semibold text-pink-600 transition-all hover:bg-gray-200"
                >
                  {data.ctaText2}
                </a>
              )}
            </div>

            {/* Logos */}
            {logos.length > 0 && (
              <div className="flex flex-wrap gap-6 items-center">
                {logos.map((logo, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-500">
                    <div className="flex gap-0.5">
                      <div className="w-3 h-3 bg-red-500" />
                      <div className="w-3 h-3 bg-green-500" />
                      <div className="w-3 h-3 bg-blue-500" />
                      <div className="w-3 h-3 bg-yellow-500" />
                    </div>
                    <span className="text-sm font-medium">{logo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Overlapping Images */}
          <div className="relative">
            {data.image1 && (
              <div className="relative rounded-lg overflow-hidden shadow-2xl z-10">
                <img
                  src={data.image1}
                  alt=""
                  className="w-full h-auto"
                />
              </div>
            )}
            {data.image2 && (
              <div className="absolute -bottom-8 -left-8 rounded-lg overflow-hidden shadow-2xl z-0 w-[85%]">
                <img
                  src={data.image2}
                  alt=""
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}



import type { BlockRendererProps } from '../types';
import { type Hero1Params, schema } from './schema';
import { optimizeInlineStyles } from '@/lib/block-styles';

export function Renderer({ params, blockId }: BlockRendererProps) {
  const parseResult = schema.safeParse(params);
  const data = parseResult.success
    ? parseResult.data
    : (schema.parse({}) as Hero1Params);

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
                {data.title.split(' ').map((word, i, arr) => {
                  const isLastTwo = i === arr.length - 2 || i === arr.length - 1;
                  return (
                    <span key={i}>
                      {isLastTwo ? (
                        <span className="inline-block border-2 border-dashed border-blue-400 px-2 rounded mx-1">
                          {word}
                        </span>
                      ) : (
                        <span>{word} </span>
                      )}
                    </span>
                  );
                })}
              </h1>
            )}
            {data.description && (
              <p className="mb-8 text-lg text-gray-600 leading-relaxed">
                {data.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              {data.ctaText && (
                <a
                  href={data.ctaLink || '#'}
                  className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  {data.ctaText}
                </a>
              )}
              {data.ctaText2 && (
                <a
                  href={data.ctaLink2 || '#'}
                  className="inline-block rounded-lg bg-gray-100 px-6 py-3 text-base font-semibold text-blue-600 transition-all hover:bg-gray-200"
                >
                  {data.ctaText2}
                </a>
              )}
            </div>
          </div>

          {/* Right: Image with Stats Box */}
          <div className="relative">
            {data.image && (
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={data.image}
                  alt=""
                  className="w-full h-auto"
                />
                {/* Stats Box Overlay */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg p-4 shadow-xl max-w-[200px]">
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
                      />
                    ))}
                  </div>
                  <p className="font-bold text-gray-900 mb-1">
                    {data.statsEmployees} employees
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      {data.statsRating} ({data.statsReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


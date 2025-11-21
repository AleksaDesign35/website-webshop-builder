import type { BlockRendererProps } from '../types';
import { type Hero5Params, schema } from './schema';
import { optimizeInlineStyles } from '@/lib/block-styles';

export function Renderer({ params, blockId }: BlockRendererProps) {
  const parseResult = schema.safeParse(params);
  const data = parseResult.success
    ? parseResult.data
    : (schema.parse({}) as Hero5Params);

  const sectionStyles = optimizeInlineStyles({
    marginTop: data.marginTop > 0 ? `${data.marginTop}px` : undefined,
    marginBottom: data.marginBottom > 0 ? `${data.marginBottom}px` : undefined,
  });

  const contentStyles = optimizeInlineStyles({
    paddingTop: data.enablePadding ? `${data.paddingTop}px` : undefined,
    paddingBottom: data.enablePadding ? `${data.paddingBottom}px` : undefined,
  });

  const features = data.features ? data.features.split(',').map(f => f.trim()).filter(Boolean) : [];

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
              <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
                {data.title.split(' ').map((word, i, arr) => {
                  if (word.toLowerCase() === 'groceries') {
                    return (
                      <span key={i} className="text-green-600">
                        {word}{' '}
                      </span>
                    );
                  }
                  return <span key={i}>{word} </span>;
                })}
              </h1>
            )}
            {data.description && (
              <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                {data.description}
              </p>
            )}

            {/* Search Bar */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                placeholder={data.searchPlaceholder}
                className="flex-1 rounded-lg border border-gray-300 bg-green-50 px-4 py-3 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                readOnly
              />
              <button
                type="button"
                className="rounded-lg bg-green-600 px-6 py-3 text-white transition-all hover:bg-green-700"
                disabled
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Features List */}
            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Image */}
          <div className="relative">
            {data.image && (
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-transparent pointer-events-none" />
                <img
                  src={data.image}
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



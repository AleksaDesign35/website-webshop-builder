import type { BlockRendererProps } from '../types';
import { type Hero4Params, schema } from './schema';
import { optimizeInlineStyles } from '@/lib/block-styles';

export function Renderer({ params, blockId }: BlockRendererProps) {
  const parseResult = schema.safeParse(params);
  const data = parseResult.success
    ? parseResult.data
    : (schema.parse({}) as Hero4Params);

  const sectionStyles = optimizeInlineStyles({
    marginTop: data.marginTop > 0 ? `${data.marginTop}px` : undefined,
    marginBottom: data.marginBottom > 0 ? `${data.marginBottom}px` : undefined,
  });

  const contentStyles = optimizeInlineStyles({
    paddingTop: data.enablePadding ? `${data.paddingTop}px` : undefined,
    paddingBottom: data.enablePadding ? `${data.paddingBottom}px` : undefined,
  });

  // Split title for gradient effect on "Marketing"
  const titleParts = data.title?.split('Marketing') || [];
  const beforeMarketing = titleParts[0] || '';
  const afterMarketing = titleParts[1] || '';

  return (
    <section
      className="relative w-full bg-white overflow-hidden"
      data-block-id={blockId}
      style={sectionStyles}
    >
      {/* Gradient Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 via-green-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-blue-100/20 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={contentStyles}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            {data.title && (
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span>{beforeMarketing}</span>
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Marketing
                </span>
                <span>{afterMarketing}</span>
              </h1>
            )}
            {data.description && (
              <p className="mb-8 text-lg text-gray-600 leading-relaxed">
                {data.description}
              </p>
            )}

            {/* Email Input Form */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  placeholder={data.emailPlaceholder}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  readOnly
                />
              </div>
              {data.ctaText && (
                <a
                  href={data.ctaLink || '#'}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg whitespace-nowrap"
                >
                  {data.ctaText}
                </a>
              )}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            {data.image && (
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
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



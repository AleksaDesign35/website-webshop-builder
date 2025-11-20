import type { BlockPreviewProps } from '../types';
import { type HeroSectionParams, schema } from './schema';

export function Preview({ params }: BlockPreviewProps) {
  const data = schema.parse(params) as HeroSectionParams;

  return (
    <div
      className="relative w-full"
      style={{
        backgroundColor: data.backgroundColor,
        paddingTop: `${data.padding.top}px`,
        paddingBottom: `${data.padding.bottom}px`,
        paddingLeft: `${data.padding.left}px`,
        paddingRight: `${data.padding.right}px`,
      }}
    >
      {data.backgroundImage && (
        <div
          className="absolute inset-0 z-0 bg-center bg-cover opacity-50"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}
      <div
        className="relative z-10"
        style={{
          textAlign: data.alignment,
          color: data.textColor,
        }}
      >
        {data.headline && (
          <p className="mb-2 font-semibold text-sm uppercase tracking-wide opacity-80">
            {data.headline}
          </p>
        )}
        {data.title && (
          <h1 className="mb-4 font-bold text-4xl md:text-5xl lg:text-6xl">
            {data.title}
          </h1>
        )}
        {data.description && (
          <p className="mb-6 text-lg md:text-xl">{data.description}</p>
        )}
        {data.ctaText && (
          <a
            className="inline-block rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            href={data.ctaLink}
          >
            {data.ctaText}
          </a>
        )}
      </div>
    </div>
  );
}

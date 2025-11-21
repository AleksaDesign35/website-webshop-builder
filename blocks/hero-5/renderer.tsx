'use client';

import type { BlockRendererProps } from '../types';
import { type Hero5Params, schema } from './schema';
import { optimizeInlineStyles } from '@/lib/block-styles';
import * as LucideIcons from 'lucide-react';

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

  // Handle both old string format and new array format
  let features: Array<{ id: string; text: string; iconType: string; iconName?: string; iconUrl?: string }> = [];
  
  if (Array.isArray(data.features)) {
    features = data.features;
  } else if (typeof data.features === 'string') {
    // Migrate from old format
    features = data.features.split(',').map((f, i) => ({
      id: `feature-${i}`,
      text: f.trim(),
      iconType: 'lucide',
      iconName: 'Check',
    })).filter(f => f.text);
  }
  
  const getIconComponent = (feature: typeof features[0]) => {
    if (feature.iconType === 'lucide' && feature.iconName) {
      const IconComponent = (LucideIcons as any)[feature.iconName];
      if (IconComponent) {
        return <IconComponent className="h-5 w-5 flex-shrink-0 text-white" />;
      }
    } else if (feature.iconUrl) {
      return <img src={feature.iconUrl} alt="" className="h-5 w-5 flex-shrink-0 object-contain" />;
    }
    // Default check icon
    const CheckIcon = (LucideIcons as any).Check;
    return CheckIcon ? <CheckIcon className="h-5 w-5 flex-shrink-0 text-white" /> : null;
  };

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
            {data.title && (() => {
              // Parse HTML and apply styles
              const titleClasses = (data.titleClasses || []) as Array<{
                className: string;
                color?: string;
                fontSize?: number;
                fontWeight?: string;
                backgroundColor?: string;
              }>;

              // Parse HTML string and create React elements
              const parseHTML = (html: string) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
                const div = doc.body.firstChild as HTMLElement;
                
                if (!div) return html;

                const createElements = (node: Node, index: number = 0): React.ReactNode[] => {
                  const elements: React.ReactNode[] = [];
                  let currentIndex = index;

                  Array.from(node.childNodes).forEach((child) => {
                    if (child.nodeType === Node.TEXT_NODE) {
                      const text = child.textContent || '';
                      if (text.trim()) {
                        elements.push(text);
                      }
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                      const element = child as HTMLElement;
                      if (element.tagName === 'SPAN' && element.className) {
                        const className = element.className;
                        const classDef = titleClasses.find(c => c.className === className);
                        const children = createElements(element, currentIndex);
                        elements.push(
                          <span
                            key={currentIndex}
                            className={className}
                            style={{
                              color: classDef?.color,
                              fontSize: classDef?.fontSize ? `${classDef.fontSize}px` : undefined,
                              fontWeight: classDef?.fontWeight,
                              backgroundColor: classDef?.backgroundColor,
                            }}
                          >
                            {children}
                          </span>
                        );
                        currentIndex++;
                      } else {
                        elements.push(...createElements(element, currentIndex));
                      }
                    }
                  });

                  return elements;
                };

                return createElements(div);
              };

              const titleElements = parseHTML(data.title);

              return (
                <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
                  {titleElements.length > 0 ? titleElements : data.title}
                </h1>
              );
            })()}
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
                className="flex-1 rounded-lg border border-gray-300 bg-green-50 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                readOnly
              />
              <button
                type="button"
                className="rounded-lg bg-green-600 px-6 py-3 text-white transition-all hover:bg-green-700 hover:shadow-lg"
                disabled
              >
                <svg
                  className="h-5 w-5 text-white"
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
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600">
                      {getIconComponent(feature)}
                    </div>
                    <span className="text-gray-700">{feature.text}</span>
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



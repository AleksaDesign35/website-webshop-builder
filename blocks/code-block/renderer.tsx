'use client';

import { useEffect } from 'react';
import type { BlockRendererProps } from '@/blocks/types';
import type { CodeBlockParams } from './schema';

export function CodeBlockRenderer({ params, blockId = 'code-block' }: BlockRendererProps) {
  const {
    html = '',
    css = '',
    js = '',
    marginTop = 0,
    marginBottom = 0,
    enablePadding = false,
    paddingTop = 0,
    paddingBottom = 0,
  } = (params || {}) as CodeBlockParams;

  const sectionStyle: React.CSSProperties = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
  };

  const contentStyle: React.CSSProperties = {
    paddingTop: enablePadding ? `${paddingTop}px` : '0',
    paddingBottom: enablePadding ? `${paddingBottom}px` : '0',
  };

  const uniqueId = `${blockId}-${Math.random().toString(36).substr(2, 9)}`;

  // Inject CSS
  useEffect(() => {
    if (!css) return;

    const styleId = `code-block-css-${uniqueId}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;

    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [css, uniqueId]);

  // Inject JavaScript
  useEffect(() => {
    if (!js) return;

    const scriptId = `code-block-js-${uniqueId}`;
    // Remove old script if it exists
    const oldScript = document.getElementById(scriptId);
    if (oldScript) {
      oldScript.remove();
    }

    const scriptElement = document.createElement('script');
    scriptElement.id = scriptId;
    scriptElement.textContent = js;
    document.body.appendChild(scriptElement);

    return () => {
      const element = document.getElementById(scriptId);
      if (element) {
        element.remove();
      }
    };
  }, [js, uniqueId]);

  return (
    <section style={sectionStyle}>
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      <div style={contentStyle} dangerouslySetInnerHTML={{ __html: html || '' }} />
    </section>
  );
}


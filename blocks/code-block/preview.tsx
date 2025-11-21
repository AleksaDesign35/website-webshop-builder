'use client';

import type { BlockPreviewProps } from '@/blocks/types';
import { CodeBlockRenderer } from './renderer';

export function CodeBlockPreview({ params }: BlockPreviewProps) {
  return <CodeBlockRenderer params={params} />;
}


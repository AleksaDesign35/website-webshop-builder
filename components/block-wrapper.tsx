import type React from 'react';
import type { BlockDefinition, BlockLayoutMode } from '@/blocks/types';
import type { PageSettings } from '@/components/dashboard/page-settings';
import { optimizeInlineStyles } from '@/lib/block-styles';

interface BlockWrapperProps {
  block: BlockDefinition;
  blockId: string;
  params: Record<string, unknown>;
  pageSettings: PageSettings;
  children: React.ReactNode;
}

/**
 * Calculates container class based on page settings
 */
function getContainerClass(
  containerWidth: string,
  maxWidth?: number
): string {
  if (maxWidth) {
    return 'mx-auto';
  }

  switch (containerWidth) {
    case 'full':
      return 'w-full';
    case 'narrow':
      return 'mx-auto max-w-5xl';
    case 'wide':
      return 'mx-auto max-w-7xl';
    case 'container':
    default:
      return 'mx-auto max-w-6xl';
  }
}

/**
 * BlockWrapper - Smart wrapper that handles layout logic
 * 
 * Determines whether a block should be:
 * - Full-width (spans entire viewport)
 * - In container (uses page container settings)
 * - Inherit (uses page default)
 */
export function BlockWrapper({
  block,
  blockId,
  params,
  pageSettings,
  children,
}: BlockWrapperProps) {
  const layoutMode: BlockLayoutMode = block.layoutMode || 'inherit';

  // Determine final layout mode
  let finalLayoutMode: 'full-width' | 'container';
  if (layoutMode === 'full-width') {
    finalLayoutMode = 'full-width';
  } else if (layoutMode === 'container') {
    finalLayoutMode = 'container';
  } else {
    // inherit - use page default (which is container)
    finalLayoutMode = 'container';
  }

  // Full-width blocks are rendered directly without container
  if (finalLayoutMode === 'full-width') {
    return <>{children}</>;
  }

  // Container blocks are wrapped in page container
  const containerClass = getContainerClass(
    pageSettings.containerWidth,
    pageSettings.maxWidth
  );

  const containerStyles = pageSettings.maxWidth
    ? optimizeInlineStyles({ maxWidth: pageSettings.maxWidth })
    : undefined;

  return (
    <div className={containerClass} style={containerStyles}>
      {children}
    </div>
  );
}


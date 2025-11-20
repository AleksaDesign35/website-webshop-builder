/**
 * Blocks Registry
 *
 * This file exports all available blocks and their metadata.
 * Add new blocks here when you create them.
 */

import type { BlockDefinition } from './types';

// Import blocks (lazy load for better performance)
export const blocksRegistry: Record<string, () => Promise<BlockDefinition>> = {
  'hero-section': () => import('./hero-section').then((m) => m.block),
  // Add more blocks here as you create them:
  // 'text-block': () => import('./text-block').then((m) => m.block),
  // 'image-gallery': () => import('./image-gallery').then((m) => m.block),
};

export type BlockId = keyof typeof blocksRegistry;

/**
 * Get all block metadata (for listing in dashboard)
 */
export async function getAllBlocksMetadata() {
  const blocks = await Promise.all(
    Object.entries(blocksRegistry).map(async ([id, loader]) => {
      const block = await loader();
      return {
        id,
        name: block.name,
        category: block.category,
        description: block.description,
        icon: block.icon,
        popular: block.popular,
      };
    })
  );
  return blocks;
}

/**
 * Get a specific block definition
 */
export async function getBlock(id: BlockId): Promise<BlockDefinition> {
  const loader = blocksRegistry[id];
  if (!loader) {
    throw new Error(`Block "${id}" not found`);
  }
  return loader();
}

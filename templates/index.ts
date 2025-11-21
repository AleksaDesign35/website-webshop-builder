/**
 * Templates Registry
 *
 * This file exports all available templates and their metadata.
 * Add new templates here when you create them.
 */

import type { TemplateDefinition } from './types';

// Import templates (lazy load for better performance)
export const templatesRegistry: Record<
  string,
  () => Promise<TemplateDefinition>
> = {
  'modern-business': () => import('./modern-business').then((m) => m.template),
  // Add more templates here as you create them
};

export type TemplateId = keyof typeof templatesRegistry;

/**
 * Get all template metadata (for listing in dashboard)
 */
export async function getAllTemplatesMetadata() {
  const templates = await Promise.all(
    Object.entries(templatesRegistry).map(async ([id, loader]) => {
      const template = await loader();
      return {
        id,
        name: template.name,
        category: template.category,
        description: template.description,
        pages: template.pages,
      };
    })
  );
  return templates;
}

/**
 * Get a specific template definition
 */
export async function getTemplate(id: TemplateId): Promise<TemplateDefinition> {
  const loader = templatesRegistry[id];
  if (!loader) {
    throw new Error(`Template "${id}" not found`);
  }
  return loader();
}

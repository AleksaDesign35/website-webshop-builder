/**
 * Template block definition
 */
export interface TemplateBlock {
  /** Block ID (must match a block in blocks registry) */
  id: string;
  /** Block parameters */
  params: Record<string, unknown>;
  /** Optional: Block order/index */
  order?: number;
}

/**
 * Template definition interface
 */
export interface TemplateDefinition {
  /** Unique template identifier (kebab-case) */
  id: string;
  /** Display name */
  name: string;
  /** Category for grouping */
  category: 'Business' | 'E-commerce' | 'Portfolio' | 'Blog' | 'Landing';
  /** Short description */
  description: string;
  /** Number of pages in this template */
  pages: number;
  /** Array of blocks that make up this template */
  blocks: TemplateBlock[];
}

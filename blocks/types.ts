import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * Layout mode for blocks
 * - 'full-width': Block spans full viewport width (e.g., hero sections)
 * - 'container': Block uses page container settings
 * - 'inherit': Uses page default container settings
 */
export type BlockLayoutMode = 'full-width' | 'container' | 'inherit';

/**
 * Base block definition interface
 */
export interface BlockDefinition {
  /** Unique block identifier (kebab-case) */
  id: string;
  /** Display name */
  name: string;
  /** Category for grouping */
  category: 'Text' | 'Media' | 'Layout' | 'Forms' | 'Navigation' | 'E-commerce';
  /** Short description */
  description: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Whether this is a popular block */
  popular?: boolean;
  /** Layout mode - how the block should be rendered */
  layoutMode?: BlockLayoutMode;
  /** Preview image URL for block picker */
  previewImage?: string;
  /** Zod schema for validation */
  schema: unknown; // Will be typed as z.ZodObject in actual blocks
  /** Editor component (dashboard settings) */
  Editor: ComponentType<BlockEditorProps>;
  /** Preview component (builder preview) */
  Preview: ComponentType<BlockPreviewProps>;
  /** Renderer component (public website) */
  Renderer: ComponentType<BlockRendererProps>;
}

/**
 * Props for Editor component
 */
export interface BlockEditorProps {
  /** Current block parameters */
  params: Record<string, unknown>;
  /** Callback when parameters change */
  onChange: (params: Record<string, unknown>) => void;
}

/**
 * Props for Preview component
 */
export interface BlockPreviewProps {
  /** Block parameters */
  params: Record<string, unknown>;
  /** Whether block is being edited */
  isEditing?: boolean;
}

/**
 * Props for Renderer component
 */
export interface BlockRendererProps {
  /** Block parameters */
  params: Record<string, unknown>;
  /** Block ID (for tracking) */
  blockId?: string;
  /** Container class for blocks that need it (passed from BlockWrapper) */
  containerClass?: string;
  /** Container styles for blocks that need it */
  containerStyles?: React.CSSProperties;
}

import type { TemplateDefinition } from '../types';
import blocks from './blocks.json' with { type: 'json' };

export const template: TemplateDefinition = {
  id: 'modern-business',
  name: 'Modern Business',
  category: 'Business',
  description: 'Professional business website with services and contact',
  pages: 5,
  blocks: blocks as TemplateDefinition['blocks'],
};

export { blocks };

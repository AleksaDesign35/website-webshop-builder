import { Layout } from 'lucide-react';
import type { BlockDefinition } from '../types';
import { Editor } from './editor';
import { Preview } from './preview';
import { Renderer } from './renderer';
import { schema } from './schema';

export const block: BlockDefinition = {
  id: 'hero-section',
  name: 'Hero Section',
  category: 'Layout',
  description: 'Large banner with headline and CTA',
  icon: Layout,
  popular: true,
  layoutMode: 'full-width', // Hero sections are always full-width
  schema,
  Editor,
  Preview,
  Renderer,
};

export { Editor } from './editor';
export { Preview } from './preview';
export { Renderer } from './renderer';
export { schema } from './schema';
export type { HeroSectionParams } from './types';

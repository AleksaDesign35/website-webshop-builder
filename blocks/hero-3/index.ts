import { Layout } from 'lucide-react';
import type { BlockDefinition } from '../types';
import { Editor } from './editor';
import { Preview } from './preview';
import { Renderer } from './renderer';
import { schema } from './schema';

export const block: BlockDefinition = {
  id: 'hero-3',
  name: 'Hero - Centered with Gradient',
  category: 'Layout',
  description: 'Centered layout with tagline and gradient background',
  icon: Layout,
  popular: true,
  layoutMode: 'full-width',
  previewImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
  schema,
  Editor,
  Preview,
  Renderer,
};



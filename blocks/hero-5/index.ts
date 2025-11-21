import { Layout } from 'lucide-react';
import type { BlockDefinition } from '../types';
import { Editor } from './editor';
import { Preview } from './preview';
import { Renderer } from './renderer';
import { schema } from './schema';

export const block: BlockDefinition = {
  id: 'hero-5',
  name: 'Hero - Split with Search & Features',
  category: 'Layout',
  description: 'Split layout with search bar and feature list',
  icon: Layout,
  popular: true,
  layoutMode: 'full-width',
  previewImage: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=450&fit=crop',
  schema,
  Editor,
  Preview,
  Renderer,
};



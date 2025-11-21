import { Layout } from 'lucide-react';
import type { BlockDefinition } from '../types';
import { Editor } from './editor';
import { Preview } from './preview';
import { Renderer } from './renderer';
import { schema } from './schema';

export const block: BlockDefinition = {
  id: 'hero-2',
  name: 'Hero - Split with Overlapping Images',
  category: 'Layout',
  description: 'Split layout with overlapping images and company logos',
  icon: Layout,
  popular: true,
  layoutMode: 'full-width',
  previewImage: 'https://images.unsplash.com/photo-1504307651254-35680f78df54?w=800&h=450&fit=crop',
  schema,
  Editor,
  Preview,
  Renderer,
};



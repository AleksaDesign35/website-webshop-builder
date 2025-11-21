import { Layout } from 'lucide-react';
import type { BlockDefinition } from '../types';
import { Editor } from './editor';
import { Preview } from './preview';
import { Renderer } from './renderer';
import { schema } from './schema';

export const block: BlockDefinition = {
  id: 'hero-1',
  name: 'Hero - Split with Stats',
  category: 'Layout',
  description: 'Split layout with text left, image right and stats box',
  icon: Layout,
  popular: true,
  layoutMode: 'full-width',
  previewImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop',
  schema,
  Editor,
  Preview,
  Renderer,
};



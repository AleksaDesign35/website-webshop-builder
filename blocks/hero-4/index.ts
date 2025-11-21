import { Layout } from 'lucide-react';
import type { BlockDefinition } from '../types';
import { Editor } from './editor';
import { Preview } from './preview';
import { Renderer } from './renderer';
import { schema } from './schema';

export const block: BlockDefinition = {
  id: 'hero-4',
  name: 'Hero - Split with Email Form',
  category: 'Layout',
  description: 'Split layout with gradient text and email input form',
  icon: Layout,
  popular: true,
  layoutMode: 'full-width',
  previewImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop',
  schema,
  Editor,
  Preview,
  Renderer,
};



import { Code2 } from 'lucide-react';
import type { BlockDefinition } from '@/blocks/types';
import { codeBlockSchema } from './schema';
import { CodeBlockEditor } from './editor';
import { CodeBlockPreview } from './preview';
import { CodeBlockRenderer } from './renderer';

export const block: BlockDefinition = {
  id: 'code-block',
  name: 'Custom Code',
  category: 'Layout',
  description: 'Add custom HTML, CSS, and JavaScript code to your page',
  icon: Code2,
  popular: false,
  layoutMode: 'full-width',
  schema: codeBlockSchema,
  Editor: CodeBlockEditor,
  Preview: CodeBlockPreview,
  Renderer: CodeBlockRenderer,
};


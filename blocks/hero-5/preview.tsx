import type { BlockPreviewProps } from '../types';
import { Renderer } from './renderer';

export function Preview(props: BlockPreviewProps) {
  return <Renderer {...props} />;
}



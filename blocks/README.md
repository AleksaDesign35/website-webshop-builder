# Blocks Directory

This directory contains all reusable blocks for the website builder.

## Block Structure

Each block should follow this structure:

```
blocks/
  block-name/
    index.ts              # Main export file
    schema.ts             # Zod validation schema
    types.ts              # TypeScript types
    editor.tsx            # Editor component (dashboard settings panel)
    preview.tsx           # Preview component (builder preview)
    renderer.tsx          # Renderer component (public website)
    styles.css            # Optional: Block-specific styles (if needed)
    README.md             # Optional: Block documentation
```

## Block Components

### `schema.ts`
- Zod schema for validating block parameters
- Defines all editable properties

### `types.ts`
- TypeScript types derived from schema
- Type-safe block parameters

### `editor.tsx`
- Settings panel component shown in dashboard
- Allows users to edit block parameters
- Uses React Hook Form + Zod validation

### `preview.tsx`
- Preview component shown in builder
- Shows how block will look on the website
- Can be interactive for testing

### `renderer.tsx`
- Final render component for public website
- Optimized for production
- No editor controls, just pure rendering

### `index.ts`
- Main export file
- Exports all block components and schema
- Example:
  ```typescript
  export { schema, type BlockParams } from './schema';
  export { Editor } from './editor';
  export { Preview } from './preview';
  export { Renderer } from './renderer';
  ```

## Example Block

See `hero-section/` for a complete example.

## Adding New Blocks

1. Create a new folder in `blocks/`
2. Follow the structure above
3. Register the block in `blocks/index.ts`
4. Add block metadata to `blocks/registry.ts`


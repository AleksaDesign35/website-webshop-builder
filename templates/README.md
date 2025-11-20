# Templates Directory

This directory contains pre-made page templates.

## Template Structure

Each template should follow this structure:

```
templates/
  template-name/
    index.ts              # Main export file
    schema.ts             # Zod validation schema (if template has configurable options)
    types.ts              # TypeScript types
    blocks.json           # Array of blocks that make up this template
    preview.tsx           # Preview component (optional)
    README.md             # Template documentation
```

## Template Components

### `blocks.json`
- Defines the structure of the template
- Array of block definitions with their default parameters
- Example:
  ```json
  [
    {
      "id": "hero-section",
      "params": {
        "title": "Welcome",
        "subtitle": "Get started today"
      }
    },
    {
      "id": "text-block",
      "params": {
        "content": "Your content here"
      }
    }
  ]
  ```

### `schema.ts` (Optional)
- Only needed if template has configurable options
- For example: template name, color scheme, etc.

### `index.ts`
- Main export file
- Exports template metadata and blocks structure

## Example Template

See `modern-business/` for a complete example.

## Adding New Templates

1. Create a new folder in `templates/`
2. Follow the structure above
3. Register the template in `templates/index.ts`
4. Add template metadata to `templates/registry.ts`


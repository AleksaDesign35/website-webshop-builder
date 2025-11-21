import { z } from 'zod';

export const schema = z
  .object({
    // Text content
    title: z.string().optional().default('Let your groceries come to you'),
    description: z.string().optional().default('Get fresh groceries online without stepping out to make delicious food with the freshest ingredients'),
    searchPlaceholder: z.string().optional().default('meal, Vegetables......'),
    
    // Features (comma separated)
    features: z.string().optional().default('Feature 1,Feature 2,Feature 3,Feature 4'),

    // Image
    image: z.string().optional().default('https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop'),

    // Spacing
    marginTop: z.number().default(0),
    marginBottom: z.number().default(0),
    enablePadding: z.boolean().default(true),
    paddingTop: z.number().default(100),
    paddingBottom: z.number().default(100),
  })
  .refine(
    (data) => {
      if (data.image && data.image.trim() !== '') {
        try {
          new URL(data.image);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    { message: 'image must be a valid URL', path: ['image'] }
  );

export type Hero5Params = z.infer<typeof schema>;



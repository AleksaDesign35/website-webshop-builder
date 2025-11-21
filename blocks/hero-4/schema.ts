import { z } from 'zod';

export const schema = z
  .object({
    // Text content
    title: z.string().optional().default('Social Media Marketing is the Best Ever.'),
    description: z.string().optional().default('Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolores repellat perspiciatis aspernatur quis voluptatum porro incidunt, libero sequi quos eos velit'),
    ctaText: z.string().optional().default('Get Started'),
    ctaLink: z.string().default('#').optional(),
    emailPlaceholder: z.string().optional().default('johndoe@gmail.com'),

    // Image
    image: z.string().optional().default('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop'),

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

export type Hero4Params = z.infer<typeof schema>;



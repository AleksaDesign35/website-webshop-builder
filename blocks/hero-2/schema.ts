import { z } from 'zod';

export const schema = z
  .object({
    // Text content
    title: z.string().optional().default("We'll be happy to take care of your work."),
    description: z.string().optional().default('Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, fugit! Laborum quo maxime at sapiente quasi'),
    ctaText: z.string().optional().default('Get started'),
    ctaLink: z.string().default('#').optional(),
    ctaText2: z.string().optional().default('Book a call'),
    ctaLink2: z.string().default('#').optional(),

    // Images
    image1: z.string().optional().default('https://images.unsplash.com/photo-1504307651254-35680f78df54?w=800&h=600&fit=crop'),
    image2: z.string().optional().default('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop'),

    // Logos (comma separated)
    logos: z.string().optional().default('Microsoft,Microsoft,Microsoft,Microsoft'),

    // Spacing
    marginTop: z.number().default(0),
    marginBottom: z.number().default(0),
    enablePadding: z.boolean().default(true),
    paddingTop: z.number().default(100),
    paddingBottom: z.number().default(100),
  })
  .refine(
    (data) => {
      if (data.image1 && data.image1.trim() !== '') {
        try {
          new URL(data.image1);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    { message: 'image1 must be a valid URL', path: ['image1'] }
  )
  .refine(
    (data) => {
      if (data.image2 && data.image2.trim() !== '') {
        try {
          new URL(data.image2);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    { message: 'image2 must be a valid URL', path: ['image2'] }
  );

export type Hero2Params = z.infer<typeof schema>;



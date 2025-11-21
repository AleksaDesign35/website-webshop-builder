import { z } from 'zod';

export const schema = z
  .object({
    // Text content
    title: z.string().optional().default('Build Your Online Platform with best Digital Agency'),
    description: z.string().optional().default('Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, fugit! Laborum quo maxime at sapiente quasi'),
    ctaText: z.string().optional().default('Get in touch'),
    ctaLink: z.string().default('#').optional(),
    ctaText2: z.string().optional().default('See Project'),
    ctaLink2: z.string().default('#').optional(),

    // Image
    image: z.string().optional().default('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'),

    // Stats box
    statsEmployees: z.string().optional().default('45+'),
    statsReviews: z.string().optional().default('2.5k'),
    statsRating: z.string().optional().default('5.0'),

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

export type Hero1Params = z.infer<typeof schema>;



import { z } from 'zod';

export const schema = z
  .object({
    // Text content
    tagline: z.string().optional().default('Creativity in mind'),
    title: z.string().optional().default("We Inspire Growth For\nYour Business Brand"),
    description: z.string().optional().default('Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique deleniti earum, qui odio, dolorum labore incidunt ad ab porro, provident excepturi molestiae corporis molestias nam accusamus.'),
    ctaText: z.string().optional().default("Let's talk"),
    ctaLink: z.string().default('#').optional(),

    // Spacing
    marginTop: z.number().default(0),
    marginBottom: z.number().default(0),
    enablePadding: z.boolean().default(true),
    paddingTop: z.number().default(120),
    paddingBottom: z.number().default(120),
  })
  .refine(
    (data) => {
      if (data.ctaLink && data.ctaLink.trim() !== '' && data.ctaLink !== '#') {
        try {
          new URL(data.ctaLink);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    { message: 'ctaLink must be a valid URL', path: ['ctaLink'] }
  );

export type Hero3Params = z.infer<typeof schema>;



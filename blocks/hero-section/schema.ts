import { z } from 'zod';

/**
 * Hero Section Block Schema
 *
 * Defines all editable parameters for the Hero Section block.
 */
export const schema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .default('Welcome to Our Website'),
  subtitle: z.string().default('Build amazing websites with our platform'),
  ctaText: z.string().default('Get Started'),
  ctaLink: z.string().url('Must be a valid URL').default('#'),
  backgroundImage: z.string().url().optional(),
  backgroundColor: z.string().default('#000000'),
  textColor: z.string().default('#ffffff'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  padding: z
    .object({
      top: z.number().default(80),
      bottom: z.number().default(80),
      left: z.number().default(20),
      right: z.number().default(20),
    })
    .default({
      top: 80,
      bottom: 80,
      left: 20,
      right: 20,
    }),
});

export type HeroSectionParams = z.infer<typeof schema>;

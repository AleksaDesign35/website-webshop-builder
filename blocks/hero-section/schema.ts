import { z } from 'zod';

/**
 * Hero Section Block Schema
 *
 * Defines all editable parameters for the Hero Section block.
 * All fields are optional with sensible defaults.
 */
export const schema = z.object({
  // Background
  backgroundImage: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .default(
      'https://images.unsplash.com/photo-1557683316-973673baf926?w=1900&h=700&fit=crop'
    ),
  backgroundColor: z.string().default('#000000'),

  // Text content
  headline: z.string().optional().default('Welcome'),
  title: z.string().optional().default('Build Amazing Websites'),
  description: z
    .string()
    .optional()
    .default(
      'Create beautiful websites and online shops with our powerful builder'
    ),
  ctaText: z.string().optional().default('Get Started'),
  ctaLink: z.string().url('Must be a valid URL').optional().default('#'),

  // Styling
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

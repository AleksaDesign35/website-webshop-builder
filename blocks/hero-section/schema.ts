import { z } from 'zod';

/**
 * Hero Section Block Schema
 *
 * Simplified schema - user can only edit content and spacing.
 * All styling is handled automatically for responsive, clean design.
 */
export const schema = z
  .object({
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
    ctaLink: z.string().default('#').optional(),

    // Background
    backgroundImage: z
      .string()
      .optional()
      .default(
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=1900&h=700&fit=crop'
      ),

    // Spacing - margin for gaps between blocks
    marginTop: z.number().default(0),
    marginBottom: z.number().default(0),

    // Padding - optional internal spacing
    enablePadding: z.boolean().default(false),
    paddingTop: z.number().default(80),
    paddingBottom: z.number().default(80),
  })
  .refine(
    (data) => {
      // Validate URL only if backgroundImage is provided and not empty
      if (data.backgroundImage && data.backgroundImage.trim() !== '') {
        try {
          new URL(data.backgroundImage);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    {
      message: 'backgroundImage must be a valid URL',
      path: ['backgroundImage'],
    }
  )
  .refine(
    (data) => {
      // Validate URL only if ctaLink is provided and not empty
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
    {
      message: 'ctaLink must be a valid URL',
      path: ['ctaLink'],
    }
  );

export type HeroSectionParams = z.infer<typeof schema>;

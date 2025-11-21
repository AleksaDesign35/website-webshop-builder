import { z } from 'zod';

export const codeBlockSchema = z.object({
  html: z.string().default(''),
  css: z.string().default(''),
  js: z.string().default(''),
  marginTop: z.number().default(0),
  marginBottom: z.number().default(0),
  enablePadding: z.boolean().default(false),
  paddingTop: z.number().default(0),
  paddingBottom: z.number().default(0),
});

export type CodeBlockParams = z.infer<typeof codeBlockSchema>;


'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BlockEditorProps } from '../types';
import { type HeroSectionParams, schema } from './schema';

export function Editor({ params, onChange }: BlockEditorProps) {
  // Parse and validate params with defaults
  const parseResult = schema.safeParse(params);
  const defaultValues = parseResult.success
    ? parseResult.data
    : schema.parse({});

  const form = useForm<HeroSectionParams>({
    defaultValues: defaultValues as HeroSectionParams,
  });

  const handleSubmit = form.handleSubmit((data) => {
    // Validate and merge with defaults
    const validated = schema.parse(data);
    onChange(validated);
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...form.register('title')}
          placeholder="Enter title"
        />
        {form.formState.errors.title && (
          <p className="text-destructive text-sm">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          {...form.register('subtitle')}
          placeholder="Enter subtitle"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctaText">CTA Button Text</Label>
        <Input
          id="ctaText"
          {...form.register('ctaText')}
          placeholder="Get Started"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctaLink">CTA Button Link</Label>
        <Input
          id="ctaLink"
          {...form.register('ctaLink')}
          placeholder="https://example.com"
          type="url"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alignment">Text Alignment</Label>
        <Select
          defaultValue={form.watch('alignment')}
          onValueChange={(value) =>
            form.setValue('alignment', value as 'left' | 'center' | 'right')
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full" type="submit">
        Save Changes
      </Button>
    </form>
  );
}

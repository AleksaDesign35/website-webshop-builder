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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Background</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backgroundImage">Background Image URL</Label>
            <Input
              id="backgroundImage"
              {...form.register('backgroundImage')}
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-muted-foreground text-xs">
              Leave empty to use default Unsplash image
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <Input
              id="backgroundColor"
              {...form.register('backgroundColor')}
              placeholder="#000000"
              type="color"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-lg">Content</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Nadnaslov (Headline)</Label>
            <Input
              id="headline"
              {...form.register('headline')}
              placeholder="Welcome"
            />
            <p className="text-muted-foreground text-xs">
              Mali tekst iznad naslova (opciono)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Naslov (Title)</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Build Amazing Websites"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis (Description)</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              id="description"
              {...form.register('description')}
              placeholder="Create beautiful websites..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaText">CTA Button Text (Opciono)</Label>
            <Input
              id="ctaText"
              {...form.register('ctaText')}
              placeholder="Get Started"
            />
            <p className="text-muted-foreground text-xs">
              Ako nije uneseno, dugme se ne prikazuje
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaLink">CTA Button Link</Label>
            <Input
              id="ctaLink"
              {...form.register('ctaLink')}
              placeholder="#"
              type="url"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-lg">Styling</h3>
        <div className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <Input
              id="textColor"
              {...form.register('textColor')}
              placeholder="#ffffff"
              type="color"
            />
          </div>
        </div>
      </div>

      <Button className="w-full" type="submit">
        Save Changes
      </Button>
    </form>
  );
}

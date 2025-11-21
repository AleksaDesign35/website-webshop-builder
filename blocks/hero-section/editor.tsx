'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
    mode: 'onChange',
  });

  // Watch all form values for real-time updates
  const watchedValues = form.watch();
  const previousValuesRef = useRef<string>('');
  const onChangeRef = useRef(onChange);
  const paramsRef = useRef(params);
  const isInternalUpdateRef = useRef(false);
  
  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync form when params prop changes (from external updates, not from our onChange)
  useEffect(() => {
    // Skip if this is an internal update (from our onChange)
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }

    // Check if params actually changed
    const paramsString = JSON.stringify(params);
    const currentParamsString = JSON.stringify(paramsRef.current);
    
    if (paramsString === currentParamsString) {
      return; // No change
    }
    
    paramsRef.current = params;
    
    try {
      const validated = schema.parse(params);
      const currentValues = form.getValues();
      const currentString = JSON.stringify(currentValues);
      
      // Only update form if params are different from current form values
      if (paramsString !== currentString) {
        form.reset(validated);
        previousValuesRef.current = paramsString;
      }
    } catch {
      // Invalid params, skip
    }
  }, [params, form]);

  // Update parent component on any change (for real-time preview, not saved to DB)
  useEffect(() => {
    try {
      const validated = schema.parse(watchedValues);
      const validatedString = JSON.stringify(validated);
      
      // Skip if values haven't changed
      if (previousValuesRef.current === validatedString) {
        return;
      }

      // Skip if the change came from params prop (to avoid loop)
      const paramsString = JSON.stringify(paramsRef.current);
      if (validatedString === paramsString) {
        previousValuesRef.current = validatedString;
        return;
      }

      previousValuesRef.current = validatedString;
      // Mark that we're making an internal update
      isInternalUpdateRef.current = true;
      // Call onChange immediately for real-time preview (not saved to DB)
      onChangeRef.current(validated);
    } catch {
      // Invalid form data, skip
    }
  }, [watchedValues]);

  return (
    <Tabs className="w-full" defaultValue="content">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="spacing">Spacing</TabsTrigger>
      </TabsList>

      <TabsContent className="mt-4 space-y-6" value="content">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              {...form.register('headline')}
              onChange={(e) => {
                form.setValue('headline', e.target.value);
              }}
              placeholder="Welcome"
            />
            <p className="text-muted-foreground text-xs">
              Small text above the title (optional)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register('title')}
              onChange={(e) => {
                form.setValue('title', e.target.value);
              }}
              placeholder="Build Amazing Websites"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              onChange={(e) => {
                form.setValue('description', e.target.value);
              }}
              placeholder="Create beautiful websites..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaText">Button Text</Label>
            <Input
              id="ctaText"
              {...form.register('ctaText')}
              onChange={(e) => {
                form.setValue('ctaText', e.target.value);
              }}
              placeholder="Get Started"
            />
            <p className="text-muted-foreground text-xs">
              Leave empty to hide the button
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaLink">Button Link</Label>
            <Input
              id="ctaLink"
              {...form.register('ctaLink')}
              onChange={(e) => {
                form.setValue('ctaLink', e.target.value);
              }}
              placeholder="https://example.com"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundImage">Background Image URL</Label>
            <Input
              id="backgroundImage"
              {...form.register('backgroundImage')}
              onChange={(e) => {
                form.setValue('backgroundImage', e.target.value);
              }}
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-muted-foreground text-xs">
              Leave empty to use default image
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent className="mt-4 space-y-6" value="spacing">
        <div className="space-y-6">
          {/* Margin - for spacing between blocks */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">Block Spacing</h3>
            <p className="mb-4 text-muted-foreground text-xs">
              Add space above and below this block to create gaps between blocks
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marginTop">Top Margin (px)</Label>
                <Input
                  id="marginTop"
                  type="number"
                  min="0"
                  value={watchedValues.marginTop || 0}
                  onChange={(e) => {
                    form.setValue('marginTop', Number.parseInt(e.target.value, 10) || 0);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marginBottom">Bottom Margin (px)</Label>
                <Input
                  id="marginBottom"
                  type="number"
                  min="0"
                  value={watchedValues.marginBottom || 0}
                  onChange={(e) => {
                    form.setValue('marginBottom', Number.parseInt(e.target.value, 10) || 0);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Padding - optional internal spacing */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Internal Padding</h3>
                <p className="text-muted-foreground text-xs">
                  Add padding inside the block (optional)
                </p>
              </div>
              <Switch
                checked={watchedValues.enablePadding || false}
                onCheckedChange={(checked) => {
                  form.setValue('enablePadding', checked);
                }}
              />
            </div>
            {watchedValues.enablePadding && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paddingTop">Top Padding (px)</Label>
                  <Input
                    id="paddingTop"
                    type="number"
                    min="0"
                    value={watchedValues.paddingTop || 80}
                    onChange={(e) => {
                      form.setValue('paddingTop', Number.parseInt(e.target.value, 10) || 0);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paddingBottom">Bottom Padding (px)</Label>
                  <Input
                    id="paddingBottom"
                    type="number"
                    min="0"
                    value={watchedValues.paddingBottom || 80}
                    onChange={(e) => {
                      form.setValue('paddingBottom', Number.parseInt(e.target.value, 10) || 0);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

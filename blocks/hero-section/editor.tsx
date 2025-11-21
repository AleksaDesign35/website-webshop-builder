'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
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
            <Label htmlFor="ctaText">CTA Button Text</Label>
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
            <Label htmlFor="ctaLink">CTA Button Link</Label>
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
        </div>
      </TabsContent>

      <TabsContent className="mt-4 space-y-6" value="style">
        <div className="space-y-6">
          {/* Background */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">Background</h3>
            <div className="space-y-4">
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
                  Leave empty to use default Unsplash image
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="backgroundColor"
                    {...form.register('backgroundColor')}
                    onChange={(e) => {
                      form.setValue('backgroundColor', e.target.value);
                    }}
                    placeholder="#000000"
                    type="color"
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    {...form.register('backgroundColor')}
                    onChange={(e) => {
                      form.setValue('backgroundColor', e.target.value);
                    }}
                    placeholder="#000000"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">Typography</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    {...form.register('textColor')}
                    onChange={(e) => {
                      form.setValue('textColor', e.target.value);
                    }}
                    placeholder="#ffffff"
                    type="color"
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    {...form.register('textColor')}
                    onChange={(e) => {
                      form.setValue('textColor', e.target.value);
                    }}
                    placeholder="#ffffff"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alignment">Text Alignment</Label>
                <Select
                  value={watchedValues.alignment || 'center'}
                  onValueChange={(value: string) => {
                    form.setValue('alignment', value as 'left' | 'center' | 'right');
                  }}
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
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent className="mt-4 space-y-6" value="advanced">
        <div className="space-y-4">
          <div>
            <h3 className="mb-4 font-semibold text-sm">Padding</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paddingTop">Top (px)</Label>
                <Input
                  id="paddingTop"
                  type="number"
                  value={watchedValues.padding?.top || 80}
                  onChange={(e) => {
                    form.setValue('padding', {
                      ...watchedValues.padding,
                      top: Number.parseInt(e.target.value, 10) || 0,
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paddingBottom">Bottom (px)</Label>
                <Input
                  id="paddingBottom"
                  type="number"
                  value={watchedValues.padding?.bottom || 80}
                  onChange={(e) => {
                    form.setValue('padding', {
                      ...watchedValues.padding,
                      bottom: Number.parseInt(e.target.value, 10) || 0,
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paddingLeft">Left (px)</Label>
                <Input
                  id="paddingLeft"
                  type="number"
                  value={watchedValues.padding?.left || 20}
                  onChange={(e) => {
                    form.setValue('padding', {
                      ...watchedValues.padding,
                      left: Number.parseInt(e.target.value, 10) || 0,
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paddingRight">Right (px)</Label>
                <Input
                  id="paddingRight"
                  type="number"
                  value={watchedValues.padding?.right || 20}
                  onChange={(e) => {
                    form.setValue('padding', {
                      ...watchedValues.padding,
                      right: Number.parseInt(e.target.value, 10) || 0,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

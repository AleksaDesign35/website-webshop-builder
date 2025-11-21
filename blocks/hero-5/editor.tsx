'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/dashboard/image-upload';
import { FeatureEditor, type Feature } from '@/components/dashboard/feature-editor';
import { TextClassEditor, type TextClass } from '@/components/dashboard/text-class-editor';
import type { BlockEditorProps } from '../types';
import { type Hero5Params, schema } from './schema';

export function Editor({ params, onChange }: BlockEditorProps) {
  const parseResult = schema.safeParse(params);
  const defaultValues = parseResult.success
    ? parseResult.data
    : (schema.parse({}) as Hero5Params);

  const form = useForm<Hero5Params>({
    defaultValues,
    mode: 'onChange',
  });

  const watchedValues = form.watch();
  const previousValuesRef = useRef<string>('');
  const onChangeRef = useRef(onChange);
  const paramsRef = useRef(params);
  const isInternalUpdateRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }

    const paramsString = JSON.stringify(params);
    const currentParamsString = JSON.stringify(paramsRef.current);

    if (paramsString === currentParamsString) {
      return;
    }

    paramsRef.current = params;

    try {
      const validated = schema.parse(params);
      const currentValues = form.getValues();
      const currentString = JSON.stringify(currentValues);

      if (paramsString !== currentString) {
        form.reset(validated);
        previousValuesRef.current = paramsString;
      }
    } catch {
      // Invalid params, skip
    }
  }, [params, form]);

  useEffect(() => {
    try {
      const validated = schema.parse(watchedValues);
      const validatedString = JSON.stringify(validated);

      if (previousValuesRef.current === validatedString) {
        return;
      }

      const paramsString = JSON.stringify(paramsRef.current);
      if (validatedString === paramsString) {
        previousValuesRef.current = validatedString;
        return;
      }

      previousValuesRef.current = validatedString;
      isInternalUpdateRef.current = true;
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
            <TextClassEditor
              value={watchedValues.title || ''}
              onChange={(value) => form.setValue('title', value)}
              classes={(watchedValues.titleClasses || []) as TextClass[]}
              onClassesChange={(classes) => form.setValue('titleClasses', classes as any)}
              label="Title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              onChange={(e) => form.setValue('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchPlaceholder">Search Placeholder</Label>
            <Input
              id="searchPlaceholder"
              {...form.register('searchPlaceholder')}
              onChange={(e) => form.setValue('searchPlaceholder', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <FeatureEditor
              features={(watchedValues.features || []) as Feature[]}
              onChange={(features) => form.setValue('features', features as any)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <ImageUpload
              value={watchedValues.image}
              onChange={(url) => form.setValue('image', url)}
            />
            <Input
              id="image"
              {...form.register('image')}
              onChange={(e) => form.setValue('image', e.target.value)}
              type="url"
              placeholder="Or enter image URL"
              className="mt-2"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent className="mt-4 space-y-6" value="spacing">
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 font-semibold text-sm">Block Spacing</h3>
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

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Internal Padding</h3>
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
                    value={watchedValues.paddingTop || 100}
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
                    value={watchedValues.paddingBottom || 100}
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



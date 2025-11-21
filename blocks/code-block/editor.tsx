'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { codeBlockSchema, type CodeBlockParams } from './schema';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { BlockEditorProps } from '@/blocks/types';

export function CodeBlockEditor({ params, onChange }: BlockEditorProps) {
  const parseResult = codeBlockSchema.safeParse(params);
  const defaultValues = parseResult.success
    ? parseResult.data
    : (codeBlockSchema.parse({}) as CodeBlockParams);

  const form = useForm<CodeBlockParams>({
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
      const validated = codeBlockSchema.parse(params);
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
      const validated = codeBlockSchema.parse(watchedValues);
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="html">HTML Code</Label>
        <Textarea
          id="html"
          {...form.register('html')}
          onChange={(e) => form.setValue('html', e.target.value)}
          placeholder="<div>Your HTML here</div>"
          rows={8}
          className="font-mono text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="css">CSS Code</Label>
        <Textarea
          id="css"
          {...form.register('css')}
          onChange={(e) => form.setValue('css', e.target.value)}
          placeholder=".my-class { color: red; }"
          rows={8}
          className="font-mono text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="js">JavaScript Code</Label>
        <Textarea
          id="js"
          {...form.register('js')}
          onChange={(e) => form.setValue('js', e.target.value)}
          placeholder="console.log('Hello');"
          rows={6}
          className="font-mono text-xs"
        />
      </div>

      <div className="space-y-4 border-t border-border pt-4">
        <h3 className="font-semibold text-sm">Spacing</h3>

        <div className="space-y-2">
          <Label htmlFor="marginTop">Margin Top (px)</Label>
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
          <Label htmlFor="marginBottom">Margin Bottom (px)</Label>
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

        <div className="flex items-center justify-between">
          <Label htmlFor="enablePadding">Enable Padding</Label>
          <Switch
            id="enablePadding"
            checked={watchedValues.enablePadding || false}
            onCheckedChange={(checked) => {
              form.setValue('enablePadding', checked);
            }}
          />
        </div>

        {watchedValues.enablePadding && (
          <>
            <div className="space-y-2">
              <Label htmlFor="paddingTop">Padding Top (px)</Label>
              <Input
                id="paddingTop"
                type="number"
                min="0"
                value={watchedValues.paddingTop || 0}
                onChange={(e) => {
                  form.setValue('paddingTop', Number.parseInt(e.target.value, 10) || 0);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paddingBottom">Padding Bottom (px)</Label>
              <Input
                id="paddingBottom"
                type="number"
                min="0"
                value={watchedValues.paddingBottom || 0}
                onChange={(e) => {
                  form.setValue('paddingBottom', Number.parseInt(e.target.value, 10) || 0);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}


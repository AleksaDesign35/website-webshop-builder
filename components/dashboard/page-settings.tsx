'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const pageSettingsSchema = z.object({
  containerWidth: z.enum(['full', 'container', 'narrow', 'wide']).default('container'),
  backgroundColor: z.string().default('#ffffff'),
  rootFontSize: z.number().min(12).max(24).default(16),
  maxWidth: z.number().min(320).max(2560).optional(),
  fontFamily: z.string().default('system-ui'),
  lineHeight: z.number().min(1).max(2).default(1.5),
  autosaveEnabled: z.boolean().default(false),
  autosaveInterval: z.number().min(5).max(300).default(30), // seconds
});

export type PageSettings = z.infer<typeof pageSettingsSchema>;

interface PageSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: Record<string, unknown>;
  onSave: (settings: PageSettings) => void;
}

export function PageSettings({ open, onClose, settings, onSave }: PageSettingsProps) {
  const parseResult = pageSettingsSchema.safeParse(settings);
  const defaultValues = parseResult.success
    ? parseResult.data
    : pageSettingsSchema.parse({});

  const form = useForm<PageSettings>({
    defaultValues,
  });

  const watchedValues = form.watch();

  const handleSubmit = form.handleSubmit((data) => {
    const validated = pageSettingsSchema.parse(data);
    onSave(validated);
  });

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Page Settings</DialogTitle>
          <DialogDescription>
            Configure page-wide settings like container width, background, and typography
          </DialogDescription>
        </DialogHeader>

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          {/* Layout Section */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">Layout</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="containerWidth">Container Width</Label>
                <Select
                  value={watchedValues.containerWidth || 'container'}
                  onValueChange={(value) => {
                    form.setValue('containerWidth', value as 'full' | 'container' | 'narrow' | 'wide');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Width</SelectItem>
                    <SelectItem value="container">Container (max 1280px)</SelectItem>
                    <SelectItem value="wide">Wide (max 1536px)</SelectItem>
                    <SelectItem value="narrow">Narrow (max 1024px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxWidth">Max Width (px)</Label>
                <Input
                  id="maxWidth"
                  min={320}
                  max={2560}
                  type="number"
                  value={watchedValues.maxWidth || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number.parseInt(e.target.value, 10) : undefined;
                    form.setValue('maxWidth', value);
                  }}
                  placeholder="Auto (based on container width)"
                />
                <p className="text-muted-foreground text-xs">
                  Override container width with custom max width
                </p>
              </div>
            </div>
          </div>

          {/* Background Section */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">Background</h3>
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={watchedValues.backgroundColor || '#ffffff'}
                  onChange={(e) => {
                    form.setValue('backgroundColor', e.target.value);
                  }}
                  className="h-10 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={watchedValues.backgroundColor || '#ffffff'}
                  onChange={(e) => {
                    form.setValue('backgroundColor', e.target.value);
                  }}
                  placeholder="#ffffff"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                This background color applies to the page container, not individual blocks
              </p>
            </div>
          </div>

          {/* Typography Section */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">Typography</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rootFontSize">Root Font Size (px)</Label>
                <Input
                  id="rootFontSize"
                  min={12}
                  max={24}
                  type="number"
                  value={watchedValues.rootFontSize || 16}
                  onChange={(e) => {
                    form.setValue('rootFontSize', Number.parseInt(e.target.value, 10) || 16);
                  }}
                />
                <p className="text-muted-foreground text-xs">
                  Base font size for the page (affects rem calculations)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  value={watchedValues.fontFamily || 'system-ui'}
                  onValueChange={(value) => {
                    form.setValue('fontFamily', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system-ui">System UI (Default)</SelectItem>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lineHeight">Line Height</Label>
                <Input
                  id="lineHeight"
                  min={1}
                  max={2}
                  step={0.1}
                  type="number"
                  value={watchedValues.lineHeight || 1.5}
                  onChange={(e) => {
                    form.setValue('lineHeight', Number.parseFloat(e.target.value) || 1.5);
                  }}
                />
                <p className="text-muted-foreground text-xs">
                  Line height multiplier (1.0 - 2.0)
                </p>
              </div>
            </div>
          </div>

          {/* Autosave Section */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">Autosave</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autosaveEnabled">Enable Autosave</Label>
                  <p className="text-muted-foreground text-xs">
                    Automatically save changes at specified interval
                  </p>
                </div>
                <Switch
                  checked={watchedValues.autosaveEnabled || false}
                  id="autosaveEnabled"
                  onCheckedChange={(checked) => {
                    form.setValue('autosaveEnabled', checked);
                  }}
                />
              </div>

              {watchedValues.autosaveEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="autosaveInterval">Autosave Interval (seconds)</Label>
                  <Input
                    id="autosaveInterval"
                    min={5}
                    max={300}
                    type="number"
                    value={watchedValues.autosaveInterval || 30}
                    onChange={(e) => {
                      form.setValue('autosaveInterval', Number.parseInt(e.target.value, 10) || 30);
                    }}
                  />
                  <p className="text-muted-foreground text-xs">
                    Save changes every {watchedValues.autosaveInterval || 30} seconds
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


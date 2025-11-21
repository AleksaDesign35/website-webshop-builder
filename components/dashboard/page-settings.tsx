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
      <DialogContent className="!max-h-[90vh] !w-[80vw] !max-w-none overflow-y-auto p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Page Settings</DialogTitle>
          <DialogDescription className="text-base">
            Configure page-wide settings like container width, background, and typography
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Layout Section */}
          <div className="rounded-lg border bg-muted/30 p-6">
            <h3 className="mb-6 text-lg font-semibold">Layout</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="containerWidth" className="text-base">
                  Container Width
                </Label>
                <Select
                  value={watchedValues.containerWidth || 'container'}
                  onValueChange={(value) => {
                    form.setValue('containerWidth', value as 'full' | 'container' | 'narrow' | 'wide');
                  }}
                >
                  <SelectTrigger className="h-12">
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

              <div className="space-y-3">
                <Label htmlFor="maxWidth" className="text-base">
                  Max Width (px)
                </Label>
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
                  className="h-12"
                />
                <p className="text-muted-foreground text-sm">
                  Override container width with custom max width
                </p>
              </div>
            </div>
          </div>

          {/* Background Section */}
          <div className="rounded-lg border bg-muted/30 p-6">
            <h3 className="mb-6 text-lg font-semibold">Background</h3>
            <div className="space-y-3">
              <Label htmlFor="backgroundColor" className="text-base">
                Background Color
              </Label>
              <div className="flex gap-3">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={watchedValues.backgroundColor || '#ffffff'}
                  onChange={(e) => {
                    form.setValue('backgroundColor', e.target.value);
                  }}
                  className="h-12 w-24 cursor-pointer"
                />
                <Input
                  type="text"
                  value={watchedValues.backgroundColor || '#ffffff'}
                  onChange={(e) => {
                    form.setValue('backgroundColor', e.target.value);
                  }}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
              <p className="text-muted-foreground text-sm">
                This background color applies to the page container, not individual blocks
              </p>
            </div>
          </div>

          {/* Typography Section */}
          <div className="rounded-lg border bg-muted/30 p-6">
            <h3 className="mb-6 text-lg font-semibold">Typography</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="rootFontSize" className="text-base">
                  Root Font Size (px)
                </Label>
                <Input
                  id="rootFontSize"
                  min={12}
                  max={24}
                  type="number"
                  value={watchedValues.rootFontSize || 16}
                  onChange={(e) => {
                    form.setValue('rootFontSize', Number.parseInt(e.target.value, 10) || 16);
                  }}
                  className="h-12"
                />
                <p className="text-muted-foreground text-sm">
                  Base font size for the page (affects rem calculations)
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="fontFamily" className="text-base">
                  Font Family
                </Label>
                <Select
                  value={watchedValues.fontFamily || 'system-ui'}
                  onValueChange={(value) => {
                    form.setValue('fontFamily', value);
                  }}
                >
                  <SelectTrigger className="h-12">
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

              <div className="space-y-3">
                <Label htmlFor="lineHeight" className="text-base">
                  Line Height
                </Label>
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
                  className="h-12"
                />
                <p className="text-muted-foreground text-sm">
                  Line height multiplier (1.0 - 2.0)
                </p>
              </div>
            </div>
          </div>

          {/* Autosave Section */}
          <div className="rounded-lg border bg-muted/30 p-6">
            <h3 className="mb-6 text-lg font-semibold">Autosave</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="autosaveEnabled" className="text-base">
                    Enable Autosave
                  </Label>
                  <p className="text-muted-foreground text-sm">
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
                <div className="space-y-3">
                  <Label htmlFor="autosaveInterval" className="text-base">
                    Autosave Interval (seconds)
                  </Label>
                  <Input
                    id="autosaveInterval"
                    min={5}
                    max={300}
                    type="number"
                    value={watchedValues.autosaveInterval || 30}
                    onChange={(e) => {
                      form.setValue('autosaveInterval', Number.parseInt(e.target.value, 10) || 30);
                    }}
                    className="h-12"
                  />
                  <p className="text-muted-foreground text-sm">
                    Save changes every {watchedValues.autosaveInterval || 30} seconds
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t pt-6">
            <Button
              onClick={onClose}
              type="button"
              variant="outline"
              size="lg"
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="min-w-32">
              Save Settings
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


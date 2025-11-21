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

const siteThemeSchema = z.object({
  // Colors
  primaryColor: z.string().default('#3b82f6'),
  secondaryColor: z.string().default('#64748b'),
  backgroundColor: z.string().default('#ffffff'),
  textColor: z.string().default('#1e293b'),
  // Fonts
  fontFamily: z.string().default('system-ui'),
  // Header & Footer
  headerType: z.enum(['1', '2']).default('1'),
  footerType: z.enum(['1', '2']).default('1'),
});

export type SiteThemeSettings = z.infer<typeof siteThemeSchema>;

interface SiteSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: Record<string, unknown> | null;
  onSave: (settings: SiteThemeSettings) => void;
}

export function SiteSettings({ open, onClose, settings, onSave }: SiteSettingsProps) {
  const parseResult = siteThemeSchema.safeParse(settings || {});
  const defaultValues = parseResult.success
    ? parseResult.data
    : siteThemeSchema.parse({});

  const form = useForm<SiteThemeSettings>({
    defaultValues,
  });

  const watchedValues = form.watch();

  const handleSubmit = form.handleSubmit((data) => {
    const validated = siteThemeSchema.parse(data);
    onSave(validated);
  });

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="!max-h-[90vh] !w-[80vw] !max-w-none overflow-y-auto p-8 brightness-110">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Site Theme Settings</DialogTitle>
          <DialogDescription className="text-base">
            Configure colors, fonts, header and footer for your entire site
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Colors Section */}
          <div className="rounded-lg border bg-muted/40 p-6">
            <h3 className="mb-6 text-lg font-semibold">Colors</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="primaryColor" className="text-base">
                  Primary Color
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={watchedValues.primaryColor || '#3b82f6'}
                    onChange={(e) => {
                      form.setValue('primaryColor', e.target.value);
                    }}
                    className="h-12 w-24 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={watchedValues.primaryColor || '#3b82f6'}
                    onChange={(e) => {
                      form.setValue('primaryColor', e.target.value);
                    }}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="secondaryColor" className="text-base">
                  Secondary Color
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={watchedValues.secondaryColor || '#64748b'}
                    onChange={(e) => {
                      form.setValue('secondaryColor', e.target.value);
                    }}
                    className="h-12 w-24 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={watchedValues.secondaryColor || '#64748b'}
                    onChange={(e) => {
                      form.setValue('secondaryColor', e.target.value);
                    }}
                    placeholder="#64748b"
                    className="flex-1"
                  />
                </div>
              </div>

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
              </div>

              <div className="space-y-3">
                <Label htmlFor="textColor" className="text-base">
                  Text Color
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="textColor"
                    type="color"
                    value={watchedValues.textColor || '#1e293b'}
                    onChange={(e) => {
                      form.setValue('textColor', e.target.value);
                    }}
                    className="h-12 w-24 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={watchedValues.textColor || '#1e293b'}
                    onChange={(e) => {
                      form.setValue('textColor', e.target.value);
                    }}
                    placeholder="#1e293b"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography Section */}
          <div className="rounded-lg border bg-muted/40 p-6">
            <h3 className="mb-6 text-lg font-semibold">Typography</h3>
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
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Merriweather">Merriweather</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Header & Footer Section */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Header Section */}
            <div className="rounded-lg border bg-muted/40 p-6">
              <h3 className="mb-6 text-lg font-semibold">Header</h3>
              <div className="space-y-3">
                <Label htmlFor="headerType" className="text-base">
                  Header Type
                </Label>
                <Select
                  value={watchedValues.headerType || '1'}
                  onValueChange={(value) => {
                    form.setValue('headerType', value as '1' | '2');
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select header type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Header 1</SelectItem>
                    <SelectItem value="2">Header 2</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-sm">
                  Choose the header style for your site
                </p>
              </div>
            </div>

            {/* Footer Section */}
            <div className="rounded-lg border bg-muted/40 p-6">
              <h3 className="mb-6 text-lg font-semibold">Footer</h3>
              <div className="space-y-3">
                <Label htmlFor="footerType" className="text-base">
                  Footer Type
                </Label>
                <Select
                  value={watchedValues.footerType || '1'}
                  onValueChange={(value) => {
                    form.setValue('footerType', value as '1' | '2');
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select footer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Footer 1</SelectItem>
                    <SelectItem value="2">Footer 2</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-sm">
                  Choose the footer style for your site
                </p>
              </div>
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


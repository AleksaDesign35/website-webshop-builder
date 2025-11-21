'use client';

import { useState, useRef } from 'react';
import { Search, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from './image-upload';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (iconType: 'lucide' | 'custom', iconName?: string, iconUrl?: string) => void;
  currentIconType?: 'lucide' | 'custom' | 'uploaded';
  currentIconName?: string;
  currentIconUrl?: string;
}

// Get all Lucide icon names
const getAllLucideIcons = () => {
  const iconNames: string[] = [];
  for (const key in LucideIcons) {
    if (key !== 'default' && key !== 'createLucideIcon' && typeof (LucideIcons as any)[key] === 'function') {
      iconNames.push(key);
    }
  }
  return iconNames.sort();
};

const allLucideIcons = getAllLucideIcons();

export function IconPicker({
  open,
  onClose,
  onSelect,
  currentIconType = 'lucide',
  currentIconName,
  currentIconUrl,
}: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'lucide' | 'custom'>('lucide');
  const [customIconUrl, setCustomIconUrl] = useState(currentIconUrl || '');

  if (!open) return null;

  const filteredIcons = allLucideIcons.filter(iconName =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLucide = (iconName: string) => {
    onSelect('lucide', iconName);
    onClose();
  };

  const handleSelectCustom = (url: string) => {
    onSelect('custom', undefined, url);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        // Close when clicking on backdrop or outside modal
        if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('modal-backdrop')) {
          onClose();
        }
      }}
    >
      <div className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-50 w-[90vw] max-w-2xl max-h-[80vh] rounded-lg border bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-semibold text-lg">Choose Icon</h2>
          <Button onClick={onClose} size="icon" variant="ghost" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lucide">Lucide Icons</TabsTrigger>
              <TabsTrigger value="custom">Custom Icon</TabsTrigger>
            </TabsList>

            <TabsContent value="lucide" className="mt-4">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search icons by name..."
                    className="pl-9"
                  />
                </div>
                {searchQuery && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredIcons.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground text-sm">No icons found</p>
                    <p className="text-muted-foreground text-xs mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                    {filteredIcons.map((iconName) => {
                      const IconComponent = (LucideIcons as any)[iconName];
                      if (!IconComponent) return null;
                      const isSelected = currentIconType === 'lucide' && currentIconName === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => handleSelectLucide(iconName)}
                          className={cn(
                            'group relative flex h-16 flex-col items-center justify-center gap-1 rounded border border-border bg-background p-2 transition-all hover:border-primary hover:bg-muted',
                            isSelected && 'border-primary bg-primary/10 ring-2 ring-primary'
                          )}
                          title={iconName}
                        >
                          <IconComponent className="h-5 w-5 shrink-0" />
                          <span className="text-[9px] leading-tight text-center text-muted-foreground line-clamp-2">
                            {iconName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Upload Custom Icon</label>
                  <ImageUpload
                    value={customIconUrl}
                    onChange={(url) => {
                      setCustomIconUrl(url);
                      if (url) {
                        handleSelectCustom(url);
                      }
                    }}
                    maxSizeMB={2}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Or Enter Icon URL</label>
                  <Input
                    value={customIconUrl}
                    onChange={(e) => setCustomIconUrl(e.target.value)}
                    placeholder="https://example.com/icon.svg"
                    type="url"
                  />
                  {customIconUrl && (
                    <Button
                      onClick={() => handleSelectCustom(customIconUrl)}
                      className="mt-2 w-full"
                    >
                      Use This Icon
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}


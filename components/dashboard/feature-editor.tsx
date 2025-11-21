'use client';

import { Plus, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { IconPicker } from './icon-picker';

export interface Feature {
  id: string;
  text: string;
  iconType: 'lucide' | 'custom' | 'uploaded';
  iconName?: string; // For lucide icons
  iconUrl?: string; // For custom/uploaded icons
}

interface FeatureEditorProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
  availableLucideIcons?: string[];
}

const commonLucideIcons = [
  'Check',
  'CheckCircle',
  'Star',
  'Heart',
  'ThumbsUp',
  'Award',
  'Zap',
  'Shield',
  'Rocket',
  'TrendingUp',
];

export function FeatureEditor({ features, onChange, availableLucideIcons = commonLucideIcons }: FeatureEditorProps) {
  const [localFeatures, setLocalFeatures] = useState<Feature[]>(features);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

  useEffect(() => {
    setLocalFeatures(features);
  }, [features]);

  const updateFeature = (id: string, updates: Partial<Feature>) => {
    const newFeatures = localFeatures.map(f => 
      f.id === id ? { ...f, ...updates } : f
    );
    setLocalFeatures(newFeatures);
    onChange(newFeatures);
  };

  const addFeature = () => {
    const newFeature: Feature = {
      id: `feature-${Date.now()}`,
      text: '',
      iconType: 'lucide',
      iconName: 'Check',
    };
    const newFeatures = [...localFeatures, newFeature];
    setLocalFeatures(newFeatures);
    onChange(newFeatures);
  };

  const removeFeature = (id: string) => {
    const newFeatures = localFeatures.filter(f => f.id !== id);
    setLocalFeatures(newFeatures);
    onChange(newFeatures);
  };

  const getIconComponent = (feature: Feature) => {
    if (feature.iconType === 'lucide' && feature.iconName) {
      const IconComponent = (LucideIcons as any)[feature.iconName];
      if (IconComponent) {
        return <IconComponent className="h-4 w-4" />;
      }
    } else if (feature.iconUrl) {
      return <img src={feature.iconUrl} alt="" className="h-4 w-4 object-contain" />;
    }
    return <Check className="h-4 w-4" />;
  };

  return (
    <div className="space-y-2">
      {localFeatures.map((feature, index) => (
        <div key={feature.id} className="relative flex items-center gap-2 rounded-lg border border-border bg-background p-2">
          {/* Remove Button - Top Right */}
          {localFeatures.length > 1 && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              onClick={() => removeFeature(feature.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          {/* Icon Selector */}
          <div className="relative">
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-background hover:border-primary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setEditingFeatureId(feature.id);
                setIconPickerOpen(true);
              }}
              title="Click to choose icon"
            >
              {getIconComponent(feature)}
            </button>
          </div>

          {/* Feature Text Input */}
          <Input
            value={feature.text}
            onChange={(e) => updateFeature(feature.id, { text: e.target.value })}
            placeholder={`Feature ${index + 1}`}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && feature.text.trim()) {
                addFeature();
              }
            }}
          />
        </div>
      ))}

      {/* Icon Picker Modal */}
      {iconPickerOpen && editingFeatureId && (
        <IconPicker
          open={iconPickerOpen}
          onClose={() => {
            setIconPickerOpen(false);
            setEditingFeatureId(null);
          }}
          onSelect={(iconType, iconName, iconUrl) => {
            if (editingFeatureId) {
              if (iconType === 'lucide') {
                updateFeature(editingFeatureId, {
                  iconType: 'lucide',
                  iconName,
                  iconUrl: undefined,
                });
              } else {
                updateFeature(editingFeatureId, {
                  iconType: 'custom',
                  iconName: undefined,
                  iconUrl,
                });
              }
            }
            setIconPickerOpen(false);
            setEditingFeatureId(null);
          }}
          currentIconType={localFeatures.find(f => f.id === editingFeatureId)?.iconType}
          currentIconName={localFeatures.find(f => f.id === editingFeatureId)?.iconName}
          currentIconUrl={localFeatures.find(f => f.id === editingFeatureId)?.iconUrl}
        />
      )}

      {/* Add Feature Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addFeature}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Feature
      </Button>
    </div>
  );
}


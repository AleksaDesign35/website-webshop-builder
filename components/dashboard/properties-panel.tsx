'use client';

import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertiesPanelProps {
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
  changeCount?: number;
}

export function PropertiesPanel({
  title = 'Properties',
  children,
  onClose,
  onSave,
  isSaving = false,
  hasChanges = false,
  changeCount = 0,
}: PropertiesPanelProps) {
  return (
    <div className="flex h-full w-96 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">{title}</h2>
        </div>
        {onClose && (
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-muted/50">
        <div className="space-y-6 p-6">
          {children}
        </div>
      </div>

      {/* Footer with Save button */}
      {onSave && (
        <div className="border-t border-border p-4">
          <Button
            onClick={onSave}
            disabled={isSaving || !hasChanges}
            className="w-full"
            size="sm"
          >
            {isSaving
              ? 'Saving...'
              : hasChanges
                ? `Save ${changeCount > 0 ? `(${changeCount})` : ''}`
                : 'Save'}
          </Button>
        </div>
      )}
    </div>
  );
}


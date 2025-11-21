'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryBlocksModalProps {
  open: boolean;
  onClose: () => void;
  category: string;
  blocks: Array<{
    id: string;
    name: string;
    description: string;
    previewImage?: string;
    icon?: unknown;
  }>;
  onSelectBlock: (blockId: string) => void;
}

export function CategoryBlocksModal({
  open,
  onClose,
  category,
  blocks,
  onSelectBlock,
}: CategoryBlocksModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleBlockClick = (blockId: string) => {
    onSelectBlock(blockId);
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
      {/* Backdrop */}
      <div className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal - 80% width */}
      <div className="relative z-50 w-[80vw] max-h-[90vh] rounded-lg border bg-background shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="font-semibold text-lg">{category} Blocks</h2>
            <p className="text-muted-foreground text-sm">
              {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'} available
            </p>
          </div>
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - Grid of blocks */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {blocks.map((block) => {
              const Icon = block.icon as React.ComponentType<{ className?: string }> | undefined;
              return (
                <button
                  key={block.id}
                  onClick={() => handleBlockClick(block.id)}
                  className="group flex flex-col gap-3 rounded-lg border border-border bg-background p-4 text-left transition-all hover:border-primary hover:shadow-lg"
                >
                  {block.previewImage ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded border border-border bg-muted">
                      <img
                        alt={block.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        src={block.previewImage}
                      />
                    </div>
                  ) : Icon ? (
                    <div className="flex aspect-video w-full items-center justify-center rounded border border-border bg-muted">
                      <Icon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded border border-border bg-muted">
                      <div className="h-12 w-12 rounded bg-primary/10" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{block.name}</h4>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {block.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


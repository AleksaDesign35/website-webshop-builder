'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllBlocksMetadata } from '@/blocks/index';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BlockPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (blockId: string) => void;
}

export function BlockPicker({ open, onClose, onSelect }: BlockPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [blocks, setBlocks] = useState<
    Array<{
      id: string;
      name: string;
      category: string;
      description: string;
      icon: unknown;
      popular?: boolean;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Load blocks on mount
  useEffect(() => {
    getAllBlocksMetadata()
      .then((data) => {
        setBlocks(data as any);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load blocks:', error);
        setLoading(false);
      });
  }, []);

  const filteredBlocks = blocks.filter(
    (block) =>
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Block</DialogTitle>
          <DialogDescription>
            Choose a block to add to your page
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <input
              className="h-10 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blocks..."
              type="search"
              value={searchQuery}
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Loading blocks...</p>
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No blocks found</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredBlocks.map((block) => {
                const Icon = block.icon as React.ComponentType<{
                  className?: string;
                }>;
                return (
                  <Button
                    className="h-auto flex-col items-start justify-start p-4"
                    key={block.id}
                    onClick={() => {
                      onSelect(block.id);
                      onClose();
                    }}
                    variant="outline"
                  >
                    <div className="mb-2 flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-5 w-5" />}
                        <span className="font-semibold">{block.name}</span>
                        {block.popular && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-[10px] text-primary uppercase">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-left text-muted-foreground text-xs">
                      {block.description}
                    </p>
                    <p className="mt-1 text-left text-muted-foreground text-xs">
                      {block.category}
                    </p>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

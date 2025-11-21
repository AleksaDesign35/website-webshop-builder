'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllBlocksMetadata } from '@/blocks/index';
import { CustomModal } from './custom-modal';

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
      previewImage?: string;
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
    <CustomModal
      open={open}
      onClose={onClose}
      title="Add Block"
      description="Choose a block to add to your page"
    >
      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blocks..."
              type="search"
              value={searchQuery}
            />
          </div>
        </div>

        {/* Blocks Grid */}
        {loading ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Loading blocks...</p>
          </div>
        ) : filteredBlocks.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No blocks found</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlocks.map((block) => {
              const Icon = block.icon as React.ComponentType<{
                className?: string;
              }>;
              return (
                <button
                  className="group relative overflow-hidden rounded-lg border border-border bg-card text-left transition-all hover:border-primary hover:shadow-lg"
                  key={block.id}
                  onClick={() => {
                    onSelect(block.id);
                    onClose();
                  }}
                  type="button"
                >
                  {/* Preview Image */}
                  {block.previewImage ? (
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <img
                        alt={block.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        src={block.previewImage}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      {block.popular && (
                        <span className="absolute top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-muted">
                      {Icon && <Icon className="h-12 w-12 text-muted-foreground" />}
                    </div>
                  )}
                  
                  {/* Block Info */}
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      {!block.previewImage && Icon && (
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      )}
                      <h3 className="font-semibold text-sm">{block.name}</h3>
                      {!block.previewImage && block.popular && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="mb-1 text-xs text-muted-foreground">
                      {block.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">
                      {block.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </CustomModal>
  );
}

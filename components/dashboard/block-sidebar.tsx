'use client';

import { Search, Layout, FileText, Image, Mail, Users, ShoppingCart, Code2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllBlocksMetadata } from '@/blocks/index';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CategoryBlocksModal } from './category-blocks-modal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableBlockItem } from './sortable-block-item';

interface BlockSidebarProps {
  onSelectBlock: (blockId: string) => void;
  onReorderBlocks?: (blockIds: string[]) => void;
  onBlockClick?: (blockId: string) => void;
  pageName: string;
  pageUrl?: string;
  currentBlocks?: Array<{
    id: string;
    blockId: string;
    name: string;
    previewImage?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

type BlockCategory = 'all' | 'navigation' | 'layout' | 'text' | 'forms' | 'media' | 'e-commerce';

// Map block categories to sidebar categories
const categoryMap: Record<string, BlockCategory> = {
  'Navigation': 'navigation',
  'Layout': 'layout',
  'Text': 'text',
  'Forms': 'forms',
  'Media': 'media',
  'E-commerce': 'e-commerce',
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  navigation: Layout,
  layout: Layout,
  text: FileText,
  forms: Mail,
  media: Image,
  'e-commerce': ShoppingCart,
  all: Code2,
};

export function BlockSidebar({ onSelectBlock, onReorderBlocks, onBlockClick, pageName, pageUrl, currentBlocks = [] }: BlockSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'layouts' | 'elements'>('layouts');
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory>('all');
  const [blocks, setBlocks] = useState<
    Array<{
      id: string;
      name: string;
      category: string;
      description: string;
      icon: unknown;
      previewImage?: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorderBlocks && currentBlocks) {
      const oldIndex = currentBlocks.findIndex((block) => block.id === active.id);
      const newIndex = currentBlocks.findIndex((block) => block.id === over.id);

      const newBlocks = arrayMove(currentBlocks, oldIndex, newIndex);
      const blockIds = newBlocks.map((block) => block.id);
      onReorderBlocks(blockIds);
    }
  };

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

  const filteredBlocks = blocks.filter((block) => {
    const matchesSearch =
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const blockCategory = categoryMap[block.category] || 'layout';
    const matchesCategory = selectedCategory === 'all' || blockCategory === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group blocks by category
  const blocksByCategory = filteredBlocks.reduce((acc, block) => {
    const category = block.category.toLowerCase() || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(block);
    return acc;
  }, {} as Record<string, typeof blocks>);

  const categories: BlockCategory[] = ['navigation', 'layout', 'text', 'forms', 'media', 'e-commerce'];

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-card">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setSelectedTab('layouts')}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium transition-colors',
            selectedTab === 'layouts'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Layouts
        </button>
        <button
          onClick={() => setSelectedTab('elements')}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium transition-colors',
            selectedTab === 'elements'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Elements
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            type="search"
            value={searchQuery}
          />
        </div>
      </div>


      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedTab === 'layouts' ? (
          // Show current blocks on page
          currentBlocks.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">No blocks on page yet</p>
              <p className="text-muted-foreground text-xs mt-1">Add blocks from Elements tab</p>
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <SortableContext
                items={currentBlocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  <h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                    Page Layout ({currentBlocks.length})
                  </h3>
                  {currentBlocks.map((block) => {
                    const blockMeta = blocks.find((b) => b.id === block.blockId);
                    const Icon = blockMeta?.icon as React.ComponentType<{ className?: string }> || Layout;
                    return (
                      <SortableBlockItem
                        key={block.id}
                        id={block.id}
                        blockId={block.blockId}
                        name={block.name}
                        previewImage={block.previewImage || blockMeta?.previewImage}
                        icon={Icon}
                        onClick={() => onBlockClick?.(block.id)}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )
        ) : loading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">Loading blocks...</p>
          </div>
        ) : filteredBlocks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">No blocks found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(blocksByCategory).map(([category, categoryBlocks]) => (
              <button
                key={category}
                onClick={() => setSelectedCategoryForModal(category)}
                className="w-full rounded-lg border border-transparent bg-muted/50 px-3 py-2.5 text-left transition-all hover:border-dashed hover:border-primary hover:bg-muted"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase text-muted-foreground">
                  <span>{category}</span>
                  <span className="text-muted-foreground/50">({categoryBlocks.length})</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Category Blocks Modal */}
        {selectedCategoryForModal && (
          <CategoryBlocksModal
            open={!!selectedCategoryForModal}
            onClose={() => setSelectedCategoryForModal(null)}
            category={selectedCategoryForModal}
            blocks={blocksByCategory[selectedCategoryForModal] || []}
            onSelectBlock={onSelectBlock}
          />
        )}
      </div>

      {/* Bottom Stats & Code Section */}
      <div className="border-t border-border">
        {/* Code Section */}
        <div className="border-b border-border p-3">
          <button
            onClick={() => onSelectBlock('code-block')}
            className="flex w-full items-center gap-2 rounded-lg border border-border bg-background p-2 text-left transition-all hover:border-primary hover:bg-primary/5"
          >
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Add Custom Code</span>
          </button>
        </div>

        {/* Stats */}
        <div className="p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Blocks on page</span>
            <span className="font-semibold">{currentBlocks.length}</span>
          </div>
          {selectedTab === 'elements' && (
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Available</span>
              <span className="font-semibold">{filteredBlocks.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


'use client';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Layout,
  Maximize2,
  Minimize2,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getBlock } from '@/blocks/index';
import type { BlockDefinition } from '@/blocks/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BlockPicker } from './block-picker';

interface Block {
  id: string;
  blockId: string;
  params: Record<string, unknown>;
  order: number;
}

interface BlockEditorProps {
  siteId: string;
  pageId: string;
}

// TODO: Replace with real data from Supabase
const mockBlocks: Block[] = [
  {
    id: '1',
    blockId: 'hero-section',
    params: {},
    order: 0,
  },
];

function SortableBlockItem({
  block,
  isSelected,
  onClick,
  onDelete,
}: {
  block: Block;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:border-primary/50 ${
        isSelected ? 'border-primary' : ''
      }`}
      onClick={onClick}
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex flex-1 items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{block.blockId}</p>
            <p className="text-muted-foreground text-xs">
              Order: {block.order}
            </p>
          </div>
        </div>
        <Button
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          size="icon"
          variant="ghost"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export function BlockEditor({ siteId, pageId }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(mockBlocks);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [blockDefinition, setBlockDefinition] =
    useState<BlockDefinition | null>(null);
  const [blockDefinitions, setBlockDefinitions] = useState<
    Map<string, BlockDefinition>
  >(new Map());
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update order
        newItems.forEach((item, index) => {
          item.order = index;
        });
        return newItems;
      });
    }
  };

  const handleBlockClick = async (block: Block) => {
    setSelectedBlock(block);
    // Check if we already have the definition cached
    if (blockDefinitions.has(block.blockId)) {
      setBlockDefinition(blockDefinitions.get(block.blockId)!);
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const definition = await getBlock(block.blockId as any);
      setBlockDefinition(definition);
      setBlockDefinitions((prev) =>
        new Map(prev).set(block.blockId, definition)
      );
    } catch (error) {
      console.error('Failed to load block:', error);
    }
  };

  const handleAddBlock = (blockId: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      blockId,
      params: {},
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
    // Auto-select the new block
    handleBlockClick(newBlock);
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter((b) => b.id !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
      setBlockDefinition(null);
    }
  };

  const handleBlockUpdate = (
    blockId: string,
    params: Record<string, unknown>
  ) => {
    setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, params } : b)));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock({ ...selectedBlock, params });
    }
  };

  // Load block definitions for preview
  useEffect(() => {
    const loadDefinitions = async () => {
      const definitions = new Map<string, BlockDefinition>();
      for (const block of blocks) {
        if (!blockDefinitions.has(block.blockId)) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const definition = await getBlock(block.blockId as any);
            definitions.set(block.blockId, definition);
          } catch (error) {
            console.error(`Failed to load block ${block.blockId}:`, error);
          }
        }
      }
      if (definitions.size > 0) {
        setBlockDefinitions((prev) => new Map([...prev, ...definitions]));
      }
    };
    loadDefinitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: Block List */}
      <div
        className={`flex flex-col border-border border-r bg-card transition-all ${
          sidebarCollapsed ? 'w-16' : 'w-80'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-border border-b px-4">
          {!sidebarCollapsed && <h2 className="font-semibold">Blocks</h2>}
          <div className="flex items-center gap-2">
            {!sidebarCollapsed && (
              <Button onClick={() => setShowBlockPicker(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            )}
            {sidebarCollapsed && (
              <Button
                onClick={() => setShowBlockPicker(true)}
                size="icon"
                variant="ghost"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              size="icon"
              variant="ghost"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {sidebarCollapsed ? (
            <div className="space-y-2">
              {sortedBlocks.map((block) => {
                const isSelected = selectedBlock?.id === block.id;
                return (
                  <Button
                    className={`h-12 w-12 ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
                    key={block.id}
                    onClick={() => handleBlockClick(block)}
                    size="icon"
                    title={block.blockId}
                    variant={isSelected ? 'default' : 'ghost'}
                  >
                    <Layout className="h-5 w-5" />
                  </Button>
                );
              })}
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <SortableContext
                items={sortedBlocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {sortedBlocks.map((block) => (
                    <SortableBlockItem
                      block={block}
                      isSelected={selectedBlock?.id === block.id}
                      key={block.id}
                      onClick={() => handleBlockClick(block)}
                      onDelete={() => handleDeleteBlock(block.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Center: Preview */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        <div className="flex h-16 items-center justify-between border-border border-b px-6">
          <h2 className="font-semibold">Preview</h2>
          <Button
            onClick={() => {
              setCompactMode(!compactMode);
              if (!compactMode) {
                setSidebarCollapsed(true);
                setSettingsCollapsed(true);
              }
            }}
            size="sm"
            variant="ghost"
          >
            {compactMode ? (
              <>
                <Minimize2 className="mr-2 h-4 w-4" />
                Exit Focus
              </>
            ) : (
              <>
                <Maximize2 className="mr-2 h-4 w-4" />
                Focus Mode
              </>
            )}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            {sortedBlocks.map((block) => {
              const definition = blockDefinitions.get(block.blockId);
              if (!definition) {
                return (
                  <div
                    className="rounded-lg border border-border bg-card p-8"
                    key={block.id}
                  >
                    <p className="text-muted-foreground">
                      Loading block: {block.blockId}...
                    </p>
                  </div>
                );
              }
              const Preview = definition.Preview;
              return (
                <div
                  className="rounded-lg border border-border bg-card"
                  key={block.id}
                >
                  <Preview isEditing params={block.params} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Block Settings */}
      <div
        className={`flex flex-col border-border border-l bg-card transition-all ${
          settingsCollapsed ? 'w-16' : 'w-96'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-border border-b px-4">
          {!settingsCollapsed && <h2 className="font-semibold">Settings</h2>}
          <div className="flex items-center gap-2">
            {selectedBlock && !settingsCollapsed && (
              <Button
                onClick={() => {
                  setSelectedBlock(null);
                  setBlockDefinition(null);
                }}
                size="sm"
                variant="ghost"
              >
                Close
              </Button>
            )}
            <Button
              onClick={() => setSettingsCollapsed(!settingsCollapsed)}
              size="icon"
              variant="ghost"
            >
              {settingsCollapsed ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {settingsCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              {selectedBlock && (
                <Button
                  className="h-12 w-12"
                  onClick={() => setSettingsCollapsed(false)}
                  size="icon"
                  title="Open settings"
                  variant="ghost"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              )}
            </div>
          ) : selectedBlock && blockDefinition ? (
            <blockDefinition.Editor
              onChange={(params) => handleBlockUpdate(selectedBlock.id, params)}
              params={selectedBlock.params}
            />
          ) : (
            <div className="py-12 text-center">
              <Settings className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                Select a block to edit its settings
              </p>
            </div>
          )}
        </div>
      </div>

      <BlockPicker
        onClose={() => setShowBlockPicker(false)}
        onSelect={handleAddBlock}
        open={showBlockPicker}
      />
    </div>
  );
}

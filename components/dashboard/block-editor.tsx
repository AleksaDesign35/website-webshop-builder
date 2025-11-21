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
  Save,
  Settings,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useBlocks, useCreateBlock, useUpdateBlock, useDeleteBlock, useReorderBlocks } from '@/hooks/use-blocks';
import { usePages } from '@/hooks/use-pages';
import { getBlock } from '@/blocks/index';
import type { BlockDefinition } from '@/blocks/types';
import type { PageSettings } from '@/components/dashboard/page-settings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BlockPicker } from './block-picker';
import type { Database } from '@/lib/supabase/types';

type DbBlock = Database['public']['Tables']['blocks']['Row'];

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

// Convert DB block to editor block format
function dbBlockToBlock(dbBlock: DbBlock): Block {
  return {
    id: dbBlock.id,
    blockId: dbBlock.block_id,
    params: (dbBlock.params as Record<string, unknown>) || {},
    order: dbBlock.display_order ?? 0,
  };
}

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
          onClick={(e: React.MouseEvent) => {
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
  const { data: dbBlocks = [], isLoading } = useBlocks(siteId, pageId);
  const { data: pages } = usePages(siteId);
  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();
  const deleteBlock = useDeleteBlock();
  const reorderBlocks = useReorderBlocks();

  const blocks = dbBlocks.map(dbBlockToBlock);
  const page = pages?.find((p) => p.id === pageId);
  const pageSettings = (page?.settings as PageSettings | undefined) || {
    autosaveEnabled: false,
    autosaveInterval: 30,
  };

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
  const [previousSidebarState, setPreviousSidebarState] = useState({ sidebar: false, settings: false });
  
  // Local state for real-time preview updates (not saved to DB until Save is clicked)
  const [localBlocks, setLocalBlocks] = useState<Block[]>(blocks);
  const [pendingChanges, setPendingChanges] = useState<Map<string, Record<string, unknown>>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const blocksRef = useRef<string>('');
  const autosaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && blocks.length > 0) {
      const oldIndex = blocks.findIndex((item) => item.id === active.id);
      const newIndex = blocks.findIndex((item) => item.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      const blockIds = newBlocks.map((b) => b.id);

      try {
        await reorderBlocks.mutateAsync({ siteId, pageId, blockIds });
        toast.success('Blocks reordered successfully');
      } catch (error) {
        console.error('Failed to reorder blocks:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to reorder blocks'
        );
      }
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

  const handleAddBlock = async (blockId: string) => {
    try {
      // Get block definition to extract default params from schema
      const definition = await getBlock(blockId as any);
      const defaultParams = definition.schema
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((definition.schema as any).parse({}) as Record<string, unknown>)
        : ({} as Record<string, unknown>);

      const newDbBlock = await createBlock.mutateAsync({
        siteId,
        pageId,
        page_id: pageId,
        block_id: blockId,
        params: defaultParams,
        display_order: blocks.length,
      });
      const newBlock = dbBlockToBlock(newDbBlock);
      toast.success('Block added successfully');
      // Auto-select the new block
      handleBlockClick(newBlock);
    } catch (error) {
      console.error('Failed to create block:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to add block'
      );
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (confirm('Are you sure you want to delete this block?')) {
      try {
        await deleteBlock.mutateAsync({ siteId, pageId, blockId });
        toast.success('Block deleted successfully');
        if (selectedBlock?.id === blockId) {
          setSelectedBlock(null);
          setBlockDefinition(null);
        }
      } catch (error) {
        console.error('Failed to delete block:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete block'
        );
      }
    }
  };

  // Sync local blocks with database blocks (only when blocks actually change)
  useEffect(() => {
    const blocksString = JSON.stringify(blocks.map(b => ({ id: b.id, blockId: b.blockId, order: b.order, params: b.params })));
    
    if (blocksString !== blocksRef.current) {
      blocksRef.current = blocksString;
      setLocalBlocks(blocks);
    }
  }, [blocks]);

  const handleBlockUpdate = (
    blockId: string,
    params: Record<string, unknown>
  ) => {
    // Check if params actually changed to avoid unnecessary updates
    const currentBlock = localBlocks.find((b) => b.id === blockId);
    if (currentBlock && JSON.stringify(currentBlock.params) === JSON.stringify(params)) {
      return; // No change, skip update
    }

    // Update local state for immediate preview feedback (not saved to DB yet)
    setLocalBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, params } : block
      )
    );
    
    // Store pending changes
    setPendingChanges((prev) => {
      const newMap = new Map(prev);
      newMap.set(blockId, params);
      return newMap;
    });
    
    // Don't update selectedBlock.params here - it will cause infinite loop
    // The Editor component will use localBlocks for params
  };

  const handleSave = async () => {
    if (pendingChanges.size === 0) {
      return; // No changes to save, don't show toast
    }

    setIsSaving(true);
    try {
      // Save all pending changes
      const savePromises = Array.from(pendingChanges.entries()).map(
        async ([blockId, params]) => {
          await updateBlock.mutateAsync({
            siteId,
            pageId,
            blockId,
            updates: { params },
          });
        }
      );

      await Promise.all(savePromises);
      const savedCount = pendingChanges.size;
      setPendingChanges(new Map());
      toast.success(`Saved ${savedCount} block${savedCount > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Failed to save blocks:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save blocks'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Setup autosave interval if enabled
  useEffect(() => {
    // Clear existing interval
    if (autosaveIntervalRef.current) {
      clearInterval(autosaveIntervalRef.current);
      autosaveIntervalRef.current = null;
    }

    // Setup new interval if autosave is enabled
    if (pageSettings.autosaveEnabled && pageSettings.autosaveInterval) {
      autosaveIntervalRef.current = setInterval(async () => {
        // Check if there are pending changes and not currently saving
        if (pendingChanges.size > 0 && !isSaving) {
          setIsSaving(true);
          try {
            // Save all pending changes
            const savePromises = Array.from(pendingChanges.entries()).map(
              async ([blockId, params]) => {
                await updateBlock.mutateAsync({
                  siteId,
                  pageId,
                  blockId,
                  updates: { params },
                });
              }
            );

            await Promise.all(savePromises);
            setPendingChanges(new Map());
            // Don't show toast for autosave to avoid spam
          } catch (error) {
            console.error('Autosave failed:', error);
            // Don't show error toast for autosave failures
          } finally {
            setIsSaving(false);
          }
        }
      }, pageSettings.autosaveInterval * 1000); // Convert seconds to milliseconds
    }

    // Cleanup on unmount or when settings change
    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
        autosaveIntervalRef.current = null;
      }
    };
  }, [pageSettings.autosaveEnabled, pageSettings.autosaveInterval, siteId, pageId, updateBlock, pendingChanges.size, isSaving]);

  // Load block definitions for preview
  useEffect(() => {
    const loadDefinitions = async () => {
      const definitions = new Map<string, BlockDefinition>();
      const blockIds = new Set(localBlocks.map(b => b.blockId));
      
      for (const blockId of blockIds) {
        if (!blockDefinitions.has(blockId)) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const definition = await getBlock(blockId as any);
            definitions.set(blockId, definition);
          } catch (error) {
            console.error(`Failed to load block ${blockId}:`, error);
          }
        }
      }
      if (definitions.size > 0) {
        setBlockDefinitions((prev) => new Map([...prev, ...definitions]));
      }
    };
    loadDefinitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localBlocks.length]);

  const sortedBlocks = [...localBlocks].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: Block List */}
      <div
        className={`flex flex-col border-border border-r bg-card transition-all ${
          compactMode ? 'w-0 border-0' : sidebarCollapsed ? 'w-16' : 'w-80'
        } ${compactMode ? 'overflow-hidden' : ''}`}
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
            {!compactMode && (
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
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">Loading blocks...</p>
            </div>
          ) : sortedBlocks.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Layout className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No blocks yet</p>
              </div>
            </div>
          ) : sidebarCollapsed ? (
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
              if (!compactMode) {
                // Entering focus mode - save current state and hide sidebars
                setPreviousSidebarState({
                  sidebar: sidebarCollapsed,
                  settings: settingsCollapsed,
                });
                setSidebarCollapsed(true);
                setSettingsCollapsed(true);
                setCompactMode(true);
              } else {
                // Exiting focus mode - restore previous state
                setSidebarCollapsed(previousSidebarState.sidebar);
                setSettingsCollapsed(previousSidebarState.settings);
                setCompactMode(false);
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
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading blocks...</p>
            </div>
          ) : sortedBlocks.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Layout className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold text-lg">No blocks yet</h3>
                <p className="mb-4 text-muted-foreground">
                  Add your first block to get started
                </p>
                <Button onClick={() => setShowBlockPicker(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Block
                </Button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Right: Block Settings */}
      <div
        className={`flex flex-col border-border border-l bg-card transition-all ${
          compactMode ? 'w-0 border-0' : settingsCollapsed ? 'w-16' : 'w-96'
        } ${compactMode ? 'overflow-hidden' : ''}`}
      >
        <div className="flex h-16 items-center justify-between border-border border-b px-4">
          {!settingsCollapsed && <h2 className="font-semibold">Settings</h2>}
          <div className="flex items-center gap-2">
            {selectedBlock && !settingsCollapsed && (
              <>
                <Button
                  disabled={isSaving || pendingChanges.size === 0}
                  onClick={handleSave}
                  size="sm"
                  variant="default"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : pendingChanges.size > 0 ? `Save (${pendingChanges.size})` : 'Save'}
                </Button>
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
              </>
            )}
            {!compactMode && (
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
            )}
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
              key={selectedBlock.id}
              onChange={(params) => handleBlockUpdate(selectedBlock.id, params)}
              params={localBlocks.find(b => b.id === selectedBlock.id)?.params || selectedBlock.params}
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

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useBlocks, useCreateBlock, useUpdateBlock, useDeleteBlock, useReorderBlocks } from '@/hooks/use-blocks';
import { usePages } from '@/hooks/use-pages';
import { getBlock } from '@/blocks/index';
import type { BlockDefinition } from '@/blocks/types';
import type { PageSettings } from '@/components/dashboard/page-settings';
import { TopBar } from './top-bar';
import { BlockSidebar } from './block-sidebar';
import { PropertiesPanel } from './properties-panel';
import { ResponsiveCanvas } from './responsive-canvas';
import { BlockWrapper } from '@/components/block-wrapper';
import { ClickableBlockWrapper } from './clickable-block-wrapper';
import { useHistory } from '@/hooks/use-history';
import type { Database } from '@/lib/supabase/types';

type DbBlock = Database['public']['Tables']['blocks']['Row'];
type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface Block {
  id: string;
  blockId: string;
  params: Record<string, unknown>;
  order: number;
}

interface ModernBlockEditorProps {
  siteId: string;
  pageId: string;
  pageName: string;
  pageUrl?: string;
  isPublished?: boolean;
  isPublishing?: boolean;
  onPublish?: () => void;
  onPageSettings?: () => void;
}

function dbBlockToBlock(dbBlock: DbBlock): Block {
  return {
    id: dbBlock.id,
    blockId: dbBlock.block_id,
    params: (dbBlock.params as Record<string, unknown>) || {},
    order: dbBlock.display_order ?? 0,
  };
}

export function ModernBlockEditor({
  siteId,
  pageId,
  pageName,
  pageUrl,
  isPublished = false,
  isPublishing = false,
  onPublish,
  onPageSettings,
}: ModernBlockEditorProps) {
  const { data: dbBlocks = [], isLoading } = useBlocks(siteId, pageId);
  const { data: pages } = usePages(siteId);
  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();
  const deleteBlock = useDeleteBlock();
  const reorderBlocks = useReorderBlocks();

  const blocks = dbBlocks.map(dbBlockToBlock);
  const page = pages?.find((p) => p.id === pageId);
  const pageSettings: PageSettings = (page?.settings as PageSettings | undefined) || {
    containerWidth: 'container',
    backgroundColor: '#ffffff',
    rootFontSize: 16,
    fontFamily: 'system-ui',
    lineHeight: 1.5,
    autosaveEnabled: false,
    autosaveInterval: 30,
  };

  // Device and zoom state
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [zoom, setZoom] = useState(60);

  // Block state
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [blockDefinition, setBlockDefinition] = useState<BlockDefinition | null>(null);
  const [blockDefinitions, setBlockDefinitions] = useState<Map<string, BlockDefinition>>(new Map());
  
  // Local state for real-time preview
  const [localBlocks, setLocalBlocks] = useState<Block[]>(blocks);
  const [pendingChanges, setPendingChanges] = useState<Map<string, Record<string, unknown>>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const blocksRef = useRef<string>('');
  const autosaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // History for undo/redo
  const history = useHistory<Block[]>(blocks, 50);

  // Sync blocks with history
  useEffect(() => {
    const blocksString = JSON.stringify(blocks.map(b => ({ id: b.id, blockId: b.blockId, order: b.order, params: b.params })));
    
    if (blocksString !== blocksRef.current) {
      blocksRef.current = blocksString;
      setLocalBlocks(blocks);
      history.reset(blocks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  // Load block definitions
  useEffect(() => {
    const loadDefinitions = async () => {
      const definitions = new Map<string, BlockDefinition>();
      const blockIds = new Set(localBlocks.map(b => b.blockId));
      
      for (const blockId of blockIds) {
        if (!blockDefinitions.has(blockId)) {
          try {
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

  const handleBlockClick = async (block: Block) => {
    setSelectedBlock(block);
    if (blockDefinitions.has(block.blockId)) {
      setBlockDefinition(blockDefinitions.get(block.blockId)!);
      return;
    }
    try {
      const definition = await getBlock(block.blockId as any);
      setBlockDefinition(definition);
      setBlockDefinitions((prev) => new Map(prev).set(block.blockId, definition));
    } catch (error) {
      console.error('Failed to load block:', error);
    }
  };

  const handleAddBlock = async (blockId: string) => {
    try {
      const definition = await getBlock(blockId as any);
      const defaultParams = definition.schema
        ? ((definition.schema as any).parse({}) as Record<string, unknown>)
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
      
      // Update history
      const newBlocks = [...blocks, newBlock];
      history.updateState(newBlocks);
      setLocalBlocks(newBlocks);
      
      toast.success('Block added successfully');
      handleBlockClick(newBlock);
    } catch (error) {
      console.error('Failed to create block:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add block');
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (confirm('Are you sure you want to delete this block?')) {
      try {
        await deleteBlock.mutateAsync({ siteId, pageId, blockId });
        
        // Update history
        const newBlocks = blocks.filter(b => b.id !== blockId);
        history.updateState(newBlocks);
        setLocalBlocks(newBlocks);
        
        toast.success('Block deleted successfully');
        if (selectedBlock?.id === blockId) {
          setSelectedBlock(null);
          setBlockDefinition(null);
        }
      } catch (error) {
        console.error('Failed to delete block:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to delete block');
      }
    }
  };

  const handleBlockUpdate = (blockId: string, params: Record<string, unknown>) => {
    const currentBlock = localBlocks.find((b) => b.id === blockId);
    if (currentBlock && JSON.stringify(currentBlock.params) === JSON.stringify(params)) {
      return;
    }

    // Update local state
    const newBlocks = localBlocks.map((block) =>
      block.id === blockId ? { ...block, params } : block
    );
    setLocalBlocks(newBlocks);
    history.updateState(newBlocks);
    
    // Store pending changes
    setPendingChanges((prev) => {
      const newMap = new Map(prev);
      newMap.set(blockId, params);
      return newMap;
    });
  };

  const handleSave = async () => {
    if (pendingChanges.size === 0) {
      return;
    }

    setIsSaving(true);
    try {
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
      toast.error(error instanceof Error ? error.message : 'Failed to save blocks');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    history.undo();
    setLocalBlocks(history.state);
  };

  const handleRedo = () => {
    history.redo();
    setLocalBlocks(history.state);
  };

  const handlePreview = () => {
    window.open(`/preview/${siteId}/${pageId}`, '_blank');
  };

  const handleShare = () => {
    // If published, use live route; otherwise use preview (admin only)
    const shareUrl = isPublished
      ? `${window.location.origin}/live/${siteId}/${pageId}`
      : `${window.location.origin}/preview/${siteId}/${pageId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Share link copied to clipboard!');
    }).catch(() => {
      // Fallback: show in prompt
      prompt('Share link:', shareUrl);
    });
  };

  // Debounce timer for reorder
  const reorderDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleReorderBlocks = async (blockIds: string[]) => {
    // Update local state immediately for instant UI feedback
    const newOrderedBlocks = blockIds.map((id, index) => {
      const block = localBlocks.find(b => b.id === id);
      return block ? { ...block, order: index } : null;
    }).filter(Boolean) as Block[];

    setLocalBlocks(newOrderedBlocks);
    history.pushState(newOrderedBlocks);

    // Clear existing debounce timer
    if (reorderDebounceRef.current) {
      clearTimeout(reorderDebounceRef.current);
    }

    // Debounce database update (5 seconds)
    reorderDebounceRef.current = setTimeout(async () => {
      try {
        await reorderBlocks.mutateAsync({ siteId, pageId, blockIds });
        // Silent success - no toast to avoid spam
      } catch (error) {
        console.error('Failed to reorder blocks:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to save block order');
      }
    }, 5000);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (reorderDebounceRef.current) {
        clearTimeout(reorderDebounceRef.current);
      }
    };
  }, []);

  // Setup autosave
  useEffect(() => {
    if (autosaveIntervalRef.current) {
      clearInterval(autosaveIntervalRef.current);
      autosaveIntervalRef.current = null;
    }

    if (pageSettings.autosaveEnabled && pageSettings.autosaveInterval) {
      autosaveIntervalRef.current = setInterval(async () => {
        if (pendingChanges.size > 0 && !isSaving) {
          setIsSaving(true);
          try {
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
          } catch (error) {
            console.error('Autosave failed:', error);
          } finally {
            setIsSaving(false);
          }
        }
      }, pageSettings.autosaveInterval * 1000);
    }

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
        autosaveIntervalRef.current = null;
      }
    };
  }, [pageSettings.autosaveEnabled, pageSettings.autosaveInterval, siteId, pageId, updateBlock, pendingChanges.size, isSaving]);

  const sortedBlocks = [...localBlocks].sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-full flex-col">
      {/* Top Bar */}
      <TopBar
        pageName={pageName}
        pageUrl={pageUrl}
        siteId={siteId}
        onDeviceChange={setDevice}
        onZoomChange={setZoom}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onPreview={handlePreview}
        onPublish={onPublish}
        onShare={handleShare}
        isPublishing={isPublishing}
        isPublished={isPublished}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        initialZoom={zoom}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Blocks */}
            <BlockSidebar
              onSelectBlock={handleAddBlock}
              onReorderBlocks={handleReorderBlocks}
              onBlockClick={(blockId) => {
                const block = sortedBlocks.find(b => b.id === blockId);
                if (block) {
                  handleBlockClick(block);
                }
              }}
              pageName={pageName}
              pageUrl={pageUrl}
              currentBlocks={sortedBlocks.map((block) => {
                const definition = blockDefinitions.get(block.blockId);
                return {
                  id: block.id,
                  blockId: block.blockId,
                  name: definition?.name || block.blockId,
                  previewImage: definition?.previewImage,
                  icon: definition?.icon,
                };
              })}
            />

        {/* Center - Canvas */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ResponsiveCanvas device={device} zoom={zoom}>
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Loading blocks...</p>
              </div>
            ) : sortedBlocks.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="mb-4 text-muted-foreground">No blocks yet</p>
                  <p className="text-muted-foreground text-sm">Add blocks from the sidebar</p>
                </div>
              </div>
            ) : (
              <div
                className="min-h-screen"
                style={{
                  backgroundColor: pageSettings.backgroundColor,
                  fontSize: `${pageSettings.rootFontSize}px`,
                  fontFamily: pageSettings.fontFamily,
                  lineHeight: pageSettings.lineHeight,
                }}
              >
                {sortedBlocks.map((block) => {
                  const definition = blockDefinitions.get(block.blockId);
                  if (!definition) {
                    return (
                      <div
                        className="flex items-center justify-center p-8"
                        key={block.id}
                      >
                        <p className="text-muted-foreground">
                          Loading block: {block.blockId}...
                        </p>
                      </div>
                    );
                  }
                  const blockParams = pendingChanges.get(block.id) || block.params;
                  const Renderer = definition.Renderer;
                  const isSelected = selectedBlock?.id === block.id;
                  
                  return (
                    <ClickableBlockWrapper
                      key={block.id}
                      blockId={block.id}
                      isSelected={isSelected}
                      onClick={() => handleBlockClick(block)}
                    >
                      <BlockWrapper
                        block={definition}
                        blockId={block.id}
                        params={blockParams}
                        pageSettings={pageSettings}
                      >
                        <Renderer blockId={block.id} params={blockParams} />
                      </BlockWrapper>
                    </ClickableBlockWrapper>
                  );
                })}
              </div>
            )}
          </ResponsiveCanvas>
        </div>

        {/* Right Sidebar - Properties */}
        <PropertiesPanel
          title={selectedBlock ? `Edit ${selectedBlock.blockId}` : 'Properties'}
          onClose={() => {
            setSelectedBlock(null);
            setBlockDefinition(null);
          }}
          onSave={handleSave}
          isSaving={isSaving}
          hasChanges={pendingChanges.size > 0}
          changeCount={pendingChanges.size}
        >
          {selectedBlock && blockDefinition ? (
            <blockDefinition.Editor
              key={selectedBlock.id}
              onChange={(params) => handleBlockUpdate(selectedBlock.id, params)}
              params={localBlocks.find(b => b.id === selectedBlock.id)?.params || selectedBlock.params}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Settings className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  Select a block to edit its properties
                </p>
              </div>
            </div>
          )}
        </PropertiesPanel>
      </div>
    </div>
  );
}


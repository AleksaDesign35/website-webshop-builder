import { getBlock } from '@/blocks/index';
import { getBlocks } from '@/lib/supabase/queries';
import { getCurrentUserId } from '@/lib/auth';

interface PreviewPageProps {
  params: Promise<{ siteId: string; pageId: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { siteId, pageId } = await params;

  try {
    // Verify user has access (this will throw if not authenticated or no access)
    await getCurrentUserId();
    
    // Fetch blocks from Supabase
    const dbBlocks = await getBlocks(siteId, pageId);
    
    // Sort by display_order
    const sortedBlocks = [...dbBlocks].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    // Load all block definitions
    const blockRenderers = await Promise.all(
      sortedBlocks.map(async (block) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const definition = await getBlock(block.block_id as any);
          return {
            id: block.id,
            Renderer: definition.Renderer,
            params: (block.params as Record<string, unknown>) || {},
          };
        } catch (error) {
          console.error(`Failed to load block ${block.block_id}:`, error);
          return null;
        }
      })
    );

    return (
      <div className="min-h-screen bg-background">
        {blockRenderers.length === 0 ? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="mb-2 font-semibold text-xl">No blocks yet</h2>
              <p className="text-muted-foreground">
                Add blocks to this page to see the preview
              </p>
            </div>
          </div>
        ) : (
          blockRenderers.map(
            (item) =>
              item && (
                <item.Renderer
                  blockId={item.id}
                  key={item.id}
                  params={item.params}
                />
              )
          )
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-xl">Error loading page</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load page'}
          </p>
        </div>
      </div>
    );
  }
}

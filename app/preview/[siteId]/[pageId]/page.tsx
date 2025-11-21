import { getBlock } from '@/blocks/index';
import { getBlocks, getPageById } from '@/lib/supabase/queries';
import { getCurrentUserId } from '@/lib/auth';
import type { PageSettings } from '@/components/dashboard/page-settings';
import { optimizeInlineStyles } from '@/lib/block-styles';
import { BlockWrapper } from '@/components/block-wrapper';

// Optimize for performance - minimize React hydration
export const dynamic = 'force-dynamic';

interface PreviewPageProps {
  params: Promise<{ siteId: string; pageId: string }>;
}

function getContainerClass(containerWidth: string, maxWidth?: number): string {
  if (maxWidth) {
    return 'mx-auto';
  }
  
  switch (containerWidth) {
    case 'full':
      return 'w-full';
    case 'narrow':
      return 'mx-auto max-w-5xl';
    case 'wide':
      return 'mx-auto max-w-7xl';
    case 'container':
    default:
      return 'mx-auto max-w-6xl';
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { siteId, pageId } = await params;

  try {
    // Verify user has access (this will throw if not authenticated or no access)
    await getCurrentUserId();
    
    // Fetch page and blocks from Supabase
    const page = await getPageById(siteId, pageId);
    const dbBlocks = await getBlocks(siteId, pageId);
    
    // Parse page settings
    const pageSettings: PageSettings = (page?.settings as PageSettings | undefined) || {
      containerWidth: 'container',
      backgroundColor: '#ffffff',
      rootFontSize: 16,
      fontFamily: 'system-ui',
      lineHeight: 1.5,
      autosaveEnabled: false,
      autosaveInterval: 30,
    };
    
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
            definition,
            params: (block.params as Record<string, unknown>) || {},
          };
        } catch (error) {
          console.error(`Failed to load block ${block.block_id}:`, error);
          return null;
        }
      })
    );

    const containerClass = getContainerClass(
      pageSettings.containerWidth,
      pageSettings.maxWidth
    );

    // Optimize inline styles for clean HTML output
    const pageStyles = optimizeInlineStyles({
      backgroundColor: pageSettings.backgroundColor,
      fontSize: pageSettings.rootFontSize,
      fontFamily: pageSettings.fontFamily,
      lineHeight: pageSettings.lineHeight,
    });

    const containerStyles = pageSettings.maxWidth
      ? optimizeInlineStyles({ maxWidth: pageSettings.maxWidth })
      : undefined;

    // Render with suppressHydrationWarning to minimize React hydration overhead
    return (
      <div className="min-h-screen" style={pageStyles} suppressHydrationWarning>
        {blockRenderers.length === 0 ? (
          <div className="flex min-h-screen items-center justify-center" suppressHydrationWarning>
            <div className="text-center" suppressHydrationWarning>
              <h2 className="mb-2 font-semibold text-xl" suppressHydrationWarning>No blocks yet</h2>
              <p className="text-muted-foreground" suppressHydrationWarning>
                Add blocks to this page to see the preview
              </p>
            </div>
          </div>
        ) : (
          <>
            {blockRenderers.map(
              (item) =>
                item && (
                  <BlockWrapper
                    key={item.id}
                    block={item.definition}
                    blockId={item.id}
                    params={item.params}
                    pageSettings={pageSettings}
                  >
                    <item.definition.Renderer
                      blockId={item.id}
                      params={item.params}
                    />
                  </BlockWrapper>
                )
            )}
          </>
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

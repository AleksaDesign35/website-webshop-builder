import { getBlock } from '@/blocks/index';
import { getBlocksPublic, getPageByIdPublic, getSiteByIdPublic } from '@/lib/supabase/queries';
import type { PageSettings } from '@/components/dashboard/page-settings';
import type { SiteThemeSettings } from '@/components/dashboard/site-settings';
import { optimizeInlineStyles } from '@/lib/block-styles';
import { BlockWrapper } from '@/components/block-wrapper';
import { Header1, Header2, Footer1, Footer2 } from '@/components/site';

// Optimize for performance - minimize React hydration
export const dynamic = 'force-dynamic';

interface LivePageProps {
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

export default async function LivePage({ params }: LivePageProps) {
  const { siteId, pageId } = await params;

  try {
    // Fetch site, page and blocks from Supabase (public access - no auth required)
    const site = await getSiteByIdPublic(siteId);
    const page = await getPageByIdPublic(siteId, pageId);
    
    // Only show published pages on live route
    if (!page.is_active) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 font-semibold text-xl">Page not published</h2>
            <p className="text-muted-foreground">
              This page is not yet published and cannot be viewed publicly.
            </p>
          </div>
        </div>
      );
    }
    
    const dbBlocks = await getBlocksPublic(siteId, pageId);
    
    // Parse site theme settings
    const siteTheme: SiteThemeSettings = (site?.theme_settings as SiteThemeSettings | undefined) || {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      fontFamily: 'system-ui',
      headerType: '1',
      footerType: '1',
    };

    // Parse page settings
    const pageSettings: PageSettings = (page?.settings as PageSettings | undefined) || {
      containerWidth: 'container',
      backgroundColor: siteTheme.backgroundColor,
      rootFontSize: 16,
      fontFamily: siteTheme.fontFamily,
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

    // Render header based on site theme
    const HeaderComponent = siteTheme.headerType === '1' ? Header1 : Header2;
    const FooterComponent = siteTheme.footerType === '1' ? Footer1 : Footer2;

    // Render with suppressHydrationWarning to minimize React hydration overhead
    return (
      <div className="min-h-screen" style={pageStyles} suppressHydrationWarning>
        <HeaderComponent
          logoUrl={site.logo_url}
          siteName={site.name}
          theme={siteTheme}
        />
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
        <FooterComponent siteName={site.name} theme={siteTheme} />
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


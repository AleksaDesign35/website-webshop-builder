import { getBlock } from '@/blocks/index';
import { getBlocks, getPageById } from '@/lib/supabase/queries';
import { getCurrentUserId } from '@/lib/auth';
import type { PageSettings } from '@/components/dashboard/page-settings';
import { optimizeInlineStyles } from '@/lib/block-styles';
import { BlockWrapper } from '@/components/block-wrapper';

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

// Optimized preview page - renders pure HTML without React hydration
export default async function OptimizedPreviewPage({ params }: PreviewPageProps) {
  const { siteId, pageId } = await params;

  try {
    await getCurrentUserId();
    
    const page = await getPageById(siteId, pageId);
    const dbBlocks = await getBlocks(siteId, pageId);
    
    const pageSettings: PageSettings = (page?.settings as PageSettings | undefined) || {
      containerWidth: 'container',
      backgroundColor: '#ffffff',
      rootFontSize: 16,
      fontFamily: 'system-ui',
      lineHeight: 1.5,
      autosaveEnabled: false,
      autosaveInterval: 30,
    };
    
    const sortedBlocks = [...dbBlocks].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    const blockRenderers = await Promise.all(
      sortedBlocks.map(async (block) => {
        try {
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

    const pageStyles = optimizeInlineStyles({
      backgroundColor: pageSettings.backgroundColor,
      fontSize: pageSettings.rootFontSize,
      fontFamily: pageSettings.fontFamily,
      lineHeight: pageSettings.lineHeight,
    });

    // Render as static HTML string to avoid React hydration
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${page?.name || 'Preview'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body style="${Object.entries(pageStyles).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}">
          ${blockRenderers.length === 0 ? `
            <div style="display: flex; min-height: 100vh; align-items: center; justify-content: center;">
              <div style="text-align: center;">
                <h2 style="margin-bottom: 0.5rem; font-weight: 600; font-size: 1.25rem;">No blocks yet</h2>
                <p style="color: #6b7280;">Add blocks to this page to see the preview</p>
              </div>
            </div>
          ` : blockRenderers.map(item => {
            if (!item) return '';
            // This would need to be server-side rendered to HTML string
            // For now, we'll use the React component but mark it as static
            return '';
          }).join('')}
        </body>
      </html>
    `;

    // Return as plain HTML response
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Error</title>
        </head>
        <body>
          <div style="display: flex; min-height: 100vh; align-items: center; justify-content: center;">
            <div style="text-align: center;">
              <h2 style="margin-bottom: 0.5rem; font-weight: 600; font-size: 1.25rem;">Error loading page</h2>
              <p style="color: #6b7280;">${error instanceof Error ? error.message : 'Failed to load page'}</p>
            </div>
          </div>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }
}



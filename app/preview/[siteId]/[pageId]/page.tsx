import { getBlock } from '@/blocks/index';

interface PreviewPageProps {
  params: Promise<{ siteId: string; pageId: string }>;
}

// TODO: Fetch page and blocks from Supabase
const mockPageBlocks = [
  {
    id: '1',
    blockId: 'hero-section',
    params: {},
    order: 0,
  },
];

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { siteId, pageId } = await params;

  // Load all block definitions
  const blockRenderers = await Promise.all(
    mockPageBlocks.map(async (block) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const definition = await getBlock(block.blockId as any);
        return {
          id: block.id,
          Renderer: definition.Renderer,
          params: block.params,
        };
      } catch (error) {
        console.error(`Failed to load block ${block.blockId}:`, error);
        return null;
      }
    })
  );

  return (
    <div className="min-h-screen bg-background">
      {blockRenderers.map(
        (item) =>
          item && (
            <item.Renderer
              blockId={item.id}
              key={item.id}
              params={item.params}
            />
          )
      )}
    </div>
  );
}

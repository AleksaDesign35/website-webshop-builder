import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { BlockEditor } from '@/components/dashboard/block-editor';
import { Button } from '@/components/ui/button';

interface PageEditorPageProps {
  params: Promise<{ siteId: string; pageId: string }>;
}

export default async function PageEditorPage({ params }: PageEditorPageProps) {
  const { siteId, pageId } = await params;

  // TODO: Fetch page data from Supabase
  const page = {
    id: pageId,
    name: 'Home',
    siteId,
  };

  return (
    <div className="fixed inset-0 flex h-screen flex-col overflow-hidden bg-background">
      <div className="flex h-12 items-center justify-between border-border border-b bg-card px-4">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/sites/${siteId}`}>
            <Button size="icon" variant="ghost">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold text-base">{page.name}</h1>
            <p className="text-muted-foreground text-xs">Page Editor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Preview
          </Button>
          <Button size="sm">Publish</Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <BlockEditor pageId={pageId} siteId={siteId} />
      </div>
    </div>
  );
}

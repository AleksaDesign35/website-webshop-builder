'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePages } from '@/hooks/use-pages';
import { useUpdatePage } from '@/hooks/use-pages';
import { BlockEditor } from '@/components/dashboard/block-editor';
import { Button } from '@/components/ui/button';

interface PageEditorPageProps {
  params: Promise<{ siteId: string; pageId: string }>;
}

export default function PageEditorPage({ params }: PageEditorPageProps) {
  const [siteId, setSiteId] = useState<string>('');
  const [pageId, setPageId] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const updatePage = useUpdatePage();

  useEffect(() => {
    params.then((p) => {
      setSiteId(p.siteId);
      setPageId(p.pageId);
    });
  }, [params]);

  const { data: pages } = usePages(siteId);
  const page = pages?.find((p) => p.id === pageId);

  const handlePublish = async () => {
    if (!siteId || !pageId) return;
    
    setIsPublishing(true);
    try {
      await updatePage.mutateAsync({
        siteId,
        pageId,
        updates: { is_active: !page?.is_active },
      });
      toast.success(
        page?.is_active ? 'Page unpublished successfully' : 'Page published successfully'
      );
    } catch (error) {
      console.error('Failed to publish page:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to publish page'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  if (!siteId || !pageId) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!page) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-xl">Page not found</h2>
          <Link href={`/dashboard/sites/${siteId}`}>
            <Button variant="outline">Go back</Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <Link href={`/preview/${siteId}/${pageId}`} target="_blank">
            <Button size="sm" variant="outline">
              Preview
            </Button>
          </Link>
          <Button
            disabled={isPublishing}
            onClick={handlePublish}
            size="sm"
            variant={page.is_active ? 'outline' : 'default'}
          >
            {isPublishing
              ? 'Publishing...'
              : page.is_active
                ? 'Unpublish'
                : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <BlockEditor pageId={pageId} siteId={siteId} />
      </div>
    </div>
  );
}

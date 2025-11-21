'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePages } from '@/hooks/use-pages';
import { useUpdatePage } from '@/hooks/use-pages';
import { ModernBlockEditor } from '@/components/dashboard/modern-block-editor';
import { PageSettings } from '@/components/dashboard/page-settings';
import type { PageSettings as PageSettingsType } from '@/components/dashboard/page-settings';

interface PageEditorPageProps {
  params: Promise<{ siteId: string; pageId: string }>;
}

export default function PageEditorPage({ params }: PageEditorPageProps) {
  const [siteId, setSiteId] = useState<string>('');
  const [pageId, setPageId] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
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

  const handleSavePageSettings = async (settings: PageSettingsType) => {
    if (!siteId || !pageId) return;
    
    try {
      await updatePage.mutateAsync({
        siteId,
        pageId,
        updates: { settings },
      });
      toast.success('Page settings saved successfully');
      setShowPageSettings(false);
    } catch (error) {
      console.error('Failed to save page settings:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save page settings'
      );
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
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex h-screen flex-col overflow-hidden bg-background">
      <ModernBlockEditor
        pageId={pageId}
        siteId={siteId}
        pageName={page.name}
        pageUrl={`https://${siteId}.example.com`}
        isPublished={page.is_active || false}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        onPageSettings={() => setShowPageSettings(true)}
      />

      <PageSettings
        onClose={() => setShowPageSettings(false)}
        onSave={handleSavePageSettings}
        open={showPageSettings}
        settings={(page?.settings as Record<string, unknown>) || {}}
      />
    </div>
  );
}

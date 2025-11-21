'use client';

import { ArrowLeft, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSites, useUpdateSite } from '@/hooks/use-sites';
import { useCreatePage } from '@/hooks/use-pages';
import { NewPageModal } from '@/components/dashboard/new-page-modal';
import { PageList } from '@/components/dashboard/page-list';
import { SiteSettings } from '@/components/dashboard/site-settings';
import type { SiteThemeSettings } from '@/components/dashboard/site-settings';
import { Button } from '@/components/ui/button';

interface SiteDetailPageProps {
  params: Promise<{ siteId: string }>;
}

export default function SiteDetailPage({ params }: SiteDetailPageProps) {
  const [siteId, setSiteId] = useState<string>('');
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showSiteSettings, setShowSiteSettings] = useState(false);
  const { data: sites } = useSites();
  const createPage = useCreatePage();
  const updateSite = useUpdateSite();

  // Resolve params
  useEffect(() => {
    params.then((p) => setSiteId(p.siteId));
  }, [params]);

  const site = sites?.find((s) => s.id === siteId);

  const handleNewPage = async (data: { name: string; description: string }) => {
    try {
      await createPage.mutateAsync({
        siteId,
        site_id: siteId,
        name: data.name,
        description: data.description || null,
        is_active: false,
        display_order: 0,
      });
      toast.success('Page created successfully!');
    } catch (error) {
      console.error('Failed to create page:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create page'
      );
    }
  };

  const handleSaveSiteSettings = async (settings: SiteThemeSettings) => {
    try {
      await updateSite.mutateAsync({
        siteId,
        updates: {
          theme_settings: settings,
        },
      });
      toast.success('Site settings saved successfully!');
      setShowSiteSettings(false);
    } catch (error) {
      console.error('Failed to save site settings:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save site settings'
      );
    }
  };

  if (!siteId) {
    return <div>Loading...</div>;
  }

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/sites">
          <Button size="icon" variant="ghost">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-3xl">{site.name}</h1>
          <p className="mt-1 text-muted-foreground">{site.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowSiteSettings(true)}
            variant="outline"
          >
            <Settings className="mr-2 h-4 w-4" />
            Site Settings
          </Button>
          <Button onClick={() => setShowNewPageModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </div>
      </div>

      <PageList siteId={siteId} />

      <NewPageModal
        onClose={() => setShowNewPageModal(false)}
        onSubmit={handleNewPage}
        open={showNewPageModal}
      />

      <SiteSettings
        onClose={() => setShowSiteSettings(false)}
        onSave={handleSaveSiteSettings}
        open={showSiteSettings}
        settings={(site.theme_settings as Record<string, unknown>) || null}
      />
    </div>
  );
}

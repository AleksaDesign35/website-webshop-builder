'use client';

import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NewPageModal } from '@/components/dashboard/new-page-modal';
import { PageList } from '@/components/dashboard/page-list';
import { Button } from '@/components/ui/button';

interface SiteDetailPageProps {
  params: Promise<{ siteId: string }>;
}

export default function SiteDetailPage({ params }: SiteDetailPageProps) {
  const [siteId, setSiteId] = useState<string>('');
  const [showNewPageModal, setShowNewPageModal] = useState(false);

  // Resolve params
  useEffect(() => {
    params.then((p) => setSiteId(p.siteId));
  }, [params]);

  // TODO: Fetch site data from Supabase
  const site = {
    id: siteId,
    name: 'My Portfolio',
    description: 'Personal portfolio website',
  };

  const handleNewPage = (data: { name: string; description: string }) => {
    // TODO: Create page in Supabase
    console.log('Creating page:', data);
  };

  if (!siteId) {
    return <div>Loading...</div>;
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
        <Button onClick={() => setShowNewPageModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Page
        </Button>
      </div>

      <PageList siteId={siteId} />

      <NewPageModal
        onClose={() => setShowNewPageModal(false)}
        onSubmit={handleNewPage}
        open={showNewPageModal}
      />
    </div>
  );
}

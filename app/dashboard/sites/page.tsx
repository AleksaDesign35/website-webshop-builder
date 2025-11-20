'use client';

import { Eye, FileText, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSites, useCreateSite } from '@/hooks/use-sites';
import { NewSiteModal } from '@/components/dashboard/new-site-modal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export default function SitesPage() {
  const router = useRouter();
  const [showNewSiteModal, setShowNewSiteModal] = useState(false);
  const { data: sites, isLoading } = useSites();
  const createSite = useCreateSite();

  const handleNewSite = async (data: {
    name: string;
    description: string;
    logo?: string;
  }) => {
    try {
      const newSite = await createSite.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        logo_url: data.logo || undefined,
      });
      router.push(`/dashboard/sites/${newSite.id}`);
    } catch (error) {
      console.error('Failed to create site:', error);
    }
  };

  const handleSiteClick = (siteId: string) => {
    router.push(`/dashboard/sites/${siteId}`);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Sites</h1>
          <p className="mt-2 text-muted-foreground">
            Manage all your websites and online shops
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setShowNewSiteModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Site
          </Button>
          <Button variant="outline">Import Site</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground text-center">Loading sites...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sites?.map((site) => (
            <Card
              key={site.id}
              className="cursor-pointer transition-all hover:border-primary"
              onClick={() => handleSiteClick(site.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {site.name}
                  </CardTitle>
                  <Link
                    href={`/dashboard/sites/${site.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      className="h-8"
                      onClick={(e) => e.stopPropagation()}
                      size="sm"
                      variant="ghost"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </div>
                <CardDescription className="mt-1">
                  Created{' '}
                  {formatDistanceToNow(new Date(site.created_at), {
                    addSuffix: true,
                  })}
                  {site.updated_at &&
                    ` • Updated ${formatDistanceToNow(new Date(site.updated_at), { addSuffix: true })}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {site.description && (
                    <p className="text-muted-foreground text-sm">
                      {site.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card
            className="cursor-pointer border-dashed transition-all hover:border-primary"
            onClick={() => setShowNewSiteModal(true)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <Plus className="h-5 w-5" />
                Create New Site
              </CardTitle>
              <CardDescription>Start building your website</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNewSiteModal(true);
                }}
                variant="outline"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <NewSiteModal
        onClose={() => setShowNewSiteModal(false)}
        onSubmit={handleNewSite}
        open={showNewSiteModal}
      />
    </div>
  );
}

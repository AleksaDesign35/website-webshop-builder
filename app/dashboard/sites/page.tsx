'use client';

import { Eye, FileText, MoreVertical, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NewSiteModal } from '@/components/dashboard/new-site-modal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SitesPage() {
  const router = useRouter();
  const [showNewSiteModal, setShowNewSiteModal] = useState(false);

  const handleNewSite = (data: {
    name: string;
    description: string;
    logo?: string;
  }) => {
    // TODO: Create site in Supabase
    console.log('Creating site:', data);
    // After creation, navigate to the new site
    // router.push(`/dashboard/sites/${newSiteId}`);
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          className="cursor-pointer transition-all hover:border-primary"
          onClick={() => handleSiteClick('1')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Portfolio
              </CardTitle>
              <Link
                href="/dashboard/sites/1"
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
              Created 3 days ago • Last updated 1 hour ago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">5 pages</span>
                <span className="text-muted-foreground">Published</span>
              </div>
              <div className="flex gap-2">
                <Button
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:border-primary"
          onClick={() => handleSiteClick('2')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                E-commerce Store
              </CardTitle>
              <Link
                href="/dashboard/sites/2"
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
              Created 1 week ago • Last updated 2 days ago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">12 pages</span>
                <span className="text-muted-foreground">Draft</span>
              </div>
              <div className="flex gap-2">
                <Button
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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

      <NewSiteModal
        onClose={() => setShowNewSiteModal(false)}
        onSubmit={handleNewSite}
        open={showNewSiteModal}
      />
    </div>
  );
}

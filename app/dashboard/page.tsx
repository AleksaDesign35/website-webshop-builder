'use client';

import { 
  Eye, 
  FileText, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Globe, 
  Layout,
  ArrowRight,
  Clock,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSites, useCreateSite } from '@/hooks/use-sites';
import { useStats } from '@/hooks/use-stats';
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
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [showNewSiteModal, setShowNewSiteModal] = useState(false);
  const { data: sites = [], isLoading: sitesLoading } = useSites();
  const { totalSites, totalPages, publishedPages, isLoading: statsLoading } = useStats();
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
      toast.success('Site created successfully!');
      router.push(`/dashboard/sites/${newSite.id}`);
    } catch (error) {
      console.error('Failed to create site:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create site'
      );
    }
  };

  const handleSiteClick = (siteId: string) => {
    router.push(`/dashboard/sites/${siteId}`);
  };

  const isLoading = sitesLoading || statsLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
                Welcome back! 👋
              </h1>
              <p className="text-muted-foreground text-sm max-w-2xl">
                Manage your sites, create new pages, and build amazing websites with our powerful page builder.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setShowNewSiteModal(true)}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Site
              </Button>
              <Button
                onClick={() => router.push('/dashboard/templates')}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Browse Templates
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 border-border/50 bg-gradient-to-br from-primary/5 via-card to-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Sites
              </CardTitle>
              <div className="rounded-xl bg-primary/10 p-2.5 shadow-sm">
                <Globe className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-3xl mb-1">{totalSites}</div>
              <p className="text-muted-foreground text-xs">
                Active websites
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 bg-gradient-to-br from-primary/5 via-card to-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Pages
              </CardTitle>
              <div className="rounded-xl bg-primary/10 p-2.5 shadow-sm">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-3xl mb-1">{totalPages}</div>
              <p className="text-muted-foreground text-xs">
                All pages created
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 bg-gradient-to-br from-primary/5 via-card to-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Published
              </CardTitle>
              <div className="rounded-xl bg-primary/10 p-2.5 shadow-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-3xl mb-1">{publishedPages}</div>
              <p className="text-muted-foreground text-xs">
                Live pages
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 bg-gradient-to-br from-primary/5 via-card to-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Performance
              </CardTitle>
              <div className="rounded-xl bg-primary/10 p-2.5 shadow-sm">
                <Zap className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-3xl mb-1">100%</div>
              <p className="text-muted-foreground text-xs">
                Uptime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sites Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-semibold text-2xl tracking-tight">Your Sites</h2>
              <p className="text-muted-foreground text-sm mt-1.5">
                Manage and edit your websites
              </p>
            </div>
          </div>

          {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Loading your sites...</p>
            </div>
          </div>
        ) : sites.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">No sites yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Get started by creating your first website. It only takes a few minutes!
              </p>
              <Button 
                onClick={() => setShowNewSiteModal(true)}
                size="lg"
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Your First Site
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <Card
                key={site.id}
                className="group cursor-pointer border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
                onClick={() => handleSiteClick(site.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold leading-tight line-clamp-1 mb-1">
                          {site.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 text-xs">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {formatDistanceToNow(new Date(site.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSiteClick(site.id);
                      }}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                {site.description && (
                  <CardContent className="pt-0 pb-3">
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {site.description}
                    </p>
                  </CardContent>
                )}
                <CardContent className="pt-0">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSiteClick(site.id);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Site
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Create New Site Card */}
            <Card
              className="group cursor-pointer border-dashed border-2 border-border/50 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-lg"
              onClick={() => setShowNewSiteModal(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mb-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-5 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mb-2 text-center text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  Create New Site
                </CardTitle>
                <CardDescription className="text-center text-sm max-w-[200px]">
                  Start building your website
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          )}
        </div>

        {/* Quick Actions */}
        {sites.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <div className="mb-8">
              <h2 className="font-semibold text-2xl tracking-tight">Quick Actions</h2>
              <p className="text-muted-foreground text-sm mt-1.5">
                Get started quickly with these shortcuts
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer border-border/50 transition-all hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Layout className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Browse Blocks</CardTitle>
                  <CardDescription>
                    Explore our library of pre-built blocks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => router.push('/dashboard/blocks')}
                  >
                    View Blocks
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer border-border/50 transition-all hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Templates</CardTitle>
                  <CardDescription>
                    Start from a pre-made template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => router.push('/dashboard/templates')}
                  >
                    Browse Templates
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer border-border/50 transition-all hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Get Started</CardTitle>
                  <CardDescription>
                    Create your first site in minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => setShowNewSiteModal(true)}
                  >
                    New Site
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <NewSiteModal
        onClose={() => setShowNewSiteModal(false)}
        onSubmit={handleNewSite}
        open={showNewSiteModal}
      />
    </div>
  );
}
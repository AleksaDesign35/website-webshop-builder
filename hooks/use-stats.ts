'use client';

import { useQuery } from '@tanstack/react-query';
import { useSites } from './use-sites';

export function useStats() {
  const { data: sites = [], isLoading: sitesLoading } = useSites();

  // Fetch all pages for all sites in a single query
  const { data: allPages = [], isLoading: pagesLoading } = useQuery({
    queryKey: ['all-pages', sites.map((s) => s.id).join(',')],
    queryFn: async () => {
      if (sites.length === 0) return [];
      
      // Fetch pages for all sites in parallel
      const pagePromises = sites.map((site) =>
        fetch(`/api/pages?siteId=${site.id}`, {
          credentials: 'include',
        }).then((res) => res.json())
      );
      
      const pagesArrays = await Promise.all(pagePromises);
      return pagesArrays.flat();
    },
    enabled: sites.length > 0 && !sitesLoading,
  });

  const totalSites = sites.length;
  const totalPages = allPages.length;
  const publishedPages = allPages.filter((page: { is_active: boolean }) => page.is_active).length;

  return {
    totalSites,
    totalPages,
    publishedPages,
    isLoading: sitesLoading || pagesLoading,
  };
}


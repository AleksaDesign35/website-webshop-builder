'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Database } from '@/lib/supabase/types';

type Page = Database['public']['Tables']['pages']['Row'];
type PageInsert = Database['public']['Tables']['pages']['Insert'];
type PageUpdate = Database['public']['Tables']['pages']['Update'];

export function usePages(siteId: string) {
  return useQuery({
    queryKey: ['pages', siteId],
    queryFn: async () => {
      const response = await fetch(`/api/pages?siteId=${siteId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }
      return response.json() as Promise<Page[]>;
    },
    enabled: !!siteId,
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PageInsert & { siteId: string }) => {
      const { siteId, ...pageData } = data;
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ siteId, ...pageData }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create page');
      }
      return response.json() as Promise<Page>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages', variables.siteId] });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      siteId,
      pageId,
      updates,
    }: {
      siteId: string;
      pageId: string;
      updates: PageUpdate;
    }) => {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ siteId, ...updates }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update page');
      }
      return response.json() as Promise<Page>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages', variables.siteId] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      siteId,
      pageId,
    }: {
      siteId: string;
      pageId: string;
    }) => {
      const response = await fetch(`/api/pages/${pageId}?siteId=${siteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete page');
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages', variables.siteId] });
    },
  });
}

export function useReorderPages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      siteId,
      pageIds,
    }: {
      siteId: string;
      pageIds: string[];
    }) => {
      // Update all pages with new display_order
      const updates = pageIds.map((id, index) => ({
        siteId,
        pageId: id,
        updates: { display_order: index },
      }));

      const promises = updates.map(({ pageId, updates: updateData }) =>
        fetch(`/api/pages/${pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ siteId, ...updateData }),
        })
      );

      const responses = await Promise.all(promises);
      const failed = responses.find((r) => !r.ok);
      if (failed) {
        const error = await failed.json();
        throw new Error(error.error || 'Failed to reorder pages');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages', variables.siteId] });
    },
  });
}


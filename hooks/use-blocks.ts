'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Database } from '@/lib/supabase/types';

type Block = Database['public']['Tables']['blocks']['Row'];
type BlockInsert = Database['public']['Tables']['blocks']['Insert'];
type BlockUpdate = Database['public']['Tables']['blocks']['Update'];

export function useBlocks(siteId: string, pageId: string) {
  return useQuery({
    queryKey: ['blocks', siteId, pageId],
    queryFn: async () => {
      const response = await fetch(
        `/api/blocks?siteId=${siteId}&pageId=${pageId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch blocks');
      }
      return response.json() as Promise<Block[]>;
    },
    enabled: !!siteId && !!pageId,
  });
}

export function useCreateBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BlockInsert & { siteId: string; pageId: string }) => {
      const { siteId, pageId, ...blockData } = data;
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, pageId, ...blockData }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create block');
      }
      return response.json() as Promise<Block>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['blocks', variables.siteId, variables.pageId],
      });
    },
  });
}

export function useUpdateBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      siteId,
      pageId,
      blockId,
      updates,
    }: {
      siteId: string;
      pageId: string;
      blockId: string;
      updates: BlockUpdate;
    }) => {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, pageId, ...updates }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update block');
      }
      return response.json() as Promise<Block>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['blocks', variables.siteId, variables.pageId],
      });
    },
  });
}

export function useDeleteBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      siteId,
      pageId,
      blockId,
    }: {
      siteId: string;
      pageId: string;
      blockId: string;
    }) => {
      const response = await fetch(
        `/api/blocks/${blockId}?siteId=${siteId}&pageId=${pageId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete block');
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['blocks', variables.siteId, variables.pageId],
      });
    },
  });
}

export function useReorderBlocks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      siteId,
      pageId,
      blockIds,
    }: {
      siteId: string;
      pageId: string;
      blockIds: string[];
    }) => {
      // Update all blocks with new display_order
      const updates = blockIds.map((id, index) => ({
        siteId,
        pageId,
        blockId: id,
        updates: { display_order: index },
      }));

      const promises = updates.map(
        ({ blockId, updates: updateData }) =>
          fetch(`/api/blocks/${blockId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ siteId, pageId, ...updateData }),
          })
      );

      const responses = await Promise.all(promises);
      const failed = responses.find((r) => !r.ok);
      if (failed) {
        const error = await failed.json();
        throw new Error(error.error || 'Failed to reorder blocks');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['blocks', variables.siteId, variables.pageId],
      });
    },
  });
}


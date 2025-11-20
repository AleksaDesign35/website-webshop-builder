'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Database } from '@/lib/supabase/types';

type Site = Database['public']['Tables']['sites']['Row'];

export function useSites() {
  return useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      // This will be called from client, so we need an API route
      const response = await fetch('/api/sites');
      if (!response.ok) {
        throw new Error('Failed to fetch sites');
      }
      return response.json() as Promise<Site[]>;
    },
  });
}

export function useCreateSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      logo_url?: string;
    }) => {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create site');
      }
      return response.json() as Promise<Site>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
  });
}

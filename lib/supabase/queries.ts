import { createServerClient } from './server';
import type { Database } from './types';

type Tables = Database['public']['Tables'];

// Helper function to get current user ID from Supabase auth
async function getCurrentUserId() {
  const supabase = await createServerClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('User not authenticated');
  }

  return user.id;
}

// Sites queries
export async function getSites() {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch sites: ${error.message}`);
  }

  return data;
}

export async function getSiteById(siteId: string) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch site: ${error.message}`);
  }

  return data;
}

export async function createSite(site: Omit<Tables['sites']['Insert'], 'user_id'>) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('sites')
    .insert({
      ...site,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create site: ${error.message}`);
  }

  return data;
}

export async function updateSite(
  siteId: string,
  updates: Tables['sites']['Update']
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('sites')
    .update(updates)
    .eq('id', siteId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update site: ${error.message}`);
  }

  return data;
}

export async function deleteSite(siteId: string) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', siteId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to delete site: ${error.message}`);
  }
}

// Pages queries
export async function getPages(siteId: string) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  // Verify site belongs to user
  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('user_id', userId)
    .single();

  if (!site) {
    throw new Error('Site not found or access denied');
  }

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('site_id', siteId)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch pages: ${error.message}`);
  }

  return data;
}

export async function getPageById(siteId: string, pageId: string) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  // Verify site belongs to user
  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('user_id', userId)
    .single();

  if (!site) {
    throw new Error('Site not found or access denied');
  }

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .eq('site_id', siteId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch page: ${error.message}`);
  }

  return data;
}

export async function createPage(
  siteId: string,
  page: Omit<Tables['pages']['Insert'], 'site_id'>
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  // Verify site belongs to user
  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('user_id', userId)
    .single();

  if (!site) {
    throw new Error('Site not found or access denied');
  }

  const { data, error } = await supabase
    .from('pages')
    .insert({
      ...page,
      site_id: siteId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create page: ${error.message}`);
  }

  return data;
}

export async function updatePage(
  siteId: string,
  pageId: string,
  updates: Tables['pages']['Update']
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  // Verify site belongs to user
  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('user_id', userId)
    .single();

  if (!site) {
    throw new Error('Site not found or access denied');
  }

  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', pageId)
    .eq('site_id', siteId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update page: ${error.message}`);
  }

  return data;
}

export async function deletePage(siteId: string, pageId: string) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  // Verify site belongs to user
  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('user_id', userId)
    .single();

  if (!site) {
    throw new Error('Site not found or access denied');
  }

  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId)
    .eq('site_id', siteId);

  if (error) {
    throw new Error(`Failed to delete page: ${error.message}`);
  }
}

// Blocks queries
export async function getBlocks(siteId: string, pageId: string) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  // Verify page belongs to user's site
  const { data: page } = await supabase
    .from('pages')
    .select('site_id')
    .eq('id', pageId)
    .single();

  if (!page) {
    throw new Error('Page not found');
  }

  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', page.site_id)
    .eq('user_id', userId)
    .single();

  if (!site) {
    throw new Error('Access denied');
  }

  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('page_id', pageId)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch blocks: ${error.message}`);
  }

  return data;
}

export async function createBlock(
  siteId: string,
  pageId: string,
  block: Omit<Tables['blocks']['Insert'], 'page_id'>
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  // Verify page belongs to user's site
  const { data: page } = await supabase
    .from('pages')
    .select('site_id')
    .eq('id', pageId)
    .single();

  if (!page) {
    throw new Error('Page not found');
  }

  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', page.site_id)
    .eq('user_id', userId)
    .single();

  if (!site) {
    throw new Error('Access denied');
  }

  const { data, error } = await supabase
    .from('blocks')
    .insert({
      ...block,
      page_id: pageId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create block: ${error.message}`);
  }

  return data;
}

export async function updateBlock(
  siteId: string,
  pageId: string,
  blockId: string,
  updates: Tables['blocks']['Update']
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  // Verify block belongs to user's page
  const { data: block } = await supabase
    .from('blocks')
    .select('page_id')
    .eq('id', blockId)
    .single();

  if (!block) {
    throw new Error('Block not found');
  }

  const { data: page } = await supabase
    .from('pages')
    .select('site_id')
    .eq('id', block.page_id)
    .single();

  if (!page) {
    throw new Error('Page not found');
  }

  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', page.site_id)
    .eq('user_id', userId)
    .single();

  if (!site) {
    throw new Error('Access denied');
  }

  const { data, error } = await supabase
    .from('blocks')
    .update(updates)
    .eq('id', blockId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update block: ${error.message}`);
  }

  return data;
}

export async function deleteBlock(
  siteId: string,
  pageId: string,
  blockId: string
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId();

  // Verify block belongs to user's page
  const { data: block } = await supabase
    .from('blocks')
    .select('page_id')
    .eq('id', blockId)
    .single();

  if (!block) {
    throw new Error('Block not found');
  }

  const { data: page } = await supabase
    .from('pages')
    .select('site_id')
    .eq('id', block.page_id)
    .single();

  if (!page) {
    throw new Error('Page not found');
  }

  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', page.site_id)
    .eq('user_id', userId)
    .single();

  if (!site) {
    throw new Error('Access denied');
  }

  const { error } = await supabase.from('blocks').delete().eq('id', blockId);

  if (error) {
    throw new Error(`Failed to delete block: ${error.message}`);
  }
}

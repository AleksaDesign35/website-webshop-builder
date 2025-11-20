import { createServerClient, createAdminClient } from './server';
import type { Database } from './types';

type Tables = Database['public']['Tables'];

// Helper function to get current user ID from Clerk
async function getCurrentUserId(clerkUserId: string) {
  const supabase = await createServerClient();
  const adminSupabase = createAdminClient();

  // First, try to find existing user
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (existingUser) {
    return existingUser.id;
  }

  // If user doesn't exist, create them using admin client (bypasses RLS)
  const { data: newUser, error } = await adminSupabase
    .from('users')
    .insert({
      clerk_user_id: clerkUserId,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return newUser.id;
}

// Sites queries
export async function getSites(clerkUserId: string) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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

export async function getSiteById(clerkUserId: string, siteId: string) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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

export async function createSite(
  clerkUserId: string,
  site: Tables['sites']['Insert']
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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
  clerkUserId: string,
  siteId: string,
  updates: Tables['sites']['Update']
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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

export async function deleteSite(clerkUserId: string, siteId: string) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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
export async function getPages(clerkUserId: string, siteId: string) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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

export async function getPageById(
  clerkUserId: string,
  siteId: string,
  pageId: string
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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
  clerkUserId: string,
  siteId: string,
  page: Tables['pages']['Insert']
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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
  clerkUserId: string,
  siteId: string,
  pageId: string,
  updates: Tables['pages']['Update']
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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

export async function deletePage(
  clerkUserId: string,
  siteId: string,
  pageId: string
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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
export async function getBlocks(
  clerkUserId: string,
  siteId: string,
  pageId: string
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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
  clerkUserId: string,
  siteId: string,
  pageId: string,
  block: Tables['blocks']['Insert']
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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
  clerkUserId: string,
  siteId: string,
  pageId: string,
  blockId: string,
  updates: Tables['blocks']['Update']
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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
  clerkUserId: string,
  siteId: string,
  pageId: string,
  blockId: string
) {
  const supabase = await createServerClient();
  const userId = await getCurrentUserId(clerkUserId);

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

import { createServerClient } from './supabase/server';

/**
 * Get the current user's ID from Supabase auth
 * Use this in Server Components and Server Actions
 */
export async function getCurrentUserId() {
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

/**
 * Get the current user's ID from Supabase auth (nullable)
 * Use this when you want to handle unauthenticated users gracefully
 */
export async function getCurrentUserIdOrNull() {
  const supabase = await createServerClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

/**
 * Get the current user object from Supabase auth
 */
export async function getCurrentUser() {
  const supabase = await createServerClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('User not authenticated');
  }

  return user;
}

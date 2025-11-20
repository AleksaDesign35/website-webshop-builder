import { auth } from '@clerk/nextjs/server';

/**
 * Get the current user's Clerk ID
 * Use this in Server Components and Server Actions
 */
export async function getCurrentUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  return userId;
}

/**
 * Get the current user's Clerk ID (nullable)
 * Use this when you want to handle unauthenticated users gracefully
 */
export async function getCurrentUserIdOrNull() {
  const { userId } = await auth();
  return userId;
}

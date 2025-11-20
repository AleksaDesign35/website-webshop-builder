// TEMPORARY: Clerk authentication disabled for development
// TODO: Re-enable Clerk authentication when ready
/*
import { auth } from '@clerk/nextjs/server';
*/

/**
 * TEMPORARY: Fixed mock user ID for development
 * This ensures all operations use the same user ID
 * TODO: Remove when Clerk authentication is re-enabled
 */
const MOCK_CLERK_USER_ID = 'dev-user-temporary';

/**
 * Get the current user's Clerk ID
 * Use this in Server Components and Server Actions
 * 
 * TEMPORARY: Returns a fixed mock user ID for development
 * TODO: Re-enable Clerk authentication when ready
 */
export async function getCurrentUserId() {
  // TEMPORARY: Return fixed mock user ID for development
  // This will be replaced with actual Clerk authentication later
  /*
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return userId;
  */
  
  return MOCK_CLERK_USER_ID;
}

/**
 * Get the current user's Clerk ID (nullable)
 * Use this when you want to handle unauthenticated users gracefully
 * 
 * TEMPORARY: Returns a fixed mock user ID for development
 */
export async function getCurrentUserIdOrNull() {
  // TEMPORARY: Return fixed mock user ID for development
  /*
  const { userId } = await auth();
  return userId;
  */
  
  return MOCK_CLERK_USER_ID;
}

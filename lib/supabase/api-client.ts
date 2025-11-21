import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Create a Supabase client for API routes
 * This properly handles cookies from the request and ensures session is available
 */
export async function createApiClient(
  request: NextRequest,
  response: NextResponse
) {
  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // Get all cookies from request
        const cookies = request.cookies.getAll();
        // Log for debugging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          const authCookies = cookies.filter(c => 
            c.name.includes('auth') || c.name.includes('supabase')
          );
          if (authCookies.length > 0) {
            console.log('Found auth cookies:', authCookies.map(c => c.name));
          } else {
            console.warn('⚠️  No auth cookies found in request!');
          }
        }
        return cookies;
      },
      setAll(cookiesToSet) {
        // Update request cookies (for subsequent operations in same request)
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        // CRITICAL: Update response cookies - this ensures session is preserved
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...options,
            // Ensure cookies are accessible
            httpOnly: options?.httpOnly ?? true,
            secure: options?.secure ?? process.env.NODE_ENV === 'production',
            sameSite: options?.sameSite ?? 'lax',
            path: options?.path ?? '/',
          });
        });
      },
    },
  });

  return client;
}


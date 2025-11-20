import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { createSite, getSites } from '@/lib/supabase/queries';

export async function GET() {
  try {
    await getCurrentUserId(); // Verify authentication
    const sites = await getSites();
    return NextResponse.json(sites);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch sites',
      },
      { status: error instanceof Error && error.message === 'User not authenticated' ? 401 : 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await getCurrentUserId(); // Verify authentication
    const body = await request.json();
    const site = await createSite(body);
    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create site',
      },
      { status: error instanceof Error && error.message === 'User not authenticated' ? 401 : 500 }
    );
  }
}

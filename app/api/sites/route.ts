import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { createSite, getSites } from '@/lib/supabase/queries';

export async function GET() {
  try {
    const clerkUserId = await getCurrentUserId();
    const sites = await getSites(clerkUserId);
    return NextResponse.json(sites);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch sites',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const clerkUserId = await getCurrentUserId();
    const body = await request.json();
    const site = await createSite(clerkUserId, body);
    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create site',
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { deleteSite, getSiteById, updateSite } from '@/lib/supabase/queries';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    await getCurrentUserId(); // Verify authentication
    const { siteId } = await params;
    const site = await getSiteById(siteId);
    return NextResponse.json(site);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch site',
      },
      { status: error instanceof Error && error.message === 'User not authenticated' ? 401 : 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    await getCurrentUserId(); // Verify authentication
    const { siteId } = await params;
    const body = await request.json();
    const site = await updateSite(siteId, body);
    return NextResponse.json(site);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to update site',
      },
      { status: error instanceof Error && error.message === 'User not authenticated' ? 401 : 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    await getCurrentUserId(); // Verify authentication
    const { siteId } = await params;
    await deleteSite(siteId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to delete site',
      },
      { status: error instanceof Error && error.message === 'User not authenticated' ? 401 : 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { updatePage, deletePage } from '@/lib/supabase/queries';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    await getCurrentUserId(); // Verify authentication
    const body = await request.json();
    const { siteId, ...updates } = body;

    if (!siteId) {
      return NextResponse.json(
        { error: 'siteId is required' },
        { status: 400 }
      );
    }

    const page = await updatePage(siteId, pageId, updates);
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to update page',
      },
      { status: error instanceof Error && error.message === 'User not authenticated' ? 401 : 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    await getCurrentUserId(); // Verify authentication
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { error: 'siteId is required' },
        { status: 400 }
      );
    }

    await deletePage(siteId, pageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to delete page',
      },
      { status: error instanceof Error && error.message === 'User not authenticated' ? 401 : 500 }
    );
  }
}


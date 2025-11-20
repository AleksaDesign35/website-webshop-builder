import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { updateBlock, deleteBlock } from '@/lib/supabase/queries';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ blockId: string }> }
) {
  try {
    const { blockId } = await params;
    const clerkUserId = await getCurrentUserId();
    const body = await request.json();
    const { siteId, pageId, ...updates } = body;

    if (!siteId || !pageId) {
      return NextResponse.json(
        { error: 'siteId and pageId are required' },
        { status: 400 }
      );
    }

    const block = await updateBlock(clerkUserId, siteId, pageId, blockId, updates);
    return NextResponse.json(block);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to update block',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ blockId: string }> }
) {
  try {
    const { blockId } = await params;
    const clerkUserId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const pageId = searchParams.get('pageId');

    if (!siteId || !pageId) {
      return NextResponse.json(
        { error: 'siteId and pageId are required' },
        { status: 400 }
      );
    }

    await deleteBlock(clerkUserId, siteId, pageId, blockId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to delete block',
      },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { createBlock, getBlocks } from '@/lib/supabase/queries';

export async function GET(request: Request) {
  try {
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

    const blocks = await getBlocks(clerkUserId, siteId, pageId);
    return NextResponse.json(blocks);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch blocks',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const clerkUserId = await getCurrentUserId();
    const body = await request.json();
    const { siteId, pageId, ...blockData } = body;

    if (!siteId || !pageId) {
      return NextResponse.json(
        { error: 'siteId and pageId are required' },
        { status: 400 }
      );
    }

    const block = await createBlock(clerkUserId, siteId, pageId, blockData);
    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create block',
      },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { createPage, getPages } from '@/lib/supabase/queries';

export async function GET(request: Request) {
  try {
    const clerkUserId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { error: 'siteId is required' },
        { status: 400 }
      );
    }

    const pages = await getPages(clerkUserId, siteId);
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch pages',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const clerkUserId = await getCurrentUserId();
    const body = await request.json();
    const { siteId, ...pageData } = body;

    if (!siteId) {
      return NextResponse.json(
        { error: 'siteId is required' },
        { status: 400 }
      );
    }

    const page = await createPage(clerkUserId, siteId, pageData);
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create page',
      },
      { status: 500 }
    );
  }
}


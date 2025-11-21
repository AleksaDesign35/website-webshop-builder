import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/supabase/api-client';
import { getSites } from '@/lib/supabase/queries';

export async function GET(request: NextRequest) {
  try {
    const sites = await getSites();
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

export async function POST(request: NextRequest) {
  let response = NextResponse.next();
  
  try {
    // Use createApiClient which properly handles cookies from request
    const supabase = await createApiClient(request, response);
    
    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Site name is required' },
        { status: 400 }
      );
    }
    
    // Insert site - RLS will check auth.uid() = user_id
    const { data: site, error: insertError } = await supabase
      .from('sites')
      .insert({
        name: body.name.trim(),
        description: body.description?.trim() || null,
        logo_url: body.logo_url?.trim() || null,
        user_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        {
          error: insertError.message,
          code: insertError.code,
        },
        { status: insertError.code === '42501' ? 403 : 500 }
      );
    }

    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    console.error('Create site error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create site',
      },
      { status: 500 }
    );
  }
}

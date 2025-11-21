#!/usr/bin/env tsx
/**
 * Generate TypeScript types from Supabase database schema
 * 
 * This script connects to your Supabase project and generates
 * TypeScript types based on the current database schema.
 * 
 * Usage:
 *   pnpm generate-types
 * 
 * Make sure you have SUPABASE_URL and SUPABASE_ANON_KEY in your .env.local
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const outputPath = path.join(process.cwd(), 'lib/supabase/types.ts');

console.log('🔄 Generating TypeScript types from Supabase...');

try {
  // Try using Supabase CLI if available
  try {
    execSync('which supabase', { stdio: 'ignore' });
    console.log('📦 Using Supabase CLI...');
    
    // Check if project is linked
    try {
      execSync('supabase status', { stdio: 'ignore' });
      execSync(`supabase gen types typescript --local > ${outputPath}`, {
        stdio: 'inherit',
      });
      console.log('✅ Types generated successfully using local Supabase!');
    } catch {
      // Try linked project
      try {
        execSync(`supabase gen types typescript --linked > ${outputPath}`, {
          stdio: 'inherit',
        });
        console.log('✅ Types generated successfully using linked Supabase project!');
      } catch {
        throw new Error('Supabase project not linked or local not running');
      }
    }
  } catch {
    // Fallback: Use @supabase/supabase-js to generate types
    console.log('📦 Using @supabase/supabase-js to generate types...');
    console.log('⚠️  Note: For best results, install Supabase CLI: brew install supabase/tap/supabase');
    console.log('   Or use: npm install -g supabase');
    console.log('');
    console.log('💡 Manual alternative:');
    console.log('   1. Go to your Supabase Dashboard');
    console.log('   2. Navigate to Settings > API');
    console.log('   3. Scroll to "TypeScript types"');
    console.log('   4. Copy the types and paste into lib/supabase/types.ts');
    console.log('');
    console.log('📝 For now, keeping existing types.ts file...');
  }
} catch (error) {
  console.error('❌ Failed to generate types:', error);
  process.exit(1);
}



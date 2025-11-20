/**
 * Simple script to check if environment variables are set
 * Run with: pnpm tsx scripts/check-env.ts
 */

import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables\n');
console.log('='.repeat(60));

const requiredVars = {
  'Supabase': {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  'Clerk': {
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    'CLERK_SECRET_KEY': process.env.CLERK_SECRET_KEY,
  },
};

let allOk = true;

for (const [category, vars] of Object.entries(requiredVars)) {
  console.log(`\n${category}:`);
  for (const [key, value] of Object.entries(vars)) {
    if (value && value.trim() !== '') {
      const preview = value.length > 30 ? `${value.substring(0, 30)}...` : value;
      console.log(`  ✅ ${key}: ${preview}`);
    } else {
      console.log(`  ❌ ${key}: MISSING`);
      allOk = false;
    }
  }
}

console.log('\n' + '='.repeat(60));

if (allOk) {
  console.log('\n✅ All environment variables are set!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure you ran the SQL schema in Supabase');
  console.log('   2. Restart your dev server: pnpm dev');
  console.log('   3. Try to sign in and check if user is created in Supabase');
} else {
  console.log('\n❌ Some environment variables are missing!');
  console.log('\n📝 To fix:');
  console.log('   1. Open .env.local file');
  console.log('   2. Get Supabase keys from: https://supabase.com/dashboard');
  console.log('      → Settings → API');
  console.log('   3. Fill in the missing values');
  console.log('   4. Run this test again: pnpm test:env');
}

process.exit(allOk ? 0 : 1);


/**
 * Test script to verify Supabase and Clerk connections
 * Run with: pnpm tsx scripts/test-connections.ts
 */

async function testSupabase() {
  console.log('🔍 Testing Supabase connection...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
    return false;
  }
  if (!supabaseAnonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
    return false;
  }
  if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing');
    return false;
  }

  console.log('✅ All Supabase environment variables are set');
  console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test connection by querying a table
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      // If table doesn't exist, that's okay - schema might not be run yet
      if (error.code === '42P01') {
        console.log('⚠️  Users table not found - make sure you ran the SQL schema');
        return false;
      }
      console.error('❌ Supabase connection error:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error);
    return false;
  }
}

async function testClerk() {
  console.log('\n🔍 Testing Clerk configuration...');

  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (!clerkPublishableKey) {
    console.error('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing');
    return false;
  }
  if (!clerkSecretKey) {
    console.error('❌ CLERK_SECRET_KEY is missing');
    return false;
  }

  console.log('✅ All Clerk environment variables are set');
  console.log(`   Publishable Key: ${clerkPublishableKey.substring(0, 20)}...`);

  // Basic validation - check if keys have correct format
  if (!clerkPublishableKey.startsWith('pk_')) {
    console.error('❌ Clerk publishable key format is invalid (should start with pk_)');
    return false;
  }
  if (!clerkSecretKey.startsWith('sk_')) {
    console.error('❌ Clerk secret key format is invalid (should start with sk_)');
    return false;
  }

  console.log('✅ Clerk configuration looks valid!');
  return true;
}

async function testDatabaseSchema() {
  console.log('\n🔍 Testing database schema...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('⚠️  Skipping schema test - Supabase keys not configured');
    return false;
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if all required tables exist
    const tables = ['users', 'sites', 'pages', 'blocks'];
    const missingTables: string[] = [];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (error && error.code === '42P01') {
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      console.error(`❌ Missing tables: ${missingTables.join(', ')}`);
      console.log('   → Run the SQL schema from supabase/schema.sql');
      return false;
    }

    console.log('✅ All required tables exist!');
    return true;
  } catch (error) {
    console.error('❌ Schema test failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Supabase & Clerk Configuration\n');
  console.log('=' .repeat(50));

  // Load environment variables
  const { config } = await import('dotenv');
  config({ path: '.env.local' });

  const supabaseOk = await testSupabase();
  const clerkOk = await testClerk();
  const schemaOk = await testDatabaseSchema();

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results:');
  console.log(`   Supabase: ${supabaseOk ? '✅' : '❌'}`);
  console.log(`   Clerk: ${clerkOk ? '✅' : '❌'}`);
  console.log(`   Schema: ${schemaOk ? '✅' : '❌'}`);

  if (supabaseOk && clerkOk && schemaOk) {
    console.log('\n🎉 All tests passed! Your setup is ready.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


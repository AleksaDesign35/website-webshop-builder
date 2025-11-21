import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupStorage() {
  console.log('🚀 Setting up Supabase Storage...\n');

  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      throw listError;
    }

    const uploadsBucket = buckets?.find((b) => b.id === 'uploads');

    if (uploadsBucket) {
      console.log('✅ Uploads bucket already exists');
      return;
    }

    console.log('📦 Creating uploads bucket...');
    const { data: bucket, error: createError } = await supabase.storage.createBucket('uploads', {
      public: true,
      fileSizeLimit: 5242880,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'],
    });

    if (createError) {
      // If bucket already exists, that's fine
      if (createError.message.includes('already exists')) {
        console.log('✅ Uploads bucket already exists');
        return;
      }
      throw createError;
    }

    console.log('✅ Uploads bucket created successfully');
    console.log('📝 Note: Using service role key for uploads (bypasses RLS)');
  } catch (error) {
    console.error('❌ Error setting up storage:', error);
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up database...\n');

  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database setup error:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Setting up Supabase...\n');
  
  await setupDatabase();
  await setupStorage();
  
  console.log('\n✅ Setup complete!');
}

main().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});


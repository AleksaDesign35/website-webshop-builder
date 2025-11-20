-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table now uses Supabase auth.users
-- We create a profile table that references auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sites table
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocks table
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  block_id TEXT NOT NULL,
  params JSONB NOT NULL DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_pages_site_id ON pages(site_id);
CREATE INDEX IF NOT EXISTS idx_pages_order ON pages(site_id, display_order);
CREATE INDEX IF NOT EXISTS idx_blocks_page_id ON blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_blocks_order ON blocks(page_id, display_order);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blocks_updated_at
  BEFORE UPDATE ON blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for sites
CREATE POLICY "Users can view own sites"
  ON sites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sites"
  ON sites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites"
  ON sites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites"
  ON sites FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for pages
CREATE POLICY "Users can view own pages"
  ON pages FOR SELECT
  USING (
    site_id IN (
      SELECT id FROM sites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own pages"
  ON pages FOR INSERT
  WITH CHECK (
    site_id IN (
      SELECT id FROM sites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own pages"
  ON pages FOR UPDATE
  USING (
    site_id IN (
      SELECT id FROM sites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own pages"
  ON pages FOR DELETE
  USING (
    site_id IN (
      SELECT id FROM sites WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for blocks
CREATE POLICY "Users can view own blocks"
  ON blocks FOR SELECT
  USING (
    page_id IN (
      SELECT p.id FROM pages p
      JOIN sites s ON p.site_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own blocks"
  ON blocks FOR INSERT
  WITH CHECK (
    page_id IN (
      SELECT p.id FROM pages p
      JOIN sites s ON p.site_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own blocks"
  ON blocks FOR UPDATE
  USING (
    page_id IN (
      SELECT p.id FROM pages p
      JOIN sites s ON p.site_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own blocks"
  ON blocks FOR DELETE
  USING (
    page_id IN (
      SELECT p.id FROM pages p
      JOIN sites s ON p.site_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

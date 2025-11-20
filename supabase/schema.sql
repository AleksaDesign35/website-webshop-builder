
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  block_id TEXT NOT NULL,
  params JSONB NOT NULL DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_pages_site_id ON pages(site_id);
CREATE INDEX IF NOT EXISTS idx_pages_order ON pages(site_id, display_order);
CREATE INDEX IF NOT EXISTS idx_blocks_page_id ON blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_blocks_order ON blocks(page_id, display_order);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
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

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can read own sites"
  ON sites FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can insert own sites"
  ON sites FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can update own sites"
  ON sites FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can delete own sites"
  ON sites FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can read own pages"
  ON pages FOR SELECT
  USING (
    site_id IN (
      SELECT s.id FROM sites s
      JOIN users u ON s.user_id = u.id
      WHERE u.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can insert own pages"
  ON pages FOR INSERT
  WITH CHECK (
    site_id IN (
      SELECT s.id FROM sites s
      JOIN users u ON s.user_id = u.id
      WHERE u.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can update own pages"
  ON pages FOR UPDATE
  USING (
    site_id IN (
      SELECT s.id FROM sites s
      JOIN users u ON s.user_id = u.id
      WHERE u.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can delete own pages"
  ON pages FOR DELETE
  USING (
    site_id IN (
      SELECT s.id FROM sites s
      JOIN users u ON s.user_id = u.id
      WHERE u.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can read own blocks"
  ON blocks FOR SELECT
  USING (
    page_id IN (
      SELECT p.id FROM pages p
      JOIN sites s ON p.site_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE u.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can insert own blocks"
  ON blocks FOR INSERT
  WITH CHECK (
    page_id IN (
      SELECT p.id FROM pages p
      JOIN sites s ON p.site_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE u.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can update own blocks"
  ON blocks FOR UPDATE
  USING (
    page_id IN (
      SELECT p.id FROM pages p
      JOIN sites s ON p.site_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE u.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can delete own blocks"
  ON blocks FOR DELETE
  USING (
    page_id IN (
      SELECT p.id FROM pages p
      JOIN sites s ON p.site_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE u.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );


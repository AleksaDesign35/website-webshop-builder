-- Add theme_settings column to sites table
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS theme_settings JSONB DEFAULT '{}'::jsonb;

-- Add comment to explain the structure
COMMENT ON COLUMN sites.theme_settings IS 'Site theme configuration including colors, fonts, header type, and footer type';


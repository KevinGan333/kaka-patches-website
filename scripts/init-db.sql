CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT DEFAULT '',
  quantity TEXT DEFAULT '',
  delivery TEXT DEFAULT '',
  patch_type TEXT DEFAULT '',
  patch_size TEXT DEFAULT '',
  backing TEXT DEFAULT '',
  border_option TEXT DEFAULT '',
  message TEXT DEFAULT '',
  artwork_filename TEXT,
  artwork_url TEXT,
  artwork_size INTEGER,
  artwork_type TEXT,
  email_sent BOOLEAN DEFAULT FALSE,
  email_error TEXT,
  status TEXT DEFAULT 'new',
  notes JSONB DEFAULT '[]'::jsonb,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_quote_number ON quote_requests(quote_number);
CREATE INDEX IF NOT EXISTS idx_quote_requests_patch_type ON quote_requests(patch_type);

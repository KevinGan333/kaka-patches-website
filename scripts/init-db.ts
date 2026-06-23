/**
 * Neon Postgres Database Initialization Script
 *
 * Usage: npx tsx scripts/init-db.ts
 *
 * Requires: DATABASE_URL environment variable (same as Vercel production)
 * Copy from Vercel → Settings → Environment Variables → DATABASE_URL
 *
 * Run locally:
 *   set DATABASE_URL=postgres://... (Windows)
 *   npx tsx scripts/init-db.ts
 */

import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set.");
  console.error("   Set it from Vercel → Settings → Environment Variables → DATABASE_URL");
  process.exit(1);
}

async function main() {
  console.log("Connecting to Neon Postgres...");
  const sql = postgres(DATABASE_URL, { max: 1 });

  try {
    console.log("Creating pgcrypto extension...");
    await sql.unsafe("CREATE EXTENSION IF NOT EXISTS pgcrypto");
    console.log("✅ pgcrypto ready");

    console.log("Creating quote_requests table...");
    await sql.unsafe(`
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
      )
    `);
    console.log("✅ quote_requests table created");

    console.log("Creating indexes...");
    await sql.unsafe("CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC)");
    await sql.unsafe("CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status)");
    await sql.unsafe("CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email)");
    await sql.unsafe("CREATE INDEX IF NOT EXISTS idx_quote_requests_quote_number ON quote_requests(quote_number)");
    await sql.unsafe("CREATE INDEX IF NOT EXISTS idx_quote_requests_patch_type ON quote_requests(patch_type)");
    console.log("✅ 5 indexes created");

    // Verify
    const tables = await sql.unsafe(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'quote_requests'
    `);
    if (tables.length > 0) {
      console.log("✅ Verified: quote_requests table exists");
    }

    console.log("\n🎉 Database initialization complete!");
    console.log("   Test: https://www.kakapatches.com/admin/quotes");
    console.log("   Submit: https://www.kakapatches.com/request-a-quote");
  } catch (error: any) {
    console.error("❌ Initialization failed:", error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();

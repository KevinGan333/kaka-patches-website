/**
 * Neon Postgres Database Initialization / Migration Script
 *
 * Usage: npx tsx scripts/init-db.ts
 *
 * Requires: DATABASE_URL environment variable (same as Vercel production)
 * Copy from Vercel → Settings → Environment Variables → DATABASE_URL
 *
 * This script is safe to run multiple times — it uses IF NOT EXISTS / IF NOT FOUND
 * patterns to add new columns on existing tables without breaking data.
 */

import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set.");
  console.error("   Set it from Vercel → Settings → Environment Variables → DATABASE_URL");
  process.exit(1);
}

async function ensureColumn(sql: postgres.Sql, table: string, column: string, definition: string) {
  const check = await sql.unsafe(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = '${table}' AND column_name = '${column}'
  `);
  if (check.length === 0) {
    await sql.unsafe(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    console.log(`  ✅ Added column: ${column}`);
  } else {
    console.log(`  ⏭  Column exists: ${column}`);
  }
}

async function main() {
  console.log("Connecting to Neon Postgres...");
  const sql = postgres(DATABASE_URL!, { max: 1 });

  try {
    console.log("Creating pgcrypto extension...");
    await sql.unsafe("CREATE EXTENSION IF NOT EXISTS pgcrypto");
    console.log("✅ pgcrypto ready");

    console.log("Creating quote_requests table (if not exists)...");
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS quote_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quote_number TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT DEFAULT '',
        quantity TEXT DEFAULT '',
        quantity_per_design TEXT DEFAULT '',
        number_of_designs TEXT DEFAULT '',
        delivery TEXT DEFAULT '',
        product_category TEXT DEFAULT '',
        patch_type TEXT DEFAULT '',
        patch_size TEXT DEFAULT '',
        backing TEXT DEFAULT '',
        border_option TEXT DEFAULT '',
        design_notes TEXT DEFAULT '',
        project_type TEXT DEFAULT '',
        packaging_preference TEXT DEFAULT '',
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
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log("✅ quote_requests table created or already exists");

    // ── Migrations: add new columns to existing tables ──
    console.log("\nRunning migrations for new columns...");
    await ensureColumn(sql, "quote_requests", "quantity_per_design", "TEXT DEFAULT ''");
    await ensureColumn(sql, "quote_requests", "number_of_designs", "TEXT DEFAULT ''");
    await ensureColumn(sql, "quote_requests", "product_category", "TEXT DEFAULT ''");
    await ensureColumn(sql, "quote_requests", "design_notes", "TEXT DEFAULT ''");
    await ensureColumn(sql, "quote_requests", "project_type", "TEXT DEFAULT ''");
    await ensureColumn(sql, "quote_requests", "packaging_preference", "TEXT DEFAULT ''");
    await ensureColumn(sql, "quote_requests", "utm_source", "TEXT");
    await ensureColumn(sql, "quote_requests", "utm_medium", "TEXT");
    await ensureColumn(sql, "quote_requests", "utm_campaign", "TEXT");
    await ensureColumn(sql, "quote_requests", "utm_content", "TEXT");
    await ensureColumn(sql, "quote_requests", "utm_term", "TEXT");
    await ensureColumn(sql, "quote_requests", "first_landing_page", "TEXT");
    await ensureColumn(sql, "quote_requests", "referrer", "TEXT");
    await ensureColumn(sql, "quote_requests", "style_reference", "TEXT DEFAULT ''");
    console.log("✅ Migrations complete");

    console.log("\nCreating indexes...");
    await sql.unsafe("CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC)");
    await sql.unsafe("CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status)");
    await sql.unsafe("CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email)");
    await sql.unsafe("CREATE INDEX IF NOT EXISTS idx_quote_requests_quote_number ON quote_requests(quote_number)");
    await sql.unsafe("CREATE INDEX IF NOT EXISTS idx_quote_requests_product_category ON quote_requests(product_category)");
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
    console.log("   Admin: https://www.kakapatches.com/admin/quotes");
    console.log("   Public: https://www.kakapatches.com/request-a-quote");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Initialization failed:", message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();

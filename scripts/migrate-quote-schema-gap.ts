/**
 * Additive, idempotent migration to close the schema gap between the
 * Production `quote_requests` table and the `feature/product-page-redesign`
 * data layer.
 *
 * SAFETY: every statement is `IF NOT EXISTS`. There is NO DROP, NO rename,
 * NO delete, NO table recreation, and NO historical-data rewrite. All added
 * columns are nullable (or carry a constant DEFAULT ''), so existing rows are
 * untouched and legacy (main-branch) code keeps working.
 *
 * Usage (same as scripts/init-db.ts):
 *   DATABASE_URL="<target>" npx tsx scripts/migrate-quote-schema-gap.ts
 *
 * DO NOT run this against Production until the redesign Preview is approved
 * and a backup/restore point has been confirmed.
 */

import postgres from "postgres";

const TABLE = "quote_requests";

// name -> definition. Definitions mirror scripts/init-db.ts exactly.
const MISSING_COLUMNS: Record<string, string> = {
  quantity_per_design: "TEXT DEFAULT ''",
  number_of_designs: "TEXT DEFAULT ''",
  product_category: "TEXT DEFAULT ''",
  design_notes: "TEXT DEFAULT ''",
  project_type: "TEXT DEFAULT ''",
  packaging_preference: "TEXT DEFAULT ''",
  utm_source: "TEXT",
  utm_medium: "TEXT",
  utm_campaign: "TEXT",
  utm_content: "TEXT",
  utm_term: "TEXT",
  first_landing_page: "TEXT",
  referrer: "TEXT",
  style_reference: "TEXT DEFAULT ''",
};

const MISSING_INDEXES: Record<string, string> = {
  idx_quote_requests_product_category: `CREATE INDEX IF NOT EXISTS idx_quote_requests_product_category ON ${TABLE}(product_category)`,
};

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set.");
  process.exit(1);
}

async function main() {
  const sql = postgres(DATABASE_URL!, { max: 1, connect_timeout: 10 });

  try {
    console.log(`Migrating schema gap on table "${TABLE}"...\n`);

    for (const [column, definition] of Object.entries(MISSING_COLUMNS)) {
      // ADD COLUMN IF NOT EXISTS is a metadata-only operation for constant
      // defaults on PG 11+, so existing rows are not rewritten.
      await sql.unsafe(
        `ALTER TABLE ${TABLE} ADD COLUMN IF NOT EXISTS ${column} ${definition}`
      );
      console.log(`  ✅ ensured column: ${column} (${definition})`);
    }

    console.log("");
    for (const [name, stmt] of Object.entries(MISSING_INDEXES)) {
      await sql.unsafe(stmt);
      console.log(`  ✅ ensured index: ${name}`);
    }

    // Verify
    const columns = (await sql.unsafe(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${TABLE}'`
    )) as unknown as Array<{ column_name: string }>;
    const columnNames = new Set(columns.map((c) => c.column_name));
    const presentColumns = Object.keys(MISSING_COLUMNS).filter((c) => columnNames.has(c));
    console.log(
      `\nVerification: ${presentColumns.length}/${Object.keys(MISSING_COLUMNS).length} columns present`
    );

    const indexes = (await sql.unsafe(
      `SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename = '${TABLE}'`
    )) as unknown as Array<{ indexname: string }>;
    const indexNames = new Set(indexes.map((i) => i.indexname));
    const presentIndexes = Object.keys(MISSING_INDEXES).filter((i) => indexNames.has(i));
    console.log(
      `Verification: ${presentIndexes.length}/${Object.keys(MISSING_INDEXES).length} indexes present`
    );

    console.log("\n🎉 Schema-gap migration complete (additive & idempotent).");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Migration failed:", message);
    process.exit(1);
  } finally {
    await sql.end().catch(() => {});
  }
}

main();

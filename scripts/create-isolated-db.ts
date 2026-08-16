/**
 * Create an isolated non-production database for Preview/Development.
 * Connects to the existing Neon project and creates a new empty database.
 * Does NOT touch production data.
 *
 * Usage: npx tsx scripts/create-isolated-db.ts
 */
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const ISOLATED_DB_NAME = "kaka_preview_iso";

async function main() {
  // Connect to the existing database (neondb)
  const sql = postgres(DATABASE_URL, { max: 1 });

  try {
    console.log("Connected to Neon Postgres...");

    // Check if isolated DB already exists
    const existing = await sql.unsafe(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [ISOLATED_DB_NAME]
    );

    if (existing.length > 0) {
      console.log(`Database "${ISOLATED_DB_NAME}" already exists.`);
    } else {
      await sql.unsafe(`CREATE DATABASE ${ISOLATED_DB_NAME}`);
      console.log(`Created database: ${ISOLATED_DB_NAME}`);
    }

    // Build the new DATABASE_URL by replacing the database name
    const url = new URL(DATABASE_URL);
    url.pathname = `/${ISOLATED_DB_NAME}`;
    const isolatedUrl = url.toString();

    // Test connection
    const sql2 = postgres(isolatedUrl, { max: 1 });
    await sql2.unsafe("SELECT 1");
    console.log("Connection to isolated database: SUCCESS");

    // Verify it's empty
    const tables = await sql2.unsafe(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    console.log(`Tables in isolated DB: ${tables.length} (should be 0)`);

    await sql2.end();

    // Output sanitized connection URL for documentation
    const sanitized = new URL(isolatedUrl);
    sanitized.password = "***";
    console.log(`\nIsolated DATABASE_URL: ${sanitized.toString()}`);

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Error:", msg);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();

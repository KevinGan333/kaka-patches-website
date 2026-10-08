import postgres from 'postgres';
const db = postgres(process.env.DATABASE_URL, { max: 1, connect_timeout: 10 });
try {
  await db.begin(async sql => {
    await sql`SET LOCAL lock_timeout = '5s'`;
    await sql`ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS attribution JSONB`;
  });
  const rows = await db`SELECT column_name FROM information_schema.columns WHERE table_name = 'quote_requests' AND column_name = 'attribution'`;
  if (rows.length !== 1) throw new Error('Attribution column missing');
  console.log('Attribution migration verified. Existing inquiry rows unchanged.');
} finally { await db.end(); }

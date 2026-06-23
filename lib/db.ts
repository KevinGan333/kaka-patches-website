import postgres from "postgres";

let sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (sql) return sql;

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  sql = postgres(dbUrl, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return sql;
}

// For one-off queries
export async function query<T = any>(queryString: string, params?: any[]): Promise<T[]> {
  const db = getDb();
  return db.unsafe(queryString, params) as Promise<T[]>;
}

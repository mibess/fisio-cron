import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error('TURSO_DATABASE_URL environment variable is not defined');
}

if (!authToken) {
  throw new Error('TURSO_AUTH_TOKEN environment variable is not defined');
}

export const client = createClient({
  url,
  authToken,
});

// Initialize DB and create table if not exists (async function since top-level await might not be supported everywhere yet, 
// though Next.js does support it in modules, it's safer to just run this when needed or rely on migrations.
// For simplicity in this migration, we'll create a helper or just execute it once.)

// A helper to ensure table exists, can be called on app start or lazily.
// For now, let's keep it simple and just export the client. Table creation logic should ideally move to a migration script or init function.
// But to match previous behavior (auto-create on import), we can't easily do async operations at module top level in commonjs style without top-level await.
// We will export a function to initialize the DB or just assume the table exists for now, 
// OR we can export a promise that resolves when init is done.
// Given this is a simple app, let's just create the table in a separate init function or check it lazily.
// Actually, let's just run it.
(async () => {
  try {
    await client.execute(`
            CREATE TABLE IF NOT EXISTS cronogramas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
  } catch (e) {
    console.error("Failed to initialize database schema:", e);
  }
})();

export default client;

import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL  is not set as an environment variable');
}

export const pgPool = new Pool({
  connectionString,
  ssl: true,
});

export const db = drizzle(pgPool);

export async function runMigrations() {
  await migrate(pgPool, { migrationsFolder: './migrations' });
}

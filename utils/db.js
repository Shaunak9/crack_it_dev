import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

const connectionString = (typeof process !== 'undefined' && process.env.DRIZZLE_DB_URL) 
  ? process.env.DRIZZLE_DB_URL 
  : "postgresql://dummy_user:dummy_password@ep-dummy-db.us-east-2.aws.neon.tech/dummy_db?sslmode=require";

if (!connectionString) {
  throw new Error("Critical: DB URL fallback failed to assign.");
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

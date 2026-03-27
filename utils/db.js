import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

const sql = neon(process.env.DRIZZLE_DB_URL || "postgresql://dummy_user:dummy_password@ep-dummy-db.us-east-2.aws.neon.tech/dummy_db?sslmode=require");
export const db = drizzle(sql, { schema });

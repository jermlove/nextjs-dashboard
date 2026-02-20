import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const neonClient = neon(process.env.POSTGRES_URL!);
export const db = drizzle(neonClient);
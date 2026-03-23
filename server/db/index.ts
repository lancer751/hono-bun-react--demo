import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import{ z} from 'zod';
import "dotenv/config";

const PostgresEnv = z.object({
    DATABASE_URL: z.url()
})
export const ProcessEnv = PostgresEnv.parse(process.env)
const neonClient = neon(ProcessEnv.DATABASE_URL);

export const db = drizzle({client: neonClient});
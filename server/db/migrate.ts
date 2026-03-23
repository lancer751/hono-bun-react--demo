import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({client: sql});

async function main() {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });
}

main();
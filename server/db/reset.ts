// path to a file with schema you want to reset
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {expenses} from "./schema/expenses";
import { reset } from "drizzle-seed";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await reset(db, expenses);
}

main();

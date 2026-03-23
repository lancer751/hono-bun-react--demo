import { seed } from "drizzle-seed"
import { db } from "."
import { expenses } from "./schema/expenses"


async function main(){
    await seed(db, {expenses})
}
main()
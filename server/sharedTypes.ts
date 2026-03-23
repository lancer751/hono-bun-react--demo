import z from "zod";
import { insertExpensesSchema, selectExpensesSchema } from "./db/schema/expenses";

export const createExpenseSchema = insertExpensesSchema.omit({
    id: true,
    createdAt: true,
    userId: true
})

export type CreateExpense = z.infer<typeof createExpenseSchema>
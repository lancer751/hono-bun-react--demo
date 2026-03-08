import type z from "zod";
import type { expenseSchema } from "../routes/expenses.route";

export type Expense = z.infer<typeof expenseSchema>
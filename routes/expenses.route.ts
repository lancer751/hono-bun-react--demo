import { faker } from "@faker-js/faker";
import { Hono } from "hono";
import { generateFakeExpenses } from "../helpers/randomExpenses";
import type { Expense } from "../types/expense.type";

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: generateFakeExpenses() });
  })
  .post("/", async (c) => {
    const expense: Expense = await c.req.json()

    console.log(expense.title)
  });

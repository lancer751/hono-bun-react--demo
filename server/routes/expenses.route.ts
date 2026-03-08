import { Hono } from "hono";
import { fakeExpenses, generateFakeExpenses } from "../helpers/randomExpenses";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { faker } from "@faker-js/faker";

// validate data structure in runtime to avoid receiving an incorrect structure from client

export const expenseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  amount: z.number()
})

const createPostSchema = expenseSchema.omit({
  id: true
})

export const expensesRoute = new Hono()
  .get("/", (c) => {
    const expenses = generateFakeExpenses();
    return c.json({ expenses });
  })
  .get("/total-spent", async (c) => {
    const total = fakeExpenses.reduce((acc, expense) => expense.amount + acc , 0)
    return c.json({total})
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const data = await c.req.valid("json");

    const expense = createPostSchema.parse(data);
    fakeExpenses.push({ id: faker.string.uuid(), ...expense });
    c.status(201)
    return c.json(expense);
  })
  .get(
    "/:id{[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}}",
    async (c) => {
      const id = c.req.param("id");
      const expense = fakeExpenses.find((exp) => exp.id === id);

      if (!expense) {
        return c.notFound();
      }

      return c.json(expense);
    },
  )
  .delete("/:id{[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}}", async (c) => {
    const id = c.req.param("id")

    const deletedExpense = fakeExpenses.find(exp => exp.id === id)
    if(!deletedExpense) {
      return c.notFound()
    }
    
    return c.json(deletedExpense)
  })

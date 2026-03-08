import { faker } from "@faker-js/faker";
import type { Expense } from "../types/expense.type";

export const fakeExpenses: Expense[] = [];

export function generateFakeExpenses(): Expense[] {
  for (let i = 0; i < 20; i++) {
    const expense = {
      id: faker.string.uuid(),
      title: faker.book.title(),
      amount: Number(faker.finance.amount({ min: 500, max: 20000 })),
    };
    fakeExpenses.push(expense);
  }

  return fakeExpenses;
}

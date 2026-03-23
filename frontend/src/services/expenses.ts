import { api } from "@/lib/api";
import { faker } from "@faker-js/faker";
import type { CreateExpense } from "@server/sharedTypes";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

export async function getUserExpenses() {
  const res = await api.expenses.$get();

  if (!res.ok) {
    throw new Error("Server Error");
  }

  const data = await res.json();
  return data;
}

export type GetExpensesResponse = InferResponseType<typeof api.expenses.$get>;
export type Expense = GetExpensesResponse["expenses"][number];

type MutationContext = {
  optimisticExpense: Expense;
};

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation<
    Expense,
    Error,
    CreateExpense,
    MutationContext
  >({
    mutationKey: ["create-expense"],
    mutationFn: async (value) => {
      const res = await api.expenses.$post({ json: value });
      if (!res.ok) {
        throw new Error("Server Error");
      }
      const newExpense = await res.json();
      return newExpense;
    },
    onMutate: async (variables, _) => {
      // cancel current queries for expenses
      await queryClient.cancelQueries({
        queryKey: ["get-user-expenses"]
      })

      // create an optimistic expense
      const optimisticExpense = {
        id: faker.number.int(),
        title: "title",
        amount: variables.amount,
        date: variables.date,
        userId: "optimistic",
        createdAt: null,
      };

      queryClient.setQueryData(["get-user-expenses"], (old: Expense[]) => {
        if (!old) return old;

        return [...old, optimisticExpense];
      });

      return { optimisticExpense };
    },
    onSuccess: (result, _variables, onMutateResult, _) => {
      // Replace optimistic todo in the todos list with the result
      queryClient.setQueryData(["get-user-expenses"], (old: Expense[]) =>
        old.map((exp) =>
          exp.id === onMutateResult.optimisticExpense.id ? result : exp,
        ),
      );
    },
    onError: (_error, _variables, onMutateResult, _) => {
      if (!onMutateResult) return;
      // Remove optimistic todo from the todos list
      queryClient.setQueryData(["get-user-expenses"], (old: Expense[]) => {
        if (!old) return old;

        return old.filter(
          (exp) => exp.id !== onMutateResult.optimisticExpense.id,
        );
      });
    },
  });
}

export async function deleteExpense({ id }: { id: number }) {
  const res = await api.expenses[":id{[0-9]+}"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error("Server error");
  }
}

// query options for expenses endpoints
export const getUserExpensesQueryOptions = queryOptions({
  queryKey: ["get-user-expenses"],
  queryFn: getUserExpenses,
  staleTime: 1000 * 60 * 5,
});

//
// export const loadingCreateExpenseQueryOptions = queryOptions({});

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

async function getExpenses() {
  await new Promise((res) => setTimeout(res, 3000));
  const response = await api.expenses.$get();
  if (!response.ok) {
    throw new Error("server error");
  }
  const data = await response.json();
  return data;
}

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  if (error) {
    return "An error has ocurred" + error.message;
  }

  return (
    <div className="max-w-3xl m-auto">
      <Table>
        <TableCaption>A list of your expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array(3)
                .fill(null)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium truncate max-w-40">
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                ))
            : data?.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium truncate max-w-40">
                    {expense.id}
                  </TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>${expense.amount}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

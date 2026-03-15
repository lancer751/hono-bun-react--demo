import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute('/_authenticated/')({
  component: IndexPage,
})

async function getTotalSpent() {
  const response = await api.expenses["total-spent"].$get();
  if(!response.ok) {
    throw new Error("server error")
  }
  const data = await response.json();
  return data;
}

function IndexPage() {
  const {isPending, error, data} = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if(error) {
    return "An error has ocurred" + error.message
  }

  return (
    <div className='max-w-md m-auto'>
    <Card>
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total spent you've spent</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? "..." : data.total}</CardContent>
    </Card>
    </div>
  );
}
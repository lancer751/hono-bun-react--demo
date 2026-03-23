import { Button } from "@/components/ui/button";
import type { QueryClient } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

const RootLayout = () => (
  <>
    <NavBar />
    <hr />
    <div className="py-10">
    <Outlet />
      
    </div>
    {/* <TanStackRouterDevtools /> */}
  </>
);

function NavBar() {
  return (
    <div className="p-2 flex gap-6 items-center w-full justify-center">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <Link to="/expenses" className="[&.active]:font-bold">
        Expenses
      </Link>
      <Link to="/create-expense" className="[&.active]:font-bold">
        Create Expense
      </Link>
      <Link to="/profile" className="[&.active]:font-bold">
        Profile
      </Link>
      <Button className="bg-destructive text-white hover:bg-red-800">Logout</Button>
    </div>
  );
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});

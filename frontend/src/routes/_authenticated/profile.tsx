import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { userQueryOptions } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isPending, error, data } = useQuery(userQueryOptions);

  if (error) return "not logged in";
  if (isPending) return "loading";
  console.log("image_url", data.user.picture)
  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <Avatar>
          {data.user.picture && (
            <AvatarImage
              src={data.user.picture}
              alt={data.user.given_name}
              className="grayscale"
            />
          )}
          <AvatarFallback>
            {data.user.given_name[0]}
            {data.user.family_name[0]}
          </AvatarFallback>
        </Avatar>
        <p>
          {data.user.given_name} {data.user.family_name}
        </p>
      </div>
      <Button asChild className="my-4">
        <a href="/api/logout">Logout!</a>
      </Button>
    </div>
  );
}

import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { signOut } from "~/lib/auth-client";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { session } = Route.useRouteContext();
  const navigate = Route.useNavigate();

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">TanStarter</h1>
      <div className="flex items-center gap-2">
        This is an unprotected page:
        <pre className="rounded-md border bg-card p-1 text-card-foreground">
          routes/index.tsx
        </pre>
      </div>

      {session?.user ? (
        <div className="flex flex-col gap-2">
          <p>Welcome back, {session?.user.name}!</p>
          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <div>
            More data:
            <pre>{JSON.stringify(session?.user, null, 2)}</pre>
          </div>

          <Button
            onClick={() =>
              signOut(
                {},
                {
                  onError: (error) => {
                    console.warn(error);
                    toast.error(error.error.message);
                  },
                  onSuccess: async () => {
                    await Route?.router?.invalidate();
                    navigate({
                      to: "/",
                    });
                    toast.success("You have been signed out!");
                  },
                },
              )
            }
            type="button"
            className="w-fit"
            variant="destructive"
            size="lg"
          >
            Sign out
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p>You are not signed in.</p>
          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/auth/signin">Sign in</Link>
          </Button>
        </div>
      )}

      <a
        className="text-muted-foreground underline hover:text-foreground"
        href="https://github.com/dotnize/tanstarter"
        target="_blank"
        rel="noreferrer noopener"
      >
        dotnize/tanstarter
      </a>
    </div>
  );
}

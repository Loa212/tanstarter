import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useSession } from "~/lib/auth-client";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data } = useSession();

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">TanStarter</h1>
      <div className="flex items-center gap-2">
        This is an unprotected page:
        <pre className="rounded-md border bg-card p-1 text-card-foreground">
          routes/index.tsx
        </pre>
      </div>

      {data?.user ? (
        <div className="flex flex-col gap-2">
          <p>Welcome back, {data?.user.name}!</p>
          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <div>
            More data:
            <pre>{JSON.stringify(data?.user, null, 2)}</pre>
          </div>

          <form method="POST" action="/api/auth/logout">
            <Button type="submit" className="w-fit" variant="destructive" size="lg">
              Sign out
            </Button>
          </form>
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

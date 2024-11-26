import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { toast } from "sonner";
import { signOut } from "~/lib/auth-client";

const logoutFn = createServerFn().handler(async () => {
  await signOut(
    {},
    {
      onError: (error) => {
        console.warn(error);
        toast.error(error.error.message);
      },
      onSuccess: () => {
        toast.success("You have been signed out!");
      },
    },
  );

  throw redirect({
    href: "/",
  });
});

export const Route = createFileRoute("/auth/signout")({
  preload: false,
  loader: () => logoutFn(),
});

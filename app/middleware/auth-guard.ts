// import { createMiddleware } from "@tanstack/start";
// import { auth } from "~/server/auth";
// // import { setResponseStatus } from "vinxi/http";
// // import { getAuthSession } from "~/server/auth";

// /**
//  * Middleware to force authentication on a server function, and add the user to the context.
//  */
// export const authMiddleware = createMiddleware().server(async ({ next }) => {
//   const { user } = await auth.api.getSession();

//   if (!user) {
//     setResponseStatus(401);
//     throw new Error("Unauthorized");
//   }

//   return next({ context: { user: null } });
// });
